/**
 * Centralized API Client (api.js)
 * Provides standardized Fetch API methods with safe error handling,
 * response parsing, and HTML escaping for XSS prevention.
 */

const API_BASE_URL = window.location.origin;

/**
 * Escapes unsafe characters in strings before rendering into HTML templates.
 * Prevents Cross-Site Scripting (XSS).
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ApiClient = {
  /**
   * Generic GET request handler
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        let errMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData && errData.error) errMessage = errData.error;
        } catch {
          // Response body was not JSON
        }
        throw new Error(errMessage);
      }

      return await response.json();
    } catch (error) {
      console.warn(`[ApiClient GET Error] ${endpoint}:`, error.message);
      throw error;
    }
  },

  /**
   * Generic POST request handler
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = responseData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
      }

      return responseData;
    } catch (error) {
      console.warn(`[ApiClient POST Error] ${endpoint}:`, error.message);
      throw error;
    }
  },

  // Specific domain methods
  getHealth() {
    return this.get('/api/health');
  },

  getProfile() {
    return this.get('/api/profile');
  },

  getSkills(preview = false) {
    return this.get(`/api/skills${preview ? '?preview=true' : ''}`);
  },

  getProjects(category = null, featured = false) {
    const params = new URLSearchParams();
    if (featured) params.append('featured', 'true');
    if (category && category !== 'All Projects') params.append('category', category);
    const queryString = params.toString();
    return this.get(`/api/projects${queryString ? `?${queryString}` : ''}`);
  },

  getProjectById(id) {
    return this.get(`/api/projects/${encodeURIComponent(id)}`);
  },

  sendContactMessage(formData) {
    return this.post('/api/contact', formData);
  }
};

// Expose globally to window
window.ApiClient = ApiClient;
window.escapeHTML = escapeHTML;
