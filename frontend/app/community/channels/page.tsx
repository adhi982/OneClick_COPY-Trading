import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { ChannelCard } from "@/components/subscription/ChannelCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Premium Channels - Copy Trading Platform",
  description: "Discover and subscribe to premium trading channels",
}

export default function ChannelsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Premium Channels</h1>
            <p className="text-muted-foreground">Subscribe to exclusive trading signals and insights</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Channel
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search channels..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Channel cards will be populated here */}
          <ChannelCard
            channel={{
              id: "1",
              name: "Pro Crypto Signals",
              creator: { name: "John Trader", avatar: "/placeholder.svg?height=40&width=40" },
              description: "Daily crypto trading signals with 85% win rate",
              pricing: { monthly: 99 },
              stats: { subscribers: 1250, winRate: 85, totalSignals: 450 },
              tags: ["Crypto", "Scalping", "Technical Analysis"],
            }}
            isSubscribed={false}
            onSubscribe={() => {}}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
