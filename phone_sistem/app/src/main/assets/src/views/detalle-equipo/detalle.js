function initView(ctx) {
  const root = document.querySelector('[data-view="detalle-equipo"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  root.querySelectorAll('button').forEach((btn) => {
    const text = btn.textContent.trim();
    if (text.includes('Registrar Falla')) btn.setAttribute('data-action', 'registrar-falla');
    if (text.includes('Nuevo Mantenimiento')) btn.setAttribute('data-action', 'registrar-mantenimiento');
  });

  bindViewNavigation(root, ctx);
}

window.initView = initView;