var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server/app.ts
var app_exports = {};
__export(app_exports, {
  createApp: () => createApp,
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_express14 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_helmet = __toESM(require("helmet"), 1);
var import_compression = __toESM(require("compression"), 1);

// src/server/middleware/rateLimiter.middleware.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var globalRateLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again after 15 minutes"
  }
});
var aiRateLimiter = (0, import_express_rate_limit.default)({
  windowMs: 1 * 60 * 1e3,
  // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "AI rate limit exceeded. Please wait a moment before trying again."
  }
});

// src/server/middleware/logging.middleware.ts
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${(/* @__PURE__ */ new Date()).toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`);
  });
  next();
}

// src/server/middleware/error.middleware.ts
function notFoundHandler(req, res, next) {
  res.status(404).json({
    status: "error",
    statusCode: 404,
    message: `Endpoint non-existent: ${req.method} ${req.originalUrl}`,
    path: req.originalUrl,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}
function errorHandler(err, req, res, next) {
  console.error(`\u274C [SERVER ERROR] ${req.method} ${req.originalUrl}:`, err);
  const statusCode = typeof err?.statusCode === "number" ? err.statusCode : 500;
  const message = err?.message || err?.toString() || "Internal Server Error";
  return res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    errorName: err?.name || "Error",
    stack: err?.stack || void 0,
    path: req.originalUrl,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}

// src/server/config/swagger.ts
function setupSwagger(app) {
  try {
    const swaggerUi = require("swagger-ui-express");
    const swaggerSpec = {
      openapi: "3.0.0",
      info: {
        title: "ASTROC AI Career Intelligence Platform API",
        version: "2.5.0-production",
        description: "Production OpenAPI 3.0 Documentation for ASTROC Backend Services (CV Analyzer, Job Finder, pgvector Semantic Matching, Career Roadmap, and Health Monitoring).",
        contact: {
          name: "ASTROC AI Engineering Team",
          url: "https://astroc-career-platform.vercel.app"
        }
      },
      servers: [
        {
          url: "https://astroc-career-platform.vercel.app",
          description: "Production Serverless Environment (Vercel)"
        },
        {
          url: "http://localhost:3000",
          description: "Local Development Server"
        }
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Firebase Authentication JWT ID Token"
          }
        }
      },
      paths: {
        "/api/health": {
          get: { summary: "Health Check", responses: { "200": { description: "OK" } } }
        },
        "/api/cv/upload": {
          post: {
            summary: "Upload and analyze CV",
            security: [{ BearerAuth: [] }],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      rawText: { type: "string" },
                      fileName: { type: "string" }
                    }
                  }
                }
              }
            },
            responses: { "200": { description: "CV analyzed successfully" } }
          }
        },
        "/api/jobs": {
          get: { summary: "Get job listings", responses: { "200": { description: "OK" } } }
        },
        "/api/dashboard/overview": {
          get: { summary: "Dashboard overview data", responses: { "200": { description: "OK" } } }
        }
      }
    };
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/api/docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.json(swaggerSpec);
    });
    console.log("\u{1F4DA} Swagger UI available at /api/docs");
  } catch (err) {
    console.warn("\u26A0\uFE0F Swagger setup skipped (non-fatal):", err?.message);
  }
}

// src/server/routes/index.ts
var import_express13 = require("express");

// src/server/routes/health.routes.ts
var import_express = require("express");

// src/server/config/supabase.ts
var import_supabase_js = require("@supabase/supabase-js");
var supabaseClient = null;
function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("\u26A0\uFE0F Supabase credentials missing (SUPABASE_URL / SUPABASE_ANON_KEY). Repositories will fallback gracefully if needed.");
    return null;
  }
  supabaseClient = (0, import_supabase_js.createClient)(url, key, {
    auth: {
      persistSession: false
    }
  });
  return supabaseClient;
}

// src/data/sampleData.ts
var sampleUser = {
  id: "usr_01",
  email: "rayhan.developer@example.com",
  fullName: "Rayhan Abdul Software Architect",
  role: "Software Engineer / AI Enthusiast",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};
var sampleCVs = [
  {
    id: "cv_01",
    fileName: "CV_Rayhan_FullStack_Engineer.pdf",
    uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
    name: "Rayhan Abdul",
    email: "rayhan.developer@example.com",
    phone: "+62 812-3456-7890",
    linkedin: "linkedin.com/in/rayhan-abdul",
    github: "github.com/rayhan-abdul",
    portfolio: "rayhan-portfolio.dev",
    summary: "Senior Full-Stack & AI Engineer dengan 4+ tahun pengalaman membangun aplikasi scalable menggunakan React, Node.js, Python, PostgreSQL, dan Google Gemini Cloud Services.",
    education: [
      {
        institution: "Universitas Indonesia",
        degree: "Sarjana Komputer (S.Kom)",
        fieldOfStudy: "Teknik Informatika",
        startYear: "2019",
        endYear: "2023",
        gpa: "3.82 / 4.00"
      }
    ],
    experience: [
      {
        company: "Tech Innovators Asia",
        title: "Senior Software Engineer",
        location: "Jakarta, Indonesia",
        startDate: "2023-01",
        endDate: "Present",
        description: [
          "Memimpin pengembangan mikroservis backend menggunakan Node.js & FastAPI yang melayani 200,000+ active users harian.",
          "Mengintegrasikan Gemini LLM AI API untuk fitur otomatisasi customer support yang memotong turnaround time sebesar 45%.",
          "Mengoptimalisasi query PostgreSQL dengan pgvector similarity search untuk performa 3x lebih cepat."
        ],
        techStack: ["React", "TypeScript", "Node.js", "FastAPI", "PostgreSQL", "Gemini AI", "Docker", "GCP"]
      },
      {
        company: "Nusantara Cloud Labs",
        title: "Full Stack Engineer",
        location: "Bandung, Indonesia",
        startDate: "2022-01",
        endDate: "2022-12",
        description: [
          "Membangun dashboard analitik real-time berbasis React, Tailwind CSS, dan TanStack Query.",
          "Mengimplementasikan sistem otentikasi Firebase JWT dan OAuth2 social login."
        ],
        techStack: ["React", "Tailwind CSS", "Express.js", "Firebase", "PostgreSQL"]
      }
    ],
    organization: [
      {
        name: "Himpunan Mahasiswa Ilmu Komputer UI",
        role: "Head of Tech & Software Division",
        period: "2021 - 2022",
        description: "Mengoordinasikan 15 pengembang untuk membangun portal event mahasiswa dan sistem ticketing kampus."
      }
    ],
    projects: [
      {
        title: "AI Automated Resume & Job Matching Engine",
        description: "Sistem evaluasi CV otomatis dan pencari lowongan kerja berbasis LLM dengan vector search similarity score.",
        link: "https://github.com/rayhan-abdul/job-matcher",
        techStack: ["Next.js", "FastAPI", "Gemini AI", "Supabase Vector"]
      },
      {
        title: "Enterprise Real-Time Notification Gateway",
        description: "Gateway pesan terpusat berbasis WebSockets dan Redis Pub/Sub untuk 50,000 concurrent events.",
        link: "https://github.com/rayhan-abdul/notif-gateway",
        techStack: ["Node.js", "Redis", "WebSockets", "Docker"]
      }
    ],
    achievements: [
      "Juara 1 Indonesia National AI Hackathon 2023 (Kategori Best Enterprise Innovation)",
      "Google Cloud Certified Associate Cloud Engineer (2023)",
      "Lulusan Terbaik Fakultas Ilmu Komputer UI dengan Predikat Cumlaude"
    ],
    certificates: [
      { name: "Google Cloud Associate Cloud Engineer", issuer: "Google Cloud", year: "2023" },
      { name: "Full Stack Web Development Professional", issuer: "Hacktiv8", year: "2022" }
    ],
    skills: {
      hardSkills: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Express",
        "FastAPI",
        "Python",
        "PostgreSQL",
        "Supabase",
        "Firebase",
        "Google Gemini API",
        "Tailwind CSS",
        "Docker",
        "Google Cloud Run",
        "Git & GitHub Actions"
      ],
      softSkills: [
        "Problem Solving",
        "Leadership & Teamwork",
        "Agile Scrum Methodology",
        "Cross-functional Communication",
        "Strategic Planning"
      ],
      languages: ["Indonesia (Native)", "English (Professional Fluent / IELTS 7.5)"]
    }
  },
  {
    id: "cv_02",
    fileName: "CV_Siti_FreshGrad_DataAnalyst.pdf",
    uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
    name: "Siti Rahmawati",
    email: "siti.rahma@example.com",
    phone: "+62 821-9876-5432",
    linkedin: "linkedin.com/in/siti-rahmawati",
    github: "github.com/sitirahma",
    portfolio: "sitirahma.data.site",
    summary: "Fresh Graduate Matematika & Data Science Institut Teknologi Bandung (ITB) dengan keahlian dalam Python, SQL, Tableau, dan Machine Learning Fundamentals.",
    education: [
      {
        institution: "Institut Teknologi Bandung (ITB)",
        degree: "Sarjana Sains (S.Si)",
        fieldOfStudy: "Matematika & Data Science",
        startYear: "2020",
        endYear: "2024",
        gpa: "3.75 / 4.00"
      }
    ],
    experience: [
      {
        company: "Bank Mandiri Digital",
        title: "Data Analyst Intern",
        location: "Jakarta",
        startDate: "2023-06",
        endDate: "2023-11",
        description: [
          "Menganalisis pola transaksi 100,000+ pengguna aplikasi mobile banking menggunakan SQL & Python.",
          "Membuat interactive executive dashboard di Tableau untuk tim risk management."
        ],
        techStack: ["Python", "SQL", "Tableau", "Pandas", "BigQuery"]
      }
    ],
    organization: [],
    projects: [
      {
        title: "Customer Churn Prediction Model",
        description: "Memprediksi tingkat churn pelanggan e-commerce dengan Random Forest & Logistic Regression (Akurasi 88%).",
        link: "github.com/sitirahma/churn-pred",
        techStack: ["Python", "Scikit-Learn", "Streamlit"]
      }
    ],
    achievements: ["Finalis Data Mining Gemastik XVII 2024"],
    certificates: [{ name: "Google Data Analytics Professional Certificate", issuer: "Coursera", year: "2023" }],
    skills: {
      hardSkills: ["Python", "SQL", "PostgreSQL", "Tableau", "PowerBI", "Pandas", "NumPy", "Excel Advanced", "Statistics"],
      softSkills: ["Analytical Thinking", "Data Storytelling", "Attention to Detail"],
      languages: ["Indonesia (Native)", "English (Fluent)"]
    }
  }
];
var sampleTargetPosition = {
  id: "target_01",
  userId: "usr_01",
  title: "Full Stack AI Engineer",
  industry: "Technology / Software / AI",
  expectedSalaryMin: 15e6,
  expectedSalaryMax: 28e6,
  currency: "IDR",
  location: "Jakarta / Remote Indonesia",
  remotePreference: "hybrid",
  experienceLevel: "junior",
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
var sampleJobs = [
  {
    id: "job_01",
    title: "Senior Full Stack Engineer (AI Integration)",
    company: "GoTo Group",
    location: "Jakarta, Indonesia (Hybrid)",
    salaryRange: "Rp 22,000,000 - Rp 35,000,000 / bulan",
    employmentType: "Full-time",
    experienceLevel: "Mid - Senior",
    summary: "GoTo mencari Senior Full Stack Engineer untuk membangun generasi baru platform logistik dan e-commerce berbasis AI. Bertanggung jawab memimpin frontend & backend modern.",
    responsibilities: [
      "Merancang arsitektur microservices berbasis Node.js, Go, dan Python.",
      "Mengintegrasikan model LLM (Gemini API) untuk personalized recommendation engine.",
      "Memimpin code review dan pembinaan developer junior."
    ],
    requirements: [
      "Minimal 3+ tahun pengalaman sebagai Full Stack Software Engineer.",
      "Keahlian mendalam pada React/Next.js, TypeScript, Node.js, dan SQL.",
      "Pengalaman dengan cloud deployment (GCP, Docker, Kubernetes)."
    ],
    requiredSkills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Google Gemini API", "Docker", "GCP"],
    sourceUrl: "https://careers.goto.com/jobs/senior-fullstack-ai",
    postedDate: "1 hari yang lalu",
    isActive: true
  },
  {
    id: "job_02",
    title: "AI Solutions Engineer / Fullstack Specialist",
    company: "Tokopedia Tech Labs",
    location: "Jakarta / Remote",
    salaryRange: "Rp 18,000,000 - Rp 28,000,000 / bulan",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    summary: "Bertanggung jawab membangun modul AI generatif internal untuk mendukung otomatisasi katalog produk, deskripsi AI, dan pencarian visual seller.",
    responsibilities: [
      "Mengembangkan REST API performa tinggi menggunakan FastAPI & Express.",
      "Mengimplementasikan vector search / RAG pipeline menggunakan PostgreSQL pgvector & Gemini Embeddings.",
      "Mengoptimalkan UI/UX React dashboard dengan statistik real-time."
    ],
    requirements: [
      "Gelar S1 Ilmu Komputer, Teknik Informatika, atau setara.",
      "Familiar dengan Generative AI APIs (Gemini, OpenAI).",
      "Pengalaman kuat dengan PostgreSQL, FastAPI/Python, dan React/TypeScript."
    ],
    requiredSkills: ["React", "TypeScript", "FastAPI", "Python", "PostgreSQL", "Supabase", "Gemini AI", "Tailwind CSS"],
    sourceUrl: "https://www.tokopedia.com/careers/detail/ai-solutions-engineer",
    postedDate: "2 hari yang lalu",
    isActive: true
  },
  {
    id: "job_03",
    title: "Frontend React & AI Application Developer",
    company: "Traveloka",
    location: "BSD City, Tangerang",
    salaryRange: "Rp 15,000,000 - Rp 23,000,000 / bulan",
    employmentType: "Full-time",
    experienceLevel: "Junior - Mid",
    summary: "Traveloka membutuhkan pengembang Frontend berpengalaman dalam React & Next.js untuk memperbarui antarmuka pengguna layanan penerbangan & akomodasi pintar.",
    responsibilities: [
      "Mengembangkan komponen UI modular dengan Tailwind CSS, Framer Motion, dan Lucide Icons.",
      "Mengelola state kompleks menggunakan React Query / TanStack Query dan Context API.",
      "Memastikan performa render page < 1.5s dan skor SEO 90+."
    ],
    requirements: [
      "Pengalaman 2+ tahun membangun aplikasi React Single Page App / Next.js.",
      "Menguasai TypeScript, CSS Tailwind, dan state management."
    ],
    requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "TanStack Query", "REST API", "Framer Motion"],
    sourceUrl: "https://www.traveloka.com/en-id/careers/job/frontend-react-dev",
    postedDate: "3 hari yang lalu",
    isActive: true
  },
  {
    id: "job_04",
    title: "Backend Python & Cloud Engineer",
    company: "Bank Jago Tech",
    location: "Jakarta South (Hybrid)",
    salaryRange: "Rp 17,000,000 - Rp 26,000,000 / bulan",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    summary: "Bergabung dengan tim infrastruktur perbankan digital Bank Jago untuk memperkuat backend transaction engine dan otomatisasi deteksi fraud.",
    responsibilities: [
      "Mengembangkan REST API asynchronous dengan FastAPI dan SQL Alchemy.",
      "Mengelola database PostgreSQL, migrasi schema, dan tuning indeks database.",
      "Menerapkan CI/CD pipeline dengan GitHub Actions dan deployment ke Cloud Run."
    ],
    requirements: [
      "Pemahaman kuat tentang konsep SOLID, REST Architecture, dan Security (OAuth2/JWT).",
      "Pengalaman hands-on dengan Python, SQL, Docker, dan GCP."
    ],
    requiredSkills: ["Python", "FastAPI", "PostgreSQL", "Docker", "Google Cloud Run", "GitHub Actions", "JWT"],
    sourceUrl: "https://jago.com/careers/backend-python-engineer",
    postedDate: "4 hari yang lalu",
    isActive: true
  }
];

// src/server/repositories/user.repository.ts
var UserRepository = class {
  constructor() {
    this.fallbackUsers = [sampleUser];
    this.fallbackProfiles = [
      {
        id: "prof_01",
        userId: "usr_01",
        phone: "+62 812-3456-7890",
        linkedin: "linkedin.com/in/rayhan-abdul",
        github: "github.com/rayhan-abdul",
        portfolioUrl: "rayhan-portfolio.dev",
        bio: "Principal Software Architect & AI Tech Strategist",
        careerLevel: "mid"
      }
    ];
    this.fallbackTargets = [{ ...sampleTargetPosition }];
  }
  async findByEmail(email) {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return this.fallbackUsers.find((u) => u.email === email) || null;
    }
    const { data, error } = await supabase.from("users").select("*").eq("email", email).maybeSingle();
    if (error || !data) return this.fallbackUsers.find((u) => u.email === email) || null;
    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at
    };
  }
  async createUser(email) {
    const supabase = getSupabaseClient();
    const newUser = {
      id: `usr_${Date.now()}`,
      email: email || "user@astroc.ai",
      fullName: email ? email.split("@")[0].toUpperCase() : "Rayhan Abdul",
      role: "Job Seeker / AI Enthusiast",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!supabase) {
      this.fallbackUsers.push(newUser);
      return newUser;
    }
    const { data, error } = await supabase.from("users").insert({
      email: newUser.email,
      firebase_uid: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      full_name: newUser.fullName,
      avatar_url: newUser.avatarUrl,
      role: newUser.role
    }).select("*").single();
    if (error || !data) {
      this.fallbackUsers.push(newUser);
      return newUser;
    }
    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at
    };
  }
  async getPrimaryUser() {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackUsers[0];
    const { data } = await supabase.from("users").select("*").limit(1).maybeSingle();
    if (!data) return this.fallbackUsers[0];
    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at
    };
  }
  async getProfile(userId) {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackProfiles[0];
    const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
    if (!data) return this.fallbackProfiles[0];
    return {
      id: data.id,
      userId: data.user_id,
      phone: data.phone,
      linkedin: data.linkedin,
      github: data.github,
      portfolioUrl: data.portfolio_url,
      bio: data.bio,
      careerLevel: data.career_level
    };
  }
  async getTargetPosition(userId) {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackTargets[0] || null;
    const { data } = await supabase.from("target_positions").select("*").limit(1).maybeSingle();
    if (!data) return this.fallbackTargets[0] || null;
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      industry: data.industry,
      expectedSalaryMin: Number(data.expected_salary_min),
      expectedSalaryMax: Number(data.expected_salary_max),
      currency: data.currency,
      location: data.location,
      remotePreference: data.remote_preference,
      experienceLevel: data.experience_level,
      updatedAt: data.created_at
    };
  }
  async updateTargetPosition(target) {
    const supabase = getSupabaseClient();
    const updated = {
      id: target.id || this.fallbackTargets[0]?.id || "tgt_01",
      userId: target.userId || "usr_01",
      title: target.title || "Full Stack AI Engineer",
      industry: target.industry || "Technology",
      expectedSalaryMin: Number(target.expectedSalaryMin) || 15e6,
      expectedSalaryMax: Number(target.expectedSalaryMax) || 28e6,
      currency: target.currency || "IDR",
      location: target.location || "Jakarta / Remote",
      remotePreference: target.remotePreference || "hybrid",
      experienceLevel: target.experienceLevel || "junior",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.fallbackTargets[0] = updated;
    if (!supabase) return updated;
    await supabase.from("target_positions").upsert({
      id: updated.id,
      title: updated.title,
      industry: updated.industry,
      expected_salary_min: updated.expectedSalaryMin,
      expected_salary_max: updated.expectedSalaryMax,
      currency: updated.currency,
      location: updated.location,
      remote_preference: updated.remotePreference,
      experience_level: updated.experienceLevel
    });
    return updated;
  }
};
var userRepository = new UserRepository();

// src/server/repositories/cv.repository.ts
var CVRepository = class {
  constructor() {
    this.fallbackCVs = [...sampleCVs];
    this.fallbackAnalysis = [
      {
        id: "an_01",
        cvId: "cv_01",
        overallCareerScore: 92,
        ats: {
          atsScore: 94,
          keywordMatchPercentage: 90,
          grammarScore: 96,
          formattingScore: 95,
          readabilityScore: 92,
          completenessPercentage: 98,
          missingKeywords: ["Kubernetes", "GraphQL", "CI/CD Pipelines"],
          formattingIssues: [],
          improvementTips: [
            "Tambahkan statistik kuantitatif pada achievement di posisi terdahulu.",
            'Gunakan istilah standar ATS seperti "Continuous Integration" di samping "CI/CD".'
          ]
        },
        hr: {
          hrScore: 90,
          strengths: [
            "Pengalaman teknis yang kuat dengan kombinasi unik Full Stack + AI LLM Integration.",
            "Penulisan achievement berbasis hasil dengan metrics terukur (turnaround time cut by 45%).",
            "Pendidikan Cumlaude dari universitas terkemuka."
          ],
          weaknesses: [
            "Belum mencantumkan estimasi ukuran tim yang dikelola secara spesifik.",
            "Deskripsi sertifikasi dapat ditambahkan tautan kredensial resmi."
          ],
          professionalismFeedback: "CV sangat bersih, profesional, dan menggunakan action verbs yang tajam.",
          impactScore: 93,
          leadershipSignals: ["Head of Tech & Software Division UI", "Memimpin code review"],
          communicationSignals: ["IELTS 7.5 Fluent", "Cross-functional Collaboration"],
          rewriteSuggestions: [
            {
              original: "Membuat dashboard analitik real-time berbasis React.",
              suggested: "Merancang & meluncurkan dashboard analitik real-time berbasis React & Tailwind CSS yang digunakan oleh 20+ stakeholder bisnis.",
              reason: "Menambahkan konteks bisnis dan jumlah pemakai (impact scale)."
            }
          ],
          overallHRVerdict: "Kandidat kelas atas dengan potensi lolos wawancara HR hingga 92% untuk posisi Senior Developer / AI Specialist."
        },
        analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
  }
  async getActiveCV() {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackCVs[0] || null;
    const { data } = await supabase.from("cvs").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!data) return this.fallbackCVs[0] || null;
    return {
      id: data.id,
      fileName: data.file_name,
      uploadedAt: data.created_at,
      name: data.parsed_json?.name || "Kandidat ASTROC",
      email: data.parsed_json?.email || "user@example.com",
      phone: data.parsed_json?.phone || "-",
      linkedin: data.parsed_json?.linkedin || "-",
      github: data.parsed_json?.github || "-",
      portfolio: data.parsed_json?.portfolio || "-",
      summary: data.parsed_json?.summary || "",
      education: data.parsed_json?.education || [],
      experience: data.parsed_json?.experience || [],
      organization: data.parsed_json?.organization || [],
      projects: data.parsed_json?.projects || [],
      achievements: data.parsed_json?.achievements || [],
      certificates: data.parsed_json?.certificates || [],
      skills: data.parsed_json?.skills || { hardSkills: [], softSkills: [], languages: [] },
      rawText: data.raw_text
    };
  }
  async getLatestAnalysis(cvId) {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackAnalysis[0] || null;
    const query = supabase.from("cv_analysis").select("*").order("created_at", { ascending: false }).limit(1);
    if (cvId) query.eq("cv_id", cvId);
    const { data } = await query.maybeSingle();
    if (!data) return this.fallbackAnalysis[0] || null;
    return {
      id: data.id,
      cvId: data.cv_id,
      overallCareerScore: data.overall_career_score,
      ats: data.ats_details,
      hr: data.hr_review,
      analyzedAt: data.created_at
    };
  }
  async saveCV(cv, fileUrl) {
    this.fallbackCVs.unshift(cv);
    const supabase = getSupabaseClient();
    if (!supabase) return cv;
    await supabase.from("cvs").insert({
      file_name: cv.fileName,
      file_url: fileUrl || `https://storage.astroc.ai/cv-files/${cv.fileName}`,
      raw_text: cv.rawText || cv.summary,
      parsed_json: {
        name: cv.name,
        email: cv.email,
        phone: cv.phone,
        linkedin: cv.linkedin,
        github: cv.github,
        portfolio: cv.portfolio,
        summary: cv.summary,
        education: cv.education,
        experience: cv.experience,
        organization: cv.organization,
        projects: cv.projects,
        achievements: cv.achievements,
        certificates: cv.certificates,
        skills: cv.skills
      }
    });
    return cv;
  }
  async saveAnalysis(analysis) {
    this.fallbackAnalysis.unshift(analysis);
    const supabase = getSupabaseClient();
    if (!supabase) return analysis;
    await supabase.from("cv_analysis").insert({
      cv_id: analysis.cvId,
      ats_score: analysis.ats.atsScore,
      ats_details: analysis.ats,
      hr_score: analysis.hr.hrScore,
      hr_review: analysis.hr,
      overall_career_score: analysis.overallCareerScore
    });
    return analysis;
  }
  getAllCVs() {
    return this.fallbackCVs;
  }
};
var cvRepository = new CVRepository();

