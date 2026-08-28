const API_BASE_URL = 'http://localhost:8080/api';
window.API_BASE_URL = API_BASE_URL;

function fetchConAuth(url, opciones = {}) {
  const token = sessionStorage.getItem('sigma_token');
  const headers = {
    ...(opciones.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  return fetch(url, { ...opciones, headers });
}

window.fetchConAuth = fetchConAuth;
