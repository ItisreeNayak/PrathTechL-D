import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HrAdminDashboard } from '../components/dashboard/HrAdminDashboard';
import { EmployeeDashboard } from '../components/dashboard/EmployeeDashboard';
import { ManagerDashboard } from '../components/dashboard/ManagerDashboard';
import { TrainerDashboard } from '../components/dashboard/TrainerDashboard';
import { CreateProgramModal } from '../components/modals/CreateProgramModal';
import { CreateCourseModal } from '../components/modals/CreateCourseModal';
import { AssignTrainingModal } from '../components/modals/AssignTrainingModal';
import { ScheduleSessionModal } from '../components/modals/ScheduleSessionModal';
import { RecordAssessmentModal } from '../components/modals/RecordAssessmentModal';
import { CoursePlayerModal } from '../components/learning/CoursePlayerModal';
import { CertificateModal } from '../components/learning/CertificateModal';
import { TrainingCourse, AssessmentRecord, Certificate } from '../types';

export const DashboardView: React.FC = () => {
  const { currentRole, certificates, setActiveTab } = useApp();

  // Modals state
  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAssignTrainingOpen, setIsAssignTrainingOpen] = useState(false);
  const [isScheduleSessionOpen, setIsScheduleSessionOpen] = useState(false);
  const [selectedAssessmentToGrade, setSelectedAssessmentToGrade] = useState<AssessmentRecord | null>(null);
  const [activeCourseForPlayer, setActiveCourseForPlayer] = useState<TrainingCourse | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);

  // Preselected props for Assign modal
  const [assignInitialEmpId, setAssignInitialEmpId] = useState<string | undefined>(undefined);
  const [assignInitialCourseId, setAssignInitialCourseId] = useState<string | undefined>(undefined);

  const handleRecommendTraining = (empId?: string, courseId?: string) => {
    setAssignInitialEmpId(empId);
    setAssignInitialCourseId(courseId);
    setIsAssignTrainingOpen(true);
  };

  const handleViewCertificate = (certId: string) => {
    const cert = certificates.find((c: Certificate) => c.id === certId) || certificates[0];
    if (cert) setActiveCertificate(cert);
  };

  return (
    <div className="space-y-6">
      {/* Role-Specific Dashboard Switcher */}
      {currentRole === 'hr_admin' && (
        <HrAdminDashboard
          onCreateProgram={() => setIsCreateProgramOpen(true)}
          onAddCourse={() => setIsAddCourseOpen(true)}
          onAssignTraining={() => setIsAssignTrainingOpen(true)}
        />
      )}

      {currentRole === 'employee' && (
        <EmployeeDashboard
          onOpenCoursePlayer={(c: TrainingCourse) => setActiveCourseForPlayer(c)}
          onViewCertificate={handleViewCertificate}
        />
      )}

      {currentRole === 'manager' && (
        <ManagerDashboard onRecommendTraining={handleRecommendTraining} />
      )}

      {currentRole === 'trainer' && (
        <TrainerDashboard
          onGradeAssessment={(asm: AssessmentRecord) => setSelectedAssessmentToGrade(asm)}
          onOpenAttendance={() => {
            setActiveTab('mark_attendance');
          }}
          onScheduleSession={() => setIsScheduleSessionOpen(true)}
        />
      )}

      {/* Global Interactive Modals Triggerable from Dashboards */}
      <CreateProgramModal
        isOpen={isCreateProgramOpen}
        onClose={() => setIsCreateProgramOpen(false)}
      />

      <CreateCourseModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
      />

      <AssignTrainingModal
        isOpen={isAssignTrainingOpen}
        onClose={() => setIsAssignTrainingOpen(false)}
        initialCourseId={assignInitialCourseId}
        initialEmployeeId={assignInitialEmpId}
      />

      <ScheduleSessionModal
        isOpen={isScheduleSessionOpen}
        onClose={() => setIsScheduleSessionOpen(false)}
      />

      <RecordAssessmentModal
        assessment={selectedAssessmentToGrade}
        isOpen={!!selectedAssessmentToGrade}
        onClose={() => setSelectedAssessmentToGrade(null)}
      />

      <CoursePlayerModal
        course={activeCourseForPlayer}
        isOpen={!!activeCourseForPlayer}
        onClose={() => setActiveCourseForPlayer(null)}
      />

      <CertificateModal
        certificate={activeCertificate}
        isOpen={!!activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />
    </div>
  );
};
