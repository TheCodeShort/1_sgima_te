const OPERARIO_MOCK = {
  turno: 'Mañana',
  stats: {
    operativos: 12,
    alertas: 2,
  },
  actividades: [
    {
      id: 'act-1',
      titulo: 'Inspección rutinaria completada',
      subtitulo: 'Motor principal TX-200',
      tiempo: 'Hace 15 min',
      estado: 'Completado',
      estadoClase: 'success',
      icono: 'assignment',
      iconoClase: 'neutral',
      destino: 'detalle-equipo',
      mensaje: 'Abriendo detalle del equipo TX-200…',
    },
    {
      id: 'act-2',
      titulo: 'Falla de presión detectada',
      subtitulo: 'Válvula B-14',
      tiempo: 'Hace 1 hora',
      estado: 'Abierto',
      estadoClase: 'error',
      icono: 'warning',
      iconoClase: 'error',
      destino: 'registrar-falla',
      mensaje: 'Continúe el reporte de falla para la válvula B-14…',
    },
    {
      id: 'act-3',
      titulo: 'Sincronización de datos exitosa',
      subtitulo: 'Servidor central',
      tiempo: 'Hace 2 horas',
      estado: 'Sistema',
      estadoClase: 'muted',
      icono: 'sync',
      iconoClase: 'neutral',
      destino: 'estado-sincronizacion',
      mensaje: 'Consultando estado de sincronización…',
    },
  ],
  historialExtra: [
    {
      titulo: 'Lubricación de rodamientos',
      subtitulo: 'Transportador C-09',
      tiempo: 'Hace 4 horas',
      estado: 'Completado',
      estadoClase: 'success',
    },
    {
      titulo: 'Checklist de seguridad',
      subtitulo: 'Área de empaque',
      tiempo: 'Hace 5 horas',
      estado: 'Completado',
      estadoClase: 'success',
    },
    {
      titulo: 'Aviso de temperatura elevada',
      subtitulo: 'Compresor A-02',
      tiempo: 'Ayer · 16:40',
      estado: 'Cerrado',
      estadoClase: 'muted',
    },
  ],
};

function initView(ctx) {
  const root = document.querySelector('[data-view="panel-operario"]') || document.getElementById('app-root');
  if (!root) return;

  renderEncabezado(root);
  renderEstadisticas(root);
  renderActividades(root, ctx);
  configurarHistorial(root, ctx);
  configurarTarjetas(root, ctx);
  configurarTeclado(root);

  bindViewNavigation(root, ctx);
}

function renderEncabezado(root) {
  const saludo = root.querySelector('#operario-saludo');
  const turno = root.querySelector('#operario-turno');
  const nombre = AppState.displayName || AppState.user || 'Operario';

  if (saludo) {
    saludo.textContent = `Hola, ${nombre}`;
  }
  if (turno) {
    turno.textContent = `Turno: ${OPERARIO_MOCK.turno}`;
  }
}

function renderEstadisticas(root) {
  const operativos = root.querySelector('#stat-count-operativos');
  const alertas = root.querySelector('#stat-count-alertas');

  if (operativos) operativos.textContent = String(OPERARIO_MOCK.stats.operativos);
  if (alertas) alertas.textContent = String(OPERARIO_MOCK.stats.alertas);
}

function renderActividades(root, ctx) {
  const lista = root.querySelector('#operario-actividad-lista');
  if (!lista) return;

  lista.innerHTML = OPERARIO_MOCK.actividades
    .map((item) => crearFilaActividad(item))
    .join('');

  lista.querySelectorAll('[data-actividad-id]').forEach((fila) => {
    fila.addEventListener('click', () => {
      const actividad = OPERARIO_MOCK.actividades.find(
        (a) => a.id === fila.getAttribute('data-actividad-id')
      );
      if (!actividad) return;
      showToast(actividad.mensaje, 'info', 2500);
      ctx.navigate(actividad.destino);
    });
  });
}

