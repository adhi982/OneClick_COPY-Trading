"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, Users, Star } from "lucide-react"

const topTraders = [
  {
    id: 1,
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    roi: "+45.2%",
    followers: 1250,
    winRate: "78%",
    totalTrades: 156,
    isFollowing: false,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    roi: "+38.7%",
    followers: 980,
    winRate: "82%",
    totalTrades: 134,
    isFollowing: true,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    roi: "+32.1%",
    followers: 756,
    winRate: "75%",
    totalTrades: 189,
    isFollowing: false,
    rating: 4.6,
  },
]

export function TopTraders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Top Performing Traders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topTraders.map((trader) => (
            <div
              key={trader.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={trader.avatar || "/placeholder.svg"} alt={trader.name} />
                  <AvatarFallback>
                    {trader.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{trader.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground ml-1">{trader.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {trader.followers}
                    </div>
                    <span>Win Rate: {trader.winRate}</span>
                    <span>{trader.totalTrades} trades</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{trader.roi}</div>
                  <div className="text-xs text-muted-foreground">30d ROI</div>
                </div>

                <Button variant={trader.isFollowing ? "secondary" : "default"} size="sm">
                  {trader.isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
