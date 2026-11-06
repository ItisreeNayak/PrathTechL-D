import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/exportUtils';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { mockDepartments } from '../data/mockData';
import { TrainingAssignment, TrainingSession, Certificate, SessionAttendee } from '../types';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  Users,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ReportsAnalyticsViewProps {
  mode?: 'all' | 'team_reports';
}

export const ReportsAnalyticsView: React.FC<ReportsAnalyticsViewProps> = ({ mode = 'all' }) => {
  const { assignments, sessions, certificates, skillGaps, currentUser, currentRole, addToast } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'completion' | 'attendance' | 'skills_expiry'>('completion');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>(
    mode === 'team_reports' ? currentUser.department : 'All'
  );

  // Export handlers
  const handleExportCSV = () => {
    if (activeReportTab === 'completion') {
      const headers = ['Employee Name', 'Employee Code', 'Department', 'Course Title', 'Progress %', 'Status', 'Due Date'];
      const rows = filteredAssignments.map((a: TrainingAssignment) => [
        a.employeeName,
        a.employeeCode,
        a.employeeDept,
        a.courseTitle,
        `${a.progressPercentage}%`,
        a.status,
        a.dueDate,
      ]);
      exportToCSV(
        mode === 'team_reports' ? `PrathTech_Team_Completion_Report_${currentUser.department}` : 'PrathTech_Learning_and_Development_Completion_Audit_Report',
        headers,
        rows
      );
    } else if (activeReportTab === 'attendance') {
      const headers = ['Session Title', 'Course', 'Date', 'Trainer', 'Attendee Name', 'Department', 'Status', 'Check-in Time'];
      const rows: (string | number)[][] = [];
      sessions.forEach((s: TrainingSession) => {
        s.attendees
          .filter((att) => (mode === 'team_reports' ? att.department === currentUser.department : true))
          .forEach((att: SessionAttendee) => {
            rows.push([
              s.title,
              s.courseTitle,
              s.date,
              s.trainerName,
              att.employeeName,
              att.department,
              att.status,
              att.checkInTime || 'N/A',
            ]);
          });
      });
      exportToCSV('PrathTech_Learning_and_Development_Attendance_Compliance_Report', headers, rows);
    } else {
      const headers = ['Certificate Number', 'Employee Name', 'Department', 'Course', 'Issue Date', 'Expiry Date', 'Status'];
      const rows = certificates
        .filter((c) => (mode === 'team_reports' ? c.employeeDept === currentUser.department : true))
        .map((c: Certificate) => [
          c.certificateNumber,
          c.employeeName,
          c.employeeDept,
          c.courseTitle,
          c.issueDate,
          c.expiryDate,
          c.status,
        ]);
      exportToCSV('PrathTech_Learning_and_Development_Skill_Certification_Expiry_Report', headers, rows);
    }

    addToast('Report Exported', 'CSV report generated and downloaded to your workstation.', 'success');
  };

  // Filtered datasets
  const filteredAssignments = assignments.filter((a: TrainingAssignment) => {
    if (mode === 'team_reports') {
      return a.employeeDept === currentUser.department;
    }
    return selectedDeptFilter === 'All' ? true : a.employeeDept === selectedDeptFilter;
  });

  const getTitle = () => {
    return mode === 'team_reports'
      ? `PrathTech ${currentUser.department} Team Compliance & Completion Audit`
      : 'PrathTech Learning & Development Analytics & Audits';
  };

  const getSubtitle = () => {
    return mode === 'team_reports'
      ? `Audit compliance SLAs, training progress, and certification renewals for direct reports in ${currentUser.department}`
      : 'Enterprise compliance audits, department velocity metrics, attendance logs, and certification renewals';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {getTitle()}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {getSubtitle()}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          Export Report (CSV)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveReportTab('completion')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeReportTab === 'completion'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completion & Progress Report
          </button>
          <button
            onClick={() => setActiveReportTab('attendance')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeReportTab === 'attendance'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Session Attendance Audit
          </button>
          <button
            onClick={() => setActiveReportTab('skills_expiry')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeReportTab === 'skills_expiry'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Skill Gaps & Certificate Expiries
          </button>
        </div>

        {/* Department Filter (Only for HR Admin in mode === 'all') */}
        {mode === 'all' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-2xs font-bold uppercase text-slate-400">Filter Department:</span>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Business Units</option>
              {mockDepartments.map((d: string) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: COMPLETION & PROGRESS REPORT */}
      {activeReportTab === 'completion' && (
        <div className="space-y-6">
          {/* Departmental Progress Chart Breakdown (HR Admin) */}
          {mode === 'all' && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Departmental Completion Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockDepartments.map((dept: string) => {
                  const deptItems = assignments.filter((a: TrainingAssignment) => a.employeeDept === dept);
                  const comp = deptItems.filter((i: TrainingAssignment) => i.status === 'Completed').length;
                  const total = deptItems.length || 3;
                  const rate = Math.round((comp / total) * 100);

                  return (
                    <div key={dept} className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-800">{dept}</span>
                        <span className="font-mono text-2xs font-semibold text-slate-600">
                          {comp}/{total} Finished ({rate}%)
                        </span>
                      </div>
                      <ProgressBar value={rate} size="sm" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <div className="px-6 py-4 border-b border-slate-200/90 bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900">
                {mode === 'team_reports' ? `${currentUser.department} Direct Report Training Audit Log` : 'Employee-Wise Training Audit Log'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-6">Employee</th>
                    <th className="py-3 px-6">Department</th>
                    <th className="py-3 px-6">Course Name</th>
                    <th className="py-3 px-6">Due Date</th>
                    <th className="py-3 px-6">Progress</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssignments.map((asg: TrainingAssignment) => (
                    <tr key={asg.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-6 font-bold text-slate-900">
                        {asg.employeeName}{' '}
                        <span className="font-normal font-mono text-slate-400">({asg.employeeCode})</span>
                      </td>
                      <td className="py-3 px-6 text-slate-600">{asg.employeeDept}</td>
                      <td className="py-3 px-6 font-semibold text-slate-800">{asg.courseTitle}</td>
                      <td className="py-3 px-6 font-mono text-slate-500 text-2xs">{asg.dueDate}</td>
                      <td className="py-3 px-6 min-w-[140px]">
                        <ProgressBar value={asg.progressPercentage} showLabel size="sm" />
                      </td>
                      <td className="py-3 px-6">
                        <Badge variant={asg.status} size="sm" dot />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE & COMPLIANCE AUDIT */}
      {activeReportTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <p className="text-2xs font-bold text-slate-400 uppercase">Total Sessions Held</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{sessions.length}</h3>
              <p className="text-2xs text-slate-500 mt-1">Classrooms, webinars & cohorts</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-2xs">
              <p className="text-2xs font-bold text-emerald-800 uppercase">Avg Attendance Rate</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">91.4%</h3>
              <p className="text-2xs text-emerald-600 mt-1">+4.2% vs previous quarter</p>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 shadow-2xs">
              <p className="text-2xs font-bold text-indigo-800 uppercase">Compliance Threshold</p>
              <h3 className="text-2xl font-bold text-indigo-700 mt-1">85.0%</h3>
              <p className="text-2xs text-indigo-600 mt-1">Enterprise minimum met</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <div className="px-6 py-4 border-b border-slate-200/90 bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900">Session Attendance Log</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-6">Session Title</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Trainer</th>
                    <th className="py-3 px-6">Trainee</th>
                    <th className="py-3 px-6">Department</th>
                    <th className="py-3 px-6">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.flatMap((s: TrainingSession) =>
                    s.attendees
                      .filter((att) => (mode === 'team_reports' ? att.department === currentUser.department : true))
                      .map((att: SessionAttendee) => (
                        <tr key={`${s.id}-${att.employeeId}`} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-6 font-semibold text-slate-900">{s.title}</td>
                          <td className="py-3 px-6 text-slate-500 font-mono text-2xs">{s.date}</td>
                          <td className="py-3 px-6 text-slate-700">{s.trainerName}</td>
                          <td className="py-3 px-6 font-bold text-slate-800">{att.employeeName}</td>
                          <td className="py-3 px-6 text-slate-600">{att.department}</td>
                          <td className="py-3 px-6">
                            <Badge variant={att.status} size="sm" dot />
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SKILL GAP & CERTIFICATION EXPIRY */}
      {activeReportTab === 'skills_expiry' && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <div className="px-6 py-4 border-b border-slate-200/90 bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900">Credentials Expiry Audit Schedule</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-6">Certificate ID</th>
                    <th className="py-3 px-6">Employee</th>
                    <th className="py-3 px-6">Course Track</th>
                    <th className="py-3 px-6">Issue Date</th>
                    <th className="py-3 px-6">Expiry Date</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certificates
                    .filter((c) => (mode === 'team_reports' ? c.employeeDept === currentUser.department : true))
                    .map((c: Certificate) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-6 font-mono text-2xs font-bold text-slate-600">
                          {c.certificateNumber}
                        </td>
                        <td className="py-3 px-6 font-bold text-slate-900">{c.employeeName}</td>
                        <td className="py-3 px-6 text-slate-800 font-semibold">{c.courseTitle}</td>
                        <td className="py-3 px-6 text-slate-500 font-mono text-2xs">{c.issueDate}</td>
                        <td className="py-3 px-6 text-slate-900 font-mono text-2xs font-bold">{c.expiryDate}</td>
                        <td className="py-3 px-6">
                          <Badge variant={c.status} size="sm" dot />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
