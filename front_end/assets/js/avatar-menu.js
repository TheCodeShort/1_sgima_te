document.addEventListener('DOMContentLoaded', () => {
  const btnAvatar = document.getElementById('btn-avatar-menu');
  const menu = document.getElementById('avatar-dropdown-menu');
  const btnMiPerfil = document.getElementById('btn-ir-mi-perfil');

  if (!btnAvatar || !menu) return;

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

  (async () => {
    try {
      const datos = await fetchConAuth(`${window.API_BASE_URL}/usuarios/mi-perfil`);
      if (!datos.ok) return;
      const usuario = await datos.json();

      const roles = await fetchConAuth(`${window.API_BASE_URL}/roles`);
      if (!roles.ok) return;
      const listaRoles = await roles.json();

      const rolEncontrado = listaRoles.find((r) => Number(r.idRol) === Number(usuario.idRol));
      const elPlaca = document.getElementById('mi-panel-rol-nombre');
      if (elPlaca && rolEncontrado) {
        elPlaca.textContent = rolEncontrado.nombreRol;
      }
    } catch (err) {
      console.error('No se pudo cargar el rol en Mi Panel:', err);
    }
  })();
});
