from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    User,
    License,
    Subscription,
    DeviceActivation,
    UserNote,
    UserTag,
    UserTagAssignment,
    UserActivityLog,
)
from app.schemas.users import (
    UserResponse,
    UserDetailResponse,
    LicenseInfo,
    SubscriptionInfo,
    TagInfo,
    UserNoteResponse,
    UserTagResponse,
    ActivityLogResponse,
    DeviceInfo,
)


class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_users(
        self,
        page: int = 1,
        per_page: int = 50,
        search: Optional[str] = None,
        is_active: Optional[bool] = None,
        is_affiliate: Optional[bool] = None,
    ) -> tuple[list[UserResponse], int]:
        """List users with filters."""
        query = select(User)

        if search:
            query = query.where(
                User.email.ilike(f"%{search}%") | User.name.ilike(f"%{search}%")
            )
        if is_active is not None:
            query = query.where(User.is_active == is_active)
        if is_affiliate is not None:
            query = query.where(User.is_affiliate == is_affiliate)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.session.execute(count_query)
        total = count_result.scalar()

        # Get paginated results
        offset = (page - 1) * per_page
        query = query.order_by(User.created_at.desc()).offset(offset).limit(per_page)
        result = await self.session.execute(query)
        users = result.scalars().all()

        items = [UserResponse.model_validate(u) for u in users]
        return items, total

    async def get_user(self, user_id: UUID) -> Optional[UserDetailResponse]:
        """Get user with full details."""
        result = await self.session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            return None

        # Get tags
        tags_result = await self.session.execute(
            select(UserTagAssignment).where(UserTagAssignment.user_id == user_id)
        )
        tag_assignments = tags_result.scalars().all()
        tags = [
            TagInfo(
                id=ta.tag.id,
                name=ta.tag.name,
                color=ta.tag.color,
                assigned_at=ta.assigned_at,
            )
            for ta in tag_assignments
            if ta.tag
        ]

        return UserDetailResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            paddle_customer_id=user.paddle_customer_id,
            is_active=user.is_active,
            is_affiliate=user.is_affiliate,
            affiliate_code=user.affiliate_code,
            affiliate_status=user.affiliate_status,
            custom_commission_rate=user.custom_commission_rate,
            referred_by_email=user.referred_by.email if user.referred_by else None,
            created_at=user.created_at,
            updated_at=user.updated_at,
            licenses=[
                LicenseInfo(
                    id=lic.id,
                    license_key=lic.license_key,
                    tier=lic.tier.value,
                    status=lic.status.value,
                    max_devices=lic.max_devices,
                    activated_devices=lic.activated_devices,
                    expires_at=lic.expires_at,
                    created_at=lic.created_at,
                )
                for lic in user.licenses
            ],
            subscriptions=[
                SubscriptionInfo(
                    id=sub.id,
                    paddle_subscription_id=sub.paddle_subscription_id,
                    status=sub.status.value,
                    current_period_start=sub.current_period_start,
                    current_period_end=sub.current_period_end,
                    created_at=sub.created_at,
                )
                for sub in user.subscriptions
            ],
            tags=tags,
        )

    async def update_user(
        self,
        user_id: UUID,
        name: Optional[str] = None,
        is_active: Optional[bool] = None,
        is_affiliate: Optional[bool] = None,
        affiliate_status: Optional[str] = None,
    ) -> Optional[User]:
        """Update user."""
        result = await self.session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            return None

        if name is not None:
            user.name = name
        if is_active is not None:
            user.is_active = is_active
        if is_affiliate is not None:
            user.is_affiliate = is_affiliate
        if affiliate_status is not None:
            user.affiliate_status = affiliate_status

        await self.session.commit()
        await self.session.refresh(user)
        return user

    # Notes
    async def get_notes(self, user_id: UUID) -> list[UserNoteResponse]:
        """Get notes for a user."""
        result = await self.session.execute(
            select(UserNote)
            .where(UserNote.user_id == user_id)
            .order_by(UserNote.created_at.desc())
        )
        notes = result.scalars().all()
        return [
            UserNoteResponse(
                id=n.id,
                user_id=n.user_id,
                admin_email=n.admin.email if n.admin else "unknown",
                content=n.content,
                created_at=n.created_at,
                updated_at=n.updated_at,
            )
            for n in notes
        ]

    async def add_note(
        self, user_id: UUID, admin_id: UUID, content: str
    ) -> UserNote:
        """Add a note to a user."""
        note = UserNote(
            user_id=user_id,
            admin_id=admin_id,
            content=content,
        )
        self.session.add(note)
        await self.session.commit()
        await self.session.refresh(note)
        return note

    async def delete_note(self, note_id: UUID) -> bool:
        """Delete a note."""
        result = await self.session.execute(
            select(UserNote).where(UserNote.id == note_id)
        )
        note = result.scalar_one_or_none()
        if not note:
            return False
        await self.session.delete(note)
        await self.session.commit()
        return True

    # Tags
    async def list_tags(self) -> list[UserTagResponse]:
        """List all tags with usage count."""
        result = await self.session.execute(
            select(UserTag).order_by(UserTag.name)
        )
        tags = result.scalars().all()

        items = []
        for tag in tags:
            count_result = await self.session.execute(
                select(func.count(UserTagAssignment.id)).where(
                    UserTagAssignment.tag_id == tag.id
                )
            )
            count = count_result.scalar() or 0
            items.append(
                UserTagResponse(
                    id=tag.id,
                    name=tag.name,
                    color=tag.color,
                    description=tag.description,
                    created_at=tag.created_at,
                    usage_count=count,
                )
            )
        return items

    async def create_tag(
        self, name: str, color: str = "#808080", description: Optional[str] = None
    ) -> UserTag:
        """Create a new tag."""
        tag = UserTag(name=name, color=color, description=description)
        self.session.add(tag)
        await self.session.commit()
        await self.session.refresh(tag)
        return tag

    async def delete_tag(self, tag_id: UUID) -> bool:
        """Delete a tag and all assignments."""
        result = await self.session.execute(
            select(UserTag).where(UserTag.id == tag_id)
        )
        tag = result.scalar_one_or_none()
        if not tag:
            return False

        # Delete assignments first
        await self.session.execute(
            delete(UserTagAssignment).where(UserTagAssignment.tag_id == tag_id)
        )
        await self.session.delete(tag)
        await self.session.commit()
        return True

    async def assign_tag(
        self, user_id: UUID, tag_id: UUID, admin_id: UUID
    ) -> Optional[UserTagAssignment]:
        """Assign a tag to a user."""
        # Check if already assigned
        existing = await self.session.execute(
            select(UserTagAssignment).where(
                UserTagAssignment.user_id == user_id,
                UserTagAssignment.tag_id == tag_id,
            )
        )
        if existing.scalar_one_or_none():
            return None

        assignment = UserTagAssignment(
            user_id=user_id,
            tag_id=tag_id,
            assigned_by=admin_id,
        )
        self.session.add(assignment)
        await self.session.commit()
        await self.session.refresh(assignment)
        return assignment

    async def remove_tag(self, user_id: UUID, tag_id: UUID) -> bool:
        """Remove a tag from a user."""
        result = await self.session.execute(
            select(UserTagAssignment).where(
                UserTagAssignment.user_id == user_id,
                UserTagAssignment.tag_id == tag_id,
            )
        )
        assignment = result.scalar_one_or_none()
        if not assignment:
            return False
        await self.session.delete(assignment)
        await self.session.commit()
        return True

    # Activity logs
    async def get_activity(
        self,
        user_id: UUID,
        page: int = 1,
        per_page: int = 50,
        activity_type: Optional[str] = None,
    ) -> tuple[list[ActivityLogResponse], int]:
        """Get activity logs for a user."""
        query = select(UserActivityLog).where(UserActivityLog.user_id == user_id)

        if activity_type:
            query = query.where(UserActivityLog.activity_type == activity_type)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.session.execute(count_query)
        total = count_result.scalar()

        # Get paginated results
        offset = (page - 1) * per_page
        query = query.order_by(UserActivityLog.created_at.desc()).offset(offset).limit(per_page)
        result = await self.session.execute(query)
        logs = result.scalars().all()

        items = [
            ActivityLogResponse(
                id=log.id,
                user_id=log.user_id,
                activity_type=log.activity_type,
                description=log.description,
                ip_address=log.ip_address,
                metadata=log.metadata,
                created_at=log.created_at,
            )
            for log in logs
        ]
        return items, total

    async def log_activity(
        self,
        user_id: UUID,
        activity_type: str,
        description: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> UserActivityLog:
        """Log user activity."""
        log = UserActivityLog(
            user_id=user_id,
            activity_type=activity_type,
            description=description,
            ip_address=ip_address,
            user_agent=user_agent,
            metadata=metadata,
        )
        self.session.add(log)
        await self.session.commit()
        await self.session.refresh(log)
        return log

    # Device management
    async def get_devices(self, user_id: UUID) -> list[DeviceInfo]:
        """Get devices for a user (via their licenses)."""
        result = await self.session.execute(
            select(License).where(License.user_id == user_id)
        )
        licenses = result.scalars().all()

        devices = []
        for lic in licenses:
            for dev in lic.device_activations:
                devices.append(
                    DeviceInfo(
                        id=dev.id,
                        device_fingerprint=dev.device_fingerprint,
                        device_info=dev.device_info,
                        is_active=dev.is_active,
                        activated_at=dev.activated_at,
                        last_validated_at=dev.last_validated_at,
                    )
                )
        return devices

    async def reset_device(self, device_id: UUID) -> bool:
        """Deactivate a device."""
        result = await self.session.execute(
            select(DeviceActivation).where(DeviceActivation.id == device_id)
        )
        device = result.scalar_one_or_none()
        if not device:
            return False

        device.is_active = False
        # Update license device count
        if device.license:
            device.license.activated_devices = max(
                0, device.license.activated_devices - 1
            )

        await self.session.commit()
        return True

    async def reset_all_devices(self, user_id: UUID) -> int:
        """Reset all devices for a user."""
        result = await self.session.execute(
            select(License).where(License.user_id == user_id)
        )
        licenses = result.scalars().all()

        count = 0
        for lic in licenses:
            for dev in lic.device_activations:
                if dev.is_active:
                    dev.is_active = False
                    count += 1
            lic.activated_devices = 0

        await self.session.commit()
        return count
