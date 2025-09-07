import WebSocket from 'ws';
import axios from 'axios';
import { logger } from '../utils/logger';
import { TradingService } from './trading.service';

export interface KanaLabsConfig {
  apiKey: string;
  websocketUrl: string;
  restApiUrl: string;
  network: 'mainnet' | 'testnet';
}

export interface RealTimeTradeData {
  traderId: string;
  traderAddress: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  txHash?: string;
  positionSize: number;
  pnl: number;
}

export interface TraderPerformanceData {
  traderId: string;
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  avgHoldTime: number;
  sharpeRatio: number;
  maxDrawdown: number;
  lastTradeTime: number;
  riskScore: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  volume24h: number;
  change24h: number;
  high24h: number;
  low24h: number;
  marketCap: number;
  timestamp: number;
}

export class KanaLabsService {
  private static instance: KanaLabsService;
  private ws: WebSocket | null = null;
  private config: KanaLabsConfig;
  private subscribedTraders: Set<string> = new Set();
  private subscribedSymbols: Set<string> = new Set();
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  private constructor() {
    this.config = {
      apiKey: process.env.KANA_LABS_API_KEY || '',
      websocketUrl: process.env.KANA_LABS_WS_URL || 'wss://api.kanalabs.io/ws',
      restApiUrl: process.env.KANA_LABS_API_URL || 'https://api.kanalabs.io/v1',
      network: (process.env.APTOS_NETWORK as 'mainnet' | 'testnet') || 'testnet'
    };
  }

  public static getInstance(): KanaLabsService {
    if (!KanaLabsService.instance) {
      KanaLabsService.instance = new KanaLabsService();
    }
    return KanaLabsService.instance;
  }

  /**
   * Initialize WebSocket connection for real-time data
   */
  async initialize(): Promise<void> {
    try {
      logger.info('Initializing Kana Labs WebSocket connection...');
      
      this.ws = new WebSocket(this.config.websocketUrl, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Network': this.config.network
        }
      });

