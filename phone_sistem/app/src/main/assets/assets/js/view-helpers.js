/**
 * Utilidades compartidas para scripts de vistas
 */

/** Muestra una notificación flotante temporal */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('sigma-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'sigma-toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }

  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  const toast = document.createElement('div');
  toast.className = `sigma-toast sigma-toast--${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined sigma-toast__icon">${icons[type] || icons.info}</span>
    <span class="sigma-toast__message">${message}</span>
    <button type="button" class="sigma-toast__close" aria-label="Cerrar aviso">
      <span class="material-symbols-outlined">close</span>
    </button>
  `;

  const close = () => {
    toast.classList.add('sigma-toast--hide');
    setTimeout(() => toast.remove(), 250);
  };

  toast.querySelector('.sigma-toast__close')?.addEventListener('click', close);
  container.appendChild(toast);

  if (duration > 0) {
    setTimeout(close, duration);
  }
}

/** Muestra un mensaje inline dentro de un contenedor de alerta */
function showAlert(container, message, type = 'error') {
  if (!container) return;

  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  container.hidden = false;
  container.className = `login-alert login-alert--${type}`;
  container.innerHTML = `
    <span class="material-symbols-outlined login-alert__icon">${icons[type] || icons.info}</span>
    <span class="login-alert__text">${message}</span>
  `;
}

function clearAlert(container) {
  if (!container) return;
  container.hidden = true;
  container.innerHTML = '';
  container.className = 'login-alert';
}

function bindViewNavigation(root, ctx) {
  if (!root || !ctx) return;

  root.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const route = el.getAttribute('data-nav');
      if (route) ctx.navigate(route);
    });
  });

  const actions = {
    'registrar-falla': 'registrar-falla',
    'registrar-mantenimiento': 'registrar-mantenimiento',
    'cargar-evidencia': 'cargar-evidencia',
    'detalle-equipo': 'detalle-equipo',
    equipos: 'equipos',
    usuarios: 'gestion-usuarios-roles',
    sincronizacion: 'estado-sincronizacion',
  };

  Object.entries(actions).forEach(([action, route]) => {
    root.querySelectorAll(`[data-action="${action}"]`).forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        ctx.navigate(route);
      });
    });
  });

  root.querySelectorAll('[data-action="volver"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        ctx.navigate(AppState.isAuthenticated() ? AppState.getPanelRoute() : 'iniciar-sesion');
      }
    });
  });

  root.querySelectorAll('[data-action="logout"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof Router !== 'undefined' && Router.logout) {
        Router.logout();
      } else {
        AppState.clear();
        ctx.navigate('iniciar-sesion');
      }
    });
  });

  root.querySelectorAll('[data-action="sync"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      ctx.navigate('estado-sincronizacion');
    });
  });
}

window.showToast = showToast;
window.showAlert = showAlert;
window.clearAlert = clearAlert;
window.bindViewNavigation = bindViewNavigation;
