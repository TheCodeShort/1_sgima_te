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
  },
  async getEquiposPorEmpresa(idEmpresa) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/equipos/empresa/${idEmpresa}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al obtener equipos: ${response.status}`);
    }
    return await response.json();
  }
};

window.EquipoService = EquipoService;
