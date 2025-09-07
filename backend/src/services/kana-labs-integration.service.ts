import axios from 'axios';
import WebSocket from 'ws';
import { logger } from '../utils/logger';

export interface KanaLabsConfig {
  apiKey: string;
  perpsBaseUrl: string;
  aggregatorUrl: string;
  paymasterUrl: string;
  websocketUrl: string;
  defaultMarketId: string;
  maxSlippage: number;
  defaultLeverage: number;
}

export interface MarketOrderRequest {
  marketId: string;
  side: 'buy' | 'sell';
  size: number;
  leverage?: number;
  reduceOnly?: boolean;
}

export interface LimitOrderRequest {
  marketId: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  leverage?: number;
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
}

export interface Position {
  marketId: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  leverage: number;
  margin: number;
}

export interface Trade {
  id: string;
  marketId: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  timestamp: number;
  fee: number;
  orderId: string;
}

export interface MarketInfo {
  marketId: string;
  baseAsset: string;
  quoteAsset: string;
  tickSize: number;
  stepSize: number;
  minOrderSize: number;
  maxOrderSize: number;
  maintenanceMarginRate: number;
  initialMarginRate: number;
}

export class KanaLabsIntegrationService {
  private static instance: KanaLabsIntegrationService;
  private config: KanaLabsConfig;
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;

  private constructor() {
    this.config = {
      apiKey: process.env.KANA_LABS_API_KEY || '',
      perpsBaseUrl: process.env.KANA_PERPS_BASE_URL || 'https://perps-sdk.kanalabs.io',
      aggregatorUrl: process.env.KANA_AGGREGATOR_URL || 'https://ag.kanalabs.io',
      paymasterUrl: process.env.KANA_PAYMASTER_URL || 'https://paymaster-sdk.kanalabs.io',
      websocketUrl: process.env.KANA_LABS_WS_URL || 'wss://perps-sdk-ws.kanalabs.io/wsOrderBook',
      defaultMarketId: process.env.KANA_DEFAULT_MARKET_ID || 'APT-USDC',
      maxSlippage: parseFloat(process.env.KANA_MAX_SLIPPAGE || '0.5'),
      defaultLeverage: parseInt(process.env.KANA_DEFAULT_LEVERAGE || '1')
    };
  }

  public static getInstance(): KanaLabsIntegrationService {
    if (!KanaLabsIntegrationService.instance) {
      KanaLabsIntegrationService.instance = new KanaLabsIntegrationService();
    }
    return KanaLabsIntegrationService.instance;
  }

  /**
   * Initialize the service and WebSocket connection
   */
  async initialize(): Promise<void> {
    try {
      logger.info('🔗 Initializing Kana Labs Integration...');
      
      // Test API connection
      await this.testConnection();
      
      // Initialize WebSocket for real-time data
      await this.initializeWebSocket();
      
      logger.info('✅ Kana Labs Integration initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize Kana Labs Integration:', error);
      throw error;
    }
  }