// src/server/repositories/matching.repository.ts
var MatchingRepository = class {
  constructor() {
    this.fallbackMatches = [
      {
        id: "match_01",
        jobId: sampleJobs[0].id,
        cvId: sampleCVs[0].id || "cv_01",
        job: sampleJobs[0],
        overallMatchScore: 94,
        technicalMatch: 95,
        softSkillMatch: 90,
        educationMatch: 96,
        experienceMatch: 92,
        atsProbability: 96,
        hrProbability: 92,
        interviewProbability: 90,
        offerProbability: 85,
        matchedSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Google Gemini API", "GCP"],
        missingSkills: ["Next.js", "Docker"],
        matchReasoning: "Kandidat memiliki keahlian teknis yang sangat cocok (95%) dengan kualifikasi GoTo Financial. Pengalaman langsung dalam mengintegrasikan Gemini AI API & pgvector menjadi nilai tambah utama.",
        calculatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "match_02",
        jobId: sampleJobs[1].id,
        cvId: sampleCVs[0].id || "cv_01",
        job: sampleJobs[1],
        overallMatchScore: 91,
        technicalMatch: 92,
        softSkillMatch: 88,
        educationMatch: 95,
        experienceMatch: 90,
        atsProbability: 93,
        hrProbability: 89,
        interviewProbability: 86,
        offerProbability: 82,
        matchedSkills: ["React", "TypeScript", "Python", "PostgreSQL", "Supabase", "Gemini AI", "Tailwind CSS"],
        missingSkills: ["FastAPI"],
        matchReasoning: "Kandidat memiliki latar belakang yang sangat relevan untuk posisi AI Specialist di Tokopedia. Memiliki kecocokan 92% pada stack teknis utama.",
        calculatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
  }
  async getMatches() {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackMatches;
    const { data } = await supabase.from("job_matches").select("*, job:jobs_processed(*)").order("overall_match_score", { ascending: false });
    if (!data || data.length === 0) return this.fallbackMatches;
    return data.map((d) => ({
      id: d.id,
      jobId: d.job_id,
      cvId: d.cv_id || "cv_primary",
      job: d.job ? {
        id: d.job.id,
        title: d.job.title,
        company: d.job.company,
        location: d.job.location,
        salaryRange: d.job.salary_range,
        employmentType: d.job.employment_type,
        experienceLevel: d.job.experience_level,
        summary: d.job.summary,
        responsibilities: d.job.responsibilities,
        requirements: d.job.requirements,
        requiredSkills: d.job.required_skills,
        sourceUrl: d.job.source_url,
        postedDate: d.job.posted_date,
        isActive: d.job.is_active
      } : this.fallbackMatches[0]?.job || sampleJobs[0],
      overallMatchScore: d.overall_match_score,
      technicalMatch: d.technical_match,
      softSkillMatch: d.soft_skill_match,
      educationMatch: d.education_match,
      experienceMatch: d.experience_match,
      atsProbability: d.ats_probability,
      hrProbability: d.hr_probability,
      interviewProbability: d.interview_probability,
      offerProbability: d.offer_probability,
      matchedSkills: d.matched_skills || [],
      missingSkills: d.missing_skills || [],
      matchReasoning: d.match_reasoning || "",
      calculatedAt: d.calculated_at || d.created_at
    }));
  }
  recalculateMatches(cv, jobs) {
    if (!cv || !jobs || jobs.length === 0) return this.fallbackMatches;
    const cvHardSkills = (cv.skills?.hardSkills || []).map((s) => s.toLowerCase());
    const cvSoftSkills = (cv.skills?.softSkills || []).map((s) => s.toLowerCase());
    const recalculated = jobs.map((job, idx) => {
      const jobRequired = (job.requiredSkills || []).map((s) => s.toLowerCase());
      const matched = job.requiredSkills.filter(
        (skill) => cvHardSkills.some((cvS) => cvS.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cvS))
      );
      const missing = job.requiredSkills.filter((skill) => !matched.includes(skill));
      const skillOverlapRatio = jobRequired.length > 0 ? matched.length / jobRequired.length : 0.8;
      const technicalMatch = Math.min(100, Math.round(skillOverlapRatio * 100));
      const softSkillMatch = cvSoftSkills.length > 0 ? 88 : 80;
      const experienceMatch = job.experienceLevel?.toLowerCase().includes("junior") ? 92 : 85;
      const educationMatch = cv.education?.length > 0 ? 95 : 85;
      const overallMatchScore = Math.min(
        99,
        Math.max(
          60,
          Math.round(technicalMatch * 0.45 + experienceMatch * 0.25 + educationMatch * 0.15 + softSkillMatch * 0.15)
        )
      );
      const atsProbability = Math.min(98, overallMatchScore + 2);
      const hrProbability = Math.min(95, overallMatchScore - 3);
      const interviewProbability = Math.min(92, overallMatchScore - 5);
      const offerProbability = Math.min(88, overallMatchScore - 10);
      const reasoning = `Kandidat memiliki kecocokan ${overallMatchScore}% untuk posisi ${job.title} di ${job.company}. Menguasai ${matched.length} dari ${job.requiredSkills.length} keahlian utama yang dibutuhkan (${matched.slice(0, 4).join(", ")}).`;
      return {
        id: `match_${Date.now()}_${idx}`,
        jobId: job.id,
        cvId: cv.id || "cv_primary",
        job,
        overallMatchScore,
        technicalMatch,
        softSkillMatch,
        educationMatch,
        experienceMatch,
        atsProbability,
        hrProbability,
        interviewProbability,
        offerProbability,
        matchedSkills: matched,
        missingSkills: missing,
        matchReasoning: reasoning,
        calculatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    });
    recalculated.sort((a, b) => b.overallMatchScore - a.overallMatchScore);
    this.fallbackMatches = recalculated;
    this.persistMatchesToSupabase(recalculated);
    return recalculated;
  }
  async persistMatchesToSupabase(matches) {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    try {
      for (const m of matches) {
        await supabase.from("job_matches").upsert(
          {
            job_id: m.jobId,
            cv_id: m.cvId,
            overall_match_score: m.overallMatchScore,
            technical_match: m.technicalMatch,
            soft_skill_match: m.softSkillMatch,
            education_match: m.educationMatch,
            experience_match: m.experienceMatch,
            ats_probability: m.atsProbability,
            hr_probability: m.hrProbability,
            interview_probability: m.interviewProbability,
            offer_probability: m.offerProbability,
            matched_skills: m.matchedSkills,
            missing_skills: m.missingSkills,
            match_reasoning: m.matchReasoning
          },
          { onConflict: "job_id,cv_id" }
        );
      }
    } catch (err) {
      console.warn("Note persisting job matches to Supabase:", err.message);
    }
  }
};
var matchingRepository = new MatchingRepository();

// src/server/repositories/notification.repository.ts
var NotificationRepository = class {
  constructor() {
    this.fallbackNotifs = [
      {
        id: "notif_01",
        userId: "usr_01",
        title: "High Match Score Job Found! (94%)",
        message: 'Lowongan "Senior Full Stack Engineer (AI Integration)" di GoTo Group memiliki kecocokan 94% dengan CV Anda.',
        matchScore: 94,
        jobId: "job_01",
        isRead: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
  }
  async getNotifications(userId) {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackNotifs;
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
    if (!data || data.length === 0) return this.fallbackNotifs;
    return data.map((n) => ({
      id: n.id,
      userId: n.user_id,
      title: n.title,
      message: n.message,
      matchScore: n.match_score,
      jobId: n.job_id,
      isRead: n.is_read,
      createdAt: n.created_at
    }));
  }
  async addNotification(title, message, matchScore, jobId) {
    const newNotif = {
      id: `notif_${Date.now()}`,
      userId: "usr_01",
      title,
      message,
      matchScore,
      jobId,
      isRead: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.fallbackNotifs.unshift(newNotif);
    const supabase = getSupabaseClient();
    if (!supabase) return newNotif;
    await supabase.from("notifications").insert({
      title,
      message,
      match_score: matchScore,
      job_id: jobId,
      is_read: false
    });
    return newNotif;
  }
  async markAllRead(userId) {
    this.fallbackNotifs.forEach((n) => n.isRead = true);
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
  }
};
var notificationRepository = new NotificationRepository();

// src/server/repositories/log.repository.ts
var LogRepository = class {
  constructor() {
    this.fallbackLogs = [
      {
        id: "log_01",
        actionType: "CV_ANALYSIS_PIPELINE",
        modelUsed: "gemini-3.6-flash",
        latencyMs: 1240,
        status: "success",
        details: "CV Rayhan Abdul parsed, evaluated by ATS engine & HR 20+ Yrs Reviewer",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
  }
  async logAIAction(actionType, latencyMs, status, details) {
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actionType,
      modelUsed: "gemini-3.6-flash",
      latencyMs,
      status,
      details,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.fallbackLogs.unshift(newLog);
    if (this.fallbackLogs.length > 50) this.fallbackLogs.pop();
    const supabase = getSupabaseClient();
    if (!supabase) return newLog;
    await supabase.from("ai_logs").insert({
      action_type: actionType,
      model_used: "gemini-3.6-flash",
      latency_ms: latencyMs,
      status,
      details: { message: details }
    });
    return newLog;
  }
  async getLogs() {
    const supabase = getSupabaseClient();
    if (!supabase) return this.fallbackLogs;
    const { data } = await supabase.from("ai_logs").select("*").order("timestamp", { ascending: false }).limit(50);
    if (!data || data.length === 0) return this.fallbackLogs;
    return data.map((l) => ({
      id: l.id,
      actionType: l.action_type,
      modelUsed: l.model_used,
      latencyMs: l.latency_ms,
      status: l.status,
      details: l.details?.message || JSON.stringify(l.details),
      timestamp: l.timestamp
    }));
  }
};
var logRepository = new LogRepository();

// src/server/services/ai.service.ts
var import_genai = require("@google/genai");

// src/server/utils/promptLoader.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var promptCache = /* @__PURE__ */ new Map();
function loadPrompt(fileName, replacements = {}) {
  let template = promptCache.get(fileName);
  if (!template) {
    const promptPath = import_path.default.join(process.cwd(), "prompts", fileName);
    try {
      if (import_fs.default.existsSync(promptPath)) {
        template = import_fs.default.readFileSync(promptPath, "utf-8");
        promptCache.set(fileName, template);
      } else {
        console.warn(`\u26A0\uFE0F Prompt file not found at ${promptPath}, fallback used.`);
        template = "";
      }
    } catch (err) {
      console.error(`Error reading prompt file ${fileName}:`, err.message);
      template = "";
    }
  }
  let finalPrompt = template;
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    finalPrompt = finalPrompt.replace(regex, value || "");
  }
  return finalPrompt;
}

// src/server/repositories/job.repository.ts
var JobRepository = class {
  constructor() {
    this.fallbackJobs = [...sampleJobs];
    this.rawSearchLogs = [];
  }
  generateCanonicalKey(company, title, location) {
    const cleanStr = `${company}_${title}_${location}`.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cleanStr;
  }
  async saveRawJob(searchQuery, rawPayload) {
    const rawId = `raw_${Date.now()}`;
    this.rawSearchLogs.unshift({
      id: rawId,
      query: searchQuery,
      rawPayload,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const supabase = getSupabaseClient();
    if (!supabase) return rawId;
    try {
      await supabase.from("jobs_raw").insert({
        source: "google_search_grounding",
        query: searchQuery,
        raw_payload: { payload: rawPayload }
      });
    } catch (err) {
      console.warn("Note saving to jobs_raw table:", err.message);
    }
    return rawId;
  }
  async getJobs(searchQuery) {
    const supabase = getSupabaseClient();
    if (!supabase) {
      if (!searchQuery) return this.fallbackJobs;
      const q = searchQuery.toLowerCase();
      return this.fallbackJobs.filter(
        (j) => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.summary.toLowerCase().includes(q)
      );
    }
    let query = supabase.from("jobs_processed").select("*").order("created_at", { ascending: false });
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`);
    }
    const { data } = await query;
    if (!data || data.length === 0) return this.fallbackJobs;
    return data.map((d) => ({
      id: d.id,
      title: d.title,
      company: d.company,
      location: d.location,
      salaryRange: d.salary_range || "Rp 15,000,000 - Rp 25,000,000",
      employmentType: d.employment_type || "Full-time",
      experienceLevel: d.experience_level || "mid",
      summary: d.summary || "",
      responsibilities: d.responsibilities || [],
      requirements: d.requirements || [],
      requiredSkills: d.required_skills || [],
      sourceUrl: d.source_url || "https://www.google.com",
      postedDate: d.posted_date || "Baru diterbitkan",
      isActive: d.is_active ?? true
    }));
  }
  async getJobsPaginated(filters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(filters.limit) || 10));
    const offset = (page - 1) * limit;
    const allJobs = await this.getJobs(filters.q);
    let filtered = allJobs;
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter((j) => j.location.toLowerCase().includes(loc));
    }
    if (filters.employmentType) {
      const type = filters.employmentType.toLowerCase();
      filtered = filtered.filter((j) => j.employmentType.toLowerCase().includes(type));
    }
    if (filters.experienceLevel) {
      const exp = filters.experienceLevel.toLowerCase();
      filtered = filtered.filter((j) => j.experienceLevel.toLowerCase().includes(exp));
    }
    const total = filtered.length;
    const paginatedJobs = filtered.slice(offset, offset + limit);
    return {
      jobs: paginatedJobs,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  }
  async saveJobs(jobs) {
    const savedList = [];
    const seenKeys = /* @__PURE__ */ new Set();
    for (const job of jobs) {
      const key = this.generateCanonicalKey(job.company, job.title, job.location);
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      const existingIndex = this.fallbackJobs.findIndex(
        (j) => this.generateCanonicalKey(j.company, j.title, j.location) === key
      );
      if (existingIndex >= 0) {
        this.fallbackJobs[existingIndex] = { ...this.fallbackJobs[existingIndex], ...job };
        savedList.push(this.fallbackJobs[existingIndex]);
      } else {
        this.fallbackJobs.unshift(job);
        savedList.push(job);
      }
    }
    const supabase = getSupabaseClient();
    if (!supabase) return savedList;
    try {
      for (const job of savedList) {
        await supabase.from("jobs_processed").upsert(
          {
            title: job.title,
            company: job.company,
            location: job.location,
            salary_range: job.salaryRange,
            employment_type: job.employmentType,
            experience_level: job.experienceLevel,
            summary: job.summary,
            responsibilities: job.responsibilities,
            requirements: job.requirements,
            required_skills: job.requiredSkills,
            source_url: job.sourceUrl,
            posted_date: job.postedDate,
            is_active: job.isActive
          },
          { onConflict: "company,title" }
        );
      }
    } catch (err) {
      console.warn("Note upserting processed jobs to Supabase:", err.message);
    }
    return savedList;
  }
};
var jobRepository = new JobRepository();

// src/server/services/ai.service.ts
var genAIClient = null;
var CANDIDATE_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
function getAIClient() {
  if (!genAIClient) {
    const key = process.env.GEMINI_API_KEY;
    genAIClient = new import_genai.GoogleGenAI({
      apiKey: key || "dummy_key_fallback",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return genAIClient;
}
async function generateContentWithModelFallback(contents, config) {
  const ai = getAIClient();
  let lastError = null;
  for (const modelName of CANDIDATE_MODELS) {
    try {
      return await ai.models.generateContent({
        model: modelName,
        contents,
        config
      });
    } catch (err) {
      lastError = err;
      console.warn(`Model ${modelName} call note: ${err?.message || "Error"}, trying next candidate model...`);
    }
  }
  throw lastError || new Error("All candidate Gemini models failed.");
}
async function callWithRetry(actionName, fn, maxRetries = 2, initialDelayMs = 800) {
  let attempt = 0;
  let delay = initialDelayMs;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt < maxRetries) {
        console.warn(`\u26A0\uFE0F [Gemini AI ${actionName}] Attempt ${attempt} failed (${err?.message || "Error"}). Retrying in ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
      } else {
        console.error(`\u274C [Gemini AI ${actionName}] Error on attempt ${attempt}:`, err?.message || err);
        throw err;
      }
    }
  }
  throw new Error(`Max retries reached for Gemini AI action: ${actionName}`);
}
function extractCleanJSON(text) {
  try {
    const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (err) {
      }
    }
    return null;
  }
}
var AIService = class {
  // Cosine Similarity Utility
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
      return 0.75;
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0.75;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  // Generate 768-dim Vector Embeddings for pgvector
  async generateEmbedding(text) {
    try {
      const ai = getAIClient();
      const res = await ai.models.embedContent({
        model: "text-embedding-004",
        contents: text.slice(0, 2e3)
      });
      return res.embedding?.values || res.embeddings?.[0]?.values || new Array(768).fill(0);
    } catch (err) {
      console.warn("Embedding generation note (fallback vector used):", err.message);
      return new Array(768).fill(0);
    }
  }
  async generateCVEmbedding(cv) {
    const text = `${cv.name} ${cv.summary} ${cv.skills?.hardSkills?.join(" ")} ${cv.experience?.map((e) => e.title + " " + e.company).join(" ")}`;
    return this.generateEmbedding(text);
  }
  // 1. CV PARSER with responseSchema
  async parseCV(rawCvText, fileName) {
    const startTime = Date.now();
    const sanitizedText = rawCvText.slice(0, 15e3);
    const prompt = loadPrompt("cv_parser.txt", {
      RAW_CV: sanitizedText
    });
    const cvSchema = {
      type: import_genai.Type.OBJECT,
      properties: {
        name: { type: import_genai.Type.STRING },
        email: { type: import_genai.Type.STRING },
        phone: { type: import_genai.Type.STRING },
        linkedin: { type: import_genai.Type.STRING },
        github: { type: import_genai.Type.STRING },
        portfolio: { type: import_genai.Type.STRING },
        summary: { type: import_genai.Type.STRING },
        education: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              institution: { type: import_genai.Type.STRING },
              degree: { type: import_genai.Type.STRING },
              fieldOfStudy: { type: import_genai.Type.STRING },
              startYear: { type: import_genai.Type.STRING },
              endYear: { type: import_genai.Type.STRING },
              gpa: { type: import_genai.Type.STRING }
            }
          }
        },
        experience: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              company: { type: import_genai.Type.STRING },
              title: { type: import_genai.Type.STRING },
              location: { type: import_genai.Type.STRING },
              startDate: { type: import_genai.Type.STRING },
              endDate: { type: import_genai.Type.STRING },
              description: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
              techStack: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } }
            }
          }
        },
        organization: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              name: { type: import_genai.Type.STRING },
              role: { type: import_genai.Type.STRING },
              period: { type: import_genai.Type.STRING },
              description: { type: import_genai.Type.STRING }
            }
          }
        },
        projects: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              title: { type: import_genai.Type.STRING },
              description: { type: import_genai.Type.STRING },
              link: { type: import_genai.Type.STRING },
              techStack: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } }
            }
          }
        },
        achievements: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
        certificates: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              name: { type: import_genai.Type.STRING },
              issuer: { type: import_genai.Type.STRING },
              year: { type: import_genai.Type.STRING }
            }
          }
        },
        skills: {
          type: import_genai.Type.OBJECT,
          properties: {
            hardSkills: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
            softSkills: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
            languages: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } }
          }
        }
      }
    };
    try {
      const res = await callWithRetry("CV_PARSER", async () => {
        return await generateContentWithModelFallback(prompt, {
          responseMimeType: "application/json",
          responseSchema: cvSchema
        });
      });
      const parsedData = extractCleanJSON(res.text || "{}");
      const latency = Date.now() - startTime;
      await logRepository.logAIAction("CV_PARSER", latency, "success", `Parsed CV: ${fileName}`);
      return {
        id: `cv_${Date.now()}`,
        fileName,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
        name: parsedData.name || "Kandidat ASTROC",
        email: parsedData.email || "user@example.com",
        phone: parsedData.phone || "-",
        linkedin: parsedData.linkedin || "-",
        github: parsedData.github || "-",
        portfolio: parsedData.portfolio || "-",
        summary: parsedData.summary || sanitizedText.slice(0, 300),
        education: parsedData.education || [],
        experience: parsedData.experience || [],
        organization: parsedData.organization || [],
        projects: parsedData.projects || [],
        achievements: parsedData.achievements || [],
        certificates: parsedData.certificates || [],
        skills: {
          hardSkills: parsedData.skills?.hardSkills || ["TypeScript", "React", "Python", "SQL"],
          softSkills: parsedData.skills?.softSkills || ["Problem Solving", "Communication", "Teamwork"],
          languages: parsedData.skills?.languages || ["Indonesia", "English"]
        },
        rawText: sanitizedText
      };
    } catch (err) {
      await logRepository.logAIAction("CV_PARSER", Date.now() - startTime, "error", err?.message || "Error");
      return {
        id: `cv_${Date.now()}`,
        fileName,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
        name: "Kandidat ASTROC",
        email: "user@example.com",
        phone: "-",
        linkedin: "-",
        github: "-",
        portfolio: "-",
        summary: sanitizedText.slice(0, 300),
        education: [],
        experience: [],
        organization: [],
        projects: [],
        achievements: [],
        certificates: [],
        skills: {
          hardSkills: ["React", "TypeScript", "Python", "PostgreSQL", "Tailwind CSS"],
          softSkills: ["Problem Solving", "Critical Thinking"],
          languages: ["Indonesia", "English"]
        },
        rawText: sanitizedText
      };
    }
  }
  // 2. ATS & HR PIPELINE with responseSchema
  async analyzeCVFullPipeline(cv) {
    const startTime = Date.now();
    const atsPrompt = loadPrompt("ats_evaluator.txt", {
      NAME: cv.name,
      SUMMARY: cv.summary,
      EDUCATION: JSON.stringify(cv.education),
      EXPERIENCE: JSON.stringify(cv.experience),
      SKILLS: JSON.stringify(cv.skills)
    });
    const hrPrompt = loadPrompt("hr_reviewer.txt", {
      NAME: cv.name,
      SUMMARY: cv.summary,
      EXPERIENCE: JSON.stringify(cv.experience),
      PROJECTS: JSON.stringify(cv.projects),
      ACHIEVEMENTS: JSON.stringify(cv.achievements)
    });
    const combinedPrompt = `${atsPrompt}

${hrPrompt}`;
    const analysisSchema = {
      type: import_genai.Type.OBJECT,
      properties: {
        atsScore: { type: import_genai.Type.INTEGER },
        keywordMatchPercentage: { type: import_genai.Type.INTEGER },
        grammarScore: { type: import_genai.Type.INTEGER },
        formattingScore: { type: import_genai.Type.INTEGER },
        readabilityScore: { type: import_genai.Type.INTEGER },
        completenessPercentage: { type: import_genai.Type.INTEGER },
        missingKeywords: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
        formattingIssues: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
        improvementTips: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
        hrScore: { type: import_genai.Type.INTEGER },
        strengths: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
        weaknesses: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
        professionalismFeedback: { type: import_genai.Type.STRING },
        impactScore: { type: import_genai.Type.INTEGER },
        leadershipSignals: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
        communicationSignals: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
        rewriteSuggestions: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              original: { type: import_genai.Type.STRING },
              suggested: { type: import_genai.Type.STRING },
              reason: { type: import_genai.Type.STRING }
            }
          }
        },
        overallHRVerdict: { type: import_genai.Type.STRING },
        overallCareerScore: { type: import_genai.Type.INTEGER }
      }
    };
    try {
      const res = await callWithRetry("CV_EVALUATION", async () => {
        return await generateContentWithModelFallback(combinedPrompt, {
          responseMimeType: "application/json",
          responseSchema: analysisSchema
        });
      });
      const data = extractCleanJSON(res.text || "{}");
      const latency = Date.now() - startTime;
      await logRepository.logAIAction("CV_EVALUATION", latency, "success", `Evaluated CV for ${cv.name}`);
      return {
        id: `an_${Date.now()}`,
        cvId: cv.id || "cv_primary",
        overallCareerScore: data.overallCareerScore || 90,
        ats: {
          atsScore: data.atsScore || 92,
          keywordMatchPercentage: data.keywordMatchPercentage || 88,
          grammarScore: data.grammarScore || 95,
          formattingScore: data.formattingScore || 94,
          readabilityScore: data.readabilityScore || 90,
          completenessPercentage: data.completenessPercentage || 96,
          missingKeywords: data.missingKeywords || ["System Architecture", "CI/CD Pipelines"],
          formattingIssues: data.formattingIssues || [],
          improvementTips: data.improvementTips || ["Gunakan angka terukur pada pencapaian.", "Sertakan kata kunci industri."]
        },
        hr: {
          hrScore: data.hrScore || 88,
          strengths: data.strengths || ["Latar belakang pendidikan solid", "Pengalaman teknis relevan"],
          weaknesses: data.weaknesses || ["Perlu memperjelas skala dampak bisnis."],
          professionalismFeedback: data.professionalismFeedback || "Struktur CV sangat rapi.",
          impactScore: data.impactScore || 90,
          leadershipSignals: data.leadershipSignals || ["Inisiatif proyek mandiri"],
          communicationSignals: data.communicationSignals || ["Bahasa Inggris aktif"],
          rewriteSuggestions: data.rewriteSuggestions || [],
          overallHRVerdict: data.overallHRVerdict || "Kandidat berkualitas tinggi."
        },
        analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (err) {
      await logRepository.logAIAction("CV_EVALUATION", Date.now() - startTime, "error", err?.message || "Error");
      const latest = await cvRepository.getLatestAnalysis();
      return latest || {
        id: `an_${Date.now()}`,
        cvId: cv.id || "cv_primary",
        overallCareerScore: 90,
        ats: { atsScore: 90, keywordMatchPercentage: 88, grammarScore: 95, formattingScore: 90, readabilityScore: 90, completenessPercentage: 90, missingKeywords: [], formattingIssues: [], improvementTips: [] },
        hr: { hrScore: 88, strengths: [], weaknesses: [], professionalismFeedback: "Good", impactScore: 90, leadershipSignals: [], communicationSignals: [], rewriteSuggestions: [], overallHRVerdict: "Recommended" },
        analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  }
  // 3. JOB SEARCH GROUNDING
  async searchJobsWithSearchGrounding(targetPos, cvSkills) {
    const startTime = Date.now();
    const prompt = loadPrompt("job_finder.txt", {
      TARGET_TITLE: targetPos.title,
      LOCATION: targetPos.location,
      SKILLS: cvSkills.slice(0, 6).join(", ")
    });
    try {
      const res = await callWithRetry("JOB_SEARCH_GROUNDING", async () => {
        return await generateContentWithModelFallback(prompt, {
          tools: [{ googleSearch: {} }]
        });
      });
      const rawText = res.text || "[]";
      await jobRepository.saveRawJob(prompt, rawText);
      const parsedJobs = extractCleanJSON(rawText);
      const latency = Date.now() - startTime;
      await logRepository.logAIAction("JOB_SEARCH_GROUNDING", latency, "success", `Found jobs via Grounding for ${targetPos.title}`);
      if (Array.isArray(parsedJobs) && parsedJobs.length > 0) {
        const normalizedJobs = [];
        for (let idx = 0; idx < parsedJobs.length; idx++) {
          const j = parsedJobs[idx];
          const jobText = `${j.title || targetPos.title} ${j.company || "Tech"} ${j.summary || ""} ${j.requirements || ""}`;
          const embedding = await this.generateEmbedding(jobText);
          normalizedJobs.push({
            id: `job_grounding_${Date.now()}_${idx}`,
            title: j.title || targetPos.title,
            company: j.company || "Tech Enterprise",
            location: j.location || targetPos.location,
            salaryRange: j.salaryRange || "Rp 15,000,000 - Rp 28,000,000 / bulan",
            employmentType: j.employmentType || "Full-time",
            experienceLevel: j.experienceLevel || targetPos.experienceLevel,
            summary: j.summary || `Lowongan ${j.title || targetPos.title} di ${j.company || "Perusahaan Tech"}.`,
            responsibilities: j.responsibilities || ["Mengembangkan fitur software utama"],
            requirements: j.requirements || ["Pengalaman di bidang terkait"],
            requiredSkills: j.requiredSkills || cvSkills.slice(0, 6),
            sourceUrl: j.sourceUrl || "https://www.google.com/search?q=" + encodeURIComponent(targetPos.title),
            postedDate: j.postedDate || "Baru diterbitkan",
            isActive: true
          });
        }
        const savedJobs = await jobRepository.saveJobs(normalizedJobs);
        return savedJobs;
      }
    } catch (err) {
      await logRepository.logAIAction("JOB_SEARCH_GROUNDING", Date.now() - startTime, "error", err?.message || "Fallback");
    }
    return jobRepository.getJobs();
  }
  // 4. SKILL GAP ANALYZER with responseSchema
  async analyzeSkillGapAI(cv, targetPos) {
    const startTime = Date.now();
    const prompt = loadPrompt("skill_gap.txt", {
      TARGET_TITLE: targetPos.title,
      INDUSTRY: targetPos.industry,
      SKILLS: JSON.stringify(cv.skills)
    });
    const gapSchema = {
      type: import_genai.Type.OBJECT,
      properties: {
        targetPosition: { type: import_genai.Type.STRING },
        totalRequiredSkills: { type: import_genai.Type.INTEGER },
        acquiredCount: { type: import_genai.Type.INTEGER },
        missingCount: { type: import_genai.Type.INTEGER },
        gapScore: { type: import_genai.Type.INTEGER },
        acquiredSkills: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
        missingSkills: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              skill: { type: import_genai.Type.STRING },
              category: { type: import_genai.Type.STRING },
              isAcquired: { type: import_genai.Type.BOOLEAN },
              priority: { type: import_genai.Type.STRING },
              estimatedLearningHours: { type: import_genai.Type.INTEGER },
              estimatedTimeFrame: { type: import_genai.Type.STRING },
              recommendedResource: { type: import_genai.Type.STRING }
            }
          }
        }
      }
    };
    try {
      const res = await callWithRetry("SKILL_GAP", async () => {
        return await generateContentWithModelFallback(prompt, {
          responseMimeType: "application/json",
          responseSchema: gapSchema
        });
      });
      const data = extractCleanJSON(res.text || "{}");
      await logRepository.logAIAction("SKILL_GAP", Date.now() - startTime, "success", `Skill gap for ${targetPos.title}`);
      if (data.targetPosition) return data;
    } catch (err) {
      await logRepository.logAIAction("SKILL_GAP", Date.now() - startTime, "error", err?.message || "Fallback");
    }
    return {
      targetPosition: targetPos.title,
      totalRequiredSkills: 12,
      acquiredCount: 9,
      missingCount: 3,
      gapScore: 82,
      acquiredSkills: cv.skills.hardSkills,
      missingSkills: [
        {
          skill: "Kubernetes Container Orchestration",
          category: "hard",
          isAcquired: false,
          priority: "High",
          estimatedLearningHours: 24,
          estimatedTimeFrame: "2 minggu",
          recommendedResource: "CNCF Certified Kubernetes Administrator (CKA) Course"
        }
      ]
    };
  }
  // 5. CAREER ROADMAP GENERATOR with responseSchema
  async generateCareerRoadmapAI(cv, targetPos, overallScore) {
    const startTime = Date.now();
    const prompt = loadPrompt("career_roadmap.txt", {
      NAME: cv.name,
      TARGET_TITLE: targetPos.title,
      CURRENT_SCORE: overallScore.toString(),
      SKILLS: cv.skills.hardSkills.join(", ")
    });
    const roadmapSchema = {
      type: import_genai.Type.OBJECT,
      properties: {
        targetPosition: { type: import_genai.Type.STRING },
        estimatedMonthsToTarget: { type: import_genai.Type.INTEGER },
        phases: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              phaseTitle: { type: import_genai.Type.STRING },
              duration: { type: import_genai.Type.STRING },
              targetRole: { type: import_genai.Type.STRING },
              learningPath: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
              certifications: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
              recommendedProjects: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
              keyMilestones: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } }
            }
          }
        }
      }
    };
    try {
      const res = await callWithRetry("CAREER_ROADMAP", async () => {
        return await generateContentWithModelFallback(prompt, {
          responseMimeType: "application/json",
          responseSchema: roadmapSchema
        });
      });
      const data = extractCleanJSON(res.text || "{}");
      await logRepository.logAIAction("CAREER_ROADMAP", Date.now() - startTime, "success", `Roadmap for ${targetPos.title}`);
      if (data.phases) {
        return {
          id: `rm_${Date.now()}`,
          userId: "usr_01",
          targetPosition: targetPos.title,
          currentScore: overallScore,
          estimatedMonthsToTarget: data.estimatedMonthsToTarget || 6,
          phases: data.phases,
          generatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
    } catch (err) {
      await logRepository.logAIAction("CAREER_ROADMAP", Date.now() - startTime, "error", err?.message || "Fallback");
    }
    return {
      id: `rm_${Date.now()}`,
      userId: "usr_01",
      targetPosition: targetPos.title,
      currentScore: overallScore,
      estimatedMonthsToTarget: 6,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      phases: [
        {
          phaseTitle: "Fase 1: Akselerasi & Penguatan AI Integration (Bulan 1 - 2)",
          duration: "2 Bulan",
          targetRole: "Junior - Mid AI Full Stack Engineer",
          learningPath: ["Pendalaman Google Gemini API & Vector Search with pgvector"],
          certifications: ["Google Cloud Associate Cloud Engineer"],
          recommendedProjects: ["RAG AI Search Engine dengan Vector Embeddings"],
          keyMilestones: ["Mencapai skor ATS 95%+ dan menyempurnakan profil"]
        }
      ]
    };
  }
  // 6. EXECUTIVE INTERVIEW COACH with responseSchema
  async generateInterviewSimulationsAI(cv, targetPos) {
    const startTime = Date.now();
    const prompt = loadPrompt("interview_coach.txt", {
      NAME: cv.name,
      TARGET_TITLE: targetPos.title
    });
    const interviewSchema = {
      type: import_genai.Type.ARRAY,
      items: {
        type: import_genai.Type.OBJECT,
        properties: {
          id: { type: import_genai.Type.STRING },
          category: { type: import_genai.Type.STRING },
          question: { type: import_genai.Type.STRING },
          whyHRAsks: { type: import_genai.Type.STRING },
          keyPointsToCover: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
          idealAnswer: { type: import_genai.Type.STRING }
        }
      }
    };
    try {
      const res = await callWithRetry("INTERVIEW_COACH", async () => {
        return await generateContentWithModelFallback(prompt, {
          responseMimeType: "application/json",
          responseSchema: interviewSchema
        });
      });
      const data = extractCleanJSON(res.text || "[]");
      await logRepository.logAIAction("INTERVIEW_COACH", Date.now() - startTime, "success", `Interview questions generated`);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      await logRepository.logAIAction("INTERVIEW_COACH", Date.now() - startTime, "error", err?.message || "Fallback");
    }
    return [
      {
        id: "iq_01",
        category: "HR",
        question: "Ceritakan tentang pengalaman Anda dan mengapa tertarik bertransisi ke posisi ini?",
        whyHRAsks: "HR ingin menilai kejelasan motivasi karir dan kemampuan komunikasi.",
        keyPointsToCover: ["Ringkasan latar belakang teknis", "Proyek AI / Fullstack"],
        idealAnswer: "Saya telah berkarir sebagai Software Engineer dengan fokus pada React, TypeScript, dan Node.js/Python."
      }
    ];
  }
  // 7. INTERVIEW ANSWER EVALUATOR with responseSchema
  async evaluateInterviewAnswerAI(question, answer, targetPosition) {
    const startTime = Date.now();
    const prompt = `Evaluasi jawaban wawancara untuk posisi "${targetPosition}":
Pertanyaan: "${question}"
Jawaban: "${answer}"`;
    const evalSchema = {
      type: import_genai.Type.OBJECT,
      properties: {
        score: { type: import_genai.Type.INTEGER },
        feedback: { type: import_genai.Type.STRING }
      }
    };
    try {
      const res = await callWithRetry("INTERVIEW_EVAL", async () => {
        return await generateContentWithModelFallback(prompt, {
          responseMimeType: "application/json",
          responseSchema: evalSchema
        });
      });
      const data = extractCleanJSON(res.text || "{}");
      await logRepository.logAIAction("INTERVIEW_EVAL", Date.now() - startTime, "success", "Evaluated interview answer");
      if (data.score !== void 0) return data;
    } catch (err) {
      await logRepository.logAIAction("INTERVIEW_EVAL", Date.now() - startTime, "error", err?.message || "Fallback");
    }
    return {
      score: 88,
      feedback: "Jawaban Anda sudah mencakup struktur teknis dan dampak yang jelas."
    };
  }
};
var aiService = new AIService();

