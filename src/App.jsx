import { useState, useEffect, useRef } from "react";
import emailjs from '@emailjs/browser';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0a08;
  --surface: #111110;
  --surface2: #1a1a18;
  --border: rgba(255,255,255,0.08);
  --border2: rgba(255,255,255,0.14);
  --text: #f0ede6;
  --muted: #6b6860;
  --muted2: #4a4845;
  --lime: #c8f135;
  --lime2: #a8d020;
  --font-display: 'Bebas Neue', sans-serif;
  --font-serif: 'Instrument Serif', serif;
  --font-mono: 'Geist Mono', monospace;
  --font-body: 'Geist Mono', monospace;
}

html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  cursor: auto;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed; inset: 0; z-index: 9000; pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 180px;
}

nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding: 1.25rem 2.5rem;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border);
  background: rgba(10,10,8,0.92);
  backdrop-filter: blur(12px);
}
.nav-logo { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.06em; color: var(--text); }
.nav-logo span { color: var(--lime); }
.nav-links { display: flex; gap: 0.25rem; }
.nav-link {
  background: none; border: none; color: var(--muted);
  font-family: var(--font-mono); font-size: 0.72rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.5rem 0.9rem; border-radius: 6px;
  transition: all 0.15s; cursor: pointer;
}
.nav-link:hover { color: var(--text); background: var(--surface2); }
.nav-link.active { color: var(--lime); }
.nav-status { display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted); }
.status-pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); animation: statusPulse 2s infinite; flex-shrink: 0; }
@keyframes statusPulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(200,241,53,0.4)} 50%{opacity:.7;box-shadow:0 0 0 5px rgba(200,241,53,0)} }

.nav-hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 0.25rem;
}
.nav-hamburger span { width: 22px; height: 2px; background: var(--text); border-radius: 2px; display: block; }
.mobile-menu {
  display: none; position: fixed; top: 60px; left: 0; right: 0; z-index: 999;
  background: rgba(10,10,8,0.98); border-bottom: 1px solid var(--border);
  padding: 1rem; flex-direction: column; gap: 0.25rem;
}
.mobile-menu.open { display: flex; }
.mobile-nav-link {
  background: none; border: none; color: var(--muted);
  font-family: var(--font-mono); font-size: 0.85rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.85rem 1rem; border-radius: 8px;
  transition: all 0.15s; cursor: pointer; text-align: left; width: 100%;
}
.mobile-nav-link:hover { color: var(--lime); background: var(--surface2); }

