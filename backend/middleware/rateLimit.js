const rateLimit = require('express-rate-limit');

// Rate limiter for verification endpoint
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many verification requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiter for checkout creation
const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 checkout attempts per hour per IP
  message: {
    error: 'Too many checkout attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  verifyLimiter,
  apiLimiter,
  checkoutLimiter
};
