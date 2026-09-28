@echo off
TITLE Sentinel Grid Prototype Launcher
echo ==========================================================
echo    SENTINEL GRID - SIH 2026 PROTOTYPE LAUNCHER
echo    Problem Statement SIH26187 (Ministry of Home Affairs)
echo ==========================================================
echo.
echo [1/3] Starting Python Surveillance Backend (ByteTrack + OpenCV CLAHE)...
start "Sentinel Grid Backend" cmd /k "cd /d %~dp0backend && python server.py"

echo [2/3] Waiting 2 seconds for backend initialization...
timeout /t 2 /nobreak >nul

echo [3/3] Starting React Vite Command Center (30 FPS Video Engine)...
start "Sentinel Grid Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Prototype is launching at: http://localhost:5173/
echo Backend API available at:  http://localhost:8000/
echo.
echo Press any key to open the dashboard in your default browser...
pause >nul
start http://localhost:5173/
