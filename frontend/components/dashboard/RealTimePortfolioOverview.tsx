"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Activity, Zap, Users, BarChart3 } from "lucide-react"
import { useRealTimeData } from "@/hooks/use-realtime-data"
import { useWalletConnection } from "@/hooks/use-wallet-connection"

export function RealTimePortfolioOverview() {
  const { connected, address } = useWalletConnection()
  const {
    connectionStatus, 
    portfolioData, 
    tradeUpdates, 
    positionUpdates,
    refreshPortfolio,
    subscribeToMarketData,
    subscribeToTrader 
  } = useRealTimeData()

  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null)
  
  // Fixed wallet address for demo
  const targetWallet = '0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260'

  useEffect(() => {
    // Force connection regardless of wallet status since we're using a fixed wallet
    console.log('🔗 Forcing WebSocket connection...')
    
    // Subscribe to the correct trader wallet
    console.log('🔗 Subscribing to trader:', targetWallet)
    subscribeToTrader(targetWallet)
    
    // Subscribe to relevant market data
    subscribeToMarketData(['APT/USDC', 'BTC/USDC', 'ETH/USDC'])
    
    // Refresh portfolio data
    refreshPortfolio()
  }, [targetWallet, subscribeToTrader, subscribeToMarketData, refreshPortfolio])

  useEffect(() => {
    if (portfolioData) {
      setLastUpdateTime(new Date())
    }
  }, [portfolioData])

  // Mock data if no real data available
  const defaultPortfolio = {
    totalValue: 0,
    totalPnL: 0,
    activePositions: 0,
    dailyChange: 0,
    positions: []
  }

  const portfolio = portfolioData || defaultPortfolio
  const recentTrades = tradeUpdates.slice(0, 5)
  const recentPositions = positionUpdates.slice(0, 3)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatAPT = (value: number) => {
    return `${value.toFixed(6)} APT`
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  if (!connected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p>Connect your wallet to view real-time portfolio data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${connectionStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {connectionStatus.connected ? ' Live Data Stream' : ' Disconnected'}
          </span>
          {lastUpdateTime && (
            <span className="text-xs text-muted-foreground">
              Last update: {lastUpdateTime.toLocaleTimeString()}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshPortfolio}
          disabled={!connectionStatus.connected}
        >
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total APT Balance</p>
                <p className="text-2xl font-bold">{formatAPT(portfolio.aptBalance || 0)}</p>
                <p className="text-xs text-muted-foreground">
                  ≈ {formatCurrency((portfolio.aptBalance || 0) * (portfolio.aptPriceUSD || 8.5))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              {portfolio.totalPnL >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-2xl font-bold ${portfolio.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatAPT((portfolio.totalPnL || 0) / (portfolio.aptPriceUSD || 8.5))}
                </p>
                <p className="text-xs text-muted-foreground">All time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Vault Balance</p>
                <p className="text-2xl font-bold">{formatAPT(portfolio.vaultBalance || 0)}</p>
                <p className="text-xs text-muted-foreground">Copy trading vault</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              {portfolio.dailyChange >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Daily Change</p>
                <p className={`text-2xl font-bold ${portfolio.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(portfolio.dailyChange)}
                </p>
                <p className="text-xs text-muted-foreground">24h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      {recentTrades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Recent Trades
              <Badge variant="secondary" className="ml-2">
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTrades.map((trade, index) => (
                <div
                  key={`${trade.data.traderId}-${trade.timestamp}-${index}`}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${trade.data.side === 'buy' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-medium">{trade.data.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        Trader: {trade.data.traderId.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {trade.data.side.toUpperCase()} {trade.data.amount.toFixed(4)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${trade.data.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${trade.data.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(trade.data.pnl)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Positions */}
      {portfolio.positions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Current Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {portfolio.positions.map((position: any, index: number) => (
                <div
                  key={`${position.symbol}-${index}`}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{position.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      Amount: {formatAPT(position.amount || 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatAPT((position.currentValue || 0) / (portfolio.aptPriceUSD || 8.5))}</p>
                    <p className={`text-sm ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatAPT((position.pnl || 0) / (portfolio.aptPriceUSD || 8.5))} ({formatPercentage(position.pnlPercentage || 0)})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Position Updates */}
      {recentPositions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Position Updates
              <Badge variant="secondary" className="ml-2">
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPositions.map((update, index) => (
                <div
                  key={`${update.data.positionId}-${update.timestamp}-${index}`}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant={update.data.status === 'open' ? 'default' : 'secondary'}>
                      {update.data.status}
                    </Badge>
                    <div>
                      <p className="font-medium">{update.data.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        Amount: {update.data.amount.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(update.data.currentValue)}</p>
                    <p className={`text-sm ${update.data.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(update.data.pnl)} ({formatPercentage(update.data.pnlPercentage)})
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {recentTrades.length === 0 && recentPositions.length === 0 && portfolio.positions.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
              <p>Start following traders to see real-time activity here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
