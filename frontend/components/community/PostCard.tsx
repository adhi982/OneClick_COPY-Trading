"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Copy, TrendingUp, TrendingDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  post: {
    id: string
    author: {
      name: string
      avatar: string
      verified: boolean
    }
    type: "trade" | "analysis" | "discussion"
    content: string
    createdAt: Date
    likes: number
    comments: any[]
    isLiked: boolean
    tradeData?: {
      symbol: string
      side: "buy" | "sell"
      price: number
      pnl: number
      reasoning?: string
    }
  }
  onLike: (postId: string) => void
  onComment: (postId: string, comment: string) => void
  onShare: (postId: string) => void
}

export function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")

  return (
    <Card className="p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold">{post.author.name}</h4>
              {post.author.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{formatDistanceToNow(post.createdAt)} ago</p>
          </div>
        </div>
        <Badge variant={post.type === "trade" ? "default" : "secondary"}>{post.type.toUpperCase()}</Badge>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-foreground mb-3">{post.content}</p>

        {/* Trade Details if trade post */}
        {post.type === "trade" && post.tradeData && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Asset:</span> {post.tradeData.symbol}
              </div>
              <div>
                <span className="font-medium">Action:</span>
                <Badge variant={post.tradeData.side === "buy" ? "default" : "destructive"} className="ml-2">
                  {post.tradeData.side === "buy" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {post.tradeData.side.toUpperCase()}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Price:</span> ${post.tradeData.price}
              </div>
              <div>
                <span className="font-medium">P&L:</span>
                <span className={post.tradeData.pnl >= 0 ? "text-green-600" : "text-red-600"}>
                  {post.tradeData.pnl >= 0 ? "+" : ""}${post.tradeData.pnl}
                </span>
              </div>
            </div>
            {post.tradeData.reasoning && (
              <div className="mt-3">
                <span className="font-medium">Reasoning:</span>
                <p className="text-muted-foreground mt-1">{post.tradeData.reasoning}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => onLike(post.id)} className="flex items-center space-x-2">
            <Heart className={`h-4 w-4 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{post.likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments.length}</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={() => onShare(post.id)} className="flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>

        {/* Copy Trade Button for trade posts */}
        {post.type === "trade" && post.tradeData && (
          <Button size="sm" variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copy Trade
          </Button>
        )}
      </div>
    </Card>
  )
}
