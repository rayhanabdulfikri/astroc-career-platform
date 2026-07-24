import React from 'react';
import {
  Trophy,
  Award,
  UserCheck,
  FileText,
  Target,
  Briefcase,
  Bell,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { DashboardData } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { ScoreBadge } from '../common/ScoreBadge';

interface OverviewCardsProps {
  data: DashboardData;
  onNavigateTab: (tab: string) => void;
  onOpenTargetModal: () => void;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  data,
  onNavigateTab,
  onOpenTargetModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Target Position Banner */}
      <GlassCard className="p-5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Target Position:{' '}
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                    {data.targetPosition?.title || 'Full Stack AI Engineer'}
                  </span>
                </h3>
                <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                  {data.targetPosition?.industry || 'Technology'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Ekspektasi Gaji: Rp {((data.targetPosition?.expectedSalaryMin || 15000000) / 1000000).toFixed(0)} - {((data.targetPosition?.expectedSalaryMax || 28000000) / 1000000).toFixed(0)} Juta/bulan • Lokasi: {data.targetPosition?.location || 'Jakarta / Remote'} • {data.targetPosition?.remotePreference?.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            id="edit_target_position_btn"
            onClick={onOpenTargetModal}
            className="shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black border border-slate-200 hover:bg-slate-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition-all shadow-sm"
          >
            Ubah Target Position
          </button>
        </div>
      </GlassCard>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Career Score */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overall Career Score
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {data.overallCareerScore}%
            </span>
            <ScoreBadge score={data.overallCareerScore} size="sm" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Kombinasi skor ATS, Review HR, dan keahlian teknis.
          </p>
        </GlassCard>

        {/* ATS Score */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              ATS Score
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {data.atsScore}%
            </span>
            <ScoreBadge score={data.atsScore} size="sm" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Peluang lolos filter otomatis sistem Applicant Tracking System.
          </p>
        </GlassCard>

        {/* HR 20+ Yrs Score */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              HR Manager Score
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {data.hrScore}%
            </span>
            <ScoreBadge score={data.hrScore} size="sm" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Penilaian obyektif perspektif HR Manager 20+ tahun.
          </p>
        </GlassCard>

        {/* Database & Match Count */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Matches & Jobs
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {data.matchesCount}
            </span>
            <span className="text-xs text-slate-500">dari {data.totalJobsInDatabase} lowongan</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Lowongan aktif ter-index via Search Grounding.
          </p>
        </GlassCard>
      </div>

      {/* Top Matching Jobs Preview */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Lowongan Kerja Terbaik (Top Match Score)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ditemukan via Gemini Search Grounding & pgvector matching.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('matching')}
            className="flex items-center gap-1 text-xs font-bold text-cyan-600 hover:underline dark:text-cyan-400"
          >
            <span>Lihat Semua Match</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {data.topMatchingJobs.slice(0, 3).map((match) => (
            <div
              key={match.id}
              onClick={() => onNavigateTab('matching')}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 hover:border-cyan-500/40 dark:border-slate-800/60 dark:bg-slate-900/50 cursor-pointer transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {match.job.title}
                  </h4>
                  <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                    {match.job.company}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {match.job.location} • {match.job.salaryRange}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ScoreBadge score={match.overallMatchScore} label="Match" size="md" />
                <span className="text-xs text-slate-400">Offer Prob: {match.offerProbability}%</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
