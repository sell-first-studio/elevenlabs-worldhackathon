import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardHeader, StatsCards, RecentCampaigns } from "@/components/dashboard";
import { mockCampaigns, getDashboardStats } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const stats = getDashboardStats();

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Dashboard"
        description="Monitor your security campaigns and team performance"
        action={
          <Link href="/dashboard/campaigns/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        }
      />

      <main className="p-8 space-y-8">
        <StatsCards
          activeCampaigns={stats.activeCampaigns}
          totalEmployeesTested={stats.totalEmployeesTested}
          overallPassRate={stats.overallPassRate}
          pendingTraining={stats.pendingTraining}
        />

        <RecentCampaigns campaigns={mockCampaigns} />
      </main>
    </div>
  );
}
