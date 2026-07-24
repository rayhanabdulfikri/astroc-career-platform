import React from 'react';
import { Sparkles, Shield, Cpu, Database, Cloud } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/50 dark:border-white/10 dark:bg-[#050507] py-10 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold italic shadow-sm">
                A
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                ASTROC
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              AI Career Intelligence Platform yang membantu mahasiswa, fresh graduate, dan profesional mengenali kesiapan karier mereka.
            </p>
          </div>

          {/* AI Tech Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              AI & Search Engine
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-cyan-500" />
                <span>Google Gemini Flash 3.5 Lite</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                <span>Google Search Grounding Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-indigo-500" />
                <span>pgvector Similarity Search</span>
              </li>
            </ul>
          </div>

          {/* Production Infrastructure */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Production Stack
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <Cloud className="h-3.5 w-3.5 text-cyan-500" />
                <span>Google Cloud Run (Backend API)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                <span>Firebase Hosting & Authentication</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-amber-500" />
                <span>Supabase PostgreSQL & Storage</span>
              </li>
            </ul>
          </div>

          {/* Quick Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Clean Architecture
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
              SOLID Principles, Repository Pattern, Dependency Injection, dan Background Scheduler.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Ready</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <p>© 2026 ASTROC – Kenali Karirmu. All Rights Reserved.</p>
          <p className="font-mono text-[11px]">Build v1.0.0 • Powered by Gemini AI</p>
        </div>
      </div>
    </footer>
  );
};
