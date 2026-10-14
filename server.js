require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

// Import Route Handlers
const profileRoutes = require('./backend/routes/profileRoutes');
const skillRoutes = require('./backend/routes/skillRoutes');
const projectRoutes = require('./backend/routes/projectRoutes');
const contactRoutes = require('./backend/routes/contactRoutes');
const analyticsRoutes = require('./backend/routes/analyticsRoutes');
const errorHandler = require('./backend/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = require('./database/db');
connectDB();

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin static files)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: This origin is not allowed by Access-Control-Allow-Origin'));
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Serve static frontend assets from dedicated frontend directory
const FRONTEND_DIR = path.join(__dirname, 'frontend');
app.use(express.static(FRONTEND_DIR));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: statusMap[dbStatus] || 'Unknown',
      connected: dbStatus === 1
    }
  });
});

// REST API Endpoints
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);

// Clean HTML Page Routes pointing to frontend directory
app.get('/', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'about.html')));
app.get('/skills', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'skills.html')));
app.get('/projects', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'projects.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(FRONTEND_DIR, 'contact.html')));

// Fallback Route
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// Centralized Error Handler Middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[Server] Running at http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
