from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import AdminUser
from app.schemas.users import (
    UserResponse,
    UserDetailResponse,
    UserListResponse,
    UserUpdate,
    UserNoteCreate,
    UserNoteResponse,
    UserNoteListResponse,
    UserTagCreate,
    UserTagResponse,
    UserTagListResponse,
    ActivityLogResponse,
    ActivityLogListResponse,
    DeviceInfo,
)
from app.services.user_service import UserService
from app.services.admin_service import AuditService
from app.api.admin.deps import (
    get_current_admin,
    require_write_permission,
    get_client_ip,
    get_user_agent,
)

router = APIRouter(prefix="/users", tags=["Admin Users"])


@router.get("", response_model=UserListResponse)
async def list_users(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=50, ge=1, le=100),
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    is_affiliate: Optional[bool] = None,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """List all users with filters."""
    service = UserService(session)
    items, total = await service.list_users(
        page=page,
        per_page=per_page,
        search=search,
        is_active=is_active,
        is_affiliate=is_affiliate,
    )
    pages = (total + per_page - 1) // per_page if total > 0 else 1
    return UserListResponse(
        items=items, total=total, page=page, per_page=per_page, pages=pages
    )


@router.get("/{user_id}", response_model=UserDetailResponse)
async def get_user(
    user_id: UUID,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get user details."""
    service = UserService(session)
    user = await service.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.put("/{user_id}", response_model=UserDetailResponse)
async def update_user(
    user_id: UUID,
    request: Request,
    data: UserUpdate,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Update user."""
    service = UserService(session)
    audit = AuditService(session)

    old_user = await service.get_user(user_id)
    if not old_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    updated = await service.update_user(
        user_id=user_id,
        name=data.name,
        is_active=data.is_active,
        is_affiliate=data.is_affiliate,
        affiliate_status=data.affiliate_status,
    )

    await audit.log(
        entity_type="user",
        entity_id=str(user_id),
        action="update",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        old_values={
            "name": old_user.name,
            "is_active": old_user.is_active,
            "is_affiliate": old_user.is_affiliate,
            "affiliate_status": old_user.affiliate_status,
        },
        new_values=data.model_dump(exclude_unset=True),
    )

    return await service.get_user(user_id)


# Notes endpoints
@router.get("/{user_id}/notes", response_model=UserNoteListResponse)
async def get_notes(
    user_id: UUID,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get notes for a user."""
    service = UserService(session)
    notes = await service.get_notes(user_id)
    return UserNoteListResponse(items=notes, total=len(notes))


@router.post("/{user_id}/notes", response_model=UserNoteResponse, status_code=status.HTTP_201_CREATED)
async def add_note(
    user_id: UUID,
    request: Request,
    data: UserNoteCreate,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Add a note to a user."""
    service = UserService(session)
    audit = AuditService(session)

    # Check user exists
    user = await service.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    note = await service.add_note(user_id, admin.id, data.content)

    await audit.log(
        entity_type="user_note",
        entity_id=str(note.id),
        action="create",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        new_values={"user_id": str(user_id), "content_preview": data.content[:100]},
    )

    return UserNoteResponse(
        id=note.id,
        user_id=note.user_id,
        admin_email=admin.email,
        content=note.content,
        created_at=note.created_at,
        updated_at=note.updated_at,
    )


@router.delete("/{user_id}/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    user_id: UUID,
    note_id: UUID,
    request: Request,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Delete a note."""
    service = UserService(session)
    audit = AuditService(session)

    deleted = await service.delete_note(note_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
        )

    await audit.log(
        entity_type="user_note",
        entity_id=str(note_id),
        action="delete",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
    )


# Tags endpoints
@router.get("/tags/all", response_model=UserTagListResponse)
async def list_tags(
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """List all available tags."""
    service = UserService(session)
    tags = await service.list_tags()
    return UserTagListResponse(items=tags, total=len(tags))


@router.post("/tags/all", response_model=UserTagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(
    request: Request,
    data: UserTagCreate,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Create a new tag."""
    service = UserService(session)
    audit = AuditService(session)

    tag = await service.create_tag(data.name, data.color, data.description)

    await audit.log(
        entity_type="user_tag",
        entity_id=str(tag.id),
        action="create",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        new_values={"name": tag.name, "color": tag.color},
    )

    return UserTagResponse(
        id=tag.id,
        name=tag.name,
        color=tag.color,
        description=tag.description,
        created_at=tag.created_at,
        usage_count=0,
    )


@router.delete("/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: UUID,
    request: Request,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Delete a tag."""
    service = UserService(session)
    audit = AuditService(session)

    deleted = await service.delete_tag(tag_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found"
        )

    await audit.log(
        entity_type="user_tag",
        entity_id=str(tag_id),
        action="delete",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
    )


@router.post("/{user_id}/tags/{tag_id}", status_code=status.HTTP_201_CREATED)
async def assign_tag(
    user_id: UUID,
    tag_id: UUID,
    request: Request,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Assign a tag to a user."""
    service = UserService(session)
    audit = AuditService(session)

    assignment = await service.assign_tag(user_id, tag_id, admin.id)
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Tag already assigned or not found"
        )

    await audit.log(
        entity_type="user_tag_assignment",
        entity_id=str(assignment.id),
        action="assign",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        new_values={"user_id": str(user_id), "tag_id": str(tag_id)},
    )

    return {"message": "Tag assigned successfully"}


@router.delete("/{user_id}/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_tag(
    user_id: UUID,
    tag_id: UUID,
    request: Request,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Remove a tag from a user."""
    service = UserService(session)
    audit = AuditService(session)

    removed = await service.remove_tag(user_id, tag_id)
    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tag assignment not found"
        )

    await audit.log(
        entity_type="user_tag_assignment",
        entity_id=f"{user_id}:{tag_id}",
        action="remove",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
    )


# Activity logs
@router.get("/{user_id}/activity", response_model=ActivityLogListResponse)
async def get_activity(
    user_id: UUID,
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=50, ge=1, le=100),
    activity_type: Optional[str] = None,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get activity logs for a user."""
    service = UserService(session)
    items, total = await service.get_activity(
        user_id=user_id,
        page=page,
        per_page=per_page,
        activity_type=activity_type,
    )
    pages = (total + per_page - 1) // per_page if total > 0 else 1
    return ActivityLogListResponse(
        items=items, total=total, page=page, per_page=per_page, pages=pages
    )


# Device management
@router.get("/{user_id}/devices", response_model=list[DeviceInfo])
async def get_devices(
    user_id: UUID,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Get devices for a user."""
    service = UserService(session)
    return await service.get_devices(user_id)


@router.post("/{user_id}/devices/{device_id}/reset", status_code=status.HTTP_200_OK)
async def reset_device(
    user_id: UUID,
    device_id: UUID,
    request: Request,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Reset (deactivate) a specific device."""
    service = UserService(session)
    audit = AuditService(session)

    reset = await service.reset_device(device_id)
    if not reset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Device not found"
        )

    await audit.log(
        entity_type="device",
        entity_id=str(device_id),
        action="reset",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        metadata={"user_id": str(user_id)},
    )

    return {"message": "Device reset successfully"}


@router.post("/{user_id}/devices/reset-all", status_code=status.HTTP_200_OK)
async def reset_all_devices(
    user_id: UUID,
    request: Request,
    admin: AdminUser = Depends(require_write_permission),
    session: AsyncSession = Depends(get_session),
):
    """Reset all devices for a user."""
    service = UserService(session)
    audit = AuditService(session)

    count = await service.reset_all_devices(user_id)

    await audit.log(
        entity_type="user",
        entity_id=str(user_id),
        action="reset_all_devices",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        metadata={"devices_reset": count},
    )

    return {"message": f"{count} devices reset successfully"}
