import { useState, useEffect, useRef } from "react";
import emailjs from '@emailjs/browser';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  /* GLOBAL FIX: every element respects its container width */
  max-width: 100%;
}

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
  --pad: 2.5rem;
}

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}
body {
  font-family: var(--font-mono);
  background: var(--bg);
  color: var(--text);
  cursor: auto;
  overflow-x: hidden;
  width: 100%;
  -webkit-font-smoothing: antialiased;
}
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 9000; pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 180px;
}

/* NAV */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  height: var(--nav-h); padding: 0 var(--pad);
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  border-bottom: 1px solid var(--border);
  background: rgba(10,10,8,0.94); backdrop-filter: blur(12px);
  width: 100%; overflow: hidden;
}
.nav-logo { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.06em; flex-shrink: 0; }
.nav-logo span { color: var(--lime); }
.nav-links { display: flex; gap: 0.25rem; }
.nav-link { background: none; border: none; color: var(--muted); font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.5rem 0.9rem; border-radius: 6px; transition: all 0.15s; cursor: pointer; white-space: nowrap; }
.nav-link:hover { color: var(--text); background: var(--surface2); }
.nav-link.active { color: var(--lime); }
.nav-status { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; color: var(--muted); white-space: nowrap; flex-shrink: 0; }
.sp { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); animation: spa 2s infinite; flex-shrink: 0; }
@keyframes spa { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(200,241,53,0.4)} 50%{opacity:.7;box-shadow:0 0 0 5px rgba(200,241,53,0)} }

.burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; flex-shrink: 0; }
.burger span { width: 22px; height: 2px; background: var(--text); border-radius: 2px; display: block; transition: all 0.25s; }
.burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger.open span:nth-child(2) { opacity: 0; }
.burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.mob-menu { display: none; position: fixed; top: var(--nav-h); left: 0; right: 0; z-index: 999; background: rgba(10,10,8,0.99); border-bottom: 1px solid var(--border); backdrop-filter: blur(16px); padding: 0.5rem 1rem 1.25rem; flex-direction: column; gap: 0.15rem; }
.mob-menu.open { display: flex; }
.mob-link { background: none; border: none; color: var(--muted); font-family: var(--font-mono); font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.85rem 1rem; border-radius: 8px; transition: all 0.15s; cursor: pointer; text-align: left; width: 100%; }
.mob-link:hover { color: var(--lime); background: var(--surface2); }
.mob-status { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem 0; border-top: 1px solid var(--border); margin-top: 0.25rem; font-size: 0.68rem; color: var(--muted); }

/* HERO */
.hero {
  min-height: 100svh; display: flex; flex-direction: column; justify-content: flex-end;
  padding: calc(var(--nav-h) + 2rem) var(--pad) 3rem;
  position: relative; overflow: hidden; width: 100%;
}
.hero-bg {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  font-family: var(--font-display); font-size: clamp(6rem, 22vw, 18rem);
  color: rgba(255,255,255,0.018); white-space: nowrap;
  pointer-events: none; user-select: none; line-height: 1;
}
.hero-eyebrow { font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--lime); margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.7rem; }
.hero-eyebrow::before { content:''; width:28px; height:1px; background:var(--lime); flex-shrink:0; }
.hero-name { font-family: var(--font-display); font-size: clamp(2.8rem, 11vw, 9rem); line-height: 0.92; color: var(--text); animation: hi 0.8s cubic-bezier(0.16,1,0.3,1) both; }
.hero-name .serif { font-family: var(--font-serif); font-style: italic; color: var(--lime); }
@keyframes hi { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }

.hero-bottom {
  display: flex; flex-direction: column; gap: 1.5rem;
  margin-top: 2rem; padding-top: 2rem;
  border-top: 1px solid var(--border);
  animation: hi 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both;
  width: 100%;
}
.hero-desc {
  font-size: 0.85rem; line-height: 1.85; color: var(--muted);
  width: 100%;
  /* THIS IS THE KEY — wrap all text */
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
.hero-desc strong { color: var(--text); }
.hero-cta { display: flex; flex-direction: column; gap: 0.9rem; width: 100%; }
.hero-btns { display: flex; gap: 0.75rem; width: 100%; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 100px; font-family: var(--font-mono); font-size: 0.76rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.85rem 1.5rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; border: none; flex: 1; }
.btn-p { background: var(--lime); color: var(--bg); }
.btn-p:hover { background: var(--lime2); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,241,53,0.25); }
.btn-g { background: none; color: var(--text); border: 1px solid var(--border2) !important; }
.btn-g:hover { border-color: var(--text) !important; }
.hero-scroll { font-size: 0.63rem; color: var(--muted2); letter-spacing: 0.12em; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem; }
.hero-scroll::after { content:'↓'; animation: bob 2s infinite; }
@keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }

