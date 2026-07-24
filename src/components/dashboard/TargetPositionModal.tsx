import React, { useState } from 'react';
import { X, Target, DollarSign, MapPin, Briefcase } from 'lucide-react';
import { TargetPosition } from '../../types';

interface TargetPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPosition: TargetPosition | null;
  onSave: (updated: Partial<TargetPosition>) => void;
}

export const TargetPositionModal: React.FC<TargetPositionModalProps> = ({
  isOpen,
  onClose,
  targetPosition,
  onSave,
}) => {
  const [title, setTitle] = useState(targetPosition?.title || 'Full Stack AI Engineer');
  const [industry, setIndustry] = useState(targetPosition?.industry || 'Technology');
  const [expectedSalaryMin, setExpectedSalaryMin] = useState(targetPosition?.expectedSalaryMin || 15000000);
  const [expectedSalaryMax, setExpectedSalaryMax] = useState(targetPosition?.expectedSalaryMax || 28000000);
  const [location, setLocation] = useState(targetPosition?.location || 'Jakarta / Remote');
  const [remotePreference, setRemotePreference] = useState(targetPosition?.remotePreference || 'hybrid');
  const [experienceLevel, setExperienceLevel] = useState(targetPosition?.experienceLevel || 'junior');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      industry,
      expectedSalaryMin: Number(expectedSalaryMin),
      expectedSalaryMax: Number(expectedSalaryMax),
      location,
      remotePreference: remotePreference as any,
      experienceLevel: experienceLevel as any,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Target className="h-4 w-4" />
          </div>
          <span className="text-lg font-black text-slate-900 dark:text-white">Target Position Configurator</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Atur posisi dan preferensi karir impian Anda. Gemini AI akan mencari lowongan dan mencocokkan CV berdasarkan preferensi ini.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Position / Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stack Engineer, Data Analyst"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Software / Fintech / Banking"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lokasi / Kota</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Jakarta / Bandung / Remote"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Gaji Min (IDR/bulan)</label>
              <input
                type="number"
                value={expectedSalaryMin}
                onChange={(e) => setExpectedSalaryMin(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Gaji Max (IDR/bulan)</label>
              <input
                type="number"
                value={expectedSalaryMax}
                onChange={(e) => setExpectedSalaryMax(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preferensi Kerja</label>
              <select
                value={remotePreference}
                onChange={(e) => setRemotePreference(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
              >
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote 100%</option>
                <option value="onsite">Onsite Office</option>
                <option value="any">Bebas / Any</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
              >
                <option value="fresh_graduate">Fresh Graduate (0-1 Thn)</option>
                <option value="junior">Junior (1-3 Thn)</option>
                <option value="mid">Mid Level (3-5 Thn)</option>
                <option value="senior">Senior (5+ Thn)</option>
                <option value="lead">Tech Lead / Architect</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all mt-4"
          >
            Simpan & Update Match Score
          </button>
        </form>
      </div>
    </div>
  );
};
