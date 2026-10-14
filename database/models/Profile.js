const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Professional title/role is required'],
    trim: true,
    default: 'Full-stack Developer'
  },
  subtitle: {
    type: String,
    trim: true,
    default: 'Full-stack Developer | Problem Solver | Lifelong Learner'
  },
  headline: {
    type: String,
    trim: true,
    default: 'I build practical, responsive web experiences.'
  },
  intro: {
    type: String,
    trim: true,
    default: 'I am a developer focused on building modern web applications using JavaScript, Node.js, Express.js, and MongoDB.'
  },
  bioParagraph1: {
    type: String,
    trim: true,
    default: 'I am a developer passionate about building modern web applications and creating practical digital experiences. I enjoy turning ideas into functional, responsive interfaces and developing reliable backend systems.'
  },
  bioParagraph2: {
    type: String,
    trim: true,
    default: 'My work focuses on clean user interfaces, maintainable code, API integration, and database-driven applications.'
  },
  portraitUrl: {
    type: String,
    trim: true,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  location: {
    type: String,
    trim: true,
    default: 'San Francisco, CA'
  },
  focus: {
    type: String,
    trim: true,
    default: 'Web Applications, API Development'
  },
  availability: {
    type: String,
    trim: true,
    default: 'Open to professional inquiries'
  },
  socialLinks: {
    github: { type: String, default: 'https://github.com' },
    linkedin: { type: String, default: 'https://linkedin.com' },
    email: { type: String, default: 'mailto:contact@example.com' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);
