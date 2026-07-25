import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ASTROC AI Career Intelligence Platform API',
      version: '2.5.0-production',
      description: 'Production OpenAPI 3.0 Documentation for ASTROC Backend Services (CV Analyzer, Search Grounding Job Finder, pgvector Semantic Matching, Career Roadmap, and Health Monitoring).',
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
  },
  apis: ['./src/server/routes/*.ts', './api/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  console.log('📚 Swagger OpenAPI UI documentation available at /api/docs');
}
