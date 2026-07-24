import React from 'react';
import {
  FileCheck,
  Award,
  Search,
  Database,
  Target,
  Sparkles,
  Compass,
  MessageSquare,
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: FileCheck,
      title: 'AI CV Parser & ATS Evaluator',
      desc: 'Membaca file PDF/DOCX, mengekstrak data terstruktur JSON, serta mengevaluasi skor ATS, tata bahasa, kelengkapan, dan kata kunci krusial.',
      tag: 'ATS Optimization',
    },
    {
      icon: Award,
      title: 'Review HR Manager 20+ Tahun',
      desc: 'Analisis jujur dan tajam khas HR Director berpengalaman: kelebihan, kelemahan, sinyal kepemimpinan, hingga saran rewrite kalimat per kalimat.',
      tag: 'Executive Review',
    },
    {
      icon: Search,
      title: 'Job Finder dengan Search Grounding',
      desc: 'Mencari puluhan lowongan nyata secara dinamis menggunakan Gemini Flash 3.5 Lite + Google Search Grounding tanpa scraper tradisional.',
      tag: 'Live Search',
    },
    {
      icon: Database,
      title: 'Job Normalizer & Database Clean',
      desc: 'Standardisasi skill, konversi gaji, dan penghapusan duplikat lowongan ke dalam database terstruktur secara berkala.',
      tag: 'Data Pipeline',
    },
    {
      icon: Target,
      title: 'Matching Engine & Vector Similarity',
      desc: 'Perhitungan kecocokan teknis, soft skill, serta prediksi probabilitas panggilan interview dan tawaran kerja (Offer Probability).',
      tag: 'Matching AI',
    },
    {
      icon: Sparkles,
      title: 'Skill Gap & Priority Roadmap',
      desc: 'Membandingkan skill kandidat dengan kebutuhan industri dan menampilkan skill yang belum dimiliki beserta prioritas & estimasi waktu belajar.',
      tag: 'Gap Analysis',
    },
    {
      icon: Compass,
      title: 'Interactive Career Roadmap',
      desc: 'Rencana aksi bertahap mulai dari target Junior, Mid, hingga Senior lengkap dengan rekomendasi sertifikasi, portofolio, dan milestone.',
      tag: 'Strategic Path',
    },
    {
      icon: MessageSquare,
      title: 'AI Interview Coach Simulator',
      desc: 'Latihan wawancara interaktif untuk kategori HR, Technical, Behavioral, dan Case Study lengkap dengan panduan jawaban ideal STAR model.',
      tag: 'Interview Prep',
    },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Fitur Utama <span className="text-cyan-500">ASTROC</span>
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Platform intelijen karir komprehensif yang dirancang untuk mempercepat karir impian Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <GlassCard key={idx} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
