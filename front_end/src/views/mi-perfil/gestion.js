async function cargarCorreoActual(root) {
  try {
    const datos = await fetchConAuth(`${window.API_BASE_URL}/usuarios/mi-perfil`);
    if (datos.status === 403) {
      root.innerHTML = `
        <div class="view-loading view-loading--error" role="alert">
          <span class="material-symbols-outlined">block</span>
          <p>Acceso denegado.</p>
          <p class="view-loading__detail">No tienes permiso para acceder a esta sección.</p>
          <button type="button" class="view-loading__retry" data-action="volver">Volver</button>
        </div>
      `;
      root.querySelector('.view-loading__retry')?.addEventListener('click', () => {
        if (typeof Router !== 'undefined' && Router.navigate) {
          Router.navigate(AppState.isAuthenticated() ? AppState.getPanelRoute() : 'iniciar-sesion');
        } else {
          window.history.back();
        }
      });
      return;
    }
    if (datos.ok) {
      const usuario = await datos.json();
      const elCorreo = root.querySelector('#mi-perfil-correo-actual');
      if (elCorreo) elCorreo.textContent = usuario.correoUsuario;
    }
  } catch (err) {
    console.error(err);
  }
}

function initView(ctx) {
  const root = document.querySelector('[data-view="mi-perfil"]') || document.getElementById('app-root');

  const permisos = window.AppState && window.AppState.permisos ? window.AppState.permisos : [];
  if (!permisos.includes('mi_perfil')) {
    root.innerHTML = `
      <div class="view-loading view-loading--error" role="alert">
        <span class="material-symbols-outlined">block</span>
        <p>Acceso denegado.</p>
        <p class="view-loading__detail">No tienes permiso para acceder a esta sección.</p>
        <button type="button" class="view-loading__retry" data-action="volver">Volver</button>
      </div>
    `;
    root.querySelector('.view-loading__retry')?.addEventListener('click', () => {
      if (typeof Router !== 'undefined' && Router.navigate) {
        Router.navigate(AppState.isAuthenticated() ? AppState.getPanelRoute() : 'iniciar-sesion');
      } else {
        window.history.back();
      }
    });
    return;
  }

  cargarCorreoActual(root);

  const modalCorreo = document.querySelector('#modal-cambiar-correo');
  const modalPassword = document.querySelector('#modal-cambiar-password');
  const btnCambiarCorreo = root.querySelector('#btn-cambiar-correo');
  const btnCambiarPassword = root.querySelector('#btn-cambiar-password');
  const btnCerrarModalCorreo = document.querySelector('#btn-cerrar-modal-correo');
  const btnCancelarModalCorreo = document.querySelector('#btn-cancelar-modal-correo');
  const btnCerrarModalPassword = document.querySelector('#btn-cerrar-modal-password');
  const btnCancelarModalPassword = document.querySelector('#btn-cancelar-modal-password');
  const formCorreo = root.querySelector('#form-cambiar-correo');
  const formPassword = root.querySelector('#form-cambiar-password');

  const cerrarModalCorreo = () => { if (modalCorreo) modalCorreo.style.display = 'none'; };
  if (btnCerrarModalCorreo) btnCerrarModalCorreo.addEventListener('click', cerrarModalCorreo);
  if (btnCancelarModalCorreo) btnCancelarModalCorreo.addEventListener('click', cerrarModalCorreo);

  const cerrarModalPassword = () => { if (modalPassword) modalPassword.style.display = 'none'; };
  if (btnCerrarModalPassword) btnCerrarModalPassword.addEventListener('click', cerrarModalPassword);
  if (btnCancelarModalPassword) btnCancelarModalPassword.addEventListener('click', cerrarModalPassword);

  if (modalCorreo) {
    const inputCorreo = modalCorreo.querySelector('#mp-correo-nuevo');
    const inputPasswordActual = modalCorreo.querySelector('#mp-correo-password-actual');
    const submitBtn = document.querySelector('#btn-guardar-correo');

    let emailValido = false;
    let passwordValido = false;

    function actualizarEstadoBoton() {
      if (!submitBtn) return;
      const valido = emailValido && passwordValido;
      submitBtn.disabled = !valido;
      if (valido) {
        submitBtn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:bg-surface-container-highest');
        submitBtn.classList.add('bg-inverse-primary', 'text-on-primary');
      } else {
        submitBtn.classList.add('disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:bg-surface-container-highest');
        submitBtn.classList.remove('bg-inverse-primary', 'text-on-primary');
      }
    }

    if (btnCambiarCorreo) {
      btnCambiarCorreo.addEventListener('click', () => {
        if (formCorreo) formCorreo.reset();
        emailValido = false;
        passwordValido = false;
        actualizarEstadoBoton();
        modalCorreo.style.display = 'flex';
      });
    }

    ValidadorHelper.setupFieldValidation(
      modalCorreo, 'mp-correo-nuevo', 'error-mp-correo-nuevo',
      ValidadorHelper.validarEmail,
      () => { emailValido = ValidadorHelper.validarEmail(inputCorreo.value) === null; actualizarEstadoBoton(); }
    );

    ValidadorHelper.setupFieldValidation(
      modalCorreo, 'mp-correo-password-actual', 'error-mp-correo-password',
      (val) => (!val || val.trim() === '') ? 'La contraseña actual es obligatoria.' : null,
      () => { passwordValido = inputPasswordActual.value.trim() !== ''; actualizarEstadoBoton(); }
    );

    if (formCorreo) {
      formCorreo.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nuevoCorreo = inputCorreo.value.trim();
        const passwordActual = inputPasswordActual.value;

        const errorCorreo = ValidadorHelper.validarEmail(nuevoCorreo);
        if (errorCorreo) {
          ValidadorHelper.mostrarErrorCampo(modalCorreo, 'error-mp-correo-nuevo', errorCorreo, 'bloqueante');
          return;
        }
        ValidadorHelper.limpiarErrorCampo(modalCorreo, 'error-mp-correo-nuevo');

        if (!passwordActual || passwordActual.trim() === '') {
          ValidadorHelper.mostrarErrorCampo(modalCorreo, 'error-mp-correo-password', 'La contraseña actual es obligatoria.', 'bloqueante');
          return;
        }
        ValidadorHelper.limpiarErrorCampo(modalCorreo, 'error-mp-correo-password');

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
          const data = await resp.json().catch(() => ({}));
          if (data.token) {
            sessionStorage.setItem('sigma_token', data.token);
          }
          showToast('Correo actualizado correctamente.', 'success');
          cerrarModalCorreo();
          const elCorreo = root.querySelector('#mi-perfil-correo-actual');
          if (elCorreo) elCorreo.textContent = nuevoCorreo;
        } catch (err) {
          ValidadorHelper.mostrarErrorCampo(modalCorreo, 'error-mp-correo-password', err.message, 'bloqueante');
        }
      });
    }
  }

  if (modalPassword) {
    const inputPasswordActual = modalPassword.querySelector('#mp-password-actual');
    const inputPasswordNueva = modalPassword.querySelector('#mp-password-nueva');
    const submitBtnPassword = document.querySelector('#btn-guardar-password');

    let passwordActualValido = false;
    let passwordNuevaValido = false;

    function actualizarEstadoBotonPassword() {
      if (!submitBtnPassword) return;
      const valido = passwordActualValido && passwordNuevaValido;
      submitBtnPassword.disabled = !valido;
      if (valido) {
        submitBtnPassword.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:bg-surface-container-highest');
        submitBtnPassword.classList.add('bg-inverse-primary', 'text-on-primary');
      } else {
        submitBtnPassword.classList.add('disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:bg-surface-container-highest');
        submitBtnPassword.classList.remove('bg-inverse-primary', 'text-on-primary');
      }
    }

    if (btnCambiarPassword) {
      btnCambiarPassword.addEventListener('click', () => {
        if (formPassword) formPassword.reset();
        passwordActualValido = false;
        passwordNuevaValido = false;
        actualizarEstadoBotonPassword();
        modalPassword.style.display = 'flex';
      });
    }

    ValidadorHelper.setupFieldValidation(
      modalPassword, 'mp-password-actual', 'error-mp-password-actual',
      (val) => (!val || val.trim() === '') ? 'La contraseña actual es obligatoria.' : null,
      () => { passwordActualValido = inputPasswordActual.value.trim() !== ''; actualizarEstadoBotonPassword(); }
    );

    ValidadorHelper.setupFieldValidation(
      modalPassword, 'mp-password-nueva', 'error-mp-password-nueva',
      (val) => (!val || val.length < 8) ? 'La nueva contraseña debe tener mínimo 8 caracteres.' : null,
      () => { passwordNuevaValido = inputPasswordNueva.value.length >= 8; actualizarEstadoBotonPassword(); }
    );

    if (formPassword) {
      formPassword.addEventListener('submit', async (e) => {
        e.preventDefault();
        const passwordActual = inputPasswordActual.value;
        const passwordNueva = inputPasswordNueva.value;

        if (!passwordActual || passwordActual.trim() === '') {
          ValidadorHelper.mostrarErrorCampo(modalPassword, 'error-mp-password-actual', 'La contraseña actual es obligatoria.', 'bloqueante');
          return;
        }
        ValidadorHelper.limpiarErrorCampo(modalPassword, 'error-mp-password-actual');

        if (!passwordNueva || passwordNueva.length < 8) {
          ValidadorHelper.mostrarErrorCampo(modalPassword, 'error-mp-password-nueva', 'La nueva contraseña debe tener mínimo 8 caracteres.', 'bloqueante');
          return;
        }
        ValidadorHelper.limpiarErrorCampo(modalPassword, 'error-mp-password-nueva');

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
          ValidadorHelper.mostrarErrorCampo(modalPassword, 'error-mp-password-nueva', err.message, 'bloqueante');
        }
      });
    }
  }
}

window.initView = initView;
