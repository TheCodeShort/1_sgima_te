const State = {
  ordenes: [],
  currentFilter: null, // null, 'mantenimiento', 'falla', 'operativo'
  
  load() {
    const data = localStorage.getItem('sigma_tecnico_ordenes');
    if (data) {
      try {
        this.ordenes = JSON.parse(data);
      } catch (e) {
        this.ordenes = this.getInitialMock();
      }
    } else {
      this.ordenes = this.getInitialMock();
      this.save();
    }
  },

  save() {
    localStorage.setItem('sigma_tecnico_ordenes', JSON.stringify(this.ordenes));
  },

  getInitialMock() {
    return [
      {
        id: 'OT-2045',
        equipoId: 'EQ-2045',
        equipoNombre: 'Bomba Centrífuga Principal',
        tipo: 'Correctivo',
        prioridad: 'Crítica',
        prioridadClase: 'error',
        estado: 'Pendiente', // Pendiente, En Proceso, Completado
        estadoClase: 'error',
        tiempo: 'Hace 15 min',
        fechaReporte: 'Hoy · 09:15',
        reportadoPor: 'Carlos Mendoza (Operario)',
        descripcion: 'Pérdida de presión en el circuito de refrigeración principal. Ruido inusual detectado en el acoplamiento del motor.',
        tecnicoAsignado: 'Sin Asignar',
        notasCierre: '',
        tipoCierre: '',
        fechaCierre: ''
      },
      {
        id: 'OT-8812',
        equipoId: 'TR-8812',
        equipoNombre: 'Transportadora Línea A',
        tipo: 'Preventivo',
        prioridad: 'Media',
        prioridadClase: 'warning',
        estado: 'En Proceso',
        estadoClase: 'warning',
        tiempo: 'Hace 2 horas',
        fechaReporte: 'Hoy · 07:30',
        reportadoPor: 'Sistema (Programado)',
        descripcion: 'Mantenimiento preventivo quincenal: Lubricación de cadenas de transmisión, ajuste de alineación de banda y limpieza de sensores ópticos.',
        tecnicoAsignado: 'Técnico Demo',
        notasCierre: '',
        tipoCierre: '',
        fechaCierre: ''
      },
      {
        id: 'OT-1090',
        equipoId: 'CL-1090',
        equipoNombre: 'Caldera Auxiliar Norte',
        tipo: 'Predictivo',
        prioridad: 'Baja',
        prioridadClase: 'success',
        estado: 'Completado',
        estadoClase: 'success',
        tiempo: 'Ayer, 14:30',
        fechaReporte: 'Ayer · 14:30',
        reportadoPor: 'Sistema (Termografía)',
        descripcion: 'Análisis de termografía infrarroja indica temperatura ligeramente elevada en la válvula de purga secundaria. Inspección visual recomendada.',
        tecnicoAsignado: 'Pedro Gomez',
        notasCierre: 'Inspección termográfica realizada. Se limpiaron depósitos minerales y se calibró el transductor de presión auxiliar.',
        tipoCierre: 'Exitoso',
        fechaCierre: 'Ayer · 15:45'
      },
      {
        id: 'OT-5002',
        equipoId: 'CP-5002',
        equipoNombre: 'Compresor de Aire #2',
        tipo: 'Preventivo',
        prioridad: 'Alta',
        prioridadClase: 'warning',
        estado: 'Pendiente',
        estadoClase: 'sync-pending',
        tiempo: 'Ayer, 09:15',
        fechaReporte: 'Ayer · 09:15',
        reportadoPor: 'Supervisor Planta',
        descripcion: 'Cambio de filtros de admisión y drenaje de condensados automático según el plan de mantenimiento de 500 horas de operación.',
        tecnicoAsignado: 'Técnico Demo',
        notasCierre: '',
        tipoCierre: '',
        fechaCierre: ''
      },
      {
        id: 'OT-3011',
        equipoId: 'TX-200',
        equipoNombre: 'Motor Principal TX-200',
        tipo: 'Preventivo',
        prioridad: 'Media',
        prioridadClase: 'warning',
        estado: 'Pendiente',
        estadoClase: 'warning',
        tiempo: 'Ayer, 17:00',
        fechaReporte: 'Ayer · 17:00',
        reportadoPor: 'Juan Lopez (Operario)',
        descripcion: 'Revisión y torqueo de pernos de base para mitigar microvibraciones detectadas durante el cambio de turno.',
        tecnicoAsignado: 'Sin Asignar',
        notasCierre: '',
        tipoCierre: '',
        fechaCierre: ''
      }
    ];
  }
};

