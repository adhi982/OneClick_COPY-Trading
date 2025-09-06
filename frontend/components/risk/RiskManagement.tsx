"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertTriangle, TrendingDown, Target, Settings, BarChart3, Activity, Zap, Lock } from "lucide-react"

const RiskManagement = () => {
  const [riskSettings, setRiskSettings] = useState({
    maxDrawdown: 15,
    maxRiskPerTrade: 2,
    maxPortfolioExposure: 80,
    correlationLimit: 0.7,
    emergencyStop: true,
    riskAlerts: true,
    autoRebalance: false,
    stopLossEnabled: true,
    takeProfitEnabled: true,
  })

  const [riskProfile, setRiskProfile] = useState("moderate")

  const currentRiskMetrics = {
    portfolioRisk: 6.2,
    var95: -2.8,
    expectedShortfall: -4.2,
    sharpeRatio: 1.24,
    maxDrawdown: -8.2,
    volatility: 15.2,
    beta: 0.85,
    correlationRisk: "High",
  }

  const riskAlerts = [
    {
      id: 1,
      type: "warning",
      title: "High Correlation Detected",
      message: "BTC and ETH positions show 85% correlation. Consider diversification.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "info",
      title: "Risk Limit Approached",
      message: "Portfolio exposure at 75% of maximum limit (80%).",
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      type: "success",
      title: "Risk Reduced",
      message: "Successful rebalancing reduced portfolio volatility by 12%.",
      timestamp: "1 day ago",
    },
  ]

  const positionRisks = [
    {
      asset: "BTC/USDT",
      trader: "CryptoKing",
      allocation: 25,
      risk: "Medium",
      var: -3.2,
      correlation: 0.85,
      volatility: 18.5,
    },
    {
      asset: "ETH/USDT",
      trader: "EthMaster",
      allocation: 20,
      risk: "High",
      var: -4.8,
      correlation: 0.79,
      volatility: 22.1,
    },
    {
      asset: "SOL/USDT",
      trader: "SolanaWhale",
      allocation: 15,
      risk: "Low",
      var: -2.1,
      correlation: 0.45,
      volatility: 12.8,
    },
  ]

  const handleRiskSettingChange = (key: string, value: any) => {
    setRiskSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Risk Management</h1>
          <p className="text-muted-foreground">Monitor and control your portfolio risk exposure</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Risk Settings
          </Button>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Emergency Stop
          </Button>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Risk</p>
                <p className="text-2xl font-bold">{currentRiskMetrics.portfolioRisk}/10</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={currentRiskMetrics.portfolioRisk * 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Value at Risk</p>
                <p className="text-2xl font-bold text-red-600">{currentRiskMetrics.var95}%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Max Drawdown</p>
                <p className="text-2xl font-bold text-orange-600">{currentRiskMetrics.maxDrawdown}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volatility</p>
                <p className="text-2xl font-bold">{currentRiskMetrics.volatility}%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Risk Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskAlerts.map((alert) => (
              <Alert key={alert.id} variant={alert.type === "warning" ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Risk Settings</TabsTrigger>
          <TabsTrigger value="positions">Position Risk</TabsTrigger>
          <TabsTrigger value="scenarios">Stress Testing</TabsTrigger>
          <TabsTrigger value="limits">Risk Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Profile</CardTitle>
                <CardDescription>Set your overall risk tolerance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Risk Profile</Label>
                  <Select value={riskProfile} onValueChange={setRiskProfile}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Maximum Drawdown: {riskSettings.maxDrawdown}%</Label>
                    <Slider
                      value={[riskSettings.maxDrawdown]}
                      onValueChange={(value) => handleRiskSettingChange("maxDrawdown", value[0])}
                      max={30}
                      min={5}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Risk per Trade: {riskSettings.maxRiskPerTrade}%</Label>
                    <Slider
                      value={[riskSettings.maxRiskPerTrade]}
                      onValueChange={(value) => handleRiskSettingChange("maxRiskPerTrade", value[0])}
                      max={10}
                      min={0.5}
                      step={0.5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Portfolio Exposure: {riskSettings.maxPortfolioExposure}%</Label>
                    <Slider
                      value={[riskSettings.maxPortfolioExposure]}
                      onValueChange={(value) => handleRiskSettingChange("maxPortfolioExposure", value[0])}
                      max={100}
                      min={20}
                      step={5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Controls</CardTitle>
                <CardDescription>Automated risk management features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emergency Stop</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically stop all trading if losses exceed threshold
                    </p>
                  </div>
                  <Switch
                    checked={riskSettings.emergencyStop}
                    onCheckedChange={(checked) => handleRiskSettingChange("emergencyStop", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Risk Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when risk limits are approached
                    </p>
                  </div>
                  <Switch
                    checked={riskSettings.riskAlerts}
                    onCheckedChange={(checked) => handleRiskSettingChange("riskAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Rebalancing</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically rebalance portfolio when risk exceeds limits
                    </p>
                  </div>
                  <Switch
                    checked={riskSettings.autoRebalance}
                    onCheckedChange={(checked) => handleRiskSettingChange("autoRebalance", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Stop Loss Protection</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic stop loss orders</p>
                  </div>
                  <Switch
                    checked={riskSettings.stopLossEnabled}
                    onCheckedChange={(checked) => handleRiskSettingChange("stopLossEnabled", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Position Risk Analysis</CardTitle>
              <CardDescription>Individual position risk metrics and correlations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positionRisks.map((position, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-semibold">{position.asset}</div>
                          <div className="text-sm text-muted-foreground">Trader: {position.trader}</div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          position.risk === "High"
                            ? "destructive"
                            : position.risk === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {position.risk} Risk
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Allocation</div>
                        <div className="font-semibold">{position.allocation}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">VaR (95%)</div>
                        <div className="font-semibold text-red-600">{position.var}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Correlation</div>
                        <div className="font-semibold">{position.correlation}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Volatility</div>
                        <div className="font-semibold">{position.volatility}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Stress Test Scenarios
              </CardTitle>
              <CardDescription>Test portfolio performance under various market conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Zap className="h-6 w-6 mb-2" />
                    <span>Flash Crash Scenario</span>
                    <span className="text-xs text-muted-foreground">-30% market drop</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <TrendingDown className="h-6 w-6 mb-2" />
                    <span>Bear Market</span>
                    <span className="text-xs text-muted-foreground">Extended decline</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    <span>Regulatory Risk</span>
                    <span className="text-xs text-muted-foreground">Policy changes</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Activity className="h-6 w-6 mb-2" />
                    <span>High Volatility</span>
                    <span className="text-xs text-muted-foreground">Increased uncertainty</span>
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Last Stress Test Results</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Scenario:</span>
                      <span className="ml-2 font-medium">Flash Crash (-30%)</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Portfolio Impact:</span>
                      <span className="ml-2 font-medium text-red-600">-22.4%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recovery Time:</span>
                      <span className="ml-2 font-medium">14 days</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Risk Score:</span>
                      <span className="ml-2 font-medium">7.2/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Risk Limits & Constraints
              </CardTitle>
              <CardDescription>Set hard limits to protect your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyLoss">Daily Loss Limit ($)</Label>
                    <Input id="dailyLoss" type="number" defaultValue="5000" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weeklyLoss">Weekly Loss Limit ($)</Label>
                    <Input id="weeklyLoss" type="number" defaultValue="15000" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyLoss">Monthly Loss Limit ($)</Label>
                    <Input id="monthlyLoss" type="number" defaultValue="50000" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxPositions">Maximum Open Positions</Label>
                    <Input id="maxPositions" type="number" defaultValue="20" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxTraders">Maximum Followed Traders</Label>
                    <Input id="maxTraders" type="number" defaultValue="10" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minLiquidity">Minimum Liquidity Reserve (%)</Label>
                    <Input id="minLiquidity" type="number" defaultValue="20" />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button>Save Risk Limits</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RiskManagement
export { RiskManagement }
