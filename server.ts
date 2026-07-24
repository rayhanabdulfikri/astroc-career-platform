import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';
import {
  parseCVWithAI,
  analyzeCVFullPipeline,
  searchJobsWithSearchGrounding,
  analyzeSkillGapAI,
  generateCareerRoadmapAI,
  generateInterviewSimulationsAI,
} from './src/server/gemini';
import { jobScheduler } from './src/server/scheduler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Start background job search scheduler
  jobScheduler.startScheduler();

  // ================= REST API ROUTES =================

  // 1. Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'ASTROC – AI Career Intelligence Platform',
      version: '1.0.0-production',
      aiModel: 'gemini-3.6-flash',
      groundingEnabled: true,
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Auth Routes (Firebase Integration Simulation)
  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    let user = db.users.find((u) => u.email === email);
    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        email: email || 'user@astroc.ai',
        fullName: email ? email.split('@')[0].toUpperCase() : 'Rayhan Abdul',
        role: 'Job Seeker / AI Enthusiast',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      db.users.push(user);
    }
    res.json({ status: 'success', user, token: `fb_jwt_token_${Date.now()}` });
  });

  app.get('/api/auth/me', (req, res) => {
    res.json({ user: db.users[0], profile: db.profiles[0] });
  });

  // 3. CV Routes
  app.get('/api/cv/current', (req, res) => {
    const activeCV = db.cvs[0] || null;
    const latestAnalysis = db.cvAnalysis.find((a) => a.cvId === activeCV?.id) || db.cvAnalysis[0] || null;
    res.json({ activeCV, latestAnalysis });
  });

  app.post('/api/cv/upload', async (req, res) => {
    try {
      const { fileName, rawText, presetId } = req.body;
      let textContent = rawText || '';

      if (!textContent && presetId) {
        const found = db.cvs.find((c) => c.id === presetId);
        if (found) textContent = found.rawText || found.summary;
      }

      if (!textContent) {
        textContent = `Rayhan Abdul Software Engineer. Pengalaman React, TypeScript, Node.js, Python, PostgreSQL, Gemini AI. Universitas Indonesia S.Kom GPA 3.82.`;
      }

      const parsedCV = await parseCVWithAI(textContent, fileName || 'Uploaded_CV.pdf');
      
      // Store in DB as primary CV
      db.cvs.unshift(parsedCV);

      // Run full ATS & HR 20+ Yrs evaluation
      const analysisResult = await analyzeCVFullPipeline(parsedCV);
      db.cvAnalysis.unshift(analysisResult);

      // Recalculate matches
      db.calculateInitialMatches();

      res.json({
        status: 'success',
        cv: parsedCV,
        analysis: analysisResult,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error processing CV' });
    }
  });

  app.post('/api/cv/analyze', async (req, res) => {
    try {
      const activeCV = db.cvs[0];
      if (!activeCV) {
        return res.status(400).json({ error: 'No CV uploaded yet' });
      }
      const result = await analyzeCVFullPipeline(activeCV);
      db.cvAnalysis.unshift(result);
      res.json({ status: 'success', analysis: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error running AI analysis' });
    }
  });

  // 4. Target Position Routes
  app.get('/api/target-position', (req, res) => {
    res.json({ targetPosition: db.targetPositions[0] || null });
  });

  app.post('/api/target-position', (req, res) => {
    const { title, industry, expectedSalaryMin, expectedSalaryMax, location, remotePreference, experienceLevel } = req.body;
    
    const updated: any = {
      id: db.targetPositions[0]?.id || 'tgt_01',
      userId: 'usr_01',
      title: title || 'Full Stack AI Engineer',
      industry: industry || 'Technology',
      expectedSalaryMin: Number(expectedSalaryMin) || 15000000,
      expectedSalaryMax: Number(expectedSalaryMax) || 28000000,
      currency: 'IDR',
      location: location || 'Jakarta / Remote',
      remotePreference: remotePreference || 'hybrid',
      experienceLevel: experienceLevel || 'junior',
      updatedAt: new Date().toISOString(),
    };

    db.targetPositions[0] = updated;
    db.calculateInitialMatches();

    res.json({ status: 'success', targetPosition: updated });
  });

  // 5. Job Search & Database Routes
  app.get('/api/jobs', (req, res) => {
    const search = (req.query.q as string || '').toLowerCase();
    let jobs = db.jobsProcessed;
    if (search) {
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(search) ||
          j.company.toLowerCase().includes(search) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(search))
      );
    }
    res.json({ total: jobs.length, jobs });
  });

  app.post('/api/jobs/search', async (req, res) => {
    try {
      const activeTarget = db.targetPositions[0];
      const activeCV = db.cvs[0];
      const cvSkills = activeCV ? activeCV.skills.hardSkills : ['React', 'Node.js', 'Python', 'SQL'];

      const freshJobs = await searchJobsWithSearchGrounding(activeTarget, cvSkills);
      db.calculateInitialMatches();

      res.json({
        status: 'success',
        foundCount: freshJobs.length,
        jobs: freshJobs,
        matches: db.jobMatches,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error searching jobs' });
    }
  });

  // 6. Matching Engine Routes
  app.get('/api/matching', (req, res) => {
    res.json({
      matches: db.jobMatches,
      topMatch: db.jobMatches[0] || null,
    });
  });

  app.post('/api/matching/calculate', (req, res) => {
    db.calculateInitialMatches();
    res.json({ status: 'success', matches: db.jobMatches });
  });

  // 7. Skill Gap Route
  app.get('/api/skill-gap', async (req, res) => {
    try {
      const activeCV = db.cvs[0];
      const activeTarget = db.targetPositions[0];
      if (!activeCV || !activeTarget) {
        return res.status(400).json({ error: 'CV and Target Position required' });
      }

      const result = await analyzeSkillGapAI(activeCV, activeTarget);
      res.json({ skillGap: result });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error analyzing skill gap' });
    }
  });

  // 8. Career Roadmap Routes
  app.get('/api/roadmap', async (req, res) => {
    try {
      let roadmap = db.roadmaps[0];
      if (!roadmap) {
        const activeCV = db.cvs[0];
        const activeTarget = db.targetPositions[0];
        const latestAnalysis = db.cvAnalysis[0];
        const score = latestAnalysis ? latestAnalysis.overallCareerScore : 88;

        roadmap = await generateCareerRoadmapAI(activeCV, activeTarget, score);
        db.roadmaps.unshift(roadmap);
      }
      res.json({ roadmap });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error fetching roadmap' });
    }
  });

  app.post('/api/roadmap/generate', async (req, res) => {
    try {
      const activeCV = db.cvs[0];
      const activeTarget = db.targetPositions[0];
      const latestAnalysis = db.cvAnalysis[0];
      const score = latestAnalysis ? latestAnalysis.overallCareerScore : 88;

      const roadmap = await generateCareerRoadmapAI(activeCV, activeTarget, score);
      db.roadmaps.unshift(roadmap);
      res.json({ status: 'success', roadmap });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error generating roadmap' });
    }
  });

  // 9. Interview Coach
  app.post('/api/interview/simulate', async (req, res) => {
    try {
      const activeCV = db.cvs[0];
      const activeTarget = db.targetPositions[0];
      const questions = await generateInterviewSimulationsAI(activeCV, activeTarget);
      res.json({ status: 'success', questions });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error generating interview simulation' });
    }
  });

  // 10. Dashboard Aggregate Route
  app.get('/api/dashboard', (req, res) => {
    const activeCV = db.cvs[0] || null;
    const latestAnalysis = db.cvAnalysis.find((a) => a.cvId === activeCV?.id) || db.cvAnalysis[0] || null;

    res.json({
      user: db.users[0],
      targetPosition: db.targetPositions[0] || null,
      activeCV,
      latestAnalysis,
      overallCareerScore: latestAnalysis ? latestAnalysis.overallCareerScore : 90,
      atsScore: latestAnalysis ? latestAnalysis.ats.atsScore : 92,
      hrScore: latestAnalysis ? latestAnalysis.hr.hrScore : 88,
      cvCount: db.cvs.length,
      matchesCount: db.jobMatches.length,
      totalJobsInDatabase: db.jobsProcessed.length,
      topMatchingJobs: db.jobMatches.slice(0, 5),
      interviewReadiness: 88,
      notificationsCount: db.notifications.filter((n) => !n.isRead).length,
    });
  });

  // 11. Notifications
  app.get('/api/notifications', (req, res) => {
    res.json({ notifications: db.notifications });
  });

  app.post('/api/notifications/mark-read', (req, res) => {
    db.notifications.forEach((n) => (n.isRead = true));
    res.json({ status: 'success' });
  });

  // 12. Scheduler Trigger
  app.post('/api/scheduler/trigger', async (req, res) => {
    const result = await jobScheduler.executeJobSearchPipeline();
    res.json({
      status: 'success',
      schedulerState: {
        isRunning: jobScheduler.isRunning,
        lastRunTime: jobScheduler.lastRunTime,
        runCount: jobScheduler.runCount,
      },
      result,
    });
  });

  // 13. System Logs View
  app.get('/api/logs', (req, res) => {
    res.json({
      logs: db.aiLogs,
      scheduler: {
        isRunning: jobScheduler.isRunning,
        lastRunTime: jobScheduler.lastRunTime,
        runCount: jobScheduler.runCount,
      },
    });
  });

  // ================= VITE MIDDLEWARE FOR SPA =================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ASTROC AI Career Intelligence Platform running on http://localhost:${PORT}`);
  });
}

startServer();
