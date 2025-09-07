import { HfInference } from '@huggingface/inference'
import { GoogleGenerativeAI } from '@google/generative-ai'
import winston from 'winston'

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/ai-analytics.log' }),
    new winston.transports.Console()
  ]
})

interface TradingData {
  price: number
  volume: number
  timestamp: Date
  symbol: string
  change: number
  sentiment?: number
}

interface AnalyticsInsight {
  type: 'performance' | 'risk' | 'attribution' | 'correlation'
  insight: string
  confidence: number
  severity: 'low' | 'medium' | 'high'
  recommendations: string[]
  metadata?: any
}

interface MarketSentiment {
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number
  confidence: number
  factors: string[]
}

class AIAnalyticsService {
  private hf: HfInference
  private gemini: any
  private model: string = 'distilbert-base-uncased-finetuned-sst-2-english'
  private useGeminiAsBackup: boolean = false

  constructor() {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('HUGGINGFACE_API_KEY is required')
    }
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY)
    
    // Initialize Gemini as fallback if API key is available
    if (process.env.GOOGLE_AI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
      this.gemini = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
      this.useGeminiAsBackup = true
      logger.info('✅ Fallback AI model initialized successfully')
    }
  }

  /**
   * Analyze market sentiment using DistilBERT with Gemini fallback
   */
  async analyzeMarketSentiment(text: string): Promise<MarketSentiment> {
    try {
      // First try Hugging Face DistilBERT
      const result = await this.hf.textClassification({
        model: this.model,
        inputs: text
      })

      const sentimentScore = result[0]
      const sentiment = sentimentScore.label === 'POSITIVE' ? 'positive' : 
                       sentimentScore.label === 'NEGATIVE' ? 'negative' : 'neutral'

      return {
        sentiment,
        score: sentimentScore.score,
        confidence: sentimentScore.score,
        factors: this.extractSentimentFactors(text, sentiment)
      }
    } catch (error) {
      logger.warn('Primary AI model unavailable, using fallback analysis:', error)
      
      // Fallback to Gemini if available
      if (this.useGeminiAsBackup && this.gemini) {
        return await this.analyzeWithGemini(text)
      }
      
      // Final fallback to rule-based analysis
      return this.fallbackSentimentAnalysis(text)
    }
  }

  /**
   * Analyze sentiment using Gemini as fallback
   */
  private async analyzeWithGemini(text: string): Promise<MarketSentiment> {
    try {
      const prompt = `Analyze the sentiment of this trading/market text and provide a response in this exact format:
      
SENTIMENT: [positive/negative/neutral]
SCORE: [0.0-1.0]
FACTORS: [list key factors that influenced the sentiment]

Text to analyze: "${text}"

Provide a brief, accurate sentiment analysis focusing on market implications.`

      const result = await this.gemini.generateContent(prompt)
      const response = result.response.text()
      
      return this.parseGeminiResponse(response, text)
    } catch (error) {
      logger.warn('Fallback AI model failed, using rule-based analysis:', error)
      return this.fallbackSentimentAnalysis(text)
    }
  }

  /**
   * Parse Gemini response into structured sentiment data
   */
  private parseGeminiResponse(response: string, originalText: string): MarketSentiment {
    try {
      const lines = response.split('\n')
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
      let score = 0.5
      let factors: string[] = []

      for (const line of lines) {
        if (line.includes('SENTIMENT:')) {
          const sentimentMatch = line.match(/SENTIMENT:\s*(positive|negative|neutral)/i)
          if (sentimentMatch) {
            sentiment = sentimentMatch[1].toLowerCase() as 'positive' | 'negative' | 'neutral'
          }
        }
        if (line.includes('SCORE:')) {
          const scoreMatch = line.match(/SCORE:\s*([\d.]+)/)
          if (scoreMatch) {
            score = Math.min(1.0, Math.max(0.0, parseFloat(scoreMatch[1])))
          }
        }
        if (line.includes('FACTORS:')) {
          const factorsText = line.replace(/FACTORS:\s*/i, '')
          factors = factorsText.split(',').map(f => f.trim()).filter(f => f.length > 0)
        }
      }

      if (factors.length === 0) {
        factors = this.extractSentimentFactors(originalText, sentiment)
      }

      return {
        sentiment,
        score,
        confidence: score,
        factors
      }
    } catch (error) {
      logger.warn('Failed to parse Gemini response, using fallback:', error)
      return this.fallbackSentimentAnalysis(originalText)
    }
  }

  /**
   * Rule-based fallback sentiment analysis
   */
  private fallbackSentimentAnalysis(text: string): MarketSentiment {
    const positiveWords = ['profit', 'gain', 'growth', 'increase', 'bullish', 'strong', 'rising', 'up', 'positive', 'good', 'excellent', 'outperform']
    const negativeWords = ['loss', 'decline', 'bearish', 'weak', 'falling', 'down', 'negative', 'poor', 'bad', 'underperform', 'risk', 'volatile']
    
    const textLower = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
    let score = 0.5
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive'
      score = Math.min(0.9, 0.5 + (positiveCount * 0.1))
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative'
      score = Math.max(0.1, 0.5 - (negativeCount * 0.1))
    }
    
    return {
      sentiment,
      score,
      confidence: 0.6, // Lower confidence for rule-based analysis
      factors: this.extractSentimentFactors(text, sentiment)
    }
  }

  /**
   * Generate performance insights using AI analysis with enhanced capabilities
   */
  async generatePerformanceInsights(tradingData: TradingData[]): Promise<AnalyticsInsight[]> {
    try {
      const insights: AnalyticsInsight[] = []
      
      // Analyze recent performance trends
      const recentData = tradingData.slice(-20) // Last 20 data points
      const performanceTrend = this.calculatePerformanceTrend(recentData)
      
      // Generate insight text for AI analysis
      const performanceText = this.createPerformanceNarrative(performanceTrend, recentData)
      const sentiment = await this.analyzeMarketSentiment(performanceText)
      
      // Try to get enhanced insights if advanced model is available
      let enhancedInsight = this.generatePerformanceInsight(performanceTrend, sentiment)
      
      if (this.useGeminiAsBackup && this.gemini && recentData.length > 5) {
        try {
          const context = `performance analysis for ${recentData[0].symbol || 'portfolio'}`
          const aiEnhancedText = await this.generateEnhancedInsights(context, recentData)
          if (aiEnhancedText && aiEnhancedText.length > 50) {
            enhancedInsight = aiEnhancedText
          }
        } catch (error) {
          logger.debug('Enhanced insights not available, using standard analysis')
        }
      }
      
      insights.push({
        type: 'performance',
        insight: enhancedInsight,
        confidence: sentiment.confidence,
        severity: this.determineSeverity(performanceTrend, sentiment),
        recommendations: this.generatePerformanceRecommendations(performanceTrend, sentiment),
        metadata: { trend: performanceTrend, sentiment }
      })

      return insights
    } catch (error) {
      logger.error('Error generating performance insights:', error)
      throw error
    }
  }

  /**
   * Analyze risk using AI-powered sentiment and pattern recognition
   */
  async analyzeRiskFactors(portfolioData: any): Promise<AnalyticsInsight[]> {
    try {
      const insights: AnalyticsInsight[] = []
      
      // Create risk narrative for AI analysis
      const riskNarrative = this.createRiskNarrative(portfolioData)
      const sentiment = await this.analyzeMarketSentiment(riskNarrative)
      
      // Volatility analysis
      const volatilityInsight = await this.analyzeVolatility(portfolioData, sentiment)
      insights.push(volatilityInsight)
      
      // Concentration risk analysis
      const concentrationInsight = await this.analyzeConcentrationRisk(portfolioData, sentiment)
      insights.push(concentrationInsight)
      
      // Correlation risk analysis
      const correlationInsight = await this.analyzeCorrelationRisk(portfolioData, sentiment)
      insights.push(correlationInsight)
      
      return insights
    } catch (error) {
      logger.error('Error analyzing risk factors:', error)
      throw error
    }
  }

  /**
   * Generate attribution analysis with AI insights
   */
  async generateAttributionAnalysis(traderData: any[]): Promise<AnalyticsInsight[]> {
    try {
      const insights: AnalyticsInsight[] = []
      
      for (const trader of traderData) {
        const traderNarrative = this.createTraderNarrative(trader)
        const sentiment = await this.analyzeMarketSentiment(traderNarrative)
        
        insights.push({
          type: 'attribution',
          insight: this.generateAttributionInsight(trader, sentiment),
          confidence: sentiment.confidence,
          severity: this.determineTraderSeverity(trader, sentiment),
          recommendations: this.generateTraderRecommendations(trader, sentiment),
          metadata: { trader: trader.name, sentiment }
        })
      }
      
      return insights
    } catch (error) {
      logger.error('Error generating attribution analysis:', error)
      throw error
    }
  }

  /**
   * Analyze correlations with AI-powered insights
   */
  async analyzeCorrelations(correlationData: any[]): Promise<AnalyticsInsight[]> {
    try {
      const insights: AnalyticsInsight[] = []
      
      const highCorrelations = correlationData.filter(c => c.correlation > 0.8)
      
      if (highCorrelations.length > 0) {
        const correlationNarrative = this.createCorrelationNarrative(highCorrelations)
        const sentiment = await this.analyzeMarketSentiment(correlationNarrative)
        
        insights.push({
          type: 'correlation',
          insight: this.generateCorrelationInsight(highCorrelations, sentiment),
          confidence: sentiment.confidence,
          severity: 'high',
          recommendations: this.generateCorrelationRiskRecommendations(highCorrelations[0].correlation, sentiment),
          metadata: { highCorrelations, sentiment }
        })
      }
      
      return insights
    } catch (error) {
      logger.error('Error analyzing correlations:', error)
      throw error
    }
  }

  /**
   * Real-time market analysis
   */
  async analyzeRealTimeMarket(marketData: any): Promise<{
    sentiment: MarketSentiment
    signals: string[]
    alerts: AnalyticsInsight[]
  }> {
    try {
      const marketNarrative = this.createMarketNarrative(marketData)
      const sentiment = await this.analyzeMarketSentiment(marketNarrative)
      
      const signals = this.generateTradingSignals(marketData, sentiment)
      const alerts = await this.generateMarketAlerts(marketData, sentiment)
      
      return { sentiment, signals, alerts }
    } catch (error) {
      logger.error('Error analyzing real-time market:', error)
      throw error
    }
  }

  // Helper methods
  private extractSentimentFactors(text: string, sentiment: string): string[] {
    const factors: string[] = []
    
    const positiveKeywords = ['profit', 'gain', 'bullish', 'growth', 'positive', 'uptrend']
    const negativeKeywords = ['loss', 'decline', 'bearish', 'volatility', 'risk', 'downtrend']
    
    const keywords = sentiment === 'positive' ? positiveKeywords : negativeKeywords
    
    keywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        factors.push(keyword)
      }
    })
    
    return factors
  }

  private calculatePerformanceTrend(data: TradingData[]): 'bullish' | 'bearish' | 'sideways' {
    if (data.length < 2) return 'sideways'
    
    const firstPrice = data[0].price
    const lastPrice = data[data.length - 1].price
    const change = (lastPrice - firstPrice) / firstPrice
    
    if (change > 0.02) return 'bullish'
    if (change < -0.02) return 'bearish'
    return 'sideways'
  }

  private createPerformanceNarrative(trend: string, data: TradingData[]): string {
    const avgChange = data.reduce((sum, d) => sum + d.change, 0) / data.length
    const volatility = this.calculateVolatility(data)
    
    return `The portfolio is showing a ${trend} trend with an average change of ${avgChange.toFixed(2)}%. ` +
           `Market volatility is ${volatility > 0.05 ? 'high' : 'moderate'} at ${(volatility * 100).toFixed(1)}%. ` +
           `Recent trading activity suggests ${trend === 'bullish' ? 'positive momentum' : trend === 'bearish' ? 'declining performance' : 'stable conditions'}.`
  }

  private calculateVolatility(data: TradingData[]): number {
    if (data.length < 2) return 0
    
    const changes = data.map(d => d.change)
    const mean = changes.reduce((sum, change) => sum + change, 0) / changes.length
    const variance = changes.reduce((sum, change) => sum + Math.pow(change - mean, 2), 0) / changes.length
    
    return Math.sqrt(variance)
  }

  private createRiskNarrative(portfolioData: any): string {
    const { volatility, maxDrawdown, sharpeRatio, concentration } = portfolioData
    
    return `Portfolio risk analysis shows volatility at ${volatility}% with maximum drawdown of ${maxDrawdown}%. ` +
           `Sharpe ratio indicates ${sharpeRatio > 1 ? 'good' : 'poor'} risk-adjusted returns. ` +
           `Concentration risk is ${concentration > 0.3 ? 'high' : 'acceptable'} with potential concerns.`
  }

  private createTraderNarrative(trader: any): string {
    return `Trader ${trader.name} has generated ${trader.returns}% returns with ${trader.winRate}% win rate. ` +
           `Risk metrics show Sharpe ratio of ${trader.sharpe} and maximum drawdown of ${trader.maxDrawdown}%. ` +
           `Performance contribution to portfolio is ${trader.contribution}%.`
  }

  private createCorrelationNarrative(correlations: any[]): string {
    const assets = correlations.map(c => `${c.asset1}-${c.asset2}`).join(', ')
    const avgCorrelation = correlations.reduce((sum, c) => sum + c.correlation, 0) / correlations.length
    
    return `High correlation detected between assets: ${assets}. ` +
           `Average correlation coefficient is ${avgCorrelation.toFixed(2)}, indicating significant concentration risk. ` +
           `Portfolio diversification may be compromised during market stress.`
  }

  private createMarketNarrative(marketData: any): string {
    const { price, volume, change, trend } = marketData
    
    return `Current market conditions show price at ${price} with ${change > 0 ? 'positive' : 'negative'} change of ${change}%. ` +
           `Trading volume is ${volume > marketData.avgVolume ? 'above' : 'below'} average. ` +
           `Market trend appears ${trend} with ${marketData.momentum > 0 ? 'bullish' : 'bearish'} momentum.`
  }

  private generatePerformanceInsight(trend: string, sentiment: MarketSentiment): string {
    return `AI analysis indicates ${trend} market conditions with ${sentiment.sentiment} sentiment (${(sentiment.score * 100).toFixed(1)}% confidence). ` +
           `Current performance trajectory suggests ${trend === 'bullish' ? 'continued growth potential' : trend === 'bearish' ? 'caution and risk management' : 'stable performance with mixed signals'}.`
  }

  private generatePerformanceRecommendations(trend: string, sentiment: MarketSentiment): string[] {
    const recommendations: string[] = []
    
    if (trend === 'bullish' && sentiment.sentiment === 'positive') {
      recommendations.push('Consider increasing position sizes in outperforming assets')
      recommendations.push('Monitor for potential overbought conditions')
      recommendations.push('Take partial profits at resistance levels')
    } else if (trend === 'bearish' && sentiment.sentiment === 'negative') {
      recommendations.push('Implement strict stop-loss strategies')
      recommendations.push('Reduce portfolio leverage and exposure')
      recommendations.push('Consider defensive asset allocation')
    } else {
      recommendations.push('Maintain current allocation with active monitoring')
      recommendations.push('Prepare for potential volatility increases')
      recommendations.push('Focus on risk-adjusted returns')
    }
    
    return recommendations
  }

  private async analyzeVolatility(portfolioData: any, sentiment: MarketSentiment): Promise<AnalyticsInsight> {
    const volatility = portfolioData.volatility
    const severity = volatility > 20 ? 'high' : volatility > 10 ? 'medium' : 'low'
    
    return {
      type: 'risk',
      insight: `Portfolio volatility at ${volatility}% indicates ${severity} risk level. ` +
               `AI sentiment analysis suggests ${sentiment.sentiment} market conditions affecting volatility patterns.`,
      confidence: sentiment.confidence,
      severity,
      recommendations: this.generateVolatilityRecommendations(volatility, sentiment)
    }
  }

  private async analyzeConcentrationRisk(portfolioData: any, sentiment: MarketSentiment): Promise<AnalyticsInsight> {
    const concentration = portfolioData.concentration || 0.25
    const severity = concentration > 0.4 ? 'high' : concentration > 0.25 ? 'medium' : 'low'
    
    return {
      type: 'risk',
      insight: `Portfolio concentration risk assessed as ${severity} with ${(concentration * 100).toFixed(1)}% allocation in top positions. ` +
               `Market sentiment analysis indicates potential ${sentiment.sentiment} impact on concentrated holdings.`,
      confidence: sentiment.confidence,
      severity,
      recommendations: this.generateConcentrationRecommendations(concentration, sentiment)
    }
  }

  private async analyzeCorrelationRisk(portfolioData: any, sentiment: MarketSentiment): Promise<AnalyticsInsight> {
    const avgCorrelation = portfolioData.avgCorrelation || 0.65
    const severity = avgCorrelation > 0.8 ? 'high' : avgCorrelation > 0.6 ? 'medium' : 'low'
    
    return {
      type: 'risk',
      insight: `Average asset correlation of ${avgCorrelation.toFixed(2)} presents ${severity} diversification risk. ` +
               `AI analysis suggests ${sentiment.sentiment} market conditions may amplify correlation effects.`,
      confidence: sentiment.confidence,
      severity,
      recommendations: this.generateCorrelationRiskRecommendations(avgCorrelation, sentiment)
    }
  }

  private generateAttributionInsight(trader: any, sentiment: MarketSentiment): string {
    return `Trader ${trader.name} performance analysis shows ${trader.returns > 0 ? 'positive' : 'negative'} contribution. ` +
           `AI sentiment evaluation indicates ${sentiment.sentiment} outlook for continued performance based on current market conditions.`
  }

  private generateCorrelationInsight(correlations: any[], sentiment: MarketSentiment): string {
    return `High correlation risk detected across ${correlations.length} asset pairs. ` +
           `AI analysis suggests ${sentiment.sentiment} market sentiment may exacerbate correlation-driven losses during stress periods.`
  }

  private generateTradingSignals(marketData: any, sentiment: MarketSentiment): string[] {
    const signals: string[] = []
    
    if (sentiment.sentiment === 'positive' && sentiment.score > 0.8) {
      signals.push('Strong bullish sentiment detected - Consider long positions')
    } else if (sentiment.sentiment === 'negative' && sentiment.score > 0.8) {
      signals.push('Strong bearish sentiment detected - Consider defensive positioning')
    }
    
    if (marketData.volume > marketData.avgVolume * 1.5) {
      signals.push('High volume detected - Potential breakout opportunity')
    }
    
    return signals
  }

  private async generateMarketAlerts(_marketData: any, sentiment: MarketSentiment): Promise<AnalyticsInsight[]> {
    const alerts: AnalyticsInsight[] = []
    
    if (sentiment.sentiment === 'negative' && sentiment.score > 0.9) {
      alerts.push({
        type: 'risk',
        insight: 'Critical bearish sentiment detected with high confidence',
        confidence: sentiment.score,
        severity: 'high',
        recommendations: ['Reduce portfolio exposure', 'Implement stop-losses', 'Consider hedging strategies']
      })
    }
    
    return alerts
  }

  private generateVolatilityRecommendations(volatility: number, sentiment: MarketSentiment): string[] {
    const recommendations: string[] = []
    
    if (volatility > 20) {
      recommendations.push('Reduce position sizes to manage risk')
      recommendations.push('Increase cash allocation for opportunities')
    }
    
    if (sentiment.sentiment === 'negative') {
      recommendations.push('Consider volatility-based stop losses')
    }
    
    return recommendations
  }

  private generateConcentrationRecommendations(concentration: number, _sentiment: MarketSentiment): string[] {
    const recommendations: string[] = []
    
    if (concentration > 0.3) {
      recommendations.push('Diversify holdings across more assets')
      recommendations.push('Reduce allocation to top positions')
    }
    
    return recommendations
  }

  private generateCorrelationRiskRecommendations(correlation: number, _sentiment: MarketSentiment): string[] {
    const recommendations: string[] = []
    
    if (correlation > 0.7) {
      recommendations.push('Add uncorrelated or negatively correlated assets')
      recommendations.push('Consider alternative asset classes')
    }
    
    return recommendations
  }

  private generateTraderRecommendations(trader: any, _sentiment: MarketSentiment): string[] {
    const recommendations: string[] = []
    
    if (trader.sharpe < 1) {
      recommendations.push('Review trader risk management strategies')
    }
    
    if (trader.maxDrawdown < -15) {
      recommendations.push('Consider reducing allocation to this trader')
    }
    
    return recommendations
  }

  private determineSeverity(trend: string, sentiment: MarketSentiment): 'low' | 'medium' | 'high' {
    if (sentiment.sentiment === 'negative' && sentiment.score > 0.8) return 'high'
    if (trend === 'bearish') return 'medium'
    return 'low'
  }

  private determineTraderSeverity(trader: any, sentiment: MarketSentiment): 'low' | 'medium' | 'high' {
    if (trader.maxDrawdown < -20 || trader.sharpe < 0.5) return 'high'
    if (trader.winRate < 50 || sentiment.sentiment === 'negative') return 'medium'
    return 'low'
  }

  /**
   * Generate enhanced AI insights using advanced model when available
   */
  async generateEnhancedInsights(context: string, dataPoints: any[]): Promise<string> {
    if (this.useGeminiAsBackup && this.gemini) {
      try {
        const prompt = `You are an expert quantitative analyst providing trading insights. Analyze the following data and provide actionable insights:

Context: ${context}
Data Points: ${JSON.stringify(dataPoints.slice(-10))} // Last 10 points

Provide a concise, professional analysis focusing on:
1. Key patterns and trends
2. Risk factors to monitor
3. Specific actionable recommendations
4. Market timing considerations

Keep the response under 200 words and focus on practical trading insights.`

        const result = await this.gemini.generateContent(prompt)
        return result.response.text()
      } catch (error) {
        logger.warn('Enhanced AI analysis unavailable, using standard insights:', error)
      }
    }
    
    // Fallback to standard analysis
    return this.generateStandardInsight(context, dataPoints)
  }

  /**
   * Standard insight generation fallback
   */
  private generateStandardInsight(context: string, dataPoints: any[]): string {
    const recentTrend = dataPoints.length > 1 ? 
      (dataPoints[dataPoints.length - 1].price > dataPoints[0].price ? 'upward' : 'downward') : 'stable'
    
    return `Analysis of ${context} shows ${recentTrend} momentum. Based on recent price action and volume patterns, ` +
           `traders should monitor key support/resistance levels and consider risk management strategies. ` +
           `Current market conditions suggest cautious optimism with proper position sizing.`
  }

  /**
   * Enhanced correlation analysis using advanced AI
   */
  async generateCorrelationInsights(assets: string[], correlationData: number[][]): Promise<AnalyticsInsight> {
    const context = `correlation analysis for assets: ${assets.join(', ')}`
    const enhancedInsight = await this.generateEnhancedInsights(context, correlationData.flat().map((val, idx) => ({ correlation: val, index: idx })))
    
    return {
      type: 'correlation',
      insight: enhancedInsight,
      confidence: 0.85,
      severity: 'medium',
      recommendations: [
        'Monitor cross-asset correlations during market stress',
        'Consider portfolio diversification adjustments',
        'Implement dynamic hedging strategies based on correlation changes'
      ],
      metadata: { assets, correlationMatrix: correlationData }
    }
  }
}

export default AIAnalyticsService
export { AIAnalyticsService, AnalyticsInsight, MarketSentiment, TradingData }
