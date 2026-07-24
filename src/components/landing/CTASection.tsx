import React from 'react';
import { Upload, Sparkles } from 'lucide-react';

interface CTASectionProps {
  onStartUpload: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onStartUpload }) => {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Akselerasikan Karir Anda Sekarang</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
              Siap Mengetahui Kesiapan Karir dan Meloloskan CV Anda ke Perusahaan Impian?
            </h2>
            <p className="text-sm text-cyan-100 leading-relaxed mb-6">
              Dapatkan skor ATS, ulasan HR Manager 20+ tahun, rekomendasi lowongan terbaru, dan roadmap karir interaktif dalam hitungan detik.
            </p>
            <button
              id="cta_upload_btn"
              onClick={onStartUpload}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-slate-900 hover:bg-slate-100 transition-all shadow-lg active:scale-95"
            >
              <Upload className="h-4 w-4 text-cyan-600" />
              <span>Mulai Upload & Analisis CV</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
