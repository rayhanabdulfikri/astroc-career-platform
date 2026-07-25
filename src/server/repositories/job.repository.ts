import { getSupabaseClient } from '../config/supabase';
import { JobProcessed } from '../../types';
import { sampleJobs } from '../../data/sampleData';

export class JobRepository {
  private fallbackJobs: JobProcessed[] = [...sampleJobs];

  public async getJobs(search = ''): Promise<JobProcessed[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      if (!search) return this.fallbackJobs;
      const lower = search.toLowerCase();
      return this.fallbackJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(lower) ||
          j.company.toLowerCase().includes(lower) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(lower))
      );
    }

    const { data } = await supabase.from('jobs_processed').select('*').eq('is_active', true).order('processed_at', { ascending: false });
    if (!data || data.length === 0) return this.fallbackJobs;

    const mapped: JobProcessed[] = data.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      salaryRange: j.salary_range,
      employmentType: j.employment_type,
      experienceLevel: j.experience_level,
      summary: j.summary,
      responsibilities: j.responsibilities || [],
      requirements: j.requirements || [],
      requiredSkills: j.required_skills || [],
      sourceUrl: j.source_url,
      postedDate: j.posted_date,
      isActive: j.is_active,
    }));

    if (!search) return mapped;
    const lower = search.toLowerCase();
    return mapped.filter(
      (j) =>
        j.title.toLowerCase().includes(lower) ||
        j.company.toLowerCase().includes(lower) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(lower))
    );
  }

  public async saveJobs(jobs: JobProcessed[]): Promise<JobProcessed[]> {
    jobs.forEach((nj) => {
      if (!this.fallbackJobs.some((existing) => existing.title === nj.title && existing.company === nj.company)) {
        this.fallbackJobs.unshift(nj);
      }
    });

    const supabase = getSupabaseClient();
    if (!supabase) return jobs;

    const rows = jobs.map((j) => ({
      title: j.title,
      company: j.company,
      location: j.location,
      salary_range: j.salaryRange,
      employment_type: j.employmentType,
      experience_level: j.experienceLevel,
      summary: j.summary,
      responsibilities: j.responsibilities,
      requirements: j.requirements,
      required_skills: j.requiredSkills,
      source_url: j.sourceUrl,
      posted_date: j.postedDate,
      is_active: true,
    }));

    await supabase.from('jobs_processed').upsert(rows, { onConflict: 'source_url' });

    return jobs;
  }
}

export const jobRepository = new JobRepository();
