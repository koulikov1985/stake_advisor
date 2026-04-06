"""Stripe payment service for handling subscriptions and webhooks."""

import logging
from datetime import datetime, timedelta
from typing import Any, Optional

import stripe
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models import (
    User,
    License,
    Subscription,
    StripeWebhook,
    LicenseTier,
    LicenseStatus,
    SubscriptionStatus,
)
from app.models.license import generate_license_key
from app.models.affiliate import Referral, Commission, CommissionStatus

settings = get_settings()
logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = settings.stripe_secret_key

# Plan configurations
PLANS = {
    "daily": {
        "price_id": settings.stripe_price_daily,
        "duration": 1,
        "name": "1-Day Pass",
        "tier": LicenseTier.DAY,
    },
    "weekly": {
        "price_id": settings.stripe_price_weekly,
        "duration": 7,
        "name": "Weekly Access",
        "tier": LicenseTier.WEEK,
    },
    "monthly": {
        "price_id": settings.stripe_price_monthly,
        "duration": 30,
        "name": "Monthly",
        "tier": LicenseTier.MONTH,
    },
    "yearly": {
        "price_id": settings.stripe_price_yearly,
        "duration": 365,
        "name": "Yearly",
        "tier": LicenseTier.YEAR,
    },
}

# Reverse lookup: price_id -> plan name
PRICE_TO_PLAN = {config["price_id"]: name for name, config in PLANS.items() if config["price_id"]}


