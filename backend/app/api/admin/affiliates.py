from typing import Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import AdminUser, User, License, LicenseStatus
from app.models.affiliate import Referral, Commission, CommissionStatus
from app.schemas.affiliate import (
    AffiliateResponse,
    AffiliateListResponse,
    AffiliateUpdate,
    ReferralResponse,
    ReferralListResponse,
    ReferralUpdate,
    CommissionResponse,
    CommissionListResponse,
    CommissionAction,
    PayoutResponse,
    PayoutListResponse,
    PayoutProcess,
)
from app.services.affiliate_service import AffiliateService
from app.services.admin_service import AuditService
from app.api.admin.deps import (
    get_current_admin,
    require_write_permission,
    get_client_ip,
    get_user_agent,
)

router = APIRouter(prefix="/affiliates", tags=["Admin Affiliates"])


@router.get("", response_model=AffiliateListResponse)
async def list_affiliates(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=50, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """List all affiliates with stats."""
    service = AffiliateService(session)
    items, total = await service.list_affiliates(
        page=page, per_page=per_page, status=status, search=search
    )
    pages = (total + per_page - 1) // per_page if total > 0 else 1
    return AffiliateListResponse(
        items=items, total=total, page=page, per_page=per_page, pages=pages
    )


@router.get("/{affiliate_id}", response_model=AffiliateResponse)
async def get_affiliate(
    affiliate_id: UUID,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get single affiliate details."""
    service = AffiliateService(session)
    affiliate = await service.get_affiliate(affiliate_id)
    if not affiliate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Affiliate not found"
        )
    return affiliate


@router.put("/{affiliate_id}", response_model=AffiliateResponse)
async def update_affiliate(
    affiliate_id: UUID,
    request: Request,
    data: AffiliateUpdate,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Update affiliate settings."""
    service = AffiliateService(session)
    audit = AuditService(session)

    # Get old values for audit
    old_affiliate = await service.get_affiliate(affiliate_id)
    if not old_affiliate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Affiliate not found"
        )

    updated = await service.update_affiliate(
        affiliate_id=affiliate_id,
        affiliate_status=data.affiliate_status,
        custom_commission_rate=data.custom_commission_rate,
        affiliate_code=data.affiliate_code,
    )

    await audit.log(
        entity_type="affiliate",
        entity_id=str(affiliate_id),
        action="update",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        old_values={
            "affiliate_status": old_affiliate.affiliate_status,
            "custom_commission_rate": old_affiliate.custom_commission_rate,
        },
        new_values=data.model_dump(exclude_unset=True),
    )

    return await service.get_affiliate(affiliate_id)


@router.get("/{affiliate_id}/referrals", response_model=ReferralListResponse)
async def get_affiliate_referrals(
    affiliate_id: UUID,
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=50, ge=1, le=100),
    converted: Optional[bool] = None,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get referrals for a specific affiliate."""
    service = AffiliateService(session)
    items, total = await service.list_referrals(
        page=page, per_page=per_page, affiliate_id=affiliate_id, converted=converted
    )
    pages = (total + per_page - 1) // per_page if total > 0 else 1
    return ReferralListResponse(
        items=items, total=total, page=page, per_page=per_page, pages=pages
    )


# Commissions endpoints
@router.get("/commissions/all", response_model=CommissionListResponse)
async def list_commissions(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=50, ge=1, le=100),
    affiliate_id: Optional[UUID] = None,
    status: Optional[str] = None,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """List all commissions."""
    service = AffiliateService(session)
    items, total, total_amount = await service.list_commissions(
        page=page, per_page=per_page, affiliate_id=affiliate_id, status=status
    )
    pages = (total + per_page - 1) // per_page if total > 0 else 1
    return CommissionListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        pages=pages,
        total_amount=total_amount,
    )


@router.post("/commissions/{commission_id}/action", response_model=CommissionResponse)
async def commission_action(
    commission_id: UUID,
    request: Request,
    data: CommissionAction,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Approve or reject a commission."""
    service = AffiliateService(session)
    audit = AuditService(session)

    if data.action == "approve":
        commission = await service.approve_commission(commission_id, admin.email)
    else:
        commission = await service.reject_commission(
            commission_id, admin.email, data.rejection_reason
        )

    if not commission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commission not found or not in pending status",
        )

    await audit.log(
        entity_type="commission",
        entity_id=str(commission_id),
        action=f"commission_{data.action}",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        new_values={"status": commission.status.value, "rejection_reason": data.rejection_reason},
    )

    return CommissionResponse(
        id=commission.id,
        affiliate_id=commission.affiliate_id,
        affiliate_email=commission.affiliate.email if commission.affiliate else None,
        referral_id=commission.referral_id,
        amount=commission.amount / 100,
        currency=commission.currency,
        commission_rate=commission.commission_rate,
        base_amount=commission.base_amount / 100,
        status=commission.status.value,
        reviewed_by=commission.reviewed_by,
        reviewed_at=commission.reviewed_at,
        rejection_reason=commission.rejection_reason,
        created_at=commission.created_at,
    )


