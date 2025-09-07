# 🚀 REAL-TIME COPY TRADING INTEGRATION GUIDE

## 📋 Overview

This guide explains how to integrate Kana Labs real-time data into the OneClick Copy Trading platform for live trading data, market updates, and trader performance monitoring.

## 🏗️ Architecture Components

### Backend Services
1. **KanaLabsService** (`kana-labs.service.ts`)
   - Real-time WebSocket connection to Kana Labs
   - Handles trade updates, market data, trader performance
   - Auto-reconnection and subscription management

2. **WebSocketService** (`websocket.service.ts`)
   - Real-time communication with frontend clients
   - User authentication and subscription management
   - Broadcasting updates to connected clients

3. **RealtimeController** (`realtime.controller.ts`)
   - REST API endpoints for real-time data
   - Market data, trader performance, portfolio updates

### Frontend Components
1. **useRealTimeData Hook** (`use-realtime-data.ts`)
   - React hook for managing real-time data
   - Socket connection management
   - Data state management

2. **Real-Time UI Components**
   - `RealTimePortfolioOverview.tsx` - Live portfolio dashboard
   - `RealTimeTraderCard.tsx` - Interactive trader cards
   - `RealTimeMarketData.tsx` - Market data widgets

## 🔧 Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Kana Labs Configuration
KANA_LABS_API_KEY=your_api_key_here
KANA_LABS_WS_URL=wss://api.kanalabs.io/ws
KANA_LABS_API_URL=https://api.kanalabs.io/v1

# JWT Secret for WebSocket Auth
JWT_SECRET=your_jwt_secret_here

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### 2. Backend Dependencies

Install required packages:
```bash
cd backend
npm install socket.io ws jsonwebtoken @types/jsonwebtoken
```

### 3. Frontend Dependencies

Install required packages:
```bash
cd frontend
npm install socket.io-client
```

### 4. Initialize Services

Update `backend/src/app.ts` to initialize services:

```typescript
import { KanaLabsService } from './services/kana-labs.service';
import { WebSocketService } from './services/websocket.service';
import { createServer } from 'http';

// Create HTTP server
const httpServer = createServer(app);

// Initialize services
const kanaLabsService = KanaLabsService.getInstance();
const webSocketService = WebSocketService.getInstance();

// Initialize WebSocket server
webSocketService.initialize(httpServer);

// Initialize Kana Labs connection
kanaLabsService.initialize();

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

## 📊 Real-Time Data Flow

### 1. Data Sources
- **Kana Labs WebSocket** → Real-time trader data, market prices
- **Smart Contracts** → Position updates, trade execution
- **Backend Processing** → Risk management, copy trading logic

### 2. Data Broadcasting
- **KanaLabsService** receives data → **WebSocketService** → **Frontend Clients**
- Filtered by user subscriptions and permissions
- Real-time updates for: trades, prices, performance, positions

### 3. Frontend Integration
```typescript
// Use real-time data in components
const {
  connectionStatus,
  tradeUpdates,
  marketData,
  portfolioData,
  subscribeToTrader,
  subscribeToMarketData
} = useRealTimeData();

// Subscribe to trader updates
useEffect(() => {
  subscribeToTrader('trader_id');
  subscribeToMarketData(['APT/USDC', 'BTC/USDC']);
}, []);
```

## 🔄 Copy Trading Workflow

### 1. Trader Signal Detection
```typescript
// KanaLabsService receives trade signal
handleTradeUpdate(tradeData) {
  // Process trade signal for copy trading
  await TradingService.processTradeSignal({
    traderId: tradeData.traderId,
    symbol: tradeData.symbol,
    type: tradeData.side,
    amount: tradeData.amount,
    price: tradeData.price
  });
}
```

### 2. Risk Assessment & Execution
```typescript
// Assess risk for each follower
const riskAssessment = await TradingService.assessRisk(follower, signal);

if (riskAssessment.isAllowed) {
  // Execute copy trade
  await TradingService.executeCopyTrade(follower, signal, adjustedAmount);
}
```

### 3. Real-Time Updates
```typescript
// Broadcast updates to frontend
webSocketService.broadcastTradeUpdate(tradeData);
webSocketService.broadcastPositionUpdate(positionData);
```

## 📱 Frontend Usage Examples

### Portfolio Dashboard
```typescript
import { RealTimePortfolioOverview } from '@/components/dashboard/RealTimePortfolioOverview';

export default function Dashboard() {
  return (
    <div>
      <RealTimePortfolioOverview />
    </div>
  );
}
```

### Trader Discovery
```typescript
import { RealTimeTraderCard } from '@/components/trader/RealTimeTraderCard';

export default function TradersPage() {
  const traders = useTraders();
  
  return (
    <div>
      {traders.map(trader => (
        <RealTimeTraderCard
          key={trader.id}
          trader={trader}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
        />
      ))}
    </div>
  );
}
```

### Market Data
```typescript
import { RealTimeMarketOverview } from '@/components/dashboard/RealTimeMarketData';

export default function MarketPage() {
  return (
    <div>
      <RealTimeMarketOverview />
    </div>
  );
}
```

## 🔐 Security Considerations

### Authentication
- JWT tokens for WebSocket authentication
- User-specific data filtering
- Rate limiting on API endpoints

### Data Validation
- Input validation for all API endpoints
- Sanitization of real-time data
- Error handling and logging

## 📈 Performance Optimization

### Connection Management
- Auto-reconnection for WebSocket failures
- Subscription cleanup on disconnect
- Heartbeat mechanism for connection health

### Data Caching
- Redis caching for frequently accessed data
- Client-side data caching
- Efficient data broadcasting

## 🐛 Debugging & Monitoring

### Logging
```typescript
// Enable debug logging
LOG_LEVEL=debug

// Monitor WebSocket connections
logger.info(`Connected clients: ${webSocketService.getConnectedClientsCount()}`);
logger.info(`Subscription stats: ${JSON.stringify(webSocketService.getSubscriptionStats())}`);
```

### Health Checks
- WebSocket connection status
- Kana Labs API connectivity
- Database connection health
- Smart contract interaction status

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Kana Labs API key obtained
- [ ] Dependencies installed
- [ ] Services initialized
- [ ] Real-time components integrated
- [ ] WebSocket server running
- [ ] CORS configuration updated
- [ ] SSL certificates for WSS (production)
- [ ] Monitoring and logging configured

## 📞 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check CORS configuration
   - Verify WebSocket URL
   - Check firewall settings

2. **Kana Labs Authentication Error**
   - Verify API key
   - Check network connectivity
   - Validate API endpoint

3. **Real-Time Data Not Updating**
   - Check subscription status
   - Verify user authentication
   - Monitor WebSocket messages

### Support
- Check logs for error details
- Monitor network connectivity
- Verify environment configuration
- Test with simplified examples

## 🎯 Next Steps

1. **Test Integration** - Verify all components work together
2. **Performance Testing** - Load test with multiple users
3. **Security Audit** - Review authentication and data access
4. **User Testing** - Get feedback on real-time features
5. **Production Deployment** - Deploy with monitoring
6. **Feature Enhancement** - Add advanced analytics and alerts
