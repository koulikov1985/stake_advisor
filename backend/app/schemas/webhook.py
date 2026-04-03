from pydantic import BaseModel
from typing import Any


class PaddleWebhookPayload(BaseModel):
    event_id: str
    event_type: str
    occurred_at: str
    notification_id: str
    data: dict[str, Any]

    class Config:
        extra = "allow"
