from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import AdminUser, AdminSession
from app.schemas.admin import (
    AdminLoginRequest,
    AdminLoginResponse,
    AdminUserResponse,
    AdminUserCreate,
    AdminUserUpdate,
)
from app.services.admin_service import AdminService, AuditService
from app.api.admin.deps import (
    get_current_admin,
    get_admin_session,
    require_super_admin,
    get_client_ip,
    get_user_agent,
)

router = APIRouter(prefix="/auth", tags=["Admin Auth"])


@router.post("/login", response_model=AdminLoginResponse)
async def login(
    request: Request,
    response: Response,
    data: AdminLoginRequest,
    session: AsyncSession = Depends(get_session),
):
    """Login as admin user."""
    admin_service = AdminService(session)
    audit_service = AuditService(session)

    admin = await admin_service.authenticate(data.email, data.password)
    if not admin:
        await audit_service.log(
            entity_type="admin_user",
            entity_id="unknown",
            action="login_failed",
            actor_type="admin",
            ip_address=get_client_ip(request),
            user_agent=get_user_agent(request),
            extra_data={"email": data.email},
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create session
    admin_session = await admin_service.create_session(
        admin_user_id=admin.id,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
    )

    # Set httpOnly cookie (samesite=none for cross-domain)
    response.set_cookie(
        key="admin_token",
        value=admin_session.session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=86400,  # 24 hours
    )

    await audit_service.log(
        entity_type="admin_user",
        entity_id=str(admin.id),
        action="login",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
    )

    return AdminLoginResponse(
        message="Login successful",
        admin=AdminUserResponse.model_validate(admin),
    )


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    admin_session: AdminSession = Depends(get_admin_session),
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Logout current admin session."""
    admin_service = AdminService(session)
    audit_service = AuditService(session)

    await admin_service.invalidate_session(admin_session.session_token)

    response.delete_cookie(key="admin_token")

    await audit_service.log(
        entity_type="admin_user",
        entity_id=str(admin.id),
        action="logout",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
    )

    return {"message": "Logged out successfully"}


@router.get("/me", response_model=AdminUserResponse)
async def get_me(
    admin: AdminUser = Depends(get_current_admin),
):
    """Get current admin user info."""
    return AdminUserResponse.model_validate(admin)


@router.get("/admins", response_model=list[AdminUserResponse])
async def list_admins(
    skip: int = 0,
    limit: int = 50,
    admin: AdminUser = Depends(require_super_admin),
    session: AsyncSession = Depends(get_session),
):
    """List all admin users (super_admin only)."""
    admin_service = AdminService(session)
    admins, _ = await admin_service.list_admins(skip=skip, limit=limit)
    return [AdminUserResponse.model_validate(a) for a in admins]


@router.post("/admins", response_model=AdminUserResponse, status_code=status.HTTP_201_CREATED)
async def create_admin(
    request: Request,
    data: AdminUserCreate,
    admin: AdminUser = Depends(require_super_admin),
    session: AsyncSession = Depends(get_session),
):
    """Create a new admin user (super_admin only)."""
    admin_service = AdminService(session)
    audit_service = AuditService(session)

    # Check if email already exists
    existing = await admin_service.get_admin_by_email(data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_admin = await admin_service.create_admin(
        email=data.email,
        password=data.password,
        role=data.role,
    )

    await audit_service.log(
        entity_type="admin_user",
        entity_id=str(new_admin.id),
        action="create",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        new_values={"email": new_admin.email, "role": new_admin.role},
    )

    return AdminUserResponse.model_validate(new_admin)


@router.put("/admins/{admin_id}", response_model=AdminUserResponse)
async def update_admin(
    admin_id: str,
    request: Request,
    data: AdminUserUpdate,
    admin: AdminUser = Depends(require_super_admin),
    session: AsyncSession = Depends(get_session),
):
    """Update an admin user (super_admin only)."""
    admin_service = AdminService(session)
    audit_service = AuditService(session)

    from uuid import UUID
    try:
        target_id = UUID(admin_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid admin ID",
        )

    target_admin = await admin_service.get_admin_by_id(target_id)
    if not target_admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found",
        )

    old_values = {
        "email": target_admin.email,
        "role": target_admin.role,
        "is_active": target_admin.is_active,
    }

    updated = await admin_service.update_admin(
        admin_id=target_id,
        email=data.email,
        password=data.password,
        role=data.role,
        is_active=data.is_active,
    )

    new_values = {}
    if data.email:
        new_values["email"] = data.email
    if data.role:
        new_values["role"] = data.role
    if data.is_active is not None:
        new_values["is_active"] = data.is_active
    if data.password:
        new_values["password"] = "[changed]"

    await audit_service.log(
        entity_type="admin_user",
        entity_id=str(target_id),
        action="update",
        actor_type="admin",
        actor_id=str(admin.id),
        actor_email=admin.email,
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        old_values=old_values,
        new_values=new_values,
    )

    return AdminUserResponse.model_validate(updated)
