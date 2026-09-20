function mostrarConfirmacion({ titulo, mensaje, textoConfirmar = 'Confirmar', textoCancelar = 'Cancelar', tipo = 'default' }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);backdrop-blur-sm;z-index:200;display:flex;align-items:center;justify-content:center;';

    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:var(--surface-card-bg, #fff);background:var(--surface-card, #1e1e2e);border:1px solid var(--outline-variant, #333);border-radius:1rem;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);max-width:420px;width:90%;padding:2rem;text-align:center;';

    const titleEl = document.createElement('h3');
    titleEl.textContent = titulo;
    titleEl.style.cssText = 'font-size:1.125rem;font-weight:600;color:var(--on-surface, #fff);margin-bottom:0.75rem;';

    const msgEl = document.createElement('p');
    msgEl.textContent = mensaje;
    msgEl.style.cssText = 'font-size:0.875rem;color:var(--on-surface-variant, #aaa);margin-bottom:1.5rem;line-height:1.5;';

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'display:flex;gap:0.75rem;justify-content:center;';

    const btnCancel = document.createElement('button');
    btnCancel.type = 'button';
    btnCancel.textContent = textoCancelar;
    btnCancel.style.cssText = 'padding:0.5rem 1.25rem;border-radius:0.5rem;border:1px solid var(--outline-variant, #444);background:transparent;color:var(--on-surface-variant, #ccc);font-size:0.875rem;cursor:pointer;transition:background 0.15s;';
    btnContainer.appendChild(btnCancel);

    const btnConfirm = document.createElement('button');
    btnConfirm.type = 'button';
    btnConfirm.textContent = textoConfirmar;
    const isPeligro = tipo === 'peligro';
    const isDefault = tipo === 'default';
    btnConfirm.style.cssText = `padding:0.5rem 1.25rem;border-radius:0.5rem;border:none;background:${isPeligro ? '#dc2626' : (isDefault ? '#6366f1' : '#6366f1')};color:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;transition:opacity 0.15s;`;
    btnContainer.appendChild(btnConfirm);

    dialog.appendChild(titleEl);
    dialog.appendChild(msgEl);
    dialog.appendChild(btnContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const cleanup = (result) => {
      overlay.remove();
      resolve(result);
    };

    btnConfirm.addEventListener('click', () => cleanup(true));
    btnCancel.addEventListener('click', () => cleanup(false));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cleanup(false);
    });
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escHandler);
        cleanup(false);
      }
    });
  });
}

function mostrarAlerta({ titulo = 'Aviso', mensaje, tipo = 'default' }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);backdrop-blur-sm;z-index:200;display:flex;align-items:center;justify-content:center;';

    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:var(--surface-card-bg, #fff);background:var(--surface-card, #1e1e2e);border:1px solid var(--outline-variant, #333);border-radius:1rem;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);max-width:420px;width:90%;padding:2rem;text-align:center;';

    const titleEl = document.createElement('h3');
    titleEl.textContent = titulo;
    titleEl.style.cssText = 'font-size:1.125rem;font-weight:600;color:var(--on-surface, #fff);margin-bottom:0.75rem;';

    const msgEl = document.createElement('p');
    msgEl.textContent = mensaje;
    msgEl.style.cssText = 'font-size:0.875rem;color:var(--on-surface-variant, #aaa);margin-bottom:1.5rem;line-height:1.5;';

    const btnAceptar = document.createElement('button');
    btnAceptar.type = 'button';
    btnAceptar.textContent = 'Aceptar';
    btnAceptar.style.cssText = 'padding:0.5rem 1.5rem;border-radius:0.5rem;border:none;background:#6366f1;color:#fff;font-size:0.875rem;font-weight:600;cursor:pointer;';

    dialog.appendChild(titleEl);
    dialog.appendChild(msgEl);
    dialog.appendChild(btnAceptar);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const cleanup = () => {
      overlay.remove();
      resolve(true);
    };

    btnAceptar.addEventListener('click', cleanup);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cleanup();
    });
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escHandler);
        cleanup();
      }
    });
  });
}

window.mostrarConfirmacion = mostrarConfirmacion;
window.mostrarAlerta = mostrarAlerta;
