import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { ChannelChat } from "@/components/community/ChannelChat"
import { RealtimeTradeAlert } from "@/components/subscription/RealtimeTradeAlert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, TrendingUp, Target } from "lucide-react"

export const metadata: Metadata = {
  title: "Channel Details - Copy Trading Platform",
  description: "Premium trading channel details and live chat",
}

export default function ChannelDetailsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Channel Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback>JT</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Pro Crypto Signals</h1>
                <p className="text-muted-foreground">by John Trader</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">1,250 subscribers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">85% win rate</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span className="text-sm">450 signals</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">$99/month</div>
              <Button className="mt-2">Subscribe Now</Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Signals */}
          <div className="lg:col-span-2 space-y-6">
            <RealtimeTradeAlert />
            <ChannelChat channelId={params.id} />
          </div>

          {/* Channel Stats */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Performance Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Win Rate</span>
                  <Badge variant="secondary">85%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Return</span>
                  <span className="text-green-600">+12.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Signals</span>
                  <span>450</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Since</span>
                  <span>Jan 2024</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
