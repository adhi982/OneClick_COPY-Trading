import { Request, Response } from 'express';
import { CopySettings } from '../models/CopySettings';
import { Trader } from '../models/Trader';
import { logger } from '../utils/logger';

export class PortfolioController {
   static async getPortfolio(req: Request, res: Response) {
      try {
         const userId = (req as any).user.userId;

         // Get user's copy settings
         const copySettings = await CopySettings.findByUser(userId);

         // Mock portfolio data
         const portfolio = {
            totalValue: 15750.25,
            dayChange: 2.5,
            monthlyReturn: 18.3,
            activePositions: copySettings.length,
            followingCount: copySettings.length,
            positions: [
               {
                  id: '1',
                  traderId: copySettings[0]?.traderId || 'mock',
                  traderName: 'Alpha Trader',
                  symbol: 'APT/USDC',
                  amount: 5000,
                  currentValue: 5250,
                  pnl: 250,
                  pnlPercent: 5.0,
                  openedAt: new Date('2024-09-01T10:00:00Z')
               },
               {
                  id: '2',
                  traderId: copySettings[1]?.traderId || 'mock',
                  traderName: 'Steady Eddie',
                  symbol: 'BTC/USDC',
                  amount: 10000,
                  currentValue: 10500,
                  pnl: 500,
                  pnlPercent: 5.0,
                  openedAt: new Date('2024-09-03T14:30:00Z')
               }
            ]
         };

         res.json({
            success: true,
            portfolio
         });

      } catch (error) {
         logger.error('Get portfolio error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getPositions(req: Request, res: Response) {
      try {
         const userId = (req as any).user.userId;
         const { status = 'active' } = req.query;

         // Mock positions data
         const positions = [
            {
               id: '1',
               traderId: 'trader-1',
               traderName: 'Alpha Trader',
               symbol: 'APT/USDC',
               type: 'long',
               amount: 5000,
               entryPrice: 8.50,
               currentPrice: 8.93,
               currentValue: 5250,
               pnl: 250,
               pnlPercent: 5.0,
               status: 'active',
               openedAt: new Date('2024-09-01T10:00:00Z'),
               stopLoss: 8.08,
               takeProfit: 10.20
            },
            {
               id: '2',
               traderId: 'trader-2',
               traderName: 'Steady Eddie',
               symbol: 'BTC/USDC',
               type: 'long',
               amount: 10000,
               entryPrice: 65000,
               currentPrice: 68250,
               currentValue: 10500,
               pnl: 500,
               pnlPercent: 5.0,
               status: 'active',
               openedAt: new Date('2024-09-03T14:30:00Z'),
               stopLoss: 61750,
               takeProfit: 78000
            }
         ];

         const filteredPositions = positions.filter(pos =>
            status === 'all' || pos.status === status
         );

         res.json({
            success: true,
            positions: filteredPositions,
            total: filteredPositions.length
         });

      } catch (error) {
         logger.error('Get positions error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getTradeHistory(req: Request, res: Response) {
      try {
         const userId = (req as any).user.userId;
         const { limit = 50, offset = 0 } = req.query;

         // Mock trade history
         const trades = [
            {
               id: '1',
               traderId: 'trader-1',
               traderName: 'Alpha Trader',
               symbol: 'APT/USDC',
               type: 'buy',
               amount: 5000,
               price: 8.50,
               value: 588.24, // amount / price
               pnl: 250,
               pnlPercent: 5.0,
               timestamp: new Date('2024-09-01T10:00:00Z'),
               status: 'completed'
            },
            {
               id: '2',
               traderId: 'trader-2',
               traderName: 'Steady Eddie',
               symbol: 'BTC/USDC',
               type: 'buy',
               amount: 10000,
               price: 65000,
               value: 0.1538, // amount / price
               pnl: 500,
               pnlPercent: 5.0,
               timestamp: new Date('2024-09-03T14:30:00Z'),
               status: 'completed'
            }
         ];

         const paginatedTrades = trades.slice(
            Number(offset),
            Number(offset) + Number(limit)
         );

         res.json({
            success: true,
            trades: paginatedTrades,
            total: trades.length
         });

      } catch (error) {
         logger.error('Get trade history error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getPerformanceMetrics(req: Request, res: Response) {
      try {
         const userId = (req as any).user.userId;
         const { timeframe = '30d' } = req.query;

         // Mock performance metrics
         const metrics = {
            totalReturn: 18.3,
            sharpeRatio: 1.85,
            maxDrawdown: -8.2,
            winRate: 73.5,
            avgWinSize: 4.2,
            avgLossSize: -2.1,
            totalTrades: 42,
            profitableTrades: 31,
            chartData: [
               { date: '2024-08-06', value: 10000 },
               { date: '2024-08-13', value: 10150 },
               { date: '2024-08-20', value: 10320 },
               { date: '2024-08-27', value: 10580 },
               { date: '2024-09-03', value: 10890 },
               { date: '2024-09-06', value: 11830 }
            ]
         };

         res.json({
            success: true,
            metrics,
            timeframe
         });

      } catch (error) {
         logger.error('Get performance metrics error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }
}
