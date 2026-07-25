import React from 'react';
import {
  Award,
  Briefcase,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  BrainCircuit,
  Clock,
} from 'lucide-react';
import { DashboardData } from '../../types';
import { GlassCard } from '../common/GlassCard';

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
  const {
    targetPosition,
    overallCareerScore = 90,
    atsScore = 92,
    hrScore = 88,
    cvCount = 1,
    matchesCount = 4,
    totalJobsInDatabase = 12,
    topMatchingJobs = [],
  } = data;

  // SVG Radial Gauge Calculation
  const strokeDashoffset = (score: number) => {
    const circumference = 2 * Math.PI * 40;
    return circumference - (score / 100) * circumference;
  };

  return (
    <div className="space-y-6">
      {/* Target Position Header */}
      <GlassCard className="p-6 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-indigo-600/10 border-cyan-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                Target Position Profile
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {targetPosition?.industry || 'Technology'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {targetPosition?.title || 'Full Stack AI Engineer'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Lokasi: <span className="font-semibold text-slate-800 dark:text-slate-200">{targetPosition?.location || 'Jakarta / Remote'}</span> | 
              Ekspektasi Gaji: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Rp {(targetPosition?.expectedSalaryMin || 15000000).toLocaleString('id-ID')} - Rp {(targetPosition?.expectedSalaryMax || 28000000).toLocaleString('id-ID')}</span>
            </p>
          </div>

          <button
            onClick={onOpenTargetModal}
            className="flex items-center gap-2 rounded-xl bg-white/80 dark:bg-slate-800/80 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm hover:border-cyan-500 border border-slate-200 dark:border-slate-700 transition-all shrink-0"
          >
            <Target className="h-4 w-4 text-cyan-500" />
            <span>Ubah Target Karir</span>
          </button>
        </div>
      </GlassCard>

      {/* 4 Core Metric Gauges & Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Career Score */}
        <GlassCard className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Overall Career Score</span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{overallCareerScore}%</p>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Ready for Top Tier
            </span>
          </div>

          {/* Radial SVG Gauge */}
          <div className="relative h-16 w-16 flex items-center justify-center">
            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-800" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={strokeDashoffset(overallCareerScore)}
                strokeLinecap="round"
                className="text-cyan-500 transition-all duration-1000"
                fill="transparent"
              />
            </svg>
            <Sparkles className="absolute h-5 w-5 text-cyan-500" />
          </div>
        </GlassCard>

        {/* Metric 2: ATS Evaluation Score */}
        <GlassCard className="p-5 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition-all" onClick={() => onNavigateTab('cv_analysis')}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">ATS Pass Score</span>
            <p className="text-3xl font-black text-emerald-500">{atsScore}%</p>
            <span className="text-[10px] text-slate-400 font-medium">95% Keyword Match</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Award className="h-6 w-6" />
          </div>
        </GlassCard>

        {/* Metric 3: HR Review Score */}
        <GlassCard className="p-5 flex items-center justify-between cursor-pointer hover:border-indigo-500/50 transition-all" onClick={() => onNavigateTab('cv_analysis')}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">HR Manager Review</span>
            <p className="text-3xl font-black text-indigo-500">{hrScore}%</p>
            <span className="text-[10px] text-slate-400 font-medium">20+ Yrs HR Verdict</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
            <BrainCircuit className="h-6 w-6" />
          </div>
        </GlassCard>

        {/* Metric 4: Job Matches Database */}
        <GlassCard className="p-5 flex items-center justify-between cursor-pointer hover:border-cyan-500/50 transition-all" onClick={() => onNavigateTab('matching')}>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Job Matches</span>
            <p className="text-3xl font-black text-cyan-500">{matchesCount} Lowongan</p>
            <span className="text-[10px] text-slate-400 font-medium">Total {totalJobsInDatabase} di Index</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
            <Briefcase className="h-6 w-6" />
          </div>
        </GlassCard>
      </div>

      {/* Main Grid: Learning Progress & Top Job Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Progress & Skill Gap Chart */}
        <GlassCard className="p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Learning & Skill Acquisition Progress</h3>
            </div>
            <button
              onClick={() => onNavigateTab('skill_gap')}
              className="flex items-center gap-1 text-xs font-bold text-cyan-600 hover:underline dark:text-cyan-400"
            >
              <span>Lihat Detail Gap</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">Keahlian Dikuasai (9 dari 12 Skill Target)</span>
              <span className="font-bold text-emerald-500">75% Complete</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style={{ width: '75%' }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <div className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Estimasi Waktu Belajar</span>
                <p className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-cyan-500" />
                  <span>35 Jam (2-3 Minggu)</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Fokus Belajar Utama</span>
                <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  Kubernetes & GraphQL Microservices
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Top Jobs Leaderboard */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Match Leaderboard</h3>
            <button
              onClick={() => onNavigateTab('matching')}
              className="text-xs font-bold text-cyan-600 hover:underline dark:text-cyan-400"
            >
              Semua
            </button>
          </div>

          <div className="space-y-3">
            {topMatchingJobs.slice(0, 3).map((match, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between hover:border-cyan-500/50 transition-all">
                <div className="space-y-0.5 max-w-[170px]">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{match.job.title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{match.job.company}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-500">{match.overallMatchScore}%</span>
                  <p className="text-[9px] text-slate-400">Match Score</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
