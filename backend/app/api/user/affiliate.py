"""User affiliate endpoints."""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel

from typing import Optional
from datetime import datetime

from app.database import get_session
from app.models import User, License
from app.models.affiliate import Referral, Commission, CommissionStatus
from app.models.user import generate_affiliate_code
from app.api.user.profile import get_current_user
from app.config import get_settings

settings = get_settings()

router = APIRouter(tags=["Affiliate"])


class AffiliateStatsResponse(BaseModel):
    is_affiliate: bool
    affiliate_code: str | None
    referral_link: str | None
    total_referrals: int
    converted_referrals: int
    total_earned: float
    pending_earnings: float
    commission_rate: int


class ActivateAffiliateResponse(BaseModel):
    success: bool
    affiliate_code: str
    referral_link: str


@router.get("/affiliate/stats", response_model=AffiliateStatsResponse)
async def get_affiliate_stats(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get current user's affiliate stats."""

    # Get referral counts
    total_referrals = 0
    converted_referrals = 0

    if current_user.is_affiliate and current_user.affiliate_code:
        # Count total referrals
        total_result = await session.execute(
            select(func.count(Referral.id)).where(
                Referral.affiliate_id == current_user.id
            )
        )
        total_referrals = total_result.scalar() or 0

        # Count converted referrals
        converted_result = await session.execute(
            select(func.count(Referral.id)).where(
                Referral.affiliate_id == current_user.id,
                Referral.converted == True
            )
        )
        converted_referrals = converted_result.scalar() or 0

    # Get earnings
    total_earned = 0.0
    pending_earnings = 0.0

    if current_user.is_affiliate:
        # Total earned (approved + paid)
        earned_result = await session.execute(
            select(func.coalesce(func.sum(Commission.amount), 0)).where(
                Commission.affiliate_id == current_user.id,
                Commission.status.in_([CommissionStatus.APPROVED, CommissionStatus.PAID])
            )
        )
        total_earned = (earned_result.scalar() or 0) / 100

        # Pending earnings
        pending_result = await session.execute(
            select(func.coalesce(func.sum(Commission.amount), 0)).where(
                Commission.affiliate_id == current_user.id,
                Commission.status == CommissionStatus.PENDING
            )
        )
        pending_earnings = (pending_result.scalar() or 0) / 100

    # Build referral link
    referral_link = None
    if current_user.affiliate_code:
        base_url = settings.frontend_url or "https://sharkpokerclub.com"
        referral_link = f"{base_url}/signup?ref={current_user.affiliate_code}"

    return AffiliateStatsResponse(
        is_affiliate=current_user.is_affiliate,
        affiliate_code=current_user.affiliate_code,
        referral_link=referral_link,
        total_referrals=total_referrals,
        converted_referrals=converted_referrals,
        total_earned=total_earned,
        pending_earnings=pending_earnings,
        commission_rate=current_user.get_commission_rate(15),
    )


@router.post("/affiliate/activate", response_model=ActivateAffiliateResponse)
async def activate_affiliate(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Activate affiliate status for current user."""

    # Check if already an affiliate
    if current_user.is_affiliate and current_user.affiliate_code:
        base_url = settings.frontend_url or "https://sharkpokerclub.com"
        return ActivateAffiliateResponse(
            success=True,
            affiliate_code=current_user.affiliate_code,
            referral_link=f"{base_url}/signup?ref={current_user.affiliate_code}",
        )

    # Generate unique affiliate code
    for _ in range(10):  # Try up to 10 times to get unique code
        code = generate_affiliate_code()
        existing = await session.execute(
            select(User).where(User.affiliate_code == code)
        )
        if not existing.scalar_one_or_none():
            break
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate unique affiliate code"
        )

    # Update user
    current_user.is_affiliate = True
    current_user.affiliate_code = code
    current_user.affiliate_status = "active"

    await session.commit()
    await session.refresh(current_user)

    base_url = settings.frontend_url or "https://sharkpokerclub.com"
    return ActivateAffiliateResponse(
        success=True,
        affiliate_code=current_user.affiliate_code,
        referral_link=f"{base_url}/signup?ref={current_user.affiliate_code}",
    )


class ReferralDetail(BaseModel):
    id: str
    email: str
    name: Optional[str]
    signed_up_at: str
    has_active_subscription: bool
    subscription_tier: Optional[str]
    subscription_expires: Optional[str]
    converted: bool
    converted_at: Optional[str]
    commission_earned: float
    commission_status: Optional[str]


class ReferralsListResponse(BaseModel):
    referrals: list[ReferralDetail]
    total: int


@router.get("/affiliate/referrals", response_model=ReferralsListResponse)
async def get_affiliate_referrals(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get list of users referred by the current affiliate."""

    if not current_user.is_affiliate:
        return ReferralsListResponse(referrals=[], total=0)

    # Get all referrals for this affiliate
    result = await session.execute(
        select(Referral)
        .where(Referral.affiliate_id == current_user.id)
        .order_by(Referral.created_at.desc())
    )
    referrals = result.scalars().all()

    referral_details = []
    for referral in referrals:
        # Get the referred user
        user_result = await session.execute(
            select(User).where(User.id == referral.referred_user_id)
        )
        referred_user = user_result.scalar_one_or_none()

        if not referred_user:
            continue

        # Check for active license/subscription
        license_result = await session.execute(
            select(License)
            .where(License.user_id == referred_user.id)
            .where(License.status == "active")
            .order_by(License.created_at.desc())
        )
        active_license = license_result.scalar_one_or_none()

        # Get total commission earned from this referral
        commission_result = await session.execute(
            select(func.coalesce(func.sum(Commission.amount), 0))
            .where(Commission.referral_id == referral.id)
        )
        total_commission = (commission_result.scalar() or 0) / 100  # Convert cents to dollars

        # Get latest commission status
        latest_commission_result = await session.execute(
            select(Commission)
            .where(Commission.referral_id == referral.id)
            .order_by(Commission.created_at.desc())
        )
        latest_commission = latest_commission_result.scalar_one_or_none()
        commission_status = latest_commission.status.value if latest_commission else None

        referral_details.append(ReferralDetail(
            id=str(referral.id),
            email=referred_user.email,
            name=referred_user.name,
            signed_up_at=referral.created_at.isoformat(),
            has_active_subscription=active_license is not None,
            subscription_tier=active_license.tier.value if active_license and hasattr(active_license.tier, 'value') else (active_license.tier if active_license else None),
            subscription_expires=active_license.expires_at.isoformat() if active_license and active_license.expires_at else None,
            converted=referral.converted,
            converted_at=referral.converted_at.isoformat() if referral.converted_at else None,
            commission_earned=total_commission,
            commission_status=commission_status,
        ))

    return ReferralsListResponse(
        referrals=referral_details,
        total=len(referral_details)
    )
