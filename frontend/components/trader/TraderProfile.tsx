"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Users, TrendingUp, Calendar, MapPin, ExternalLink } from "lucide-react"

interface TraderProfileProps {
  traderId: string
}

export function TraderProfile({ traderId }: TraderProfileProps) {
  // Mock data - in real app, fetch based on traderId
  const trader = {
    id: traderId,
    name: "CryptoKing",
    username: "@cryptoking",
    avatar: "CK",
    verified: true,
    country: "🇺🇸",
    joinDate: "Jan 2023",
    bio: "Professional DeFi trader with 5+ years experience. Specializing in yield farming and liquidity provision strategies.",
    followers: 2100,
    copiers: 450,
    totalTrades: 1247,
    monthlyReturn: 24.5,
    allTimeReturn: 156.8,
    maxDrawdown: -12.3,
    sharpeRatio: 1.8,
    winRate: 78,
    avgHoldTime: "2.5d",
    riskLevel: "Medium",
    strategy: ["DeFi", "Swing Trading", "Yield Farming"],
    socialLinks: {
      twitter: "https://twitter.com/cryptoking",
      telegram: "https://t.me/cryptoking",
    },
  }

  return (
    <div className="space-y-6">
      {/* Trader Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {trader.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{trader.name}</h1>
                  {trader.verified && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                  <Badge variant="secondary">Pro Trader</Badge>
                </div>
                <p className="text-muted-foreground">{trader.username}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {trader.country} United States
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {trader.joinDate}
                  </span>
                </div>
                <p className="text-sm max-w-md">{trader.bio}</p>
                <div className="flex gap-2">
                  <Button size="sm" asChild>
                    <a href={trader.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Twitter
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={trader.socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Telegram
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{trader.followers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{trader.copiers}</div>
                  <div className="text-sm text-muted-foreground">Copiers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{trader.totalTrades.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Trades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2.1y</div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  Follow Trader
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Copy Trades
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Return Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Return</span>
              <span className="font-semibold text-green-600">+{trader.monthlyReturn}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">All-time Return</span>
              <span className="font-semibold text-green-600">+{trader.allTimeReturn}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Best Month</span>
              <span className="font-semibold text-green-600">+42.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Worst Month</span>
              <span className="font-semibold text-red-600">-8.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Drawdown</span>
              <span className="font-semibold text-red-600">{trader.maxDrawdown}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sharpe Ratio</span>
              <span className="font-semibold">{trader.sharpeRatio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk Level</span>
              <Badge
                variant={
                  trader.riskLevel === "Low" ? "secondary" : trader.riskLevel === "Medium" ? "default" : "destructive"
                }
              >
                {trader.riskLevel}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VaR (95%)</span>
              <span className="font-semibold">-5.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trading Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Win Rate</span>
              <span className="font-semibold text-green-600">{trader.winRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Hold Time</span>
              <span className="font-semibold">{trader.avgHoldTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trades/Week</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Position</span>
              <span className="font-semibold">$2,450</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="trades">Trade History</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Interactive performance chart would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Strategy Description</h4>
                <p className="text-muted-foreground">
                  Focus on DeFi yield farming opportunities with systematic risk management. Primarily trades major DeFi
                  tokens with 2-5 day holding periods.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Strategy Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {trader.strategy.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Preferred Assets</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["APT", "USDC", "CAKE", "UNI"].map((asset) => (
                    <div key={asset} className="p-2 border rounded text-center text-sm">
                      {asset}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { date: "2024-01-15", action: "BUY", asset: "APT", price: "$8.45", size: "$2,100", pnl: "+$156" },
                  { date: "2024-01-14", action: "SELL", asset: "CAKE", price: "$2.34", size: "$1,800", pnl: "+$89" },
                  { date: "2024-01-13", action: "BUY", asset: "UNI", price: "$6.78", size: "$2,500", pnl: "-$45" },
                ].map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-4">
                      <Badge variant={trade.action === "BUY" ? "default" : "secondary"}>{trade.action}</Badge>
                      <span className="font-medium">{trade.asset}</span>
                      <span className="text-muted-foreground">{trade.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{trade.price}</span>
                      <span>{trade.size}</span>
                      <span className={trade.pnl.startsWith("+") ? "text-green-600" : "text-red-600"}>{trade.pnl}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Follower Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Follower Growth</h4>
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Growth chart</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Average Allocation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mean</span>
                      <span className="font-semibold">$1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Median</span>
                      <span className="font-semibold">$800</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Range</span>
                      <span className="font-semibold">$100 - $10,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Risk Controls</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stop Loss Usage</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Position Size</span>
                      <span className="font-semibold">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Diversification</span>
                      <span className="font-semibold">High</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Correlation Analysis</h4>
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Correlation matrix</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