      this.ws.on('open', () => {
        logger.info('✅ Kana Labs WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.sendHeartbeat();
      });

      this.ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          logger.error('Error parsing WebSocket message:', error);
        }
      });

      this.ws.on('close', (code: number, reason: Buffer) => {
        logger.warn(`Kana Labs WebSocket closed: ${code} - ${reason.toString()}`);
        this.isConnected = false;
        this.handleReconnection();
      });

      this.ws.on('error', (error: Error) => {
        logger.error('Kana Labs WebSocket error:', error);
        this.isConnected = false;
      });

    } catch (error) {
      logger.error('Failed to initialize Kana Labs service:', error);
      throw error;
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private async handleMessage(message: any): Promise<void> {
    try {
      switch (message.type) {
        case 'trade_update':
          await this.handleTradeUpdate(message.data);
          break;
        case 'trader_performance':
          await this.handleTraderPerformance(message.data);
          break;
        case 'market_data':
          await this.handleMarketData(message.data);
          break;
        case 'position_update':
          await this.handlePositionUpdate(message.data);
          break;
        case 'heartbeat':
          this.sendHeartbeat();
          break;
        default:
          logger.debug('Unknown message type:', message.type);
      }
    } catch (error) {
      logger.error('Error handling WebSocket message:', error);
    }
  }

  /**
   * Handle real-time trade updates
   */
  private async handleTradeUpdate(tradeData: RealTimeTradeData): Promise<void> {
    try {
      logger.info(`📊 Real-time trade update: ${tradeData.traderId} - ${tradeData.symbol} ${tradeData.side} ${tradeData.amount}`);
      
      // Process the trade signal for copy trading
      const tradeSignal = {
        traderId: tradeData.traderId,
        symbol: tradeData.symbol,
        type: tradeData.side,
        amount: tradeData.amount,
        price: tradeData.price,
        timestamp: new Date(tradeData.timestamp)
      };

      // Execute copy trading logic
      await TradingService.processTradeSignal(tradeSignal);
      
      // Broadcast to connected clients via WebSocket
      this.broadcastToClients('trade_update', tradeData);

    } catch (error) {
      logger.error('Error processing trade update:', error);
    }
  }

  /**
   * Handle trader performance updates
   */
  private async handleTraderPerformance(performanceData: TraderPerformanceData): Promise<void> {
    try {
      logger.info(`📈 Performance update for trader: ${performanceData.traderId}`);
      
      // Update trader stats in database
      // TODO: Implement database update logic
      
      // Broadcast to clients
      this.broadcastToClients('trader_performance', performanceData);

    } catch (error) {
      logger.error('Error handling trader performance:', error);
    }
  }

  /**
   * Handle market data updates
   */
  private async handleMarketData(marketData: MarketData): Promise<void> {
    try {
      // Update market data cache
      // TODO: Implement Redis cache update
      
      // Broadcast to clients
      this.broadcastToClients('market_data', marketData);

    } catch (error) {
      logger.error('Error handling market data:', error);
    }
  }

  /**
   * Subscribe to real-time data for specific traders
   */
  async subscribeToTrader(traderId: string): Promise<void> {
    if (!this.isConnected || !this.ws) {
      throw new Error('WebSocket not connected');
    }

    if (this.subscribedTraders.has(traderId)) {
      logger.info(`Already subscribed to trader: ${traderId}`);
      return;
    }

    const subscribeMessage = {
      type: 'subscribe',
      channel: 'trader_updates',
      params: {
        traderId: traderId,
        includePerformance: true,
        includeTrades: true,
        includePositions: true
      }
    };

    this.ws.send(JSON.stringify(subscribeMessage));
    this.subscribedTraders.add(traderId);
    logger.info(`📡 Subscribed to trader: ${traderId}`);
  }

  /**
   * Subscribe to market data for specific symbols
   */
  async subscribeToMarketData(symbols: string[]): Promise<void> {
    if (!this.isConnected || !this.ws) {
      throw new Error('WebSocket not connected');
    }

    const newSymbols = symbols.filter(symbol => !this.subscribedSymbols.has(symbol));
    
    if (newSymbols.length === 0) {
      return;
    }

    const subscribeMessage = {
      type: 'subscribe',
      channel: 'market_data',
      params: {
        symbols: newSymbols,
        interval: '1s' // Real-time updates
      }
    };

    this.ws.send(JSON.stringify(subscribeMessage));
    newSymbols.forEach(symbol => this.subscribedSymbols.add(symbol));
    logger.info(`📊 Subscribed to market data: ${newSymbols.join(', ')}`);
  }

  /**
   * Get historical trader data from REST API
   */
  async getTraderHistory(traderId: string, limit: number = 100): Promise<any> {
    try {
      const response = await axios.get(
        `${this.config.restApiUrl}/traders/${traderId}/history`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'X-Network': this.config.network
          },
          params: { limit }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error fetching trader history:', error);
      throw error;
    }
  }

  /**
   * Get top performing traders
   */
  async getTopTraders(timeframe: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<any> {
    try {
      const response = await axios.get(
        `${this.config.restApiUrl}/traders/top`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'X-Network': this.config.network
          },
          params: { timeframe }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error fetching top traders:', error);
      throw error;
    }
  }

  /**
   * Send heartbeat to maintain connection
   */
  private sendHeartbeat(): void {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
    }
  }

  /**
   * Handle WebSocket reconnection
   */
  private async handleReconnection(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    logger.info(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.initialize();
    }, delay);
  }

  /**
   * Broadcast data to connected clients
   */
  private broadcastToClients(type: string, data: any): void {
    // TODO: Implement WebSocket broadcasting to frontend clients
    // This will be connected to the WebSocket service
    logger.debug(`Broadcasting ${type} to clients:`, data);
  }

  /**
   * Handle position updates
   */
  private async handlePositionUpdate(positionData: any): Promise<void> {
    try {
      logger.info(`📍 Position update: ${positionData.traderId}`);
      
      // Update position data in database
      // TODO: Implement position update logic
      
      // Broadcast to clients
      this.broadcastToClients('position_update', positionData);

    } catch (error) {
      logger.error('Error handling position update:', error);
    }
  }

  /**
   * Cleanup and close connections
   */
  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.subscribedTraders.clear();
    this.subscribedSymbols.clear();
    logger.info('Kana Labs service disconnected');
  }
}