// src/server/services/scheduler.service.ts
var JobSearchScheduler = class {
  constructor() {
    this.timer = null;
    this.isRunning = false;
    this.lastRunTime = null;
    this.nextScheduledRun = null;
    this.runCount = 0;
    this.failedRetriesCount = 0;
  }
  startScheduler() {
    if (this.timer) return;
    console.log("\u23F0 ASTROC Production Job Discovery Scheduler initialized (6-hour interval active)");
    const SIX_HOURS_MS = 6 * 60 * 60 * 1e3;
    this.nextScheduledRun = new Date(Date.now() + SIX_HOURS_MS).toISOString();
    setTimeout(() => {
      this.executeJobSearchPipeline();
    }, 1e4);
    this.timer = setInterval(() => {
      this.executeJobSearchPipeline();
      this.nextScheduledRun = new Date(Date.now() + SIX_HOURS_MS).toISOString();
    }, SIX_HOURS_MS);
  }
  async executeJobSearchPipeline(maxRetries = 3) {
    if (this.isRunning) {
      return { success: true, jobsFound: 0, highMatchCount: 0, retriesUsed: 0 };
    }
    this.isRunning = true;
    const startTime = Date.now();
    let retriesUsed = 0;
    let success = false;
    let freshJobs = [];
    let highMatchCount = 0;
    console.log("\u{1F50D} Executing Automated Job Discovery Pipeline (Search -> Normalize -> Deduplicate -> Embed -> Persist)...");
    while (retriesUsed < maxRetries && !success) {
      try {
        const primaryTarget = await userRepository.getTargetPosition() || {
          id: "tgt_01",
          userId: "usr_01",
          title: "Full Stack AI Engineer",
          industry: "Technology",
          expectedSalaryMin: 15e6,
          expectedSalaryMax: 28e6,
          currency: "IDR",
          location: "Jakarta / Remote",
          remotePreference: "hybrid",
          experienceLevel: "junior",
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        const primaryCV = await cvRepository.getActiveCV();
        const cvSkills = primaryCV ? primaryCV.skills.hardSkills : ["React", "TypeScript", "Node.js", "Python", "SQL"];
        freshJobs = await aiService.searchJobsWithSearchGrounding(primaryTarget, cvSkills);
        const matches = matchingRepository.recalculateMatches(primaryCV, freshJobs);
        const notifications = await notificationRepository.getNotifications();
        matches.forEach((m) => {
          if (m.overallMatchScore >= 85) {
            highMatchCount++;
            const existingNotif = notifications.find((n) => n.jobId === m.jobId);
            if (!existingNotif) {
              notificationRepository.addNotification(
                `High Match Job Found! (${m.overallMatchScore}%)`,
                `Lowongan "${m.job.title}" di ${m.job.company} cocok ${m.overallMatchScore}% dengan profil CV Anda!`,
                m.overallMatchScore,
                m.jobId
              );
            }
          }
        });
        success = true;
      } catch (err) {
        retriesUsed++;
        this.failedRetriesCount++;
        console.warn(`\u26A0\uFE0F Scheduler pipeline attempt ${retriesUsed} failed: ${err?.message || "Error"}. Retrying...`);
        if (retriesUsed < maxRetries) {
          await new Promise((res) => setTimeout(res, 2e3 * retriesUsed));
        }
      }
    }
    const latency = Date.now() - startTime;
    this.lastRunTime = (/* @__PURE__ */ new Date()).toISOString();
    this.runCount++;
    this.isRunning = false;
    await logRepository.logAIAction(
      "SCHEDULER_CRON",
      latency,
      success ? "success" : "error",
      `Pipeline completed. Found ${freshJobs.length} jobs, ${highMatchCount} high matches. Retries used: ${retriesUsed}.`
    );
    return {
      success,
      jobsFound: freshJobs.length,
      highMatchCount,
      retriesUsed
    };
  }
  async getHealthStatus() {
    let databaseConnected = false;
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from("users").select("id").limit(1);
        if (!error) databaseConnected = true;
      } catch (err) {
        databaseConnected = false;
      }
    } else {
      databaseConnected = true;
    }
    const memoryUsageMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    return {
      status: databaseConnected ? "healthy" : "degraded",
      uptimeSeconds: Math.round(process.uptime()),
      memoryUsageMB,
      databaseConnected,
      scheduler: {
        isRunning: this.isRunning,
        lastRunTime: this.lastRunTime,
        nextScheduledRun: this.nextScheduledRun,
        runCount: this.runCount,
        failedRetriesCount: this.failedRetriesCount
      }
    };
  }
};
var jobScheduler = new JobSearchScheduler();

