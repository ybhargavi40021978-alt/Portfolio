const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: ['Frontend', 'Full-Stack', 'Backend'],
    trim: true
  },
  technologies: {
    type: [String],
    required: [true, 'Technologies are required'],
    default: []
  },
  thumbnail: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  sourceUrl: {
    type: String,
    trim: true,
    default: null
  },
  liveUrl: {
    type: String,
    trim: true,
    default: null
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

ProjectSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
