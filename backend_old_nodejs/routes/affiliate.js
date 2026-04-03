const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { authenticate } = require('./user');
const crypto = require('crypto');

// Commission rate: 15%
const COMMISSION_RATE = 0.15;

// Generate a unique referral code
function generateReferralCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Get or generate referral code for authenticated user
router.get('/code', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has an active subscription (only active subscribers can be affiliates)
    const now = new Date();
    const expiresAt = req.user.expires_at ? new Date(req.user.expires_at) : null;
    const isActive = req.user.active && expiresAt && expiresAt > now;

    if (!isActive) {
      return res.status(403).json({
        error: 'Active subscription required to join affiliate program'
      });
    }

    // Check if user already has a referral code
    if (req.user.referral_code) {
      return res.json({
        referralCode: req.user.referral_code,
        referralLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?ref=${req.user.referral_code}`
      });
    }

    // Generate a new unique code
    let referralCode;
    let isUnique = false;

    while (!isUnique) {
      referralCode = generateReferralCode();
      const existing = await pool.query(
        'SELECT id FROM users WHERE referral_code = $1',
        [referralCode]
      );
      if (existing.rows.length === 0) {
        isUnique = true;
      }
    }

    // Save the code
    await pool.query(
      'UPDATE users SET referral_code = $1 WHERE id = $2',
      [referralCode, userId]
    );

    res.json({
      referralCode,
      referralLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?ref=${referralCode}`
    });
  } catch (error) {
    console.error('Error getting/generating referral code:', error);
    res.status(500).json({ error: 'Failed to get referral code' });
  }
});

