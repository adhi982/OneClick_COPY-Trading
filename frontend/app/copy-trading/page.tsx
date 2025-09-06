import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Settings, Pause, StopCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Copy Trading - OneClick Copy Trading",
  description: "Manage your copy trading activities and positions",
}

export default function CopyTradingPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Copy Trading Dashboard</h1>
          <p className="text-muted-foreground">Manage your copy trading activities and monitor performance</p>
        </div>
        <Button asChild>
          <Link href="/traders">
            <Users className="h-4 w-4 mr-2" />
            Find Traders
          </Link>
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Copies</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className="text-2xl font-bold text-green-600">+$3,450</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">72%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Allocated</p>
                <p className="text-2xl font-bold">$25,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Copies</TabsTrigger>
          <TabsTrigger value="history">Copy History</TabsTrigger>
          <TabsTrigger value="settings">Copy Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {/* Active Copy Trade 1 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Trader" />
                      <AvatarFallback>CM</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">@cryptomaster</h3>
                      <p className="text-sm text-muted-foreground">Professional Crypto Trader</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">Active</Badge>
                        <Badge variant="outline" className="text-green-600">
                          +15.2%
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Allocated</p>
                      <p className="font-semibold">$5,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current P&L</p>
                      <p className="font-semibold text-green-600">+$760</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <StopCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Risk Level</span>
                    <span>Medium (60%)</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Active Copy Trade 2 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Trader" />
                      <AvatarFallback>ET</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">@ethtrader</h3>
                      <p className="text-sm text-muted-foreground">DeFi Specialist</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">Active</Badge>
                        <Badge variant="outline" className="text-red-600">
                          -3.1%
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Allocated</p>
                      <p className="font-semibold">$3,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current P&L</p>
                      <p className="font-semibold text-red-600">-$93</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <StopCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Risk Level</span>
                    <span>High (80%)</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Copy Trading History</CardTitle>
              <CardDescription>Complete history of your copy trading activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>BT</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">@btcwhale</p>
                      <p className="text-sm text-muted-foreground">Completed • 30 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+$1,250</p>
                    <p className="text-xs text-muted-foreground">+25.0% ROI</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">@soltrader</p>
                      <p className="text-sm text-muted-foreground">Stopped • 15 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">-$420</p>
                    <p className="text-xs text-muted-foreground">-8.4% ROI</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Copy Trading Settings</CardTitle>
              <CardDescription>Configure your copy trading preferences and risk management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Default Allocation</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set the default amount to allocate when copying a new trader
                  </p>
                  <div className="flex items-center space-x-2">
                    <span>$</span>
                    <input type="number" defaultValue="1000" className="border rounded px-3 py-2 w-32" />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Risk Management</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure automatic stop-loss and take-profit levels
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Stop Loss (%)</label>
                      <input type="number" defaultValue="10" className="border rounded px-3 py-2 w-full mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Take Profit (%)</label>
                      <input type="number" defaultValue="25" className="border rounded px-3 py-2 w-full mt-1" />
                    </div>
                  </div>
                </div>

                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
