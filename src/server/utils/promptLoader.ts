import fs from 'fs';
import path from 'path';

const promptCache: Map<string, string> = new Map();

export function loadPrompt(fileName: string, replacements: Record<string, string> = {}): string {
  let template = promptCache.get(fileName);

  if (!template) {
    const promptPath = path.join(process.cwd(), 'prompts', fileName);
    try {
      if (fs.existsSync(promptPath)) {
        template = fs.readFileSync(promptPath, 'utf-8');
        promptCache.set(fileName, template);
      } else {
        console.warn(`⚠️ Prompt file not found at ${promptPath}, fallback used.`);
        template = '';
      }
    } catch (err: any) {
      console.error(`Error reading prompt file ${fileName}:`, err.message);
      template = '';
    }
  }

  let finalPrompt = template;
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    finalPrompt = finalPrompt.replace(regex, value || '');
  }

  return finalPrompt;
}
