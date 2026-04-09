"""add cascade delete to user foreign keys

Revision ID: 006
Revises: 005
Create Date: 2026-04-08

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '006_add_cascade_delete'
down_revision = '005_backfill_commissions'
branch_labels = None
depends_on = None


def upgrade():
    # Drop and recreate foreign keys with ON DELETE CASCADE
    # Using raw SQL for more reliable constraint handling

    # Licenses table
    op.execute('ALTER TABLE licenses DROP CONSTRAINT IF EXISTS licenses_user_id_fkey')
    op.create_foreign_key(
        'licenses_user_id_fkey', 'licenses', 'users',
        ['user_id'], ['id'], ondelete='CASCADE'
    )

    # Subscriptions table
    op.execute('ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey')
    op.create_foreign_key(
        'subscriptions_user_id_fkey', 'subscriptions', 'users',
        ['user_id'], ['id'], ondelete='CASCADE'
    )

    # Referrals table - affiliate_id
    op.execute('ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_affiliate_id_fkey')
    op.create_foreign_key(
        'referrals_affiliate_id_fkey', 'referrals', 'users',
        ['affiliate_id'], ['id'], ondelete='CASCADE'
    )

    # Referrals table - referred_user_id
    op.execute('ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referred_user_id_fkey')
    op.create_foreign_key(
        'referrals_referred_user_id_fkey', 'referrals', 'users',
        ['referred_user_id'], ['id'], ondelete='CASCADE'
    )

    # Commissions table
    op.execute('ALTER TABLE commissions DROP CONSTRAINT IF EXISTS commissions_affiliate_id_fkey')
    op.create_foreign_key(
        'commissions_affiliate_id_fkey', 'commissions', 'users',
        ['affiliate_id'], ['id'], ondelete='CASCADE'
    )

    # Affiliate payouts table
    op.execute('ALTER TABLE affiliate_payouts DROP CONSTRAINT IF EXISTS affiliate_payouts_affiliate_id_fkey')
    op.create_foreign_key(
        'affiliate_payouts_affiliate_id_fkey', 'affiliate_payouts', 'users',
        ['affiliate_id'], ['id'], ondelete='CASCADE'
    )

    # User notes table
    op.execute('ALTER TABLE user_notes DROP CONSTRAINT IF EXISTS user_notes_user_id_fkey')
    op.create_foreign_key(
        'user_notes_user_id_fkey', 'user_notes', 'users',
        ['user_id'], ['id'], ondelete='CASCADE'
    )

    # User tag assignments table
    op.execute('ALTER TABLE user_tag_assignments DROP CONSTRAINT IF EXISTS user_tag_assignments_user_id_fkey')
    op.create_foreign_key(
        'user_tag_assignments_user_id_fkey', 'user_tag_assignments', 'users',
        ['user_id'], ['id'], ondelete='CASCADE'
    )

    # User activity logs table
    op.execute('ALTER TABLE user_activity_logs DROP CONSTRAINT IF EXISTS user_activity_logs_user_id_fkey')
    op.create_foreign_key(
        'user_activity_logs_user_id_fkey', 'user_activity_logs', 'users',
        ['user_id'], ['id'], ondelete='CASCADE'
    )

    # Revenue transactions table
    op.execute('ALTER TABLE revenue_transactions DROP CONSTRAINT IF EXISTS revenue_transactions_user_id_fkey')
    op.create_foreign_key(
        'revenue_transactions_user_id_fkey', 'revenue_transactions', 'users',
        ['user_id'], ['id'], ondelete='CASCADE'
    )


def downgrade():
    # Restore original foreign keys without CASCADE
    
    # Revenue transactions table
    op.drop_constraint('revenue_transactions_user_id_fkey', 'revenue_transactions', type_='foreignkey')
    op.create_foreign_key(
        'revenue_transactions_user_id_fkey', 'revenue_transactions', 'users',
        ['user_id'], ['id']
    )
    
    # User activity logs table
    op.drop_constraint('user_activity_logs_user_id_fkey', 'user_activity_logs', type_='foreignkey')
    op.create_foreign_key(
        'user_activity_logs_user_id_fkey', 'user_activity_logs', 'users',
        ['user_id'], ['id']
    )
    
    # User tag assignments table
    op.drop_constraint('user_tag_assignments_user_id_fkey', 'user_tag_assignments', type_='foreignkey')
    op.create_foreign_key(
        'user_tag_assignments_user_id_fkey', 'user_tag_assignments', 'users',
        ['user_id'], ['id']
    )
    
    # User notes table
    op.drop_constraint('user_notes_user_id_fkey', 'user_notes', type_='foreignkey')
    op.create_foreign_key(
        'user_notes_user_id_fkey', 'user_notes', 'users',
        ['user_id'], ['id']
    )
    
    # Affiliate payouts table
    op.drop_constraint('affiliate_payouts_affiliate_id_fkey', 'affiliate_payouts', type_='foreignkey')
    op.create_foreign_key(
        'affiliate_payouts_affiliate_id_fkey', 'affiliate_payouts', 'users',
        ['affiliate_id'], ['id']
    )
    
    # Commissions table
    op.drop_constraint('commissions_affiliate_id_fkey', 'commissions', type_='foreignkey')
    op.create_foreign_key(
        'commissions_affiliate_id_fkey', 'commissions', 'users',
        ['affiliate_id'], ['id']
    )
    
    # Referrals table - referred_user_id
    op.drop_constraint('referrals_referred_user_id_fkey', 'referrals', type_='foreignkey')
    op.create_foreign_key(
        'referrals_referred_user_id_fkey', 'referrals', 'users',
        ['referred_user_id'], ['id']
    )
    
    # Referrals table - affiliate_id
    op.drop_constraint('referrals_affiliate_id_fkey', 'referrals', type_='foreignkey')
    op.create_foreign_key(
        'referrals_affiliate_id_fkey', 'referrals', 'users',
        ['affiliate_id'], ['id']
    )
    
    # Subscriptions table
    op.drop_constraint('subscriptions_user_id_fkey', 'subscriptions', type_='foreignkey')
    op.create_foreign_key(
        'subscriptions_user_id_fkey', 'subscriptions', 'users',
        ['user_id'], ['id']
    )
    
    # Licenses table
    op.drop_constraint('licenses_user_id_fkey', 'licenses', type_='foreignkey')
    op.create_foreign_key(
        'licenses_user_id_fkey', 'licenses', 'users',
        ['user_id'], ['id']
    )
