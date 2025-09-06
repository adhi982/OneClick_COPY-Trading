"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Trophy, Medal, Award } from "lucide-react"

interface LeaderboardEntry {
  id: string
  rank: number
  trader: {
    name: string
    avatar: string
    verified: boolean
  }
  performance: {
    totalReturn: number
    winRate: number
    followers: number
    trades: number
  }
  change: number
}

export function Leaderboard() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month")

  const leaderboardData: LeaderboardEntry[] = [
    {
      id: "1",
      rank: 1,
      trader: { name: "CryptoKing", avatar: "/placeholder.svg?height=40&width=40", verified: true },
      performance: { totalReturn: 245.8, winRate: 87, followers: 2450, trades: 156 },
      change: 2,
    },
    {
      id: "2",
      rank: 2,
      trader: { name: "TradeMaster", avatar: "/placeholder.svg?height=40&width=40", verified: true },
      performance: { totalReturn: 198.3, winRate: 82, followers: 1890, trades: 203 },
      change: -1,
    },
    {
      id: "3",
      rank: 3,
      trader: { name: "AlgoTrader", avatar: "/placeholder.svg?height=40&width=40", verified: false },
      performance: { totalReturn: 167.9, winRate: 79, followers: 1234, trades: 89 },
      change: 1,
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Top Traders</h2>
        <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {leaderboardData.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8">{getRankIcon(entry.rank)}</div>

              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.trader.avatar || "/placeholder.svg"} alt={entry.trader.name} />
                <AvatarFallback>{entry.trader.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{entry.trader.name}</h4>
                  {entry.trader.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {entry.performance.followers.toLocaleString()} followers
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="font-semibold text-green-600">+{entry.performance.totalReturn}%</p>
                <p className="text-sm text-muted-foreground">{entry.performance.winRate}% win rate</p>
              </div>

              <div className="flex items-center space-x-1">
                {entry.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm ${entry.change > 0 ? "text-green-600" : "text-red-600"}`}>
                  {Math.abs(entry.change)}
                </span>
              </div>

              <Button size="sm">Follow</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
