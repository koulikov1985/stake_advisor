import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.database import Base


class SystemSetting(Base):
    __tablename__ = "system_settings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    key: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    value: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by: Mapped[str | None] = mapped_column(String(255), nullable=True)

    def __repr__(self) -> str:
        return f"<SystemSetting {self.key}>"


# Default settings keys
DEFAULT_SETTINGS = {
    "pricing": {
        "monthly_price": 999,  # $9.99 in cents
        "yearly_price": 7999,  # $79.99 in cents
        "lifetime_price": 19999,  # $199.99 in cents
        "currency": "USD",
    },
    "commission": {
        "default_rate": 20,  # 20%
        "minimum_payout": 5000,  # $50.00 in cents
    },
    "downloads": {
        "windows_url": "",
        "mac_url": "",
        "linux_url": "",
    },
    "features": {
        "affiliate_program_enabled": True,
        "free_trial_days": 7,
        "max_devices_per_license": 2,
    },
}
