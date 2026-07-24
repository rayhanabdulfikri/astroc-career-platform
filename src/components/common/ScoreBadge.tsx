import React from 'react';

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, label, size = 'md' }) => {
  const getColorClasses = (val: number) => {
    if (val >= 85) {
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        ring: 'stroke-emerald-500',
      };
    } else if (val >= 70) {
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
        ring: 'stroke-amber-500',
      };
    } else {
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/30',
        ring: 'stroke-rose-500',
      };
    }
  };

  const colors = getColorClasses(score);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-sm font-bold',
    lg: 'px-4 py-2 text-base font-extrabold',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]}`}>
      <span>{score}%</span>
      {label && <span className="opacity-80 font-normal">({label})</span>}
    </div>
  );
};