.hero {
  min-height: 100vh; display: flex; flex-direction: column;
  justify-content: flex-end; padding: 2rem 2.5rem 3rem;
  position: relative; overflow: hidden;
}
.hero-bg-text {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-size: clamp(10rem, 28vw, 22rem);
  color: rgba(255,255,255,0.02);
  white-space: nowrap; pointer-events: none;
  letter-spacing: -0.02em; user-select: none;
}
.hero-eyebrow {
  font-family: var(--font-mono); font-size: 0.72rem;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--lime); margin-bottom: 1.5rem;
  display: flex; align-items: center; gap: 0.75rem;
}
.hero-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--lime); flex-shrink: 0; }
.hero-name {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 12vw, 9.5rem);
  line-height: 0.92; letter-spacing: -0.01em; color: var(--text);
  animation: heroIn 0.8s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes heroIn { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
.hero-name .serif { font-family: var(--font-serif); font-style: italic; color: var(--lime); }
.hero-bottom {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-top: 2.5rem; padding-top: 2rem;
  border-top: 1px solid var(--border);
  animation: heroIn 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both;
  gap: 2rem;
}
.hero-desc { max-width: 380px; font-size: 0.875rem; line-height: 1.8; color: var(--muted); font-family: var(--font-mono); }
.hero-cta { display: flex; flex-direction: column; align-items: flex-end; gap: 1rem; flex-shrink: 0; }
.btn-cta {
  display: inline-flex; align-items: center; gap: 0.65rem;
  background: var(--lime); color: var(--bg); border: none; border-radius: 100px;
  font-family: var(--font-mono); font-size: 0.78rem; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 0.85rem 1.75rem; cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.btn-cta:hover { background: var(--lime2); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,241,53,0.25); }
.btn-cta-ghost {
  display: inline-flex; align-items: center; gap: 0.65rem;
  background: none; color: var(--text); border: 1px solid var(--border2); border-radius: 100px;
  font-family: var(--font-mono); font-size: 0.78rem;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 0.85rem 1.75rem; cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.btn-cta-ghost:hover { border-color: var(--text); }
.hero-scroll {
  font-family: var(--font-mono); font-size: 0.65rem;
  color: var(--muted2); letter-spacing: 0.12em; text-transform: uppercase;
  display: flex; align-items: center; gap: 0.6rem;
}
.hero-scroll::after { content: '↓'; font-size: 0.9rem; animation: bounce 2s infinite; }
@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }

section { padding: 6rem 2.5rem; }
.section-label {
  font-family: var(--font-mono); font-size: 0.68rem;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--lime);
  display: flex; align-items: center; gap: 0.65rem; margin-bottom: 3rem;
}
.section-label::before { content: ''; width: 24px; height: 1px; background: var(--lime); flex-shrink: 0; }
.section-num { color: var(--muted2); margin-left: 0.5rem; }

.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start; }
.about-headline {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5vw, 4.5rem);
  line-height: 0.95; letter-spacing: -0.01em; color: var(--text); margin-bottom: 2rem;
}
.about-headline em { font-family: var(--font-serif); font-style: italic; color: var(--lime); }
.about-body { font-size: 0.875rem; line-height: 2; color: var(--muted); font-family: var(--font-mono); }
.about-body p { margin-bottom: 1.25rem; }
.about-body strong { color: var(--text); font-weight: 500; }
.skills-list { display: flex; flex-direction: column; gap: 0; }
.skill-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 0; border-bottom: 1px solid var(--border);
  overflow: hidden; position: relative;
}
.skill-row:first-child { border-top: 1px solid var(--border); }
.skill-name { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.04em; color: var(--text); transition: color 0.2s; }
.skill-row:hover .skill-name { color: var(--lime); }
.skill-bar-wrap { width: 100px; height: 2px; background: var(--surface2); border-radius: 2px; overflow: hidden; flex-shrink: 0; }
.skill-bar { height: 100%; background: var(--lime); border-radius: 2px; transform-origin: left; transition: transform 1s ease; }
.skill-years { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted2); letter-spacing: 0.06em; flex-shrink: 0; }

.work-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3rem; }
.work-title { font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 5rem); line-height: 0.95; letter-spacing: -0.01em; }
.projects-list { display: flex; flex-direction: column; gap: 0; }
.project-row {
  display: grid; grid-template-columns: 70px 1fr auto;
  gap: 1.5rem; align-items: start;
  padding: 2rem 0; border-bottom: 1px solid var(--border);
  transition: all 0.2s; position: relative; overflow: hidden;
}
.project-row::before {
  content: ''; position: absolute; inset: 0;
  background: var(--surface);
  transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); z-index: 0;
}
.project-row:hover::before { transform: translateY(0); }
.project-row > * { position: relative; z-index: 1; }
.project-num { font-family: var(--font-display); font-size: 2.5rem; color: var(--muted2); line-height: 1; letter-spacing: -0.02em; transition: color 0.2s; padding-top: 0.2rem; }
.project-row:hover .project-num { color: var(--lime); }
.project-title { font-family: var(--font-display); font-size: clamp(1.2rem, 2.5vw, 1.8rem); letter-spacing: 0.02em; color: var(--text); margin-bottom: 0.5rem; transition: color 0.2s; line-height: 1.1; }
.project-row:hover .project-title { color: var(--lime); }
.project-desc { font-family: var(--font-mono); font-size: 0.78rem; color: var(--muted); line-height: 1.7; }
.project-link { font-family: var(--font-mono); font-size: 0.72rem; color: var(--lime); margin-top: 0.5rem; word-break: break-all; }
.project-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
.ptag { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase; border: 1px solid var(--border2); border-radius: 4px; padding: 0.2rem 0.55rem; color: var(--muted); }
.project-arrow { font-size: 1.3rem; color: var(--muted2); transition: all 0.2s; padding-top: 0.3rem; }
.project-row:hover .project-arrow { color: var(--lime); transform: translate(4px, -4px); }

