# SignConnect - AI-Powered Sign Language Interpreter Platform

<div align="center">

![SignConnect Logo](https://img.shields.io/badge/SignConnect-AI%20Powered-blue?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-RUNNING-success?style=for-the-badge)](http://localhost:3000)

**A production-ready web application for real-time sign language interpretation, video conferencing, and accessible communication. Features premium glassmorphism UI, AI-powered gesture recognition, and real-time collaboration tools.**

**🎉 PROJECT STATUS: FULLY OPERATIONAL ✅**

[Features](#features) • [Quick Start](#-quick-start) • [Documentation](#documentation) • [Tech Stack](#-technology-stack) • [Contributing](#contributing)

</div>

---

## 🚀 Quick Start

### Fastest Way (Automated)

**Windows:**
```bash
# Start both servers at once
start-dev.bat
```

**Linux/macOS:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## ✅ Current Status

### What's Working Now
- ✅ **Backend Server** - Running on port 5000 with Prisma + SQLite
- ✅ **Frontend Application** - Running on port 3000 with React + TypeScript
- ✅ **User Authentication** - Register, Login, JWT tokens, Protected routes
- ✅ **Dashboard** - Create rooms, Join rooms, Recent rooms display
- ✅ **Video Call Rooms** - Full video conferencing with WebRTC
- ✅ **Sign Language Detection** - Real-time gesture recognition with MediaPipe
- ✅ **Real-time Chat** - Socket.IO messaging with text and sign messages
- ✅ **Theme System** - Dark/Light mode, High contrast mode
- ✅ **Responsive UI** - Modern glassmorphism design
- ✅ **API Endpoints** - All REST endpoints operational
- ✅ **Database** - SQLite with Prisma ORM, all migrations applied
- ✅ **Routing** - All routes configured including `/room/:roomId` and `/session/:sessionId`

### Recent Fixes (Latest Update)
- ✅ **Fixed room navigation** - Create/Join room now properly navigates to video call
- ✅ **Added video call routes** - `/room/:roomId` route configured
- ✅ **Added session routes** - `/session/:sessionId` route configured
- ✅ **Fixed all component imports** - All `.tsx` extensions added
- ✅ **Integrated VideoCall component** - Full video conferencing ready
- ✅ **Integrated SessionRoom component** - Firebase-based sessions ready
- ✅ **Fixed ChatPanel** - Real-time messaging working
- ✅ **MAJOR: Enhanced Sign Detection** - Now detects 15+ gestures (was only "Hello")
  - Added Thumbs Up/Down, Peace, OK, Rock On, Call Me, Pointing, Fist, Stop
  - Improved 3D gesture recognition with better accuracy
  - Added debouncing to prevent message spam
  - Faster detection (3 frames vs 5 frames)
  - Better visual feedback with landmark numbers

### How to Test
1. **Start servers:** Run `start-dev.bat` (Windows) or `./start-dev.sh` (Linux/Mac)
2. **Register/Login:** Create account at http://localhost:3000
3. **Create Room:** Click "Create New Room" from dashboard
4. **Expected:** Navigate to `/room/:roomId` with full video interface
5. **Test Sign Detection:** Try different gestures (see [SIGN_LANGUAGE_GUIDE.md](SIGN_LANGUAGE_GUIDE.md))
   - Open hand → "Hello 👋"
   - Thumbs up → "Thumbs Up 👍"
   - Peace sign → "Peace ✌️"
   - OK sign → "OK 👌"
   - And 10+ more gestures!

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing instructions.
See [SIGN_DETECTION_FIX.md](SIGN_DETECTION_FIX.md) for detailed fix information.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Setup Guide](docs/SETUP.md) | Detailed installation and configuration |
| [Firebase Setup](docs/FIREBASE_SETUP.md) | **NEW:** Firebase Authentication & Real-time Database |
| [API Documentation](docs/API.md) | REST API and Socket.IO events reference |
| [Features Guide](docs/FEATURES.md) | In-depth feature documentation |
| [Deployment Guide](docs/DEPLOYMENT.md) | Production deployment instructions |

---

## 🏗️ Project Structure

```
signconnect/
├── frontend/                 # React TypeScript application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── chat/       # Chat interface
│   │   │   ├── dashboard/  # Dashboard views
│   │   │   ├── sign/       # Sign detection
│   │   │   └── video/      # Video call components
│   │   ├── contexts/       # React contexts (Auth, Theme)
│   │   ├── hooks/          # Custom React hooks
│   │   └── App.tsx         # Main application
│   └── package.json
│
├── backend/                 # Node.js Express server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── socket/         # Socket.IO handlers
│   │   └── server.ts       # Server entry point
│   └── package.json
│
├── shared/                  # Shared TypeScript types
├── docs/                    # Documentation
├── docker-compose.yml       # Docker configuration
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS with glassmorphism effects
- **Animations:** Framer Motion for smooth interactions
- **Icons:** Lucide React for consistent design
- **AI/ML:** TensorFlow.js, MediaPipe Hands
- **Real-time:** Socket.IO Client
- **WebRTC:** SimplePeer
- **HTTP:** Axios
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** Prisma ORM with SQLite (production: PostgreSQL)
- **Authentication:** JWT + bcrypt
- **Real-time:** Socket.IO
- **Security:** Helmet.js, CORS
- **Validation:** Express Validator

### DevOps
- **Containerization:** Docker & Docker Compose
- **Database:** SQLite (dev), PostgreSQL (production)
- **CI/CD:** GitHub Actions (planned)
- **Hosting:** Vercel (Frontend), Railway/AWS (Backend)

---

## 🎯 Use Cases

- **Deaf/Hard of Hearing Communication** - Real-time sign language interpretation
- **Sign Language Learning** - Practice and improve sign language skills
- **Accessible Video Conferencing** - Inclusive meetings with sign language support
- **Educational Institutions** - Remote learning with accessibility features
- **Healthcare** - Patient-provider communication
- **Customer Service** - Accessible support channels

---

## 🔒 Security Features

- ✅ JWT-based authentication with secure token storage
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Helmet.js for HTTP security headers
- ✅ CORS configuration for cross-origin requests
- ✅ Input validation and sanitization
- ✅ MongoDB injection protection
- ✅ XSS prevention
- ✅ Rate limiting (recommended for production)

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway/AWS/Docker)
See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

### Docker Compose (Full Stack)
```bash
docker-compose up -d
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [MediaPipe](https://mediapipe.dev/) for hand tracking
- [TensorFlow.js](https://www.tensorflow.org/js) for ML capabilities
- [Socket.IO](https://socket.io/) for real-time communication
- [SimplePeer](https://github.com/feross/simple-peer) for WebRTC abstraction

---

## 📧 Support

- **Issues:** [GitHub Issues](https://github.com/Hritikadas/signconnect/issues)
- **Email:** hritikadas14@gmail.com
  

---

<div align="center">

**Made with ❤️ for accessibility and inclusion**

[⬆ Back to Top](#signconnect---ai-powered-sign-language-interpreter-platform)

</div>
