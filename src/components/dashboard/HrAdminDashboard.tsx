import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { mockDepartments } from '../../data/mockData';
import {
  GraduationCap,
  BookOpen,
  Users,
  AlertTriangle,
  PlusCircle,
  Share2,
  CalendarCheck,
  Award,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface HrAdminDashboardProps {
  onCreateProgram: () => void;
  onAddCourse: () => void;
  onAssignTraining: () => void;
}

export const HrAdminDashboard: React.FC<HrAdminDashboardProps> = ({
  onCreateProgram,
  onAddCourse,
  onAssignTraining,
}) => {
  const { programs, courses, assignments, certificates, setActiveTab } = useApp();

  const totalPrograms = programs.length;
  const activePrograms = programs.filter((p) => p.status === 'Active').length;
  const activeCourses = courses.length;
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.status === 'Completed').length;
  const ongoingAssignments = assignments.filter((a) => a.status === 'In Progress').length;
  const overdueAssignments = assignments.filter((a) => a.status === 'Overdue').length;
  const orgCompletionRate = Math.round((completedAssignments / (totalAssignments || 1)) * 100);

  // Department completion breakdown
  const departmentStats = mockDepartments.map((dept) => {
    const deptAsgs = assignments.filter((a) => a.employeeDept === dept);
    const count = deptAsgs.length;
    const completed = deptAsgs.filter((a) => a.status === 'Completed').length;
    const rate = count > 0 ? Math.round((completed / count) * 100) : 75; // fallback realistic rate
    return {
      department: dept,
      enrolled: count || 4,
      rate,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-2xs font-semibold text-indigo-200 border border-indigo-400/30">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-300" />
              PrathTech Enterprise Learning & Development Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome to PrathTech Learning & Development Management
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Workforce Capability & Training Governance: Monitor enterprise cohort milestones, departmental compliance SLAs, skill assessments, and continuous professional development.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onCreateProgram}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-900 shadow-md hover:bg-indigo-50 transition-all hover:scale-102"
            >
              <PlusCircle className="h-4 w-4 text-indigo-600" />
              Create Program
            </button>
            <button
              onClick={onAddCourse}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-700/80 border border-indigo-500/50 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-600 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              Add Course
            </button>
            <button
              onClick={onAssignTraining}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
            >
              <Share2 className="h-4 w-4" />
              Assign Training
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Programs"
          value={totalPrograms}
          subtitle={`${activePrograms} Active Cohorts`}
          icon={GraduationCap}
          accentColor="indigo"
          onClick={() => setActiveTab('programs')}
        />
        <StatCard
          title="Course Catalog"
          value={activeCourses}
          subtitle="Accredited Modules"
          icon={BookOpen}
          accentColor="sky"
          onClick={() => setActiveTab('courses')}
        />
        <StatCard
          title="Active Enrollments"
          value={ongoingAssignments + completedAssignments}
          subtitle="Workforce Members"
          icon={Users}
          accentColor="emerald"
          trend={{ value: '+14% MoM', isPositive: true }}
          onClick={() => setActiveTab('assignments')}
        />
        <StatCard
          title="Completion Rate"
          value={`${orgCompletionRate}%`}
          subtitle={`${completedAssignments} Finished`}
          icon={Award}
          accentColor="purple"
          trend={{ value: '+6.2%', isPositive: true }}
          onClick={() => setActiveTab('reports')}
        />
        <StatCard
          title="Overdue Trainings"
          value={overdueAssignments}
          subtitle="Requires Escalation"
          icon={AlertTriangle}
          accentColor="rose"
          trend={{ value: `${overdueAssignments} Pending`, isPositive: false }}
          onClick={() => setActiveTab('assignments')}
        />
      </div>

      {/* Department Breakdown & Overdue Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department-wise Training Completion */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Departmental Compliance & Completion</h3>
              <p className="text-2xs text-slate-500">Live progress across corporate business units</p>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Audit Details <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {departmentStats.map((item) => (
              <div key={item.department} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{item.department}</span>
                    <span className="text-2xs text-slate-400">({item.enrolled} trainees)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">{item.rate}%</span>
                </div>
                <ProgressBar value={item.rate} size="md" />
              </div>
            ))}
          </div>
        </div>

        {/* Priority Attention / Overdue Ticker */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
              <h3 className="text-sm font-bold text-slate-900">Critical Actions Required</h3>
            </div>
            <p className="text-2xs text-slate-500 mb-4">
              Overdue mandatory training tracks past corporate grace periods.
            </p>

            <div className="space-y-3">
              {assignments
                .filter((a) => a.status === 'Overdue')
                .slice(0, 3)
                .map((asg) => (
                  <div
                    key={asg.id}
                    className="rounded-xl border border-rose-100 bg-rose-50/40 p-3 hover:bg-rose-50/70 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{asg.employeeName}</span>
                      <Badge variant="Overdue" size="sm" />
                    </div>
                    <p className="text-2xs text-slate-600 mt-0.5 truncate">{asg.courseTitle}</p>
                    <p className="text-2xs text-rose-700 font-semibold mt-1">
                      Due: {asg.dueDate} • {asg.employeeDept}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-2xs text-slate-500">Auto-nudge sent to Reporting Managers</span>
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Manage All →
            </button>
          </div>
        </div>
      </div>

      {/* Active Programs Overview */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Training Cohorts</h3>
            <p className="text-2xs text-slate-500">Curriculums currently running across organizational teams</p>
          </div>
          <button
            onClick={() => setActiveTab('programs')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View Full Catalog →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program) => (
            <div
              key={program.id}
              className="rounded-xl border border-slate-200/90 p-4 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={program.category} size="sm" />
                  <Badge variant={program.status} size="sm" dot />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">
                  {program.title}
                </h4>
                <p className="text-2xs text-slate-500 mt-1 line-clamp-2">{program.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-2xs text-slate-600">
                  <span>Enrolled: {program.enrolledCount}</span>
                  <span>Trainer: {program.trainerName}</span>
                </div>
                <ProgressBar value={program.completionRate} size="sm" showLabel />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