function crearFilaActividad(item) {
  const iconoWrap =
    item.iconoClase === 'error'
      ? 'w-8 h-8 rounded bg-error/10 border border-error/30 flex items-center justify-center text-error shrink-0'
      : 'w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface-variant shrink-0';

  const estadoColor =
    item.estadoClase === 'success'
      ? 'text-success'
      : item.estadoClase === 'error'
        ? 'text-error'
        : 'text-on-surface-variant';

  return `
    <button type="button" class="operario-actividad-fila" data-actividad-id="${item.id}" aria-label="${item.titulo} — ${item.subtitulo}">
      <div class="${iconoWrap}">
        <span class="material-symbols-outlined text-sm">${item.icono}</span>
      </div>
      <div class="flex-1 min-w-0 text-left">
        <p class="text-data-table font-data-table text-on-surface truncate">${item.titulo}</p>
        <p class="text-status-micro font-status-micro text-on-surface-variant mt-0.5">${item.subtitulo}</p>
      </div>
      <div class="text-right shrink-0">
        <p class="text-status-micro font-status-micro text-on-surface-variant">${item.tiempo}</p>
        <span class="${estadoColor} text-status-micro font-status-micro uppercase mt-0.5 inline-block">${item.estado}</span>
      </div>
      <span class="material-symbols-outlined text-on-surface-variant operario-actividad-fila__chevron">chevron_right</span>
    </button>
  `;
}

function configurarHistorial(root, ctx) {
  const modal = root.querySelector('#operario-modal-historial');
  const lista = root.querySelector('#operario-historial-lista');
  const btnAbrir = root.querySelector('#btn-ver-historial');

  if (lista) {
    const todas = [...OPERARIO_MOCK.actividades, ...OPERARIO_MOCK.historialExtra];
    lista.innerHTML = todas
      .map(
        (item) => `
          <div class="operario-historial-item">
            <div>
              <p class="text-data-table font-data-table text-on-surface">${item.titulo}</p>
              <p class="text-status-micro font-status-micro text-on-surface-variant">${item.subtitulo}</p>
            </div>
            <div class="text-right">
              <p class="text-status-micro font-status-micro text-on-surface-variant">${item.tiempo}</p>
              <span class="text-status-micro font-status-micro uppercase ${
                item.estadoClase === 'success'
                  ? 'text-success'
                  : item.estadoClase === 'error'
                    ? 'text-error'
                    : 'text-on-surface-variant'
              }">${item.estado}</span>
            </div>
          </div>
        `
      )
      .join('');
  }

  const abrirModal = () => {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('operario-modal-open');
    document.addEventListener('keydown', onEscape);
    modal.querySelector('.operario-modal__close')?.focus();
  };

  const cerrarModal = () => {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('operario-modal-open');
    document.removeEventListener('keydown', onEscape);
    btnAbrir?.focus();
  };

  function onEscape(e) {
    if (e.key === 'Escape') cerrarModal();
  }

  btnAbrir?.addEventListener('click', abrirModal);

  modal?.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', cerrarModal);
  });

  modal?.querySelector('#btn-historial-sync')?.addEventListener('click', () => {
    cerrarModal();
    showToast('Abriendo estado de sincronización…', 'info', 2500);
    ctx.navigate('estado-sincronizacion');
  });
}

function configurarTarjetas(root, ctx) {
  root.querySelector('#stat-equipos-linea')?.addEventListener('click', () => {
    showToast('Mostrando equipos en línea de producción…', 'info', 2500);
    ctx.navigate('equipos');
  });

  root.querySelector('#stat-atencion')?.addEventListener('click', () => {
    showToast('Abriendo registro de mantenimiento preventivo…', 'warning', 2500);
    ctx.navigate('registrar-mantenimiento');
  });
}

function configurarTeclado(root) {
  root.querySelectorAll('[role="button"][tabindex="0"], .operario-cta-card').forEach((el) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });
}

window.initView = initView;
