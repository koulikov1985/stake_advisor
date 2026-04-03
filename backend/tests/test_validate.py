import time
import secrets
import pytest
from httpx import AsyncClient

from tests.conftest import generate_signature
from app.models import License, DeviceActivation


class TestValidateEndpoint:
    @pytest.mark.asyncio
    async def test_validate_success(
        self, client: AsyncClient, test_license: License, activated_device: DeviceActivation
    ):
        """Test successful license validation."""
        timestamp = int(time.time())
        nonce = secrets.token_hex(16)
        signature = generate_signature(
            test_license.license_key,
            activated_device.device_fingerprint,
            timestamp,
            nonce
        )

        response = await client.post("/v1/validate", json={
            "license_key": test_license.license_key,
            "device_id": activated_device.device_fingerprint,
            "timestamp": timestamp,
            "nonce": nonce,
            "signature": signature,
        })

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["license"]["status"] == "active"
        assert data["license"]["tier"] == "monthly"

    @pytest.mark.asyncio
    async def test_validate_invalid_signature(
        self, client: AsyncClient, test_license: License, activated_device: DeviceActivation
    ):
        """Test validation with invalid signature."""
        timestamp = int(time.time())
        nonce = secrets.token_hex(16)

        response = await client.post("/v1/validate", json={
            "license_key": test_license.license_key,
            "device_id": activated_device.device_fingerprint,
            "timestamp": timestamp,
            "nonce": nonce,
            "signature": "invalid_signature_" + "0" * 48,
        })

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error"] == "Invalid signature"

    @pytest.mark.asyncio
    async def test_validate_expired_timestamp(
        self, client: AsyncClient, test_license: License, activated_device: DeviceActivation
    ):
        """Test validation with expired timestamp."""
        timestamp = int(time.time()) - 600  # 10 minutes ago
        nonce = secrets.token_hex(16)
        signature = generate_signature(
            test_license.license_key,
            activated_device.device_fingerprint,
            timestamp,
            nonce
        )

        response = await client.post("/v1/validate", json={
            "license_key": test_license.license_key,
            "device_id": activated_device.device_fingerprint,
            "timestamp": timestamp,
            "nonce": nonce,
            "signature": signature,
        })

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error"] == "Request expired"

    @pytest.mark.asyncio
    async def test_validate_invalid_license_key(self, client: AsyncClient):
        """Test validation with non-existent license key."""
        timestamp = int(time.time())
        nonce = secrets.token_hex(16)
        license_key = "SA-0000-0000-0000-0000"
        device_id = "v1:test_device"
        signature = generate_signature(license_key, device_id, timestamp, nonce)

        response = await client.post("/v1/validate", json={
            "license_key": license_key,
            "device_id": device_id,
            "timestamp": timestamp,
            "nonce": nonce,
            "signature": signature,
        })

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error"] == "License not found"


class TestActivateEndpoint:
    @pytest.mark.asyncio
    async def test_activate_success(
        self, client: AsyncClient, test_license: License
    ):
        """Test successful device activation."""
        timestamp = int(time.time())
        nonce = secrets.token_hex(16)
        device_id = "v1:new_device_001"
        signature = generate_signature(
            test_license.license_key,
            device_id,
            timestamp,
            nonce
        )

        response = await client.post("/v1/activate", json={
            "license_key": test_license.license_key,
            "device_id": device_id,
            "device_info": {"os": "Windows", "version": "11"},
            "timestamp": timestamp,
            "nonce": nonce,
            "signature": signature,
        })

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["license"]["status"] == "active"

    @pytest.mark.asyncio
    async def test_activate_device_limit(
        self, client: AsyncClient, test_license: License, activated_device: DeviceActivation, session
    ):
        """Test activation when device limit is reached."""
        # Add another device to reach limit
        device2 = DeviceActivation(
            license_id=test_license.id,
            device_fingerprint="v1:device_002",
            device_info={},
            is_active=True,
        )
        session.add(device2)
        test_license.activated_devices = 2
        await session.commit()

        timestamp = int(time.time())
        nonce = secrets.token_hex(16)
        device_id = "v1:new_device_003"
        signature = generate_signature(
            test_license.license_key,
            device_id,
            timestamp,
            nonce
        )

        response = await client.post("/v1/activate", json={
            "license_key": test_license.license_key,
            "device_id": device_id,
            "device_info": {},
            "timestamp": timestamp,
            "nonce": nonce,
            "signature": signature,
        })

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "Device limit reached" in data["error"]


class TestDeactivateEndpoint:
    @pytest.mark.asyncio
    async def test_deactivate_success(
        self, client: AsyncClient, test_license: License, activated_device: DeviceActivation
    ):
        """Test successful device deactivation."""
        timestamp = int(time.time())
        nonce = secrets.token_hex(16)
        signature = generate_signature(
            test_license.license_key,
            activated_device.device_fingerprint,
            timestamp,
            nonce
        )

        response = await client.post("/v1/deactivate", json={
            "license_key": test_license.license_key,
            "device_id": activated_device.device_fingerprint,
            "timestamp": timestamp,
            "nonce": nonce,
            "signature": signature,
        })

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
