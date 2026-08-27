const RolService = {
  async getRoles() {
    const response = await fetch(`${window.API_BASE_URL}/roles`);
    if (!response.ok) {
      throw new Error(`Error al obtener roles: ${response.status}`);
    }
    return await response.json();
  }
};

window.RolService = RolService;
