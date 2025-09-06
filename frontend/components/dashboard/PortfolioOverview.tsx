"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"

export function PortfolioOverview() {
  const stats = [
    {
      title: "Total Portfolio Value",
      value: "$12,450.75",
      change: "+5.2%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Total P&L",
      value: "+$2,340.50",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Active Positions",
      value: "8",
      change: "+2",
      changeType: "positive" as const,
      icon: Activity,
    },
    {
      title: "Following Traders",
      value: "5",
      change: "+1",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div
              className={`text-xs flex items-center ${
                stat.changeType === "positive" ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.changeType === "positive" ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {stat.change} from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
