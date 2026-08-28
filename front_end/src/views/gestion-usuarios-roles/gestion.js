async function cargarFiltroRoles(root) {
  const select = root.querySelector('#filtro-rol');
  if (!select) return;

  try {
    const roles = await RolService.getRoles();
    if (Array.isArray(roles)) {
      let optionsHtml = '<option value="">Todos los Roles</option>';
      roles.forEach((rol) => {
        const idRol = rol.idRol ?? rol.id;
        const nombreRol = rol.nombreRol ?? rol.nombre;
        optionsHtml += `<option value="${idRol}">${nombreRol}</option>`;
      });
      select.innerHTML = optionsHtml;
    }
  } catch (err) {
    console.error(err);
  }
}

function pintarTablaRoles(root, roles) {
  const tbody = root.querySelector('#tabla-roles-body');
  if (!tbody) return;

  if (!Array.isArray(roles) || roles.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-8 text-center text-on-surface-variant">
          No hay roles registrados.
        </td>
      </tr>
    `;
    return;
  }

  let rowsHtml = '';
  roles.forEach((rol, index) => {
    const idRol = rol.idRol ?? rol.id;
    const nombre = rol.nombreRol ?? rol.nombre ?? 'Sin nombre';
    const descripcion = rol.descripcionRol ?? rol.descripcion ?? 'Sin descripción';
    const esActivo = rol.estadoRol !== false && rol.estado !== false;
    const bgClass = index % 2 === 0 ? 'bg-surface-base' : 'bg-surface-dim';

    rowsHtml += `
      <tr class="h-row-height-dense ${bgClass} hover:bg-surface-container transition-colors group">
        <td class="px-4 align-middle">
          <div class="font-semibold text-on-surface">${nombre}</div>
        </td>
        <td class="px-4 align-middle text-on-surface-variant">
          ${descripcion}
        </td>
        <td class="px-4 align-middle">
          ${esActivo 
            ? '<span class="text-success text-status-micro font-status-micro border border-success/30 bg-success/10 px-1.5 py-0.5 rounded">ACTIVO</span>' 
            : '<span class="text-on-surface-variant text-status-micro font-status-micro border border-outline-variant bg-surface-container px-1.5 py-0.5 rounded">INACTIVO</span>'}
        </td>
        <td class="px-4 align-middle text-right">
          <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="btn-editar-rol p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest rounded transition-colors" 
                    data-id="${idRol}" data-nombre="${nombre}" data-descripcion="${descripcion}" title="Editar">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            ${esActivo ? `
            <button class="btn-toggle-rol p-1.5 text-on-surface-variant hover:text-error hover:bg-surface-container-highest rounded transition-colors" 
                    data-id="${idRol}" data-nombre="${nombre}" data-descripcion="${descripcion}" 
                    data-action="desactivar" title="Desactivar">
              <span class="material-symbols-outlined text-[18px]">block</span>
            </button>
            ` : `
            <button class="btn-toggle-rol p-1.5 text-on-surface-variant hover:text-success hover:bg-surface-container-highest rounded transition-colors" 
                    data-id="${idRol}" data-nombre="${nombre}" data-descripcion="${descripcion}" 
                    data-action="activar" title="Activar">
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

async function cargarTablaRoles(root) {
  try {
    const roles = await RolService.getRoles();
    if (Array.isArray(roles)) {
      pintarTablaRoles(root, roles);
    }
  } catch (err) {
    console.error(err);
  }
}

async function cargarCheckboxesPermisos(root, idRol) {
  const seccion = root.querySelector('#seccion-permisos-rol');
  const contenedor = root.querySelector('#permisos-checkboxes');

  if (idRol === null || idRol === undefined) {
    if (seccion) seccion.classList.add('hidden');
    return;
  }

  try {
    const [permisos, asignaciones] = await Promise.all([
      PermisoService.getPermisos(),
      RolPermisoService.getAsignaciones()
    ]);

    const asignacionesRol = Array.isArray(asignaciones)
      ? asignaciones.filter((a) => Number(a.idRol) === Number(idRol))
      : [];
    const asignadosSet = new Set(asignacionesRol.map((a) => Number(a.idPermiso)));

    if (seccion) seccion.classList.remove('hidden');

    if (contenedor && Array.isArray(permisos)) {
      let html = '';
      permisos.forEach((permiso) => {
        const idPermiso = permiso.idPermiso ?? permiso.id;
        const nombrePermiso = permiso.nombrePermiso ?? permiso.nombre;
        const estaAsignado = asignadosSet.has(Number(idPermiso));

        html += `
          <label class="flex items-center gap-2 text-body-sm font-body-sm text-on-surface cursor-pointer">
            <input type="checkbox" class="checkbox-permiso rounded border-outline-variant" 
                   data-id-permiso="${idPermiso}" ${estaAsignado ? 'checked' : ''}/>
            ${nombrePermiso}
          </label>
        `;
      });
      contenedor.innerHTML = html;
    }
  } catch (err) {
    console.error(err);
  }
}

function pintarTablaUsuarios(root, usuarios, rolesMap) {
  const tbody = root.querySelector('#tabla-usuarios-body');
  if (!tbody) return;

  if (!Array.isArray(usuarios) || usuarios.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-4 py-8 text-center text-on-surface-variant">
          No hay usuarios registrados.
        </td>
      </tr>
    `;
    return;
  }

  let rowsHtml = '';
  usuarios.forEach((usuario, index) => {
    const idUsuario = usuario.idUsuario ?? usuario.id;
    const nombre = usuario.nombreUsuario ?? usuario.nombre ?? 'Sin nombre';
    const correo = usuario.correoUsuario ?? usuario.correo ?? 'Sin correo';
    const idRol = usuario.idRol ?? usuario.rolId;
    const nombreRol = (rolesMap && (rolesMap.get(idRol) || rolesMap.get(Number(idRol)))) || 'Sin rol';
    const esActivo = usuario.cuentaActiva !== false && usuario.activo !== false;
    const bgClass = index % 2 === 0 ? 'bg-surface-base' : 'bg-surface-dim';

    rowsHtml += `
      <tr class="h-row-height-dense ${bgClass} hover:bg-surface-container transition-colors group">
        <td class="px-4 align-middle">
          <div class="w-1 h-full ${esActivo ? 'bg-success' : 'bg-outline-variant'} rounded-full group-hover:h-3/4 transition-all mx-auto" title="${esActivo ? 'Activo' : 'Inactivo'}"></div>
        </td>
        <td class="px-4 align-middle">
          <div class="font-semibold text-on-surface">${nombre}</div>
          <div class="text-status-micro font-status-micro text-on-surface-variant font-normal">${correo}</div>
        </td>
        <td class="px-4 align-middle">
          <span class="inline-flex items-center gap-1 bg-surface-variant px-2 py-0.5 rounded text-primary">
            <span class="material-symbols-outlined text-[14px]">shield_person</span>
            ${nombreRol}
          </span>
        </td>
        <td class="px-4 align-middle text-on-surface-variant">
          ${usuario.ultimoAcceso || '—'}
        </td>
        <td class="px-4 align-middle">
          ${esActivo 
            ? '<span class="text-success text-status-micro font-status-micro border border-success/30 bg-success/10 px-1.5 py-0.5 rounded">ACTIVO</span>' 
            : '<span class="text-on-surface-variant text-status-micro font-status-micro border border-outline-variant bg-surface-container px-1.5 py-0.5 rounded">INACTIVO</span>'}
        </td>
        <td class="px-4 align-middle text-right">
          <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="btn-editar-usuario p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest rounded transition-colors" 
                    data-id="${idUsuario}" data-nombre="${nombre}" data-correo="${correo}" data-idrol="${idRol ?? ''}" title="Editar">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            ${esActivo ? `
            <button class="btn-toggle-usuario p-1.5 text-on-surface-variant hover:text-error hover:bg-surface-container-highest rounded transition-colors" 
                    data-id="${idUsuario}" data-nombre="${nombre}" data-correo="${correo}" data-idrol="${idRol ?? ''}" 
                    data-action="desactivar" title="Desactivar">
              <span class="material-symbols-outlined text-[18px]">block</span>
            </button>
            ` : `
            <button class="btn-toggle-usuario p-1.5 text-on-surface-variant hover:text-success hover:bg-surface-container-highest rounded transition-colors" 
                    data-id="${idUsuario}" data-nombre="${nombre}" data-correo="${correo}" data-idrol="${idRol ?? ''}" 
                    data-action="activar" title="Activar">
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

async function cargarTablaUsuarios(root) {
  try {
    const [roles, usuarios] = await Promise.all([
      RolService.getRoles(),
      UsuarioService.getUsuarios()
    ]);
    const rolesMap = new Map();
    if (Array.isArray(roles)) {
      roles.forEach((rol) => {
        const idRol = rol.idRol ?? rol.id;
        const nombreRol = rol.nombreRol ?? rol.nombre;
        rolesMap.set(idRol, nombreRol);
        rolesMap.set(Number(idRol), nombreRol);
      });
    }
    pintarTablaUsuarios(root, usuarios, rolesMap);
  } catch (err) {
    console.error(err);
  }
}

async function cargarSelectRolesUsuario(root) {
  const select = root.querySelector('#usuario-rol');
  const msgVacio = root.querySelector('#usuario-rol-vacio-msg');
  if (!select) return;

  try {
    const roles = await RolService.getRoles();
    const rolesActivos = Array.isArray(roles)
      ? roles.filter((rol) => rol.estadoRol !== false && rol.estado !== false)
      : [];

    if (rolesActivos.length === 0) {
      select.innerHTML = '<option value="">Seleccione un rol...</option>';
      if (msgVacio) msgVacio.style.display = 'block';
    } else {
      if (msgVacio) msgVacio.style.display = 'none';
      let optionsHtml = '<option value="">Seleccione un rol...</option>';
      rolesActivos.forEach((rol) => {
        const idRol = rol.idRol ?? rol.id;
        const nombreRol = rol.nombreRol ?? rol.nombre;
        optionsHtml += `<option value="${idRol}">${nombreRol}</option>`;
      });
      select.innerHTML = optionsHtml;
    }
  } catch (err) {
    console.error(err);
  }
}

function initView(ctx) {
  let rolEnEdicion = null;
  let usuarioEnEdicion = null;
  const root = document.querySelector('[data-view="gestion-usuarios-roles"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);
  cargarFiltroRoles(root);
  cargarTablaRoles(root);
  cargarTablaUsuarios(root);

  const modal = root.querySelector('#modal-rol');
  const btnNuevoRol = root.querySelector('#btn-nuevo-rol');
  const btnCerrarModal = root.querySelector('#btn-cerrar-modal-rol');
  const btnCancelarModal = root.querySelector('#btn-cancelar-modal-rol');
  const formRol = root.querySelector('#form-rol');
  const tablaRolesBody = root.querySelector('#tabla-roles-body');

  const modalUsuario = root.querySelector('#modal-usuario');
  const btnNuevoUsuario = root.querySelector('#btn-nuevo-usuario');
  const btnCerrarModalUsuario = root.querySelector('#btn-cerrar-modal-usuario');
  const btnCancelarModalUsuario = root.querySelector('#btn-cancelar-modal-usuario');
  const formUsuario = root.querySelector('#form-usuario');
  const linkCrearRolDesdeUsuario = root.querySelector('#link-crear-rol-desde-usuario');
  const tablaUsuariosBody = root.querySelector('#tabla-usuarios-body');

  const cerrarModal = () => {
    if (modal) modal.style.display = 'none';
    if (formRol) formRol.reset();
    cargarCheckboxesPermisos(root, null);
    rolEnEdicion = null;
    const modalTitulo = root.querySelector('#modal-rol-titulo');
    if (modalTitulo) modalTitulo.textContent = 'Nuevo Rol';
  };

  if (btnNuevoRol && modal) {
    btnNuevoRol.addEventListener('click', () => {
      rolEnEdicion = null;
      if (formRol) formRol.reset();
      cargarCheckboxesPermisos(root, null);
      const modalTitulo = root.querySelector('#modal-rol-titulo');
      if (modalTitulo) modalTitulo.textContent = 'Nuevo Rol';
      modal.style.display = 'flex';
    });
  }

  if (btnCerrarModal) {
    btnCerrarModal.addEventListener('click', cerrarModal);
  }

  if (btnCancelarModal) {
    btnCancelarModal.addEventListener('click', cerrarModal);
  }

  if (tablaRolesBody) {
    tablaRolesBody.addEventListener('click', async (e) => {
      const btnEditar = e.target.closest('.btn-editar-rol');
      if (btnEditar) {
        const { id, nombre, descripcion } = btnEditar.dataset;
        rolEnEdicion = id;

        const modalTitulo = root.querySelector('#modal-rol-titulo');
        if (modalTitulo) modalTitulo.textContent = 'Editar Rol';

        const inputNombre = root.querySelector('#rol-nombre');
        const inputDescripcion = root.querySelector('#rol-descripcion');
        if (inputNombre) inputNombre.value = nombre ?? '';
        if (inputDescripcion) inputDescripcion.value = (descripcion === 'Sin descripción' ? '' : descripcion) ?? '';

        await cargarCheckboxesPermisos(root, Number(id));

        if (modal) modal.style.display = 'flex';
        return;
      }

      const btnToggle = e.target.closest('.btn-toggle-rol');
      if (btnToggle) {
        const { id, nombre, descripcion, action } = btnToggle.dataset;
        const esDesactivar = action === 'desactivar';
        const mensajeConfirm = esDesactivar
          ? '¿Desactivar este rol? Ya no estará disponible para nuevas asignaciones.'
          : '¿Activar este rol? Volverá a estar disponible para nuevas asignaciones.';

        const confirmacion = confirm(mensajeConfirm);
        if (confirmacion) {
          try {
            await RolService.actualizarRol(id, {
              nombreRol: nombre,
              descripcionRol: descripcion === 'Sin descripción' ? '' : descripcion,
              estadoRol: !esDesactivar
            });
            cargarTablaRoles(root);
            cargarFiltroRoles(root);
          } catch (err) {
            alert(err.message);
          }
        }
      }
    });
  }

  if (formRol) {
    formRol.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputNombre = root.querySelector('#rol-nombre');
      const inputDescripcion = root.querySelector('#rol-descripcion');

      const nombreRol = inputNombre ? inputNombre.value.trim() : '';
      const descripcionRol = inputDescripcion ? inputDescripcion.value.trim() : '';

      try {
        if (rolEnEdicion !== null) {
          const confirmar = confirm('¿Guardar los cambios en este rol?');
          if (!confirmar) return;

          await RolService.actualizarRol(rolEnEdicion, {
            nombreRol,
            descripcionRol,
            estadoRol: true
          });

          try {
            const checkboxes = root.querySelectorAll('#permisos-checkboxes .checkbox-permiso');
            const marcados = Array.from(checkboxes)
              .filter((cb) => cb.checked)
              .map((cb) => Number(cb.dataset.idPermiso));

            const asignaciones = await RolPermisoService.getAsignaciones();
            const asignacionesRol = Array.isArray(asignaciones)
              ? asignaciones.filter((a) => Number(a.idRol) === Number(rolEnEdicion))
              : [];
            const actuales = asignacionesRol.map((a) => Number(a.idPermiso));

            const paraAsignar = marcados.filter((id) => !actuales.includes(id));
            const paraQuitar = actuales.filter((id) => !marcados.includes(id));

            const promesas = [
              ...paraAsignar.map((idPermiso) => RolPermisoService.asignar(Number(rolEnEdicion), idPermiso)),
              ...paraQuitar.map((idPermiso) => RolPermisoService.quitar(Number(rolEnEdicion), idPermiso))
            ];

            await Promise.all(promesas);
          } catch (err) {
            alert('Los datos del rol se guardaron, pero hubo un error actualizando permisos: ' + err.message);
          }
        } else {
          await RolService.crearRol({
            nombreRol,
            descripcionRol
          });
        }

        cerrarModal();
        cargarTablaRoles(root);
        cargarFiltroRoles(root);
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // --- Modal Usuario ---
  const cerrarModalUsuario = () => {
    if (modalUsuario) modalUsuario.style.display = 'none';
    if (formUsuario) formUsuario.reset();
    usuarioEnEdicion = null;
    const modalTitulo = root.querySelector('#modal-usuario-titulo');
    if (modalTitulo) modalTitulo.textContent = 'Nuevo Usuario';
  };

  if (btnNuevoUsuario) {
    btnNuevoUsuario.addEventListener('click', async () => {
      usuarioEnEdicion = null;
      if (formUsuario) formUsuario.reset();
      const modalTitulo = root.querySelector('#modal-usuario-titulo');
      if (modalTitulo) modalTitulo.textContent = 'Nuevo Usuario';
      await cargarSelectRolesUsuario(root);
      if (modalUsuario) modalUsuario.style.display = 'flex';
    });
  }

  if (btnCerrarModalUsuario) {
    btnCerrarModalUsuario.addEventListener('click', cerrarModalUsuario);
  }

  if (btnCancelarModalUsuario) {
    btnCancelarModalUsuario.addEventListener('click', cerrarModalUsuario);
  }

  if (linkCrearRolDesdeUsuario) {
    linkCrearRolDesdeUsuario.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarModalUsuario();
      rolEnEdicion = null;
      if (formRol) formRol.reset();
      const modalRolTitulo = root.querySelector('#modal-rol-titulo');
      if (modalRolTitulo) modalRolTitulo.textContent = 'Nuevo Rol';
      if (modal) modal.style.display = 'flex';
    });
  }

  if (formUsuario) {
    formUsuario.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputNombre = root.querySelector('#usuario-nombre');
      const inputCorreo = root.querySelector('#usuario-correo');
      const selectRol = root.querySelector('#usuario-rol');
      const inputPassword = root.querySelector('#usuario-password');

      const datos = {
        nombreUsuario: inputNombre ? inputNombre.value.trim() : '',
        correoUsuario: inputCorreo ? inputCorreo.value.trim() : '',
        idRol: selectRol ? parseInt(selectRol.value, 10) : 0,
        contrasenaHash: inputPassword ? inputPassword.value : '',
        cuentaActiva: true
      };

      try {
        if (usuarioEnEdicion !== null) {
          const confirmar = confirm('¿Guardar los cambios en este usuario?');
          if (!confirmar) return;

          await UsuarioService.actualizarUsuario(usuarioEnEdicion, datos);
        } else {
          await UsuarioService.crearUsuario(datos);
        }

        cerrarModalUsuario();
        cargarTablaUsuarios(root);
      } catch (err) {
        alert(err.message);
      }
    });
  }

  if (tablaUsuariosBody) {
    tablaUsuariosBody.addEventListener('click', async (e) => {
      const btnEditar = e.target.closest('.btn-editar-usuario');
      if (btnEditar) {
        const { id, nombre, correo, idrol } = btnEditar.dataset;
        usuarioEnEdicion = id;

        const modalTitulo = root.querySelector('#modal-usuario-titulo');
        if (modalTitulo) modalTitulo.textContent = 'Editar Usuario';

        const inputNombre = root.querySelector('#usuario-nombre');
        const inputCorreo = root.querySelector('#usuario-correo');
        const inputPassword = root.querySelector('#usuario-password');
        if (inputNombre) inputNombre.value = nombre ?? '';
        if (inputCorreo) inputCorreo.value = correo ?? '';
        if (inputPassword) inputPassword.value = '';

        await cargarSelectRolesUsuario(root);
        const selectRol = root.querySelector('#usuario-rol');
        if (selectRol && idrol) {
          selectRol.value = idrol;
        }

        if (modalUsuario) modalUsuario.style.display = 'flex';
        return;
      }

      const btnToggle = e.target.closest('.btn-toggle-usuario');
      if (btnToggle) {
        const { id, nombre, correo, idrol, action } = btnToggle.dataset;
        const esDesactivar = action === 'desactivar';
        const mensajeConfirm = esDesactivar
          ? '¿Desactivar este usuario? Ya no podrá acceder al sistema.'
          : '¿Activar este usuario? Volverá a tener acceso al sistema.';

        const confirmacion = confirm(mensajeConfirm);
        if (confirmacion) {
          try {
            await UsuarioService.actualizarUsuario(id, {
              nombreUsuario: nombre,
              correoUsuario: correo,
              idRol: idrol ? parseInt(idrol, 10) : 0,
              contrasenaHash: '',
              cuentaActiva: !esDesactivar
            });
            cargarTablaUsuarios(root);
          } catch (err) {
            alert(err.message);
          }
        }
      }
    });
  }

  const tabUsuarios = root.querySelector('#tab-usuarios');
  const tabRoles = root.querySelector('#tab-roles');
  const panelUsuarios = root.querySelector('#panel-usuarios');
  const panelRoles = root.querySelector('#panel-roles');

  function activarTab(tab) {
    const esUsuarios = tab === 'usuarios';
    panelUsuarios.style.display = esUsuarios ? 'block' : 'none';
    panelRoles.style.display = esUsuarios ? 'none' : 'block';
    tabUsuarios.classList.toggle('border-primary', esUsuarios);
    tabUsuarios.classList.toggle('text-primary', esUsuarios);
    tabUsuarios.classList.toggle('border-transparent', !esUsuarios);
    tabUsuarios.classList.toggle('text-on-surface-variant', !esUsuarios);
    tabRoles.classList.toggle('border-primary', !esUsuarios);
    tabRoles.classList.toggle('text-primary', !esUsuarios);
    tabRoles.classList.toggle('border-transparent', esUsuarios);
    tabRoles.classList.toggle('text-on-surface-variant', esUsuarios);
  }

  if (tabUsuarios && tabRoles && panelUsuarios && panelRoles) {
    tabUsuarios.addEventListener('click', () => activarTab('usuarios'));
    tabRoles.addEventListener('click', () => activarTab('roles'));
  }
}

window.initView = initView;