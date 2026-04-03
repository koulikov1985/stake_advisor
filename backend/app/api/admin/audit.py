import csv
import io
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import AdminUser
from app.schemas.admin import AuditLogResponse, AuditLogListResponse
from app.services.admin_service import AuditService
from app.api.admin.deps import get_current_admin

router = APIRouter(prefix="/audit", tags=["Admin Audit Logs"])


@router.get("", response_model=AuditLogListResponse)
async def list_audit_logs(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=50, ge=1, le=100),
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    action: Optional[str] = None,
    actor_id: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """List audit logs with filtering."""
    service = AuditService(session)
    logs, total = await service.list_logs(
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        actor_id=actor_id,
        start_date=start_date,
        end_date=end_date,
        page=page,
        per_page=per_page,
    )
    pages = (total + per_page - 1) // per_page if total > 0 else 1

    items = [
        AuditLogResponse(
            id=log.id,
            entity_type=log.entity_type,
            entity_id=log.entity_id,
            action=log.action,
            actor_type=log.actor_type,
            actor_id=log.actor_id,
            actor_email=log.actor_email,
            ip_address=log.ip_address,
            old_values=log.old_values,
            new_values=log.new_values,
            metadata=log.metadata,
            created_at=log.created_at,
        )
        for log in logs
    ]

    return AuditLogListResponse(
        items=items, total=total, page=page, per_page=per_page, pages=pages
    )


@router.get("/export")
async def export_audit_logs(
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    action: Optional[str] = None,
    actor_id: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    admin: AdminUser = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Export audit logs as CSV."""
    service = AuditService(session)

    # Get all matching logs (up to 10000)
    logs, total = await service.list_logs(
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        actor_id=actor_id,
        start_date=start_date,
        end_date=end_date,
        page=1,
        per_page=10000,
    )

    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)

    # Write header
    writer.writerow([
        "ID",
        "Timestamp",
        "Entity Type",
        "Entity ID",
        "Action",
        "Actor Type",
        "Actor ID",
        "Actor Email",
        "IP Address",
        "Old Values",
        "New Values",
    ])

    # Write data
    for log in logs:
        writer.writerow([
            log.id,
            log.created_at.isoformat(),
            log.entity_type,
            log.entity_id,
            log.action,
            log.actor_type,
            log.actor_id or "",
            log.actor_email or "",
            log.ip_address or "",
            str(log.old_values) if log.old_values else "",
            str(log.new_values) if log.new_values else "",
        ])

    output.seek(0)

    # Generate filename with timestamp
    filename = f"audit_logs_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/actions")
async def get_action_types(
    admin: AdminUser = Depends(get_current_admin),
):
    """Get list of unique action types for filtering."""
    return {
        "actions": [
            "login",
            "login_failed",
            "logout",
            "create",
            "update",
            "delete",
            "assign",
            "remove",
            "reset",
            "reset_all_devices",
            "commission_approve",
            "commission_reject",
            "payout_processed",
        ]
    }


@router.get("/entity-types")
async def get_entity_types(
    admin: AdminUser = Depends(get_current_admin),
):
    """Get list of entity types for filtering."""
    return {
        "entity_types": [
            "admin_user",
            "user",
            "user_note",
            "user_tag",
            "user_tag_assignment",
            "affiliate",
            "commission",
            "payout",
            "device",
            "system_setting",
        ]
    }
