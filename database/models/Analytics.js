const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['pageview', 'project_click'],
    required: true
  },
  page: {
    type: String,
    trim: true
  },
  projectId: {
    type: String,
    trim: true,
    default: null
  },
  projectTitle: {
    type: String,
    trim: true,
    default: null
  },
  linkType: {
    type: String,
    enum: ['live', 'source', null],
    default: null
  },
  // Privacy-conscious: Store only general device category, no raw IP or personal identity
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'unknown'],
    default: 'unknown'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 90 // Auto-archive / expire records after 90 days
  }
}, {
  timestamps: false
});

AnalyticsSchema.index({ type: 1, timestamp: -1 });
AnalyticsSchema.index({ page: 1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
