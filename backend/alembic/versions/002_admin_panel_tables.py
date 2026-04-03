"""Admin panel tables

Revision ID: 002_admin_panel
Revises: 001_initial_schema
Create Date: 2024-01-15

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002_admin_panel'
down_revision = '001_initial_schema'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new columns to admin_users
    op.add_column('admin_users', sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'))
    op.add_column('admin_users', sa.Column('last_login_at', sa.DateTime(), nullable=True))

    # Create admin_sessions table
    op.create_table('admin_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('admin_user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_token', sa.String(255), nullable=False),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(512), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('last_activity_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['admin_user_id'], ['admin_users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_admin_sessions_session_token', 'admin_sessions', ['session_token'], unique=True)

    # Add new columns to audit_logs
    op.add_column('audit_logs', sa.Column('actor_email', sa.String(255), nullable=True))
    op.add_column('audit_logs', sa.Column('ip_address', sa.String(45), nullable=True))
    op.add_column('audit_logs', sa.Column('user_agent', sa.String(512), nullable=True))
    op.add_column('audit_logs', sa.Column('metadata', postgresql.JSONB(), nullable=True))
    op.create_index('ix_audit_logs_entity_type', 'audit_logs', ['entity_type'])
    op.create_index('ix_audit_logs_action', 'audit_logs', ['action'])
    op.create_index('ix_audit_logs_actor_id', 'audit_logs', ['actor_id'])

    # Create revenue_transactions table
    op.create_table('revenue_transactions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('subscription_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('paddle_transaction_id', sa.String(255), nullable=True),
        sa.Column('transaction_type', sa.Enum('subscription_payment', 'one_time_purchase', 'refund', 'chargeback', name='transactiontype'), nullable=True),
        sa.Column('status', sa.Enum('pending', 'completed', 'failed', 'refunded', name='transactionstatus'), nullable=True),
        sa.Column('amount', sa.Integer(), nullable=True),
        sa.Column('currency', sa.String(3), nullable=True),
        sa.Column('plan_tier', sa.String(50), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('metadata', postgresql.JSONB(), nullable=True),
        sa.Column('transaction_date', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['subscription_id'], ['subscriptions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_revenue_transactions_paddle_transaction_id', 'revenue_transactions', ['paddle_transaction_id'], unique=True)
    op.create_index('ix_revenue_transactions_transaction_date', 'revenue_transactions', ['transaction_date'])

    # Add affiliate columns to users
    op.add_column('users', sa.Column('is_affiliate', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('users', sa.Column('affiliate_code', sa.String(20), nullable=True))
    op.add_column('users', sa.Column('affiliate_status', sa.String(20), nullable=False, server_default='pending'))
    op.add_column('users', sa.Column('custom_commission_rate', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('referred_by_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index('ix_users_affiliate_code', 'users', ['affiliate_code'], unique=True)
    op.create_foreign_key('fk_users_referred_by', 'users', 'users', ['referred_by_id'], ['id'])

    # Create referrals table
    op.create_table('referrals',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('affiliate_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('referred_user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('referral_code_used', sa.String(20), nullable=False),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(512), nullable=True),
        sa.Column('converted', sa.Boolean(), nullable=True, server_default='false'),
        sa.Column('converted_at', sa.DateTime(), nullable=True),
        sa.Column('admin_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['affiliate_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['referred_user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('referred_user_id')
    )
    op.create_index('ix_referrals_affiliate_id', 'referrals', ['affiliate_id'])
    op.create_index('ix_referrals_created_at', 'referrals', ['created_at'])

    # Create affiliate_payouts table (must be before commissions due to FK)
    op.create_table('affiliate_payouts',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('affiliate_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('amount', sa.Integer(), nullable=True),
        sa.Column('currency', sa.String(3), nullable=True),
        sa.Column('status', sa.Enum('pending', 'processing', 'completed', 'failed', name='payoutstatus'), nullable=True),
        sa.Column('payment_method', sa.String(50), nullable=True),
        sa.Column('payment_details', postgresql.JSONB(), nullable=True),
        sa.Column('payment_reference', sa.String(255), nullable=True),
        sa.Column('processed_by', sa.String(255), nullable=True),
        sa.Column('processed_at', sa.DateTime(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('requested_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['affiliate_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_affiliate_payouts_affiliate_id', 'affiliate_payouts', ['affiliate_id'])
    op.create_index('ix_affiliate_payouts_created_at', 'affiliate_payouts', ['created_at'])

    # Create commissions table
    op.create_table('commissions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('affiliate_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('referral_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('transaction_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('amount', sa.Integer(), nullable=True),
        sa.Column('currency', sa.String(3), nullable=True),
        sa.Column('commission_rate', sa.Integer(), nullable=True),
        sa.Column('base_amount', sa.Integer(), nullable=True),
        sa.Column('status', sa.Enum('pending', 'approved', 'rejected', 'paid', name='commissionstatus'), nullable=True),
        sa.Column('payout_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('reviewed_by', sa.String(255), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('rejection_reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['affiliate_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['payout_id'], ['affiliate_payouts.id'], ),
        sa.ForeignKeyConstraint(['referral_id'], ['referrals.id'], ),
        sa.ForeignKeyConstraint(['transaction_id'], ['revenue_transactions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_commissions_affiliate_id', 'commissions', ['affiliate_id'])
    op.create_index('ix_commissions_created_at', 'commissions', ['created_at'])

    # Create user_notes table
    op.create_table('user_notes',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('admin_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['admin_id'], ['admin_users.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_user_notes_user_id', 'user_notes', ['user_id'])
    op.create_index('ix_user_notes_created_at', 'user_notes', ['created_at'])

    # Create user_tags table
    op.create_table('user_tags',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('color', sa.String(7), nullable=True),
        sa.Column('description', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.create_index('ix_user_tags_name', 'user_tags', ['name'])

    # Create user_tag_assignments table
    op.create_table('user_tag_assignments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('tag_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('assigned_by', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('assigned_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['assigned_by'], ['admin_users.id'], ),
        sa.ForeignKeyConstraint(['tag_id'], ['user_tags.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'tag_id', name='uq_user_tag')
    )
    op.create_index('ix_user_tag_assignments_user_id', 'user_tag_assignments', ['user_id'])
    op.create_index('ix_user_tag_assignments_tag_id', 'user_tag_assignments', ['tag_id'])

    # Create user_activity_logs table
    op.create_table('user_activity_logs',
        sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('activity_type', sa.String(50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(512), nullable=True),
        sa.Column('metadata', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_user_activity_logs_user_id', 'user_activity_logs', ['user_id'])
    op.create_index('ix_user_activity_logs_activity_type', 'user_activity_logs', ['activity_type'])
    op.create_index('ix_user_activity_logs_created_at', 'user_activity_logs', ['created_at'])

    # Create system_settings table
    op.create_table('system_settings',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('key', sa.String(100), nullable=False),
        sa.Column('value', postgresql.JSONB(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('updated_by', sa.String(255), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('key')
    )
    op.create_index('ix_system_settings_key', 'system_settings', ['key'])


def downgrade() -> None:
    # Drop tables in reverse order (respecting foreign keys)
    op.drop_table('system_settings')
    op.drop_table('user_activity_logs')
    op.drop_table('user_tag_assignments')
    op.drop_table('user_tags')
    op.drop_table('user_notes')
    op.drop_table('commissions')
    op.drop_table('affiliate_payouts')
    op.drop_table('referrals')
    op.drop_table('revenue_transactions')
    op.drop_table('admin_sessions')

    # Remove columns from users
    op.drop_constraint('fk_users_referred_by', 'users', type_='foreignkey')
    op.drop_index('ix_users_affiliate_code', table_name='users')
    op.drop_column('users', 'referred_by_id')
    op.drop_column('users', 'custom_commission_rate')
    op.drop_column('users', 'affiliate_status')
    op.drop_column('users', 'affiliate_code')
    op.drop_column('users', 'is_affiliate')

    # Remove columns from audit_logs
    op.drop_index('ix_audit_logs_actor_id', table_name='audit_logs')
    op.drop_index('ix_audit_logs_action', table_name='audit_logs')
    op.drop_index('ix_audit_logs_entity_type', table_name='audit_logs')
    op.drop_column('audit_logs', 'metadata')
    op.drop_column('audit_logs', 'user_agent')
    op.drop_column('audit_logs', 'ip_address')
    op.drop_column('audit_logs', 'actor_email')

    # Remove columns from admin_users
    op.drop_column('admin_users', 'last_login_at')
    op.drop_column('admin_users', 'is_active')

    # Drop enums
    op.execute('DROP TYPE IF EXISTS transactiontype')
    op.execute('DROP TYPE IF EXISTS transactionstatus')
    op.execute('DROP TYPE IF EXISTS payoutstatus')
    op.execute('DROP TYPE IF EXISTS commissionstatus')
