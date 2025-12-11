"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { mockCampaigns, mockTrainings } from "@/lib/mock-data";
import { Training, Employee } from "@/lib/types";
import {
  GraduationCap,
  Play,
  Clock,
  FileText,
  Video,
  MousePointer,
  CheckCircle2,
  Heart
} from "lucide-react";

function getTrainingIcon(type: Training['type']) {
  switch (type) {
    case 'video':
      return Video;
    case 'interactive':
      return MousePointer;
    case 'document':
      return FileText;
    default:
      return FileText;
  }
}

function getTrainingStatusBadge(status?: string) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
    case 'assigned':
      return <Badge className="bg-yellow-100 text-yellow-700">Assigned</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-500">Not Assigned</Badge>;
  }
}

export default function TrainingPage() {
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get employees who failed and need training
  const failedEmployees = mockCampaigns.flatMap(campaign =>
    campaign.employees.filter(e => e.result === 'failed')
  );

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(failedEmployees.map(e => e.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleAssignTraining = () => {
    // Simulate assignment
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedEmployees([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Training"
        description="Assign and track security awareness training"
      />

      <main className="p-8 space-y-8">
        {/* Supportive Message */}
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">A Learning Opportunity</h3>
                <p className="text-sm text-blue-700">
                  Security awareness is a journey, not a test. Our training is designed to educate and empower,
                  not to shame or punish. Everyone can improve their security posture with the right knowledge.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Options */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Training Modules</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {mockTrainings.map((training) => {
              const Icon = getTrainingIcon(training.type);
              return (
                <Card key={training.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {training.type}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{training.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{training.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {training.duration}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTraining(training)}
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          disabled={selectedEmployees.length === 0}
                          onClick={handleAssignTraining}
                        >
                          Assign
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Employees Needing Training */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Employees Requiring Training</CardTitle>
                <CardDescription>
                  {failedEmployees.length} employees from recent campaigns need security awareness training
                </CardDescription>
              </div>
              {selectedEmployees.length > 0 && (
                <Badge className="bg-blue-100 text-blue-700">
                  {selectedEmployees.length} selected
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {showSuccess ? (
              <div className="flex items-center justify-center py-8 text-green-600">
                <CheckCircle2 className="h-6 w-6 mr-2" />
                <span className="font-medium">Training assigned successfully!</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedEmployees.length === failedEmployees.length && failedEmployees.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Training Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {failedEmployees.map((employee) => (
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
                      <TableCell>{getTrainingStatusBadge(employee.trainingStatus)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Training Preview Dialog */}
        <Dialog open={!!selectedTraining} onOpenChange={() => setSelectedTraining(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                {selectedTraining?.title}
              </DialogTitle>
              <DialogDescription>
                Training module preview
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Training preview placeholder</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">About this training</h4>
                <p className="text-sm text-gray-600">{selectedTraining?.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  Duration: {selectedTraining?.duration}
                </div>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={selectedEmployees.length === 0}
                  onClick={() => {
                    setSelectedTraining(null);
                    handleAssignTraining();
                  }}
                >
                  Assign to {selectedEmployees.length || 'selected'} employees
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
