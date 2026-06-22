function initView(ctx) {
  const root = document.querySelector('[data-view="cargar_evidencia"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  const fileInput = root.querySelector('#file-upload');
  fileInput?.addEventListener('change', () => {
    const count = fileInput.files?.length || 0;
    if (count > 0) {
      const badge = root.querySelector('.font-status-micro.text-status-micro');
      if (badge) badge.textContent = `${count} ELEMENTOS`;
    }
  });

  root.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent.includes('Finalizar')) {
      btn.addEventListener('click', () => ctx.navigate(AppState.getPanelRoute()));
    }
    if (btn.textContent.includes('Descartar')) {
      btn.addEventListener('click', () => ctx.navigate('registrar_mantenimiento'));
    }
  });
}

window.initView = initView;