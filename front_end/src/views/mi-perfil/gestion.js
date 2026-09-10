async function initView(ctx) {
  const root = document.querySelector('[data-view="mi-perfil"]') || document.getElementById('app-root');

  try {
    const datos = await fetchConAuth(`${window.API_BASE_URL}/usuarios/mi-perfil`);
    if (datos.ok) {
      const usuario = await datos.json();
      const elCorreo = root.querySelector('#mi-perfil-correo-actual');
      if (elCorreo) elCorreo.textContent = usuario.correoUsuario;
    }
  } catch (err) {
    console.error(err);
  }

  const modalCorreo = root.querySelector('#modal-cambiar-correo');
  const btnCambiarCorreo = root.querySelector('#btn-cambiar-correo');
  const btnCerrarModalCorreo = root.querySelector('#btn-cerrar-modal-correo');
  const btnCancelarModalCorreo = root.querySelector('#btn-cancelar-modal-correo');
  const formCorreo = root.querySelector('#form-cambiar-correo');

  const modalPassword = root.querySelector('#modal-cambiar-password');
  const btnCambiarPassword = root.querySelector('#btn-cambiar-password');
  const btnCerrarModalPassword = root.querySelector('#btn-cerrar-modal-password');
  const btnCancelarModalPassword = root.querySelector('#btn-cancelar-modal-password');
  const formPassword = root.querySelector('#form-cambiar-password');

  if (btnCambiarCorreo && modalCorreo) {
    btnCambiarCorreo.addEventListener('click', () => {
      if (formCorreo) formCorreo.reset();
      modalCorreo.style.display = 'flex';
    });
  }
  const cerrarModalCorreo = () => { if (modalCorreo) modalCorreo.style.display = 'none'; };
  if (btnCerrarModalCorreo) btnCerrarModalCorreo.addEventListener('click', cerrarModalCorreo);
  if (btnCancelarModalCorreo) btnCancelarModalCorreo.addEventListener('click', cerrarModalCorreo);

  if (btnCambiarPassword && modalPassword) {
    btnCambiarPassword.addEventListener('click', () => {
      if (formPassword) formPassword.reset();
      modalPassword.style.display = 'flex';
    });
  }
  const cerrarModalPassword = () => { if (modalPassword) modalPassword.style.display = 'none'; };
  if (btnCerrarModalPassword) btnCerrarModalPassword.addEventListener('click', cerrarModalPassword);
  if (btnCancelarModalPassword) btnCancelarModalPassword.addEventListener('click', cerrarModalPassword);

  if (formCorreo) {
    formCorreo.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nuevoCorreo = root.querySelector('#mp-correo-nuevo').value.trim();
      const passwordActual = root.querySelector('#mp-correo-password-actual').value;

      const errorCorreo = ValidadorHelper.validarEmail(nuevoCorreo);
      if (errorCorreo) {
        ValidadorHelper.mostrarErrorCampo(root, 'error-mp-correo-nuevo', errorCorreo, 'bloqueante');
        return;
      }
      ValidadorHelper.limpiarErrorCampo(root, 'error-mp-correo-nuevo');

      try {
        const resp = await fetchConAuth(`${window.API_BASE_URL}/usuarios/mi-perfil`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contrasenaActual: passwordActual, nuevoCorreo, nuevaContrasena: '' })
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.mensaje || `Error: ${resp.status}`);
        }
        showToast('Correo actualizado correctamente.', 'success');
        cerrarModalCorreo();
        const elCorreo = root.querySelector('#mi-perfil-correo-actual');
        if (elCorreo) elCorreo.textContent = nuevoCorreo;
      } catch (err) {
        ValidadorHelper.mostrarErrorCampo(root, 'error-mp-correo-password', err.message, 'bloqueante');
      }
    });
  }

  if (formPassword) {
    formPassword.addEventListener('submit', async (e) => {
      e.preventDefault();
      const passwordActual = root.querySelector('#mp-password-actual').value;
      const passwordNueva = root.querySelector('#mp-password-nueva').value;

      if (!passwordNueva || passwordNueva.length < 8) {
        ValidadorHelper.mostrarErrorCampo(root, 'error-mp-password-nueva', 'La nueva contraseña debe tener al menos 8 caracteres.', 'bloqueante');
        return;
      }
      ValidadorHelper.limpiarErrorCampo(root, 'error-mp-password-nueva');

      try {
        const resp = await fetchConAuth(`${window.API_BASE_URL}/usuarios/mi-perfil`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contrasenaActual: passwordActual, nuevoCorreo: '', nuevaContrasena: passwordNueva })
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.mensaje || `Error: ${resp.status}`);
        }
        showToast('Contraseña actualizada correctamente.', 'success');
        cerrarModalPassword();
      } catch (err) {
        ValidadorHelper.mostrarErrorCampo(root, 'error-mp-password-nueva', err.message, 'bloqueante');
      }
    });
  }
}

window.initView = initView;
