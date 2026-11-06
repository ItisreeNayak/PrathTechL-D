import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ProgramCategory, DeliveryMode } from '../../types';
import { mockDepartments } from '../../data/mockData';

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProgramModal: React.FC<CreateProgramModalProps> = ({ isOpen, onClose }) => {
  const { addProgram, courses, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProgramCategory>('Technical');
  const [mode, setMode] = useState<DeliveryMode>('Hybrid');
  const [durationHours, setDurationHours] = useState(40);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['Engineering']);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [status, setStatus] = useState<'Active' | 'Draft'>('Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addProgram({
      title,
      description,
      category,
      mode,
      trainerId: currentUser.id,
      trainerName: currentUser.name,
      durationHours: Number(durationHours) || 20,
      startDate,
      endDate,
      targetDepartments: selectedDepts,
      status,
      courseIds: selectedCourses,
    });

    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedCourses([]);
  };

  const toggleDept = (dept: string) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const toggleCourse = (cId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(cId) ? prev.filter((id) => id !== cId) : [...prev, cId]
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Training Program"
      subtitle="Define learning objectives, timeline, target cohorts, and curriculum"
      maxWidth="2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Publish Program
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Program Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 2026 Cloud-Native Engineering Fellowship"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Description & Strategic Goals</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the scope, competencies acquired, and business outcomes..."
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProgramCategory)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="Technical">Technical</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Leadership">Leadership</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as DeliveryMode)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="Online">Online (Self-Paced/Virtual)</option>
              <option value="Offline">Offline (Classroom)</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Hours)</label>
            <input
              type="number"
              min={1}
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Target Departments ({selectedDepts.length} selected)
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 rounded-xl border border-slate-200 bg-slate-50/50">
            {mockDepartments.map((dept) => {
              const isSelected = selectedDepts.includes(dept);
              return (
                <button
                  type="button"
                  key={dept}
                  onClick={() => toggleDept(dept)}
                  className={`rounded-lg px-2.5 py-1 text-2xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Attach Courses to Program ({selectedCourses.length} selected)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
            {courses.map((course) => {
              const isSelected = selectedCourses.includes(course.id);
              return (
                <div
                  key={course.id}
                  onClick={() => toggleCourse(course.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/60'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <div className="flex-1 truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">{course.title}</p>
                    <p className="text-2xs text-slate-500">{course.durationHours} hrs • {course.difficulty}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div>
            <p className="text-xs font-bold text-slate-800">Initial Program Status</p>
            <p className="text-2xs text-slate-500">Draft programs are hidden from general enrollment</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStatus('Draft')}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                status === 'Draft' ? 'bg-amber-500 text-white shadow-2xs' : 'bg-white border text-slate-600'
              }`}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => setStatus('Active')}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                status === 'Active' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white border text-slate-600'
              }`}
            >
              Active
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

