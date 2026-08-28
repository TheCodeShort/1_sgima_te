const UsuarioService = {
  async getUsuarios() {
    const response = await fetchConAuth(`${window.API_BASE_URL}/usuarios`);
    if (!response.ok) {
      throw new Error(`Error al obtener usuarios: ${response.status}`);
    }
    return await response.json();
  },

  async crearUsuario(datos) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al crear usuario: ${response.status}`);
    }
    return await response.json();
  },

  async actualizarUsuario(id, datos) {
    const response = await fetchConAuth(`${window.API_BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.mensaje || `Error al actualizar usuario: ${response.status}`);
    }
    return await response.json();
  }
};

window.UsuarioService = UsuarioService;