let activeModal = null;
let lastFocusedElement = null;

function initView(ctx) {
  const root = document.querySelector('[data-view="panel-tecnico"]') || document.getElementById('app-root');
  if (!root) return;

  // Reconocer al usuario simulado
  const saludo = root.querySelector('#tecnico-saludo');
  const nombre = AppState.displayName || AppState.user || 'Técnico de Mantenimiento';
  if (saludo) {
    saludo.textContent = `Hola, ${nombre}`;
  }

  // Cargar estado local
  State.load();

  // Renderizar
  renderStats(root);
  renderOrdenes(root, ctx);

  // Filtros interactivos con las tarjetas Bento
  const cardMantenimientos = root.querySelector('#card-mantenimientos');
  const cardFallas = root.querySelector('#card-fallas');
  const cardEstadoPlanta = root.querySelector('#card-estado-planta');
  const btnClearFilter = root.querySelector('#btn-clear-filter');
  const buscador = root.querySelector('#buscador-ordenes');

  const aplicarFiltro = (filtro, cardActive) => {
    State.currentFilter = State.currentFilter === filtro ? null : filtro;
    
    // UI active-filter class toggle
    [cardMantenimientos, cardFallas, cardEstadoPlanta].forEach(c => c?.classList.remove('active-filter'));
    
    if (State.currentFilter) {
      cardActive?.classList.add('active-filter');
    }
    
    syncClearFilterButton();
    renderOrdenes(root, ctx);
  };

  const syncClearFilterButton = () => {
    const query = buscador?.value.trim() || '';
    if (State.currentFilter || query) {
      btnClearFilter?.classList.remove('hidden');
    } else {
      btnClearFilter?.classList.add('hidden');
    }
  };

  cardMantenimientos?.addEventListener('click', () => aplicarFiltro('mantenimiento', cardMantenimientos));
  cardFallas?.addEventListener('click', () => aplicarFiltro('falla', cardFallas));
  cardEstadoPlanta?.addEventListener('click', () => aplicarFiltro('operativo', cardEstadoPlanta));
  
  buscador?.addEventListener('input', () => {
    syncClearFilterButton();
    renderOrdenes(root, ctx);
  });

  btnClearFilter?.addEventListener('click', () => {
    State.currentFilter = null;
    if (buscador) buscador.value = '';
    [cardMantenimientos, cardFallas, cardEstadoPlanta].forEach(c => c?.classList.remove('active-filter'));
    btnClearFilter?.classList.add('hidden');
    renderOrdenes(root, ctx);
  });

  // Botón Asignar Tarea (Abre modal)
  const btnAsignar = root.querySelector('#btn-asignar-tarea');
  const modalAsignar = root.querySelector('#tecnico-modal-asignar');
  btnAsignar?.addEventListener('click', () => {
    abrirModal(modalAsignar, btnAsignar);
  });

  // Configuración de Cierre de Modales genéricos
  root.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => {
      const modal = el.closest('.tecnico-modal');
      if (modal) cerrarModal(modal);
    });
  });

  // Submit del Formulario de Asignación de Tarea
  const formAssign = root.querySelector('#form-asignar-tarea');
  formAssign?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const equipoVal = root.querySelector('#form-equipo').value;
    const tipo = root.querySelector('#form-tipo').value;
    const prioridad = root.querySelector('#form-prioridad').value;
    const tecnico = root.querySelector('#form-tecnico').value;
    const descripcion = root.querySelector('#form-descripcion').value;
    
    if (!equipoVal) return;
    const [equipoId, equipoNombre] = equipoVal.split('|');
    
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const otId = `OT-${randomId}`;
    
    const now = new Date();
    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');
    
    const newOrder = {
      id: otId,
      equipoId,
      equipoNombre,
      tipo,
      prioridad,
      prioridadClase: prioridad === 'Crítica' ? 'error' : (prioridad === 'Alta' ? 'warning' : (prioridad === 'Media' ? 'sync-pending' : 'success')),
      estado: 'Pendiente',
      estadoClase: 'error',
      tiempo: 'Hace 1 min',
      fechaReporte: `Hoy · ${horas}:${minutos}`,
      reportadoPor: `${AppState.displayName || AppState.user || 'Técnico'} (Creado)`,
      tecnicoAsignado: tecnico,
      notasCierre: '',
      tipoCierre: '',
      fechaCierre: ''
    };
    
    State.ordenes.unshift(newOrder);
    State.save();
    
    cerrarModal(modalAsignar);
    showToast(`Orden ${otId} asignada con éxito.`, 'success');
    
    renderStats(root);
    renderOrdenes(root, ctx);
    formAssign.reset();
  });

  // Submit del Formulario de Cierre de Trabajo
  const formCierre = root.querySelector('#form-reportar-cierre');
  formCierre?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = root.querySelector('#cierre-target-id').value;
    const tipoCierre = root.querySelector('#cierre-tipo').value;
    const notas = root.querySelector('#cierre-notas').value;
    
    const order = State.ordenes.find(o => o.id === id);
    if (order) {
      const now = new Date();
      const horas = String(now.getHours()).padStart(2, '0');
      const minutos = String(now.getMinutes()).padStart(2, '0');
      
      order.estado = 'Completado';
      order.estadoClase = 'success';
      order.tipoCierre = tipoCierre;
      order.notasCierre = notas;
      order.fechaCierre = `Hoy · ${horas}:${minutos}`;
      
      State.save();
      
      cerrarModal(root.querySelector('#tecnico-modal-cierre'));
      showToast(`Orden ${id} cerrada como "${tipoCierre}" exitosamente.`, 'success');
      
      renderStats(root);
      renderOrdenes(root, ctx);
      formCierre.reset();
    }
  });

  // Actualizar label de file input en modal de cierre
  const fileInput = root.querySelector('#cierre-evidencia');
  fileInput?.addEventListener('change', (e) => {
    const label = root.querySelector('#evidencia-label');
    if (label && e.target.files && e.target.files[0]) {
      label.textContent = `Listo: ${e.target.files[0].name}`;
    }
  });

  // Sincronización simulada interactiva
  const btnSyncQuick = root.querySelector('#btn-sync-quick');
  const btnHeaderSync = root.querySelector('#btn-header-sync');
  
  const triggerSync = () => {
    iniciarSincronizacion(root);
  };
  
  btnSyncQuick?.addEventListener('click', triggerSync);
  btnHeaderSync?.addEventListener('click', triggerSync);

  // Registrar accesibilidad por teclado en tarjetas interactivas
  root.querySelectorAll('.tecnico-stat-card').forEach((el) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  // Integrar navegación de app shell
  bindViewNavigation(root, ctx);
}

