import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview"
import { TopTraders } from "@/components/dashboard/TopTraders"
import { MarketOverview } from "@/components/dashboard/MarketOverview"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Portfolio Overview */}
        <PortfolioOverview />

        {/* Market Overview */}
        <MarketOverview />

        {/* Main Content */}
        <TopTraders />
      </div>
    </DashboardLayout>
  )
}
