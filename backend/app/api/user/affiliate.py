"""User affiliate endpoints."""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel

from app.database import get_session
from app.models import User
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
        base_url = settings.frontend_url or "https://license-keys-frontend.onrender.com"
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
        base_url = settings.frontend_url or "https://license-keys-frontend.onrender.com"
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

    base_url = settings.frontend_url or "https://license-keys-frontend.onrender.com"
    return ActivateAffiliateResponse(
        success=True,
        affiliate_code=current_user.affiliate_code,
        referral_link=f"{base_url}/signup?ref={current_user.affiliate_code}",
    )
