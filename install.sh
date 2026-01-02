#!/bin/bash

echo "🚀 SignConnect Installation Script"
echo "=================================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo ""

# Setup backend environment
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
else
    echo "✅ Backend .env already exists"
fi
cd ..
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo ""

# Setup frontend environment
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit frontend/.env with your configuration"
else
    echo "✅ Frontend .env already exists"
fi
cd ..
echo ""

echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure backend/.env with your MongoDB URI and JWT secret"
echo "2. Configure frontend/.env with your API URLs"
echo "3. Start MongoDB (if using local): mongod"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm start"
echo ""
echo "📚 Documentation:"
echo "- Setup Guide: docs/SETUP.md"
echo "- API Docs: docs/API.md"
echo "- Features: docs/FEATURES.md"
echo "- Deployment: docs/DEPLOYMENT.md"
echo ""
echo "Happy coding! 🎉"
