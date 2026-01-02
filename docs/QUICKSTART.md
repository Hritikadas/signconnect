# SignConnect - Quick Start Guide

Get SignConnect up and running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node -v`)
- ✅ npm installed (`npm -v`)
- ✅ MongoDB running or Atlas account
- ✅ Git installed

## Installation (Choose One)

### Option 1: Automated Script (Recommended)

**Windows:**
```bash
install.bat
```

**Linux/macOS:**
```bash
chmod +x install.sh
./install.sh
```

### Option 2: Manual Installation

```bash
# Install all dependencies
npm run install:all

# Setup environment files
cd backend && cp .env.example .env
cd ../frontend && cp .env.example .env
```

## Configuration

### 1. Backend Configuration (`backend/.env`)

**Minimum Required:**
```env
MONGODB_URI=mongodb://localhost:27017/signconnect
JWT_SECRET=your_secret_key_min_32_chars_long
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/signconnect
```

### 2. Frontend Configuration (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Start Development

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
📡 Socket.IO server ready
✅ MongoDB Connected: localhost
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

Browser opens automatically at `http://localhost:3000`

## First Steps

1. **Register Account**
   - Navigate to http://localhost:3000
   - Click "Sign up"
   - Enter name, email, password
   - Click "Create Account"

2. **Create Room**
   - Click "Create New Room"
   - Share room ID with others

3. **Test Features**
   - Enable camera/microphone
   - Toggle sign detection
   - Send chat messages
   - Try screen sharing

## Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod
```

### Port Already in Use
```bash
# Change port in backend/.env
PORT=5001
```

### Camera Not Working
- Check browser permissions
- Ensure HTTPS or localhost
- Try different browser

### Sign Detection Not Working
- Ensure good lighting
- Position hands in frame
- Check browser console for errors

## Next Steps

- 📖 Read [FEATURES.md](FEATURES.md) for detailed features
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for production
- 📚 Review [API.md](API.md) for API reference
- 🤝 See [CONTRIBUTING.md](../CONTRIBUTING.md) to contribute

## Quick Commands

```bash
# Install everything
npm run install:all

# Start frontend
npm run dev:frontend

# Start backend
npm run dev:backend

# Build for production
npm run build:frontend
npm run build:backend

# Run with Docker
docker-compose up -d
```

## Support

- 🐛 [Report Issues](https://github.com/yourusername/signconnect/issues)
- 💬 [Join Discord](https://discord.gg/signconnect)
- 📧 Email: support@signconnect.com

---

**Ready to build something amazing? Let's go! 🚀**
