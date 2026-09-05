const REGEX_NOMBRE = /^[A-Za-zÀ-ÖØ-öø-ÿñÑ\s\-_]{3,100}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mostrarErrorCampo(root, idMensaje, texto, tipo) {
  const el = root.querySelector(`#${idMensaje}`);
  if (!el) return;
  el.textContent = texto;
  el.style.display = 'block';
  el.classList.remove('text-error', 'text-warning');
  el.classList.add(tipo === 'bloqueante' ? 'text-error' : 'text-warning');
}

function limpiarErrorCampo(root, idMensaje) {
  const el = root.querySelector(`#${idMensaje}`);
  if (!el) return;
  el.style.display = 'none';
  el.textContent = '';
}

function validarNombre(valor) {
  if (!valor || valor.trim() === '') {
    return 'Este campo es obligatorio.';
  }
  if (!REGEX_NOMBRE.test(valor.trim())) {
    return 'Solo se permiten letras, espacios, guiones (-) y guion bajo (_). Sin números ni otros símbolos.';
  }
  return null;
}

function validarEmail(valor) {
  if (!valor || valor.trim() === '') {
    return 'Este campo es obligatorio.';
  }
  if (!REGEX_EMAIL.test(valor.trim())) {
    return 'Ingrese un correo electrónico válido, con formato usuario@dominio.com';
  }
  return null;
}

window.ValidadorHelper = {
  validarNombre,
  validarEmail,
  mostrarErrorCampo,
  limpiarErrorCampo
};
