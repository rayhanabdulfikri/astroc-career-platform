import React, { useState } from 'react';
import { MessageSquare, Sparkles, Send, CheckCircle2, Award, ChevronRight, HelpCircle } from 'lucide-react';
import { InterviewQuestion } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { ScoreBadge } from '../common/ScoreBadge';

interface InterviewCoachViewProps {
  questions: InterviewQuestion[];
  targetPosition: string;
}

export const InterviewCoachView: React.FC<InterviewCoachViewProps> = ({
  questions,
  targetPosition,
}) => {
  const [activeCategory, setActiveCategory] = useState<'hr' | 'technical' | 'behavioral' | 'case_study'>('technical');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(questions[0]?.id || '');
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<{ score: number; feedback: string } | null>(null);

  const filteredQuestions = questions.filter((q) => q.category === activeCategory);
  const activeQuestion = questions.find((q) => q.id === selectedQuestionId) || filteredQuestions[0] || questions[0];

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    try {
      const res = await fetch('/api/ai/evaluate-interview-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.questionText,
          answer: userAnswer,
          targetPosition,
        }),
      });
      const data = await res.json();
      setAiEvaluation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <GlassCard className="p-6 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border-cyan-500/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>AI Interactive Interview Coach</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Simulasi & Latihan Wawancara Kerja
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Simulasi pertanyaan wawancara HR, Technical, Behavioral, dan Case Study yang paling sering ditanyakan untuk posisi "{targetPosition}".
          </p>
        </div>
      </GlassCard>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveCategory('technical')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeCategory === 'technical'
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Technical Deep Dive
        </button>
        <button
          onClick={() => setActiveCategory('hr')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeCategory === 'hr'
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          HR Screening
        </button>
        <button
          onClick={() => setActiveCategory('behavioral')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeCategory === 'behavioral'
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Behavioral STAR Model
        </button>
        <button
          onClick={() => setActiveCategory('case_study')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeCategory === 'case_study'
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Case Study
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Selector */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pertanyaan Wawancara</h3>
          {filteredQuestions.map((q) => {
            const isSelected = q.id === (activeQuestion?.id || '');
            return (
              <GlassCard
                key={q.id}
                onClick={() => {
                  setSelectedQuestionId(q.id);
                  setAiEvaluation(null);
                  setUserAnswer('');
                }}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected ? 'border-cyan-500 bg-cyan-500/5 dark:border-cyan-400 dark:bg-cyan-500/10' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-cyan-600 dark:text-cyan-400">{q.difficulty}</span>
                    <span className="text-[10px] text-slate-400">{q.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{q.questionText}</h4>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Question Detail & Practice Arena */}
        {activeQuestion && (
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6 space-y-6">
              <div>
                <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  {activeQuestion.category.toUpperCase()} • {activeQuestion.difficulty.toUpperCase()}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">{activeQuestion.questionText}</h3>
              </div>

              {/* Sample Model Answer */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <Award className="h-4 w-4 text-cyan-500" />
                  <span>Panduan Jawaban Ideal (Model Answer):</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{activeQuestion.idealAnswer}"
                </p>
                {activeQuestion.keyPointsToInclude && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-500">Poin Kunci yang Harus Disebutkan:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activeQuestion.keyPointsToInclude.map((kp, i) => (
                        <span key={i} className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
                          • {kp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Answer Practice Input */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Latihan Jawab Pertanyaan Ini:</h4>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Tuliskan jawaban Anda di sini (Gunakan metode STAR: Situation, Task, Action, Result)..."
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={evaluating || !userAnswer.trim()}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{evaluating ? 'Gemini AI Menganalisis Jawaban...' : 'Evaluasi Jawaban Saya'}</span>
                </button>
              </div>

              {/* AI Evaluation Output */}
              {aiEvaluation && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Penilaian Jawaban Gemini AI</span>
                    <ScoreBadge score={aiEvaluation.score} />
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {aiEvaluation.feedback}
                  </p>
                </div>
              )}
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
