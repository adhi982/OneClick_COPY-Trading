import { createServer } from 'http';
import app from './app';
import { logger } from './utils/logger';
import { KanaLabsService } from './services/kana-labs.service';
import { WebSocketService } from './services/websocket.service';

const PORT = process.env.PORT || 3001;

// Create HTTP server
const httpServer = createServer(app);

// Initialize real-time services
async function initializeServices() {
  try {
    logger.info('🚀 Initializing real-time services...');

    // Initialize WebSocket service
    const webSocketService = WebSocketService.getInstance();
    webSocketService.initialize(httpServer);
    logger.info('✅ WebSocket service initialized');

    // Initialize Kana Labs service
    const kanaLabsService = KanaLabsService.getInstance();
    await kanaLabsService.initialize();
    logger.info('✅ Kana Labs service initialized');

    // Start server
    httpServer.listen(PORT, () => {
      logger.info(`🌟 OneClick Copy Trading Server running on port ${PORT}`);
      logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📡 WebSocket server ready for real-time connections`);
      logger.info(`📊 Kana Labs integration active`);
    });

  } catch (error) {
    logger.error('❌ Failed to initialize services:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('📴 SIGTERM received, shutting down gracefully...');
  
  try {
    const kanaLabsService = KanaLabsService.getInstance();
    await kanaLabsService.disconnect();
    logger.info('✅ Kana Labs service disconnected');
    
    httpServer.close(() => {
      logger.info('✅ HTTP server closed');
      process.exit(0);
    });
  } catch (error) {
    logger.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  logger.info('📴 SIGINT received, shutting down gracefully...');
  
  try {
    const kanaLabsService = KanaLabsService.getInstance();
    await kanaLabsService.disconnect();
    logger.info('✅ Kana Labs service disconnected');
    
    httpServer.close(() => {
      logger.info('✅ HTTP server closed');
      process.exit(0);
    });
  } catch (error) {
    logger.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Initialize and start server
initializeServices();

export { httpServer };
