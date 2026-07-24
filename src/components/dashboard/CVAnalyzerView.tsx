import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Cpu,
  Award,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  FileCode,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { ParsedCV, CVAnalysisResult } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { ScoreBadge } from '../common/ScoreBadge';

interface CVAnalyzerViewProps {
  activeCV: ParsedCV | null;
  analysis: CVAnalysisResult | null;
  onUploadCV: (rawText: string, fileName: string, presetId?: string) => Promise<void>;
  loading: boolean;
}

export const CVAnalyzerView: React.FC<CVAnalyzerViewProps> = ({
  activeCV,
  analysis,
  onUploadCV,
  loading,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'ats' | 'hr_review' | 'json_parser'>('overview');
  const [pastedText, setPastedText] = useState('');
  const [showTextUpload, setShowTextUpload] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onUploadCV(content || `File content extracted from ${file.name}`, file.name);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Upload Header & Sample Presets */}
      <GlassCard className="p-6 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <Cpu className="h-3.5 w-3.5" />
              <span>3-in-1 AI CV Engine (Parser + ATS Evaluator + HR 20+ Yrs Review)</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Evaluasi & Analisis CV Berbasis Gemini AI
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
              Unggah file CV Anda (PDF / DOCX / TXT) atau pilih preset sampel CV di bawah untuk pengujian instan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* File Upload Input */}
            <label
              id="upload_file_input_label"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 cursor-pointer transition-all active:scale-95"
            >
              <Upload className="h-4 w-4" />
              <span>{loading ? 'Memproses AI...' : 'Upload File CV'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                disabled={loading}
                className="hidden"
              />
            </label>

            {/* Quick Preset Buttons */}
            <button
              onClick={() => onUploadCV('', 'CV_Rayhan_FullStack_Engineer.pdf', 'cv_01')}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all"
            >
              Preset: Senior FullStack CV
            </button>

            <button
              onClick={() => onUploadCV('', 'CV_Siti_FreshGrad_DataAnalyst.pdf', 'cv_02')}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all"
            >
              Preset: FreshGrad Data Analyst
            </button>
          </div>
        </div>

        {/* Text Area Option Toggle */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <button
            onClick={() => setShowTextUpload(!showTextUpload)}
            className="text-xs font-bold text-cyan-600 hover:underline dark:text-cyan-400"
          >
            {showTextUpload ? 'Sembunyikan Paste Text Area' : 'Atau Paste Teks CV Langsung di Sini'}
          </button>
          {activeCV && (
            <span className="text-xs text-slate-500">
              CV Aktif: <strong className="text-slate-900 dark:text-slate-100">{activeCV.fileName}</strong> ({activeCV.name})
            </span>
          )}
        </div>

        {showTextUpload && (
          <div className="mt-3 space-y-2">
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Tempelkan seluruh teks CV Anda di sini..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            <button
              onClick={() => {
                if (pastedText.trim()) onUploadCV(pastedText, 'Pasted_CV_Text.txt');
              }}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700"
            >
              Analisis Teks CV Ini
            </button>
          </div>
        )}
      </GlassCard>

      {/* Sub Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeSubTab === 'overview'
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Ringkasan Evaluasi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ats')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeSubTab === 'ats'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>ATS Evaluation ({analysis?.ats.atsScore || 92}%)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hr_review')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeSubTab === 'hr_review'
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>HR Review 20+ Thn ({analysis?.hr.hrScore || 88}%)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('json_parser')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeSubTab === 'json_parser'
              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileCode className="h-4 w-4" />
          <span>Parsed Data JSON</span>
        </button>
      </div>

      {/* Sub Tab Contents */}
      {activeSubTab === 'overview' && analysis && activeCV && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ATS Summary */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">ATS Score</h3>
              </div>
              <ScoreBadge score={analysis.ats.atsScore} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2.5">
                <div className="text-slate-400">Keyword Match</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{analysis.ats.keywordMatchPercentage}%</div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2.5">
                <div className="text-slate-400">Grammar Score</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{analysis.ats.grammarScore}%</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Missing Industry Keywords:</h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.ats.missingKeywords.map((kw, i) => (
                  <span key={i} className="rounded-md bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* HR Review Summary */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">HR Manager 20+ Yrs Review</h3>
              </div>
              <ScoreBadge score={analysis.hr.hrScore} />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              "{analysis.hr.overallHRVerdict}"
            </p>

            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Keunggulan Utama:</h4>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {analysis.hr.strengths.slice(0, 2).map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ATS Detailed SubTab */}
      {activeSubTab === 'ats' && analysis && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Detail Evaluasi ATS (Applicant Tracking System)</h3>
              <p className="text-xs text-slate-500">Mengevaluasi kesiapan parser otomatis sistem rekrutmen perusahaan.</p>
            </div>
            <ScoreBadge score={analysis.ats.atsScore} size="lg" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
              <div className="text-xs font-bold text-slate-500">Keyword Match</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{analysis.ats.keywordMatchPercentage}%</div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
              <div className="text-xs font-bold text-slate-500">Formatting Cleanliness</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{analysis.ats.formattingScore}%</div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
              <div className="text-xs font-bold text-slate-500">Readability & Structure</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{analysis.ats.readabilityScore}%</div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
              <div className="text-xs font-bold text-slate-500">Profile Completeness</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{analysis.ats.completenessPercentage}%</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Saran Perbaikan ATS:</h4>
            {analysis.ats.improvementTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* HR Review Detailed SubTab */}
      {activeSubTab === 'hr_review' && analysis && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Review HR Manager Senior (Pengalaman 20+ Tahun)
              </h3>
              <p className="text-xs text-slate-500">Evaluasi daya saing, sinyal kepemimpinan, dan rekomendasi rewrite.</p>
            </div>
            <ScoreBadge score={analysis.hr.hrScore} size="lg" />
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Kekuatan Utama CV (Strengths)</h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysis.hr.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
              <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Area Perlu Ditingkatkan (Weaknesses)</h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysis.hr.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Line by Line Rewrite Suggestions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Rekomendasi Rewrite Poin CV (Before & After):</h4>
            {analysis.hr.rewriteSuggestions.map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold">
                  <span className="font-bold">Original:</span>
                  <span className="line-through">{item.original}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Suggested:</span>
                  <span>{item.suggested}</span>
                </div>
                <p className="text-[11px] text-slate-500 italic">Alasan HR: {item.reason}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* JSON Parsed SubTab */}
      {activeSubTab === 'json_parser' && activeCV && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Output Parsed JSON Data</h3>
            <span className="text-xs text-slate-400">Extracted by Gemini AI</span>
          </div>
          <pre className="max-h-96 overflow-y-auto rounded-xl bg-slate-950 p-4 text-[11px] font-mono text-cyan-400 leading-relaxed">
            {JSON.stringify(activeCV, null, 2)}
          </pre>
        </GlassCard>
      )}
    </div>
  );
};
