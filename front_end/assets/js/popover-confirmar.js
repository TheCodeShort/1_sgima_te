function mostrarPopoverConfirmar({ botonAncla, mensaje, onConfirmar }) {
  document.querySelectorAll('.popover-confirmar').forEach((el) => el.remove());

  const popover = document.createElement('div');
  popover.className = 'popover-confirmar bg-surface-card border border-outline-variant rounded-lg shadow-2xl p-3 text-body-sm font-body-sm text-on-surface';
  popover.style.position = 'fixed';
  popover.style.zIndex = '9999';
  popover.style.width = '220px';
  popover.innerHTML = `
    <p class="mb-3">${mensaje}</p>
    <div class="flex justify-end gap-2">
      <button type="button" class="popover-cancelar px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest transition-colors text-status-micro font-status-micro">Cancelar</button>
      <button type="button" class="popover-confirmar-btn px-3 py-1.5 rounded-lg bg-error text-white hover:opacity-90 transition-opacity text-status-micro font-status-micro">Eliminar</button>
    </div>
  `;
  document.body.appendChild(popover);

  function posicionar() {
    const rect = botonAncla.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      cerrar();
      return;
    }
    popover.style.top = `${rect.bottom + 6}px`;
    popover.style.left = `${Math.max(8, rect.right - 220)}px`;
  }

  posicionar();

  let cerrado = false;
  function cerrar() {
    if (cerrado) return;
    cerrado = true;
    popover.remove();
    window.removeEventListener('scroll', posicionar, true);
    document.removeEventListener('click', clickFuera, true);
    clearTimeout(timeoutAutoCierre);
  }

  function clickFuera(e) {
    if (!popover.contains(e.target) && e.target !== botonAncla && !botonAncla.contains(e.target)) {
      cerrar();
    }
  }

  window.addEventListener('scroll', posicionar, true);
  setTimeout(() => document.addEventListener('click', clickFuera, true), 0);

  const timeoutAutoCierre = setTimeout(cerrar, 6000);

  popover.querySelector('.popover-cancelar').addEventListener('click', cerrar);
  popover.querySelector('.popover-confirmar-btn').addEventListener('click', () => {
    cerrar();
    if (typeof onConfirmar === 'function') onConfirmar();
  });
}

window.mostrarPopoverConfirmar = mostrarPopoverConfirmar;
