"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react"
import { useRealTimeData } from "@/hooks/use-realtime-data"
import { Button } from "@/components/ui/button"

export function MarketDataDashboard() {
  const { 
    connectionStatus, 
    marketData,
    subscribeToMarketData 
  } = useRealTimeData()

  // Subscribe to market data on component mount
  useEffect(() => {
    if (connectionStatus.connected) {
      subscribeToMarketData(['APT', 'BTC', 'ETH', 'USDC', 'USDT'])
    }
  }, [connectionStatus.connected, subscribeToMarketData])

  const formatPrice = (price: number) => {
    if (price === 0) return '0.00'
    if (price < 1) return price.toFixed(6)
    if (price < 100) return price.toFixed(4)
    return price.toFixed(2)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const marketSymbols = ['APT', 'BTC', 'ETH', 'USDC', 'USDT']

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Real-Time Market Data
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${connectionStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {connectionStatus.connected ? 'Live' : 'Disconnected'}
            </span>
            <Badge variant="outline" className="text-xs">
              CoinAPI
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketSymbols.map((symbol) => {
            const data = marketData.get(symbol)
            const price = data?.price || 0
            const change24h = data?.change24h || 0
            const lastUpdated = data?.lastUpdated

            return (
              <div
                key={symbol}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-sm">{symbol}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{symbol}</h3>
                    <p className="text-sm text-muted-foreground">
                      {symbol === 'APT' ? 'Aptos' : 
                       symbol === 'BTC' ? 'Bitcoin' : 
                       symbol === 'ETH' ? 'Ethereum' : 
                       symbol === 'USDC' ? 'USD Coin' : 
                       'Tether USD'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">
                      ${formatPrice(price)}
                    </span>
                    {change24h !== 0 && (
                      <div className={`flex items-center space-x-1 ${change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change24h >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {formatPercentage(change24h)}
                        </span>
                      </div>
                    )}
                  </div>
                  {lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated: {new Date(lastUpdated).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {marketData.size === 0 && connectionStatus.connected && (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
              <p>Loading market data...</p>
            </div>
          )}

          {!connectionStatus.connected && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Connecting to real-time data...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