  /**
   * Test API connection
   */
  private async testConnection(): Promise<void> {
    try {
      const marketInfo = await this.getMarketInfo(this.config.defaultMarketId);
      logger.info(`📊 Connected to Kana Labs - Market: ${marketInfo.marketId}`);
    } catch (error) {
      throw new Error(`Kana Labs API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Initialize WebSocket connection for real-time data
   */
  private async initializeWebSocket(): Promise<void> {
    try {
      const wsUrl = `${this.config.websocketUrl}?marketId=${this.config.defaultMarketId}`;
      this.ws = new WebSocket(wsUrl, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      this.ws.on('open', () => {
        logger.info('📡 Kana Labs WebSocket connected');
        this.isConnected = true;
      });

      this.ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleWebSocketMessage(message);
        } catch (error) {
          logger.error('Error parsing WebSocket message:', error);
        }
      });

      this.ws.on('close', () => {
        logger.warn('📡 Kana Labs WebSocket disconnected');
        this.isConnected = false;
        // Implement reconnection logic
        setTimeout(() => this.initializeWebSocket(), 5000);
      });

      this.ws.on('error', (error) => {
        logger.error('Kana Labs WebSocket error:', error);
      });

    } catch (error) {
      logger.error('Failed to initialize WebSocket:', error);
      throw error;
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(message: any): void {
    // Process real-time market data, order updates, etc.
    logger.debug('Received WebSocket message:', message);
    
    // TODO: Implement message handling for:
    // - Order book updates
    // - Trade updates
    // - Position updates
    // - Market price updates
  }

  /**
   * 🔹 TRADING APIs - Place Market Order
   */
  async placeMarketOrder(request: MarketOrderRequest): Promise<any> {
    try {
      const response = await axios.post(
        `${this.config.perpsBaseUrl}/api/v1/orders/market`,
        {
          marketId: request.marketId,
          side: request.side,
          size: request.size,
          leverage: request.leverage || this.config.defaultLeverage,
          reduceOnly: request.reduceOnly || false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`📈 Market order placed: ${request.side} ${request.size} ${request.marketId}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to place market order:', error);
      throw error;
    }
  }

  /**
   * 🔹 TRADING APIs - Place Limit Order
   */
  async placeLimitOrder(request: LimitOrderRequest): Promise<any> {
    try {
      const response = await axios.post(
        `${this.config.perpsBaseUrl}/api/v1/orders/limit`,
        {
          marketId: request.marketId,
          side: request.side,
          size: request.size,
          price: request.price,
          leverage: request.leverage || this.config.defaultLeverage,
          timeInForce: request.timeInForce || 'GTC'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`📊 Limit order placed: ${request.side} ${request.size} ${request.marketId} @ ${request.price}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to place limit order:', error);
      throw error;
    }
  }

  /**
   * 🔹 PORTFOLIO APIs - Get Positions
   */
  async getPositions(walletAddress: string): Promise<Position[]> {
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/positions`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          params: {
            walletAddress: walletAddress
          }
        }
      );

      return response.data.positions || [];
    } catch (error) {
      logger.error('Failed to get positions:', error);
      throw error;
    }
  }

  /**
   * 🔹 PORTFOLIO APIs - Get Trading Account Balance
   */
  async getTradingAccountBalance(walletAddress: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/account/balance`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          params: {
            walletAddress: walletAddress
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to get trading account balance:', error);
      throw error;
    }
  }

  /**
   * 🔹 MARKET DATA APIs - Get Market Info
   */
  async getMarketInfo(marketId: string): Promise<MarketInfo> {
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/markets/${marketId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to get market info:', error);
      throw error;
    }
  }

  /**
   * 🔹 MARKET DATA APIs - Get Market Price
   */
  async getMarketPrice(marketId: string): Promise<number> {
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/markets/${marketId}/price`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return response.data.price;
    } catch (error) {
      logger.error('Failed to get market price:', error);
      throw error;
    }
  }

  /**
   * 🔹 TRADING APIs - Get All Trades
   */
  async getAllTrades(walletAddress: string, limit: number = 50): Promise<Trade[]> {
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/trades`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          params: {
            walletAddress: walletAddress,
            limit: limit
          }
        }
      );

      return response.data.trades || [];
    } catch (error) {
      logger.error('Failed to get trades:', error);
      throw error;
    }
  }

  /**
   * 🔹 RISK MANAGEMENT - Update Take Profit
   */
  async updateTakeProfit(orderId: string, takeProfitPrice: number): Promise<any> {
    try {
      const response = await axios.put(
        `${this.config.perpsBaseUrl}/api/v1/orders/${orderId}/take-profit`,
        {
          takeProfitPrice: takeProfitPrice
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`🎯 Take profit updated for order ${orderId}: ${takeProfitPrice}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to update take profit:', error);
      throw error;
    }
  }

  /**
   * 🔹 RISK MANAGEMENT - Update Stop Loss
   */
  async updateStopLoss(orderId: string, stopLossPrice: number): Promise<any> {
    try {
      const response = await axios.put(
        `${this.config.perpsBaseUrl}/api/v1/orders/${orderId}/stop-loss`,
        {
          stopLossPrice: stopLossPrice
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`🛡️ Stop loss updated for order ${orderId}: ${stopLossPrice}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to update stop loss:', error);
      throw error;
    }
  }

  /**
   * 🔹 PORTFOLIO APIs - Get Account APT Balance
   */
  async getAccountAptBalance(walletAddress: string): Promise<number> {
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/account/apt-balance`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          params: {
            walletAddress: walletAddress
          }
        }
      );

      return response.data.balance || 0;
    } catch (error) {
      logger.error('Failed to get APT balance:', error);
      throw error;
    }
  }

  /**
   * Cancel multiple orders
   */
  async cancelMultipleOrders(orderIds: string[]): Promise<any> {
    try {
      const response = await axios.delete(
        `${this.config.perpsBaseUrl}/api/v1/orders/batch`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          data: {
            orderIds: orderIds
          }
        }
      );

      logger.info(`🗑️ Cancelled ${orderIds.length} orders`);
      return response.data;
    } catch (error) {
      logger.error('Failed to cancel multiple orders:', error);
      throw error;
    }
  }

  /**
   * Get order history
   */
  async getOrderHistory(walletAddress: string, limit: number = 50): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/orders/history`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          params: {
            walletAddress: walletAddress,
            limit: limit
          }
        }
      );

      return response.data.orders || [];
    } catch (error) {
      logger.error('Failed to get order history:', error);
      throw error;
    }
  }

  /**
   * Disconnect and cleanup
   */
  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    logger.info('🔌 Kana Labs Integration disconnected');
  }

  /**
   * Get connection status
   */
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }
}
