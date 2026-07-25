import * as pdfjsLib from 'pdfjs-dist';

// Set up worker for PDF.js using unpkg / cdnjs CDN so Vite doesn't fail on worker resolution
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

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

  // Fallback 1: Extract words with regex matching printable text sequences
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('latin1');
    const rawBytes = decoder.decode(uint8Array);

    // Extract readable English/Indonesian words (>2 chars) from raw bytes
    const words = rawBytes.match(/[a-zA-Z0-9@._\-\/+]{2,}/g) || [];
    // Filter out PDF syntax keywords (stream, endstream, FlateDecode, obj, endobj, xref, etc.)
    const pdfKeywords = new Set([
      'pdf', 'obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref',
      'flatedecode', 'length', 'filter', 'type', 'catalog', 'pages', 'page', 'mediabox',
      'font', 'fontdescriptor', 'encoding', 'winansiencoding', 'subtype', 'type1', 'truetype',
    ]);

    const cleanWords = words.filter(w => !pdfKeywords.has(w.toLowerCase()) && !/^[0-9]+$/.test(w));
    if (cleanWords.length > 15) {
      const text = cleanWords.join(' ');
      console.log('✅ Fallback regex extracted clean words:', text.slice(0, 150) + '...');
      return text;
    }
  } catch {}

  return `CV Dokumen: ${file.name}`;
}
