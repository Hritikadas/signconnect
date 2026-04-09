@echo off
echo ========================================
echo   SignConnect - Starting All Services
echo ========================================
echo.

echo [1/3] Starting ML Bridge (Python)...
start "ML Bridge - Port 5050" cmd /k "cd /d %~dp0ml_inference && python ml_bridge.py"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend (Node.js)...
start "Backend - Port 5001" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend (React)...
start "Frontend - Port 3000" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo   All services starting in new windows!
echo ----------------------------------------
echo   Frontend  : http://localhost:3000
echo   Backend   : http://localhost:5001
echo   ML Bridge : http://localhost:5050
echo ========================================
echo.
pause
