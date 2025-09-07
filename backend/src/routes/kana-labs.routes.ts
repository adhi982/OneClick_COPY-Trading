import express from 'express';
import { Request, Response } from 'express';
import { KanaLabsIntegrationService } from '../services/kana-labs-integration.service';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/kana-labs/status
 * Check Kana Labs API connection status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const kanaLabsService = KanaLabsIntegrationService.getInstance();
    // Simple status check
    const defaultMarket = process.env.KANA_DEFAULT_MARKET_ID || 'APT-USDC';
    const marketInfo = await kanaLabsService.getMarketInfo(defaultMarket);
    
    res.json({
      status: 'connected',
      timestamp: new Date().toISOString(),
      defaultMarket,
      marketInfo
    });
  } catch (error) {
    logger.error('Kana Labs status check failed:', error);
    res.status(500).json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/kana-labs/markets
 * Get available markets
 */
router.get('/markets', async (_req: Request, res: Response) => {
  try {
    const kanaLabsService = KanaLabsIntegrationService.getInstance();
    const supportedMarkets = process.env.KANA_SUPPORTED_MARKETS?.split(',') || ['APT-USDC'];
    
    const markets = await Promise.all(
      supportedMarkets.map(async (marketId) => {
        try {
          const marketInfo = await kanaLabsService.getMarketInfo(marketId.trim());
          const price = await kanaLabsService.getMarketPrice(marketId.trim());
          return {
            ...marketInfo,
            currentPrice: price
          };
        } catch (error) {
          logger.warn(`Failed to fetch data for market ${marketId}:`, error);
          return null;
        }
      })
    );

    res.json({
      success: true,
      markets: markets.filter(market => market !== null),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get markets:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/kana-labs/price/:marketId
 * Get real-time price for a specific market
 */
router.get('/price/:marketId', async (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;
    const kanaLabsService = KanaLabsIntegrationService.getInstance();
    
    const price = await kanaLabsService.getMarketPrice(marketId);
    const marketInfo = await kanaLabsService.getMarketInfo(marketId);
    
    res.json({
      success: true,
      marketId,
      price,
      marketInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Failed to get price for ${req.params.marketId}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/kana-labs/positions/:walletAddress
 * Get positions for a wallet address
 */
router.get('/positions/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const kanaLabsService = KanaLabsIntegrationService.getInstance();
    
    const positions = await kanaLabsService.getPositions(walletAddress);
    
    res.json({
      success: true,
      walletAddress,
      positions,
      totalPositions: positions.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Failed to get positions for ${req.params.walletAddress}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/kana-labs/trades/:walletAddress
 * Get trading history for a wallet address
 */
router.get('/trades/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const kanaLabsService = KanaLabsIntegrationService.getInstance();
    
    const trades = await kanaLabsService.getAllTrades(walletAddress, limit);
    
    res.json({
      success: true,
      walletAddress,
      trades,
      totalTrades: trades.length,
      limit,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Failed to get trades for ${req.params.walletAddress}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/kana-labs/order/market
 * Place a market order
 */
router.post('/order/market', async (req: Request, res: Response) => {
  try {
    const { marketId, side, size, leverage, reduceOnly } = req.body;
    
    if (!marketId || !side || !size) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: marketId, side, size',
        timestamp: new Date().toISOString()
      });
    }

    const kanaLabsService = KanaLabsIntegrationService.getInstance();
    
    const orderResult = await kanaLabsService.placeMarketOrder({
      marketId,
      side,
      size,
      leverage,
      reduceOnly
    });
    
    res.json({
      success: true,
      order: orderResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to place market order:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/kana-labs/order/limit
 * Place a limit order
 */
router.post('/order/limit', async (req: Request, res: Response) => {
  try {
    const { marketId, side, size, price, leverage, timeInForce } = req.body;
    
    if (!marketId || !side || !size || !price) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: marketId, side, size, price',
        timestamp: new Date().toISOString()
      });
    }

    const kanaLabsService = KanaLabsIntegrationService.getInstance();
    
    const orderResult = await kanaLabsService.placeLimitOrder({
      marketId,
      side,
      size,
      price,
      leverage,
      timeInForce
    });
    
    res.json({
      success: true,
      order: orderResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to place limit order:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/kana-labs/stats/realtime
 * Get real-time trading statistics
 */
router.get('/stats/realtime', async (_req: Request, res: Response) => {
  try {
    const kanaLabsService = KanaLabsIntegrationService.getInstance();
    const supportedMarkets = process.env.KANA_SUPPORTED_MARKETS?.split(',') || ['APT-USDC'];
    
    const stats = await Promise.all(
      supportedMarkets.map(async (marketId) => {
        try {
          const marketInfo = await kanaLabsService.getMarketInfo(marketId.trim());
          const price = await kanaLabsService.getMarketPrice(marketId.trim());
          
          return {
            marketId: marketId.trim(),
            price,
            marketInfo
          };
        } catch (error) {
          logger.warn(`Failed to fetch stats for market ${marketId}:`, error);
          return null;
        }
      })
    );

    res.json({
      success: true,
      stats: stats.filter(stat => stat !== null),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get real-time stats:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
