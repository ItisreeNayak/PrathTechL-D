import React from 'react';
import { UserRole, ActiveTab } from '../types';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  CheckCircle,
  Award,
  BarChart3,
  Users,
  Sparkles,
  MessageSquare,
  FileText,
  Clock,
  ClipboardCheck,
  TrendingUp,
} from 'lucide-react';

export type ActionPermission =
  // HR Administrator Actions
  | 'create:program'
  | 'edit:program'
  | 'assign:training'
  | 'manage:certificates'
  | 'view:all_reports'
  // Employee Actions
  | 'take:course'
  | 'submit:assessment'
  | 'submit:feedback'
  | 'view:own_certificates'
  // Reporting Manager Actions
  | 'recommend:course'
  | 'view:team_progress'
  | 'view:team_reports'
  // Trainer Actions
  | 'mark:attendance'
  | 'grade:assessment'
  | 'view:assigned_sessions';

export const ROLE_PERMISSIONS: Record<UserRole, ActionPermission[]> = {
  hr_admin: [
    'create:program',
    'edit:program',
    'assign:training',
    'manage:certificates',
    'view:all_reports',
  ],
  employee: [
    'take:course',
    'submit:assessment',
    'submit:feedback',
    'view:own_certificates',
  ],
  manager: [
    'recommend:course',
    'view:team_progress',
    'view:team_reports',
  ],
  trainer: [
    'mark:attendance',
    'grade:assessment',
    'view:assigned_sessions',
  ],
};

export const ROLE_DEFAULT_ROUTES: Record<UserRole, ActiveTab> = {
  hr_admin: 'dashboard',
  employee: 'my_learning',
  manager: 'team_dashboard',
  trainer: 'trainer_dashboard',
};

export interface NavigationItemConfig {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
  description: string;
  badge?: (context: {
    overdueCount: number;
    pendingAssessmentsCount: number;
    scheduledSessionsCount: number;
    myAssessmentsCount: number;
    myOverdueCount: number;
  }) => string | number | undefined;
  badgeColor?: string;
}

