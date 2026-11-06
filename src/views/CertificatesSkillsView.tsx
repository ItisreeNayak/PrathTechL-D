import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Certificate, SkillGapRecord, FeedbackRecord, TrainingCourse } from '../types';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { CertificateModal } from '../components/learning/CertificateModal';
import { FeedbackModal } from '../components/modals/FeedbackModal';
import { AssignTrainingModal } from '../components/modals/AssignTrainingModal';
import { Can } from '../components/common/Can';
import {
  Award,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Star,
  ExternalLink,
  Plus,
  Send,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

interface CertificatesSkillsViewProps {
  initialTab?: 'certificates' | 'skills' | 'feedback';
  mode?: 'all' | 'my_certificates' | 'team_gaps' | 'my_skills' | 'trainer_feedback';
}

export const CertificatesSkillsView: React.FC<CertificatesSkillsViewProps> = ({
  initialTab = 'certificates',
  mode = 'all',
}) => {
  const {
    certificates,
    skillGaps,
    feedbacks,
    courses,
    recommendCourseForSkillGap,
    currentRole,
    currentUser,
    can,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'certificates' | 'skills' | 'feedback'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Modals
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackCourseId, setFeedbackCourseId] = useState(courses[0]?.id || '');

  // Pre-fill assign modal
  const [assignCourseId, setAssignCourseId] = useState<string | undefined>(undefined);
  const [assignEmpId, setAssignEmpId] = useState<string | undefined>(undefined);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleRecommendCourse = (gap: SkillGapRecord) => {
    if (gap.recommendedCourseId) {
      recommendCourseForSkillGap(gap.id, gap.recommendedCourseId);
    } else {
      setAssignEmpId(gap.employeeId);
      setIsAssignModalOpen(true);
    }
  };

  const selectedCourseForFeedback = courses.find((c: TrainingCourse) => c.id === feedbackCourseId) || courses[0];

  // Scoped datasets based on role and mode
  const scopedCertificates = certificates.filter((c: Certificate) => {
    if (mode === 'my_certificates') {
      return c.employeeId === currentUser.id;
    }
    return true;
  });

  const scopedSkillGaps = skillGaps.filter((g: SkillGapRecord) => {
    if (mode === 'team_gaps') {
      return g.department === currentUser.department;
    }
    if (mode === 'my_skills') {
      return g.employeeId === currentUser.id;
    }
    return true;
  });

  const scopedFeedbacks = feedbacks.filter((fb: FeedbackRecord) => {
    if (mode === 'trainer_feedback') {
      return fb.trainerName.includes('Marcus') || fb.trainerName === currentUser.name;
    }
    return true;
  });

  const getTitle = () => {
    switch (mode) {
      case 'my_certificates':
        return 'My Professional Certifications & Credentials';
      case 'team_gaps':
        return 'Team Skill Gap Matrix & Benchmarks';
      case 'my_skills':
        return 'My Skill Profile & Course Feedback';
      case 'trainer_feedback':
        return 'Trainee Feedback & Instructional Reviews';
      case 'all':
      default:
        return 'Credentials, Skill Profiles & Feedback Hub';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'my_certificates':
        return 'View and download verified completion credentials and official course certificates';
      case 'team_gaps':
        return `Assess required competency vs. current inventory for ${currentUser.department} team members`;
      case 'my_skills':
        return 'Track your professional skill evaluations and submit feedback on completed courses';
      case 'trainer_feedback':
        return 'Aggregated reviews and qualitative feedback submitted by cohort participants';
      case 'all':
      default:
        return 'Audit professional certifications, evaluate workforce competency gaps, and inspect instructor reviews';
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

        <div className="flex items-center gap-2">
          {/* Allow submitting feedback only if employee has permission */}
          <Can perform="submit:feedback">
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              Submit Course Feedback
            </button>
          </Can>
        </div>
      </div>

      {/* Subtabs Strip: Only render tabs allowed for this mode */}
      {mode === 'all' && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('certificates')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'certificates'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="h-4 w-4" />
            Certificates Hub ({scopedCertificates.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'skills'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Skill Gap Matrix ({scopedSkillGaps.length})
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'feedback'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Course & Trainer Feedback ({scopedFeedbacks.length})
          </button>
        </div>
      )}

      {/* TAB 1: CERTIFICATES HUB */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          {scopedCertificates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-white">
              <Award className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-2 text-sm font-bold text-slate-900">No certificates found</h3>
              <p className="mt-1 text-xs text-slate-500">Certificates are awarded upon 100% course completion.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {scopedCertificates.map((cert: Certificate) => (
                <div
                  key={cert.id}
                  className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-2xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[160px]">
                        {cert.certificateNumber}
                      </span>
                      <Badge variant={cert.status} size="sm" dot />
                    </div>

                    <div className="mt-4 flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {cert.courseTitle}
                        </h3>
                        <p className="text-2xs text-slate-500 mt-0.5">
                          Awarded to: <span className="font-bold text-slate-800">{cert.employeeName}</span> ({cert.employeeDept})
                        </p>
                      </div>
                    </div>

                    {/* Skills badges */}
                    <div className="mt-4 flex flex-wrap gap-1">
                      {cert.skillsVerified.map((sk: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded bg-slate-50 border border-slate-200 px-2 py-0.5 text-3xs font-semibold text-slate-600"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-2xs text-slate-500">
                      <span>Issued: {cert.issueDate}</span>
                      <span className="font-semibold text-slate-700">Valid Until: {cert.expiryDate}</span>
                    </div>

                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Certificate Mockup
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SKILL GAP MATRIX */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">
                {mode === 'my_skills'
                  ? 'My Competency Proficiency vs Role Benchmark'
                  : 'Competency Benchmark vs. Current Talent Inventory'}
              </h3>
              <span className="text-2xs text-slate-500">Scale: 1 (Novice) to 5 (Mastery/Authority)</span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluated based on quarterly performance reviews, practical project outcomes, and verified certification records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scopedSkillGaps.map((gap: SkillGapRecord) => {
              const gapSeverity = gap.gap >= 3 ? 'Critical' : gap.gap === 2 ? 'Moderate' : 'Developing';
              const gapBadgeColor =
                gap.gap >= 3
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : gap.gap === 2
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-sky-100 text-sky-800 border-sky-200';

              return (
                <div
                  key={gap.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4 hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{gap.employeeName}</span>
                        <span className="text-2xs text-slate-400 font-mono">({gap.employeeCode})</span>
                      </div>
                      <p className="text-2xs text-slate-500">{gap.roleTitle} • {gap.department}</p>
                    </div>

                    <span className={`rounded-full border px-2.5 py-0.5 text-2xs font-bold ${gapBadgeColor}`}>
                      Gap -{gap.gap} ({gapSeverity})
                    </span>
                  </div>

                  {/* Competency target bar */}
                  <div className="space-y-1.5 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{gap.skill}</span>
                      <span className="font-mono text-2xs text-slate-600">
                        Current: <span className="font-bold text-indigo-700">{gap.currentLevel}/5</span> | Target: <span className="font-bold text-slate-900">{gap.requiredLevel}/5</span>
                      </span>
                    </div>

                    {/* Progress with dual marker */}
                    <div className="w-full bg-slate-200 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all"
                        style={{ width: `${(gap.currentLevel / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Recommendation action (Manager/HR) */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="truncate pr-2">
                      <span className="text-3xs text-slate-400 uppercase font-bold block">
                        Recommended Solution:
                      </span>
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {gap.recommendedCourseTitle || 'Custom Coaching Program'}
                      </p>
                    </div>

                    <Can perform={['recommend:course']}>
                      <button
                        onClick={() => handleRecommendCourse(gap)}
                        className="inline-flex items-center gap-1 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-purple-700 transition-colors shrink-0"
                      >
                        Recommend Course
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </Can>

                    <Can perform={['assign:training']}>
                      <button
                        onClick={() => handleRecommendCourse(gap)}
                        className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 transition-colors shrink-0"
                      >
                        Assign Course
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </Can>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: COURSE & TRAINER FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {mode === 'trainer_feedback'
                  ? 'Instructional Performance & Student Reviews'
                  : 'Workforce Feedback & Net Promoter Scores'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Anonymous and identified trainee evaluations on instructional quality and curriculum relevance
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-center">
                <span className="text-lg font-black text-slate-900">4.92</span>
                <span className="text-amber-500 text-sm ml-1">★</span>
                <p className="text-3xs text-slate-400 font-bold uppercase">Avg Content</p>
              </div>
              <div className="border-l border-slate-200 pl-4 text-center">
                <span className="text-lg font-black text-slate-900">4.88</span>
                <span className="text-amber-500 text-sm ml-1">★</span>
                <p className="text-3xs text-slate-400 font-bold uppercase">Faculty Score</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scopedFeedbacks.map((fb: FeedbackRecord) => (
              <div
                key={fb.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-2xs text-slate-400">
                    <span>{fb.date}</span>
                    <div className="flex items-center text-amber-500 font-bold">
                      {[...Array(fb.courseRating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-2">{fb.courseTitle}</h4>
                  <p className="text-2xs text-slate-500">Instructor: {fb.trainerName}</p>

                  <div className="mt-3 rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs text-slate-700 italic">
                    "{fb.comments}"
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
                  <span>Reviewed by {fb.employeeName}</span>
                  <span className="font-semibold text-emerald-600">✓ Verified Trainee</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      <FeedbackModal
        courseId={selectedCourseForFeedback.id}
        courseTitle={selectedCourseForFeedback.title}
        trainerName={selectedCourseForFeedback.trainerName}
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

      <AssignTrainingModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        initialCourseId={assignCourseId}
        initialEmployeeId={assignEmpId}
      />
    </div>
  );
};
