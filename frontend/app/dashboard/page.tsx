import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview"
import { TopTraders } from "@/components/dashboard/TopTraders"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { MarketOverview } from "@/components/dashboard/MarketOverview"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Portfolio Overview */}
        <PortfolioOverview />

        {/* Market Overview */}
        <MarketOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopTraders />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
