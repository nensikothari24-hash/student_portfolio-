document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Navigation Toggle Drawer
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 2. Contact Form Submission Handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formStatus.style.color = '#e74c3c';
        formStatus.textContent = 'Please fill out all fields.';
        return;
      }

      formStatus.style.color = '#27ae60';
      formStatus.textContent = 'Thank you! Your message has been sent successfully.';
      contactForm.reset();

      setTimeout(() => {
        formStatus.textContent = '';
      }, 4000);
    });
  }

  // 3. Dynamic Project Category Filtering (projects.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projectGrid .project-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Authentication Switcher (auth.html)
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginTab && registerTab) {
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginForm.classList.add('active-form');
      loginForm.classList.remove('hidden-form');
      registerForm.classList.add('hidden-form');
      registerForm.classList.remove('active-form');
    });

    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerForm.classList.add('active-form');
      registerForm.classList.remove('hidden-form');
      loginForm.classList.add('hidden-form');
      loginForm.classList.remove('active-form');
    });
  }

  // 5. Password Masking Toggle
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputId = btn.getAttribute('data-target');
      const passwordInput = document.getElementById(inputId);
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
      } else {
        passwordInput.type = 'password';
      }
    });
  });

  // 6. User Account Registration Logic
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regConfirmPassword').value;
      const msg = document.getElementById('registerMessage');

      if (password.length < 6) {
        msg.style.color = '#e74c3c';
        msg.textContent = 'Password must be at least 6 characters.';
        return;
      }

      if (password !== confirmPassword) {
        msg.style.color = '#e74c3c';
        msg.textContent = 'Passwords do not match.';
        return;
      }

      let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      const userExists = users.some(u => u.email === email);

      if (userExists) {
        msg.style.color = '#e74c3c';
        msg.textContent = 'Email address is already registered.';
        return;
      }

      users.push({ name, email, password });
      localStorage.setItem('registeredUsers', JSON.stringify(users));

      msg.style.color = '#27ae60';
      msg.textContent = 'Registration successful! Switching to Login...';
      registerForm.reset();

      setTimeout(() => {
        msg.textContent = '';
        loginTab.click();
      }, 1500);
    });
  }

  // 7. User Authentication Login Logic
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const msg = document.getElementById('loginMessage');

      let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      const validUser = users.find(u => u.email === email && u.password === password);

      if (validUser) {
        msg.style.color = '#27ae60';
        msg.textContent = `Welcome back, ${validUser.name}!`;
        localStorage.setItem('currentUser', JSON.stringify(validUser));
        loginForm.reset();

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      } else {
        msg.style.color = '#e74c3c';
        msg.textContent = 'Invalid email or password.';
      }
    });
  }

  // 8. Navbar User Session Management
  function updateNavAuth() {
    const authContainer = document.getElementById('authNavContainer');
    if (!authContainer) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
      authContainer.innerHTML = `
        <span style="font-weight: 600; color: #3498db; margin-right: 0.5rem;">Hi, ${currentUser.name.split(' ')[0]}</span>
        <button id="logoutBtn" class="logout-btn-nav">Logout</button>
      `;

      document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.reload();
      });
    }
  }

  updateNavAuth();
});
document.addEventListener('DOMContentLoaded', () => {

  const currentPage = window.location.pathname.split('/').pop();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // 1. PAGE GUARD: Redirect to auth.html if trying to view portfolio pages without logging in
  const protectedPages = ['index.html', 'education.html', 'projects.html'];
  if (protectedPages.includes(currentPage) && !currentUser) {
    window.location.href = 'auth.html';
    return;
  }

  // If already logged in and visiting auth.html, redirect straight to home
  if (currentPage === 'auth.html' && currentUser) {
    window.location.href = 'index.html';
    return;
  }

  // 2. Mobile Navigation Toggle Drawer
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. Contact Form Submission Handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formStatus.style.color = '#e74c3c';
        formStatus.textContent = 'Please fill out all fields.';
        return;
      }

      formStatus.style.color = '#27ae60';
      formStatus.textContent = 'Thank you! Your message has been sent successfully.';
      contactForm.reset();

      setTimeout(() => {
        formStatus.textContent = '';
      }, 4000);
    });
  }

  // 4. Dynamic Project Category Filtering (projects.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projectGrid .project-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 5. Authentication Switcher (auth.html)
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginTab && registerTab) {
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginForm.classList.add('active-form');
      loginForm.classList.remove('hidden-form');
      registerForm.classList.add('hidden-form');
      registerForm.classList.remove('active-form');
    });

    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerForm.classList.add('active-form');
      registerForm.classList.remove('hidden-form');
      loginForm.classList.add('hidden-form');
      loginForm.classList.remove('active-form');
    });
  }

  // 6. Password Masking Toggle
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputId = btn.getAttribute('data-target');
      const passwordInput = document.getElementById(inputId);
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
      } else {
        passwordInput.type = 'password';
      }
    });
  });

  // 7. User Account Registration Logic
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regConfirmPassword').value;
      const msg = document.getElementById('registerMessage');

      if (password.length < 6) {
        msg.style.color = '#e74c3c';
        msg.textContent = 'Password must be at least 6 characters.';
        return;
      }

      if (password !== confirmPassword) {
        msg.style.color = '#e74c3c';
        msg.textContent = 'Passwords do not match.';
        return;
      }

      let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      const userExists = users.some(u => u.email === email);

      if (userExists) {
        msg.style.color = '#e74c3c';
        msg.textContent = 'Email address is already registered.';
        return;
      }

      users.push({ name, email, password });
      localStorage.setItem('registeredUsers', JSON.stringify(users));

      msg.style.color = '#27ae60';
      msg.textContent = 'Registration successful! Switching to Login...';
      registerForm.reset();

      setTimeout(() => {
        msg.textContent = '';
        loginTab.click();
      }, 1500);
    });
  }

  // 8. User Authentication Login Logic
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const msg = document.getElementById('loginMessage');

      let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      const validUser = users.find(u => u.email === email && u.password === password);

      if (validUser) {
        msg.style.color = '#27ae60';
        msg.textContent = `Welcome back, ${validUser.name}!`;
        localStorage.setItem('currentUser', JSON.stringify(validUser));
        loginForm.reset();

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      } else {
        msg.style.color = '#e74c3c';
        msg.textContent = 'Invalid email or password.';
      }
    });
  }

  // 9. Navbar User Session Management (Displays Login Email)
  function updateNavAuth() {
    const authContainer = document.getElementById('authNavContainer');
    if (!authContainer) return;

    if (currentUser) {
      authContainer.innerHTML = `
        <span style="font-weight: 600; color: #3498db; margin-right: 0.5rem; font-size: 0.9rem;">📧 ${currentUser.email}</span>
        <button id="logoutBtn" class="logout-btn-nav">Logout</button>
      `;

      document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'auth.html';
      });
    } else {
      authContainer.innerHTML = `<a href="auth.html">Login</a>`;
    }
  }

  updateNavAuth();
});