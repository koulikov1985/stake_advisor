"""Add trial and sixmonth license tiers

Revision ID: 003_add_license_tiers
Revises: 002_admin_panel
Create Date: 2024-01-20

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = '003_add_license_tiers'
down_revision = '002_admin_panel'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new values to the licensetier enum
    # PostgreSQL requires ALTER TYPE to add enum values
    op.execute("ALTER TYPE licensetier ADD VALUE IF NOT EXISTS 'trial'")
    op.execute("ALTER TYPE licensetier ADD VALUE IF NOT EXISTS '6month'")


def downgrade() -> None:
    # Note: PostgreSQL doesn't support removing enum values easily
    # This would require recreating the type and all columns using it
    pass
