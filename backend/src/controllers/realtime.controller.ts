import { Request, Response } from 'express';
import { KanaLabsService } from '../services/kana-labs.service';
import { MarketService } from '../services/market.service';
import { logger } from '../utils/logger';

export class RealtimeController {
  private static kanaLabsService = KanaLabsService.getInstance();

  /**
   * Get real-time market data for a specific symbol
   */
  static async getMarketData(req: Request, res: Response): Promise<Response> {
    try {
      const { symbol } = req.params;
      
      if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required' });
      }

      // Get current market data
      const marketData = await MarketService.getCurrentPrices([symbol]);
      
      if (marketData.length === 0) {
        return res.status(404).json({ error: 'Market data not found' });
      }

      return res.json({
        success: true,
        data: marketData[0],
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching market data:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch market data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get real-time market data for all supported symbols
   */
  static async getAllMarketData(_req: Request, res: Response): Promise<Response> {
    try {
      const symbols = ['APT/USDC', 'BTC/USDC', 'ETH/USDC', 'SOL/USDC', 'USDC/USD'];
      const marketData = await MarketService.getCurrentPrices(symbols);

      return res.json({
        success: true,
        data: marketData,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching all market data:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch market data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get top performing traders with real-time data
   */
  static async getTopPerformers(req: Request, res: Response) {
    try {
      const { timeframe = '24h', limit = 10 } = req.query;
      
      // Get top traders from Kana Labs
      const topTraders = await RealtimeController.kanaLabsService.getTopTraders(
        timeframe as '1h' | '24h' | '7d' | '30d'
      );

      res.json({
        success: true,
        data: topTraders.slice(0, Number(limit)),
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching top performers:', error);
      res.status(500).json({ 
        error: 'Failed to fetch top performers',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get real-time performance data for a specific trader
   */
  static async getTraderPerformance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { limit = 100 } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Trader ID is required' });
      }

      // Get trader history from Kana Labs
      const traderHistory = await RealtimeController.kanaLabsService.getTraderHistory(
        id, 
        Number(limit)
      );

      res.json({
        success: true,
        data: traderHistory,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching trader performance:', error);
      res.status(500).json({ 
        error: 'Failed to fetch trader performance',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get live portfolio data for authenticated user
   */
  static async getLivePortfolio(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Mock portfolio data - replace with real implementation
      const portfolioData = {
        totalValue: 25000,
        totalPnL: 3450,
        activePositions: 5,
        dailyChange: 2.3,
        positions: [
          {
            symbol: 'APT/USDC',
            amount: 1000,
            currentValue: 8930,
            pnl: 450,
            pnlPercentage: 5.3,
            status: 'open'
          },
          {
            symbol: 'BTC/USDC',
            amount: 0.5,
            currentValue: 34125,
            pnl: -250,
            pnlPercentage: -0.7,
            status: 'open'
          }
        ],
        lastUpdated: new Date().toISOString()
      };

      res.json({
        success: true,
        data: portfolioData,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching live portfolio:', error);
      res.status(500).json({ 
        error: 'Failed to fetch portfolio data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get live positions for authenticated user
   */
  static async getLivePositions(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Mock positions data - replace with real implementation
      const positions = [
        {
          id: 'pos_1',
          symbol: 'APT/USDC',
          side: 'long',
          amount: 1000,
          entryPrice: 8.50,
          currentPrice: 8.93,
          pnl: 430,
          pnlPercentage: 5.06,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'open'
        },
        {
          id: 'pos_2',
          symbol: 'ETH/USDC',
          side: 'long',
          amount: 5,
          entryPrice: 3400,
          currentPrice: 3420,
          pnl: 100,
          pnlPercentage: 0.59,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'open'
        }
      ];

      res.json({
        success: true,
        data: positions,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching live positions:', error);
      res.status(500).json({ 
        error: 'Failed to fetch positions',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get live trades for authenticated user
   */
  static async getLiveTrades(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { limit = 50 } = req.query;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Mock trades data - replace with real implementation
      const trades = [
        {
          id: 'trade_1',
          traderId: 'trader_123',
          symbol: 'APT/USDC',
          side: 'buy',
          amount: 500,
          price: 8.93,
          timestamp: new Date(Date.now() - 300000).toISOString(),
          status: 'executed',
          pnl: 25.50
        },
        {
          id: 'trade_2',
          traderId: 'trader_456',
          symbol: 'ETH/USDC',
          side: 'sell',
          amount: 2,
          price: 3420,
          timestamp: new Date(Date.now() - 600000).toISOString(),
          status: 'executed',
          pnl: -15.20
        }
      ];

      res.json({
        success: true,
        data: trades.slice(0, Number(limit)),
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching live trades:', error);
      res.status(500).json({ 
        error: 'Failed to fetch trades',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Subscribe to trader updates
   */
  static async subscribeToTrader(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { traderId } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!traderId) {
        return res.status(400).json({ error: 'Trader ID is required' });
      }

      // Subscribe to trader through Kana Labs
      await RealtimeController.kanaLabsService.subscribeToTrader(traderId);

      // TODO: Store user subscription in database
      logger.info(`User ${userId} subscribed to trader ${traderId}`);

      res.json({
        success: true,
        message: `Successfully subscribed to trader ${traderId}`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error subscribing to trader:', error);
      res.status(500).json({ 
        error: 'Failed to subscribe to trader',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Unsubscribe from trader updates
   */
  static async unsubscribeFromTrader(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { traderId } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!traderId) {
        return res.status(400).json({ error: 'Trader ID is required' });
      }

      // TODO: Remove user subscription from database
      logger.info(`User ${userId} unsubscribed from trader ${traderId}`);

      res.json({
        success: true,
        message: `Successfully unsubscribed from trader ${traderId}`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error unsubscribing from trader:', error);
      res.status(500).json({ 
        error: 'Failed to unsubscribe from trader',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get user subscriptions
   */
  static async getUserSubscriptions(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Mock subscriptions - replace with database query
      const subscriptions = [
        {
          traderId: 'trader_123',
          traderName: 'CryptoMaster',
          subscribedAt: new Date(Date.now() - 86400000).toISOString(),
          isActive: true
        },
        {
          traderId: 'trader_456',
          traderName: 'AptosWhale',
          subscribedAt: new Date(Date.now() - 172800000).toISOString(),
          isActive: true
        }
      ];

      res.json({
        success: true,
        data: subscriptions,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching user subscriptions:', error);
      res.status(500).json({ 
        error: 'Failed to fetch subscriptions',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get performance analytics
   */
  static async getPerformanceAnalytics(req: Request, res: Response) {
    try {
      const { timeframe = '7d' } = req.query;

      // Mock analytics data
      const analytics = {
        totalTradersTracked: 1247,
        totalTradesExecuted: 15632,
        averageWinRate: 67.8,
        topPerformingStrategy: 'DeFi Yield Farming',
        marketVolatility: 0.23,
        riskMetrics: {
          averageDrawdown: 8.5,
          sharpeRatio: 1.42,
          volatility: 0.31
        },
        timeframe: timeframe as string
      };

      res.json({
        success: true,
        data: analytics,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching performance analytics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get market sentiment data
   */
  static async getMarketSentiment(req: Request, res: Response) {
    try {
      // Mock sentiment data
      const sentiment = {
        overall: {
          score: 0.65,
          label: 'bullish',
          confidence: 0.78
        },
        byAsset: [
          {
            symbol: 'APT/USDC',
            score: 0.72,
            label: 'bullish',
            confidence: 0.85,
            volume24h: 2500000
          },
          {
            symbol: 'BTC/USDC',
            score: 0.58,
            label: 'neutral',
            confidence: 0.72,
            volume24h: 15000000000
          },
          {
            symbol: 'ETH/USDC',
            score: 0.81,
            label: 'bullish',
            confidence: 0.89,
            volume24h: 8000000000
          }
        ],
        lastUpdated: new Date().toISOString()
      };

      res.json({
        success: true,
        data: sentiment,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching market sentiment:', error);
      res.status(500).json({ 
        error: 'Failed to fetch market sentiment',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
