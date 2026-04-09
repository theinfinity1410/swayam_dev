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
*/

import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

/* ═══════════════════════════════════════════════
   CONFIGURATION — all content sourced from here
   ═══════════════════════════════════════════════ */
const CONFIG = {
  name: { first: "Swayam", last: "Gosavi" },
  role: "backend, ai, cloud engineer",
  location: "Pune, India",
  status: "open to work",
  email: "swayamgosavi1410@gmail.com",
  github: "github.com/theinfinity1410",
  linkedin: "linkedin.com/in/infinity1410",
  resumePDF: "/resume.pdf",

  emailjs: {
    serviceId: "service_jsv6s4b",
    templateId: "template_j2906jv",
    publicKey: "PXUnN2AtGOOMoLDhD",
  },

  stats: {
    yearsExp: 2,
    recordsProcessed: "10M+",
    projectsShipped: 6,
    githubUsername: "theinfinity1410",
    leetcodeUsername: "infinity1410",
  },

  currentlyBuilding: [
    {
      name: "indexgpt",
      tagline: "an index for chat-apps and a unified memory for different chat-apps",
      stack: ["javascript", "python", "fastapi", "openai", "gemini", "anthropic"],
      repoUrl: "https://github.com/theinfinity1410/indexgpt",
      progressPercent: 30,
    },
    {
      name: "network-protocol",
      tagline: "a learning project, a network protocol built on the top of TCP/IP stack",
      stack: ["Go", "C++"],
      repoUrl: "https://github.com/theinfinity1410",
      progressPercent: 5,
    },
  ],

  experience: [
    {
      role: "Software Developer",
      company: "Tecnvirons Pvt Ltd",
      type: "internship",
      period: "Jul 2025 – Jan 2026",
      location: "Remote · Pune",
      impacts: [
        "Architected, built and shipped the complete Multitenant B2B AI-Telecalling system in just a month",
        "Designed RAG-LangChain systems, built AI-voice calling using google adk, integrated Meta APIs (WABAs, Ads, Instagram) into CRM, along with payment gateway",
        "Owned Azure infra — my product generated more than 50% of the startup revenue",
      ],
      stack: ["python", "typescript", "fastapi", "langchain", "redis", "azure", "docker", "google-adk"],
    },
    {
      role: "Web-Master",
      company: "PICT IEEE Student Branch",
      type: "contributor",
      period: "Oct 2023 – Present",
      location: "PICT · Pune",
      impacts: [
        "Serving as the current web-development head at PICT IEEE Student Branch, contributing to the development of many projects serving college students",
        "Built mcq platforms, main e-commerce websites, online judge and cp platforms",
        "The projects I contributed in served 3000+ students across Pune and atleast 400+ in college",
      ],
      stack: ["javascript", "typescript", "python", "docker", "aws", "gcp", "postgres", "mongodb"],
    },
  ],

  projects: [
    {
      name: "online-judge",
      impactNum: "300+",
      impactUnit: "college-students",
      impactContext: "served concurrent 300+ users",
      description: "An actual online judge built from scratch for intra-college coding competitions",
      stack: ["python", "javascript", "postgresql", "flask", "redis", "celery", "docker", "aws", "gcp"],
      githubUrl: "https://github.com/maitreya-16/my-online-judge",
    },
    {
      name: "quicksilver",
      impactNum: "10+",
      impactUnit: "instant frontends",
      impactContext: "quick frontends",
      description: "A real-time fast AI code generation platform for on-the-go, sandboxed, prod-ready Node.js frontends",
      stack: ["typescript", "web-containers", "postgresql", "websockets", "aws"],
      githubUrl: "https://github.com/theinfinity1410/QuickSilver",
    },
    {
      name: "phason",
      impactNum: "100+",
      impactUnit: "npm downloads",
      impactContext: "cli package with 10+ downloads per week",
      description: "An intelligent cli tool that generates custom toned git commit messages, uses git diff, distributed on npm",
      stack: ["typescript", "ollama", "npm"],
      githubUrl: "https://www.npmjs.com/package/phason",
    },
    {
      name: "credenz-backend",
      impactNum: "10000+",
      impactUnit: "users",
      impactContext: "built to scale 10000+ concurrent users",
      description: "A management system website built for our PISB club's flagship event. Handled 100000 users concurrent data",
      stack: ["typescript", "prisma", "postgresql", "aws", "gcp"],
      githubUrl: "https://github.com/Vic710/Credenz26Backend/",
    },
  ],

  alsoBuilt: [
    {
      name: "distributed computing using raspberry pi cluster",
      description: "A home-lab server built from cluster of 3 raspberry pis doing distributed and parallel computing.",
      stack: ["python", "redis", "linux", "mpi-python", "aws"],
    },
    {
      name: "financial modelling using monte-carlo algorithm simulator",
      description: "Ran a VaR financial model simulator on the homelab server I built, using montecarlo algorithm",
      stack: ["python", "redis", "aws"],
    },
    {
      name: "blockchain based social media web-app",
      description: "Built a blockchain based social media web-app to learn blockchain",
      stack: ["javascript", "react", "solana", "metamask", "ethereum"],
    },
    {
      name: "basic ad-blocker",
      description: "A basic ad-blocker extension just because I was bored",
      stack: ["javascript"],
    },
    {
      name: "portfolio-ai",
      description: "Gave an ai api info about me and made a bot which served as my assistant. Primary objective was to practice prompt engineering where till a threshold, I kept giving it better prompts and the responses kept getting better",
      stack: ["typescript", "groq"],
    },
  ],

  about: {
    bio: [
      "Backend, AI and Cloud Engineer based in Pune with a love to build and ship things that solve problems, because I enjoy solving problems.",
      "Lately, in backend, I have been working on networking, which helps me understand how overcoming networking level bottlenecks of a built system enhances the throughput of it.",
      "In AI, I am diving deep into agentic ai and its real world applications. Efficient agent orchestration interests me the most. Working in stealth on a potential agentic SaaS.",
      "Apart from Backend and AI, I also have explored Cybersecurity, Blockchain and Edge computing. I love working at the confluence of various domains and diving deep into the complexities of them.",
    ],
    skills: {
      languages:      ["Python", "Go", "TypeScript", "Java", "C", "C++"],
      frameworks:     ["FastAPI", "Flask", "Gin", "Celery", "Prisma"],
      infrastructure: ["AWS", "Docker", "Kubernetes", "Terraform", "PostgreSQL", "Redis", "GCP", "Azure"],
      ai_ml:          ["LangChain", "LangGraph", "HuggingFace", "Pinecone", "OpenAI API", "FAISS"],
    },
  },
};

