from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    User,
    Referral,
    Commission,
    CommissionStatus,
    AffiliatePayout,
    PayoutStatus,
)
from app.schemas.affiliate import (
    AffiliateResponse,
    ReferralResponse,
    CommissionResponse,
    PayoutResponse,
)


class AffiliateService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_affiliates(
        self,
        page: int = 1,
        per_page: int = 50,
        status: Optional[str] = None,
        search: Optional[str] = None,
    ) -> tuple[list[AffiliateResponse], int]:
        """List affiliates with stats."""
        query = select(User).where(User.is_affiliate == True)

        if status:
            query = query.where(User.affiliate_status == status)
        if search:
            query = query.where(
                User.email.ilike(f"%{search}%") | User.name.ilike(f"%{search}%")
            )

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.session.execute(count_query)
        total = count_result.scalar()

        # Get paginated results
        offset = (page - 1) * per_page
        query = query.order_by(User.created_at.desc()).offset(offset).limit(per_page)
        result = await self.session.execute(query)
        affiliates = result.scalars().all()

        items = []
        for aff in affiliates:
            stats = await self._get_affiliate_stats(aff.id)
            items.append(
                AffiliateResponse(
                    id=aff.id,
                    email=aff.email,
                    name=aff.name,
                    affiliate_code=aff.affiliate_code,
                    affiliate_status=aff.affiliate_status,
                    custom_commission_rate=aff.custom_commission_rate,
                    is_active=aff.is_active,
                    created_at=aff.created_at,
                    **stats,
                )
            )

        return items, total

    async def get_affiliate(self, affiliate_id: UUID) -> Optional[AffiliateResponse]:
        """Get single affiliate with stats."""
        result = await self.session.execute(
            select(User).where(User.id == affiliate_id, User.is_affiliate == True)
        )
        aff = result.scalar_one_or_none()
        if not aff:
            return None

        stats = await self._get_affiliate_stats(aff.id)
        return AffiliateResponse(
            id=aff.id,
            email=aff.email,
            name=aff.name,
            affiliate_code=aff.affiliate_code,
            affiliate_status=aff.affiliate_status,
            custom_commission_rate=aff.custom_commission_rate,
            is_active=aff.is_active,
            created_at=aff.created_at,
            **stats,
        )

    async def _get_affiliate_stats(self, affiliate_id: UUID) -> dict:
        """Get affiliate statistics."""
        # Total referrals
        total_ref = await self.session.execute(
            select(func.count(Referral.id)).where(Referral.affiliate_id == affiliate_id)
        )
        total_referrals = total_ref.scalar() or 0

        # Converted referrals
        converted_ref = await self.session.execute(
            select(func.count(Referral.id)).where(
                Referral.affiliate_id == affiliate_id, Referral.converted == True
            )
        )
        converted_referrals = converted_ref.scalar() or 0

        # Total earnings (paid)
        total_earn = await self.session.execute(
            select(func.coalesce(func.sum(Commission.amount), 0)).where(
                Commission.affiliate_id == affiliate_id,
                Commission.status == CommissionStatus.PAID,
            )
        )
        total_earnings = (total_earn.scalar() or 0) / 100

        # Pending earnings (approved but not paid)
        pending_earn = await self.session.execute(
            select(func.coalesce(func.sum(Commission.amount), 0)).where(
                Commission.affiliate_id == affiliate_id,
                Commission.status == CommissionStatus.APPROVED,
            )
        )
        pending_earnings = (pending_earn.scalar() or 0) / 100

        return {
            "total_referrals": total_referrals,
            "converted_referrals": converted_referrals,
            "total_earnings": total_earnings,
            "pending_earnings": pending_earnings,
        }

    async def update_affiliate(
        self,
        affiliate_id: UUID,
        affiliate_status: Optional[str] = None,
        custom_commission_rate: Optional[int] = None,
        affiliate_code: Optional[str] = None,
    ) -> Optional[User]:
        """Update affiliate settings."""
        result = await self.session.execute(
            select(User).where(User.id == affiliate_id, User.is_affiliate == True)
        )
        user = result.scalar_one_or_none()
        if not user:
            return None

        if affiliate_status is not None:
            user.affiliate_status = affiliate_status
        if custom_commission_rate is not None:
            user.custom_commission_rate = custom_commission_rate
        if affiliate_code is not None:
            user.affiliate_code = affiliate_code

        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def list_referrals(
        self,
        page: int = 1,
        per_page: int = 50,
        affiliate_id: Optional[UUID] = None,
        converted: Optional[bool] = None,
    ) -> tuple[list[ReferralResponse], int]:
        """List referrals."""
        query = select(Referral)

        if affiliate_id:
            query = query.where(Referral.affiliate_id == affiliate_id)
        if converted is not None:
            query = query.where(Referral.converted == converted)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.session.execute(count_query)
        total = count_result.scalar()

        # Get paginated results
        offset = (page - 1) * per_page
        query = query.order_by(Referral.created_at.desc()).offset(offset).limit(per_page)
        result = await self.session.execute(query)
        referrals = result.scalars().all()

        items = []
        for ref in referrals:
            items.append(
                ReferralResponse(
                    id=ref.id,
                    affiliate_id=ref.affiliate_id,
                    affiliate_email=ref.affiliate.email if ref.affiliate else None,
                    referred_user_id=ref.referred_user_id,
                    referred_user_email=ref.referred_user.email if ref.referred_user else None,
                    referral_code_used=ref.referral_code_used,
                    converted=ref.converted,
                    converted_at=ref.converted_at,
                    admin_notes=ref.admin_notes,
                    created_at=ref.created_at,
                )
            )

        return items, total

    async def update_referral(
        self, referral_id: UUID, admin_notes: Optional[str] = None
    ) -> Optional[Referral]:
        """Update referral notes."""
        result = await self.session.execute(
            select(Referral).where(Referral.id == referral_id)
        )
        ref = result.scalar_one_or_none()
        if not ref:
            return None

        if admin_notes is not None:
            ref.admin_notes = admin_notes

        await self.session.commit()
        await self.session.refresh(ref)
        return ref

    async def list_commissions(
        self,
        page: int = 1,
        per_page: int = 50,
        affiliate_id: Optional[UUID] = None,
        status: Optional[str] = None,
    ) -> tuple[list[CommissionResponse], int, float]:
        """List commissions with total amount."""
        query = select(Commission)

        if affiliate_id:
            query = query.where(Commission.affiliate_id == affiliate_id)
        if status:
            query = query.where(Commission.status == status)

        # Count total and sum
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.session.execute(count_query)
        total = count_result.scalar()

        # Sum for filtered results
        sum_query = select(func.coalesce(func.sum(Commission.amount), 0)).select_from(
            query.subquery()
        )
        sum_result = await self.session.execute(sum_query)
        total_amount = (sum_result.scalar() or 0) / 100

        # Get paginated results
        offset = (page - 1) * per_page
        query = query.order_by(Commission.created_at.desc()).offset(offset).limit(per_page)
        result = await self.session.execute(query)
        commissions = result.scalars().all()

        items = []
        for comm in commissions:
            items.append(
                CommissionResponse(
                    id=comm.id,
                    affiliate_id=comm.affiliate_id,
                    affiliate_email=comm.affiliate.email if comm.affiliate else None,
                    referral_id=comm.referral_id,
                    amount=comm.amount / 100,
                    currency=comm.currency,
                    commission_rate=comm.commission_rate,
                    base_amount=comm.base_amount / 100,
                    status=comm.status.value,
                    reviewed_by=comm.reviewed_by,
                    reviewed_at=comm.reviewed_at,
                    rejection_reason=comm.rejection_reason,
                    created_at=comm.created_at,
                )
            )

        return items, total, total_amount

    async def approve_commission(
        self, commission_id: UUID, admin_email: str
    ) -> Optional[Commission]:
        """Approve a pending commission."""
        result = await self.session.execute(
            select(Commission).where(
                Commission.id == commission_id,
                Commission.status == CommissionStatus.PENDING,
            )
        )
        comm = result.scalar_one_or_none()
        if not comm:
            return None

        comm.status = CommissionStatus.APPROVED
        comm.reviewed_by = admin_email
        comm.reviewed_at = datetime.utcnow()

        await self.session.commit()
        await self.session.refresh(comm)
        return comm

    async def reject_commission(
        self, commission_id: UUID, admin_email: str, reason: Optional[str] = None
    ) -> Optional[Commission]:
        """Reject a pending commission."""
        result = await self.session.execute(
            select(Commission).where(
                Commission.id == commission_id,
                Commission.status == CommissionStatus.PENDING,
            )
        )
        comm = result.scalar_one_or_none()
        if not comm:
            return None

        comm.status = CommissionStatus.REJECTED
        comm.reviewed_by = admin_email
        comm.reviewed_at = datetime.utcnow()
        comm.rejection_reason = reason

        await self.session.commit()
        await self.session.refresh(comm)
        return comm

    async def list_payouts(
        self,
        page: int = 1,
        per_page: int = 50,
        affiliate_id: Optional[UUID] = None,
        status: Optional[str] = None,
    ) -> tuple[list[PayoutResponse], int]:
        """List payouts."""
        query = select(AffiliatePayout)

        if affiliate_id:
            query = query.where(AffiliatePayout.affiliate_id == affiliate_id)
        if status:
            query = query.where(AffiliatePayout.status == status)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.session.execute(count_query)
        total = count_result.scalar()

        # Get paginated results
        offset = (page - 1) * per_page
        query = query.order_by(AffiliatePayout.created_at.desc()).offset(offset).limit(per_page)
        result = await self.session.execute(query)
        payouts = result.scalars().all()

        items = []
        for payout in payouts:
            items.append(
                PayoutResponse(
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
            )

        return items, total

    async def process_payout(
        self,
        payout_id: UUID,
        admin_email: str,
        payment_method: Optional[str] = None,
        payment_reference: Optional[str] = None,
        notes: Optional[str] = None,
    ) -> Optional[AffiliatePayout]:
        """Process a pending payout."""
        result = await self.session.execute(
            select(AffiliatePayout).where(
                AffiliatePayout.id == payout_id,
                AffiliatePayout.status == PayoutStatus.PENDING,
            )
        )
        payout = result.scalar_one_or_none()
        if not payout:
            return None

        payout.status = PayoutStatus.COMPLETED
        payout.processed_by = admin_email
        payout.processed_at = datetime.utcnow()
        if payment_method:
            payout.payment_method = payment_method
        if payment_reference:
            payout.payment_reference = payment_reference
        if notes:
            payout.notes = notes

        # Mark all associated commissions as paid
        for comm in payout.commissions:
            comm.status = CommissionStatus.PAID

        await self.session.commit()
        await self.session.refresh(payout)
        return payout
