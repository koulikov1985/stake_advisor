import os
import uuid
from typing import Optional
from fastapi import Depends, HTTPException, status, Request, Cookie
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import AdminUser, AdminSession
from app.services.admin_service import AdminService
from app.config import get_settings


def is_local_dev() -> bool:
    """Check if running in local development mode."""
    settings = get_settings()
    return settings.debug or os.getenv("DEBUG", "").lower() in ("true", "1", "yes")


class FakeAdminUser:
    """Fake admin user for local development."""
    def __init__(self):
        self.id = uuid.UUID("00000000-0000-0000-0000-000000000001")
        self.email = "admin@local"
        self.name = "Local Admin"
        self.role = "super_admin"
        self.is_active = True

    def can_write(self) -> bool:
        return True

    def is_super_admin(self) -> bool:
        return True


async def get_admin_session(
    request: Request,
    session: AsyncSession = Depends(get_session),
    admin_token: Optional[str] = Cookie(default=None),
) -> AdminSession:
    """Get current admin session from cookie."""
    # Local development bypass
    if is_local_dev():
        return None  # Will be handled by get_current_admin

    if not admin_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    admin_service = AdminService(session)
    admin_session = await admin_service.get_session_by_token(admin_token)

    if not admin_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
        )

    return admin_session


async def get_current_admin(
    request: Request,
    admin_session: Optional[AdminSession] = Depends(get_admin_session),
    session: AsyncSession = Depends(get_session),
) -> AdminUser:
    """Get current admin user from session."""
    # Local development bypass - return fake admin
    if is_local_dev():
        return FakeAdminUser()

    admin_service = AdminService(session)
    admin = await admin_service.get_admin_by_id(admin_session.admin_user_id)

    if not admin or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    return admin


async def require_write_permission(
    admin: AdminUser = Depends(get_current_admin),
) -> AdminUser:
    """Require admin or super_admin role for write operations."""
    if not admin.can_write():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Write access required.",
        )
    return admin


async def require_super_admin(
    admin: AdminUser = Depends(get_current_admin),
) -> AdminUser:
    """Require super_admin role."""
    if not admin.is_super_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Super admin access required.",
        )
    return admin


def get_client_ip(request: Request) -> Optional[str]:
    """Get client IP from request."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None


def get_user_agent(request: Request) -> Optional[str]:
    """Get user agent from request."""
    return request.headers.get("User-Agent")
