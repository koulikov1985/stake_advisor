from datetime import datetime
from pydantic import BaseModel, Field
from typing import Any, Optional


class ValidateRequest(BaseModel):
    license_key: str = Field(..., min_length=1, max_length=50)
    device_id: str = Field(..., min_length=1, max_length=255)
    timestamp: Optional[int] = Field(None, description="Unix timestamp")
    nonce: Optional[str] = Field(None, min_length=16, max_length=64)
    signature: Optional[str] = Field(None, min_length=64, max_length=128)


class LicenseInfo(BaseModel):
    status: str
    tier: str
    license_key: Optional[str] = None
    email: Optional[str] = None
    device_id: Optional[str] = None
    expires_at: datetime | None = None
    features: dict[str, Any] = {}


class ValidateResponse(BaseModel):
    success: bool
    license: LicenseInfo | None = None
    error: str | None = None
    error_code: str | None = None


class ActivateRequest(BaseModel):
    license_key: str = Field(..., min_length=1, max_length=50)
    device_id: str = Field(..., min_length=1, max_length=255)
    device_info: dict[str, Any] = {}
    email: Optional[str] = None
    timestamp: Optional[int] = Field(None, description="Unix timestamp")
    nonce: Optional[str] = Field(None, min_length=16, max_length=64)
    signature: Optional[str] = Field(None, min_length=64, max_length=128)


class ActivateResponse(BaseModel):
    success: bool
    license: LicenseInfo | None = None
    error: str | None = None


class DeactivateRequest(BaseModel):
    license_key: str = Field(..., min_length=1, max_length=50)
    device_id: str = Field(..., min_length=1, max_length=255)
    timestamp: Optional[int] = Field(None, description="Unix timestamp")
    nonce: Optional[str] = Field(None, min_length=16, max_length=64)
    signature: Optional[str] = Field(None, min_length=64, max_length=128)


class DeactivateResponse(BaseModel):
    success: bool
    error: str | None = None
