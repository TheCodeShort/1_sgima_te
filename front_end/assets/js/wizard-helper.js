function initWizard(config) {
  const {
    root,
    totalPasos,
    onPasoCambio,
    onFinalizar,
    validarPaso
  } = config;

  let pasoActual = 1;

  const barraProgreso = root.querySelector('[data-wizard-barra]');
  const contador = root.querySelector('[data-wizard-contador]');
  const btnAtras = root.querySelector('[data-wizard-atras]');
  const btnSiguiente = root.querySelector('[data-wizard-siguiente]');
  const btnFinalizar = root.querySelector('[data-wizard-finalizar]');

  function mostrarPaso(numero) {
    root.querySelectorAll('[data-wizard-paso]').forEach((el) => {
      const esEsePaso = Number(el.dataset.wizardPaso) === numero;
      el.style.display = esEsePaso ? 'block' : 'none';
    });

    if (contador) contador.textContent = `${numero}/${totalPasos}`;
    if (barraProgreso) {
      const porcentaje = (numero / totalPasos) * 100;
      barraProgreso.style.width = `${porcentaje}%`;
    }

    if (btnAtras) btnAtras.style.display = numero === 1 ? 'none' : 'inline-flex';
    if (btnSiguiente) btnSiguiente.style.display = numero === totalPasos ? 'none' : 'inline-flex';
    if (btnFinalizar) btnFinalizar.style.display = numero === totalPasos ? 'inline-flex' : 'none';

    if (typeof onPasoCambio === 'function') onPasoCambio(numero);
  }

  if (btnSiguiente) {
    btnSiguiente.addEventListener('click', async () => {
      if (typeof validarPaso === 'function') {
        const valido = await validarPaso(pasoActual);
        if (!valido) return;
      }
      if (pasoActual < totalPasos) {
        pasoActual += 1;
        mostrarPaso(pasoActual);
      }
    });
  }

  if (btnAtras) {
    btnAtras.addEventListener('click', () => {
      if (pasoActual > 1) {
        pasoActual -= 1;
        mostrarPaso(pasoActual);
      }
    });
  }

  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', async () => {
      if (typeof validarPaso === 'function') {
        const valido = await validarPaso(pasoActual);
        if (!valido) return;
      }
      if (typeof onFinalizar === 'function') onFinalizar();
    });
  }

  function reiniciar() {
    pasoActual = 1;
    mostrarPaso(pasoActual);
  }

  mostrarPaso(pasoActual);

  return { reiniciar, irAPaso: mostrarPaso, pasoActual: () => pasoActual };
}

window.initWizard = initWizard;
