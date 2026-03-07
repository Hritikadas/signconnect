// Environment variable validation
import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW?: number;
  RATE_LIMIT_MAX?: number;
  SENTRY_DSN?: string;
  LOG_LEVEL?: string;
}

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'CORS_ORIGIN'
];

export function validateEnv(): EnvConfig {
  const missing: string[] = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      `Please check your .env file and ensure all required variables are set.`
    );
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security');
  }

  return {
    PORT: parseInt(process.env.PORT || '5001', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN!,
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW 
      ? parseInt(process.env.RATE_LIMIT_WINDOW, 10) 
      : 15,
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX 
      ? parseInt(process.env.RATE_LIMIT_MAX, 10) 
      : 100,
    SENTRY_DSN: process.env.SENTRY_DSN,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
  };
}

export const env = validateEnv();

// Log configuration on startup (without sensitive data)
console.log('📋 Environment Configuration:');
console.log(`   NODE_ENV: ${env.NODE_ENV}`);
console.log(`   PORT: ${env.PORT}`);
console.log(`   CORS_ORIGIN: ${env.CORS_ORIGIN}`);
console.log(`   JWT_EXPIRE: ${env.JWT_EXPIRE}`);
console.log(`   RATE_LIMIT: ${env.RATE_LIMIT_MAX} requests per ${env.RATE_LIMIT_WINDOW} minutes`);
console.log(`   SENTRY: ${env.SENTRY_DSN ? 'Enabled' : 'Disabled'}`);
console.log(`   LOG_LEVEL: ${env.LOG_LEVEL}`);
