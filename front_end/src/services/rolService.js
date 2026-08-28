const RolService = {
  async getRoles() {
    const response = await fetchConAuth(`${window.API_BASE_URL}/roles`);
    if (!response.ok) {
      throw new Error(`Error al obtener roles: ${response.status}`);
    }
    return await response.json();
  },

  async crearRol(datos) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al crear rol: ${response.status}`);
    }
    return await response.json();
  },

  async actualizarRol(id, datos) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al actualizar rol: ${response.status}`);
    }
    return await response.json();
  }
};

window.RolService = RolService;
