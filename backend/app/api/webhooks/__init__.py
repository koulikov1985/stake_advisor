from fastapi import APIRouter

from app.api.webhooks.paddle import router as paddle_router
from app.api.webhooks.stripe import router as stripe_router

router = APIRouter(prefix="/webhooks")
router.include_router(paddle_router)
router.include_router(stripe_router)
