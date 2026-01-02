# SignConnect Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connected

### Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure Environment Variables**
   In Vercel dashboard, add:
   - `REACT_APP_API_URL` - Your backend API URL
   - `REACT_APP_SOCKET_URL` - Your Socket.IO server URL
   - `REACT_APP_OPENAI_API_KEY` - OpenAI API key (optional)

3. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

### Alternative: GitHub Integration
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Push to main branch - auto-deploys

---

## Backend Deployment

### Option 1: Railway

1. **Create Railway Account**
   - Visit railway.app
   - Connect GitHub repository

2. **Configure Environment Variables**
   Add all variables from `.env.example`

3. **Deploy**
   - Railway auto-detects Node.js
   - Deploys on push to main branch

### Option 2: AWS EC2

1. **Launch EC2 Instance**
   ```bash
   # Ubuntu 22.04 LTS recommended
   # t2.medium or larger for production
   ```

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm mongodb
   ```

3. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd signconnect/backend
   npm install
   npm run build
   ```

4. **Configure PM2**
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name signconnect
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 3: Docker

1. **Build Image**
   ```bash
   cd backend
   docker build -t signconnect-backend .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     -p 5000:5000 \
     --env-file .env \
     --name signconnect \
     signconnect-backend
   ```

3. **Docker Compose** (with MongoDB)
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         - MONGODB_URI=mongodb://mongo:27017/signconnect
       depends_on:
         - mongo
     
     mongo:
       image: mongo:6
       volumes:
         - mongo-data:/data/db
   
   volumes:
     mongo-data:
   ```

---

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Visit mongodb.com/cloud/atlas
   - Create free cluster

2. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string

3. **Update Environment**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/signconnect
   ```

### Local MongoDB

```bash
# Install MongoDB
sudo apt install mongodb

# Start service
sudo systemctl start mongodb

# Connection string
MONGODB_URI=mongodb://localhost:27017/signconnect
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Monitoring & Logs

### PM2 Monitoring
```bash
pm2 monit
pm2 logs signconnect
```

### Docker Logs
```bash
docker logs -f signconnect
```

---

## Performance Optimization

1. **Enable Compression**
   - Already configured in Express with helmet

2. **CDN for Static Assets**
   - Use Cloudflare or AWS CloudFront

3. **Database Indexing**
   - Indexes already configured in models

4. **Load Balancing**
   - Use AWS ELB or Nginx for multiple instances

---

## Security Checklist

- ✅ Environment variables secured
- ✅ HTTPS enabled
- ✅ CORS configured
- ✅ JWT authentication
- ✅ Helmet.js security headers
- ✅ Rate limiting (add if needed)
- ✅ Input validation
- ✅ MongoDB injection protection

---

## Troubleshooting

### WebRTC Connection Issues
- Ensure STUN/TURN servers configured
- Check firewall rules for UDP ports

### Socket.IO Connection Fails
- Verify CORS settings
- Check WebSocket support on hosting platform

### MongoDB Connection Timeout
- Whitelist IP addresses in MongoDB Atlas
- Check network connectivity

---

## Scaling Considerations

1. **Horizontal Scaling**
   - Use Redis for Socket.IO adapter
   - Session management with Redis

2. **Vertical Scaling**
   - Increase server resources
   - Optimize database queries

3. **Microservices**
   - Separate sign detection service
   - Dedicated media server for WebRTC
