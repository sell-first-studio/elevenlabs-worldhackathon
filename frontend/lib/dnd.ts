import { DNDEntry, DNDReason, Employee } from './types';

const NEW_HIRE_THRESHOLD_DAYS = 30;

/**
 * Check if an employee is a new hire (hired within last 30 days)
 */
export function isNewHire(hireDate: Date): boolean {
  const now = new Date();
  const diffTime = now.getTime() - hireDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < NEW_HIRE_THRESHOLD_DAYS;
}

/**
 * Get days since hire
 */
export function getDaysSinceHire(hireDate: Date): number {
  const now = new Date();
  const diffTime = now.getTime() - hireDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get days remaining until new hire period ends
 */
export function getDaysUntilNewHireEnds(hireDate: Date): number {
  const daysSinceHire = getDaysSinceHire(hireDate);
  return Math.max(0, NEW_HIRE_THRESHOLD_DAYS - daysSinceHire);
}

/**
 * Check if a DND entry is currently active
 */
export function isDNDActive(entry: DNDEntry): boolean {
  const now = new Date();
  const isStarted = entry.startDate <= now;
  const isNotEnded = !entry.endDate || entry.endDate >= now;
  return isStarted && isNotEnded;
}

/**
 * Get DND status for an employee
 */
export function getEmployeeDNDStatus(
  employeeId: string,
  dndList: DNDEntry[],
  hireDate?: Date
): { blocked: boolean; reason?: DNDReason; entry?: DNDEntry } {
  // Check for explicit DND entry
  const activeEntry = dndList.find(
    entry => entry.employeeId === employeeId && isDNDActive(entry)
  );

  if (activeEntry) {
    return {
      blocked: true,
      reason: activeEntry.reason,
      entry: activeEntry,
    };
  }

  // Check for new hire auto-block
  if (hireDate && isNewHire(hireDate)) {
    return {
      blocked: true,
      reason: 'new_hire',
      entry: undefined,
    };
  }

  return { blocked: false };
}

/**
 * Format date range for display
 */
export function formatDNDDuration(startDate: Date, endDate?: Date): string {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!endDate) {
    return `${formatDate(startDate)} - Indefinite`;
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Get remaining days for a DND entry
 */
export function getDNDRemainingDays(entry: DNDEntry): number | null {
  if (!entry.endDate) {
    return null; // Indefinite
  }

  const now = new Date();
  const diffTime = entry.endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

/**
 * Check if an employee is blocked (either by DND or safe hours)
 */
export function isEmployeeBlocked(
  employee: Employee,
  dndList: DNDEntry[],
  safeHoursBlocked: boolean
): { blocked: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Check DND status
  const dndStatus = getEmployeeDNDStatus(employee.id, dndList, employee.hireDate);
  if (dndStatus.blocked) {
    if (dndStatus.reason === 'leave') {
      reasons.push('On leave');
    } else if (dndStatus.reason === 'sensitive') {
      reasons.push('Sensitive situation');
    } else if (dndStatus.reason === 'new_hire') {
      reasons.push('New hire (<30 days)');
    } else if (dndStatus.reason === 'manual') {
      reasons.push('Manually blocked');
    }
  }

  // Check safe hours
  if (safeHoursBlocked) {
    reasons.push('Outside safe hours');
  }

  return {
    blocked: reasons.length > 0,
    reasons,
  };
}

/**
 * Filter employees that are currently blocked
 */
export function getBlockedEmployees(
  employees: Employee[],
  dndList: DNDEntry[],
  safeHoursBlockedIds: Set<string>
): { employee: Employee; reasons: string[] }[] {
  return employees
    .map(employee => ({
      employee,
      ...isEmployeeBlocked(employee, dndList, safeHoursBlockedIds.has(employee.id)),
    }))
    .filter(result => result.blocked);
}

/**
 * Get exclusion summary for a list of employees
 */
export function getExclusionSummary(
  employees: Employee[],
  dndList: DNDEntry[],
  safeHoursBlockedIds: Set<string>
): {
  totalExcluded: number;
  dndCount: number;
  safeHoursCount: number;
  byReason: Record<string, number>;
} {
  let dndCount = 0;
  let safeHoursOnlyCount = 0;
  const byReason: Record<string, number> = {
    leave: 0,
    sensitive: 0,
    new_hire: 0,
    manual: 0,
    safe_hours: 0,
  };

  for (const employee of employees) {
    const dndStatus = getEmployeeDNDStatus(employee.id, dndList, employee.hireDate);
    const isSafeHoursBlocked = safeHoursBlockedIds.has(employee.id);

    if (dndStatus.blocked) {
      dndCount++;
      if (dndStatus.reason) {
        byReason[dndStatus.reason] = (byReason[dndStatus.reason] || 0) + 1;
      }
    } else if (isSafeHoursBlocked) {
      safeHoursOnlyCount++;
      byReason.safe_hours++;
    }
  }

  return {
    totalExcluded: dndCount + safeHoursOnlyCount,
    dndCount,
    safeHoursCount: safeHoursOnlyCount,
    byReason,
  };
}
