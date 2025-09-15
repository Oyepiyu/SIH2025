import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import monasteryRoutes from './routes/monasteryRoutes.js';
import virtualTourRoutes from './routes/virtualTourRoutes.js';
import audioGuideRoutes from './routes/audioGuideRoutes.js';
import manuscriptRoutes from './routes/manuscriptRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';
import { connectDB } from './config/database.js';
import seedDatabase from './utils/seedDB.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB (optional)
const initializeDatabase = async () => {
  const dbConnection = await connectDB();
  if (dbConnection) {
    console.log('✅ Database integration enabled');
    
    // Seed database with initial data
    try {
      console.log('🌱 Seeding database...');
      await seedDatabase();
    } catch (error) {
      console.error('❌ Database seeding failed:', error.message);
    }
  } else {
    console.log('⚠️  Running in standalone mode without database');
  }
};

// Initialize database connection
initializeDatabase();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/monasteries', monasteryRoutes);
app.use('/api/virtual-tours', virtualTourRoutes);
app.use('/api/audio-guides', audioGuideRoutes);
app.use('/api/manuscripts', manuscriptRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;