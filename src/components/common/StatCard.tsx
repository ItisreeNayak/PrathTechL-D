import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'sky' | 'rose' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'indigo',
  onClick,
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50/70 text-indigo-600 border-indigo-100',
      gradient: 'from-indigo-500/10 to-transparent',
      hover: 'hover:border-indigo-300',
    },
    emerald: {
      bg: 'bg-emerald-50/70 text-emerald-600 border-emerald-100',
      gradient: 'from-emerald-500/10 to-transparent',
      hover: 'hover:border-emerald-300',
    },
    amber: {
      bg: 'bg-amber-50/70 text-amber-600 border-amber-100',
      gradient: 'from-amber-500/10 to-transparent',
      hover: 'hover:border-amber-300',
    },
    sky: {
      bg: 'bg-sky-50/70 text-sky-600 border-sky-100',
      gradient: 'from-sky-500/10 to-transparent',
      hover: 'hover:border-sky-300',
    },
    rose: {
      bg: 'bg-rose-50/70 text-rose-600 border-rose-100',
      gradient: 'from-rose-500/10 to-transparent',
      hover: 'hover:border-rose-300',
    },
    purple: {
      bg: 'bg-purple-50/70 text-purple-600 border-purple-100',
      gradient: 'from-purple-500/10 to-transparent',
      hover: 'hover:border-purple-300',
    },
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 ${
        onClick ? `cursor-pointer ${colorMap.hover} hover:shadow-md hover:-translate-y-0.5` : ''
      }`}
    >
      <div className={`absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${colorMap.gradient} blur-xl pointer-events-none`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
            {trend && (
              <span
                className={`inline-flex items-center text-xs font-semibold ${
                  trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />
                )}
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${colorMap.bg} shadow-2xs`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

