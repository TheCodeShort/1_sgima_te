/**
 * Estado global de la aplicación SIGMA-TE
 */
const AppState = {
  user: null,
  role: null,

  setUser(username, role) {
    this.user = username;
    this.role = role;
    sessionStorage.setItem('sigma_user', username);
    sessionStorage.setItem('sigma_role', role);
  },

  loadFromSession() {
    this.user = sessionStorage.getItem('sigma_user');
    this.role = sessionStorage.getItem('sigma_role');
  },

  clear() {
    this.user = null;
    this.role = null;
    sessionStorage.removeItem('sigma_user');
    sessionStorage.removeItem('sigma_role');
  },

  isAuthenticated() {
    return Boolean(this.user && this.role);
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
};

AppState.loadFromSession();
window.AppState = AppState;
