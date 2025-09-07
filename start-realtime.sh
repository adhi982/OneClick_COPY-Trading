#!/bin/bash

# ================================================
# ONECLICK COPY TRADING - REAL-TIME STARTUP SCRIPT
# ================================================

echo "🚀 Starting OneClick Copy Trading Platform with Real-Time Integration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please create one from .env.example"
    exit 1
fi

print_success ".env file found"

# Check if required environment variables are set
check_env_var() {
    if [ -z "${!1}" ]; then
        print_warning "Environment variable $1 is not set"
        return 1
    else
        print_success "Environment variable $1 is set"
        return 0
    fi
}

print_status "Checking environment variables..."

# Load environment variables
source .env

# Check critical environment variables
ENV_CHECK_PASSED=true

if ! check_env_var "APTOS_ACCOUNT_ADDRESS"; then
    ENV_CHECK_PASSED=false
fi

if ! check_env_var "APTOS_ANKR_TESTNET_RPC"; then
    ENV_CHECK_PASSED=false
fi

if ! check_env_var "JWT_SECRET"; then
    ENV_CHECK_PASSED=false
fi

# Check if Kana Labs API key is set (warn if not, but don't fail)
if ! check_env_var "KANA_LABS_API_KEY"; then
    print_warning "Kana Labs API key not set - real-time trading data will use mock data"
fi

if [ "$ENV_CHECK_PASSED" = false ]; then
    print_error "Critical environment variables are missing. Please check your .env file."
    exit 1
fi

print_success "Environment configuration validated"

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        print_error "Port $1 is already in use"
        return 1
    else
        print_success "Port $1 is available"
        return 0
    fi
}

# Check required ports
print_status "Checking port availability..."

if ! check_port 3000; then
    print_error "Frontend port 3000 is occupied. Please stop the process or change the port."
    exit 1
fi

if ! check_port 3001; then
    print_error "Backend port 3001 is occupied. Please stop the process or change the port."
    exit 1
fi

# Function to start backend with real-time support
start_backend() {
    print_status "Starting backend server with real-time integration..."
    cd backend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            print_error "Failed to install backend dependencies"
            exit 1
        fi
    fi
    
    # Start backend with real-time server
    print_status "Launching backend server..."
    npm run dev:realtime &
    BACKEND_PID=$!
    
    # Wait a moment for backend to start
    sleep 5
    
    # Check if backend is running
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_success "Backend server started successfully (PID: $BACKEND_PID)"
    else
        print_error "Failed to start backend server"
        exit 1
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend application..."
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            print_error "Failed to install frontend dependencies"
            exit 1
        fi
    fi
    
    # Start frontend
    print_status "Launching frontend application..."
    npm run dev &
    FRONTEND_PID=$!
    
    # Wait a moment for frontend to start
    sleep 5
    
    # Check if frontend is running
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_success "Frontend application started successfully (PID: $FRONTEND_PID)"
    else
        print_error "Failed to start frontend application"
        exit 1
    fi
    
    cd ..
}

# Function to display startup summary
display_summary() {
    echo ""
    echo "================================================"
    echo "🎉 OneClick Copy Trading Platform Started!"
    echo "================================================"
    echo ""
    echo "📱 Frontend:  http://localhost:3000"
    echo "🔧 Backend:   http://localhost:3001"
    echo "📊 Health:    http://localhost:3001/health"
    echo "📡 WebSocket: ws://localhost:3001"
    echo ""
    echo "🔗 Real-Time Features:"
    echo "  ✅ Live trading data"
    echo "  ✅ Market price updates"
    echo "  ✅ Trader performance tracking"
    echo "  ✅ Portfolio monitoring"
    echo "  ✅ Copy trading execution"
    echo ""
    echo "🌐 Aptos Network: $APTOS_NETWORK"
    echo "📋 Contract: $APTOS_ACCOUNT_ADDRESS"
    echo ""
    echo "Press Ctrl+C to stop all services"
    echo "================================================"
}

# Cleanup function
cleanup() {
    print_status "Shutting down services..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        print_success "Backend server stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        print_success "Frontend application stopped"
    fi
    
    print_success "All services stopped successfully"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start services
start_backend
start_frontend

# Display summary
display_summary

# Wait for user interrupt
while true; do
    sleep 1
done
