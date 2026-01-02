@echo off
echo 🔥 Firebase Setup for SignConnect
echo.
echo This script will help you set up Firebase environment variables.
echo.
echo Prerequisites:
echo 1. Create a Firebase project at https://console.firebase.google.com/
echo 2. Enable Authentication (Email/Password)
echo 3. Create a Realtime Database
echo 4. Get your web app configuration
echo.
pause
echo.

cd frontend

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
) else (
    echo .env file already exists.
)

echo.
echo Please edit frontend/.env and add your Firebase configuration:
echo.
echo REACT_APP_FIREBASE_API_KEY=your_api_key_here
echo REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
echo REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
echo REACT_APP_FIREBASE_PROJECT_ID=your-project-id
echo REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
echo REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
echo REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
echo.
echo After updating the .env file, restart the development server:
echo npm start
echo.
echo For detailed setup instructions, see: docs/FIREBASE_SETUP.md
echo.
pause