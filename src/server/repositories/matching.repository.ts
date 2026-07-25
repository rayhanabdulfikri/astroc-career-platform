import { getSupabaseClient } from '../config/supabase';
import { JobMatch, JobProcessed, ParsedCV } from '../../types';
import { sampleJobs, sampleCVs } from '../../data/sampleData';

export class MatchingRepository {
  private fallbackMatches: JobMatch[] = [];

  constructor() {
    this.recalculateMatches(sampleCVs[0], sampleJobs);
  }

  public recalculateMatches(primaryCV: ParsedCV | null, jobs: JobProcessed[]): JobMatch[] {
    if (!primaryCV) return this.fallbackMatches;

    const candidateSkills = primaryCV.skills.hardSkills.map((s) => s.toLowerCase());

    this.fallbackMatches = jobs.map((job, idx) => {
      const requiredSkills = job.requiredSkills.map((s) => s.toLowerCase());
      const matched = job.requiredSkills.filter((s) => candidateSkills.includes(s.toLowerCase()));
      const missing = job.requiredSkills.filter((s) => !candidateSkills.includes(s.toLowerCase()));

      const techRatio = requiredSkills.length ? matched.length / requiredSkills.length : 0.8;
      const techScore = Math.round(techRatio * 100);
      const softScore = 88;
      const overallMatch = Math.min(98, Math.max(65, Math.round(techScore * 0.6 + softScore * 0.4)));

      return {
        id: `match_${idx + 1}`,
        jobId: job.id,
        cvId: primaryCV.id || 'cv_01',
        job: { ...job, matchScore: overallMatch },
        overallMatchScore: overallMatch,
        technicalMatch: techScore,
        softSkillMatch: softScore,
        educationMatch: 95,
        experienceMatch: 90,
        atsProbability: overallMatch >= 80 ? 92 : 75,
        hrProbability: overallMatch >= 80 ? 88 : 70,
        interviewProbability: overallMatch >= 80 ? 85 : 65,
        offerProbability: overallMatch >= 80 ? 80 : 60,
        matchedSkills: matched,
        missingSkills: missing,
        matchReasoning: `Kandidat memiliki ${matched.length} dari ${job.requiredSkills.length} skill utama yang dibutuhkan oleh ${job.company}, termasuk ${matched.slice(0, 3).join(', ')}.`,
        calculatedAt: new Date().toISOString(),
      };
    });

    const supabase = getSupabaseClient();
    if (supabase && primaryCV) {
      const rows = this.fallbackMatches.map((m) => ({
        cv_id: primaryCV.id,
        job_id: m.jobId,
        overall_match_score: m.overallMatchScore,
        technical_match: m.technicalMatch,
        soft_skill_match: m.softSkillMatch,
        education_match: m.educationMatch,
        experience_match: m.experienceMatch,
        ats_probability: m.atsProbability,
        hr_probability: m.hrProbability,
        interview_probability: m.interviewProbability,
        offer_probability: m.offerProbability,
        reasoning_detail: { reasoning: m.matchReasoning, matchedSkills: m.matchedSkills, missingSkills: m.missingSkills },
      }));

      supabase.from('job_matching').upsert(rows).then(() => {});
    }

    return this.fallbackMatches;
  }

  public async getMatches(): Promise<JobMatch[]> {
    return this.fallbackMatches;
  }
}

export const matchingRepository = new MatchingRepository();
