from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


# Auth schemas
class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class AdminLoginResponse(BaseModel):
    message: str
    admin: "AdminUserResponse"


class AdminUserResponse(BaseModel):
    id: UUID
    email: str
    role: str
    is_active: bool
    last_login_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AdminUserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    role: str = Field(default="admin", pattern="^(super_admin|admin|viewer)$")


class AdminUserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(default=None, min_length=8)
    role: Optional[str] = Field(default=None, pattern="^(super_admin|admin|viewer)$")
    is_active: Optional[bool] = None


# Audit log schemas
class AuditLogResponse(BaseModel):
    id: int
    entity_type: str
    entity_id: str
    action: str
    actor_type: str
    actor_id: Optional[str] = None
    actor_email: Optional[str] = None
    ip_address: Optional[str] = None
    old_values: Optional[dict] = None
    new_values: Optional[dict] = None
    metadata: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AuditLogListResponse(BaseModel):
    items: list[AuditLogResponse]
    total: int
    page: int
    per_page: int
    pages: int
