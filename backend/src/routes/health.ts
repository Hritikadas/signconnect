import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Basic health check
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'SignConnect API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Detailed health check with database
router.get('/detailed', async (req: Request, res: Response) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: 'unknown',
      memory: 'unknown',
      cpu: 'unknown'
    }
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    healthCheck.checks.database = 'ok';
  } catch (error) {
    healthCheck.status = 'degraded';
    healthCheck.checks.database = 'error';
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };

  healthCheck.checks.memory = memUsageMB.heapUsed < 500 ? 'ok' : 'warning';
  
  // Add memory info
  (healthCheck as any).memory = memUsageMB;

  // CPU usage (basic check)
  const cpuUsage = process.cpuUsage();
  healthCheck.checks.cpu = 'ok';
  (healthCheck as any).cpu = {
    user: cpuUsage.user,
    system: cpuUsage.system
  };

  const statusCode = healthCheck.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// Readiness probe (for Kubernetes/Railway)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check if database is accessible
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false, error: 'Database not accessible' });
  }
});

// Liveness probe (for Kubernetes/Railway)
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({ alive: true });
});

export default router;
