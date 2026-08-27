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

function initView(ctx) {
  const root = document.querySelector('[data-view="gestion-usuarios-roles"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);
  cargarFiltroRoles(root);
}

window.initView = initView;