# OneClick Copy Trading Backend

Backend API server for the OneClick Copy Trading Platform built on Aptos blockchain.

## Overview

This backend serves as the central API server that handles:
- User authentication and management
- Trader discovery and following
- Portfolio management and analytics
- Real-time market data integration
- Community features and leaderboards
- Risk management and trade execution

## Technology Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (with mock implementation for demo)
- **Caching**: Redis
- **Blockchain**: Aptos SDK
- **External APIs**: CoinAPI.io, Hugging Face (DistilBERT)

## Project Structure

```
src/
├── controllers/        # API request handlers
│   ├── auth.controller.ts
│   ├── traders.controller.ts
│   ├── portfolio.controller.ts
│   ├── market.controller.ts
│   └── community.controller.ts
├── services/          # Business logic services
│   ├── aptos.service.ts
│   ├── market.service.ts
│   └── trading.service.ts
├── models/            # Data models
│   ├── User.ts
│   ├── Trader.ts
│   └── CopySettings.ts
├── routes/            # API route definitions
│   ├── auth.routes.ts
│   ├── traders.routes.ts
│   ├── portfolio.routes.ts
│   ├── market.routes.ts
│   └── community.routes.ts
├── middleware/        # Express middleware
│   ├── auth.middleware.ts
│   └── errorHandler.ts
├── utils/             # Utility functions
│   └── logger.ts
└── app.ts             # Main application entry point
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Required Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=copy_trading
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# External APIs
COINAPI_KEY=your_coinapi_key
HUGGINGFACE_TOKEN=your_hf_token

# Aptos
APTOS_NETWORK=devnet
PRIVATE_KEY=your_private_key

# Server
PORT=3001
JWT_SECRET=your_jwt_secret
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with wallet
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Traders
- `GET /api/traders` - Get all traders with filters
- `GET /api/traders/top` - Get top performing traders
- `GET /api/traders/:id` - Get specific trader details
- `GET /api/traders/:id/trades` - Get trader's trade history
- `POST /api/traders/follow` - Follow a trader
- `POST /api/traders/unfollow` - Unfollow a trader

### Portfolio
- `GET /api/portfolio` - Get user portfolio overview
- `GET /api/portfolio/positions` - Get active positions
- `GET /api/portfolio/history` - Get trade history
- `GET /api/portfolio/metrics` - Get performance metrics

### Market Data
- `GET /api/market/prices` - Get current prices
- `GET /api/market/charts/:symbol` - Get chart data
- `GET /api/market/orderbook/:symbol` - Get order book
- `GET /api/market/sentiment` - Get market sentiment
- `GET /api/market/stats` - Get market statistics
- `GET /api/market/volume` - Get trading volume

### Community
- `GET /api/community/leaderboard` - Get trader leaderboard
- `GET /api/community/feed` - Get community activity feed
- `GET /api/community/stats` - Get community statistics
- `GET /api/community/insights` - Get trader insights
- `POST /api/community/posts` - Create community post

## Features

### Core Functionality
- **Wallet Authentication**: Secure login using Aptos wallet signatures
- **Trader Discovery**: Find and filter top performing traders
- **Copy Trading**: Automatically replicate trader strategies
- **Risk Management**: User-defined limits and safety controls
- **Portfolio Tracking**: Real-time portfolio analytics

### Real-time Data
- **Market Data**: Live price feeds from CoinAPI.io
- **Trade Monitoring**: Real-time trade execution tracking
- **Performance Metrics**: Live portfolio performance calculations

### Community Features
- **Leaderboards**: Top trader rankings and statistics
- **Social Feed**: Community activity and insights
- **Sentiment Analysis**: AI-powered market sentiment using DistilBERT

### Risk Management
- **Position Sizing**: Automatic calculation based on user preferences
- **Stop-Loss**: Automated loss protection
- **Daily Limits**: Spending and exposure controls
- **Diversification**: Multi-trader portfolio management

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm test` - Run test suite
- `npm run lint` - Run ESLint

### Mock Data
The current implementation uses mock data for demonstration purposes. In production:
- Database models would connect to actual PostgreSQL
- Market data would fetch from real APIs
- Blockchain interactions would submit actual transactions

### Adding New Endpoints
1. Create controller method in appropriate controller file
2. Add route definition in corresponding routes file
3. Add any required middleware
4. Update this README with the new endpoint

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker (Future Enhancement)
```bash
docker build -t copy-trading-backend .
docker run -p 3001:3001 copy-trading-backend
```

## Health Check

The server provides a health check endpoint:
```
GET /health
```

Returns:
```json
{
  "status": "OK",
  "timestamp": "2024-09-06T12:00:00.000Z",
  "uptime": 1234.567
}
```

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "timestamp": "2024-09-06T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-09-06T12:00:00.000Z",
  "path": "/api/endpoint"
}
```

## Security

- **JWT Authentication**: Secure user sessions
- **Rate Limiting**: API abuse protection
- **CORS**: Cross-origin request security
- **Helmet**: Security headers
- **Input Validation**: Request sanitization

## Contributing

1. Follow TypeScript best practices
2. Add appropriate error handling
3. Include logging for important operations
4. Update tests for new functionality
5. Update this README for new features

## License

MIT License - see LICENSE file for details
