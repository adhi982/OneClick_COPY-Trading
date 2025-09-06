import axios from 'axios';
import { logger } from '../utils/logger';

export interface PriceData {
   symbol: string;
   price: number;
   change24h: number;
   volume24h: number;
   timestamp: Date;
}

export interface CandleData {
   timestamp: number;
   open: number;
   high: number;
   low: number;
   close: number;
   volume: number;
}

export interface OrderBookEntry {
   price: number;
   quantity: number;
}

export interface OrderBook {
   bids: OrderBookEntry[];
   asks: OrderBookEntry[];
}

export interface SentimentData {
   score: number; // -1 to 1
   label: 'bearish' | 'neutral' | 'bullish';
   confidence: number;
   sources: string[];
}

export class MarketService {
   private static readonly COINAPI_BASE_URL = 'https://rest.coinapi.io/v1';
   private static readonly COINAPI_KEY = process.env.COINAPI_KEY;

   static async getCurrentPrices(symbols: string[]): Promise<PriceData[]> {
      try {
         // Mock data for demo - in production, use real API
         const mockPrices: PriceData[] = [
            {
               symbol: 'APT/USDC',
               price: 8.93,
               change24h: 5.2,
               volume24h: 2500000,
               timestamp: new Date()
            },
            {
               symbol: 'BTC/USDC',
               price: 68250,
               change24h: 2.1,
               volume24h: 15000000000,
               timestamp: new Date()
            },
            {
               symbol: 'ETH/USDC',
               price: 3420,
               change24h: 3.8,
               volume24h: 8000000000,
               timestamp: new Date()
            }
         ];

         return mockPrices.filter(price => symbols.includes(price.symbol));

      } catch (error) {
         logger.error('Error fetching current prices:', error);
         throw new Error('Failed to fetch current prices');
      }
   }

   static async getChartData(symbol: string, interval: string, limit: number): Promise<CandleData[]> {
      try {
         // Mock chart data
         const basePrice = symbol.includes('APT') ? 8.5 : symbol.includes('BTC') ? 67000 : 3400;
         const chartData: CandleData[] = [];

         for (let i = limit; i > 0; i--) {
            const timestamp = Date.now() - (i * 3600000); // 1 hour intervals
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            const open = basePrice * (1 + variation);
            const close = open * (1 + (Math.random() - 0.5) * 0.05);
            const high = Math.max(open, close) * (1 + Math.random() * 0.02);
            const low = Math.min(open, close) * (1 - Math.random() * 0.02);
            const volume = Math.random() * 1000000;

            chartData.push({
               timestamp,
               open: Number(open.toFixed(2)),
               high: Number(high.toFixed(2)),
               low: Number(low.toFixed(2)),
               close: Number(close.toFixed(2)),
               volume: Number(volume.toFixed(0))
            });
         }

         return chartData;

      } catch (error) {
         logger.error('Error fetching chart data:', error);
         throw new Error('Failed to fetch chart data');
      }
   }

   static async getOrderBook(symbol: string, depth: number): Promise<OrderBook> {
      try {
         const basePrice = symbol.includes('APT') ? 8.93 : symbol.includes('BTC') ? 68250 : 3420;

         const bids: OrderBookEntry[] = [];
         const asks: OrderBookEntry[] = [];

         // Generate mock order book
         for (let i = 0; i < depth; i++) {
            bids.push({
               price: Number((basePrice * (1 - (i + 1) * 0.001)).toFixed(2)),
               quantity: Number((Math.random() * 1000).toFixed(2))
            });

            asks.push({
               price: Number((basePrice * (1 + (i + 1) * 0.001)).toFixed(2)),
               quantity: Number((Math.random() * 1000).toFixed(2))
            });
         }

         return { bids, asks };

      } catch (error) {
         logger.error('Error fetching order book:', error);
         throw new Error('Failed to fetch order book');
      }
   }

   static async getMarketSentiment(symbol: string): Promise<SentimentData> {
      try {
         // Mock sentiment analysis using DistilBERT
         // In production, this would analyze news and social media
         const score = (Math.random() - 0.5) * 2; // -1 to 1

         let label: 'bearish' | 'neutral' | 'bullish';
         if (score < -0.3) label = 'bearish';
         else if (score > 0.3) label = 'bullish';
         else label = 'neutral';

         return {
            score: Number(score.toFixed(2)),
            label,
            confidence: Number((Math.random() * 0.3 + 0.7).toFixed(2)), // 0.7-1.0
            sources: ['twitter', 'reddit', 'news']
         };

      } catch (error) {
         logger.error('Error analyzing market sentiment:', error);
         throw new Error('Failed to analyze market sentiment');
      }
   }

   static async getMarketStats(timeframe: string): Promise<any> {
      try {
         return {
            totalMarketCap: 2850000000000,
            totalVolume24h: 45000000000,
            btcDominance: 52.3,
            activeMarkets: 2847,
            fearGreedIndex: 68,
            topGainers: [
               { symbol: 'APT', change: 15.2 },
               { symbol: 'SUI', change: 12.8 },
               { symbol: 'SEI', change: 9.5 }
            ],
            topLosers: [
               { symbol: 'DOGE', change: -8.3 },
               { symbol: 'SHIB', change: -6.1 },
               { symbol: 'PEPE', change: -5.7 }
            ]
         };

      } catch (error) {
         logger.error('Error fetching market stats:', error);
         throw new Error('Failed to fetch market stats');
      }
   }

   static async getTradingVolume(symbol: string, timeframe: string): Promise<any> {
      try {
         const volume24h = Math.random() * 10000000;
         const volumeChange = (Math.random() - 0.5) * 40; // ±20%

         return {
            volume24h: Number(volume24h.toFixed(0)),
            volumeChange24h: Number(volumeChange.toFixed(2)),
            avgTradeSize: Number((volume24h / (Math.random() * 1000 + 500)).toFixed(2)),
            trades24h: Math.floor(Math.random() * 10000 + 1000)
         };

      } catch (error) {
         logger.error('Error fetching trading volume:', error);
         throw new Error('Failed to fetch trading volume');
      }
   }
}
