import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorOverride?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  size = 'md',
  colorOverride,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  const getColor = () => {
    if (colorOverride) return colorOverride;
    if (clamped >= 100) return 'bg-emerald-500';
    if (clamped >= 70) return 'bg-indigo-600';
    if (clamped >= 40) return 'bg-sky-500';
    if (clamped > 0) return 'bg-amber-500';
    return 'bg-slate-300';
  };

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size];

  return (
    <div className={`w-full flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${heightClasses} ring-1 ring-slate-900/5`}>
        <div
          className={`${heightClasses} rounded-full transition-all duration-500 ease-out ${getColor()}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-600 tabular-nums min-w-[36px] text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
};

