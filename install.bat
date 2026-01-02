@echo off
echo ================================
echo SignConnect Installation Script
echo ================================
echo.

REM Check Node.js installation
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js v18+ first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node -v
echo npm version:
npm -v
echo.

REM Install root dependencies
echo Installing root dependencies...
call npm install
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
echo.

REM Setup backend environment
if not exist .env (
    echo Creating backend .env file...
    copy .env.example .env
    echo Please edit backend\.env with your configuration
) else (
    echo Backend .env already exists
)
cd ..
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
echo.

REM Setup frontend environment
if not exist .env (
    echo Creating frontend .env file...
    copy .env.example .env
    echo Please edit frontend\.env with your configuration
) else (
    echo Frontend .env already exists
)
cd ..
echo.

echo ================================
echo Installation complete!
echo ================================
echo.
echo Next steps:
echo 1. Configure backend\.env with your MongoDB URI and JWT secret
echo 2. Configure frontend\.env with your API URLs
echo 3. Start MongoDB (if using local)
echo 4. Start backend: cd backend ^&^& npm run dev
echo 5. Start frontend: cd frontend ^&^& npm start
echo.
echo Documentation:
echo - Setup Guide: docs\SETUP.md
echo - API Docs: docs\API.md
echo - Features: docs\FEATURES.md
echo - Deployment: docs\DEPLOYMENT.md
echo.
echo Happy coding!
pause
