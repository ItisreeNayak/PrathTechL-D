import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrainingCourse } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  Flame,
  Clock,
  Award,
  PlayCircle,
  Calendar,
  AlertCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface EmployeeDashboardProps {
  onOpenCoursePlayer: (course: TrainingCourse) => void;
  onViewCertificate: (certId: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  onOpenCoursePlayer,
  onViewCertificate,
}) => {
  const { currentUser, assignments, courses, sessions, certificates, assessments, setActiveTab } =
    useApp();

  // Employee-specific datasets
  const myAssignments = assignments.filter((a) => a.employeeId === currentUser.id);
  const inProgressCourses = myAssignments.filter((a) => a.status === 'In Progress');
  const completedCourses = myAssignments.filter((a) => a.status === 'Completed');
  const myCertificates = certificates.filter((c) => c.employeeId === currentUser.id);
  const myUpcomingSessions = sessions.filter((s) =>
    s.attendees.some((att) => att.employeeId === currentUser.id)
  );

  const totalAssigned = myAssignments.length;
  const overallProgressPct =
    totalAssigned > 0
      ? Math.round(
          myAssignments.reduce((acc, curr) => acc + curr.progressPercentage, 0) / totalAssigned
        )
      : 80;

  // Find course object for in-progress assignment
  const getCourseById = (id: string) => courses.find((c) => c.id === id);

  return (
    <div className="space-y-6">
      {/* Welcome & Learning Journey Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-2xs font-semibold text-emerald-300 border border-emerald-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              PrathTech Continuous Learning & Development
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome to PrathTech LearnHub, {currentUser.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              You are making great momentum on your {currentUser.department} technical tracks. Stay on top of your upcoming hands-on labs and certification evaluations.
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-xs">
            <div className="text-center">
              <div className="flex items-center justify-center text-amber-400 mb-1">
                <Flame className="h-5 w-5 fill-amber-400" />
              </div>
              <p className="text-lg font-bold">14 Days</p>
              <p className="text-2xs text-indigo-200">Learning Streak</p>
            </div>
            <div className="text-center border-x border-white/10 px-2">
              <div className="flex items-center justify-center text-sky-400 mb-1">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-lg font-bold">48.5 hrs</p>
              <p className="text-2xs text-indigo-200">Completed Time</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-emerald-400 mb-1">
                <Award className="h-5 w-5" />
              </div>
              <p className="text-lg font-bold">{myCertificates.length}</p>
              <p className="text-2xs text-indigo-200">Credentials</p>
            </div>
          </div>
        </div>

        {/* Overall Progress Tracker Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-indigo-200">Overall Assigned Track Progress</span>
            <span className="font-bold text-white">{overallProgressPct}% Completed</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-300 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Employee Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): In Progress Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Current Assigned Courses</h3>
              <p className="text-2xs text-slate-500">Pick up right where you left off</p>
            </div>
            <button
              onClick={() => setActiveTab('courses')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Browse Catalog <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {myAssignments.map((asg) => {
              const courseObj = getCourseById(asg.courseId);
              return (
                <div
                  key={asg.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={asg.courseCategory} size="sm" />
                        <Badge variant={asg.status} size="sm" dot />
                        <span className="text-2xs text-slate-400">
                          Due: <span className="font-semibold text-slate-700">{asg.dueDate}</span>
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {asg.courseTitle}
                      </h4>
                      <p className="text-2xs text-slate-500">
                        {asg.completedModules} of {asg.totalModules} modules completed
                      </p>
                    </div>

                    <div>
                      {courseObj && (
                        <button
                          onClick={() => onOpenCoursePlayer(courseObj)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
                        >
                          <PlayCircle className="h-4 w-4" />
                          {asg.status === 'Completed' ? 'Review Course' : 'Continue Learning'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <ProgressBar value={asg.progressPercentage} showLabel size="sm" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommended Learning Paths based on Skill Gap */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Recommended Based on Your Competency Gaps
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses
                .filter((c) => !myAssignments.some((a) => a.courseId === c.id))
                .slice(0, 2)
                .map((course) => (
                  <div
                    key={course.id}
                    className="rounded-xl border border-slate-200/80 p-3.5 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Badge variant={course.category} size="sm" />
                        <span className="text-2xs text-slate-400">{course.durationHours} hrs</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">
                        {course.title}
                      </h5>
                      <p className="text-2xs text-slate-500 mt-0.5 line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <button
                      onClick={() => onOpenCoursePlayer(course)}
                      className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-white py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition-colors"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Explore Syllabus
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Sessions & Credentials */}
        <div className="space-y-6">
          {/* Upcoming Scheduled Sessions */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Upcoming Live Sessions
              </h3>
              <Calendar className="h-4 w-4 text-indigo-600" />
            </div>

            <div className="space-y-3">
              {myUpcomingSessions.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No upcoming sessions</p>
              ) : (
                myUpcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 hover:bg-indigo-50/70 transition-colors"
                  >
                    <span className="font-mono text-2xs font-bold text-indigo-600">
                      {session.date} • {session.startTime}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 mt-1">{session.title}</h5>
                    <p className="text-2xs text-slate-500 mt-0.5">Trainer: {session.trainerName}</p>
                    <p className="text-2xs text-slate-600 font-semibold mt-1.5 flex items-center gap-1">
                      📍 {session.locationOrLink}
                    </p>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveTab('my_courses')}
              className="mt-3 w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              View My Courses
            </button>
          </div>

          {/* Active Credentials & Expiries */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                My Credentials & Badges
              </h3>
              <Award className="h-4 w-4 text-amber-500" />
            </div>

            <div className="space-y-2.5">
              {myCertificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => onViewCertificate(cert.id)}
                  className="rounded-xl border border-slate-200 p-3 hover:border-indigo-300 hover:shadow-2xs cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{cert.courseTitle}</p>
                    <p className="text-2xs text-slate-400">Valid until {cert.expiryDate}</p>
                  </div>
                  <Badge variant={cert.status} size="sm" />
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('my_certificates')}
              className="mt-3 w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Access Certificates Hub →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

