"""Download endpoints for the app."""

from datetime import datetime, timezone
from pathlib import Path
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.services.settings_service import SettingsService
from app.database import get_session
from app.models import User, License, LicenseStatus
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

    # Check if user has any licenses
    if not current_user.licenses:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You need an active license to download. Please purchase a subscription."
        )

    # Find an active license
    active_license = None
    for lic in current_user.licenses:
        if lic.status == LicenseStatus.ACTIVE:
            if not lic.expires_at or lic.expires_at >= datetime.now(timezone.utc):
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
