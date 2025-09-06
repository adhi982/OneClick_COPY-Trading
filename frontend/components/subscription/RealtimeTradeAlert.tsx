"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Clock, Copy, Bell } from "lucide-react"

interface TradeAlert {
  id: string
  symbol: string
  side: "buy" | "sell"
  price: number
  targetPrice: number
  stopLoss: number
  confidence: number
  reasoning: string
  timestamp: Date
  status: "active" | "filled" | "cancelled"
}

export function RealtimeTradeAlert() {
  const [alerts, setAlerts] = useState<TradeAlert[]>([
    {
      id: "1",
      symbol: "BTC/USDT",
      side: "buy",
      price: 43250,
      targetPrice: 45000,
      stopLoss: 42000,
      confidence: 85,
      reasoning: "Strong support at $43k level with bullish divergence on RSI",
      timestamp: new Date(),
      status: "active",
    },
  ])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Live Trading Signals</h3>
        </div>
        <Badge variant="secondary" className="animate-pulse">
          Live
        </Badge>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    alert.side === "buy" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {alert.side === "buy" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
                <div>
                  <h4 className="font-semibold">{alert.symbol}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>2 minutes ago</span>
                  </div>
                </div>
              </div>
              <Badge variant={alert.status === "active" ? "default" : "secondary"}>{alert.status}</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Entry Price</p>
                <p className="font-semibold">${alert.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Target</p>
                <p className="font-semibold text-green-600">${alert.targetPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Stop Loss</p>
                <p className="font-semibold text-red-600">${alert.stopLoss.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Confidence</p>
                <p className="font-semibold">{alert.confidence}%</p>
              </div>
            </div>

            <div className="bg-muted p-3 rounded">
              <p className="text-sm">{alert.reasoning}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {alert.side.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Risk: Medium
                </Badge>
              </div>
              <Button size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Trade
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
