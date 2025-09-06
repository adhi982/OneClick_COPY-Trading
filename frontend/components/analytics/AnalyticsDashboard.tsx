"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Target,
  Shield,
  Activity,
  PieChart,
  LineChart,
  AlertTriangle,
} from "lucide-react"

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState("3M")
  const [reportType, setReportType] = useState("performance")

  const performanceMetrics = {
    totalReturn: 24.8,
    annualizedReturn: 18.5,
    sharpeRatio: 1.24,
    maxDrawdown: -8.2,
    winRate: 68.5,
    avgTradeDuration: "4.2 days",
    volatility: 15.2,
    beta: 0.85,
  }

  const riskMetrics = {
    var95: -2.8,
    expectedShortfall: -4.2,
    portfolioVolatility: 15.2,
    concentrationRisk: "Medium",
    liquidityRisk: "Low",
    correlationRisk: "High",
  }

  const traderPerformance = [
    {
      name: "CryptoKing",
      allocation: 35,
      returns: 28.5,
      sharpe: 1.45,
      maxDrawdown: -6.2,
      trades: 45,
      winRate: 72,
      contribution: 8.2,
    },
    {
      name: "EthMaster",
      allocation: 25,
      returns: 15.2,
      sharpe: 0.98,
      maxDrawdown: -12.1,
      trades: 32,
      winRate: 65,
      contribution: 3.8,
    },
    {
      name: "SolanaWhale",
      allocation: 20,
      returns: 32.1,
      sharpe: 1.67,
      maxDrawdown: -4.8,
      trades: 28,
      winRate: 78,
      contribution: 6.4,
    },
    {
      name: "DeFiExpert",
      allocation: 20,
      returns: 18.9,
      sharpe: 1.12,
      maxDrawdown: -9.5,
      trades: 38,
      winRate: 63,
      contribution: 3.8,
    },
  ]

  const assetCorrelation = [
    { asset1: "BTC", asset2: "ETH", correlation: 0.85 },
    { asset1: "BTC", asset2: "SOL", correlation: 0.72 },
    { asset1: "BTC", asset2: "ADA", correlation: 0.68 },
    { asset1: "ETH", asset2: "SOL", correlation: 0.79 },
    { asset1: "ETH", asset2: "ADA", correlation: 0.74 },
    { asset1: "SOL", asset2: "ADA", correlation: 0.65 },
  ]

  const stressTestResults = [
    { scenario: "2022 Crypto Winter", impact: -45.2, probability: "Low" },
    { scenario: "Flash Crash (May 2021)", impact: -28.7, probability: "Medium" },
    { scenario: "Regulatory Crackdown", impact: -35.1, probability: "Medium" },
    { scenario: "Exchange Hack", impact: -15.3, probability: "Low" },
    { scenario: "Market Manipulation", impact: -22.4, probability: "High" },
  ]

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Advanced performance insights and risk analysis</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="risk">Risk Analysis</SelectItem>
              <SelectItem value="attribution">Attribution</SelectItem>
              <SelectItem value="tax">Tax Report</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Return</p>
                <p className="text-2xl font-bold text-green-600">+{performanceMetrics.totalReturn}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                <p className="text-2xl font-bold">{performanceMetrics.sharpeRatio}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-600">{performanceMetrics.maxDrawdown}%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics.winRate}%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Return Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <div>Performance Chart</div>
                    <div className="text-sm">Time-weighted vs Money-weighted returns</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{performanceMetrics.annualizedReturn}%</div>
                    <div className="text-sm text-muted-foreground">Annualized Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{performanceMetrics.volatility}%</div>
                    <div className="text-sm text-muted-foreground">Volatility</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk-Adjusted Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sharpe Ratio</span>
                    <span className="font-semibold">{performanceMetrics.sharpeRatio}</span>
                  </div>
                  <Progress value={performanceMetrics.sharpeRatio * 50} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Information Ratio</span>
                    <span className="font-semibold">1.08</span>
                  </div>
                  <Progress value={54} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sortino Ratio</span>
                    <span className="font-semibold">1.67</span>
                  </div>
                  <Progress value={83.5} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Calmar Ratio</span>
                    <span className="font-semibold">2.26</span>
                  </div>
                  <Progress value={90} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rolling Returns Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center border rounded-lg">
                <div className="text-center text-muted-foreground">
                  <LineChart className="h-12 w-12 mx-auto mb-2" />
                  <div>Rolling Returns Chart</div>
                  <div className="text-sm">12-month rolling returns over time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Value at Risk (95%)</span>
                    <span className="font-semibold text-red-600">{riskMetrics.var95}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expected Shortfall</span>
                    <span className="font-semibold text-red-600">{riskMetrics.expectedShortfall}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Portfolio Volatility</span>
                    <span className="font-semibold">{riskMetrics.portfolioVolatility}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Beta</span>
                    <span className="font-semibold">{performanceMetrics.beta}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Concentration Risk</span>
                    <Badge variant="default">{riskMetrics.concentrationRisk}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Liquidity Risk</span>
                    <Badge variant="secondary">{riskMetrics.liquidityRisk}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Correlation Risk</span>
                    <Badge variant="destructive">{riskMetrics.correlationRisk}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Stress Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scenario</TableHead>
                    <TableHead>Potential Impact</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stressTestResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.scenario}</TableCell>
                      <TableCell className="text-red-600">{result.impact}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            result.probability === "High"
                              ? "destructive"
                              : result.probability === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {result.probability}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Progress value={Math.abs(result.impact)} className="w-20" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Attribution by Trader</CardTitle>
              <CardDescription>Contribution of each trader to overall portfolio performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trader</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead>Returns</TableHead>
                    <TableHead>Sharpe Ratio</TableHead>
                    <TableHead>Max Drawdown</TableHead>
                    <TableHead>Win Rate</TableHead>
                    <TableHead>Contribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {traderPerformance.map((trader, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{trader.name}</TableCell>
                      <TableCell>{trader.allocation}%</TableCell>
                      <TableCell className="text-green-600">+{trader.returns}%</TableCell>
                      <TableCell>{trader.sharpe}</TableCell>
                      <TableCell className="text-red-600">{trader.maxDrawdown}%</TableCell>
                      <TableCell>{trader.winRate}%</TableCell>
                      <TableCell className="font-semibold">+{trader.contribution}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-2" />
                    <div>Asset Allocation Chart</div>
                    <div className="text-sm">Impact of asset allocation on returns</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alpha & Beta Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Portfolio Alpha</span>
                    <span className="font-semibold text-green-600">+3.2%</span>
                  </div>
                  <Progress value={64} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Portfolio Beta</span>
                    <span className="font-semibold">{performanceMetrics.beta}</span>
                  </div>
                  <Progress value={85} />

                  <div className="text-sm text-muted-foreground mt-4">
                    Your portfolio generates positive alpha while maintaining lower systematic risk than the market.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Correlation Matrix</CardTitle>
              <CardDescription>Correlation coefficients between different assets in your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetCorrelation.map((corr, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{corr.asset1}</span>
                      <span className="text-muted-foreground">↔</span>
                      <span className="font-medium">{corr.asset2}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Progress value={corr.correlation * 100} className="w-24" />
                      <span className="font-semibold w-12 text-right">{corr.correlation}</span>
                      <Badge
                        variant={
                          corr.correlation > 0.8 ? "destructive" : corr.correlation > 0.6 ? "default" : "secondary"
                        }
                      >
                        {corr.correlation > 0.8 ? "High" : corr.correlation > 0.6 ? "Medium" : "Low"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rolling Correlation Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg">
                <div className="text-center text-muted-foreground">
                  <LineChart className="h-12 w-12 mx-auto mb-2" />
                  <div>Rolling Correlation Chart</div>
                  <div className="text-sm">30-day rolling correlations over time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AnalyticsDashboard
export { AnalyticsDashboard }
