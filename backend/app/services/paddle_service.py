import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models import (
    User,
    License,
    Subscription,
    PaddleWebhook,
    LicenseTier,
    LicenseStatus,
    SubscriptionStatus,
)
from app.models.license import generate_license_key

settings = get_settings()


PADDLE_TIER_MAP = {
    "pri_monthly": LicenseTier.MONTHLY,
    "pri_yearly": LicenseTier.YEARLY,
    "pri_lifetime": LicenseTier.LIFETIME,
}


class PaddleService:
    def __init__(self, session: AsyncSession):
        self.session = session

    def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        """Verify Paddle webhook signature."""
        if not settings.paddle_webhook_secret:
            return settings.debug  # Allow in debug mode without secret

        expected = hmac.new(
            settings.paddle_webhook_secret.encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(f"h1={expected}", signature)

    async def process_webhook(self, event_type: str, event_id: str, data: dict[str, Any]) -> bool:
        """Process a Paddle webhook event."""
        # Check for duplicate
        existing = await self.session.execute(
            select(PaddleWebhook).where(PaddleWebhook.paddle_event_id == event_id)
        )
        if existing.scalar_one_or_none():
            return True  # Already processed

        # Store webhook
        webhook = PaddleWebhook(
            paddle_event_id=event_id,
            event_type=event_type,
            payload=data,
            processed=False
        )
        self.session.add(webhook)

        try:
            # Handle event
            if event_type == "subscription.created":
                await self._handle_subscription_created(data)
            elif event_type == "subscription.updated":
                await self._handle_subscription_updated(data)
            elif event_type == "subscription.canceled":
                await self._handle_subscription_canceled(data)
            elif event_type == "subscription.past_due":
                await self._handle_subscription_past_due(data)
            elif event_type == "transaction.completed":
                await self._handle_transaction_completed(data)

            webhook.processed = True
            webhook.processed_at = datetime.utcnow()
            await self.session.commit()
            return True

        except Exception as e:
            webhook.error_message = str(e)
            await self.session.commit()
            raise

    async def _get_or_create_user(self, customer_data: dict[str, Any]) -> User:
        """Get or create a user from Paddle customer data."""
        customer_id = customer_data.get("id")
        email = customer_data.get("email")

        # Try to find by customer ID first
        result = await self.session.execute(
            select(User).where(User.paddle_customer_id == customer_id)
        )
        user = result.scalar_one_or_none()

        if not user and email:
            # Try to find by email
            result = await self.session.execute(
                select(User).where(User.email == email)
            )
            user = result.scalar_one_or_none()

        if not user:
            # Create new user
            user = User(
                email=email,
                paddle_customer_id=customer_id,
                name=customer_data.get("name"),
            )
            self.session.add(user)
            await self.session.flush()
        elif not user.paddle_customer_id:
            user.paddle_customer_id = customer_id

        return user

    async def _handle_subscription_created(self, data: dict[str, Any]) -> None:
        """Handle subscription.created event."""
        subscription_id = data.get("id")
        customer_data = data.get("customer", {})
        items = data.get("items", [])

        # Get tier from price ID
        tier = LicenseTier.MONTHLY
        features = {"basic_advisor": True}

        for item in items:
            price = item.get("price", {})
            price_id = price.get("id", "")
            if price_id in PADDLE_TIER_MAP:
                tier = PADDLE_TIER_MAP[price_id]
            # Could also parse features from metadata

        # Get or create user
        user = await self._get_or_create_user(customer_data)

        # Create license
        license = License(
            user_id=user.id,
            license_key=generate_license_key(),
            tier=tier,
            status=LicenseStatus.ACTIVE,
            max_devices=2,
            features=features,
        )

        # Set expiration based on tier
        if tier == LicenseTier.MONTHLY:
            license.expires_at = datetime.utcnow() + timedelta(days=31)
        elif tier == LicenseTier.YEARLY:
            license.expires_at = datetime.utcnow() + timedelta(days=366)
        elif tier == LicenseTier.LIFETIME:
            license.expires_at = None  # Never expires

        self.session.add(license)
        await self.session.flush()

        # Create subscription
        current_period = data.get("current_billing_period", {})

        # Parse dates and convert to naive UTC
        period_start = None
        period_end = None
        if current_period.get("starts_at"):
            dt = datetime.fromisoformat(current_period["starts_at"].replace("Z", "+00:00"))
            period_start = dt.replace(tzinfo=None)
        if current_period.get("ends_at"):
            dt = datetime.fromisoformat(current_period["ends_at"].replace("Z", "+00:00"))
            period_end = dt.replace(tzinfo=None)

        subscription = Subscription(
            user_id=user.id,
            license_id=license.id,
            paddle_subscription_id=subscription_id,
            status=SubscriptionStatus.ACTIVE,
            current_period_start=period_start,
            current_period_end=period_end,
        )
        self.session.add(subscription)

    async def _handle_subscription_updated(self, data: dict[str, Any]) -> None:
        """Handle subscription.updated event."""
        subscription_id = data.get("id")

        result = await self.session.execute(
            select(Subscription).where(Subscription.paddle_subscription_id == subscription_id)
        )
        subscription = result.scalar_one_or_none()
        if not subscription:
            return

        # Update status
        status_map = {
            "active": SubscriptionStatus.ACTIVE,
            "past_due": SubscriptionStatus.PAST_DUE,
            "canceled": SubscriptionStatus.CANCELED,
            "paused": SubscriptionStatus.PAUSED,
        }
        paddle_status = data.get("status", "active")
        subscription.status = status_map.get(paddle_status, SubscriptionStatus.ACTIVE)

        # Update billing period
        current_period = data.get("current_billing_period", {})
        if current_period.get("starts_at"):
            dt = datetime.fromisoformat(current_period["starts_at"].replace("Z", "+00:00"))
            subscription.current_period_start = dt.replace(tzinfo=None)
        if current_period.get("ends_at"):
            dt = datetime.fromisoformat(current_period["ends_at"].replace("Z", "+00:00"))
            subscription.current_period_end = dt.replace(tzinfo=None)

        # Update license tier if changed
        items = data.get("items", [])
        for item in items:
            price = item.get("price", {})
            price_id = price.get("id", "")
            if price_id in PADDLE_TIER_MAP:
                license = await self.session.get(License, subscription.license_id)
                if license:
                    license.tier = PADDLE_TIER_MAP[price_id]

    async def _handle_subscription_canceled(self, data: dict[str, Any]) -> None:
        """Handle subscription.canceled event."""
        subscription_id = data.get("id")

        result = await self.session.execute(
            select(Subscription).where(Subscription.paddle_subscription_id == subscription_id)
        )
        subscription = result.scalar_one_or_none()
        if not subscription:
            return

        subscription.status = SubscriptionStatus.CANCELED

        # Set license to expire at end of current period
        license = await self.session.get(License, subscription.license_id)
        if license and subscription.current_period_end:
            license.expires_at = subscription.current_period_end

    async def _handle_subscription_past_due(self, data: dict[str, Any]) -> None:
        """Handle subscription.past_due event - grace period."""
        subscription_id = data.get("id")

        result = await self.session.execute(
            select(Subscription).where(Subscription.paddle_subscription_id == subscription_id)
        )
        subscription = result.scalar_one_or_none()
        if not subscription:
            return

        subscription.status = SubscriptionStatus.PAST_DUE

        # License still active during grace period

    async def _handle_transaction_completed(self, data: dict[str, Any]) -> None:
        """Handle transaction.completed event - payment received."""
        subscription_id = data.get("subscription_id")
        if not subscription_id:
            return

        result = await self.session.execute(
            select(Subscription).where(Subscription.paddle_subscription_id == subscription_id)
        )
        subscription = result.scalar_one_or_none()
        if not subscription:
            return

        # Extend license expiration
        license = await self.session.get(License, subscription.license_id)
        if license and license.tier != LicenseTier.LIFETIME:
            if license.tier == LicenseTier.MONTHLY:
                license.expires_at = datetime.utcnow() + timedelta(days=31)
            elif license.tier == LicenseTier.YEARLY:
                license.expires_at = datetime.utcnow() + timedelta(days=366)

            license.status = LicenseStatus.ACTIVE

        # Reactivate subscription if it was past_due
        if subscription.status == SubscriptionStatus.PAST_DUE:
            subscription.status = SubscriptionStatus.ACTIVE
