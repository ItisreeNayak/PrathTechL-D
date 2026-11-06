import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { mockDepartments } from '../../data/mockData';
import { Users, Building, BellRing, Calendar, AlertCircle } from 'lucide-react';

interface AssignTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseId?: string;
  initialEmployeeId?: string;
}

export const AssignTrainingModal: React.FC<AssignTrainingModalProps> = ({
  isOpen,
  onClose,
  initialCourseId,
  initialEmployeeId,
}) => {
  const { courses, assignTraining, currentUser } = useApp();

  const [targetType, setTargetType] = useState<'employees' | 'departments'>('employees');
  const [selectedCourseId, setSelectedCourseId] = useState(
    initialCourseId || (courses[0]?.id ?? '')
  );
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(
    initialEmployeeId ? [initialEmployeeId] : ['usr-002']
  );
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(['Engineering']);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  // Candidate employees
  const availableEmployees = [
    { id: 'usr-002', name: 'Alex Mercer', dept: 'Engineering', code: 'EMP-2045' },
    { id: 'emp-301', name: 'David Chen', dept: 'Engineering', code: 'EMP-2089' },
    { id: 'emp-302', name: 'Samantha Ray', dept: 'Product & Design', code: 'EMP-2114' },
    { id: 'emp-303', name: 'Liam O’Connor', dept: 'Sales & BD', code: 'EMP-2190' },
    { id: 'emp-304', name: 'Kavita Patel', dept: 'People Operations', code: 'EMP-2201' },
    { id: 'emp-305', name: 'Zackariah Morris', dept: 'IT & Security', code: 'EMP-2244' },
    { id: 'emp-306', name: 'Chloe Bennett', dept: 'Finance & Legal', code: 'EMP-2258' },
  ];

  const handleToggleEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleToggleDepartment = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    assignTraining({
      targetType,
      selectedTargets: targetType === 'employees' ? selectedEmployees : selectedDepartments,
      courseId: selectedCourseId,
      dueDate,
      priority,
    });

    onClose();
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentUser.role === 'manager' ? 'Recommend Training to Direct Reports' : 'Assign Training to Workforce'}
      subtitle={
        currentUser.role === 'manager'
          ? `Recommend strategic development tracks to ${currentUser.department} team members`
          : 'Enroll individuals or entire organizational units into courses'
      }
      maxWidth="2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              (targetType === 'employees' && selectedEmployees.length === 0) ||
              (targetType === 'departments' && selectedDepartments.length === 0)
            }
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50"
          >
            {currentUser.role === 'manager' ? 'Confirm & Recommend' : 'Confirm & Trigger Notifications'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Assignment Scope Segmented Control (Only for HR Admin) */}
        {currentUser.role !== 'manager' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Assignment Scope</label>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-100/70 p-1">
              <button
                type="button"
                onClick={() => setTargetType('employees')}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                  targetType === 'employees'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="h-4 w-4" />
                Individual Employees ({selectedEmployees.length})
              </button>
              <button
                type="button"
                onClick={() => setTargetType('departments')}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                  targetType === 'departments'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="h-4 w-4" />
                Entire Department(s) ({selectedDepartments.length})
              </button>
            </div>
          </div>
        )}

        {/* Course Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Select Course *</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white focus:border-indigo-500 focus:outline-hidden"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title} ({course.category} • {course.durationHours} hrs)
              </option>
            ))}
          </select>
          {selectedCourse && (
            <p className="mt-1 text-2xs text-slate-500">
              Instructor: {selectedCourse.trainerName} • Level: {selectedCourse.difficulty} • Mode:{' '}
              {selectedCourse.mode}
            </p>
          )}
        </div>

        {/* Target Selectors */}
        {targetType === 'employees' ? (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Trainees ({selectedEmployees.length} selected)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
              {availableEmployees.map((emp) => {
                const isSelected = selectedEmployees.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => handleToggleEmployee(emp.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/70'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded text-indigo-600 focus:ring-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">{emp.name}</p>
                      <p className="text-2xs text-slate-500">{emp.code} • {emp.dept}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Target Departments ({selectedDepartments.length} selected)
            </label>
            <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-xl bg-slate-50/50">
              {mockDepartments.map((dept) => {
                const isSelected = selectedDepartments.includes(dept);
                return (
                  <button
                    type="button"
                    key={dept}
                    onClick={() => handleToggleDepartment(dept)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Due Date & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
            <div className="relative">
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Low', 'Medium', 'High'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`rounded-xl py-2 text-xs font-bold transition-all ${
                    priority === p
                      ? p === 'High'
                        ? 'bg-rose-500 text-white shadow-2xs'
                        : p === 'Medium'
                        ? 'bg-sky-500 text-white shadow-2xs'
                        : 'bg-slate-700 text-white shadow-2xs'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Auto-Notification Preview */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 flex items-start gap-3">
          <BellRing className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-2xs text-slate-600">
            <span className="font-bold text-indigo-900">Auto-Notification Trigger: </span>
            Recipients will immediately receive an in-app alert and calendar event notification assigned by{' '}
            <span className="font-semibold text-slate-800">{currentUser.name}</span>.
          </div>
        </div>
      </form>
    </Modal>
  );
};

