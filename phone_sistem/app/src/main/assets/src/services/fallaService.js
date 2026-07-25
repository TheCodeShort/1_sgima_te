/**
 * Servicio de Fallas
 * Centraliza reportes de fallas hacia Java
 */
const FallaService = {
  async registrarFalla(fallaData) {
    console.log('Registrando falla...', fallaData);
    // TODO: Implementar llamada Fetch al backend de Java
    return { success: true };
  }
};

window.FallaService = FallaService;
