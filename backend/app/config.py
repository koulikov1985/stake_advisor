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

    # Paddle
    paddle_api_key: str = ""
    paddle_webhook_secret: str = ""
    paddle_sandbox: bool = True

    # Security
    secret_key: str = "change-me-in-production-32-chars"

    # Admin
    admin_email: str = "admin@stakeadvisor.app"
    admin_password: str = "change-this-password"

    # Email
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "noreply@stakeadvisor.app"

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
