"""Legacy compatibility revision for production databases.

Revision ID: 006_add_cascade_delete
Revises: 005_backfill_commissions
Create Date: 2026-04-08

This revision previously carried a schema change that was later rolled back in
code, but some deployed databases were already stamped with this revision. Keep
the revision file in the graph so `alembic upgrade head` can run on those
databases and on fresh installs alike.
"""

# revision identifiers, used by Alembic.
revision = "006_add_cascade_delete"
down_revision = "005_backfill_commissions"
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
