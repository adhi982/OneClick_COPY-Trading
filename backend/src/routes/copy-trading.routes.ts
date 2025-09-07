import { Router } from 'express';
import { CopyTradingController } from '../controllers/copy-trading.controller';

const router = Router();
const copyTradingController = new CopyTradingController();

/**
 * 🎯 COPY TRADING EXECUTION ROUTES
 */

// Execute copy trade
router.post('/execute', copyTradingController.executeCopyTrade);

// Start copy trading subscription
router.post('/subscribe', copyTradingController.startCopyTrading);

// Stop copy trading subscription
router.post('/unsubscribe', copyTradingController.stopCopyTrading);

/**
 * 📊 PORTFOLIO & PERFORMANCE ROUTES
 */

// Get trader positions
router.get('/positions/:walletAddress', copyTradingController.getTraderPositions);

// Get portfolio performance
router.get('/performance/:walletAddress', copyTradingController.getPortfolioPerformance);

// Get copy trading statistics
router.get('/stats/:traderWallet/:followerWallet', copyTradingController.getCopyTradingStats);

/**
 * 🛡️ RISK MANAGEMENT ROUTES
 */

// Update risk parameters for an order
router.put('/risk/:orderId', copyTradingController.updateRiskParameters);

export default router;
