/**
 * Servicio de Autenticación
 * Centraliza el login y validación de tokens JWT
 */
const AuthService = {
  async login(username, password) {
    console.log('Iniciando sesión...', username);
    // TODO: Implementar llamada Fetch al backend de Java
  },
  logout() {
    AppState.clear();
  }
};

window.AuthService = AuthService;
