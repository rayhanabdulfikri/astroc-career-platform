/**
 * VERCEL SERVERLESS ENTRY POINT
 *
 * This file is bundled by esbuild during `npm run build` into api/index.js
 * (CJS format, all src/server/** dependencies included inline).
 *
 * Vercel runs api/index.js directly — no missing module errors.
 * vercel.json points to api/index.js (the bundled output), not api/index.ts.
 */
import app from '../src/server/app';

export default app;
