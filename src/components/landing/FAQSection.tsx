import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana ASTROC mengevaluasi ATS dan HR Manager Review?',
      a: 'ASTROC menggunakan Google Gemini Flash 3.5 Lite yang dilatih dengan kriteria Applicant Tracking System (ATS) standar industri serta metodologi HR Director berpengalaman 20+ tahun untuk memberikan masukan nyata, bukan sekadar kata manis.',
    },
    {
      q: 'Apa keunggulan Google Search Grounding dibandingkan scraper biasa?',
      a: 'Search Grounding terhubung langsung dengan indeks pencarian Google secara real-time. Ini memastikan data lowongan yang ditemukan mutakhir, valid, dan bebas dari isu IP blocking atau anti-scraping.',
    },
    {
      q: 'Bagaimana cara kerja penghapusan duplikat lowongan (Job Deduplication)?',
      a: 'Sistem Job Normalizer membandingkan judul pekerjaan, nama perusahaan, serta keahlian utama, lalu menghasilkan representasi terstandardisasi sebelum disimpan ke database.',
    },
    {
      q: 'Apakah data CV saya aman?',
      a: 'Sangat aman. Seluruh pemrosesan dilakukan secara terenkripsi menggunakan Firebase Authentication dan Supabase PostgreSQL dengan RLS (Row Level Security).',
    },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-cyan-500 font-bold text-xs uppercase tracking-wider mb-2">
            <HelpCircle className="h-4 w-4" />
            <span>Pertanyaan Umum</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">FAQ</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <GlassCard key={idx} className="p-4 cursor-pointer" hoverEffect={false}>
                <div
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-cyan-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                {isOpen && <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">{faq.a}</p>}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
