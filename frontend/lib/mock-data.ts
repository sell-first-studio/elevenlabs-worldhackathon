import { Campaign, Employee, Department, Training, Reward, maskName, SafeHoursConfig, DNDEntry } from './types';

// Helper to generate mock employees
function generateEmployees(): Employee[] {
  const names = [
    'John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'David Wilson',
    'Jessica Brown', 'Robert Taylor', 'Amanda Martinez', 'Christopher Lee', 'Jennifer Garcia',
    'Daniel Anderson', 'Michelle Thomas', 'Matthew Jackson', 'Stephanie White', 'Andrew Harris',
    'Nicole Robinson', 'Joshua Clark', 'Ashley Lewis', 'Ryan Walker', 'Samantha Hall',
    'Brandon Young', 'Megan Allen', 'Kevin King', 'Rachel Wright', 'Justin Scott',
    'Laura Green', 'Tyler Adams', 'Kayla Baker', 'Jacob Nelson', 'Brittany Hill'
  ];

  const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations'];
  const statuses: Array<'pending' | 'in_progress' | 'completed'> = ['pending', 'in_progress', 'completed'];
  const results: Array<'passed' | 'failed' | undefined> = ['passed', 'failed'];

  // Generate deterministic hire dates for demo purposes
  const baseDate = new Date('2024-01-01');

  return names.map((name, index) => {
    const status = statuses[index % 3];
    const result = status === 'completed' ? results[index % 2] : undefined;
    const trainingStatus = result === 'failed'
      ? (['not_assigned', 'assigned', 'in_progress', 'completed'] as const)[index % 4]
      : undefined;

    // Generate hire dates: most are older, a few are recent (new hires)
    const daysAgo = index < 3
      ? Math.floor(Math.random() * 20) + 5  // New hires: 5-25 days ago
      : Math.floor(Math.random() * 700) + 60; // Regular: 60-760 days ago
    const hireDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    return {
      id: `emp-${index + 1}`,
      name,
      maskedName: maskName(name),
      phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      email: `${name.toLowerCase().replace(' ', '.')}@company.com`,
      department: departments[index % departments.length],
      status,
      result,
      trainingStatus,
      hireDate
    };
  });
}

// Generate department stats from employees
function generateDepartments(employees: Employee[]): Department[] {
  const deptMap = new Map<string, Employee[]>();

  employees.forEach(emp => {
    const existing = deptMap.get(emp.department) || [];
    deptMap.set(emp.department, [...existing, emp]);
  });

  return Array.from(deptMap.entries()).map(([name, emps], index) => {
    const completed = emps.filter(e => e.status === 'completed');
    const passed = completed.filter(e => e.result === 'passed').length;
    const failed = completed.filter(e => e.result === 'failed').length;
    const inProgress = emps.filter(e => e.status === 'in_progress').length;

    return {
      id: `dept-${index + 1}`,
      name,
      employeeCount: emps.length,
      passCount: passed,
      failCount: failed,
      inProgressCount: inProgress,
      passRate: completed.length > 0 ? Math.round((passed / completed.length) * 100) : 0,
      failRate: completed.length > 0 ? Math.round((failed / completed.length) * 100) : 0
    };
  });
}

// Generate campaign metrics from employees
function generateMetrics(employees: Employee[]) {
  const completed = employees.filter(e => e.status === 'completed');
  const passed = completed.filter(e => e.result === 'passed').length;
  const failed = completed.filter(e => e.result === 'failed').length;

  return {
    totalTargeted: employees.length,
    inProgress: employees.filter(e => e.status === 'in_progress').length,
    completed: completed.length,
    passed,
    failed,
    passRate: completed.length > 0 ? Math.round((passed / completed.length) * 100) : 0,
    failRate: completed.length > 0 ? Math.round((failed / completed.length) * 100) : 0
  };
}

// Mock campaigns
const employees1 = generateEmployees();
const employees2 = generateEmployees().slice(0, 15);
const employees3 = generateEmployees().slice(0, 20);

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Q4 Security Assessment',
    description: 'Quarterly voice phishing simulation for all departments',
    createdAt: new Date('2024-10-15'),
    startedAt: new Date('2024-10-20'),
    status: 'running',
    employees: employees1,
    departments: generateDepartments(employees1),
    metrics: generateMetrics(employees1)
  },
  {
    id: 'camp-2',
    name: 'Engineering Team Test',
    description: 'Targeted simulation for engineering department',
    createdAt: new Date('2024-09-01'),
    startedAt: new Date('2024-09-05'),
    completedAt: new Date('2024-09-30'),
    status: 'completed',
    employees: employees2,
    departments: generateDepartments(employees2),
    metrics: generateMetrics(employees2)
  },
  {
    id: 'camp-3',
    name: 'New Hire Orientation Security',
    description: 'Security awareness simulation for new employees',
    createdAt: new Date('2024-08-10'),
    startedAt: new Date('2024-08-15'),
    completedAt: new Date('2024-08-31'),
    status: 'completed',
    employees: employees3,
    departments: generateDepartments(employees3),
    metrics: generateMetrics(employees3)
  }
];

