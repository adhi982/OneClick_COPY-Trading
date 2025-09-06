import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard } from "lucide-react"

export const metadata: Metadata = {
  title: "My Subscriptions - Copy Trading Platform",
  description: "Manage your premium channel subscriptions",
}

export default function SubscriptionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Subscriptions</h1>
            <p className="text-muted-foreground">Manage your premium channel subscriptions and billing</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Browse Channels
          </Button>
        </div>

        {/* Active Subscriptions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Active Subscriptions</h3>
          <div className="space-y-4">
            <SubscriptionCard
              subscription={{
                id: "1",
                channel: {
                  name: "Pro Crypto Signals",
                  creator: { name: "John Trader", avatar: "/placeholder.svg?height=40&width=40" },
                },
                status: "active",
                amount: 99,
                nextBillingDate: new Date("2024-02-15"),
                startDate: new Date("2024-01-15"),
              }}
            />
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              <Badge variant="secondary">Primary</Badge>
            </div>
          </div>
        </Card>

        {/* Billing History */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Billing History</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border-b">
              <div>
                <p className="font-medium">Pro Crypto Signals - Monthly</p>
                <p className="text-sm text-muted-foreground">Jan 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">$99.00</p>
                <Badge variant="secondary">Paid</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
