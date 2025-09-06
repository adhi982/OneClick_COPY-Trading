"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Settings } from "lucide-react"
import { format } from "date-fns"

interface SubscriptionCardProps {
  subscription: {
    id: string
    channel: {
      name: string
      creator: {
        name: string
        avatar: string
      }
    }
    status: "active" | "cancelled" | "expired"
    amount: number
    nextBillingDate: Date
    startDate: Date
  }
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "cancelled":
        return "destructive"
      case "expired":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={subscription.channel.creator.avatar || "/placeholder.svg"} />
            <AvatarFallback>{subscription.channel.creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{subscription.channel.name}</h4>
            <p className="text-sm text-muted-foreground">by {subscription.channel.creator.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Next billing: {format(subscription.nextBillingDate, "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold">${subscription.amount}/month</p>
            <Badge variant={getStatusColor(subscription.status) as any}>{subscription.status}</Badge>
          </div>

          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </div>
      </div>
    </Card>
  )
}
