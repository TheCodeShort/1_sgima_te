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
