"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, Star, Activity, Eye, EyeOff } from "lucide-react"
import { useRealTimeData } from "@/hooks/use-realtime-data"

interface TraderCardProps {
  trader: {
    id: string
    name: string
    username: string
    avatar: string
    verified: boolean
    monthlyReturn: number
    followers: number
    riskLevel: string
    winRate: number
    sharpeRatio: number
    avgHoldTime: string
    lastActive: string
    strategy: string[]
    performance: number[]
  }
  isFollowing?: boolean
  onFollow?: (traderId: string) => void
  onUnfollow?: (traderId: string) => void
}

export function RealTimeTraderCard({ trader, isFollowing = false, onFollow, onUnfollow }: TraderCardProps) {
  const { 
    connectionStatus, 
    subscribedTraders, 
    traderPerformance,
    subscribeToTrader, 
    unsubscribeFromTrader,
    getTraderPerformanceData 
  } = useRealTimeData()

  const [isSubscribed, setIsSubscribed] = useState(false)
  const [realTimeData, setRealTimeData] = useState<any>(null)

  useEffect(() => {
    setIsSubscribed(subscribedTraders.includes(trader.id))
  }, [subscribedTraders, trader.id])

  useEffect(() => {
    const performanceData = getTraderPerformanceData(trader.id)
    if (performanceData) {
      setRealTimeData(performanceData)
    }
  }, [traderPerformance, trader.id, getTraderPerformanceData])

  const handleSubscribe = () => {
    if (isSubscribed) {
      unsubscribeFromTrader(trader.id)
    } else {
      subscribeToTrader(trader.id)
    }
  }

  const handleFollow = () => {
    if (isFollowing) {
      onUnfollow?.(trader.id)
    } else {
      onFollow?.(trader.id)
    }
  }

  // Use real-time data if available, otherwise use static data
  const displayData = realTimeData || {
    totalPnL: trader.monthlyReturn,
    winRate: trader.winRate,
    totalTrades: 0,
    sharpeRatio: trader.sharpeRatio,
    maxDrawdown: 0,
    riskScore: trader.riskLevel === 'Low' ? 3 : trader.riskLevel === 'Medium' ? 5 : 8
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 3) return 'text-green-600'
    if (riskScore <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRiskLevel = (riskScore: number) => {
    if (riskScore <= 3) return 'Low'
    if (riskScore <= 6) return 'Medium'
    return 'High'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={trader.name} />
              <AvatarFallback>{trader.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{trader.name}</h3>
                {trader.verified && (
                  <Badge variant="secondary" className="text-xs">
                    ✓ Verified
                  </Badge>
                )}
                {isSubscribed && connectionStatus.connected && (
                  <Badge variant="outline" className="text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    Live
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{trader.username}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSubscribe}
            disabled={!connectionStatus.connected}
            className="flex items-center space-x-1"
          >
            {isSubscribed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{isSubscribed ? 'Unwatch' : 'Watch'}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Return</span>
              <span className={`font-semibold ${displayData.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(displayData.totalPnL)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Win Rate</span>
              <span className="font-semibold">{displayData.winRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
              <span className="font-semibold">{displayData.sharpeRatio.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Followers</span>
              <span className="font-semibold">{trader.followers.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Trades</span>
              <span className="font-semibold">{displayData.totalTrades || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Risk Level</span>
              <span className={`font-semibold ${getRiskColor(displayData.riskScore)}`}>
                {getRiskLevel(displayData.riskScore)}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risk Score</span>
            <span className="text-sm font-medium">{displayData.riskScore}/10</span>
          </div>
          <Progress value={displayData.riskScore * 10} className="h-2" />
        </div>

        {/* Strategy Tags */}
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Strategy</span>
          <div className="flex flex-wrap gap-1">
            {trader.strategy.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Real-time Activity Indicator */}
        {realTimeData && (
          <div className="flex items-center space-x-2 pt-2 border-t border-border">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">
              Real-time data updated
            </span>
            <span className="text-xs text-green-600">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4">
          <Button
            onClick={handleFollow}
            className="flex-1"
            variant={isFollowing ? "secondary" : "default"}
          >
            {isFollowing ? (
              <>
                <Users className="h-4 w-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Follow
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4" />
          </Button>
        </div>

        {/* Last Activity */}
        <div className="text-xs text-muted-foreground text-center">
          Last active: {trader.lastActive}
        </div>
      </CardContent>
    </Card>
  )
}
