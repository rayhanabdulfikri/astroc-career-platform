import React from 'react';
import { Upload, Cpu, Search, Trophy } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload CV / Resume',
      desc: 'Unggah file CV format PDF, DOCX, atau TXT. Sistem mengekstrak teks dan membentuk profil terstruktur.',
      icon: Upload,
    },
    {
      num: '02',
      title: '3-in-1 AI Analysis',
      desc: 'Gemini mengevaluasi skor ATS, memberikan review dari perspektif HR 20+ tahun, serta memberikan rekomendasi perbaikan.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Live Job Finder & Grounding',
      desc: 'Gemini Search Grounding mencari lowongan kerja nyata yang cocok dengan keahlian dan posisi target Anda.',
      icon: Search,
    },
    {
      num: '04',
      title: 'Match Engine & Roadmap',
      desc: 'Dapatkan persentase kecocokan, analisis skill gap, dan roadmap karir personal menuju tawaran kerja.',
      icon: Trophy,
    },
  ];

  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Cara Kerja <span className="text-cyan-500">ASTROC</span>
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Empat langkah sederhana dari evaluasi CV hingga kesiapan wawancara kerja.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <GlassCard key={idx} className="relative">
                <div className="text-3xl font-black text-cyan-500/20 mb-2">{step.num}</div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