# Payouts endpoints
@router.get("/payouts/all", response_model=PayoutListResponse)
async def list_payouts(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=50, ge=1, le=100),
    affiliate_id: Optional[UUID] = None,
    status: Optional[str] = None,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """List all payouts."""
    service = AffiliateService(session)
    items, total = await service.list_payouts(
        page=page, per_page=per_page, affiliate_id=affiliate_id, status=status
    )
    pages = (total + per_page - 1) // per_page if total > 0 else 1
    return PayoutListResponse(
        items=items, total=total, page=page, per_page=per_page, pages=pages
    )


@router.post("/payouts/{payout_id}/process", response_model=PayoutResponse)
async def process_payout(
    payout_id: UUID,
    request: Request,
    data: PayoutProcess,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Process a pending payout."""
    service = AffiliateService(session)
    audit = AuditService(session)

    payout = await service.process_payout(
        payout_id=payout_id,
        admin_email=admin.email,
        payment_method=data.payment_method,
        payment_reference=data.payment_reference,
        notes=data.notes,
    )

    if not payout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payout not found or not in pending status",
        )

    await audit.log(
        entity_type="payout",
        entity_id=str(payout_id),
        action="payout_processed",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        new_values={
            "status": payout.status.value,
            "payment_method": payout.payment_method,
            "payment_reference": payout.payment_reference,
        },
    )

    return PayoutResponse(
        id=payout.id,
        affiliate_id=payout.affiliate_id,
        affiliate_email=payout.affiliate.email if payout.affiliate else None,
        amount=payout.amount / 100,
        currency=payout.currency,
        status=payout.status.value,
        payment_method=payout.payment_method,
        payment_reference=payout.payment_reference,
        processed_by=payout.processed_by,
        processed_at=payout.processed_at,
        notes=payout.notes,
        requested_at=payout.requested_at,
        created_at=payout.created_at,
        commissions_count=len(payout.commissions) if payout.commissions else 0,
    )


# Plan prices in cents
PLAN_PRICES = {
    'trial': 0,
    'day': 500,
    'week': 2500,
    'month': 6000,
    '6month': 31500,
    'year': 54900,
}


@router.post("/backfill-commissions")
async def backfill_commissions(
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Backfill commissions for existing referrals where referred user has active subscription."""

    # Find all referrals
    result = await session.execute(select(Referral))
    referrals = result.scalars().all()

    processed = 0
    created = 0

    for referral in referrals:
        # Check if referred user has active license
        license_result = await session.execute(
            select(License)
            .where(License.user_id == referral.referred_user_id)
            .where(License.status == LicenseStatus.ACTIVE)
            .order_by(License.created_at.desc())
        )
        active_license = license_result.scalar_one_or_none()

        if not active_license:
            continue

        processed += 1

        # Mark as converted if not already
        if not referral.converted:
            referral.converted = True
            referral.converted_at = datetime.utcnow()

        # Check if commission already exists
        existing_commission = await session.execute(
            select(Commission).where(Commission.referral_id == referral.id)
        )
        if existing_commission.scalar_one_or_none():
            continue

        # Get affiliate's commission rate
        affiliate_result = await session.execute(
            select(User).where(User.id == referral.affiliate_id)
        )
        affiliate = affiliate_result.scalar_one_or_none()
        commission_rate = affiliate.custom_commission_rate or 15 if affiliate else 15

        # Calculate commission based on license tier
        tier = active_license.tier.value if hasattr(active_license.tier, 'value') else str(active_license.tier)
        base_amount = PLAN_PRICES.get(tier, 6000)
        commission_amount = int(base_amount * commission_rate / 100)

        # Create commission
        commission = Commission(
            affiliate_id=referral.affiliate_id,
            referral_id=referral.id,
            amount=commission_amount,
            currency="USD",
            commission_rate=commission_rate,
            base_amount=base_amount,
            status=CommissionStatus.PENDING,
        )
        session.add(commission)
        created += 1

    await session.commit()

    return {
        "message": f"Backfill complete. Processed {processed} referrals, created {created} commissions."
    }
