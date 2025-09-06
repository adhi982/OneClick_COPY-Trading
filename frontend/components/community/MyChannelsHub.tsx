"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, TrendingUp, DollarSign, Settings, Eye, MessageSquare, BarChart3 } from "lucide-react"
import Link from "next/link"

export function MyChannelsHub() {
  const [activeTab, setActiveTab] = useState("subscribed")

  // Mock data for subscribed channels
  const subscribedChannels = [
    {
      id: "1",
      name: "Pro Crypto Signals",
      creator: { name: "John Trader", avatar: "/placeholder.svg?height=40&width=40" },
      subscribers: 1250,
      winRate: 85,
      monthlyReturn: 15.2,
      subscriptionStatus: "active",
      nextBilling: "2024-02-15",
      hasNewSignals: true,
      recentSignals: 3,
    },
    {
      id: "2",
      name: "DeFi Alpha Alerts",
      creator: { name: "Sarah DeFi", avatar: "/placeholder.svg?height=40&width=40" },
      subscribers: 892,
      winRate: 78,
      monthlyReturn: 12.8,
      subscriptionStatus: "active",
      nextBilling: "2024-02-20",
      hasNewSignals: false,
      recentSignals: 1,
    },
  ]

  // Mock data for owned channels
  const ownedChannels = [
    {
      id: "owned-1",
      name: "My Trading Signals",
      description: "Daily crypto trading signals with technical analysis",
      subscribers: 45,
      monthlyRevenue: 1350,
      winRate: 72,
      totalSignals: 28,
      status: "active",
      pricing: 30,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Channels</h1>
          <p className="text-muted-foreground">Manage your subscribed channels and create new ones</p>
        </div>
        <Link href="/community/create-channel">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Channel
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscribed">Subscribed Channels</TabsTrigger>
          <TabsTrigger value="owned">My Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscribedChannels.map((channel) => (
              <Card key={channel.id} className="relative">
                {channel.hasNewSignals && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive" className="animate-pulse">
                      {channel.recentSignals} New
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={channel.creator.avatar || "/placeholder.svg"} alt={channel.creator.name} />
                      <AvatarFallback>{channel.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                      <CardDescription>by {channel.creator.name}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{channel.subscribers}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span>{channel.winRate}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <span>+{channel.monthlyReturn}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{channel.recentSignals} signals</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Badge variant={channel.subscriptionStatus === "active" ? "default" : "secondary"}>
                      {channel.subscriptionStatus}
                    </Badge>
                    <div className="flex space-x-2">
                      <Link href={`/community/channels/${channel.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {subscribedChannels.length === 0 && (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">No Subscribed Channels</h3>
                  <p className="text-muted-foreground">Discover and subscribe to premium trading channels</p>
                </div>
                <Link href="/community/channels">
                  <Button>Browse Channels</Button>
                </Link>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="owned" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedChannels.map((channel) => (
              <Card key={channel.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                    <Badge variant={channel.status === "active" ? "default" : "secondary"}>{channel.status}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{channel.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{channel.subscribers} subscribers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>${channel.monthlyRevenue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span>{channel.winRate}% win rate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{channel.totalSignals} signals</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">${channel.pricing}/month</span>
                    <div className="flex space-x-2">
                      <Link href={`/community/channels/${channel.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {ownedChannels.length === 0 && (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">No Channels Created</h3>
                  <p className="text-muted-foreground">Start earning by creating your own premium trading channel</p>
                </div>
                <Link href="/community/create-channel">
                  <Button>Create Your First Channel</Button>
                </Link>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
