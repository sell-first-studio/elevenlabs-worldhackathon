"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { DashboardHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockCampaigns, mockRewards } from "@/lib/mock-data";
import { Reward } from "@/lib/types";
import {
  Gift,
  ExternalLink,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Package,
  Send,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search
} from "lucide-react";

function getCategoryIcon(category: Reward['category']) {
  switch (category) {
    case 'gift_card':
      return CreditCard;
    case 'experience':
      return Sparkles;
    case 'merchandise':
      return Package;
    default:
      return Gift;
  }
}

type SortKey = 'name' | 'department' | 'achievement';
type SortDirection = 'asc' | 'desc';

export default function RewardsPage() {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [achievementFilter, setAchievementFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  // Get employees who passed or completed training
  const eligibleEmployees = mockCampaigns.flatMap(campaign =>
    campaign.employees.filter(e =>
      e.result === 'passed' || e.trainingStatus === 'completed'
    )
  );

  // Get unique departments for filter dropdown
  const departments = useMemo(() => {
    const depts = [...new Set(eligibleEmployees.map(e => e.department))];
    return depts.sort();
  }, [eligibleEmployees]);

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let result = eligibleEmployees;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(e =>
        e.maskedName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter(e => e.department === departmentFilter);
    }

    // Apply achievement filter
    if (achievementFilter !== "all") {
      result = result.filter(e => {
        if (achievementFilter === "passed") return e.result === 'passed';
        if (achievementFilter === "training") return e.trainingStatus === 'completed' && e.result !== 'passed';
        return true;
      });
    }

    // Apply sorting
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        let aValue: string;
        let bValue: string;

        switch (sortConfig.key) {
          case 'name':
            aValue = a.maskedName;
            bValue = b.maskedName;
            break;
          case 'department':
            aValue = a.department;
            bValue = b.department;
            break;
          case 'achievement':
            aValue = a.result === 'passed' ? 'Passed Test' : 'Completed Training';
            bValue = b.result === 'passed' ? 'Passed Test' : 'Completed Training';
            break;
          default:
            return 0;
        }

        if (sortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    return result;
  }, [eligibleEmployees, searchQuery, departmentFilter, achievementFilter, sortConfig]);

  const handleSort = (key: SortKey) => {
    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        return null; // Remove sort on third click
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="ml-1 h-4 w-4 text-gray-700" />
      : <ArrowDown className="ml-1 h-4 w-4 text-gray-700" />;
  };

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees.map(e => e.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSendReward = () => {
    setShowConfirmDialog(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedEmployees([]);
      setSelectedReward(null);
    }, 3000);
  };

  const estimatedCost = selectedReward && selectedEmployees.length > 0
    ? `$${parseInt(selectedReward.value.replace('$', '')) * selectedEmployees.length}`
    : '$0';

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Rewards"
        description="Recognize and reward security-conscious employees"
      />

      <main className="p-8 space-y-8">
        {/* &Open Integration Header */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Gift className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    Powered by &Open
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Connected
                    </Badge>
                  </h3>
                  <p className="text-sm text-gray-600">
                    Send thoughtful gifts to recognize your team's security awareness
                  </p>
                </div>
              </div>
              <a
                href="https://andopen.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                Visit &Open
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Gift Selection */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Reward</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {mockRewards.map((reward) => {
              const Icon = getCategoryIcon(reward.category);
              const isSelected = selectedReward?.id === reward.id;

              return (
                <Card
                  key={reward.id}
                  className={`border-0 shadow-sm cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedReward(isSelected ? null : reward)}
                >
                  <CardContent className="p-6">
                    <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      <Icon className="h-16 w-16 text-gray-300" />
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                      <span className="text-lg font-semibold text-emerald-600">{reward.value}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{reward.description}</p>
                    <Badge variant="secondary" className="mt-3 capitalize">
                      {reward.category.replace('_', ' ')}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Eligible Recipients */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Eligible Recipients</CardTitle>
                <CardDescription>
                  {filteredEmployees.length} of {eligibleEmployees.length} employees shown
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                {selectedEmployees.length > 0 && (
                  <Badge className="bg-emerald-100 text-emerald-700">
                    {selectedEmployees.length} selected
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by employee name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={achievementFilter} onValueChange={setAchievementFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Achievement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Achievements</SelectItem>
                  <SelectItem value="passed">Passed Test</SelectItem>
                  <SelectItem value="training">Completed Training</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredEmployees.length > 0 && filteredEmployees.every(e => selectedEmployees.includes(e.id))}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center hover:text-gray-900"
                      onClick={() => handleSort('name')}
                    >
                      Employee
                      {getSortIcon('name')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center hover:text-gray-900"
                      onClick={() => handleSort('department')}
                    >
                      Department
                      {getSortIcon('department')}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center hover:text-gray-900"
                      onClick={() => handleSort('achievement')}
                    >
                      Achievement
                      {getSortIcon('achievement')}
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      No employees match the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={(checked) =>
                            handleSelectEmployee(employee.id, checked === true)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{employee.maskedName}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        {employee.result === 'passed' ? (
                          <Badge className="bg-green-100 text-green-700">Passed Test</Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-700">Completed Training</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Send Reward Action */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Ready to Send</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>
                    {selectedReward ? selectedReward.name : 'No reward selected'}
                  </span>
                  <span>•</span>
                  <span>{selectedEmployees.length} recipients</span>
                  <span>•</span>
                  <span className="font-medium text-gray-900">Estimated: {estimatedCost}</span>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={!selectedReward || selectedEmployees.length === 0}
                onClick={() => setShowConfirmDialog(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Reward
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Reward</DialogTitle>
              <DialogDescription>
                You're about to send rewards to {selectedEmployees.length} employees
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedReward?.name}</p>
                  <p className="text-sm text-gray-500">{selectedReward?.value} per recipient</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-gray-600">Total recipients</span>
                <span className="font-medium">{selectedEmployees.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-gray-600">Estimated total</span>
                <span className="font-semibold text-lg text-emerald-600">{estimatedCost}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSendReward}
              >
                Confirm & Send
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="text-center">
            <div className="py-6">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <DialogTitle className="text-xl mb-2">Rewards Sent!</DialogTitle>
              <DialogDescription>
                {selectedEmployees.length} employees will receive their {selectedReward?.name} reward.
                They'll receive an email from &Open with redemption instructions.
              </DialogDescription>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
