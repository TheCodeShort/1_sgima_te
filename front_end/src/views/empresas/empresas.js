(function () {
let empresasCache = [];
let modalEmpresa = null;
let formEmpresa = null;
let wizardEmpresa = null;
let modalEditarEmpresa = null;
let formEditarEmpresa = null;
let confirmacionSinPermisosPendiente = false;

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
    if (Array.isArray(permisos) && window.PermisosAgrupados) {
      window.PermisosAgrupados.renderizar(contenedor, permisos, new Set(), 'checkbox-permiso-empresa');
    }
  } catch (err) {
    console.error(err);
    contenedor.innerHTML = '<p class="text-error text-body-sm">No se pudieron cargar los permisos.</p>';
  }
}

async function cargarCheckboxesPermisosEditarEmpresa(root, idEmpresa) {
  const contenedor = root.querySelector('#permisos-checkboxes-editar-empresa');
  if (!contenedor) return;
  try {
    const permisos = await PermisoService.getPermisos();
    const empresa = await EmpresaService.getEmpresaPorId(idEmpresa);
    const permisosHabilitados = Array.isArray(empresa.permisosHabilitados) ? empresa.permisosHabilitados : [];
    const idsAsignados = new Set();
    if (Array.isArray(permisos)) {
      permisos.forEach((permiso) => {
        const nombre = permiso.nombrePermiso ?? permiso.nombre;
        if (permisosHabilitados.includes(nombre)) {
          idsAsignados.add(Number(permiso.idPermiso ?? permiso.id));
        }
      });
    }
    if (Array.isArray(permisos) && window.PermisosAgrupados) {
      window.PermisosAgrupados.renderizar(contenedor, permisos, idsAsignados, 'checkbox-permiso-empresa');
    }
  } catch (err) {
    console.error(err);
    contenedor.innerHTML = '<p class="text-error text-body-sm">No se pudieron cargar los permisos.</p>';
  }
}

function cerrarModalEmpresa() {
  if (modalEmpresa) modalEmpresa.style.display = 'none';
  if (modalEmpresa) modalEmpresa.setAttribute('aria-hidden', 'true');
  confirmacionSinPermisosPendiente = false;
}

function cerrarModalEditarEmpresa() {
  if (modalEditarEmpresa) modalEditarEmpresa.style.display = 'none';
  if (modalEditarEmpresa) modalEditarEmpresa.setAttribute('aria-hidden', 'true');
}

