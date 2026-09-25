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

  // Pestañas: Equipo, Información básica, Reporte, Certificado
  const tabEquipo = root.querySelector('#tab-equipo');
  const tabInfoBasica = root.querySelector('#tab-info-basica');
  const tabReporte = root.querySelector('#tab-reporte');
  const tabCertificado = root.querySelector('#tab-certificado');
  const panelEquipo = root.querySelector('#panel-equipo');
  const panelInfoBasica = root.querySelector('#panel-info-basica');
  const panelReporte = root.querySelector('#panel-reporte');
  const panelCertificado = root.querySelector('#panel-certificado');

  function activarTab(tab) {
    const esEquipo = tab === 'equipo';
    const esInfoBasica = tab === 'info-basica';
    const esReporte = tab === 'reporte';
    const esCertificado = tab === 'certificado';

    if (panelEquipo) panelEquipo.style.display = esEquipo ? 'block' : 'none';
    if (panelInfoBasica) panelInfoBasica.style.display = esInfoBasica ? 'block' : 'none';
    if (panelReporte) panelReporte.style.display = esReporte ? 'block' : 'none';
    if (panelCertificado) panelCertificado.style.display = esCertificado ? 'block' : 'none';

    if (tabEquipo) { tabEquipo.classList.toggle('border-primary', esEquipo); tabEquipo.classList.toggle('text-primary', esEquipo); tabEquipo.classList.toggle('border-transparent', !esEquipo); tabEquipo.classList.toggle('text-on-surface-variant', !esEquipo); }
    if (tabInfoBasica) { tabInfoBasica.classList.toggle('border-primary', esInfoBasica); tabInfoBasica.classList.toggle('text-primary', esInfoBasica); tabInfoBasica.classList.toggle('border-transparent', !esInfoBasica); tabInfoBasica.classList.toggle('text-on-surface-variant', !esInfoBasica); }
    if (tabReporte) { tabReporte.classList.toggle('border-primary', esReporte); tabReporte.classList.toggle('text-primary', esReporte); tabReporte.classList.toggle('border-transparent', !esReporte); tabReporte.classList.toggle('text-on-surface-variant', !esReporte); }
    if (tabCertificado) { tabCertificado.classList.toggle('border-primary', esCertificado); tabCertificado.classList.toggle('text-primary', esCertificado); tabCertificado.classList.toggle('border-transparent', !esCertificado); tabCertificado.classList.toggle('text-on-surface-variant', !esCertificado); }
  }

  if (tabEquipo) tabEquipo.addEventListener('click', () => activarTab('equipo'));
  if (tabInfoBasica) tabInfoBasica.addEventListener('click', () => activarTab('info-basica'));
  if (tabReporte) tabReporte.addEventListener('click', () => activarTab('reporte'));
  if (tabCertificado) tabCertificado.addEventListener('click', () => activarTab('certificado'));

  activarTab('equipo');
}

window.initView = initView;
