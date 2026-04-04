"""Download endpoints for the app."""

import os
from datetime import datetime, timezone
from pathlib import Path
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.services.settings_service import SettingsService
from app.database import get_session
from app.models import User, License
from app.api.user.profile import get_current_user

router = APIRouter(tags=["Downloads"])

# Local downloads folder
DOWNLOADS_DIR = Path(__file__).parent.parent.parent.parent / "downloads"


@router.get("/download/{platform}")
async def download_app(
    platform: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Download the app for the specified platform. Requires login and active license."""
    if platform not in ("mac", "windows"):
        raise HTTPException(status_code=400, detail="Invalid platform. Use 'mac' or 'windows'")

    # Check if user has an active license
    if not current_user.license_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You need an active license to download. Please purchase a subscription."
        )

    # Verify license is active
    result = await session.execute(
        select(License).where(License.id == current_user.license_id)
    )
    license = result.scalar_one_or_none()

    if not license:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="License not found. Please purchase a subscription."
        )

    if license.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your license is not active. Please renew your subscription."
        )

    if license.expires_at and license.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your license has expired. Please renew your subscription."
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
