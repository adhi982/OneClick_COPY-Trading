import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { MyChannelsHub } from "@/components/community/MyChannelsHub"

export const metadata: Metadata = {
  title: "My Channels - Copy Trading Platform",
  description: "Manage your subscribed channels and create new ones",
}

export default function MyChannelsPage() {
  return (
    <DashboardLayout>
      <MyChannelsHub />
    </DashboardLayout>
  )
}
