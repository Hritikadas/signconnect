# SignConnect - Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying SignConnect to production with all necessary configurations, optimizations, and monitoring in place.

## Prerequisites

- GitHub account with repository access
- Vercel account (free tier available)
- Railway or Render account (free tier available)
- Firebase project configured
- PostgreSQL database (included with Railway/Render)

## Quick Start

### 1. Environment Setup

**Frontend (.env.production):**
```bash
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_SOCKET_URL=https://your-backend.railway.app
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
REACT_APP_ENV=production
```

**Backend (.env.production):**
```bash
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://user:pass@host:5432/signconnect
JWT_SECRET=your_super_secure_secret_at_least_32_chars
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend.vercel.app
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### 2. Deploy Frontend to Vercel

**Option A: Vercel CLI**
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

**Option B: GitHub Integration (Recommended)**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variables from `.env.production`
6. Click "Deploy"

### 3. Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Build Command: `npm install && npm run build`
5. Add PostgreSQL database:
   - Click "New" → "Database" → "PostgreSQL"
   - Copy DATABASE_URL to environment variables
6. Add all environment variables from `.env.production`
7. Deploy

### 4. Database Migration

```bash
# Connect to your Railway database
cd backend
npx prisma migrate deploy
npx prisma db seed  # If you have seed data
```

### 5. Verify Deployment

**Health Checks:**
- Frontend: https://your-app.vercel.app
- Backend: https://your-api.railway.app/health
- Detailed Health: https://your-api.railway.app/health/detailed

**Test Features:**
- User registration
- User login
- Dashboard access
- Video call functionality
- Sign detection
- Chat messaging

## Production Features Implemented

### ✅ Security
- Rate limiting on all API endpoints
- JWT authentication with secure secrets
- Helmet.js security headers
- CORS configuration
- Input validation
- Bcrypt password hashing
- Environment variable validation

### ✅ Performance
- Production build optimization
- Code splitting (ready for implementation)
- Asset optimization
- Response compression
- Database connection pooling
- Efficient error handling

### ✅ Monitoring
- Health check endpoints (/health, /health/detailed, /health/ready, /health/live)
- Structured logging
- Error tracking (Sentry-ready)
- Performance metrics
- Uptime monitoring

### ✅ Reliability
- Graceful shutdown handling
- Unhandled rejection catching
- Database connection validation
- Environment variable validation
- Error boundaries (frontend)

## Environment Variables Reference

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | https://api.signconnect.com |
| REACT_APP_SOCKET_URL | Socket.IO server URL | https://api.signconnect.com |
| REACT_APP_FIREBASE_API_KEY | Firebase API key | AIzaSy... |
| REACT_APP_FIREBASE_AUTH_DOMAIN | Firebase auth domain | project.firebaseapp.com |
| REACT_APP_FIREBASE_PROJECT_ID | Firebase project ID | project-id |
| REACT_APP_FIREBASE_STORAGE_BUCKET | Firebase storage | project.firebasestorage.app |
| REACT_APP_FIREBASE_MESSAGING_SENDER_ID | Firebase sender ID | 123456789 |
| REACT_APP_FIREBASE_APP_ID | Firebase app ID | 1:123:web:abc |
| REACT_APP_FIREBASE_DATABASE_URL | Firebase database URL | https://project.firebaseio.com |

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment | production |
| PORT | Server port | 5001 |
| DATABASE_URL | PostgreSQL connection | postgresql://... |
| JWT_SECRET | JWT signing secret | min 32 characters |
| JWT_EXPIRE | Token expiration | 7d |
| CORS_ORIGIN | Allowed origin | https://app.com |
| RATE_LIMIT_WINDOW | Rate limit window (min) | 15 |
| RATE_LIMIT_MAX | Max requests per window | 100 |

## Monitoring & Maintenance

### Health Checks

**Basic Health:**
```bash
curl https://your-api.railway.app/health
```

**Detailed Health (includes database, memory, CPU):**
```bash
curl https://your-api.railway.app/health/detailed
```

**Readiness Probe:**
```bash
curl https://your-api.railway.app/health/ready
```

**Liveness Probe:**
```bash
curl https://your-api.railway.app/health/live
```

### Logs

**Vercel:**
- Dashboard → Your Project → Deployments → View Logs

**Railway:**
- Dashboard → Your Project → Deployments → View Logs

### Error Tracking (Optional - Sentry)

1. Create account at [sentry.io](https://sentry.io)
2. Create new project
3. Get DSN key
4. Add to environment variables:
   - Frontend: `REACT_APP_SENTRY_DSN`
   - Backend: `SENTRY_DSN`

## Performance Optimization

### Frontend
- Bundle size optimized with Create React App
- Code splitting ready for implementation
- Images optimized
- Lazy loading for routes
- Service worker for caching (optional)

### Backend
- Response compression enabled
- Database queries optimized
- Connection pooling configured
- Rate limiting prevents abuse
- Efficient error handling

## Security Best Practices

1. **Never commit .env files** - Use .env.example as template
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Enable HTTPS** - Vercel and Railway provide this automatically
4. **Regular updates** - Keep dependencies updated
5. **Monitor logs** - Check for suspicious activity
6. **Rate limiting** - Prevents abuse and DDoS
7. **Input validation** - All user inputs validated
8. **Secure headers** - Helmet.js configured

## Troubleshooting

### Frontend Issues

**Blank page:**
- Check browser console for errors
- Verify environment variables in Vercel
- Check API URL is correct
- Verify Firebase configuration

**API connection failed:**
- Check CORS configuration
- Verify backend is running
- Check network tab in browser
- Verify API URL is accessible

### Backend Issues

**Database connection failed:**
- Verify DATABASE_URL is correct
- Check database is running
- Test connection with Prisma Studio
- Check firewall rules

**Rate limiting too strict:**
- Adjust RATE_LIMIT_MAX and RATE_LIMIT_WINDOW
- Check if legitimate traffic is blocked
- Review rate limiter configuration

**Memory issues:**
- Check /health/detailed endpoint
- Monitor Railway metrics
- Increase instance size if needed
- Check for memory leaks

## Rollback Procedure

### Vercel (Frontend)
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Railway (Backend)
1. Go to Deployments
2. Find previous working deployment
3. Click "Redeploy"

### Database
1. Restore from automated backup
2. Test connection
3. Verify data integrity

## Cost Estimates

### Free Tier (Suitable for MVP/Testing)
- Vercel: Free (100GB bandwidth, unlimited deployments)
- Railway: $5/month credit (includes PostgreSQL)
- Firebase: Free tier (50K reads/day, 20K writes/day)
- **Total: ~$5/month**

### Production Tier (Recommended for Launch)
- Vercel Pro: $20/month (1TB bandwidth, analytics)
- Railway: ~$20/month (includes PostgreSQL, more resources)
- Firebase Blaze: Pay-as-you-go (estimate $10-50/month)
- **Total: ~$50-90/month**

## Support & Resources

- **Documentation:** See `/docs` folder
- **Issues:** GitHub Issues
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Firebase Docs:** https://firebase.google.com/docs

## Next Steps

1. ✅ Deploy to production
2. ✅ Verify all features working
3. ⏳ Set up error tracking (Sentry)
4. ⏳ Configure custom domain
5. ⏳ Set up CI/CD pipeline
6. ⏳ Add monitoring alerts
7. ⏳ Performance testing
8. ⏳ Security audit

---

**Deployment Status:** ✅ Production Ready

**Last Updated:** March 4, 2026

**Version:** 1.0.0
