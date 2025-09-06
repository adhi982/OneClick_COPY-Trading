import { Request, Response } from 'express';
import { Trader } from '../models/Trader';
import { CopySettings } from '../models/CopySettings';
import { logger } from '../utils/logger';

export class TradersController {
   static async getAllTraders(req: Request, res: Response) {
      try {
         const { riskLevel, minReturn, strategy } = req.query;

         const filters = {
            riskLevel: riskLevel as string,
            minReturn: minReturn ? parseInt(minReturn as string) : undefined,
            strategy: strategy as string
         };

         const traders = await Trader.findAll(filters);

         res.json({
            success: true,
            traders,
            total: traders.length
         });

      } catch (error) {
         logger.error('Get all traders error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getTrader(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const trader = await Trader.findById(id);

         if (!trader) {
            return res.status(404).json({ error: 'Trader not found' });
         }

         res.json({
            success: true,
            trader
         });

      } catch (error) {
         logger.error('Get trader error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getTopTraders(req: Request, res: Response) {
      try {
         const limit = parseInt(req.query.limit as string) || 10;
         const traders = await Trader.getTopTraders(limit);

         res.json({
            success: true,
            traders
         });

      } catch (error) {
         logger.error('Get top traders error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async followTrader(req: Request, res: Response) {
      try {
         const userId = (req as any).user.userId;
         const { traderId, amount, copySettings } = req.body;

         if (!traderId || !amount) {
            return res.status(400).json({
               error: 'Trader ID and amount are required'
            });
         }

         // Validate trader exists
         const trader = await Trader.findById(traderId);
         if (!trader) {
            return res.status(404).json({ error: 'Trader not found' });
         }

         // Check if already following
         const existingCopy = await CopySettings.findByUserAndTrader(userId, traderId);
         if (existingCopy) {
            return res.status(400).json({ error: 'Already following this trader' });
         }

         // Create copy settings
         await CopySettings.create({
            userId,
            traderId,
            amount,
            settings: copySettings || {
               maxTradeSize: amount * 0.1, // 10% max per trade
               stopLoss: 5, // 5% stop loss
               takeProfit: 20 // 20% take profit
            },
            isActive: true
         });

         // Update trader follower count
         await Trader.updateFollowerCount(traderId, true);

         logger.info(`User ${userId} started following trader ${traderId} with amount ${amount}`);

         res.json({
            success: true,
            message: 'Successfully started following trader'
         });

      } catch (error) {
         logger.error('Follow trader error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async unfollowTrader(req: Request, res: Response) {
      try {
         const userId = (req as any).user.userId;
         const { traderId } = req.body;

         if (!traderId) {
            return res.status(400).json({ error: 'Trader ID is required' });
         }

         // Find and deactivate copy settings
         const copySettings = await CopySettings.findByUserAndTrader(userId, traderId);
         if (!copySettings) {
            return res.status(404).json({ error: 'Not following this trader' });
         }

         await CopySettings.deactivate(copySettings.id);

         // Update trader follower count
         await Trader.updateFollowerCount(traderId, false);

         logger.info(`User ${userId} stopped following trader ${traderId}`);

         res.json({
            success: true,
            message: 'Successfully stopped following trader'
         });

      } catch (error) {
         logger.error('Unfollow trader error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getTraderTrades(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const { limit = 50, offset = 0 } = req.query;

         // Mock trade data - in production, fetch from database
         const trades = [
            {
               id: '1',
               traderId: id,
               symbol: 'APT/USDC',
               type: 'buy',
               amount: 1000,
               price: 8.50,
               timestamp: new Date('2024-09-06T10:30:00Z'),
               pnl: 125.50,
               status: 'completed'
            },
            {
               id: '2',
               traderId: id,
               symbol: 'APT/USDC',
               type: 'sell',
               amount: 1000,
               price: 8.75,
               timestamp: new Date('2024-09-06T11:45:00Z'),
               pnl: 250.00,
               status: 'completed'
            }
         ];

         res.json({
            success: true,
            trades: trades.slice(Number(offset), Number(offset) + Number(limit)),
            total: trades.length
         });

      } catch (error) {
         logger.error('Get trader trades error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }
}
