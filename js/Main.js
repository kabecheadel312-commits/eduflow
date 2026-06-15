/* ============================================
   EduFlow - main.js
   Core utilities: toast, modal, loading, helpers
   ============================================ */

'use strict';

// ---- Loading Overlay ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.classList.add('fade-out');
      setTimeout(() => overlay.remove(), 500);
    }
  }, 1200);
});

// ---- Toast System ----
function showToast(type = 'info', title = '', message = '', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  const id = 'toast-' + Date.now();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.id = id;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
    <button class="toast-close" onclick="dismissToast('${id}')">×</button>
  `;

  container.appendChild(toast);

  setTimeout(() => dismissToast(id), duration);
}

function dismissToast(id) {
  const toast = document.getElementById(id);
  if (!toast) return;
  toast.classList.add('toast-exit');
  setTimeout(() => toast.remove(), 300);
}

// ---- Modal System ----
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ---- Navbar scroll (landing page) ----
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ---- Mobile hamburger (landing page) ----
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ---- Contact form handler (landing page) ----
function handleContactSubmit(btn) {
  btn.disabled = true;
  btn.textContent = 'Sending…';
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Send message →';
    showToast('success', 'Message sent!', 'We\'ll get back to you within one business day.');
  }, 1400);
}

// ---- Forgot password (login page) ----
function handleForgotPassword(e) {
  e.preventDefault();
  showToast('info', 'Password reset', 'If that email is in our system, you\'ll receive a reset link shortly.');
}

// ---- Demo toast for "Request access" ----
function showToastDemo(e) {
  e.preventDefault();
  showToast('info', 'Access request', 'Contact your institution administrator to get an account.');
}

// ---- Utility helpers ----
function formatNumber(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : n;
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function randomColor(seed) {
  const colors = [
    '#7c3aed', '#2563eb', '#059669', '#d97706',
    '#db2777', '#0891b2', '#7c3aed', '#4f46e5'
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function debounce(fn, delay = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ---- Counter animation ----
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
  };
  requestAnimationFrame(step);
}

// Trigger counters when in view
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseFloat(e.target.dataset.count));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => obs.observe(c));
}

document.addEventListener('DOMContentLoaded', initCounters);

// ---- FAQ accordion (landing page) ----
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

document.addEventListener('DOMContentLoaded', initFAQ);

// ---- Testimonials slider (landing page) ----
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const controlsContainer = document.getElementById('sliderControls');
  if (!track || !controlsContainer) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoTimer;

  // Build dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    controlsContainer.appendChild(dot);
  }

  function goTo(idx) {
    current = (idx + total) % total;
    // Show 3 at a time on desktop
    const offset = current * (100 / 3);
    track.style.transform = `translateX(-${offset}%)`;
    controlsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }

  autoTimer = setInterval(next, 4000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.parentElement.addEventListener('mouseleave', () => { autoTimer = setInterval(next, 4000); });
}

document.addEventListener('DOMContentLoaded', initTestimonialsSlider);

// ---- Services interactive (landing page) ----
function initServices() {
  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.service-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', initServices);

// Add mobile menu styles dynamically
const mobileMenuStyle = document.createElement('style');
mobileMenuStyle.textContent = `
  .nav-mobile-menu {
    display: none;
    position: fixed;
    top: 68px;
    left: 0;
    right: 0;
    background: rgba(10,10,15,0.98);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    padding: var(--space-4) var(--space-6);
    z-index: calc(var(--z-sticky) - 1);
    flex-direction: column;
    gap: var(--space-3);
  }
  .nav-mobile-menu.open { display: flex; }
  .nav-mobile-link {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-300);
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--glass-border);
    transition: color var(--transition-fast);
  }
  .nav-mobile-link:hover { color: var(--text-100); }
  @media (min-width: 769px) { .nav-hamburger { display: none !important; } }
  @media (max-width: 768px) { .nav-links, .nav-cta .btn { display: none !important; } .nav-hamburger { display: flex !important; } }
  .nav-mobile-menu { display: none; }
  .nav-mobile-menu.open { display: flex; }
`;
document.head.appendChild(mobileMenuStyle);