import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import tradersRoutes from './routes/traders.routes';
import portfolioRoutes from './routes/portfolio.routes';
import marketRoutes from './routes/market.routes';
import communityRoutes from './routes/community.routes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Import services
import { AptosService } from './services/aptos.service';

dotenv.config();

// Initialize services
AptosService.initialize();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
   credentials: true
}));

// Rate limiting
const limiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Health check endpoint
app.get('/health', (req, res) => {
   res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
   });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/traders', tradersRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/community', communityRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
   res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
   logger.info(`Server running on port ${PORT}`);
   logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
