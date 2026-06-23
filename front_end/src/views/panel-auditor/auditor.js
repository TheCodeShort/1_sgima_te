function initView(ctx) {
  const root = document.querySelector('[data-view="panel-auditor"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  root.querySelectorAll('button, a').forEach((el) => {
    const text = el.textContent.trim();
    if (/^Equipos$/i.test(text)) el.setAttribute('data-nav', 'equipos');
    if (/Nueva Falla/i.test(text)) el.setAttribute('data-action', 'registrar-falla');
    if (/Usuarios/i.test(text)) el.setAttribute('data-nav', 'gestion-usuarios-roles');
    if (/Sincron/i.test(text) && el.tagName === 'BUTTON') el.setAttribute('data-action', 'sync');
    if (/Cerrar Sesión/i.test(text)) el.setAttribute('data-action', 'logout');
  });

  bindViewNavigation(root, ctx);
}

window.initView = initView;