"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Target,
  Shield,
  Activity,
  PieChart,
  LineChart,
  AlertTriangle,
  Brain,
  Lightbulb,
  RefreshCw,
  Bot,
  Zap,
  Eye,
  TrendingUpIcon
} from "lucide-react"

// Types for AI Analytics
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

interface AIAnalysisData {
  insights: AnalyticsInsight[]
  sentiment?: MarketSentiment
  signals?: string[]
  alerts?: AnalyticsInsight[]
  timestamp: string
  loading: boolean
}

export default function EnhancedAnalyticsDashboard() {
  // Get backend URL from environment or default to localhost:5001
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
  const [dateRange, setDateRange] = useState("3M")
  const [reportType, setReportType] = useState("performance")
  const [activeTab, setActiveTab] = useState("performance")
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, AIAnalysisData>>({
    performance: { insights: [], loading: false, timestamp: '' },
    risk: { insights: [], loading: false, timestamp: '' },
    attribution: { insights: [], loading: false, timestamp: '' },
    correlation: { insights: [], loading: false, timestamp: '' }
  })
  const [realtimeData, setRealtimeData] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Sample data (in production, this would come from your API)
  const performanceMetrics = {
    totalReturn: 24.8,
    annualizedReturn: 18.5,
    sharpeRatio: 1.24,
    maxDrawdown: -8.2,
    winRate: 68.5,
    avgTradeDuration: "4.2 days",
    volatility: 15.2,
    beta: 0.85,
  }

  const riskMetrics = {
    var95: -2.8,
    expectedShortfall: -4.2,
    portfolioVolatility: 15.2,
    concentrationRisk: "Medium",
    liquidityRisk: "Low",
    correlationRisk: "High",
    concentration: 0.28,
    avgCorrelation: 0.65
  }

  const traderPerformance = [
    {
      name: "CryptoKing",
      allocation: 35,
      returns: 28.5,
      sharpe: 1.45,
      maxDrawdown: -6.2,
      trades: 45,
      winRate: 72,
      contribution: 8.2,
    },
    {
      name: "EthMaster",
      allocation: 25,
      returns: 15.2,
      sharpe: 0.98,
      maxDrawdown: -12.1,
      trades: 32,
      winRate: 65,
      contribution: 3.8,
    },
    {
      name: "SolanaWhale",
      allocation: 20,
      returns: 32.1,
      sharpe: 1.67,
      maxDrawdown: -4.8,
      trades: 28,
      winRate: 78,
      contribution: 6.4,
    },
    {
      name: "DeFiExpert",
      allocation: 20,
      returns: 18.9,
      sharpe: 1.12,
      maxDrawdown: -9.5,
      trades: 38,
      winRate: 63,
      contribution: 3.8,
    },
  ]

  const assetCorrelation = [
    { asset1: "BTC", asset2: "ETH", correlation: 0.85 },
    { asset1: "BTC", asset2: "SOL", correlation: 0.72 },
    { asset1: "BTC", asset2: "ADA", correlation: 0.68 },
    { asset1: "ETH", asset2: "SOL", correlation: 0.79 },
    { asset1: "ETH", asset2: "ADA", correlation: 0.74 },
    { asset1: "SOL", asset2: "ADA", correlation: 0.65 },
  ]

  // Sample trading data for AI analysis
  const sampleTradingData = [
    { price: 45000, volume: 1200000, timestamp: new Date(), symbol: "BTC", change: 2.5 },
    { price: 2800, volume: 800000, timestamp: new Date(), symbol: "ETH", change: 3.2 },
    { price: 95, volume: 450000, timestamp: new Date(), symbol: "SOL", change: -1.8 },
    { price: 0.52, volume: 320000, timestamp: new Date(), symbol: "ADA", change: 4.1 },
  ]

  // AI Analytics API calls
  const analyzePerformance = async () => {
    setAiAnalysis(prev => ({
      ...prev,
      performance: { ...prev.performance, loading: true }
    }))

    try {
      const response = await fetch(`${BACKEND_URL}/api/analytics/performance-insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradingData: sampleTradingData })
      })

      if (response.ok) {
        const data = await response.json()
        setAiAnalysis(prev => ({
          ...prev,
          performance: {
            insights: data.insights,
            loading: false,
            timestamp: data.timestamp
          }
        }))
      }
    } catch (error) {
      console.error('Error analyzing performance:', error)
      setAiAnalysis(prev => ({
        ...prev,
        performance: { ...prev.performance, loading: false }
      }))
    }
  }

  const analyzeRisk = async () => {
    setAiAnalysis(prev => ({
      ...prev,
      risk: { ...prev.risk, loading: true }
    }))

    try {
      const response = await fetch(`${BACKEND_URL}/api/analytics/risk-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          portfolioData: {
            ...riskMetrics,
            volatility: performanceMetrics.volatility
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiAnalysis(prev => ({
          ...prev,
          risk: {
            insights: data.insights,
            loading: false,
            timestamp: data.timestamp
          }
        }))
      }
    } catch (error) {
      console.error('Error analyzing risk:', error)
      setAiAnalysis(prev => ({
        ...prev,
        risk: { ...prev.risk, loading: false }
      }))
    }
  }

  const analyzeAttribution = async () => {
    setAiAnalysis(prev => ({
      ...prev,
      attribution: { ...prev.attribution, loading: true }
    }))

    try {
      const response = await fetch(`${BACKEND_URL}/api/analytics/attribution-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traderData: traderPerformance })
      })

      if (response.ok) {
        const data = await response.json()
        setAiAnalysis(prev => ({
          ...prev,
          attribution: {
            insights: data.insights,
            loading: false,
            timestamp: data.timestamp
          }
        }))
      }
    } catch (error) {
      console.error('Error analyzing attribution:', error)
      setAiAnalysis(prev => ({
        ...prev,
        attribution: { ...prev.attribution, loading: false }
      }))
    }
  }

  const analyzeCorrelation = async () => {
    setAiAnalysis(prev => ({
      ...prev,
      correlation: { ...prev.correlation, loading: true }
    }))

    try {
      const response = await fetch(`${BACKEND_URL}/api/analytics/correlation-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correlationData: assetCorrelation })
      })

      if (response.ok) {
        const data = await response.json()
        setAiAnalysis(prev => ({
          ...prev,
          correlation: {
            insights: data.insights,
            loading: false,
            timestamp: data.timestamp
          }
        }))
      }
    } catch (error) {
      console.error('Error analyzing correlation:', error)
      setAiAnalysis(prev => ({
        ...prev,
        correlation: { ...prev.correlation, loading: false }
      }))
    }
  }

  const analyzeRealTimeMarket = async () => {
    setIsAnalyzing(true)
    
    try {
      const marketData = {
        price: 45200,
        volume: 1350000,
        change: 2.8,
        trend: 'bullish',
        momentum: 0.15,
        avgVolume: 1100000
      }

      const response = await fetch(`${BACKEND_URL}/api/analytics/realtime-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketData })
      })

      if (response.ok) {
        const data = await response.json()
        setRealtimeData(data.analysis)
      }
    } catch (error) {
      console.error('Error analyzing real-time market:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Auto-refresh real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnalyzing) {
        analyzeRealTimeMarket()
      }
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [isAnalyzing])

  // Initial analysis on component mount
  useEffect(() => {
    analyzePerformance()
    analyzeRisk()
    analyzeAttribution()
    analyzeCorrelation()
    analyzeRealTimeMarket()
  }, [])

  // Trigger analysis when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'performance':
        if (!aiAnalysis.performance.insights.length) analyzePerformance()
        break
      case 'risk':
        if (!aiAnalysis.risk.insights.length) analyzeRisk()
        break
      case 'attribution':
        if (!aiAnalysis.attribution.insights.length) analyzeAttribution()
        break
      case 'correlation':
        if (!aiAnalysis.correlation.insights.length) analyzeCorrelation()
        break
    }
  }, [activeTab])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const renderAIInsights = (insights: AnalyticsInsight[], loading: boolean) => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )
    }

    if (!insights.length) {
      return (
        <Alert>
          <Bot className="h-4 w-4" />
          <AlertTitle>AI Analysis</AlertTitle>
          <AlertDescription>
            No AI insights available. Click refresh to generate new analysis.
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-blue-600" />
                  AI Insight #{index + 1}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={getSeverityBadgeVariant(insight.severity)}>
                    {insight.severity}
                  </Badge>
                  <Badge variant="outline">
                    {(insight.confidence * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-3">{insight.insight}</p>
              
              {insight.recommendations.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    AI Recommendations:
                  </h4>
                  <ul className="text-xs space-y-1">
                    {insight.recommendations.map((rec, recIndex) => (
                      <li key={recIndex} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with AI Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Brain className="h-8 w-8 mr-3 text-blue-600" />
            AI-Powered Analytics & Reports
          </h1>
          <p className="text-muted-foreground">
            Advanced performance insights powered by DistilBERT AI analysis
          </p>
          {realtimeData?.sentiment && (
            <div className="flex items-center mt-2 space-x-4">
              <Badge 
                variant={realtimeData.sentiment.sentiment === 'positive' ? 'default' : 
                        realtimeData.sentiment.sentiment === 'negative' ? 'destructive' : 'secondary'}
                className="flex items-center"
              >
                <Bot className="h-3 w-3 mr-1" />
                Market Sentiment: {realtimeData.sentiment.sentiment}
              </Badge>
              <span className="text-sm text-gray-600">
                Confidence: {(realtimeData.sentiment.confidence * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={analyzeRealTimeMarket}
            disabled={isAnalyzing}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Refresh AI'}
          </Button>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time AI Alerts */}
      {realtimeData?.alerts && realtimeData.alerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Real-time AI Alerts
          </AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              {realtimeData.alerts.map((alert: AnalyticsInsight, index: number) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{alert.insight}</span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* AI Trading Signals */}
      {realtimeData?.signals && realtimeData.signals.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <TrendingUpIcon className="h-5 w-5 mr-2" />
              AI Trading Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {realtimeData.signals.map((signal: string, index: number) => (
                <div key={index} className="flex items-center p-2 bg-white rounded border border-blue-100">
                  <Eye className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">{signal}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Overview with AI Enhancement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Bot className="h-4 w-4 text-blue-500" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Return</p>
                <p className="text-2xl font-bold text-green-600">+{performanceMetrics.totalReturn}%</p>
                {realtimeData?.sentiment && (
                  <p className="text-xs text-gray-500 mt-1">
                    AI: {realtimeData.sentiment.sentiment} outlook
                  </p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Bot className="h-4 w-4 text-blue-500" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                <p className="text-2xl font-bold">{performanceMetrics.sharpeRatio}</p>
                <p className="text-xs text-gray-500 mt-1">AI: Risk-adjusted optimal</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Bot className="h-4 w-4 text-blue-500" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-600">{performanceMetrics.maxDrawdown}%</p>
                <p className="text-xs text-gray-500 mt-1">AI: Within safe limits</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Bot className="h-4 w-4 text-blue-500" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics.winRate}%</p>
                <p className="text-xs text-gray-500 mt-1">AI: Above market average</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traditional Performance Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Return Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <div>Performance Chart</div>
                    <div className="text-sm">Time-weighted vs Money-weighted returns</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{performanceMetrics.annualizedReturn}%</div>
                    <div className="text-sm text-muted-foreground">Annualized Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{performanceMetrics.volatility}%</div>
                    <div className="text-sm text-muted-foreground">Volatility</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-600" />
                    AI Performance Insights
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={analyzePerformance}
                    disabled={aiAnalysis.performance.loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${aiAnalysis.performance.loading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Real-time AI analysis using DistilBERT model
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderAIInsights(aiAnalysis.performance.insights, aiAnalysis.performance.loading)}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk-Adjusted Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sharpe Ratio</span>
                  <span className="font-semibold">{performanceMetrics.sharpeRatio}</span>
                </div>
                <Progress value={performanceMetrics.sharpeRatio * 50} />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Information Ratio</span>
                  <span className="font-semibold">1.08</span>
                </div>
                <Progress value={54} />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Sortino Ratio</span>
                  <span className="font-semibold">1.67</span>
                </div>
                <Progress value={83.5} />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Calmar Ratio</span>
                  <span className="font-semibold">2.26</span>
                </div>
                <Progress value={90} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traditional Risk Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Value at Risk (95%)</span>
                    <span className="font-semibold text-red-600">{riskMetrics.var95}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expected Shortfall</span>
                    <span className="font-semibold text-red-600">{riskMetrics.expectedShortfall}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Portfolio Volatility</span>
                    <span className="font-semibold">{riskMetrics.portfolioVolatility}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Beta</span>
                    <span className="font-semibold">{performanceMetrics.beta}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-red-600" />
                    AI Risk Analysis
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={analyzeRisk}
                    disabled={aiAnalysis.risk.loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${aiAnalysis.risk.loading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Advanced risk assessment using AI models
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderAIInsights(aiAnalysis.risk.insights, aiAnalysis.risk.loading)}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Concentration Risk</span>
                  <Badge variant="default">{riskMetrics.concentrationRisk}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Liquidity Risk</span>
                  <Badge variant="secondary">{riskMetrics.liquidityRisk}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Correlation Risk</span>
                  <Badge variant="destructive">{riskMetrics.correlationRisk}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traditional Attribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Attribution by Trader</CardTitle>
                <CardDescription>Contribution of each trader to overall portfolio performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trader</TableHead>
                      <TableHead>Returns</TableHead>
                      <TableHead>Contribution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {traderPerformance.slice(0, 3).map((trader, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{trader.name}</TableCell>
                        <TableCell className="text-green-600">+{trader.returns}%</TableCell>
                        <TableCell className="font-semibold">+{trader.contribution}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* AI Attribution Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    AI Attribution Analysis
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={analyzeAttribution}
                    disabled={aiAnalysis.attribution.loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${aiAnalysis.attribution.loading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Intelligent trader performance evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderAIInsights(aiAnalysis.attribution.insights, aiAnalysis.attribution.loading)}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traditional Correlation Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Correlation Matrix</CardTitle>
                <CardDescription>Correlation coefficients between different assets in your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assetCorrelation.slice(0, 4).map((corr, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">{corr.asset1}</span>
                        <span className="text-muted-foreground">↔</span>
                        <span className="font-medium">{corr.asset2}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Progress value={corr.correlation * 100} className="w-24" />
                        <span className="font-semibold w-12 text-right">{corr.correlation}</span>
                        <Badge
                          variant={
                            corr.correlation > 0.8 ? "destructive" : corr.correlation > 0.6 ? "default" : "secondary"
                          }
                        >
                          {corr.correlation > 0.8 ? "High" : corr.correlation > 0.6 ? "Medium" : "Low"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Correlation Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-orange-600" />
                    AI Correlation Analysis
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={analyzeCorrelation}
                    disabled={aiAnalysis.correlation.loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${aiAnalysis.correlation.loading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Smart diversification insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderAIInsights(aiAnalysis.correlation.insights, aiAnalysis.correlation.loading)}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
export { EnhancedAnalyticsDashboard }
