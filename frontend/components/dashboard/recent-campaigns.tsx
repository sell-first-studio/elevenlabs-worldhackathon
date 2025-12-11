"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Campaign } from "@/lib/types";

interface RecentCampaignsProps {
  campaigns: Campaign[];
}

function getStatusColor(status: Campaign['status']) {
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

export function RecentCampaigns({ campaigns }: RecentCampaignsProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Recent Campaigns</CardTitle>
        <Link href="/dashboard/campaigns">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.slice(0, 3).map((campaign) => (
            <Link
              key={campaign.id}
              href={`/dashboard/campaigns/${campaign.id}`}
              className="block p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>{campaign.metrics.totalTargeted} employees</span>
                <span>{campaign.metrics.passRate}% pass rate</span>
                <span>{campaign.metrics.completed} completed</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