.marquee-section { padding: 2.5rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); overflow: hidden; background: var(--surface); }
.marquee-track { display: flex; gap: 0; white-space: nowrap; animation: marquee 22s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }
.marquee-item { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0 2rem; color: var(--muted2); display: flex; align-items: center; gap: 2rem; }
.marquee-item .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); flex-shrink: 0; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

.exp-grid { display: grid; grid-template-columns: 280px 1fr; gap: 4rem; align-items: start; }
.exp-sticky { position: sticky; top: 6rem; }
.exp-big { font-family: var(--font-display); font-size: clamp(3rem, 7vw, 6rem); line-height: 0.9; letter-spacing: -0.02em; color: var(--text); }
.exp-big span { display: block; color: var(--lime); }
.timeline { display: flex; flex-direction: column; }
.timeline-item { padding: 1.75rem 0 1.75rem 2rem; border-left: 1px solid var(--border); position: relative; transition: border-color 0.2s; }
.timeline-item:hover { border-color: var(--lime); }
.timeline-dot { position: absolute; left: -5px; top: 2.2rem; width: 8px; height: 8px; border-radius: 50%; background: var(--muted2); border: 2px solid var(--bg); transition: background 0.2s; }
.timeline-item:hover .timeline-dot { background: var(--lime); }
.timeline-period { font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--lime); margin-bottom: 0.5rem; }
.timeline-role { font-family: var(--font-display); font-size: clamp(1.2rem, 2.5vw, 1.5rem); letter-spacing: 0.04em; color: var(--text); margin-bottom: 0.2rem; }
.timeline-company { font-family: var(--font-mono); font-size: 0.78rem; color: var(--muted); margin-bottom: 0.75rem; }
.timeline-desc { font-family: var(--font-mono); font-size: 0.78rem; color: var(--muted); line-height: 1.85; }

.contact-wrap { max-width: 900px; }
.contact-big { font-family: var(--font-display); font-size: clamp(2.8rem, 8vw, 7rem); line-height: 0.92; letter-spacing: -0.02em; color: var(--text); margin-bottom: 3rem; }
.contact-big em { font-family: var(--font-serif); font-style: italic; color: var(--lime); }
.contact-links { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 3rem; }
.contact-link {
  display: flex; align-items: center; gap: 0.65rem;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 1rem 1.5rem;
  font-family: var(--font-mono); font-size: 0.8rem; color: var(--muted);
  transition: all 0.2s; cursor: pointer; text-decoration: none; min-width: 160px;
}
.contact-link:hover { border-color: var(--lime); color: var(--lime); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(200,241,53,0.1); }
.contact-link-icon { font-size: 1.1rem; }
.contact-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 680px; margin-top: 2rem; }
.form-input { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 0.9rem 1.1rem; font-family: var(--font-mono); font-size: 0.82rem; color: var(--text); transition: border-color 0.15s; outline: none; }
.form-input:focus { border-color: var(--lime); }
.form-input::placeholder { color: var(--muted2); }
.form-input.full { grid-column: 1 / -1; }
textarea.form-input { resize: vertical; min-height: 120px; line-height: 1.7; }

