import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

/**
 * Swagger setup — VERCEL SAFE
 *
 * swaggerJsdoc's `apis` glob scanning crashes on Vercel Serverless
 * because the filesystem is not available at runtime.
 *
 * Solution: define the spec manually (no glob) and wrap in try-catch.
 */
export function setupSwagger(app: Express) {
  try {
    const swaggerSpec = {
      openapi: '3.0.0',
      info: {
        title: 'ASTROC AI Career Intelligence Platform API',
        version: '2.5.0-production',
        description:
          'Production OpenAPI 3.0 Documentation for ASTROC Backend Services (CV Analyzer, Job Finder, pgvector Semantic Matching, Career Roadmap, and Health Monitoring).',
        contact: {
          name: 'ASTROC AI Engineering Team',
          url: 'https://astroc-career-platform.vercel.app',
        },
      },
      servers: [
        {
          url: 'https://astroc-career-platform.vercel.app',
          description: 'Production Serverless Environment (Vercel)',
        },
        {
          url: 'http://localhost:3000',
          description: 'Local Development Server',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Firebase Authentication JWT ID Token',
          },
        },
      },
      paths: {
        '/api/health': {
          get: { summary: 'Health Check', responses: { '200': { description: 'OK' } } },
        },
        '/api/cv/upload': {
          post: {
            summary: 'Upload and analyze CV',
            security: [{ BearerAuth: [] }],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      rawText: { type: 'string' },
                      fileName: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: { '200': { description: 'CV analyzed successfully' } },
          },
        },
        '/api/jobs': {
          get: { summary: 'Get job listings', responses: { '200': { description: 'OK' } } },
        },
        '/api/dashboard/overview': {
          get: { summary: 'Dashboard overview data', responses: { '200': { description: 'OK' } } },
        },
      },
    };

    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api/docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(swaggerSpec);
    });
    console.log('📚 Swagger UI available at /api/docs');
  } catch (err: any) {
    console.warn('⚠️ Swagger setup skipped (non-fatal):', err?.message);
  }
}
