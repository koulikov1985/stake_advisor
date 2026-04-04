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
        "day_price": 299,      # $2.99 in cents
        "week_price": 999,     # $9.99 in cents
        "month_price": 2999,   # $29.99 in cents
        "year_price": 19999,   # $199.99 in cents
        "currency": "USD",
    },
    "downloads": {
        "windows_url": "",
        "mac_url": "",
        "version": "1.0.0",
        "release_notes": "",
    },
    "license": {
        "max_devices": 2,
        "allow_device_reset": True,
    },
    "commission": {
        "default_rate": 10.0,  # 10% default commission rate
        "min_payout": 50.0,    # Minimum payout threshold
        "payment_method": "paypal",
    },
    "features": {
        "allow_registrations": True,
        "maintenance_mode": False,
        "enable_affiliates": True,
    },
}
