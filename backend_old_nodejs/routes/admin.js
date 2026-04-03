const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../db/pool');

// Simple admin auth middleware
const adminAuth = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];

  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Apply auth to all admin routes
router.use(adminAuth);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) as total_licenses,
        COUNT(*) FILTER (WHERE active = true AND expires_at > NOW()) as active_licenses,
        COUNT(*) FILTER (WHERE expires_at < NOW()) as expired_licenses,
        COUNT(*) FILTER (WHERE active = false) as deactivated_licenses,
        COUNT(*) FILTER (WHERE plan = 'daily') as daily_plans,
        COUNT(*) FILTER (WHERE plan = 'weekly') as weekly_plans,
        COUNT(*) FILTER (WHERE plan = 'monthly') as monthly_plans
      FROM users
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all licenses
router.get('/licenses', async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '', status = 'all' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, email, license_key, plan, expires_at, active, created_at, updated_at
      FROM users
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (email ILIKE $${paramIndex} OR license_key::text ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status === 'active') {
      query += ` AND active = true AND expires_at > NOW()`;
    } else if (status === 'expired') {
      query += ` AND expires_at < NOW()`;
    } else if (status === 'deactivated') {
      query += ` AND active = false`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM users WHERE 1=1`;
    const countParams = [];
    let countParamIndex = 1;

    if (search) {
      countQuery += ` AND (email ILIKE $${countParamIndex} OR license_key::text ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (status === 'active') {
      countQuery += ` AND active = true AND expires_at > NOW()`;
    } else if (status === 'expired') {
      countQuery += ` AND expires_at < NOW()`;
    } else if (status === 'deactivated') {
      countQuery += ` AND active = false`;
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      licenses: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching licenses:', error);
    res.status(500).json({ error: 'Failed to fetch licenses' });
  }
});

// Get single license
router.get('/licenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'License not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching license:', error);
    res.status(500).json({ error: 'Failed to fetch license' });
  }
});

// Create or update license
router.post('/licenses', async (req, res) => {
  try {
    const { email, plan, days } = req.body;

    if (!email || !plan || !days) {
      return res.status(400).json({ error: 'Email, plan, and days are required' });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(days));

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    let result;

    if (existingUser.rows.length > 0) {
      // Update existing user with license
      const licenseKey = existingUser.rows[0].license_key || crypto.randomUUID();
      result = await pool.query(
        `UPDATE users
         SET license_key = $1, plan = $2, expires_at = $3, active = true
         WHERE email = $4
         RETURNING *`,
        [licenseKey, plan, expiresAt, email.toLowerCase()]
      );
    } else {
      // Create new user with license
      const licenseKey = crypto.randomUUID();
      result = await pool.query(
        `INSERT INTO users (email, license_key, plan, expires_at, active)
         VALUES ($1, $2, $3, $4, true)
         RETURNING *`,
        [email.toLowerCase(), licenseKey, plan, expiresAt]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating license:', error);
    res.status(500).json({ error: 'Failed to create license' });
  }
});

// Update license
router.put('/licenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { active, plan, expires_at, extend_days } = req.body;

    let query = 'UPDATE users SET ';
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (typeof active === 'boolean') {
      updates.push(`active = $${paramIndex}`);
      params.push(active);
      paramIndex++;
    }

    if (plan) {
      updates.push(`plan = $${paramIndex}`);
      params.push(plan);
      paramIndex++;
    }

    if (expires_at) {
      updates.push(`expires_at = $${paramIndex}`);
      params.push(expires_at);
      paramIndex++;
    }

    if (extend_days) {
      updates.push(`expires_at = GREATEST(expires_at, NOW()) + INTERVAL '${parseInt(extend_days)} days'`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    query += updates.join(', ');
    query += ` WHERE id = $${paramIndex} RETURNING *`;
    params.push(id);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'License not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating license:', error);
    res.status(500).json({ error: 'Failed to update license' });
  }
});

// Delete license
router.delete('/licenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'License not found' });
    }

    res.json({ message: 'License deleted', license: result.rows[0] });
  } catch (error) {
    console.error('Error deleting license:', error);
    res.status(500).json({ error: 'Failed to delete license' });
  }
});

// Reset user password
router.post('/licenses/:id/reset-password', async (req, res) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;

    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(new_password, 10);

    const result = await pool.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, email`,
      [passwordHash, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Password reset successfully',
      email: result.rows[0].email
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// One-time migration endpoint
router.post('/migrate', async (req, res) => {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255)
    `);
    res.json({ message: 'Migration complete' });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
