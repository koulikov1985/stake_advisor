import hashlib
import hmac
import json
import pytest
from httpx import AsyncClient
from sqlalchemy import select

from app.config import get_settings
from app.models import User, License, Subscription, PaddleWebhook

settings = get_settings()


def generate_paddle_signature(payload: dict) -> str:
    """Generate Paddle webhook signature."""
    body = json.dumps(payload).encode()
    signature = hmac.new(
        settings.paddle_webhook_secret.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    return f"h1={signature}"


class TestPaddleWebhooks:
    @pytest.mark.asyncio
    async def test_subscription_created(self, client: AsyncClient, session):
        """Test handling subscription.created webhook."""
        payload = {
            "event_id": "evt_test_subscription_created",
            "event_type": "subscription.created",
            "occurred_at": "2024-01-15T10:00:00Z",
            "notification_id": "ntf_test_123",
            "data": {
                "id": "sub_test_123",
                "status": "active",
                "customer": {
                    "id": "ctm_new_customer",
                    "email": "newuser@example.com",
                    "name": "New User",
                },
                "items": [
                    {
                        "price": {
                            "id": "pri_monthly",
                        }
                    }
                ],
                "current_billing_period": {
                    "starts_at": "2024-01-15T00:00:00Z",
                    "ends_at": "2024-02-15T00:00:00Z",
                },
            },
        }

        response = await client.post(
            "/webhooks/paddle",
            json=payload,
        )

        assert response.status_code == 200

        # Verify webhook was stored
        result = await session.execute(
            select(PaddleWebhook).where(
                PaddleWebhook.paddle_event_id == "evt_test_subscription_created"
            )
        )
        webhook = result.scalar_one_or_none()
        assert webhook is not None
        assert webhook.event_type == "subscription.created"
        assert webhook.processed is True

        # Verify user was created
        result = await session.execute(
            select(User).where(User.email == "newuser@example.com")
        )
        user = result.scalar_one_or_none()
        assert user is not None
        assert user.paddle_customer_id == "ctm_new_customer"

        # Verify license was created
        result = await session.execute(
            select(License).where(License.user_id == user.id)
        )
        license = result.scalar_one_or_none()
        assert license is not None
        assert license.license_key.startswith("SA-")

        # Verify subscription was created
        result = await session.execute(
            select(Subscription).where(Subscription.paddle_subscription_id == "sub_test_123")
        )
        subscription = result.scalar_one_or_none()
        assert subscription is not None

    @pytest.mark.asyncio
    async def test_subscription_canceled(self, client: AsyncClient, session, test_license):
        """Test handling subscription.canceled webhook."""
        # First create a subscription
        from app.models import Subscription, SubscriptionStatus
        from app.models.user import User

        result = await session.execute(select(User).where(User.id == test_license.user_id))
        user = result.scalar_one()

        subscription = Subscription(
            user_id=user.id,
            license_id=test_license.id,
            paddle_subscription_id="sub_to_cancel",
            status=SubscriptionStatus.ACTIVE,
        )
        session.add(subscription)
        await session.commit()

        payload = {
            "event_id": "evt_test_subscription_canceled",
            "event_type": "subscription.canceled",
            "occurred_at": "2024-01-20T10:00:00Z",
            "notification_id": "ntf_test_456",
            "data": {
                "id": "sub_to_cancel",
                "status": "canceled",
            },
        }

        response = await client.post(
            "/webhooks/paddle",
            json=payload,
        )

        assert response.status_code == 200

        # Verify subscription was updated
        await session.refresh(subscription)
        assert subscription.status == SubscriptionStatus.CANCELED

    @pytest.mark.asyncio
    async def test_duplicate_webhook(self, client: AsyncClient, session):
        """Test that duplicate webhooks are handled gracefully."""
        payload = {
            "event_id": "evt_duplicate_test",
            "event_type": "subscription.updated",
            "occurred_at": "2024-01-15T10:00:00Z",
            "notification_id": "ntf_test_dup",
            "data": {"id": "sub_dup"},
        }

        # First request
        response1 = await client.post("/webhooks/paddle", json=payload)
        assert response1.status_code == 200

        # Duplicate request
        response2 = await client.post("/webhooks/paddle", json=payload)
        assert response2.status_code == 200

        # Should only have one webhook record
        result = await session.execute(
            select(PaddleWebhook).where(
                PaddleWebhook.paddle_event_id == "evt_duplicate_test"
            )
        )
        webhooks = result.scalars().all()
        assert len(webhooks) == 1

    @pytest.mark.asyncio
    async def test_missing_event_type(self, client: AsyncClient):
        """Test webhook with missing event_type."""
        payload = {
            "event_id": "evt_missing_type",
            "notification_id": "ntf_test",
            "data": {},
        }

        response = await client.post("/webhooks/paddle", json=payload)
        assert response.status_code == 400
