from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@db:5432/stakeadvisor"

    @field_validator("database_url", mode="before")
    @classmethod
    def fix_database_url(cls, v: str) -> str:
        """Convert postgres:// to postgresql+asyncpg:// for SQLAlchemy async."""
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+asyncpg://", 1)
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    # Redis
    redis_url: str = "redis://redis:6379/0"

    # Paddle (legacy)
    paddle_api_key: str = ""
    paddle_webhook_secret: str = ""
    paddle_sandbox: bool = True

    # Stripe
    stripe_secret_key: str = ""
    stripe_publishable_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_daily: str = ""
    stripe_price_weekly: str = ""
    stripe_price_monthly: str = ""
    stripe_price_yearly: str = ""

    # Security
    secret_key: str = "change-me-in-production-32-chars"

    # Admin
    admin_email: str = "admin@stakeadvisor.app"
    admin_password: str = "change-this-password"

    # Email (Resend)
    resend_api_key: str = ""
    email_from: str = "PokerSharkScope <noreply@mail.sharkpokerclub.com>"

    # Frontend URL (for email links)
    frontend_url: str = "https://sharkpokerclub.com"

    # App
    debug: bool = False

    # Rate limiting
    validate_rate_limit: str = "100/minute"
    activate_rate_limit: str = "10/minute"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
