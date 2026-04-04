"""License validation and activation service."""

from datetime import datetime
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import License, DeviceActivation, LicenseStatus, User
from app.schemas import ValidateRequest, ActivateRequest, DeactivateRequest, LicenseInfo


class LicenseService:
    """Simplified license service without Redis dependency."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_license(self, license_key: str) -> License | None:
        """Get license by key with user relationship loaded."""
        result = await self.session.execute(
            select(License)
            .where(License.license_key == license_key)
            .options(selectinload(License.user))
        )
        return result.scalar_one_or_none()

    async def validate_license(
        self, request: ValidateRequest
    ) -> tuple[bool, LicenseInfo | None, str | None]:
        """Validate a license and device."""
        # Get license
        license = await self.get_license(request.license_key)
        if not license:
            return False, None, "LICENSE_NOT_FOUND"

        # Check license status
        if license.status != LicenseStatus.ACTIVE:
            return False, None, "LICENSE_INACTIVE"

        # Check expiration
        if license.expires_at and license.expires_at < datetime.utcnow():
            return False, None, "LICENSE_EXPIRED"

        # Check device activation
        device = await self._get_device_activation(license.id, request.device_id)
        if not device or not device.is_active:
            return False, None, "DEVICE_NOT_ACTIVATED"

        # Update last validated timestamp
        device.last_validated_at = datetime.utcnow()
        await self.session.commit()

        return True, LicenseInfo(
            status=license.status.value,
            tier=license.tier.value,
            license_key=license.license_key,
            email=license.user.email if license.user else None,
            device_id=request.device_id,
            expires_at=license.expires_at,
            features=license.features or {}
        ), None

    async def activate_device(
        self, request: ActivateRequest
    ) -> tuple[bool, LicenseInfo | None, str | None]:
        """Activate a device for a license."""
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
                    license_key=license.license_key,
                    email=license.user.email if license.user else None,
                    device_id=request.device_id,
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
                    license_key=license.license_key,
                    email=license.user.email if license.user else None,
                    device_id=request.device_id,
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
            license_key=license.license_key,
            email=license.user.email if license.user else None,
            device_id=request.device_id,
            expires_at=license.expires_at,
            features=license.features or {}
        ), None

    async def deactivate_device(
        self, request: DeactivateRequest
    ) -> tuple[bool, str | None]:
        """Deactivate a device from a license."""
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
