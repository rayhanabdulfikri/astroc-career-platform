import fs from 'fs';
import path from 'path';
import { extractorService } from './src/server/services/extractor.service';
import { aiService } from './src/server/services/ai.service';

async function testPDF() {
  console.log('🔍 --- DEBUG TEST: PDF Extractor & Gemini AI ---');
  
  const dummyPDFHeader = Buffer.from(
    '%PDF-1.4\n' +
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n' +
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n' +
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj\n' +
    '4 0 obj << /Length 65 >> stream\n' +
    'BT /F1 12 Tf 100 700 Td (Rayhan Developer Software Engineer React Node.js Python) Tj ET\n' +
    'endstream endobj\n' +
    'xref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000210 00000 n\n' +
    'trailer << /Size 5 /Root 1 0 R >>\n' +
    'startxref\n325\n%%EOF'
  );

  try {
    console.log('1. Testing ExtractorService...');
    const extractedText = await extractorService.extractText(dummyPDFHeader, 'application/pdf', 'sample_cv.pdf');
    console.log('✅ Extracted Text Output:\n', extractedText);

    console.log('2. Testing Gemini AI parseCV...');
    const parsed = await aiService.parseCV(extractedText, 'sample_cv.pdf');
    console.log('✅ Parsed CV Output Name:', parsed.name, '| Email:', parsed.email);

    console.log('3. Testing Gemini AI analyzeCVFullPipeline...');
    const analysis = await aiService.analyzeCVFullPipeline(parsed);
    console.log('✅ ATS Score:', analysis.ats.atsScore, '| HR Score:', analysis.hr.hrScore);

    console.log('🎉 ALL DEBUG TESTS PASSED SUCCESSFULLY!');
  } catch (err: any) {
    console.error('❌ DEBUG ERROR FOUND:', err);
  }
}

testPDF();
