"""Add missing email_verified column to users.

Revision ID: 007_add_email_verified
Revises: 006_add_cascade_delete
Create Date: 2026-04-08
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "007_add_email_verified"
down_revision = "006_add_cascade_delete"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_columns = {column["name"] for column in inspector.get_columns("users")}

    if "email_verified" not in existing_columns:
        op.add_column(
            "users",
            sa.Column(
                "email_verified",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            ),
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_columns = {column["name"] for column in inspector.get_columns("users")}

    if "email_verified" in existing_columns:
        op.drop_column("users", "email_verified")
