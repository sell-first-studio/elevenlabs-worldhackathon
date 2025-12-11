"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockCampaigns } from "@/lib/mock-data";
import { Department, Employee } from "@/lib/types";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

function getStatusBadge(status: string) {
  switch (status) {
    case 'running':
      return <Badge className="bg-green-100 text-green-700">Running</Badge>;
    case 'completed':
      return <Badge className="bg-gray-100 text-gray-700">Completed</Badge>;
    case 'draft':
      return <Badge className="bg-yellow-100 text-yellow-700">Draft</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getResultBadge(result?: 'passed' | 'failed', status?: string) {
  if (status === 'in_progress') {
    return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
  }
  if (status === 'pending') {
    return <Badge className="bg-gray-100 text-gray-500">Pending</Badge>;
  }
  if (result === 'passed') {
    return <Badge className="bg-green-100 text-green-700">Passed</Badge>;
  }
  if (result === 'failed') {
    return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
  }
  return <Badge variant="secondary">Unknown</Badge>;
}

interface DepartmentCardProps {
  department: Department;
  employees: Employee[];
}

function DepartmentCard({ department, employees }: DepartmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const deptEmployees = employees.filter(e => e.department === department.name);

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">{department.name}</h3>
              <p className="text-sm text-gray-500">{department.employeeCount} employees</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-600 font-medium">{department.passRate}% passed</span>
                <span className="text-red-600 font-medium">{department.failRate}% failed</span>
              </div>
              <Progress
                value={department.passRate}
                className="w-32 h-2 mt-1"
              />
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deptEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.maskedName}</TableCell>
                    <TableCell className="capitalize">{employee.status.replace('_', ' ')}</TableCell>
                    <TableCell>{getResultBadge(employee.result, employee.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;

  // Find the campaign (in real app, this would be an API call)
  const campaign = mockCampaigns.find(c => c.id === campaignId) || mockCampaigns[0];

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={campaign.name}
        description={campaign.description}
        action={
          <Link href="/dashboard/campaigns">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          </Link>
        }
      />

      <main className="p-8 space-y-6">
        {/* Status and Key Metrics */}
        <div className="flex items-center gap-4 mb-2">
          {getStatusBadge(campaign.status)}
          <span className="text-sm text-gray-500">
            Created {campaign.createdAt.toLocaleDateString()}
          </span>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Targeted</p>
                  <p className="text-3xl font-semibold text-gray-900">{campaign.metrics.totalTargeted}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <p className="text-3xl font-semibold text-gray-900">{campaign.metrics.inProgress}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pass Rate</p>
                  <p className="text-3xl font-semibold text-green-600">{campaign.metrics.passRate}%</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Fail Rate</p>
                  <p className="text-3xl font-semibold text-red-600">{campaign.metrics.failRate}%</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              Campaign Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completion</span>
                <span className="font-medium text-gray-900">
                  {campaign.metrics.completed} of {campaign.metrics.totalTargeted} ({Math.round((campaign.metrics.completed / campaign.metrics.totalTargeted) * 100)}%)
                </span>
              </div>
              <Progress
                value={(campaign.metrics.completed / campaign.metrics.totalTargeted) * 100}
                className="h-3"
              />
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-gray-600">Passed: {campaign.metrics.passed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-gray-600">Failed: {campaign.metrics.failed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-gray-600">In Progress: {campaign.metrics.inProgress}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department Breakdown */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h2>
          <p className="text-sm text-gray-500 mb-4">Click on a department to see individual employee results (names masked for privacy)</p>
          <div className="space-y-3">
            {campaign.departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                employees={campaign.employees}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
