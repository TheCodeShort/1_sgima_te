function initView(ctx) {
  const root = document.querySelector('[data-view="gestion-usuarios-roles"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);
}

window.initView = initView;