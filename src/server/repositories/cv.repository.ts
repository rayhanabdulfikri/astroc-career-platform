import { getSupabaseClient } from '../config/supabase';
import { ParsedCV, CVAnalysisResult } from '../../types';
import { sampleCVs } from '../../data/sampleData';

export class CVRepository {
  private fallbackCVs: ParsedCV[] = [...sampleCVs];
  private fallbackAnalysis: CVAnalysisResult[] = [
    {
      id: 'an_01',
      cvId: 'cv_01',
      overallCareerScore: 92,
      ats: {
        atsScore: 94,
        keywordMatchPercentage: 90,
        grammarScore: 96,
        formattingScore: 95,
        readabilityScore: 92,
        completenessPercentage: 98,
        missingKeywords: ['Kubernetes', 'GraphQL', 'CI/CD Pipelines'],
        formattingIssues: [],
        improvementTips: [
          'Tambahkan statistik kuantitatif pada achievement di posisi terdahulu.',
          'Gunakan istilah standar ATS seperti "Continuous Integration" di samping "CI/CD".',
        ],
      },
      hr: {
        hrScore: 90,
        strengths: [
          'Pengalaman teknis yang kuat dengan kombinasi unik Full Stack + AI LLM Integration.',
          'Penulisan achievement berbasis hasil dengan metrics terukur (turnaround time cut by 45%).',
          'Pendidikan Cumlaude dari universitas terkemuka.',
        ],
        weaknesses: [
          'Belum mencantumkan estimasi ukuran tim yang dikelola secara spesifik.',
          'Deskripsi sertifikasi dapat ditambahkan tautan kredensial resmi.',
        ],
        professionalismFeedback: 'CV sangat bersih, profesional, dan menggunakan action verbs yang tajam.',
        impactScore: 93,
        leadershipSignals: ['Head of Tech & Software Division UI', 'Memimpin code review'],
        communicationSignals: ['IELTS 7.5 Fluent', 'Cross-functional Collaboration'],
        rewriteSuggestions: [
          {
            original: 'Membuat dashboard analitik real-time berbasis React.',
            suggested: 'Merancang & meluncurkan dashboard analitik real-time berbasis React & Tailwind CSS yang digunakan oleh 20+ stakeholder bisnis.',
            reason: 'Menambahkan konteks bisnis dan jumlah pemakai (impact scale).',
          },
        ],
        overallHRVerdict: 'Kandidat kelas atas dengan potensi lolos wawancara HR hingga 92% untuk posisi Senior Developer / AI Specialist.',
      },
      analyzedAt: new Date().toISOString(),
    },
  ];

  public async getActiveCV(): Promise<ParsedCV | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackCVs[0] || null;

    const { data } = await supabase.from('cvs').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (!data) return this.fallbackCVs[0] || null;

    return {
      id: data.id,
      fileName: data.file_name,
      uploadedAt: data.created_at,
      name: data.parsed_json?.name || 'Kandidat ASTROC',
      email: data.parsed_json?.email || 'user@example.com',
      phone: data.parsed_json?.phone || '-',
      linkedin: data.parsed_json?.linkedin || '-',
      github: data.parsed_json?.github || '-',
      portfolio: data.parsed_json?.portfolio || '-',
      summary: data.parsed_json?.summary || '',
      education: data.parsed_json?.education || [],
      experience: data.parsed_json?.experience || [],
      organization: data.parsed_json?.organization || [],
      projects: data.parsed_json?.projects || [],
      achievements: data.parsed_json?.achievements || [],
      certificates: data.parsed_json?.certificates || [],
      skills: data.parsed_json?.skills || { hardSkills: [], softSkills: [], languages: [] },
      rawText: data.raw_text,
    };
  }

  public async getLatestAnalysis(cvId?: string): Promise<CVAnalysisResult | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackAnalysis[0] || null;

    const query = supabase.from('cv_analysis').select('*').order('created_at', { ascending: false }).limit(1);
    if (cvId) query.eq('cv_id', cvId);

    const { data } = await query.maybeSingle();
    if (!data) return this.fallbackAnalysis[0] || null;

    return {
      id: data.id,
      cvId: data.cv_id,
      overallCareerScore: data.overall_career_score,
      ats: data.ats_details,
      hr: data.hr_review,
      analyzedAt: data.created_at,
    };
  }

  public async saveCV(cv: ParsedCV): Promise<ParsedCV> {
    this.fallbackCVs.unshift(cv);
    const supabase = getSupabaseClient();
    if (!supabase) return cv;

    await supabase.from('cvs').insert({
      id: cv.id,
      file_name: cv.fileName,
      raw_text: cv.rawText,
      parsed_json: {
        name: cv.name,
        email: cv.email,
        phone: cv.phone,
        linkedin: cv.linkedin,
        github: cv.github,
        portfolio: cv.portfolio,
        summary: cv.summary,
        education: cv.education,
        experience: cv.experience,
        organization: cv.organization,
        projects: cv.projects,
        achievements: cv.achievements,
        certificates: cv.certificates,
        skills: cv.skills,
      },
    });

    return cv;
  }

  public async saveAnalysis(analysis: CVAnalysisResult): Promise<CVAnalysisResult> {
    this.fallbackAnalysis.unshift(analysis);
    const supabase = getSupabaseClient();
    if (!supabase) return analysis;

    await supabase.from('cv_analysis').insert({
      id: analysis.id,
      cv_id: analysis.cvId,
      ats_score: analysis.ats.atsScore,
      ats_details: analysis.ats,
      hr_score: analysis.hr.hrScore,
      hr_review: analysis.hr,
      overall_career_score: analysis.overallCareerScore,
    });

    return analysis;
  }

  public getAllCVs(): ParsedCV[] {
    return this.fallbackCVs;
  }
}

export const cvRepository = new CVRepository();
