from datetime import datetime
from pydantic import BaseModel, Field
from typing import Any


class ValidateRequest(BaseModel):
    license_key: str = Field(..., pattern=r"^SA-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$")
    device_id: str = Field(..., min_length=1, max_length=255)
    timestamp: int = Field(..., description="Unix timestamp")
    nonce: str = Field(..., min_length=16, max_length=64)
    signature: str = Field(..., min_length=64, max_length=128)


class LicenseInfo(BaseModel):
    status: str
    tier: str
    expires_at: datetime | None = None
    features: dict[str, Any] = {}


class ValidateResponse(BaseModel):
    success: bool
    license: LicenseInfo | None = None
    error: str | None = None


class ActivateRequest(BaseModel):
    license_key: str = Field(..., pattern=r"^SA-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$")
    device_id: str = Field(..., min_length=1, max_length=255)
    device_info: dict[str, Any] = {}
    timestamp: int = Field(..., description="Unix timestamp")
    nonce: str = Field(..., min_length=16, max_length=64)
    signature: str = Field(..., min_length=64, max_length=128)


class ActivateResponse(BaseModel):
    success: bool
    license: LicenseInfo | None = None
    error: str | None = None


class DeactivateRequest(BaseModel):
    license_key: str = Field(..., pattern=r"^SA-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$")
    device_id: str = Field(..., min_length=1, max_length=255)
    timestamp: int = Field(..., description="Unix timestamp")
    nonce: str = Field(..., min_length=16, max_length=64)
    signature: str = Field(..., min_length=64, max_length=128)


class DeactivateResponse(BaseModel):
    success: bool
    error: str | None = None
