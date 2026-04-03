const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { apiLimiter } = require('../middleware/rateLimit');

// Get license by email
router.get('/license/:email', apiLimiter, async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const result = await pool.query(
      `SELECT license_key, plan, expires_at, active, created_at
       FROM users
       WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No license found for this email' });
    }

    const user = result.rows[0];
    const now = new Date();
    const expiresAt = new Date(user.expires_at);
    const isExpired = expiresAt < now;

    res.json({
      licenseKey: user.license_key,
      plan: user.plan,
      expiresAt: user.expires_at,
      active: user.active && !isExpired,
      isExpired,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Error fetching license:', error);
    res.status(500).json({ error: 'Failed to fetch license' });
  }
});

// Check if email has active license
router.post('/check-email', apiLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const result = await pool.query(
      `SELECT license_key, plan, expires_at, active
       FROM users
       WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.json({ hasLicense: false });
    }

    const user = result.rows[0];
    const now = new Date();
    const expiresAt = new Date(user.expires_at);
    const isActive = user.active && expiresAt > now;

    res.json({
      hasLicense: true,
      isActive,
      plan: user.plan,
      expiresAt: user.expires_at
    });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Failed to check email' });
  }
});

module.exports = router;
