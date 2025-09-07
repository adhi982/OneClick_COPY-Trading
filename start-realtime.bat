@echo off
REM ================================================
REM ONECLICK COPY TRADING - REAL-TIME STARTUP SCRIPT (Windows)
REM ================================================

echo 🚀 Starting OneClick Copy Trading Platform with Real-Time Integration...

REM Check if .env file exists
if not exist ".env" (
    echo [ERROR] .env file not found. Please create one from .env.example
    pause
    exit /b 1
)

echo [SUCCESS] .env file found

REM Function to check if port is available
netstat -an | find "3000" | find "LISTENING" >nul
if %errorlevel% == 0 (
    echo [ERROR] Port 3000 is already in use
    pause
    exit /b 1
)

netstat -an | find "3001" | find "LISTENING" >nul
if %errorlevel% == 0 (
    echo [ERROR] Port 3001 is already in use
    pause
    exit /b 1
)

echo [SUCCESS] Ports 3000 and 3001 are available

REM Start backend
echo [INFO] Starting backend server with real-time integration...
cd backend

if not exist "node_modules" (
    echo [INFO] Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
)

echo [INFO] Launching backend server...
start "OneClick Backend" cmd /c "npm run dev:realtime"

timeout /t 5 /nobreak >nul

cd ..

REM Start frontend
echo [INFO] Starting frontend application...
cd frontend

if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

echo [INFO] Launching frontend application...
start "OneClick Frontend" cmd /c "npm run dev"

timeout /t 5 /nobreak >nul

cd ..

REM Display summary
echo.
echo ================================================
echo 🎉 OneClick Copy Trading Platform Started!
echo ================================================
echo.
echo 📱 Frontend:  http://localhost:3000
echo 🔧 Backend:   http://localhost:3001
echo 📊 Health:    http://localhost:3001/health
echo 📡 WebSocket: ws://localhost:3001
echo.
echo 🔗 Real-Time Features:
echo   ✅ Live trading data
echo   ✅ Market price updates
echo   ✅ Trader performance tracking
echo   ✅ Portfolio monitoring
echo   ✅ Copy trading execution
echo.
echo 🌐 Aptos Network: testnet
echo 📋 Contract: 0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260
echo.
echo Press any key to open browser windows...
echo ================================================

pause

REM Open browser windows
start http://localhost:3000
start http://localhost:3001/health

echo.
echo ✅ Browser windows opened
echo 📝 Check the terminal windows for logs and status
echo 🛑 Close the terminal windows to stop the services
echo.

pause