// Mock trainings
export const mockTrainings: Training[] = [
  {
    id: 'train-1',
    title: 'Voice Phishing Awareness',
    description: 'Learn to identify and respond to voice phishing attempts. This training covers common tactics used by attackers, red flags to watch for, and proper reporting procedures.',
    duration: '30 minutes',
    type: 'video'
  },
  {
    id: 'train-2',
    title: 'MFA Security Best Practices',
    description: 'Understanding multi-factor authentication and why you should never share codes. Covers the importance of MFA, common social engineering tactics, and how to protect your accounts.',
    duration: '20 minutes',
    type: 'interactive'
  },
  {
    id: 'train-3',
    title: 'Social Engineering Defense',
    description: 'Comprehensive guide to recognizing and defending against social engineering attacks across all channels including phone, email, and in-person.',
    duration: '45 minutes',
    type: 'document'
  }
];

// Mock rewards (inspired by &Open)
export const mockRewards: Reward[] = [
  {
    id: 'reward-1',
    name: 'Amazon Gift Card',
    description: '$50 Amazon gift card for your security awareness',
    value: '$50',
    imageUrl: '/rewards/amazon.png',
    category: 'gift_card'
  },
  {
    id: 'reward-2',
    name: 'Coffee Subscription',
    description: 'One month premium coffee subscription',
    value: '$30',
    imageUrl: '/rewards/coffee.png',
    category: 'experience'
  },
  {
    id: 'reward-3',
    name: 'Spa Day Voucher',
    description: 'Relaxing spa experience at select locations',
    value: '$100',
    imageUrl: '/rewards/spa.png',
    category: 'experience'
  },
  {
    id: 'reward-4',
    name: 'Company Swag Box',
    description: 'Premium branded merchandise package',
    value: '$75',
    imageUrl: '/rewards/swag.png',
    category: 'merchandise'
  },
  {
    id: 'reward-5',
    name: 'Dinner for Two',
    description: 'Fine dining experience at partner restaurants',
    value: '$150',
    imageUrl: '/rewards/dinner.png',
    category: 'experience'
  },
  {
    id: 'reward-6',
    name: 'Tech Gadget',
    description: 'Choose from wireless earbuds, portable charger, or smart home device',
    value: '$80',
    imageUrl: '/rewards/tech.png',
    category: 'merchandise'
  }
];

// Helper functions for dashboard stats
export function getDashboardStats() {
  const activeCampaigns = mockCampaigns.filter(c => c.status === 'running').length;
  const totalEmployeesTested = mockCampaigns.reduce((acc, c) => acc + c.employees.length, 0);
  const allCompleted = mockCampaigns.flatMap(c => c.employees.filter(e => e.status === 'completed'));
  const overallPassRate = allCompleted.length > 0
    ? Math.round((allCompleted.filter(e => e.result === 'passed').length / allCompleted.length) * 100)
    : 0;
  const pendingTraining = mockCampaigns.flatMap(c =>
    c.employees.filter(e => e.result === 'failed' && e.trainingStatus !== 'completed')
  ).length;

  return {
    activeCampaigns,
    totalEmployeesTested,
    overallPassRate,
    pendingTraining
  };
}

// ============================================
// Safe Hours & Do Not Disturb Mock Data
// ============================================

// Default safe hours configuration
export const mockSafeHoursConfig: SafeHoursConfig = {
  enabled: true,
  defaultTimezone: 'America/New_York',
  startTime: '09:00',
  endTime: '17:00',
  excludeWeekends: true,
};

