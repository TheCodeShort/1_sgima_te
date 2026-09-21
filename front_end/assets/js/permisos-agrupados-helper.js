(function () {
  function findPermisoByNombre(permisos, nombre) {
    return permisos.find((p) => (p.nombrePermiso ?? p.nombre) === nombre);
  }

  function getPermisoId(permiso) {
    return Number(permiso.idPermiso ?? permiso.id);
  }

  function buildCheckboxHtml(idPermiso, nombrePermiso, checked, claseCheckbox, extraAttrs) {
    const attrs = extraAttrs ? ' ' + extraAttrs : '';
    return `
      <label class="flex items-center gap-2 text-body-sm font-body-sm text-on-surface cursor-pointer">
        <input type="checkbox" class="${claseCheckbox} rounded border-outline-variant"
               data-id-permiso="${idPermiso}" ${checked ? 'checked' : ''}${attrs}/>
        ${nombrePermiso}
      </label>
    `;
  }

  function buildGroupCheckboxHtml(idsPermiso, idsAsignados, checked, indeterminate, claseCheckbox) {
    const idsAsignadosStr = Array.from(idsAsignados).join(',');
    const idsPermisoStr = Array.from(idsPermiso).join(',');
    const indeterminateAttr = indeterminate ? ' data-indeterminate="true"' : '';
    return `
      <label class="flex items-center gap-2 text-body-sm font-body-sm text-on-surface cursor-pointer" title="Incluye gestionar_usuarios y gestionar_roles">
        <input type="checkbox" class="${claseCheckbox} rounded border-outline-variant"
               data-grupo="usuarios-roles"
               data-ids-permiso="${idsPermisoStr}"
               data-ids-asignados="${idsAsignadosStr}"
               ${checked ? 'checked' : ''}${indeterminateAttr}/>
        Usuarios y Roles
      </label>
    `;
  }

  window.PermisosAgrupados = {
    renderizar(contenedor, permisos, idsAsignados, claseCheckbox) {
      if (!contenedor) return;
      const pUsuarios = findPermisoByNombre(permisos, 'gestionar_usuarios');
      const pRoles = findPermisoByNombre(permisos, 'gestionar_roles');

      let html = '';
      const drawn = new Set();

      if (pUsuarios && pRoles) {
        const idU = getPermisoId(pUsuarios);
        const idR = getPermisoId(pRoles);
        const idsPair = new Set([idU, idR]);
        const assignedPair = new Set([...idsAsignados].filter((id) => idsPair.has(id)));
        const bothAssigned = assignedPair.size === 2;
        const oneAssigned = assignedPair.size === 1;
        html += buildGroupCheckboxHtml(idsPair, assignedPair, bothAssigned, oneAssigned, claseCheckbox);
        drawn.add(idU);
        drawn.add(idR);
      }

      permisos.forEach((permiso) => {
        const id = getPermisoId(permiso);
        if (drawn.has(id)) return;
        const nombre = permiso.nombrePermiso ?? permiso.nombre;
        const checked = idsAsignados.has(id);
        html += buildCheckboxHtml(id, nombre, checked, claseCheckbox);
      });

      contenedor.innerHTML = html;

      if (pUsuarios && pRoles) {
        const groupInput = contenedor.querySelector('input[data-grupo="usuarios-roles"]');
        if (groupInput && groupInput.dataset.indeterminate === 'true') {
          groupInput.indeterminate = true;
        }
      }
    },

    obtenerIdsMarcados(contenedor, claseCheckbox) {
      if (!contenedor) return [];
      const result = new Set();
      const checkboxes = contenedor.querySelectorAll(`.${claseCheckbox}`);
      checkboxes.forEach((cb) => {
        if (cb.dataset.grupo === 'usuarios-roles') {
          const idsPermiso = cb.dataset.idsPermiso ? cb.dataset.idsPermiso.split(',').map(Number) : [];
          const idsAsignados = cb.dataset.idsAsignados ? cb.dataset.idsAsignados.split(',').map(Number) : [];
          if (cb.indeterminate === true) {
            idsAsignados.forEach((id) => result.add(id));
          } else if (cb.checked) {
            idsPermiso.forEach((id) => result.add(id));
          }
        } else if (cb.checked) {
          const id = Number(cb.dataset.idPermiso);
          if (!isNaN(id)) result.add(id);
        }
      });
      return Array.from(result);
    }
  };
})();