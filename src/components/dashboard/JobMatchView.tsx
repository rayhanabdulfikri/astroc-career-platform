import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, Award, TrendingUp, Sparkles } from 'lucide-react';
import { JobMatch } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { ScoreBadge } from '../common/ScoreBadge';

interface JobMatchViewProps {
  matches: JobMatch[];
}

export const JobMatchView: React.FC<JobMatchViewProps> = ({ matches }) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');

  const activeMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <GlassCard className="p-6 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border-cyan-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <Target className="h-3.5 w-3.5" />
              <span>Matching Engine & pgvector Similarity Search</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Evaluasi Kecocokan CV terhadap Seluruh Lowongan
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Mengevaluasi kesesuaian keahlian, pengalaman, dan memprediksi probabilitas panggilan interview hingga tawaran kerja (Offer Probability).
            </p>
          </div>
          <div className="shrink-0">
            <span className="text-xs font-bold text-slate-500">Total Matched Jobs: {matches.length}</span>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Matches */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftar Lowongan & Score</h3>
          {matches.map((m) => {
            const isSelected = m.id === (activeMatch?.id || '');
            return (
              <GlassCard
                key={m.id}
                onClick={() => setSelectedMatchId(m.id)}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected ? 'border-cyan-500 bg-cyan-500/5 dark:border-cyan-400 dark:bg-cyan-500/10' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400">{m.job.company}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.job.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">{m.job.location}</p>
                  </div>
                  <ScoreBadge score={m.overallMatchScore} size="sm" />
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Right Active Match Detail */}
        {activeMatch && (
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    {activeMatch.job.company}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{activeMatch.job.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{activeMatch.job.location} • {activeMatch.job.salaryRange}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Overall Match Score</div>
                  <ScoreBadge score={activeMatch.overallMatchScore} size="lg" />
                </div>
              </div>

              {/* Match Score Sub-Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3">
                  <div className="text-[11px] font-bold text-slate-500">Technical Match</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">{activeMatch.technicalMatch}%</div>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3">
                  <div className="text-[11px] font-bold text-slate-500">Soft Skill Match</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">{activeMatch.softSkillMatch}%</div>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3">
                  <div className="text-[11px] font-bold text-slate-500">Education Match</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">{activeMatch.educationMatch}%</div>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3">
                  <div className="text-[11px] font-bold text-slate-500">Experience Match</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">{activeMatch.experienceMatch}%</div>
                </div>
              </div>

              {/* Conversion Probabilities */}
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Prediksi Probabilitas Kelolosan Tahapan Recruitment
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 shadow-sm">
                    <div className="text-[10px] text-slate-400 font-medium">ATS Screening</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{activeMatch.atsProbability}%</div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 shadow-sm">
                    <div className="text-[10px] text-slate-400 font-medium">HR Shortlist</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">{activeMatch.hrProbability}%</div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 shadow-sm">
                    <div className="text-[10px] text-slate-400 font-medium">Interview Call</div>
                    <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">{activeMatch.interviewProbability}%</div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 shadow-sm">
                    <div className="text-[10px] text-slate-400 font-medium">Job Offer</div>
                    <div className="text-lg font-black text-cyan-600 dark:text-cyan-400">{activeMatch.offerProbability}%</div>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Matched Skills ({activeMatch.matchedSkills.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {activeMatch.matchedSkills.map((s, i) => (
                      <span key={i} className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <XCircle className="h-4 w-4" />
                    <span>Missing Skills ({activeMatch.missingSkills.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {activeMatch.missingSkills.length === 0 ? (
                      <span className="text-xs text-slate-400">Tidak ada skill yang kurang!</span>
                    ) : (
                      activeMatch.missingSkills.map((s, i) => (
                        <span key={i} className="rounded-md bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                          ✗ {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Reasoning */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Analisis Alasan Kecocokan AI:</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{activeMatch.matchReasoning}"
                </p>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
