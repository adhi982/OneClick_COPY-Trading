import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { CreateChannelForm } from "@/components/community/CreateChannelForm"

export const metadata: Metadata = {
  title: "Create Channel - Copy Trading Platform",
  description: "Create your own premium trading channel",
}

export default function CreateChannelPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Premium Channel</h1>
          <p className="text-muted-foreground">Start sharing your trading expertise and earn from subscriptions</p>
        </div>
        <CreateChannelForm />
      </div>
    </DashboardLayout>
  )
}
