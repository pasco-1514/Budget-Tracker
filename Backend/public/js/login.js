// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorText = document.getElementById('errorText');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      errorText.textContent = 'Please enter a valid email address';
      return;
    }

    if (!password) {
      errorText.textContent = 'Please enter your password';
      return;
    }

    errorText.textContent = '';

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        errorText.textContent = data.message || 'Login failed';
        return;
      }

      // Save JWT token in localStorage
      localStorage.setItem('token', data.token);

      // Redirect based on role
      if (data.user && data.user.isAdmin) {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Login error:', err);
      errorText.textContent = 'Something went wrong. Please try again.';
    }
  });
});
