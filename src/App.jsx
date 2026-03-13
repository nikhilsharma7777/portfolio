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
  --nav-h: 64px;
}

html { scroll-behavior: smooth; }
body {
  font-family: var(--font-mono);
  background: var(--bg);
  color: var(--text);
  cursor: auto;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

body::before {
  content: '';
  position: fixed; inset: 0; z-index: 9000; pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
}

/* NAV */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  height: var(--nav-h);
  padding: 0 2.5rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  border-bottom: 1px solid var(--border);
  background: rgba(10,10,8,0.94);
  backdrop-filter: blur(16px);
}
.nav-logo { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 0.06em; color: var(--text); flex-shrink: 0; }
.nav-logo span { color: var(--lime); }
.nav-links { display: flex; gap: 0.15rem; }
.nav-link {
  background: none; border: none; color: var(--muted);
  font-family: var(--font-mono); font-size: 0.7rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.5rem 0.85rem; border-radius: 6px;
  transition: all 0.15s; cursor: pointer; white-space: nowrap;
}
.nav-link:hover { color: var(--text); background: var(--surface2); }
.nav-link.active { color: var(--lime); }
.nav-status { display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.68rem; color: var(--muted); white-space: nowrap; flex-shrink: 0; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); animation: blink 2s infinite; flex-shrink: 0; }
@keyframes blink { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(200,241,53,0.5)} 50%{opacity:.6;box-shadow:0 0 0 5px rgba(200,241,53,0)} }

.hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; flex-shrink: 0; }
.hamburger span { display: block; width: 22px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.25s; }
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.mob-menu { display: none; position: fixed; top: var(--nav-h); left: 0; right: 0; z-index: 999; background: rgba(10,10,8,0.98); border-bottom: 1px solid var(--border); backdrop-filter: blur(16px); padding: 0.5rem 1rem 1rem; flex-direction: column; gap: 0.15rem; }
.mob-menu.open { display: flex; }
.mob-link { background: none; border: none; color: var(--muted); font-family: var(--font-mono); font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.85rem 0.75rem; border-radius: 8px; transition: all 0.15s; cursor: pointer; text-align: left; width: 100%; }
.mob-link:hover { color: var(--lime); background: var(--surface2); }
.mob-status { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 0.75rem 0; border-top: 1px solid var(--border); margin-top: 0.25rem; font-family: var(--font-mono); font-size: 0.68rem; color: var(--muted); }

/* HERO */
.hero { min-height: 100svh; display: flex; flex-direction: column; justify-content: flex-end; padding: calc(var(--nav-h) + 2rem) 2.5rem 3.5rem; position: relative; overflow: hidden; }
.hero-watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-family: var(--font-display); font-size: clamp(9rem, 28vw, 22rem); color: rgba(255,255,255,0.018); white-space: nowrap; pointer-events: none; letter-spacing: -0.02em; user-select: none; line-height: 1; }
.hero-tag { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--lime); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.7rem; }
.hero-tag::before { content:''; width:28px; height:1px; background:var(--lime); flex-shrink:0; }
.hero-name { font-family: var(--font-display); font-size: clamp(3.5rem, 11vw, 10rem); line-height: 0.9; letter-spacing: -0.01em; animation: rise 0.9s cubic-bezier(0.16,1,0.3,1) both; }
.hero-name .italic { font-family: var(--font-serif); font-style: italic; color: var(--lime); }
@keyframes rise { from{opacity:0;transform:translateY(48px)} to{opacity:1;transform:none} }
.hero-foot { display: flex; align-items: flex-end; justify-content: space-between; margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--border); gap: 2rem; animation: rise 0.9s 0.18s cubic-bezier(0.16,1,0.3,1) both; flex-wrap: wrap; }
.hero-desc { font-size: 0.86rem; line-height: 1.9; color: var(--muted); max-width: 400px; flex: 1; min-width: 220px; }
.hero-desc strong { color: var(--text); font-weight: 500; }
.hero-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 1rem; flex-shrink: 0; }
.hero-btns { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: flex-end; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase; padding: 0.82rem 1.7rem; border-radius: 100px; cursor: pointer; transition: all 0.2s; white-space: nowrap; border: none; }
.btn-primary { background: var(--lime); color: var(--bg); }
.btn-primary:hover { background: var(--lime2); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,241,53,0.28); }
.btn-outline { background: none; color: var(--text); border: 1px solid var(--border2) !important; }
.btn-outline:hover { border-color: var(--text) !important; }
.scroll-hint { font-family: var(--font-mono); font-size: 0.63rem; color: var(--muted2); letter-spacing: 0.14em; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem; }
.scroll-hint::after { content:'↓'; animation: bob 2s infinite; }
@keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }

