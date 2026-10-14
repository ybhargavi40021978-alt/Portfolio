/**
 * Personal Portfolio - Project Selection Page Controller (projects.js)
 * Manages live search, category & technology filtering, sorting,
 * API requests, loading skeletons, error states, empty states, and link click tracking.
 */

// Fallback projects dataset matching prompt requirements
const FALLBACK_PROJECTS = [
  {
    id: "nova-shopping-cart",
    title: "NovaShoppingCart",
    category: "Full-Stack",
    description: "A responsive e-commerce web application with product listings, shopping cart, checkout, and order management.",
    thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Express.js", "MongoDB"],
    liveUrl: "https://example.com/demo/novashoppingcart",
    sourceUrl: "https://github.com/example/novashoppingcart",
    featured: true
  },
  {
    id: "mini-social",
    title: "MiniSocial",
    category: "Full-Stack",
    description: "A social media web application featuring user profiles, posts, comments, likes, follows, and multilingual chat.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    technologies: ["HTML", "CSS", "JavaScript", "Django", "SQLite"],
    liveUrl: "https://example.com/demo/minisocial",
    sourceUrl: "https://github.com/example/minisocial",
    featured: true
  },
  {
    id: "task-flow",
    title: "TaskFlow",
    category: "Full-Stack",
    description: "A task management application designed to organize tasks, track progress, and support an efficient workflow.",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    technologies: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://example.com/demo/taskflow",
    sourceUrl: "https://github.com/example/taskflow",
    featured: false
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    category: "Frontend",
    description: "Real-time weather details with location search, animated maps, and multi-day forecasts.",
    thumbnail: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80",
    technologies: ["HTML", "CSS", "JavaScript", "REST APIs"],
    liveUrl: "https://example.com/demo/weather",
    sourceUrl: "https://github.com/example/weather",
    featured: false
  },
  {
    id: "auth-microservice",
    title: "Auth Microservice",
    category: "Backend",
    description: "Scalable authentication and authorization service with JWT, OAuth2 integration, and rate limiting.",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    technologies: ["Node.js", "Express.js", "MongoDB", "Docker"],
    liveUrl: null,
    sourceUrl: "https://github.com/example/auth-service",
    featured: true
  },
  {
    id: "datasync-engine",
    title: "DataSync Engine",
    category: "Backend",
    description: "High-throughput asynchronous ETL pipeline for aggregating and caching streaming metrics.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "SQLite", "PostgreSQL", "Docker"],
    liveUrl: null,
    sourceUrl: "https://github.com/example/datasync",
    featured: false
  }
];

// State management
let activeCategory = 'All Projects';
let searchQuery = '';
let activeTech = '';
let activeSort = 'featured';
let searchDebounceTimer = null;

// ==================== Component Renderers ====================

function createProjectCard(project) {
  const techTagsHtml = (project.technologies || project.tags || []).map(tech => `
    <span class="tech-tag">${tech}</span>
  `).join('');

  // Conditional Actions: render only when valid link exists
  let actionsHtml = '';
  const hasLive = project.liveUrl && project.liveUrl.trim().length > 0;
  const hasSource = project.sourceUrl && project.sourceUrl.trim().length > 0;

  if (hasLive || hasSource) {
    actionsHtml = `
      <div class="project-actions-row">
        ${hasLive ? `
          <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-primary" data-project-id="${project.id}" data-project-title="${project.title}" data-link-type="live">
            Live Demo &nearr;
          </a>
        ` : ''}
        ${hasSource ? `
          <a href="${project.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-secondary" data-project-id="${project.id}" data-project-title="${project.title}" data-link-type="source">
            Source Code &nearr;
          </a>
        ` : ''}
      </div>
    `;
  }

  return `
    <article class="project-item-card" id="project-${project.id}">
      <div class="project-thumb-16-9-wrap">
        <img 
          src="${project.thumbnail || project.image}" 
          alt="${project.title} Preview" 
          class="project-thumb-16-9"
          loading="lazy"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80';"
        />
      </div>
      <div class="project-card-body">
        <span class="project-category-badge">${project.category || 'Full-Stack'}</span>
        <h2 class="project-card-heading">${project.title}</h2>
        <p class="project-card-text">${project.description}</p>
        <div class="project-tech-tags">
          ${techTagsHtml}
        </div>
        ${actionsHtml}
      </div>
    </article>
  `;
}

function renderSkeletons() {
  const grid = document.getElementById('projects-selection-grid');
  if (!grid) return;

  grid.innerHTML = Array(3).fill(`
    <div class="skeleton-project-card">
      <div class="skeleton-thumb"></div>
      <div class="skeleton-body">
        <div class="skeleton-bar" style="width: 30%;"></div>
        <div class="skeleton-bar" style="width: 70%; height: 20px;"></div>
        <div class="skeleton-bar" style="width: 100%;"></div>
        <div class="skeleton-bar" style="width: 85%;"></div>
        <div class="skeleton-bar" style="width: 50%; margin-top: auto;"></div>
      </div>
    </div>
  `).join('');
}

