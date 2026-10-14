/**
 * Personal Portfolio - About Page Controller (about.js)
 * Fetches profile information from GET /api/profile with loading and error states.
 */

// Fallback profile data in case network is disconnected
const FALLBACK_PROFILE = {
  name: "Alex Morgan",
  role: "Full-stack Developer",
  subtitle: "Full-stack Developer | Problem Solver | Lifelong Learner",
  bioParagraph1: "I'm a developer passionate about building modern web applications and creating practical digital experiences. I enjoy turning ideas into functional, responsive interfaces and developing reliable backend systems.",
  bioParagraph2: "My work focuses on clean user interfaces, maintainable code, API integration, and database-driven applications.",
  location: "San Francisco, CA",
  email: "alex.morgan@example.com",
  focus: "Web Applications, API Development",
  portraitUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
};

const ProfileService = {
  async fetchProfile() {
    const response = await fetch('/api/profile');
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }
};

function renderAboutProfile(data) {
  const nameEl = document.getElementById('about-name');
  const subtitleEl = document.getElementById('about-subtitle');
  const bioP1El = document.getElementById('bio-p1');
  const bioP2El = document.getElementById('bio-p2');
  const locationEl = document.getElementById('profile-location');
  const emailEl = document.getElementById('profile-email');
  const focusEl = document.getElementById('profile-focus');
  const portraitEl = document.getElementById('about-portrait');
  const copyrightEl = document.getElementById('footer-copyright');

  if (nameEl) nameEl.textContent = data.name || FALLBACK_PROFILE.name;
  if (subtitleEl) subtitleEl.textContent = data.subtitle || FALLBACK_PROFILE.subtitle;
  if (bioP1El) bioP1El.textContent = data.bioParagraph1 || FALLBACK_PROFILE.bioParagraph1;
  if (bioP2El) bioP2El.textContent = data.bioParagraph2 || FALLBACK_PROFILE.bioParagraph2;
  if (locationEl) locationEl.textContent = data.location || FALLBACK_PROFILE.location;
  if (emailEl) emailEl.textContent = data.email || FALLBACK_PROFILE.email;
  if (focusEl) focusEl.textContent = data.focus || FALLBACK_PROFILE.focus;
  if (portraitEl && data.portraitUrl) portraitEl.src = data.portraitUrl;

  if (copyrightEl) {
    const currentYear = new Date().getFullYear();
    copyrightEl.innerHTML = `&copy; ${currentYear} ${data.name || 'Alex Morgan'}. All rights reserved.`;
  }
}

function showLoading(show) {
  const feedbackContainer = document.getElementById('feedback-state-container');
  const mainContent = document.getElementById('about-content');
  if (!feedbackContainer) return;

  if (show) {
    feedbackContainer.style.display = 'block';
    feedbackContainer.innerHTML = `
      <div class="feedback-box feedback-loading" id="loading-indicator">
        <p>Loading profile information...</p>
      </div>
    `;
    if (mainContent) mainContent.style.opacity = '0.4';
  } else {
    feedbackContainer.style.display = 'none';
    if (mainContent) mainContent.style.opacity = '1';
  }
}

function showError(message) {
  const feedbackContainer = document.getElementById('feedback-state-container');
  const mainContent = document.getElementById('about-content');
  if (!feedbackContainer) return;

  feedbackContainer.style.display = 'block';
  feedbackContainer.innerHTML = `
    <div class="feedback-box feedback-error" id="error-indicator">
      <p><strong>Error:</strong> ${message || 'Unable to load profile data.'}</p>
      <button class="btn-retry" id="btn-retry-profile">Retry</button>
    </div>
  `;
  if (mainContent) mainContent.style.opacity = '0.6';

  const retryBtn = document.getElementById('btn-retry-profile');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => loadProfileData());
  }
}

async function loadProfileData() {
  showLoading(true);
  try {
    const profile = await ProfileService.fetchProfile();
    renderAboutProfile(profile);
    showLoading(false);
  } catch (err) {
    console.warn('API fetch failed, falling back to local design mock:', err);
    // Render fallback data for development mockup
    renderAboutProfile(FALLBACK_PROFILE);
    showLoading(false);
  }
}

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
  loadProfileData();
});