/* MARQUEE */
.marquee-wrap { padding: 2.5rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); overflow: hidden; background: var(--surface); width: 100%; }
.marquee-track { display: flex; white-space: nowrap; animation: mq 22s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }
.mq-item { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0 2rem; color: var(--muted2); display: flex; align-items: center; gap: 2rem; flex-shrink: 0; }
.mq-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); flex-shrink: 0; }
@keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }

/* SECTIONS — overflow hidden on every section */
section { padding: 6rem var(--pad); width: 100%; overflow: hidden; }
.s-label { font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--lime); display: flex; align-items: center; gap: 0.65rem; margin-bottom: 3rem; }
.s-label::before { content:''; width:24px; height:1px; background:var(--lime); flex-shrink:0; }
.s-num { color: var(--muted2); margin-left: 0.5rem; }

/* ABOUT */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
.about-hl { font-family: var(--font-display); font-size: clamp(2.2rem, 4.5vw, 4.5rem); line-height: 0.95; margin-bottom: 2rem; word-break: break-word; }
.about-hl em { font-family: var(--font-serif); font-style: italic; color: var(--lime); }
.about-body {
  font-size: 0.875rem; line-height: 2; color: var(--muted);
  /* CRITICAL — text must wrap, not overflow */
  width: 100%;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.about-body p { margin-bottom: 1.25rem; }
.about-body p:last-child { margin-bottom: 0; }
.about-body strong { color: var(--text); font-weight: 500; }

.skills { display: flex; flex-direction: column; }
.sk { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 0; border-bottom: 1px solid var(--border); }
.sk:first-child { border-top: 1px solid var(--border); }
.sk:hover .sk-name { color: var(--lime); }
.sk-name { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.04em; transition: color 0.2s; flex: 1; min-width: 0; }
.sk-bar-bg { width: 80px; height: 2px; background: var(--surface2); border-radius: 2px; overflow: hidden; flex-shrink: 0; }
.sk-bar { height: 100%; background: var(--lime); border-radius: 2px; transform-origin: left; transition: transform 1s ease; }
.sk-yr { font-size: 0.63rem; color: var(--muted2); flex-shrink: 0; white-space: nowrap; min-width: 44px; text-align: right; }

/* WORK */
.work-hd { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 3rem; gap: 1rem; flex-wrap: wrap; }
.work-hl { font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 5rem); line-height: 0.95; }
.work-meta { font-size: 0.75rem; color: var(--muted); text-align: right; line-height: 1.8; }
.proj-list { display: flex; flex-direction: column; width: 100%; }
.proj { display: grid; grid-template-columns: 56px minmax(0,1fr) auto; gap: 1.25rem; align-items: start; padding: 2rem 0; border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
.proj::before { content:''; position:absolute; inset:0; background:var(--surface); transform:translateY(100%); transition:transform 0.3s cubic-bezier(0.16,1,0.3,1); z-index:0; }
.proj:hover::before { transform:translateY(0); }
.proj > * { position:relative; z-index:1; }
.p-num { font-family: var(--font-display); font-size: 2.2rem; color: var(--muted2); line-height: 1; transition: color 0.2s; padding-top: 0.2rem; }
.proj:hover .p-num { color: var(--lime); }
.p-body { min-width: 0; width: 100%; }
.p-title { font-family: var(--font-display); font-size: clamp(1.05rem, 2vw, 1.75rem); letter-spacing: 0.02em; margin-bottom: 0.5rem; transition: color 0.2s; line-height: 1.1; word-break: break-word; }
.proj:hover .p-title { color: var(--lime); }
.p-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.7; word-break: break-word; overflow-wrap: break-word; }
.p-link { font-size: 0.7rem; color: var(--lime); margin-top: 0.5rem; word-break: break-all; }
.p-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
.ptag { font-size: 0.6rem; letter-spacing: 0.06em; text-transform: uppercase; border: 1px solid var(--border2); border-radius: 4px; padding: 0.2rem 0.5rem; color: var(--muted); white-space: nowrap; }
.p-arr { font-size: 1.3rem; color: var(--muted2); transition: all 0.2s; padding-top: 0.3rem; flex-shrink: 0; }
.proj:hover .p-arr { color: var(--lime); transform: translate(4px,-4px); }

