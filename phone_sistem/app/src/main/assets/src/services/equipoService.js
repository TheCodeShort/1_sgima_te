/**
 * Servicio de Equipos
 * Centraliza peticiones de maquinaria
 */
const EquipoService = {
  async getEquipos() {
    console.log('Obteniendo equipos...');
    // TODO: Implementar llamada Fetch al backend de Java
    return [];
  },
  async getEquipoDetalle(id) {
    console.log('Obteniendo detalle de equipo...', id);
    // TODO: Implementar llamada Fetch al backend de Java
    return null;
  }
};

window.EquipoService = EquipoService;
