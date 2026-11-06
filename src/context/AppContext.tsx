import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  UserRole,
  UserProfile,
  ActiveTab,
  TrainingProgram,
  TrainingCourse,
  TrainingAssignment,
  TrainingSession,
  AssessmentRecord,
  Certificate,
  SkillGapRecord,
  FeedbackRecord,
  NotificationItem,
  ToastMessage,
  AttendanceStatus,
  AssessmentResult,
} from '../types';
import {
  mockUsers,
  mockCourses,
  mockPrograms,
  mockAssignments,
  mockSessions,
  mockAssessments,
  mockCertificates,
  mockSkillGaps,
  mockFeedback,
  mockNotifications,
} from '../data/mockData';
import { triggerConfetti } from '../utils/confetti';
import {
  ActionPermission,
  hasPermission,
  isRouteAllowed,
  ROLE_DEFAULT_ROUTES,
} from '../config/rbac';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // RBAC Permission Helpers
  can: (action: ActionPermission) => boolean;
  isAllowed: (route: ActiveTab) => boolean;

  // Data Entities
  programs: TrainingProgram[];
  courses: TrainingCourse[];
  assignments: TrainingAssignment[];
  sessions: TrainingSession[];
  assessments: AssessmentRecord[];
  certificates: Certificate[];
  skillGaps: SkillGapRecord[];
  feedbacks: FeedbackRecord[];
  notifications: NotificationItem[];
  toasts: ToastMessage[];

  // Toast & Notifications
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // CRUD & Interactive Actions
  addProgram: (program: Omit<TrainingProgram, 'id' | 'code' | 'enrolledCount' | 'completionRate'>) => void;
  updateProgram: (id: string, updates: Partial<TrainingProgram>) => void;
  toggleProgramStatus: (id: string) => void;

  addCourse: (course: Omit<TrainingCourse, 'id' | 'code' | 'rating' | 'enrolledCount'>) => void;
  updateCourse: (id: string, updates: Partial<TrainingCourse>) => void;

  assignTraining: (data: {
    targetType: 'employees' | 'departments';
    selectedTargets: string[];
    courseId: string;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
  }) => void;
  updateAssignmentProgress: (assignmentId: string, completedModulesCount: number) => void;
  markModuleCompletedInCourse: (courseId: string, moduleId: string) => void;

  updateAttendance: (sessionId: string, employeeId: string, status: AttendanceStatus, notes?: string) => void;
  saveAttendanceSheet: (sessionId: string) => void;
  scheduleSession: (sessionData: Omit<TrainingSession, 'id' | 'attendees' | 'status'> & { attendeeIds?: string[] }) => void;

  recordAssessmentMarks: (assessmentId: string, obtainedMarks: number, feedback?: string, reassessmentAllowed?: boolean) => void;
  createAssessment: (data: Omit<AssessmentRecord, 'id' | 'result'>) => void;

  issueCertificate: (certData: Omit<Certificate, 'id' | 'certificateNumber' | 'credentialUrl'>) => void;
  recommendCourseForSkillGap: (gapId: string, courseId: string) => void;
  submitFeedback: (feedbackData: Omit<FeedbackRecord, 'id' | 'date'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('hr_admin');
  const [activeTab, setActiveTabState] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const [programs, setPrograms] = useState<TrainingProgram[]>(mockPrograms);
  const [courses, setCourses] = useState<TrainingCourse[]>(mockCourses);
  const [assignments, setAssignments] = useState<TrainingAssignment[]>(mockAssignments);
  const [sessions, setSessions] = useState<TrainingSession[]>(mockSessions);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(mockAssessments);
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [skillGaps, setSkillGaps] = useState<SkillGapRecord[]>(mockSkillGaps);
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>(mockFeedback);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const currentUser = useMemo(() => mockUsers[currentRole], [currentRole]);

  const can = (action: ActionPermission): boolean => {
    return hasPermission(currentRole, action);
  };

  const isAllowed = (route: ActiveTab): boolean => {
    return isRouteAllowed(currentRole, route);
  };

  const setActiveTab = (tab: ActiveTab) => {
    if (isRouteAllowed(currentRole, tab)) {
      setActiveTabState(tab);
    } else {
      const defaultRoute = ROLE_DEFAULT_ROUTES[currentRole];
      setActiveTabState(defaultRoute);
      addToast('Restricted Access', `You do not have permission to access that route. Redirected to your dashboard.`, 'warning');
    }
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    addToast('Role Switched', `Viewing system as ${mockUsers[role].name} (${mockUsers[role].roleTitle})`, 'info');

    // Automatically synchronize and redirect to allowed default route if current tab is not permitted
    if (!isRouteAllowed(role, activeTab)) {
      setActiveTabState(ROLE_DEFAULT_ROUTES[role]);
    }
  };

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Notifications Cleared', 'All notifications marked as read', 'info');
  };

  // Program Handlers
  const addProgram = (programData: Omit<TrainingProgram, 'id' | 'code' | 'enrolledCount' | 'completionRate'>) => {
    const newId = `prg-${Date.now().toString().slice(-4)}`;
    const newCode = `PRG-${new Date().getFullYear()}-${programData.category.slice(0, 4).toUpperCase()}`;
    const newProgram: TrainingProgram = {
      ...programData,
      id: newId,
      code: newCode,
      enrolledCount: 0,
      completionRate: 0,
    };
    setPrograms((prev) => [newProgram, ...prev]);
    addToast('Program Created', `"${newProgram.title}" has been successfully created.`, 'success');

    // Add in-app notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Program Launched',
        message: `${newProgram.title} has been published by ${currentUser.name}.`,
        type: 'assignment',
        timestamp: 'Just now',
        read: false,
        targetTab: 'programs',
      },
      ...prev,
    ]);
  };

  const updateProgram = (id: string, updates: Partial<TrainingProgram>) => {
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addToast('Program Updated', 'Changes have been saved successfully.', 'success');
  };

  const toggleProgramStatus = (id: string) => {
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'Active' ? 'Archived' : 'Active';
          addToast('Status Changed', `Program status updated to ${nextStatus}`, 'info');
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Course Handlers
  const addCourse = (courseData: Omit<TrainingCourse, 'id' | 'code' | 'rating' | 'enrolledCount'>) => {
    const newId = `crs-${Date.now().toString().slice(-4)}`;
    const newCode = `${courseData.category.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newCourse: TrainingCourse = {
      ...courseData,
      id: newId,
      code: newCode,
      rating: 5.0,
      enrolledCount: 0,
    };
    setCourses((prev) => [newCourse, ...prev]);
    addToast('Course Added', `"${newCourse.title}" added to the course catalog.`, 'success');
  };

  const updateCourse = (id: string, updates: Partial<TrainingCourse>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    addToast('Course Updated', 'Course curriculum details updated.', 'success');
  };

  // Assignment Handlers
  const assignTraining = ({
    targetType,
    selectedTargets,
    courseId,
    dueDate,
    priority,
  }: {
    targetType: 'employees' | 'departments';
    selectedTargets: string[];
    courseId: string;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
  }) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const newAssignmentsList: TrainingAssignment[] = [];
    const today = new Date().toISOString().split('T')[0];

    if (targetType === 'departments') {
      selectedTargets.forEach((dept) => {
        // Mock 2 employees per selected department
        const empCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
        newAssignmentsList.push({
          id: `asg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          employeeId: `emp-${Math.random().toString(36).substr(2, 6)}`,
          employeeName: `${dept} Cohort Lead`,
          employeeCode: empCode,
          employeeAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          employeeDept: dept,
          courseId: course.id,
          courseTitle: course.title,
          courseCategory: course.category,
          assignedBy: currentUser.name,
          assignedDate: today,
          dueDate,
          priority,
          status: 'Not Started',
          progressPercentage: 0,
          completedModules: 0,
          totalModules: course.modules.length || 4,
        });
      });
    } else {
      selectedTargets.forEach((empTarget) => {
        const isSelf = empTarget === currentUser.id;
        const targetName = isSelf ? currentUser.name : empTarget;
        const targetDept = isSelf ? currentUser.department : 'Engineering';
        const targetCode = isSelf ? currentUser.employeeCode : 'EMP-2490';
        const targetAvatar = isSelf ? currentUser.avatar : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80';

        newAssignmentsList.push({
          id: `asg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          employeeId: empTarget,
          employeeName: targetName,
          employeeCode: targetCode,
          employeeAvatar: targetAvatar,
          employeeDept: targetDept,
          courseId: course.id,
          courseTitle: course.title,
          courseCategory: course.category,
          assignedBy: currentUser.name,
          assignedDate: today,
          dueDate,
          priority,
          status: 'Not Started',
          progressPercentage: 0,
          completedModules: 0,
          totalModules: course.modules.length || 4,
        });
      });
    }

    setAssignments((prev) => [...newAssignmentsList, ...prev]);
    // Also increase course enrolled count
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + newAssignmentsList.length } : c))
    );

    addToast(
      'Assignment Successful',
      `Assigned "${course.title}" to ${newAssignmentsList.length} recipient(s). In-app alerts triggered.`,
      'success'
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Training Assigned',
        message: `You were assigned "${course.title}". Due date: ${dueDate}.`,
        type: 'assignment',
        timestamp: 'Just now',
        read: false,
        targetTab: 'assignments',
        priority: priority === 'High' ? 'high' : 'normal',
      },
      ...prev,
    ]);
  };

  const updateAssignmentProgress = (assignmentId: string, completedModulesCount: number) => {
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id === assignmentId) {
          const total = asg.totalModules || 1;
          const cappedCount = Math.min(completedModulesCount, total);
          const percent = Math.round((cappedCount / total) * 100);
          const isDone = percent === 100;
          const status = isDone ? 'Completed' : percent > 0 ? 'In Progress' : 'Not Started';

          if (isDone) {
            triggerConfetti();
            addToast('Congratulations!', `You have completed "${asg.courseTitle}"! Certificate generated.`, 'success');
            // Auto issue certificate
            issueCertificate({
              employeeId: asg.employeeId,
              employeeName: asg.employeeName,
              employeeCode: asg.employeeCode,
              employeeDept: asg.employeeDept,
              courseId: asg.courseId,
              courseTitle: asg.courseTitle,
              issueDate: new Date().toISOString().split('T')[0],
              expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'Valid',
              instructor: 'Learning & Development Faculty',
              grade: 'Honors (100%)',
              skillsVerified: ['Certified Practitioner', asg.courseCategory],
            });
          }

          return {
            ...asg,
            completedModules: cappedCount,
            progressPercentage: percent,
            status,
            completedDate: isDone ? new Date().toISOString().split('T')[0] : asg.completedDate,
            lastActivityDate: new Date().toISOString().split('T')[0],
          };
        }
        return asg;
      })
    );
  };

  const markModuleCompletedInCourse = (courseId: string, moduleId: string) => {
    // 1. Update module in course state
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedModules = c.modules.map((m) =>
            m.id === moduleId ? { ...m, completed: true } : m
          );
          return { ...c, modules: updatedModules };
        }
        return c;
      })
    );

    // 2. Also update matching assignment for current user
    const matchingAsg = assignments.find((a) => a.courseId === courseId && a.employeeId === currentUser.id);
    if (matchingAsg) {
      updateAssignmentProgress(matchingAsg.id, (matchingAsg.completedModules || 0) + 1);
    } else {
      addToast('Module Completed', 'Module marked as completed.', 'success');
    }
  };

  // Attendance Handlers
  const updateAttendance = (
    sessionId: string,
    employeeId: string,
    status: AttendanceStatus,
    notes?: string
  ) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const updatedAttendees = s.attendees.map((att) => {
            if (att.employeeId === employeeId) {
              return {
                ...att,
                status,
                notes: notes !== undefined ? notes : att.notes,
                checkInTime: status === 'Present' ? '10:00 AM' : att.checkInTime,
              };
            }
            return att;
          });
          return { ...s, attendees: updatedAttendees };
        }
        return s;
      })
    );
  };

  const saveAttendanceSheet = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;
    const presentCount = session.attendees.filter((a) => a.status === 'Present').length;
    const total = session.attendees.length;
    const rate = Math.round((presentCount / (total || 1)) * 100);

    addToast(
      'Attendance Saved',
      `Recorded session attendance: ${presentCount}/${total} attendees present (${rate}%).`,
      'success'
    );
  };

  const scheduleSession = (
    sessionData: Omit<TrainingSession, 'id' | 'attendees' | 'status'> & { attendeeIds?: string[] }
  ) => {
    const newId = `ses-${Date.now().toString().slice(-4)}`;
    const course = courses.find((c) => c.id === sessionData.courseId);

    // Default attendees from engineering or provided list
    const attendeeList = (sessionData.attendeeIds || ['usr-002', 'emp-301', 'emp-305']).map((id) => {
      const isSelf = id === currentUser.id;
      return {
        employeeId: id,
        employeeName: isSelf ? currentUser.name : id === 'emp-301' ? 'David Chen' : 'Zackariah Morris',
        employeeCode: isSelf ? currentUser.employeeCode : 'EMP-2090',
        department: isSelf ? currentUser.department : 'Engineering',
        avatar: isSelf ? currentUser.avatar : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        status: 'Present' as AttendanceStatus,
      };
    });

    const newSession: TrainingSession = {
      ...sessionData,
      id: newId,
      status: 'Scheduled',
      attendees: attendeeList,
      courseTitle: course?.title || sessionData.courseTitle,
    };

    setSessions((prev) => [newSession, ...prev]);
    addToast('Session Scheduled', `Session "${newSession.title}" added to calendar.`, 'success');

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Session Scheduled',
        message: `${newSession.title} on ${newSession.date} at ${newSession.startTime}.`,
        type: 'session',
        timestamp: 'Just now',
        read: false,
        targetTab: 'attendance',
      },
      ...prev,
    ]);
  };

  // Assessment Handlers
  const recordAssessmentMarks = (
    assessmentId: string,
    obtainedMarks: number,
    feedback?: string,
    reassessmentAllowed?: boolean
  ) => {
    setAssessments((prev) =>
      prev.map((asm) => {
        if (asm.id === assessmentId) {
          const pass = obtainedMarks >= asm.passingMarks;
          const result: AssessmentResult = pass ? 'Pass' : 'Fail';

          if (pass) {
            triggerConfetti();
          }

          addToast(
            'Score Recorded',
            `Marks updated: ${obtainedMarks}/${asm.totalMarks} (${result}). Reassessment: ${reassessmentAllowed ? 'Allowed' : 'Disabled'}`,
            pass ? 'success' : 'warning'
          );

          return {
            ...asm,
            obtainedMarks,
            result,
            feedback: feedback || asm.feedback,
            reassessmentAllowed: reassessmentAllowed !== undefined ? reassessmentAllowed : asm.reassessmentAllowed,
            attemptNumber: asm.attemptNumber + 1,
          };
        }
        return asm;
      })
    );
  };

  const createAssessment = (data: Omit<AssessmentRecord, 'id' | 'result'>) => {
    const newId = `asm-${Date.now().toString().slice(-4)}`;
    const pass = data.obtainedMarks >= data.passingMarks;
    const newAssessment: AssessmentRecord = {
      ...data,
      id: newId,
      result: data.obtainedMarks > 0 ? (pass ? 'Pass' : 'Fail') : 'Pending',
    };

    setAssessments((prev) => [newAssessment, ...prev]);
    addToast('Assessment Added', `Created assessment record for ${newAssessment.employeeName}.`, 'success');
  };

  // Certificate Handlers
  const issueCertificate = (certData: Omit<Certificate, 'id' | 'certificateNumber' | 'credentialUrl'>) => {
    const certNum = `CERT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now().toString().slice(-4)}`,
      certificateNumber: certNum,
      credentialUrl: `https://credentials.prathtech.com/verify/${certNum}`,
    };

    setCertificates((prev) => [newCert, ...prev]);
    addToast('Certificate Issued', `Issued official certificate ${certNum} to ${certData.employeeName}.`, 'success');

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Certificate Awarded!',
        message: `Official credential for "${certData.courseTitle}" is now ready to download.`,
        type: 'certificate',
        timestamp: 'Just now',
        read: false,
        targetTab: 'certificates',
      },
      ...prev,
    ]);
  };

  const recommendCourseForSkillGap = (gapId: string, courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    setSkillGaps((prev) =>
      prev.map((sg) =>
        sg.id === gapId
          ? { ...sg, recommendedCourseId: course.id, recommendedCourseTitle: course.title }
          : sg
      )
    );

    const targetGap = skillGaps.find((g) => g.id === gapId);
    if (targetGap) {
      assignTraining({
        targetType: 'employees',
        selectedTargets: [targetGap.employeeId],
        courseId: course.id,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'High',
      });
      addToast(
        'Training Recommended & Assigned',
        `Course "${course.title}" recommended and assigned to ${targetGap.employeeName}.`,
        'success'
      );
    }
  };

  const submitFeedback = (feedbackData: Omit<FeedbackRecord, 'id' | 'date'>) => {
    const newFeedback: FeedbackRecord = {
      ...feedbackData,
      id: `fb-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setFeedbacks((prev) => [newFeedback, ...prev]);
    addToast('Feedback Submitted', 'Thank you! Your ratings have been logged anonymously for quality review.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        can,
        isAllowed,
        programs,
        courses,
        assignments,
        sessions,
        assessments,
        certificates,
        skillGaps,
        feedbacks,
        notifications,
        toasts,
        addToast,
        removeToast,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addProgram,
        updateProgram,
        toggleProgramStatus,
        addCourse,
        updateCourse,
        assignTraining,
        updateAssignmentProgress,
        markModuleCompletedInCourse,
        updateAttendance,
        saveAttendanceSheet,
        scheduleSession,
        recordAssessmentMarks,
        createAssessment,
        issueCertificate,
        recommendCourseForSkillGap,
        submitFeedback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

