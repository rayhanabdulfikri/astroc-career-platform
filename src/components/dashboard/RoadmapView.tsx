import React from 'react';
import { Compass, CheckCircle2, Award, Code, Milestone, RefreshCw, Calendar } from 'lucide-react';
import { CareerRoadmap } from '../../types';
import { GlassCard } from '../common/GlassCard';

interface RoadmapViewProps {
  roadmap: CareerRoadmap | null;
  onRegenerateRoadmap: () => Promise<void>;
  loading: boolean;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  onRegenerateRoadmap,
  loading,
}) => {
  if (!roadmap) {
    return (
      <GlassCard className="p-8 text-center space-y-3">
        <Compass className="h-8 w-8 text-cyan-500 mx-auto animate-pulse" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Membuat Career Roadmap...</h3>
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
              <Compass className="h-3.5 w-3.5" />
              <span>AI Strategic Career Roadmap</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Roadmap Pengembangan Karir menuju "{roadmap.targetPosition}"
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Estimasi Pencapaian Target: <strong>{roadmap.estimatedMonthsToTarget} Bulan</strong> • Berdasarkan evaluasi keahlian & posisi pasar.
            </p>
          </div>

          <button
            onClick={onRegenerateRoadmap}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all shrink-0 active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-Generate Roadmap AI</span>
          </button>
        </div>
      </GlassCard>

      {/* Timeline Phases List */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {roadmap.phases.map((phase, idx) => (
          <div key={idx} className="relative pl-12 space-y-4">
            {/* Phase Node Marker */}
            <div className="absolute left-3 top-1 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-cyan-600 text-white text-xs font-black shadow-md ring-4 ring-white dark:ring-slate-950">
              {idx + 1}
            </div>

            <GlassCard className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                    Target Role: {phase.targetRole}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{phase.phaseTitle}</h3>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 shrink-0">
                  <Calendar className="h-4 w-4" />
                  <span>Durasi: {phase.duration}</span>
                </div>
              </div>

              {/* Grid 2 Columns for Learning & Deliverables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Learning Path & Certs */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-cyan-500" />
                    <span>Materi & Modul Pembelajaran</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {phase.learningPath.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <h5 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      <span>Target Sertifikasi Resmi:</span>
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {phase.certifications.map((cert, i) => (
                        <span key={i} className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projects & Milestones */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Code className="h-3.5 w-3.5 text-blue-500" />
                    <span>Portofolio & Proyek Nyata</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {phase.recommendedProjects.map((proj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{proj}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <h5 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                      <Milestone className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Milestones Utama:</span>
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {phase.keyMilestones.map((m, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-500 font-bold">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
};
