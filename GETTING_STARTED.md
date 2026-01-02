# Getting Started with SignConnect

Welcome to SignConnect! This guide will help you get up and running quickly.

## 🎯 What You'll Build

By following this guide, you'll have:
- ✅ A fully functional sign language interpreter
- ✅ Real-time video conferencing
- ✅ AI-powered gesture recognition
- ✅ Live chat with sign language support
- ✅ Production-ready deployment

## 📋 Before You Start

### Required Knowledge
- Basic JavaScript/TypeScript
- React fundamentals
- Node.js basics
- REST API concepts
- Git basics

### Time Required
- **Quick Setup:** 10 minutes
- **Full Setup:** 30 minutes
- **Customization:** 1-2 hours

## 🚀 Step-by-Step Guide

### Step 1: Install Prerequisites (5 minutes)

**1.1 Install Node.js**
```bash
# Check if installed
node -v  # Should be v18 or higher

# If not installed, download from:
# https://nodejs.org/
```

**1.2 Install MongoDB**

Choose one option:

**Option A: MongoDB Atlas (Recommended - Free)**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (takes 5 minutes)
4. Get connection string
5. Save for later

**Option B: Local MongoDB**
```bash
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Windows
# Download from mongodb.com
```

**1.3 Verify Git**
```bash
git --version
```

### Step 2: Clone and Install (5 minutes)

**2.1 Clone Repository**
```bash
git clone <your-repository-url>
cd signconnect
```

**2.2 Run Installer**

**Windows:**
```bash
install.bat
```

**Linux/macOS:**
```bash
chmod +x install.sh
./install.sh
```

This installs all dependencies for frontend and backend.

### Step 3: Configure Environment (5 minutes)

**3.1 Backend Configuration**

Edit `backend/.env`:
```env
# Required
MONGODB_URI=mongodb://localhost:27017/signconnect
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/signconnect

JWT_SECRET=your_super_secret_key_at_least_32_characters_long

# Optional
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Generate JWT Secret:**
```bash
# Linux/macOS
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use any random 32+ character string
```

**3.2 Frontend Configuration**

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000

# Optional - for enhanced features
REACT_APP_OPENAI_API_KEY=sk-your-key-here
```

### Step 4: Start Development Servers (2 minutes)

**4.1 Start Backend**

Open Terminal 1:
```bash
cd backend
npm run dev
```

Wait for:
```
🚀 Server running on port 5000
📡 Socket.IO server ready
✅ MongoDB Connected
```

**4.2 Start Frontend**

Open Terminal 2:
```bash
cd frontend
npm start
```

Browser opens automatically at http://localhost:3000

### Step 5: Test the Application (5 minutes)

**5.1 Create Account**
1. Click "Sign up"
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. Click "Create Account"

**5.2 Create Room**
1. Click "Create New Room"
2. Allow camera/microphone permissions
3. You're in a video call!

**5.3 Test Features**
- Toggle sign detection ON
- Make hand gestures (try "Hello" - all fingers up)
- Send a chat message
- Try screen sharing
- Toggle dark/light mode

**5.4 Test Multi-User (Optional)**
1. Copy room ID from URL
2. Open incognito window
3. Register different user
4. Join room with copied ID
5. Test video call between users

## 🎨 Customization Guide

### Change App Name

**Frontend:**
```typescript
// frontend/src/components/layout/Layout.tsx
<h1>Your App Name</h1>

// frontend/public/index.html
<title>Your App Name</title>
```

**Backend:**
```typescript
// backend/package.json
"name": "your-app-name"
```

### Change Colors

Edit `frontend/tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#your-color',
          600: '#your-color',
          700: '#your-color',
        }
      }
    }
  }
}
```

### Add New Sign Gestures

Edit `frontend/src/components/sign/SignDetector.tsx`:
```typescript
const classifyGesture = (landmarks: any[]): string | null => {
  // Add your custom gesture detection
  if (yourCondition) return 'YourGesture';
  
  // Existing gestures...
}
```

### Customize UI

