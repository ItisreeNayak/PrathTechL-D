import React from 'react';
import {
  AssignmentPriority,
  AssignmentStatus,
  AttendanceStatus,
  AssessmentResult,
  CertificateStatus,
  ProgramCategory,
  DifficultyLevel,
  DeliveryMode,
} from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 
    | AssignmentStatus 
    | AssignmentPriority 
    | AttendanceStatus 
    | AssessmentResult 
    | CertificateStatus 
    | ProgramCategory 
    | DifficultyLevel 
    | DeliveryMode
    | 'Active' 
    | 'Draft' 
    | 'Archived' 
    | 'Scheduled'
    | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
}) => {
  const getStyles = () => {
    switch (variant) {
      // Completed, Pass, Valid, Present, Active
      case 'Completed':
      case 'Pass':
      case 'Valid':
      case 'Present':
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/10';

      // In Progress, Scheduled, Intermediate, Medium, Hybrid
      case 'In Progress':
      case 'Scheduled':
      case 'Medium':
      case 'Intermediate':
      case 'Hybrid':
        return 'bg-sky-50 text-sky-700 border-sky-200/80 ring-sky-500/10';

      // High, Overdue, Fail, Expired, Absent
      case 'High':
      case 'Overdue':
      case 'Fail':
      case 'Expired':
      case 'Absent':
        return 'bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-500/10';

      // Expiring Soon, Half Day, Draft, Pending, Advanced, Offline
      case 'Expiring Soon':
      case 'Half Day':
      case 'Draft':
      case 'Pending':
      case 'Advanced':
      case 'Offline':
        return 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/10';

      // Categories
      case 'Technical':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80 ring-indigo-500/10';
      case 'Soft Skills':
        return 'bg-teal-50 text-teal-700 border-teal-200/80 ring-teal-500/10';
      case 'Leadership':
        return 'bg-purple-50 text-purple-700 border-purple-200/80 ring-purple-500/10';
      case 'Compliance':
      case 'Online':
        return 'bg-blue-50 text-blue-700 border-blue-200/80 ring-blue-500/10';

      // Low, Beginner, Archived, neutral
      case 'Low':
      case 'Beginner':
      case 'Not Started':
      case 'Archived':
      case 'neutral':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10';
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'Completed':
      case 'Pass':
      case 'Valid':
      case 'Present':
      case 'Active':
        return 'bg-emerald-500';
      case 'In Progress':
      case 'Scheduled':
      case 'Medium':
      case 'Hybrid':
        return 'bg-sky-500';
      case 'High':
      case 'Overdue':
      case 'Fail':
      case 'Expired':
      case 'Absent':
        return 'bg-rose-500';
      case 'Expiring Soon':
      case 'Half Day':
      case 'Draft':
      case 'Pending':
        return 'bg-amber-500';
      default:
        return 'bg-slate-400';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ring-1 transition-colors ${getStyles()} ${sizeClasses}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />}
      {children || variant}
    </span>
  );
};
