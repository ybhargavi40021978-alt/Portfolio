/**
 * Personal Portfolio - Contact Page Controller (contact.js)
 * Manages form validation, async API submission to POST /api/contact,
 * submitting/success/error interaction states, and profile metadata loading.
 */

const FALLBACK_PROFILE = {
  email: "alex.morgan@example.com",
  location: "San Francisco, CA"
};

// ==================== Profile Metadata ====================

async function loadContactProfileInfo() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Failed to load profile');
    const profile = await res.json();
    
    const emailEl = document.getElementById('contact-email-val');
    const locEl = document.getElementById('contact-location-val');
    
    if (emailEl && profile.email) emailEl.textContent = profile.email;
    if (locEl && profile.location) locEl.textContent = profile.location;
  } catch (e) {
    // Graceful fallback to default values
    const emailEl = document.getElementById('contact-email-val');
    const locEl = document.getElementById('contact-location-val');
    if (emailEl) emailEl.textContent = FALLBACK_PROFILE.email;
    if (locEl) locEl.textContent = FALLBACK_PROFILE.location;
  }
}

// ==================== Validation Logic ====================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(inputEl, errorEl, fieldName, isEmail = false) {
  const val = inputEl.value.trim();

  if (!val) {
    inputEl.classList.add('is-invalid');
    errorEl.textContent = `${fieldName} is required.`;
    return false;
  }

  if (isEmail && !EMAIL_REGEX.test(val)) {
    inputEl.classList.add('is-invalid');
    errorEl.textContent = "Enter a valid email address.";
    return false;
  }

  inputEl.classList.remove('is-invalid');
  errorEl.textContent = "";
  return true;
}

function clearAllErrors() {
  document.querySelectorAll('.form-input, .form-textarea').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.inline-field-error').forEach(el => el.textContent = "");
}

// ==================== Feedback Display ====================

function setFeedbackStatus(type, message) {
  const feedbackEl = document.getElementById('submission-feedback');
  if (!feedbackEl) return;

  if (!message) {
    feedbackEl.style.display = 'none';
    feedbackEl.innerHTML = '';
    return;
  }

  feedbackEl.style.display = 'block';

  if (type === 'success') {
    feedbackEl.innerHTML = `
      <div class="feedback-status-box status-success" role="alert">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${message}</span>
      </div>
    `;
  } else {
    feedbackEl.innerHTML = `
      <div class="feedback-status-box status-error" role="alert">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>${message}</span>
      </div>
    `;
  }
}

// ==================== Form Submission Handler ====================

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('btn-submit-contact');
  const btnText = document.getElementById('btn-text');

  if (!form) return;

  // Real-time input clearing of error states
  nameInput.addEventListener('input', () => validateField(nameInput, document.getElementById('error-name'), 'Full Name'));
  emailInput.addEventListener('input', () => validateField(emailInput, document.getElementById('error-email'), 'Email Address', true));
  subjectInput.addEventListener('input', () => validateField(subjectInput, document.getElementById('error-subject'), 'Subject'));
  messageInput.addEventListener('input', () => validateField(messageInput, document.getElementById('error-message'), 'Message'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFeedbackStatus(null);

    // Validate all fields
    const isNameValid = validateField(nameInput, document.getElementById('error-name'), 'Full Name');
    const isEmailValid = validateField(emailInput, document.getElementById('error-email'), 'Email Address', true);
    const isSubjectValid = validateField(subjectInput, document.getElementById('error-subject'), 'Subject');
    const isMessageValid = validateField(messageInput, document.getElementById('error-message'), 'Message');

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      return;
    }

    const hpInput = document.getElementById('contact-hp');
    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim(),
      hp_field: hpInput ? hpInput.value.trim() : ''
    };

    // Submitting State
    submitBtn.disabled = true;
    const originalText = btnText.textContent;
    btnText.textContent = "Sending...";

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success State
        setFeedbackStatus('success', result.message || "Message sent successfully. Thank you for reaching out!");
        form.reset();
        clearAllErrors();
      } else {
        // Validation / Server Error State
        setFeedbackStatus('error', result.error || "Unable to send your message right now. Please try again.");
      }
    } catch (err) {
      console.error('Submission error:', err);
      // Server error fallback preserving inputs
      setFeedbackStatus('error', "Unable to send your message right now. Please try again.");
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = originalText;
    }
  });
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
  loadContactProfileInfo();
  setupContactForm();
});
