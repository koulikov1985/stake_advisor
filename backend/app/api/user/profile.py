"""User profile and dashboard endpoints."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Header
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import User, License, DeviceActivation
from app.api.user.auth import verify_token

router = APIRouter(tags=["User Profile"])


async def get_current_user(
    authorization: Optional[str] = Header(default=None),
    session: AsyncSession = Depends(get_session),
) -> User:
    """Get current user from JWT token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")
    result = await session.execute(
        select(User).where(User.id == UUID(user_id))
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user


class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str]
    is_active: bool
    email_verified: bool
    is_affiliate: bool
    affiliate_code: Optional[str]
    license_id: Optional[str]
    created_at: str

    class Config:
        from_attributes = True


class LicenseResponse(BaseModel):
    id: str
    license_key: str
    tier: str
    status: str
    max_devices: int
    activated_devices: int
    expires_at: Optional[str]
    created_at: str

    class Config:
        from_attributes = True


class DeviceResponse(BaseModel):
    id: str
    device_name: Optional[str]
    platform: Optional[str]
    activated_at: str

    class Config:
        from_attributes = True


class PaymentResponse(BaseModel):
    id: str
    tier: str
    amount: int
    description: Optional[str]
    created_at: str

    class Config:
        from_attributes = True


@router.get("/me", response_model=UserResponse)
async def get_profile(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get current user profile."""
    # Get user's license
    result = await session.execute(
        select(License).where(License.user_id == user.id).order_by(License.created_at.desc())
    )
    license = result.scalar_one_or_none()

    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        is_active=user.is_active,
        email_verified=user.email_verified,
        is_affiliate=user.is_affiliate,
        affiliate_code=user.affiliate_code,
        license_id=str(license.id) if license else None,
        created_at=user.created_at.isoformat(),
    )


@router.get("/license", response_model=Optional[LicenseResponse])
async def get_license(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get user's active license."""
    result = await session.execute(
        select(License)
        .where(License.user_id == user.id)
        .where(License.status == "active")
        .order_by(License.created_at.desc())
    )
    license = result.scalar_one_or_none()

    if not license:
        return None

    return LicenseResponse(
        id=str(license.id),
        license_key=license.license_key,
        tier=license.tier.value if hasattr(license.tier, 'value') else license.tier,
        status=license.status.value if hasattr(license.status, 'value') else license.status,
        max_devices=license.max_devices,
        activated_devices=license.activated_devices,
        expires_at=license.expires_at.isoformat() if license.expires_at else None,
        created_at=license.created_at.isoformat(),
    )


@router.get("/devices")
async def get_devices(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get user's activated devices."""
    # Get user's license first
    result = await session.execute(
        select(License).where(License.user_id == user.id).order_by(License.created_at.desc())
    )
    license = result.scalar_one_or_none()

    if not license:
        return {"devices": []}

    # Get devices for this license
    result = await session.execute(
        select(DeviceActivation)
        .where(DeviceActivation.license_id == license.id)
        .where(DeviceActivation.is_active == True)
        .order_by(DeviceActivation.activated_at.desc())
    )
    devices = result.scalars().all()

    return {
        "devices": [
            {
                "id": str(d.id),
                "device_name": d.device_info.get("hostname", "Unknown") if d.device_info else "Unknown",
                "platform": d.device_info.get("platform", "Unknown") if d.device_info else "Unknown",
                "activated_at": d.activated_at.isoformat() if d.activated_at else None,
            }
            for d in devices
        ]
    }


@router.delete("/devices/{device_id}")
async def remove_device(
    device_id: UUID,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Remove/deactivate a device."""
    # Get user's license
    result = await session.execute(
        select(License).where(License.user_id == user.id)
    )
    license = result.scalar_one_or_none()

    if not license:
        raise HTTPException(status_code=404, detail="License not found")

    # Get the device
    result = await session.execute(
        select(DeviceActivation)
        .where(DeviceActivation.id == device_id)
        .where(DeviceActivation.license_id == license.id)
    )
    device = result.scalar_one_or_none()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    # Deactivate the device
    device.is_active = False
    license.activated_devices = max(0, license.activated_devices - 1)

    await session.commit()

    return {"message": "Device removed successfully"}


@router.get("/payments")
async def get_payments(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get user's payment history."""
    # For now, return license creation as payment records
    # In production, this would come from Paddle/payment provider
    result = await session.execute(
        select(License)
        .where(License.user_id == user.id)
        .order_by(License.created_at.desc())
    )
    licenses = result.scalars().all()

    # Map tiers to prices (in cents)
    tier_prices = {
        "trial": 0,
        "day": 500,
        "week": 2500,
        "month": 6000,
        "6month": 31500,
        "year": 54900,
    }

    return {
        "payments": [
            {
                "id": str(l.id),
                "tier": l.tier.value if hasattr(l.tier, 'value') else l.tier,
                "amount": tier_prices.get(l.tier.value if hasattr(l.tier, 'value') else l.tier, 0),
                "description": f"{l.tier.value if hasattr(l.tier, 'value') else l.tier} subscription",
                "created_at": l.created_at.isoformat(),
            }
            for l in licenses
        ]
    }
