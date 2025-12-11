"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DNDBadge } from "@/components/dashboard/dnd-badge";
import { AddToDNDModal } from "@/components/dashboard/add-to-dnd-modal";
import {
  ShieldOff,
  Plus,
  Palmtree,
  Heart,
  Star,
  Shield,
  Trash2,
  Info,
  Users,
} from "lucide-react";
import { mockDNDList, getAllEmployees, getDNDStats } from "@/lib/mock-data";
import { DNDEntry, DNDReason, maskName } from "@/lib/types";
import { formatDNDDuration, getDNDRemainingDays, isDNDActive } from "@/lib/dnd";
import { cn } from "@/lib/utils";

type FilterTab = "all" | DNDReason;

export default function DNDPage() {
  const [dndList, setDndList] = useState<DNDEntry[]>(mockDNDList);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const employees = getAllEmployees();
  const existingDNDIds = new Set(dndList.map((entry) => entry.employeeId));

  // Filter active entries only
  const activeEntries = dndList.filter(isDNDActive);

  // Apply tab filter
  const filteredEntries =
    activeFilter === "all"
      ? activeEntries
      : activeEntries.filter((entry) => entry.reason === activeFilter);

  // Stats
  const stats = {
    total: activeEntries.length,
    leave: activeEntries.filter((e) => e.reason === "leave").length,
    sensitive: activeEntries.filter((e) => e.reason === "sensitive").length,
    new_hire: activeEntries.filter((e) => e.reason === "new_hire").length,
    manual: activeEntries.filter((e) => e.reason === "manual").length,
  };

  const handleAddEntry = (entry: Omit<DNDEntry, "id" | "addedAt">) => {
    const newEntry: DNDEntry = {
      ...entry,
      id: `dnd-${Date.now()}`,
      addedAt: new Date(),
    };
    setDndList((prev) => [...prev, newEntry]);
  };

  const handleRemoveEntry = (id: string) => {
    setDndList((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Do Not Disturb List"
        description="Manage employees excluded from phishing simulations"
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        }
      />

      <main className="p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </div>
                  <div className="text-sm text-gray-500">Total Blocked</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Palmtree className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.leave}
                  </div>
                  <div className="text-sm text-gray-500">On Leave</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.sensitive}
                  </div>
                  <div className="text-sm text-gray-500">Sensitive</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.new_hire}
                  </div>
                  <div className="text-sm text-gray-500">New Hires</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.manual}
                  </div>
                  <div className="text-sm text-gray-500">Manual</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Employee Protection:</strong> Employees on this list will be
                automatically excluded from all active and future phishing simulation
                campaigns. New hires (employees with less than 30 days tenure) are
                automatically added to protect them during onboarding.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DND Table */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <ShieldOff className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Blocked Employees</CardTitle>
                  <CardDescription>
                    {filteredEntries.length} employee
                    {filteredEntries.length !== 1 ? "s" : ""} currently blocked
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter Tabs */}
            <Tabs
              value={activeFilter}
              onValueChange={(v) => setActiveFilter(v as FilterTab)}
              className="mb-4"
            >
              <TabsList>
                <TabsTrigger value="all">
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="leave">
                  <Palmtree className="h-3.5 w-3.5 mr-1.5" />
                  Leave ({stats.leave})
                </TabsTrigger>
                <TabsTrigger value="sensitive">
                  <Heart className="h-3.5 w-3.5 mr-1.5" />
                  Sensitive ({stats.sensitive})
                </TabsTrigger>
                <TabsTrigger value="new_hire">
                  <Star className="h-3.5 w-3.5 mr-1.5" />
                  New Hire ({stats.new_hire})
                </TabsTrigger>
                <TabsTrigger value="manual">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Manual ({stats.manual})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Table */}
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <ShieldOff className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No employees in this category
                </h3>
                <p className="text-sm text-gray-500">
                  {activeFilter === "all"
                    ? "Add employees to protect them from simulations"
                    : "No employees match this filter"}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Employee</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Added By</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => {
                      const remainingDays = getDNDRemainingDays(entry);
                      return (
                        <TableRow key={entry.id}>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {entry.maskedName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DNDBadge reason={entry.reason} size="sm" />
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">
                              {formatDNDDuration(entry.startDate, entry.endDate)}
                            </div>
                            {remainingDays !== null && (
                              <div className="text-xs text-gray-500">
                                {remainingDays} day{remainingDays !== 1 ? "s" : ""}{" "}
                                remaining
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div
                              className={cn(
                                "text-sm max-w-xs truncate",
                                entry.note ? "text-gray-700" : "text-gray-400 italic"
                              )}
                              title={entry.note}
                            >
                              {entry.note || "No note"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {entry.addedBy}
                            </div>
                            <div className="text-xs text-gray-400">
                              {entry.addedAt.toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveEntry(entry.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AddToDNDModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        employees={employees}
        existingDNDIds={existingDNDIds}
        onAdd={handleAddEntry}
      />
    </div>
  );
}
