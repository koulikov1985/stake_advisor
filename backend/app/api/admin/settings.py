from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import AdminUser
from app.schemas.settings import (
    PricingSettings,
    CommissionSettings,
    DownloadSettings,
    FeatureSettings,
    AllSettingsResponse,
    SettingResponse,
)
from app.services.settings_service import SettingsService
from app.services.admin_service import AuditService
from app.api.admin.deps import (
    get_current_admin,
    require_super_admin,
    get_client_ip,
    get_user_agent,
)

router = APIRouter(prefix="/settings", tags=["Admin Settings"])


@router.get("", response_model=AllSettingsResponse)
async def get_all_settings(
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get all system settings."""
    service = SettingsService(session)
    return await service.get_all_settings()


@router.put("/pricing", response_model=SettingResponse)
async def update_pricing(
    request: Request,
    data: PricingSettings,
    admin: AdminUser = Depends(require_super_admin),
    session: AsyncSession = Depends(get_session),
):
    """Update pricing settings (super_admin only)."""
    service = SettingsService(session)
    audit = AuditService(session)

    old_value = await service.get_setting_value("pricing")
    setting = await service.update_pricing(data, admin.email)

    await audit.log(
        entity_type="system_setting",
        entity_id="pricing",
        action="update",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        old_values=old_value,
        new_values=data.model_dump(),
    )

    return SettingResponse(
        key=setting.key,
        value=setting.value,
        description=setting.description,
        updated_at=setting.updated_at,
        updated_by=setting.updated_by,
    )


@router.put("/commission", response_model=SettingResponse)
async def update_commission(
    request: Request,
    data: CommissionSettings,
    admin: AdminUser = Depends(require_super_admin),
    session: AsyncSession = Depends(get_session),
):
    """Update commission settings (super_admin only)."""
    service = SettingsService(session)
    audit = AuditService(session)

    old_value = await service.get_setting_value("commission")
    setting = await service.update_commission(data, admin.email)

    await audit.log(
        entity_type="system_setting",
        entity_id="commission",
        action="update",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        old_values=old_value,
        new_values=data.model_dump(),
    )

    return SettingResponse(
        key=setting.key,
        value=setting.value,
        description=setting.description,
        updated_at=setting.updated_at,
        updated_by=setting.updated_by,
    )


@router.put("/downloads", response_model=SettingResponse)
async def update_downloads(
    request: Request,
    data: DownloadSettings,
    admin: AdminUser = Depends(require_super_admin),
    session: AsyncSession = Depends(get_session),
):
    """Update download URLs (super_admin only)."""
    service = SettingsService(session)
    audit = AuditService(session)

    old_value = await service.get_setting_value("downloads")
    setting = await service.update_downloads(data, admin.email)

    await audit.log(
        entity_type="system_setting",
        entity_id="downloads",
        action="update",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        old_values=old_value,
        new_values=data.model_dump(),
    )

    return SettingResponse(
        key=setting.key,
        value=setting.value,
        description=setting.description,
        updated_at=setting.updated_at,
        updated_by=setting.updated_by,
    )


@router.put("/features", response_model=SettingResponse)
async def update_features(
    request: Request,
    data: FeatureSettings,
    admin: AdminUser = Depends(require_super_admin),
    session: AsyncSession = Depends(get_session),
):
    """Update feature flags (super_admin only)."""
    service = SettingsService(session)
    audit = AuditService(session)

    old_value = await service.get_setting_value("features")
    setting = await service.update_features(data, admin.email)

    await audit.log(
        entity_type="system_setting",
        entity_id="features",
        action="update",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        old_values=old_value,
        new_values=data.model_dump(),
    )

    return SettingResponse(
        key=setting.key,
        value=setting.value,
        description=setting.description,
        updated_at=setting.updated_at,
        updated_by=setting.updated_by,
    )
