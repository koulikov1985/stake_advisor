import secrets
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

from app.models import AdminUser, AdminSession, AuditLog


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SESSION_DURATION_HOURS = 24


class AdminService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def authenticate(self, email: str, password: str) -> Optional[AdminUser]:
        """Authenticate admin user by email and password."""
        result = await self.session.execute(
            select(AdminUser).where(AdminUser.email == email)
        )
        admin = result.scalar_one_or_none()

        if admin and admin.is_active and pwd_context.verify(password, admin.password_hash):
            admin.last_login_at = datetime.utcnow()
            await self.session.commit()
            return admin
        return None

    async def create_session(
        self,
        admin_user_id: UUID,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> AdminSession:
        """Create a new admin session."""
        session = AdminSession(
            admin_user_id=admin_user_id,
            session_token=secrets.token_urlsafe(32),
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=datetime.utcnow() + timedelta(hours=SESSION_DURATION_HOURS),
        )
        self.session.add(session)
        await self.session.commit()
        await self.session.refresh(session)
        return session

    async def get_session_by_token(self, token: str) -> Optional[AdminSession]:
        """Get admin session by token."""
        result = await self.session.execute(
            select(AdminSession)
            .where(AdminSession.session_token == token)
            .where(AdminSession.expires_at > datetime.utcnow())
        )
        session = result.scalar_one_or_none()
        if session:
            session.last_activity_at = datetime.utcnow()
            await self.session.commit()
        return session

    async def invalidate_session(self, token: str) -> bool:
        """Invalidate a session by setting expiry to now."""
        result = await self.session.execute(
            select(AdminSession).where(AdminSession.session_token == token)
        )
        session = result.scalar_one_or_none()
        if session:
            session.expires_at = datetime.utcnow()
            await self.session.commit()
            return True
        return False

    async def invalidate_all_sessions(self, admin_user_id: UUID) -> int:
        """Invalidate all sessions for a user."""
        result = await self.session.execute(
            select(AdminSession)
            .where(AdminSession.admin_user_id == admin_user_id)
            .where(AdminSession.expires_at > datetime.utcnow())
        )
        sessions = result.scalars().all()
        count = 0
        for session in sessions:
            session.expires_at = datetime.utcnow()
            count += 1
        await self.session.commit()
        return count

    async def get_admin_by_id(self, admin_id: UUID) -> Optional[AdminUser]:
        """Get admin user by ID."""
        result = await self.session.execute(
            select(AdminUser).where(AdminUser.id == admin_id)
        )
        return result.scalar_one_or_none()

    async def get_admin_by_email(self, email: str) -> Optional[AdminUser]:
        """Get admin user by email."""
        result = await self.session.execute(
            select(AdminUser).where(AdminUser.email == email)
        )
        return result.scalar_one_or_none()

    async def create_admin(
        self, email: str, password: str, role: str = "admin"
    ) -> AdminUser:
        """Create a new admin user."""
        admin = AdminUser(
            email=email,
            password_hash=pwd_context.hash(password),
            role=role,
        )
        self.session.add(admin)
        await self.session.commit()
        await self.session.refresh(admin)
        return admin

    async def update_admin(
        self,
        admin_id: UUID,
        email: Optional[str] = None,
        password: Optional[str] = None,
        role: Optional[str] = None,
        is_active: Optional[bool] = None,
    ) -> Optional[AdminUser]:
        """Update an admin user."""
        admin = await self.get_admin_by_id(admin_id)
        if not admin:
            return None

        if email is not None:
            admin.email = email
        if password is not None:
            admin.password_hash = pwd_context.hash(password)
        if role is not None:
            admin.role = role
        if is_active is not None:
            admin.is_active = is_active

        await self.session.commit()
        await self.session.refresh(admin)
        return admin

    async def list_admins(
        self, skip: int = 0, limit: int = 50
    ) -> tuple[list[AdminUser], int]:
        """List admin users with pagination."""
        count_result = await self.session.execute(select(func.count(AdminUser.id)))
        total = count_result.scalar()

        result = await self.session.execute(
            select(AdminUser)
            .order_by(AdminUser.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        admins = result.scalars().all()
        return list(admins), total


class AuditService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def log(
        self,
        entity_type: str,
        entity_id: str,
        action: str,
        actor_type: str = "admin",
        actor_id: Optional[str] = None,
        actor_email: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        old_values: Optional[dict] = None,
        new_values: Optional[dict] = None,
        metadata: Optional[dict] = None,
    ) -> AuditLog:
        """Create an audit log entry."""
        log = AuditLog(
            entity_type=entity_type,
            entity_id=str(entity_id),
            action=action,
            actor_type=actor_type,
            actor_id=str(actor_id) if actor_id else None,
            actor_email=actor_email,
            ip_address=ip_address,
            user_agent=user_agent,
            old_values=old_values,
            new_values=new_values,
            metadata=metadata,
        )
        self.session.add(log)
        await self.session.commit()
        await self.session.refresh(log)
        return log

    async def list_logs(
        self,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        action: Optional[str] = None,
        actor_id: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        page: int = 1,
        per_page: int = 50,
    ) -> tuple[list[AuditLog], int]:
        """List audit logs with filtering and pagination."""
        query = select(AuditLog)

        if entity_type:
            query = query.where(AuditLog.entity_type == entity_type)
        if entity_id:
            query = query.where(AuditLog.entity_id == entity_id)
        if action:
            query = query.where(AuditLog.action == action)
        if actor_id:
            query = query.where(AuditLog.actor_id == actor_id)
        if start_date:
            query = query.where(AuditLog.created_at >= start_date)
        if end_date:
            query = query.where(AuditLog.created_at <= end_date)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.session.execute(count_query)
        total = count_result.scalar()

        # Get paginated results
        offset = (page - 1) * per_page
        query = query.order_by(AuditLog.created_at.desc()).offset(offset).limit(per_page)
        result = await self.session.execute(query)
        logs = result.scalars().all()

        return list(logs), total
