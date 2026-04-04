import uuid
import enum
import secrets
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.database import Base


class LicenseTier(str, enum.Enum):
    TRIAL = "trial"
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    SIXMONTH = "6month"
    YEAR = "year"


class LicenseStatus(str, enum.Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    SUSPENDED = "suspended"
    REVOKED = "revoked"


def generate_license_key() -> str:
    """Generate a license key in format SA-XXXX-XXXX-XXXX-XXXX"""
    parts = [secrets.token_hex(2).upper() for _ in range(4)]
    return f"SA-{'-'.join(parts)}"


class License(Base):
    __tablename__ = "licenses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    license_key: Mapped[str] = mapped_column(
        String(24), unique=True, nullable=False, index=True, default=generate_license_key
    )
    tier: Mapped[LicenseTier] = mapped_column(
        Enum(LicenseTier, values_callable=lambda x: [e.value for e in x]),
        default=LicenseTier.MONTH
    )
    status: Mapped[LicenseStatus] = mapped_column(
        Enum(LicenseStatus, values_callable=lambda x: [e.value for e in x]),
        default=LicenseStatus.ACTIVE
    )
    max_devices: Mapped[int] = mapped_column(Integer, default=2)
    activated_devices: Mapped[int] = mapped_column(Integer, default=0)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    features: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="licenses")
    device_activations: Mapped[list["DeviceActivation"]] = relationship(
        "DeviceActivation", back_populates="license", lazy="selectin"
    )
    subscription: Mapped["Subscription"] = relationship(
        "Subscription", back_populates="license", uselist=False
    )

    def __repr__(self) -> str:
        return f"<License {self.license_key}>"

    @property
    def is_valid(self) -> bool:
        if self.status != LicenseStatus.ACTIVE:
            return False
        if self.expires_at and self.expires_at < datetime.utcnow():
            return False
        return True
