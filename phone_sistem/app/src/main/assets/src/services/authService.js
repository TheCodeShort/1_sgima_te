/**
 * Servicio de autenticación (simulado — sin back-end)
 */
const AuthService = {
  /** Usuarios de demostración: usuario → contraseña y rol */
  DEMO_USERS: {
    admin: { password: 'admin123', role: 'admin', nombre: 'Administrador del Sistema' },
    auditor: { password: 'auditor123', role: 'auditor', nombre: 'Auditor de Calidad' },
    supervisor: { password: 'supervisor123', role: 'supervisor', nombre: 'Supervisor de Planta' },
    tecnico: { password: 'tecnico123', role: 'tecnico', nombre: 'Técnico de Mantenimiento' },
    operario: { password: 'operario123', role: 'operario', nombre: 'Operario de Línea' },
  },

  /**
   * Inicia sesión con credenciales simuladas.
   * @returns {{ ok: boolean, message: string, role?: string, nombre?: string }}
   */
  async login(username, password) {
    await this._simularLatencia();

    const user = (username || '').trim();
    const pass = password || '';

    if (!user) {
      return { ok: false, message: 'Ingrese su nombre de usuario.' };
    }

    if (!pass) {
      return { ok: false, message: 'Ingrese su contraseña.' };
    }

    const clave = user.toLowerCase();
    const demo = this.DEMO_USERS[clave];

    if (demo) {
      if (pass !== demo.password) {
        return { ok: false, message: 'Contraseña incorrecta. Revise las credenciales de demostración.' };
      }
      return {
        ok: true,
        message: `Bienvenido, ${demo.nombre}.`,
        role: demo.role,
        nombre: demo.nombre,
      };
    }

    // Compatibilidad: cualquier otro usuario infiere el rol por palabras clave
    const role = this.detectRole(user);
    const nombre = AppState.getRoleLabel(role);
    return {
      ok: true,
      message: `Sesión iniciada como ${nombre}.`,
      role,
      nombre,
    };
  },

  detectRole(username) {
    const u = username.toLowerCase();
    if (u.includes('admin')) return 'admin';
    if (u.includes('audit')) return 'auditor';
    if (u.includes('super')) return 'supervisor';
    if (u.includes('tec') || u.includes('téc')) return 'tecnico';
    return 'operario';
  },

  logout() {
    AppState.clear();
    return { ok: true, message: 'Sesión cerrada correctamente.' };
  },

  getDemoCredentials() {
    return Object.entries(this.DEMO_USERS).map(([usuario, data]) => ({
      usuario,
      password: data.password,
      rol: AppState.getRoleLabel(data.role),
    }));
  },

  _simularLatencia() {
    return new Promise((resolve) => setTimeout(resolve, 600));
  },
};

window.AuthService = AuthService;
