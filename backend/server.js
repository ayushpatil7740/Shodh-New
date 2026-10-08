const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from backend/.env or root .env
const envPaths = [
  path.join(__dirname, '.env'),
  path.join(process.cwd(), 'backend', '.env'),
  path.join(process.cwd(), '.env'),
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}
dotenv.config();

const app = express();

// Connect to Database (MongoDB Atlas with fallback)
connectDB();

// CORS Configuration
const defaultAllowedOrigins = [
  'https://shodh-portal.netlify.app',
  'https://shodh-new.onrender.com',
  'https://shodh-portal.onrender.com',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
];

const envOrigins = [process.env.CLIENT_URL, process.env.FRONTEND_URL]
  .filter(Boolean)
  .flatMap((val) => val.split(',').map((u) => u.trim().replace(/\/+$/, '')))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/+$/, '');
    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.netlify.app') ||
      cleanOrigin.endsWith('.onrender.com') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const passport = require('./config/passport');
app.use(passport.initialize());

// Serve uploaded static files
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Serve frontend static assets from dist folder if built (monolith build on Render)
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

// Route Modules
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Mount routes on BOTH /api/* (standard) and /* (fallback)
// This guarantees that any client calling either /api/auth/login or /auth/login resolves successfully!
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/items', itemRoutes);
app.use('/items', itemRoutes);

app.use('/api/claims', claimRoutes);
app.use('/claims', claimRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/notifications', notificationRoutes);

// Health check endpoint
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Shodh - Lost and Found Portal API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Handle undefined API and service routes
app.all(
  [
    '/api',
    '/api/*',
    '/auth/*',
    '/items/*',
    '/claims/*',
    '/admin/*',
    '/notifications/*',
  ],
  (req, res) => {
    res.status(404).json({
      success: false,
      message: `API Route ${req.originalUrl} not found`,
    });
  }
);

// SPA catch-all for React Router: any other non-API route returns dist/index.html if built
if (fs.existsSync(frontendDistPath)) {
  app.get('*', (req, res, next) => {
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith('/auth') ||
      req.path.startsWith('/items') ||
      req.path.startsWith('/claims') ||
      req.path.startsWith('/admin') ||
      req.path.startsWith('/notifications') ||
      req.path.startsWith('/uploads')
    ) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Shodh Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
});

module.exports = app;