/* TICKER */
.ticker { padding: 2rem 0; overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--surface); }
.ticker-track { display: flex; white-space: nowrap; animation: scroll 24s linear infinite; }
.ticker-track:hover { animation-play-state: paused; }
.ticker-item { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.09em; text-transform: uppercase; padding: 0 1.75rem; color: var(--muted2); display: flex; align-items: center; gap: 1.75rem; }
.ticker-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--lime); flex-shrink: 0; }
@keyframes scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }

/* SECTIONS */
section { padding: 6rem 2.5rem; }
.s-label { font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--lime); display: flex; align-items: center; gap: 0.6rem; margin-bottom: 3rem; }
.s-label::before { content:''; width:20px; height:1px; background:var(--lime); flex-shrink:0; }
.s-num { color: var(--muted2); margin-left: 0.35rem; }

/* ABOUT */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start; }
.about-hl { font-family: var(--font-display); font-size: clamp(2.6rem, 4.5vw, 4.5rem); line-height: 0.94; letter-spacing: -0.01em; margin-bottom: 2rem; }
.about-hl em { font-family: var(--font-serif); font-style: italic; color: var(--lime); }
.about-txt { font-size: 0.86rem; line-height: 2; color: var(--muted); }
.about-txt p { margin-bottom: 1.1rem; }
.about-txt p:last-child { margin-bottom: 0; }
.about-txt strong { color: var(--text); font-weight: 500; }
.skills { display: flex; flex-direction: column; }
.sk-row { display: flex; align-items: center; gap: 1rem; padding: 0.95rem 0; border-bottom: 1px solid var(--border); }
.sk-row:first-child { border-top: 1px solid var(--border); }
.sk-row:hover .sk-name { color: var(--lime); }
.sk-name { font-family: var(--font-display); font-size: 1.45rem; letter-spacing: 0.04em; transition: color 0.2s; flex: 1; }
.sk-bar-bg { width: 90px; height: 2px; background: var(--surface2); border-radius: 2px; overflow: hidden; flex-shrink: 0; }
.sk-bar { height: 100%; background: var(--lime); border-radius: 2px; transform-origin: left; transition: transform 1.1s ease; }
.sk-yr { font-size: 0.62rem; color: var(--muted2); flex-shrink: 0; white-space: nowrap; min-width: 48px; text-align: right; }

/* WORK */
.work-hd { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2.5rem; gap: 1rem; flex-wrap: wrap; }
.work-hl { font-family: var(--font-display); font-size: clamp(2.5rem, 5.5vw, 5rem); line-height: 0.94; }
.work-meta { font-size: 0.72rem; color: var(--muted); text-align: right; line-height: 1.85; }
.proj-list { display: flex; flex-direction: column; }
.proj-row { display: grid; grid-template-columns: 68px 1fr 32px; gap: 1.5rem; align-items: start; padding: 2rem 0; border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
.proj-row::before { content:''; position:absolute; inset:0; background:var(--surface); transform:translateY(102%); transition:transform 0.32s cubic-bezier(0.16,1,0.3,1); z-index:0; }
.proj-row:hover::before { transform:translateY(0); }
.proj-row > * { position: relative; z-index: 1; }
.proj-n { font-family: var(--font-display); font-size: 2.4rem; color: var(--muted2); line-height: 1; transition: color 0.2s; padding-top: 0.1rem; }
.proj-row:hover .proj-n { color: var(--lime); }
.proj-title { font-family: var(--font-display); font-size: clamp(1.2rem, 2.2vw, 1.75rem); letter-spacing: 0.02em; margin-bottom: 0.45rem; transition: color 0.2s; line-height: 1.1; }
.proj-row:hover .proj-title { color: var(--lime); }
.proj-desc { font-size: 0.77rem; color: var(--muted); line-height: 1.78; }
.proj-url { font-size: 0.7rem; color: var(--lime); margin-top: 0.4rem; word-break: break-all; }
.proj-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.7rem; }
.tag { font-size: 0.6rem; letter-spacing: 0.07em; text-transform: uppercase; border: 1px solid var(--border2); border-radius: 4px; padding: 0.18rem 0.5rem; color: var(--muted); }
.proj-arr { font-size: 1.2rem; color: var(--muted2); transition: all 0.2s; padding-top: 0.2rem; text-align: right; }
.proj-row:hover .proj-arr { color: var(--lime); transform: translate(3px,-3px); }

