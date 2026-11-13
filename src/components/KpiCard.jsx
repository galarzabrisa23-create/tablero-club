import React from 'react';

export default function KpiCard({
  title,
  value,
  subtitle,
  badgeText,
  badgeType = 'neutral', // 'success', 'warning', 'danger', 'info', 'neutral'
  icon: Icon,
  colorScheme = 'blue', // 'blue', 'emerald', 'amber', 'rose', 'purple'
  progress, // number 0-100 or null
  onClick,
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 text-blue-600 border-blue-100',
      progress: 'bg-blue-600',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      progress: 'bg-emerald-600',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      progress: 'bg-amber-500',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600 border-rose-100',
      progress: 'bg-rose-600',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      progress: 'bg-purple-600',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.blue;

  const badgeTypeStyles = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    info: 'bg-sky-100 text-sky-800 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs transition-all hover:shadow-md hover:border-slate-300 relative overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {title}
          </p>
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border ${scheme.bg} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || badgeText) && (
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
          {badgeText && (
            <span className={`px-2 py-0.5 rounded-full font-semibold border ${badgeTypeStyles[badgeType]}`}>
              {badgeText}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 font-medium truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}

      {typeof progress === 'number' && (
        <div className="mt-3 space-y-1">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${scheme.progress}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
