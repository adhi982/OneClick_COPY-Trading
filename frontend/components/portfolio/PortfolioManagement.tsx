"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Pause, Play, Settings, X, PieChart, BarChart3, Activity } from "lucide-react"
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Pie } from 'recharts'

function PortfolioManagement() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M")
  const [marketData, setMarketData] = useState<any>({})
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Real portfolio holdings in APT equivalent
  const portfolioHoldings = {
    APT: 850.5,
    BTC: 0.025,
    ETH: 2.5,
    USDC: 1500,
    USDT: 800,
    SOL: 15,
    ADA: 5000,
    DOT: 100
  }

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/market/supported')
        const data = await response.json()
        setMarketData(data)
        calculatePortfolioValue(data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch market data:', error)
        setLoading(false)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 120000) // Update every 2 minutes

    return () => clearInterval(interval)
  }, [])

  const calculatePortfolioValue = (data: any) => {
    let totalValue = 0
    const assetValues: any = {}

    Object.entries(portfolioHoldings).forEach(([symbol, amount]) => {
      const price = data[symbol]?.price || 0
      const value = (amount as number) * price
      assetValues[symbol] = {
        amount,
        price,
        value,
        change24h: data[symbol]?.change24h || 0
      }
      totalValue += value
    })

    const totalChange24h = Object.values(assetValues).reduce((acc: number, asset: any) => {
      return acc + (asset.value * asset.change24h / 100)
    }, 0)

    setPortfolioData({
      totalValue,
      totalChange24h,
      totalChangePercent: (totalChange24h / totalValue) * 100,
      assets: assetValues
    })
  }

  // Calculate asset allocation for pie chart
  const getAssetAllocation = () => {
    if (!portfolioData) return []
    
    return Object.entries(portfolioData.assets).map(([symbol, data]: [string, any]) => ({
      asset: symbol,
      value: data.value,
      percentage: ((data.value / portfolioData.totalValue) * 100).toFixed(1),
      color: getAssetColor(symbol)
    })).sort((a, b) => b.value - a.value)
  }

  const getAssetColor = (symbol: string) => {
    const colors: { [key: string]: string } = {
      APT: "#00D4FF",
      BTC: "#F7931A", 
      ETH: "#627EEA",
      USDC: "#2775CA",
      USDT: "#26A17B",
      SOL: "#9945FF",
      ADA: "#0033AD",
      DOT: "#E6007A"
    }
    return colors[symbol] || "#6B7280"
  }

  // Performance chart data
  const performanceData = [
    { name: 'Jan', value: 100000, benchmark: 100000 },
    { name: 'Feb', value: 108500, benchmark: 105000 },
    { name: 'Mar', value: 115200, benchmark: 108000 },
    { name: 'Apr', value: 122800, benchmark: 112000 },
    { name: 'May', value: 118900, benchmark: 109500 },
    { name: 'Jun', value: 125600, benchmark: 115000 },
    { name: 'Jul', value: portfolioData?.totalValue || 125432, benchmark: 118000 }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  const portfolioSummary = {
    totalValue: portfolioData?.totalValue || 0,
    dayChange: portfolioData?.totalChangePercent || 0,
    dayChangeAmount: portfolioData?.totalChange24h || 0,
    weekChange: 8.7,
    monthChange: 12.8,
    riskScore: 6.2,
  }

  const activePositions = [
    {
      id: 1,
      asset: "BTC/USDT",
      trader: "CryptoKing",
      entryPrice: portfolioData?.assets?.BTC?.price * 0.98 || 108000,
      currentPrice: portfolioData?.assets?.BTC?.price || 110646,
      pnl: ((portfolioData?.assets?.BTC?.price || 110646) - (portfolioData?.assets?.BTC?.price * 0.98 || 108000)) * 0.025,
      pnlPercent: portfolioData?.assets?.BTC?.change24h || 2.04,
      size: 0.025,
      allocation: 15.2,
      risk: "Medium",
    },
    {
      id: 2,
      asset: "ETH/USDT",
      trader: "EthMaster",
      entryPrice: portfolioData?.assets?.ETH?.price * 1.05 || 4486,
      currentPrice: portfolioData?.assets?.ETH?.price || 4273.33,
      pnl: ((portfolioData?.assets?.ETH?.price || 4273.33) - (portfolioData?.assets?.ETH?.price * 1.05 || 4486)) * 2.5,
      pnlPercent: portfolioData?.assets?.ETH?.change24h || -5.01,
      size: 2.5,
      allocation: 12.8,
      risk: "High",
    },
    {
      id: 3,
      asset: "APT/USDT",
      trader: "AptosWhale",
      entryPrice: portfolioData?.assets?.APT?.price * 0.95 || 4.02,
      currentPrice: portfolioData?.assets?.APT?.price || 4.23,
      pnl: ((portfolioData?.assets?.APT?.price || 4.23) - (portfolioData?.assets?.APT?.price * 0.95 || 4.02)) * 850.5,
      pnlPercent: portfolioData?.assets?.APT?.change24h || 5.22,
      size: 850.5,
      allocation: 28.5,
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
              {getAssetAllocation().slice(0, 6).map((asset) => (
                <div key={asset.asset} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }} />
                    <span className="font-medium">{asset.asset}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{asset.percentage}%</div>
                    <div className="text-sm text-muted-foreground">${asset.value.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={getAssetAllocation()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {getAssetAllocation().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString(undefined, {maximumFractionDigits: 2})}`, 'Value']}
                    labelFormatter={(label) => `${label}`}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
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
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Portfolio Performance vs Benchmark</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      name="Portfolio"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 3 }}
                      name="Benchmark"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Asset Performance (24h)</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getAssetAllocation().slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="asset" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString(undefined, {maximumFractionDigits: 2})}`, 'Value']}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                      fill="hsl(var(--primary))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+{Math.max(...Object.values(portfolioData?.assets || {}).map((asset: any) => asset.change24h || 0)).toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Best Performer</div>
                      <div className="text-xs">{Object.entries(portfolioData?.assets || {}).find(([_, asset]: [string, any]) => (asset.change24h || 0) === Math.max(...Object.values(portfolioData?.assets || {}).map((a: any) => a.change24h || 0)))?.[0] || 'N/A'}</div>
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
