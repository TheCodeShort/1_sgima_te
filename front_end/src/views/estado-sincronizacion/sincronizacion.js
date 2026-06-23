function initView(ctx) {
  const root = document.querySelector('[data-view="estado-sincronizacion"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  root.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent.includes('Forzar Sincronización')) {
      btn.addEventListener('click', () => {
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Sincronizando...';
        setTimeout(() => ctx.navigate(AppState.getPanelRoute()), 1500);
      });
    }
  });
}

window.initView = initView;