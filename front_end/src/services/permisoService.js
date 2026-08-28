const PermisoService = {
  async getPermisos() {
    const response = await fetchConAuth(`${window.API_BASE_URL}/permisos`);
    if (!response.ok) {
      throw new Error(`Error al obtener permisos: ${response.status}`);
    }
    return await response.json();
  }
};

window.PermisoService = PermisoService;
