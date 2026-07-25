/**
 * ExtractorService — VERCEL SERVERLESS SAFE
 * 
 * mammoth & pdf-parse are NOT imported statically because they use native
 * Node.js binaries that crash Vercel's serverless runtime on cold start.
 * 
 * Since we now extract text CLIENT-SIDE (browser), this service only acts
 * as a fallback for non-PDF text (TXT/plain) and raw buffer passthrough.
 */

export class ExtractorService {
  public async extractText(buffer: Buffer, mimetype: string, originalName: string): Promise<string> {
    const name = originalName.toLowerCase();

    // For plain text files, just decode the buffer
    if (mimetype === 'text/plain' || name.endsWith('.txt')) {
      return buffer.toString('utf-8').trim();
    }

    // For all other types (PDF, DOCX): do best-effort ASCII extraction
    // Real extraction is done CLIENT-SIDE in the browser
    try {
      const text = buffer
        .toString('latin1')
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return text.length > 30 ? text : `Dokumen CV: ${originalName}`;
    } catch {
      return `Dokumen CV: ${originalName}`;
    }
  }
}

export const extractorService = new ExtractorService();
