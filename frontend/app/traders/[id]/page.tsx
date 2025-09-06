import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { TraderProfile } from "@/components/trader/TraderProfile"

interface TraderProfilePageProps {
  params: {
    id: string
  }
}

export default function TraderProfilePage({ params }: TraderProfilePageProps) {
  return (
    <DashboardLayout>
      <TraderProfile traderId={params.id} />
    </DashboardLayout>
  )
}
