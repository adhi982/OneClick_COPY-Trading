import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../utils/logger';
import { KanaLabsService } from './kana-labs.service';
import jwt from 'jsonwebtoken';

export interface ClientSubscription {
  userId: string;
  socketId: string;
  subscribedTraders: Set<string>;
  subscribedSymbols: Set<string>;
  isAuthenticated: boolean;
}

export class WebSocketService {
  private static instance: WebSocketService;
  private io: Server | null = null;
  private clients: Map<string, ClientSubscription> = new Map();
  private kanaLabsService: KanaLabsService;

  private constructor() {
    this.kanaLabsService = KanaLabsService.getInstance();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Initialize WebSocket server
   */
  initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          // Allow unauthenticated connections for public data
          socket.data.isAuthenticated = false;
          socket.data.userId = `guest_${socket.id}`;
          return next();
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        socket.data.isAuthenticated = true;
        socket.data.userId = decoded.userId;
        
        next();
      } catch (error) {
        logger.error('WebSocket authentication error:', error);
        socket.data.isAuthenticated = false;
        socket.data.userId = `guest_${socket.id}`;
        next();
      }
    });

    this.io.on('connection', (socket) => {
      logger.info(`🔌 Client connected: ${socket.id} (User: ${socket.data.userId})`);
      
      // Initialize client subscription
      this.clients.set(socket.id, {
        userId: socket.data.userId,
        socketId: socket.id,
        subscribedTraders: new Set(),
        subscribedSymbols: new Set(),
        isAuthenticated: socket.data.isAuthenticated
      });

      // Handle client events
      this.setupEventHandlers(socket);
    });

    logger.info('🚀 WebSocket server initialized');
  }

  /**
   * Setup event handlers for socket connections
   */
  private setupEventHandlers(socket: any): void {
    // Subscribe to trader updates
    socket.on('subscribe_trader', async (data: { traderId: string }) => {
      try {
        const client = this.clients.get(socket.id);
        if (!client) return;

        const { traderId } = data;
        
        // Add to client subscription
        client.subscribedTraders.add(traderId);
        
        // Subscribe to Kana Labs if not already subscribed
        await this.kanaLabsService.subscribeToTrader(traderId);
        
        socket.emit('subscription_confirmed', { 
          type: 'trader', 
          traderId,
          message: `Subscribed to trader ${traderId}` 
        });

        logger.info(`📡 Client ${socket.id} subscribed to trader: ${traderId}`);
      } catch (error) {
        logger.error('Error subscribing to trader:', error);
        socket.emit('subscription_error', { 
          type: 'trader', 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Unsubscribe from trader updates
    socket.on('unsubscribe_trader', (data: { traderId: string }) => {
      try {
        const client = this.clients.get(socket.id);
        if (!client) return;

        const { traderId } = data;
        client.subscribedTraders.delete(traderId);
        
        socket.emit('unsubscription_confirmed', { 
          type: 'trader', 
          traderId,
          message: `Unsubscribed from trader ${traderId}` 
        });

        logger.info(`📡 Client ${socket.id} unsubscribed from trader: ${traderId}`);
      } catch (error) {
        logger.error('Error unsubscribing from trader:', error);
      }
    });

    // Subscribe to market data
    socket.on('subscribe_market', async (data: { symbols: string[] }) => {
      try {
        const client = this.clients.get(socket.id);
        if (!client) return;

        const { symbols } = data;
        
        // Add to client subscription
        symbols.forEach(symbol => client.subscribedSymbols.add(symbol));
        
        // Subscribe to Kana Labs market data
        await this.kanaLabsService.subscribeToMarketData(symbols);
        
        socket.emit('subscription_confirmed', { 
          type: 'market', 
          symbols,
          message: `Subscribed to market data: ${symbols.join(', ')}` 
        });

        logger.info(`📊 Client ${socket.id} subscribed to market data: ${symbols.join(', ')}`);
      } catch (error) {
        logger.error('Error subscribing to market data:', error);
        socket.emit('subscription_error', { 
          type: 'market', 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get real-time portfolio data
    socket.on('get_portfolio', async () => {
      try {
        if (!socket.data.isAuthenticated) {
          socket.emit('error', { message: 'Authentication required for portfolio data' });
          return;
        }

        // TODO: Implement real-time portfolio fetching
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
              pnlPercentage: 5.3
            }
          ]
        };

        socket.emit('portfolio_update', portfolioData);
      } catch (error) {
        logger.error('Error fetching portfolio:', error);
        socket.emit('error', { message: 'Failed to fetch portfolio data' });
      }
    });

    // Get trader details
    socket.on('get_trader_details', async (data: { traderId: string }) => {
      try {
        const { traderId } = data;
        
        // Fetch trader data from Kana Labs
        const traderHistory = await this.kanaLabsService.getTraderHistory(traderId, 50);
        
        socket.emit('trader_details', {
          traderId,
          ...traderHistory
        });
      } catch (error) {
        logger.error('Error fetching trader details:', error);
        socket.emit('error', { message: 'Failed to fetch trader details' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', (reason: string) => {
      logger.info(`🔌 Client disconnected: ${socket.id} (${reason})`);
      this.clients.delete(socket.id);
    });

    // Handle ping for connection health
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });
  }

  /**
   * Broadcast trade updates to relevant clients
   */
  broadcastTradeUpdate(tradeData: any): void {
    if (!this.io) return;

    this.clients.forEach((client, socketId) => {
      if (client.subscribedTraders.has(tradeData.traderId)) {
        this.io!.to(socketId).emit('trade_update', {
          type: 'trade_execution',
          data: tradeData,
          timestamp: Date.now()
        });
      }
    });

    logger.debug(`📡 Broadcasted trade update for trader: ${tradeData.traderId}`);
  }

  /**
   * Broadcast trader performance updates
   */
  broadcastTraderPerformance(performanceData: any): void {
    if (!this.io) return;

    this.clients.forEach((client, socketId) => {
      if (client.subscribedTraders.has(performanceData.traderId)) {
        this.io!.to(socketId).emit('trader_performance', {
          type: 'performance_update',
          data: performanceData,
          timestamp: Date.now()
        });
      }
    });

    logger.debug(`📈 Broadcasted performance update for trader: ${performanceData.traderId}`);
  }

  /**
   * Broadcast market data updates
   */
  broadcastMarketData(marketData: any): void {
    if (!this.io) return;

    this.clients.forEach((client, socketId) => {
      if (client.subscribedSymbols.has(marketData.symbol)) {
        this.io!.to(socketId).emit('market_update', {
          type: 'price_update',
          data: marketData,
          timestamp: Date.now()
        });
      }
    });

    logger.debug(`📊 Broadcasted market update for symbol: ${marketData.symbol}`);
  }

  /**
   * Broadcast position updates to authenticated users
   */
  broadcastPositionUpdate(positionData: any): void {
    if (!this.io) return;

    // Only send to authenticated users who own the position
    this.clients.forEach((client, socketId) => {
      if (client.isAuthenticated && client.userId === positionData.userId) {
        this.io!.to(socketId).emit('position_update', {
          type: 'position_change',
          data: positionData,
          timestamp: Date.now()
        });
      }
    });

    logger.debug(`📍 Broadcasted position update for user: ${positionData.userId}`);
  }

  /**
   * Send notification to specific user
   */
  sendNotificationToUser(userId: string, notification: any): void {
    if (!this.io) return;

    const userSockets = Array.from(this.clients.entries())
      .filter(([_, client]) => client.userId === userId)
      .map(([socketId, _]) => socketId);

    userSockets.forEach(socketId => {
      this.io!.to(socketId).emit('notification', {
        type: 'system_notification',
        data: notification,
        timestamp: Date.now()
      });
    });

    logger.debug(`🔔 Sent notification to user: ${userId}`);
  }

  /**
   * Get connected clients count
   */
  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  /**
   * Get statistics about subscriptions
   */
  getSubscriptionStats(): any {
    const traderSubscriptions = new Map<string, number>();
    const symbolSubscriptions = new Map<string, number>();

    this.clients.forEach(client => {
      client.subscribedTraders.forEach(traderId => {
        traderSubscriptions.set(traderId, (traderSubscriptions.get(traderId) || 0) + 1);
      });
      
      client.subscribedSymbols.forEach(symbol => {
        symbolSubscriptions.set(symbol, (symbolSubscriptions.get(symbol) || 0) + 1);
      });
    });

    return {
      totalClients: this.clients.size,
      authenticatedClients: Array.from(this.clients.values()).filter(c => c.isAuthenticated).length,
      traderSubscriptions: Object.fromEntries(traderSubscriptions),
      symbolSubscriptions: Object.fromEntries(symbolSubscriptions)
    };
  }
}