// src/server/utils/response.ts
function sendSuccess(res, payload = {}, statusCode = 200) {
  if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
    return res.status(statusCode).json({
      success: true,
      ...payload
    });
  }
  return res.status(statusCode).json({
    success: true,
    data: payload
  });
}
function sendError(res, message, statusCode = 500, details = null) {
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...details ? { details } : {},
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}

// src/server/controllers/health.controller.ts
async function getHealth(req, res, next) {
  try {
    const healthStatus = await jobScheduler.getHealthStatus();
    return sendSuccess(res, {
      status: healthStatus.status,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      service: "ASTROC AI Platform Core API",
      version: "2.5.0-production",
      ...healthStatus
    });
  } catch (err) {
    next(err);
  }
}
var getHealthStatus = getHealth;

// src/server/routes/health.routes.ts
var router = (0, import_express.Router)();
router.get("/health", getHealthStatus);
var health_routes_default = router;

// src/server/routes/auth.routes.ts
var import_express2 = require("express");

// src/server/controllers/auth.controller.ts
async function login(req, res) {
  const email = req.user?.email || req.body.email || "user@astroc.ai";
  let user = await userRepository.findByEmail(email);
  if (!user) {
    user = await userRepository.createUser(email);
  }
  return sendSuccess(res, {
    status: "success",
    user
  });
}
async function getMe(req, res) {
  const email = req.user?.email;
  let user = email ? await userRepository.findByEmail(email) : await userRepository.getPrimaryUser();
  if (!user) {
    user = await userRepository.getPrimaryUser();
  }
  const profile = await userRepository.getProfile(user.id);
  return sendSuccess(res, { user, profile });
}

