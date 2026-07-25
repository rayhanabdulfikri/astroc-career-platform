<div align="center">

# 🚀 ASTROC – AI Career Intelligence Platform

**Empowering Job Seekers & Tech Professionals with Next-Gen Gemini 3.6 AI, ATS Scoring, Search Grounding, and Strategic Roadmaps.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express-4.21-000000?logo=express)](https://expressjs.com/)
[![Gemini 3.6 Flash](https://img.shields.io/badge/AI-Google_Gemini_3.6_Flash-8E75FF?logo=google-gemini)](https://deepmind.google/technologies/gemini/)

</div>

---

## 📌 Executive Overview

**ASTROC** is a full-stack AI career intelligence platform designed to bridge the gap between job seekers and high-paying tech careers. By integrating **Google Gemini 3.6 Flash** with real-time **Google Search Grounding**, ASTROC automates CV parsing, ATS/HR evaluation, job matching, skill gap discovery, career roadmapping, and interview simulation.

---

## ✨ Key Features

- **📄 3-in-1 AI CV Engine**: Automatically parses raw text/CVs, evaluates Applicant Tracking System (ATS) keyword compatibility, and runs a 20+ year senior HR manager evaluation with rewrite suggestions.
- **🔍 Real-Time Job Discovery**: Utilizes **Google Search Grounding** to fetch live tech job postings across top career portals in Indonesia and globally.
- **🎯 Career Matching Engine**: Computes multi-factor match scores (technical, soft skills, experience, ATS probability, offer probability) against your target job position.
- **📊 AI Skill Gap Analysis**: Identifies missing hard and domain skills with estimated learning hours and curated course recommendations.
- **🗺️ Strategic Career Roadmap**: Generates structured 6-month phased career transformation plans to reach target titles and salary expectations.
- **🎙️ Executive Interview Coach**: Generates category-based interview questions (HR, Technical, Behavioral, Case Study) and provides instant AI evaluation on user answers.
- **⏰ Automated Background Scheduler**: Cron-based job search runner that indexes new listings and dispatches high-match notifications.

---

## 🏗️ Architecture & Folder Structure

ASTROC follows a **Clean, Layered Architecture** with strict separation of concerns, standardized response wrappers, centralized error handling, rate limiting, and request validation:

```
astroc-career-platform/
├── docs/                     # Specifications (Architecture, ERD, API, Deployment)
├── src/
│   ├── components/           # React 19 Frontend Components
│   │   ├── auth/             # Authentication Modals
│   │   ├── common/           # Navbar, Footer, Toast, GlassCard, Badges
│   │   ├── dashboard/        # Feature Views (CV Analyzer, Job Finder, Skill Gap, etc.)
│   │   └── landing/          # Hero, Features, FAQ, How It Works
│   ├── server/               # Modular Express Backend Architecture
│   │   ├── controllers/      # Request handlers & HTTP response mapping
│   │   ├── middleware/       # Error handling, Logging, Rate Limiting, Validation
│   │   ├── repositories/     # Data Access Layer & Vector Similarity Engine
│   │   ├── routes/           # Modular Express Routers & Route Aliases
│   │   ├── services/         # Gemini 3.6 AI Service & Background Scheduler
│   │   └── utils/            # Standardized API response formatters
│   ├── types/                # Shared TypeScript Interface Definitions
│   └── App.tsx               # Main Dashboard Component
├── server.ts                 # Express Server Entry Point with Helmet, CORS & Vite
├── vite.config.ts            # Vite Configuration
└── package.json
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 SPA with Vite 6
- **Styling**: Tailwind CSS v4, Lucide Icons, Framer Motion
- **Design Language**: Modern Dark Mode & Glassmorphic Design

### Backend & Middleware
- **Runtime**: Node.js ESM via `tsx`
- **Framework**: Express.js
- **Security & Reliability**: `helmet`, `cors`, `express-rate-limit`
- **AI Integration**: `@google/genai` v2.4 (Gemini 3.6 Flash & Search Grounding)

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### Step 1: Clone Repository
```bash
git clone https://github.com/rayhanabdulfikri/astroc-career-platform.git
cd astroc-career-platform
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the project root:
```env
GEMINI_API_KEY="your_google_gemini_api_key_here"
PORT=3000
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Recommended Free Hosting & Deployment Stack

For deploying this project at zero cost for portfolio, MVP, or testing:

| Layer | Recommended Free Tier | Features |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** / **Netlify** | Unlimited bandwidth, instant CDN, free custom domains & SSL. |
| **Backend** | **Render** / **Koyeb** | Free Node.js web services with 512MB RAM & automatic HTTPS. |
| **Database** | **Supabase** / **Neon** | 500MB free PostgreSQL with `pgvector` extension for AI vector search. |
| **Storage** | **Supabase Storage** | 1GB free object storage for binary CV PDF uploads. |
| **Auth** | **Firebase Auth** | 50,000 monthly active users (MAU) completely free. |

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <sub>Built with ❤️ for tech talent and career builders. Created by <strong>Rayhan Abdul Fikri</strong>.</sub>
</div>
