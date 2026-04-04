from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr

from app.database import get_session
from app.models import AdminUser, User, License, LicenseStatus, LicenseTier
from app.api.admin.deps import get_current_admin, require_write_permission


router = APIRouter(prefix="/licenses", tags=["Admin Licenses"])


# Schemas
class LicenseCreate(BaseModel):
    email: EmailStr
    tier: str = "month"
    days: int = 30
    password: Optional[str] = None


class LicenseExtend(BaseModel):
    days: int


class LicenseResponse(BaseModel):
    id: UUID
    license_key: str
    tier: str
    status: str
    max_devices: int
    activated_devices: int
    expires_at: Optional[datetime] = None
    created_at: datetime
    user: Optional[dict] = None

    class Config:
        from_attributes = True


class LicenseListResponse(BaseModel):
    items: list[LicenseResponse]
    total: int
    page: int
    per_page: int


# Endpoints
@router.get("", response_model=LicenseListResponse)
async def list_licenses(
    search: str = "",
    status: Optional[str] = None,
    tier: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=50, ge=1, le=100),
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """List all licenses with optional filters."""
    query = select(License).outerjoin(User).options(selectinload(License.user))

    if search:
        query = query.where(
            or_(
                License.license_key.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )

    if status:
        query = query.where(License.status == status)

    if tier:
        query = query.where(License.tier == tier)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    count_result = await session.execute(count_query)
    total = count_result.scalar()

    # Get paginated results
    offset = (page - 1) * per_page
    query = query.order_by(License.created_at.desc()).offset(offset).limit(per_page)
    result = await session.execute(query)
    licenses = result.scalars().all()

    items = []
    for lic in licenses:
        items.append(LicenseResponse(
            id=lic.id,
            license_key=lic.license_key,
            tier=lic.tier.value if hasattr(lic.tier, 'value') else lic.tier,
            status=lic.status.value if hasattr(lic.status, 'value') else lic.status,
            max_devices=lic.max_devices,
            activated_devices=lic.activated_devices,
            expires_at=lic.expires_at,
            created_at=lic.created_at,
            user={"email": lic.user.email, "name": lic.user.name} if lic.user else None
        ))

    return LicenseListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page
    )


@router.get("/{license_id}", response_model=LicenseResponse)
async def get_license(
    license_id: UUID,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get a single license by ID."""
    result = await session.execute(
        select(License).where(License.id == license_id)
    )
    lic = result.scalar_one_or_none()

    if not lic:
        raise HTTPException(status_code=404, detail="License not found")

    return LicenseResponse(
        id=lic.id,
        license_key=lic.license_key,
        tier=lic.tier.value if hasattr(lic.tier, 'value') else lic.tier,
        status=lic.status.value if hasattr(lic.status, 'value') else lic.status,
        max_devices=lic.max_devices,
        activated_devices=lic.activated_devices,
        expires_at=lic.expires_at,
        created_at=lic.created_at,
        user={"email": lic.user.email, "name": lic.user.name} if lic.user else None
    )


@router.post("", response_model=LicenseResponse, status_code=status.HTTP_201_CREATED)
async def create_license(
    data: LicenseCreate,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Create a new license for a user."""
    # Find or create user
    result = await session.execute(
        select(User).where(User.email == data.email)
    )
    user = result.scalar_one_or_none()

    if not user:
        user = User(email=data.email)
        if data.password:
            user.set_password(data.password)
        session.add(user)
        await session.flush()

    # Calculate expiration
    expires_at = datetime.utcnow() + timedelta(days=data.days)

    # Map tier string to enum
    tier_map = {
        "day": LicenseTier.DAY,
        "week": LicenseTier.WEEK,
        "month": LicenseTier.MONTH,
        "year": LicenseTier.YEAR,
    }
    tier = tier_map.get(data.tier, LicenseTier.MONTH)

    # Create license
    license = License(
        user_id=user.id,
        tier=tier,
        status=LicenseStatus.ACTIVE,
        expires_at=expires_at,
        max_devices=2,
    )
    session.add(license)
    await session.commit()
    await session.refresh(license)

    return LicenseResponse(
        id=license.id,
        license_key=license.license_key,
        tier=license.tier.value,
        status=license.status.value,
        max_devices=license.max_devices,
        activated_devices=license.activated_devices,
        expires_at=license.expires_at,
        created_at=license.created_at,
        user={"email": user.email, "name": user.name}
    )


@router.post("/{license_id}/revoke")
async def revoke_license(
    license_id: UUID,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Revoke a license."""
    result = await session.execute(
        select(License).where(License.id == license_id)
    )
    lic = result.scalar_one_or_none()

    if not lic:
        raise HTTPException(status_code=404, detail="License not found")

    lic.status = LicenseStatus.REVOKED
    await session.commit()

    return {"message": "License revoked", "license_id": str(license_id)}


@router.post("/{license_id}/extend")
async def extend_license(
    license_id: UUID,
    data: LicenseExtend,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Extend a license by X days."""
    result = await session.execute(
        select(License).where(License.id == license_id)
    )
    lic = result.scalar_one_or_none()

    if not lic:
        raise HTTPException(status_code=404, detail="License not found")

    # If already expired, extend from now
    if lic.expires_at and lic.expires_at < datetime.utcnow():
        lic.expires_at = datetime.utcnow() + timedelta(days=data.days)
    elif lic.expires_at:
        lic.expires_at = lic.expires_at + timedelta(days=data.days)
    else:
        lic.expires_at = datetime.utcnow() + timedelta(days=data.days)

    # Reactivate if was expired
    if lic.status == LicenseStatus.EXPIRED:
        lic.status = LicenseStatus.ACTIVE

    await session.commit()

    return {
        "message": f"License extended by {data.days} days",
        "license_id": str(license_id),
        "new_expiry": lic.expires_at.isoformat()
    }


@router.post("/{license_id}/suspend")
async def suspend_license(
    license_id: UUID,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Suspend a license."""
    result = await session.execute(
        select(License).where(License.id == license_id)
    )
    lic = result.scalar_one_or_none()

    if not lic:
        raise HTTPException(status_code=404, detail="License not found")

    lic.status = LicenseStatus.SUSPENDED
    await session.commit()

    return {"message": "License suspended", "license_id": str(license_id)}


@router.post("/{license_id}/activate")
async def activate_license(
    license_id: UUID,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Reactivate a suspended/revoked license."""
    result = await session.execute(
        select(License).where(License.id == license_id)
    )
    lic = result.scalar_one_or_none()

    if not lic:
        raise HTTPException(status_code=404, detail="License not found")

    lic.status = LicenseStatus.ACTIVE
    await session.commit()

    return {"message": "License activated", "license_id": str(license_id)}
