import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown, Users, MessageSquare, Bell, Filter } from "lucide-react"

export const metadata: Metadata = {
  title: "Activity - OneClick Copy Trading",
  description: "View your trading activity and notifications",
}

export default function ActivityPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity</h1>
          <p className="text-muted-foreground">Track your trading activity and notifications</p>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {/* Trade Activity */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Successful Copy Trade</p>
                    <p className="text-sm text-muted-foreground">
                      Copied trade from @cryptomaster - Bought 0.5 BTC at $42,150
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    +$1,250
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Social Activity */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">New Follower</p>
                    <p className="text-sm text-muted-foreground">@tradingpro started following you</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            {/* Channel Activity */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">New Channel Message</p>
                    <p className="text-sm text-muted-foreground">New signal posted in "Crypto Signals Pro" channel</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                  <Badge variant="secondary">Premium</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Trade Loss */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Copy Trade Closed</p>
                    <p className="text-sm text-muted-foreground">
                      Copied trade from @ethtrader - Sold 10 ETH at $2,850
                    </p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                  <Badge variant="outline" className="text-red-600">
                    -$850
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Notification */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Risk Alert</p>
                    <p className="text-sm text-muted-foreground">
                      Your portfolio exposure to BTC has exceeded 50% limit
                    </p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                  <Badge variant="destructive">Alert</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>Trading Activity</CardTitle>
              <CardDescription>All your trading activities and copy trades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">BTC Buy Order</p>
                      <p className="text-sm text-muted-foreground">0.5 BTC at $42,150</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+$1,250</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">ETH Sell Order</p>
                      <p className="text-sm text-muted-foreground">10 ETH at $2,850</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">-$850</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Activity</CardTitle>
              <CardDescription>Followers, channels, and community interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback>TP</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">@tradingpro started following you</p>
                    <p className="text-sm text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">New message in "Crypto Signals Pro"</p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>System alerts and important updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Risk Alert</p>
                    <p className="text-sm text-muted-foreground">Portfolio exposure to BTC exceeded 50% limit</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                  <Badge variant="destructive">Alert</Badge>
                </div>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Bell className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Trade Executed</p>
                    <p className="text-sm text-muted-foreground">
                      Your copy trade order has been successfully executed
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Success
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
