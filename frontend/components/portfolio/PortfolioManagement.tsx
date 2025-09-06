"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Pause, Play, Settings, X, PieChart, BarChart3, Activity } from "lucide-react"

function PortfolioManagement() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M")

  const portfolioSummary = {
    totalValue: 125432.56,
    dayChange: 2.45,
    dayChangeAmount: 432.12,
    weekChange: 8.7,
    monthChange: 12.8,
    riskScore: 6.2,
  }

  const activePositions = [
    {
      id: 1,
      asset: "BTC/USDT",
      trader: "CryptoKing",
      entryPrice: 42500,
      currentPrice: 43200,
      pnl: 700,
      pnlPercent: 1.65,
      size: 0.5,
      allocation: 15.2,
      risk: "Medium",
    },
    {
      id: 2,
      asset: "ETH/USDT",
      trader: "EthMaster",
      entryPrice: 2800,
      currentPrice: 2650,
      pnl: -150,
      pnlPercent: -5.36,
      size: 2.1,
      allocation: 12.8,
      risk: "High",
    },
    {
      id: 3,
      asset: "SOL/USDT",
      trader: "SolanaWhale",
      entryPrice: 95,
      currentPrice: 102,
      pnl: 147,
      pnlPercent: 7.37,
      size: 21,
      allocation: 8.5,
      risk: "Low",
    },
  ]

  const copyTrades = [
    {
      id: 1,
      trader: "CryptoKing",
      photo: "/placeholder.svg?height=40&width=40",
      startDate: "2024-01-15",
      allocated: 25000,
      performance: 18.5,
      exposure: 22500,
      status: "Active",
    },
    {
      id: 2,
      trader: "EthMaster",
      photo: "/placeholder.svg?height=40&width=40",
      startDate: "2024-02-01",
      allocated: 15000,
      performance: -3.2,
      exposure: 14520,
      status: "Paused",
    },
    {
      id: 3,
      trader: "SolanaWhale",
      photo: "/placeholder.svg?height=40&width=40",
      startDate: "2024-01-20",
      allocated: 20000,
      performance: 12.8,
      exposure: 18900,
      status: "Active",
    },
  ]

  const assetAllocation = [
    { asset: "BTC", percentage: 35, value: 43901.4, color: "#F7931A" },
    { asset: "ETH", percentage: 28, value: 35121.12, color: "#627EEA" },
    { asset: "SOL", percentage: 15, value: 18814.88, color: "#9945FF" },
    { asset: "ADA", percentage: 12, value: 15051.91, color: "#0033AD" },
    { asset: "Others", percentage: 10, value: 12543.25, color: "#6B7280" },
  ]

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Portfolio Value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioSummary.totalValue.toLocaleString()}</div>
            <div
              className={`flex items-center text-sm ${portfolioSummary.dayChange >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {portfolioSummary.dayChange >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              ${Math.abs(portfolioSummary.dayChangeAmount)} ({portfolioSummary.dayChange}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>7D Performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{portfolioSummary.weekChange}%</div>
            <div className="text-sm text-muted-foreground">Above market average</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>30D Performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{portfolioSummary.monthChange}%</div>
            <div className="text-sm text-muted-foreground">Outperforming benchmark</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Risk Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioSummary.riskScore}/10</div>
            <Progress value={portfolioSummary.riskScore * 10} className="mt-2" />
            <div className="text-sm text-muted-foreground mt-1">Moderate Risk</div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Asset Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {assetAllocation.map((asset) => (
                <div key={asset.asset} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }} />
                    <span className="font-medium">{asset.asset}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{asset.percentage}%</div>
                    <div className="text-sm text-muted-foreground">${asset.value.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* Placeholder for pie chart */}
                <div className="w-full h-full rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">${portfolioSummary.totalValue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions">Active Positions</TabsTrigger>
          <TabsTrigger value="copy-trades">Copy Trades</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Active Positions</CardTitle>
              <CardDescription>Manage your current trading positions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Trader</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activePositions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-medium">{position.asset}</TableCell>
                      <TableCell>{position.trader}</TableCell>
                      <TableCell>${position.entryPrice.toLocaleString()}</TableCell>
                      <TableCell>${position.currentPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className={position.pnl >= 0 ? "text-green-600" : "text-red-600"}>
                          ${position.pnl} ({position.pnlPercent}%)
                        </div>
                      </TableCell>
                      <TableCell>{position.size}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            position.risk === "High"
                              ? "destructive"
                              : position.risk === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {position.risk}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Close
                          </Button>
                          <Button size="sm" variant="outline">
                            Modify
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="copy-trades">
          <Card>
            <CardHeader>
              <CardTitle>Copy Trade Management</CardTitle>
              <CardDescription>Manage your active copy trading relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {copyTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={trade.photo || "/placeholder.svg"}
                        alt={trade.trader}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{trade.trader}</div>
                        <div className="text-sm text-muted-foreground">
                          Started: {new Date(trade.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Allocated</div>
                        <div className="font-medium">${trade.allocated.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Performance</div>
                        <div className={`font-medium ${trade.performance >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {trade.performance >= 0 ? "+" : ""}
                          {trade.performance}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <Badge variant={trade.status === "Active" ? "default" : "secondary"}>{trade.status}</Badge>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        {trade.status === "Active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance Analytics
              </CardTitle>
              <div className="flex space-x-2">
                {["1D", "7D", "1M", "3M", "1Y"].map((timeframe) => (
                  <Button
                    key={timeframe}
                    size="sm"
                    variant={selectedTimeframe === timeframe ? "default" : "outline"}
                    onClick={() => setSelectedTimeframe(timeframe)}
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-2" />
                  <div>Performance Chart</div>
                  <div className="text-sm">
                    Interactive chart showing portfolio performance over {selectedTimeframe}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+18.5%</div>
                      <div className="text-sm text-muted-foreground">Best Performer</div>
                      <div className="text-xs">CryptoKing</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">1.24</div>
                      <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                      <div className="text-xs">Risk-adjusted returns</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">-8.2%</div>
                      <div className="text-sm text-muted-foreground">Max Drawdown</div>
                      <div className="text-xs">Worst decline period</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PortfolioManagement
export { PortfolioManagement }
