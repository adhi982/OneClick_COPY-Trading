import { Router } from 'express';
import { TradersController } from '../controllers/traders.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', TradersController.getAllTraders);
router.get('/top', TradersController.getTopTraders);
router.get('/:id', TradersController.getTrader);
router.get('/:id/trades', TradersController.getTraderTrades);

// Protected routes
router.post('/follow', authMiddleware, TradersController.followTrader);
router.post('/unfollow', authMiddleware, TradersController.unfollowTrader);

export default router;
