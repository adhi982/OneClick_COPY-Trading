"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, Users, Target } from "lucide-react"

interface TopPerformer {
  id: string
  name: string
  avatar: string
  verified: boolean
  performance: {
    totalReturn: number
    winRate: number
    followers: number
    trades: number
  }
  change24h: number
}

export function TopPerformers() {
  const topPerformers: TopPerformer[] = [
    {
      id: "1",
      name: "CryptoKing",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      performance: { totalReturn: 245.8, winRate: 87, followers: 2450, trades: 156 },
      change24h: 12.5,
    },
    {
      id: "2",
      name: "TradeMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      performance: { totalReturn: 198.3, winRate: 82, followers: 1890, trades: 203 },
      change24h: 8.3,
    },
    {
      id: "3",
      name: "AlgoTrader",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
      performance: { totalReturn: 167.9, winRate: 79, followers: 1234, trades: 89 },
      change24h: 15.2,
    },
  ]

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
      <div className="space-y-4">
        {topPerformers.map((performer, index) => (
          <div key={performer.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-medium">
                {index + 1}
              </div>

              <Avatar className="h-8 w-8">
                <AvatarImage src={performer.avatar || "/placeholder.svg"} alt={performer.name} />
                <AvatarFallback>{performer.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-sm">{performer.name}</h4>
                  {performer.verified && (
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{performer.performance.followers}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-3 w-3" />
                    <span>{performer.performance.winRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-sm font-medium text-green-600">+{performer.performance.totalReturn}%</span>
              </div>
              <p className="text-xs text-muted-foreground">+{performer.change24h}% today</p>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm">
        View All Performers
      </Button>
    </Card>
  )
}
