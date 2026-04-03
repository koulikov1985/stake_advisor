from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from starlette.responses import RedirectResponse
from passlib.context import CryptContext
from itsdangerous import URLSafeTimedSerializer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import async_session_maker
from app.models import AdminUser

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AdminAuth(AuthenticationBackend):
    def __init__(self, secret_key: str):
        super().__init__(secret_key)
        self.serializer = URLSafeTimedSerializer(secret_key)

    async def login(self, request: Request) -> bool:
        form = await request.form()
        email = form.get("username")
        password = form.get("password")

        async with async_session_maker() as session:
            result = await session.execute(
                select(AdminUser).where(AdminUser.email == email)
            )
            admin = result.scalar_one_or_none()

            if admin and pwd_context.verify(password, admin.password_hash):
                token = self.serializer.dumps({"user_id": str(admin.id), "email": admin.email})
                request.session.update({"token": token})
                return True

        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")

        if not token:
            return False

        try:
            data = self.serializer.loads(token, max_age=86400)  # 24 hours
            return True
        except Exception:
            return False


async def create_admin_user(email: str, password: str, role: str = "admin") -> AdminUser:
    """Create an admin user."""
    async with async_session_maker() as session:
        # Check if exists
        result = await session.execute(
            select(AdminUser).where(AdminUser.email == email)
        )
        existing = result.scalar_one_or_none()

        if existing:
            # Update password
            existing.password_hash = pwd_context.hash(password)
            await session.commit()
            return existing

        admin = AdminUser(
            email=email,
            password_hash=pwd_context.hash(password),
            role=role
        )
        session.add(admin)
        await session.commit()
        await session.refresh(admin)
        return admin
