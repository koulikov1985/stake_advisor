from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


# User schemas
class UserResponse(BaseModel):
    id: UUID
    email: str
    name: Optional[str] = None
    paddle_customer_id: Optional[str] = None
    is_active: bool
    is_affiliate: bool
    affiliate_code: Optional[str] = None
    affiliate_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserDetailResponse(BaseModel):
    id: UUID
    email: str
    name: Optional[str] = None
    paddle_customer_id: Optional[str] = None
    is_active: bool
    is_affiliate: bool
    affiliate_code: Optional[str] = None
    affiliate_status: str
    custom_commission_rate: Optional[int] = None
    referred_by_email: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # Related data
    licenses: list["LicenseInfo"] = []
    subscriptions: list["SubscriptionInfo"] = []
    tags: list["TagInfo"] = []

    class Config:
        from_attributes = True


class LicenseInfo(BaseModel):
    id: UUID
    license_key: str
    tier: str
    status: str
    max_devices: int
    activated_devices: int
    expires_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SubscriptionInfo(BaseModel):
    id: UUID
    paddle_subscription_id: str
    status: str
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TagInfo(BaseModel):
    id: UUID
    name: str
    color: str
    assigned_at: datetime

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    items: list[UserResponse]
    total: int
    page: int
    per_page: int
    pages: int


class UserUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None
    is_affiliate: Optional[bool] = None
    affiliate_status: Optional[str] = Field(default=None, pattern="^(pending|active|suspended|rejected)$")


# Note schemas
class UserNoteCreate(BaseModel):
    content: str = Field(min_length=1, max_length=5000)


class UserNoteResponse(BaseModel):
    id: UUID
    user_id: UUID
    admin_email: str
    content: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserNoteListResponse(BaseModel):
    items: list[UserNoteResponse]
    total: int


# Tag schemas
class UserTagCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    color: str = Field(default="#808080", pattern="^#[0-9A-Fa-f]{6}$")
    description: Optional[str] = Field(default=None, max_length=255)


class UserTagResponse(BaseModel):
    id: UUID
    name: str
    color: str
    description: Optional[str] = None
    created_at: datetime
    usage_count: int = 0

    class Config:
        from_attributes = True


class UserTagListResponse(BaseModel):
    items: list[UserTagResponse]
    total: int


# Activity log schemas
class ActivityLogResponse(BaseModel):
    id: int
    user_id: UUID
    activity_type: str
    description: Optional[str] = None
    ip_address: Optional[str] = None
    metadata: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ActivityLogListResponse(BaseModel):
    items: list[ActivityLogResponse]
    total: int
    page: int
    per_page: int
    pages: int


# Device management
class DeviceInfo(BaseModel):
    id: UUID
    device_fingerprint: str
    device_info: Optional[dict] = None
    is_active: bool
    activated_at: datetime
    last_validated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
