const EmpresaService = {
  async getEmpresas() {
    const response = await fetchConAuth(`${window.API_BASE_URL}/empresas`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al obtener empresas: ${response.status}`);
    }
    return await response.json();
  },

  async getEmpresaPorId(id) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/empresas/${id}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al obtener empresa: ${response.status}`);
    }
    return await response.json();
  },

  async crearEmpresa(datos) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/empresas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al crear empresa: ${response.status}`);
    }
    return await response.json();
  },

  async actualizarEmpresa(id, datos) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/empresas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al actualizar empresa: ${response.status}`);
    }
    return await response.json();
  },

  async cambiarEstadoEmpresa(id, datos) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/empresas/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al cambiar estado de empresa: ${response.status}`);
    }
    return await response.json();
  },

  async eliminarEmpresa(id) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/empresas/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al eliminar empresa: ${response.status}`);
    }
    if (response.status === 204) { return; }
    return await response.json();
  }
};

window.EmpresaService = EmpresaService;
