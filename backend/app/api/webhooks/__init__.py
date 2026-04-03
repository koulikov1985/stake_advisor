from fastapi import APIRouter

from app.api.webhooks.paddle import router as paddle_router

router = APIRouter(prefix="/webhooks")
router.include_router(paddle_router)
