import React from 'react';
import { Sparkles, CheckCircle2, Clock, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
import { SkillGapAnalysis } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { ScoreBadge } from '../common/ScoreBadge';

interface SkillGapViewProps {
  skillGap: SkillGapAnalysis | null;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({ skillGap }) => {
  if (!skillGap) {
    return (
      <GlassCard className="p-8 text-center space-y-3">
        <Sparkles className="h-8 w-8 text-cyan-500 mx-auto animate-pulse" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Menganalisis Skill Gap...</h3>
        <p className="text-xs text-slate-500">Mohon pastikan CV dan Target Position telah dikonfigurasi.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <GlassCard className="p-6 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border-cyan-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Skill Gap & Prioritizing Engine</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Analisis Jurang Keahlian (Skill Gap)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Membandingkan keahlian pada CV Anda dengan standar kebutuhan pasar untuk posisi target "{skillGap.targetPosition}".
            </p>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-xs text-slate-400 font-medium">Kesiapan Keahlian (Skill Readiness)</div>
            <ScoreBadge score={skillGap.gapScore} size="lg" />
          </div>
        </div>
      </GlassCard>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-bold">Total Skill Dibutuhkan</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{skillGap.totalRequiredSkills}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600">
            <BookOpen className="h-5 w-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-bold">Skill Dimiliki (Acquired)</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{skillGap.acquiredCount}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-bold">Skill Perlu Dipelajari (Gap)</div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{skillGap.missingCount}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <AlertCircle className="h-5 w-5" />
          </div>
        </GlassCard>
      </div>

      {/* Missing Skills Priorities Table */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Daftar Skill Gap & Rencana Belajar
          </h3>
          <span className="text-xs text-slate-400">Diurutkan Berdasarkan Prioritas</span>
        </div>

        <div className="space-y-3">
          {skillGap.missingSkills.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{item.skill}</span>
                  <span className="rounded-md bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    {item.category}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      item.priority === 'High'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : item.priority === 'Medium'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Prioritas {item.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Rekomendasi Resource: <strong>{item.recommendedResource}</strong></span>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-medium">Estimasi Waktu</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 justify-end">
                    <Clock className="h-3.5 w-3.5 text-cyan-500" />
                    <span>{item.estimatedTimeFrame} ({item.estimatedLearningHours} jam)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Acquired Skills Badge List */}
      <GlassCard className="p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Keahlian Yang Sudah Anda Kuasai:</h3>
        <div className="flex flex-wrap gap-1.5">
          {skillGap.acquiredSkills.map((s, i) => (
            <span key={i} className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ {s}
            </span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
