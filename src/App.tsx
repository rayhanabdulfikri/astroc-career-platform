import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { HeroSection } from './components/landing/HeroSection';
import { FeatureGrid } from './components/landing/FeatureGrid';
import { HowItWorks } from './components/landing/HowItWorks';
import { FAQSection } from './components/landing/FAQSection';
import { CTASection } from './components/landing/CTASection';
import { AuthModal } from './components/auth/AuthModal';
import { OverviewCards } from './components/dashboard/OverviewCards';
import { CVAnalyzerView } from './components/dashboard/CVAnalyzerView';
import { TargetPositionModal } from './components/dashboard/TargetPositionModal';
import { JobFinderView } from './components/dashboard/JobFinderView';
import { JobMatchView } from './components/dashboard/JobMatchView';
import { SkillGapView } from './components/dashboard/SkillGapView';
import { RoadmapView } from './components/dashboard/RoadmapView';
import { InterviewCoachView } from './components/dashboard/InterviewCoachView';
import { SystemStatusView } from './components/dashboard/SystemStatusView';
import { auth, onAuthStateChanged } from './config/firebase';
import {
  AuthUser,
  ParsedCV,
  CVAnalysisResult,
  DashboardData,
  JobProcessed,
  JobMatch,
  SkillGapAnalysis,
  CareerRoadmap,
  InterviewQuestion,
  NotificationItem,
  TargetPosition,
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

  // Core Data States
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeCV, setActiveCV] = useState<ParsedCV | null>(null);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysisResult | null>(null);
  const [jobs, setJobs] = useState<JobProcessed[]>([]);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis | null>(null);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loadingScheduler, setLoadingScheduler] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Require Auth Guard for Feature Access
  const handleSelectTab = (tabId: string) => {
    if (tabId !== 'dashboard' && !authToken && !user) {
      addToast('info', 'Silakan daftar atau masuk ke akun ASTROC terlebih dahulu untuk mengakses fitur ini!');
      setIsAuthModalOpen(true);
      return;
    }
    setActiveTab(tabId);
  };

  const requireAuthAction = (actionFn: () => void) => {
    if (!authToken && !user) {
      addToast('info', 'Silakan login/daftar akun terlebih dahulu untuk menggunakan fitur AI!');
      setIsAuthModalOpen(true);
      return;
    }
    actionFn();
  };

  // Listen to Firebase Auth state (only if Firebase is properly configured)
  useEffect(() => {
    if (!auth) return; // Firebase not configured — skip auth listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const token = await fbUser.getIdToken();
        setAuthToken(token);
        setUser({
          uid: fbUser.uid,
          email: fbUser.email || 'user@astroc.ai',
          fullName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0].toUpperCase() : 'Rayhan AI Engineer'),
          avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync dark class on html document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const getAuthHeaders = () => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  };

  // Initial Data Fetching from Server
  const loadInitialData = async () => {
    try {
      const [dashRes, jobsRes, matchRes, gapRes, roadRes, qRes, notifRes, cvRes] = await Promise.all([
        fetch('/api/dashboard/overview', { headers: getAuthHeaders() }).then((r) => r.json()),
        fetch('/api/jobs', { headers: getAuthHeaders() }).then((r) => r.json()),
        fetch('/api/matching/evaluate', { headers: getAuthHeaders() }).then((r) => r.json()),
        fetch('/api/skill-gap', { headers: getAuthHeaders() }).then((r) => r.json()),
        fetch('/api/roadmap', { headers: getAuthHeaders() }).then((r) => r.json()),
        fetch('/api/interview-questions', { headers: getAuthHeaders() }).then((r) => r.json()),
        fetch('/api/notifications', { headers: getAuthHeaders() }).then((r) => r.json()),
        fetch('/api/cv/active', { headers: getAuthHeaders() }).then((r) => r.json()),
      ]);

      if (dashRes.data) setDashboardData(dashRes.data);
      if (jobsRes.jobs) setJobs(jobsRes.jobs);
      if (matchRes.matches) setMatches(matchRes.matches);
      if (gapRes.skillGap) setSkillGap(gapRes.skillGap);
      if (roadRes.roadmap) setRoadmap(roadRes.roadmap);
      if (qRes.questions) setInterviewQuestions(qRes.questions);
      if (notifRes.notifications) setNotifications(notifRes.notifications);
      if (cvRes.activeCV) {
        setActiveCV(cvRes.activeCV);
        setCvAnalysis(cvRes.analysis);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [authToken]);

  // Upload CV handler — extract text CLIENT-SIDE first, then send JSON to avoid Vercel multipart issues
  const handleUploadCV = async (fileOrRawText: File | string, fileName: string, presetId?: string) => {
    requireAuthAction(async () => {
      setLoading(true);
      addToast('info', 'Membaca file CV...');
      try {
        let rawText = '';
        let finalFileName = fileName;
        let res: Response;

        if (fileOrRawText instanceof File) {
          finalFileName = fileOrRawText.name;
          const fileType = fileOrRawText.type;
          const name = fileOrRawText.name.toLowerCase();

          addToast('info', 'Mengekstrak teks CV dan menjalankan Gemini AI Engine...');

          // Client-side text extraction for PDF using FileReader + raw byte decoding
          if (fileType === 'application/pdf' || name.endsWith('.pdf')) {
            try {
              const arrayBuffer = await fileOrRawText.arrayBuffer();
              const uint8Array = new Uint8Array(arrayBuffer);
              const decoder = new TextDecoder('latin1');
              const rawBytes = decoder.decode(uint8Array);

              // Extract text between parentheses in PDF streams (BT...ET blocks)
              const parts: string[] = [];
              const btEt = /BT\s+([\s\S]*?)\s+ET/g;
              let m;
              while ((m = btEt.exec(rawBytes)) !== null) {
                const strMatch = /\(([^)]*)\)/g;
                let sm;
                while ((sm = strMatch.exec(m[1])) !== null) {
                  const t = sm[1].replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\\\/g, '\\');
                  if (t.trim().length > 1) parts.push(t);
                }
              }

              rawText = parts.length > 0
                ? parts.join(' ').replace(/\s+/g, ' ').trim()
                : rawBytes.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();

              if (rawText.length < 30) {
                rawText = `CV PDF diunggah: ${finalFileName}. Software Engineer.`;
              }
            } catch {
              rawText = `CV PDF diunggah: ${finalFileName}`;
            }
          } else if (fileType === 'text/plain' || name.endsWith('.txt')) {
            rawText = await fileOrRawText.text();
          } else {
            // DOCX: read as text best-effort
            try {
              rawText = await fileOrRawText.text();
            } catch {
              rawText = `CV DOCX diunggah: ${finalFileName}`;
            }
          }

          // Send as JSON (no multipart) — works reliably on Vercel Serverless
          res = await fetch('/api/cv/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
            body: JSON.stringify({ rawText, fileName: finalFileName }),
          });
        } else {
          res = await fetch('/api/cv/upload', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ rawText: fileOrRawText, fileName, presetId }),
          });
        }

        const responseText = await res.text();
        let data: any;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Server response parsing error:', responseText);
          addToast('error', `Respons Server (${res.status}): ${responseText.slice(0, 80)}`);
          return;
        }

        if (data.parsed) {
          setActiveCV(data.parsed);
          setCvAnalysis(data.analysis);
          addToast('success', `CV ${data.parsed.name} berhasil dianalisis dengan ATS Score ${data.analysis.ats.atsScore}%!`);
          loadInitialData();
        } else {
          addToast('error', data.error || data.message || 'Gagal memproses CV. Silakan coba lagi.');
        }
      } catch (err: any) {
        console.error(err);
        addToast('error', err?.message || 'Gagal memproses CV. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    });
  };

  // Trigger Live Search Grounding
  const handleTriggerSearchGrounding = async () => {
    requireAuthAction(async () => {
      setSearching(true);
      addToast('info', 'Gemini Grounding mencari lowongan kerja nyata...');
      try {
        const res = await fetch('/api/jobs/search-grounding', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            query: dashboardData?.targetPosition?.title || 'Full Stack Engineer',
          }),
        });
        const data = await res.json();
        if (data.jobs) {
          setJobs(data.jobs);
          addToast('success', `Berhasil menemukan ${data.count || data.foundCount} lowongan kerja baru via Search Grounding!`);
          loadInitialData();
        }
      } catch (err) {
        console.error(err);
        addToast('error', 'Gagal menjalankan Search Grounding.');
      } finally {
        setSearching(false);
      }
    });
  };

  // Trigger Scheduler
  const handleManualTriggerScheduler = async () => {
    requireAuthAction(async () => {
      setLoadingScheduler(true);
      addToast('info', 'Menjalankan Background Job Discovery Scheduler...');
      try {
        const res = await fetch('/api/admin/trigger-scheduler', {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.success) {
          addToast('success', `Scheduler selesai! ${data.discoveredJobsCount} lowongan baru ter-index.`);
          loadInitialData();
        }
      } catch (err) {
        console.error(err);
        addToast('error', 'Gagal menjalankan scheduler.');
      } finally {
        setLoadingScheduler(false);
      }
    });
  };

  // Update Target Position
  const handleSaveTargetPosition = async (updated: Partial<TargetPosition>) => {
    requireAuthAction(async () => {
      try {
        const res = await fetch('/api/target-position', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(updated),
        });
        const data = await res.json();
        if (data.targetPosition) {
          addToast('success', 'Target Position berhasil diperbarui!');
          loadInitialData();
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  // Re-generate Roadmap
  const handleRegenerateRoadmap = async () => {
    requireAuthAction(async () => {
      setLoading(true);
      addToast('info', 'Gemini AI membuat ulang Strategic Career Roadmap...');
      try {
        const res = await fetch('/api/roadmap/generate', { method: 'POST', headers: getAuthHeaders() });
        const data = await res.json();
        if (data.roadmap) {
          setRoadmap(data.roadmap);
          addToast('success', 'Career Roadmap berhasil diperbarui!');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
  };

  // Mark notifications read
  const handleMarkNotifsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST', headers: getAuthHeaders() });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#050507] dark:text-slate-200 font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        user={user}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotifsRead}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-8">
        {/* LANDING / HERO COMPONENT IF TAB IS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            <HeroSection
              onStartUpload={() => handleSelectTab('cv_analysis')}
              onExploreJobs={() => handleSelectTab('job_finder')}
            />

            {/* Main Overview Metrics */}
            {dashboardData && (
              <OverviewCards
                data={dashboardData}
                onNavigateTab={(tab) => handleSelectTab(tab)}
                onOpenTargetModal={() => requireAuthAction(() => setIsTargetModalOpen(true))}
              />
            )}

            <HowItWorks />
            <FeatureGrid />
            <FAQSection />
            <CTASection onStartUpload={() => handleSelectTab('cv_analysis')} />
          </>
        )}

        {/* TAB 2: CV ANALYSIS */}
        {activeTab === 'cv_analysis' && (
          <CVAnalyzerView
            activeCV={activeCV}
            analysis={cvAnalysis}
            onUploadCV={handleUploadCV}
            loading={loading}
          />
        )}

        {/* TAB 3: JOB FINDER */}
        {activeTab === 'job_finder' && (
          <JobFinderView
            jobs={jobs}
            onTriggerSearchGrounding={handleTriggerSearchGrounding}
            searching={searching}
          />
        )}

        {/* TAB 4: MATCH ENGINE */}
        {activeTab === 'matching' && <JobMatchView matches={matches} />}

        {/* TAB 5: SKILL GAP */}
        {activeTab === 'skill_gap' && <SkillGapView skillGap={skillGap} />}

        {/* TAB 6: CAREER ROADMAP */}
        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmap={roadmap}
            onRegenerateRoadmap={handleRegenerateRoadmap}
            loading={loading}
          />
        )}

        {/* TAB 7: INTERVIEW COACH */}
        {activeTab === 'interview' && (
          <InterviewCoachView
            questions={interviewQuestions}
            targetPosition={dashboardData?.targetPosition?.title || 'Full Stack Engineer'}
          />
        )}

        {/* TAB 8: ARCHITECTURE & SYSTEM LOGS */}
        {activeTab === 'system_logs' && (
          <SystemStatusView
            onManualTriggerScheduler={handleManualTriggerScheduler}
            loadingScheduler={loadingScheduler}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onLoginSuccess={(loggedInUser, token) => {
          setUser(loggedInUser);
          if (token) setAuthToken(token);
          addToast('success', `Selamat datang kembali, ${loggedInUser.fullName}! Akses fitur AI ASTROC kini aktif.`);
        }}
      />

      <TargetPositionModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        targetPosition={dashboardData?.targetPosition || null}
        onSave={handleSaveTargetPosition}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
