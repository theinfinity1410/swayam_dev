/*
  EMAILJS SETUP (takes ~5 min):
  1. Go to emailjs.com → create free account
  2. Add Service → connect your Gmail
  3. Email Templates → create template with these variables:
       Subject: "Portfolio contact from {{from_name}}"
       Body:    Name: {{from_name}}
                Email: {{from_email}}
                Message: {{message}}
  4. Copy Service ID → CONFIG.emailjs.serviceId
  5. Copy Template ID → CONFIG.emailjs.templateId
  6. Account → API Keys → Public Key → CONFIG.emailjs.publicKey

  CMS SETUP:
  1. Create a Supabase project at supabase.com
  2. Run the SQL from scripts/setup.sql in the Supabase SQL editor
  3. Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
  4. Run `node scripts/seed.js` to seed initial content
  5. Visit /admin to log in and enter edit mode
*/

import { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import { CMSContext } from './context/CMSContext';
import { useAuth } from './hooks/useAuth';
import { useContent } from './hooks/useContent';
import AdminLogin from './components/AdminLogin';
import CMSToolbar from './components/cms/CMSToolbar';
import EditableText from './components/cms/EditableText';
import EditableTextarea from './components/cms/EditableTextarea';
import EditableSkills from './components/cms/EditableSkills';
import EditableExperience from './components/cms/EditableExperience';
import EditableProject from './components/cms/EditableProject';
import ResumeUpload from './components/cms/ResumeUpload';

/* ═══════════════════════════════════════════════
   LOCAL FALLBACK CONFIG
   Used when Supabase is not configured or unreachable.
   Also used as seed data (see scripts/seed.js).
   ═══════════════════════════════════════════════ */
export const CONFIG = {
  emailjs: {
    serviceId: "service_jsv6s4b",
    templateId: "template_j2906jv",
    publicKey: "PXUnN2AtGOOMoLDhD",
  },

  // Supabase stats usernames (not editable via CMS)
  githubUsername: "theinfinity1410",
  leetcodeUsername: "infinity1410",

  // Fallback content (mirrors Supabase schema)
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
      id: "proj-1",
      name: "online-judge",
      metric: "300+",
      metricLabel: "college-students",
      description: ["an online judge built from scratch for intra-college coding competitions", "served concurrent 300+ users"],
      githubUrl: "https://github.com/maitreya-16/my-online-judge",
      techStack: ["python", "javascript", "postgresql", "flask", "redis", "celery", "docker", "aws", "gcp"],
      featured: true,
      displayOrder: 1,
    },
    {
      id: "proj-2",
      name: "quicksilver",
      metric: "10+",
      metricLabel: "instant frontends",
      description: ["a real-time fast ai code generation platform for on-the-go, sandboxed, prod-ready node.js frontends"],
      githubUrl: "https://github.com/theinfinity1410/QuickSilver",
      techStack: ["typescript", "web-containers", "postgresql", "websockets", "aws"],
      featured: true,
      displayOrder: 2,
    },
    {
      id: "proj-3",
      name: "phason",
      metric: "100+",
      metricLabel: "npm downloads",
      description: ["an intelligent cli tool that generates custom toned git commit messages, uses git diff, distributed on npm"],
      githubUrl: "https://www.npmjs.com/package/phason",
      techStack: ["typescript", "ollama", "npm"],
      featured: true,
      displayOrder: 3,
    },
    {
      id: "proj-4",
      name: "credenz-backend",
      metric: "10000+",
      metricLabel: "users",
      description: ["a management system website built for our pisb club's flagship event. handled 100000 users concurrent data"],
      githubUrl: "https://github.com/Vic710/Credenz26Backend/",
      techStack: ["typescript", "prisma", "postgresql", "aws", "gcp"],
      featured: true,
      displayOrder: 4,
    },
  ],

  also_built: [
    {
      id: "also-1",
      name: "distributed computing using raspberry pi cluster",
      description: ["a home-lab server built from cluster of 3 raspberry pis doing distributed and parallel computing."],
      techStack: ["python", "redis", "linux", "mpi-python", "aws"],
      displayOrder: 1,
    },
    {
      id: "also-2",
      name: "financial modelling using monte-carlo algorithm simulator",
      description: ["ran a var financial model simulator on the homelab server I built, using montecarlo algorithm"],
      techStack: ["python", "redis", "aws"],
      displayOrder: 2,
    },
    {
      id: "also-3",
      name: "blockchain based social media web-app",
      description: ["built a blockchain based social media web-app to learn blockchain"],
      techStack: ["javascript", "react", "solana", "metamask", "ethereum"],
      displayOrder: 3,
    },
    {
      id: "also-4",
      name: "basic ad-blocker",
      description: ["a basic ad-blocker extension just because I was bored"],
      techStack: ["javascript"],
      displayOrder: 4,
    },
    {
      id: "also-5",
      name: "portfolio-ai",
      description: ["gave an ai api info about me and made a bot which served as my assistant. Primary objective was to practice prompt engineering"],
      techStack: ["typescript", "groq"],
      displayOrder: 5,
    },
  ],

  contact: {
    email: "swayamgosavi1410@gmail.com",
    github: "github.com/theinfinity1410",
    linkedin: "linkedin.com/in/infinity1410",
    phone: "+91 9822687804",
    twitter: "x.com/infinity1410",
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

/* ═══════════════════════════════════════════════
   HOOK: merge Supabase content with local fallback
   ═══════════════════════════════════════════════ */
function useResolvedContent(supabaseContent) {
  if (!supabaseContent) return CONFIG;
  return {
    ...CONFIG,
    hero: { ...CONFIG.hero, ...supabaseContent.hero },
    stats: { ...CONFIG.stats, ...supabaseContent.stats },
    about: { ...CONFIG.about, ...supabaseContent.about },
    skills: { ...CONFIG.skills, ...supabaseContent.skills },
    experience: supabaseContent.experience || CONFIG.experience,
    currently_building: supabaseContent.currently_building || CONFIG.currently_building,
    projects: supabaseContent.projects || CONFIG.projects,
    also_built: supabaseContent.also_built || CONFIG.also_built,
    contact: { ...CONFIG.contact, ...supabaseContent.contact },
    resume: { ...CONFIG.resume, ...supabaseContent.resume },
    seo: { ...CONFIG.seo, ...supabaseContent.seo },
  };
}

/* ═══════════════════════════════════════════════
   HELPER: highlight numbers in impact text
   ═══════════════════════════════════════════════ */
function HighlightedText({ text }) {
  const parts = text.split(/(\d[\d,+Mk%x]*\+?|\d+%|\b\d+\b)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\d/.test(part) ? (
          <span key={i} className="highlight">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════
   HOOK: IntersectionObserver section reveal
   ═══════════════════════════════════════════════ */
function useReveal(loading) {
  useEffect(() => {
    if (loading) return;
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.07 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);
}

/* ═══════════════════════════════════════════════
   COMPONENT: PDF Modal
   ═══════════════════════════════════════════════ */
function PDFModal({ onClose, resumeUrl }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    const url = resumeUrl || CONFIG.resume.url;
    if (typeof window.pdfjsLib === 'undefined') { setStatus('error'); return; }
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;

    window.pdfjsLib.getDocument(url).promise.then((pdf) => {
      if (cancelled) return;
      setStatus('rendered');
      const renderPage = async (pageNum) => {
        if (cancelled) return;
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = container.clientWidth - 48;
        const scale = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.style.width = '100%';
        container.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: scaledViewport }).promise;
        if (pageNum < pdf.numPages) await renderPage(pageNum + 1);
      };
      renderPage(1);
    }).catch(() => { if (!cancelled) setStatus('error'); });

    return () => { cancelled = true; };
  }, [resumeUrl]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = resumeUrl || CONFIG.resume.url;
    a.download = 'swayam_gosavi_resume.pdf';
    a.click();
  };

  return (
    <div className="pdf-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <span className="pdf-filename">resume.pdf</span>
          <div className="pdf-header-btns">
            <button className="pdf-header-btn" onClick={handleDownload}>download ↓</button>
            <button className="pdf-header-btn close-btn" onClick={onClose}>✕ close</button>
          </div>
        </div>
        <div className="pdf-canvas-container" ref={containerRef}>
          {status === 'loading' && <p className="pdf-status">loading resume...</p>}
          {status === 'error' && (
            <p className="pdf-status">
              could not load PDF —{' '}
              <a href={resumeUrl || CONFIG.resume.url} download style={{ color: 'var(--accent)' }}>
                download instead
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Nav
   ═══════════════════════════════════════════════ */
function Nav({ theme, toggleTheme, openPDF }) {
  const scrollTo = (id) => {
    document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav>
      <div className="nav-logo">
        ~/{CONFIG.hero.name.split(' ')[0].toLowerCase()}
        <span className="cursor" aria-hidden="true" />
      </div>
      <div className="nav-links">
        {['about', 'experience', 'projects', 'stats', 'contact'].map((s) => (
          <a key={s} href={`#${s}`} onClick={(e) => { e.preventDefault(); scrollTo(s); }}>
            {s}
          </a>
        ))}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'light mode' : 'dark mode'}
        >
          {theme === 'dark' ? '○' : '●'}
        </button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: SocialIcons
   ═══════════════════════════════════════════════ */
function SocialIcons({ contact }) {
  const waNumber = (contact.phone || '').replace(/[^0-9]/g, '');
  const ghUrl = contact.github ? (contact.github.startsWith('http') ? contact.github : `https://${contact.github}`) : 'https://github.com';
  const liUrl = contact.linkedin ? (contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`) : 'https://linkedin.com';
  const xUrl = contact.twitter ? (contact.twitter.startsWith('http') ? contact.twitter : `https://${contact.twitter}`) : 'https://x.com';

  return (
    <div className="social-icons">
      {/* GitHub */}
      <a className="social-icon-btn" href={ghUrl} target="_blank" rel="noopener noreferrer" title="GitHub">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      </a>

      {/* LinkedIn */}
      <a className="social-icon-btn" href={liUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>

      {/* X */}
      <a className="social-icon-btn" href={xUrl} target="_blank" rel="noopener noreferrer" title="X">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.246l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      {/* Gmail */}
      <a className="social-icon-btn" href={`mailto:${contact.email}`} title="Gmail">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
        </svg>
      </a>

      {/* WhatsApp */}
      {contact.phone && (
        <a className="social-icon-btn" href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" title="WhatsApp">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Hero
   ═══════════════════════════════════════════════ */
function Hero({ openPDF, content, updateSection }) {
  const hero = content.hero;
  const stats = content.stats;
  const contact = content.contact;

  const scrollToContact = () => {
    document.querySelector('[data-section="contact"]')?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveHero = (key) => async (val) => {
    await updateSection('hero', { ...hero, [key]: val });
  };

  const saveStats = (key) => async (val) => {
    await updateSection('stats', { ...stats, [key]: val });
  };

  const roles = hero.headline.split(', ');
  const waNumber = (contact.phone || '').replace(/[^0-9]/g, '');

  return (
    <section className="hero reveal">
      <div className="hero-tag hero-tag--accent">
        &gt;_ {roles.map((r) => r.toLowerCase()).join(' · ')}
      </div>

      <div className="hero-top">
        <h1 className="hero-name">
          <EditableText value={hero.name.split(' ')[0]} onSave={async (v) => {
            const parts = hero.name.split(' ');
            parts[0] = v;
            await updateSection('hero', { ...hero, name: parts.join(' ') });
          }} as="span" /><span className="hero-name-last">
          <EditableText value={hero.name.split(' ').slice(1).join(' ')} onSave={async (v) => {
            const first = hero.name.split(' ')[0];
            await updateSection('hero', { ...hero, name: `${first} ${v}` });
          }} as="span" />
          </span>
        </h1>
        {<div className="status-badge" data-field="status">
          <span className="status-dot" aria-hidden="true" />
          <EditableText value={hero.openToWork ? 'open to work' : 'not available'} onSave={async (v) => {
            await updateSection('hero', { ...hero, openToWork: v.toLowerCase().includes('open') });
          }} as="span" />
        </div>}
      </div>

      <p className="hero-role" data-field="role">
        $ <EditableText value={hero.headline} onSave={saveHero('headline')} as="span" /> · <EditableText value={hero.location} onSave={saveHero('location')} as="span" />
      </p>

      <div className="skimmer-bar">
        <div className="skim-stat">
          <span className="skim-number">
            <EditableText value={stats.yearsExperience} onSave={saveStats('yearsExperience')} as="span" />
          </span>
          <span className="skim-label">yrs production backend experience</span>
        </div>
        <div className="skim-stat">
          <span className="skim-number">
            <EditableText value={stats.recordsProcessed} onSave={saveStats('recordsProcessed')} as="span" />
          </span>
          <span className="skim-label">records processed in prod</span>
        </div>
        <div className="skim-stat">
          <span className="skim-number">
            <EditableText value={stats.projectsBuilt} onSave={saveStats('projectsBuilt')} as="span" />+
          </span>
          <span className="skim-label">shipped projects backend · ai · cloud</span>
        </div>
      </div>

      <p className="hero-desc">
        <EditableTextarea
          value={content.about?.intro || ''}
          onSave={async (v) => updateSection('about', { ...content.about, intro: v })}
          as="span"
          rows={4}
          placeholder="short intro..."
        />
      </p>

      <div className="hero-actions">
        <button className="btn btn-primary" onClick={openPDF}>view resume ↗</button>
        <button className="btn btn-primary" onClick={scrollToContact}>get in touch →</button>
        <div style={{ width: '0.5px', height: '28px', background: '#1e1e1e', margin: '0 4px' }} />
        <SocialIcons contact={contact} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: About
   ═══════════════════════════════════════════════ */
function About({ content, updateSection }) {
  const about = content.about;
  const skills = content.skills;

  const saveParagraph = async (index, val) => {
    const paragraphs = [...(about.paragraphs || [])];
    paragraphs[index] = val;
    await updateSection('about', { ...about, paragraphs });
  };

  return (
    <section data-section="about">
      <div className="section-label reveal">about</div>
      <div className="about-grid reveal">
        <div className="bio-col">
          {(about.paragraphs || []).map((p, i) => (
            <EditableTextarea
              key={i}
              value={p}
              onSave={(v) => saveParagraph(i, v)}
              as="p"
              className="bio-text"
              rows={4}
            />
          ))}
          <div className="open-status">
            <span className="open-dot" aria-hidden="true" />
            {content.hero?.openToWork ? 'open to work' : 'not available'}
          </div>
        </div>
        <div className="skills-col">
          <EditableSkills
            skills={skills}
            onSave={(newSkills) => updateSection('skills', newSkills)}
            renderGroup={(label, items) => (
              <div key={label} className="skill-group">
                <div className="skill-group-label">{label}</div>
                <div className="skill-items" data-field="tech-stack">
                  {items.join(' · ')}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Experience
   ═══════════════════════════════════════════════ */
function Experience({ content, updateSection }) {
  const experience = content.experience || [];

  const renderEntry = (exp) => (
    <article key={exp.id} className="exp-item">
      <div className="exp-left">
        <div className="exp-period">{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}</div>
        <span className={`type-badge ${exp.employmentType}`}>{exp.employmentType}</span>
      </div>
      <div className="exp-right">
        <div className="exp-role" data-field="role">{exp.role}</div>
        <div className="exp-company">{exp.company}</div>
        <div className="exp-location">{exp.location}</div>
        <ul className="impact-list">
          {(exp.description || []).map((impact, j) => (
            <li key={j} className="impact-bullet">
              <span className="impact-arrow" aria-hidden="true">→</span>
              <span className="impact-text" data-field="impact">
                <HighlightedText text={impact} />
              </span>
            </li>
          ))}
        </ul>
        <div className="stack-tags" data-field="tech-stack">
          {(exp.techStack || []).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </article>
  );

  return (
    <section data-section="experience">
      <div className="section-label reveal">experience</div>
      <div className="exp-list reveal">
        <EditableExperience
          experience={experience}
          onSave={(list) => updateSection('experience', list)}
          renderEntry={renderEntry}
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Currently Building Strip
   ═══════════════════════════════════════════════ */
function CurrentlyBuilding({ content, updateSection }) {
  const building = content.currently_building || [];

  const buildingFields = [
    { key: 'name', label: 'project name', placeholder: 'indexgpt' },
    { key: 'description', label: 'description', placeholder: 'what are you building?', multiline: true, parseAs: 'array-newline' },
    { key: 'techStack', label: 'tech stack (comma separated)', placeholder: 'python, fastapi', parseAs: 'array-comma' },
    { key: 'githubUrl', label: 'github url', placeholder: 'https://github.com/...' },
    { key: 'progressPercent', label: 'progress %', placeholder: '30' },
  ];

  const renderItem = (project) => (
    <div key={project.id} className="building-strip">
      <div className="building-col-left">
        <div className="building-badge">
          <span className="building-dot" aria-hidden="true" />
          building now
        </div>
        <div className="building-name">
          {project.name}
          <span>_</span>
        </div>
      </div>
      <div className="building-col-mid">
        <div className="building-desc">{(project.description || [])[0]}</div>
        <div className="stack-tags">
          {(project.techStack || []).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
      <div className="building-right">
        <div className="progress-bar-track" title={`${project.progressPercent || 0}% complete`}>
          <div className="progress-bar-fill" style={{ width: `${project.progressPercent || 0}%` }} />
        </div>
        {project.githubUrl && (
          <a href={project.githubUrl} className="wip-btn" target="_blank" rel="noopener noreferrer" data-field="github-url">
            wip repo ↗
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="building-section reveal">
      <div className="section-label" style={{ marginBottom: '16px' }}>currently building</div>
      <div className="building-projects">
        <EditableProject
          items={building}
          onSave={(list) => updateSection('currently_building', list)}
          renderItem={renderItem}
          formFields={buildingFields}
          addLabel="add project"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Projects
   ═══════════════════════════════════════════════ */
function Projects({ content, updateSection }) {
  const projects = content.projects || [];

  const projectFields = [
    { key: 'name', label: 'project name', placeholder: 'my-project' },
    { key: 'metric', label: 'metric (number)', placeholder: '300+' },
    { key: 'metricLabel', label: 'metric label', placeholder: 'users' },
    { key: 'description', label: 'description (one per line)', placeholder: 'built X...', multiline: true, parseAs: 'array-newline' },
    { key: 'techStack', label: 'tech stack (comma separated)', placeholder: 'python, fastapi', parseAs: 'array-comma' },
    { key: 'githubUrl', label: 'github / npm url', placeholder: 'https://github.com/...' },
    { key: 'liveUrl', label: 'live url (optional)', placeholder: 'https://...' },
  ];

  const renderItem = (project) => (
    <article key={project.id} className="project-entry">
      <div className="project-entry-left">
        {project.metric && (
          <div className="project-metric-block">
            <span className="project-metric-num">{project.metric}</span>
            <span className="project-metric-label">{project.metricLabel}</span>
          </div>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} className="project-repo-link" target="_blank" rel="noopener noreferrer" data-field="github-url">
            repo ↗
          </a>
        )}
      </div>
      <div className="project-entry-right">
        <div className="project-entry-name" data-field="name">{project.name}</div>
        <ul className="impact-list">
          {(project.description || []).map((line, j) => (
            <li key={j} className="impact-bullet">
              <span className="impact-arrow" aria-hidden="true">→</span>
              <span className="impact-text" data-field="impact">
                <HighlightedText text={line} />
              </span>
            </li>
          ))}
        </ul>
        <div className="stack-tags" data-field="tech-stack">
          {(project.techStack || []).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </article>
  );

  return (
    <section data-section="projects">
      <div className="section-label reveal">projects</div>
      <p className="projects-intro reveal">
        // backend &amp; ai — no demos, just systems. read the README.
      </p>
      <div className="project-entries reveal">
        <EditableProject
          items={projects}
          onSave={(list) => updateSection('projects', list)}
          renderItem={renderItem}
          formFields={projectFields}
          addLabel="add project"
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Also Built
   ═══════════════════════════════════════════════ */
function AlsoBuilt({ content, updateSection }) {
  const alsoBuilt = content.also_built || [];

  const alsoFields = [
    { key: 'name', label: 'name', placeholder: 'my cool thing' },
    { key: 'description', label: 'description', placeholder: 'what did you build?', multiline: true, parseAs: 'array-newline' },
    { key: 'techStack', label: 'tech stack (comma separated)', placeholder: 'python, redis', parseAs: 'array-comma' },
    { key: 'githubUrl', label: 'github url (optional)', placeholder: 'https://github.com/...' },
  ];

  const renderItem = (item) => (
    <div key={item.id} className="also-built-row">
      <span className="also-name">{item.name}</span>
      <span className="also-desc">{(item.description || [])[0]}</span>
      <div className="stack-tags" style={{ flexShrink: 0 }}>
        {(item.techStack || []).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      <span className="also-arrow" aria-hidden="true">→</span>
    </div>
  );

  return (
    <section>
      <div className="section-label reveal">also built</div>
      <p className="also-built-intro reveal">
        // smaller things — scripts, tools, experiments. each solved a real problem.
      </p>
      <div className="also-built-list reveal">
        <EditableProject
          items={alsoBuilt}
          onSave={(list) => updateSection('also_built', list)}
          renderItem={renderItem}
          formFields={alsoFields}
          addLabel="add item"
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Stats (GitHub + LeetCode)
   ═══════════════════════════════════════════════ */
function Stats() {
  const [gh, setGh] = useState(null);
  const [ghLoading, setGhLoading] = useState(true);
  const [lc, setLc] = useState(null);
  const [lcLoading, setLcLoading] = useState(true);

  useEffect(() => {
    const username = CONFIG.githubUsername;
    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then((r) => r.json()),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`).then((r) => r.json()),
      fetch(`https://api.github.com/search/commits?q=author:${username}&per_page=1`, {
        headers: { Accept: 'application/vnd.github.cloak-preview' },
      }).then((r) => r.json()).catch(() => ({ total_count: null })),
    ])
      .then(([user, repos, commitData]) => {
        const stars = Array.isArray(repos) ? repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0) : 0;
        const langMap = {};
        if (Array.isArray(repos)) repos.forEach((r) => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
        const topLang = Object.entries(langMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Python';
        setGh({ repos: user.public_repos, followers: user.followers, stars, topLang, commits: commitData?.total_count ?? null });
      })
      .catch(() => setGh({ repos: CONFIG.stats.projectsBuilt + '+', followers: '--', stars: '--', topLang: 'Python', commits: null }))
      .finally(() => setGhLoading(false));
  }, []);

  useEffect(() => {
    const username = CONFIG.leetcodeUsername;
    Promise.all([
      fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`).then((r) => r.json()).catch(() => null),
      fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`).then((r) => r.json()).catch(() => null),
    ])
      .then(([solved, contest]) => {
        if (!solved || solved.error) throw new Error('no profile data');
        setLc({
          total: solved.solvedProblem ?? 0,
          easy: solved.easySolved ?? 0,
          medium: solved.mediumSolved ?? 0,
          hard: solved.hardSolved ?? 0,
          totalEasy: 900,
          totalMedium: 2000,
          totalHard: 900,
          ranking: null,
          contestRating: contest?.contestRating ?? null,
          contestTopPercent: contest?.contestTopPercentage ?? null,
        });
      })
      .catch(() => setLc(null))
      .finally(() => setLcLoading(false));
  }, []);

  const Skel = ({ w = '100%', h = 14 }) => (
    <div style={{ width: w, height: h, borderRadius: 2, background: 'var(--skeleton-from)', animation: 'skeleton-pulse 1.5s infinite' }} />
  );

  const GhMiniCard = ({ label, value, accent = false }) => (
    <div className="gh-mini-card">
      <span className="gh-mini-label">{label}</span>
      <span className={`gh-mini-value${accent ? ' gh-mini-value--accent' : ''}`}>{value}</span>
    </div>
  );

  const fmtCommits = (n) => {
    if (n === null || n === undefined) return 'active';
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <section data-section="stats">
      <div className="section-label reveal">stats</div>
      <div className="stats-graphical-grid reveal">
        <div className="stats-col">
          <div className="stats-col-header">
            <span className="stats-col-dot" />
            <span className="stats-col-title">github</span>
          </div>
          {ghLoading ? (
            <div className="gh-mini-grid">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="gh-mini-card"><Skel w="50%" h={10} /><Skel w="40%" h={26} /></div>
              ))}
            </div>
          ) : (
            <div className="gh-mini-grid">
              <GhMiniCard label="commits" value={`${fmtCommits(gh?.commits)}${gh?.commits !== null && gh?.commits !== undefined ? ' ↑' : ''}`} accent />
              <GhMiniCard label="repositories" value={gh?.repos ?? '--'} />
              <GhMiniCard label="followers" value={gh?.followers ?? '--'} />
              <GhMiniCard label="top language" value={gh?.topLang ?? '--'} />
            </div>
          )}
        </div>

        <div className="stats-col">
          <div className="stats-col-header">
            <span className="stats-col-dot" />
            <span className="stats-col-title">leetcode</span>
          </div>
          {lcLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skel h={40} /><Skel h={10} w="80%" /><Skel h={10} w="60%" /><Skel h={10} w="70%" />
            </div>
          ) : lc ? (
            <div className="lc-panel">
              <div className="lc-top-row">
                <div className="lc-solved-block">
                  <span className="lc-metric-label">solved</span>
                  <span className="lc-big-num">{lc.total}</span>
                </div>
                {lc.ranking && (
                  <div className="lc-ranking-block">
                    <span className="lc-metric-label">ranking</span>
                    <span className="lc-rank-num">~{lc.ranking >= 1000 ? `${Math.round(lc.ranking / 1000)}k` : lc.ranking}</span>
                  </div>
                )}
              </div>
              <div className="lc-bars">
                {[
                  { label: 'easy', solved: lc.easy, total: lc.totalEasy, cls: 'easy' },
                  { label: 'medium', solved: lc.medium, total: lc.totalMedium, cls: 'medium' },
                  { label: 'hard', solved: lc.hard, total: lc.totalHard, cls: 'hard' },
                ].map(({ label, solved, total, cls }) => (
                  <div key={label} className="lc-bar-row">
                    <span className="lc-bar-label">{label}</span>
                    <div className="lc-bar-track">
                      <div className={`lc-bar-fill lc-bar-fill--${cls}`} style={{ width: solved && total ? `${Math.min(100, (solved / total) * 100)}%` : '0%' }} />
                    </div>
                    <span className="lc-bar-count">{solved ?? 0}</span>
                  </div>
                ))}
              </div>
              {lc.contestRating && (
                <div className="lc-contest-row">
                  <span className="lc-metric-label">contest rating</span>
                  <span className="lc-contest-val">
                    {Math.round(lc.contestRating)}
                    {lc.contestTopPercent && <span className="lc-contest-pct">top {lc.contestTopPercent}%</span>}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="lc-panel">
              <div className="lc-top-row">
                <div className="lc-solved-block">
                  <span className="lc-metric-label">status</span>
                  <span className="lc-big-num" style={{ color: 'var(--accent)', fontSize: 18 }}>active</span>
                </div>
                <div className="lc-ranking-block">
                  <span className="lc-metric-label">username</span>
                  <span className="lc-rank-num">{CONFIG.leetcodeUsername}</span>
                </div>
              </div>
              <div className="lc-bars">
                {['easy', 'medium', 'hard'].map((cls) => (
                  <div key={cls} className="lc-bar-row">
                    <span className="lc-bar-label">{cls}</span>
                    <div className="lc-bar-track"><div className={`lc-bar-fill lc-bar-fill--${cls}`} style={{ width: '0%' }} /></div>
                    <span className="lc-bar-count">--</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Contact
   ═══════════════════════════════════════════════ */
function Contact({ openPDF, content, updateSection }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sendState, setSendState] = useState('idle');
  const contact = content.contact;
  const resume = content.resume;

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendState('sending');
    try {
      if (typeof window.emailjs === 'undefined') throw new Error('EmailJS not loaded');
      await window.emailjs.send(
        CONFIG.emailjs.serviceId,
        CONFIG.emailjs.templateId,
        { from_name: form.name, from_email: form.email, message: form.message },
        CONFIG.emailjs.publicKey
      );
      setSendState('sent');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSendState('idle'), 3000);
    } catch {
      setSendState('error');
      setTimeout(() => setSendState('idle'), 4000);
    }
  };

  const linkRows = [
    { id: 'contact-github', name: 'GitHub', handle: contact.github, arrow: '→', href: `https://${contact.github}` },
    { id: 'contact-linkedin', name: 'LinkedIn', handle: contact.linkedin, arrow: '→', href: `https://${contact.linkedin}` },
    { id: 'contact-email', name: 'Email', handle: contact.email, arrow: '→', href: `mailto:${contact.email}` },
    { id: 'contact-phone', name: 'Phone', handle: contact.phone || "+91 9822687804", arrow: '→', href: `tel:${contact.phone || "+91 9822687804"}` },
    { id: 'contact-resume', name: 'Resume', handle: 'resume.pdf', arrow: '↗', isModal: true },
  ];

  const btnLabel = { idle: 'send message →', sending: 'sending...', sent: 'message sent ✓', error: 'failed — try email directly' }[sendState];

  return (
    <section data-section="contact">
      <div className="contact-grid">
        <div className="contact-left reveal">
          <h2 className="contact-heading">let's <span>talk</span></h2>
          <p className="contact-sub">
            If you're building something that needs serious backend or AI infra — let's talk.
          </p>
          <form onSubmit={handleSubmit} id="contact-form">
            <div className="form-field">
              <label htmlFor="contact-name">name</label>
              <input id="contact-name" name="name" className="form-input" type="text" placeholder="your name" value={form.name} onChange={handleChange} required autoComplete="off" />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">email</label>
              <input id="contact-email" name="email" className="form-input" type="email" placeholder="your email" value={form.email} onChange={handleChange} required autoComplete="off" />
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">message</label>
              <textarea id="contact-message" name="message" className="form-textarea" placeholder="what are you building?" value={form.message} onChange={handleChange} required />
            </div>
            <button id="contact-send-btn" type="submit" className={`send-btn ${sendState !== 'idle' ? sendState : ''}`} disabled={sendState === 'sending'}>
              {btnLabel}
            </button>
          </form>
          <ResumeUpload
            resume={resume}
            onSave={(newResume) => updateSection('resume', newResume)}
          />
        </div>

        <div className="contact-right reveal">
          <div className="contact-links">
            {linkRows.map((row) =>
              row.isModal ? (
                <div key={row.id} id={row.id} className="contact-link-row" onClick={openPDF} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openPDF()}>
                  <div className="clink-left">
                    <span className="clink-name">{row.name}</span>
                    <span className="clink-handle">{row.handle}</span>
                  </div>
                  <span className="clink-arrow">{row.arrow}</span>
                </div>
              ) : (
                <a key={row.id} id={row.id} href={row.href} className="contact-link-row" target="_blank" rel="noopener noreferrer">
                  <div className="clink-left">
                    <span className="clink-name">{row.name}</span>
                    <span className="clink-handle">
                      <EditableText value={row.handle} onSave={async (v) => {
                        const key = row.id.replace('contact-', '');
                        await updateSection('contact', { ...contact, [key]: v });
                      }} as="span" />
                    </span>
                  </div>
                  <span className="clink-arrow">{row.arrow}</span>
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Footer
   ═══════════════════════════════════════════════ */
function Footer({ content }) {
  const contact = content.contact;
  return (
    <footer>
      <div className="footer-links">
        <a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer">github</a>
        <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer">linkedin</a>
        <a href={`mailto:${contact.email}`}>email</a>
        <a href={`tel:${contact.phone || "+91 9822687804"}`}>phone</a>
      </div>
      <span className="footer-copy">built with intention, not a template</span>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   PORTFOLIO PAGE — the main / route
   ═══════════════════════════════════════════════ */
function PortfolioPage() {
  const [theme, setTheme] = useState('dark');
  const [pdfOpen, setPdfOpen] = useState(false);

  const { user, loading: authLoading, signOut } = useAuth();
  const { content: supabaseContent, loading: contentLoading, updateSection } = useContent();
  const content = useResolvedContent(supabaseContent);

  const isAdmin = !!user;

  useReveal(authLoading || contentLoading);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Add/remove edit mode class on body for CSS targeting
  useEffect(() => {
    document.body.classList.toggle('cms-edit-mode', isAdmin);
    return () => document.body.classList.remove('cms-edit-mode');
  }, [isAdmin]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  const openPDF = useCallback(() => setPdfOpen(true), []);
  const closePDF = useCallback(() => setPdfOpen(false), []);

  const resumeUrl = content.resume?.url || '/resume.pdf';

  if (authLoading || contentLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        loading...
      </div>
    );
  }

  return (
    <CMSContext.Provider value={{ isAdmin, content, updateSection, user }}>
      <Nav theme={theme} toggleTheme={toggleTheme} openPDF={openPDF} />
      <main>
        <Hero openPDF={openPDF} content={content} updateSection={updateSection} />
        <About content={content} updateSection={updateSection} />
        <Experience content={content} updateSection={updateSection} />
        <CurrentlyBuilding content={content} updateSection={updateSection} />
        <Projects content={content} updateSection={updateSection} />
        <AlsoBuilt content={content} updateSection={updateSection} />
        <Stats />
        <Contact openPDF={openPDF} content={content} updateSection={updateSection} />
      </main>
      <Footer content={content} />
      {pdfOpen && <PDFModal onClose={closePDF} resumeUrl={resumeUrl} />}
      <CMSToolbar onSignOut={async () => { await signOut(); window.location.href = '/'; }} />
    </CMSContext.Provider>
  );
}

/* ═══════════════════════════════════════════════
   APP ROOT — routes
   ═══════════════════════════════════════════════ */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/admin" element={<AdminLoginRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* Redirect to / if already logged in */
function AdminLoginRoute() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      loading...
    </div>
  );

  if (user) return <Navigate to="/" replace />;
  return <AdminLogin />;
}
