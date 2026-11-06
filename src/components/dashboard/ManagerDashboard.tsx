import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { StatCard } from '../common/StatCard';
import {
  Users,
  AlertTriangle,
  Award,
  Sparkles,
  Share2,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

interface ManagerDashboardProps {
  onRecommendTraining: (empId?: string, courseId?: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onRecommendTraining }) => {
  const { assignments, skillGaps, currentUser, setActiveTab } = useApp();

  // Filter team members in Manager's department (e.g. Engineering)
  const teamAssignments = assignments.filter((a) => a.employeeDept === currentUser.department);

  // Group by employee
  const teamMembersMap = new Map<string, { name: string; avatar: string; code: string; items: typeof teamAssignments }>();
  teamAssignments.forEach((asg) => {
    if (!teamMembersMap.has(asg.employeeId)) {
      teamMembersMap.set(asg.employeeId, {
        name: asg.employeeName,
        avatar: asg.employeeAvatar,
        code: asg.employeeCode,
        items: [],
      });
    }
    teamMembersMap.get(asg.employeeId)!.items.push(asg);
  });

  const teamMembers = Array.from(teamMembersMap.values());
  const teamOverdue = teamAssignments.filter((a) => a.status === 'Overdue').length;
  const teamCompleted = teamAssignments.filter((a) => a.status === 'Completed').length;
  const teamTotal = teamAssignments.length;
  const teamComplianceRate = Math.round((teamCompleted / (teamTotal || 1)) * 100);

  // Department skill gaps
  const teamGaps = skillGaps.filter((g) => g.department === currentUser.department);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-2xs font-semibold text-purple-200 border border-purple-400/30">
              <TrendingUp className="h-3.5 w-3.5 text-purple-300" />
              PrathTech {currentUser.department} Learning & Development Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Team Learning & Development Progress
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Track team learning progress, resolve competency bottlenecks, and recommend strategic technical pathways to support squad deliverables.
            </p>
          </div>

          <button
            onClick={() => onRecommendTraining()}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-purple-900 shadow-md hover:bg-purple-50 transition-all hover:scale-102"
          >
            <Share2 className="h-4 w-4 text-purple-600" />
            Recommend Training
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Direct Reports"
          value={teamMembers.length}
          subtitle={`${currentUser.department} Team`}
          icon={Users}
          accentColor="purple"
        />
        <StatCard
          title="Team Compliance"
          value={`${teamComplianceRate}%`}
          subtitle="Mandatory Curricula"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <StatCard
          title="Active Tracks"
          value={teamAssignments.filter((a) => a.status === 'In Progress').length}
          subtitle="Ongoing Modules"
          icon={Sparkles}
          accentColor="indigo"
        />
        <StatCard
          title="Overdue Items"
          value={teamOverdue}
          subtitle="Needs Follow-up"
          icon={AlertTriangle}
          accentColor="rose"
        />
      </div>

      {/* Team Training Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members List */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Direct Report Training Status</h3>
              <p className="text-2xs text-slate-500">Live progress across assigned development tracks</p>
            </div>
            <button
              onClick={() => setActiveTab('team_progress')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Full Roster <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {teamMembers.map((member) => {
              const memberCompleted = member.items.filter((i) => i.status === 'Completed').length;
              const avgProgress = Math.round(
                member.items.reduce((acc, curr) => acc + curr.progressPercentage, 0) /
                  (member.items.length || 1)
              );

              return (
                <div
                  key={member.code}
                  className="rounded-xl border border-slate-200/90 p-4 hover:border-slate-300 transition-all bg-slate-50/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500/20"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                        <p className="text-2xs text-slate-500">
                          {member.code} • {member.items.length} Assigned Tracks
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">{avgProgress}% Avg</span>
                      <p className="text-2xs text-slate-500">{memberCompleted} Completed</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <ProgressBar value={avgProgress} size="sm" />
                  </div>

                  {/* Micro list of courses */}
                  <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60">
                    {member.items.map((it) => (
                      <span
                        key={it.id}
                        className={`rounded-lg px-2 py-0.5 text-2xs font-semibold border ${
                          it.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : it.status === 'Overdue'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {it.courseTitle.split(':')[0]} ({it.status})
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Gap Matrix Snippet */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Identified Skill Gaps
              </h3>
              <Award className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xs text-slate-500 mb-4">
              Competencies requiring leveling up for quarterly engineering objectives.
            </p>

            <div className="space-y-3">
              {teamGaps.map((gap) => (
                <div key={gap.id} className="rounded-xl border border-slate-200 p-3 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{gap.employeeName}</span>
                    <span className="rounded bg-rose-100 text-rose-800 font-bold text-2xs px-1.5 py-0.5">
                      Gap: -{gap.gap}
                    </span>
                  </div>
                  <p className="text-2xs text-slate-600 font-semibold">{gap.skill}</p>

                  <div className="flex items-center gap-2 text-2xs text-slate-500">
                    <span>Lvl {gap.currentLevel}/5</span>
                    <div className="flex-1">
                      <ProgressBar
                        value={(gap.currentLevel / 5) * 100}
                        size="sm"
                        colorOverride="bg-purple-600"
                      />
                    </div>
                    <span>Req: Lvl {gap.requiredLevel}</span>
                  </div>

                  {gap.recommendedCourseTitle && (
                    <button
                      onClick={() => onRecommendTraining(gap.employeeId, gap.recommendedCourseId)}
                      className="mt-1 w-full text-center rounded-lg bg-purple-50 hover:bg-purple-100 py-1 text-2xs font-bold text-purple-700 transition-colors"
                    >
                      Assign Recommended Course →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('team_skill_gaps')}
            className="mt-4 w-full text-center text-xs font-bold text-purple-700 hover:text-purple-900"
          >
            Open Full Skill Gap Matrix →
          </button>
        </div>
      </div>
    </div>
  );
};

