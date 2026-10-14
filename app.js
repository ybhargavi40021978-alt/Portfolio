/**
 * Personal Portfolio Application Logic
 * Implements decoupled API architecture for profile, projects, and skills data.
 */

// ==================== Configuration & Fallback Mock Data ====================
// These realistic mock datasets serve as default design mockup content
// and will automatically fall back if the backend REST API is not yet connected.

const FALLBACK_PROFILE = {
  name: "Alex Morgan",
  role: "Full-stack Developer",
  headline: "I build practical, responsive web experiences.",
  intro: "I'm a developer focused on building modern web applications using JavaScript, Node.js, Express.js, and MongoDB.",
  portraitUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
};

const FALLBACK_PROJECTS = [
  {
    id: "proj-1",
    title: "E-Commerce Web App",
    description: "A modern e-commerce platform with cart and payment integration.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Node.js", "MongoDB"]
  },
  {
    id: "proj-2",
    title: "Task Management App",
    description: "A productivity app to manage tasks and track efficiency.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Express.js", "MongoDB"]
  },
  {
    id: "proj-3",
    title: "Weather Dashboard",
    description: "Real-time weather details with location search and forecasts.",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80",
    tags: ["JavaScript", "API", "CSS"]
  }
];

const SKILL_ICONS = {
  "HTML": `<svg viewBox="0 0 24 24" fill="#E34F26"><path d="M12 2l8 2.7-1.2 13.5L12 21.8 5.2 18.2 4 4.7 12 2zm0 2.2l-6 2 .9 10.3 5.1 2.7 5.1-2.7.9-10.3-6-2zm-3.4 4.5h6.8l-.2 2.3h-4.2l.2 2.3h3.8l-.5 4.9-2.7 1.4-2.7-1.4-.2-2.1h1.7l.1 1 1.1.6 1.1-.6.2-2H8.3l-.3-4.5z"/></svg>`,
  "CSS": `<svg viewBox="0 0 24 24" fill="#1572B6"><path d="M12 2l8 2.7-1.2 13.5L12 21.8 5.2 18.2 4 4.7 12 2zm0 2.2l-6 2 .9 10.3 5.1 2.7 5.1-2.7.9-10.3-6-2zm-3.4 4.5h6.8l-.2 2.3h-4.2l.2 2.3h3.8l-.5 4.9-2.7 1.4-2.7-1.4-.2-2.1h1.7l.1 1 1.1.6 1.1-.6.2-2H8.3l-.3-4.5z"/></svg>`,
  "JavaScript": `<svg viewBox="0 0 24 24" fill="#F7DF1E"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><path d="M7 16.5c.5.8 1.2 1.3 2.1 1.3 1.1 0 1.8-.6 1.8-1.9v-6.4h2.1v6.5c0 2.3-1.4 3.4-3.8 3.4-1.7 0-2.8-.7-3.4-1.9l1.2-1zm8.2-.1c.6.9 1.5 1.5 2.6 1.5 1.1 0 1.8-.6 1.8-1.4 0-.9-.7-1.3-2-1.9-1.8-.8-3-1.6-3-3.4 0-1.9 1.5-3.3 3.7-3.3 1.6 0 2.8.6 3.5 1.8l-1.6 1c-.4-.7-1-1-1.9-1-.9 0-1.5.5-1.5 1.2 0 .8.6 1.2 1.8 1.7 1.9.8 3.2 1.6 3.2 3.5 0 2.1-1.7 3.5-4 3.5-2.1 0-3.5-.9-4.2-2.3l1.6-1.1z" fill="#000"/></svg>`,
  "Node.js": `<svg viewBox="0 0 24 24" fill="#339933"><path d="M12 2l9 5.2v10.4L12 22.8 3 17.6V7.2L12 2zm0 2.4L5.2 8.3v7.4L12 19.6l6.8-3.9V8.3L12 4.4z"/><circle cx="12" cy="12" r="3" fill="#339933"/></svg>`,
  "Express.js": `<svg viewBox="0 0 24 24" fill="#000000"><text x="12" y="16" font-size="12" font-weight="bold" text-anchor="middle" font-family="Inter, sans-serif">ex</text><rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="#000000" stroke-width="2"/></svg>`,
  "MongoDB": `<svg viewBox="0 0 24 24" fill="#47A248"><path d="M12 1.5s-6 6.3-6 11.5c0 4.1 2.7 7.5 6 9.5 3.3-2 6-5.4 6-9.5 0-5.2-6-11.5-6-11.5zm-.5 17.7v-7.1c0-.4.3-.7.7-.7.4 0 .7.3.7.7v7.1c-.5.2-1 .2-1.4 0z"/></svg>`,
  "Git": `<svg viewBox="0 0 24 24" fill="#F05032"><path d="M21.7 10.6l-8.3-8.3c-.8-.8-2.1-.8-2.8 0L8.7 4.2 11 6.5c.6-.2 1.3-.1 1.7.4.5.5.6 1.2.3 1.8l2.2 2.2c.6-.3 1.3-.2 1.8.3.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.5-.5-.6-1.3-.3-1.8L12 9.8v5.5c.2.1.4.3.5.5.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.7-.7-.7-1.9 0-2.6.2-.2.5-.4.8-.5V9.6c-.3-.1-.5-.3-.7-.5-.6-.5-.7-1.3-.4-1.9L7.3 4.8 2.3 9.8c-.8.8-.8 2.1 0 2.8l8.3 8.3c.8.8 2.1.8 2.8 0l8.3-8.3c.8-.8.8-2 .0-2z"/></svg>`,
  "GitHub": `<svg viewBox="0 0 24 24" fill="#181717"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`
};