function renderEmptyState() {
  const grid = document.getElementById('projects-selection-grid');
  if (!grid) return;

  grid.innerHTML = `
    <div class="empty-state-box" id="projects-empty-state">
      <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <h2 class="empty-state-heading">No Projects Found</h2>
      <p class="empty-state-desc">Try clearing your search query or choosing a different filter.</p>
    </div>
  `;
}

function renderProjectsList(projects) {
  const grid = document.getElementById('projects-selection-grid');
  if (!grid) return;

  if (!projects || projects.length === 0) {
    renderEmptyState();
    return;
  }

  grid.innerHTML = projects.map(createProjectCard).join('');

  // Attach privacy-conscious link click tracking to buttons
  grid.querySelectorAll('.btn-action-primary, .btn-action-secondary').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project-id');
      const projectTitle = btn.getAttribute('data-project-title');
      const linkType = btn.getAttribute('data-link-type');
      const url = btn.getAttribute('href');

      try {
        fetch('/api/analytics/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, projectTitle, linkType, url })
        }).catch(() => {});
      } catch {}
    });
  });
}

function showError(message) {
  const feedback = document.getElementById('projects-feedback-container');
  if (!feedback) return;

  feedback.style.display = 'block';
  feedback.innerHTML = `
    <div class="feedback-box feedback-error" style="max-width: 600px; margin: 0 auto 32px auto;">
      <p><strong>Error:</strong> ${message || 'Projects could not be loaded.'}</p>
      <button class="btn-retry" id="btn-retry-projects">Retry</button>
    </div>
  `;

  const retryBtn = document.getElementById('btn-retry-projects');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      feedback.style.display = 'none';
      fetchProjectsData();
    });
  }
}

// ==================== Data Fetching with Query Parameters ====================

async function fetchProjectsData() {
  renderSkeletons();

  // Construct query string
  const params = new URLSearchParams();
  if (activeCategory && activeCategory !== 'All Projects') {
    params.set('category', activeCategory);
  }
  if (searchQuery.trim().length > 0) {
    params.set('search', searchQuery.trim());
  }
  if (activeTech) {
    params.set('tech', activeTech);
  }
  if (activeSort) {
    params.set('sort', activeSort);
  }

  const queryUrl = `/api/projects?${params.toString()}`;

  try {
    const response = await fetch(queryUrl);
    if (!response.ok) {
      throw new Error(`Failed to load projects: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    renderProjectsList(Array.isArray(data) ? data : []);
  } catch (err) {
    console.warn('API error, falling back to client-filtered local dataset:', err);
    // Filter fallback in-memory so user still gets a working experience
    let filtered = [...FALLBACK_PROJECTS];
    if (activeCategory && activeCategory !== 'All Projects') {
      filtered = filtered.filter(p => (p.category || '').toLowerCase() === activeCategory.toLowerCase());
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (activeTech) {
      filtered = filtered.filter(p => (p.technologies || []).some(t => t.toLowerCase() === activeTech.toLowerCase()));
    }
    if (activeSort === 'newest') {
      filtered.reverse();
    } else if (activeSort === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    renderProjectsList(filtered);
    showError(err.message);
  }
}

// ==================== Filter & Search Controls ====================

async function loadTechnologiesFilter() {
  const select = document.getElementById('tech-filter-select');
  if (!select) return;

  try {
    const res = await fetch('/api/projects/meta/technologies');
    if (res.ok) {
      const techs = await res.json();
      if (Array.isArray(techs) && techs.length > 0) {
        techs.forEach(tech => {
          const opt = document.createElement('option');
          opt.value = tech;
          opt.textContent = tech;
          select.appendChild(opt);
        });
        return;
      }
    }
  } catch (e) {
    console.warn('Could not load technologies from API:', e);
  }

  // Fallback technologies
  const fallbackTechs = ["JavaScript", "Node.js", "Express.js", "MongoDB", "HTML", "CSS", "Python", "Docker"];
  fallbackTechs.forEach(tech => {
    const opt = document.createElement('option');
    opt.value = tech;
    opt.textContent = tech;
    select.appendChild(opt);
  });
}

function setupAdvancedControls() {
  // 1. Live Search Input with Debounce
  const searchInput = document.getElementById('project-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        searchQuery = e.target.value;
        fetchProjectsData();
      }, 280);
    });
  }

  // 2. Technology Filter Dropdown
  const techSelect = document.getElementById('tech-filter-select');
  if (techSelect) {
    techSelect.addEventListener('change', (e) => {
      activeTech = e.target.value;
      fetchProjectsData();
    });
  }

  // 3. Sort Dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      fetchProjectsData();
    });
  }

  // 4. Category Pills
  const filtersContainer = document.getElementById('category-filters');
  if (filtersContainer) {
    filtersContainer.addEventListener('click', (e) => {
      const target = e.target.closest('.filter-pill');
      if (!target) return;

      const category = target.getAttribute('data-category');
      if (category) {
        activeCategory = category;

        document.querySelectorAll('.filter-pill').forEach(pill => {
          if (pill.getAttribute('data-category') === category) {
            pill.classList.add('active');
          } else {
            pill.classList.remove('active');
          }
        });

        fetchProjectsData();
      }
    });
  }
}

// ==================== Mobile Navigation ====================

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

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  setupAdvancedControls();
  loadTechnologiesFilter();
  fetchProjectsData();
});
