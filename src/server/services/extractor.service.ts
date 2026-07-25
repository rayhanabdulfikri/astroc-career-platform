import * as pdfParseModule from 'pdf-parse';
import mammoth from 'mammoth';

const pdfParse = (pdfParseModule as any).default || pdfParseModule;

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
      const data = await pdfParse(buffer);
      const extractedText = data.text ? data.text.trim() : '';
      if (extractedText.length > 20) {
        return extractedText;
      }
      return 'PDF Document parsed, but contained sparse text content.';
    } catch (err: any) {
      console.error('PDF text extraction error:', err.message);
      return buffer.toString('utf-8');
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
