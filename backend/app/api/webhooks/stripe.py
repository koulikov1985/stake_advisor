"""Stripe webhook handler."""

import logging
from fastapi import APIRouter, Depends, Request, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.services import StripeService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    session: AsyncSession = Depends(get_session),
    stripe_signature: str = Header(None, alias="Stripe-Signature"),
):
    """
    Handle Stripe webhook events.

    Verifies signature and processes subscription events.
    """
    body = await request.body()

    service = StripeService(session)

    try:
        # Verify signature and construct event
        event = service.verify_webhook_signature(body, stripe_signature)
    except ValueError as e:
        logger.error(f"Invalid webhook payload: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except Exception as e:
        logger.error(f"Webhook signature verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid signature")

    event_type = event.get("type")
    event_id = event.get("id")

    logger.info(f"Received Stripe webhook: {event_type} ({event_id})")

    # Process webhook
    try:
        await service.process_webhook(event)
    except Exception as e:
        logger.exception(f"Error processing webhook {event_id}: {e}")
        # Still return 200 to prevent Stripe retries, but log the error
        return {"status": "error", "message": str(e)}

    return {"status": "received"}
