import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import apiRoutes from './routes/api.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './database/seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching dev origins
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in prototype mode to avoid local port friction
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Initialize and seed database safely (does not overwrite user actions)
try {
  seedDatabase(false);
} catch (err) {
  console.error('Failed to initialize/seed database on startup:', err);
}

// Routes
app.use('/api', apiRoutes);

// Root information endpoint
app.get('/', (req, res) => {
  res.json({
    app: 'Coy Discover API',
    version: '1.0.0',
    description: 'Privacy-focused dating discovery prototype backend',
    endpoints: {
      health: 'GET /api/health',
      feed: 'GET /api/feed',
      swipe: 'POST /api/swipe',
      matches: 'GET /api/matches',
      reset: 'POST /api/reset'
    }
  });
});

// 404 & Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  Coy Discover Backend API running`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  Feed API:     http://localhost:${PORT}/api/feed`);
  console.log(`===============================================`);
});

export default app;

