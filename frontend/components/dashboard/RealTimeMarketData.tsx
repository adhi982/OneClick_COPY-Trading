"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react"
import { useRealTimeData } from "@/hooks/use-realtime-data"

interface MarketDataCardProps {
  symbol: string
  className?: string
}

export function RealTimeMarketData({ symbol, className }: MarketDataCardProps) {
  const { 
    connectionStatus, 
    marketData, 
    subscribeToMarketData,
    getLatestPrice 
  } = useRealTimeData()

  const [isSubscribed, setIsSubscribed] = useState(false)
  const [priceHistory, setPriceHistory] = useState<number[]>([])

  useEffect(() => {
    if (connectionStatus.connected && !isSubscribed) {
      subscribeToMarketData([symbol])
      setIsSubscribed(true)
    }
  }, [connectionStatus.connected, symbol, subscribeToMarketData, isSubscribed])

  useEffect(() => {
    const currentPrice = getLatestPrice(symbol)
    if (currentPrice !== null) {
      setPriceHistory(prev => [currentPrice, ...prev.slice(0, 19)]) // Keep last 20 prices
    }
  }, [marketData, symbol, getLatestPrice])

  const currentMarketData = marketData.get(symbol)
  const currentPrice = currentMarketData?.price || 0
  const change24h = currentMarketData?.change24h || 0
  const volume24h = currentMarketData?.volume24h || 0
  const lastUpdated = currentMarketData?.lastUpdated || null

  const formatPrice = (price: number) => {
    if (price === 0) return '0.00'
    if (price < 1) return price.toFixed(6)
    if (price < 100) return price.toFixed(4)
    return price.toFixed(2)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`
    return `$${volume.toFixed(0)}`
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const getSparklineData = () => {
    if (priceHistory.length < 2) return []
    
    const minPrice = Math.min(...priceHistory)
    const maxPrice = Math.max(...priceHistory)
    const range = maxPrice - minPrice
    
    if (range === 0) return priceHistory.map(() => 50)
    
    return priceHistory.map(price => ((price - minPrice) / range) * 100)
  }

  const sparklineData = getSparklineData()
  const isPositive = change24h >= 0

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{symbol}</CardTitle>
          <div className="flex items-center space-x-2">
            {connectionStatus.connected && isSubscribed && (
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                Live
              </Badge>
            )}
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Price */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">
              ${formatPrice(currentPrice)}
            </span>
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(change24h)}
            </span>
          </div>
          
          {currentMarketData && (
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(currentMarketData.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Price Sparkline */}
        {sparklineData.length > 1 && (
          <div className="relative h-16 w-full">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              className="absolute inset-0"
            >
              <polyline
                fill="none"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth="2"
                points={sparklineData
                  .map((value, index) => 
                    `${(index / (sparklineData.length - 1)) * 100},${100 - value}`
                  )
                  .join(' ')}
              />
            </svg>
          </div>
        )}

        {/* 24h Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Price</span>
              <span className="font-medium">${formatPrice(currentPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Change</span>
              <span className={`font-medium ${change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change24h.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Volume</span>
              <span className="font-medium">{formatVolume(volume24h)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium">
                {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Connection Status Indicator */}
        {!connectionStatus.connected && (
          <div className="flex items-center justify-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Activity className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-700 dark:text-yellow-400">
              Reconnecting to live data...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RealTimeMarketOverview() {
  const [selectedSymbols] = useState(['APT/USDC', 'BTC/USDC', 'ETH/USDC', 'SOL/USDC'])
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Market Overview</h2>
          <p className="text-muted-foreground">Real-time cryptocurrency prices and data</p>
        </div>
        <Badge variant="outline" className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Live Data</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedSymbols.map((symbol) => (
          <RealTimeMarketData 
            key={symbol} 
            symbol={symbol}
          />
        ))}
      </div>
    </div>
  )
}
