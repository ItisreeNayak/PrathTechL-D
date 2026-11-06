import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AssessmentRecord } from '../types';
import { Badge } from '../components/common/Badge';
import { RecordAssessmentModal } from '../components/modals/RecordAssessmentModal';
import { Can } from '../components/common/Can';
import {
  CheckCircle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ClipboardEdit,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface AssessmentsViewProps {
  mode?: 'all' | 'my_assessments' | 'grading';
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({ mode = 'all' }) => {
  const { assessments, courses, currentRole, currentUser, searchQuery, can, addToast } = useApp();

  const [selectedResult, setSelectedResult] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedAssessmentForEdit, setSelectedAssessmentForEdit] =
    useState<AssessmentRecord | null>(null);

  const effectiveSearch = (localSearch || searchQuery).toLowerCase();

  const filteredAssessments = useMemo(() => {
    return assessments.filter((asm: AssessmentRecord) => {
      // Scoping
      if (mode === 'my_assessments') {
        if (asm.employeeId !== currentUser.id) return false;
      }

      const matchSearch =
        asm.employeeName.toLowerCase().includes(effectiveSearch) ||
        asm.employeeCode.toLowerCase().includes(effectiveSearch) ||
        asm.assessmentName.toLowerCase().includes(effectiveSearch) ||
        asm.courseTitle.toLowerCase().includes(effectiveSearch);

      const matchResult = selectedResult === 'All' || asm.result === selectedResult;
      const matchCourse = selectedCourse === 'All' || asm.courseId === selectedCourse;

      return matchSearch && matchResult && matchCourse;
    });
  }, [assessments, effectiveSearch, selectedResult, selectedCourse, mode, currentUser]);

  // Quick statistics
  const totalEvaluated = filteredAssessments.length;
  const passedCount = filteredAssessments.filter((a: AssessmentRecord) => a.result === 'Pass').length;
  const failedCount = filteredAssessments.filter((a: AssessmentRecord) => a.result === 'Fail').length;
  const pendingCount = filteredAssessments.filter(
    (a: AssessmentRecord) => a.result === 'Pending' || a.obtainedMarks === 0
  ).length;
  const passRate =
    totalEvaluated - pendingCount > 0
      ? Math.round((passedCount / (totalEvaluated - pendingCount)) * 100)
      : 85;

  const canGrade = can('grade:assessment') || currentRole === 'hr_admin';

  const handleRequestRetake = (testName: string) => {
    addToast('Retake Requested', `Your retake request for "${testName}" has been submitted to the lead trainer.`, 'info');
  };

  const getTitle = () => {
    switch (mode) {
      case 'my_assessments':
        return 'My Assessments & Exam Scores';
      case 'grading':
        return 'Trainee Assessments & Grading Desk';
      case 'all':
      default:
        return 'Assessments, Quizzes & Evaluations';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'my_assessments':
        return 'Review your submitted quizzes, pass/fail status, and retake eligibility';
      case 'grading':
        return 'Evaluate trainee submissions, enter laboratory scores, and provide constructive feedback';
      case 'all':
      default:
        return 'Record grading scores, calculate pass/fail status, review attempts, and configure reassessment eligibility';
    }
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

        {selectedAssessmentForEdit && (
          <button
            onClick={() => setSelectedAssessmentForEdit(null)}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
            {mode === 'my_assessments' ? 'My Tests' : 'Total Submissions'}
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">{totalEvaluated}</h3>
            <CheckCircle className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="text-2xs text-slate-500 mt-1">Across enrolled learning tracks</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-2xs">
          <p className="text-2xs font-bold text-emerald-800 uppercase tracking-wider">
            Passed
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-emerald-700">{passedCount}</h3>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xs text-emerald-600 mt-1">{passRate}% success threshold</p>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 shadow-2xs">
          <p className="text-2xs font-bold text-rose-800 uppercase tracking-wider">
            {mode === 'my_assessments' ? 'Retakes Needed' : 'Needs Reassessment'}
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-rose-700">{failedCount}</h3>
            <XCircle className="h-5 w-5 text-rose-600" />
          </div>
          <p className="text-2xs text-rose-600 mt-1">Reassessment workflows</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 shadow-2xs">
          <p className="text-2xs font-bold text-amber-800 uppercase tracking-wider">
            {mode === 'my_assessments' ? 'Awaiting Review' : 'Pending Grading'}
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-amber-700">{pendingCount}</h3>
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-2xs text-amber-600 mt-1">Faculty evaluation queue</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Result Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Result:
            </span>
            {['All', 'Pass', 'Fail', 'Pending'].map((res) => (
              <button
                key={res}
                onClick={() => setSelectedResult(res)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedResult === res
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {res}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter test or course..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pl-8 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Assessment Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/90 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">{mode === 'my_assessments' ? 'Assessment & Subject' : 'Trainee Candidate'}</th>
                {mode !== 'my_assessments' && <th className="py-3.5 px-4">Assessment Name</th>}
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Evaluation Date</th>
                <th className="py-3.5 px-4">Score (Obtained / Total)</th>
                <th className="py-3.5 px-4">Result</th>
                <th className="py-3.5 px-4">Reassessment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    {mode === 'my_assessments'
                      ? 'No personal assessments found for this filter.'
                      : 'No assessments found matching the chosen criteria.'}
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((asm: AssessmentRecord) => {
                  const pct = Math.round((asm.obtainedMarks / (asm.totalMarks || 1)) * 100);
                  return (
                    <tr key={asm.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Candidate or Test Info */}
                      <td className="py-3.5 px-4">
                        {mode === 'my_assessments' ? (
                          <div>
                            <p className="font-bold text-slate-900 leading-snug">{asm.assessmentName}</p>
                            {asm.feedback && (
                              <p className="text-3xs text-slate-500 italic mt-0.5 line-clamp-1">
                                Trainer feedback: "{asm.feedback}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{asm.employeeName}</p>
                            <p className="text-2xs text-slate-400 font-mono mt-0.5">
                              {asm.employeeCode} • {asm.department}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Assessment Title (if not my_assessments mode) */}
                      {mode !== 'my_assessments' && (
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="font-semibold text-slate-900 leading-snug">{asm.assessmentName}</p>
                          {asm.feedback && (
                            <p className="text-3xs text-slate-500 italic mt-0.5 line-clamp-1">
                              "{asm.feedback}"
                            </p>
                          )}
                        </td>
                      )}

                      {/* Course */}
                      <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-700">
                        {asm.courseTitle}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-2xs">
                        {asm.assessmentDate}
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-mono font-bold text-slate-900 text-sm">
                            {asm.obtainedMarks} / {asm.totalMarks}{' '}
                            <span className="text-2xs font-semibold text-slate-500">({pct}%)</span>
                          </p>
                          <p className="text-3xs text-slate-400">Pass threshold: {asm.passingMarks} pts</p>
                        </div>
                      </td>

                      {/* Result Badge */}
                      <td className="py-3.5 px-4">
                        <Badge variant={asm.result} size="sm" dot />
                      </td>

                      {/* Reassessment */}
                      <td className="py-3.5 px-4">
                        {asm.reassessmentAllowed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-3xs font-bold text-amber-700">
                            <RotateCcw className="h-3 w-3" />
                            Permitted (Attempt #{asm.attemptNumber})
                          </span>
                        ) : (
                          <span className="text-3xs text-slate-400">Single attempt</span>
                        )}
                      </td>

                      {/* Actions: Contextual to Role */}
                      <td className="py-3.5 px-4 text-right">
                        {canGrade ? (
                          <button
                            onClick={() => setSelectedAssessmentForEdit(asm)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-50 shadow-2xs transition-colors"
                          >
                            <ClipboardEdit className="h-3.5 w-3.5" />
                            {currentRole === 'trainer' ? 'Grade' : 'Edit Marks'}
                          </button>
                        ) : mode === 'my_assessments' && asm.reassessmentAllowed && asm.result === 'Fail' ? (
                          <button
                            onClick={() => handleRequestRetake(asm.assessmentName)}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 hover:bg-amber-100 shadow-2xs transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Request Retake
                          </button>
                        ) : (
                          <span className="text-2xs text-slate-400 font-semibold">
                            {asm.result === 'Pass' ? 'Completed' : 'Recorded'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RecordAssessmentModal
        assessment={selectedAssessmentForEdit}
        isOpen={!!selectedAssessmentForEdit}
        onClose={() => setSelectedAssessmentForEdit(null)}
      />
    </div>
  );
};
