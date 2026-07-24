# ASTROC – Production Deployment Configuration

## Architecture Overview
- **Frontend**: Firebase Hosting / Vercel
- **Backend**: Google Cloud Run (Containerized Node.js / FastAPI)
- **Database**: Supabase PostgreSQL with `pgvector`
- **Storage**: Supabase Storage
- **Authentication**: Firebase Authentication
- **AI Model**: Google Gemini Flash 3.5 Lite (`gemini-3.6-flash`)
- **Search Engine**: Google Search Grounding (`googleSearch` tool)
- **Monitoring**: Google Cloud Logging
- **CI/CD**: GitHub Actions

## Dockerfile for Google Cloud Run (Backend)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

## GitHub Actions CI/CD Pipeline (`.github/workflows/deploy.yml`)
```yaml
name: ASTROC Build & Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install Dependencies
        run: npm ci

      - name: Lint and Type Check
        run: npm run lint

      - name: Build Application
        run: npm run build
```
