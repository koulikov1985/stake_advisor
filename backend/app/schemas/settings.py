from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class PricingSettings(BaseModel):
    monthly_price: int = Field(ge=0, description="Monthly price in cents")
    yearly_price: int = Field(ge=0, description="Yearly price in cents")
    lifetime_price: int = Field(ge=0, description="Lifetime price in cents")
    currency: str = Field(default="USD", max_length=3)


class CommissionSettings(BaseModel):
    default_rate: int = Field(ge=0, le=100, description="Default commission rate percentage")
    minimum_payout: int = Field(ge=0, description="Minimum payout amount in cents")


class DownloadSettings(BaseModel):
    windows_url: Optional[str] = None
    mac_url: Optional[str] = None
    linux_url: Optional[str] = None


class FeatureSettings(BaseModel):
    affiliate_program_enabled: bool = True
    free_trial_days: int = Field(ge=0, default=7)
    max_devices_per_license: int = Field(ge=1, default=2)


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
