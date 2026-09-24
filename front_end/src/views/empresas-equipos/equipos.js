/**
 * Vista empresas-equipos
 * Gestión de equipos por empresa
 */

(function () {
let equipoEditandoId = null;

function pintarTablaEquipos(root, equipos) {
  equipos = equipos.filter((eq) => !(eq.nombreEquipo || '').startsWith('Eliminado - '));
  const tbody = root.querySelector('#tabla-equipos-body');
  if (!tbody) return;
  if (!Array.isArray(equipos) || equipos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-4 py-8 text-center text-on-surface-variant">
          No hay equipos registrados.
        </td>
      </tr>
    `;
    return;
  }
  let rowsHtml = '';
  equipos.forEach((equipo) => {
    const codigo = equipo.codigoEquipo ?? '—';
    const nombre = equipo.nombreEquipo ?? 'Sin nombre';
    const ubicacion = equipo.ubicacion ?? '—';
    const peso = (equipo.pesoMaximo !== null && equipo.pesoMaximo !== undefined)
      ? `${equipo.pesoMaximo} ${equipo.unidadPeso ?? ''}`.trim()
      : 'No aplica';
    const activo = equipo.activo !== false;
    const badgeActivo = activo
      ? '<span class="text-success text-status-micro font-status-micro border border-success/30 bg-success/10 px-1.5 py-0.5 rounded">ACTIVO</span>'
      : '<span class="text-on-surface-variant text-status-micro font-status-micro border border-outline-variant bg-surface-container px-1.5 py-0.5 rounded">INACTIVO</span>';
    const toggleIcon = activo ? 'block' : 'check_circle';
    const toggleAction = activo ? 'desactivar' : 'activar';
    const toggleTitle = activo ? 'Desactivar' : 'Activar';
    rowsHtml += `
      <tr class="h-row-height-dense hover:bg-surface-container-highest transition-colors group">
        <td class="px-4 py-2">
          <span class="text-data-table font-data-table font-bold text-on-surface font-mono">${codigo}</span>
        </td>
        <td class="px-4 py-2 text-data-table font-data-table text-on-surface">${nombre}</td>
        <td class="px-4 py-2 text-data-table font-data-table text-on-surface-variant">${peso}</td>
        <td class="px-4 py-2 text-data-table font-data-table text-on-surface-variant">${badgeActivo}</td>
        <td class="px-4 py-2 text-data-table font-data-table text-on-surface-variant">${ubicacion}</td>
        <td class="px-4 py-2 text-right">
          <button class="btn-editar-equipo text-on-surface-variant hover:text-primary transition-colors p-1 rounded hover:bg-primary/10" title="Editar" data-action="editar-equipo" data-id="${equipo.idEquipo}" data-nombre="${nombre}">
            <span class="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button class="btn-eliminar-equipo text-on-surface-variant hover:text-error transition-colors p-1 rounded hover:bg-error/10" title="Eliminar" data-action="eliminar-equipo" data-id="${equipo.idEquipo}" data-nombre="${nombre}">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
          <button class="btn-toggle-equipo text-on-surface-variant hover:text-primary transition-colors p-1 rounded hover:bg-primary/10" title="${toggleTitle}" data-action="${toggleAction}" data-id="${equipo.idEquipo}" data-nombre="${nombre}">
            <span class="material-symbols-outlined text-[18px]">${toggleIcon}</span>
          </button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = rowsHtml;
}

async function cargarEquipos(root, idEmpresa) {
  const tbody = root.querySelector('#tabla-equipos-body');
  if (!tbody) return;
  try {
    const equipos = await EquipoService.getEquiposPorEmpresa(idEmpresa);
    pintarTablaEquipos(root, equipos);
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-4 py-8 text-center text-error">
          Error al cargar los equipos. Intente de nuevo.
        </td>
      </tr>
    `;
  }
}

let modalNuevoEquipo = null;
let formNuevoEquipo = null;
let btnPesoNoAplicaActivo = false;
let btnUnidadNoAplicaActivo = false;

async function cargarTiposEstados(root) {
  const selectTipo = root.querySelector('#tipo-equipo');
  const selectEstado = root.querySelector('#estado-equipo');
  if (!selectTipo || !selectEstado) return;

  try {
    const [tipos, estados] = await Promise.all([
      EquipoService.getTiposEquipo(),
      EquipoService.getEstadosEquipo()
    ]);

    selectTipo.innerHTML = '<option value="">Seleccione un tipo...</option>';
    selectEstado.innerHTML = '<option value="">Seleccione un estado...</option>';

    tipos.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.idTipoEquipo;
      opt.textContent = t.nombreTipo;
      selectTipo.appendChild(opt);
    });

    estados.forEach((e) => {
      const opt = document.createElement('option');
      opt.value = e.idEstadoEquipo;
      opt.textContent = e.nombreEstado;
      selectEstado.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
  }
}

function abrirModalNuevoEquipo(root) {
  equipoEditandoId = null;
  modalNuevoEquipo = root.querySelector('#modal-nuevo-equipo');
  formNuevoEquipo = root.querySelector('#form-nuevo-equipo');
  if (!modalNuevoEquipo || !formNuevoEquipo) return;

  const titulo = modalNuevoEquipo.querySelector('#modal-nuevo-equipo-titulo');
  if (titulo) titulo.textContent = 'Nuevo Equipo';

  formNuevoEquipo.reset();
  const errores = root.querySelectorAll('[id^="error-"]');
  errores.forEach((p) => { p.style.display = 'none'; });

  modalNuevoEquipo.style.display = 'flex';
  modalNuevoEquipo.setAttribute('aria-hidden', 'false');

  cargarTiposEstados(root);

  btnPesoNoAplicaActivo = false;
  btnUnidadNoAplicaActivo = false;
  const inputPeso = root.querySelector('#peso-maximo');
  const inputUnidad = root.querySelector('#unidad-peso');
  const btnPeso = root.querySelector('#btn-peso-no-aplica');
  const btnUnidad = root.querySelector('#btn-unidad-no-aplica');
  const campoOtraUnidad = root.querySelector('#campo-unidad-otra');
  const campoTipoOtro = root.querySelector('#campo-tipo-otro');

  if (inputPeso) { inputPeso.disabled = false; inputPeso.value = ''; }
  if (btnPeso) { btnPeso.classList.remove('bg-primary/10', 'text-primary', 'border-primary'); }
  if (inputUnidad) { inputUnidad.disabled = false; inputUnidad.value = ''; }
  if (btnUnidad) { btnUnidad.classList.remove('bg-primary/10', 'text-primary', 'border-primary'); }
  if (campoOtraUnidad) { campoOtraUnidad.style.display = 'none'; }
  if (campoTipoOtro) { campoTipoOtro.style.display = 'none'; }
}

async function abrirModalEdicion(root, equipo) {
  equipoEditandoId = equipo.idEquipo;
  modalNuevoEquipo = root.querySelector('#modal-nuevo-equipo');
  formNuevoEquipo = root.querySelector('#form-nuevo-equipo');
  if (!modalNuevoEquipo || !formNuevoEquipo) return;

  formNuevoEquipo.reset();
  await cargarTiposEstados(root);
  const errores = root.querySelectorAll('[id^="error-"]');
  errores.forEach((p) => { p.style.display = 'none'; });

  const titulo = modalNuevoEquipo.querySelector('#modal-nuevo-equipo-titulo');
  if (titulo) titulo.textContent = 'Editar Equipo';

  const selectTipo = root.querySelector('#tipo-equipo');
  const selectEstado = root.querySelector('#estado-equipo');
  const inputPeso = root.querySelector('#peso-maximo');
  const inputUnidad = root.querySelector('#unidad-peso');
  const btnPeso = root.querySelector('#btn-peso-no-aplica');
  const btnUnidad = root.querySelector('#btn-unidad-no-aplica');
  const campoOtraUnidad = root.querySelector('#campo-unidad-otra');
  const campoTipoOtro = root.querySelector('#campo-tipo-otro');

  // Precarga de campos
  const codigo = root.querySelector('#codigo-equipo');
  const nombre = root.querySelector('#nombre-equipo');
  const marca = root.querySelector('#marca-equipo');
  const modelo = root.querySelector('#modelo-equipo');
  const serial = root.querySelector('#serial-equipo');
  const ubicacion = root.querySelector('#ubicacion-equipo');
  const codigoQr = root.querySelector('#codigo-qr-equipo');
  const observaciones = root.querySelector('#observaciones-equipo');

  if (codigo) codigo.value = equipo.codigoEquipo ?? '';
  if (nombre) nombre.value = equipo.nombreEquipo ?? '';
  if (marca) marca.value = equipo.marca ?? '';
  if (modelo) modelo.value = equipo.modelo ?? '';
  if (serial) serial.value = equipo.serial ?? '';
  if (ubicacion) ubicacion.value = equipo.ubicacion ?? '';
  if (codigoQr) codigoQr.value = equipo.codigoQr ?? '';
  if (observaciones) observaciones.value = equipo.observacionesEquipo ?? '';

  // Peso
  const peso = equipo.pesoMaximo;
  const unidadPeso = equipo.unidadPeso;
  if (peso === null || peso === undefined || peso === '') {
    if (inputPeso) { inputPeso.value = ''; inputPeso.disabled = true; }
    if (btnPeso) { btnPeso.classList.add('bg-primary/10', 'text-primary', 'border-primary'); }
    btnPesoNoAplicaActivo = true;
  } else {
    if (inputPeso) { inputPeso.value = peso; inputPeso.disabled = false; }
    if (btnPeso) { btnPeso.classList.remove('bg-primary/10', 'text-primary', 'border-primary'); }
    btnPesoNoAplicaActivo = false;
  }

  // Unidad
  const UNIDADES_CATALOGO = ['kg', 'g', 'ton', 'lb'];
  if (unidadPeso === null || unidadPeso === undefined || unidadPeso === '') {
    if (inputUnidad) { inputUnidad.value = ''; inputUnidad.disabled = false; }
    if (btnUnidad) { btnUnidad.classList.remove('bg-primary/10', 'text-primary', 'border-primary'); }
    btnUnidadNoAplicaActivo = false;
    if (campoOtraUnidad) campoOtraUnidad.style.display = 'none';
  } else if (unidadPeso === 'No aplica') {
    if (inputUnidad) { inputUnidad.disabled = true; inputUnidad.value = ''; }
    if (btnUnidad) { btnUnidad.classList.add('bg-primary/10', 'text-primary', 'border-primary'); }
    btnUnidadNoAplicaActivo = true;
    if (campoOtraUnidad) campoOtraUnidad.style.display = 'none';
  } else if (UNIDADES_CATALOGO.includes(unidadPeso)) {
    if (inputUnidad) { inputUnidad.value = unidadPeso; inputUnidad.disabled = false; }
    if (btnUnidad) { btnUnidad.classList.remove('bg-primary/10', 'text-primary', 'border-primary'); }
    btnUnidadNoAplicaActivo = false;
    if (campoOtraUnidad) campoOtraUnidad.style.display = 'none';
  } else {
    // No es "No aplica" ni una unidad fija del catálogo → fue texto libre de "Otra"
    if (inputUnidad) { inputUnidad.value = 'Otra'; inputUnidad.disabled = false; }
    if (btnUnidad) { btnUnidad.classList.remove('bg-primary/10', 'text-primary', 'border-primary'); }
    btnUnidadNoAplicaActivo = false;
    if (campoOtraUnidad) {
      campoOtraUnidad.style.display = 'block';
      const inputOtra = root.querySelector('#unidad-otra-texto');
      if (inputOtra) inputOtra.value = unidadPeso;
    }
  }

  // Tipo
  if (selectTipo) {
    const tipoGuardado = equipo.tipoEquipo ?? '';
    const optTipo = Array.from(selectTipo.options).find(o => o.text.trim() === tipoGuardado);
    const campoTipoOtroEl = root.querySelector('#campo-tipo-otro');
    if (optTipo) {
      selectTipo.value = optTipo.value;
      if (campoTipoOtroEl) campoTipoOtroEl.style.display = 'none';
    } else if (tipoGuardado) {
      const optOtros = Array.from(selectTipo.options).find(o => o.text.trim() === 'Otros');
      selectTipo.value = optOtros ? optOtros.value : '';
      if (campoTipoOtroEl) {
        campoTipoOtroEl.style.display = 'block';
        const inputTipoOtro = root.querySelector('#tipo-otro-texto');
        if (inputTipoOtro) inputTipoOtro.value = tipoGuardado;
      }
    } else {
      selectTipo.value = '';
      if (campoTipoOtroEl) campoTipoOtroEl.style.display = 'none';
    }
  }

  // Estado
  if (selectEstado && equipo.idEstadoEquipo) {
    selectEstado.value = equipo.idEstadoEquipo;
  }

  modalNuevoEquipo.style.display = 'flex';
  modalNuevoEquipo.setAttribute('aria-hidden', 'false');
}

function cerrarModalNuevoEquipo(root) {
  if (modalNuevoEquipo) {
    modalNuevoEquipo.style.display = 'none';
    modalNuevoEquipo.setAttribute('aria-hidden', 'true');
  }
}

function obtenerDatosFormulario(root) {
  const idEmpresa = EmpresaContext.get()?.idEmpresa;
  const idUsuarioAdmin = EmpresaContext.get()?.idUsuarioAdmin;

  const codigoEquipo = root.querySelector('#codigo-equipo').value.trim();
  const nombreEquipo = root.querySelector('#nombre-equipo').value.trim();
  const selectTipo = root.querySelector('#tipo-equipo');
  const tipoEquipo = selectTipo.options[selectTipo.selectedIndex]?.text || '';
  const tipoEquipoFinal = tipoEquipo === 'Otros' ? (root.querySelector('#tipo-otro-texto')?.value.trim() || '') : tipoEquipo;
  const marca = root.querySelector('#marca-equipo').value.trim();
  const modelo = root.querySelector('#modelo-equipo').value.trim();
  const serial = root.querySelector('#serial-equipo').value.trim();
  const pesoMaximo = root.querySelector('#peso-maximo').value;
  const unidadPeso = root.querySelector('#unidad-peso').value;
  const unidadOtraTexto = root.querySelector('#unidad-otra-texto')?.value.trim() || '';
  const selectEstado = root.querySelector('#estado-equipo');
  const idEstadoEquipo = selectEstado.options[selectEstado.selectedIndex]?.value || '';
  const ubicacion = root.querySelector('#ubicacion-equipo').value.trim();
  const codigoQr = root.querySelector('#codigo-qr-equipo').value.trim();
  const observacionesEquipo = root.querySelector('#observaciones-equipo').value.trim();

  let unidadFinal;
  if (btnUnidadNoAplicaActivo) {
    unidadFinal = 'No aplica';
  } else if (unidadPeso === 'Otra') {
    unidadFinal = unidadOtraTexto || '';
  } else {
    unidadFinal = unidadPeso;
  }

  const pesoFinal = pesoMaximo && !btnPesoNoAplicaActivo ? parseFloat(pesoMaximo) : null;

  return {
    codigoEquipo,
    nombreEquipo,
    tipoEquipo: tipoEquipoFinal || undefined,
    marca,
    modelo,
    serial,
    pesoMaximo: pesoFinal,
    unidadPeso: unidadFinal,
    idEstadoEquipo: idEstadoEquipo ? Number(idEstadoEquipo) : undefined,
    ubicacion,
    codigoQr,
    observacionesEquipo,
    idEmpresa,
    idUsuarioRegistro: idUsuarioAdmin
  };
}

function validarFormulario(root) {
  let valido = true;

  const rootWrapper = root.querySelector('#form-nuevo-equipo');

  const inputNombre = root.querySelector('#nombre-equipo');
  const errorNombre = root.querySelector('#error-nombre-equipo');
  if (inputNombre && !inputNombre.value.trim()) {
    ValidadorHelper.mostrarErrorCampo(root, 'error-nombre-equipo', 'El nombre del equipo es obligatorio.', 'bloqueante');
    valido = false;
  } else {
    ValidadorHelper.limpiarErrorCampo(root, 'error-nombre-equipo');
  }

  const inputCodigo = root.querySelector('#codigo-equipo');
  const errorCodigo = root.querySelector('#error-codigo-equipo');
  if (!inputCodigo.value.trim()) {
    ValidadorHelper.mostrarErrorCampo(root, 'error-codigo-equipo', 'El código es obligatorio.', 'bloqueante');
    valido = false;
  } else {
    ValidadorHelper.limpiarErrorCampo(root, 'error-codigo-equipo');
  }

  const inputTipo = root.querySelector('#tipo-equipo');
  const errorTipo = root.querySelector('#error-tipo-equipo');
  if (!inputTipo.value) {
    ValidadorHelper.mostrarErrorCampo(root, 'error-tipo-equipo', 'Debe seleccionar un tipo de equipo.', 'bloqueante');
    valido = false;
  } else if ((inputTipo.options[inputTipo.selectedIndex]?.text || '').trim() === 'Otros') {
    const tipoOtroTexto = root.querySelector('#tipo-otro-texto')?.value.trim() || '';
    if (!tipoOtroTexto) {
      ValidadorHelper.mostrarErrorCampo(root, 'error-tipo-equipo', 'Debe especificar el tipo de equipo en el campo de texto.', 'bloqueante');
      valido = false;
    } else {
      ValidadorHelper.limpiarErrorCampo(root, 'error-tipo-equipo');
    }
  } else {
    ValidadorHelper.limpiarErrorCampo(root, 'error-tipo-equipo');
  }

  const inputEstado = root.querySelector('#estado-equipo');
  const errorEstado = root.querySelector('#error-estado-equipo');
  if (!inputEstado.value) {
    ValidadorHelper.mostrarErrorCampo(root, 'error-estado-equipo', 'Debe seleccionar un estado.', 'bloqueante');
    valido = false;
  } else {
    ValidadorHelper.limpiarErrorCampo(root, 'error-estado-equipo');
  }

  const inputPeso = root.querySelector('#peso-maximo');
  const inputUnidad = root.querySelector('#unidad-peso');
  const unidadOtraTexto = root.querySelector('#unidad-otra-texto')?.value.trim() || '';
  const errorUnidad = root.querySelector('#error-unidad-peso');
  if (inputPeso.value && btnUnidadNoAplicaActivo) {
    ValidadorHelper.mostrarErrorCampo(root, 'error-unidad-peso', 'Si especifica peso máximo, debe indicar una unidad válida.', 'bloqueante');
    valido = false;
  } else if (!btnUnidadNoAplicaActivo && !inputUnidad.value) {
    ValidadorHelper.mostrarErrorCampo(root, 'error-unidad-peso', 'Debe indicar una unidad o marcar "No aplica".', 'bloqueante');
    valido = false;
  } else if (inputUnidad.value === 'Otra' && !unidadOtraTexto) {
    ValidadorHelper.mostrarErrorCampo(root, 'error-unidad-peso', 'Debe especificar la unidad en el campo de texto.', 'bloqueante');
    valido = false;
  } else {
    ValidadorHelper.limpiarErrorCampo(root, 'error-unidad-peso');
  }

  return valido;
}

function setupModalListeners(root) {
  const btnPeso = root.querySelector('#btn-peso-no-aplica');
  const inputPeso = root.querySelector('#peso-maximo');
  if (btnPeso && inputPeso) {
    btnPeso.addEventListener('click', () => {
      btnPesoNoAplicaActivo = !btnPesoNoAplicaActivo;
      inputPeso.disabled = btnPesoNoAplicaActivo;
      if (btnPesoNoAplicaActivo) {
        inputPeso.value = '';
        btnPeso.classList.add('bg-primary/10', 'text-primary', 'border-primary');
      } else {
        btnPeso.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      }
    });

    inputPeso.addEventListener('input', () => {
      if (btnPesoNoAplicaActivo && inputPeso.value.trim() !== '') {
        btnPesoNoAplicaActivo = false;
        inputPeso.disabled = false;
        btnPeso.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      }
    });
  }

  const selectTipoEl = root.querySelector('#tipo-equipo');
  if (selectTipoEl) {
    selectTipoEl.addEventListener('change', () => {
      const campoTipoOtro = root.querySelector('#campo-tipo-otro');
      const textoTipoSeleccionado = selectTipoEl.options[selectTipoEl.selectedIndex]?.text || '';
      if (campoTipoOtro) {
        campoTipoOtro.style.display = textoTipoSeleccionado.trim() === 'Otros' ? 'block' : 'none';
        if (textoTipoSeleccionado.trim() === 'Otros') {
          const inputTipoOtro = root.querySelector('#tipo-otro-texto');
          if (inputTipoOtro) inputTipoOtro.focus();
        }
      }
    });
  }

  const btnUnidad = root.querySelector('#btn-unidad-no-aplica');
  const inputUnidad = root.querySelector('#unidad-peso');
  const campoOtraUnidad = root.querySelector('#campo-unidad-otra');
  if (btnUnidad && inputUnidad) {
    btnUnidad.addEventListener('click', () => {
      btnUnidadNoAplicaActivo = !btnUnidadNoAplicaActivo;
      inputUnidad.disabled = btnUnidadNoAplicaActivo;
      if (btnUnidadNoAplicaActivo) {
        inputUnidad.value = '';
        btnUnidad.classList.add('bg-primary/10', 'text-primary', 'border-primary');
        if (campoOtraUnidad) campoOtraUnidad.style.display = 'none';
      } else {
        btnUnidad.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      }
    });

    inputUnidad.addEventListener('change', () => {
      if (btnUnidadNoAplicaActivo) {
        btnUnidadNoAplicaActivo = false;
        inputUnidad.disabled = false;
        btnUnidad.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      }
      if (inputUnidad.value === 'Otra') {
        if (campoOtraUnidad) campoOtraUnidad.style.display = 'block';
        const inputOtra = root.querySelector('#unidad-otra-texto');
        if (inputOtra) inputOtra.focus();
      } else {
        if (campoOtraUnidad) campoOtraUnidad.style.display = 'none';
      }
    });
  }

  // Cerrar modal
  const btnCerrar = root.querySelector('#btn-cerrar-modal-nuevo-equipo');
  if (btnCerrar) {
    btnCerrar.addEventListener('click', () => { cerrarModalNuevoEquipo(root); });
  }

  const btnCancelar = root.querySelector('#btn-cancelar-modal-nuevo-equipo');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', () => { cerrarModalNuevoEquipo(root); });
  }

  // Guardar equipo (crear o actualizar)
  const btnGuardar = root.querySelector('#btn-guardar-nuevo-equipo');
  if (btnGuardar) {
    btnGuardar.addEventListener('click', async () => {
      if (btnGuardar.disabled) return;
      if (!validarFormulario(root)) return;

      const datos = obtenerDatosFormulario(root);
      const textoOriginal = btnGuardar.textContent;
      btnGuardar.disabled = true;
      btnGuardar.textContent = 'Guardando...';

      try {
        if (equipoEditandoId) {
          await EquipoService.actualizarEquipo(equipoEditandoId, datos);
          await mostrarAlerta({ titulo: 'Éxito', mensaje: 'Equipo actualizado correctamente.' });
        } else {
          await EquipoService.crearEquipo(datos);
          await mostrarAlerta({ titulo: 'Éxito', mensaje: 'Equipo registrado correctamente.' });
        }
        cerrarModalNuevoEquipo(root);
        const { idEmpresa } = EmpresaContext.get();
        await cargarEquipos(root, idEmpresa);
        limpiarFormulario(root);
      } catch (err) {
        await mostrarAlerta({ titulo: 'Error', mensaje: err.message });
      } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
      }
    });
  }
}

function limpiarFormulario(root) {
  if (formNuevoEquipo) {
    formNuevoEquipo.reset();
  }
  const errores = root.querySelectorAll('[id^="error-"]');
  errores.forEach((p) => { p.style.display = 'none'; });
}

async function initView(ctx) {
  const root = document.querySelector('[data-view="empresas-equipos"]') || document.getElementById('app-root');
  if (!root) return;
  const contexto = EmpresaContext.get();
  if (!contexto || !contexto.idEmpresa) {
    ctx.navigate('empresas');
    return;
  }
  const { idEmpresa, nombreEmpresa } = contexto;
  const breadcrumbNombre = root.querySelector('#breadcrumb-nombre-empresa');
  if (breadcrumbNombre) {
    breadcrumbNombre.textContent = nombreEmpresa ?? '';
  }

  await cargarEquipos(root, idEmpresa);
  bindViewNavigation(root, ctx);

  // Conectar botón "Nuevo Equipo"
  const btnNuevo = root.querySelector('#btn-nuevo-equipo');
  if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
      abrirModalNuevoEquipo(root);
    });
  }

  // Setup de listeners del modal
  setupModalListeners(root);

  // Listener de clic en tabla para editar, eliminar y toggle
  const tbody = root.querySelector('#tabla-equipos-body');
  if (tbody) {
    tbody.addEventListener('click', async (e) => {
      const btnEditar = e.target.closest('.btn-editar-equipo');
      if (btnEditar) {
        const id = btnEditar.dataset.id;
        const nombre = btnEditar.dataset.nombre;
        try {
          const equipo = await EquipoService.getEquipoDetalle(id);
          await abrirModalEdicion(root, equipo);
        } catch (err) {
          await mostrarAlerta({ titulo: 'Error', mensaje: err.message });
        }
        return;
      }

      const btnEliminar = e.target.closest('.btn-eliminar-equipo');
      if (btnEliminar) {
        const id = btnEliminar.dataset.id;
        const nombre = btnEliminar.dataset.nombre;
        const confirmar = await mostrarConfirmacion({
          titulo: 'Eliminar Equipo',
          mensaje: `¿Eliminar el equipo "${nombre}"? Esta acción no se puede deshacer desde aquí.`,
          textoConfirmar: 'Eliminar',
          textoCancelar: 'Cancelar',
          tipo: 'peligro'
        });
        if (confirmar) {
          try {
            await EquipoService.eliminarEquipo(id);
            await mostrarAlerta({ titulo: 'Éxito', mensaje: 'Equipo eliminado correctamente.' });
            await cargarEquipos(root, idEmpresa);
          } catch (err) {
            await mostrarAlerta({ titulo: 'Error', mensaje: err.message });
          }
        }
        return;
      }

      const btnToggle = e.target.closest('.btn-toggle-equipo');
      if (btnToggle) {
        const id = btnToggle.dataset.id;
        const nombre = btnToggle.dataset.nombre;
        const action = btnToggle.dataset.action;
        const esActivar = action === 'activar';
        const mensajeConfirm = esActivar
          ? `¿Activar el equipo "${nombre}"?`
          : `¿Desactivar el equipo "${nombre}"?`;
        const confirmar = await mostrarConfirmacion({
          titulo: esActivar ? 'Activar Equipo' : 'Desactivar Equipo',
          mensaje: mensajeConfirm,
          textoConfirmar: esActivar ? 'Activar' : 'Desactivar',
          textoCancelar: 'Cancelar',
          tipo: 'default'
        });
        if (confirmar) {
          try {
            await EquipoService.cambiarEstadoEquipo(id, esActivar);
            await mostrarAlerta({
              titulo: 'Éxito',
              mensaje: esActivar
                ? 'Equipo activado correctamente.'
                : 'Equipo desactivado correctamente.'
            });
            await cargarEquipos(root, idEmpresa);
          } catch (err) {
            await mostrarAlerta({ titulo: 'Error', mensaje: err.message });
          }
        }
        return;
      }
    });
  }
}

window.initView = initView;
})();
