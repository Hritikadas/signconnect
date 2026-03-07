import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import roomRoutes from './routes/room';
import healthRoutes from './routes/health';
import { setupSocketHandlers } from './socket/handlers';
import { apiLimiter, authLimiter, registerLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true
  }
});

// Security middleware
app.use(helmet());
app.use(cors({ 
  origin: env.CORS_ORIGIN, 
  credentials: true 
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Database connection
connectDatabase();

// Health check routes (no rate limiting)
app.use('/health', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SignConnect API Server',
    version: '1.0.0',
    status: 'operational',
    environment: env.NODE_ENV,
    endpoints: {
      health: '/health',
      healthDetailed: '/health/detailed',
      ready: '/health/ready',
      live: '/health/live',
      auth: '/api/auth',
      users: '/api/users',
      rooms: '/api/rooms'
    },
    timestamp: new Date().toISOString()
  });
});

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Routes with specific rate limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Socket.IO
setupSocketHandlers(io);

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Received shutdown signal, closing server gracefully...');
  
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
    
    // Close database connections
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to log this to an error tracking service
});

const PORT = env.PORT;

httpServer.listen(PORT, () => {
  console.log('🚀 SignConnect Backend Server');
  console.log('================================');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`🔌 Socket.IO server ready`);
  console.log(`🔒 CORS origin: ${env.CORS_ORIGIN}`);
  console.log(`⚡ Rate limiting: ${env.RATE_LIMIT_MAX} requests per ${env.RATE_LIMIT_WINDOW} minutes`);
  console.log('================================');
});

export { io };
