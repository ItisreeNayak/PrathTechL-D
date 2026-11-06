import React from 'react';
import { useApp } from '../../context/AppContext';
import { NAVIGATION_CONFIG } from '../../config/rbac';
import {
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { activeTab, setActiveTab, currentRole, currentUser, assignments, sessions, assessments } = useApp();

  // Badges calculation
  const overdueCount = assignments.filter((a) => a.status === 'Overdue').length;
  const pendingAssessmentsCount = assessments.filter((a) => a.result === 'Pending' || a.obtainedMarks === 0).length;
  const scheduledSessionsCount = sessions.filter((s) => s.status === 'Scheduled').length;
  const myAssessmentsCount = assessments.filter(
    (a) => a.employeeId === currentUser.id && (a.result === 'Pending' || a.obtainedMarks === 0)
  ).length;
  const myOverdueCount = assignments.filter(
    (a) => a.employeeId === currentUser.id && a.status === 'Overdue'
  ).length;

  // Dynamically filter navigation items based on currentRole
  const currentNavItems = NAVIGATION_CONFIG.filter((item) =>
    item.allowedRoles.includes(currentRole)
  );

  const getRoleScopeDescription = () => {
    switch (currentRole) {
      case 'hr_admin':
        return 'Org-Wide Governance';
      case 'employee':
        return 'Personal Learning';
      case 'manager':
        return 'Direct Reports';
      case 'trainer':
        return 'Faculty & Batches';
    }
  };

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200/90 bg-white transition-all duration-300 ease-in-out shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200/90 px-3.5">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/prath-logo.png"
              alt="PrathTech L&D"
              className="h-9 w-auto object-contain shrink-0 rounded-lg p-0.5 bg-white border border-slate-200/80 shadow-2xs"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 truncate">
                  PrathTech <span className="text-indigo-600">LearnHub</span>
                </span>
                <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 shrink-0">
                  L&D
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 truncate leading-tight">
                Enterprise Learning & Development
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200/90 shadow-2xs p-1" title="PrathTech LearnHub - Learning & Development">
            <img
              src="/prath-logo.png"
              alt="PrathTech L&D"
              className="h-7 w-auto object-contain"
            />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0 ml-1"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List dynamically generated per Role */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 pt-2 pb-1 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </p>
            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              {currentNavItems.length} modules
            </span>
          </div>
        )}

        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badgeValue = item.badge?.({
            overdueCount,
            pendingAssessmentsCount,
            scheduledSessionsCount,
            myAssessmentsCount,
            myOverdueCount,
          });

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'
                }`}
              />

              {!isCollapsed && (
                <div className="flex flex-1 items-center justify-between text-left truncate">
                  <span className="truncate">{item.label}</span>
                  {badgeValue && (
                    <span
                      className={`ml-2 rounded-full border px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {badgeValue}
                    </span>
                  )}
                </div>
              )}

              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-white" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Role Context Footer */}
      {!isCollapsed ? (
        <div className="border-t border-slate-100 p-3">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-indigo-600 shrink-0" />
              <div className="flex-1 truncate">
                <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Current Scope</p>
                <p className="text-xs font-bold text-slate-800 capitalize truncate">
                  {currentUser.roleTitle}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>{getRoleScopeDescription()}</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-slate-100 p-2 text-center">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" title="Online" />
        </div>
      )}
    </aside>
  );
};