// Mock DND entries with realistic scenarios
export const mockDNDList: DNDEntry[] = [
  {
    id: 'dnd-1',
    employeeId: 'emp-5',
    employeeName: 'David Wilson',
    maskedName: maskName('David Wilson'),
    reason: 'leave',
    note: 'Parental leave - new baby',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-02-01'),
    addedBy: 'HR Admin',
    addedAt: new Date('2024-10-28'),
  },
  {
    id: 'dnd-2',
    employeeId: 'emp-12',
    employeeName: 'Michelle Thomas',
    maskedName: maskName('Michelle Thomas'),
    reason: 'sensitive',
    note: 'Family bereavement',
    startDate: new Date('2024-12-01'),
    endDate: undefined, // Indefinite
    addedBy: 'HR Admin',
    addedAt: new Date('2024-12-01'),
  },
  {
    id: 'dnd-3',
    employeeId: 'emp-8',
    employeeName: 'Amanda Martinez',
    maskedName: maskName('Amanda Martinez'),
    reason: 'leave',
    note: 'Medical leave - surgery recovery',
    startDate: new Date('2024-12-05'),
    endDate: new Date('2025-01-15'),
    addedBy: 'HR Admin',
    addedAt: new Date('2024-12-03'),
  },
  {
    id: 'dnd-4',
    employeeId: 'emp-1',
    employeeName: 'John Smith',
    maskedName: maskName('John Smith'),
    reason: 'new_hire',
    note: 'Auto-detected: hired within last 30 days',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    addedBy: 'System',
    addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'dnd-5',
    employeeId: 'emp-2',
    employeeName: 'Sarah Johnson',
    maskedName: maskName('Sarah Johnson'),
    reason: 'new_hire',
    note: 'Auto-detected: hired within last 30 days',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    addedBy: 'System',
    addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'dnd-6',
    employeeId: 'emp-20',
    employeeName: 'Samantha Hall',
    maskedName: maskName('Samantha Hall'),
    reason: 'manual',
    note: 'Executive request - high-profile client work',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    addedBy: 'HR Admin',
    addedAt: new Date('2024-11-28'),
  },
];

// Get all employees from mock data (for DND management)
export function getAllEmployees(): Employee[] {
  return employees1;
}

// Get DND stats for dashboard
export function getDNDStats() {
  const activeEntries = mockDNDList.filter(entry => {
    const now = new Date();
    const isStarted = entry.startDate <= now;
    const isNotEnded = !entry.endDate || entry.endDate >= now;
    return isStarted && isNotEnded;
  });

  return {
    total: activeEntries.length,
    byReason: {
      leave: activeEntries.filter(e => e.reason === 'leave').length,
      sensitive: activeEntries.filter(e => e.reason === 'sensitive').length,
      new_hire: activeEntries.filter(e => e.reason === 'new_hire').length,
      manual: activeEntries.filter(e => e.reason === 'manual').length,
    },
  };
}

// ============================================
// HR Database Integration Mock Data
// ============================================

export interface DepartmentHierarchy {
  id: string;
  name: string;
  employeeCount: number;
  children?: DepartmentHierarchy[];
  isRestricted?: boolean;
}

export interface HRDatabaseInfo {
  provider: string;
  lastSynced: Date;
  totalEmployees: number;
  totalDepartments: number;
  totalLocations: number;
}

export interface UserPermissions {
  role: string;
  accessibleDepartmentIds: string[];
  restrictedDepartmentIds: string[];
  canTargetAll: boolean;
}

// Mock HR database connection info
export const mockHRDatabase: HRDatabaseInfo = {
  provider: 'BambooHR',
  lastSynced: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  totalEmployees: 1247,
  totalDepartments: 12,
  totalLocations: 5,
};

// Mock department hierarchy with nested teams
export const mockDepartmentHierarchy: DepartmentHierarchy[] = [
  {
    id: 'dept-eng',
    name: 'Engineering',
    employeeCount: 142,
    children: [
      { id: 'dept-eng-fe', name: 'Frontend', employeeCount: 38 },
      { id: 'dept-eng-be', name: 'Backend', employeeCount: 54 },
      { id: 'dept-eng-devops', name: 'DevOps', employeeCount: 28 },
      { id: 'dept-eng-qa', name: 'QA', employeeCount: 22 },
    ],
  },
  {
    id: 'dept-sales',
    name: 'Sales',
    employeeCount: 89,
    children: [
      { id: 'dept-sales-ent', name: 'Enterprise', employeeCount: 34 },
      { id: 'dept-sales-smb', name: 'SMB', employeeCount: 31 },
      { id: 'dept-sales-sdr', name: 'SDR', employeeCount: 24 },
    ],
  },
  {
    id: 'dept-marketing',
    name: 'Marketing',
    employeeCount: 45,
    children: [
      { id: 'dept-marketing-content', name: 'Content', employeeCount: 18 },
      { id: 'dept-marketing-growth', name: 'Growth', employeeCount: 15 },
      { id: 'dept-marketing-brand', name: 'Brand', employeeCount: 12 },
    ],
  },
  {
    id: 'dept-cs',
    name: 'Customer Success',
    employeeCount: 67,
    children: [
      { id: 'dept-cs-support', name: 'Support', employeeCount: 35 },
      { id: 'dept-cs-onboarding', name: 'Onboarding', employeeCount: 18 },
      { id: 'dept-cs-tam', name: 'TAM', employeeCount: 14 },
    ],
  },
  {
    id: 'dept-finance',
    name: 'Finance',
    employeeCount: 32,
  },
  {
    id: 'dept-hr',
    name: 'HR & People',
    employeeCount: 28,
    isRestricted: true,
  },
  {
    id: 'dept-legal',
    name: 'Legal',
    employeeCount: 15,
    isRestricted: true,
  },
  {
    id: 'dept-exec',
    name: 'Executive',
    employeeCount: 12,
    isRestricted: true,
  },
];

