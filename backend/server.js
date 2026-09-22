const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const itemsRoutes = require('./routes/itemsRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const jsonStorage = require('./utils/jsonStorage');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*', // Allow all origins for dev/demo simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local uploads folder statically for image fallback
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Serve multi-page frontend directory statically
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const items = await jsonStorage.getItems();
    res.status(200).json({
      status: 'healthy',
      message: 'Lost & Found API is operational',
      timestamp: new Date().toISOString(),
      totalItemsCount: items.length,
      cloudinaryConfigured: Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name_here'
      )
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// API Routes
app.use('/api/items', itemsRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the Lost & Found API',
    endpoints: {
      health: '/api/health',
      items: '/api/items',
      lost: 'POST /api/items/lost',
      found: 'POST /api/items/found',
      search: '/api/items/search?q=query'
    }
  });
});

// 404 handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 Lost & Found Backend Server Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Storage: JSON file (backend/data/items.json)`);
  console.log(`=============================================`);
});