function initView(ctx) {
  const root = document.querySelector('[data-view="empresas"]') || document.getElementById('app-root');
  if (!root) return;

  modalEmpresa = root.querySelector('#modal-empresa');
  formEmpresa = root.querySelector('#form-empresa');
  modalEditarEmpresa = root.querySelector('#modal-editar-empresa');
  formEditarEmpresa = root.querySelector('#form-editar-empresa');

  const btnNueva = root.querySelector('#btn-nueva-empresa');
  if (btnNueva) {
    btnNueva.addEventListener('click', () => {
      if (formEmpresa) formEmpresa.reset();
      const errorCampos = root.querySelectorAll('[id^="error-empresa"]');
      errorCampos.forEach((p) => { p.style.display = 'none'; });
      confirmacionSinPermisosPendiente = false;
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
            const idsMarcados = window.PermisosAgrupados
              ? window.PermisosAgrupados.obtenerIdsMarcados(root.querySelector('#permisos-checkboxes-empresa'), 'checkbox-permiso-empresa')
              : [];
            const algunoMarcado = idsMarcados.length > 0;
            const pErr = root.querySelector('#error-empresa-permisos');
            const btnFinalizarEl = root.querySelector('[data-wizard-finalizar]');

            if (algunoMarcado) {
                if (pErr) pErr.style.display = 'none';
                if (btnFinalizarEl) btnFinalizarEl.textContent = 'Crear Empresa';
                confirmacionSinPermisosPendiente = false;
                return true;
            }

            if (!confirmacionSinPermisosPendiente) {
                confirmacionSinPermisosPendiente = true;
                if (pErr) pErr.style.display = 'block';
                if (btnFinalizarEl) btnFinalizarEl.textContent = 'Confirmar sin permisos';
                return false;
            }

            confirmacionSinPermisosPendiente = false;
            if (pErr) pErr.style.display = 'none';
            if (btnFinalizarEl) btnFinalizarEl.textContent = 'Crear Empresa';
            return true;
        }

          return true;
        },
        onFinalizar: async () => {
          const inputNombreEmpresa = root.querySelector('#empresa-nombre');
          const inputAdminNombre = root.querySelector('#empresa-admin-nombre');
          const inputAdminCorreo = root.querySelector('#empresa-admin-correo');
          const inputAdminPassword = root.querySelector('#empresa-admin-password');

          const idsPermisosMarcados = window.PermisosAgrupados
            ? window.PermisosAgrupados.obtenerIdsMarcados(root.querySelector('#permisos-checkboxes-empresa'), 'checkbox-permiso-empresa')
            : [];

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
            await mostrarAlerta({ titulo: 'Error', mensaje: err.message });
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

  const btnCerrarEditar = root.querySelector('#btn-cerrar-modal-editar-empresa');
  if (btnCerrarEditar) {
    btnCerrarEditar.addEventListener('click', () => { cerrarModalEditarEmpresa(); });
  }

  const btnCancelarEditar = root.querySelector('#btn-cancelar-modal-editar-empresa');
  if (btnCancelarEditar) {
    btnCancelarEditar.addEventListener('click', () => { cerrarModalEditarEmpresa(); });
  }

const btnGuardarEditar = root.querySelector('#btn-guardar-editar-empresa');
  if (btnGuardarEditar) {
    btnGuardarEditar.addEventListener('click', async () => {
      const idEmpresa = document.querySelector('#editar-empresa-id').value;
      const idUsuarioAdmin = document.querySelector('#editar-empresa-id-usuario-admin').value;
      const idRolAdmin = document.querySelector('#editar-empresa-id-rol-admin').value;
      const nombreEmpresa = document.querySelector('#editar-empresa-nombre').value.trim();
      const nombreAdmin = document.querySelector('#editar-empresa-admin-nombre').value.trim();
      const correoAdmin = document.querySelector('#editar-empresa-admin-correo').value.trim();
      const password = document.querySelector('#editar-empresa-admin-password').value;

      try {
        const nombreOriginal = (document.querySelector('#editar-empresa-nombre').dataset.valorOriginal || '').trim();
        if (nombreEmpresa !== nombreOriginal) {
          await EmpresaService.actualizarEmpresa(idEmpresa, { nombreEmpresa });
        }

        if (idUsuarioAdmin) {
          const idRolNum = Number(idRolAdmin);
          const nombreCambio = nombreAdmin !== (document.querySelector('#editar-empresa-admin-nombre').dataset.valorOriginal || '').trim();
          const correoCambio = correoAdmin !== (document.querySelector('#editar-empresa-admin-correo').dataset.valorOriginal || '').trim();
          const passwordCambio = password !== '';

          if (nombreCambio || correoCambio || passwordCambio) {
            const datos = {
              nombreUsuario: nombreAdmin,
              correoUsuario: correoAdmin,
              idRol: idRolNum,
              cuentaActiva: true
            };
            if (password !== '') {
              datos.contrasenaHash = password;
            }
            await UsuarioService.actualizarUsuario(idUsuarioAdmin, datos);
          }
        } else {
          const nombreAdminCambio = nombreAdmin !== (document.querySelector('#editar-empresa-admin-nombre').dataset.valorOriginal || '').trim();
          const correoAdminCambio = correoAdmin !== (document.querySelector('#editar-empresa-admin-correo').dataset.valorOriginal || '').trim();
          const passwordCambio = password !== '';
          if (nombreAdminCambio || correoAdminCambio || passwordCambio) {
            await mostrarAlerta({ titulo: 'Advertencia', mensaje: 'No se encontró el administrador de esta empresa. Los cambios en sus datos no se guardaron.' });
          }
        }

        const idsPermisosMarcados = window.PermisosAgrupados
          ? window.PermisosAgrupados.obtenerIdsMarcados(root.querySelector('#permisos-checkboxes-editar-empresa'), 'checkbox-permiso-empresa')
          : [];
        await EmpresaService.actualizarPermisosEmpresa(idEmpresa, idsPermisosMarcados);

        cerrarModalEditarEmpresa();
        await mostrarAlerta({ titulo: 'Éxito', mensaje: 'Los cambios se guardaron correctamente.' });
        cargarEmpresas(root);
      } catch (err) {
        await mostrarAlerta({ titulo: 'Error', mensaje: err.message });
      }
    });
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
        try {
          const empresa = await EmpresaService.getEmpresaPorId(id);
          if (modalEditarEmpresa) {
            document.querySelector('#editar-empresa-id').value = empresa.idEmpresa;
            document.querySelector('#editar-empresa-id-usuario-admin').value = empresa.idUsuarioAdmin ?? '';
            document.querySelector('#editar-empresa-id-rol-admin').value = empresa.idRolAdmin ?? '';
            const inputNombre = document.querySelector('#editar-empresa-nombre');
            inputNombre.value = empresa.nombreEmpresa ?? '';
            inputNombre.dataset.valorOriginal = empresa.nombreEmpresa ?? '';
            const inputAdminNombre = document.querySelector('#editar-empresa-admin-nombre');
            inputAdminNombre.value = empresa.nombreUsuarioAdmin ?? '';
            inputAdminNombre.dataset.valorOriginal = empresa.nombreUsuarioAdmin ?? '';
            const inputAdminCorreo = document.querySelector('#editar-empresa-admin-correo');
            inputAdminCorreo.value = empresa.correoUsuarioAdmin ?? '';
            inputAdminCorreo.dataset.valorOriginal = empresa.correoUsuarioAdmin ?? '';
            document.querySelector('#editar-empresa-admin-password').value = '';
            document.querySelector('#editar-empresa-admin-password').dataset.valorOriginal = '';
            await cargarCheckboxesPermisosEditarEmpresa(root, id);
          }
          if (modalEditarEmpresa) {
            modalEditarEmpresa.style.display = 'flex';
            modalEditarEmpresa.setAttribute('aria-hidden', 'false');
          }
        } catch (err) {
          await mostrarAlerta({ titulo: 'Error', mensaje: err.message });
        }
        return;
      }

      const btnEliminar = e.target.closest('.btn-eliminar-empresa');
      if (btnEliminar) {
        const id = btnEliminar.dataset.id;
        const nombre = btnEliminar.dataset.nombre;
        const confirmar = await mostrarConfirmacion({
          titulo: 'Eliminar Empresa',
          mensaje: `¿Eliminar la empresa "${nombre}"? Esta acción desactivará también a todos sus usuarios y no se puede deshacer desde aquí.`,
          textoConfirmar: 'Eliminar',
          textoCancelar: 'Cancelar',
          tipo: 'peligro'
        });
        if (confirmar) {
          try {
            await EmpresaService.eliminarEmpresa(id);
            cargarEmpresas(root);
          } catch (err) {
            await mostrarAlerta({ titulo: 'Error', mensaje: err.message });
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
        const confirmar = await mostrarConfirmacion({
        titulo: esDesactivar ? 'Desactivar Empresa' : 'Activar Empresa',
        mensaje: mensajeConfirm,
        textoConfirmar: esDesactivar ? 'Desactivar' : 'Activar',
        textoCancelar: 'Cancelar',
        tipo: 'default'
      });
      if (confirmar) {
        try {
          await EmpresaService.cambiarEstadoEmpresa(id, { activo: !esDesactivar });
          cargarEmpresas(root);
        } catch (err) {
          await mostrarAlerta({ titulo: 'Error', mensaje: err.message });
        }
      }
        return;
      }
    });
  }

  cargarEmpresas(root);
}

window.initView = initView;
})();