"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, Filter, Grid, List, Star } from "lucide-react"
import Link from "next/link"

const mockTraders = [
  {
    id: "1",
    name: "CryptoKing",
    username: "@cryptoking",
    avatar: "CK",
    verified: true,
    monthlyReturn: 24.5,
    followers: 2100,
    riskLevel: "Medium",
    winRate: 78,
    sharpeRatio: 1.8,
    avgHoldTime: "2.5d",
    lastActive: "2h ago",
    strategy: ["DeFi", "Swing Trading"],
    performance: [65, 72, 68, 75, 82, 78, 85, 88, 92, 89, 94, 96],
  },
  {
    id: "2",
    name: "DeFiMaster",
    username: "@defimaster",
    avatar: "DM",
    verified: true,
    monthlyReturn: 19.8,
    followers: 1800,
    riskLevel: "Low",
    winRate: 85,
    sharpeRatio: 2.1,
    avgHoldTime: "5.2d",
    lastActive: "1h ago",
    strategy: ["DeFi", "Long-term"],
    performance: [60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88],
  },
  {
    id: "3",
    name: "AptosWhale",
    username: "@aptoswhale",
    avatar: "AW",
    verified: false,
    monthlyReturn: 31.2,
    followers: 3200,
    riskLevel: "High",
    winRate: 65,
    sharpeRatio: 1.4,
    avgHoldTime: "1.2d",
    lastActive: "30m ago",
    strategy: ["Scalping", "High Frequency"],
    performance: [50, 55, 48, 62, 58, 75, 82, 78, 95, 88, 102, 115],
  },
]

export function TraderDiscovery() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("top-rated")
  const [minReturn, setMinReturn] = useState([0])
  const [maxDrawdown, setMaxDrawdown] = useState([50])
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Discover Top Traders</h1>
          <p className="text-muted-foreground">Browse and follow successful traders to copy their strategies</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name, strategy, or asset"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top-rated">Top Rated</SelectItem>
            <SelectItem value="highest-returns">Highest Returns</SelectItem>
            <SelectItem value="most-followers">Most Followers</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Performance Filters */}
            <div>
              <Label className="text-sm font-medium">Minimum Monthly Return</Label>
              <div className="mt-2">
                <Slider value={minReturn} onValueChange={setMinReturn} max={100} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>{minReturn[0]}%</span>
                  <span>100%+</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Maximum Drawdown</Label>
              <div className="mt-2">
                <Slider value={maxDrawdown} onValueChange={setMaxDrawdown} max={50} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>-{maxDrawdown[0]}%</span>
                  <span>-50%</span>
                </div>
              </div>
            </div>

            {/* Risk Filters */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Risk Level</Label>
              <div className="space-y-2">
                {["Low", "Medium", "High"].map((risk) => (
                  <div key={risk} className="flex items-center space-x-2">
                    <input type="checkbox" id={risk} className="rounded" />
                    <Label htmlFor={risk} className="text-sm">
                      {risk}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Filters */}
            <div className="flex items-center justify-between">
              <Label htmlFor="verified" className="text-sm font-medium">
                Verified Only
              </Label>
              <Switch id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
            </div>
          </CardContent>
        </Card>

        {/* Traders Grid/List */}
        <div className="lg:col-span-3">
          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockTraders.map((trader) => (
                <Card key={trader.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {trader.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h3 className="font-semibold">{trader.name}</h3>
                            {trader.verified && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{trader.username}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">+{trader.monthlyReturn}%</div>
                        <div className="text-xs text-muted-foreground">Monthly Return</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{trader.followers.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <div className="font-medium">{trader.winRate}%</div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                      <div>
                        <div className="font-medium">{trader.sharpeRatio}</div>
                        <div className="text-xs text-muted-foreground">Sharpe</div>
                      </div>
                      <div>
                        <div className="font-medium">{trader.avgHoldTime}</div>
                        <div className="text-xs text-muted-foreground">Avg Hold</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {trader.strategy.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      <Badge
                        variant={
                          trader.riskLevel === "Low"
                            ? "secondary"
                            : trader.riskLevel === "Medium"
                              ? "default"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {trader.riskLevel} Risk
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        Follow
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/traders/${trader.id}`}>View Profile</Link>
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground text-center">Last active: {trader.lastActive}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4">Trader</th>
                        <th className="p-4">1M Return</th>
                        <th className="p-4">Followers</th>
                        <th className="p-4">Risk Level</th>
                        <th className="p-4">Win Rate</th>
                        <th className="p-4">Last Active</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTraders.map((trader) => (
                        <tr key={trader.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {trader.avatar}
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{trader.name}</span>
                                  {trader.verified && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                                </div>
                                <span className="text-sm text-muted-foreground">{trader.username}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-green-600 font-semibold">+{trader.monthlyReturn}%</span>
                          </td>
                          <td className="p-4">{trader.followers.toLocaleString()}</td>
                          <td className="p-4">
                            <Badge
                              variant={
                                trader.riskLevel === "Low"
                                  ? "secondary"
                                  : trader.riskLevel === "Medium"
                                    ? "default"
                                    : "destructive"
                              }
                            >
                              {trader.riskLevel}
                            </Badge>
                          </td>
                          <td className="p-4">{trader.winRate}%</td>
                          <td className="p-4 text-muted-foreground">{trader.lastActive}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm">Follow</Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/traders/${trader.id}`}>View</Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
