import uuid
import enum
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, Integer, Text, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.database import Base


class CommissionStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    PAID = "paid"


class PayoutStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Referral(Base):
    __tablename__ = "referrals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    affiliate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    referred_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True
    )

    # Tracking
    referral_code_used: Mapped[str] = mapped_column(String(20), nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)

    # Status
    converted: Mapped[bool] = mapped_column(Boolean, default=False)
    converted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Admin notes
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    affiliate: Mapped["User"] = relationship(
        "User", back_populates="referrals", foreign_keys=[affiliate_id], lazy="selectin"
    )
    referred_user: Mapped["User"] = relationship(
        "User", foreign_keys=[referred_user_id], lazy="selectin"
    )
    commissions: Mapped[list["Commission"]] = relationship(
        "Commission", back_populates="referral", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Referral {self.id}>"


class Commission(Base):
    __tablename__ = "commissions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    affiliate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    referral_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("referrals.id"), nullable=False
    )
    transaction_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("revenue_transactions.id"), nullable=True
    )

    # Commission details
    amount: Mapped[int] = mapped_column(Integer, default=0)  # In cents
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    commission_rate: Mapped[int] = mapped_column(Integer, default=20)  # Percentage used
    base_amount: Mapped[int] = mapped_column(Integer, default=0)  # Original transaction amount

    # Status
    status: Mapped[CommissionStatus] = mapped_column(
        Enum(CommissionStatus, values_callable=lambda x: [e.value for e in x]),
        default=CommissionStatus.PENDING
    )

    # Payout reference
    payout_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("affiliate_payouts.id"), nullable=True
    )

    # Admin
    reviewed_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    affiliate: Mapped["User"] = relationship("User", lazy="selectin")
    referral: Mapped["Referral"] = relationship("Referral", back_populates="commissions", lazy="selectin")
    payout: Mapped["AffiliatePayout"] = relationship("AffiliatePayout", back_populates="commissions", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Commission {self.id} ${self.amount/100:.2f}>"


class AffiliatePayout(Base):
    __tablename__ = "affiliate_payouts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    affiliate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    # Payout details
    amount: Mapped[int] = mapped_column(Integer, default=0)  # In cents
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    status: Mapped[PayoutStatus] = mapped_column(
        Enum(PayoutStatus, values_callable=lambda x: [e.value for e in x]),
        default=PayoutStatus.PENDING
    )

    # Payment details
    payment_method: Mapped[str | None] = mapped_column(String(50), nullable=True)
    payment_details: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    payment_reference: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Admin
    processed_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Timestamps
    requested_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    affiliate: Mapped["User"] = relationship("User", lazy="selectin")
    commissions: Mapped[list["Commission"]] = relationship(
        "Commission", back_populates="payout", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<AffiliatePayout {self.id} ${self.amount/100:.2f}>"