// Mock user permissions (current user is a Security Team Member)
export const mockUserPermissions: UserPermissions = {
  role: 'Security Team Member',
  accessibleDepartmentIds: [
    'dept-eng', 'dept-eng-fe', 'dept-eng-be', 'dept-eng-devops', 'dept-eng-qa',
    'dept-sales', 'dept-sales-ent', 'dept-sales-smb', 'dept-sales-sdr',
    'dept-marketing', 'dept-marketing-content', 'dept-marketing-growth', 'dept-marketing-brand',
    'dept-cs', 'dept-cs-support', 'dept-cs-onboarding', 'dept-cs-tam',
    'dept-finance',
  ],
  restrictedDepartmentIds: ['dept-hr', 'dept-legal', 'dept-exec'],
  canTargetAll: false,
};

// Helper to get total accessible employee count
export function getAccessibleEmployeeCount(): number {
  const accessibleIds = new Set(mockUserPermissions.accessibleDepartmentIds);
  let count = 0;

  function countDept(dept: DepartmentHierarchy) {
    if (accessibleIds.has(dept.id)) {
      // If parent is accessible, count it (children are included in parent count for top-level)
      if (!dept.children) {
        count += dept.employeeCount;
      } else {
        // For parents with children, only count if no children are individually accessible
        const hasAccessibleChildren = dept.children.some(c => accessibleIds.has(c.id));
        if (!hasAccessibleChildren) {
          count += dept.employeeCount;
        } else {
          dept.children.forEach(countDept);
        }
      }
    }
  }

  mockDepartmentHierarchy.forEach(countDept);
  return count;
}

// Generate mock employees for selected departments
export function getEmployeesForDepartments(departmentIds: string[]): Employee[] {
  const deptIdSet = new Set(departmentIds);
  const result: Employee[] = [];

  // Map department IDs to department names
  const deptIdToName: Record<string, string> = {};
  function mapDepts(depts: DepartmentHierarchy[]) {
    depts.forEach(d => {
      deptIdToName[d.id] = d.name;
      if (d.children) mapDepts(d.children);
    });
  }
  mapDepts(mockDepartmentHierarchy);

  // Generate mock employees for each selected department
  let empIndex = 0;
  departmentIds.forEach(deptId => {
    const deptName = deptIdToName[deptId];
    if (!deptName) return;

    // Find department to get employee count
    let empCount = 0;
    function findDept(depts: DepartmentHierarchy[]): DepartmentHierarchy | null {
      for (const d of depts) {
        if (d.id === deptId) return d;
        if (d.children) {
          const found = findDept(d.children);
          if (found) return found;
        }
      }
      return null;
    }
    const dept = findDept(mockDepartmentHierarchy);
    if (dept) {
      // For parent departments with children, don't double count
      if (dept.children && dept.children.some(c => deptIdSet.has(c.id))) {
        return; // Skip parent if children are selected
      }
      empCount = dept.employeeCount;
    }

    // Generate employees
    for (let i = 0; i < empCount; i++) {
      const firstName = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda', 'Chris', 'Jennifer'][empIndex % 10];
      const lastName = ['Smith', 'Johnson', 'Chen', 'Davis', 'Wilson', 'Brown', 'Taylor', 'Martinez', 'Lee', 'Garcia'][Math.floor(empIndex / 10) % 10];
      const name = `${firstName} ${lastName}`;

      result.push({
        id: `gen-emp-${empIndex}`,
        name,
        maskedName: maskName(name),
        phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        department: deptName,
        status: 'pending',
        hireDate: new Date(Date.now() - Math.floor(Math.random() * 700 + 30) * 24 * 60 * 60 * 1000),
      });
      empIndex++;
    }
  });

  return result;
}
