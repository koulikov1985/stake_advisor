from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import AdminUser
from app.schemas.analytics import (
    RevenueSummary,
    MRRResponse,
    RevenueByPlanResponse,
    TransactionListResponse,
    SubscriptionMetrics,
    DashboardStats,
)
from app.services.analytics_service import AnalyticsService
from app.api.admin.deps import get_current_admin

router = APIRouter(prefix="/analytics", tags=["Admin Analytics"])


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard(
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get dashboard statistics."""
    analytics = AnalyticsService(session)
    return await analytics.get_dashboard_stats()


@router.get("/revenue", response_model=RevenueSummary)
async def get_revenue(
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get revenue summary."""
    analytics = AnalyticsService(session)
    return await analytics.get_revenue_summary()


@router.get("/mrr", response_model=MRRResponse)
async def get_mrr(
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get monthly recurring revenue."""
    analytics = AnalyticsService(session)
    return await analytics.get_mrr()


@router.get("/revenue-by-plan", response_model=RevenueByPlanResponse)
async def get_revenue_by_plan(
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get revenue breakdown by plan."""
    analytics = AnalyticsService(session)
    return await analytics.get_revenue_by_plan()


@router.get("/transactions", response_model=TransactionListResponse)
async def get_transactions(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=50, ge=1, le=100),
    transaction_type: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get paginated transactions."""
    analytics = AnalyticsService(session)
    items, total = await analytics.get_transactions(
        page=page,
        per_page=per_page,
        transaction_type=transaction_type,
        status=status,
        start_date=start_date,
        end_date=end_date,
    )
    pages = (total + per_page - 1) // per_page if total > 0 else 1
    return TransactionListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        pages=pages,
    )


@router.get("/subscriptions", response_model=SubscriptionMetrics)
async def get_subscription_metrics(
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get subscription metrics."""
    analytics = AnalyticsService(session)
    return await analytics.get_subscription_metrics()
