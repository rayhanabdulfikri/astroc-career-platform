import React, { useState } from 'react';
import {
  Activity,
  Database,
  Clock,
  Play,
  Terminal,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Cloud,
  FileCode2,
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface SystemStatusViewProps {
  onManualTriggerScheduler: () => Promise<void>;
  loadingScheduler: boolean;
}

export const SystemStatusView: React.FC<SystemStatusViewProps> = ({
  onManualTriggerScheduler,
  loadingScheduler,
}) => {
  const [selectedDbTable, setSelectedDbTable] = useState('jobs');

  const tablesInfo = [
    { name: 'jobs', count: 12, desc: 'Tabel Lowongan Kerja (Termasuk pgvector Embedding 768d)' },
    { name: 'cv_profiles', count: 3, desc: 'Tabel Profil CV & Result Parsed Data JSON' },
    { name: 'job_matches', count: 8, desc: 'Tabel Perhitungan Match Score & Conversion Probabilities' },
    { name: 'notifications', count: 4, desc: 'Tabel Notifikasi Lowongan Match > 85%' },
    { name: 'target_positions', count: 1, desc: 'Tabel Target Posisi & Ekspektasi Gaji' },
    { name: 'career_roadmaps', count: 1, desc: 'Tabel Roadmap Karir Multi-Phase' },
  ];

  const sampleLogs = [
    '[SYSTEM] Clean Architecture initialized with SOLID Repository Pattern.',
    '[SCHEDULER] JobSearchScheduler started. Interval set to 6 hours.',
    '[GEMINI] Google Gemini Flash 3.5 Lite model instantiated.',
    '[GROUNDING] Search Grounding tool enabled for automatic job discovery.',
    '[VECTOR] pgvector cosine similarity search engine active.',
    '[NOTIFICATION] Triggered notification for Senior FullStack Engineer (94% Match).',
    '[HEALTH] Server healthy. Listening on port 3000.',
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <GlassCard className="p-6 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border-cyan-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <Activity className="h-3.5 w-3.5" />
              <span>DevOps, Architecture & System Monitor</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Sistem Clean Architecture & Infrastructure
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Monitoring scheduler latar belakang, status database Supabase PostgreSQL, pgvector, dan Google Cloud Logging.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: Operational</span>
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Scheduler Card */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Background Job Discovery Scheduler
              </h3>
              <p className="text-xs text-slate-500">
                Pencarian otomatis lowongan kerja terbaru setiap 6 jam menggunakan Gemini Search Grounding.
              </p>
            </div>
          </div>

          <button
            id="manual_trigger_scheduler_btn"
            onClick={onManualTriggerScheduler}
            disabled={loadingScheduler}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all shrink-0 active:scale-95"
          >
            <Play className={`h-3.5 w-3.5 ${loadingScheduler ? 'animate-spin' : ''}`} />
            <span>{loadingScheduler ? 'Menjalankan Pipeline AI...' : 'Jalankan Scheduler Sekarang (Manual)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3">
            <span className="text-slate-400">Interval Eksekusi</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">Setiap 6 Jam</div>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3">
            <span className="text-slate-400">Status Scheduler</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">ACTIVE (RUNNING)</div>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3">
            <span className="text-slate-400">Trigger Threshold</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">Match &gt; 85% Notif</div>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3">
            <span className="text-slate-400">Deduplication Rate</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">100% (Unique DB)</div>
          </div>
        </div>
      </GlassCard>

      {/* Database Tables Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Database className="h-5 w-5 text-cyan-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Database Tables</h3>
          </div>

          <div className="space-y-2">
            {tablesInfo.map((tbl) => (
              <div
                key={tbl.name}
                onClick={() => setSelectedDbTable(tbl.name)}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedDbTable === tbl.name
                    ? 'border-cyan-500 bg-cyan-500/10 font-bold text-slate-900 dark:text-white'
                    : 'border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>{tbl.name}</span>
                <span className="rounded-md bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px]">
                  {tbl.count} rows
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Live Terminal Cloud Logs */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Google Cloud Logging Console
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">stdout / stderr</span>
            </div>

            <div className="rounded-2xl bg-slate-950 p-4 font-mono text-[11px] text-emerald-400 space-y-1.5 max-h-60 overflow-y-auto leading-relaxed">
              {sampleLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Stack: Clean Architecture (Domain, Application, Infrastructure)</span>
              <span>Container: Cloud Run</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
