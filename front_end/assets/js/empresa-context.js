(function () {
  let idEmpresa = null;
  let nombreEmpresa = null;
  let idUsuarioAdmin = null;

  const EmpresaContext = {
    set(id, nombre, idUsuario) {
      idEmpresa = id;
      nombreEmpresa = nombre;
      idUsuarioAdmin = idUsuario;
    },
    get() {
      if (idEmpresa == null || idEmpresa === '') return null;
      return { idEmpresa, nombreEmpresa, idUsuarioAdmin };
    },
    clear() {
      idEmpresa = null;
      nombreEmpresa = null;
      idUsuarioAdmin = null;
    }
  };

  window.EmpresaContext = EmpresaContext;
})();
