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
  onUploadCV: (fileOrText: File | string, fileName: string, presetId?: string) => Promise<void>;
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
    onUploadCV(file, file.name);
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
              <span>{loading ? 'Memproses AI...' : 'Upload File CV (PDF/DOCX)'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
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
      </GlassCard>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'overview'
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ats')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'ats'
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>ATS Evaluation ({analysis?.ats.atsScore || 92}%)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hr_review')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'hr_review'
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>HR 20+ Yrs Review ({analysis?.hr.hrScore || 88}%)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('json_parser')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'json_parser'
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileCode className="h-4 w-4" />
          <span>Parsed JSON Data</span>
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeCV?.name || 'Kandidat ASTROC'}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{activeCV?.email} | {activeCV?.phone}</p>
              </div>
              <ScoreBadge score={analysis?.overallCareerScore || 92} label="Career Score" size="lg" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Summary</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                {activeCV?.summary}
              </p>
            </div>

            {/* Hard Skills Badges */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Keahlian Utama (Hard Skills)</h4>
              <div className="flex flex-wrap gap-2">
                {(activeCV?.skills?.hardSkills?.length ? activeCV.skills.hardSkills : ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Tailwind CSS', 'Gemini AI']).map((skill, idx) => (
                  <span key={idx} className="rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pengalaman Kerja</h4>
              {(activeCV?.experience && activeCV.experience.length > 0) ? (
                activeCV.experience.map((exp, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{exp.title}</h5>
                        <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-[10px] text-slate-400">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      {exp.description?.map((desc, dIdx) => (
                        <li key={dIdx}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">Computer Science & Big Data Analyst Specialist</h5>
                      <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">Proyek & Praktik Data Science / Akademik</p>
                    </div>
                    <span className="text-[10px] text-slate-400">Aktif</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <li>Melakukan eksplorasi Big Data, pemrosesan dataset, & analisis kuantitatif.</li>
                    <li>Mengembangkan solusi analisis data menggunakan Python, PostgreSQL, SQL, & React.</li>
                    <li>Implementasi metode komputasi & pemodelan algoritma analisis data modern.</li>
                  </ul>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Quick Metrics */}
          <div className="space-y-6">
            <GlassCard className="p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Evaluasi Ringkas</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-400">ATS Score</span>
                  <span className="font-bold text-emerald-500">{analysis?.ats.atsScore}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${analysis?.ats.atsScore}%` }}></div>
                </div>

                <div className="flex justify-between items-center text-xs pt-2">
                  <span className="text-slate-600 dark:text-slate-400">HR Manager Verdict</span>
                  <span className="font-bold text-cyan-500">{analysis?.hr.hrScore}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${analysis?.hr.hrScore}%` }}></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <h5 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">Verdict Senior HR</h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                  "{analysis?.hr.overallHRVerdict}"
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ATS EVALUATION */}
      {activeSubTab === 'ats' && analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rincian Skor ATS</h3>
              <ScoreBadge score={analysis.ats.atsScore} label="ATS Score" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <span className="text-[10px] text-slate-400">Keyword Match</span>
                <p className="text-sm font-bold text-cyan-500">{analysis.ats.keywordMatchPercentage}%</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <span className="text-[10px] text-slate-400">Grammar & Spelling</span>
                <p className="text-sm font-bold text-emerald-500">{analysis.ats.grammarScore}%</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <span className="text-[10px] text-slate-400">Formatting Score</span>
                <p className="text-sm font-bold text-indigo-500">{analysis.ats.formattingScore}%</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <span className="text-[10px] text-slate-400">Readability</span>
                <p className="text-sm font-bold text-purple-500">{analysis.ats.readabilityScore}%</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Missing Key Terms</h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.ats.missingKeywords.map((kw, i) => (
                  <span key={i} className="rounded-md bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-500 border border-red-500/20">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rekomendasi Perbaikan ATS</h3>
            <ul className="space-y-2.5">
              {analysis.ats.improvementTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      )}

      {/* TAB CONTENT: HR REVIEW */}
      {activeSubTab === 'hr_review' && analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kekuatan & Kebiasaan Karir (HR Manager 20+ Yrs)</h3>
            <div className="space-y-2">
              {analysis.hr.strengths.map((str, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Saran Rewrite Kalimat Pencapaian</h3>
            <div className="space-y-3">
              {analysis.hr.rewriteSuggestions.map((rw, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <p className="text-red-400 line-through">"{rw.original}"</p>
                  <p className="text-emerald-500 font-semibold">"{rw.suggested}"</p>
                  <p className="text-[10px] text-slate-400">Alasan: {rw.reason}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB CONTENT: PARSED JSON */}
      {activeSubTab === 'json_parser' && (
        <GlassCard className="p-6">
          <pre className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-slate-950 p-4 rounded-xl overflow-x-auto max-h-[500px]">
            {JSON.stringify(activeCV, null, 2)}
          </pre>
        </GlassCard>
      )}
    </div>
  );
};
