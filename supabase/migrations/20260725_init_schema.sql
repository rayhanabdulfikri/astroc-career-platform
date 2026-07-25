-- ASTROC Career Platform - Complete Database Schema Migration
-- Database: Supabase PostgreSQL with pgvector extension

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Create Table: users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'job_seeker',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Table: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(50),
  linkedin TEXT,
  github TEXT,
  portfolio_url TEXT,
  bio TEXT,
  career_level VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Table: cvs
CREATE TABLE IF NOT EXISTS cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT,
  raw_text TEXT NOT NULL,
  parsed_json JSONB NOT NULL,
  embedding vector(768),
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Table: cv_analysis
CREATE TABLE IF NOT EXISTS cv_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE,
  ats_score INTEGER CHECK (ats_score BETWEEN 0 AND 100),
  ats_details JSONB NOT NULL,
  hr_score INTEGER CHECK (hr_score BETWEEN 0 AND 100),
  hr_review JSONB NOT NULL,
  overall_career_score INTEGER CHECK (overall_career_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Table: target_positions
CREATE TABLE IF NOT EXISTS target_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  industry VARCHAR(255),
  expected_salary_min NUMERIC,
  expected_salary_max NUMERIC,
  currency VARCHAR(10) DEFAULT 'IDR',
  location VARCHAR(255),
  remote_preference VARCHAR(50),
  experience_level VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Table: jobs_raw
CREATE TABLE IF NOT EXISTS jobs_raw (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  source_url TEXT UNIQUE,
  raw_data JSONB NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Table: jobs_processed
CREATE TABLE IF NOT EXISTS jobs_processed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  raw_job_id UUID REFERENCES jobs_raw(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  salary_range VARCHAR(100),
  employment_type VARCHAR(50),
  experience_level VARCHAR(50),
  summary TEXT,
  responsibilities JSONB,
  requirements JSONB,
  required_skills JSONB,
  source_url TEXT,
  posted_date VARCHAR(50),
  embedding vector(768),
  is_active BOOLEAN DEFAULT true,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create Table: job_matching
CREATE TABLE IF NOT EXISTS job_matching (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs_processed(id) ON DELETE CASCADE,
  overall_match_score INTEGER CHECK (overall_match_score BETWEEN 0 AND 100),
  technical_match INTEGER CHECK (technical_match BETWEEN 0 AND 100),
  soft_skill_match INTEGER CHECK (soft_skill_match BETWEEN 0 AND 100),
  education_match INTEGER CHECK (education_match BETWEEN 0 AND 100),
  experience_match INTEGER CHECK (experience_match BETWEEN 0 AND 100),
  ats_probability INTEGER CHECK (ats_probability BETWEEN 0 AND 100),
  hr_probability INTEGER CHECK (hr_probability BETWEEN 0 AND 100),
  interview_probability INTEGER CHECK (interview_probability BETWEEN 0 AND 100),
  offer_probability INTEGER CHECK (offer_probability BETWEEN 0 AND 100),
  reasoning_detail JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create Table: career_roadmap
CREATE TABLE IF NOT EXISTS career_roadmap (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_position VARCHAR(255),
  roadmap_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Create Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  match_score INTEGER,
  job_id UUID REFERENCES jobs_processed(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Create Table: ai_logs
CREATE TABLE IF NOT EXISTS ai_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_type VARCHAR(100) NOT NULL,
  model_used VARCHAR(100) DEFAULT 'gemini-3.6-flash',
  latency_ms INTEGER,
  prompt_tokens INTEGER DEFAULT 0,
  response_tokens INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'success',
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Create Table: settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notification_email BOOLEAN DEFAULT true,
  min_match_notification_threshold INTEGER DEFAULT 85,
  auto_job_search BOOLEAN DEFAULT true,
  theme_preference VARCHAR(20) DEFAULT 'dark'
);

-- 14. Indexes for Performance Optimization
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_firebase ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_user ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_analysis_cv ON cv_analysis(cv_id);
CREATE INDEX IF NOT EXISTS idx_target_positions_user ON target_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_processed_company ON jobs_processed(company);
CREATE INDEX IF NOT EXISTS idx_job_matching_cv_job ON job_matching(cv_id, job_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_ai_logs_timestamp ON ai_logs(timestamp DESC);

-- Vector Similarity Indexes (HNSW for Cosine Distance)
CREATE INDEX IF NOT EXISTS idx_cvs_embedding ON cvs USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_embedding ON jobs_processed USING hnsw (embedding vector_cosine_ops);
