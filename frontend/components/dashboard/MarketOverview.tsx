"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const marketData = [
  {
    symbol: "BTC/USDT",
    price: "$42,150.00",
    change: "+2.5%",
    changeType: "positive" as const,
    volume: "$1.2B",
  },
  {
    symbol: "ETH/USDT",
    price: "$2,850.00",
    change: "+1.8%",
    changeType: "positive" as const,
    volume: "$850M",
  },
  {
    symbol: "SOL/USDT",
    price: "$98.50",
    change: "-0.5%",
    changeType: "negative" as const,
    volume: "$320M",
  },
  {
    symbol: "ADA/USDT",
    price: "$0.45",
    change: "+3.2%",
    changeType: "positive" as const,
    volume: "$180M",
  },
]

export function MarketOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.map((market) => (
            <div
              key={market.symbol}
              className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{market.symbol}</span>
                <div
                  className={`flex items-center ${
                    market.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {market.changeType === "positive" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span className="text-sm">{market.change}</span>
                </div>
              </div>

              <div className="text-lg font-bold mb-1">{market.price}</div>
              <div className="text-xs text-muted-foreground">Vol: {market.volume}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
