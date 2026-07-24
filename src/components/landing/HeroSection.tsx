import React from 'react';
import { Sparkles, ArrowRight, Upload, Search, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface HeroSectionProps {
  onStartUpload: () => void;
  onExploreJobs: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartUpload, onExploreJobs }) => {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-indigo-500/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
            <span>AI Career Intelligence Engine • Powered by Gemini Flash 3.5</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 dark:text-white leading-tight">
            Kenali Karirmu dengan{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent italic font-serif">
              ASTROC Intelligence
            </span>
          </h1>

          {/* Tagline / Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-2xl mx-auto">
            Platform AI all-in-one untuk mahasiswa, fresh graduate, dan profesional. Analisis CV, review ala HR Manager 20+ tahun, pencari lowongan otomatis via Google Search Grounding, dan roadmap karir personal.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              id="hero_upload_cv_btn"
              onClick={onStartUpload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest px-6 py-3.5 hover:bg-slate-200 active:scale-95 transition-all shadow-lg shadow-white/10"
            >
              <Upload className="h-4 w-4" />
              <span>Upload CV & Analisis</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              id="hero_explore_jobs_btn"
              onClick={onExploreJobs}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:border-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-indigo-500/50 transition-all"
            >
              <Search className="h-4 w-4" />
              <span>Cari Lowongan Berdasarkan CV</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto">
            <GlassCard className="p-4 text-center">
              <div className="flex justify-center text-cyan-500 mb-1">
                <Award className="h-5 w-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">95%+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Akurasi ATS Score</div>
            </GlassCard>

            <GlassCard className="p-4 text-center">
              <div className="flex justify-center text-blue-500 mb-1">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">20+ Thn</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">HR Reviewer Model</div>
            </GlassCard>

            <GlassCard className="p-4 text-center">
              <div className="flex justify-center text-indigo-500 mb-1">
                <Search className="h-5 w-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">Real-Time</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Google Search Grounding</div>
            </GlassCard>

            <GlassCard className="p-4 text-center">
              <div className="flex justify-center text-emerald-500 mb-1">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">0% Dup</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Job Deduplication</div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
