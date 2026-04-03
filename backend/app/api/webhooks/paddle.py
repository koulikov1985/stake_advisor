import logging
from fastapi import APIRouter, Depends, Request, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.services import PaddleService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/paddle")
async def paddle_webhook(
    request: Request,
    session: AsyncSession = Depends(get_session),
    paddle_signature: str = Header(None, alias="Paddle-Signature"),
):
    """
    Handle Paddle webhook events.

    Verifies signature and processes subscription events.
    """
    body = await request.body()

    service = PaddleService(session)

    # Verify signature
    if paddle_signature and not service.verify_webhook_signature(body, paddle_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")

    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    event_type = payload.get("event_type")
    event_id = payload.get("event_id")
    data = payload.get("data", {})

    if not event_type or not event_id:
        raise HTTPException(status_code=400, detail="Missing event_type or event_id")

    # Process webhook
    try:
        await service.process_webhook(event_type, event_id, data)
    except Exception as e:
        logger.exception(f"Error processing webhook {event_id}: {e}")
        # Still return 200 to prevent Paddle retries, but log the error
        return {"status": "error", "message": str(e)}

    return {"status": "received"}
