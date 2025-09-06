import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, TrendingUp, TrendingDown, Users, MessageSquare, AlertTriangle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Notifications - OneClick Copy Trading",
  description: "Manage your notifications and alerts",
}

export default function NotificationsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your trading activities and alerts</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Mark All Read</Button>
          <Button variant="outline" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Trade Notification */}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Trade Executed Successfully</h3>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your copy trade from @cryptomaster has been executed. Bought 0.5 BTC at $42,150.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-green-600">
                      +$1,250
                    </Badge>
                    <Badge variant="secondary">Copy Trade</Badge>
                  </div>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          {/* Social Notification */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>TP</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">New Follower</h3>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    @tradingpro started following you and your trading activities.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      Social
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Channel Notification */}
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">New Premium Signal</h3>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Crypto Signals Pro" channel posted a new BUY signal for SOL.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">Premium</Badge>
                    <Badge variant="outline">Signal</Badge>
                  </div>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Alert */}
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Risk Alert</h3>
                    <span className="text-xs text-muted-foreground">3 hours ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your portfolio exposure to BTC has exceeded the 50% risk limit.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="destructive">High Risk</Badge>
                    <Button size="sm" variant="outline">
                      Review Portfolio
                    </Button>
                  </div>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          {/* Trade Loss */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Copy Trade Closed</h3>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Copy trade from @ethtrader was closed. Sold 10 ETH at $2,850.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-red-600">
                      -$850
                    </Badge>
                    <Badge variant="secondary">Copy Trade</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades">
          <div className="space-y-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Trade Executed Successfully</h3>
                    <p className="text-sm text-muted-foreground">
                      Copy trade from @cryptomaster - Bought 0.5 BTC at $42,150
                    </p>
                    <p className="text-xs text-muted-foreground">2 min ago</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    +$1,250
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Copy Trade Closed</h3>
                    <p className="text-sm text-muted-foreground">Copy trade from @ethtrader - Sold 10 ETH at $2,850</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                  <Badge variant="outline" className="text-red-600">
                    -$850
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback>TP</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">New Follower</h3>
                    <p className="text-sm text-muted-foreground">@tradingpro started following you</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-4">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Risk Alert</h3>
                    <p className="text-sm text-muted-foreground">Portfolio exposure to BTC exceeded 50% limit</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                  <Badge variant="destructive">High Risk</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels">
          <div className="space-y-4">
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <h3 className="font-semibold">New Premium Signal</h3>
                    <p className="text-sm text-muted-foreground">"Crypto Signals Pro" posted a BUY signal for SOL</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <Badge variant="secondary">Premium</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