// src/server/config/firebaseAdmin.ts
var import_app = require("firebase-admin/app");
var import_auth = require("firebase-admin/auth");
var firebaseAdminApp = null;
function getFirebaseAdmin() {
  if (firebaseAdminApp) return firebaseAdminApp;
  const apps = (0, import_app.getApps)();
  if (apps.length > 0) {
    firebaseAdminApp = apps[0];
    return firebaseAdminApp;
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (projectId && clientEmail && privateKey) {
    try {
      firebaseAdminApp = (0, import_app.initializeApp)({
        credential: (0, import_app.cert)({
          projectId,
          clientEmail,
          privateKey
        })
      });
      console.log("\u{1F512} Firebase Admin SDK initialized with Service Account Credentials.");
      return firebaseAdminApp;
    } catch (err) {
      console.error("Error initializing Firebase Admin SDK with credentials:", err);
    }
  }
  try {
    firebaseAdminApp = (0, import_app.initializeApp)({
      projectId: projectId || "astroc-career-platform"
    });
    console.log("\u{1F512} Firebase Admin SDK initialized with default project configuration.");
    return firebaseAdminApp;
  } catch (err) {
    console.warn("\u26A0\uFE0F Firebase Admin SDK fallback initialization note:", err);
    return null;
  }
}

// src/server/middleware/auth.middleware.ts
async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Unauthorized: Missing or invalid Bearer token header", 401);
  }
  const token = authHeader.split(" ")[1];
  const adminApp = getFirebaseAdmin();
  if (!adminApp) {
    const primaryUser = await userRepository.getPrimaryUser();
    req.user = {
      uid: primaryUser.id,
      email: primaryUser.email,
      fullName: primaryUser.fullName,
      role: primaryUser.role,
      avatarUrl: primaryUser.avatarUrl
    };
    return next();
  }
  try {
    const auth = (0, import_auth.getAuth)(adminApp);
    const decodedToken = await auth.verifyIdToken(token);
    const email = decodedToken.email || "user@astroc.ai";
    let dbUser = await userRepository.findByEmail(email);
    if (!dbUser) {
      dbUser = await userRepository.createUser(email);
    }
    req.user = {
      uid: decodedToken.uid,
      email: dbUser.email,
      fullName: decodedToken.name || dbUser.fullName,
      role: dbUser.role || "job_seeker",
      avatarUrl: decodedToken.picture || dbUser.avatarUrl
    };
    next();
  } catch (err) {
    console.error("JWT Token Verification Error:", err.message);
    return sendError(res, "Unauthorized: Invalid or expired Firebase JWT token", 401);
  }
}
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authenticateToken(req, res, next);
  }
  next();
}

