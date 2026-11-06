import React, { useState } from 'react';
import { TrainingCourse, CourseModule } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Play,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  FlaskConical,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface CoursePlayerModalProps {
  course: TrainingCourse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({ course, isOpen, onClose }) => {
  const { markModuleCompletedInCourse, assignments, currentUser } = useApp();

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  if (!isOpen || !course) return null;

  const currentModule: CourseModule = course.modules[activeModuleIndex] || course.modules[0];
  const completedCount = course.modules.filter((m) => m.completed).length;
  const progressPct = Math.round((completedCount / (course.modules.length || 1)) * 100);

  // Check matching assignment for this user
  const matchingAssignment = assignments.find(
    (a) => a.courseId === course.id && a.employeeId === currentUser.id
  );

  const handleCompleteCurrentModule = () => {
    markModuleCompletedInCourse(course.id, currentModule.id);
    if (activeModuleIndex < course.modules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-3.5 w-3.5 text-indigo-500" />;
      case 'lab':
        return <FlaskConical className="h-3.5 w-3.5 text-emerald-500" />;
      case 'quiz':
        return <HelpCircle className="h-3.5 w-3.5 text-amber-500" />;
      case 'reading':
      default:
        return <BookOpen className="h-3.5 w-3.5 text-sky-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative flex flex-col w-full max-w-5xl h-[92vh] rounded-2xl bg-white shadow-2xl z-10 overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 text-white px-5 py-3">
          <div className="flex items-center gap-3 truncate">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white p-0.5 shrink-0">
              <img src="/prath-logo.png" alt="PrathTech L&D" className="h-6 w-auto object-contain" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-2xs text-indigo-300">PrathTech LearnHub</span>
                <span className="rounded bg-indigo-500/30 px-1 py-0.2 text-[9px] font-bold text-indigo-200">
                  L&D
                </span>
              </div>
              <h3 className="text-sm font-bold truncate text-white">{course.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 w-48">
              <span className="text-2xs text-slate-300 whitespace-nowrap">Progress:</span>
              <ProgressBar value={progressPct} showLabel size="sm" colorOverride="bg-emerald-400" />
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-y-auto">
            {/* Interactive Player Mockup */}
            <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center border-b border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Central Player Graphic */}
              <div className="text-center z-10 px-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600/90 text-white shadow-xl shadow-indigo-600/40 hover:scale-105 transition-transform cursor-pointer">
                  <Play className="h-8 w-8 ml-1" />
                </div>
                <h4 className="mt-4 text-sm font-bold text-white tracking-wide">
                  {currentModule.title}
                </h4>
                <p className="mt-1 text-2xs text-slate-400">
                  Duration: {currentModule.durationMinutes} mins • {currentModule.type.toUpperCase()}
                </p>
              </div>

              {/* Video control bottom bar */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950 to-transparent flex items-center justify-between text-2xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button className="hover:text-white font-mono">00:00 / {currentModule.durationMinutes}:00</button>
                  <span className="text-slate-600">|</span>
                  <span className="text-emerald-400 font-semibold">1080p HD Audio & Video</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded text-[10px]">
                    Speed 1.0x
                  </span>
                </div>
              </div>
            </div>

            {/* Module Overview Details */}
            <div className="flex-1 p-6 bg-white overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-100 text-indigo-700 text-2xs font-bold px-2 py-0.5 uppercase">
                      Module {activeModuleIndex + 1} of {course.modules.length}
                    </span>
                    <span className="text-2xs text-slate-400 capitalize">• {currentModule.type} Session</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{currentModule.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {currentModule.completed ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={handleCompleteCurrentModule}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark Module Completed
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200/90 bg-slate-50/70 p-4">
                <h5 className="text-xs font-bold text-slate-800 mb-1">Module Learning Objectives</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentModule.contentSnippet ||
                    'Understand core theoretical principles, implement real-world enterprise architectures, and review production deployment checklists for zero-downtime execution.'}
                </p>
              </div>

              {/* Bottom Nav Prev / Next */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  disabled={activeModuleIndex === 0}
                  onClick={() => setActiveModuleIndex(activeModuleIndex - 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous Module
                </button>

                <button
                  disabled={activeModuleIndex === course.modules.length - 1}
                  onClick={() => setActiveModuleIndex(activeModuleIndex + 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-40"
                >
                  Next Module
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar Syllabus Tracker */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50 flex flex-col h-60 md:h-auto">
            <div className="p-4 border-b border-slate-200 bg-white">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Course Syllabus
              </h4>
              <p className="text-2xs text-slate-500 mt-0.5">
                {completedCount} / {course.modules.length} modules finished ({progressPct}%)
              </p>
              <div className="mt-2">
                <ProgressBar value={progressPct} size="sm" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
              {course.modules.map((m, idx) => {
                const isCurrent = idx === activeModuleIndex;
                return (
                  <div
                    key={m.id}
                    onClick={() => setActiveModuleIndex(idx)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-indigo-50/90 border border-indigo-200 shadow-2xs'
                        : 'hover:bg-slate-100/80 bg-white mb-1.5 border border-slate-200/60'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {m.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs line-clamp-2 leading-tight ${
                          isCurrent ? 'font-bold text-indigo-950' : 'font-medium text-slate-800'
                        }`}
                      >
                        {m.title}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-2xs text-slate-400">
                        {getModuleIcon(m.type)}
                        <span className="capitalize">{m.type}</span>
                        <span>•</span>
                        <span>{m.durationMinutes} min</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {matchingAssignment && (
              <div className="p-3 border-t border-slate-200 bg-white text-2xs text-slate-500">
                <span className="font-semibold text-slate-700">Due Date: </span>
                {matchingAssignment.dueDate}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

