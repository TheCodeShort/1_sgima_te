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
    const response = await fetchConAuth(`${window.API_BASE_URL}/equipos/${id}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al obtener detalle del equipo: ${response.status}`);
    }
    return await response.json();
  },
  async getEquiposPorEmpresa(idEmpresa) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/equipos/empresa/${idEmpresa}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al obtener equipos: ${response.status}`);
    }
    return await response.json();
  },
  async crearEquipo(datos) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/equipos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al crear equipo: ${response.status}`);
    }
    return await response.json();
  },
  async getTiposEquipo() {
    const response = await fetchConAuth(`${window.API_BASE_URL}/tipos-equipo`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al obtener tipos de equipo: ${response.status}`);
    }
    return await response.json();
  },
  async getEstadosEquipo() {
    const response = await fetchConAuth(`${window.API_BASE_URL}/estados-equipo`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al obtener estados de equipo: ${response.status}`);
    }
    return await response.json();
  },
  async actualizarEquipo(id, datos) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/equipos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al actualizar equipo: ${response.status}`);
    }
    return await response.json();
  },
  async eliminarEquipo(id) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/equipos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al eliminar equipo: ${response.status}`);
    }
    if (response.status === 204) { return; }
    return await response.json();
  },
  async cambiarEstadoEquipo(id, activo) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/equipos/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo })
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al cambiar estado del equipo: ${response.status}`);
    }
    return await response.json();
  }
};

window.EquipoService = EquipoService;
