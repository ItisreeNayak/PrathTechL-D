import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardView } from './views/DashboardView';
import { ProgramsCoursesView } from './views/ProgramsCoursesView';
import { AssignmentsView } from './views/AssignmentsView';
import { AttendanceSessionsView } from './views/AttendanceSessionsView';
import { AssessmentsView } from './views/AssessmentsView';
import { CertificatesSkillsView } from './views/CertificatesSkillsView';
import { ReportsAnalyticsView } from './views/ReportsAnalyticsView';
import { isRouteAllowed } from './config/rbac';

const MainLayout: React.FC = () => {
  const { activeTab, currentRole } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderActiveView = () => {
    // Guard against unauthorized route rendering
    if (!isRouteAllowed(currentRole, activeTab)) {
      return <DashboardView />;
    }

    switch (activeTab) {
      // Dashboards
      case 'dashboard':
      case 'my_learning':
      case 'team_dashboard':
      case 'trainer_dashboard':
        return <DashboardView />;

      // Programs & Courses
      case 'programs':
        return <ProgramsCoursesView defaultTab="programs" />;
      case 'courses':
        return <ProgramsCoursesView defaultTab="courses" />;

      // Assignments & Learning Tracks
      case 'assignments':
        return <AssignmentsView mode="assignments" />;
      case 'my_courses':
        return <AssignmentsView mode="my_courses" />;
      case 'team_progress':
        return <AssignmentsView mode="team_progress" />;
      case 'recommend_training':
        return <AssignmentsView mode="recommend_training" />;

      // Sessions & Attendance
      case 'attendance':
        return <AttendanceSessionsView mode="all" />;
      case 'assigned_sessions':
        return <AttendanceSessionsView mode="assigned_sessions" />;
      case 'mark_attendance':
        return <AttendanceSessionsView mode="mark_attendance" />;

      // Assessments & Results
      case 'assessments':
        return <AssessmentsView mode="all" />;
      case 'my_assessments':
        return <AssessmentsView mode="my_assessments" />;
      case 'assessments_grading':
        return <AssessmentsView mode="grading" />;

      // Certificates, Skills & Feedback
      case 'certificates':
        return <CertificatesSkillsView initialTab="certificates" mode="all" />;
      case 'my_certificates':
        return <CertificatesSkillsView initialTab="certificates" mode="my_certificates" />;
      case 'team_skill_gaps':
        return <CertificatesSkillsView initialTab="skills" mode="team_gaps" />;
      case 'feedback_skills':
        return <CertificatesSkillsView initialTab="feedback" mode="my_skills" />;
      case 'feedback_received':
        return <CertificatesSkillsView initialTab="feedback" mode="trainer_feedback" />;

      // Reports & Analytics
      case 'reports':
        return <ReportsAnalyticsView mode="all" />;
      case 'team_reports':
        return <ReportsAnalyticsView mode="team_reports" />;

      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation with Centralized RBAC Mapping */}
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Navbar />

        {/* Dynamic View Scroll Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Interactive Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
