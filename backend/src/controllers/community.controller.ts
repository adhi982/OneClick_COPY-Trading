import { Request, Response } from 'express';
import { Trader } from '../models/Trader';
import { logger } from '../utils/logger';

export class CommunityController {
   static async getLeaderboard(req: Request, res: Response) {
      try {
         const { timeframe = '30d', limit = 20 } = req.query;

         const topTraders = await Trader.getTopTraders(Number(limit));

         // Enhance with additional leaderboard data
         const leaderboard = topTraders.map((trader, index) => ({
            rank: index + 1,
            id: trader.id,
            name: trader.name,
            username: trader.username,
            avatar: trader.avatar,
            monthlyReturn: trader.monthlyReturn,
            followers: trader.followers,
            winRate: trader.winRate,
            sharpeRatio: trader.sharpeRatio,
            totalVolume: trader.totalVolume,
            riskLevel: trader.riskLevel,
            badge: index < 3 ? ['🥇', '🥈', '🥉'][index] : null
         }));

         res.json({
            success: true,
            leaderboard,
            timeframe,
            timestamp: new Date().toISOString()
         });

      } catch (error) {
         logger.error('Get leaderboard error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getCommunityFeed(req: Request, res: Response) {
      try {
         const { limit = 20, offset = 0 } = req.query;

         // Mock community feed data
         const feed = [
            {
               id: '1',
               type: 'trade',
               traderId: 'trader-1',
               traderName: 'Alpha Trader',
               content: 'Opened a long position on APT/USDC at $8.50',
               symbol: 'APT/USDC',
               action: 'buy',
               amount: 5000,
               price: 8.50,
               timestamp: new Date('2024-09-06T10:30:00Z'),
               likes: 45,
               comments: 12
            },
            {
               id: '2',
               type: 'achievement',
               traderId: 'trader-2',
               traderName: 'Steady Eddie',
               content: 'Achieved 85% win rate milestone! 🎉',
               achievement: '85% Win Rate',
               timestamp: new Date('2024-09-06T09:15:00Z'),
               likes: 78,
               comments: 25
            },
            {
               id: '3',
               type: 'insight',
               traderId: 'trader-3',
               traderName: 'Risk Taker',
               content: 'Market showing strong bullish signals. Watch for breakout above $9.00 resistance.',
               symbol: 'APT/USDC',
               sentiment: 'bullish',
               timestamp: new Date('2024-09-06T08:45:00Z'),
               likes: 32,
               comments: 8
            }
         ];

         const paginatedFeed = feed.slice(Number(offset), Number(offset) + Number(limit));

         res.json({
            success: true,
            feed: paginatedFeed,
            total: feed.length
         });

      } catch (error) {
         logger.error('Get community feed error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async createPost(req: Request, res: Response) {
      try {
         const userId = (req as any).user.userId;
         const { content, type, symbol, sentiment } = req.body;

         if (!content || !type) {
            return res.status(400).json({
               error: 'Content and type are required'
            });
         }

         // Mock post creation
         const newPost = {
            id: Date.now().toString(),
            type,
            userId,
            content,
            symbol,
            sentiment,
            timestamp: new Date(),
            likes: 0,
            comments: 0
         };

         logger.info(`User ${userId} created new post: ${type}`);

         res.json({
            success: true,
            post: newPost
         });

      } catch (error) {
         logger.error('Create post error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getCommunityStats(req: Request, res: Response) {
      try {
         // Mock community statistics
         const stats = {
            totalTraders: 1247,
            activeToday: 342,
            totalTrades24h: 8567,
            totalVolume24h: 45000000,
            topPerformingStrategy: 'Momentum Trading',
            communityGrowth: {
               daily: 12,
               weekly: 89,
               monthly: 324
            },
            popularPairs: [
               { symbol: 'APT/USDC', trades: 1250, volume: 12500000 },
               { symbol: 'BTC/USDC', trades: 890, volume: 25000000 },
               { symbol: 'ETH/USDC', trades: 567, volume: 8900000 }
            ],
            sentimentDistribution: {
               bullish: 45,
               neutral: 35,
               bearish: 20
            }
         };

         res.json({
            success: true,
            stats,
            timestamp: new Date().toISOString()
         });

      } catch (error) {
         logger.error('Get community stats error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getTraderInsights(req: Request, res: Response) {
      try {
         const { timeframe = '7d', category = 'all' } = req.query;

         // Mock trader insights
         const insights = [
            {
               id: '1',
               title: 'APT Showing Strong Momentum',
               summary: 'Multiple top traders are increasing APT positions as technical indicators turn bullish.',
               category: 'market_analysis',
               tradersInvolved: 8,
               avgConfidence: 0.85,
               timeframe: '24h',
               tags: ['APT', 'momentum', 'bullish']
            },
            {
               id: '2',
               title: 'Risk Management Best Practices',
               summary: 'Top performing traders consistently use 2-5% position sizing and maintain diversified portfolios.',
               category: 'strategy',
               tradersInvolved: 15,
               avgConfidence: 0.92,
               timeframe: '7d',
               tags: ['risk', 'diversification', 'strategy']
            },
            {
               id: '3',
               title: 'DeFi Season Indicators',
               summary: 'Correlation analysis shows increasing DeFi token activity among successful traders.',
               category: 'trend',
               tradersInvolved: 12,
               avgConfidence: 0.78,
               timeframe: '14d',
               tags: ['DeFi', 'correlation', 'trend']
            }
         ];

         const filteredInsights = category === 'all'
            ? insights
            : insights.filter(insight => insight.category === category);

         res.json({
            success: true,
            insights: filteredInsights,
            timeframe,
            category
         });

      } catch (error) {
         logger.error('Get trader insights error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }
}