// Get affiliate stats for authenticated user
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has an active subscription
    const now = new Date();
    const expiresAt = req.user.expires_at ? new Date(req.user.expires_at) : null;
    const isActive = req.user.active && expiresAt && expiresAt > now;

    if (!isActive) {
      return res.status(403).json({
        error: 'Active subscription required to view affiliate stats'
      });
    }

    // Get total referrals count
    const referralsResult = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE referred_by = $1',
      [userId]
    );
    const totalReferrals = parseInt(referralsResult.rows[0].count);

    // Get earnings summary
    const earningsResult = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'approved' OR status = 'paid' THEN commission_amount ELSE 0 END), 0) as total_earned,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END), 0) as pending_earnings,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END), 0) as paid_out
      FROM referrals
      WHERE referrer_id = $1
    `, [userId]);

    const earnings = earningsResult.rows[0];

    // Get recent referrals
    const recentResult = await pool.query(`
      SELECT
        r.id,
        r.payment_amount,
        r.commission_amount,
        r.status,
        r.created_at,
        u.email
      FROM referrals r
      JOIN users u ON r.referred_id = u.id
      WHERE r.referrer_id = $1
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [userId]);

    // Mask emails for privacy (show first 3 chars + domain)
    const recentReferrals = recentResult.rows.map(r => ({
      id: r.id,
      email: maskEmail(r.email),
      paymentAmount: parseFloat(r.payment_amount),
      commissionAmount: parseFloat(r.commission_amount),
      status: r.status,
      createdAt: r.created_at
    }));

    // Get available balance (approved but not paid)
    const availableBalance = parseFloat(earnings.total_earned) - parseFloat(earnings.paid_out);

    res.json({
      referralCode: req.user.referral_code,
      referralLink: req.user.referral_code
        ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?ref=${req.user.referral_code}`
        : null,
      totalReferrals,
      totalEarned: parseFloat(earnings.total_earned),
      pendingEarnings: parseFloat(earnings.pending_earnings),
      availableBalance,
      paidOut: parseFloat(earnings.paid_out),
      commissionRate: COMMISSION_RATE,
      recentReferrals
    });
  } catch (error) {
    console.error('Error fetching affiliate stats:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate stats' });
  }
});

// Track a referral click (public endpoint)
router.post('/track/:code', async (req, res) => {
  try {
    const { code } = req.params;

    // Verify the referral code exists
    const result = await pool.query(
      'SELECT id, email FROM users WHERE referral_code = $1',
      [code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    // Return success - frontend will store in cookie/localStorage
    res.json({
      valid: true,
      message: 'Referral tracked'
    });
  } catch (error) {
    console.error('Error tracking referral:', error);
    res.status(500).json({ error: 'Failed to track referral' });
  }
});

// Validate a referral code (public endpoint)
router.get('/validate/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query(
      'SELECT id FROM users WHERE referral_code = $1',
      [code.toUpperCase()]
    );

    res.json({ valid: result.rows.length > 0 });
  } catch (error) {
    console.error('Error validating referral code:', error);
    res.status(500).json({ error: 'Failed to validate referral code' });
  }
});

// Helper function to mask email
function maskEmail(email) {
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 3
    ? local.substring(0, 3) + '***'
    : local.substring(0, 1) + '***';
  return `${maskedLocal}@${domain}`;
}

// Record a referral commission (called internally after payment)
async function recordReferralCommission(referredUserId, paymentAmount, stripePaymentId) {
  try {
    // Get the referred user's referrer
    const userResult = await pool.query(
      'SELECT referred_by FROM users WHERE id = $1',
      [referredUserId]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].referred_by) {
      return null; // User wasn't referred
    }

    const referrerId = userResult.rows[0].referred_by;

    // Check if referrer still has active subscription
    const referrerResult = await pool.query(
      'SELECT id, expires_at, active FROM users WHERE id = $1',
      [referrerId]
    );

    if (referrerResult.rows.length === 0) {
      return null;
    }

    const referrer = referrerResult.rows[0];
    const now = new Date();
    const expiresAt = referrer.expires_at ? new Date(referrer.expires_at) : null;
    const isActive = referrer.active && expiresAt && expiresAt > now;

    if (!isActive) {
      console.log(`Referrer ${referrerId} no longer active, skipping commission`);
      return null;
    }

    // Calculate commission
    const commissionAmount = (paymentAmount * COMMISSION_RATE).toFixed(2);

    // Record the referral
    const result = await pool.query(`
      INSERT INTO referrals (referrer_id, referred_id, stripe_payment_id, payment_amount, commission_rate, commission_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'approved')
      ON CONFLICT (referred_id, stripe_payment_id) DO NOTHING
      RETURNING *
    `, [referrerId, referredUserId, stripePaymentId, paymentAmount, COMMISSION_RATE, commissionAmount]);

    if (result.rows.length > 0) {
      console.log(`Recorded ${COMMISSION_RATE * 100}% commission of $${commissionAmount} for referrer ${referrerId}`);
      return result.rows[0];
    }

    return null;
  } catch (error) {
    console.error('Error recording referral commission:', error);
    return null;
  }
}

// Link a referred user to their referrer (called during signup/checkout)
async function linkReferral(userEmail, referralCode) {
  try {
    if (!referralCode) return false;

    // Find the referrer
    const referrerResult = await pool.query(
      'SELECT id FROM users WHERE referral_code = $1',
      [referralCode.toUpperCase()]
    );

    if (referrerResult.rows.length === 0) {
      console.log(`Invalid referral code: ${referralCode}`);
      return false;
    }

    const referrerId = referrerResult.rows[0].id;

    // Update the referred user (only if not already referred)
    const result = await pool.query(`
      UPDATE users
      SET referred_by = $1
      WHERE email = $2 AND referred_by IS NULL
      RETURNING id
    `, [referrerId, userEmail.toLowerCase()]);

    if (result.rows.length > 0) {
      console.log(`Linked user ${userEmail} to referrer ${referrerId}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error linking referral:', error);
    return false;
  }
}

module.exports = {
  router,
  recordReferralCommission,
  linkReferral,
  COMMISSION_RATE
};