/* ═══════════════════════════════════════════════
   HELPER: highlight numbers/results in impact text
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
function useReveal() {
  useEffect(() => {
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
  }, []);
}

/* ═══════════════════════════════════════════════
   COMPONENT: PDF Modal
   ═══════════════════════════════════════════════ */
function PDFModal({ onClose }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | rendered | error

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    const url = CONFIG.resumePDF;
    if (typeof window.pdfjsLib === 'undefined') {
      setStatus('error');
      return;
    }
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
    }).catch(() => {
      if (!cancelled) setStatus('error');
    });

    return () => { cancelled = true; };
  }, []);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = CONFIG.resumePDF;
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
          {status === 'loading' && (
            <p className="pdf-status">loading resume...</p>
          )}
          {status === 'error' && (
            <p className="pdf-status">
              could not load PDF —{' '}
              <a href={CONFIG.resumePDF} download style={{ color: 'var(--accent)' }}>
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
        ~/{CONFIG.name.first.toLowerCase()}
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
   COMPONENT: Hero
   ═══════════════════════════════════════════════ */
function Hero({ openPDF }) {
  const roles = CONFIG.role.split(', ');

  const scrollToContact = () => {
    document.querySelector('[data-section="contact"]')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero reveal">
      <div className="hero-tag hero-tag--accent">
        {roles.map((r) => r.toUpperCase()).join(' · ')}
      </div>

      <div className="hero-top">
        <h1 className="hero-name">
          {CONFIG.name.first}<span className="hero-name-last">{CONFIG.name.last}</span>
        </h1>
        <div className="status-badge" data-field="status">
          <span className="status-dot" aria-hidden="true" />
          {CONFIG.status}
        </div>
      </div>

      <p className="hero-role" data-field="role">
        $ backend engineer &amp; ai systems builder · {CONFIG.location.toLowerCase()}
      </p>

      <div className="skimmer-bar">
        <div className="skim-stat">
          <span className="skim-number">{CONFIG.stats.yearsExp}</span>
          <span className="skim-label">yrs production backend experience</span>
        </div>
        <div className="skim-stat">
          <span className="skim-number">{CONFIG.stats.recordsProcessed}</span>
          <span className="skim-label">records processed in prod</span>
        </div>
        <div className="skim-stat">
          <span className="skim-number">{CONFIG.stats.projectsShipped}+</span>
          <span className="skim-label">shipped projects backend · ai · cloud</span>
        </div>
      </div>

      <p className="hero-desc">
        Backend and AI engineer who builds systems that hold.{' '}
        <strong>No frameworks for the sake of it — just correct abstractions, efficient infra, and shipped products.</strong>{' '}
        From AI-telecalling systems generating startup revenue to online judges serving hundreds concurrently.{' '}
        If your backend is the bottleneck or your AI feature isn't production-ready — that's the problem I fix.
      </p>

      <div className="hero-ctas">
        <button id="hero-resume-btn" className="btn-outline" onClick={openPDF}>
          view resume ↗
        </button>
        <button id="hero-contact-btn" className="btn-outline" onClick={scrollToContact}>
          get in touch →
        </button>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: About
   ═══════════════════════════════════════════════ */
function About() {
  const { bio, skills } = CONFIG.about;
  const skillGroups = [
    { label: 'languages',      items: skills.languages },
    { label: 'frameworks',     items: skills.frameworks },
    { label: 'infrastructure', items: skills.infrastructure },
    { label: 'ai / ml',        items: skills.ai_ml },
  ];

  return (
    <section data-section="about">
      <div className="section-label reveal">about</div>
      <div className="about-grid reveal">
        <div className="bio-col">
          {bio.map((p, i) => (
            <p key={i} className="bio-text" data-field="bio">{p}</p>
          ))}
          <div className="open-status">
            <span className="open-dot" aria-hidden="true" />
            {CONFIG.status}
          </div>
        </div>
        <div className="skills-col">
          {skillGroups.map((group) => (
            <div key={group.label} className="skill-group">
              <div className="skill-group-label">{group.label}</div>
              <div className="skill-items" data-field="tech-stack">
                {group.items.join(' · ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Experience
   ═══════════════════════════════════════════════ */
function Experience() {
  return (
    <section data-section="experience">
      <div className="section-label reveal">experience</div>
      <div className="exp-list reveal">
        {CONFIG.experience.map((exp, i) => (
          <article key={i} className="exp-item">
            <div className="exp-left">
              <div className="exp-period">{exp.period}</div>
              <span className={`type-badge ${exp.type}`}>{exp.type}</span>
            </div>
            <div className="exp-right">
              <div className="exp-role" data-field="role">{exp.role}</div>
              <div className="exp-company">{exp.company}</div>
              <div className="exp-location">{exp.location}</div>
              <ul className="impact-list">
                {exp.impacts.map((impact, j) => (
                  <li key={j} className="impact-bullet">
                    <span className="impact-arrow" aria-hidden="true">→</span>
                    <span className="impact-text" data-field="impact">
                      <HighlightedText text={impact} />
                    </span>
                  </li>
                ))}
              </ul>
              <div className="stack-tags" data-field="tech-stack">
                {exp.stack.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Currently Building Strip
   ═══════════════════════════════════════════════ */
function CurrentlyBuilding() {
  return (
    <div className="building-section reveal">
      <div className="section-label" style={{ marginBottom: '16px' }}>currently building</div>
      <div className="building-projects">
        {CONFIG.currentlyBuilding.map((project, i) => (
          <div key={i} className="building-strip">
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
              <div className="building-desc">{project.tagline}</div>
              <div className="stack-tags">
                {project.stack.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="building-right">
              <div className="progress-bar-track" title={`${project.progressPercent}% complete`}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${project.progressPercent}%` }}
                />
              </div>
              <a
                href={project.repoUrl}
                className="wip-btn"
                target="_blank"
                rel="noopener noreferrer"
                data-field="github-url"
              >
                wip repo ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Projects
   ═══════════════════════════════════════════════ */
function Projects() {
  return (
    <section data-section="projects">
      <div className="section-label reveal">projects</div>
      <p className="projects-intro reveal">
        // backend &amp; ai — no demos, just systems. read the README.
      </p>
      <div className="projects-grid reveal">
        {CONFIG.projects.map((project, i) => (
          <article key={i} className="project-card">
            <div className="project-header">
              <h3 className="project-name" data-field="name">{project.name}</h3>
              <a
                href={project.githubUrl}
                className="project-gh-link"
                target="_blank"
                rel="noopener noreferrer"
                data-field="github-url"
              >
                github ↗
              </a>
            </div>
            <div className="impact-box">
              <span className="impact-num">{project.impactNum}</span>
              <span className="impact-unit">{project.impactUnit}</span>
              <span className="impact-context">{project.impactContext}</span>
            </div>
            <p className="project-desc">{project.description}</p>
            <div className="stack-tags" data-field="tech-stack">
              {project.stack.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Also Built
   ═══════════════════════════════════════════════ */
function AlsoBuilt() {
  return (
    <section>
      <div className="section-label reveal">also built</div>
      <p className="also-built-intro reveal">
        // smaller things — scripts, tools, experiments. each solved a real problem.
      </p>
      <div className="also-built-list reveal">
        {CONFIG.alsoBuilt.map((item, i) => (
          <div key={i} className="also-built-row">
            <span className="also-name">{item.name}</span>
            <span className="also-desc">{item.description}</span>
            <div className="stack-tags" style={{ flexShrink: 0 }}>
              {item.stack.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
            <span className="also-arrow" aria-hidden="true">→</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Stats
   ═══════════════════════════════════════════════ */
function Stats() {
  const [gh, setGh] = useState(null);
  const [ghLoading, setGhLoading] = useState(true);
  const [lc, setLc] = useState(null);
  const [lcLoading, setLcLoading] = useState(true);

  // GitHub: fetch user + repos, derive stars + top language + commits proxy
  useEffect(() => {
    const username = CONFIG.stats.githubUsername;
    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then((r) => r.json()),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`).then((r) => r.json()),
      fetch(`https://api.github.com/search/commits?q=author:${username}&per_page=1`, {
        headers: { Accept: 'application/vnd.github.cloak-preview' },
      }).then((r) => r.json()).catch(() => ({ total_count: null })),
    ])
      .then(([user, repos, commitData]) => {
        const stars = Array.isArray(repos)
          ? repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)
          : 0;
        const langMap = {};
        if (Array.isArray(repos)) {
          repos.forEach((r) => {
            if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
          });
        }
        const topLang = Object.entries(langMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Python';
        const totalCommits = commitData?.total_count ?? null;
        setGh({
          repos: user.public_repos,
          followers: user.followers,
          stars,
          topLang,
          commits: totalCommits,
        });
      })
      .catch(() => {
        setGh({
          repos: CONFIG.stats.projectsShipped + '+',
          followers: '--',
          stars: '--',
          topLang: 'Python',
          commits: null,
        });
      })
      .finally(() => setGhLoading(false));
  }, []);

  // LeetCode: alfa-leetcode-api (public, no auth)
  useEffect(() => {
    const username = CONFIG.stats.leetcodeUsername;
    Promise.all([
      fetch(`https://leetcode-stats-api.herokuapp.com/${username}`).then((r) => r.json()).catch(() => null),
      fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`).then((r) => r.json()).catch(() => null),
    ])
      .then(([profile, contest]) => {
        if (!profile || profile.status === 'error') throw new Error('no profile data');
        setLc({
          total: profile.totalSolved ?? 0,
          easy: profile.easySolved ?? 0,
          medium: profile.mediumSolved ?? 0,
          hard: profile.hardSolved ?? 0,
          totalEasy: profile.totalEasy || 900,
          totalMedium: profile.totalMedium || 2000,
          totalHard: profile.totalHard || 900,
          ranking: profile.ranking ?? null,
          contestRating: contest?.contestRating ?? null,
          contestTopPercent: contest?.contestTopPercentage ?? null,
        });
      })
      .catch(() => setLc(null))
      .finally(() => setLcLoading(false));
  }, []);

  const Skel = ({ w = '100%', h = 14 }) => (
    <div style={{
      width: w, height: h, borderRadius: 2,
      background: 'var(--skeleton-from)',
      animation: 'skeleton-pulse 1.5s infinite',
    }} />
  );

  // Render mini-card for GitHub
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

        {/* ── GITHUB COLUMN ── */}
        <div className="stats-col">
          <div className="stats-col-header">
            <span className="stats-col-dot" />
            <span className="stats-col-title">GITHUB</span>
          </div>
          {ghLoading ? (
            <div className="gh-mini-grid">
              {[0,1,2,3].map((i) => (
                <div key={i} className="gh-mini-card">
                  <Skel w="50%" h={10} />
                  <Skel w="40%" h={26} />
                </div>
              ))}
            </div>
          ) : (
            <div className="gh-mini-grid">
              <GhMiniCard
                label="COMMITS"
                value={`${fmtCommits(gh?.commits)}${gh?.commits !== null && gh?.commits !== undefined ? ' ↑' : ''}`}
                accent
              />
              <GhMiniCard label="REPOSITORIES" value={gh?.repos ?? '--'} />
              <GhMiniCard label="FOLLOWERS" value={gh?.followers ?? '--'} />
              <GhMiniCard label="TOP LANGUAGE" value={gh?.topLang ?? '--'} />
            </div>
          )}
        </div>

        {/* ── LEETCODE COLUMN ── */}
        <div className="stats-col">
          <div className="stats-col-header">
            <span className="stats-col-dot" />
            <span className="stats-col-title">LEETCODE</span>
          </div>
          {lcLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skel h={40} />
              <Skel h={10} w="80%" />
              <Skel h={10} w="60%" />
              <Skel h={10} w="70%" />
            </div>
          ) : lc ? (
            <div className="lc-panel">
              {/* top row: solved + ranking */}
              <div className="lc-top-row">
                <div className="lc-solved-block">
                  <span className="lc-metric-label">SOLVED</span>
                  <span className="lc-big-num">{lc.total}</span>
                </div>
                {lc.ranking && (
                  <div className="lc-ranking-block">
                    <span className="lc-metric-label">RANKING</span>
                    <span className="lc-rank-num">~{lc.ranking >= 1000 ? `${Math.round(lc.ranking / 1000)}k` : lc.ranking}</span>
                  </div>
                )}
              </div>

              {/* difficulty bars */}
              <div className="lc-bars">
                {[
                  { label: 'easy',   solved: lc.easy,   total: lc.totalEasy,   cls: 'easy' },
                  { label: 'medium', solved: lc.medium, total: lc.totalMedium, cls: 'medium' },
                  { label: 'hard',   solved: lc.hard,   total: lc.totalHard,   cls: 'hard' },
                ].map(({ label, solved, total, cls }) => (
                  <div key={label} className="lc-bar-row">
                    <span className="lc-bar-label">{label}</span>
                    <div className="lc-bar-track">
                      <div
                        className={`lc-bar-fill lc-bar-fill--${cls}`}
                        style={{ width: solved && total ? `${Math.min(100, (solved / total) * 100)}%` : '0%' }}
                      />
                    </div>
                    <span className="lc-bar-count">{solved ?? 0}</span>
                  </div>
                ))}
              </div>

              {/* contest rating */}
              {lc.contestRating && (
                <div className="lc-contest-row">
                  <span className="lc-metric-label">CONTEST RATING</span>
                  <span className="lc-contest-val">
                    {Math.round(lc.contestRating)}
                    {lc.contestTopPercent && (
                      <span className="lc-contest-pct">
                        top {lc.contestTopPercent}%
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="lc-panel">
              <div className="lc-top-row">
                <div className="lc-solved-block">
                  <span className="lc-metric-label">STATUS</span>
                  <span className="lc-big-num" style={{ color: 'var(--accent)', fontSize: 18 }}>active</span>
                </div>
                <div className="lc-ranking-block">
                  <span className="lc-metric-label">USERNAME</span>
                  <span className="lc-rank-num">{CONFIG.stats.leetcodeUsername}</span>
                </div>
              </div>
              <div className="lc-bars">
                {['easy','medium','hard'].map((cls) => (
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
function Contact({ openPDF }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sendState, setSendState] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendState('sending');
    try {
      if (typeof window.emailjs === 'undefined') throw new Error('EmailJS not loaded');
      await window.emailjs.send(
        CONFIG.emailjs.serviceId,
        CONFIG.emailjs.templateId,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
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
    {
      id: 'contact-github',
      name: 'GitHub',
      handle: CONFIG.github,
      arrow: '→',
      href: `https://${CONFIG.github}`,
    },
    {
      id: 'contact-linkedin',
      name: 'LinkedIn',
      handle: CONFIG.linkedin,
      arrow: '→',
      href: `https://${CONFIG.linkedin}`,
    },
    {
      id: 'contact-email',
      name: 'Email',
      handle: CONFIG.email,
      arrow: '→',
      href: `mailto:${CONFIG.email}`,
    },
    {
      id: 'contact-resume',
      name: 'Resume',
      handle: 'resume.pdf',
      arrow: '↗',
      isModal: true,
    },
  ];

  const btnLabel = {
    idle: 'send message →',
    sending: 'sending...',
    sent: 'message sent ✓',
    error: 'failed — try email directly',
  }[sendState];

  return (
    <section data-section="contact">
      <div className="contact-grid">
        <div className="contact-left reveal">
          <h2 className="contact-heading">
            let's <span>talk</span>
          </h2>
          <p className="contact-sub">
            If you're building something that needs serious backend or AI infra — let's talk.
          </p>
          <form onSubmit={handleSubmit} id="contact-form">
            <div className="form-field">
              <label htmlFor="contact-name">name</label>
              <input
                id="contact-name"
                name="name"
                className="form-input"
                type="text"
                placeholder="your name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">email</label>
              <input
                id="contact-email"
                name="email"
                className="form-input"
                type="email"
                placeholder="your email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">message</label>
              <textarea
                id="contact-message"
                name="message"
                className="form-textarea"
                placeholder="what are you building?"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <button
              id="contact-send-btn"
              type="submit"
              className={`send-btn ${sendState !== 'idle' ? sendState : ''}`}
              disabled={sendState === 'sending'}
            >
              {btnLabel}
            </button>
          </form>
        </div>

        <div className="contact-right reveal">
          <div className="contact-links">
            {linkRows.map((row) =>
              row.isModal ? (
                <div
                  key={row.id}
                  id={row.id}
                  className="contact-link-row"
                  onClick={openPDF}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openPDF()}
                >
                  <div className="clink-left">
                    <span className="clink-name">{row.name}</span>
                    <span className="clink-handle">{row.handle}</span>
                  </div>
                  <span className="clink-arrow">{row.arrow}</span>
                </div>
              ) : (
                <a
                  key={row.id}
                  id={row.id}
                  href={row.href}
                  className="contact-link-row"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="clink-left">
                    <span className="clink-name">{row.name}</span>
                    <span className="clink-handle">{row.handle}</span>
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
function Footer() {
  return (
    <footer>
      <div className="footer-links">
        <a href={`https://${CONFIG.github}`} target="_blank" rel="noopener noreferrer">
          github
        </a>
        <a href={`https://${CONFIG.linkedin}`} target="_blank" rel="noopener noreferrer">
          linkedin
        </a>
        <a href={`mailto:${CONFIG.email}`}>email</a>
      </div>
      <span className="footer-copy">built with intention, not a template</span>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════ */
export default function App() {
  const [theme, setTheme] = useState('dark');
  const [pdfOpen, setPdfOpen] = useState(false);

  useReveal();

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const openPDF = useCallback(() => setPdfOpen(true), []);
  const closePDF = useCallback(() => setPdfOpen(false), []);

  return (
    <>
      <Nav theme={theme} toggleTheme={toggleTheme} openPDF={openPDF} />
      <main>
        <Hero openPDF={openPDF} />
        <About />
        <Experience />
        <CurrentlyBuilding />
        <Projects />
        <AlsoBuilt />
        <Stats />
        <Contact openPDF={openPDF} />
      </main>
      <Footer />
      {pdfOpen && <PDFModal onClose={closePDF} />}
    </>
  );
}
