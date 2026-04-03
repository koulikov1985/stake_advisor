import asyncio
from datetime import datetime, timedelta

from celery import shared_task
from sqlalchemy import select

from app.tasks.celery_app import celery_app
from app.database import async_session_maker
from app.models import License, User, LicenseStatus
from app.services import EmailService


def run_async(coro):
    """Run async function in sync context."""
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


@celery_app.task(name="app.tasks.webhook_tasks.process_paddle_webhook")
def process_paddle_webhook(event_type: str, event_id: str, data: dict):
    """Process Paddle webhook asynchronously."""
    from app.services import PaddleService

    async def _process():
        async with async_session_maker() as session:
            service = PaddleService(session)
            await service.process_webhook(event_type, event_id, data)

    run_async(_process())


@celery_app.task(name="app.tasks.webhook_tasks.send_license_email")
def send_license_email(to_email: str, license_key: str, tier: str):
    """Send license key email."""
    async def _send():
        service = EmailService()
        await service.send_license_key(to_email, license_key, tier)

    run_async(_send())


@celery_app.task(name="app.tasks.webhook_tasks.check_expiring_licenses")
def check_expiring_licenses():
    """Check for licenses expiring soon and send notifications."""
    async def _check():
        async with async_session_maker() as session:
            # Find licenses expiring in 3 days
            three_days = datetime.utcnow() + timedelta(days=3)
            today = datetime.utcnow()

            result = await session.execute(
                select(License)
                .where(License.status == LicenseStatus.ACTIVE)
                .where(License.expires_at != None)
                .where(License.expires_at > today)
                .where(License.expires_at <= three_days)
            )
            licenses = result.scalars().all()

            email_service = EmailService()
            for license in licenses:
                user = await session.get(User, license.user_id)
                if user:
                    # Send expiration warning
                    pass  # TODO: Implement expiration warning email

    run_async(_check())


@celery_app.task(name="app.tasks.webhook_tasks.cleanup_expired_nonces")
def cleanup_expired_nonces():
    """Cleanup expired nonces from Redis (Redis handles TTL automatically)."""
    # This is a no-op since Redis TTL handles expiration
    # Kept for potential future use
    pass


@celery_app.task(name="app.tasks.webhook_tasks.update_expired_licenses")
def update_expired_licenses():
    """Mark expired licenses as expired."""
    async def _update():
        async with async_session_maker() as session:
            result = await session.execute(
                select(License)
                .where(License.status == LicenseStatus.ACTIVE)
                .where(License.expires_at != None)
                .where(License.expires_at < datetime.utcnow())
            )
            licenses = result.scalars().all()

            for license in licenses:
                license.status = LicenseStatus.EXPIRED

            await session.commit()

    run_async(_update())