All components are in `frontend/src/components/`:
- `auth/` - Login/Register pages
- `dashboard/` - Main dashboard
- `video/` - Video call interface
- `chat/` - Chat panel
- `sign/` - Sign detection

## 🐛 Troubleshooting

### Backend Won't Start

**Problem:** MongoDB connection failed
```bash
# Check MongoDB is running
mongod --version

# Start MongoDB
mongod
```

**Problem:** Port already in use
```bash
# Change port in backend/.env
PORT=5001
```

### Frontend Won't Start

**Problem:** Dependencies missing
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Build errors
```bash
# Clear cache
npm cache clean --force
npm install
```

### Camera Not Working

1. Check browser permissions
2. Use HTTPS or localhost
3. Try different browser
4. Check camera in other apps

### Sign Detection Not Working

1. Ensure good lighting
2. Position hands in frame
3. Check browser console for errors
4. Verify MediaPipe CDN accessible

### WebRTC Connection Issues

1. Check firewall settings
2. Verify STUN/TURN servers
3. Test on same network first
4. Check browser WebRTC support

## 📚 Next Steps

### Learn the Codebase

1. **Frontend Architecture**
   - Read `frontend/src/App.tsx`
   - Explore components
   - Understand contexts and hooks

2. **Backend Architecture**
   - Read `backend/src/server.ts`
   - Explore routes and controllers
   - Understand Socket.IO handlers

3. **API Documentation**
   - Read `docs/API.md`
   - Test endpoints with Postman
   - Understand Socket.IO events

### Add Features

**Easy:**
- Add more sign gestures
- Customize UI colors
- Add user avatars
- Add emoji support

**Medium:**
- Add call recording
- Add virtual backgrounds
- Add noise cancellation
- Add more sign languages

**Advanced:**
- Implement learning mode
- Add AI feedback
- Add analytics
- Build mobile app

### Deploy to Production

1. Read `docs/DEPLOYMENT.md`
2. Setup MongoDB Atlas
3. Deploy backend to Railway/AWS
4. Deploy frontend to Vercel
5. Configure environment variables
6. Test production build

## 🎓 Learning Resources

### Documentation
- [Setup Guide](docs/SETUP.md) - Detailed setup
- [API Reference](docs/API.md) - API documentation
- [Features Guide](docs/FEATURES.md) - Feature details
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment

### Technologies
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Socket.IO](https://socket.io/docs/)
- [MediaPipe](https://mediapipe.dev/)
- [WebRTC](https://webrtc.org/)

### Tutorials
- React + TypeScript basics
- WebRTC fundamentals
- Socket.IO real-time apps
- MongoDB with Mongoose
- JWT authentication

## 💡 Tips & Best Practices

### Development
- Use TypeScript for type safety
- Follow component structure
- Keep components small
- Use custom hooks
- Write clear comments

### Performance
- Optimize images
- Lazy load components
- Minimize re-renders
- Use production builds
- Monitor bundle size

### Security
- Never commit .env files
- Use strong JWT secrets
- Validate all inputs
- Keep dependencies updated
- Use HTTPS in production

### Testing
- Test on multiple browsers
- Test on mobile devices
- Test with slow network
- Test error scenarios
- Test edge cases

## 🤝 Getting Help

### Documentation
- Check `/docs` folder
- Read error messages
- Search existing issues

### Community
- GitHub Issues
- Discord (planned)
- Email support

### Debugging
- Check browser console
- Check server logs
- Use React DevTools
- Use Network tab

## ✅ Success Checklist

You're ready when:
- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Can register and login
- [ ] Can create video room
- [ ] Camera and mic work
- [ ] Sign detection works
- [ ] Chat messages send
- [ ] No console errors

## 🎉 You're Ready!

Congratulations! You now have:
- ✅ Working SignConnect installation
- ✅ Understanding of the codebase
- ✅ Ability to customize features
- ✅ Knowledge to deploy to production

**What's Next?**
1. Explore the features
2. Customize the UI
3. Add new gestures
4. Deploy to production
5. Share with users!

---

**Need help?** Check [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) or open an issue.

**Happy coding! 🚀**
