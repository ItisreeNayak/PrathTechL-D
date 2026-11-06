import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Search,
  ChevronDown,
  UserCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCheck,
  Calendar,
  AlertTriangle,
  Award,
  Layers,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    searchQuery,
    setSearchQuery,
    setActiveTab,
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { id: UserRole; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'hr_admin',
      title: 'HR Administrator',
      subtitle: 'Talent & Org Learning & Development Management',
      icon: <Briefcase className="h-4 w-4 text-indigo-600" />,
    },
    {
      id: 'employee',
      title: 'Employee',
      subtitle: 'Alex Mercer (Engineering)',
      icon: <GraduationCap className="h-4 w-4 text-emerald-600" />,
    },
    {
      id: 'manager',
      title: 'Reporting Manager',
      subtitle: 'Priya Sharma (Eng Director)',
      icon: <UserCheck className="h-4 w-4 text-purple-600" />,
    },
    {
      id: 'trainer',
      title: 'Corporate Trainer',
      subtitle: 'Marcus Sterling (Tech Architect)',
      icon: <Sparkles className="h-4 w-4 text-amber-600" />,
    },
  ];

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'session':
        return <Calendar className="h-4 w-4 text-sky-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      case 'certificate':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'assessment':
        return <CheckCheck className="h-4 w-4 text-emerald-500" />;
      default:
        return <Layers className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left Brand Identifier & Search Bar */}
      <div className="flex flex-1 items-center gap-3.5 max-w-xl">
        <div className="hidden sm:flex items-center gap-2.5 shrink-0 pr-3 border-r border-slate-200">
          <img
            src="/prath-logo.png"
            alt="PrathTech L&D"
            className="h-8 w-auto object-contain"
          />
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900 tracking-tight">
                PrathTech LearnHub
              </span>
              <span className="rounded bg-indigo-100 px-1 py-0.2 text-[9px] font-bold text-indigo-700">
                L&D
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              Enterprise Learning & Development
            </p>
          </div>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs, courses, skills, or employees..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2.5 rounded-xl border border-indigo-200/80 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-950 hover:bg-indigo-100/60 transition-all shadow-2xs"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 font-normal hidden sm:inline">Role:</span>
            <span className="font-bold text-indigo-700">{roles.find((r) => r.id === currentRole)?.title}</span>
            <ChevronDown className="h-3.5 w-3.5 text-indigo-500" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Perspective
                </p>
                <p className="text-xs text-slate-500">Preview UI as different stakeholders</p>
              </div>

              <div className="py-1 space-y-1">
                {roles.map((r) => {
                  const isActive = currentRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setCurrentRole(r.id);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        isActive ? 'bg-indigo-50/80 text-indigo-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="mt-0.5 rounded-md p-1 bg-white border border-slate-200 shadow-2xs">
                        {r.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold">{r.title}</p>
                          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                        </div>
                        <p className="text-2xs text-slate-500">{r.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-2xs">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-84 sm:w-96 origin-top-right rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ring-1 ring-black/5 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 px-3 pb-2.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-2xs font-bold text-rose-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-2xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-80 divide-y divide-slate-100 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.targetTab) {
                          let resolvedTab: any = notif.targetTab;
                          if (currentRole === 'employee') {
                            if (resolvedTab === 'assignments') resolvedTab = 'my_courses';
                            else if (resolvedTab === 'attendance') resolvedTab = 'my_courses';
                            else if (resolvedTab === 'assessments') resolvedTab = 'my_assessments';
                            else if (resolvedTab === 'certificates') resolvedTab = 'my_certificates';
                            else if (resolvedTab === 'programs') resolvedTab = 'courses';
                          } else if (currentRole === 'manager') {
                            if (resolvedTab === 'assignments') resolvedTab = 'team_progress';
                            else if (resolvedTab === 'certificates') resolvedTab = 'team_skill_gaps';
                            else if (resolvedTab === 'reports') resolvedTab = 'team_reports';
                            else if (resolvedTab === 'programs') resolvedTab = 'courses';
                          } else if (currentRole === 'trainer') {
                            if (resolvedTab === 'attendance') resolvedTab = 'mark_attendance';
                            else if (resolvedTab === 'assessments') resolvedTab = 'assessments_grading';
                            else if (resolvedTab === 'certificates') resolvedTab = 'feedback_received';
                          }
                          setActiveTab(resolvedTab);
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`group flex items-start gap-3 p-2.5 cursor-pointer rounded-lg transition-colors ${
                        notif.read ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/40 hover:bg-indigo-50/70'
                      }`}
                    >
                      <div className="mt-0.5 rounded-lg border border-slate-200 bg-white p-1.5 shadow-2xs">
                        {getNotifIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs ${notif.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                            {notif.title}
                          </p>
                          <span className="text-2xs text-slate-400">{notif.timestamp}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <span className="mt-1 h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</p>
            <p className="text-2xs text-slate-500 leading-tight mt-0.5">{currentUser.department}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

