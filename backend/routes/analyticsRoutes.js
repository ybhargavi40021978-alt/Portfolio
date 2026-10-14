const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { recordPageView, recordProjectClick, getStats } = require('../controllers/analyticsController');

// Rate limit: max 60 analytics events per minute per IP
const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many analytics requests, please slow down.' }
});

router.post('/pageview', analyticsLimiter, recordPageView);
router.post('/click', analyticsLimiter, recordProjectClick);
router.get('/stats', getStats);

module.exports = router;
