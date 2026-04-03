from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional
from decimal import Decimal


class RevenueSummary(BaseModel):
    daily: float
    weekly: float
    monthly: float
    yearly: float
    all_time: float
    currency: str = "USD"


class MRRResponse(BaseModel):
    mrr: float
    previous_mrr: float
    change_percentage: float
    currency: str = "USD"


class RevenueByPlan(BaseModel):
    plan: str
    revenue: float
    count: int
    percentage: float


class RevenueByPlanResponse(BaseModel):
    data: list[RevenueByPlan]
    total: float
    currency: str = "USD"


class TransactionResponse(BaseModel):
    id: UUID
    user_email: Optional[str] = None
    transaction_type: str
    status: str
    amount: float
    currency: str
    plan_tier: Optional[str] = None
    description: Optional[str] = None
    transaction_date: datetime

    class Config:
        from_attributes = True


class TransactionListResponse(BaseModel):
    items: list[TransactionResponse]
    total: int
    page: int
    per_page: int
    pages: int


class SubscriptionMetrics(BaseModel):
    total_active: int
    new_this_month: int
    churned_this_month: int
    renewals_this_month: int
    churn_rate: float
    growth_rate: float


class DashboardStats(BaseModel):
    revenue: RevenueSummary
    mrr: MRRResponse
    subscriptions: SubscriptionMetrics
    total_users: int
    active_licenses: int
