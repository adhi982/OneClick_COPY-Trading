import { Router } from 'express';
import { MarketController } from '../controllers/market.controller';

const router = Router();

// Public market data routes
router.get('/prices', MarketController.getCurrentPrices);
router.get('/charts/:symbol', MarketController.getChartData);
router.get('/orderbook/:symbol', MarketController.getOrderBook);
router.get('/sentiment', MarketController.getMarketSentiment);
router.get('/stats', MarketController.getMarketStats);
router.get('/volume', MarketController.getTradingVolume);

export default router;
