"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee, DNDReason, DND_REASONS, DNDEntry, maskName } from "@/lib/types";
import { Palmtree, Heart, Star, Shield, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToDNDModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  existingDNDIds: Set<string>;
  onAdd: (entry: Omit<DNDEntry, "id" | "addedAt">) => void;
}

const reasonIcons = {
  leave: Palmtree,
  sensitive: Heart,
  new_hire: Star,
  manual: Shield,
};

export function AddToDNDModal({
  open,
  onOpenChange,
  employees,
  existingDNDIds,
  onAdd,
}: AddToDNDModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [reason, setReason] = useState<DNDReason>("leave");
  const [note, setNote] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [indefinite, setIndefinite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter employees that aren't already on DND
  const availableEmployees = employees.filter(
    (emp) => !existingDNDIds.has(emp.id)
  );

  const filteredEmployees = searchQuery
    ? availableEmployees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableEmployees.slice(0, 10);

  const handleSubmit = () => {
    if (!selectedEmployee) return;

    onAdd({
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      maskedName: maskName(selectedEmployee.name),
      reason,
      note: note || undefined,
      startDate: new Date(startDate),
      endDate: indefinite ? undefined : endDate ? new Date(endDate) : undefined,
      addedBy: "HR Admin", // Mock user
    });

    // Reset form
    setSelectedEmployee(null);
    setReason("leave");
    setNote("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("");
    setIndefinite(false);
    setSearchQuery("");
    onOpenChange(false);
  };

  const resetAndClose = () => {
    setSelectedEmployee(null);
    setReason("leave");
    setNote("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("");
    setIndefinite(false);
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Employee to Do Not Disturb List</DialogTitle>
          <DialogDescription>
            Select an employee and specify the reason for adding them to the DND list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Employee Search/Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select Employee
            </label>
            {selectedEmployee ? (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {selectedEmployee.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedEmployee.department}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEmployee(null)}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                  {filteredEmployees.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      {searchQuery
                        ? "No matching employees found"
                        : "All employees are already on the DND list"}
                    </div>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => setSelectedEmployee(emp)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 text-left"
                      >
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {emp.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {emp.department}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Reason</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(DND_REASONS) as DNDReason[])
                .filter((r) => r !== "new_hire") // New hire is auto-detected
                .map((reasonKey) => {
                  const Icon = reasonIcons[reasonKey];
                  const config = DND_REASONS[reasonKey];
                  return (
                    <button
                      key={reasonKey}
                      onClick={() => setReason(reasonKey)}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border text-left transition-colors",
                        reason === reasonKey
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{config.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any additional context..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            />
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Duration</label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              {!indefinite && (
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="indefinite"
                checked={indefinite}
                onCheckedChange={(checked) => setIndefinite(checked === true)}
              />
              <label
                htmlFor="indefinite"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Indefinite (no end date)
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedEmployee}>
            Add to DND List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
