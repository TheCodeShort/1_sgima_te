async function refrescarAvatarMenu() {
  const btnAvatar = document.getElementById('btn-avatar-menu');
  const menu = document.getElementById('avatar-dropdown-menu');
  const btnMiPerfil = document.getElementById('btn-ir-mi-perfil');
  const elPlaca = document.getElementById('mi-panel-rol-nombre');

  if (!btnAvatar || !menu) return;

  if (!AppState.isAuthenticated()) {
    if (elPlaca) elPlaca.textContent = 'Sin sesión';
    return;
  }

  // Paso 1: nombre del rol propio
  try {
    const rolResp = await fetchConAuth(`${window.API_BASE_URL}/usuarios/mi-perfil/rol`);
    if (rolResp.ok) {
      const datosRol = await rolResp.json();
      if (elPlaca) elPlaca.textContent = datosRol.nombreRol || 'No disponible';
    } else {
      if (elPlaca) elPlaca.textContent = 'No disponible';
    }
  } catch (err) {
    console.error('Error obteniendo rol propio:', err);
    if (elPlaca) elPlaca.textContent = 'No disponible';
  }

  // Paso 2: permisos propios, para decidir si mostrar "Mi Perfil"
  let tienePermisoMiPerfil = false;
  try {
    const permisosResp = await fetchConAuth(`${window.API_BASE_URL}/usuarios/mi-perfil/permisos`);
    if (permisosResp.ok) {
      const misPermisos = await permisosResp.json();
      tienePermisoMiPerfil = Array.isArray(misPermisos) && misPermisos.includes('mi_perfil');
    }
  } catch (err) {
    console.error('Error obteniendo permisos propios:', err);
    tienePermisoMiPerfil = false;
  }

  if (btnMiPerfil) {
    btnMiPerfil.style.display = tienePermisoMiPerfil ? '' : 'none';
  }

  const tieneItemsVisibles = btnMiPerfil && btnMiPerfil.style.display !== 'none';
  if (!tieneItemsVisibles) {
    menu.style.display = 'none';
    btnAvatar.setAttribute('aria-haspopup', 'false');
    btnAvatar.removeAttribute('aria-expanded');
    btnAvatar.style.cursor = 'default';
  } else {
    btnAvatar.setAttribute('aria-haspopup', 'true');
    btnAvatar.style.cursor = 'pointer';
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
  if (elPlaca) elPlaca.textContent = 'Sin sesión';

  const btnMiPerfil = document.getElementById('btn-ir-mi-perfil');
  if (btnMiPerfil) btnMiPerfil.style.display = 'none';
}

window.limpiarAvatarMenu = limpiarAvatarMenu;
