/**
 * seed.js — One-time data migration script
 *
 * Seeds the Supabase site_content table with the portfolio's initial content.
 * Run ONCE after setting up Supabase:
 *
 *   node scripts/seed.js
 *
 * Prerequisites:
 *   1. Create a .env file at the project root with:
 *      VITE_SUPABASE_URL=https://your-project.supabase.co
 *      VITE_SUPABASE_ANON_KEY=your-anon-key
 *   2. Run the SQL from scripts/setup.sql in your Supabase SQL editor first.
 *
 * Note: This script uses the anon key, so it requires that you have NO
 * restrictive insert policy blocking anon users, OR you temporarily disable RLS
 * for the seed, then re-enable it.
 *
 * Alternatively, use the Supabase service role key (never commit it):
 *   SUPABASE_SERVICE_KEY=your-service-role-key node scripts/seed.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (no dotenv dependency needed)
function loadEnv() {
  const envPath = resolve(__dirname, '../.env');
  try {
    const raw = readFileSync(envPath, 'utf8');
    raw.split('\n').forEach((line) => {
      const [key, ...rest] = line.split('=');
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim();
      }
    });
  } catch {
    console.error('Could not read .env file. Make sure it exists at the project root.');
    process.exit(1);
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or anon key in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ── CONTENT (mirrors CONFIG in App.jsx) ───────────────────────────────────────

const seed = {
  id: 1,

  hero: {
    name: "Swayam Gosavi",
    headline: "backend, ai, cloud engineer",
    location: "Pune, India",
    openToWork: true,
  },

  stats: {
    yearsExperience: "3",
    recordsProcessed: "15M+",
    projectsBuilt: "10",
  },

  about: {
    intro: "software developer, building tech for the love of it.",
    paragraphs: [
      "Backend, AI and Cloud Engineer based in Pune with a love to build and ship things that solve problems, because I enjoy solving problems.",
      "Lately, in backend, I have been working on networking, which helps me understand how overcoming networking level bottlenecks of a built system enhances the throughput of it.",
      "In AI, I am diving deep into agentic ai and its real world applications. Efficient agent orchestration interests me the most. Working in stealth on a potential agentic SaaS.",
      "Apart from Backend and AI, I also have explored Cybersecurity, Blockchain and Edge computing. I love working at the confluence of various domains and diving deep into the complexities of them.",
    ],
  },

  skills: {
    languages: ["Python", "Go", "TypeScript", "Java", "C", "C++"],
    frameworks: ["FastAPI", "Flask", "Gin", "Celery", "Prisma"],
    infrastructure: ["AWS", "Docker", "Kubernetes", "Terraform", "PostgreSQL", "Redis", "GCP", "Azure"],
    aiml: ["LangChain", "LangGraph", "HuggingFace", "Pinecone", "OpenAI API", "FAISS"],
  },

  experience: [
    {
      id: "exp-1",
      role: "software developer",
      company: "Tecnvirons Pvt Ltd",
      employmentType: "internship",
      location: "remote · pune",
      startDate: "Jul 2025",
      endDate: "Jan 2026",
      duration: "6 months",
      description: [
        "architected, built and shipped the complete multitenant b2b ai-telecalling system in just a month",
        "designed rag-langchain systems, built ai-voice calling using google adk, integrated meta apis (wabAs, ads, instagram) into crm, along with payment gateway",
        "owned azure infra — my product generated more than 50% of the startup revenue",
      ],
      techStack: ["python", "typescript", "fastapi", "langchain", "redis", "azure", "docker", "google-adk"],
      displayOrder: 1,
    },
    {
      id: "exp-2",
      role: "web-master",
      company: "PICT IEEE Student Branch",
      employmentType: "contributor",
      location: "pune",
      startDate: "Oct 2023",
      endDate: "present",
      description: [
        "serving as the current web-development head at pict ieee student branch, contributing to the development of many projects serving college students",
        "built mcq platforms, main e-commerce websites, online judge and cp platforms",
        "the projects I contributed in served 3000+ students across pune and atleast 400+ in college",
      ],
      techStack: ["javascript", "typescript", "python", "docker", "aws", "gcp", "postgres", "mongodb"],
      displayOrder: 2,
    },
  ],

  currently_building: [
    {
      id: "build-1",
      name: "indexgpt",
      description: ["an index for chat-apps and a unified memory for different chat-apps"],
      status: "active",
      githubUrl: "https://github.com/theinfinity1410/indexgpt",
      techStack: ["javascript", "python", "fastapi", "openai", "gemini", "anthropic"],
      progressPercent: 30,
      displayOrder: 1,
    },
    {
      id: "build-2",
      name: "network-protocol",
      description: ["a learning project, a network protocol built on the top of TCP/IP stack"],
      status: "active",
      githubUrl: "https://github.com/theinfinity1410",
      techStack: ["Go", "C++"],
      progressPercent: 5,
      displayOrder: 2,
    },
  ],

  projects: [
    {
      id: "proj-1", name: "online-judge", metric: "300+", metricLabel: "college-students",
      description: ["an online judge built from scratch for intra-college coding competitions", "served concurrent 300+ users"],
      githubUrl: "https://github.com/maitreya-16/my-online-judge",
      techStack: ["python", "javascript", "postgresql", "flask", "redis", "celery", "docker", "aws", "gcp"],
      featured: true, displayOrder: 1,
    },
    {
      id: "proj-2", name: "quicksilver", metric: "10+", metricLabel: "instant frontends",
      description: ["a real-time fast ai code generation platform for on-the-go, sandboxed, prod-ready node.js frontends"],
      githubUrl: "https://github.com/theinfinity1410/QuickSilver",
      techStack: ["typescript", "web-containers", "postgresql", "websockets", "aws"],
      featured: true, displayOrder: 2,
    },
    {
      id: "proj-3", name: "phason", metric: "100+", metricLabel: "npm downloads",
      description: ["an intelligent cli tool that generates custom toned git commit messages, uses git diff, distributed on npm"],
      githubUrl: "https://www.npmjs.com/package/phason",
      techStack: ["typescript", "ollama", "npm"],
      featured: true, displayOrder: 3,
    },
    {
      id: "proj-4", name: "credenz-backend", metric: "10000+", metricLabel: "users",
      description: ["a management system website built for our pisb club's flagship event. handled 100000 users concurrent data"],
      githubUrl: "https://github.com/Vic710/Credenz26Backend/",
      techStack: ["typescript", "prisma", "postgresql", "aws", "gcp"],
      featured: true, displayOrder: 4,
    },
  ],

  also_built: [
    { id: "also-1", name: "distributed computing using raspberry pi cluster", description: ["a home-lab server built from cluster of 3 raspberry pis doing distributed and parallel computing."], techStack: ["python", "redis", "linux", "mpi-python", "aws"], displayOrder: 1 },
    { id: "also-2", name: "financial modelling using monte-carlo algorithm simulator", description: ["ran a var financial model simulator on the homelab server I built, using montecarlo algorithm"], techStack: ["python", "redis", "aws"], displayOrder: 2 },
    { id: "also-3", name: "blockchain based social media web-app", description: ["built a blockchain based social media web-app to learn blockchain"], techStack: ["javascript", "react", "solana", "metamask", "ethereum"], displayOrder: 3 },
    { id: "also-4", name: "basic ad-blocker", description: ["a basic ad-blocker extension just because I was bored"], techStack: ["javascript"], displayOrder: 4 },
    { id: "also-5", name: "portfolio-ai", description: ["gave an ai api info about me and made a bot which served as my assistant. Primary objective was to practice prompt engineering"], techStack: ["typescript", "groq"], displayOrder: 5 },
  ],

  contact: {
    email: "swayamgosavi1410@gmail.com",
    github: "github.com/theinfinity1410",
    linkedin: "linkedin.com/in/infinity1410",
  },

  resume: {
    fileName: "resume.pdf",
    url: "/resume.pdf",
    lastUpdated: "",
  },

  seo: {
    title: "Swayam Gosavi — Backend, AI & Cloud Engineer",
    description: "building, breaking and shipping tech, in the deep rabbit holes of backend, agentic ai, cloud-infra.",
  },
};

// ── RUN SEED ─────────────────────────────────────────────────────────────────

async function run() {
  console.log('🌱 Seeding site_content...');
  const { error } = await supabase
    .from('site_content')
    .upsert(seed, { onConflict: 'id' });

  if (error) {
    console.error('❌ Seed failed:', error.message);
    if (error.message.includes('row-level security')) {
      console.log('\n💡 Tip: RLS is blocking the insert. Options:');
      console.log('   1. Temporarily disable RLS in Supabase dashboard → Table Editor → site_content → disable RLS');
      console.log('   2. Use SUPABASE_SERVICE_KEY instead of the anon key:');
      console.log('      SUPABASE_SERVICE_KEY=your-service-role-key node scripts/seed.js');
    }
    process.exit(1);
  }

  console.log('✅ Seed complete! site_content row 1 upserted successfully.');
  console.log('\nNext steps:');
  console.log('  1. Visit /admin in your browser and sign in');
  console.log('  2. Your portfolio is now live and editable!');
  console.log('  3. Remember to update YOUR-USER-UUID in setup.sql RLS policies');
}

run();
