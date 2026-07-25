import { getSupabaseClient } from '../config/supabase';
import { CareerRoadmap } from '../../types';

export class RoadmapRepository {
  private fallbackRoadmaps: CareerRoadmap[] = [];

  public async getRoadmap(userId?: string): Promise<CareerRoadmap | null> {
    if (this.fallbackRoadmaps.length > 0) return this.fallbackRoadmaps[0];

    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data } = await supabase.from('career_roadmap').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      targetPosition: data.target_position,
      currentScore: data.roadmap_data?.currentScore || 88,
      estimatedMonthsToTarget: data.roadmap_data?.estimatedMonthsToTarget || 6,
      phases: data.roadmap_data?.phases || [],
      generatedAt: data.created_at,
    };
  }

  public async saveRoadmap(roadmap: CareerRoadmap): Promise<CareerRoadmap> {
    this.fallbackRoadmaps.unshift(roadmap);

    const supabase = getSupabaseClient();
    if (!supabase) return roadmap;

    await supabase.from('career_roadmap').insert({
      id: roadmap.id,
      target_position: roadmap.targetPosition,
      roadmap_data: {
        currentScore: roadmap.currentScore,
        estimatedMonthsToTarget: roadmap.estimatedMonthsToTarget,
        phases: roadmap.phases,
      },
    });

    return roadmap;
  }
}

export const roadmapRepository = new RoadmapRepository();
