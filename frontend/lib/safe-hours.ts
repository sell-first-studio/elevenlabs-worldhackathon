import { SafeHoursConfig } from './types';

/**
 * Check if the current time is within safe hours for calling
 */
export function isWithinSafeHours(
  config: SafeHoursConfig,
  employeeTimezone?: string
): { allowed: boolean; reason?: string; localTime: string } {
  if (!config.enabled) {
    return { allowed: true, localTime: getLocalTime(config.defaultTimezone) };
  }

  const timezone = employeeTimezone || config.defaultTimezone;
  const now = new Date();
  const localTime = getLocalTime(timezone);

  // Check weekend exclusion
  if (config.excludeWeekends) {
    const dayOfWeek = getDayOfWeek(timezone);
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        allowed: false,
        reason: 'Weekend - calls not permitted',
        localTime,
      };
    }
  }

  // Check time window
  const currentHour = getCurrentHour(timezone);
  const currentMinute = getCurrentMinute(timezone);
  const currentTimeMinutes = currentHour * 60 + currentMinute;

  const [startHour, startMinute] = config.startTime.split(':').map(Number);
  const [endHour, endMinute] = config.endTime.split(':').map(Number);
  const startTimeMinutes = startHour * 60 + startMinute;
  const endTimeMinutes = endHour * 60 + endMinute;

  if (currentTimeMinutes < startTimeMinutes) {
    return {
      allowed: false,
      reason: `Before safe hours (starts at ${config.startTime})`,
      localTime,
    };
  }

  if (currentTimeMinutes >= endTimeMinutes) {
    return {
      allowed: false,
      reason: `After safe hours (ended at ${config.endTime})`,
      localTime,
    };
  }

  return { allowed: true, localTime };
}

/**
 * Get the current local time formatted as a string
 */
export function getLocalTime(timezone: string): string {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    // Fallback for invalid timezone
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday) for a timezone
 */
function getDayOfWeek(timezone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
    });
    const dayStr = formatter.format(new Date());
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.indexOf(dayStr);
  } catch {
    return new Date().getDay();
  }
}

/**
 * Get current hour (0-23) for a timezone
 */
function getCurrentHour(timezone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    });
    return parseInt(formatter.format(new Date()), 10);
  } catch {
    return new Date().getHours();
  }
}

/**
 * Get current minute (0-59) for a timezone
 */
function getCurrentMinute(timezone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      minute: 'numeric',
    });
    return parseInt(formatter.format(new Date()), 10);
  } catch {
    return new Date().getMinutes();
  }
}

/**
 * Mock function for demo purposes - deterministic based on employee ID
 * Returns consistent results for the same employee
 */
export function mockIsWithinSafeHours(employeeId: string): boolean {
  // Hash the employee ID to get a consistent result
  const hash = employeeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // 80% of employees are "within safe hours"
  return hash % 10 < 8;
}

/**
 * Get a formatted time range string
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/**
 * Get timezone abbreviation for display
 */
export function getTimezoneAbbreviation(timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart?.value || timezone;
  } catch {
    return timezone;
  }
}
