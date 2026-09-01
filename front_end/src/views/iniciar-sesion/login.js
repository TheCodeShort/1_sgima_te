function initView(ctx) {
  const form = document.getElementById('login-form');
  const alertBox = document.getElementById('login-alert');
  const submitBtn = document.getElementById('login-submit');
  const submitLabel = document.getElementById('login-submit-label');
  const submitIcon = document.getElementById('login-submit-icon');
  const usernameInput = document.getElementById('correo');
  const passwordInput = document.getElementById('password');
  const rememberCheckbox = document.getElementById('remember-me');
  const themeToggle = document.getElementById('themeToggle');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const togglePasswordIcon = document.getElementById('toggle-password-icon');

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

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert(alertBox);

    const correo = usernameInput?.value?.trim() || '';
    const password = passwordInput?.value || '';

    setLoading(true);

    try {
      const result = await AuthService.login(correo, password);

      if (!result.ok) {
        showAlert(alertBox, result.message, 'error');
        return;
      }

      if (rememberCheckbox?.checked) {
        AppState.saveRememberedUsername(correo);
      } else {
        AppState.saveRememberedUsername('');
      }

      let nombreRolParaPanel = 'operario';
      try {
        const roles = await RolService.getRoles();
        const rolEncontrado = Array.isArray(roles)
          ? roles.find((r) => Number(r.idRol) === Number(result.role))
          : null;
        if (rolEncontrado && rolEncontrado.nombreRol) {
          nombreRolParaPanel = rolEncontrado.nombreRol;
        }
      } catch (err) {
        console.error('No se pudo resolver el nombre del rol:', err);
      }

      AppState.setUser(correo, nombreRolParaPanel, result.nombre);
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

window.initView = initView;
