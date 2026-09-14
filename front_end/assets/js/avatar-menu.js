async function refrescarAvatarMenu() {
  const btnAvatar = document.getElementById('btn-avatar-menu');
  const menu = document.getElementById('avatar-dropdown-menu');
  const btnMiPerfil = document.getElementById('btn-ir-mi-perfil');

  if (!btnAvatar || !menu) return;

  try {
    const datosResp = await fetchConAuth(`${window.API_BASE_URL}/usuarios/mi-perfil`);
    if (!datosResp.ok) return;
    const usuario = await datosResp.json();

    const rolesResp = await fetchConAuth(`${window.API_BASE_URL}/roles`);
    const rolesData = rolesResp.ok ? await rolesResp.json() : [];
    const rolEncontrado = rolesData.find((r) => Number(r.idRol) === Number(usuario.idRol));

    const elPlaca = document.getElementById('mi-panel-rol-nombre');
    if (elPlaca && rolEncontrado) {
      elPlaca.textContent = rolEncontrado.nombreRol;
    }

    const asignacionesResp = await fetchConAuth(`${window.API_BASE_URL}/rol-permisos`);
    const permisosResp = await fetchConAuth(`${window.API_BASE_URL}/permisos`);
    if (asignacionesResp.ok && permisosResp.ok) {
      const asignaciones = await asignacionesResp.json();
      const permisos = await permisosResp.json();

      const idsPermisosDelRol = asignaciones
        .filter((a) => Number(a.idRol) === Number(usuario.idRol))
        .map((a) => Number(a.idPermiso));

      const tienePermisoMiPerfil = permisos.some(
        (p) => idsPermisosDelRol.includes(Number(p.idPermiso)) && p.nombrePermiso === 'mi_perfil'
      );

      if (btnMiPerfil) {
        btnMiPerfil.style.display = tienePermisoMiPerfil ? '' : 'none';
      }
    }
  } catch (err) {
    console.error('No se pudo actualizar el menú de avatar:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btnAvatar = document.getElementById('btn-avatar-menu');
  const menu = document.getElementById('avatar-dropdown-menu');
  const btnMiPerfil = document.getElementById('btn-ir-mi-perfil');

  if (!btnAvatar || !menu) return;

  refrescarAvatarMenu();

  btnAvatar.addEventListener('click', (e) => {
    e.stopPropagation();
    const visible = menu.style.display === 'block';
    menu.style.display = visible ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== btnAvatar) {
      menu.style.display = 'none';
    }
  });

  if (btnMiPerfil) {
    btnMiPerfil.addEventListener('click', () => {
      menu.style.display = 'none';
      if (typeof Router !== 'undefined' && Router.navigate) {
        Router.navigate('mi-perfil');
      } else {
        window.location.hash = '#/mi-perfil';
      }
    });
  }

  document.addEventListener('sigma:auth-changed', refrescarAvatarMenu);
});

function limpiarAvatarMenu() {
  const elPlaca = document.getElementById('mi-panel-rol-nombre');
  if (elPlaca) elPlaca.textContent = 'Cargando...';

  const btnMiPerfil = document.getElementById('btn-ir-mi-perfil');
  if (btnMiPerfil) btnMiPerfil.style.display = 'none';
}

window.limpiarAvatarMenu = limpiarAvatarMenu;