export const NAVIGATION_CONFIG: NavigationItemConfig[] = [
  // -------------------------------------------------------------
  // HR Administrator Routes
  // -------------------------------------------------------------
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['hr_admin'],
    description: 'HR Analytics & Governance',
  },
  {
    id: 'programs',
    label: 'Training Programs',
    icon: GraduationCap,
    allowedRoles: ['hr_admin'],
    description: 'Cohort programs & curriculums',
  },
  {
    id: 'courses',
    label: 'Course Catalog',
    icon: BookOpen,
    allowedRoles: ['hr_admin', 'employee', 'manager'],
    description: 'Accredited courses & syllabus',
  },
  {
    id: 'assignments',
    label: 'Assignments',
    icon: ClipboardList,
    allowedRoles: ['hr_admin'],
    description: 'Workforce SLA & assignments',
    badge: ({ overdueCount }) => (overdueCount > 0 ? `${overdueCount} Overdue` : undefined),
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  {
    id: 'attendance',
    label: 'Sessions & Attendance',
    icon: CalendarCheck,
    allowedRoles: ['hr_admin'],
    description: 'Session monitoring & rosters',
    badge: ({ scheduledSessionsCount }) => (scheduledSessionsCount > 0 ? scheduledSessionsCount : undefined),
    badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
  },
  {
    id: 'assessments',
    label: 'Assessments & Results',
    icon: CheckCircle,
    allowedRoles: ['hr_admin'],
    description: 'Org-wide results & pass/fails',
    badge: ({ pendingAssessmentsCount }) => (pendingAssessmentsCount > 0 ? `${pendingAssessmentsCount} Pending` : undefined),
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    id: 'certificates',
    label: 'Certifications & Skills',
    icon: Award,
    allowedRoles: ['hr_admin'],
    description: 'Credentials & org skill gap matrix',
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: BarChart3,
    allowedRoles: ['hr_admin'],
    description: 'Compliance & audit exports',
  },

  // -------------------------------------------------------------
  // Employee Routes
  // -------------------------------------------------------------
  {
    id: 'my_learning',
    label: 'My Learning',
    icon: Sparkles,
    allowedRoles: ['employee'],
    description: 'Learner journey & progress',
  },
  {
    id: 'my_courses',
    label: 'My Courses',
    icon: GraduationCap,
    allowedRoles: ['employee'],
    description: 'In Progress, Completed & Overdue',
    badge: ({ myOverdueCount }) => (myOverdueCount > 0 ? `${myOverdueCount} Overdue` : undefined),
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  {
    id: 'my_assessments',
    label: 'My Assessments',
    icon: CheckCircle,
    allowedRoles: ['employee'],
    description: 'Tests, scores & retakes',
    badge: ({ myAssessmentsCount }) => (myAssessmentsCount > 0 ? `${myAssessmentsCount} Pending` : undefined),
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    id: 'my_certificates',
    label: 'My Certificates',
    icon: Award,
    allowedRoles: ['employee'],
    description: 'Earned credentials & previews',
  },
  {
    id: 'feedback_skills',
    label: 'Feedback & Skills',
    icon: MessageSquare,
    allowedRoles: ['employee'],
    description: 'Skill profile & evaluations',
  },

  // -------------------------------------------------------------
  // Reporting Manager Routes
  // -------------------------------------------------------------
  {
    id: 'team_dashboard',
    label: 'Team Dashboard',
    icon: Users,
    allowedRoles: ['manager'],
    description: 'Team progress & compliance',
  },
  {
    id: 'team_progress',
    label: 'Team Progress',
    icon: TrendingUp,
    allowedRoles: ['manager'],
    description: 'Direct report training status',
  },
  {
    id: 'recommend_training',
    label: 'Recommend Training',
    icon: ClipboardCheck,
    allowedRoles: ['manager'],
    description: 'Assign learning to team',
  },
  {
    id: 'team_skill_gaps',
    label: 'Team Skill Gap Matrix',
    icon: Award,
    allowedRoles: ['manager'],
    description: 'Competency vs. required benchmark',
  },
  {
    id: 'team_reports',
    label: 'Team Reports',
    icon: BarChart3,
    allowedRoles: ['manager'],
    description: 'Team completion & audits',
  },

  // -------------------------------------------------------------
  // Trainer Routes
  // -------------------------------------------------------------
  {
    id: 'trainer_dashboard',
    label: 'Trainer Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['trainer'],
    description: "Today's batches & schedules",
  },
  {
    id: 'assigned_sessions',
    label: 'Assigned Sessions',
    icon: CalendarCheck,
    allowedRoles: ['trainer'],
    description: 'Workshops & batch rosters',
    badge: ({ scheduledSessionsCount }) => (scheduledSessionsCount > 0 ? scheduledSessionsCount : undefined),
    badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
  },
  {
    id: 'mark_attendance',
    label: 'Mark Attendance',
    icon: ClipboardList,
    allowedRoles: ['trainer'],
    description: 'Present, Absent & Half Day',
  },
  {
    id: 'assessments_grading',
    label: 'Assessments & Grading',
    icon: CheckCircle,
    allowedRoles: ['trainer'],
    description: 'Score entry & evaluations',
    badge: ({ pendingAssessmentsCount }) => (pendingAssessmentsCount > 0 ? `${pendingAssessmentsCount} to Grade` : undefined),
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    id: 'feedback_received',
    label: 'Feedback Received',
    icon: MessageSquare,
    allowedRoles: ['trainer'],
    description: 'Trainee reviews & ratings',
  },
];

export const hasPermission = (role: UserRole, action: ActionPermission): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
};

export const isRouteAllowed = (role: UserRole, routeId: ActiveTab): boolean => {
  const item = NAVIGATION_CONFIG.find((nav) => nav.id === routeId && nav.allowedRoles.includes(role));
  return !!item;
};

export const getNavItemsForRole = (role: UserRole): NavigationItemConfig[] => {
  return NAVIGATION_CONFIG.filter((item) => item.allowedRoles.includes(role));
};

