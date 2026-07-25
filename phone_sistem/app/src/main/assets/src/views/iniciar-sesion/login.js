function initView(ctx) {
  const form = document.getElementById('login-form');
  const alertBox = document.getElementById('login-alert');
  const submitBtn = document.getElementById('login-submit');
  const submitLabel = document.getElementById('login-submit-label');
  const submitIcon = document.getElementById('login-submit-icon');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const rememberCheckbox = document.getElementById('remember-me');
  const themeToggle = document.getElementById('themeToggle');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const togglePasswordIcon = document.getElementById('toggle-password-icon');
  const demoList = document.getElementById('login-demo-list');
  const fillDemoBtn = document.getElementById('btn-fill-demo');

  renderDemoCredentials(demoList);

  const remembered = AppState.getRememberedUsername();
  if (remembered && usernameInput) {
    usernameInput.value = remembered;
    if (rememberCheckbox) rememberCheckbox.checked = true;
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = !document.documentElement.classList.contains('dark');
    if (typeof Router !== 'undefined' && Router.setTheme) {
      Router.setTheme(isDark);
    } else {
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      document.body.classList.toggle('light-theme', !isDark);
      localStorage.setItem('sigma_theme', isDark ? 'dark' : 'light');
    }
  });

  togglePasswordBtn?.addEventListener('click', () => {
    if (!passwordInput) return;
    const visible = passwordInput.type === 'text';
    passwordInput.type = visible ? 'password' : 'text';
    if (togglePasswordIcon) {
      togglePasswordIcon.textContent = visible ? 'visibility' : 'visibility_off';
    }
    togglePasswordBtn.setAttribute(
      'aria-label',
      visible ? 'Mostrar contraseña' : 'Ocultar contraseña'
    );
  });

  fillDemoBtn?.addEventListener('click', () => {
    if (usernameInput) usernameInput.value = 'operario';
    if (passwordInput) passwordInput.value = 'operario123';
    clearAlert(alertBox);
  });

  demoList?.querySelectorAll('[data-demo-user]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const user = btn.getAttribute('data-demo-user');
      const pass = btn.getAttribute('data-demo-pass');
      if (usernameInput) usernameInput.value = user || '';
      if (passwordInput) passwordInput.value = pass || '';
      clearAlert(alertBox);
    });
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert(alertBox);

    const username = usernameInput?.value?.trim() || '';
    const password = passwordInput?.value || '';

    setLoading(true);

    try {
      const result = await AuthService.login(username, password);

      if (!result.ok) {
        showAlert(alertBox, result.message, 'error');
        return;
      }

      if (rememberCheckbox?.checked) {
        AppState.saveRememberedUsername(username);
      } else {
        AppState.saveRememberedUsername('');
      }

      AppState.setUser(username, result.role, result.nombre);
      showToast(result.message, 'success');
      ctx.navigate(AppState.getPanelRoute());
    } catch (err) {
      showAlert(alertBox, 'No se pudo iniciar sesión. Intente nuevamente.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (submitLabel) {
      submitLabel.textContent = loading ? 'Verificando…' : 'Iniciar sesión';
    }
    if (submitIcon) {
      submitIcon.textContent = loading ? 'progress_activity' : 'login';
      submitIcon.classList.toggle('animate-spin', loading);
    }
  }
}

function renderDemoCredentials(listEl) {
  if (!listEl || typeof AuthService === 'undefined') return;

  listEl.innerHTML = AuthService.getDemoCredentials()
    .map(
      ({ usuario, password, rol }) => `
        <li>
          <button type="button" class="login-demo-box__item" data-demo-user="${usuario}" data-demo-pass="${password}">
            <span class="login-demo-box__role">${rol}</span>
            <span class="login-demo-box__creds">${usuario} / ${password}</span>
          </button>
        </li>
      `
    )
    .join('');
}

window.initView = initView;
