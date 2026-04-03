import hashlib
import hmac
import time
from datetime import datetime
from typing import Any

import redis.asyncio as redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models import License, DeviceActivation, LicenseStatus
from app.schemas import ValidateRequest, ActivateRequest, DeactivateRequest, LicenseInfo

settings = get_settings()


class LicenseService:
    def __init__(self, session: AsyncSession, redis_client: redis.Redis):
        self.session = session
        self.redis = redis_client
        self.nonce_ttl = 600  # 10 minutes

    def verify_signature(self, request: ValidateRequest | ActivateRequest | DeactivateRequest) -> bool:
        """Verify HMAC-SHA256 signature from client."""
        message = f"{request.license_key}:{request.device_id}:{request.timestamp}:{request.nonce}"
        expected_signature = hmac.new(
            settings.secret_key.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected_signature, request.signature)

    def verify_timestamp(self, timestamp: int, tolerance: int = 300) -> bool:
        """Check if timestamp is within tolerance (default 5 minutes)."""
        current_time = int(time.time())
        return abs(current_time - timestamp) <= tolerance

    async def check_nonce(self, nonce: str) -> bool:
        """Check and store nonce for replay protection. Returns True if nonce is new."""
        nonce_key = f"nonce:{nonce}"
        result = await self.redis.set(nonce_key, "1", ex=self.nonce_ttl, nx=True)
        return result is not None

    async def get_license(self, license_key: str) -> License | None:
        """Get license by key."""
        result = await self.session.execute(
            select(License).where(License.license_key == license_key)
        )
        return result.scalar_one_or_none()

    async def validate_license(
        self, request: ValidateRequest
    ) -> tuple[bool, LicenseInfo | None, str | None]:
        """Validate a license and device."""
        # Verify signature
        if not self.verify_signature(request):
            return False, None, "Invalid signature"

        # Verify timestamp
        if not self.verify_timestamp(request.timestamp):
            return False, None, "Request expired"

        # Check nonce for replay protection
        if not await self.check_nonce(request.nonce):
            return False, None, "Nonce already used"

        # Get license
        license = await self.get_license(request.license_key)
        if not license:
            return False, None, "License not found"

        # Check license status
        if license.status != LicenseStatus.ACTIVE:
            return False, None, f"License is {license.status.value}"

        # Check expiration
        if license.expires_at and license.expires_at < datetime.utcnow():
            return False, None, "License expired"

        # Check device activation
        device = await self._get_device_activation(license.id, request.device_id)
        if not device or not device.is_active:
            return False, None, "Device not activated"

        # Update last validated timestamp
        device.last_validated_at = datetime.utcnow()
        await self.session.commit()

        return True, LicenseInfo(
            status=license.status.value,
            tier=license.tier.value,
            expires_at=license.expires_at,
            features=license.features or {}
        ), None

    async def activate_device(
        self, request: ActivateRequest
    ) -> tuple[bool, LicenseInfo | None, str | None]:
        """Activate a device for a license."""
        # Verify signature
        if not self.verify_signature(request):
            return False, None, "Invalid signature"

        # Verify timestamp
        if not self.verify_timestamp(request.timestamp):
            return False, None, "Request expired"

        # Check nonce
        if not await self.check_nonce(request.nonce):
            return False, None, "Nonce already used"

        # Get license
        license = await self.get_license(request.license_key)
        if not license:
            return False, None, "License not found"

        # Check license status
        if license.status != LicenseStatus.ACTIVE:
            return False, None, f"License is {license.status.value}"

        # Check expiration
        if license.expires_at and license.expires_at < datetime.utcnow():
            return False, None, "License expired"

        # Check if device already activated
        existing_device = await self._get_device_activation(license.id, request.device_id)
        if existing_device:
            if existing_device.is_active:
                return True, LicenseInfo(
                    status=license.status.value,
                    tier=license.tier.value,
                    expires_at=license.expires_at,
                    features=license.features or {}
                ), None
            else:
                # Reactivate device
                existing_device.is_active = True
                existing_device.activated_at = datetime.utcnow()
                existing_device.device_info = request.device_info
                license.activated_devices += 1
                await self.session.commit()
                return True, LicenseInfo(
                    status=license.status.value,
                    tier=license.tier.value,
                    expires_at=license.expires_at,
                    features=license.features or {}
                ), None

        # Check device limit
        if license.activated_devices >= license.max_devices:
            return False, None, f"Device limit reached ({license.max_devices})"

        # Create new activation
        device = DeviceActivation(
            license_id=license.id,
            device_fingerprint=request.device_id,
            device_info=request.device_info,
            is_active=True
        )
        self.session.add(device)
        license.activated_devices += 1
        await self.session.commit()

        return True, LicenseInfo(
            status=license.status.value,
            tier=license.tier.value,
            expires_at=license.expires_at,
            features=license.features or {}
        ), None

    async def deactivate_device(
        self, request: DeactivateRequest
    ) -> tuple[bool, str | None]:
        """Deactivate a device from a license."""
        # Verify signature
        if not self.verify_signature(request):
            return False, "Invalid signature"

        # Verify timestamp
        if not self.verify_timestamp(request.timestamp):
            return False, "Request expired"

        # Check nonce
        if not await self.check_nonce(request.nonce):
            return False, "Nonce already used"

        # Get license
        license = await self.get_license(request.license_key)
        if not license:
            return False, "License not found"

        # Get device activation
        device = await self._get_device_activation(license.id, request.device_id)
        if not device:
            return False, "Device not found"

        if not device.is_active:
            return True, None  # Already deactivated

        # Deactivate
        device.is_active = False
        license.activated_devices = max(0, license.activated_devices - 1)
        await self.session.commit()

        return True, None

    async def _get_device_activation(
        self, license_id: Any, device_fingerprint: str
    ) -> DeviceActivation | None:
        """Get device activation record."""
        result = await self.session.execute(
            select(DeviceActivation).where(
                DeviceActivation.license_id == license_id,
                DeviceActivation.device_fingerprint == device_fingerprint
            )
        )
        return result.scalar_one_or_none()
