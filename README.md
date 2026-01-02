# SignConnect - AI-Powered Sign Language Interpreter Platform

<div align="center">

![SignConnect Logo](https://img.shields.io/badge/SignConnect-AI%20Powered-blue?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**A production-ready web application for real-time sign language interpretation, video conferencing, and accessible communication. Features premium glassmorphism UI, AI-powered gesture recognition, and real-time collaboration tools.**

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Tech Stack](#-technology-stack) • [Contributing](#contributing)

</div>

---

## 🌟 Features

### Core Functionality
- 🤟 **Real-time Sign Language Detection** - AI-powered gesture recognition using MediaPipe & TensorFlow.js
- � **Sigan-to-Text Translation** - Automatic conversion of sign language to text in real-time
- � **Vide-o Conferencing** - WebRTC-based video calls with multiple participants
- � **iLive Chat** - Real-time messaging with Socket.IO
- 🎭 **Multi-Language Support** - ASL, BSL, and ISL recognition

### User Experience
- ⚡ **Premium UI** - Glassmorphism design with light pastel blue theme
- 🎨 **Framer Motion** - Smooth animations and micro-interactions
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🌈 **Modern Design** - Inter font, shimmer effects, and premium aesthetics
- ♿ **Accessibility First** - High contrast mode, large buttons, ARIA labels
- 🎯 **Interactive Dashboard** - Live metrics, system health, and activity tracking

### Technical Excellence
- 🚀 **Production Ready** - Optimized build, error handling, logging
- 🔐 **Secure** - JWT authentication, bcrypt hashing, Helmet.js security
- 🗄️ **Prisma ORM** - Type-safe database with SQLite (easily switchable to PostgreSQL)
- 🐳 **Docker Support** - Easy deployment with Docker Compose
- 📝 **TypeScript** - Full type safety across frontend and backend
- ⚡ **Real-time Updates** - Live AI confidence meters and system monitoring

### Extra Features
- 🖥️ **Screen Sharing** - Share your screen during calls
- 🎥 **Call Recording** - Record sessions for later review (planned)
- 🎓 **Learning Mode** - Practice sign language with AI feedback (planned)
- 🌍 **Internationalization** - Multi-language UI support (planned)

---

## 🚀 Quick Start

### Option 1: Firebase-Powered Version (Recommended)

**With Real-time User Connections:**
```bash
git clone <your-repository-url>
cd signconnect

# Set up Firebase (Windows)
setup-firebase.bat

# Or manual setup
cd frontend
cp .env.example .env
# Edit .env with your Firebase config (see docs/FIREBASE_SETUP.md)

# Start the application
npm start
```

### Option 2: Automated Installation (Original Version)

**Linux/macOS:**
```bash
git clone https://github.com/Hritikadas/signconnect.git
cd signconnect
chmod +x install.sh
./install.sh
```

**Windows:**
```bash
git clone https://github.com/Hritikadas/signconnect.git
cd signconnect
install.bat
```

### Manual Installation

**Prerequisites:**
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community) or use [Atlas](https://www.mongodb.com/cloud/atlas))
- Git

**Steps:**

1. **Clone & Install**
   ```bash
   git clone https://github.com/Hritikadas/signconnect.git
   cd signconnect
   npm run install:all
   ```

2. **Configure Environment**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env with your API URLs
   ```

3. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

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
- **Email:** hritikadas@example.com
- **Discord:** [Join our community](https://discord.gg/signconnect)

---

<div align="center">

**Made with ❤️ for accessibility and inclusion**

[⬆ Back to Top](#signconnect---ai-powered-sign-language-interpreter-platform)

</div>