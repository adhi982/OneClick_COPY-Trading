import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All portfolio routes require authentication
router.use(authMiddleware);

router.get('/', PortfolioController.getPortfolio);
router.get('/positions', PortfolioController.getPositions);
router.get('/history', PortfolioController.getTradeHistory);
router.get('/metrics', PortfolioController.getPerformanceMetrics);

export default router;
