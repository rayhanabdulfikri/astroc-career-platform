import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  id,
  hoverEffect = true,
}) => {
  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none ${
        hoverEffect ? 'hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-lg dark:hover:border-indigo-500/40' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
