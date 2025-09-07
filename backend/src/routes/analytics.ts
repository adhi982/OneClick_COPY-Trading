import express from 'express'
import { Request, Response } from 'express'
import AIAnalyticsService from '../services/aiAnalyticsService'
import winston from 'winston'

const router = express.Router()
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
})

// Initialize AI Analytics Service
let aiAnalyticsService: AIAnalyticsService

try {
  aiAnalyticsService = new AIAnalyticsService()
  logger.info('✅ AI Analytics Service initialized successfully')
} catch (error) {
  logger.error('Failed to initialize AI Analytics Service:', error)
}

/**
 * POST /api/analytics/performance-insights
 * Generate AI-powered performance insights
 */
router.post('/performance-insights', async (req: Request, res: Response) => {
  try {
    if (!aiAnalyticsService) {
      return res.status(500).json({
        error: 'AI Analytics Service not available',
        message: 'Please check HUGGINGFACE_API_KEY configuration'
      })
    }

    const { tradingData } = req.body

    if (!tradingData || !Array.isArray(tradingData)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'tradingData array is required'
      })
    }

    const insights = await aiAnalyticsService.generatePerformanceInsights(tradingData)

    return res.json({
      success: true,
      insights,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Error generating performance insights:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate performance insights'
    })
  }
})

/**
 * POST /api/analytics/risk-analysis
 * Generate AI-powered risk analysis
 */
router.post('/risk-analysis', async (req: Request, res: Response) => {
  try {
    if (!aiAnalyticsService) {
      return res.status(500).json({
        error: 'AI Analytics Service not available',
        message: 'Please check HUGGINGFACE_API_KEY configuration'
      })
    }

    const { portfolioData } = req.body

    if (!portfolioData) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'portfolioData is required'
      })
    }

    const insights = await aiAnalyticsService.analyzeRiskFactors(portfolioData)

    return res.json({
      success: true,
      insights,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Error generating risk analysis:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate risk analysis'
    })
  }
})

/**
 * POST /api/analytics/attribution-analysis
 * Generate AI-powered attribution analysis
 */
router.post('/attribution-analysis', async (req: Request, res: Response) => {
  try {
    if (!aiAnalyticsService) {
      return res.status(500).json({
        error: 'AI Analytics Service not available',
        message: 'Please check HUGGINGFACE_API_KEY configuration'
      })
    }

    const { traderData } = req.body

    if (!traderData || !Array.isArray(traderData)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'traderData array is required'
      })
    }

    const insights = await aiAnalyticsService.generateAttributionAnalysis(traderData)

    return res.json({
      success: true,
      insights,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Error generating attribution analysis:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate attribution analysis'
    })
  }
})

/**
 * POST /api/analytics/correlation-analysis
 * Generate AI-powered correlation analysis
 */
router.post('/correlation-analysis', async (req: Request, res: Response) => {
  try {
    if (!aiAnalyticsService) {
      return res.status(500).json({
        error: 'AI Analytics Service not available',
        message: 'Please check HUGGINGFACE_API_KEY configuration'
      })
    }

    const { correlationData } = req.body

    if (!correlationData || !Array.isArray(correlationData)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'correlationData array is required'
      })
    }

    const insights = await aiAnalyticsService.analyzeCorrelations(correlationData)

    return res.json({
      success: true,
      insights,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Error generating correlation analysis:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate correlation analysis'
    })
  }
})

/**
 * POST /api/analytics/market-sentiment
 * Analyze market sentiment using DistilBERT
 */
router.post('/market-sentiment', async (req: Request, res: Response) => {
  try {
    if (!aiAnalyticsService) {
      return res.status(500).json({
        error: 'AI Analytics Service not available',
        message: 'Please check HUGGINGFACE_API_KEY configuration'
      })
    }

    const { text } = req.body

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'text string is required'
      })
    }

    const sentiment = await aiAnalyticsService.analyzeMarketSentiment(text)

    return res.json({
      success: true,
      sentiment,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Error analyzing market sentiment:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to analyze market sentiment'
    })
  }
})

/**
 * POST /api/analytics/realtime-analysis
 * Real-time market analysis with AI insights
 */
router.post('/realtime-analysis', async (req: Request, res: Response) => {
  try {
    if (!aiAnalyticsService) {
      return res.status(500).json({
        error: 'AI Analytics Service not available',
        message: 'Please check HUGGINGFACE_API_KEY configuration'
      })
    }

    const { marketData } = req.body

    if (!marketData) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'marketData is required'
      })
    }

    const analysis = await aiAnalyticsService.analyzeRealTimeMarket(marketData)

    return res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Error performing real-time analysis:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to perform real-time analysis'
    })
  }
})

/**
 * GET /api/analytics/health
 * Check AI Analytics service health
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    const isHealthy = !!aiAnalyticsService && !!process.env.HUGGINGFACE_API_KEY

    res.json({
      success: true,
      healthy: isHealthy,
      services: {
        aiAnalytics: !!aiAnalyticsService,
        huggingfaceApi: !!process.env.HUGGINGFACE_API_KEY
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Error checking analytics health:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to check service health'
    })
  }
})

/**
 * POST /api/analytics/enhanced-insights
 * Generate enhanced AI insights using advanced models
 */
router.post('/enhanced-insights', async (req: Request, res: Response) => {
  try {
    if (!aiAnalyticsService) {
      return res.status(500).json({
        error: 'AI Analytics Service not available',
        message: 'Please check AI service configuration'
      })
    }

    const { context, data, analysisType = 'comprehensive' } = req.body

    if (!context || !data) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'context and data are required'
      })
    }

    // Generate enhanced insights using the AI service
    const enhancedInsight = await aiAnalyticsService.generateEnhancedInsights(context, data)
    
    // Also get traditional sentiment analysis for comparison
    const sentimentAnalysis = await aiAnalyticsService.analyzeMarketSentiment(context)

    return res.json({
      success: true,
      enhancedInsight,
      sentimentAnalysis,
      analysisType,
      timestamp: new Date().toISOString(),
      metadata: {
        dataPoints: data.length,
        confidence: sentimentAnalysis.confidence
      }
    })

  } catch (error) {
    logger.error('Error generating enhanced insights:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate enhanced insights'
    })
  }
})

/**
 * POST /api/analytics/correlation-analysis
 * Generate AI-powered correlation analysis
 */
router.post('/correlation-analysis', async (req: Request, res: Response) => {
  try {
    if (!aiAnalyticsService) {
      return res.status(500).json({
        error: 'AI Analytics Service not available',
        message: 'Please check AI service configuration'
      })
    }

    const { assets, correlationMatrix } = req.body

    if (!assets || !correlationMatrix) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'assets array and correlationMatrix are required'
      })
    }

    const correlationInsights = await aiAnalyticsService.generateCorrelationInsights(assets, correlationMatrix)

    return res.json({
      success: true,
      insights: [correlationInsights],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Error generating correlation analysis:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate correlation analysis'
    })
  }
})

export default router
