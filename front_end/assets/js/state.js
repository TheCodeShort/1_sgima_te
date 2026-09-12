/**
 * Estado global de la aplicación SIGMA-TE
 */
const AppState = {
  user: null,
  role: null,

  ROLE_LABELS: {
    admin: 'Administrador',
    administrador: 'Administrador',
    auditor: 'Auditor',
    operario: 'Operario',
    supervisor: 'Supervisor',
    tecnico: 'Técnico',
    técnico: 'Técnico',
  },

  setUser(username, role, displayName) {
    this.user = username;
    this.role = role;
    this.displayName = displayName || this.getRoleLabel(role);
    sessionStorage.setItem('sigma_user', username);
    sessionStorage.setItem('sigma_role', role);
    sessionStorage.setItem('sigma_display_name', this.displayName);
  },

  loadFromSession() {
    this.user = sessionStorage.getItem('sigma_user');
    this.role = sessionStorage.getItem('sigma_role');
    this.displayName = sessionStorage.getItem('sigma_display_name');
  },

  clear() {
    this.user = null;
    this.role = null;
    this.displayName = null;
    this.permisos = [];
    sessionStorage.removeItem('sigma_user');
    sessionStorage.removeItem('sigma_role');
    sessionStorage.removeItem('sigma_display_name');
  },

  isAuthenticated() {
    return Boolean(this.user && this.role);
  },

  getRoleLabel(role) {
    return this.ROLE_LABELS[role?.toLowerCase()] || 'Usuario';
  },

  getPanelRoute() {
    const panels = {
      admin: 'panel-administrador',
      administrador: 'panel-administrador',
      auditor: 'panel-auditor',
      operario: 'panel-operario',
      supervisor: 'panel-supervisor',
      tecnico: 'panel-tecnico',
      técnico: 'panel-tecnico',
    };
    return panels[this.role?.toLowerCase()] || 'panel-operario';
  },

  saveRememberedUsername(username) {
    if (username) {
      localStorage.setItem('sigma_remember_user', username);
    } else {
      localStorage.removeItem('sigma_remember_user');
    }
  },

  getRememberedUsername() {
    return localStorage.getItem('sigma_remember_user') || '';
  },

  isRememberEnabled() {
    return Boolean(localStorage.getItem('sigma_remember_user'));
  },
};

AppState.loadFromSession();
window.AppState = AppState;
