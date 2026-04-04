"""License validation endpoint."""

from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.config import get_settings
from app.schemas import ValidateRequest, ValidateResponse
from app.services import LicenseService

router = APIRouter()
settings = get_settings()

limiter = Limiter(key_func=get_remote_address)


@router.post("/validate", response_model=ValidateResponse)
@limiter.limit(settings.validate_rate_limit)
async def validate_license(
    request: Request,
    body: ValidateRequest,
    session: AsyncSession = Depends(get_session),
):
    """
    Validate a license key and device.

    Returns license status and features if valid.
    """
    service = LicenseService(session)
    success, license_info, error_code = await service.validate_license(body)

    return ValidateResponse(
        success=success,
        license=license_info,
        error=error_code if not success else None,
        error_code=error_code if not success else None
    )
