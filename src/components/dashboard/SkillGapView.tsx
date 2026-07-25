import React, { useState } from 'react';
import { Target, CheckCircle2, Clock, BookOpen, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { SkillGapAnalysis } from '../../types';
import { GlassCard } from '../common/GlassCard';

interface SkillGapViewProps {
  skillGap: SkillGapAnalysis | null;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({ skillGap }) => {
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  if (!skillGap) {
    return (
      <GlassCard className="p-8 text-center space-y-3">
        <Target className="h-10 w-10 text-cyan-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Analisis Skill Gap Memerlukan Data CV</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Silakan unggah CV Anda terlebih dahulu untuk menghasilkan analisis kesenjangan keahlian.</p>
      </GlassCard>
    );
  }

  const filteredSkills = skillGap.missingSkills.filter((item) =>
    priorityFilter === 'All' ? true : item.priority === priorityFilter
  );

  const totalLearningHours = skillGap.missingSkills.reduce((sum, item) => sum + item.estimatedLearningHours, 0);

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <GlassCard className="p-6 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <Target className="h-3.5 w-3.5" />
              <span>Skill Gap & Learning Curve Matrix</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Analisis Kesenjangan Keahlian - {skillGap.targetPosition}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
              Membandingkan keahlian CV Anda saat ini dengan kebutuhan nyata pasar industri target.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 block font-medium">Kesiapan Karir</span>
              <span className="text-2xl font-black text-cyan-500">{skillGap.gapScore}%</span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 block font-medium">Total Jam Belajar</span>
              <span className="text-2xl font-black text-emerald-500">{totalLearningHours} Jam</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Acquired Skills Card */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Keahlian yang Sudah Dikuasai</h3>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">
              {skillGap.acquiredCount} Skills
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {skillGap.acquiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Missing Skills Matrix */}
        <GlassCard className="p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Target Keahlian yang Perlu Dipelajari</h3>

            {/* Filter Priority */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                    priorityFilter === p
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2 hover:border-cyan-500/50 transition-all bg-slate-50/40 dark:bg-slate-900/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.skill}</span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.priority === 'High'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : item.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}
                    >
                      Prioritas: {item.priority}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {item.estimatedLearningHours} Jam ({item.estimatedTimeFrame})
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                  <span>Rekomendasi Resource: <strong className="text-slate-800 dark:text-slate-200">{item.recommendedResource}</strong></span>
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