/* EXPERIENCE */
.exp-grid { display: grid; grid-template-columns: 260px 1fr; gap: 5rem; align-items: start; }
.exp-pin { position: sticky; top: calc(var(--nav-h) + 1rem); }
.exp-big { font-family: var(--font-display); font-size: clamp(3rem, 6.5vw, 6rem); line-height: 0.88; letter-spacing: -0.02em; }
.exp-big span { display: block; color: var(--lime); }
.exp-sub { font-size: 0.77rem; color: var(--muted); margin-top: 1.5rem; line-height: 1.9; }
.tl { display: flex; flex-direction: column; }
.tl-item { padding: 1.75rem 0 1.75rem 2rem; border-left: 1px solid var(--border); position: relative; transition: border-color 0.2s; }
.tl-item:hover { border-color: var(--lime); }
.tl-dot { position: absolute; left: -5px; top: 2.1rem; width: 8px; height: 8px; border-radius: 50%; background: var(--muted2); border: 2px solid var(--bg); transition: background 0.2s; }
.tl-item:hover .tl-dot { background: var(--lime); }
.tl-period { font-size: 0.66rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--lime); margin-bottom: 0.45rem; }
.tl-role { font-family: var(--font-display); font-size: clamp(1.15rem, 2.2vw, 1.5rem); letter-spacing: 0.04em; margin-bottom: 0.2rem; line-height: 1.1; }
.tl-co { font-size: 0.77rem; color: var(--muted); margin-bottom: 0.7rem; }
.tl-desc { font-size: 0.77rem; color: var(--muted); line-height: 1.88; }

/* CONTACT */
.ct-wrap { max-width: 880px; }
.ct-hl { font-family: var(--font-display); font-size: clamp(3rem, 7.5vw, 7.5rem); line-height: 0.9; letter-spacing: -0.02em; margin-bottom: 3rem; }
.ct-hl em { font-family: var(--font-serif); font-style: italic; color: var(--lime); }
.ct-links { display: flex; flex-wrap: wrap; gap: 0.85rem; margin-bottom: 3rem; }
.ct-link { display: flex; align-items: center; gap: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1rem 1.4rem; font-size: 0.78rem; color: var(--muted); transition: all 0.2s; text-decoration: none; flex: 1; min-width: 200px; }
.ct-link:hover { border-color: var(--lime); color: var(--lime); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(200,241,53,0.1); }
.ct-icon { font-size: 1rem; flex-shrink: 0; }
.ct-lbl { font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted2); margin-bottom: 0.15rem; }
.ct-val { font-size: 0.76rem; color: var(--text); }
.ct-form { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; max-width: 660px; margin-top: 2rem; }
.f-input { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 0.9rem 1.1rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text); transition: border-color 0.15s; outline: none; }
.f-input:focus { border-color: var(--lime); }
.f-input::placeholder { color: var(--muted2); }
.f-full { grid-column: 1 / -1; }
textarea.f-input { resize: vertical; min-height: 115px; line-height: 1.7; }