/* EXPERIENCE */
.exp-grid { display: grid; grid-template-columns: 200px minmax(0,1fr); gap: 4rem; align-items: start; }
.exp-sticky { position: sticky; top: calc(var(--nav-h) + 1rem); }
.exp-big { font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 5.5rem); line-height: 0.9; word-break: break-word; }
.exp-big span { display: block; color: var(--lime); }
.exp-sub { font-size: 0.78rem; color: var(--muted); margin-top: 1.5rem; line-height: 1.8; }
.timeline { display: flex; flex-direction: column; min-width: 0; width: 100%; }
.tl-item { padding: 1.75rem 0 1.75rem 2rem; border-left: 1px solid var(--border); position: relative; transition: border-color 0.2s; min-width: 0; overflow: hidden; width: 100%; }
.tl-item:hover { border-color: var(--lime); }
.tl-dot { position: absolute; left: -5px; top: 2.2rem; width: 8px; height: 8px; border-radius: 50%; background: var(--muted2); border: 2px solid var(--bg); transition: background 0.2s; }
.tl-item:hover .tl-dot { background: var(--lime); }
.tl-period { font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--lime); margin-bottom: 0.5rem; }
.tl-role { font-family: var(--font-display); font-size: clamp(1.05rem, 1.8vw, 1.45rem); letter-spacing: 0.04em; margin-bottom: 0.2rem; line-height: 1.1; word-break: break-word; }
.tl-co { font-size: 0.76rem; color: var(--muted); margin-bottom: 0.75rem; word-break: break-word; }
.tl-desc { font-size: 0.76rem; color: var(--muted); line-height: 1.85; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; }

/* CONTACT */
.ct-wrap { max-width: 100%; }
.ct-big { font-family: var(--font-display); font-size: clamp(2.5rem, 7vw, 7rem); line-height: 0.92; margin-bottom: 3rem; word-break: break-word; }
.ct-big em { font-family: var(--font-serif); font-style: italic; color: var(--lime); }
.ct-links { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 3rem; }
.ct-link { display: flex; align-items: center; gap: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1rem 1.5rem; text-decoration: none; transition: all 0.2s; flex: 1; min-width: 180px; }
.ct-link:hover { border-color: var(--lime); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(200,241,53,0.1); }
.ct-icon { font-size: 1.1rem; flex-shrink: 0; }
.ct-lbl { font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted2); margin-bottom: 0.2rem; }
.ct-val { font-size: 0.74rem; color: var(--text); word-break: break-all; }
.ct-link:hover .ct-val { color: var(--lime); }
.ct-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2rem; width: 100%; }
.fi { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 0.9rem 1.1rem; font-family: var(--font-mono); font-size: 0.82rem; color: var(--text); transition: border-color 0.15s; outline: none; }
.fi:focus { border-color: var(--lime); }
.fi::placeholder { color: var(--muted2); }
.fi-full { grid-column: 1 / -1; }
textarea.fi { resize: vertical; min-height: 120px; line-height: 1.7; }

