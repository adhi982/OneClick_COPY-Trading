import { Request, Response } from 'express';
import { KanaLabsIntegrationService } from '../services/kana-labs-integration.service';
import { logger } from '../utils/logger';

export class CopyTradingController {
  private kanaLabs: KanaLabsIntegrationService;

  constructor() {
    this.kanaLabs = KanaLabsIntegrationService.getInstance();
  }

  /**
   * 🎯 EXECUTE COPY TRADE - Main copy trading function
   */
  executeCopyTrade = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        traderWallet,
        followerWallet,
        marketId,
        side,
        originalSize,
        copyRatio = 1.0,
        riskParams
      } = req.body;

      logger.info(`🎯 Executing copy trade: ${side} ${originalSize * copyRatio} ${marketId}`);

      // Validate copy trade parameters
      const validation = await this.validateCopyTrade(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: 'Copy trade validation failed',
          details: validation.errors
        });
        return;
      }

      // Calculate copy trade size
      const copySize = originalSize * copyRatio;

      // Check follower account balance
      const balance = await this.kanaLabs.getTradingAccountBalance(followerWallet);
      if (balance.availableBalance < copySize * 0.1) { // Assuming 10x leverage
        res.status(400).json({
          success: false,
          error: 'Insufficient balance for copy trade'
        });
        return;
      }

      // Execute the copy trade
      const orderResult = await this.kanaLabs.placeMarketOrder({
        marketId,
        side,
        size: copySize,
        leverage: riskParams?.leverage || 1
      });

      // Set up risk management if provided
      if (riskParams) {
        await this.setRiskManagement(orderResult.orderId, riskParams);
      }

      res.json({
        success: true,
        data: {
          orderId: orderResult.orderId,
          marketId,
          side,
          size: copySize,
          status: 'executed'
        }
      });

    } catch (error) {
      logger.error('Copy trade execution failed:', error);
      res.status(500).json({
        success: false,
        error: 'Copy trade execution failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * 📊 GET TRADER POSITIONS - View trader's current positions
   */
  getTraderPositions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress } = req.params;

      const positions = await this.kanaLabs.getPositions(walletAddress);
      
      res.json({
        success: true,
        data: {
          walletAddress,
          positions,
          totalPositions: positions.length,
          timestamp: Date.now()
        }
      });

    } catch (error) {
      logger.error('Failed to get trader positions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get trader positions'
      });
    }
  };

  /**
   * 💰 GET PORTFOLIO PERFORMANCE - Track portfolio metrics
   */
  getPortfolioPerformance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      const { timeframe = '24h' } = req.query;

      // Get account balance
      const balance = await this.kanaLabs.getTradingAccountBalance(walletAddress);
      
      // Get recent trades
      const trades = await this.kanaLabs.getAllTrades(walletAddress, 100);
      
      // Get current positions
      const positions = await this.kanaLabs.getPositions(walletAddress);

      // Calculate performance metrics
      const performance = this.calculatePerformanceMetrics(trades, positions, timeframe as string);

      res.json({
        success: true,
        data: {
          walletAddress,
          balance,
          performance,
          positions,
          recentTrades: trades.slice(0, 10),
          timestamp: Date.now()
        }
      });

    } catch (error) {
      logger.error('Failed to get portfolio performance:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get portfolio performance'
      });
    }
  };

  /**
   * 📈 GET COPY TRADING STATS - Track copy trading performance
   */
  getCopyTradingStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { traderWallet, followerWallet } = req.params;

      // Get trades for both wallets
      const traderTrades = await this.kanaLabs.getAllTrades(traderWallet, 50);
      const followerTrades = await this.kanaLabs.getAllTrades(followerWallet, 50);

      // Calculate copy trading stats
      const stats = this.calculateCopyTradingStats(traderTrades, followerTrades);

      res.json({
        success: true,
        data: {
          traderWallet,
          followerWallet,
          stats,
          timestamp: Date.now()
        }
      });

    } catch (error) {
      logger.error('Failed to get copy trading stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get copy trading stats'
      });
    }
  };

  /**
   * 🛡️ UPDATE RISK PARAMETERS - Modify risk settings
   */
  updateRiskParameters = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId } = req.params;
      const { stopLoss, takeProfit } = req.body;

      const results = [];

      if (stopLoss) {
        const stopLossResult = await this.kanaLabs.updateStopLoss(orderId, stopLoss);
        results.push({ type: 'stop_loss', result: stopLossResult });
      }

      if (takeProfit) {
        const takeProfitResult = await this.kanaLabs.updateTakeProfit(orderId, takeProfit);
        results.push({ type: 'take_profit', result: takeProfitResult });
      }

      res.json({
        success: true,
        data: {
          orderId,
          updatedParameters: results,
          timestamp: Date.now()
        }
      });

    } catch (error) {
      logger.error('Failed to update risk parameters:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update risk parameters'
      });
    }
  };

  /**
   * 🔄 START COPY TRADING SUBSCRIPTION
   */
  startCopyTrading = async (req: Request, res: Response): Promise<void> => {
    try {
      const { traderWallet, followerWallet, copySettings } = req.body;

      res.json({
        success: true,
        data: {
          traderWallet,
          followerWallet,
          copySettings,
          status: 'subscribed',
          timestamp: Date.now()
        }
      });

    } catch (error) {
      logger.error('Failed to start copy trading subscription:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start copy trading subscription'
      });
    }
  };

  /**
   * ⏹️ STOP COPY TRADING SUBSCRIPTION
   */
  stopCopyTrading = async (req: Request, res: Response): Promise<void> => {
    try {
      const { traderWallet, followerWallet } = req.body;

      res.json({
        success: true,
        data: {
          traderWallet,
          followerWallet,
          status: 'unsubscribed',
          timestamp: Date.now()
        }
      });

    } catch (error) {
      logger.error('Failed to stop copy trading subscription:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to stop copy trading subscription'
      });
    }
  };

  /**
   * PRIVATE HELPER METHODS
   */

  private async validateCopyTrade(params: any): Promise<{ isValid: boolean; errors?: string[] }> {
    const errors: string[] = [];

    if (!params.traderWallet) errors.push('Trader wallet address required');
    if (!params.followerWallet) errors.push('Follower wallet address required');
    if (!params.marketId) errors.push('Market ID required');
    if (!params.side || !['buy', 'sell'].includes(params.side)) errors.push('Valid side (buy/sell) required');
    if (!params.originalSize || params.originalSize <= 0) errors.push('Valid size required');
    if (params.copyRatio && (params.copyRatio <= 0 || params.copyRatio > 10)) errors.push('Copy ratio must be between 0 and 10');

    return {
      isValid: errors.length === 0,
      ...(errors.length > 0 && { errors })
    };
  }

  private async setRiskManagement(orderId: string, riskParams: any): Promise<void> {
    try {
      if (riskParams.stopLoss) {
        await this.kanaLabs.updateStopLoss(orderId, riskParams.stopLoss);
      }
      
      if (riskParams.takeProfit) {
        await this.kanaLabs.updateTakeProfit(orderId, riskParams.takeProfit);
      }
    } catch (error) {
      logger.error('Failed to set risk management:', error);
    }
  }

  private calculatePerformanceMetrics(trades: any[], _positions: any[], timeframe: string): any {
    // Implement performance calculation logic
    const now = Date.now();
    const timeframeDuration = this.getTimeframeDuration(timeframe);
    const cutoffTime = now - timeframeDuration;

    const recentTrades = trades.filter(trade => trade.timestamp >= cutoffTime);
    
    const totalPnL = recentTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalVolume = recentTrades.reduce((sum, trade) => sum + (trade.size * trade.price), 0);
    const winRate = recentTrades.length > 0 ? 
      recentTrades.filter(trade => (trade.pnl || 0) > 0).length / recentTrades.length * 100 : 0;

    return {
      totalPnL,
      totalVolume,
      winRate: Math.round(winRate * 100) / 100,
      tradeCount: recentTrades.length,
      timeframe
    };
  }

  private calculateCopyTradingStats(_traderTrades: any[], followerTrades: any[]): any {
    // Implement copy trading statistics calculation
    return {
      totalCopiedTrades: followerTrades.length,
      successRate: 0, // Calculate based on your logic
      totalPnL: followerTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0),
      averageExecutionDelay: 0 // Calculate execution delay
    };
  }

  private getTimeframeDuration(timeframe: string): number {
    const durations: { [key: string]: number } = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    return durations[timeframe] || durations['24h'];
  }
}
