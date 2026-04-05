"""Add Stripe support

Revision ID: 004
Revises: 003
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

# revision identifiers, used by Alembic.
revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add stripe_customer_id to users table
    op.add_column(
        'users',
        sa.Column('stripe_customer_id', sa.String(255), unique=True, nullable=True)
    )
    op.create_index('ix_users_stripe_customer_id', 'users', ['stripe_customer_id'])

    # Add stripe_subscription_id to subscriptions table
    op.add_column(
        'subscriptions',
        sa.Column('stripe_subscription_id', sa.String(255), unique=True, nullable=True)
    )
    op.create_index('ix_subscriptions_stripe_subscription_id', 'subscriptions', ['stripe_subscription_id'])

    # Make paddle_subscription_id nullable (was required before)
    op.alter_column('subscriptions', 'paddle_subscription_id', nullable=True)

    # Create stripe_webhooks table
    op.create_table(
        'stripe_webhooks',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('stripe_event_id', sa.String(255), unique=True, nullable=False, index=True),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('payload', JSONB, nullable=False),
        sa.Column('processed', sa.Boolean, default=False),
        sa.Column('processed_at', sa.DateTime, nullable=True),
        sa.Column('error_message', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )


def downgrade() -> None:
    # Drop stripe_webhooks table
    op.drop_table('stripe_webhooks')

    # Remove stripe_subscription_id from subscriptions
    op.drop_index('ix_subscriptions_stripe_subscription_id', 'subscriptions')
    op.drop_column('subscriptions', 'stripe_subscription_id')

    # Make paddle_subscription_id required again
    op.alter_column('subscriptions', 'paddle_subscription_id', nullable=False)

    # Remove stripe_customer_id from users
    op.drop_index('ix_users_stripe_customer_id', 'users')
    op.drop_column('users', 'stripe_customer_id')
