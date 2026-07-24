# ASTROC – Database Entity Relationship Diagram (ERD) & Schema Specification

Database: **Supabase PostgreSQL** with `pgvector` extension for semantic vector embeddings.

## Database Extensions
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
```

## Entity Relationship Diagram (Text Schema)

### 1. `users`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `firebase_uid`: VARCHAR(128) UNIQUE NOT NULL
- `full_name`: VARCHAR(255)
- `avatar_url`: TEXT
- `role`: VARCHAR(50) DEFAULT 'job_seeker'
- `created_at`: TIMESTAMPTZ DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ DEFAULT NOW()

### 2. `profiles`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
- `phone`: VARCHAR(50)
- `linkedin`: TEXT
- `github`: TEXT
- `portfolio_url`: TEXT
- `bio`: TEXT
- `career_level`: VARCHAR(50)
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

### 3. `cvs`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
- `file_name`: VARCHAR(255) NOT NULL
- `file_url`: TEXT
- `raw_text`: TEXT NOT NULL
- `parsed_json`: JSONB NOT NULL
- `embedding`: vector(768) -- Generated via Gemini Embedding API
- `is_primary`: BOOLEAN DEFAULT true
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

### 4. `cv_analysis`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `cv_id`: UUID REFERENCES cvs(id) ON DELETE CASCADE
- `ats_score`: INTEGER CHECK (ats_score BETWEEN 0 AND 100)
- `ats_details`: JSONB NOT NULL -- { keywordMatch, grammar, formatting, missingKeywords }
- `hr_score`: INTEGER CHECK (hr_score BETWEEN 0 AND 100)
- `hr_review`: JSONB NOT NULL -- { strengths, weaknesses, professionalism, rewriteSuggestions }
- `overall_career_score`: INTEGER CHECK (overall_career_score BETWEEN 0 AND 100)
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

### 5. `target_positions`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
- `title`: VARCHAR(255) NOT NULL
- `industry`: VARCHAR(255)
- `expected_salary_min`: NUMERIC
- `expected_salary_max`: NUMERIC
- `currency`: VARCHAR(10) DEFAULT 'IDR'
- `location`: VARCHAR(255)
- `remote_preference`: VARCHAR(50) -- 'remote', 'hybrid', 'onsite', 'any'
- `experience_level`: VARCHAR(50)
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

### 6. `jobs_raw`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `title`: VARCHAR(255) NOT NULL
- `company`: VARCHAR(255) NOT NULL
- `source_url`: TEXT UNIQUE
- `raw_data`: JSONB NOT NULL
- `fetched_at`: TIMESTAMPTZ DEFAULT NOW()

### 7. `jobs_processed`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `raw_job_id`: UUID REFERENCES jobs_raw(id) ON DELETE SET NULL
- `title`: VARCHAR(255) NOT NULL
- `company`: VARCHAR(255) NOT NULL
- `location`: VARCHAR(255)
- `salary_range`: VARCHAR(100)
- `employment_type`: VARCHAR(50)
- `experience_level`: VARCHAR(50)
- `summary`: TEXT
- `responsibilities`: JSONB
- `requirements`: JSONB
- `required_skills`: JSONB -- Array of normalized skills
- `source_url`: TEXT
- `posted_date`: VARCHAR(50)
- `embedding`: vector(768)
- `is_active`: BOOLEAN DEFAULT true
- `processed_at`: TIMESTAMPTZ DEFAULT NOW()

### 8. `job_matching`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `cv_id`: UUID REFERENCES cvs(id) ON DELETE CASCADE
- `job_id`: UUID REFERENCES jobs_processed(id) ON DELETE CASCADE
- `overall_match_score`: INTEGER
- `technical_match`: INTEGER
- `soft_skill_match`: INTEGER
- `education_match`: INTEGER
- `experience_match`: INTEGER
- `ats_probability`: INTEGER
- `hr_probability`: INTEGER
- `interview_probability`: INTEGER
- `offer_probability`: INTEGER
- `reasoning_detail`: JSONB
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

### 9. `career_roadmap`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
- `target_position`: VARCHAR(255)
- `roadmap_data`: JSONB NOT NULL -- { learningPath, certifications, projects, milestones }
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

### 10. `notifications`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
- `title`: VARCHAR(255) NOT NULL
- `message`: TEXT NOT NULL
- `match_score`: INTEGER
- `job_id`: UUID REFERENCES jobs_processed(id)
- `is_read`: BOOLEAN DEFAULT false
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

### 11. `ai_logs`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `action_type`: VARCHAR(100) NOT NULL -- 'cv_parse', 'job_finder_grounding', 'match_calculation'
- `model_used`: VARCHAR(100) DEFAULT 'gemini-3.6-flash'
- `latency_ms`: INTEGER
- `prompt_tokens`: INTEGER
- `response_tokens`: INTEGER
- `status`: VARCHAR(20) -- 'success', 'error'
- `details`: JSONB
- `timestamp`: TIMESTAMPTZ DEFAULT NOW()

### 12. `settings`
- `id`: UUID (PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
- `notification_email`: BOOLEAN DEFAULT true
- `min_match_notification_threshold`: INTEGER DEFAULT 85
- `auto_job_search`: BOOLEAN DEFAULT true
- `theme_preference`: VARCHAR(20) DEFAULT 'dark'
