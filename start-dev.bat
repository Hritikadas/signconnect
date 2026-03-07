@echo off
echo ========================================
echo   SignConnect - Development Server
echo ========================================
echo.

echo Starting Backend Server...
start "SignConnect Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "SignConnect Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
