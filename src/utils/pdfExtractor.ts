import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * Extract clean text from any PDF (Canva, Word, Adobe, FlateDecode compressed)
 * directly in the browser using PDF.js.
 */
export async function extractPDFText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .filter((str: string) => str && str.trim().length > 0)
        .join(' ');
      
      if (pageText.trim().length > 0) {
        fullText += pageText + '\n';
      }
    }

    const cleanedText = fullText
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanedText.length > 20) {
      console.log('✅ PDF.js extracted text successfully:', cleanedText.slice(0, 150) + '...');
      return cleanedText;
    }
  } catch (err: any) {
    console.warn('⚠️ PDF.js extraction note (trying fallback):', err?.message || err);
  }

  // Fallback 2: Extract text between parentheses in PDF streams (BT...ET blocks)
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('latin1');
    const rawBytes = decoder.decode(uint8Array);

    const parts: string[] = [];
    const btEt = /BT\s+([\s\S]*?)\s+ET/g;
    let m;
    while ((m = btEt.exec(rawBytes)) !== null) {
      const strMatch = /\(([^)]*)\)/g;
      let sm;
      while ((sm = strMatch.exec(m[1])) !== null) {
        const t = sm[1].replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\\\/g, '\\');
        if (t.trim().length > 1) parts.push(t);
      }
    }

    if (parts.length > 0) {
      const text = parts.join(' ').replace(/\s+/g, ' ').trim();
      console.log('✅ Stream regex extracted text:', text.slice(0, 150) + '...');
      return text;
    }
  } catch {}

  return `CV Dokumen: ${file.name}`;
}
