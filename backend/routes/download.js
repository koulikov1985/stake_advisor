const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to verify active license
const verifyLicense = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM licenses
       WHERE user_id = $1
       AND active = true
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Active subscription required' });
    }

    req.license = result.rows[0];
    next();
  } catch (err) {
    console.error('License verification error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Download URLs - replace with your actual download URLs
const DOWNLOAD_URLS = {
  mac: process.env.DOWNLOAD_URL_MAC || '/downloads/PokerSharkScope-mac.zip',
  windows: process.env.DOWNLOAD_URL_WINDOWS || '/downloads/PokerSharkScope-windows.zip'
};

// GET /api/download/mac
router.get('/download/mac', verifyToken, verifyLicense, (req, res) => {
  // Log the download
  console.log(`User ${req.userId} downloading Mac version`);

  // Redirect to download URL
  res.redirect(DOWNLOAD_URLS.mac);
});

// GET /api/download/windows
router.get('/download/windows', verifyToken, verifyLicense, (req, res) => {
  // Log the download
  console.log(`User ${req.userId} downloading Windows version`);

  // Redirect to download URL
  res.redirect(DOWNLOAD_URLS.windows);
});

module.exports = router;
