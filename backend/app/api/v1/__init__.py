from fastapi import APIRouter

from app.api.v1.validate import router as validate_router
from app.api.v1.activate import router as activate_router

router = APIRouter(prefix="/v1")
router.include_router(validate_router)
router.include_router(activate_router)
