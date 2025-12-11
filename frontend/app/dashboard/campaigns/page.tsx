"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard";
import { useCampaigns } from "@/contexts/campaign-context";
import { Plus, Calendar, Users, TrendingUp } from "lucide-react";

function getStatusColor(status: string) {
  switch (status) {
    case 'running':
      return 'bg-green-100 text-green-700';
    case 'completed':
      return 'bg-gray-100 text-gray-700';
    case 'draft':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function CampaignsPage() {
  const { campaigns } = useCampaigns();

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Campaigns"
        description="Manage your voice phishing simulation campaigns"
        action={
          <Link href="/dashboard/campaigns/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        }
      />

      <main className="p-8">
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.id}`}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-gray-500">{campaign.description}</p>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{campaign.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{campaign.metrics.totalTargeted} employees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span>{campaign.metrics.passRate}% pass rate</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="text-green-600 font-medium">{campaign.metrics.passed}</span> passed /
                      <span className="text-red-600 font-medium ml-1">{campaign.metrics.failed}</span> failed
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
