# ASTROC – REST API Specification

Base Path: `/api`

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | System health check and status |
| `/api/auth/login` | POST | Authenticate user with Firebase token/credentials |
| `/api/auth/register` | POST | Register new user profile |
| `/api/cv/upload` | POST | Upload CV file (PDF/DOCX/TXT) or preset sample |
| `/api/cv/analyze` | POST | Run 3-in-1 AI Pipeline (Parser, ATS Evaluator, HR 20+ Yrs Review) |
| `/api/cv/current` | GET | Get active CV and current AI evaluation results |
| `/api/target-position` | POST/GET | Set or fetch target position parameters |
| `/api/jobs/search` | POST | Run Gemini Flash + Google Search Grounding to find real job listings |
| `/api/jobs` | GET | List processed job database with filters and keyword query |
| `/api/matching/calculate` | POST | Run vector similarity & AI matching between active CV and jobs |
| `/api/matching` | GET | Retrieve match scores, skill gap & offer probabilities |
| `/api/skill-gap` | GET | Analyze acquired vs missing skills with priority roadmap |
| `/api/roadmap` | GET/POST | Fetch or generate custom career learning roadmap |
| `/api/interview/simulate` | POST | Practice simulated interview (HR, Tech, Behavioral, Case Study) |
| `/api/dashboard` | GET | High-level aggregated metrics for career progression |
| `/api/notifications` | GET/POST | List and mark read job match notifications (>85% score) |
| `/api/scheduler/trigger` | POST | Manually run automated job discovery pipeline |
| `/api/logs` | GET | View system and AI execution logs (Google Cloud Logging simulation) |
