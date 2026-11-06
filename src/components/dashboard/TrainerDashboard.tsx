import React from 'react';
import { useApp } from '../../context/AppContext';
import { AssessmentRecord } from '../../types';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import {
  CalendarCheck,
  CheckCircle,
  Star,
  Users,
  Clock,
  ArrowRight,
  ClipboardEdit,
  GraduationCap,
} from 'lucide-react';

interface TrainerDashboardProps {
  onGradeAssessment: (assessment: AssessmentRecord) => void;
  onOpenAttendance: (sessionId?: string) => void;
  onScheduleSession: () => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  onGradeAssessment,
  onOpenAttendance,
  onScheduleSession,
}) => {
  const { sessions, assessments, feedbacks, currentUser, setActiveTab } = useApp();

  // Sessions trained by this trainer
  const mySessions = sessions.filter(
    (s) => s.trainerId === currentUser.id || s.trainerName.includes('Marcus')
  );
  const pendingAssessments = assessments.filter(
    (a) => a.result === 'Pending' || a.obtainedMarks === 0
  );
  const totalGraded = assessments.filter((a) => a.result === 'Pass' || a.result === 'Fail').length;

  // Average feedback rating
  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, curr) => acc + curr.trainerRating, 0) / feedbacks.length).toFixed(1)
      : '4.9';

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-2xs font-semibold text-amber-300 border border-amber-400/30">
              <GraduationCap className="h-3.5 w-3.5" />
              PrathTech Faculty & Learning & Development Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Instructor Studio & Cohort Logistics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Maintain live session attendance sheets, evaluate practical lab assignments, review trainee feedback, and facilitate world-class learning experiences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onScheduleSession}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-all hover:scale-102"
            >
              <CalendarCheck className="h-4 w-4" />
              Schedule Live Session
            </button>
            <button
              onClick={() => onOpenAttendance()}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-white/20 transition-all"
            >
              <ClipboardEdit className="h-4 w-4" />
              Attendance Roster
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Scheduled Sessions"
          value={mySessions.length}
          subtitle="Next 14 Days"
          icon={CalendarCheck}
          accentColor="amber"
          onClick={() => setActiveTab('assigned_sessions')}
        />
        <StatCard
          title="Pending Evaluations"
          value={pendingAssessments.length}
          subtitle="Requires Grading"
          icon={CheckCircle}
          accentColor="rose"
          onClick={() => setActiveTab('assessments_grading')}
        />
        <StatCard
          title="Total Evaluated"
          value={totalGraded}
          subtitle="Submissions Graded"
          icon={Users}
          accentColor="indigo"
          onClick={() => setActiveTab('assessments_grading')}
        />
        <StatCard
          title="Instructor Rating"
          value={`${avgRating} ★`}
          subtitle="Based on Trainee Reviews"
          icon={Star}
          accentColor="emerald"
          onClick={() => setActiveTab('feedback_received')}
        />
      </div>

      {/* Trainer Operational Views */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Training Sessions with quick Mark Attendance */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Training Sessions & Attendance Sheets</h3>
              <p className="text-2xs text-slate-500">Live roster management for upcoming workshops</p>
            </div>
            <button
              onClick={() => onOpenAttendance()}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Full Roster <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {mySessions.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border border-slate-200/90 p-4 hover:border-amber-400 transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      {session.date} • {session.startTime}
                    </span>
                    <Badge variant={session.mode} size="sm" />
                    <Badge variant={session.status} size="sm" dot />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{session.title}</h4>
                  <p className="text-2xs text-slate-500">
                    Course: {session.courseTitle} • {session.attendees.length} Trainees Enrolled
                  </p>
                  <p className="text-2xs text-slate-600 font-medium">📍 {session.locationOrLink}</p>
                </div>

                <div>
                  <button
                    onClick={() => onOpenAttendance(session.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-colors"
                  >
                    <ClipboardEdit className="h-4 w-4" />
                    Mark Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Pending Assessments */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Submissions Awaiting Grading
              </h3>
              <CheckCircle className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xs text-slate-500 mb-4">
              Enter quiz scores, verify coding solutions, and provide personalized feedback.
            </p>

            <div className="space-y-3">
              {pendingAssessments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">All assessments graded!</p>
              ) : (
                pendingAssessments.map((asm) => (
                  <div
                    key={asm.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/30 p-3 hover:bg-amber-50/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{asm.employeeName}</span>
                      <span className="font-mono text-2xs font-bold text-amber-700">
                        Max: {asm.totalMarks} pts
                      </span>
                    </div>
                    <p className="text-2xs text-slate-600 truncate mt-0.5">{asm.assessmentName}</p>

                    <button
                      onClick={() => onGradeAssessment(asm)}
                      className="mt-2 w-full rounded-lg bg-white border border-amber-300 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-50 transition-colors"
                    >
                      Record / Grade Marks →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
            <span>Pass threshold: 70%+</span>
            <button
              onClick={() => setActiveTab('assessments_grading')}
              className="font-bold text-indigo-600 hover:text-indigo-800"
            >
              All Assessments →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