/* FOOTER */
footer { border-top: 1px solid var(--border); padding: 2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.ft-copy { font-size: 0.68rem; color: var(--muted2); }
.ft-right { display: flex; align-items: center; gap: 1.25rem; }
.ft-made { font-size: 0.66rem; color: var(--muted2); letter-spacing: 0.08em; }
.ft-top { font-size: 0.68rem; color: var(--muted); background: none; border: none; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.15s; display: flex; align-items: center; gap: 0.4rem; }
.ft-top:hover { color: var(--lime); }

/* TOAST */
.toast { position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; background: var(--lime); color: var(--bg); border-radius: 12px; padding: 0.9rem 1.5rem; font-family: var(--font-mono); font-size: 0.82rem; font-weight: 600; box-shadow: 0 8px 32px rgba(200,241,53,0.3); animation: slideUp 0.3s ease; }
@keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

/* ══ RESPONSIVE ══ */

@media (min-width: 1400px) {
  section { padding: 7rem 4rem; }
  nav { padding: 0 4rem; }
  .hero { padding: calc(var(--nav-h) + 3rem) 4rem 4.5rem; }
  footer { padding: 2rem 4rem; }
}

@media (max-width: 1200px) {
  .exp-grid { grid-template-columns: 220px 1fr; gap: 4rem; }
}

@media (max-width: 1024px) {
  .about-grid { gap: 3rem; }
  .exp-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .exp-pin { position: static; }
}

@media (max-width: 900px) {
  nav { padding: 0 1.5rem; }
  .nav-links { display: none; }
  .nav-status { display: none; }
  .hamburger { display: flex; }
  section { padding: 4.5rem 1.5rem; }
  .hero { padding: calc(var(--nav-h) + 1.5rem) 1.5rem 3rem; }
  footer { padding: 1.75rem 1.5rem; }
  .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .ct-links { flex-direction: column; }
  .ct-link { min-width: unset; }
  .proj-row { grid-template-columns: 56px 1fr 28px; gap: 1.1rem; }
}

@media (max-width: 640px) {
  nav { padding: 0 1.1rem; }
  section { padding: 3.5rem 1.1rem; }
  .hero { padding: calc(var(--nav-h) + 1rem) 1.1rem 2.5rem; }
  footer { padding: 1.5rem 1.1rem; flex-direction: column; align-items: flex-start; }
  .hero-name { font-size: clamp(3rem, 14vw, 5.5rem); }
  .hero-foot { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .hero-actions { width: 100%; align-items: flex-start; }
  .hero-btns { width: 100%; }
  .btn { flex: 1; }
  .about-hl { font-size: clamp(2rem, 9vw, 3.2rem); }
  .sk-bar-bg { width: 60px; }
  .work-hd { flex-direction: column; align-items: flex-start; }
  .work-meta { text-align: left; }
  .proj-row { grid-template-columns: 46px 1fr; gap: 0.9rem; }
  .proj-arr { display: none; }
  .proj-n { font-size: 1.8rem; }
  .exp-grid { gap: 2rem; }
  .ct-hl { font-size: clamp(2.4rem, 11vw, 4rem); margin-bottom: 2rem; }
  .ct-form { grid-template-columns: 1fr; }
  .f-full { grid-column: 1; }
  .toast { right: 1rem; left: 1rem; text-align: center; }
}

@media (max-width: 380px) {
  .hero-name { font-size: clamp(2.6rem, 16vw, 4rem); }
  .ticker-item { font-size: 1.2rem; padding: 0 1rem; gap: 1rem; }
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
    desc: "Automation and monitoring support in a Linux-based production environment. Log analysis, system performance monitoring, operational task execution, server-level troubleshooting, and application availability support.",
    tags: ["Linux", "Shell Script", "Log Analysis", "Monitoring", "Grafana"],
    link: null,
  },
  {
    title: "E-Commerce Web Application",
    desc: "Fully responsive e-commerce web app built with React and Vite. Features product listings, cart management, and a clean UI. Deployed live on Vercel.",
    tags: ["React", "Vite", "JavaScript", "Node.js"],
    link: "https://shopvault-alpha.vercel.app",
  },
  {
    title: "Gas Network GIS Project",
    desc: "Comprehensive project to manage, analyze, and optimize gas network infrastructure across the US using ArcGIS Pro to map and monitor gas pipelines, distribution systems, and related assets.",
    tags: ["ArcGIS Pro", "GIS", "MySQL", "Excel"],
    link: null,
  },
  {
    title: "Personal Portfolio Website",
    desc: "Designed and built this portfolio from scratch using React and Vite. Scroll animations, marquee ticker, animated skill bars, project showcase, experience timeline, and a working contact form.",
    tags: ["React", "Vite", "JavaScript", "CSS"],
    link: null,
  },
];

const EXPERIENCE = [
  {
    period: "2024 Feb – Present",
    role: "Linux Engineer",
    company: "Mannash Solutions Pvt Ltd, India",
    desc: "Monitoring Linux servers and applications in a telecom production environment. Analyzing logs using grep, awk, and shell commands. Supporting telecom services, executing shell scripts, and ensuring system stability.",
  },
  {
    period: "2023 July – 2024 Jan",
    role: "GIS Technician",
    company: "UDC India Technologies Pvt Ltd, Himachal Pradesh",
    desc: "Gas network GIS projects using ArcGIS Pro. Mapping, analyzing, and maintaining spatial data for gas pipeline infrastructure. Data entry, quality checks, and spatial analysis to support network optimization.",
  },
  {
    period: "2024 – Present",
    role: "Full-Stack Developer (Self-Learning)",
    company: "Personal Projects, Remote",
    desc: "Building full-stack web apps using JavaScript, React, Node.js, and MySQL. Deployed e-commerce app on Vercel. Continuously expanding through Udemy courses and hands-on projects.",
  },
];

const TICKER = ["Linux", "Bash", "Shell Script", "Grafana", "Node.js", "MySQL", "React", "JavaScript", "ArcGIS", "Monitoring", "Vite", "HTML5"];

export default function App() {
  const [active, setActive]   = useState("home");
  const [barsOn, setBarsOn]   = useState(true);
  const [toast, setToast]     = useState(false);
  const [menu, setMenu]       = useState(false);
  const skillsRef             = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setBarsOn(true); }, { threshold: 0.15 });
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const ids = ["home","about","work","experience","contact"];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 130) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = (e) => { if (!e.target.closest("nav") && !e.target.closest(".mob-menu")) setMenu(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menu]);

  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMenu(false); };

  const send = (e) => {
    e.preventDefault();
    emailjs.sendForm("service_nwt81jo","template_lu7o40l", e.target,"C2C44A1wdsf8zeg0y")
      .then(() => { setToast(true); setTimeout(() => setToast(false), 3500); e.target.reset(); })
      .catch(err => { console.error(err); alert("Something went wrong, please try again."); });
  };

  return (
    <>
      <style>{CSS}</style>
      {toast && <div className="toast">✓ Message sent — I'll reply within 24h</div>}

      {/* NAV */}
      <nav>
        <div className="nav-logo">NS<span>.</span></div>
        <div className="nav-links">
          {["home","about","work","experience","contact"].map(s => (
            <button key={s} className={`nav-link${active===s?" active":""}`} onClick={() => go(s)}>{s}</button>
          ))}
        </div>
        <div className="nav-status"><div className="status-dot"/>Available for work</div>
        <button className={`hamburger${menu?" open":""}`} aria-label="Menu" onClick={() => setMenu(o=>!o)}>
          <span/><span/><span/>
        </button>
      </nav>

      <div className={`mob-menu${menu?" open":""}`}>
        {["home","about","work","experience","contact"].map(s => (
          <button key={s} className="mob-link" onClick={() => go(s)}>{s}</button>
        ))}
        <div className="mob-status"><div className="status-dot"/>Available for work</div>
      </div>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-watermark">NS</div>
        <div>
          <div className="hero-tag">Linux Engineer &amp; Full-Stack Developer</div>
          <div className="hero-name">Nikhil<br/>Sharma<span className="italic">.</span></div>
        </div>
        <div className="hero-foot">
          <p className="hero-desc">
            Linux Engineer with <strong>1.1 years</strong> of hands-on experience in system administration. Expanding into <strong>Full-Stack Web Development</strong> with React, Node.js and MySQL.
          </p>
          <div className="hero-actions">
            <div className="hero-btns">
              <button className="btn btn-primary" onClick={() => go("work")}>View Work ↓</button>
              <button className="btn btn-outline" onClick={() => go("contact")}>Get in Touch</button>
            </div>
            <div className="scroll-hint">Scroll to explore</div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER,...TICKER].map((t,i) => (
            <span className="ticker-item" key={i}>{t}<span className="ticker-dot"/></span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="s-label">About<span className="s-num">— 01</span></div>
        <div className="about-grid">
          <div>
            <div className="about-hl">Linux is my<br/><em>foundation.</em><br/>Code is my<br/>craft.</div>
            <div className="about-txt">
              <p>I am a <strong>Linux Engineer</strong> with 1.1 years of professional experience managing Linux-based systems in a telecom production environment.</p>
              <p>Hands-on with <strong>system administration</strong>, log analysis, performance monitoring, and server troubleshooting.</p>
              <p>Expanding into <strong>Full-Stack Web Development</strong> — building real projects with JavaScript, React, Node.js, and MySQL.</p>
            </div>
          </div>
          <div ref={skillsRef}>
            <div className="skills">
              {SKILLS.map(s => (
                <div className="sk-row" key={s.name}>
                  <div className="sk-name">{s.name}</div>
                  <div className="sk-bar-bg"><div className="sk-bar" style={{ transform:`scaleX(${barsOn?s.level/100:0})` }}/></div>
                  <div className="sk-yr">{s.years}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" style={{ borderTop:"1px solid var(--border)" }}>
        <div className="s-label">Selected Work<span className="s-num">— 02</span></div>
        <div className="work-hd">
          <div className="work-hl">Projects.</div>
          <div className="work-meta">{PROJECTS.length} projects<br/>2023 – 2025</div>
        </div>
        <div className="proj-list">
          {PROJECTS.map((p,i) => (
            <div className="proj-row" key={p.title}
              style={{ cursor: p.link?"pointer":"default" }}
              onClick={() => p.link && window.open(p.link,"_blank")}>
              <div className="proj-n">0{i+1}</div>
              <div>
                <div className="proj-title">{p.title}</div>
                <div className="proj-desc">{p.desc}</div>
                {p.link && <div className="proj-url">🔗 {p.link}</div>}
                <div className="proj-tags">{p.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
              </div>
              {p.link && <div className="proj-arr">↗</div>}
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ borderTop:"1px solid var(--border)" }}>
        <div className="s-label">Experience<span className="s-num">— 03</span></div>
        <div className="exp-grid">
          <div className="exp-pin">
            <div className="exp-big">1.7<span>Years</span>Of<span>Work.</span></div>
            <div className="exp-sub">Linux systems<br/>to full-stack<br/>web development.</div>
          </div>
          <div className="tl">
            {EXPERIENCE.map(e => (
              <div className="tl-item" key={e.role}>
                <div className="tl-dot"/>
                <div className="tl-period">{e.period}</div>
                <div className="tl-role">{e.role}</div>
                <div className="tl-co">{e.company}</div>
                <div className="tl-desc">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ borderTop:"1px solid var(--border)" }}>
        <div className="s-label">Contact<span className="s-num">— 04</span></div>
        <div className="ct-wrap">
          <div className="ct-hl">Let's build<br/>something<br/><em>great.</em></div>
          <div className="ct-links">
            {[
              { icon:"✉️", lbl:"Email",    val:"nikhilsharma2203@gmail.com",   href:"mailto:nikhilsharma2203@gmail.com" },
              { icon:"🐙", lbl:"GitHub",   val:"github.com/nikhilsharma7777",  href:"https://github.com/nikhilsharma7777" },
              { icon:"💼", lbl:"LinkedIn", val:"linkedin.com/in/nikhil-sharma", href:"https://www.linkedin.com/in/nikhil-sharma-013082220" },
            ].map(l => (
              <a key={l.lbl} className="ct-link" href={l.href} target="_blank" rel="noreferrer">
                <span className="ct-icon">{l.icon}</span>
                <div><div className="ct-lbl">{l.lbl}</div><div className="ct-val">{l.val}</div></div>
              </a>
            ))}
          </div>
          <form onSubmit={send} className="ct-form">
            <input  className="f-input"          name="from_name"  placeholder="Your name"   required/>
            <input  className="f-input"          name="from_email" placeholder="Your email"  type="email" required/>
            <textarea className="f-input f-full" name="message"    placeholder="Tell me about your project or opportunity…" rows={5} required/>
            <div className="f-full">
              <button type="submit" className="btn btn-primary" style={{ minWidth:200 }}>Send Message →</button>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="ft-copy">© 2026 Nikhil Sharma. All rights reserved.</div>
        <div className="ft-right">
          <div className="ft-made">DESIGNED &amp; BUILT WITH ♥</div>
          <button className="ft-top" onClick={() => go("home")}>↑ Back to top</button>
        </div>
      </footer>
    </>
  );
}
