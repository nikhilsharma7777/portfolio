import { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";

const PROFILE = {
  name: "Nikhil Sharma",
  role: "Full-Stack Developer",
  secondaryRole: "Linux Systems Engineer",
  email: "nikhilsharma2203@gmail.com",
  github: "https://github.com/nikhilsharma7777",
  linkedin: "https://www.linkedin.com/in/nikhil-sharma-013082220",
  location: "India",
  // Add your PDF to the public folder and update this path.
  resume: "/Nikhil-Sharma-Resume.pdf",
};

const SKILL_GROUPS = [
  {
    title: "Frontend",
    skills: ["JavaScript", "React", "Vite", "HTML5", "CSS3"],
  },
  {
    title: "Backend & Database",
    skills: ["Node.js", "MySQL", "REST APIs"],
  },
  {
    title: "Linux & Operations",
    skills: ["RHEL / Linux Administration", "Bash / Shell Scripting", "Log Analysis", "Server Monitoring", "Troubleshooting"],
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "Grafana", "ArcGIS Pro", "Excel"],
  },
];

const PROJECTS = [
  {
    number: "01",
    title: "ShoeHub — E-Commerce Web Application",
    category: "Development",
    description:
      "A modern, responsive shoe shopping application featuring product listings, product browsing, and cart management, designed to provide a smooth online shopping experience.",
    outcome: "Live application",
    stack: ["React", "Vite", "JavaScript", "CSS"],
    demo: "https://solehub-phi.vercel.app",
    github: "",
  },
  {
    number: "02",
    title: "Image Gallery Web Application",
    category: "Development",
    description:
      "A responsive image gallery application that displays images in an organized grid layout, allowing users to browse, explore, and view images with a clean and user-friendly interface.",
    outcome: "Interactive web application",
    stack: ["React", "JavaScript", "CSS", "HTML5"],
    demo: "https://my-gallery-ashen.vercel.app",
    github: "",
  },
  {
    number: "03",
    title: "E-Commerce Web Application",
    category: "Development",
    description:
      "A responsive shopping application featuring product listings and cart management, built with React and Vite.",
    outcome: "Live application",
    stack: ["React", "Vite", "JavaScript", "CSS"],
    demo: "https://shopvault-alpha.vercel.app",
    github: "",
  },
  {
    number: "04",
    title: "Telecom Application Monitoring",
    category: "Linux",
    description:
      "Linux production support work involving log analysis, shell-script-based automation, server monitoring and application availability checks.",
    outcome: "Operations experience",
    stack: ["RHEL", "Bash", "grep", "awk", "Grafana"],
    demo: "",
    github: "",
  },
  {
    number: "05",
    title: "Gas Network GIS Project",
    category: "Data & GIS",
    description:
      "Worked with gas-network infrastructure data, mapping pipeline assets and supporting spatial quality checks and analysis.",
    outcome: "Professional project",
    stack: ["ArcGIS Pro", "GIS", "MySQL", "Excel"],
    demo: "",
    github: "",
  },
  {
    number: "06",
    title: "Personal Portfolio Website",
    category: "Development",
    description:
      "A responsive portfolio built with React, showcasing development projects, technical skills and professional experience.",
    outcome: "This portfolio",
    stack: ["React", "JavaScript", "CSS"],
    demo: "",
    github: "",
  },
];

const EXPERIENCE = [
  {
    period: "February 2025 – Present",
    role: "Linux Engineer",
    company: "Mannash Solutions Pvt. Ltd.",
    type: "Professional Experience",
    points: [
      "Support Linux systems in a telecom production environment.",
      "Analyze application and system logs using grep, awk and shell commands.",
      "Assist with server monitoring, troubleshooting and system availability.",
      "Use shell scripting to support operational tasks and reporting.",
    ],
  },
  {
    period: "2025 – Present",
    role: "Full-Stack Development",
    company: "Independent Learning & Projects",
    type: "Personal Development",
    points: [
      "Build frontend projects using JavaScript, React and Vite.",
      "Practise backend development with Node.js and MySQL.",
      "Develop and deploy practical applications, including an e-commerce project.",
    ],
  },
  {
    period: "July 2024 – January 2025",
    role: "GIS Technician",
    company: "UDC India Technologies",
    type: "Professional Experience",
    points: [
      "Worked on gas-network GIS data and pipeline infrastructure mapping.",
      "Supported spatial data quality checks and analysis using ArcGIS Pro.",
    ],
  },
];

