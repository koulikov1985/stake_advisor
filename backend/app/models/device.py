import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.database import Base


class DeviceActivation(Base):
    __tablename__ = "device_activations"
    __table_args__ = (
        UniqueConstraint("license_id", "device_fingerprint", name="uq_license_device"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    license_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("licenses.id"), nullable=False
    )
    device_fingerprint: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    device_info: Mapped[dict] = mapped_column(JSONB, default=dict)
    activated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_validated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    license: Mapped["License"] = relationship("License", back_populates="device_activations")

    def __repr__(self) -> str:
        return f"<DeviceActivation {self.device_fingerprint[:8]}...>"
