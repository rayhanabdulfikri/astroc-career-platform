import { getSupabaseClient } from '../config/supabase';
import { JobProcessed } from '../../types';
import { sampleJobs } from '../../data/sampleData';

export interface JobQueryFilters {
  q?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  page?: number;
  limit?: number;
}

export class JobRepository {
  private fallbackJobs: JobProcessed[] = [...sampleJobs];
  private rawSearchLogs: Array<{ id: string; query: string; rawPayload: string; createdAt: string }> = [];

  private generateCanonicalKey(company: string, title: string, location: string): string {
    const cleanStr = `${company}_${title}_${location}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanStr;
  }

  public async saveRawJob(searchQuery: string, rawPayload: string): Promise<string> {
    const rawId = `raw_${Date.now()}`;
    this.rawSearchLogs.unshift({
      id: rawId,
      query: searchQuery,
      rawPayload,
      createdAt: new Date().toISOString(),
    });

    const supabase = getSupabaseClient();
    if (!supabase) return rawId;

    try {
      await supabase.from('jobs_raw').insert({
        source: 'google_search_grounding',
        query: searchQuery,
        raw_payload: { payload: rawPayload },
      });
    } catch (err: any) {
      console.warn('Note saving to jobs_raw table:', err.message);
    }

    return rawId;
  }

  public async getJobs(searchQuery?: string): Promise<JobProcessed[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      if (!searchQuery) return this.fallbackJobs;
      const q = searchQuery.toLowerCase();
      return this.fallbackJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.summary.toLowerCase().includes(q)
      );
    }

    let query = supabase.from('jobs_processed').select('*').order('created_at', { ascending: false });
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`);
    }

    const { data } = await query;
    if (!data || data.length === 0) return this.fallbackJobs;

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      company: d.company,
      location: d.location,
      salaryRange: d.salary_range || 'Rp 15,000,000 - Rp 25,000,000',
      employmentType: d.employment_type || 'Full-time',
      experienceLevel: d.experience_level || 'mid',
      summary: d.summary || '',
      responsibilities: d.responsibilities || [],
      requirements: d.requirements || [],
      requiredSkills: d.required_skills || [],
      sourceUrl: d.source_url || 'https://www.google.com',
      postedDate: d.posted_date || 'Baru diterbitkan',
      isActive: d.is_active ?? true,
    }));
  }

  public async getJobsPaginated(filters: JobQueryFilters): Promise<{
    jobs: JobProcessed[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(filters.limit) || 10));
    const offset = (page - 1) * limit;

    const allJobs = await this.getJobs(filters.q);
    let filtered = allJobs;

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter((j) => j.location.toLowerCase().includes(loc));
    }

    if (filters.employmentType) {
      const type = filters.employmentType.toLowerCase();
      filtered = filtered.filter((j) => j.employmentType.toLowerCase().includes(type));
    }

    if (filters.experienceLevel) {
      const exp = filters.experienceLevel.toLowerCase();
      filtered = filtered.filter((j) => j.experienceLevel.toLowerCase().includes(exp));
    }

    const total = filtered.length;
    const paginatedJobs = filtered.slice(offset, offset + limit);

    return {
      jobs: paginatedJobs,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async saveJobs(jobs: JobProcessed[]): Promise<JobProcessed[]> {
    const savedList: JobProcessed[] = [];
    const seenKeys = new Set<string>();

    for (const job of jobs) {
      const key = this.generateCanonicalKey(job.company, job.title, job.location);
      if (seenKeys.has(key)) continue; // In-batch deduplication
      seenKeys.add(key);

      const existingIndex = this.fallbackJobs.findIndex(
        (j) => this.generateCanonicalKey(j.company, j.title, j.location) === key
      );

      if (existingIndex >= 0) {
        this.fallbackJobs[existingIndex] = { ...this.fallbackJobs[existingIndex], ...job };
        savedList.push(this.fallbackJobs[existingIndex]);
      } else {
        this.fallbackJobs.unshift(job);
        savedList.push(job);
      }
    }

    const supabase = getSupabaseClient();
    if (!supabase) return savedList;

    try {
      for (const job of savedList) {
        await supabase.from('jobs_processed').upsert(
          {
            title: job.title,
            company: job.company,
            location: job.location,
            salary_range: job.salaryRange,
            employment_type: job.employmentType,
            experience_level: job.experienceLevel,
            summary: job.summary,
            responsibilities: job.responsibilities,
            requirements: job.requirements,
            required_skills: job.requiredSkills,
            source_url: job.sourceUrl,
            posted_date: job.postedDate,
            is_active: job.isActive,
          },
          { onConflict: 'company,title' }
        );
      }
    } catch (err: any) {
      console.warn('Note upserting processed jobs to Supabase:', err.message);
    }

    return savedList;
  }
}

export const jobRepository = new JobRepository();
