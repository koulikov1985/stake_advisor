"""License activation/deactivation endpoints."""

from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.config import get_settings
from app.schemas import (
    ActivateRequest,
    ActivateResponse,
    DeactivateRequest,
    DeactivateResponse,
)
from app.services import LicenseService

router = APIRouter()
settings = get_settings()

limiter = Limiter(key_func=get_remote_address)


@router.post("/activate", response_model=ActivateResponse)
@limiter.limit(settings.activate_rate_limit)
async def activate_device(
    request: Request,
    body: ActivateRequest,
    session: AsyncSession = Depends(get_session),
):
    """
    Activate a device for a license.

    Registers the device to the license if within device limit.
    """
    service = LicenseService(session)
    success, license_info, error = await service.activate_device(body)

    return ActivateResponse(
        success=success,
        license=license_info,
        error=error
    )


@router.post("/deactivate", response_model=DeactivateResponse)
@limiter.limit(settings.activate_rate_limit)
async def deactivate_device(
    request: Request,
    body: DeactivateRequest,
    session: AsyncSession = Depends(get_session),
):
    """
    Deactivate a device from a license.

    Removes the device registration, freeing up a device slot.
    """
    service = LicenseService(session)
    success, error = await service.deactivate_device(body)

    return DeactivateResponse(
        success=success,
        error=error
    )
