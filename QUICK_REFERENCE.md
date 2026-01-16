# SignConnect - Quick Reference Guide

## 🚀 Starting the Application

### Option 1: Automated (Recommended)
```bash
# Windows
start-dev.bat

# Linux/macOS
./start-dev.sh
```

### Option 2: Manual
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health
- **API Info:** http://localhost:5000/

## 📋 Common Commands

### Development
```bash
# Install all dependencies
npm run install:all

# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm start

# Build for production
npm run build:frontend
npm run build:backend
```

### Database
```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio (Database GUI)
npx prisma studio
```

### Testing
```bash
# Test backend health
curl http://localhost:5000/health

# Test API info
curl http://localhost:5000/

# Register user (example)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login user (example)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Users
- `GET /api/users/profile` - Get user profile (requires token)
- `PUT /api/users/profile` - Update profile (requires token)

### Rooms
- `POST /api/rooms/create` - Create room (requires token)
- `GET /api/rooms/history` - Get room history (requires token)
- `GET /api/rooms/:roomId/messages` - Get messages (requires token)

### System
- `GET /health` - Server health check
- `GET /` - API information

## 📁 Project Structure

```
signconnect/
├── backend/              # Node.js + Express + Prisma
│   ├── src/
│   │   ├── config/      # Database config
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth middleware
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   ├── socket/      # Socket.IO
│   │   └── server.ts    # Entry point
│   ├── prisma/
│   │   └── schema.prisma
│   └── dev.db           # SQLite database
│
├── frontend/            # React + TypeScript
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # State management
│   │   ├── hooks/       # Custom hooks
│   │   └── App.tsx      # Main app
│   └── public/
│
├── docs/                # Documentation
├── start-dev.bat        # Windows start script
├── start-dev.sh         # Linux/Mac start script
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npx prisma generate
npm run dev
```

### Frontend won't compile
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Database issues
```bash
cd backend
npx prisma migrate reset
npx prisma generate
npm run dev
```

### Port already in use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac - Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### CORS errors
- Check `CORS_ORIGIN` in backend/.env matches frontend URL
- Verify frontend is running on http://localhost:3000

## 📊 Current Status

### ✅ Working Features
- User registration and login
- JWT authentication
- Protected routes
- Dashboard with room creation
- Theme toggle (Dark/Light mode)
- High contrast mode
- Responsive design
- Database operations

### 🔄 Ready to Implement
- Video conferencing (WebRTC)
- Sign language detection (MediaPipe)
- Real-time chat (Socket.IO)
- Screen sharing

## 🎯 Testing Workflow

1. **Start servers** using `start-dev.bat` or manually
2. **Open browser** to http://localhost:3000
3. **Register** a new account
4. **Login** with credentials
5. **Access dashboard** - should see create/join room options
6. **Test theme toggle** - switch between dark/light mode
7. **Check backend logs** - should see API requests

## 📝 Development Workflow

1. Make changes to code
2. Frontend auto-reloads (React hot reload)
3. Backend auto-restarts (nodemon)
4. Check browser console for errors
5. Check terminal for server logs
6. Test functionality
7. Commit changes

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Follow platform-specific deployment guide
```

### Docker
```bash
docker-compose up -d
```

## 📞 Support

- **Documentation:** Check `/docs` folder
- **Issues:** Create GitHub issue
- **Logs:** Check terminal output
- **Database:** Use `npx prisma studio`

## 🎉 Quick Tips

- Use `Ctrl+C` to stop servers
- Backend logs show all API requests
- Frontend shows compilation errors in browser
- Database file is at `backend/dev.db`
- Prisma Studio provides GUI for database
- Check `DEPLOYMENT_STATUS.md` for detailed status

---

**Last Updated:** January 16, 2026
**Status:** ✅ Fully Operational
