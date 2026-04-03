from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from sqlalchemy import select, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    User,
    License,
    LicenseStatus,
    Subscription,
    SubscriptionStatus,
    RevenueTransaction,
    TransactionStatus,
    TransactionType,
)
from app.schemas.analytics import (
    RevenueSummary,
    MRRResponse,
    RevenueByPlan,
    RevenueByPlanResponse,
    TransactionResponse,
    SubscriptionMetrics,
    DashboardStats,
)


class AnalyticsService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_revenue_summary(self) -> RevenueSummary:
        """Get revenue summary for different time periods."""
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=now.weekday())
        month_start = today_start.replace(day=1)
        year_start = today_start.replace(month=1, day=1)

        async def get_revenue_since(start_date: datetime) -> float:
            result = await self.session.execute(
                select(func.coalesce(func.sum(RevenueTransaction.amount), 0))
                .where(RevenueTransaction.transaction_date >= start_date)
                .where(RevenueTransaction.status == TransactionStatus.COMPLETED)
                .where(RevenueTransaction.transaction_type != TransactionType.REFUND)
            )
            return (result.scalar() or 0) / 100

        daily = await get_revenue_since(today_start)
        weekly = await get_revenue_since(week_start)
        monthly = await get_revenue_since(month_start)
        yearly = await get_revenue_since(year_start)

        # All time
        result = await self.session.execute(
            select(func.coalesce(func.sum(RevenueTransaction.amount), 0))
            .where(RevenueTransaction.status == TransactionStatus.COMPLETED)
            .where(RevenueTransaction.transaction_type != TransactionType.REFUND)
        )
        all_time = (result.scalar() or 0) / 100

        return RevenueSummary(
            daily=daily,
            weekly=weekly,
            monthly=monthly,
            yearly=yearly,
            all_time=all_time,
        )

    async def get_mrr(self) -> MRRResponse:
        """Calculate Monthly Recurring Revenue."""
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        prev_month_start = (month_start - timedelta(days=1)).replace(day=1)

        # Current MRR: sum of active monthly subscriptions
        # For yearly, divide by 12
        current_result = await self.session.execute(
            select(func.coalesce(func.sum(RevenueTransaction.amount), 0))
            .where(RevenueTransaction.transaction_date >= month_start)
            .where(RevenueTransaction.status == TransactionStatus.COMPLETED)
            .where(RevenueTransaction.transaction_type == TransactionType.SUBSCRIPTION_PAYMENT)
        )
        current_mrr = (current_result.scalar() or 0) / 100

        # Previous month MRR
        prev_result = await self.session.execute(
            select(func.coalesce(func.sum(RevenueTransaction.amount), 0))
            .where(
                and_(
                    RevenueTransaction.transaction_date >= prev_month_start,
                    RevenueTransaction.transaction_date < month_start,
                )
            )
            .where(RevenueTransaction.status == TransactionStatus.COMPLETED)
            .where(RevenueTransaction.transaction_type == TransactionType.SUBSCRIPTION_PAYMENT)
        )
        prev_mrr = (prev_result.scalar() or 0) / 100

        change_pct = 0
        if prev_mrr > 0:
            change_pct = ((current_mrr - prev_mrr) / prev_mrr) * 100

        return MRRResponse(
            mrr=current_mrr,
            previous_mrr=prev_mrr,
            change_percentage=round(change_pct, 2),
        )

    async def get_revenue_by_plan(self) -> RevenueByPlanResponse:
        """Get revenue breakdown by plan tier."""
        result = await self.session.execute(
            select(
                RevenueTransaction.plan_tier,
                func.sum(RevenueTransaction.amount).label("revenue"),
                func.count(RevenueTransaction.id).label("count"),
            )
            .where(RevenueTransaction.status == TransactionStatus.COMPLETED)
            .where(RevenueTransaction.transaction_type != TransactionType.REFUND)
            .group_by(RevenueTransaction.plan_tier)
        )

        rows = result.all()
        total = sum(r.revenue or 0 for r in rows) / 100

        data = []
        for row in rows:
            revenue = (row.revenue or 0) / 100
            pct = (revenue / total * 100) if total > 0 else 0
            data.append(
                RevenueByPlan(
                    plan=row.plan_tier or "unknown",
                    revenue=revenue,
                    count=row.count,
                    percentage=round(pct, 2),
                )
            )

        return RevenueByPlanResponse(data=data, total=total)

    async def get_transactions(
        self,
        page: int = 1,
        per_page: int = 50,
        transaction_type: Optional[str] = None,
        status: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> tuple[list[TransactionResponse], int]:
        """Get paginated transactions."""
        query = select(RevenueTransaction)

        if transaction_type:
            query = query.where(RevenueTransaction.transaction_type == transaction_type)
        if status:
            query = query.where(RevenueTransaction.status == status)
        if start_date:
            query = query.where(RevenueTransaction.transaction_date >= start_date)
        if end_date:
            query = query.where(RevenueTransaction.transaction_date <= end_date)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.session.execute(count_query)
        total = count_result.scalar()

        # Get paginated results
        offset = (page - 1) * per_page
        query = query.order_by(RevenueTransaction.transaction_date.desc()).offset(offset).limit(per_page)
        result = await self.session.execute(query)
        transactions = result.scalars().all()

        items = []
        for t in transactions:
            items.append(
                TransactionResponse(
                    id=t.id,
                    user_email=t.user.email if t.user else None,
                    transaction_type=t.transaction_type.value,
                    status=t.status.value,
                    amount=t.amount / 100,
                    currency=t.currency,
                    plan_tier=t.plan_tier,
                    description=t.description,
                    transaction_date=t.transaction_date,
                )
            )

        return items, total

    async def get_subscription_metrics(self) -> SubscriptionMetrics:
        """Get subscription metrics."""
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # Total active subscriptions
        active_result = await self.session.execute(
            select(func.count(Subscription.id)).where(
                Subscription.status == SubscriptionStatus.ACTIVE
            )
        )
        total_active = active_result.scalar() or 0

        # New this month
        new_result = await self.session.execute(
            select(func.count(Subscription.id)).where(
                Subscription.created_at >= month_start
            )
        )
        new_this_month = new_result.scalar() or 0

        # Churned this month (canceled)
        churned_result = await self.session.execute(
            select(func.count(Subscription.id)).where(
                and_(
                    Subscription.status == SubscriptionStatus.CANCELED,
                    Subscription.updated_at >= month_start,
                )
            )
        )
        churned_this_month = churned_result.scalar() or 0

        # Renewals (subscription payments this month for existing subs)
        renewals_result = await self.session.execute(
            select(func.count(RevenueTransaction.id)).where(
                and_(
                    RevenueTransaction.transaction_date >= month_start,
                    RevenueTransaction.transaction_type == TransactionType.SUBSCRIPTION_PAYMENT,
                    RevenueTransaction.status == TransactionStatus.COMPLETED,
                )
            )
        )
        renewals_this_month = renewals_result.scalar() or 0

        # Calculate rates
        churn_rate = 0
        if total_active + churned_this_month > 0:
            churn_rate = (churned_this_month / (total_active + churned_this_month)) * 100

        growth_rate = 0
        prev_count = total_active - new_this_month + churned_this_month
        if prev_count > 0:
            growth_rate = ((total_active - prev_count) / prev_count) * 100

        return SubscriptionMetrics(
            total_active=total_active,
            new_this_month=new_this_month,
            churned_this_month=churned_this_month,
            renewals_this_month=renewals_this_month,
            churn_rate=round(churn_rate, 2),
            growth_rate=round(growth_rate, 2),
        )

    async def get_dashboard_stats(self) -> DashboardStats:
        """Get all dashboard statistics."""
        revenue = await self.get_revenue_summary()
        mrr = await self.get_mrr()
        subscriptions = await self.get_subscription_metrics()

        # Total users
        users_result = await self.session.execute(
            select(func.count(User.id)).where(User.is_active == True)
        )
        total_users = users_result.scalar() or 0

        # Active licenses
        licenses_result = await self.session.execute(
            select(func.count(License.id)).where(License.status == LicenseStatus.ACTIVE)
        )
        active_licenses = licenses_result.scalar() or 0

        return DashboardStats(
            revenue=revenue,
            mrr=mrr,
            subscriptions=subscriptions,
            total_users=total_users,
            active_licenses=active_licenses,
        )
