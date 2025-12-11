"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Database,
  RefreshCw,
  CheckCircle2,
  Rocket,
  Lock,
  KeyRound,
  AlertTriangle,
  Users,
  ChevronDown,
  ChevronRight,
  Search,
  ShieldOff,
  Clock,
  UserX,
  ArrowRight,
  Building2,
  MapPin,
} from "lucide-react";
import { ExclusionWarning } from "@/components/dashboard/exclusion-warning";
import {
  mockDNDList,
  mockSafeHoursConfig,
  mockHRDatabase,
  mockDepartmentHierarchy,
  mockUserPermissions,
  getAccessibleEmployeeCount,
  getEmployeesForDepartments,
  DepartmentHierarchy,
} from "@/lib/mock-data";
import { Campaign, Employee, Department, maskName } from "@/lib/types";
import { mockIsWithinSafeHours } from "@/lib/safe-hours";
import { useCampaigns } from "@/contexts/campaign-context";

export default function NewCampaignPage() {
  const router = useRouter();
  const { addCampaign } = useCampaigns();
  const [campaignName, setCampaignName] = useState("");
  const [complianceChecked, setComplianceChecked] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(mockHRDatabase.lastSynced);

  // Department selection state
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set(['dept-eng', 'dept-sales']));
  const [departmentSearch, setDepartmentSearch] = useState("");

  // Preview dialog state
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewType, setPreviewType] = useState<'all' | 'dnd' | 'safe_hours'>('all');

  // Format last synced time
  const formatLastSynced = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastSynced(new Date());
    setIsRefreshing(false);
  };

  // Get all department IDs including children
  const getAllDepartmentIds = useCallback((dept: DepartmentHierarchy): string[] => {
    const ids = [dept.id];
    if (dept.children) {
      dept.children.forEach(child => {
        ids.push(...getAllDepartmentIds(child));
      });
    }
    return ids;
  }, []);

  // Toggle department selection
  const handleToggleDepartment = useCallback((deptId: string, dept: DepartmentHierarchy) => {
    setSelectedDepartments(prev => {
      const next = new Set(prev);
      const allIds = getAllDepartmentIds(dept);

      if (next.has(deptId)) {
        // Deselect this and all children
        allIds.forEach(id => next.delete(id));
      } else {
        // Select this and all children (if accessible)
        allIds.forEach(id => {
          if (mockUserPermissions.accessibleDepartmentIds.includes(id)) {
            next.add(id);
          }
        });
      }
      return next;
    });
  }, [getAllDepartmentIds]);

  // Toggle expand/collapse
  const handleToggleExpand = useCallback((deptId: string) => {
    setExpandedDepartments(prev => {
      const next = new Set(prev);
      if (next.has(deptId)) {
        next.delete(deptId);
      } else {
        next.add(deptId);
      }
      return next;
    });
  }, []);

  // Select all accessible departments
  const handleSelectAll = useCallback(() => {
    setSelectedDepartments(new Set(mockUserPermissions.accessibleDepartmentIds));
  }, []);

  // Clear all selections
  const handleClearAll = useCallback(() => {
    setSelectedDepartments(new Set());
  }, []);

  // Filter departments by search
  const filteredDepartments = useMemo(() => {
    if (!departmentSearch) return mockDepartmentHierarchy;

    const searchLower = departmentSearch.toLowerCase();
    const matchingIds = new Set<string>();

    function findMatches(depts: DepartmentHierarchy[]) {
      depts.forEach(dept => {
        if (dept.name.toLowerCase().includes(searchLower)) {
          matchingIds.add(dept.id);
        }
        if (dept.children) findMatches(dept.children);
      });
    }
    findMatches(mockDepartmentHierarchy);

    // Include parents of matching departments
    function addParents(depts: DepartmentHierarchy[], parentId?: string) {
      depts.forEach(dept => {
        if (dept.children) {
          dept.children.forEach(child => {
            if (matchingIds.has(child.id)) {
              matchingIds.add(dept.id);
            }
          });
          addParents(dept.children, dept.id);
        }
      });
    }
    addParents(mockDepartmentHierarchy);

    return mockDepartmentHierarchy.filter(d => matchingIds.has(d.id));
  }, [departmentSearch]);

  // Calculate selected employee count
  const selectedEmployeeCount = useMemo(() => {
    let count = 0;
    const countedDepts = new Set<string>();

    function countDept(dept: DepartmentHierarchy) {
      if (selectedDepartments.has(dept.id) && !countedDepts.has(dept.id)) {
        // If this dept has children and some are selected, don't count parent
        if (dept.children && dept.children.some(c => selectedDepartments.has(c.id))) {
          dept.children.forEach(countDept);
        } else {
          count += dept.employeeCount;
          countedDepts.add(dept.id);
        }
      } else if (dept.children) {
        dept.children.forEach(countDept);
      }
    }

    mockDepartmentHierarchy.forEach(countDept);
    return count;
  }, [selectedDepartments]);

  // Generate mock employees for selected departments
  const selectedEmployees = useMemo(() => {
    return getEmployeesForDepartments(Array.from(selectedDepartments));
  }, [selectedDepartments]);

  // Calculate exclusions
  const exclusionStats = useMemo(() => {
    const dndExcluded = selectedEmployees.filter(emp =>
      mockDNDList.some(dnd => dnd.employeeName === emp.name)
    );

    const safeHoursExcluded = selectedEmployees.filter(emp =>
      !mockIsWithinSafeHours(emp.id) && !dndExcluded.some(d => d.id === emp.id)
    );

    const dndByReason = {
      leave: dndExcluded.filter(e => mockDNDList.find(d => d.employeeName === e.name)?.reason === 'leave').length,
      sensitive: dndExcluded.filter(e => mockDNDList.find(d => d.employeeName === e.name)?.reason === 'sensitive').length,
      new_hire: dndExcluded.filter(e => mockDNDList.find(d => d.employeeName === e.name)?.reason === 'new_hire').length,
      manual: dndExcluded.filter(e => mockDNDList.find(d => d.employeeName === e.name)?.reason === 'manual').length,
    };

    return {
      total: selectedEmployeeCount,
      dndTotal: dndExcluded.length,
      dndByReason,
      safeHours: safeHoursExcluded.length,
      final: selectedEmployeeCount - dndExcluded.length - safeHoursExcluded.length,
    };
  }, [selectedEmployees, selectedEmployeeCount]);

  // Calculate accessible employee percentage
  const accessibleCount = getAccessibleEmployeeCount();
  const accessPercentage = Math.round((accessibleCount / mockHRDatabase.totalEmployees) * 100);

  const canLaunch = campaignName.trim() && selectedDepartments.size > 0 && complianceChecked && exclusionStats.final > 0;

  // Generate department stats from selected employees
  const generateDepartmentsFromSelection = (): Department[] => {
    const deptMap = new Map<string, Employee[]>();

    selectedEmployees.forEach(emp => {
      const existing = deptMap.get(emp.department) || [];
      deptMap.set(emp.department, [...existing, emp]);
    });

    return Array.from(deptMap.entries()).map(([name, emps], index) => ({
      id: `dept-${index}`,
      name,
      employeeCount: emps.length,
      passCount: 0,
      failCount: 0,
      inProgressCount: 0,
      passRate: 0,
      failRate: 0,
    }));
  };

  const handleLaunch = async () => {
    if (!canLaunch) return;

    setIsLaunching(true);

    // Build the new campaign object
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: campaignName,
      description: `Campaign targeting ${exclusionStats.final} employees across ${selectedDepartments.size} departments`,
      createdAt: new Date(),
      startedAt: new Date(),
      status: 'running',
      employees: selectedEmployees.map(emp => ({
        ...emp,
        status: 'pending' as const,
      })),
      departments: generateDepartmentsFromSelection(),
      metrics: {
        totalTargeted: exclusionStats.final,
        inProgress: 0,
        completed: 0,
        passed: 0,
        failed: 0,
        passRate: 0,
        failRate: 0,
      },
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add to context
    addCampaign(newCampaign);

    // Navigate to campaigns list
    router.push("/dashboard/campaigns");
  };

  // Render department row
  const renderDepartmentRow = (dept: DepartmentHierarchy, level: number = 0) => {
    const isAccessible = mockUserPermissions.accessibleDepartmentIds.includes(dept.id);
    const isRestricted = dept.isRestricted;
    const isSelected = selectedDepartments.has(dept.id);
    const isExpanded = expandedDepartments.has(dept.id);
    const hasChildren = dept.children && dept.children.length > 0;

    // Check if partially selected (some but not all children selected)
    const isPartiallySelected = hasChildren && dept.children!.some(c => selectedDepartments.has(c.id))
      && !dept.children!.every(c => selectedDepartments.has(c.id));

    return (
      <div key={dept.id}>
        <div
          className={`flex items-center justify-between p-3 hover:bg-gray-50 border-b ${
            level > 0 ? 'border-l-2 border-blue-100' : ''
          } ${isRestricted ? 'bg-gray-50 opacity-60' : ''}`}
          style={{ paddingLeft: `${12 + level * 24}px` }}
        >
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <button
                onClick={() => handleToggleExpand(dept.id)}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-5" />
            )}

            {isRestricted ? (
              <div className="h-4 w-4 flex items-center justify-center">
                <Lock className="h-3.5 w-3.5 text-gray-400" />
              </div>
            ) : (
              <Checkbox
                checked={isSelected}
                disabled={!isAccessible}
                onCheckedChange={() => handleToggleDepartment(dept.id, dept)}
                className={isPartiallySelected ? 'data-[state=checked]:bg-blue-300' : ''}
              />
            )}

            <span className={`font-medium ${isRestricted ? 'text-gray-400' : 'text-gray-900'}`}>
              {dept.name}
            </span>

            {isRestricted && (
              <Badge variant="outline" className="text-xs text-gray-400 border-gray-300">
                Restricted
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            {dept.employeeCount}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {dept.children!.map(child => renderDepartmentRow(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="New Campaign"
        description="Create a new voice phishing simulation campaign"
      />

      <main className="p-8 space-y-6">
        {/* Campaign Name */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Campaign Details</CardTitle>
            <CardDescription>Give your campaign a descriptive name</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g., Q4 Security Assessment"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Feature 1: Database Connection Status Header */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    Connected to {mockHRDatabase.provider}
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Live</Badge>
                  </h3>
                  <p className="text-sm text-gray-600">
                    Last synced: {formatLastSynced(lastSynced)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Syncing...' : 'Refresh'}
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 mt-4 pt-4 border-t border-blue-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{mockHRDatabase.totalEmployees.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Employees</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{mockHRDatabase.totalDepartments}</p>
                <p className="text-xs text-gray-500">Departments</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{mockHRDatabase.totalLocations}</p>
                <p className="text-xs text-gray-500">Locations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature 7: Access Control Indicator */}
        <Card className="border-0 shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Your Targeting Permissions</h3>
                <p className="text-sm text-gray-500">Role: {mockUserPermissions.role}</p>

                {/* Accessible departments */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">You can target:</p>
                  <div className="flex flex-wrap gap-2">
                    {mockDepartmentHierarchy
                      .filter(d => !d.isRestricted)
                      .slice(0, 5)
                      .map(dept => (
                        <div
                          key={dept.id}
                          className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100"
                          onClick={() => handleToggleDepartment(dept.id, dept)}
                        >
                          <p className="font-medium text-green-900 text-sm">{dept.name}</p>
                          <p className="text-xs text-green-600">{dept.employeeCount} employees</p>
                        </div>
                      ))}
                    {mockDepartmentHierarchy.filter(d => !d.isRestricted).length > 5 && (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-500">
                          +{mockDepartmentHierarchy.filter(d => !d.isRestricted).length - 5} more
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Access percentage */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Total access</span>
                    <span className="font-medium">{accessibleCount.toLocaleString()} of {mockHRDatabase.totalEmployees.toLocaleString()} ({accessPercentage}%)</span>
                  </div>
                  <Progress value={accessPercentage} className="h-2" />
                </div>

                {/* Restricted notice */}
                {mockUserPermissions.restrictedDepartmentIds.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Restricted departments:</p>
                        <p className="text-sm text-amber-700">
                          {mockDepartmentHierarchy
                            .filter(d => d.isRestricted)
                            .map(d => d.name)
                            .join(", ")} (requires Admin approval)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Request access button */}
                <Button variant="outline" size="sm" className="mt-4">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Request Broader Access
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main selection area - two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature 2: Department-Based Selection */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Select Target Audience</CardTitle>
              <CardDescription>
                Choose departments or teams to include in this campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search departments..."
                  value={departmentSearch}
                  onChange={(e) => setDepartmentSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Department tree */}
              <div className="border rounded-lg max-h-[400px] overflow-y-auto">
                {filteredDepartments.map(dept => renderDepartmentRow(dept))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedDepartments(new Set(mockDepartmentHierarchy.map(d => d.id)))}
                >
                  Expand All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedDepartments(new Set())}
                >
                  Collapse All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feature 5: Selection Summary Panel */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Selection Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Total selected */}
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Total Selected</span>
                  <span className="text-2xl font-bold">{exclusionStats.total}</span>
                </div>

                {/* Exclusions */}
                {exclusionStats.total > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-500">Exclusions Applied:</p>

                    {/* DND exclusions */}
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ShieldOff className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium">Do Not Disturb List</p>
                            <p className="text-xs text-gray-500">Protected employees</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-red-600">-{exclusionStats.dndTotal}</span>
                          {exclusionStats.dndTotal > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setPreviewType('dnd');
                                setShowPreviewDialog(true);
                              }}
                            >
                              view
                            </Button>
                          )}
                        </div>
                      </div>
                      {exclusionStats.dndTotal > 0 && (
                        <div className="mt-2 pl-8 space-y-1 text-sm text-gray-500">
                          {exclusionStats.dndByReason.leave > 0 && (
                            <p>• On leave ({exclusionStats.dndByReason.leave})</p>
                          )}
                          {exclusionStats.dndByReason.sensitive > 0 && (
                            <p>• Sensitive situation ({exclusionStats.dndByReason.sensitive})</p>
                          )}
                          {exclusionStats.dndByReason.new_hire > 0 && (
                            <p>• New hire protection ({exclusionStats.dndByReason.new_hire})</p>
                          )}
                          {exclusionStats.dndByReason.manual > 0 && (
                            <p>• Manual exclusion ({exclusionStats.dndByReason.manual})</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Safe hours exclusions */}
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-amber-500" />
                          <div>
                            <p className="font-medium">Outside Safe Hours</p>
                            <p className="text-xs text-gray-500">Based on employee timezones</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-600">-{exclusionStats.safeHours}</span>
                          {exclusionStats.safeHours > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setPreviewType('safe_hours');
                                setShowPreviewDialog(true);
                              }}
                            >
                              view
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Final count */}
                <div className="flex justify-between items-center pt-4 border-t bg-green-50 -mx-6 px-6 py-4 rounded-b-lg mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Final Recipients</span>
                  </div>
                  <span className="text-2xl font-bold text-green-700">{exclusionStats.final}</span>
                </div>

                {/* Preview button */}
                {selectedDepartments.size > 0 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => {
                      setPreviewType('all');
                      setShowPreviewDialog(true);
                    }}
                  >
                    Preview All Recipients
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                {/* Empty state */}
                {selectedDepartments.size === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <UserX className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No departments selected</p>
                    <p className="text-sm">Select departments from the left panel</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Disclaimer */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Compliance Confirmation</CardTitle>
            <CardDescription>
              Review and confirm compliance with all applicable policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
              <p>By launching this campaign, you confirm that:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>You have authorization from your organization to conduct this simulation</li>
                <li>All targeted employees have been notified that security testing may occur</li>
                <li>This campaign complies with all applicable laws and regulations</li>
                <li>The data collected will be used solely for security training purposes</li>
                <li>Results will be handled with appropriate confidentiality</li>
              </ul>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="compliance"
                checked={complianceChecked}
                onCheckedChange={(checked) => setComplianceChecked(checked === true)}
              />
              <label htmlFor="compliance" className="text-sm text-gray-700 cursor-pointer">
                I confirm this campaign follows all ethical, legal, and internal corporate policies
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Launch Button */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Ready to Launch</h3>
                <p className="text-sm text-gray-500">
                  {!campaignName.trim() && "Enter a campaign name • "}
                  {selectedDepartments.size === 0 && "Select target departments • "}
                  {!complianceChecked && "Confirm compliance"}
                  {canLaunch && (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      All requirements met • {exclusionStats.final} recipients
                    </span>
                  )}
                </p>
              </div>
              <Button
                size="lg"
                className={`${canLaunch ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
                disabled={!canLaunch || isLaunching}
                onClick={handleLaunch}
              >
                {isLaunching ? (
                  <>Launching...</>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Launch Campaign
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {previewType === 'all' && 'All Recipients'}
                {previewType === 'dnd' && 'DND Exclusions'}
                {previewType === 'safe_hours' && 'Safe Hours Exclusions'}
              </DialogTitle>
              <DialogDescription>
                {previewType === 'all' && `${exclusionStats.final} employees will receive this campaign`}
                {previewType === 'dnd' && `${exclusionStats.dndTotal} employees excluded by DND list`}
                {previewType === 'safe_hours' && `${exclusionStats.safeHours} employees excluded by safe hours`}
              </DialogDescription>
            </DialogHeader>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  {previewType === 'dnd' && <TableHead>Reason</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedEmployees.slice(0, 20).map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.maskedName}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    {previewType === 'dnd' && (
                      <TableCell>
                        <Badge variant="outline">
                          {mockDNDList.find(d => d.employeeName === emp.name)?.reason || 'N/A'}
                        </Badge>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {selectedEmployees.length > 20 && (
                  <TableRow>
                    <TableCell colSpan={previewType === 'dnd' ? 3 : 2} className="text-center text-gray-500">
                      ... and {selectedEmployees.length - 20} more employees
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
