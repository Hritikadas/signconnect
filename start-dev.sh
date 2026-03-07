#!/bin/bash

echo "========================================"
echo "  SignConnect - Development Server"
echo "========================================"
echo ""

echo "Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!

sleep 3

echo "Starting Frontend Server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  Servers Running"
echo "========================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
