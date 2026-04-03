from celery import Celery
from celery.schedules import crontab

from app.config import get_settings

settings = get_settings()

celery_app = Celery(
    "stakeadvisor",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.webhook_tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5 minutes
    worker_prefetch_multiplier=1,
)

# Scheduled tasks
celery_app.conf.beat_schedule = {
    "check-expiring-licenses": {
        "task": "app.tasks.webhook_tasks.check_expiring_licenses",
        "schedule": crontab(hour=9, minute=0),  # Daily at 9 AM UTC
    },
    "cleanup-expired-nonces": {
        "task": "app.tasks.webhook_tasks.cleanup_expired_nonces",
        "schedule": crontab(minute=0),  # Every hour
    },
}
