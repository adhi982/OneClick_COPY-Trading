"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Users, Settings } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ChatMessage {
  id: string
  user: {
    name: string
    avatar: string
    role: "admin" | "subscriber" | "member"
  }
  content: string
  timestamp: Date
  type: "message" | "signal" | "system"
}

interface ChannelChatProps {
  channelId: string
}

export function ChannelChat({ channelId }: ChannelChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: { name: "John Trader", avatar: "/placeholder.svg?height=32&width=32", role: "admin" },
      content: "Welcome to the Pro Crypto Signals channel! 🚀",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "message",
    },
    {
      id: "2",
      user: { name: "System", avatar: "", role: "member" },
      content: "New signal posted: BTC/USDT Long at $43,250",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: "signal",
    },
    {
      id: "3",
      user: { name: "CryptoFan", avatar: "/placeholder.svg?height=32&width=32", role: "subscriber" },
      content: "Thanks for the signal! Already in profit 💰",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "message",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers] = useState(127)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: { name: "You", avatar: "/placeholder.svg?height=32&width=32", role: "subscriber" },
      content: newMessage,
      timestamp: new Date(),
      type: "message",
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "subscriber":
        return "default"
      default:
        return "secondary"
    }
  }

  const getMessageTypeStyle = (type: string) => {
    switch (type) {
      case "signal":
        return "bg-blue-50 border-blue-200"
      case "system":
        return "bg-gray-50 border-gray-200"
      default:
        return "bg-background"
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">Live Chat</h3>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{onlineUsers} online</span>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto space-y-3 mb-4 p-2 border rounded-lg">
        {messages.map((message) => (
          <div key={message.id} className={`p-3 rounded-lg ${getMessageTypeStyle(message.type)}`}>
            <div className="flex items-start space-x-3">
              {message.user.avatar && (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={message.user.avatar || "/placeholder.svg"} alt={message.user.name} />
                  <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{message.user.name}</span>
                  <Badge variant={getRoleColor(message.user.role) as any} className="text-xs">
                    {message.user.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(message.timestamp)} ago</span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} size="sm">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
