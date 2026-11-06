import React, { useState, useEffect } from 'react';
import { AssessmentRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface RecordAssessmentModalProps {
  assessment: AssessmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecordAssessmentModal: React.FC<RecordAssessmentModalProps> = ({
  assessment,
  isOpen,
  onClose,
}) => {
  const { recordAssessmentMarks } = useApp();

  const [obtainedMarks, setObtainedMarks] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [reassessmentAllowed, setReassessmentAllowed] = useState(false);

  useEffect(() => {
    if (assessment) {
      setObtainedMarks(assessment.obtainedMarks || 0);
      setFeedback(assessment.feedback || '');
      setReassessmentAllowed(assessment.reassessmentAllowed);
    }
  }, [assessment]);

  if (!isOpen || !assessment) return null;

  const isPassing = obtainedMarks >= assessment.passingMarks;
  const percentage = Math.round((obtainedMarks / (assessment.totalMarks || 1)) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordAssessmentMarks(assessment.id, Number(obtainedMarks), feedback, reassessmentAllowed);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Assessment Marks"
      subtitle={`Evaluate ${assessment.employeeName} for ${assessment.assessmentName}`}
      maxWidth="md"
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
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
          >
            Save & Publish Result
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trainee Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-900">{assessment.employeeName}</p>
            <p className="text-2xs text-slate-500">{assessment.employeeCode} • {assessment.department}</p>
          </div>
          <span className="font-mono text-2xs font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
            Attempt #{assessment.attemptNumber}
          </span>
        </div>

        {/* Score Inputs & Live Result */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Total Marks</label>
            <input
              type="number"
              disabled
              value={assessment.totalMarks}
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-600 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Passing Mark</label>
            <input
              type="number"
              disabled
              value={assessment.passingMarks}
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-600 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-indigo-700 mb-1">Marks Obtained *</label>
            <input
              type="number"
              min={0}
              max={assessment.totalMarks}
              value={obtainedMarks}
              onChange={(e) => setObtainedMarks(Number(e.target.value))}
              className="w-full rounded-xl border-2 border-indigo-400 px-3 py-2 text-xs font-bold text-indigo-950 font-mono focus:border-indigo-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Auto Calculated Live Result Banner */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <div>
            <p className="text-2xs font-semibold uppercase tracking-wider text-slate-500">Calculated Score</p>
            <p className="text-base font-extrabold text-slate-900">
              {percentage}% <span className="text-2xs font-normal text-slate-500">({obtainedMarks}/{assessment.totalMarks})</span>
            </p>
          </div>
          <div>
            <Badge variant={isPassing ? 'Pass' : 'Fail'} size="lg" dot />
          </div>
        </div>

        {/* Reassessment Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
          <div>
            <p className="text-xs font-bold text-slate-800">Permit Reassessment</p>
            <p className="text-2xs text-slate-500">Allow trainee another attempt if score is unsatisfactory</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={reassessmentAllowed}
              onChange={(e) => setReassessmentAllowed(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
          </label>
        </div>

        {/* Trainer Feedback Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Trainer Feedback & Recommendations</label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Constructive feedback, specific areas of strength or revision requirements..."
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};

