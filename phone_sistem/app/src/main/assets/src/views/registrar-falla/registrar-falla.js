function initView(ctx) {
  const root = document.querySelector('[data-view="registrar-falla"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const dtElement = document.getElementById('current-datetime');
  if (dtElement) dtElement.textContent = formatted;

  root.querySelector('button.bg-primary, button[type="submit"]')?.addEventListener('click', (e) => {
    if (e.target.closest('form') || e.target.textContent.includes('Registrar')) {
      e.preventDefault();
      ctx.navigate('cargar-evidencia');
    }
  });

  root.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent.trim() === 'Cancelar') {
      btn.addEventListener('click', () => ctx.navigate('equipos'));
    }
  });
}

window.initView = initView;