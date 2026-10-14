const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { createContact } = require('../controllers/contactController');

// Rate limiting: max 10 contact submissions per 15 minutes per IP to prevent spam attacks
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many messages sent from this IP. Please wait a few minutes before trying again.'
  }
});

router.post('/', contactLimiter, createContact);

module.exports = router;
