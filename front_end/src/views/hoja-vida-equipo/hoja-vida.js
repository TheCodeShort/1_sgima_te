function initView(ctx) {
  const root = document.querySelector('[data-view="hoja-vida-equipo"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  // Configurar miga de pan: Empresas > Equipos: {Empresa} > {Equipo}
  const nombreEquipo = sessionStorage.getItem('sigma_equipo_seleccionado_nombre') ?? '';
  const nombreEmpresa = sessionStorage.getItem('sigma_equipo_seleccionado_empresa_nombre') ?? '';
  const breadcrumbEmpresa = root.querySelector('#breadcrumb-nombre-empresa');
  const breadcrumbEquipo = root.querySelector('#breadcrumb-nombre-equipo');
  if (breadcrumbEmpresa) breadcrumbEmpresa.textContent = nombreEmpresa ?? '';
  if (breadcrumbEquipo) breadcrumbEquipo.textContent = nombreEquipo ?? '';
}

window.initView = initView;
