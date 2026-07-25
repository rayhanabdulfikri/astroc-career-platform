import { getSupabaseClient } from '../config/supabase';
import { AILog } from '../../types';

export class LogRepository {
  private fallbackLogs: AILog[] = [
    {
      id: 'log_01',
      actionType: 'CV_ANALYSIS_PIPELINE',
      modelUsed: 'gemini-3.6-flash',
      latencyMs: 1240,
      status: 'success',
      details: 'CV Rayhan Abdul parsed, evaluated by ATS engine & HR 20+ Yrs Reviewer',
      timestamp: new Date().toISOString(),
    },
  ];

  public async logAIAction(actionType: string, latencyMs: number, status: 'success' | 'error', details: string): Promise<AILog> {
    const newLog: AILog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actionType,
      modelUsed: 'gemini-3.6-flash',
      latencyMs,
      status,
      details,
      timestamp: new Date().toISOString(),
    };

    this.fallbackLogs.unshift(newLog);
    if (this.fallbackLogs.length > 50) this.fallbackLogs.pop();

    const supabase = getSupabaseClient();
    if (!supabase) return newLog;

    await supabase.from('ai_logs').insert({
      action_type: actionType,
      model_used: 'gemini-3.6-flash',
      latency_ms: latencyMs,
      status,
      details: { message: details },
    });

    return newLog;
  }

  public async getLogs(): Promise<AILog[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackLogs;

    const { data } = await supabase.from('ai_logs').select('*').order('timestamp', { ascending: false }).limit(50);
    if (!data || data.length === 0) return this.fallbackLogs;

    return data.map((l) => ({
      id: l.id,
      actionType: l.action_type,
      modelUsed: l.model_used,
      latencyMs: l.latency_ms,
      status: l.status as 'success' | 'error',
      details: l.details?.message || JSON.stringify(l.details),
      timestamp: l.timestamp,
    }));
  }
}

export const logRepository = new LogRepository();
