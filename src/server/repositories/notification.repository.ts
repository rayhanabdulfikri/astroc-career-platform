import { getSupabaseClient } from '../config/supabase';
import { NotificationItem } from '../../types';

export class NotificationRepository {
  private fallbackNotifs: NotificationItem[] = [
    {
      id: 'notif_01',
      userId: 'usr_01',
      title: 'High Match Score Job Found! (94%)',
      message: 'Lowongan "Senior Full Stack Engineer (AI Integration)" di GoTo Group memiliki kecocokan 94% dengan CV Anda.',
      matchScore: 94,
      jobId: 'job_01',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ];

  public async getNotifications(userId?: string): Promise<NotificationItem[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackNotifs;

    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (!data || data.length === 0) return this.fallbackNotifs;

    return data.map((n) => ({
      id: n.id,
      userId: n.user_id,
      title: n.title,
      message: n.message,
      matchScore: n.match_score,
      jobId: n.job_id,
      isRead: n.is_read,
      createdAt: n.created_at,
    }));
  }

  public async addNotification(title: string, message: string, matchScore?: number, jobId?: string): Promise<NotificationItem> {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: 'usr_01',
      title,
      message,
      matchScore,
      jobId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.fallbackNotifs.unshift(newNotif);

    const supabase = getSupabaseClient();
    if (!supabase) return newNotif;

    await supabase.from('notifications').insert({
      title,
      message,
      match_score: matchScore,
      job_id: jobId,
      is_read: false,
    });

    return newNotif;
  }

  public async markAllRead(userId?: string): Promise<void> {
    this.fallbackNotifs.forEach((n) => (n.isRead = true));

    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
  }
}

export const notificationRepository = new NotificationRepository();
