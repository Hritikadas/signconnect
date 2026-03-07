import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: (env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes default
  max: env.RATE_LIMIT_MAX || 100, // 100 requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: `${env.RATE_LIMIT_WINDOW || 15} minutes`
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: `${env.RATE_LIMIT_WINDOW || 15} minutes`
    });
  }
});

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Please wait before trying again.',
      retryAfter: '15 minutes'
    });
  }
});

// Rate limiter for registration
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  message: {
    error: 'Too many accounts created from this IP, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});
