/**
 * Personal Portfolio - Skills Page Controller (skills.js)
 * Fetches categorized skill records from GET /api/skills with dynamic rendering,
 * loading skeletons, and error retry handling.
 */

// Fallback categorized dataset matching prompt specifications
const FALLBACK_CATEGORIES = [
  {
    id: "frontend",
    title: "Frontend",
    description: "Technologies for building user interfaces and responsive web applications.",
    icon: "monitor",
    order: 1,
    skills: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript" },
      { name: "React" },
      { name: "Tailwind CSS" }
    ]
  },
  {
    id: "backend",
    title: "Backend",
    description: "Server-side technologies and frameworks for building scalable applications.",
    icon: "server",
    order: 2,
    skills: [
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "Python" },
      { name: "REST APIs" }
    ]
  },
  {
    id: "database",
    title: "Database",
    description: "Databases and data management systems for storing and retrieving information.",
    icon: "database",
    order: 3,
    skills: [
      { name: "MongoDB" },
      { name: "MySQL" },
      { name: "PostgreSQL" },
      { name: "SQLite" }
    ]
  },
  {
    id: "tools",
    title: "Tools",
    description: "Development tools and platforms for efficient workflow and version control.",
    icon: "wrench",
    order: 4,
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "VS Code" },
      { name: "Docker" },
      { name: "Postman" }
    ]
  },
  {
    id: "additional",
    title: "Additional",
    description: "Other useful technologies and concepts I work with.",
    icon: "star",
    order: 5,
    skills: [
      { name: "npm" },
      { name: "Webpack" },
      { name: "Linux" },
      { name: "Agile" }
    ]
  }
];

// SVG Icon Library
const CATEGORY_ICONS = {
  monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>`,
  server: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2"></rect><rect width="20" height="8" x="2" y="14" rx="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>`,
  database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>`,
  wrench: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
};

const TECH_PILL_ICONS = {
  "HTML": `<svg viewBox="0 0 24 24" fill="#E34F26"><path d="M12 2l8 2.7-1.2 13.5L12 21.8 5.2 18.2 4 4.7 12 2zm0 2.2l-6 2 .9 10.3 5.1 2.7 5.1-2.7.9-10.3-6-2z"/></svg>`,
  "CSS": `<svg viewBox="0 0 24 24" fill="#1572B6"><path d="M12 2l8 2.7-1.2 13.5L12 21.8 5.2 18.2 4 4.7 12 2zm0 2.2l-6 2 .9 10.3 5.1 2.7 5.1-2.7.9-10.3-6-2z"/></svg>`,
  "JavaScript": `<svg viewBox="0 0 24 24" fill="#EAB308"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><path d="M7 16.5c.5.8 1.2 1.3 2.1 1.3 1.1 0 1.8-.6 1.8-1.9v-6.4h2.1v6.5c0 2.3-1.4 3.4-3.8 3.4-1.7 0-2.8-.7-3.4-1.9l1.2-1zm8.2-.1c.6.9 1.5 1.5 2.6 1.5 1.1 0 1.8-.6 1.8-1.4 0-.9-.7-1.3-2-1.9-1.8-.8-3-1.6-3-3.4 0-1.9 1.5-3.3 3.7-3.3 1.6 0 2.8.6 3.5 1.8l-1.6 1c-.4-.7-1-1-1.9-1-.9 0-1.5.5-1.5 1.2 0 .8.6 1.2 1.8 1.7 1.9.8 3.2 1.6 3.2 3.5 0 2.1-1.7 3.5-4 3.5-2.1 0-3.5-.9-4.2-2.3l1.6-1.1z" fill="#000"/></svg>`,
  "React": `<svg viewBox="0 0 24 24" fill="#61DAFB"><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)" fill="none" stroke="#61DAFB" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)" fill="none" stroke="#61DAFB" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)" fill="none" stroke="#61DAFB" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="#61DAFB"/></svg>`,
  "Tailwind CSS": `<svg viewBox="0 0 24 24" fill="#38BDF8"><path d="M12 6c-2.4 0-4.2 1.2-5.4 3.6 1.2-.6 2.4-.9 3.6-.9 1.8 0 3 1.2 4.2 2.4 1.2 1.2 2.4 2.1 4.2 2.1 2.4 0 4.2-1.2 5.4-3.6-1.2.6-2.4.9-3.6.9-1.8 0-3-1.2-4.2-2.4C15 6.9 13.8 6 12 6zM6 13.2c-2.4 0-4.2 1.2-5.4 3.6 1.2-.6 2.4-.9 3.6-.9 1.8 0 3 1.2 4.2 2.4 1.2 1.2 2.4 2.1 4.2 2.1 2.4 0 4.2-1.2 5.4-3.6-1.2.6-2.4.9-3.6.9-1.8 0-3-1.2-4.2-2.4C9 14.1 7.8 13.2 6 13.2z"/></svg>`,
  "Node.js": `<svg viewBox="0 0 24 24" fill="#339933"><path d="M12 2l9 5.2v10.4L12 22.8 3 17.6V7.2L12 2zm0 2.4L5.2 8.3v7.4L12 19.6l6.8-3.9V8.3L12 4.4z"/><circle cx="12" cy="12" r="2.5" fill="#339933"/></svg>`,
  "Express.js": `<svg viewBox="0 0 24 24" fill="#172B4D"><text x="12" y="16" font-size="11" font-weight="bold" text-anchor="middle" font-family="Inter, sans-serif">ex</text><rect x="2" y="3" width="20" height="18" rx="4" fill="none" stroke="#172B4D" stroke-width="1.8"/></svg>`,
  "MongoDB": `<svg viewBox="0 0 24 24" fill="#47A248"><path d="M12 1.5s-6 6.3-6 11.5c0 4.1 2.7 7.5 6 9.5 3.3-2 6-5.4 6-9.5 0-5.2-6-11.5-6-11.5zm-.5 17.7v-7.1c0-.4.3-.7.7-.7.4 0 .7.3.7.7v7.1c-.5.2-1 .2-1.4 0z"/></svg>`,
  "Git": `<svg viewBox="0 0 24 24" fill="#F05032"><circle cx="12" cy="12" r="8" fill="none" stroke="#F05032" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="#F05032"/></svg>`,
  "GitHub": `<svg viewBox="0 0 24 24" fill="#181717"><circle cx="12" cy="12" r="9" fill="#181717"/><path d="M12 6a6 6 0 0 0-1.9 11.7c.3 0 .4-.1.4-.3v-1.1c-1.7.4-2-.8-2-.8-.3-.7-.7-.9-.7-.9-.5-.4 0-.4 0-.4.6 0 .9.6.9.6.5.9 1.4.6 1.8.5 0-.4.2-.6.4-.8-1.3-.1-2.7-.7-2.7-3 0-.7.2-1.2.6-1.6 0-.2-.3-.8.1-1.6 0 0 .5-.2 1.7.6a6 6 0 0 1 3.1 0c1.2-.8 1.7-.6 1.7-.6.4.8.1 1.4.1 1.6.4.4.6 1 .6 1.6 0 2.3-1.4 2.8-2.7 3 .2.2.4.6.4 1.1v1.7c0 .2.1.3.4.3A6 6 0 0 0 12 6z" fill="#FFF"/></svg>`
};

