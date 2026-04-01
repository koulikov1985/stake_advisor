const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { verifyLimiter } = require('../middleware/rateLimit');

// Activate license on a device
router.post('/v1/activate', verifyLimiter, async (req, res) => {
  try {
    const { license_key, device_id, device_info, email } = req.body;

    if (!license_key) {
      return res.json({
        success: false,
        error: 'License key is required',
        error_code: 'MISSING_KEY'
      });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(license_key)) {
      return res.json({
        success: false,
        error: 'Invalid license key format',
        error_code: 'INVALID_FORMAT'
      });
    }

    const result = await pool.query(
      `SELECT id, email, plan, expires_at, active, device_id
       FROM users
       WHERE license_key = $1`,
      [license_key]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        error: 'License key not found',
        error_code: 'NOT_FOUND'
      });
    }

    const user = result.rows[0];
    const now = new Date();
    const expiresAt = new Date(user.expires_at);

    // Check if license is active
    if (!user.active) {
      return res.json({
        success: false,
        error: 'License has been deactivated',
        error_code: 'DEACTIVATED'
      });
    }

    // Check expiry
    if (expiresAt < now) {
      return res.json({
        success: false,
        error: 'License has expired',
        error_code: 'LICENSE_EXPIRED'
      });
    }

    // Check device binding
    if (user.device_id && user.device_id !== device_id) {
      return res.json({
        success: false,
        error: 'This license is registered to a different device',
        error_code: 'DEVICE_MISMATCH'
      });
    }

    // Bind device if not already bound
    if (!user.device_id && device_id) {
      await pool.query(
        `UPDATE users SET device_id = $1, device_info = $2 WHERE id = $3`,
        [device_id, JSON.stringify(device_info || {}), user.id]
      );
    }

    // Calculate days remaining
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysRemaining = Math.ceil((expiresAt - now) / msPerDay);

    res.json({
      success: true,
      license: {
        status: 'active',
        tier: user.plan,
        license_key: license_key,
        email: user.email,
        device_id: device_id,
        expires_at: user.expires_at,
        days_remaining: daysRemaining
      }
    });
  } catch (error) {
    console.error('Error activating license:', error);
    res.status(500).json({
      success: false,
      error: 'Activation failed',
      error_code: 'SERVER_ERROR'
    });
  }
});

// Validate license (simplified endpoint for periodic checks)
router.post('/v1/validate', verifyLimiter, async (req, res) => {
  try {
    const { license_key, device_id } = req.body;

    if (!license_key) {
      return res.json({
        success: false,
        error: 'License key is required',
        error_code: 'MISSING_KEY'
      });
    }

    const result = await pool.query(
      `SELECT plan, expires_at, active, device_id
       FROM users
       WHERE license_key = $1`,
      [license_key]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        error: 'License key not found',
        error_code: 'NOT_FOUND'
      });
    }

    const user = result.rows[0];
    const now = new Date();
    const expiresAt = new Date(user.expires_at);

    if (!user.active) {
      return res.json({
        success: false,
        error: 'License has been deactivated',
        error_code: 'DEACTIVATED'
      });
    }

    if (expiresAt < now) {
      return res.json({
        success: false,
        error: 'License has expired',
        error_code: 'LICENSE_EXPIRED'
      });
    }

    // Check device binding if device_id provided
    if (device_id && user.device_id && user.device_id !== device_id) {
      return res.json({
        success: false,
        error: 'Device mismatch',
        error_code: 'DEVICE_MISMATCH'
      });
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    const daysRemaining = Math.ceil((expiresAt - now) / msPerDay);

    res.json({
      success: true,
      license: {
        status: 'active',
        tier: user.plan,
        expires_at: user.expires_at,
        days_remaining: daysRemaining
      }
    });
  } catch (error) {
    console.error('Error validating license:', error);
    res.status(500).json({
      success: false,
      error: 'Validation failed',
      error_code: 'SERVER_ERROR'
    });
  }
});

// Deactivate license from device
router.post('/v1/deactivate', verifyLimiter, async (req, res) => {
  try {
    const { license_key, device_id } = req.body;

    if (!license_key) {
      return res.json({
        success: false,
        error: 'License key is required'
      });
    }

    const result = await pool.query(
      `SELECT id, device_id FROM users WHERE license_key = $1`,
      [license_key]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        error: 'License key not found'
      });
    }

    const user = result.rows[0];

    // Verify device matches before allowing deactivation
    if (user.device_id && device_id && user.device_id !== device_id) {
      return res.json({
        success: false,
        error: 'Device mismatch - cannot deactivate from different device'
      });
    }

    // Clear device binding
    await pool.query(
      `UPDATE users SET device_id = NULL, device_info = NULL WHERE id = $1`,
      [user.id]
    );

    res.json({
      success: true,
      message: 'License deactivated from this device'
    });
  } catch (error) {
    console.error('Error deactivating license:', error);
    res.status(500).json({
      success: false,
      error: 'Deactivation failed'
    });
  }
});

module.exports = router;
