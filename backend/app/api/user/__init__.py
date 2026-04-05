from fastapi import APIRouter

from app.api.user.auth import router as auth_router
from app.api.user.profile import router as profile_router
from app.api.user.download import router as download_router
from app.api.user.affiliate import router as affiliate_router

router = APIRouter(prefix="/api/user")
router.include_router(auth_router)
router.include_router(profile_router)
router.include_router(download_router)
router.include_router(affiliate_router)
