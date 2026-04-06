"""Backfill referral conversions and commissions for existing users.

Revision ID: 005
Revises: 004_add_stripe_support
Create Date: 2026-04-06

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = '005_backfill_commissions'
down_revision = '004_add_stripe_support'
branch_labels = None
depends_on = None

# Plan prices in cents
PLAN_PRICES = {
    'trial': 0,
    'day': 500,
    'week': 2500,
    'month': 6000,
    '6month': 31500,
    'year': 54900,
}

DEFAULT_COMMISSION_RATE = 15


def upgrade() -> None:
    conn = op.get_bind()

    # Find all referrals that are not yet converted but the referred user has an active license
    result = conn.execute(text("""
        SELECT
            r.id as referral_id,
            r.affiliate_id,
            r.referred_user_id,
            l.tier,
            l.id as license_id
        FROM referrals r
        JOIN users u ON u.id = r.referred_user_id
        JOIN licenses l ON l.user_id = u.id AND l.status = 'active'
        WHERE r.converted = false OR r.converted IS NULL
    """))

    referrals_to_process = result.fetchall()

    for row in referrals_to_process:
        referral_id = row.referral_id
        affiliate_id = row.affiliate_id
        tier = row.tier

        # Get affiliate's custom commission rate if any
        affiliate_result = conn.execute(text("""
            SELECT custom_commission_rate FROM users WHERE id = :affiliate_id
        """), {"affiliate_id": affiliate_id})
        affiliate_row = affiliate_result.fetchone()
        commission_rate = affiliate_row.custom_commission_rate if affiliate_row and affiliate_row.custom_commission_rate else DEFAULT_COMMISSION_RATE

        # Calculate commission
        base_amount = PLAN_PRICES.get(tier, 6000)  # Default to monthly
        commission_amount = int(base_amount * commission_rate / 100)

        # Mark referral as converted
        conn.execute(text("""
            UPDATE referrals
            SET converted = true, converted_at = NOW()
            WHERE id = :referral_id
        """), {"referral_id": referral_id})

        # Check if commission already exists for this referral
        existing = conn.execute(text("""
            SELECT id FROM commissions WHERE referral_id = :referral_id
        """), {"referral_id": referral_id})

        if not existing.fetchone():
            # Create commission record
            conn.execute(text("""
                INSERT INTO commissions (
                    id, affiliate_id, referral_id, amount, currency,
                    commission_rate, base_amount, status, created_at, updated_at
                ) VALUES (
                    gen_random_uuid(), :affiliate_id, :referral_id, :amount, 'USD',
                    :commission_rate, :base_amount, 'pending', NOW(), NOW()
                )
            """), {
                "affiliate_id": affiliate_id,
                "referral_id": referral_id,
                "amount": commission_amount,
                "commission_rate": commission_rate,
                "base_amount": base_amount,
            })

    print(f"Processed {len(referrals_to_process)} referrals for commission backfill")


def downgrade() -> None:
    # This is a data migration, downgrade would need to be handled manually
    pass