const FILTERS = ["All", "Development", "Linux", "Data & GIS"];

function ArrowUpRight() {
  return <span aria-hidden="true" className="arrow">↗</span>;
}

function SectionHeading({ eyebrow, title, number }) {
  return (
    <div className="section-heading">
      <div className="eyebrow"><span />{eyebrow} <span className="section-number">/ {number}</span></div>
      <h2>{title}</h2>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [formState, setFormState] = useState("idle");

  const visibleProjects = useMemo(
    () => filter === "All" ? PROJECTS : PROJECTS.filter((project) => project.category === filter),
    [filter]
  );

  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, []);

  const navigateTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  // Store the form before the asynchronous operation
  const form = event.currentTarget;

  const serviceId = "service_nwt81jo";
  const templateId = "template_lu7o40l";
  const publicKey = "C2C44A1wdsf8zeg0y";

  setFormState("sending");

  try {
    await emailjs.sendForm(serviceId, templateId, form, publicKey);

    setFormState("success");
    form.reset();
  } catch (error) {
    console.error("EmailJS submission failed:", error);
    setFormState("error");
  }
};

  const navItems = ["home", "about", "skills", "projects", "experience", "contact"];

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" onClick={() => setMenuOpen(false)} aria-label="Nikhil Sharma home">
          NS<span>.</span>
        </a>

        <nav className={`desktop-nav ${menuOpen ? "nav-open" : ""}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item}
              className={activeSection === item ? "nav-item active" : "nav-item"}
              onClick={() => navigateTo(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <a className="header-cta" href={PROFILE.resume} target="_blank" rel="noreferrer">
          Resume <ArrowUpRight />
        </a>

        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          <span /><span />
        </button>
      </header>

      <main>
        <section className="hero section-shell" id="home">
          <div className="hero-glow" />
          <div className="hero-content">
            <div className="availability"><span className="availability-dot" /> OPEN TO OPPORTUNITIES</div>
            <p className="hero-kicker">HELLO, I'M NIKHIL SHARMA</p>
            <h1>
              Building for the <span className="accent-text">web.</span>
              <br />
              Understanding the <span className="serif-text">systems.</span>
            </h1>
            <p className="hero-description">
              I’m a <strong>Full-Stack Developer in progress</strong> and a
              <strong> Linux Systems Engineer</strong>, combining hands-on
              production support experience with practical web development projects.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => navigateTo("projects")}>Explore my work <ArrowUpRight /></button>
              <a className="button button-secondary" href={PROFILE.resume} target="_blank" rel="noreferrer">View resume <ArrowUpRight /></a>
            </div>
            <div className="hero-meta">
              <span>{PROFILE.location}</span>
              <span className="meta-divider" />
              <span>React · Node.js · Linux · MySQL</span>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true">PORTFOLIO / 2026</div>
          <button className="scroll-cue" onClick={() => navigateTo("about")}>SCROLL TO EXPLORE <span>↓</span></button>
        </section>

        <section className="intro-strip" aria-label="Professional focus">
          <div>DEVELOPMENT <span>✳</span></div>
          <div>SYSTEMS <span>✳</span></div>
          <div>AUTOMATION <span>✳</span></div>
          <div>PROBLEM SOLVING <span>✳</span></div>
        </section>

        <section className="section-shell content-section" id="about">
          <SectionHeading eyebrow="A little about me" title="Curious by nature. Practical by approach." number="01" />
          <div className="about-layout">
            <div className="about-lead reveal">
              <p>
                I enjoy working where <span className="accent-text">software meets infrastructure.</span>
              </p>
            </div>
            <div className="about-copy reveal">
              <p>
                I’m a Computer Engineer currently working as a Linux Engineer in a
                telecom production environment. My day-to-day work has helped me
                build a practical foundation in Linux administration, log analysis,
                monitoring and troubleshooting.
              </p>
              <p>
                Alongside my professional role, I’m developing my full-stack skills
                through hands-on projects using JavaScript, React, Node.js and MySQL.
                I enjoy turning ideas into useful, responsive applications and
                continuously improving how I build them.
              </p>
              <a className="text-link" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                More about my professional journey <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        <section className="section-shell content-section skills-section" id="skills">
          <SectionHeading eyebrow="My toolkit" title="Tools I work with." number="02" />
          <div className="skill-grid">
            {SKILL_GROUPS.map((group, index) => (
              <article className="skill-card reveal" key={group.title}>
                <div className="skill-card-top"><span>0{index + 1}</span><span>↗</span></div>
                <h3>{group.title}</h3>
                <div className="skill-tags">
                  {group.skills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell content-section projects-section" id="projects">
          <SectionHeading eyebrow="Selected work" title="Projects with purpose." number="03" />
          <div className="project-toolbar">
            <p>A selection of professional experience and hands-on work.</p>
            <div className="filter-list" aria-label="Filter projects">
              {FILTERS.map((item) => (
                <button key={item} className={filter === item ? "filter active" : "filter"} onClick={() => setFilter(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="project-grid">
            {visibleProjects.map((project) => (
              <article className="project-card reveal" key={project.number}>
                <div className="project-topline">
                  <span>PROJECT / {project.number}</span>
                  <span className="project-category">{project.category}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-outcome">{project.outcome}</div>
                <div className="project-tags">
                  {project.stack.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="project-links">
                  {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo <ArrowUpRight /></a>}
                  {project.github && <a href={project.github} target="_blank" rel="noreferrer">Source code <ArrowUpRight /></a>}
                  {!project.demo && !project.github && <span className="private-note">Experience / case study</span>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell content-section experience-section" id="experience">
          <SectionHeading eyebrow="Where I've been" title="Experience & learning." number="04" />
          <div className="timeline">
            {EXPERIENCE.map((item, index) => (
              <article className="timeline-item reveal" key={`${item.role}-${item.period}`}>
                <div className="timeline-marker">{String(index + 1).padStart(2, "0")}</div>
                <div className="timeline-date">{item.period}<span>{item.type}</span></div>
                <div className="timeline-content">
                  <h3>{item.role}</h3>
                  <p className="timeline-company">{item.company}</p>
                  <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section section-shell" id="contact">
          <div className="contact-heading reveal">
            <div className="eyebrow"><span /> HAVE A ROLE OR PROJECT IN MIND? <span className="section-number">/ 05</span></div>
            <h2>Let's make<br /><span className="serif-text">something useful.</span></h2>
            <p>I’m open to conversations about development opportunities, Linux roles and interesting projects.</p>
            <a className="contact-email" href={`mailto:${PROFILE.email}`}>{PROFILE.email} <ArrowUpRight /></a>
            <div className="social-links">
              <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
            </div>
          </div>

          <form className="contact-form reveal" onSubmit={handleSubmit}>
            <label>
              YOUR NAME
              <input name="from_name" type="text" placeholder="Your name" required />
            </label>
            <label>
              EMAIL ADDRESS
              <input name="from_email" type="email" placeholder="you@example.com" required />
            </label>
            <label>
              HOW CAN I HELP?
              <textarea name="message" rows="5" placeholder="Tell me a little about the opportunity or project..." required />
            </label>
            <button className="button button-primary submit-button" type="submit" disabled={formState === "sending"}>
              {formState === "sending" ? "Sending..." : "Send message"} <ArrowUpRight />
            </button>
            {formState === "success" && <p className="form-message success" role="status">Thanks for reaching out. Your message has been sent.</p>}
            {formState === "error" && <p className="form-message error" role="alert">Something went wrong. Please email me directly.</p>}
            {formState === "config" && <p className="form-message error" role="alert">The contact form is not configured yet. Please use the email link.</p>}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#home">NS<span>.</span></a>
        <p>© {new Date().getFullYear()} Nikhil Sharma. Built with care.</p>
        <button onClick={() => navigateTo("home")}>BACK TO TOP ↑</button>
      </footer>
    </>
  );
}
