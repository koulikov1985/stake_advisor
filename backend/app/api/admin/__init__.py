from fastapi import APIRouter

from app.api.admin.auth import router as auth_router
from app.api.admin.analytics import router as analytics_router
from app.api.admin.affiliates import router as affiliates_router
from app.api.admin.users import router as users_router
from app.api.admin.settings import router as settings_router
from app.api.admin.audit import router as audit_router

router = APIRouter(prefix="/api/admin")
router.include_router(auth_router)
router.include_router(analytics_router)
router.include_router(affiliates_router)
router.include_router(users_router)
router.include_router(settings_router)
router.include_router(audit_router)
