const AuthService = {
  async login(correo, contrasena) {
    const response = await fetch(`${window.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { ok: false, message: error.mensaje || 'Correo o contraseña incorrectos.' };
    }

    const data = await response.json();

    // Guarda el token y los datos del usuario para usarlos en cada petición futura
    sessionStorage.setItem('sigma_token', data.token);
    sessionStorage.setItem('sigma_usuario', JSON.stringify({
      idUsuario: data.idUsuario,
      nombreUsuario: data.nombreUsuario,
      correoUsuario: data.correoUsuario,
      idRol: data.idRol,
      requiereCambioPassword: data.requiereCambioPassword
    }));

    return {
      ok: true,
      message: `Bienvenido, ${data.nombreUsuario}.`,
      role: data.idRol,
      nombre: data.nombreUsuario
    };
  },

  logout() {
    sessionStorage.removeItem('sigma_token');
    sessionStorage.removeItem('sigma_usuario');
    if (window.AppState) AppState.clear();
    document.dispatchEvent(new CustomEvent('sigma:auth-changed'));
    return { ok: true, message: 'Sesión cerrada correctamente.' };
  },

  getToken() {
    return sessionStorage.getItem('sigma_token');
  }
};

window.AuthService = AuthService;
