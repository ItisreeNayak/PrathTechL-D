import React from 'react';
import { TrainingCourse } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  X,
  Clock,
  BookOpen,
  Video,
  FileText,
  FlaskConical,
  HelpCircle,
  Download,
  Users,
  Star,
  CheckCircle2,
  PlayCircle,
  Share2,
} from 'lucide-react';

interface CourseDetailDrawerProps {
  course: TrainingCourse | null;
  isOpen: boolean;
  onClose: () => void;
  onStartLearning?: (course: TrainingCourse) => void;
  onAssignCourse?: (course: TrainingCourse) => void;
}

export const CourseDetailDrawer: React.FC<CourseDetailDrawerProps> = ({
  course,
  isOpen,
  onClose,
  onStartLearning,
  onAssignCourse,
}) => {
  const { addToast, can } = useApp();

  if (!isOpen || !course) return null;

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-indigo-500" />;
      case 'lab':
        return <FlaskConical className="h-4 w-4 text-emerald-500" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4 text-amber-500" />;
      case 'reading':
      default:
        return <FileText className="h-4 w-4 text-sky-500" />;
    }
  };

  const handleDownloadResource = (resTitle: string) => {
    addToast('Resource Downloaded', `Downloaded "${resTitle}"`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative flex w-full max-w-xl flex-col bg-white shadow-2xl z-10 overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/90 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
              {course.code}
            </span>
            <Badge variant={course.category} size="sm" />
            <Badge variant={course.difficulty} size="sm" />
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{course.title}</h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">{course.description}</p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 text-center">
            <div>
              <p className="text-2xs font-semibold text-slate-500">Duration</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900 flex items-center justify-center gap-1">
                <Clock className="h-3.5 w-3.5 text-indigo-500" />
                {course.durationHours} hrs
              </p>
            </div>
            <div className="border-x border-slate-200">
              <p className="text-2xs font-semibold text-slate-500">Enrolled Trainees</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900 flex items-center justify-center gap-1">
                <Users className="h-3.5 w-3.5 text-emerald-500" />
                {course.enrolledCount}
              </p>
            </div>
            <div>
              <p className="text-2xs font-semibold text-slate-500">Rating</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900 flex items-center justify-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                {course.rating.toFixed(1)} / 5.0
              </p>
            </div>
          </div>

          {/* Trainer Card */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/90 p-3 bg-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
              {course.trainerName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1">
              <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Course Instructor</p>
              <p className="text-xs font-bold text-slate-900">{course.trainerName}</p>
              <p className="text-2xs text-slate-500">Mode: {course.mode}</p>
            </div>
          </div>

          {/* Skills Acquired */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Competencies & Skills Acquired
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-indigo-50/70 border border-indigo-200/70 px-2.5 py-1 text-2xs font-bold text-indigo-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          {course.prerequisites.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Prerequisites & Requirements
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {course.prerequisites.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Syllabus Modules */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Syllabus & Modules ({course.modules.length})
              </h4>
              <span className="text-2xs text-slate-500">
                {course.modules.filter((m) => m.completed).length} completed
              </span>
            </div>

            <div className="space-y-2">
              {course.modules.map((mod, index) => (
                <div
                  key={mod.id}
                  className={`rounded-xl border p-3 transition-colors ${
                    mod.completed ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200/90 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg p-1.5 bg-slate-50 border border-slate-200 shadow-2xs">
                        {getModuleIcon(mod.type)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {index + 1}. {mod.title}
                        </p>
                        <p className="text-2xs text-slate-500 capitalize">
                          {mod.type} • {mod.durationMinutes} minutes
                        </p>
                      </div>
                    </div>
                    {mod.completed && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-2xs font-bold text-emerald-700">
                        Done
                      </span>
                    )}
                  </div>
                  {mod.contentSnippet && (
                    <p className="mt-2 text-2xs text-slate-500 border-t border-slate-100 pt-1.5 pl-9">
                      {mod.contentSnippet}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          {course.resources.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Attached Learning Resources
              </h4>
              <div className="space-y-2">
                {course.resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200/90 p-2.5 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-indigo-500" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{res.title}</p>
                        <p className="text-2xs text-slate-400">{res.type} • {res.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadResource(res.title)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                      title="Download resource"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 border-t border-slate-200/90 bg-slate-50/80 px-6 py-4">
          {onAssignCourse && (can('assign:training') || can('recommend:course')) && (
            <button
              onClick={() => onAssignCourse(course)}
              className="flex-1 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 shadow-2xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              {can('recommend:course') && !can('assign:training') ? 'Recommend Course' : 'Assign Course'}
            </button>
          )}

          {onStartLearning && (
            <button
              onClick={() => onStartLearning(course)}
              className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              Launch Learning Viewer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

