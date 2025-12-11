export interface Employee {
  id: string;
  name: string;
  maskedName: string;
  phone: string;
  email: string;
  department: string;
  status: 'pending' | 'in_progress' | 'completed';
  result?: 'passed' | 'failed';
  trainingStatus?: 'not_assigned' | 'assigned' | 'in_progress' | 'completed';
  // Safe Hours & DND fields
  hireDate?: Date;
  timezone?: string;              // PLACEHOLDER: per-employee override
  safeHoursOverride?: {           // PLACEHOLDER: per-employee override
    startTime?: string;
    endTime?: string;
  };
}

export interface Department {
  id: string;
  name: string;
  employeeCount: number;
  passCount: number;
  failCount: number;
  inProgressCount: number;
  passRate: number;
  failRate: number;
}

export interface CampaignMetrics {
  totalTargeted: number;
  inProgress: number;
  completed: number;
  passed: number;
  failed: number;
  passRate: number;
  failRate: number;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: 'draft' | 'running' | 'completed';
  employees: Employee[];
  departments: Department[];
  metrics: CampaignMetrics;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'interactive' | 'document';
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  value: string;
  imageUrl: string;
  category: 'gift_card' | 'experience' | 'merchandise';
}

// Utility function to mask names
export function maskName(name: string): string {
  return name.split(' ')
    .map(part => part[0] + '***')
    .join(' ');
}

// ============================================
// Safe Hours & Do Not Disturb Types
// ============================================

// Organization-wide safe hours configuration
export interface SafeHoursConfig {
  enabled: boolean;
  defaultTimezone: string;  // e.g., "America/New_York"
  startTime: string;        // "09:00" (24-hour format)
  endTime: string;          // "17:00" (24-hour format)
  excludeWeekends: boolean;
}

// Do Not Disturb entry
export interface DNDEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  maskedName: string;
  reason: DNDReason;
  note?: string;
  startDate: Date;
  endDate?: Date;  // null/undefined = indefinite
  addedBy: string;
  addedAt: Date;
}

export type DNDReason = 'leave' | 'sensitive' | 'new_hire' | 'manual';

// DND reason display configuration
export const DND_REASONS: Record<DNDReason, { label: string; icon: string; color: string }> = {
  leave: { label: 'On Leave', icon: 'Palmtree', color: 'blue' },
  sensitive: { label: 'Sensitive Situation', icon: 'Heart', color: 'pink' },
  new_hire: { label: 'New Hire (<30 days)', icon: 'Star', color: 'yellow' },
  manual: { label: 'Manual Block', icon: 'Shield', color: 'gray' },
} as const;

// Common US timezones for the prototype
export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
] as const;