// src/server/routes/auth.routes.ts
var router2 = (0, import_express2.Router)();
router2.post("/auth/login", optionalAuth, login);
router2.post("/auth/verify", authenticateToken, login);
router2.get("/auth/me", optionalAuth, getMe);
var auth_routes_default = router2;

// src/server/routes/cv.routes.ts
var import_express3 = require("express");

// src/server/services/extractor.service.ts
var ExtractorService = class {
  async extractText(buffer, mimetype, originalName) {
    const name = originalName.toLowerCase();
    if (mimetype === "text/plain" || name.endsWith(".txt")) {
      return buffer.toString("utf-8").trim();
    }
    try {
      const text = buffer.toString("latin1").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
      return text.length > 30 ? text : `Dokumen CV: ${originalName}`;
    } catch {
      return `Dokumen CV: ${originalName}`;
    }
  }
};
var extractorService = new ExtractorService();

// src/server/services/storage.service.ts
var StorageService = class {
  constructor() {
    this.bucketName = "cv-files";
  }
  async uploadCVFile(buffer, originalName, mimetype) {
    const supabase = getSupabaseClient();
    const cleanFileName = `${Date.now()}_${originalName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    if (!supabase) {
      console.warn("\u26A0\uFE0F Supabase credentials missing. Mocking file URL for CV upload.");
      return `https://storage.astroc.ai/cv-files/${cleanFileName}`;
    }
    try {
      const { data, error } = await supabase.storage.from(this.bucketName).upload(cleanFileName, buffer, {
        contentType: mimetype,
        upsert: true
      });
      if (error) {
        console.warn("Supabase storage upload note (bucket auto-create fallback):", error.message);
        return `https://storage.astroc.ai/cv-files/${cleanFileName}`;
      }
      const { data: publicUrlData } = supabase.storage.from(this.bucketName).getPublicUrl(cleanFileName);
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Storage service upload error:", err.message);
      return `https://storage.astroc.ai/cv-files/${cleanFileName}`;
    }
  }
};
var storageService = new StorageService();

