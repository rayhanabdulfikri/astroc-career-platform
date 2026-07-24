import React, { useState } from 'react';
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  ExternalLink,
  Sparkles,
  Filter,
  CheckCircle2,
  X,
  RefreshCw,
} from 'lucide-react';
import { JobProcessed } from '../../types';
import { GlassCard } from '../common/GlassCard';

interface JobFinderViewProps {
  jobs: JobProcessed[];
  onTriggerSearchGrounding: () => Promise<void>;
  searching: boolean;
}

export const JobFinderView: React.FC<JobFinderViewProps> = ({
  jobs,
  onTriggerSearchGrounding,
  searching,
}) => {
  const [query, setQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobProcessed | null>(null);

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.requiredSkills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <GlassCard className="p-6 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border-cyan-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Gemini Flash 3.5 Lite + Google Search Grounding</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              AI Job Finder & Normalizer Database
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
              Mencari lowongan kerja nyata dari internet, menormalisasi data, menghapus duplikat, dan meng-index ke database Supabase PostgreSQL.
            </p>
          </div>

          <button
            id="trigger_search_grounding_btn"
            onClick={onTriggerSearchGrounding}
            disabled={searching}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all shrink-0 active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${searching ? 'animate-spin' : ''}`} />
            <span>{searching ? 'Mencari Lowongan AI...' : 'Cari Lowongan Baru via Search Grounding'}</span>
          </button>
        </div>

        {/* Filter Input */}
        <div className="mt-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari lowongan berdasarkan nama posisi, perusahaan, atau skill (e.g. React, Python)..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 shrink-0">
            {filteredJobs.length} Lowongan Ditemukan
          </span>
        </div>
      </GlassCard>

      {/* Jobs Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <GlassCard key={job.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                    {job.company}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{job.title}</h3>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {job.employmentType}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  <span>{job.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{job.salaryRange}</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {job.summary}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {job.requiredSkills.map((sk, i) => (
                  <span key={i} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
              <span className="text-slate-400 text-[11px]">{job.postedDate}</span>
              <button
                onClick={() => setSelectedJob(job)}
                className="flex items-center gap-1 font-bold text-cyan-600 hover:underline dark:text-cyan-400"
              >
                <span>Detail & Kebutuhan</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                {selectedJob.company}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{selectedJob.title}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {selectedJob.location} • {selectedJob.salaryRange} • {selectedJob.employmentType}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Ringkasan</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selectedJob.summary}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Tanggung Jawab Utama</h4>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {selectedJob.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Persyaratan</h4>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {selectedJob.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center">
              <span className="text-xs text-slate-400">Sumber Grounding: Google Search</span>
              <a
                href={selectedJob.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700"
              >
                <span>Buka Website Resmi Lowongan</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
