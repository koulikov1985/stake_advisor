import uuid
import secrets
import enum
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, Integer, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from passlib.context import CryptContext

from app.database import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def generate_affiliate_code() -> str:
    """Generate a unique affiliate code."""
    return secrets.token_urlsafe(8).upper()[:10]


class AffiliateStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    REJECTED = "rejected"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    paddle_customer_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    stripe_customer_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # Affiliate fields
    is_affiliate: Mapped[bool] = mapped_column(Boolean, default=False)
    affiliate_code: Mapped[str | None] = mapped_column(
        String(20), unique=True, nullable=True, index=True
    )
    affiliate_status: Mapped[str] = mapped_column(String(20), default="pending")
    custom_commission_rate: Mapped[int | None] = mapped_column(Integer, nullable=True)  # Percentage 0-100
    referred_by_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )

    # Relationships
    licenses: Mapped[list["License"]] = relationship(
        "License", back_populates="user", lazy="selectin", cascade="all, delete-orphan"
    )
    subscriptions: Mapped[list["Subscription"]] = relationship(
        "Subscription", back_populates="user", lazy="selectin", cascade="all, delete"
    )
    referred_by: Mapped["User"] = relationship(
        "User",
        remote_side=[id],
        foreign_keys=[referred_by_id],
        lazy="selectin",
        back_populates="referred_users",
    )
    referred_users: Mapped[list["User"]] = relationship(
        "User",
        foreign_keys=[referred_by_id],
        lazy="selectin",
        back_populates="referred_by",
    )
    referrals: Mapped[list["Referral"]] = relationship(
        "Referral",
        back_populates="affiliate",
        foreign_keys="Referral.affiliate_id",
        lazy="selectin",
        cascade="all, delete",
    )
    referral_record: Mapped["Referral"] = relationship(
        "Referral",
        back_populates="referred_user",
        foreign_keys="Referral.referred_user_id",
        lazy="selectin",
        uselist=False,
        cascade="all, delete",
    )
    commissions: Mapped[list["Commission"]] = relationship(
        "Commission",
        back_populates="affiliate",
        foreign_keys="Commission.affiliate_id",
        lazy="selectin",
        cascade="all, delete",
    )
    payouts: Mapped[list["AffiliatePayout"]] = relationship(
        "AffiliatePayout",
        back_populates="affiliate",
        foreign_keys="AffiliatePayout.affiliate_id",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    notes: Mapped[list["UserNote"]] = relationship(
        "UserNote",
        back_populates="user",
        foreign_keys="UserNote.user_id",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    tag_assignments: Mapped[list["UserTagAssignment"]] = relationship(
        "UserTagAssignment",
        back_populates="user",
        foreign_keys="UserTagAssignment.user_id",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    activity_logs: Mapped[list["UserActivityLog"]] = relationship(
        "UserActivityLog",
        back_populates="user",
        foreign_keys="UserActivityLog.user_id",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    revenue_transactions: Mapped[list["RevenueTransaction"]] = relationship(
        "RevenueTransaction",
        back_populates="user",
        foreign_keys="RevenueTransaction.user_id",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<User {self.email}>"

    def set_password(self, password: str) -> None:
        """Hash and set the password."""
        self.password_hash = pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        """Verify a password against the hash."""
        if not self.password_hash:
            return False
        return pwd_context.verify(password, self.password_hash)

    def get_commission_rate(self, default_rate: int = 20) -> int:
        """Get effective commission rate."""
        return self.custom_commission_rate if self.custom_commission_rate is not None else default_rate