function renderStats(root) {
  const mCount = root.querySelector('#stat-count-mantenimientos');
  const fCount = root.querySelector('#stat-count-fallas');
  
  if (mCount) {
    mCount.textContent = String(State.ordenes.filter(o => o.estado !== 'Completado').length);
  }
  if (fCount) {
    fCount.textContent = String(State.ordenes.filter(o => o.estado === 'Pendiente' && o.prioridad === 'Crítica').length);
  }
}

function renderOrdenes(root, ctx) {
  const tbody = root.querySelector('#tecnico-ordenes-lista');
  const filtroInfo = root.querySelector('#filtro-info');
  if (!tbody) return;

  const query = root.querySelector('#buscador-ordenes')?.value.toLowerCase().trim() || '';
  
  let filtered = State.ordenes;
  
  if (State.currentFilter === 'mantenimiento') {
    filtered = State.ordenes.filter(o => o.estado !== 'Completado');
  } else if (State.currentFilter === 'falla') {
    filtered = State.ordenes.filter(o => o.estado === 'Pendiente' && o.tipo === 'Correctivo');
  } else if (State.currentFilter === 'operativo') {
    filtered = State.ordenes.filter(o => o.estado === 'Completado');
  }

  if (query) {
    filtered = filtered.filter(o => 
      o.id.toLowerCase().includes(query) || 
      o.equipoNombre.toLowerCase().includes(query) || 
      o.equipoId.toLowerCase().includes(query) ||
      o.tecnicoAsignado.toLowerCase().includes(query)
    );
  }

  if (filtroInfo) {
    let desc = 'Mostrando todas las órdenes registradas en el sistema.';
    if (State.currentFilter === 'mantenimiento') desc = 'Mostrando órdenes de trabajo pendientes e iniciadas hoy.';
    if (State.currentFilter === 'falla') desc = 'Mostrando fallas correctivas críticas sin resolver.';
    if (State.currentFilter === 'operativo') desc = 'Mostrando órdenes de trabajo completadas y cerradas.';
    
    if (query) {
      desc += ` (Filtrado por "${query}")`;
    }
    filtroInfo.textContent = desc;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-4 py-8 text-center text-on-surface-variant text-body-md">
          <span class="material-symbols-outlined text-4xl block mb-2 text-on-surface-variant/40">search_off</span>
          No se encontraron órdenes de trabajo para este filtro.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(o => {
    let actionButtons = '';
    
    if (o.estado === 'Pendiente') {
      if (o.tecnicoAsignado === 'Sin Asignar') {
        actionButtons += `
          <button class="text-primary hover:text-primary-fixed p-1 rounded hover:bg-surface-container-highest transition-colors" title="Asignarse Orden" data-action-assign="${o.id}">
            <span class="material-symbols-outlined text-[18px]">person_add</span>
          </button>
        `;
      } else {
        actionButtons += `
          <button class="text-primary hover:text-primary-fixed p-1 rounded hover:bg-surface-container-highest transition-colors" title="Iniciar Mantenimiento" data-action-start="${o.id}">
            <span class="material-symbols-outlined text-[18px]">play_arrow</span>
          </button>
        `;
      }
    } else if (o.estado === 'En Proceso') {
      actionButtons += `
        <button class="text-success hover:text-success/80 p-1 rounded hover:bg-surface-container-highest transition-colors" title="Reportar Cierre" data-action-close="${o.id}">
          <span class="material-symbols-outlined text-[18px]">task_alt</span>
        </button>
      `;
    }

    actionButtons += `
      <button class="text-primary hover:text-primary-fixed p-1 rounded hover:bg-surface-container-highest transition-colors" title="Ver Detalle" data-action-detail="${o.id}">
        <span class="material-symbols-outlined text-[18px]">visibility</span>
      </button>
    `;

    return `
      <tr class="tecnico-orden-fila h-row-height-dense border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
        <td class="px-4 py-1.5">
          <div class="font-semibold text-body-md">${o.id}</div>
          <div class="text-status-micro font-mono text-primary-fixed-dim mt-0.5">${o.equipoId}</div>
        </td>
        <td class="px-4 py-1.5">
          <div class="text-body-sm font-semibold">${o.equipoNombre}</div>
          <div class="mt-1">${getPriorityBadge(o.prioridad)}</div>
        </td>
        <td class="px-4 py-1.5 text-body-sm text-on-surface-variant font-medium">
          ${o.tecnicoAsignado}
        </td>
        <td class="px-4 py-1.5">
          ${getStatusBadge(o.estado)}
        </td>
        <td class="px-4 py-1.5 text-right">
          <div class="flex items-center justify-end gap-1.5">
            ${actionButtons}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Vincular eventos a los botones generados dinámicamente
  tbody.querySelectorAll('[data-action-assign]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-action-assign');
      const order = State.ordenes.find(o => o.id === id);
      if (order) {
        order.tecnicoAsignado = 'Técnico Demo';
        State.save();
        showToast(`Te has asignado la orden ${id} con éxito.`, 'success');
        renderStats(root);
        renderOrdenes(root, ctx);
      }
    });
  });

  tbody.querySelectorAll('[data-action-start]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-action-start');
      const order = State.ordenes.find(o => o.id === id);
      if (order) {
        order.estado = 'En Proceso';
        order.estadoClase = 'warning';
        State.save();
        showToast(`Mantenimiento para la orden ${id} iniciado.`, 'success');
        renderStats(root);
        renderOrdenes(root, ctx);
      }
    });
  });

  tbody.querySelectorAll('[data-action-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-action-close');
      const modal = root.querySelector('#tecnico-modal-cierre');
      modal.querySelector('#cierre-ot-id').textContent = id;
      modal.querySelector('#cierre-target-id').value = id;
      modal.querySelector('#cierre-notas').value = '';
      modal.querySelector('#cierre-repuestos').value = '';
      modal.querySelector('#evidencia-label').textContent = 'Seleccione una imagen de su dispositivo';
      abrirModal(modal, btn);
    });
  });

  tbody.querySelectorAll('[data-action-detail]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-action-detail');
      abrirDetalleOrden(id, root, ctx);
    });
  });

  // También se puede hacer clic en la fila entera para abrir detalles
  tbody.querySelectorAll('.tecnico-orden-fila').forEach(row => {
    row.addEventListener('click', (e) => {
      // Evitar abrir detalle si se hizo clic en un botón de acción
      if (e.target.closest('button')) return;
      const detailBtn = row.querySelector('[data-action-detail]');
      if (detailBtn) detailBtn.click();
    });
    // Accesibilidad por teclado en la fila
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
      }
    });
  });
}

function abrirDetalleOrden(id, root, ctx) {
  const order = State.ordenes.find(o => o.id === id);
  if (!order) return;

  const modal = root.querySelector('#tecnico-modal-detalle');
  modal.querySelector('#detalle-ot-id').textContent = order.id;
  modal.querySelector('#detalle-equipo-nombre').textContent = order.equipoNombre;
  modal.querySelector('#detalle-equipo-id').textContent = order.equipoId;
  modal.querySelector('#detalle-tipo').textContent = order.tipo;
  
  // Prioridad
  const pBadge = modal.querySelector('#detalle-prioridad');
  pBadge.textContent = order.prioridad;
  pBadge.className = 'inline-block mt-0.5 text-status-micro font-status-micro uppercase px-2 py-0.5 rounded ' + getPriorityClass(order.prioridad);
  
  // Estado
  const sBadge = modal.querySelector('#detalle-estado');
  sBadge.textContent = order.estado;
  sBadge.className = 'inline-block mt-0.5 text-status-micro font-status-micro uppercase px-2 py-0.5 rounded ' + getStatusClass(order.estado);
  
  modal.querySelector('#detalle-reportado').textContent = `${order.reportadoPor} · ${order.fechaReporte || order.tiempo}`;
  modal.querySelector('#detalle-tecnico').textContent = order.tecnicoAsignado;
  modal.querySelector('#detalle-descripcion').textContent = order.descripcion;
  
  // Detalle del Cierre (Solo visible si completada)
  const closureSec = modal.querySelector('#detalle-cierre-seccion');
  if (order.estado === 'Completado') {
    closureSec.classList.remove('hidden');
    modal.querySelector('#detalle-cierre-tipo').textContent = order.tipoCierre || 'Exitoso';
    modal.querySelector('#detalle-cierre-fecha').textContent = order.fechaCierre || '';
    modal.querySelector('#detalle-cierre-notas').textContent = order.notasCierre || 'Sin notas.';
  } else {
    closureSec.classList.add('hidden');
  }

  // Footer Actions
  const footer = modal.querySelector('#detalle-acciones-footer');
  let footerHTML = `<button class="tecnico-quick-btn" data-close-modal type="button">Cerrar</button>`;
  
  if (order.estado === 'Pendiente') {
    if (order.tecnicoAsignado === 'Sin Asignar') {
      footerHTML += `<button class="tecnico-quick-btn tecnico-quick-btn--primary" id="btn-modal-assign" type="button">Asignarse Trabajo</button>`;
    } else {
      footerHTML += `<button class="tecnico-quick-btn tecnico-quick-btn--primary" id="btn-modal-start" type="button">Iniciar Mantenimiento</button>`;
    }
  } else if (order.estado === 'En Proceso') {
    footerHTML += `<button class="tecnico-quick-btn tecnico-quick-btn--primary bg-success border-success hover:bg-success/80 hover:border-success/80" id="btn-modal-close-trigger" type="button">Reportar Cierre</button>`;
  }
  footer.innerHTML = footerHTML;

  // Re-enlazar cierre
  footer.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => cerrarModal(modal));
  });
  
  const mAssign = footer.querySelector('#btn-modal-assign');
  if (mAssign) {
    mAssign.addEventListener('click', () => {
      cerrarModal(modal);
      order.tecnicoAsignado = 'Técnico Demo';
      State.save();
      showToast(`Te has asignado la orden ${order.id} con éxito.`, 'success');
      renderStats(root);
      renderOrdenes(root, ctx);
    });
  }

  const mStart = footer.querySelector('#btn-modal-start');
  if (mStart) {
    mStart.addEventListener('click', () => {
      cerrarModal(modal);
      order.estado = 'En Proceso';
      order.estadoClase = 'warning';
      State.save();
      showToast(`Mantenimiento para la orden ${order.id} iniciado.`, 'success');
      renderStats(root);
      renderOrdenes(root, ctx);
    });
  }

  const mCloseTrig = footer.querySelector('#btn-modal-close-trigger');
  if (mCloseTrig) {
    mCloseTrig.addEventListener('click', () => {
      cerrarModal(modal);
      setTimeout(() => {
        const cModal = root.querySelector('#tecnico-modal-cierre');
        cModal.querySelector('#cierre-ot-id').textContent = order.id;
        cModal.querySelector('#cierre-target-id').value = order.id;
        cModal.querySelector('#cierre-notas').value = '';
        cModal.querySelector('#cierre-repuestos').value = '';
        cModal.querySelector('#evidencia-label').textContent = 'Seleccione una imagen de su dispositivo';
        abrirModal(cModal, root.querySelector(`[data-action-detail="${order.id}"]`));
      }, 150);
    });
  }

  abrirModal(modal, root.querySelector(`[data-action-detail="${order.id}"]`));
}

function getPriorityBadge(priority) {
  const cls = getPriorityClass(priority);
  return `<span class="inline-flex items-center gap-1 text-status-micro font-status-micro uppercase px-2 py-0.5 rounded ${cls}">${priority}</span>`;
}

function getStatusBadge(status) {
  const cls = getStatusClass(status);
  return `<span class="inline-flex items-center gap-1 text-status-micro font-status-micro uppercase px-2 py-0.5 rounded ${cls}">${status}</span>`;
}

function getPriorityClass(priority) {
  const classes = {
    'Crítica': 'text-error bg-error/10 border border-error/25',
    'Alta': 'text-warning bg-warning/10 border border-warning/25',
    'Media': 'text-sync-pending bg-sync-pending/10 border border-sync-pending/25',
    'Baja': 'text-success bg-success/10 border border-success/25',
  };
  return classes[priority] || 'text-on-surface-variant bg-surface-container';
}

function getStatusClass(status) {
  const classes = {
    'Pendiente': 'text-error bg-error/10 border border-error/20',
    'En Proceso': 'text-primary bg-primary/10 border border-primary/20',
    'Completado': 'text-success bg-success/10 border border-success/20',
  };
  return classes[status] || 'text-on-surface-variant bg-surface-container';
}

function abrirModal(modal, triggerEl) {
  if (!modal) return;
  lastFocusedElement = triggerEl || document.activeElement;
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('tecnico-modal-open');
  activeModal = modal;
  
  // Agregar keydown para escapar
  document.addEventListener('keydown', onEscape);
  
  const closeBtn = modal.querySelector('.tecnico-modal__close');
  if (closeBtn) closeBtn.focus();
}

function cerrarModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('tecnico-modal-open');
  if (activeModal === modal) {
    activeModal = null;
    document.removeEventListener('keydown', onEscape);
  }
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function onEscape(e) {
  if (e.key === 'Escape' && activeModal) {
    cerrarModal(activeModal);
  }
}

function iniciarSincronizacion(root) {
  showToast('Iniciando sincronización con el servidor central...', 'info', 2000);
  
  const badges = root.querySelectorAll('.tecnico-sync-badge, #btn-header-sync');
  badges.forEach(b => {
    const text = b.querySelector('.text-on-surface-variant');
    const icon = b.querySelector('.material-symbols-outlined');
    if (text) text.textContent = 'Sincronizando...';
    if (icon) {
      icon.textContent = 'autorenew';
      icon.classList.add('animate-spin');
      icon.className = icon.className.replace('text-success', 'text-warning');
    }
  });

  setTimeout(() => {
    badges.forEach(b => {
      const text = b.querySelector('.text-on-surface-variant');
      const icon = b.querySelector('.material-symbols-outlined');
      if (text) text.textContent = 'Sincronizado';
      if (icon) {
        icon.textContent = 'check_circle';
        icon.classList.remove('animate-spin');
        icon.className = icon.className.replace('text-warning', 'text-success');
      }
    });
    showToast('Sincronización completada. Datos actualizados.', 'success', 2500);
  }, 2000);
}

window.initView = initView;