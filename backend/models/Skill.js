const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Additional'],
    trim: true
  },
  icon: {
    type: String,
    trim: true,
    default: 'code'
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  order: {
    type: Number,
    default: 0
  },
  isPreview: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

SkillSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Skill', SkillSchema);
