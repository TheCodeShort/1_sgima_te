const RolPermisoService = {
  async getAsignaciones() {
    const response = await fetchConAuth(`${window.API_BASE_URL}/rol-permisos`);
    if (!response.ok) {
      throw new Error(`Error al obtener asignaciones: ${response.status}`);
    }
    return await response.json();
  },

  async asignar(idRol, idPermiso) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/rol-permisos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idRol, idPermiso })
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al asignar permiso: ${response.status}`);
    }
    return await response.json();
  },

  async quitar(idRol, idPermiso) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/rol-permisos/${idRol}/${idPermiso}`, {
      method: 'DELETE'
    });
    if (!response.ok && response.status !== 204) {
      throw new Error(`Error al quitar permiso: ${response.status}`);
    }
  }
};

window.RolPermisoService = RolPermisoService;
