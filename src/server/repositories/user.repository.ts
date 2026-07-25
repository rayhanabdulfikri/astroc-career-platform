import { getSupabaseClient } from '../config/supabase';
import { AuthUser, UserProfile, TargetPosition } from '../../types';
import { sampleUser, sampleTargetPosition } from '../../data/sampleData';

export class UserRepository {
  private fallbackUsers: AuthUser[] = [sampleUser];
  private fallbackProfiles: UserProfile[] = [
    {
      id: 'prof_01',
      userId: 'usr_01',
      phone: '+62 812-3456-7890',
      linkedin: 'linkedin.com/in/rayhan-abdul',
      github: 'github.com/rayhan-abdul',
      portfolioUrl: 'rayhan-portfolio.dev',
      bio: 'Principal Software Architect & AI Tech Strategist',
      careerLevel: 'mid',
    },
  ];
  private fallbackTargets: TargetPosition[] = [{ ...sampleTargetPosition }];

  public async findByEmail(email: string): Promise<AuthUser | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return this.fallbackUsers.find((u) => u.email === email) || null;
    }

    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (error || !data) return this.fallbackUsers.find((u) => u.email === email) || null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
    };
  }

  public async createUser(email: string): Promise<AuthUser> {
    const supabase = getSupabaseClient();
    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      email: email || 'user@astroc.ai',
      fullName: email ? email.split('@')[0].toUpperCase() : 'Rayhan Abdul',
      role: 'Job Seeker / AI Enthusiast',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    if (!supabase) {
      this.fallbackUsers.push(newUser);
      return newUser;
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        email: newUser.email,
        firebase_uid: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        full_name: newUser.fullName,
        avatar_url: newUser.avatarUrl,
        role: newUser.role,
      })
      .select('*')
      .single();

    if (error || !data) {
      this.fallbackUsers.push(newUser);
      return newUser;
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
    };
  }

  public async getPrimaryUser(): Promise<AuthUser> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackUsers[0];

    const { data } = await supabase.from('users').select('*').limit(1).maybeSingle();
    if (!data) return this.fallbackUsers[0];

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
    };
  }

  public async getProfile(userId: string): Promise<UserProfile | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackProfiles[0];

    const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
    if (!data) return this.fallbackProfiles[0];

    return {
      id: data.id,
      userId: data.user_id,
      phone: data.phone,
      linkedin: data.linkedin,
      github: data.github,
      portfolioUrl: data.portfolio_url,
      bio: data.bio,
      careerLevel: data.career_level,
    };
  }

  public async getTargetPosition(userId?: string): Promise<TargetPosition | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackTargets[0] || null;

    const { data } = await supabase.from('target_positions').select('*').limit(1).maybeSingle();
    if (!data) return this.fallbackTargets[0] || null;

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      industry: data.industry,
      expectedSalaryMin: Number(data.expected_salary_min),
      expectedSalaryMax: Number(data.expected_salary_max),
      currency: data.currency,
      location: data.location,
      remotePreference: data.remote_preference,
      experienceLevel: data.experience_level,
      updatedAt: data.created_at,
    };
  }

  public async updateTargetPosition(target: Partial<TargetPosition>): Promise<TargetPosition> {
    const supabase = getSupabaseClient();
    const updated: TargetPosition = {
      id: target.id || this.fallbackTargets[0]?.id || 'tgt_01',
      userId: target.userId || 'usr_01',
      title: target.title || 'Full Stack AI Engineer',
      industry: target.industry || 'Technology',
      expectedSalaryMin: Number(target.expectedSalaryMin) || 15000000,
      expectedSalaryMax: Number(target.expectedSalaryMax) || 28000000,
      currency: target.currency || 'IDR',
      location: target.location || 'Jakarta / Remote',
      remotePreference: target.remotePreference || 'hybrid',
      experienceLevel: target.experienceLevel || 'junior',
      updatedAt: new Date().toISOString(),
    };

    this.fallbackTargets[0] = updated;

    if (!supabase) return updated;

    await supabase.from('target_positions').upsert({
      id: updated.id,
      title: updated.title,
      industry: updated.industry,
      expected_salary_min: updated.expectedSalaryMin,
      expected_salary_max: updated.expectedSalaryMax,
      currency: updated.currency,
      location: updated.location,
      remote_preference: updated.remotePreference,
      experience_level: updated.experienceLevel,
    });

    return updated;
  }
}

export const userRepository = new UserRepository();
