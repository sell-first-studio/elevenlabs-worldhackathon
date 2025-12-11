"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, FileText, CheckCircle2, AlertCircle, Rocket } from "lucide-react";
import Papa from "papaparse";
import { ExclusionWarning } from "@/components/dashboard/exclusion-warning";
import { mockDNDList, mockSafeHoursConfig } from "@/lib/mock-data";
import { Employee, maskName } from "@/lib/types";
import { mockIsWithinSafeHours } from "@/lib/safe-hours";

interface ParsedEmployee {
  name: string;
  phone: string;
  email?: string;
  department?: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [campaignName, setCampaignName] = useState("");
  const [employees, setEmployees] = useState<ParsedEmployee[]>([]);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [complianceChecked, setComplianceChecked] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setParseError(null);
    setCsvFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, string>[];

        // Validate required columns
        if (data.length === 0) {
          setParseError("CSV file is empty");
          return;
        }

        const firstRow = data[0];
        const hasName = 'name' in firstRow || 'Name' in firstRow || 'NAME' in firstRow;
        const hasPhone = 'phone' in firstRow || 'Phone' in firstRow || 'PHONE' in firstRow;

        if (!hasName || !hasPhone) {
          setParseError("CSV must contain 'name' and 'phone' columns");
          return;
        }

        // Parse employees
        const parsed: ParsedEmployee[] = data.map((row) => ({
          name: row.name || row.Name || row.NAME || '',
          phone: row.phone || row.Phone || row.PHONE || '',
          email: row.email || row.Email || row.EMAIL,
          department: row.department || row.Department || row.DEPARTMENT || 'Unassigned'
        })).filter(emp => emp.name && emp.phone);

        setEmployees(parsed);
      },
      error: (error) => {
        setParseError(`Failed to parse CSV: ${error.message}`);
      }
    });
  }, []);

  // Convert parsed employees to Employee type for exclusion checks
  const employeesAsType: Employee[] = useMemo(() => {
    return employees.map((emp, index) => ({
      id: `new-emp-${index}`,
      name: emp.name,
      maskedName: maskName(emp.name),
      phone: emp.phone,
      email: emp.email || '',
      department: emp.department || 'Unassigned',
      status: 'pending' as const,
      // Generate mock hire dates - some new, some old
      hireDate: index < 2
        ? new Date(Date.now() - Math.floor(Math.random() * 20 + 5) * 24 * 60 * 60 * 1000) // New hire
        : new Date(Date.now() - Math.floor(Math.random() * 365 + 60) * 24 * 60 * 60 * 1000), // Veteran
    }));
  }, [employees]);

  // Calculate which employees are blocked by safe hours
  const safeHoursBlockedIds = useMemo(() => {
    if (!mockSafeHoursConfig.enabled) return new Set<string>();
    return new Set(
      employeesAsType
        .filter((emp) => !mockIsWithinSafeHours(emp.id))
        .map((emp) => emp.id)
    );
  }, [employeesAsType]);

  const canLaunch = campaignName.trim() && employees.length > 0 && complianceChecked;

  const handleLaunch = async () => {
    if (!canLaunch) return;

    setIsLaunching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/dashboard/campaigns");
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="New Campaign"
        description="Create a new voice phishing simulation campaign"
      />

      <main className="p-8 max-w-4xl space-y-6">
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

        {/* CSV Upload */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Upload Employees</CardTitle>
            <CardDescription>
              Upload a CSV file with employee names and phone numbers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                {csvFileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-12 w-12 text-blue-600" />
                    <p className="font-medium text-gray-900">{csvFileName}</p>
                    <p className="text-sm text-gray-500">{employees.length} employees loaded</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Replace File
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <p className="font-medium text-gray-900">Drop your CSV here or click to upload</p>
                    <p className="text-sm text-gray-500">Required columns: name, phone</p>
                  </div>
                )}
              </label>
            </div>

            {parseError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}

            {/* Preview Table */}
            {employees.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.slice(0, 5).map((emp, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell>{emp.phone}</TableCell>
                        <TableCell>{emp.department}</TableCell>
                      </TableRow>
                    ))}
                    {employees.length > 5 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500">
                          ... and {employees.length - 5} more employees
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Exclusion Warning */}
            {employees.length > 0 && (
              <ExclusionWarning
                employees={employeesAsType}
                dndList={mockDNDList}
                safeHoursBlockedIds={safeHoursBlockedIds}
              />
            )}
          </CardContent>
        </Card>

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
                  {employees.length === 0 && "Upload employee CSV • "}
                  {!complianceChecked && "Confirm compliance"}
                  {canLaunch && (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      All requirements met
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
      </main>
    </div>
  );
}