/* FOOTER */
footer { border-top: 1px solid var(--border); padding: 2rem var(--pad); display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; width: 100%; overflow: hidden; }
.ft-copy { font-size: 0.7rem; color: var(--muted2); }
.ft-r { display: flex; align-items: center; gap: 1rem; }
.ft-made { font-size: 0.68rem; color: var(--muted2); letter-spacing: 0.08em; }
.ft-top { font-size: 0.7rem; color: var(--muted); background: none; border: none; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.15s; display: flex; align-items: center; gap: 0.4rem; }
.ft-top:hover { color: var(--lime); }
.toast { position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; background: var(--lime); color: var(--bg); border-radius: 12px; padding: 0.9rem 1.5rem; font-family: var(--font-mono); font-size: 0.82rem; font-weight: 500; box-shadow: 0 8px 32px rgba(200,241,53,0.3); animation: su 0.3s ease; }
@keyframes su { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

/* ═══════════ DESKTOP side-by-side hero ═══════════ */
@media (min-width: 700px) {
  .hero-bottom { flex-direction: row; align-items: flex-end; justify-content: space-between; gap: 2rem; }
  .hero-desc { max-width: 380px; width: auto; }
  .hero-cta { width: auto; align-items: flex-end; }
  .hero-btns { width: auto; }
  .btn { flex: none; }
}

/* ═══════════ RESPONSIVE ═══════════ */
@media (min-width: 1440px) {
  :root { --pad: 4rem; }
  section { padding: 7rem var(--pad); }
}
@media (max-width: 1200px) {
  .exp-grid { grid-template-columns: 180px minmax(0,1fr); gap: 3rem; }
}
@media (max-width: 1024px) {
  .exp-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .exp-sticky { position: static; }
  .about-grid { gap: 3rem; }
}
@media (max-width: 900px) {
  :root { --pad: 1.5rem; }
  .nav-links { display: none; }
  .nav-status { display: none; }
  .burger { display: flex; }
  section { padding: 4.5rem var(--pad); }
  .hero { padding: calc(var(--nav-h) + 1.5rem) var(--pad) 3rem; }
  footer { padding: 1.75rem var(--pad); }
  /* Stack about on tablet */
  .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .ct-links { flex-direction: column; }
  .ct-link { min-width: unset; flex: none; width: 100%; }
  .proj { grid-template-columns: 50px minmax(0,1fr) 24px; gap: 1rem; }
}
@media (max-width: 640px) {
  :root { --pad: 1.25rem; }
  section { padding: 3.5rem var(--pad); }
  .hero { padding: calc(var(--nav-h) + 1rem) var(--pad) 2.5rem; }
  footer { padding: 1.5rem var(--pad); flex-direction: column; align-items: flex-start; }

  .hero-eyebrow { font-size: 0.58rem; letter-spacing: 0.1em; }
  .hero-name { font-size: clamp(2.5rem, 11vw, 4rem); }

  .about-hl { font-size: clamp(1.9rem, 8vw, 3rem); }
  .about-grid { grid-template-columns: 1fr; }
  .sk-bar-bg { width: 60px; }
  .sk-name { font-size: 1.2rem; }

  .work-hd { flex-direction: column; align-items: flex-start; }
  .work-meta { text-align: left; }
  .proj { grid-template-columns: 42px minmax(0,1fr); gap: 0.85rem; }
  .p-arr { display: none; }
  .p-num { font-size: 1.8rem; }

  .exp-grid { grid-template-columns: 1fr; gap: 2rem; }
  .tl-item { padding-left: 1.25rem; }

  .ct-big { font-size: clamp(2.2rem, 10vw, 3.5rem); margin-bottom: 2rem; }
  .ct-form { grid-template-columns: 1fr; }
  .fi-full { grid-column: 1; }
  .toast { right: var(--pad); left: var(--pad); text-align: center; bottom: 1.5rem; }
}
@media (max-width: 400px) {
  :root { --pad: 1rem; }
  .hero-name { font-size: clamp(2.2rem, 12vw, 3.2rem); }
  .mq-item { font-size: 1.2rem; padding: 0 1rem; gap: 1rem; }
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
  { title:"Telecom App Monitoring on Linux", desc:"Automation and monitoring in a Linux production environment. Log analysis, performance monitoring, server troubleshooting, and application availability support.", tags:["Linux","Shell Script","Log Analysis","Monitoring","Grafana"], link:null },
  { title:"E-Commerce Web Application",      desc:"Fully responsive e-commerce app built with React and Vite. Product listings, cart management, and clean UI. Deployed live on Vercel.",                    tags:["React","Vite","JavaScript","Node.js"],           link:"https://shopvault-alpha.vercel.app" },
  { title:"Personal Portfolio Website",      desc:"Designed and built from scratch with React and Vite. Animations, skill bars, project showcase, experience timeline, and working contact form.",            tags:["React","Vite","JavaScript","CSS"],               link:null },
  { title:"Gas Network GIS Project",         desc:"Manage and optimize gas network infrastructure across the US using ArcGIS Pro to map pipelines, distribution systems, and related assets.",                tags:["ArcGIS Pro","GIS","MySQL","Excel"],              link:null },
];
const EXPERIENCE = [
  { period:"2024 Feb – Present",   role:"Linux Engineer",                     company:"Mannash Solutions Pvt Ltd, India",                  desc:"Monitoring Linux servers in a telecom production environment. Analyzing logs with grep, awk, and shell scripts. Ensuring system stability and availability." },
  { period:"2023 July – 2024 Jan", role:"GIS Technician",                     company:"UDC India Technologies, Himachal Pradesh",          desc:"Gas network GIS projects using ArcGIS Pro. Mapping spatial data for pipeline infrastructure. Quality checks and spatial analysis for network optimization." },
  { period:"2024 – Present",       role:"Full-Stack Developer (Self-Learning)",company:"Personal Projects, Remote",                         desc:"Building web apps with JavaScript, React, Node.js, and MySQL. Deployed e-commerce app on Vercel. Expanding through Udemy and hands-on projects." },
];
const MARQUEE = ["Linux","Bash","Shell Script","Grafana","Node.js","MySQL","React","JavaScript","ArcGIS","Monitoring","Vite","HTML5"];

export default function App() {
  const [active, setActive] = useState("home");
  const [bars,   setBars]   = useState(false);
  const [toast,  setToast]  = useState(false);
  const [menu,   setMenu]   = useState(false);
  const skillsRef           = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setBars(true); }, { threshold: 0.1 });
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const fn = () => {
      const ids = ["home","about","work","experience","contact"];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const fn = (e) => { if (!e.target.closest("nav") && !e.target.closest(".mob-menu")) setMenu(false); };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, [menu]);

  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMenu(false); };
  const send = (e) => {
    e.preventDefault();
    emailjs.sendForm("service_nwt81jo","template_lu7o40l",e.target,"C2C44A1wdsf8zeg0y")
      .then(() => { setToast(true); setTimeout(()=>setToast(false),3000); e.target.reset(); })
      .catch(err => { console.error(err); alert("Something went wrong. Please try again."); });
  };

  return (
    <>
      <style>{CSS}</style>
      {toast && <div className="toast">✓ Message sent — I'll reply within 24h</div>}

      <nav>
        <div className="nav-logo">NS<span>.</span></div>
        <div className="nav-links">
          {["home","about","work","experience","contact"].map(s => (
            <button key={s} className={`nav-link${active===s?" active":""}`} onClick={()=>go(s)}>{s}</button>
          ))}
        </div>
        <div className="nav-status"><div className="sp"/>Available for work</div>
        <button className={`burger${menu?" open":""}`} onClick={()=>setMenu(o=>!o)} aria-label="Menu"><span/><span/><span/></button>
      </nav>

      <div className={`mob-menu${menu?" open":""}`}>
        {["home","about","work","experience","contact"].map(s => (
          <button key={s} className="mob-link" onClick={()=>go(s)}>{s}</button>
        ))}
        <div className="mob-status"><div className="sp"/>Available for work</div>
      </div>

      <section id="home" className="hero">
        <div className="hero-bg">NS</div>
        <div>
          <div className="hero-eyebrow">Linux Engineer &amp; Full-Stack Developer</div>
          <div className="hero-name">Nikhil<br/>Sharma<span className="serif">.</span></div>
        </div>
        <div className="hero-bottom">
          <p className="hero-desc">
            Linux Engineer with <strong>1.1 years</strong> of hands-on experience in system administration.
            Expanding into <strong>Full-Stack Web Development</strong> with React, Node.js and MySQL.
          </p>
          <div className="hero-cta">
            <div className="hero-btns">
              <button className="btn btn-p" onClick={()=>go("work")}>View Work ↓</button>
              <button className="btn btn-g" onClick={()=>go("contact")}>Get in Touch</button>
            </div>
            <div className="hero-scroll">Scroll to explore</div>
          </div>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...MARQUEE,...MARQUEE].map((t,i)=>(
            <span className="mq-item" key={i}>{t}<span className="mq-dot"/></span>
          ))}
        </div>
      </div>

      <section id="about">
        <div className="s-label">About<span className="s-num">— 01</span></div>
        <div className="about-grid">
          <div>
            <div className="about-hl">Linux is my<br/><em>foundation.</em><br/>Code is my<br/>craft.</div>
            <div className="about-body">
              <p>I am a <strong>Linux Engineer</strong> with 1.1 years of professional experience managing Linux-based systems in a telecom production environment.</p>
              <p>Hands-on with <strong>system administration</strong>, log analysis, performance monitoring, and server troubleshooting.</p>
              <p>Expanding into <strong>Full-Stack Web Development</strong> — building real projects with JavaScript, React, Node.js, and MySQL.</p>
            </div>
          </div>
          <div ref={skillsRef}>
            <div className="skills">
              {SKILLS.map(s=>(
                <div className="sk" key={s.name}>
                  <div className="sk-name">{s.name}</div>
                  <div className="sk-bar-bg"><div className="sk-bar" style={{transform:`scaleX(${bars?s.level/100:0})`}}/></div>
                  <div className="sk-yr">{s.years}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="work" style={{borderTop:"1px solid var(--border)"}}>
        <div className="s-label">Selected Work<span className="s-num">— 02</span></div>
        <div className="work-hd">
          <div className="work-hl">Projects.</div>
          <div className="work-meta">{PROJECTS.length} projects<br/>2023 – 2025</div>
        </div>
        <div className="proj-list">
          {PROJECTS.map((p,i)=>(
            <div className="proj" key={p.title} style={{cursor:p.link?"pointer":"default"}} onClick={()=>p.link&&window.open(p.link,"_blank")}>
              <div className="p-num">0{i+1}</div>
              <div className="p-body">
                <div className="p-title">{p.title}</div>
                <div className="p-desc">{p.desc}</div>
                {p.link&&<div className="p-link">🔗 {p.link}</div>}
                <div className="p-tags">{p.tags.map(t=><span key={t} className="ptag">{t}</span>)}</div>
              </div>
              {p.link&&<div className="p-arr">↗</div>}
            </div>
          ))}
        </div>
      </section>

      <section id="experience" style={{borderTop:"1px solid var(--border)"}}>
        <div className="s-label">Experience<span className="s-num">— 03</span></div>
        <div className="exp-grid">
          <div className="exp-sticky">
            <div className="exp-big">1.7<span>Years</span>Of<span>Work.</span></div>
            <div className="exp-sub">Linux systems<br/>to full-stack<br/>web development.</div>
          </div>
          <div className="timeline">
            {EXPERIENCE.map(e=>(
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

      <section id="contact" style={{borderTop:"1px solid var(--border)"}}>
        <div className="s-label">Contact<span className="s-num">— 04</span></div>
        <div className="ct-wrap">
          <div className="ct-big">Let's build<br/>something<br/><em>great.</em></div>
          <div className="ct-links">
            {[
              {icon:"✉️",lbl:"Email",   val:"nikhilsharma2203@gmail.com",   href:"mailto:nikhilsharma2203@gmail.com"},
              {icon:"🐙",lbl:"GitHub",  val:"github.com/nikhilsharma7777",  href:"https://github.com/nikhilsharma7777"},
              {icon:"💼",lbl:"LinkedIn",val:"linkedin.com/in/nikhil-sharma", href:"https://www.linkedin.com/in/nikhil-sharma-013082220"},
            ].map(l=>(
              <a key={l.lbl} className="ct-link" href={l.href} target="_blank" rel="noreferrer">
                <span className="ct-icon">{l.icon}</span>
                <div><div className="ct-lbl">{l.lbl}</div><div className="ct-val">{l.val}</div></div>
              </a>
            ))}
          </div>
          <form onSubmit={send} className="ct-form">
            <input    className="fi"         name="from_name"  placeholder="Your name"   required/>
            <input    className="fi"         name="from_email" placeholder="Your email"  type="email" required/>
            <textarea className="fi fi-full" name="message"    placeholder="Tell me about your project or opportunity…" rows={5} required/>
            <div className="fi-full">
              <button type="submit" className="btn btn-p" style={{minWidth:180}}>Send Message →</button>
            </div>
          </form>
        </div>
      </section>

      <footer>
        <div className="ft-copy">© 2026 Nikhil Sharma. All rights reserved.</div>
        <div className="ft-r">
          <span className="ft-made">DESIGNED &amp; BUILT WITH ♥</span>
          <button className="ft-top" onClick={()=>go("home")}>↑ Back to top</button>
        </div>
      </footer>
    </>
  );
}
