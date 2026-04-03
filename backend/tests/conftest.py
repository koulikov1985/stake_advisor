import asyncio
import hashlib
import hmac
import time
import uuid
from datetime import datetime, timedelta
from typing import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool
import redis.asyncio as redis

from app.database import Base, get_session
from app.main import app
from app.config import get_settings
from app.models import User, License, DeviceActivation, LicenseTier, LicenseStatus

settings = get_settings()

# Use SQLite for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    poolclass=NullPool,
)

TestingSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture
async def session() -> AsyncGenerator[AsyncSession, None]:
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        yield session

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client(session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_session():
        yield session

    app.dependency_overrides[get_session] = override_get_session

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def redis_client() -> AsyncGenerator[redis.Redis, None]:
    client = redis.from_url("redis://localhost:6379/15", decode_responses=True)
    await client.flushdb()
    yield client
    await client.flushdb()
    await client.close()


@pytest_asyncio.fixture
async def test_user(session: AsyncSession) -> User:
    user = User(
        email="test@example.com",
        name="Test User",
        paddle_customer_id="ctm_test123",
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


@pytest_asyncio.fixture
async def test_license(session: AsyncSession, test_user: User) -> License:
    license = License(
        user_id=test_user.id,
        license_key="SA-1234-5678-9ABC-DEF0",
        tier=LicenseTier.MONTHLY,
        status=LicenseStatus.ACTIVE,
        max_devices=2,
        expires_at=datetime.utcnow() + timedelta(days=30),
        features={"basic_advisor": True},
    )
    session.add(license)
    await session.commit()
    await session.refresh(license)
    return license


@pytest_asyncio.fixture
async def activated_device(session: AsyncSession, test_license: License) -> DeviceActivation:
    device = DeviceActivation(
        license_id=test_license.id,
        device_fingerprint="v1:test_device_001",
        device_info={"os": "macOS", "version": "14.0"},
        is_active=True,
    )
    session.add(device)
    test_license.activated_devices = 1
    await session.commit()
    await session.refresh(device)
    return device


def generate_signature(license_key: str, device_id: str, timestamp: int, nonce: str) -> str:
    """Generate a valid request signature."""
    message = f"{license_key}:{device_id}:{timestamp}:{nonce}"
    return hmac.new(
        settings.secret_key.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