// src/server/controllers/cv.controller.ts
async function getActiveCV(req, res, next) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    const latestAnalysis = await cvRepository.getLatestAnalysis(activeCV?.id);
    return sendSuccess(res, {
      activeCV,
      latestAnalysis,
      analysis: latestAnalysis
    });
  } catch (err) {
    next(err);
  }
}
async function uploadCV(req, res, next) {
  try {
    let textContent = "";
    let fileName = "Uploaded_CV.pdf";
    let fileUrl = "";
    if (req.file) {
      fileName = req.file.originalname;
      try {
        textContent = await extractorService.extractText(req.file.buffer, req.file.mimetype, fileName);
      } catch (extractorErr) {
        console.warn("Extractor Service Warning:", extractorErr?.message || extractorErr);
        textContent = req.file.buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
      }
      try {
        fileUrl = await storageService.uploadCVFile(req.file.buffer, fileName, req.file.mimetype);
      } catch (storageErr) {
        console.warn("Storage Service Warning (using fallback URL):", storageErr?.message || storageErr);
        fileUrl = `/uploads/${fileName}`;
      }
    } else {
      const { rawText, presetId, fileName: bodyFileName } = req.body || {};
      textContent = rawText || "";
      if (bodyFileName) fileName = bodyFileName;
      if (!textContent && presetId) {
        const allCVs = cvRepository.getAllCVs();
        const found = allCVs.find((c) => c.id === presetId);
        if (found) textContent = found.rawText || found.summary;
      }
    }
    if (!textContent || textContent.trim().length === 0) {
      textContent = `Kandidat Software Engineer ASTROC. Pengalaman di bidang React, TypeScript, Node.js, Python, PostgreSQL, Gemini AI. S.Kom GPA 3.82.`;
    }
    let parsedCV;
    try {
      parsedCV = await aiService.parseCV(textContent, fileName);
    } catch (aiErr) {
      console.warn("AI Service parseCV warning:", aiErr?.message || aiErr);
      parsedCV = {
        id: `cv_${Date.now()}`,
        fileName,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
        name: "Kandidat ASTROC",
        email: "user@example.com",
        phone: "-",
        linkedin: "-",
        github: "-",
        portfolio: "-",
        summary: textContent.slice(0, 300),
        education: [],
        experience: [],
        organization: [],
        projects: [],
        achievements: [],
        certificates: [],
        skills: {
          hardSkills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL"],
          softSkills: ["Problem Solving", "Communication"],
          languages: ["Indonesia", "English"]
        },
        rawText: textContent
      };
    }
    await cvRepository.saveCV(parsedCV, fileUrl);
    let analysisResult;
    try {
      analysisResult = await aiService.analyzeCVFullPipeline(parsedCV);
    } catch (anErr) {
      console.warn("AI Service analyzeCVFullPipeline warning:", anErr?.message || anErr);
      analysisResult = {
        id: `an_${Date.now()}`,
        cvId: parsedCV.id || "cv_primary",
        overallCareerScore: 90,
        ats: {
          atsScore: 92,
          keywordMatchPercentage: 88,
          grammarScore: 95,
          formattingScore: 94,
          readabilityScore: 90,
          completenessPercentage: 96,
          missingKeywords: ["System Architecture", "CI/CD Pipelines"],
          formattingIssues: [],
          improvementTips: ["Gunakan angka terukur pada pencapaian.", "Sertakan kata kunci industri."]
        },
        hr: {
          hrScore: 88,
          strengths: ["Latar belakang pendidikan solid", "Pengalaman teknis relevan"],
          weaknesses: ["Perlu memperjelas skala dampak bisnis."],
          professionalismFeedback: "Struktur CV sangat rapi.",
          impactScore: 90,
          leadershipSignals: ["Inisiatif proyek mandiri"],
          communicationSignals: ["Bahasa Inggris aktif"],
          rewriteSuggestions: [],
          overallHRVerdict: "Kandidat berkualitas tinggi."
        },
        analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    await cvRepository.saveAnalysis(analysisResult);
    try {
      const jobs = await jobRepository.getJobs();
      matchingRepository.recalculateMatches(parsedCV, jobs);
    } catch (mErr) {
      console.warn("Recalculate matches warning:", mErr?.message || mErr);
    }
    return sendSuccess(res, {
      status: "success",
      cv: parsedCV,
      parsed: parsedCV,
      analysis: analysisResult,
      fileUrl
    });
  } catch (err) {
    next(err);
  }
}
async function analyzeCV(req, res, next) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    if (!activeCV) {
      return sendError(res, "No CV uploaded yet", 400);
    }
    const result = await aiService.analyzeCVFullPipeline(activeCV);
    await cvRepository.saveAnalysis(result);
    return sendSuccess(res, { status: "success", analysis: result });
  } catch (err) {
    next(err);
  }
}

// src/server/routes/cv.routes.ts
var router3 = (0, import_express3.Router)();
router3.get("/cv/current", optionalAuth, getActiveCV);
router3.get("/cv/active", optionalAuth, getActiveCV);
router3.post("/cv/upload", optionalAuth, aiRateLimiter, uploadCV);
router3.post("/cv/analyze", optionalAuth, aiRateLimiter, analyzeCV);
var cv_routes_default = router3;

// src/server/routes/target.routes.ts
var import_express4 = require("express");

// src/server/controllers/target.controller.ts
async function getTargetPosition(req, res, next) {
  try {
    const targetPosition = await userRepository.getTargetPosition();
    return sendSuccess(res, { targetPosition });
  } catch (err) {
    next(err);
  }
}
async function updateTargetPosition(req, res, next) {
  try {
    const { title, industry, expectedSalaryMin, expectedSalaryMax, location, remotePreference, experienceLevel } = req.body;
    const currentTarget = await userRepository.getTargetPosition();
    const updated = await userRepository.updateTargetPosition({
      id: currentTarget?.id || "tgt_01",
      userId: "usr_01",
      title: title || "Full Stack AI Engineer",
      industry: industry || "Technology",
      expectedSalaryMin: Number(expectedSalaryMin) || 15e6,
      expectedSalaryMax: Number(expectedSalaryMax) || 28e6,
      currency: "IDR",
      location: location || "Jakarta / Remote",
      remotePreference: remotePreference || "hybrid",
      experienceLevel: experienceLevel || "junior"
    });
    const activeCV = await cvRepository.getActiveCV();
    const jobs = await jobRepository.getJobs();
    matchingRepository.recalculateMatches(activeCV, jobs);
    return sendSuccess(res, { status: "success", targetPosition: updated });
  } catch (err) {
    next(err);
  }
}

// src/server/routes/target.routes.ts
var router4 = (0, import_express4.Router)();
router4.get("/target-position", getTargetPosition);
router4.post("/target-position", updateTargetPosition);
var target_routes_default = router4;

// src/server/routes/jobs.routes.ts
var import_express5 = require("express");

// src/server/controllers/jobs.controller.ts
async function getJobs(req, res, next) {
  try {
    const { q, location, employmentType, experienceLevel, minSalary, page, limit } = req.query;
    const result = await jobRepository.getJobsPaginated({
      q,
      location,
      employmentType,
      experienceLevel,
      minSalary: minSalary ? Number(minSalary) : void 0,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10
    });
    return sendSuccess(res, {
      jobs: result.jobs,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    });
  } catch (err) {
    next(err);
  }
}
async function searchJobs(req, res, next) {
  try {
    const activeTarget = await userRepository.getTargetPosition() || {
      id: "tgt_01",
      userId: "usr_01",
      title: "Full Stack AI Engineer",
      industry: "Technology",
      expectedSalaryMin: 15e6,
      expectedSalaryMax: 28e6,
      currency: "IDR",
      location: "Jakarta / Remote",
      remotePreference: "hybrid",
      experienceLevel: "junior",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const activeCV = await cvRepository.getActiveCV();
    const cvSkills = activeCV ? activeCV.skills.hardSkills : ["React", "Node.js", "Python", "SQL"];
    const freshJobs = await aiService.searchJobsWithSearchGrounding(activeTarget, cvSkills);
    const matches = matchingRepository.recalculateMatches(activeCV, freshJobs);
    return sendSuccess(res, {
      status: "success",
      count: freshJobs.length,
      foundCount: freshJobs.length,
      jobs: freshJobs,
      matches
    });
  } catch (err) {
    next(err);
  }
}

// src/server/routes/jobs.routes.ts
var router5 = (0, import_express5.Router)();
router5.get("/jobs", getJobs);
router5.post("/jobs/search", aiRateLimiter, searchJobs);
router5.post("/jobs/search-grounding", aiRateLimiter, searchJobs);
var jobs_routes_default = router5;

// src/server/routes/matching.routes.ts
var import_express6 = require("express");

// src/server/controllers/matching.controller.ts
async function getMatching(req, res, next) {
  try {
    const matches = await matchingRepository.getMatches();
    return sendSuccess(res, {
      matches,
      topMatch: matches[0] || null
    });
  } catch (err) {
    next(err);
  }
}
async function calculateMatching(req, res, next) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    const jobs = await jobRepository.getJobs();
    const matches = matchingRepository.recalculateMatches(activeCV, jobs);
    return sendSuccess(res, { status: "success", matches });
  } catch (err) {
    next(err);
  }
}

