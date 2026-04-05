"""Download endpoints for the app."""

from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status, Query
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from jose import jwt, JWTError

from app.services.settings_service import SettingsService
from app.database import get_session
from app.models import User, License, LicenseStatus
from app.config import get_settings

settings = get_settings()

router = APIRouter(tags=["Downloads"])

# Local downloads folder
DOWNLOADS_DIR = Path(__file__).parent.parent.parent.parent / "downloads"


async def get_user_from_token(token: str, session: AsyncSession) -> User:
    """Get user from JWT token."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        result = await session.execute(
            select(User).options(selectinload(User.licenses)).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/download/{platform}")
async def download_app(
    platform: str,
    token: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_session),
):
    """Download the app for the specified platform. Requires login and active license."""
    if platform not in ("mac", "windows"):
        raise HTTPException(status_code=400, detail="Invalid platform. Use 'mac' or 'windows'")

    # Get user from token
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")

    current_user = await get_user_from_token(token, session)

    # Check if user has any licenses
    if not current_user.licenses:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You need an active license to download. Please purchase a subscription."
        )

    # Find an active license
    active_license = None
    now = datetime.now(timezone.utc)
    for lic in current_user.licenses:
        if lic.status == LicenseStatus.ACTIVE:
            if not lic.expires_at:
                active_license = lic
                break
            # Make expires_at timezone aware if it's naive
            exp = lic.expires_at
            if exp.tzinfo is None:
                exp = exp.replace(tzinfo=timezone.utc)
            if exp >= now:
                active_license = lic
                break

    if not active_license:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your license is not active or has expired. Please renew your subscription."
        )

    # Check for local file first
    if platform == "mac":
        local_file = DOWNLOADS_DIR / "PokerSharkScope-Mac.zip"
        filename = "PokerSharkScope-Mac.zip"
    else:
        local_file = DOWNLOADS_DIR / "PokerSharkScope-Windows.zip"
        filename = "PokerSharkScope-Windows.zip"

    # If local file exists, serve it directly
    if local_file.exists():
        return FileResponse(
            path=str(local_file),
            filename=filename,
            media_type="application/zip"
        )

    # Otherwise, check for external URL in settings
    settings_service = SettingsService(session)
    downloads = await settings_service.get_setting_value("downloads", {})

    if platform == "mac":
        url = downloads.get("mac_url")
    else:
        url = downloads.get("windows_url")

    if url:
        return RedirectResponse(url=url)

    raise HTTPException(
        status_code=404,
        detail=f"Download for {platform} is not available. Please contact support."
    )
