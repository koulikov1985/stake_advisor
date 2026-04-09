import uuid
import enum
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, DateTime, ForeignKey, Enum, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.database import Base


class TransactionType(str, enum.Enum):
    SUBSCRIPTION_PAYMENT = "subscription_payment"
    ONE_TIME_PURCHASE = "one_time_purchase"
    REFUND = "refund"
    CHARGEBACK = "chargeback"


class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class RevenueTransaction(Base):
    __tablename__ = "revenue_transactions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    subscription_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("subscriptions.id"), nullable=True
    )

    # Paddle identifiers
    paddle_transaction_id: Mapped[str | None] = mapped_column(
        String(255), unique=True, nullable=True, index=True
    )

    # Transaction details
    transaction_type: Mapped[TransactionType] = mapped_column(
        Enum(TransactionType, values_callable=lambda x: [e.value for e in x]),
        default=TransactionType.SUBSCRIPTION_PAYMENT
    )
    status: Mapped[TransactionStatus] = mapped_column(
        Enum(TransactionStatus, values_callable=lambda x: [e.value for e in x]),
        default=TransactionStatus.PENDING
    )

    # Amounts (in cents)
    amount: Mapped[int] = mapped_column(default=0)
    currency: Mapped[str] = mapped_column(String(3), default="USD")

    # Plan info
    plan_tier: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # Additional data
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    extra_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # Timestamps
    transaction_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship("User", lazy="selectin")
    subscription: Mapped["Subscription"] = relationship("Subscription", back_populates="revenue_transactions", lazy="selectin")

    def __repr__(self) -> str:
        return f"<RevenueTransaction {self.id} {self.amount/100:.2f} {self.currency}>"

    @property
    def amount_decimal(self) -> Decimal:
        """Return amount as decimal (dollars)."""
        return Decimal(self.amount) / 100
