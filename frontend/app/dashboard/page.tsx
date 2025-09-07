import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { RealTimePortfolioOverview } from "@/components/dashboard/RealTimePortfolioOverview"
import { TopTraders } from "@/components/dashboard/TopTraders"
import { MarketDataDashboard } from "@/components/dashboard/MarketDataDashboard"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Real-Time Portfolio Overview */}
        <RealTimePortfolioOverview />

        {/* Real-Time Market Overview */}
        <MarketDataDashboard />

        {/* Top Traders */}
        <TopTraders />
      </div>
    </DashboardLayout>
  )
}
