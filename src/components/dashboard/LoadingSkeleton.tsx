import React from 'react';
import { GlassCard } from '../common/GlassCard';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <GlassCard className="p-6 h-32 bg-slate-200/50 dark:bg-slate-800/40 rounded-3xl" />

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <GlassCard key={i} className="p-5 h-28 bg-slate-200/50 dark:bg-slate-800/40 rounded-2xl space-y-3">
            <div className="h-4 w-20 bg-slate-300 dark:bg-slate-700 rounded-md" />
            <div className="h-8 w-16 bg-slate-300 dark:bg-slate-700 rounded-lg" />
          </GlassCard>
        ))}
      </div>

      {/* Main Analytics Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6 h-80 bg-slate-200/50 dark:bg-slate-800/40 rounded-3xl" />
        <GlassCard className="p-6 h-80 bg-slate-200/50 dark:bg-slate-800/40 rounded-3xl" />
      </div>
    </div>
  );
};
