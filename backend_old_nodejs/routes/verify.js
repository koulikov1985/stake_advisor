const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { verifyLimiter } = require('../middleware/rateLimit');

// Verify license key (called by software)
router.post('/verify', verifyLimiter, async (req, res) => {
  try {
    const { license_key } = req.body;

    if (!license_key) {
      return res.status(400).json({
        valid: false,
        error: 'License key is required'
      });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(license_key)) {
      return res.status(400).json({
        valid: false,
        error: 'Invalid license key format'
      });
    }

    const result = await pool.query(
      `SELECT plan, expires_at, active
       FROM users
       WHERE license_key = $1`,
      [license_key]
    );

    if (result.rows.length === 0) {
      return res.json({
        valid: false,
        error: 'License key not found'
      });
    }

    const user = result.rows[0];
    const now = new Date();
    const expiresAt = new Date(user.expires_at);

    // Check if license is active and not expired
    if (!user.active) {
      return res.json({
        valid: false,
        error: 'License has been deactivated'
      });
    }

    if (expiresAt < now) {
      return res.json({
        valid: false,
        error: 'License has expired',
        expired_at: user.expires_at
      });
    }

    // Calculate days remaining
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysRemaining = Math.ceil((expiresAt - now) / msPerDay);

    res.json({
      valid: true,
      plan: user.plan,
      expires_at: user.expires_at,
      days_remaining: daysRemaining
    });
  } catch (error) {
    console.error('Error verifying license:', error);
    res.status(500).json({
      valid: false,
      error: 'Verification failed'
    });
  }
});

module.exports = router;
