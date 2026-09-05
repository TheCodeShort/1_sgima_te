(function () {
  function marcarFuentesListas() {
    document.documentElement.classList.add('fonts-loaded');
  }

  if ('fonts' in document) {
    document.fonts.load('24px "Material Symbols Outlined"').then(marcarFuentesListas);
    // Seguridad: si por alguna razón no resuelve, revela los íconos igual tras 1.5s
    setTimeout(marcarFuentesListas, 1500);
  } else {
    // Navegadores muy antiguos sin soporte de Font Loading API
    marcarFuentesListas();
  }
})();
