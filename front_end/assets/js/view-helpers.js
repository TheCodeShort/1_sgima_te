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
    'registrar-falla': 'registrar_falla',
    'registrar-mantenimiento': 'registrar_mantenimiento',
    'cargar-evidencia': 'cargar_evidencia',
    'detalle-equipo': 'detalle_del_equipo',
    equipos: 'equipos',
    usuarios: 'gesti_n_de_usuarios_y_roles',
    sincronizacion: 'estado_de_sincronizaci_n',
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
      ctx.navigate('estado_de_sincronizaci_n');
    });
  });
}

window.bindViewNavigation = bindViewNavigation;
