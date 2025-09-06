"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, TrendingUp, Target, Star } from "lucide-react"

interface ChannelCardProps {
  channel: {
    id: string
    name: string
    creator: {
      name: string
      avatar: string
    }
    description: string
    pricing: {
      monthly: number
    }
    stats: {
      subscribers: number
      winRate: number
      totalSignals: number
    }
    tags: string[]
  }
  isSubscribed: boolean
  onSubscribe: (channelId: string) => void
}

export function ChannelCard({ channel, isSubscribed, onSubscribe }: ChannelCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={channel.creator.avatar || "/placeholder.svg"} alt={channel.creator.name} />
            <AvatarFallback>{channel.creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{channel.name}</h3>
            <p className="text-sm text-muted-foreground">by {channel.creator.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">4.8</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{channel.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {channel.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <div className="flex items-center justify-center space-x-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{channel.stats.subscribers}</span>
          </div>
          <p className="text-xs text-muted-foreground">Subscribers</p>
        </div>
        <div>
          <div className="flex items-center justify-center space-x-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{channel.stats.winRate}%</span>
          </div>
          <p className="text-xs text-muted-foreground">Win Rate</p>
        </div>
        <div>
          <div className="flex items-center justify-center space-x-1">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{channel.stats.totalSignals}</span>
          </div>
          <p className="text-xs text-muted-foreground">Signals</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold">${channel.pricing.monthly}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <Button onClick={() => onSubscribe(channel.id)} variant={isSubscribed ? "outline" : "default"}>
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>
      </div>
    </Card>
  )
}
