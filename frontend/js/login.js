/**
 * Login Page Logic
 * Handles user and admin authentication against POST /api/auth/login
 */
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const identifierInput = document.getElementById('login-identifier');
  const passwordInput = document.getElementById('login-password');
  const errorAlert = document.getElementById('login-error');
  const demoAdminBtn = document.getElementById('btn-demo-admin');
  const submitBtn = document.getElementById('btn-submit-login');

  // Check if already authenticated
  const existingToken = localStorage.getItem('auth_token');
  if (existingToken) {
    window.location.href = '../admin/index.html';
    return;
  }

  function showError(msg) {
    if (!errorAlert) return;
    if (!msg) {
      errorAlert.style.display = 'none';
      errorAlert.textContent = '';
    } else {
      errorAlert.style.display = 'block';
      errorAlert.textContent = msg;
    }
  }

  async function performLogin(credentials) {
    showError('');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Authenticating...';
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showError(data.message || 'Invalid credentials. For demo evaluation, use admin / admin123');
        return;
      }

      // Save token and user info
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }

      // Redirect to Admin dashboard
      window.location.href = '../admin/index.html';
    } catch (err) {
      console.error('Login network error:', err);
      showError('Could not connect to backend server. Make sure node server.js is running.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      }
    }
  }

  // Handle Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = identifierInput.value.trim();
      const password = passwordInput.value.trim();

      if (!identifier || !password) {
        showError('Please enter your email/username and password.');
        return;
      }

      performLogin({
        email: identifier,
        username: identifier,
        password: password,
        passcode: password
      });
    });
  }

  // One-Click Demo Admin Button
  if (demoAdminBtn) {
    demoAdminBtn.addEventListener('click', () => {
      identifierInput.value = 'admin@college.edu';
      passwordInput.value = 'admin123';
      performLogin({ passcode: 'admin123', password: 'admin123' });
    });
  }
});
