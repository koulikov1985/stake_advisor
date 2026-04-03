from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import SystemSetting
from app.models.settings import DEFAULT_SETTINGS
from app.schemas.settings import (
    PricingSettings,
    CommissionSettings,
    DownloadSettings,
    FeatureSettings,
    AllSettingsResponse,
)


class SettingsService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_setting(self, key: str) -> Optional[SystemSetting]:
        """Get a single setting by key."""
        result = await self.session.execute(
            select(SystemSetting).where(SystemSetting.key == key)
        )
        return result.scalar_one_or_none()

    async def get_setting_value(self, key: str, default: dict = None) -> dict:
        """Get setting value, falling back to default if not set."""
        setting = await self.get_setting(key)
        if setting:
            return setting.value
        return default or DEFAULT_SETTINGS.get(key, {})

    async def set_setting(
        self,
        key: str,
        value: dict,
        admin_email: str,
        description: Optional[str] = None,
    ) -> SystemSetting:
        """Create or update a setting."""
        setting = await self.get_setting(key)

        if setting:
            setting.value = value
            setting.updated_by = admin_email
            if description is not None:
                setting.description = description
        else:
            setting = SystemSetting(
                key=key,
                value=value,
                description=description,
                updated_by=admin_email,
            )
            self.session.add(setting)

        await self.session.commit()
        await self.session.refresh(setting)
        return setting

    async def get_all_settings(self) -> AllSettingsResponse:
        """Get all settings with defaults."""
        pricing = await self.get_setting_value("pricing", DEFAULT_SETTINGS["pricing"])
        commission = await self.get_setting_value("commission", DEFAULT_SETTINGS["commission"])
        downloads = await self.get_setting_value("downloads", DEFAULT_SETTINGS["downloads"])
        features = await self.get_setting_value("features", DEFAULT_SETTINGS["features"])

        return AllSettingsResponse(
            pricing=PricingSettings(**pricing),
            commission=CommissionSettings(**commission),
            downloads=DownloadSettings(**downloads),
            features=FeatureSettings(**features),
        )

    async def update_pricing(
        self, data: PricingSettings, admin_email: str
    ) -> SystemSetting:
        """Update pricing settings."""
        return await self.set_setting(
            "pricing",
            data.model_dump(),
            admin_email,
            "Pricing configuration",
        )

    async def update_commission(
        self, data: CommissionSettings, admin_email: str
    ) -> SystemSetting:
        """Update commission settings."""
        return await self.set_setting(
            "commission",
            data.model_dump(),
            admin_email,
            "Affiliate commission configuration",
        )

    async def update_downloads(
        self, data: DownloadSettings, admin_email: str
    ) -> SystemSetting:
        """Update download URLs."""
        return await self.set_setting(
            "downloads",
            data.model_dump(),
            admin_email,
            "Application download URLs",
        )

    async def update_features(
        self, data: FeatureSettings, admin_email: str
    ) -> SystemSetting:
        """Update feature flags."""
        return await self.set_setting(
            "features",
            data.model_dump(),
            admin_email,
            "Feature configuration",
        )

    async def initialize_defaults(self) -> None:
        """Initialize default settings if they don't exist."""
        for key, value in DEFAULT_SETTINGS.items():
            existing = await self.get_setting(key)
            if not existing:
                setting = SystemSetting(
                    key=key,
                    value=value,
                    description=f"Default {key} settings",
                    updated_by="system",
                )
                self.session.add(setting)
        await self.session.commit()