class StripeService:
    def __init__(self, session: AsyncSession):
        self.session = session

    def verify_webhook_signature(self, payload: bytes, signature: str) -> dict:
        """Verify Stripe webhook signature and return event."""
        if not settings.stripe_webhook_secret:
            if settings.debug:
                # In debug mode without secret, just parse the payload
                import json
                return json.loads(payload)
            raise ValueError("Stripe webhook secret not configured")

        return stripe.Webhook.construct_event(
            payload,
            signature,
            settings.stripe_webhook_secret
        )

    async def create_checkout_session(
        self,
        plan: str,
        email: Optional[str] = None,
        user_id: Optional[str] = None,
        referral_code: Optional[str] = None,
        success_url: Optional[str] = None,
        cancel_url: Optional[str] = None,
    ) -> dict:
        """Create a Stripe Checkout session."""
        if plan not in PLANS:
            raise ValueError(f"Invalid plan: {plan}")

        plan_config = PLANS[plan]
        if not plan_config["price_id"]:
            raise ValueError(f"Price ID not configured for plan: {plan}")

        frontend_url = settings.frontend_url
        if not success_url:
            success_url = f"{frontend_url}/dashboard?payment=success"
        if not cancel_url:
            cancel_url = f"{frontend_url}/dashboard?payment=canceled"

        session_params = {
            "payment_method_types": ["card"],
            "line_items": [
                {
                    "price": plan_config["price_id"],
                    "quantity": 1,
                }
            ],
            "mode": "subscription",
            "success_url": success_url,
            "cancel_url": cancel_url,
            "subscription_data": {
                "metadata": {
                    "plan": plan,
                    "duration_days": str(plan_config["duration"]),
                }
            },
            "metadata": {
                "plan": plan,
                "referral_code": referral_code or "",
                "user_id": user_id or "",
            },
        }

        if email:
            session_params["customer_email"] = email

        checkout_session = stripe.checkout.Session.create(**session_params)

        return {
            "url": checkout_session.url,
            "session_id": checkout_session.id,
        }

    async def create_portal_session(self, email: str) -> dict:
        """Create a Stripe Customer Portal session for subscription management."""
        # Get user's Stripe customer ID
        result = await self.session.execute(
            select(User).where(User.email == email.lower())
        )
        user = result.scalar_one_or_none()

        if not user or not user.stripe_customer_id:
            raise ValueError("No subscription found for this email")

        portal_session = stripe.billing_portal.Session.create(
            customer=user.stripe_customer_id,
            return_url=f"{settings.frontend_url}/dashboard",
        )

        return {"url": portal_session.url}

    async def get_session_details(self, session_id: str) -> dict:
        """Get checkout session details including license info."""
        checkout_session = stripe.checkout.Session.retrieve(session_id)

        if checkout_session.payment_status != "paid":
            raise ValueError("Payment not completed")

        email = checkout_session.customer_email or checkout_session.get("customer_details", {}).get("email")

        if not email:
            raise ValueError("No email found in session")

        # Get license from database
        result = await self.session.execute(
            select(User).where(User.email == email.lower())
        )
        user = result.scalar_one_or_none()

        if not user:
            return {
                "message": "License is being processed, please wait a moment",
                "email": email,
                "processing": True,
            }

        # Get active license
        result = await self.session.execute(
            select(License)
            .where(License.user_id == user.id)
            .where(License.status == LicenseStatus.ACTIVE)
            .order_by(License.created_at.desc())
        )
        license = result.scalar_one_or_none()

        if not license:
            return {
                "message": "License is being processed, please wait a moment",
                "email": email,
                "processing": True,
            }

        return {
            "email": email,
            "license_key": license.license_key,
            "plan": license.tier.value,
            "expires_at": license.expires_at.isoformat() if license.expires_at else None,
        }

    async def process_webhook(self, event: dict) -> bool:
        """Process a Stripe webhook event."""
        event_id = event.get("id")
        event_type = event.get("type")
        data = event.get("data", {}).get("object", {})

        # Check for duplicate
        existing = await self.session.execute(
            select(StripeWebhook).where(StripeWebhook.stripe_event_id == event_id)
        )
        if existing.scalar_one_or_none():
            logger.info(f"Webhook {event_id} already processed")
            return True

        # Store webhook
        webhook = StripeWebhook(
            stripe_event_id=event_id,
            event_type=event_type,
            payload=event,
            processed=False,
        )
        self.session.add(webhook)

        try:
            # Handle event
            if event_type == "checkout.session.completed":
                await self._handle_checkout_complete(data, event.get("data", {}).get("object", {}))
            elif event_type == "customer.subscription.created":
                await self._handle_subscription_created(data)
            elif event_type == "customer.subscription.updated":
                await self._handle_subscription_updated(data)
            elif event_type == "customer.subscription.deleted":
                await self._handle_subscription_canceled(data)
            elif event_type == "invoice.paid":
                await self._handle_invoice_paid(data)
            elif event_type == "invoice.payment_failed":
                await self._handle_payment_failed(data)

            webhook.processed = True
            webhook.processed_at = datetime.utcnow()
            await self.session.commit()
            return True

        except Exception as e:
            logger.exception(f"Error processing webhook {event_id}: {e}")
            webhook.error_message = str(e)
            await self.session.commit()
            raise

    async def _get_or_create_user(self, email: str, customer_id: str, name: Optional[str] = None) -> User:
        """Get or create a user from Stripe customer data."""
        email = email.lower()

        # Try to find by Stripe customer ID first
        result = await self.session.execute(
            select(User).where(User.stripe_customer_id == customer_id)
        )
        user = result.scalar_one_or_none()

        if not user:
            # Try to find by email
            result = await self.session.execute(
                select(User).where(User.email == email)
            )
            user = result.scalar_one_or_none()

        if not user:
            # Create new user
            user = User(
                email=email,
                stripe_customer_id=customer_id,
                name=name,
                email_verified=True,  # They paid, so email is valid
            )
            self.session.add(user)
            await self.session.flush()
        elif not user.stripe_customer_id:
            user.stripe_customer_id = customer_id

        return user

    async def _handle_checkout_complete(self, session: dict, full_data: dict) -> None:
        """Handle checkout.session.completed event."""
        email = session.get("customer_email") or session.get("customer_details", {}).get("email")
        customer_id = session.get("customer")
        subscription_id = session.get("subscription")
        metadata = session.get("metadata", {})

        if not email:
            logger.error(f"Missing email in checkout session: {session.get('id')}")
            return

        # Get plan info
        plan = metadata.get("plan", "monthly")
        referral_code = metadata.get("referral_code")

        plan_config = PLANS.get(plan, PLANS["monthly"])
        tier = plan_config["tier"]
        duration_days = plan_config["duration"]

        # Get or create user
        user = await self._get_or_create_user(email, customer_id)

        # Check if user already has an active license
        result = await self.session.execute(
            select(License)
            .where(License.user_id == user.id)
            .where(License.status == LicenseStatus.ACTIVE)
        )
        existing_license = result.scalar_one_or_none()

        if existing_license:
            # Update existing license
            existing_license.tier = tier
            existing_license.expires_at = datetime.utcnow() + timedelta(days=duration_days)
            license = existing_license
        else:
            # Create new license
            license = License(
                user_id=user.id,
                license_key=generate_license_key(),
                tier=tier,
                status=LicenseStatus.ACTIVE,
                max_devices=2,
                features={"basic_advisor": True},
                expires_at=datetime.utcnow() + timedelta(days=duration_days),
            )
            self.session.add(license)
            await self.session.flush()

        # Create or update subscription record
        if subscription_id:
            result = await self.session.execute(
                select(Subscription).where(Subscription.stripe_subscription_id == subscription_id)
            )
            existing_sub = result.scalar_one_or_none()

            if not existing_sub:
                subscription = Subscription(
                    user_id=user.id,
                    license_id=license.id,
                    stripe_subscription_id=subscription_id,
                    status=SubscriptionStatus.ACTIVE,
                    current_period_start=datetime.utcnow(),
                    current_period_end=datetime.utcnow() + timedelta(days=duration_days),
                )
                self.session.add(subscription)

        logger.info(f"Checkout completed for {email}, plan: {plan}")

        # Handle referral conversion and commission
        await self._process_referral_conversion(user, plan_config, session)

    async def _process_referral_conversion(self, user: User, plan_config: dict, checkout_session: dict) -> None:
        """Process referral conversion when a referred user makes a payment."""
        # Check if user was referred
        if not user.referred_by_id:
            return

        # Find the referral record
        result = await self.session.execute(
            select(Referral).where(Referral.referred_user_id == user.id)
        )
        referral = result.scalar_one_or_none()

        if not referral:
            logger.warning(f"Referral record not found for user {user.email}")
            return

        # Get the affiliate
        affiliate_result = await self.session.execute(
            select(User).where(User.id == user.referred_by_id)
        )
        affiliate = affiliate_result.scalar_one_or_none()

        if not affiliate or not affiliate.is_affiliate:
            logger.warning(f"Affiliate not found or not active for user {user.email}")
            return

        # Mark referral as converted (if not already)
        if not referral.converted:
            referral.converted = True
            referral.converted_at = datetime.utcnow()
            logger.info(f"Referral marked as converted: {user.email} -> {affiliate.email}")

        # Calculate commission (15% default, or custom rate)
        commission_rate = affiliate.custom_commission_rate or 15

        # Get payment amount from plan (in cents)
        plan_prices = {
            "daily": 500,      # $5
            "weekly": 2500,    # $25
            "monthly": 6000,   # $60
            "yearly": 54900,   # $549
        }
        tier_value = plan_config["tier"].value if hasattr(plan_config["tier"], 'value') else plan_config["tier"]
        base_amount = plan_prices.get(tier_value, 6000)  # Default to monthly
        commission_amount = int(base_amount * commission_rate / 100)

        # Create commission record
        commission = Commission(
            affiliate_id=affiliate.id,
            referral_id=referral.id,
            amount=commission_amount,
            currency="USD",
            commission_rate=commission_rate,
            base_amount=base_amount,
            status=CommissionStatus.PENDING,
        )
        self.session.add(commission)

        logger.info(f"Commission created: ${commission_amount/100:.2f} for {affiliate.email} (referral: {user.email})")

    async def _handle_subscription_created(self, data: dict) -> None:
        """Handle customer.subscription.created event."""
        # Most handling done in checkout.session.completed
        logger.info(f"Subscription created: {data.get('id')}")

    async def _handle_subscription_updated(self, data: dict) -> None:
        """Handle customer.subscription.updated event."""
        subscription_id = data.get("id")

        result = await self.session.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == subscription_id)
        )
        subscription = result.scalar_one_or_none()

        if not subscription:
            logger.warning(f"Subscription not found: {subscription_id}")
            return

        # Update status
        status_map = {
            "active": SubscriptionStatus.ACTIVE,
            "past_due": SubscriptionStatus.PAST_DUE,
            "canceled": SubscriptionStatus.CANCELED,
            "paused": SubscriptionStatus.PAUSED,
            "unpaid": SubscriptionStatus.PAST_DUE,
        }
        stripe_status = data.get("status", "active")
        subscription.status = status_map.get(stripe_status, SubscriptionStatus.ACTIVE)

        # Update billing period
        current_period_start = data.get("current_period_start")
        current_period_end = data.get("current_period_end")

        if current_period_start:
            subscription.current_period_start = datetime.fromtimestamp(current_period_start)
        if current_period_end:
            subscription.current_period_end = datetime.fromtimestamp(current_period_end)

        # Update license tier if plan changed
        items = data.get("items", {}).get("data", [])
        for item in items:
            price_id = item.get("price", {}).get("id")
            if price_id and price_id in PRICE_TO_PLAN:
                plan_name = PRICE_TO_PLAN[price_id]
                plan_config = PLANS[plan_name]
                license = await self.session.get(License, subscription.license_id)
                if license:
                    license.tier = plan_config["tier"]

        logger.info(f"Subscription updated: {subscription_id}")

    async def _handle_subscription_canceled(self, data: dict) -> None:
        """Handle customer.subscription.deleted event."""
        subscription_id = data.get("id")

        result = await self.session.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == subscription_id)
        )
        subscription = result.scalar_one_or_none()

        if not subscription:
            logger.warning(f"Subscription not found: {subscription_id}")
            return

        subscription.status = SubscriptionStatus.CANCELED

        # Set license to expire at end of current period
        license = await self.session.get(License, subscription.license_id)
        if license and subscription.current_period_end:
            license.expires_at = subscription.current_period_end

        logger.info(f"Subscription canceled: {subscription_id}")

    async def _handle_invoice_paid(self, data: dict) -> None:
        """Handle invoice.paid event - renewal payment received."""
        subscription_id = data.get("subscription")
        if not subscription_id:
            return

        result = await self.session.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == subscription_id)
        )
        subscription = result.scalar_one_or_none()

        if not subscription:
            return

        # Get period from invoice
        period_start = data.get("lines", {}).get("data", [{}])[0].get("period", {}).get("start")
        period_end = data.get("lines", {}).get("data", [{}])[0].get("period", {}).get("end")

        if period_start:
            subscription.current_period_start = datetime.fromtimestamp(period_start)
        if period_end:
            subscription.current_period_end = datetime.fromtimestamp(period_end)

        # Extend license expiration
        license = await self.session.get(License, subscription.license_id)
        if license and period_end:
            license.expires_at = datetime.fromtimestamp(period_end)
            license.status = LicenseStatus.ACTIVE

        # Reactivate subscription if it was past_due
        if subscription.status == SubscriptionStatus.PAST_DUE:
            subscription.status = SubscriptionStatus.ACTIVE

        logger.info(f"Invoice paid for subscription: {subscription_id}")

    async def _handle_payment_failed(self, data: dict) -> None:
        """Handle invoice.payment_failed event."""
        subscription_id = data.get("subscription")
        if not subscription_id:
            return

        result = await self.session.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == subscription_id)
        )
        subscription = result.scalar_one_or_none()

        if subscription:
            subscription.status = SubscriptionStatus.PAST_DUE
            logger.info(f"Payment failed for subscription: {subscription_id}")
