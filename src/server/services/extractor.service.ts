import mammoth from 'mammoth';

// Safe require for pdf-parse compatible with both CJS and ESM build bundles
function getPdfParse(): any {
  try {
    // In Node / esbuild CJS bundle, global require is available
    if (typeof require === 'function') {
      const mod = require('pdf-parse');
      return typeof mod === 'function' ? mod : mod?.default || mod;
    }
  } catch (err: any) {
    console.warn('pdf-parse require note:', err?.message || err);
  }
  return null;
}

export class ExtractorService {
  public async extractText(buffer: Buffer, mimetype: string, originalName: string): Promise<string> {
    const isPDF = mimetype === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf');
    const isDOCX =
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword' ||
      originalName.toLowerCase().endsWith('.docx') ||
      originalName.toLowerCase().endsWith('.doc');

    if (isPDF) {
      return this.extractPDF(buffer);
    } else if (isDOCX) {
      return this.extractDOCX(buffer);
    }

    return buffer.toString('utf-8');
  }

  private async extractPDF(buffer: Buffer): Promise<string> {
    try {
      const parser = getPdfParse();
      if (typeof parser === 'function') {
        const data = await parser(buffer);
        const extractedText = data.text ? data.text.trim() : '';
        if (extractedText.length > 20) {
          return extractedText;
        }
      }
      // Clean string fallback if pdf-parse is unavailable
      const text = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      return text.length > 10 ? text : 'Dokumen PDF terbaca.';
    } catch (err: any) {
      console.error('PDF text extraction error:', err.message);
      const text = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      return text.length > 10 ? text : 'Dokumen PDF terbaca.';
    }
  }

  private async extractDOCX(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const extractedText = result.value ? result.value.trim() : '';
      if (extractedText.length > 20) {
        return extractedText;
      }
      return 'DOCX Document parsed, but contained sparse text content.';
    } catch (err: any) {
      console.error('DOCX text extraction error:', err.message);
      return buffer.toString('utf-8');
    }
  }
}

export const extractorService = new ExtractorService();
