from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class PricingSettings(BaseModel):
    day_price: int = Field(ge=0, default=500, description="Day pass price in cents")
    week_price: int = Field(ge=0, default=2500, description="Week pass price in cents")
    month_price: int = Field(ge=0, default=6000, description="Monthly price in cents")
    sixmonth_price: int = Field(ge=0, default=31500, description="6-month price in cents")
    year_price: int = Field(ge=0, default=54900, description="Yearly price in cents")
    currency: str = Field(default="USD", max_length=3)


class CommissionSettings(BaseModel):
    default_rate: float = Field(ge=0, le=100, default=10.0, description="Default commission rate percentage")
    min_payout: float = Field(ge=0, default=50.0, description="Minimum payout amount in dollars")
    payment_method: str = Field(default="paypal", description="Default payment method")


class DownloadSettings(BaseModel):
    windows_url: str = ""
    mac_url: str = ""
    version: str = "1.0.0"
    release_notes: str = ""


class FeatureSettings(BaseModel):
    allow_registrations: bool = True
    maintenance_mode: bool = False
    enable_affiliates: bool = True


class LicenseSettings(BaseModel):
    max_devices: int = Field(ge=1, default=2)
    allow_device_reset: bool = True


class SettingResponse(BaseModel):
    key: str
    value: dict
    description: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None

    class Config:
        from_attributes = True


class AllSettingsResponse(BaseModel):
    pricing: PricingSettings
    commission: CommissionSettings
    downloads: DownloadSettings
    features: FeatureSettings


class SettingUpdate(BaseModel):
    value: dict
    description: Optional[str] = None