footer { border-top: 1px solid var(--border); padding: 2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.footer-copy { font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted2); }
.footer-back { font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted); background: none; border: none; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.15s; display: flex; align-items: center; gap: 0.4rem; }
.footer-back:hover { color: var(--lime); }

.reveal { opacity: 1; transform: none; transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: none; }

@media (max-width: 900px) {
  .exp-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .exp-sticky { position: static; }
}
@media (max-width: 768px) {
  nav { padding: 1rem 1.25rem; }
  .nav-links { display: none; }
  .nav-status { display: none; }
  .nav-hamburger { display: flex; }
  section { padding: 4rem 1.25rem; }
  .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .project-row { grid-template-columns: 50px 1fr; }
  .project-arrow { display: none; }
  .contact-form { grid-template-columns: 1fr; }
  .hero { padding: 1.25rem 1.25rem 2.5rem; }
  .hero-bottom { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .hero-cta { align-items: flex-start; }
  .contact-links { flex-direction: column; }
  .contact-link { min-width: unset; width: 100%; }
  footer { padding: 1.5rem 1.25rem; }
  .skill-bar-wrap { width: 70px; }
}
`;

const SKILLS = [
  { name: "Linux Admin",  level: 80, years: "1.1 yrs" },
  { name: "Bash / Shell", level: 75, years: "1 yr"    },
  { name: "JavaScript",   level: 65, years: "1 yr"    },
  { name: "React / Vite", level: 60, years: "< 1 yr"  },
  { name: "Node.js",      level: 55, years: "< 1 yr"  },
  { name: "MySQL",        level: 55, years: "< 1 yr"  },
];

const PROJECTS = [
  {
    title: "Telecom App Monitoring on Linux",
    desc: "Developed and implemented automation and monitoring support in a Linux-based production environment. Focused on log analysis, system performance monitoring, and operational task execution. Handled server-level troubleshooting, scheduled reports, and application availability support.",
    tags: ["Linux", "Shell Script", "Log Analysis", "Monitoring", "Grafana"],
    year: "2024", link: null,
  },
  {
    title: "E-Commerce Web Application",
    desc: "Built a fully responsive e-commerce web app using React and Vite as part of self-learning through Udemy. Features product listings, cart management, and a clean UI deployed live on Vercel.",
    tags: ["React", "Vite", "JavaScript", "Node.js"],
    year: "2024", link: "https://shopvault-alpha.vercel.app",
  },
  {
    title: "Gas Network GIS Project",
    desc: "A comprehensive project to manage, analyze, and optimize gas network infrastructure across the United States. Leverages GIS technology using ArcGIS Pro to map, monitor, and improve the performance of gas pipelines, distribution systems, and related assets.",
    tags: ["ArcGIS Pro", "GIS", "MySQL", "Excel"],
    year: "2024", link: null,
  },
  {
    title: "Personal Portfolio Website",
    desc: "Designed and built this personal portfolio from scratch using React and Vite. Features scroll animations, marquee ticker, animated skill bars, project showcase, experience timeline, and a working contact form.",
    tags: ["React", "Vite", "JavaScript", "CSS"],
    year: "2025", link: null,
  },
];

const EXPERIENCE = [
  {
    period: "2024 Feb – Present",
    role: "Linux Engineer",
    company: "Mannash Solutions Pvt Ltd, India",
    desc: "Monitoring Linux servers and applications in a telecom production environment. Analyzing application and system logs using grep, awk, and shell commands. Supporting telecom services, executing shell scripts for operations, and ensuring system stability and availability.",
  },
  {
    period: "2023 July – 2024 Jan",
    role: "GIS Technician",
    company: "UDC India Technologies Pvt Ltd, Himachal Pradesh",
    desc: "Worked on gas network GIS projects using ArcGIS Pro. Responsible for mapping, analyzing, and maintaining spatial data for gas pipeline infrastructure. Performed data entry, quality checks, and spatial analysis to support network optimization.",
  },
  {
    period: "2024 – Present",
    role: "Full-Stack Developer (Self-Learning)",
    company: "Personal Projects, Remote",
    desc: "Building full-stack web applications using JavaScript, React, Node.js, and MySQL. Completed an e-commerce app deployed on Vercel. Continuously expanding skills through Udemy courses and hands-on projects.",
  },
];

const MARQUEE_ITEMS = ["Linux", "Bash", "Shell Script", "Grafana", "Node.js", "MySQL", "React", "JavaScript", "ArcGIS", "Monitoring"];

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [skillsVisible, setSkillsVisible] = useState(true);
  const [toast, setToast] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const skillsRef = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          if (e.target === skillsRef.current) setSkillsVisible(true);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => {
      const sections = ["home", "about", "work", "experience", "contact"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleContact = (e) => {
    e.preventDefault();
    emailjs.sendForm(
      'service_nwt81jo',
      'template_lu7o40l',
      e.target,
      'C2C44A1wdsf8zeg0y'
    ).then(() => {
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      e.target.reset();
    }).catch((err) => {
      console.error('EmailJS error:', err);
      alert('Something went wrong. Please try again.');
    });
  };

  return (
    <>
      <style>{CSS}</style>

      {toast && (
        <div style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999, background: "var(--lime)", color: "var(--bg)", borderRadius: 12, padding: "0.9rem 1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 500, boxShadow: "0 8px 32px rgba(200,241,53,0.3)" }}>
          ✓ Message sent — I'll reply within 24h
        </div>
      )}

      {/* NAV */}
      <nav>
        <div className="nav-logo">NS<span>.</span></div>
        <div className="nav-links">
          {["home","about","work","experience","contact"].map(s => (
            <button key={s} className={`nav-link ${activeSection === s ? "active" : ""}`} onClick={() => scrollTo(s)}>{s}</button>
          ))}
        </div>
        <div className="nav-status">
          <div className="status-pulse" />
          Available for work
        </div>
        <button className="nav-hamburger" onClick={() => setMobileMenuOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        {["home","about","work","experience","contact"].map(s => (
          <button key={s} className="mobile-nav-link" onClick={() => scrollTo(s)}>{s}</button>
        ))}
      </div>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-bg-text">NS</div>
        <div>
          <div className="hero-eyebrow">Linux Engineer &amp; Full-Stack Developer</div>
          <div className="hero-name">Nikhil<br />Sharma<span className="serif">.</span></div>
        </div>
        <div className="hero-bottom">
          <p className="hero-desc">
            Linux Engineer with <strong style={{color:"var(--text)"}}>1.1 years</strong> of hands-on experience in system administration. Currently expanding into <strong style={{color:"var(--text)"}}>Full-Stack Web Development</strong> with JavaScript, React, and Node.js.
          </p>
          <div className="hero-cta">
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button className="btn-cta" onClick={() => scrollTo("work")}>View Work ↓</button>
              <button className="btn-cta-ghost" onClick={() => scrollTo("contact")}>Get in Touch</button>
            </div>
            <div className="hero-scroll">Scroll to explore</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span className="marquee-item" key={i}>{item} <span className="dot" /></span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="section-label">About <span className="section-num">— 01</span></div>
        <div className="about-grid">
          <div>
            <div className="about-headline reveal">
              Linux is my<br /><em>foundation.</em><br />Code is my<br />craft.
            </div>
            <div className="about-body reveal">
              <p>I am a <strong>Linux Engineer</strong> with 1.1 years of professional experience managing and maintaining Linux-based systems in a telecom production environment.</p>
              <p>I have hands-on experience with <strong>system administration</strong>, log analysis, performance monitoring, and server troubleshooting.</p>
              <p>I am currently expanding my skills in <strong>Full-Stack Web Development</strong> — building real projects with JavaScript, React, Node.js, and MySQL.</p>
            </div>
          </div>
          <div ref={skillsRef}>
            <div className="skills-list">
              {SKILLS.map((s) => (
                <div className="skill-row" key={s.name}>
                  <div className="skill-name">{s.name}</div>
                  <div className="skill-bar-wrap">
                    <div className="skill-bar" style={{ transform: `scaleX(${skillsVisible ? s.level / 100 : 0})` }} />
                  </div>
                  <div className="skill-years">{s.years}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section-label">Selected Work <span className="section-num">— 02</span></div>
        <div className="work-header">
          <div className="work-title">Projects.</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", textAlign: "right", lineHeight: 1.8 }}>
            {PROJECTS.length} projects<br />2023 – 2025
          </div>
        </div>
        <div className="projects-list">
          {PROJECTS.map((p, i) => (
            <div className="project-row" key={p.title}
              style={{ cursor: p.link ? "pointer" : "default" }}
              onClick={() => p.link && window.open(p.link, "_blank")}>
              <div className="project-num">0{i + 1}</div>
              <div>
                <div className="project-title">{p.title}</div>
                <div className="project-desc">{p.desc}</div>
                {p.link && <div className="project-link">🔗 {p.link}</div>}
                <div className="project-tags">{p.tags.map(t => <span key={t} className="ptag">{t}</span>)}</div>
              </div>
              {p.link && <div className="project-arrow">↗</div>}
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section-label">Experience <span className="section-num">— 03</span></div>
        <div className="exp-grid">
          <div className="exp-sticky">
            <div className="exp-big">1.7<span>Years</span>Of<span>Work.</span></div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--muted)", marginTop: "1.5rem", lineHeight: 1.8 }}>
              Linux systems<br />to full-stack<br />web development.
            </div>
          </div>
          <div className="timeline">
            {EXPERIENCE.map((e) => (
              <div className="timeline-item" key={e.role}>
                <div className="timeline-dot" />
                <div className="timeline-period">{e.period}</div>
                <div className="timeline-role">{e.role}</div>
                <div className="timeline-company">{e.company}</div>
                <div className="timeline-desc">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section-label">Contact <span className="section-num">— 04</span></div>
        <div className="contact-wrap">
          <div className="contact-big">
            Let's build<br />something<br /><em>great.</em>
          </div>
          <div className="contact-links">
            {[
              { icon: "✉️", label: "Email",    value: "nikhilsharma2203@gmail.com",  href: "mailto:nikhilsharma2203@gmail.com" },
              { icon: "🐙", label: "GitHub",   value: "github.com/nikhilsharma7777", href: "https://github.com/nikhilsharma7777" },
              { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/nikhil-sharma",href: "https://www.linkedin.com/in/nikhil-sharma-013082220" },
            ].map(l => (
              <a key={l.label} className="contact-link" href={l.href} target="_blank" rel="noreferrer">
                <span className="contact-link-icon">{l.icon}</span>
                <div>
                  <div style={{ color: "var(--muted2)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.2rem" }}>{l.label}</div>
                  <div style={{ color: "var(--text)", fontSize: "0.78rem" }}>{l.value}</div>
                </div>
              </a>
            ))}
          </div>

          <form onSubmit={handleContact} className="contact-form">
            <input
              className="form-input"
              name="from_name"
              placeholder="Your name"
              required
            />
            <input
              className="form-input"
              name="from_email"
              type="email"
              placeholder="Your email"
              required
            />
            <textarea
              className="form-input full"
              name="message"
              placeholder="Tell me about your project or opportunity…"
              rows={5}
              required
            />
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" className="btn-cta">Send Message →</button>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-copy">© 2026 Nikhil Sharma. All rights reserved.</div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted2)", letterSpacing: "0.08em" }}>DESIGNED &amp; BUILT WITH ♥</div>
          <button className="footer-back" onClick={() => scrollTo("home")}>↑ Back to top</button>
        </div>
      </footer>
    </>
  );
}