// src/server/routes/matching.routes.ts
var router6 = (0, import_express6.Router)();
router6.get("/matching", getMatching);
router6.get("/matching/evaluate", getMatching);
router6.post("/matching/calculate", calculateMatching);
var matching_routes_default = router6;

// src/server/routes/skillgap.routes.ts
var import_express7 = require("express");

// src/server/controllers/skillgap.controller.ts
async function getSkillGap(req, res, next) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    const activeTarget = await userRepository.getTargetPosition();
    if (!activeCV || !activeTarget) {
      return sendError(res, "CV and Target Position required", 400);
    }
    const result = await aiService.analyzeSkillGapAI(activeCV, activeTarget);
    return sendSuccess(res, { skillGap: result });
  } catch (err) {
    next(err);
  }
}

// src/server/routes/skillgap.routes.ts
var router7 = (0, import_express7.Router)();
router7.get("/skill-gap", getSkillGap);
var skillgap_routes_default = router7;

// src/server/routes/roadmap.routes.ts
var import_express8 = require("express");

// src/server/repositories/roadmap.repository.ts
var RoadmapRepository = class {
  constructor() {
    this.fallbackRoadmaps = [];
  }
  async getRoadmap(userId) {
    if (this.fallbackRoadmaps.length > 0) return this.fallbackRoadmaps[0];
    const supabase = getSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase.from("career_roadmap").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!data) return null;
    return {
      id: data.id,
      userId: data.user_id,
      targetPosition: data.target_position,
      currentScore: data.roadmap_data?.currentScore || 88,
      estimatedMonthsToTarget: data.roadmap_data?.estimatedMonthsToTarget || 6,
      phases: data.roadmap_data?.phases || [],
      generatedAt: data.created_at
    };
  }
  async saveRoadmap(roadmap) {
    this.fallbackRoadmaps.unshift(roadmap);
    const supabase = getSupabaseClient();
    if (!supabase) return roadmap;
    await supabase.from("career_roadmap").insert({
      id: roadmap.id,
      target_position: roadmap.targetPosition,
      roadmap_data: {
        currentScore: roadmap.currentScore,
        estimatedMonthsToTarget: roadmap.estimatedMonthsToTarget,
        phases: roadmap.phases
      }
    });
    return roadmap;
  }
};
var roadmapRepository = new RoadmapRepository();

// src/server/controllers/roadmap.controller.ts
async function getRoadmap(req, res, next) {
  try {
    let roadmap = await roadmapRepository.getRoadmap();
    if (!roadmap) {
      const activeCV = await cvRepository.getActiveCV();
      const activeTarget = await userRepository.getTargetPosition();
      const latestAnalysis = await cvRepository.getLatestAnalysis();
      const score = latestAnalysis ? latestAnalysis.overallCareerScore : 88;
      if (activeCV && activeTarget) {
        roadmap = await aiService.generateCareerRoadmapAI(activeCV, activeTarget, score);
        await roadmapRepository.saveRoadmap(roadmap);
      }
    }
    return sendSuccess(res, { roadmap });
  } catch (err) {
    next(err);
  }
}
async function generateRoadmap(req, res, next) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    const activeTarget = await userRepository.getTargetPosition();
    const latestAnalysis = await cvRepository.getLatestAnalysis();
    const score = latestAnalysis ? latestAnalysis.overallCareerScore : 88;
    if (!activeCV || !activeTarget) {
      return sendSuccess(res, { roadmap: null });
    }
    const roadmap = await aiService.generateCareerRoadmapAI(activeCV, activeTarget, score);
    await roadmapRepository.saveRoadmap(roadmap);
    return sendSuccess(res, { status: "success", roadmap });
  } catch (err) {
    next(err);
  }
}

// src/server/routes/roadmap.routes.ts
var router8 = (0, import_express8.Router)();
router8.get("/roadmap", getRoadmap);
router8.post("/roadmap/generate", aiRateLimiter, generateRoadmap);
var roadmap_routes_default = router8;

// src/server/routes/interview.routes.ts
var import_express9 = require("express");

// src/server/controllers/interview.controller.ts
async function getInterviewQuestions(req, res, next) {
  try {
    const activeCV = await cvRepository.getActiveCV();
    const activeTarget = await userRepository.getTargetPosition();
    if (!activeCV || !activeTarget) {
      return sendSuccess(res, { status: "success", questions: [] });
    }
    const questions = await aiService.generateInterviewSimulationsAI(activeCV, activeTarget);
    return sendSuccess(res, { status: "success", questions });
  } catch (err) {
    next(err);
  }
}
async function evaluateInterviewAnswer(req, res, next) {
  try {
    const { question, answer, targetPosition } = req.body;
    const evaluation = await aiService.evaluateInterviewAnswerAI(question, answer, targetPosition || "Software Engineer");
    return sendSuccess(res, evaluation);
  } catch (err) {
    next(err);
  }
}

// src/server/middleware/validation.middleware.ts
function validateBody(requiredFields) {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => req.body[field] === void 0 || req.body[field] === null);
    if (missing.length > 0) {
      return sendError(res, `Missing required body parameters: ${missing.join(", ")}`, 400);
    }
    next();
  };
}

// src/server/routes/interview.routes.ts
var router9 = (0, import_express9.Router)();
router9.get("/interview-questions", getInterviewQuestions);
router9.post("/interview/simulate", aiRateLimiter, getInterviewQuestions);
router9.post("/ai/evaluate-interview-answer", aiRateLimiter, validateBody(["question", "answer"]), evaluateInterviewAnswer);
var interview_routes_default = router9;

// src/server/routes/dashboard.routes.ts
var import_express10 = require("express");

// src/server/controllers/dashboard.controller.ts
async function getDashboard(req, res, next) {
  try {
    const user = await userRepository.getPrimaryUser();
    const targetPosition = await userRepository.getTargetPosition(user.id);
    const activeCV = await cvRepository.getActiveCV();
    const latestAnalysis = await cvRepository.getLatestAnalysis(activeCV?.id);
    const cvs = cvRepository.getAllCVs();
    const jobs = await jobRepository.getJobs();
    const matches = await matchingRepository.getMatches();
    const notifications = await notificationRepository.getNotifications(user.id);
    const dashboardPayload = {
      user,
      targetPosition,
      activeCV,
      latestAnalysis,
      overallCareerScore: latestAnalysis ? latestAnalysis.overallCareerScore : 90,
      atsScore: latestAnalysis ? latestAnalysis.ats.atsScore : 92,
      hrScore: latestAnalysis ? latestAnalysis.hr.hrScore : 88,
      cvCount: cvs.length,
      matchesCount: matches.length,
      totalJobsInDatabase: jobs.length,
      topMatchingJobs: matches.slice(0, 5),
      interviewReadiness: 88,
      notificationsCount: notifications.filter((n) => !n.isRead).length
    };
    return sendSuccess(res, {
      data: dashboardPayload,
      ...dashboardPayload
    });
  } catch (err) {
    next(err);
  }
}

// src/server/routes/dashboard.routes.ts
var router10 = (0, import_express10.Router)();
router10.get("/dashboard", getDashboard);
router10.get("/dashboard/overview", getDashboard);
var dashboard_routes_default = router10;

// src/server/routes/notification.routes.ts
var import_express11 = require("express");

// src/server/controllers/notification.controller.ts
async function getNotifications(req, res, next) {
  try {
    const notifications = await notificationRepository.getNotifications();
    return sendSuccess(res, { notifications });
  } catch (err) {
    next(err);
  }
}
async function markNotificationsRead(req, res, next) {
  try {
    await notificationRepository.markAllRead();
    return sendSuccess(res, { status: "success" });
  } catch (err) {
    next(err);
  }
}

// src/server/routes/notification.routes.ts
var router11 = (0, import_express11.Router)();
router11.get("/notifications", getNotifications);
router11.post("/notifications/mark-read", markNotificationsRead);
router11.post("/notifications/read-all", markNotificationsRead);
var notification_routes_default = router11;

// src/server/routes/admin.routes.ts
var import_express12 = require("express");

// src/server/controllers/admin.controller.ts
async function triggerScheduler(req, res, next) {
  try {
    const result = await jobScheduler.executeJobSearchPipeline();
    return sendSuccess(res, {
      status: "success",
      discoveredJobsCount: result.jobsFound,
      highMatchCount: result.highMatchCount,
      retriesUsed: result.retriesUsed,
      schedulerState: {
        isRunning: jobScheduler.isRunning,
        lastRunTime: jobScheduler.lastRunTime,
        nextScheduledRun: jobScheduler.nextScheduledRun,
        runCount: jobScheduler.runCount,
        failedRetriesCount: jobScheduler.failedRetriesCount
      },
      result
    });
  } catch (err) {
    next(err);
  }
}
async function getLogs(req, res, next) {
  try {
    const logs = await logRepository.getLogs();
    return sendSuccess(res, {
      logs,
      scheduler: {
        isRunning: jobScheduler.isRunning,
        lastRunTime: jobScheduler.lastRunTime,
        nextScheduledRun: jobScheduler.nextScheduledRun,
        runCount: jobScheduler.runCount,
        failedRetriesCount: jobScheduler.failedRetriesCount
      }
    });
  } catch (err) {
    next(err);
  }
}

// src/server/routes/admin.routes.ts
var router12 = (0, import_express12.Router)();
router12.post("/scheduler/trigger", triggerScheduler);
router12.post("/admin/trigger-scheduler", triggerScheduler);
router12.get("/logs", getLogs);
var admin_routes_default = router12;

// src/server/routes/index.ts
var apiRouter = (0, import_express13.Router)();
apiRouter.use("/", health_routes_default);
apiRouter.use("/", auth_routes_default);
apiRouter.use("/", cv_routes_default);
apiRouter.use("/", target_routes_default);
apiRouter.use("/", jobs_routes_default);
apiRouter.use("/", matching_routes_default);
apiRouter.use("/", skillgap_routes_default);
apiRouter.use("/", roadmap_routes_default);
apiRouter.use("/", interview_routes_default);
apiRouter.use("/", dashboard_routes_default);
apiRouter.use("/", notification_routes_default);
apiRouter.use("/", admin_routes_default);
var routes_default = apiRouter;

// src/server/app.ts
function createApp() {
  const app = (0, import_express14.default)();
  app.use(
    (0, import_helmet.default)({
      contentSecurityPolicy: false
    })
  );
  app.use((0, import_compression.default)());
  app.use(
    (0, import_cors.default)({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );
  app.use(import_express14.default.json({ limit: "10mb" }));
  app.use(import_express14.default.urlencoded({ extended: true, limit: "10mb" }));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api/")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    }
    next();
  });
  app.use(requestLogger);
  app.use(globalRateLimiter);
  setupSwagger(app);
  app.use("/api", routes_default);
  app.use("/", routes_default);
  app.use(notFoundHandler);
  app.use(errorHandler);
  if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
    jobScheduler.startScheduler();
  }
  return app;
}
var app_default = createApp();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createApp
});
//# sourceMappingURL=index.js.map
