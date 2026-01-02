# SignConnect Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd signconnect
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Required: MONGODB_URI, JWT_SECRET
nano .env  # or use your preferred editor

# Start development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start development server
npm start
```

The frontend will open automatically at `http://localhost:3000`

---

## Environment Configuration

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database - Choose one:
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/signconnect

# Option 2: MongoDB Atlas (Recommended)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/signconnect

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# OpenAI (Optional - for enhanced NLP features)
OPENAI_API_KEY=sk-your-openai-api-key

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_OPENAI_API_KEY=sk-your-openai-api-key
```

---

## MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB**
   ```bash
   # macOS
   brew tap mongodb/brew
   brew install mongodb-community

   # Ubuntu
   sudo apt-get install mongodb

   # Windows
   # Download installer from mongodb.com
   ```

2. **Start MongoDB**
   ```bash
   # macOS/Linux
   sudo systemctl start mongodb
   # or
   mongod

   # Windows
   # MongoDB runs as a service automatically
   ```

3. **Verify Connection**
   ```bash
   mongo
   # Should connect to MongoDB shell
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier
   - Select region closest to you
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access"
   - Add new database user
   - Save username and password

4. **Setup Network Access**
   - Go to "Network Access"
   - Add IP Address
   - For development: Allow access from anywhere (0.0.0.0/0)
   - For production: Add specific IPs

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Update `MONGODB_URI` in backend `.env`

---

## Testing the Setup

### 1. Check Backend Health

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Access Frontend

Open browser and navigate to `http://localhost:3000`

You should see the SignConnect login page.

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution:**
- Check if MongoDB is running: `sudo systemctl status mongodb`
- Verify connection string in `.env`
- For Atlas: Check network access whitelist

### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: WebRTC not working

**Solution:**
- Ensure you're using HTTPS (or localhost)
- Check browser permissions for camera/microphone
- Verify firewall settings

### Issue: Sign detection not working

**Solution:**
- Ensure camera permissions granted
- Check browser console for errors
- Verify MediaPipe CDN is accessible
- Try different lighting conditions

---

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Changes auto-refresh browser
- Backend: Uses nodemon for auto-restart

### Debugging

**Backend:**
```bash
# Add to package.json scripts
"debug": "node --inspect src/server.ts"

# Then attach debugger in VS Code
```

**Frontend:**
```javascript
// Use React DevTools browser extension
// Add console.logs or debugger statements
```

### Database GUI Tools

- **MongoDB Compass** - Official GUI
- **Robo 3T** - Lightweight alternative
- **Studio 3T** - Advanced features

---

## Next Steps

1. ✅ Setup complete
2. 📖 Read [FEATURES.md](./FEATURES.md) for feature overview
3. 🚀 Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
4. 📚 Review [API.md](./API.md) for API documentation
5. 🎨 Customize the application for your needs

---

## Getting Help

- Check existing issues on GitHub
- Review documentation in `/docs` folder
- Contact support team
- Join community Discord

---

## Development Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and test

# Commit changes
git add .
git commit -m "Add your feature"

# Push to repository
git push origin feature/your-feature

# Create pull request on GitHub
```

Happy coding! 🚀
