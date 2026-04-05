"""Payment API endpoints for Stripe integration."""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.services import StripeService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/payment", tags=["Payment"])


class CreateCheckoutRequest(BaseModel):
    plan: str  # daily, weekly, monthly, yearly
    email: Optional[EmailStr] = None
    referral_code: Optional[str] = None


class CreateCheckoutResponse(BaseModel):
    url: str
    session_id: str


class CreatePortalRequest(BaseModel):
    email: EmailStr


class CreatePortalResponse(BaseModel):
    url: str


class SessionDetailsResponse(BaseModel):
    email: str
    license_key: Optional[str] = None
    plan: Optional[str] = None
    expires_at: Optional[str] = None
    message: Optional[str] = None
    processing: bool = False


@router.post("/create-checkout-session", response_model=CreateCheckoutResponse)
async def create_checkout_session(
    data: CreateCheckoutRequest,
    session: AsyncSession = Depends(get_session),
):
    """
    Create a Stripe Checkout session for subscription.

    Returns the checkout URL to redirect the user to.
    """
    service = StripeService(session)

    try:
        result = await service.create_checkout_session(
            plan=data.plan,
            email=data.email,
            referral_code=data.referral_code,
        )
        return CreateCheckoutResponse(**result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.exception(f"Error creating checkout session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create checkout session"
        )


@router.post("/create-portal-session", response_model=CreatePortalResponse)
async def create_portal_session(
    data: CreatePortalRequest,
    session: AsyncSession = Depends(get_session),
):
    """
    Create a Stripe Customer Portal session for managing subscription.

    Returns the portal URL to redirect the user to.
    """
    service = StripeService(session)

    try:
        result = await service.create_portal_session(email=data.email)
        return CreatePortalResponse(**result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.exception(f"Error creating portal session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create portal session"
        )


@router.get("/session/{session_id}", response_model=SessionDetailsResponse)
async def get_session_details(
    session_id: str,
    session: AsyncSession = Depends(get_session),
):
    """
    Get checkout session details including license information.

    Used by the success page to display license info after payment.
    """
    service = StripeService(session)

    try:
        result = await service.get_session_details(session_id)
        return SessionDetailsResponse(**result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.exception(f"Error fetching session details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch session details"
        )
