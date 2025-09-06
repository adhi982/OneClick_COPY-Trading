"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, TrendingUp, MessageSquare, Heart, Share2, Trophy, Search, Plus, MoreHorizontal } from "lucide-react"

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState("feed")
  const [sortBy, setSortBy] = useState("recent")

  const communityPosts = [
    {
      id: 1,
      author: "CryptoKing",
      avatar: "/placeholder.svg?height=40&width=40",
      timestamp: "2 hours ago",
      content:
        "Just closed a massive BTC position with +15% gains! The key was patience and proper risk management. Always stick to your strategy! 🚀",
      likes: 24,
      comments: 8,
      shares: 3,
      performance: "+15%",
      asset: "BTC/USDT",
    },
    {
      id: 2,
      author: "EthMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      timestamp: "4 hours ago",
      content:
        "Market analysis: ETH is showing strong support at $2,650. Looking for a breakout above $2,800 for the next leg up. What do you think?",
      likes: 18,
      comments: 12,
      shares: 5,
      performance: "+8.2%",
      asset: "ETH/USDT",
    },
    {
      id: 3,
      author: "SolanaWhale",
      avatar: "/placeholder.svg?height=40&width=40",
      timestamp: "6 hours ago",
      content:
        "SOL ecosystem is heating up! New DeFi protocols launching every week. This is just the beginning of the Solana summer! ☀️",
      likes: 31,
      comments: 15,
      shares: 8,
      performance: "+22.1%",
      asset: "SOL/USDT",
    },
  ]

  const leaderboard = [
    { rank: 1, name: "CryptoKing", returns: "28.5%", followers: 1247, trades: 45 },
    { rank: 2, name: "SolanaWhale", returns: "22.1%", followers: 892, trades: 28 },
    { rank: 3, name: "EthMaster", returns: "18.9%", followers: 756, trades: 38 },
    { rank: 4, name: "DeFiExpert", returns: "15.2%", followers: 634, trades: 32 },
    { rank: 5, name: "AltcoinHunter", returns: "12.8%", followers: 521, trades: 41 },
  ]

  const trendingTopics = [
    { tag: "#Bitcoin", posts: 1247 },
    { tag: "#Ethereum", posts: 892 },
    { tag: "#DeFi", posts: 756 },
    { tag: "#Solana", posts: 634 },
    { tag: "#Trading", posts: 521 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community Hub</h1>
          <p className="text-muted-foreground">Connect with traders, share insights, and learn from the community</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="feed">Community Feed</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search posts..." className="pl-10 w-64" />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="feed" className="space-y-4">
              {communityPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.author} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{post.author}</span>
                            <Badge variant="secondary">{post.performance}</Badge>
                            <Badge variant="outline">{post.asset}</Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{post.timestamp}</span>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed">{post.content}</p>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                              <Heart className="h-4 w-4 mr-1" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <Share2 className="h-4 w-4 mr-1" />
                              {post.shares}
                            </Button>
                          </div>
                          <Button variant="outline" size="sm">
                            Follow Trader
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Top Performers This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((trader) => (
                      <div key={trader.rank} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                            {trader.rank}
                          </div>
                          <Avatar>
                            <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={trader.name} />
                            <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{trader.name}</div>
                            <div className="text-sm text-muted-foreground">{trader.followers} followers</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{trader.returns}</div>
                            <div className="text-xs text-muted-foreground">Returns</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{trader.trades}</div>
                            <div className="text-xs text-muted-foreground">Trades</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Follow
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Discussions</CardTitle>
                  <CardDescription>Join the conversation on trending topics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Bitcoin Bull Run: Are we ready for $100K?</h3>
                        <Badge variant="secondary">Hot</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Discussion about Bitcoin's potential to reach $100,000 and what factors could drive this growth.
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Started by CryptoAnalyst • 2 hours ago</span>
                        <span>47 replies</span>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">DeFi vs Traditional Finance: The Future</h3>
                        <Badge variant="outline">Trending</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Comparing decentralized finance protocols with traditional banking systems.
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Started by DeFiExpert • 5 hours ago</span>
                        <span>23 replies</span>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Risk Management Strategies for Copy Trading</h3>
                        <Badge variant="default">Educational</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Best practices for managing risk when following other traders.
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Started by RiskManager • 1 day ago</span>
                        <span>31 replies</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                      {topic.tag}
                    </span>
                    <span className="text-xs text-muted-foreground">{topic.posts} posts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Traders</span>
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Posts Today</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Discussions</span>
                  <span className="font-semibold">8,923</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Online Now</span>
                  <span className="font-semibold text-green-600">342</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested Traders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>AH</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">AltcoinHunter</div>
                      <div className="text-xs text-muted-foreground">+12.8% returns</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>TS</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">TechSavvy</div>
                      <div className="text-xs text-muted-foreground">+9.4% returns</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CommunityHub
export { CommunityHub }
