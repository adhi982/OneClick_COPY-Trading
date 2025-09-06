import { Request, Response } from 'express';
import { MarketService } from '../services/market.service';
import { logger } from '../utils/logger';

export class MarketController {
   static async getCurrentPrices(req: Request, res: Response) {
      try {
         const { symbols } = req.query;
         const symbolList = symbols ? (symbols as string).split(',') : ['APT/USDC', 'BTC/USDC', 'ETH/USDC'];

         const prices = await MarketService.getCurrentPrices(symbolList);

         res.json({
            success: true,
            prices,
            timestamp: new Date().toISOString()
         });

      } catch (error) {
         logger.error('Get current prices error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getChartData(req: Request, res: Response) {
      try {
         const { symbol } = req.params;
         const { interval = '1h', limit = 100 } = req.query;

         const chartData = await MarketService.getChartData(
            symbol,
            interval as string,
            Number(limit)
         );

         res.json({
            success: true,
            symbol,
            interval,
            data: chartData
         });

      } catch (error) {
         logger.error('Get chart data error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getOrderBook(req: Request, res: Response) {
      try {
         const { symbol } = req.params;
         const { depth = 20 } = req.query;

         const orderBook = await MarketService.getOrderBook(symbol, Number(depth));

         res.json({
            success: true,
            symbol,
            orderBook,
            timestamp: new Date().toISOString()
         });

      } catch (error) {
         logger.error('Get order book error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getMarketSentiment(req: Request, res: Response) {
      try {
         const { symbol = 'APT' } = req.query;

         const sentiment = await MarketService.getMarketSentiment(symbol as string);

         res.json({
            success: true,
            symbol,
            sentiment,
            timestamp: new Date().toISOString()
         });

      } catch (error) {
         logger.error('Get market sentiment error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getMarketStats(req: Request, res: Response) {
      try {
         const { timeframe = '24h' } = req.query;

         const stats = await MarketService.getMarketStats(timeframe as string);

         res.json({
            success: true,
            stats,
            timeframe,
            timestamp: new Date().toISOString()
         });

      } catch (error) {
         logger.error('Get market stats error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getTradingVolume(req: Request, res: Response) {
      try {
         const { symbol, timeframe = '24h' } = req.query;

         const volume = await MarketService.getTradingVolume(
            symbol as string,
            timeframe as string
         );

         res.json({
            success: true,
            symbol,
            volume,
            timeframe,
            timestamp: new Date().toISOString()
         });

      } catch (error) {
         logger.error('Get trading volume error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }
}
