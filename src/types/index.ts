export type UserRole = 'hr_admin' | 'employee' | 'manager' | 'trainer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  employeeCode: string;
}

export type ProgramCategory = 'Technical' | 'Soft Skills' | 'Leadership' | 'Compliance';
export type DeliveryMode = 'Online' | 'Offline' | 'Hybrid';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type AssignmentPriority = 'High' | 'Medium' | 'Low';
export type AssignmentStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day';
export type AssessmentResult = 'Pass' | 'Fail' | 'Pending';
export type CertificateStatus = 'Valid' | 'Expiring Soon' | 'Expired';

export interface CourseModule {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'video' | 'reading' | 'quiz' | 'lab';
  completed?: boolean;
  contentSnippet?: string;
}

export interface CourseResource {
  id: string;
  title: string;
  type: 'PDF' | 'Slide Deck' | 'Code Repo' | 'Reference Sheet';
  url: string;
  size: string;
}

export interface TrainingProgram {
  id: string;
  code: string;
  title: string;
  description: string;
  category: ProgramCategory;
  mode: DeliveryMode;
  trainerId: string;
  trainerName: string;
  durationHours: number;
  startDate: string;
  endDate: string;
  targetDepartments: string[];
  status: 'Active' | 'Draft' | 'Archived';
  enrolledCount: number;
  completionRate: number;
  courseIds: string[];
}

export interface TrainingCourse {
  id: string;
  code: string;
  title: string;
  description: string;
  category: ProgramCategory;
  mode: DeliveryMode;
  durationHours: number;
  difficulty: DifficultyLevel;
  trainerId: string;
  trainerName: string;
  prerequisites: string[];
  skills: string[];
  resources: CourseResource[];
  modules: CourseModule[];
  rating: number;
  enrolledCount: number;
  programId?: string;
  badgeUrl?: string;
}

export interface TrainingAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  employeeAvatar: string;
  employeeDept: string;
  courseId: string;
  courseTitle: string;
  courseCategory: ProgramCategory;
  assignedBy: string;
  assignedDate: string;
  dueDate: string;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  progressPercentage: number;
  completedModules: number;
  totalModules: number;
  lastActivityDate?: string;
  completedDate?: string;
}

export interface SessionAttendee {
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  avatar: string;
  status: AttendanceStatus;
  checkInTime?: string;
  notes?: string;
}

export interface TrainingSession {
  id: string;
  programId: string;
  courseId: string;
  courseTitle: string;
  title: string;
  trainerId: string;
  trainerName: string;
  date: string;
  startTime: string;
  endTime: string;
  locationOrLink: string;
  mode: DeliveryMode;
  room?: string;
  attendees: SessionAttendee[];
  notes?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

export interface AssessmentRecord {
  id: string;
  courseId: string;
  courseTitle: string;
  assessmentName: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  assessmentDate: string;
  totalMarks: number;
  passingMarks: number;
  obtainedMarks: number;
  result: AssessmentResult;
  reassessmentAllowed: boolean;
  attemptNumber: number;
  feedback?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  employeeDept: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  expiryDate: string;
  status: CertificateStatus;
  credentialUrl: string;
  instructor: string;
  grade?: string;
  skillsVerified: string[];
}

export interface SkillGapRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  roleTitle: string;
  skill: string;
  requiredLevel: number; // 1-5
  currentLevel: number;  // 1-5
  gap: number;           // required - current
  category: ProgramCategory;
  recommendedCourseId?: string;
  recommendedCourseTitle?: string;
}

export interface FeedbackRecord {
  id: string;
  courseId: string;
  courseTitle: string;
  employeeId: string;
  employeeName: string;
  trainerName: string;
  courseRating: number;   // 1 to 5
  trainerRating: number;  // 1 to 5
  contentQuality: number; // 1 to 5
  comments: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'session' | 'overdue' | 'assessment' | 'certificate' | 'system';
  timestamp: string;
  read: boolean;
  targetTab?: string;
  priority?: 'high' | 'normal';
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type ActiveTab = 
  // Common & HR Admin Routes
  | 'dashboard'
  | 'programs'
  | 'courses'
  | 'assignments'
  | 'attendance'
  | 'assessments'
  | 'certificates'
  | 'reports'
  // Employee Routes
  | 'my_learning'
  | 'my_courses'
  | 'my_assessments'
  | 'my_certificates'
  | 'feedback_skills'
  // Reporting Manager Routes
  | 'team_dashboard'
  | 'team_progress'
  | 'recommend_training'
  | 'team_skill_gaps'
  | 'team_reports'
  // Trainer Routes
  | 'trainer_dashboard'
  | 'assigned_sessions'
  | 'mark_attendance'
  | 'assessments_grading'
  | 'feedback_received';

