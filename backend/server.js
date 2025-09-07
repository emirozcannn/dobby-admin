const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Test database connection
testConnection();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Dobby Cafe Backend API is running!',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Dobby Cafe Backend Server Running! 🚀',
    timestamp: new Date().toISOString(),
    status: 'success',
    endpoints: [
      'GET  /',
      'GET  /api/health',
      'POST /api/auth/login',
      'GET  /api/auth/me',
      'POST /api/auth/logout',
      'GET  /api/menu',
      'GET  /api/menu/categories'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.path}`
  });
});

// Global error handling middleware
// Error handling middleware
app.use((err, req, res, _next) => {
  console.error('Global error handler:', err.stack);

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Dobby Cafe Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
    console.log('📡 API endpoints available:');
    console.log('   GET  /                      - Server status');
    console.log('   GET  /api/health            - Health check');
    console.log('   POST /api/auth/login        - Login');
    console.log('   GET  /api/auth/me           - Get profile');
    console.log('   POST /api/auth/logout       - Logout');
    console.log('   GET  /api/menu              - Get menu items');
    console.log('   GET  /api/menu/categories   - Get categories');
    console.log('💾 Database: PostgreSQL');
    console.log('🔐 Authentication: JWT');
    console.log('✅ Security: Helmet + CORS + Validation');
  });
}

module.exports = app;