function getTechIcon(name) {
  if (TECH_PILL_ICONS[name]) return TECH_PILL_ICONS[name];
  return `<svg viewBox="0 0 24 24" fill="#2563EB"><circle cx="12" cy="12" r="5"/></svg>`;
}

// ==================== Component Builders ====================

function createTechPill(skill) {
  const name = typeof skill === 'string' ? skill : skill.name;
  return `
    <span class="skill-pill">
      <span class="skill-pill-icon" aria-hidden="true">${getTechIcon(name)}</span>
      <span>${name}</span>
    </span>
  `;
}

function createCategoryCard(category) {
  const iconSvg = CATEGORY_ICONS[category.icon] || CATEGORY_ICONS.monitor;
  const pillsHtml = (category.skills || []).map(createTechPill).join('');

  return `
    <article class="skill-cat-card" id="cat-${category.id}">
      <div class="cat-header">
        <div class="cat-icon-badge" aria-hidden="true">
          ${iconSvg}
        </div>
        <h2 class="cat-title">${category.title}</h2>
      </div>
      <p class="cat-desc">${category.description}</p>
      <div class="cat-tags-wrap">
        ${pillsHtml}
      </div>
    </article>
  `;
}

function createLearningCalloutCard() {
  return `
    <article class="learning-callout-card" id="card-learning-callout">
      <div class="learning-callout-text">
        <h2 class="learning-callout-heading">Always learning, always building.</h2>
        <p class="learning-callout-sub">Exploring new technologies and improving my skills every day.</p>
      </div>
      <div class="learning-illustration" aria-hidden="true">
        <div class="browser-bar">
          <span class="browser-dot"></span>
          <span class="browser-dot"></span>
          <span class="browser-dot"></span>
        </div>
        <div class="browser-screen">&lt;/&gt;</div>
      </div>
    </article>
  `;
}

// ==================== Rendering & State Management ====================

function renderSkeletons() {
  const grid = document.getElementById('skills-categories-grid');
  if (!grid) return;

  grid.innerHTML = Array(6).fill('<div class="skeleton-card"></div>').join('');
}

function renderSkillsGrid(categories) {
  const grid = document.getElementById('skills-categories-grid');
  if (!grid) return;

  const validCategories = (categories || []).filter(c => c && c.skills && c.skills.length > 0);

  // If no categories found
  if (validCategories.length === 0) {
    grid.innerHTML = `
      <div class="feedback-box" style="grid-column: 1 / -1;">
        <p>No skill categories available.</p>
      </div>
    `;
    return;
  }

  // Render Category Cards + Learning Callout Card (Card 6)
  const categoryCardsHtml = validCategories.map(createCategoryCard).join('');
  const calloutHtml = createLearningCalloutCard();

  grid.innerHTML = categoryCardsHtml + calloutHtml;
}

function showFeedbackError(message) {
  const feedbackContainer = document.getElementById('skills-feedback-container');
  if (!feedbackContainer) return;

  feedbackContainer.style.display = 'block';
  feedbackContainer.innerHTML = `
    <div class="feedback-box feedback-error">
      <p><strong>Error loading skills:</strong> ${message}</p>
      <button class="btn-retry" id="btn-retry-skills">Retry</button>
    </div>
  `;

  const retryBtn = document.getElementById('btn-retry-skills');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      feedbackContainer.style.display = 'none';
      loadSkillsData();
    });
  }
}

async function loadSkillsData() {
  renderSkeletons();

  try {
    const response = await fetch('/api/skills');
    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const categories = data.categories || (Array.isArray(data) ? FALLBACK_CATEGORIES : FALLBACK_CATEGORIES);
    renderSkillsGrid(categories);
  } catch (err) {
    console.warn('API error, loading fallback mockup dataset:', err);
    // Render fallback dataset with graceful error notification
    renderSkillsGrid(FALLBACK_CATEGORIES);
    showFeedbackError(err.message);
  }
}

// Setup Mobile Navigation
function setupMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  loadSkillsData();
});
