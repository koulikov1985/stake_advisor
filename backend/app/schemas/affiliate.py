from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


# Affiliate schemas
class AffiliateResponse(BaseModel):
    id: UUID
    email: str
    name: Optional[str] = None
    affiliate_code: Optional[str] = None
    affiliate_status: str
    custom_commission_rate: Optional[int] = None
    is_active: bool
    created_at: datetime

    # Stats (populated by service)
    total_referrals: int = 0
    converted_referrals: int = 0
    total_earnings: float = 0
    pending_earnings: float = 0

    class Config:
        from_attributes = True


class AffiliateListResponse(BaseModel):
    items: list[AffiliateResponse]
    total: int
    page: int
    per_page: int
    pages: int


class AffiliateUpdate(BaseModel):
    affiliate_status: Optional[str] = Field(default=None, pattern="^(pending|active|suspended|rejected)$")
    custom_commission_rate: Optional[int] = Field(default=None, ge=0, le=100)
    affiliate_code: Optional[str] = None


# Referral schemas
class ReferralResponse(BaseModel):
    id: UUID
    affiliate_id: UUID
    affiliate_email: Optional[str] = None
    referred_user_id: UUID
    referred_user_email: Optional[str] = None
    referral_code_used: str
    converted: bool
    converted_at: Optional[datetime] = None
    admin_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ReferralListResponse(BaseModel):
    items: list[ReferralResponse]
    total: int
    page: int
    per_page: int
    pages: int


class ReferralUpdate(BaseModel):
    admin_notes: Optional[str] = None


# Commission schemas
class CommissionResponse(BaseModel):
    id: UUID
    affiliate_id: UUID
    affiliate_email: Optional[str] = None
    referral_id: UUID
    amount: float
    currency: str
    commission_rate: int
    base_amount: float
    status: str
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class CommissionListResponse(BaseModel):
    items: list[CommissionResponse]
    total: int
    page: int
    per_page: int
    pages: int
    total_amount: float = 0


class CommissionAction(BaseModel):
    action: str = Field(pattern="^(approve|reject)$")
    rejection_reason: Optional[str] = None


# Payout schemas
class PayoutResponse(BaseModel):
    id: UUID
    affiliate_id: UUID
    affiliate_email: Optional[str] = None
    amount: float
    currency: str
    status: str
    payment_method: Optional[str] = None
    payment_reference: Optional[str] = None
    processed_by: Optional[str] = None
    processed_at: Optional[datetime] = None
    notes: Optional[str] = None
    requested_at: datetime
    created_at: datetime
    commissions_count: int = 0

    class Config:
        from_attributes = True


class PayoutListResponse(BaseModel):
    items: list[PayoutResponse]
    total: int
    page: int
    per_page: int
    pages: int


class PayoutProcess(BaseModel):
    payment_method: Optional[str] = None
    payment_reference: Optional[str] = None
    notes: Optional[str] = None
