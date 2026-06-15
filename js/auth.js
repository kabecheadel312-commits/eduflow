/* ============================================
   EduFlow - auth.js
   Login form validation & authentication
   ============================================ */

'use strict';

const DEMO_CREDENTIALS = {
  email: 'admin@eduflow.io',
  password: 'admin123'
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const loginBtn = document.getElementById('loginBtn');
  const togglePasswordBtn = document.getElementById('togglePassword');

  // Pre-fill demo credentials
  emailInput.value = 'admin@eduflow.io';
  passwordInput.value = 'admin123';

  // Toggle password visibility
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.textContent = isPassword ? '🙈' : '👁';
  });

  // Clear errors on input
  emailInput.addEventListener('input', () => clearError('email'));
  passwordInput.addEventListener('input', () => clearError('password'));

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let valid = true;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }

    // Validate password
    if (!password || password.length < 6) {
      showError('password', 'Password must be at least 6 characters.');
      valid = false;
    }

    if (!valid) return;

    // Show loading state
    setLoading(true);

    // Simulate auth delay
    await sleep(1200);

    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      // Success
      sessionStorage.setItem('eduflow_user', JSON.stringify({
        name: 'Admin User',
        email: email,
        role: 'Super Administrator',
        initials: 'AD'
      }));

      const remember = document.getElementById('rememberMe').checked;
      if (remember) {
        localStorage.setItem('eduflow_remember', email);
      }

      showToast('success', 'Signed in', 'Redirecting to your dashboard…');
      await sleep(800);
      window.location.href = 'dashboard.html';
    } else {
      setLoading(false);
      showError('password', 'Incorrect email or password. Try admin@eduflow.io / admin123.');
      passwordInput.classList.add('error');
      showToast('error', 'Sign-in failed', 'Check your credentials and try again.');
    }
  });

  // Restore remembered email
  const remembered = localStorage.getItem('eduflow_remember');
  if (remembered) {
    emailInput.value = remembered;
    document.getElementById('rememberMe').checked = true;
  }

  function showError(field, message) {
    const input = field === 'email' ? emailInput : passwordInput;
    const errEl = field === 'email' ? emailError : passwordError;
    input.classList.add('error');
    errEl.textContent = message;
    errEl.classList.add('visible');
  }

  function clearError(field) {
    const input = field === 'email' ? emailInput : passwordInput;
    const errEl = field === 'email' ? emailError : passwordError;
    input.classList.remove('error');
    errEl.classList.remove('visible');
  }

  function setLoading(state) {
    loginBtn.disabled = state;
    loginBtn.classList.toggle('loading', state);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});