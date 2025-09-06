import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Leaderboard } from "@/components/community/Leaderboard"
import { TopPerformers } from "@/components/community/TopPerformers"

export const metadata: Metadata = {
  title: "Leaderboard - Copy Trading Platform",
  description: "Top performing traders and community rankings",
}

export default function LeaderboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Community Leaderboard</h1>
          <p className="text-muted-foreground">Discover top performing traders and community leaders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Leaderboard />
          </div>
          <div>
            <TopPerformers />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
