const API_BASE_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:8080/api'
  : 'https://sigma-te-back.up.railway.app/api';
window.API_BASE_URL = API_BASE_URL;

let cerrandoSesionPor401 = false;
function fetchConAuth(url, opciones = {}) {
  const token = sessionStorage.getItem('sigma_token');
  const headers = {
    ...(opciones.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  return fetch(url, { ...opciones, headers }).then((resp) => {
    if (resp.status === 401 && token && !cerrandoSesionPor401) {
      cerrandoSesionPor401 = true;
      if (typeof showToast === 'function') {
        showToast('Tu sesión ya no es válida. Vuelve a iniciar sesión.', 'error');
      }
      sessionStorage.removeItem('sigma_token');
      sessionStorage.removeItem('sigma_usuario');
      AppState.clear();
      if (window.Router) {
        window.Router.updateSidebarNavigation();
        window.Router.navigate('iniciar-sesion');
      }
      setTimeout(() => { cerrandoSesionPor401 = false; }, 3000);
    }
    return resp;
  });
}

window.fetchConAuth = fetchConAuth;