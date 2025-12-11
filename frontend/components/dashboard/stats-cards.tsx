"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, TrendingUp, GraduationCap } from "lucide-react";

interface StatsCardsProps {
  activeCampaigns: number;
  totalEmployeesTested: number;
  overallPassRate: number;
  pendingTraining: number;
}

export function StatsCards({
  activeCampaigns,
  totalEmployeesTested,
  overallPassRate,
  pendingTraining
}: StatsCardsProps) {
  const stats = [
    {
      name: "Active Campaigns",
      value: activeCampaigns,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "Employees Tested",
      value: totalEmployeesTested,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      name: "Overall Pass Rate",
      value: `${overallPassRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      name: "Pending Training",
      value: pendingTraining,
      icon: GraduationCap,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
