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
      admin: 'panel_del_administrador',
      administrador: 'panel_del_administrador',
      auditor: 'panel_del_auditor',
      operario: 'panel_del_operario',
      supervisor: 'panel_del_supervisor',
      tecnico: 'panel_del_t_cnico',
      técnico: 'panel_del_t_cnico',
    };
    return panels[this.role?.toLowerCase()] || 'panel_del_operario';
  },
};

AppState.loadFromSession();
window.AppState = AppState;
