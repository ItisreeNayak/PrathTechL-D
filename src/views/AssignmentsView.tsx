import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AssignmentPriority, AssignmentStatus, TrainingAssignment, TrainingCourse } from '../types';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { AssignTrainingModal } from '../components/modals/AssignTrainingModal';
import { CoursePlayerModal } from '../components/learning/CoursePlayerModal';
import { Can } from '../components/common/Can';
import { mockDepartments } from '../data/mockData';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  PlayCircle,
  BellRing,
  MoreVertical,
  Calendar,
  AlertCircle,
  Sparkles,
  Users,
  Send,
} from 'lucide-react';

interface AssignmentsViewProps {
  mode?: 'assignments' | 'my_courses' | 'team_progress' | 'recommend_training';
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({ mode = 'assignments' }) => {
  const {
    assignments,
    courses,
    updateAssignmentProgress,
    currentRole,
    currentUser,
    searchQuery,
    addToast,
    can,
  } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState('');

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [courseForPlayer, setCourseForPlayer] = useState<TrainingCourse | null>(null);

  const effectiveSearch = (localSearch || searchQuery).toLowerCase();

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a: TrainingAssignment) => {
      // Role & Mode scoping
      if (mode === 'my_courses') {
        if (a.employeeId !== currentUser.id) return false;
      } else if (mode === 'team_progress' || mode === 'recommend_training') {
        if (a.employeeDept !== currentUser.department) return false;
      }

      const matchSearch =
        a.employeeName.toLowerCase().includes(effectiveSearch) ||
        a.employeeCode.toLowerCase().includes(effectiveSearch) ||
        a.courseTitle.toLowerCase().includes(effectiveSearch) ||
        a.employeeDept.toLowerCase().includes(effectiveSearch);

      const matchStatus = selectedStatus === 'All' || a.status === selectedStatus;
      const matchDept = selectedDept === 'All' || a.employeeDept === selectedDept;
      const matchPriority = selectedPriority === 'All' || a.priority === selectedPriority;

      return matchSearch && matchStatus && matchDept && matchPriority;
    });
  }, [assignments, effectiveSearch, selectedStatus, selectedDept, selectedPriority, mode, currentUser]);

  const handleNudge = (empName: string, courseTitle: string) => {
    addToast('Reminder Dispatched', `Automated nudge sent to ${empName} for "${courseTitle}".`, 'info');
  };

  const handleQuickAdvance = (asgId: string, currentCompleted: number, total: number) => {
    const nextCount = Math.min(currentCompleted + 1, total);
    updateAssignmentProgress(asgId, nextCount);
  };

  const statuses = ['All', 'In Progress', 'Completed', 'Overdue', 'Not Started'];
  const priorities = ['All', 'High', 'Medium', 'Low'];

  const getHeaderTitle = () => {
    switch (mode) {
      case 'my_courses':
        return 'My Assigned Courses & Progress';
      case 'team_progress':
        return 'Team Training Progress & Learning History';
      case 'recommend_training':
        return 'Recommend Training to Direct Reports';
      case 'assignments':
      default:
        return 'Workforce Training Assignments';
    }
  };

  const getHeaderSubtitle = () => {
    switch (mode) {
      case 'my_courses':
        return 'Review your enrolled courses, resume active modules, and track completion deadlines';
      case 'team_progress':
        return `Monitor training progress and compliance for ${currentUser.department} team members`;
      case 'recommend_training':
        return 'Assign high-impact development programs to address squad competency gaps';
      case 'assignments':
      default:
        return 'Monitor trainee enrollment milestones, track SLAs, and manage course completion timelines';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {getHeaderTitle()}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {getHeaderSubtitle()}
          </p>
        </div>

        {/* Action Button: Visible only if user has permission */}
        <div>
          <Can perform="assign:training">
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Assign Training
            </button>
          </Can>

          <Can perform="recommend:course">
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              Recommend Training
            </button>
          </Can>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Department Dropdown (Hide in Employee mode since it's only themselves) */}
            {mode !== 'my_courses' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-2xs font-bold text-slate-400 uppercase">Department:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-hidden"
                >
                  <option value="All">All Departments</option>
                  {mockDepartments.map((d: string) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Priority Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-2xs font-bold text-slate-400 uppercase">Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-hidden"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p === 'All' ? 'All Priorities' : `${p} Priority`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter course or trainee..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pl-8 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/90 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">{mode === 'my_courses' ? 'Course Title' : 'Trainee / Member'}</th>
                {mode !== 'my_courses' && <th className="py-3.5 px-4">Assigned Course</th>}
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4 min-w-[160px]">Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    {mode === 'my_courses'
                      ? 'No assigned courses found in this category.'
                      : 'No assignment records match the chosen filter.'}
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((asg: TrainingAssignment) => (
                  <tr key={asg.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Trainee or Course depending on mode */}
                    <td className="py-3.5 px-4">
                      {mode === 'my_courses' ? (
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">{asg.courseTitle}</p>
                          <span className="text-2xs text-slate-400 capitalize">{asg.courseCategory}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <img
                            src={asg.employeeAvatar}
                            alt={asg.employeeName}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{asg.employeeName}</p>
                            <p className="text-2xs text-slate-500 mt-0.5">
                              {asg.employeeCode} • {asg.employeeDept}
                            </p>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Course Name (only if not my_courses mode) */}
                    {mode !== 'my_courses' && (
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-semibold text-slate-900 leading-snug line-clamp-1">
                          {asg.courseTitle}
                        </p>
                        <span className="text-2xs text-slate-400 capitalize">{asg.courseCategory}</span>
                      </td>
                    )}

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <Badge variant={asg.priority} size="sm" />
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="text-2xs text-slate-500">
                          Due: <span className="font-semibold text-slate-800">{asg.dueDate}</span>
                        </p>
                        <p className="text-3xs text-slate-400">Assigned: {asg.assignedDate}</p>
                      </div>
                    </td>

                    {/* Progress Bar */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <ProgressBar value={asg.progressPercentage} showLabel size="sm" />
                        <span className="text-3xs text-slate-400 block text-right">
                          {asg.completedModules} / {asg.totalModules} modules
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge variant={asg.status} size="sm" dot />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {asg.status !== 'Completed' && (
                          <button
                            onClick={() => handleQuickAdvance(asg.id, asg.completedModules, asg.totalModules)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            title="Complete next module"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const c = courses.find((course: TrainingCourse) => course.id === asg.courseId);
                            if (c) setCourseForPlayer(c);
                          }}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                          title="Open Course Player"
                        >
                          <PlayCircle className="h-4 w-4" />
                        </button>

                        <Can perform="view:all_reports">
                          {(asg.status === 'Overdue' || asg.status === 'Not Started') && (
                            <button
                              onClick={() => handleNudge(asg.employeeName, asg.courseTitle)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                              title="Send reminder alert"
                            >
                              <BellRing className="h-4 w-4" />
                            </button>
                          )}
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AssignTrainingModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
      />

      <CoursePlayerModal
        course={courseForPlayer}
        isOpen={!!courseForPlayer}
        onClose={() => setCourseForPlayer(null)}
      />
    </div>
  );
};
