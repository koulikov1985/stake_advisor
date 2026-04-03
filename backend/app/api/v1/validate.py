from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
import redis.asyncio as redis

from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.config import get_settings
from app.schemas import ValidateRequest, ValidateResponse
from app.services import LicenseService

router = APIRouter()
settings = get_settings()

limiter = Limiter(key_func=get_remote_address)


async def get_redis() -> redis.Redis:
    return redis.from_url(settings.redis_url, decode_responses=True)


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
    redis_client = await get_redis()
    try:
        service = LicenseService(session, redis_client)
        success, license_info, error = await service.validate_license(body)

        return ValidateResponse(
            success=success,
            license=license_info,
            error=error
        )
    finally:
        await redis_client.close()
