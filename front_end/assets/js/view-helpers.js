/**
 * Helpers compartidos para scripts de vistas
 */
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
        ctx.navigate(AppState.isAuthenticated() ? AppState.getPanelRoute() : 'iniciar_sesi_n');
      }
    });
  });

  root.querySelectorAll('[data-action="logout"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      AppState.clear();
      ctx.navigate('iniciar_sesi_n');
    });
  });

  root.querySelectorAll('[data-action="sync"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      ctx.navigate('estado-sincronizacion');
    });
  });
}

window.bindViewNavigation = bindViewNavigation;
