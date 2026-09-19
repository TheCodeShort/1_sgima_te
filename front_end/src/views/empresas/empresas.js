let empresasCache = [];
let modalEmpresa = null;
let formEmpresa = null;
let wizardEmpresa = null;

async function cargarEmpresas(root) {
  const tbody = root.querySelector('#tabla-empresas-body');
  if (!tbody) return;

  try {
    const empresas = await EmpresaService.getEmpresas();
    if (Array.isArray(empresas)) {
      empresasCache = empresas;
      pintarTablaEmpresas(root, empresas);
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="px-4 py-8 text-center text-on-surface-variant">
            No se pudieron cargar las empresas.
          </td>
        </tr>
      `;
    }
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-8 text-center text-error">
          Error al cargar las empresas. Intente de nuevo.
        </td>
      </tr>
    `;
  }
}

function pintarTablaEmpresas(root, empresas) {
  const tbody = root.querySelector('#tabla-empresas-body');
  if (!tbody) return;

  empresas = empresas.filter((e) => !(e.nombreEmpresa || '').startsWith('Eliminado - '));

  if (!Array.isArray(empresas) || empresas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-8 text-center text-on-surface-variant">
          No hay empresas registradas.
        </td>
      </tr>
    `;
    return;
  }

  let rowsHtml = '';
  empresas.forEach((empresa, index) => {
    const nombre = empresa.nombreEmpresa ?? 'Sin nombre';
    const activo = empresa.estadoEmpresa !== false;
    const fecha = empresa.fechaCreacion
      ? new Date(empresa.fechaCreacion).toLocaleDateString('es-ES')
      : '—';
    const bgClass = index % 2 === 0 ? 'bg-surface-base' : 'bg-surface-dim';

    rowsHtml += `
      <tr class="h-row-height-dense ${bgClass} hover:bg-surface-container transition-colors group">
        <td class="px-4 align-middle">
          <div class="font-semibold text-on-surface">${nombre}</div>
        </td>
        <td class="px-4 align-middle">
          ${activo
            ? '<span class="text-success text-status-micro font-status-micro border border-success/30 bg-success/10 px-1.5 py-0.5 rounded">ACTIVO</span>'
            : '<span class="text-on-surface-variant text-status-micro font-status-micro border border-outline-variant bg-surface-container px-1.5 py-0.5 rounded">INACTIVO</span>'
          }
        </td>
        <td class="px-4 align-middle text-on-surface-variant">
          ${fecha}
        </td>
        <td class="px-4 align-middle text-right">
          <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="btn-editar-empresa p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest rounded transition-colors"
                    data-id="${empresa.idEmpresa}" data-nombre="${nombre}" title="Editar">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button class="btn-eliminar-empresa p-1.5 text-on-surface-variant hover:text-error hover:bg-surface-container-highest rounded transition-colors"
                    data-id="${empresa.idEmpresa}" data-nombre="${nombre}" title="Eliminar">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
            ${activo ? `
            <button class="btn-toggle-empresa p-1.5 text-on-surface-variant hover:text-error hover:bg-surface-container-highest rounded transition-colors"
                    data-id="${empresa.idEmpresa}" data-nombre="${nombre}" data-action="desactivar" title="Desactivar">
              <span class="material-symbols-outlined text-[18px]">block</span>
            </button>
            ` : `
            <button class="btn-toggle-empresa p-1.5 text-on-surface-variant hover:text-success hover:bg-surface-container-highest rounded transition-colors"
                    data-id="${empresa.idEmpresa}" data-nombre="${nombre}" data-action="activar" title="Activar">
              <span class="material-symbols-outlined text-[18px]">check_circle</span>
            </button>
            `}
          </div>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = rowsHtml;
}

function aplicarFiltroEmpresas(root) {
  const inputBuscador = root.querySelector('#buscador-empresas');
  const textoBusqueda = inputBuscador ? inputBuscador.value.trim().toLowerCase() : '';

  const empresasFiltradas = empresasCache.filter((emp) => {
    if (!textoBusqueda) return true;
    const nombre = (emp.nombreEmpresa ?? '').toLowerCase();
    return nombre.includes(textoBusqueda);
  });

  pintarTablaEmpresas(root, empresasFiltradas);
}

async function cargarCheckboxesPermisosEmpresa(root) {
  const contenedor = root.querySelector('#permisos-checkboxes-empresa');
  if (!contenedor) return;
  try {
    const permisos = await PermisoService.getPermisos();
    if (Array.isArray(permisos)) {
      let html = '';
      permisos.forEach((permiso) => {
        const idPermiso = permiso.idPermiso ?? permiso.id;
        const nombrePermiso = permiso.nombrePermiso ?? permiso.nombre;
        html += `
          <label class="flex items-center gap-2 text-body-sm font-body-sm text-on-surface cursor-pointer">
            <input type="checkbox" class="checkbox-permiso-empresa rounded border-outline-variant"
                   data-id-permiso="${idPermiso}"/>
            ${nombrePermiso}
          </label>
        `;
      });
      contenedor.innerHTML = html;
    }
  } catch (err) {
    console.error(err);
    contenedor.innerHTML = '<p class="text-error text-body-sm">No se pudieron cargar los permisos.</p>';
  }
}

function cerrarModalEmpresa() {
  if (modalEmpresa) modalEmpresa.style.display = 'none';
  if (modalEmpresa) modalEmpresa.setAttribute('aria-hidden', 'true');
}

function initView(ctx) {
  const root = document.querySelector('[data-view="empresas"]') || document.getElementById('app-root');
  if (!root) return;

  modalEmpresa = root.querySelector('#modal-empresa');
  formEmpresa = root.querySelector('#form-empresa');

  const btnNueva = root.querySelector('#btn-nueva-empresa');
  if (btnNueva) {
    btnNueva.addEventListener('click', () => {
      if (formEmpresa) formEmpresa.reset();
      const errorCampos = root.querySelectorAll('[id^="error-empresa"]');
      errorCampos.forEach((p) => { p.style.display = 'none'; });
      wizardEmpresa = initWizard({
        root: modalEmpresa,
        totalPasos: 2,
        onPasoCambio: async (paso) => {
          if (paso === 2) {
            await cargarCheckboxesPermisosEmpresa(root);
          }
        },
        validarPaso: (paso) => {
          if (paso === 1) {
            let valido = true;
            const inputNombre = root.querySelector('#empresa-nombre');
            const inputAdminNombre = root.querySelector('#empresa-admin-nombre');
            const inputAdminCorreo = root.querySelector('#empresa-admin-correo');
            const inputAdminPassword = root.querySelector('#empresa-admin-password');

            if (!inputNombre || !inputNombre.value.trim()) {
              const pErr = root.querySelector('#error-empresa-nombre');
              if (pErr) { pErr.textContent = 'El nombre de la empresa es obligatorio.'; pErr.style.display = 'block'; }
              valido = false;
            } else {
              const pErr = root.querySelector('#error-empresa-nombre');
              if (pErr) pErr.style.display = 'none';
            }

            if (!inputAdminNombre || !inputAdminNombre.value.trim()) {
              const pErr = root.querySelector('#error-empresa-admin-nombre');
              if (pErr) { pErr.textContent = 'El nombre del administrador es obligatorio.'; pErr.style.display = 'block'; }
              valido = false;
            } else {
              const pErr = root.querySelector('#error-empresa-admin-nombre');
              if (pErr) pErr.style.display = 'none';
            }

            if (!inputAdminCorreo || !inputAdminCorreo.value.trim()) {
              const pErr = root.querySelector('#error-empresa-admin-correo');
              if (pErr) { pErr.textContent = 'El correo del administrador es obligatorio.'; pErr.style.display = 'block'; }
              valido = false;
            } else {
              const pErr = root.querySelector('#error-empresa-admin-correo');
              if (pErr) pErr.style.display = 'none';
            }

            if (!inputAdminPassword || inputAdminPassword.value.length < 8) {
              const pErr = root.querySelector('#error-empresa-admin-password');
              if (pErr) { pErr.textContent = 'La contraseña debe tener al menos 8 caracteres.'; pErr.style.display = 'block'; }
              valido = false;
            } else {
              const pErr = root.querySelector('#error-empresa-admin-password');
              if (pErr) pErr.style.display = 'none';
            }

            if (!valido) return false;
          }

          if (paso === 2) {
            const checkboxes = root.querySelectorAll('#permisos-checkboxes-empresa .checkbox-permiso-empresa');
            const algunoMarcado = Array.from(checkboxes).some((cb) => cb.checked);
            const pErr = root.querySelector('#error-empresa-permisos');
            const btnFinalizarEl = root.querySelector('[data-wizard-finalizar]');

            if (!algunoMarcado) {
              if (pErr) pErr.style.display = 'block';
              if (btnFinalizarEl) btnFinalizarEl.textContent = 'Crear Empresa';
              return false;
            }

            if (pErr) pErr.style.display = 'none';
            return true;
          }

          return true;
        },
        onFinalizar: async () => {
          const inputNombreEmpresa = root.querySelector('#empresa-nombre');
          const inputAdminNombre = root.querySelector('#empresa-admin-nombre');
          const inputAdminCorreo = root.querySelector('#empresa-admin-correo');
          const inputAdminPassword = root.querySelector('#empresa-admin-password');

          const checkboxes = root.querySelectorAll('#permisos-checkboxes-empresa .checkbox-permiso-empresa');
          const idsPermisosMarcados = Array.from(checkboxes)
            .filter((cb) => cb.checked)
            .map((cb) => Number(cb.dataset.idPermiso));

          try {
            await EmpresaService.crearEmpresa({
              nombreEmpresa: inputNombreEmpresa.value.trim(),
              nombreUsuario: inputAdminNombre.value.trim(),
              correoUsuario: inputAdminCorreo.value.trim(),
              contrasenaHash: inputAdminPassword.value,
              permisosIds: idsPermisosMarcados
            });
            cerrarModalEmpresa();
            await cargarEmpresas(root);
          } catch (err) {
            alert(err.message);
          }
        }
      });

      if (modalEmpresa) {
        modalEmpresa.style.display = 'flex';
        modalEmpresa.setAttribute('aria-hidden', 'false');
      }
    });
  }

  const btnCerrar = root.querySelector('#btn-cerrar-modal-empresa');
  if (btnCerrar) {
    btnCerrar.addEventListener('click', () => { cerrarModalEmpresa(); });
  }

  const btnCancelar = root.querySelector('#btn-cancelar-modal-empresa');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', () => { cerrarModalEmpresa(); });
  }

  const buscador = root.querySelector('#buscador-empresas');
  if (buscador) {
    buscador.addEventListener('input', () => {
      aplicarFiltroEmpresas(root);
    });
  }

  const tbody = root.querySelector('#tabla-empresas-body');
  if (tbody) {
    tbody.addEventListener('click', async (e) => {
      const btnEditar = e.target.closest('.btn-editar-empresa');
      if (btnEditar) {
        const id = btnEditar.dataset.id;
        const nombreActual = btnEditar.dataset.nombre;
        const nuevoNombre = prompt('Nuevo nombre para la empresa:', nombreActual);
        if (nuevoNombre && nuevoNombre.trim() && nuevoNombre.trim() !== nombreActual) {
          try {
            await EmpresaService.actualizarEmpresa(id, { nombreEmpresa: nuevoNombre.trim() });
            cargarEmpresas(root);
          } catch (err) {
            alert(err.message);
          }
        }
        return;
      }

      const btnEliminar = e.target.closest('.btn-eliminar-empresa');
      if (btnEliminar) {
        const id = btnEliminar.dataset.id;
        const nombre = btnEliminar.dataset.nombre;
        const confirmar = confirm(`¿Eliminar la empresa "${nombre}"? Esta acción desactivará también a todos sus usuarios y no se puede deshacer desde aquí.`);
        if (confirmar) {
          try {
            await EmpresaService.eliminarEmpresa(id);
            cargarEmpresas(root);
          } catch (err) {
            alert(err.message);
          }
        }
        return;
      }

      const btnToggle = e.target.closest('.btn-toggle-empresa');
      if (btnToggle) {
        const id = btnToggle.dataset.id;
        const nombre = btnToggle.dataset.nombre;
        const action = btnToggle.dataset.action;
        const esDesactivar = action === 'desactivar';
        const mensajeConfirm = esDesactivar
          ? `¿Desactivar la empresa "${nombre}"? Sus usuarios no podrán acceder al sistema.`
          : `¿Activar la empresa "${nombre}"? Sus usuarios podrán volver a acceder.`;
        const confirmar = confirm(mensajeConfirm);
        if (confirmar) {
          try {
            await EmpresaService.cambiarEstadoEmpresa(id, { activo: !esDesactivar });
            cargarEmpresas(root);
          } catch (err) {
            alert(err.message);
          }
        }
        return;
      }
    });
  }

  cargarEmpresas(root);
}

window.initView = initView;
