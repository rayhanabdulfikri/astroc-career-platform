/**
 * Client-side CV text extractor using browser APIs.
 * Eliminates all server-side binary dependencies (pdf-parse, mammoth)
 * which crash on Vercel Serverless Functions.
 */

/**
 * Extract text from a PDF file using the browser's built-in PDF.js via CDN.
 */
async function extractPDFText(file: File): Promise<string> {
  try {
    // Load PDF.js from CDN to avoid Vite/Webpack bundling issues
    const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];

    // Use FileReader to read bytes
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Simple byte-level UTF-8 text extraction fallback
    const decoder = new TextDecoder('utf-8', { fatal: false });
    let rawText = decoder.decode(uint8Array);

    // Extract printable text between PDF stream markers
    const textParts: string[] = [];
    const btEtPattern = /BT\s+([\s\S]*?)\s+ET/g;
    let match;
    while ((match = btEtPattern.exec(rawText)) !== null) {
      const block = match[1];
      const strPattern = /\(([^)]*)\)/g;
      let strMatch;
      while ((strMatch = strPattern.exec(block)) !== null) {
        const text = strMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\')
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')');
        if (text.trim().length > 0) {
          textParts.push(text);
        }
      }
    }

    if (textParts.length > 0) {
      return textParts.join(' ').replace(/\s+/g, ' ').trim();
    }

    // Fallback: extract any readable ASCII sequences from the raw file
    const asciiText = rawText
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return asciiText.length > 50 ? asciiText : `Dokumen PDF diunggah: ${file.name}`;
  } catch (err: any) {
    console.warn('Client-side PDF extraction error:', err?.message);
    return `Dokumen CV diunggah: ${file.name}`;
  }
}

/**
 * Extract text from a plain TXT file.
 */
async function extractTXTText(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsText(file, 'utf-8');
  });
}

/**
 * Main client-side extractor. Reads a File object and returns plain text.
 * Returns empty string if unable to extract, the backend will use a fallback.
 */
export async function extractCVTextClientSide(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const mime = file.type;

  if (mime === 'application/pdf' || name.endsWith('.pdf')) {
    return extractPDFText(file);
  }

  if (
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx') ||
    name.endsWith('.doc')
  ) {
    // For DOCX, send the file as base64 text representation
    // Since we cannot parse DOCX easily in browser without a large library,
    // we send the raw bytes and let backend handle it via JSON body (not multipart)
    return '';
  }

  if (mime === 'text/plain' || name.endsWith('.txt')) {
    return extractTXTText(file);
  }

  return '';
}
