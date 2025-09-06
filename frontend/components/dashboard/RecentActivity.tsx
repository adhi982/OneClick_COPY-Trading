"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "buy",
    asset: "BTC/USDT",
    amount: "0.25 BTC",
    price: "$42,150",
    trader: "Alex Chen",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "sell",
    asset: "ETH/USDT",
    amount: "2.5 ETH",
    price: "$2,850",
    trader: "Sarah Johnson",
    time: "15 minutes ago",
  },
  {
    id: 3,
    type: "buy",
    asset: "SOL/USDT",
    amount: "50 SOL",
    price: "$98.50",
    trader: "Mike Rodriguez",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "sell",
    asset: "ADA/USDT",
    amount: "1000 ADA",
    price: "$0.45",
    trader: "Alex Chen",
    time: "2 hours ago",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    activity.type === "buy" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {activity.type === "buy" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{activity.asset}</span>
                    <Badge variant={activity.type === "buy" ? "default" : "secondary"}>
                      {activity.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activity.amount} • Following {activity.trader}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium">{activity.price}</div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
