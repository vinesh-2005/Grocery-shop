@echo off
title FreshGrocer - Starting Servers...
echo ============================================
echo   FreshGrocer - Starting All Servers
echo ============================================
echo.

:: Start Backend Server in a new window
echo [1/2] Starting Backend Server (port 5000)...
start "FreshGrocer Backend" cmd /k "cd /d %~dp0backend && npm run dev"

:: Wait a moment for backend to initialize
timeout /t 3 /nobreak > nul

:: Start Frontend Server in a new window  
echo [2/2] Starting Frontend Server (port 5173)...
start "FreshGrocer Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ============================================
echo   Both servers are starting!
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo ============================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak > nul
start http://localhost:5173

echo You can close this window now.
timeout /t 3 /nobreak > nul
exit
