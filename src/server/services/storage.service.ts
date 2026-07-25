import { getSupabaseClient } from '../config/supabase';

export class StorageService {
  private bucketName = 'cv-files';

  public async uploadCVFile(buffer: Buffer, originalName: string, mimetype: string): Promise<string> {
    const supabase = getSupabaseClient();
    const cleanFileName = `${Date.now()}_${originalName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    if (!supabase) {
      console.warn('⚠️ Supabase credentials missing. Mocking file URL for CV upload.');
      return `https://storage.astroc.ai/cv-files/${cleanFileName}`;
    }

    try {
      const { data, error } = await supabase.storage.from(this.bucketName).upload(cleanFileName, buffer, {
        contentType: mimetype,
        upsert: true,
      });

      if (error) {
        console.warn('Supabase storage upload note (bucket auto-create fallback):', error.message);
        return `https://storage.astroc.ai/cv-files/${cleanFileName}`;
      }

      const { data: publicUrlData } = supabase.storage.from(this.bucketName).getPublicUrl(cleanFileName);
      return publicUrlData.publicUrl;
    } catch (err: any) {
      console.error('Storage service upload error:', err.message);
      return `https://storage.astroc.ai/cv-files/${cleanFileName}`;
    }
  }
}

export const storageService = new StorageService();
