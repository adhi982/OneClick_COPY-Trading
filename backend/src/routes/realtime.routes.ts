import { Router } from 'express';
import { RealtimeController } from '../controllers/realtime.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public real-time endpoints
router.get('/market-data/:symbol', RealtimeController.getMarketData);
router.get('/market-data', RealtimeController.getAllMarketData);
router.get('/traders/top-performers', RealtimeController.getTopPerformers);
router.get('/traders/:id/performance', RealtimeController.getTraderPerformance);

// Protected real-time endpoints
router.get('/portfolio/live', authMiddleware, RealtimeController.getLivePortfolio);
router.get('/positions/live', authMiddleware, RealtimeController.getLivePositions);
router.get('/trades/live', authMiddleware, RealtimeController.getLiveTrades);

// Subscription management
router.post('/subscribe/trader', authMiddleware, RealtimeController.subscribeToTrader);
router.post('/unsubscribe/trader', authMiddleware, RealtimeController.unsubscribeFromTrader);
router.get('/subscriptions', authMiddleware, RealtimeController.getUserSubscriptions);

// Analytics endpoints
router.get('/analytics/performance', RealtimeController.getPerformanceAnalytics);
router.get('/analytics/market-sentiment', RealtimeController.getMarketSentiment);

export default router;
