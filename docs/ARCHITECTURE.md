# ASTROC – Architecture Specification & Clean Architecture Design

## Overview
ASTROC (AI Career Intelligence Platform) is designed following **Clean Architecture** principles, **SOLID design patterns**, and the **Repository Pattern**. It decouples business domain logic from framework drivers, external services (Gemini AI, Supabase, Firebase Auth), and transport layers.

```
       +-------------------------------------------------------+
       |                  Presentation Layer                   |
       |  React 19 / Vite / Tailwind CSS / Lucide / Motion     |
       +-------------------------------------------------------+
                                   |
                                   v
       +-------------------------------------------------------+
       |                   Application Layer                   |
       |  REST Controller Routes, Auth Guards, Validation      |
       +-------------------------------------------------------+
                                   |
                                   v
       +-------------------------------------------------------+
       |                     Domain Layer                      |
       |  Use Cases: CV Parsing, ATS Scoring, HR Review,       |
       |  Job Finding, Vector Matching, Roadmap Generator      |
       +-------------------------------------------------------+
                                   |
                                   v
       +-------------------------------------------------------+
       |                  Infrastructure Layer                 |
       |  Gemini AI Client, Search Grounding, Supabase DB,     |
       |  Firebase Auth, Cloud Logging, Cron Scheduler         |
       +-------------------------------------------------------+
```

## Layers
1. **Domain Layer**: Contains entities, interfaces, value objects, and pure business calculations (e.g. ATS Score algorithm, Match Probability weighting, Skill Gap extraction).
2. **Application Layer**: Orchestrates domain workflows, manages request validation (Zod/Pydantic schemas), and handles application security.
3. **Infrastructure Layer**: Implements repository interfaces for database access (Supabase PostgreSQL / pgvector), external integrations (Google GenAI SDK with Search Grounding), and auth services.
4. **Presentation Layer**: Responsive, accessible React single-page dashboard with dark/light mode, real-time stats, interactive charts, and glassmorphism visual language.

## Key Design Patterns Applied
- **Repository Pattern**: Abstract data layer for `CVRepository`, `JobRepository`, `MatchRepository`, and `RoadmapRepository`.
- **Strategy Pattern**: Flexible AI evaluators (`ATSEvaluatorStrategy`, `HR20YrManagerStrategy`).
- **Observer / Scheduler Pattern**: Background cron task triggering job search grounding and matching notifications.
- **Dependency Injection**: Services receive DB and AI providers via constructor / initialization injection.
