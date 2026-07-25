import { getSupabaseClient } from '../config/supabase';
import { JobMatch, ParsedCV, JobProcessed } from '../../types';
import { sampleJobs, sampleCVs } from '../../data/sampleData';

export class MatchingRepository {
  private fallbackMatches: JobMatch[] = [
    {
      id: 'match_01',
      jobId: sampleJobs[0].id,
      cvId: sampleCVs[0].id || 'cv_01',
      job: sampleJobs[0],
      overallMatchScore: 94,
      technicalMatch: 95,
      softSkillMatch: 90,
      educationMatch: 96,
      experienceMatch: 92,
      atsProbability: 96,
      hrProbability: 92,
      interviewProbability: 90,
      offerProbability: 85,
      matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Google Gemini API', 'GCP'],
      missingSkills: ['Next.js', 'Docker'],
      matchReasoning: 'Kandidat memiliki keahlian teknis yang sangat cocok (95%) dengan kualifikasi GoTo Financial. Pengalaman langsung dalam mengintegrasikan Gemini AI API & pgvector menjadi nilai tambah utama.',
      calculatedAt: new Date().toISOString(),
    },
    {
      id: 'match_02',
      jobId: sampleJobs[1].id,
      cvId: sampleCVs[0].id || 'cv_01',
      job: sampleJobs[1],
      overallMatchScore: 91,
      technicalMatch: 92,
      softSkillMatch: 88,
      educationMatch: 95,
      experienceMatch: 90,
      atsProbability: 93,
      hrProbability: 89,
      interviewProbability: 86,
      offerProbability: 82,
      matchedSkills: ['React', 'TypeScript', 'Python', 'PostgreSQL', 'Supabase', 'Gemini AI', 'Tailwind CSS'],
      missingSkills: ['FastAPI'],
      matchReasoning: 'Kandidat memiliki latar belakang yang sangat relevan untuk posisi AI Specialist di Tokopedia. Memiliki kecocokan 92% pada stack teknis utama.',
      calculatedAt: new Date().toISOString(),
    },
  ];

  public async getMatches(): Promise<JobMatch[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackMatches;

    const { data } = await supabase
      .from('job_matches')
      .select('*, job:jobs_processed(*)')
      .order('overall_match_score', { ascending: false });

    if (!data || data.length === 0) return this.fallbackMatches;

    return data.map((d) => ({
      id: d.id,
      jobId: d.job_id,
      cvId: d.cv_id || 'cv_primary',
      job: d.job
        ? {
            id: d.job.id,
            title: d.job.title,
            company: d.job.company,
            location: d.job.location,
            salaryRange: d.job.salary_range,
            employmentType: d.job.employment_type,
            experienceLevel: d.job.experience_level,
            summary: d.job.summary,
            responsibilities: d.job.responsibilities,
            requirements: d.job.requirements,
            requiredSkills: d.job.required_skills,
            sourceUrl: d.job.source_url,
            postedDate: d.job.posted_date,
            isActive: d.job.is_active,
          }
        : this.fallbackMatches[0]?.job || sampleJobs[0],
      overallMatchScore: d.overall_match_score,
      technicalMatch: d.technical_match,
      softSkillMatch: d.soft_skill_match,
      educationMatch: d.education_match,
      experienceMatch: d.experience_match,
      atsProbability: d.ats_probability,
      hrProbability: d.hr_probability,
      interviewProbability: d.interview_probability,
      offerProbability: d.offer_probability,
      matchedSkills: d.matched_skills || [],
      missingSkills: d.missing_skills || [],
      matchReasoning: d.match_reasoning || '',
      calculatedAt: d.calculated_at || d.created_at,
    }));
  }

  public recalculateMatches(cv: ParsedCV | null, jobs: JobProcessed[]): JobMatch[] {
    if (!cv || !jobs || jobs.length === 0) return this.fallbackMatches;

    const cvHardSkills = (cv.skills?.hardSkills || []).map((s) => s.toLowerCase());
    const cvSoftSkills = (cv.skills?.softSkills || []).map((s) => s.toLowerCase());

    const recalculated: JobMatch[] = jobs.map((job, idx) => {
      const jobRequired = (job.requiredSkills || []).map((s) => s.toLowerCase());

      // 1. Technical Skill Match
      const matched = job.requiredSkills.filter((skill) =>
        cvHardSkills.some((cvS) => cvS.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cvS))
      );
      const missing = job.requiredSkills.filter((skill) => !matched.includes(skill));

      const skillOverlapRatio = jobRequired.length > 0 ? matched.length / jobRequired.length : 0.8;
      const technicalMatch = Math.min(100, Math.round(skillOverlapRatio * 100));

      // 2. Soft Skill & Experience & Education Match
      const softSkillMatch = cvSoftSkills.length > 0 ? 88 : 80;
      const experienceMatch = job.experienceLevel?.toLowerCase().includes('junior') ? 92 : 85;
      const educationMatch = cv.education?.length > 0 ? 95 : 85;

      // 3. Overall Weighted Score Calculation
      const overallMatchScore = Math.min(
        99,
        Math.max(
          60,
          Math.round(technicalMatch * 0.45 + experienceMatch * 0.25 + educationMatch * 0.15 + softSkillMatch * 0.15)
        )
      );

      // 4. Probabilities & Recommendation Reasoning
      const atsProbability = Math.min(98, overallMatchScore + 2);
      const hrProbability = Math.min(95, overallMatchScore - 3);
      const interviewProbability = Math.min(92, overallMatchScore - 5);
      const offerProbability = Math.min(88, overallMatchScore - 10);

      const reasoning = `Kandidat memiliki kecocokan ${overallMatchScore}% untuk posisi ${job.title} di ${job.company}. Menguasai ${matched.length} dari ${job.requiredSkills.length} keahlian utama yang dibutuhkan (${matched.slice(0, 4).join(', ')}).`;

      return {
        id: `match_${Date.now()}_${idx}`,
        jobId: job.id,
        cvId: cv.id || 'cv_primary',
        job,
        overallMatchScore,
        technicalMatch,
        softSkillMatch,
        educationMatch,
        experienceMatch,
        atsProbability,
        hrProbability,
        interviewProbability,
        offerProbability,
        matchedSkills: matched,
        missingSkills: missing,
        matchReasoning: reasoning,
        calculatedAt: new Date().toISOString(),
      };
    });

    recalculated.sort((a, b) => b.overallMatchScore - a.overallMatchScore);
    this.fallbackMatches = recalculated;

    this.persistMatchesToSupabase(recalculated);

    return recalculated;
  }

  private async persistMatchesToSupabase(matches: JobMatch[]) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      for (const m of matches) {
        await supabase.from('job_matches').upsert(
          {
            job_id: m.jobId,
            cv_id: m.cvId,
            overall_match_score: m.overallMatchScore,
            technical_match: m.technicalMatch,
            soft_skill_match: m.softSkillMatch,
            education_match: m.educationMatch,
            experience_match: m.experienceMatch,
            ats_probability: m.atsProbability,
            hr_probability: m.hrProbability,
            interview_probability: m.interviewProbability,
            offer_probability: m.offerProbability,
            matched_skills: m.matchedSkills,
            missing_skills: m.missingSkills,
            match_reasoning: m.matchReasoning,
          },
          { onConflict: 'job_id,cv_id' }
        );
      }
    } catch (err: any) {
      console.warn('Note persisting job matches to Supabase:', err.message);
    }
  }
}

export const matchingRepository = new MatchingRepository();
