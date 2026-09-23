(function () {
  let idEmpresa = null;
  let nombreEmpresa = null;

  const EmpresaContext = {
    set(id, nombre) {
      idEmpresa = id;
      nombreEmpresa = nombre;
    },
    get() {
      if (idEmpresa == null || idEmpresa === '') return null;
      return { idEmpresa, nombreEmpresa };
    },
    clear() {
      idEmpresa = null;
      nombreEmpresa = null;
    }
  };

  window.EmpresaContext = EmpresaContext;
})();
