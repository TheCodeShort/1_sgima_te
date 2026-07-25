function initView(ctx) {
  const root = document.querySelector('[data-view="registrar-mantenimiento"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  root.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent.includes('Guardar')) {
      btn.addEventListener('click', () => ctx.navigate('cargar-evidencia'));
    }
    if (btn.textContent.includes('Volver')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        ctx.navigate('detalle-equipo');
      });
    }
  });
}

window.initView = initView;