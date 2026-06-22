function initView(ctx) {
  const root = document.querySelector('[data-view="gesti_n_de_usuarios_y_roles"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);
}

window.initView = initView;