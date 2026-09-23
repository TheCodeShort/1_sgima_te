function pintarTablaEquipos(root, equipos) {
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

    rowsHtml += `
      <tr class="h-row-height-dense hover:bg-surface-container-highest transition-colors group">
        <td class="px-4 py-2">
          <span class="text-data-table font-data-table font-bold text-on-surface font-mono">${codigo}</span>
        </td>
        <td class="px-4 py-2 text-data-table font-data-table text-on-surface">${nombre}</td>
        <td class="px-4 py-2 text-data-table font-data-table text-on-surface-variant">—</td>
        <td class="px-4 py-2 text-data-table font-data-table text-on-surface-variant">${ubicacion}</td>
        <td class="px-4 py-2 text-data-table font-data-table text-on-surface-variant">—</td>
        <td class="px-4 py-2 text-right">
          <button class="text-on-surface-variant hover:text-primary transition-colors p-1 rounded hover:bg-primary/10" title="Ver detalle" data-action="detalle-equipo">
            <span class="material-symbols-outlined text-[18px]">visibility</span>
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

async function initView(ctx) {
  const root = document.querySelector('[data-view="equipos"]') || document.getElementById('app-root');
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
}

window.initView = initView;
