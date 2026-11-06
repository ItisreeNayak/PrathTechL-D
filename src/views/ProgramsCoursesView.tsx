import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TrainingCourse, TrainingProgram, ProgramCategory, DeliveryMode, DifficultyLevel } from '../types';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { CourseDetailDrawer } from '../components/modals/CourseDetailDrawer';
import { CreateProgramModal } from '../components/modals/CreateProgramModal';
import { CreateCourseModal } from '../components/modals/CreateCourseModal';
import { CoursePlayerModal } from '../components/learning/CoursePlayerModal';
import { AssignTrainingModal } from '../components/modals/AssignTrainingModal';
import { Can } from '../components/common/Can';
import {
  GraduationCap,
  BookOpen,
  Plus,
  Search,
  Filter,
  Clock,
  Users,
  Star,
  PlayCircle,
  Share2,
  Calendar,
  Layers,
  Sparkles,
  Send,
  UserCheck,
} from 'lucide-react';

interface ProgramsCoursesViewProps {
  defaultTab?: 'courses' | 'programs';
}

export const ProgramsCoursesView: React.FC<ProgramsCoursesViewProps> = ({ defaultTab = 'courses' }) => {
  const { programs, courses, currentRole, searchQuery, can, addToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'programs'>(defaultTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveSubTab(defaultTab);
    }
  }, [defaultTab]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState('');

  // Modals
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<TrainingCourse | null>(null);
  const [courseForPlayer, setCourseForPlayer] = useState<TrainingCourse | null>(null);
  const [courseToAssign, setCourseToAssign] = useState<TrainingCourse | null>(null);
  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);

  const effectiveSearch = (localSearch || searchQuery).toLowerCase();

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c: TrainingCourse) => {
      const matchSearch =
        c.title.toLowerCase().includes(effectiveSearch) ||
        c.code.toLowerCase().includes(effectiveSearch) ||
        c.description.toLowerCase().includes(effectiveSearch) ||
        c.skills.some((s: string) => s.toLowerCase().includes(effectiveSearch));

      const matchCategory = selectedCategory === 'All' || c.category === selectedCategory;
      const matchMode = selectedMode === 'All' || c.mode === selectedMode;
      const matchDifficulty = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;

      return matchSearch && matchCategory && matchMode && matchDifficulty;
    });
  }, [courses, effectiveSearch, selectedCategory, selectedMode, selectedDifficulty]);

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((p: TrainingProgram) => {
      const matchSearch =
        p.title.toLowerCase().includes(effectiveSearch) ||
        p.code.toLowerCase().includes(effectiveSearch) ||
        p.description.toLowerCase().includes(effectiveSearch);

      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchMode = selectedMode === 'All' || p.mode === selectedMode;

      return matchSearch && matchCategory && matchMode;
    });
  }, [programs, effectiveSearch, selectedCategory, selectedMode]);

  const categories: (ProgramCategory | 'All')[] = ['All', 'Technical', 'Soft Skills', 'Leadership', 'Compliance'];
  const modes: (DeliveryMode | 'All')[] = ['All', 'Online', 'Offline', 'Hybrid'];
  const difficulties: (DifficultyLevel | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const handleSelfEnroll = (course: TrainingCourse) => {
    addToast('Course Request Submitted', `Enrollment request for "${course.title}" submitted to your manager.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {activeSubTab === 'programs' ? 'Training Programs & Cohorts' : 'Course Catalog'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentRole === 'employee'
              ? 'Browse accredited enterprise courses and request self-enrollment'
              : currentRole === 'manager'
              ? 'Review course curriculum and recommend strategic pathways for direct reports'
              : 'Explore verified accredited courses, technical workshops, and enterprise cohort tracks'}
          </p>
        </div>

        {/* Conditional Header Action Buttons */}
        <div className="flex items-center gap-2">
          <Can perform="create:program">
            <button
              onClick={() => setIsCreateCourseOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <Plus className="h-4 w-4 text-indigo-600" />
              Add Course
            </button>
            <button
              onClick={() => setIsCreateProgramOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Program
            </button>
          </Can>
        </div>
      </div>

      {/* Tabs: Courses vs Programs (Only shown if user has program access) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('courses')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeSubTab === 'courses'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Course Catalog ({filteredCourses.length})
          </button>

          <Can perform="create:program">
            <button
              onClick={() => setActiveSubTab('programs')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeSubTab === 'programs'
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Layers className="h-4 w-4" />
              Cohort Programs ({filteredPrograms.length})
            </button>
          </Can>
        </div>

        {/* Quick Search */}
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search title, skills, code..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mode & Difficulty Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Delivery Mode:
            </span>
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`rounded-lg px-2.5 py-0.5 text-2xs font-semibold transition-all ${
                  selectedMode === m
                    ? 'bg-slate-800 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {activeSubTab === 'courses' && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 mr-1">
                Difficulty:
              </span>
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`rounded-lg px-2.5 py-0.5 text-2xs font-semibold transition-all ${
                    selectedDifficulty === d
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Courses Catalog */}
      {activeSubTab === 'courses' && (
        <>
          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-white">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-2 text-sm font-bold text-slate-900">No courses match your filter</h3>
              <p className="mt-1 text-xs text-slate-500">Try adjusting your category or difficulty chips.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((course: TrainingCourse) => (
                <div
                  key={course.id}
                  className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-2xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {course.code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={course.category} size="sm" />
                        <Badge variant={course.difficulty} size="sm" />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3
                      onClick={() => setSelectedCourseForDetail(course)}
                      className="mt-3 text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors leading-snug line-clamp-2"
                    >
                      {course.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {course.skills.slice(0, 3).map((s: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded bg-slate-100 px-2 py-0.5 text-3xs font-semibold text-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                      {course.skills.length > 3 && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-3xs font-semibold text-slate-400">
                          +{course.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata and Actions Footer */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100">
                    <div className="flex items-center justify-between text-2xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {course.durationHours} hrs • {course.mode}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        {course.rating.toFixed(1)} ({course.enrolledCount})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCourseForDetail(course)}
                        className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Syllabus & Info
                      </button>

                      {/* Role-Specific Actions */}
                      <Can perform="take:course">
                        <button
                          onClick={() => setCourseForPlayer(course)}
                          className="rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-700 transition-colors"
                          title="Launch Learning Viewer"
                        >
                          <PlayCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleSelfEnroll(course)}
                          className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Self-Enroll / Request"
                        >
                          Enroll
                        </button>
                      </Can>

                      <Can perform="assign:training">
                        <button
                          onClick={() => setCourseToAssign(course)}
                          className="rounded-xl border border-indigo-200 bg-indigo-50 p-2 text-indigo-700 hover:bg-indigo-100 transition-colors"
                          title="Assign to Trainee or Department"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </Can>

                      <Can perform="recommend:course">
                        <button
                          onClick={() => setCourseToAssign(course)}
                          className="rounded-xl border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors flex items-center gap-1"
                          title="Recommend Course to Direct Report"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          Recommend
                        </button>
                      </Can>

                      {currentRole === 'trainer' && (
                        <button
                          onClick={() => setCourseForPlayer(course)}
                          className="rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-700 transition-colors"
                          title="Preview Syllabus Modules"
                        >
                          <PlayCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Cohort Programs View (Admin Only) */}
      {activeSubTab === 'programs' && (
        <Can perform="create:program" fallback={
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-white">
            <h3 className="text-sm font-bold text-slate-800">Restricted Section</h3>
            <p className="text-xs text-slate-500 mt-1">Program creation is restricted to HR Administrators.</p>
          </div>
        }>
          {filteredPrograms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-white">
              <Layers className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-2 text-sm font-bold text-slate-900">No programs match your filter</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPrograms.map((program: TrainingProgram) => (
                <div
                  key={program.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-2xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {program.code}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant={program.category} size="sm" />
                        <Badge variant={program.status} size="sm" dot />
                      </div>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">
                      {program.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                      {program.description}
                    </p>

                    {/* Program Metadata */}
                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                      <div>
                        <span className="text-2xs text-slate-400">Duration & Mode:</span>
                        <p className="font-semibold text-slate-800">
                          {program.durationHours} hrs • {program.mode}
                        </p>
                      </div>
                      <div>
                        <span className="text-2xs text-slate-400">Lead Trainer:</span>
                        <p className="font-semibold text-slate-800">{program.trainerName}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-2xs text-slate-400">Target Cohorts:</span>
                        <p className="font-semibold text-slate-800">
                          {program.targetDepartments.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Enrolled: <span className="font-bold text-slate-800">{program.enrolledCount} Trainees</span>
                      </span>
                      <span className="font-mono font-bold text-indigo-700">
                        {program.completionRate}% Avg Completion
                      </span>
                    </div>
                    <ProgressBar value={program.completionRate} size="sm" />

                    <div className="flex items-center justify-between pt-1 text-2xs text-slate-400">
                      <span>Timeline: {program.startDate} to {program.endDate}</span>
                      <span className="font-semibold text-indigo-600">{program.courseIds.length} Linked Courses</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Can>
      )}

      {/* Slide-over Course Detail Drawer */}
      <CourseDetailDrawer
        course={selectedCourseForDetail}
        isOpen={!!selectedCourseForDetail}
        onClose={() => setSelectedCourseForDetail(null)}
        onStartLearning={(c: TrainingCourse) => {
          setSelectedCourseForDetail(null);
          setCourseForPlayer(c);
        }}
        onAssignCourse={(c: TrainingCourse) => {
          setSelectedCourseForDetail(null);
          setCourseToAssign(c);
        }}
      />

      {/* Interactive Course Player Modal */}
      <CoursePlayerModal
        course={courseForPlayer}
        isOpen={!!courseForPlayer}
        onClose={() => setCourseForPlayer(null)}
      />

      {/* Assign Course Modal */}
      {courseToAssign && (
        <AssignTrainingModal
          isOpen={!!courseToAssign}
          onClose={() => setCourseToAssign(null)}
          initialCourseId={courseToAssign.id}
        />
      )}

      {/* Program & Course Creation Modals */}
      <CreateProgramModal
        isOpen={isCreateProgramOpen}
        onClose={() => setIsCreateProgramOpen(false)}
      />
      <CreateCourseModal
        isOpen={isCreateCourseOpen}
        onClose={() => setIsCreateCourseOpen(false)}
      />
    </div>
  );
};
