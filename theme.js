/**
 * Theme & Common Interactive Features (theme.js)
 * Manages Dark/Light mode toggle, localStorage persistence,
 * system theme matching, Scroll-to-Top, and automated analytics pageview tracking.
 */

(function () {
  // 1. Theme Initialization (executed immediately to prevent FOUC)
  const savedTheme = localStorage.getItem('portfolio_theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initialTheme);

  // Expose toggle function globally
  window.toggleTheme = function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
    updateThemeToggleIcons(newTheme);
  };

  function updateThemeToggleIcons(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const isDark = theme === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    btn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');

    // Sun icon for dark mode (click to switch to light), Moon icon for light mode (click to switch to dark)
    btn.innerHTML = isDark
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }

  // Listen to OS theme changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('portfolio_theme')) {
        const osTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', osTheme);
        updateThemeToggleIcons(osTheme);
      }
    });
  }

  // 2. DOM Ready Setup
  document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeToggleIcons(currentTheme);

    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', window.toggleTheme);
    }

    // 3. Scroll to Top Button Setup
    setupScrollToTop();

    // 4. Automated Privacy-Conscious Pageview Tracking
    trackPageView();
  });

  function setupScrollToTop() {
    let scrollBtn = document.getElementById('scroll-to-top-btn');
    if (!scrollBtn) {
      scrollBtn = document.createElement('button');
      scrollBtn.id = 'scroll-to-top-btn';
      scrollBtn.className = 'scroll-to-top';
      scrollBtn.setAttribute('aria-label', 'Scroll to top of page');
      scrollBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      document.body.appendChild(scrollBtn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function trackPageView() {
    try {
      fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: window.location.pathname || '/' })
      }).catch(() => {});
    } catch {
      // Non-blocking analytics
    }
  }
})();
