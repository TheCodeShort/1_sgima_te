function initView(ctx) {
  const root = document.querySelector('[data-view="hoja-vida-equipo"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  const idEquipo = sessionStorage.getItem('sigma_equipo_seleccionado_id');
  const nombreEquipo = sessionStorage.getItem('sigma_equipo_seleccionado_nombre') ?? '';
  const nombreEmpresa = sessionStorage.getItem('sigma_equipo_seleccionado_empresa_nombre') ?? '';
  const breadcrumbEmpresa = root.querySelector('#breadcrumb-nombre-empresa');
  const breadcrumbEquipo = root.querySelector('#breadcrumb-nombre-equipo');
  if (breadcrumbEmpresa) breadcrumbEmpresa.textContent = nombreEmpresa ?? '';
  if (breadcrumbEquipo) breadcrumbEquipo.textContent = nombreEquipo ?? '';

  const tabEquipo = root.querySelector('#tab-equipo');
  const tabInfoBasica = root.querySelector('#tab-info-basica');
  const tabReporte = root.querySelector('#tab-reporte');
  const tabCertificado = root.querySelector('#tab-certificado');
  const panelEquipo = root.querySelector('#panel-equipo');
  const panelInfoBasica = root.querySelector('#panel-info-basica');
  const panelReporte = root.querySelector('#panel-reporte');
  const panelCertificado = root.querySelector('#panel-certificado');

  const subtabHojaVida = root.querySelector('#subtab-hoja-vida');
  const subtabManual = root.querySelector('#subtab-manual');
  const subtabFactura = root.querySelector('#subtab-factura');
  const subtabHvCompleta = root.querySelector('#subtab-hv-completa');
  const subpanelHojaVida = root.querySelector('#subpanel-hoja-vida');
  const subpanelManual = root.querySelector('#subpanel-manual');
  const subpanelFactura = root.querySelector('#subpanel-factura');
  const subpanelHvCompleta = root.querySelector('#subpanel-hv-completa');

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
  function activarSubTab(sub) {
    const esHojaVida = sub === 'hoja-vida';
    const esManual = sub === 'manual';
    const esFactura = sub === 'factura';
    const esCompleta = sub === 'completa';
    if (subpanelHojaVida) subpanelHojaVida.style.display = esHojaVida ? 'block' : 'none';
    if (subpanelManual) subpanelManual.style.display = esManual ? 'block' : 'none';
    if (subpanelFactura) subpanelFactura.style.display = esFactura ? 'block' : 'none';
    if (subpanelHvCompleta) subpanelHvCompleta.style.display = esCompleta ? 'block' : 'none';
    if (subtabHojaVida) { subtabHojaVida.classList.toggle('border-primary', esHojaVida); subtabHojaVida.classList.toggle('text-primary', esHojaVida); subtabHojaVida.classList.toggle('border-transparent', !esHojaVida); subtabHojaVida.classList.toggle('text-on-surface-variant', !esHojaVida); }
    if (subtabManual) { subtabManual.classList.toggle('border-primary', esManual); subtabManual.classList.toggle('text-primary', esManual); subtabManual.classList.toggle('border-transparent', !esManual); subtabManual.classList.toggle('text-on-surface-variant', !esManual); }
    if (subtabFactura) { subtabFactura.classList.toggle('border-primary', esFactura); subtabFactura.classList.toggle('text-primary', esFactura); subtabFactura.classList.toggle('border-transparent', !esFactura); subtabFactura.classList.toggle('text-on-surface-variant', !esFactura); }
    if (subtabHvCompleta) { subtabHvCompleta.classList.toggle('border-primary', esCompleta); subtabHvCompleta.classList.toggle('text-primary', esCompleta); subtabHvCompleta.classList.toggle('border-transparent', !esCompleta); subtabHvCompleta.classList.toggle('text-on-surface-variant', !esCompleta); }
  }
  if (subtabHojaVida) subtabHojaVida.addEventListener('click', () => activarSubTab('hoja-vida'));
  if (subtabManual) subtabManual.addEventListener('click', () => activarSubTab('manual'));
  if (subtabFactura) subtabFactura.addEventListener('click', () => activarSubTab('factura'));
  if (subtabHvCompleta) subtabHvCompleta.addEventListener('click', () => activarSubTab('completa'));
  if (tabEquipo) tabEquipo.addEventListener('click', () => activarTab('equipo'));
  if (tabInfoBasica) tabInfoBasica.addEventListener('click', () => activarTab('info-basica'));
  if (tabReporte) tabReporte.addEventListener('click', () => activarTab('reporte'));
  if (tabCertificado) tabCertificado.addEventListener('click', () => activarTab('certificado'));
  activarTab('equipo');
  activarSubTab('hoja-vida');

  // ===== Lista "Hoja de vida del equipo": filtro + paginación =====
  // Mientras no exista backend se usan datos de ejemplo. Al conectar el backend:
  // poner USAR_DATOS_DE_PRUEBA_HV = false y llenar hvDatos con los datos reales.
  const USAR_DATOS_DE_PRUEBA_HV = true;
  const HV_POR_PAGINA = 5;
  const hvDatosPrueba = [
    { id: 1, nombre: 'Batería principal', fecha: '2026-03-14', observaciones: 'Reemplazada por bajo rendimiento' },
    { id: 2, nombre: 'Correa de transmisión', fecha: '2023-11-02', observaciones: 'Cambiada por desgaste visible' },
    { id: 3, nombre: 'Sensor de peso', fecha: '2021-06-20', observaciones: '' },
    { id: 4, nombre: 'Tarjeta electrónica de control', fecha: '2020-01-09', observaciones: 'Reparada tras falla de lectura, incluye repuesto original del fabricante y ajuste de calibración post-reparación' },
    { id: 5, nombre: 'Rodamiento de plataforma', fecha: '2019-08-27', observaciones: 'Cambiado por ruido excesivo durante la operación' },
    { id: 6, nombre: 'Celda de carga', fecha: '2022-05-10', observaciones: 'Reemplazada tras calibración fallida' },
    { id: 7, nombre: 'Cable de alimentación', fecha: '2024-09-03', observaciones: 'Sustituido por daño en el aislante' },
    { id: 8, nombre: 'Panel de control táctil', fecha: '2025-07-21', observaciones: '' }
  ];
  const hvDatos = USAR_DATOS_DE_PRUEBA_HV ? hvDatosPrueba : [];
  let hvPagina = 1;

  const hvInputNombre = root.querySelector('#filtro-hv-nombre');
  const hvInputDesde = root.querySelector('#filtro-hv-desde');
  const hvInputHasta = root.querySelector('#filtro-hv-hasta');
  const hvBtnLimpiar = root.querySelector('#btn-filtro-hv-limpiar');
  const hvCuerpo = root.querySelector('#tabla-hv-cuerpo');
  const hvVacio = root.querySelector('#hv-vacio');
  const hvVacioTexto = root.querySelector('#hv-vacio-texto');
  const hvContador = root.querySelector('#hv-contador');
  const hvBadgePrueba = root.querySelector('#hv-badge-prueba');
  const hvPag = root.querySelector('#hv-paginacion');

  function hvNormalizar(t) {
    return (t == null ? '' : String(t)).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }
  function hvEscapar(t) {
    return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function hvFormatearFecha(iso) {
    const p = String(iso || '').slice(0, 10).split('-');
    return p.length === 3 && p[0] ? p[2] + '/' + p[1] + '/' + p[0] : '—';
  }
  function hvFiltrar(datos, nombre, desde, hasta) {
    const n = hvNormalizar(nombre);
    return datos.filter(function (d) {
      const f = String(d.fecha || '').slice(0, 10);
      if (n && hvNormalizar(d.nombre).indexOf(n) === -1) return false;
      if (desde && f < desde) return false;
      if (hasta && f > hasta) return false;
      return true;
    }).sort(function (a, b) {
      return String(b.fecha || '').localeCompare(String(a.fecha || ''));
    });
  }
  function hvFilaHtml(d) {
    // COPIAR 1
    return `
      <tr class="border-b border-outline-variant/30">
        <td class="px-4 py-3 text-body-sm text-on-surface flex items-center gap-2 truncate max-w-xs">
          <span class="material-symbols-outlined text-[18px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-md">picture_as_pdf</span>
          ${hvEscapar(d.nombre)}
        </td>
        <td class="px-4 py-3 text-body-sm text-on-surface-variant whitespace-nowrap">${hvFormatearFecha(d.fecha)}</td>
        <td class="px-4 py-3 text-body-sm text-on-surface-variant truncate max-w-sm" title="${hvEscapar(d.observaciones) || '—'}">${hvEscapar(d.observaciones) || '—'}</td>
        <td class="px-4 py-3 text-right whitespace-nowrap">
          <button type="button" title="Editar" class="text-on-surface-variant hover:text-primary btn-editar-hv" data-id="${d.id}"><span class="material-symbols-outlined text-[18px]">edit</span></button>
          <button type="button" title="Borrar" class="text-on-surface-variant hover:text-red-400 btn-eliminar-hv" data-id="${d.id}"><span class="material-symbols-outlined text-[18px]">delete</span></button>
        </td>
      </tr>`;
  }
  function hvBotonPagHtml(valor, texto, activo, deshabilitado) {
    // COPIAR 2
    let cls = 'px-3 py-1 bg-surface-container border border-outline-variant text-on-surface rounded-lg text-body-sm';
    if (activo) cls = 'px-3 py-1 bg-inverse-primary text-on-primary border border-outline-variant rounded-lg text-body-sm';
    else if (deshabilitado) cls += ' opacity-50 cursor-not-allowed';
    const dis = deshabilitado ? ' disabled' : '';
    return `<button type="button" data-hv-pagina="${valor}" class="${cls}"${dis}>${texto}</button>`;
  }
  function hvPintar() {
    const desde = hvInputDesde ? hvInputDesde.value : '';
    const hasta = hvInputHasta ? hvInputHasta.value : '';
    const filtrados = hvFiltrar(hvDatos, hvInputNombre ? hvInputNombre.value : '', desde, hasta);
    const total = filtrados.length;
    const totalPaginas = Math.max(1, Math.ceil(total / HV_POR_PAGINA));
    if (hvPagina > totalPaginas) hvPagina = totalPaginas;
    if (hvPagina < 1) hvPagina = 1;
    const inicio = (hvPagina - 1) * HV_POR_PAGINA;
    const pagina = filtrados.slice(inicio, inicio + HV_POR_PAGINA);

    if (hvCuerpo) hvCuerpo.innerHTML = pagina.map(hvFilaHtml).join('');

    if (hvVacio && hvVacioTexto) {
      if (total === 0) {
        if (hvDatos.length === 0) hvVacioTexto.textContent = 'Aún no hay componentes registrados para este equipo.';
        else if (desde && hasta && desde > hasta) hvVacioTexto.textContent = 'La fecha «desde» no puede ser posterior a la fecha «hasta».';
        else hvVacioTexto.textContent = 'Ningún componente coincide con los filtros aplicados.';
        hvVacio.style.display = 'block';
      } else {
        hvVacio.style.display = 'none';
      }
    }

    if (hvContador) {
      hvContador.innerHTML = total === 0
        ? 'Sin documentos'
        : 'Mostrando <span class="text-on-surface font-semibold">' + (inicio + 1) + '-' + (inicio + pagina.length) +
          '</span> de <span class="text-on-surface font-semibold">' + total + '</span> documentos';
    }

    if (hvBadgePrueba) hvBadgePrueba.style.display = USAR_DATOS_DE_PRUEBA_HV ? 'inline-block' : 'none';

    if (hvPag) {
      if (totalPaginas <= 1) {
        hvPag.style.display = 'none';
        hvPag.innerHTML = '';
      } else {
        hvPag.style.display = '';
        let html = hvBotonPagHtml('ant', 'Anterior', false, hvPagina === 1);
        for (let i = 1; i <= totalPaginas; i++) html += hvBotonPagHtml(String(i), String(i), i === hvPagina, false);
        html += hvBotonPagHtml('sig', 'Siguiente', false, hvPagina === totalPaginas);
        hvPag.innerHTML = html;
      }
    }
  }
  function hvAlCambiarFiltro() { hvPagina = 1; hvPintar(); }
  if (hvInputNombre) hvInputNombre.addEventListener('input', hvAlCambiarFiltro);
  if (hvInputDesde) { hvInputDesde.addEventListener('input', hvAlCambiarFiltro); hvInputDesde.addEventListener('change', hvAlCambiarFiltro); }
  if (hvInputHasta) { hvInputHasta.addEventListener('input', hvAlCambiarFiltro); hvInputHasta.addEventListener('change', hvAlCambiarFiltro); }
  if (hvBtnLimpiar) hvBtnLimpiar.addEventListener('click', function () {
    if (hvInputNombre) hvInputNombre.value = '';
    if (hvInputDesde) hvInputDesde.value = '';
    if (hvInputHasta) hvInputHasta.value = '';
    hvAlCambiarFiltro();
  });
  if (hvPag) hvPag.addEventListener('click', function (e) {
    const b = e.target.closest('button[data-hv-pagina]');
    if (!b || b.disabled) return;
    const v = b.getAttribute('data-hv-pagina');
    if (v === 'ant') hvPagina -= 1;
    else if (v === 'sig') hvPagina += 1;
    else hvPagina = parseInt(v, 10) || 1;
    hvPintar();
  });
  hvPintar();

  // --- Formulario crear/editar y borrar (en memoria) ---
  const HV_NOMBRE_MAX = 120;
  const hvModal = root.querySelector('#modal-hv');
  const hvModalTitulo = root.querySelector('#modal-hv-titulo');
  const hvForm = root.querySelector('#form-hv');
  const hvFNombre = root.querySelector('#hv-nombre');
  const hvFFecha = root.querySelector('#hv-fecha');
  const hvFObs = root.querySelector('#hv-observaciones');
  const hvErrNombre = root.querySelector('#error-hv-nombre');
  const hvErrFecha = root.querySelector('#error-hv-fecha');
  const hvBtnNueva = root.querySelector('#btn-nueva-hv');
  const hvBtnGuardar = root.querySelector('#btn-guardar-hv');
  const hvBtnCancelar = root.querySelector('#btn-cancelar-hv');
  const hvBtnCerrar = root.querySelector('#btn-cerrar-modal-hv');
  let hvEditandoId = null;

  function hvClaveNombre(t) {
    return String(t == null ? '' : t).trim().replace(/\s+/g, ' ').toLowerCase();
  }
  function hvValidarNombre(nombre, datos, idActual) {
    const limpio = String(nombre == null ? '' : nombre).trim().replace(/\s+/g, ' ');
    if (!limpio) return 'El nombre es obligatorio.';
    if (limpio.length > HV_NOMBRE_MAX) return 'El nombre no puede superar ' + HV_NOMBRE_MAX + ' caracteres.';
    if (/[\\\/:*?"<>|\u0000-\u001f]/.test(limpio)) return 'El nombre no puede contener los caracteres \\ / : * ? " < > |';
    if (/^\.+$/.test(limpio) || /[. ]$/.test(limpio)) return 'El nombre no puede terminar en punto.';
    const clave = hvClaveNombre(limpio);
    const repetido = datos.some(function (d) { return d.id !== idActual && hvClaveNombre(d.nombre) === clave; });
    if (repetido) return 'Ya existe una hoja de vida con ese nombre. Usa otro (por ejemplo, agrega un número o el año).';
    return '';
  }
  function hvValidarFecha(v) {
    if (!v) return 'La fecha es obligatoria.';
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (!m) return 'Ingresa una fecha válida.';
    const y = +m[1], mo = +m[2], d = +m[3];
    const dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return 'Ingresa una fecha válida.';
    if (y < 1900 || y > 2100) return 'La fecha debe estar entre los años 1900 y 2100.';
    return '';
  }
  function hvMostrarError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
  }
  function hvLimpiarErrores() { hvMostrarError(hvErrNombre, ''); hvMostrarError(hvErrFecha, ''); }
  function hvAbrirModal(registro) {
    if (!hvModal) return;
    hvEditandoId = registro ? registro.id : null;
    if (hvModalTitulo) hvModalTitulo.textContent = registro ? 'Editar componente reemplazado' : 'Nuevo componente reemplazado';
    if (hvFNombre) hvFNombre.value = registro ? registro.nombre : '';
    if (hvFFecha) hvFFecha.value = registro ? String(registro.fecha).slice(0, 10) : '';
    if (hvFObs) hvFObs.value = registro ? (registro.observaciones || '') : '';
    hvLimpiarErrores();
    hvModal.style.display = 'flex';
    hvModal.setAttribute('aria-hidden', 'false');
    if (hvFNombre) hvFNombre.focus();
  }
  function hvCerrarModal() {
    if (!hvModal) return;
    hvModal.style.display = 'none';
    hvModal.setAttribute('aria-hidden', 'true');
    hvEditandoId = null;
  }
  async function hvGuardar() {
    const eN = hvValidarNombre(hvFNombre ? hvFNombre.value : '', hvDatos, hvEditandoId);
    const eF = hvValidarFecha(hvFFecha ? hvFFecha.value : '');
    hvMostrarError(hvErrNombre, eN);
    hvMostrarError(hvErrFecha, eF);
    if (eN || eF) return;
    const nombre = hvFNombre.value.trim().replace(/\s+/g, ' ');
    const fecha = hvFFecha.value;
    const observaciones = hvFObs ? hvFObs.value.trim() : '';
    if (hvEditandoId != null) {
      const reg = hvDatos.find(function (d) { return d.id === hvEditandoId; });
      if (reg) { reg.nombre = nombre; reg.fecha = fecha; reg.observaciones = observaciones; }
      hvCerrarModal();
      hvPintar();
      await mostrarAlerta({ titulo: 'Éxito', mensaje: 'Componente actualizado correctamente.' });
    } else {
      const nuevoId = hvDatos.reduce(function (m, d) { return Math.max(m, d.id); }, 0) + 1;
      hvDatos.push({ id: nuevoId, nombre: nombre, fecha: fecha, observaciones: observaciones });
      hvCerrarModal();
      if (hvInputNombre) hvInputNombre.value = '';
      if (hvInputDesde) hvInputDesde.value = '';
      if (hvInputHasta) hvInputHasta.value = '';
      hvPagina = 1;
      hvPintar();
      await mostrarAlerta({ titulo: 'Éxito', mensaje: 'Componente registrado correctamente.' });
    }
  }
  if (hvBtnNueva) hvBtnNueva.addEventListener('click', function () { hvAbrirModal(null); });
  if (hvBtnCancelar) hvBtnCancelar.addEventListener('click', hvCerrarModal);
  if (hvBtnCerrar) hvBtnCerrar.addEventListener('click', hvCerrarModal);
  if (hvBtnGuardar) hvBtnGuardar.addEventListener('click', hvGuardar);
  if (hvForm) hvForm.addEventListener('submit', function (e) { e.preventDefault(); hvGuardar(); });
  if (hvFNombre) hvFNombre.addEventListener('input', function () { hvMostrarError(hvErrNombre, ''); });
  if (hvFFecha) hvFFecha.addEventListener('input', function () { hvMostrarError(hvErrFecha, ''); });
  if (hvCuerpo) hvCuerpo.addEventListener('click', async function (e) {
    const bEd = e.target.closest('.btn-editar-hv');
    if (bEd) {
      const reg = hvDatos.find(function (d) { return String(d.id) === bEd.getAttribute('data-id'); });
      if (reg) hvAbrirModal(reg);
      return;
    }
    const bDel = e.target.closest('.btn-eliminar-hv');
    if (bDel) {
      const reg = hvDatos.find(function (d) { return String(d.id) === bDel.getAttribute('data-id'); });
      if (!reg) return;
      const ok = await mostrarConfirmacion({
        titulo: 'Eliminar componente',
        mensaje: '¿Eliminar el componente "' + reg.nombre + '"? Esta acción no se puede deshacer desde aquí.',
        textoConfirmar: 'Eliminar',
        textoCancelar: 'Cancelar',
        tipo: 'peligro'
      });
      if (!ok) return;
      const i = hvDatos.findIndex(function (d) { return d.id === reg.id; });
      if (i !== -1) hvDatos.splice(i, 1);
      hvPintar();
      await mostrarAlerta({ titulo: 'Éxito', mensaje: 'Componente eliminado correctamente.' });
    }
  });
  // --- fin formulario y borrado ---

  if (!idEquipo) return;

  const CAMPOS_TECNICOS_FIJOS = [
    'capacidad_maxima', 'division_escala', 'clase',
    'tipo_equipo_detalle', 'alimentacion', 'condiciones_operacion'
  ];

  const PREFIJO_INFO_EXTRA = 'info__';

  let datosOriginales = null;

  const btnEditar = root.querySelector('#btn-editar');
  const bloqueLectura = root.querySelector('#botones-modo-lectura');
  const bloqueEdicion = root.querySelector('#botones-modo-edicion');
  const btnCancelar = root.querySelector('#btn-cancelar-edicion');
  const btnGuardar = root.querySelector('#btn-guardar-edicion');

  const contTecnicasLectura = root.querySelector('#caracteristicas-tecnicas-lectura');
  const contTecnicasEdicion = root.querySelector('#caracteristicas-tecnicas-edicion');
  const contExtraLectura = root.querySelector('#ct-extra-lectura');
  const filasExtra = root.querySelector('#filas-caracteristicas-extra');
  const btnAgregarCampo = root.querySelector('#btn-agregar-campo-tecnico');

  const contInfoExtraLectura = root.querySelector('#info-general-extra-lectura');
  const filasInfoExtra = root.querySelector('#filas-informacion-extra');
  const btnAgregarCampoInfo = root.querySelector('#btn-agregar-campo-info');

  const camposTexto = [
    { lectura: 'campo-area-lectura', edicion: 'campo-area-edicion' },
    { lectura: 'campo-responsable-lectura', edicion: 'campo-responsable-edicion' },
    { lectura: 'campo-fecha-lectura', edicion: 'campo-fecha-edicion' }
  ];

  const camposEquipo = [
    { lectura: 'campo-nombre-lectura', edicion: 'campo-nombre-edicion', dto: 'nombreEquipo' },
    { lectura: 'campo-marca-lectura', edicion: 'campo-marca-edicion', dto: 'marca' },
    { lectura: 'campo-modelo-lectura', edicion: 'campo-modelo-edicion', dto: 'modelo' },
    { lectura: 'campo-serial-lectura', edicion: 'campo-serial-edicion', dto: 'serial' },
    { lectura: 'campo-codigo-lectura', edicion: 'campo-codigo-edicion', dto: 'codigoEquipo' },
    { lectura: 'campo-ubicacion-lectura', edicion: 'campo-ubicacion-edicion', dto: 'ubicacion' },
    { lectura: 'campo-observaciones-lectura', edicion: 'campo-observaciones-edicion', dto: 'observacionesEquipo' }
  ];

  const checkboxes = [
    { id: 'doc-manual-operacion', clave: 'manual_operacion' },
    { id: 'doc-division-servicio', clave: 'division_servicio' },
    { id: 'doc-certificado-calibracion', clave: 'certificado_calibracion' },
    { id: 'doc-ficha-tecnica', clave: 'ficha_tecnica' }
  ];

  const tienePermisoEditar = (AppState.permisos || []).includes('editar_equipos');
  if (btnEditar) btnEditar.style.display = tienePermisoEditar ? 'inline-flex' : 'none';

  function renderExtraLectura(caracteristicas) {
    if (!contExtraLectura) return;
    const claves = Object.keys(caracteristicas || {}).filter((k) => !CAMPOS_TECNICOS_FIJOS.includes(k));
    contExtraLectura.innerHTML = claves.map((clave) => `
      <div class="grid grid-cols-[150px_1fr] gap-4 items-center border-b border-outline-variant/30 py-2">
        <span class="text-on-surface-variant">${clave}:</span>
        <span class="text-on-surface font-medium">${caracteristicas[clave]}</span>
      </div>`).join('');
  }

  function renderFilaExtra(clave = '', valor = '') {
    const fila = document.createElement('div');
    fila.className = 'flex items-center gap-2 fila-caracteristica-extra border-t border-outline-variant/30 pt-2 mt-1';
    fila.innerHTML = `
      <input type="text" class="input-clave flex-1 px-3 py-2 rounded-lg border border-outline-variant bg-surface-base text-on-surface text-body-sm" placeholder="Nombre del campo" value="${clave}">
      <input type="text" class="input-valor flex-1 px-3 py-2 rounded-lg border border-outline-variant bg-surface-base text-on-surface text-body-sm" placeholder="Valor" value="${valor}">
      <button type="button" class="btn-borrar-fila text-error hover:opacity-70">
        <span class="material-symbols-outlined text-[20px]">delete</span>
      </button>
    `;
    fila.querySelector('.input-clave').addEventListener('input', marcarComoModificado);
    fila.querySelector('.input-valor').addEventListener('input', marcarComoModificado);
    fila.querySelector('.btn-borrar-fila').addEventListener('click', () => {
      fila.remove();
      marcarComoModificado();
    });
    filasExtra.appendChild(fila);
  }

  function renderExtraEdicion(caracteristicas) {
    if (!filasExtra) return;
    filasExtra.innerHTML = '';
    const claves = Object.keys(caracteristicas || {}).filter((k) => !CAMPOS_TECNICOS_FIJOS.includes(k));
    claves.forEach((clave) => renderFilaExtra(clave, caracteristicas[clave]));
  }

  function recolectarExtra() {
    const resultado = {};
    const errores = [];
    const clavesVistas = new Set();
    filasExtra.querySelectorAll('.fila-caracteristica-extra').forEach((fila) => {
      const clave = fila.querySelector('.input-clave').value.trim();
      const valor = fila.querySelector('.input-valor').value.trim();
      if (!clave || !valor) {
        errores.push('Hay un campo agregado incompleto (falta nombre o valor).');
        return;
      }
      if (CAMPOS_TECNICOS_FIJOS.includes(clave)) {
        errores.push(`"${clave}" ya es un campo estándar, usa otro nombre.`);
        return;
      }
      if (clavesVistas.has(clave)) {
        errores.push(`El campo "${clave}" está repetido.`);
        return;
      }
      clavesVistas.add(clave);
      resultado[clave] = valor;
    });
    return { resultado, errores };
  }

  function renderFilaInformacionExtra(clave = '', valor = '') {
    const fila = document.createElement('div');
    fila.className = 'flex items-center gap-2 fila-informacion-extra';
    fila.innerHTML = `
      <input type="text" class="input-clave flex-1 px-3 py-2 rounded-lg border border-outline-variant bg-surface-base text-on-surface text-body-sm" placeholder="Nombre del campo" value="${clave}">
      <input type="text" class="input-valor flex-1 px-3 py-2 rounded-lg border border-outline-variant bg-surface-base text-on-surface text-body-sm" placeholder="Valor" value="${valor}">
      <button type="button" class="btn-borrar-fila text-error hover:opacity-70">
        <span class="material-symbols-outlined text-[20px]">delete</span>
      </button>
    `;
    fila.querySelector('.input-clave').addEventListener('input', marcarComoModificado);
    fila.querySelector('.input-valor').addEventListener('input', marcarComoModificado);
    fila.querySelector('.btn-borrar-fila').addEventListener('click', () => {
      fila.remove();
      marcarComoModificado();
    });
    filasInfoExtra.appendChild(fila);
  }

  function renderInformacionExtraLectura(caracteristicas) {
    if (!contInfoExtraLectura) return;
    const claves = Object.keys(caracteristicas || {}).filter((k) => k.startsWith(PREFIJO_INFO_EXTRA));
    contInfoExtraLectura.innerHTML = claves.map((claveConPrefijo) => {
      const claveVisible = claveConPrefijo.slice(PREFIJO_INFO_EXTRA.length);
      return `
        <div class="grid grid-cols-[150px_1fr] gap-4 items-center border-t border-outline-variant/30 pt-2 mt-1">
          <span class="text-on-surface-variant">${claveVisible}:</span>
          <span class="text-on-surface font-medium">${caracteristicas[claveConPrefijo]}</span>
        </div>`;
    }).join('');
  }

  function renderInformacionExtraEdicion(caracteristicas) {
    if (!filasInfoExtra) return;
    filasInfoExtra.innerHTML = '';
    const claves = Object.keys(caracteristicas || {}).filter((k) => k.startsWith(PREFIJO_INFO_EXTRA));
    claves.forEach((claveConPrefijo) => {
      const claveVisible = claveConPrefijo.slice(PREFIJO_INFO_EXTRA.length);
      renderFilaInformacionExtra(claveVisible, caracteristicas[claveConPrefijo]);
    });
  }

  function recolectarInformacionExtra() {
    const resultado = {};
    const errores = [];
    const clavesVistas = new Set();
    filasInfoExtra.querySelectorAll('.fila-informacion-extra').forEach((fila) => {
      const clave = fila.querySelector('.input-clave').value.trim();
      const valor = fila.querySelector('.input-valor').value.trim();
      if (!clave || !valor) {
        errores.push('Hay un campo agregado en Información General incompleto (falta nombre o valor).');
        return;
      }
      if (clavesVistas.has(clave)) {
        errores.push(`El campo "${clave}" está repetido en Información General.`);
        return;
      }
      clavesVistas.add(clave);
      resultado[PREFIJO_INFO_EXTRA + clave] = valor;
    });
    return { resultado, errores };
  }

  function mostrarModoLectura() {
    camposTexto.forEach(({ lectura, edicion }) => {
      const elLectura = root.querySelector(`#${lectura}`);
      const elEdicion = root.querySelector(`#${edicion}`);
      if (elLectura) elLectura.style.display = '';
      if (elEdicion) elEdicion.style.display = 'none';
    });
    camposEquipo.forEach(({ lectura, edicion }) => {
      const elLectura = root.querySelector(`#${lectura}`);
      const elEdicion = root.querySelector(`#${edicion}`);
      if (elLectura) elLectura.style.display = '';
      if (elEdicion) elEdicion.style.display = 'none';
    });
    if (contTecnicasLectura) contTecnicasLectura.style.display = '';
    if (contTecnicasEdicion) contTecnicasEdicion.style.display = 'none';
    if (contInfoExtraLectura) contInfoExtraLectura.style.display = '';
    const contInfoExtraEdicionEl = root.querySelector('#info-general-extra-edicion');
    if (contInfoExtraEdicionEl) contInfoExtraEdicionEl.style.display = 'none';
    checkboxes.forEach(({ id }) => {
      const chk = root.querySelector(`#${id}`);
      if (chk) chk.disabled = true;
    });
  }

  function mostrarModoEdicion() {
    camposTexto.forEach(({ lectura, edicion }) => {
      const elLectura = root.querySelector(`#${lectura}`);
      const elEdicion = root.querySelector(`#${edicion}`);
      if (elLectura) elLectura.style.display = 'none';
      if (elEdicion) {
        elEdicion.style.display = '';
        elEdicion.value = elLectura && elLectura.textContent !== '—' ? elLectura.textContent.trim() : '';
      }
    });
    camposEquipo.forEach(({ lectura, edicion }) => {
      const elLectura = root.querySelector(`#${lectura}`);
      const elEdicion = root.querySelector(`#${edicion}`);
      if (elLectura) elLectura.style.display = 'none';
      if (elEdicion) {
        elEdicion.style.display = '';
        elEdicion.value = elLectura ? elLectura.textContent.trim() : '';
      }
    });
    CAMPOS_TECNICOS_FIJOS.forEach((clave) => {
      const elLectura = root.querySelector(`#ct-${clave}-lectura`);
      const elEdicion = root.querySelector(`#ct-${clave}-edicion`);
      if (elEdicion) {
        elEdicion.value = elLectura && elLectura.textContent !== '—' ? elLectura.textContent.trim() : '';
      }
    });
    if (contTecnicasLectura) contTecnicasLectura.style.display = 'none';
    if (contTecnicasEdicion) contTecnicasEdicion.style.display = '';
    if (contInfoExtraLectura) contInfoExtraLectura.style.display = 'none';
    const contInfoExtraEdicionEl2 = root.querySelector('#info-general-extra-edicion');
    if (contInfoExtraEdicionEl2) contInfoExtraEdicionEl2.style.display = '';
    renderExtraEdicion(datosOriginales ? datosOriginales.caracteristicasTecnicas : {});
    renderInformacionExtraEdicion(datosOriginales ? datosOriginales.caracteristicasTecnicas : {});
    checkboxes.forEach(({ id }) => {
      const chk = root.querySelector(`#${id}`);
      if (chk) chk.disabled = false;
    });
  }

  function renderLectura(dto) {
    const mapaTexto = {
      'campo-area-lectura': dto.area,
      'campo-responsable-lectura': dto.responsable,
      'campo-fecha-lectura': dto.fechaPuestaServicio
    };
    Object.entries(mapaTexto).forEach(([id, valor]) => {
      const el = root.querySelector(`#${id}`);
      if (el) el.textContent = valor ?? '—';
    });

    camposEquipo.forEach(({ lectura, dto: claveDto }) => {
      const el = root.querySelector(`#${lectura}`);
      if (el) el.textContent = dto[claveDto] ?? '—';
    });

    const caracteristicas = dto.caracteristicasTecnicas || {};
    CAMPOS_TECNICOS_FIJOS.forEach((clave) => {
      const el = root.querySelector(`#ct-${clave}-lectura`);
      if (el) el.textContent = caracteristicas[clave] ?? '—';
    });
    renderExtraLectura(caracteristicas);
    renderInformacionExtraLectura(caracteristicas);

    const docs = dto.documentos || {};
    checkboxes.forEach(({ id, clave }) => {
      const chk = root.querySelector(`#${id}`);
      if (chk) chk.checked = Boolean(docs[clave]);
    });
  }

  function marcarComoModificado() {
    if (btnGuardar) {
      btnGuardar.disabled = false;
      btnGuardar.classList.remove('bg-surface-container-highest', 'text-on-surface-variant', 'cursor-not-allowed');
      btnGuardar.classList.add('bg-inverse-primary', 'text-on-primary');
      btnGuardar.style.opacity = '1';
    }
  }

  function marcarComoSinCambios() {
    if (btnGuardar) {
      btnGuardar.disabled = true;
      btnGuardar.classList.add('bg-surface-container-highest', 'text-on-surface-variant', 'cursor-not-allowed');
      btnGuardar.classList.remove('bg-inverse-primary', 'text-on-primary');
      btnGuardar.style.opacity = '0.5';
    }
  }

  function entrarModoEdicion() {
    if (bloqueLectura) bloqueLectura.style.display = 'none';
    if (bloqueEdicion) bloqueEdicion.style.display = 'flex';
    mostrarModoEdicion();
    marcarComoSinCambios();

    camposTexto.forEach(({ edicion }) => {
      const el = root.querySelector(`#${edicion}`);
      if (el) el.addEventListener('input', marcarComoModificado);
    });
    camposEquipo.forEach(({ edicion }) => {
      const el = root.querySelector(`#${edicion}`);
      if (el) el.addEventListener('input', marcarComoModificado);
    });
    CAMPOS_TECNICOS_FIJOS.forEach((clave) => {
      const el = root.querySelector(`#ct-${clave}-edicion`);
      if (el) el.addEventListener('input', marcarComoModificado);
    });
    checkboxes.forEach(({ id }) => {
      const chk = root.querySelector(`#${id}`);
      if (chk) chk.addEventListener('change', marcarComoModificado);
    });
    if (btnAgregarCampo) {
      btnAgregarCampo.onclick = () => { renderFilaExtra('', ''); marcarComoModificado(); };
    }
    if (btnAgregarCampoInfo) {
      btnAgregarCampoInfo.onclick = () => { renderFilaInformacionExtra('', ''); marcarComoModificado(); };
    }
  }

  function salirModoEdicionSinGuardar() {
    if (bloqueLectura) bloqueLectura.style.display = 'flex';
    if (bloqueEdicion) bloqueEdicion.style.display = 'none';
    mostrarModoLectura();
    renderLectura(datosOriginales);
  }

  function validarCamposObligatorios() {
    const errores = [];
    CAMPOS_TECNICOS_FIJOS.forEach((clave) => {
      const el = root.querySelector(`#ct-${clave}-edicion`);
      if (el && el.value.trim() === '') {
        errores.push('Todos los campos estándar de Características Técnicas deben tener un valor.');
      }
    });
    return errores;
  }

  async function guardarCambios() {
    const erroresFijos = validarCamposObligatorios();
    const { resultado: extra, errores: erroresExtra } = recolectarExtra();
    const { resultado: infoExtra, errores: erroresInfoExtra } = recolectarInformacionExtra();
    const errores = [...erroresFijos, ...erroresExtra, ...erroresInfoExtra];
    if (errores.length > 0) {
      await mostrarAlerta({ titulo: 'Revisa los campos', mensaje: errores[0], tipo: 'peligro' });
      return;
    }

    const caracteristicasTecnicas = { ...extra, ...infoExtra };
    CAMPOS_TECNICOS_FIJOS.forEach((clave) => {
      const el = root.querySelector(`#ct-${clave}-edicion`);
      caracteristicasTecnicas[clave] = el ? el.value.trim() : '';
    });

    const documentos = {};
    checkboxes.forEach(({ id, clave }) => {
      const chk = root.querySelector(`#${id}`);
      documentos[clave] = chk ? chk.checked : false;
    });

    const areaEl = root.querySelector('#campo-area-edicion');
    const responsableEl = root.querySelector('#campo-responsable-edicion');
    const fechaEl = root.querySelector('#campo-fecha-edicion');
    const payloadHojaVida = {
      area: areaEl ? areaEl.value.trim() : null,
      responsable: responsableEl ? responsableEl.value.trim() : null,
      fechaPuestaServicio: fechaEl ? fechaEl.value : null,
      caracteristicasTecnicas,
      documentos
    };

    // Arma el objeto COMPLETO de equipo, fusionando los 6 campos editables
    // con los valores originales que no se muestran aqui (obligatorios
    // para el backend: idEstadoEquipo, idUsuarioRegistro, etc.)
    const payloadEquipo = {
      codigoEquipo: root.querySelector('#campo-codigo-edicion')?.value.trim() ?? datosOriginales.codigoEquipo,
      nombreEquipo: root.querySelector('#campo-nombre-edicion')?.value.trim() ?? datosOriginales.nombreEquipo,
      tipoEquipo: datosOriginales.tipoEquipo,
      marca: root.querySelector('#campo-marca-edicion')?.value.trim() ?? datosOriginales.marca,
      modelo: root.querySelector('#campo-modelo-edicion')?.value.trim() ?? datosOriginales.modelo,
      pesoMaximo: datosOriginales.pesoMaximo,
      unidadPeso: datosOriginales.unidadPeso,
      serial: root.querySelector('#campo-serial-edicion')?.value.trim() ?? datosOriginales.serial,
      ubicacion: root.querySelector('#campo-ubicacion-edicion')?.value.trim() ?? datosOriginales.ubicacion,
      idEstadoEquipo: datosOriginales.idEstadoEquipo,
      frecuenciaCalibracionDias: datosOriginales.frecuenciaCalibracionDias,
      codigoQr: datosOriginales.codigoQr,
      observacionesEquipo: root.querySelector('#campo-observaciones-edicion')?.value.trim() ?? datosOriginales.observacionesEquipo,
      idUsuarioRegistro: datosOriginales.idUsuarioRegistro,
      idEmpresa: datosOriginales.idEmpresa
    };

    const cambioAlgoDeEquipo =
      payloadEquipo.codigoEquipo !== datosOriginales.codigoEquipo ||
      payloadEquipo.nombreEquipo !== datosOriginales.nombreEquipo ||
      payloadEquipo.marca !== datosOriginales.marca ||
      payloadEquipo.modelo !== datosOriginales.modelo ||
      payloadEquipo.serial !== datosOriginales.serial ||
      payloadEquipo.ubicacion !== datosOriginales.ubicacion ||
      payloadEquipo.observacionesEquipo !== datosOriginales.observacionesEquipo;

    try {
      if (cambioAlgoDeEquipo) {
        await EquipoService.actualizarEquipo(idEquipo, payloadEquipo);
      }
      await EquipoService.guardarHojaVida(idEquipo, payloadHojaVida);
      if (typeof showToast === 'function') showToast('Guardado con éxito', 'success');
      if (bloqueLectura) bloqueLectura.style.display = 'flex';
      if (bloqueEdicion) bloqueEdicion.style.display = 'none';
      await cargarYRenderizar();
    } catch (err) {
      await mostrarAlerta({ titulo: 'Error al guardar', mensaje: err.message, tipo: 'peligro' });
    }
  }

  if (btnEditar) btnEditar.addEventListener('click', entrarModoEdicion);

  if (btnCancelar) {
    btnCancelar.addEventListener('click', async () => {
      if (btnGuardar && btnGuardar.disabled) {
        salirModoEdicionSinGuardar();
        return;
      }
      const confirmado = await mostrarConfirmacion({
        titulo: 'Descartar cambios',
        mensaje: '¿Seguro que quieres descartar todos los cambios realizados?',
        textoConfirmar: 'Sí, descartar',
        textoCancelar: 'Seguir editando',
        tipo: 'peligro'
      });
      if (confirmado) salirModoEdicionSinGuardar();
    });
  }

  if (btnGuardar) {
    btnGuardar.addEventListener('click', () => {
      if (btnGuardar.disabled) return;
      guardarCambios();
    });
  }

  async function cargarYRenderizar() {
    try {
      const dto = await EquipoService.getHojaVida(idEquipo);
      datosOriginales = dto;
      mostrarModoLectura();
      renderLectura(dto);
    } catch (err) {
      if (typeof showToast === 'function') showToast(err.message, 'error');
    }
  }

  cargarYRenderizar();
}

window.initView = initView;