const FALLBACK_SKILLS = [
  { name: "HTML" },
  { name: "CSS" },
  { name: "JavaScript" },
  { name: "Node.js" },
  { name: "Express.js" },
  { name: "MongoDB" },
  { name: "Git" },
  { name: "GitHub" }
];

// ==================== API Data Service ====================
// Decoupled layer allowing clean communication with Node/Express REST endpoints
const ApiService = {
  async getProfile() {
    try {
      const response = await fetch('/api/profile', { method: 'GET' });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch {
      // Fallback for development mockup
      return FALLBACK_PROFILE;
    }
  },

  async getFeaturedProjects() {
    try {
      const response = await fetch('/api/projects?featured=true', { method: 'GET' });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch {
      return FALLBACK_PROJECTS;
    }
  },

  async getSkills() {
    try {
      const response = await fetch('/api/skills?preview=true', { method: 'GET' });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return Array.isArray(data) ? data : (data.skills || FALLBACK_SKILLS);
    } catch {
      return FALLBACK_SKILLS;
    }
  }
};

// ==================== UI Rendering Functions ====================

function renderProfile(profile) {
  const roleBadge = document.getElementById('hero-role-badge');
  const profileName = document.getElementById('profile-name');
  const headline = document.getElementById('hero-headline');
  const description = document.getElementById('hero-description');
  const portraitImg = document.getElementById('profile-portrait-img');
  const footerCopyright = document.getElementById('footer-copyright');

  if (roleBadge) roleBadge.textContent = profile.role || "Full-stack Developer";
  if (profileName) profileName.textContent = profile.name || "Alex Morgan";
  if (headline) headline.textContent = profile.headline || "I build practical, responsive web experiences.";
  if (description) description.textContent = profile.intro || "I'm a developer focused on building modern web applications.";
  if (portraitImg && profile.portraitUrl) portraitImg.src = profile.portraitUrl;
  if (footerCopyright) {
    const currentYear = new Date().getFullYear();
    footerCopyright.innerHTML = `&copy; ${currentYear} ${profile.name || "[Your Name]"}. All rights reserved.`;
  }
}

function renderProjects(projects) {
  const container = document.getElementById('featured-projects-grid');
  if (!container) return;

  if (!projects || projects.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No featured projects found.</p></div>`;
    return;
  }

  // Display exactly up to 3 featured cards as per spec
  const items = projects.slice(0, 3);

  container.innerHTML = items.map(project => `
    <article class="project-card" id="${project._id || project.id}">
      <div class="project-thumb-container">
        <img 
          src="${project.thumbnail || project.image}" 
          alt="${project.title} Preview" 
          class="project-thumb"
          loading="lazy"
        />
      </div>
      <div class="project-content">
        <h3 class="project-card-title">${project.title}</h3>
        <p class="project-card-desc">${project.description}</p>
        <div class="project-tags">
          ${(project.technologies || project.tags || []).map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');
}

function renderSkills(skills) {
  const container = document.getElementById('skills-grid');
  if (!container) return;

  if (!skills || skills.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No skills loaded.</p></div>`;
    return;
  }

  // Render 8 skills
  const items = skills.slice(0, 8);

  container.innerHTML = items.map(skill => {
    const iconSvg = SKILL_ICONS[skill.name] || `<svg viewBox="0 0 24 24" fill="#64748B"><circle cx="12" cy="12" r="10"/></svg>`;
    return `
      <div class="skill-card">
        <div class="skill-icon-box" aria-hidden="true">
          ${iconSvg}
        </div>
        <span class="skill-name">${skill.name}</span>
      </div>
    `;
  }).join('');
}

// ==================== Navigation & Interactions ====================

function setupNavigation() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile drawer when clicking any link
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active state highlighting on scroll/click
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// ==================== Initialization ====================

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();

  try {
    const [profile, projects, skills] = await Promise.all([
      ApiService.getProfile(),
      ApiService.getFeaturedProjects(),
      ApiService.getSkills()
    ]);

    renderProfile(profile);
    renderProjects(projects);
    renderSkills(skills);
  } catch (error) {
    console.error('Error loading portfolio data:', error);
  }
});
