import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus, SessionAttendee, TrainingSession } from '../types';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { ScheduleSessionModal } from '../components/modals/ScheduleSessionModal';
import { Can } from '../components/common/Can';
import {
  CalendarCheck,
  Plus,
  Users,
  Check,
  X,
  Clock,
  Save,
  MapPin,
  Calendar,
  Sparkles,
  ClipboardEdit,
  UserCheck,
} from 'lucide-react';

interface AttendanceSessionsViewProps {
  mode?: 'all' | 'assigned_sessions' | 'mark_attendance';
}

export const AttendanceSessionsView: React.FC<AttendanceSessionsViewProps> = ({ mode = 'all' }) => {
  const {
    sessions,
    updateAttendance,
    saveAttendanceSheet,
    currentRole,
    currentUser,
    can,
  } = useApp();

  // Scoped sessions
  const availableSessions = sessions.filter((s: TrainingSession) => {
    if (mode === 'assigned_sessions' || mode === 'mark_attendance') {
      return s.trainerId === currentUser.id || s.trainerName.includes('Marcus');
    }
    return true;
  });

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    availableSessions[0]?.id || sessions[0]?.id || ''
  );
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const activeSession =
    availableSessions.find((s: TrainingSession) => s.id === selectedSessionId) ||
    availableSessions[0] ||
    sessions[0];

  if (!activeSession) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-white">
        <CalendarCheck className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-2 text-sm font-bold text-slate-900">No training sessions found</h3>
        <Can perform="view:all_reports">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
          >
            Schedule Session
          </button>
        </Can>
      </div>
    );
  }

  // Calculate live statistics
  const attendees: SessionAttendee[] = activeSession.attendees || [];
  const totalAttendees = attendees.length;
  const presentCount = attendees.filter((a: SessionAttendee) => a.status === 'Present').length;
  const absentCount = attendees.filter((a: SessionAttendee) => a.status === 'Absent').length;
  const halfDayCount = attendees.filter((a: SessionAttendee) => a.status === 'Half Day').length;

  const attendanceRate =
    totalAttendees > 0
      ? Math.round(((presentCount + halfDayCount * 0.5) / totalAttendees) * 100)
      : 0;

  const getTitle = () => {
    switch (mode) {
      case 'assigned_sessions':
        return 'My Assigned Training Batches & Rosters';
      case 'mark_attendance':
        return 'Session Attendance Roster & Check-In Sheet';
      case 'all':
      default:
        return 'Session Scheduling & Attendance Management';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'assigned_sessions':
        return 'Review upcoming scheduled workshop cohorts, curriculum topics, and enrolled trainees';
      case 'mark_attendance':
        return 'Record attendance in real time: Present, Absent, or Half Day with live percentage recalculation';
      case 'all':
      default:
        return 'Monitor enterprise session schedules, review attendance logs, and coordinate training facilities';
    }
  };

  const canMarkAttendance = can('mark:attendance') || currentRole === 'hr_admin';

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

        {/* Schedule session button (Only for HR Admin) */}
        <Can perform="create:program">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Schedule New Session
          </button>
        </Can>
      </div>

      {/* Session Selector Strip */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
              Active Session:
            </span>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="w-full sm:max-w-md rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
            >
              {availableSessions.map((s: TrainingSession) => (
                <option key={s.id} value={s.id}>
                  {s.date} • {s.title} ({s.trainerName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={activeSession.mode} size="sm" />
            <Badge variant={activeSession.status} size="sm" dot />
          </div>
        </div>

        {/* Detailed Session Information Banner */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-3 text-xs">
          <div>
            <span className="text-2xs text-slate-400 font-semibold uppercase">Course Track:</span>
            <p className="font-bold text-slate-900 mt-0.5 truncate">{activeSession.courseTitle}</p>
          </div>
          <div>
            <span className="text-2xs text-slate-400 font-semibold uppercase">Schedule & Room:</span>
            <p className="font-bold text-slate-900 mt-0.5">
              {activeSession.date} • {activeSession.startTime} - {activeSession.endTime}
            </p>
          </div>
          <div>
            <span className="text-2xs text-slate-400 font-semibold uppercase">Assigned Faculty:</span>
            <p className="font-bold text-slate-900 mt-0.5">{activeSession.trainerName}</p>
          </div>
          <div>
            <span className="text-2xs text-slate-400 font-semibold uppercase">Location / Link:</span>
            <p className="font-bold text-slate-900 mt-0.5 truncate flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              {activeSession.locationOrLink}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Live Attendance KPI Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Roster */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
          <div className="mt-1 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">{totalAttendees}</h3>
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-2xs text-slate-500 mt-1">Confirmed roster participants</p>
        </div>

        {/* Present Count */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-2xs">
          <p className="text-2xs font-bold text-emerald-800 uppercase tracking-wider">Present</p>
          <div className="mt-1 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-emerald-700">{presentCount}</h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
              ✓
            </span>
          </div>
          <p className="text-2xs text-emerald-600 mt-1">Full participation verified</p>
        </div>

        {/* Absent Count */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 shadow-2xs">
          <p className="text-2xs font-bold text-rose-800 uppercase tracking-wider">Absent</p>
          <div className="mt-1 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-rose-700">{absentCount}</h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 font-bold text-xs">
              ✕
            </span>
          </div>
          <p className="text-2xs text-rose-600 mt-1">{halfDayCount} marked Half Day</p>
        </div>

        {/* Live Attendance Percentage */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 shadow-2xs">
          <p className="text-2xs font-bold text-indigo-800 uppercase tracking-wider">Attendance Rate</p>
          <div className="mt-1 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-indigo-700 font-mono">{attendanceRate}%</h3>
            <span className="text-2xs font-bold text-indigo-600">Live Meter</span>
          </div>
          <div className="mt-2">
            <ProgressBar value={attendanceRate} size="sm" />
          </div>
        </div>
      </div>

      {/* Interactive Trainee Roster Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200/90 px-6 py-4 bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Session Attendance Roster</h3>
            <p className="text-2xs text-slate-500">
              {canMarkAttendance
                ? 'Toggle presence status (Present, Absent, Half Day) to update session logs'
                : 'View verified participation records for this training batch'}
            </p>
          </div>

          {canMarkAttendance && (
            <button
              onClick={() => saveAttendanceSheet(activeSession.id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Attendance Sheet
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-6">Trainee</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Check-in Time</th>
                <th className="py-3 px-6">Attendance Status</th>
                <th className="py-3 px-6">Notes / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {attendees.map((attendee: SessionAttendee) => (
                <tr key={attendee.employeeId} className="hover:bg-slate-50/70 transition-colors">
                  {/* Trainee Profile */}
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={attendee.avatar}
                        alt={attendee.employeeName}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{attendee.employeeName}</p>
                        <p className="text-2xs text-slate-400 font-mono">{attendee.employeeCode}</p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3 px-6 text-slate-700 font-medium">
                    {attendee.department}
                  </td>

                  {/* Check-in time */}
                  <td className="py-3 px-6 text-slate-500 font-mono text-2xs">
                    {attendee.checkInTime || '—'}
                  </td>

                  {/* Segmented Control or Read-Only Badge based on Permission */}
                  <td className="py-3 px-6">
                    {canMarkAttendance ? (
                      <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-100/80">
                        {(['Present', 'Half Day', 'Absent'] as AttendanceStatus[]).map((statusOption) => {
                          const isSelected = attendee.status === statusOption;
                          return (
                            <button
                              key={statusOption}
                              onClick={() =>
                                updateAttendance(activeSession.id, attendee.employeeId, statusOption)
                              }
                              className={`rounded-lg px-2.5 py-1 text-2xs font-bold transition-all ${
                                isSelected
                                  ? statusOption === 'Present'
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : statusOption === 'Half Day'
                                    ? 'bg-amber-500 text-white shadow-2xs'
                                    : 'bg-rose-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {statusOption}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <Badge variant={attendee.status} size="sm" dot />
                    )}
                  </td>

                  {/* Notes input */}
                  <td className="py-3 px-6">
                    {canMarkAttendance ? (
                      <input
                        type="text"
                        defaultValue={attendee.notes || ''}
                        onBlur={(e) =>
                          updateAttendance(
                            activeSession.id,
                            attendee.employeeId,
                            attendee.status,
                            e.target.value
                          )
                        }
                        placeholder="Add absence excuse or lab remarks..."
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-2xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden"
                      />
                    ) : (
                      <span className="text-2xs text-slate-500 italic">
                        {attendee.notes || '—'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ScheduleSessionModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
};
