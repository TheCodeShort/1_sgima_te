/**
 * Router SPA nativo — SIGMA-TE
 */
const ROUTES = {
  'iniciar-sesion': {
    path: 'src/views/iniciar-sesion',
    title: 'Iniciar Sesión',
    fullscreen: true,
    group: 'auth',
    js: 'login.js',
    css: 'login.css',
  },
  'panel-administrador': {
    path: 'src/views/panel-administrador',
    title: 'Panel Administrador',
    group: 'panels',
    js: 'administrador.js',
    css: 'administrador.css',
  },
  'panel-auditor': {
    path: 'src/views/panel-auditor',
    title: 'Panel Auditor',
    group: 'panels',
    js: 'auditor.js',
    css: 'auditor.css',
  },
  'panel-operario': {
    path: 'src/views/panel-operario',
    title: 'Panel Operario',
    group: 'panels',
    js: 'operario.js',
    css: 'operario.css',
  },
  'panel-supervisor': {
    path: 'src/views/panel-supervisor',
    title: 'Panel Supervisor',
    group: 'panels',
    js: 'supervisor.js',
    css: 'supervisor.css',
  },
  'panel-tecnico': {
    path: 'src/views/panel-tecnico',
    title: 'Panel Técnico',
    group: 'panels',
    js: 'tecnico.js',
    css: 'tecnico.css',
  },
  equipos: {
    path: 'src/views/equipos',
    title: 'Equipos',
    group: 'operations',
    js: 'equipos.js',
    css: 'equipos.css',
  },
  'detalle-equipo': {
    path: 'src/views/detalle-equipo',
    title: 'Detalle del Equipo',
    group: 'operations',
    js: 'detalle.js',
    css: 'detalle.css',
  },
  'registrar-falla': {
    path: 'src/views/registrar-falla',
    title: 'Registrar Falla',
    group: 'operations',
    js: 'registrar-falla.js',
    css: 'registrar-falla.css',
  },
  'registrar-mantenimiento': {
    path: 'src/views/registrar-mantenimiento',
    title: 'Registrar Mantenimiento',
    group: 'operations',
    js: 'mantenimiento.js',
    css: 'mantenimiento.css',
  },
  'cargar-evidencia': {
    path: 'src/views/cargar-evidencia',
    title: 'Cargar Evidencia',
    group: 'operations',
    js: 'evidencia.js',
    css: 'evidencia.css',
  },
  'gestion-usuarios-roles': {
    path: 'src/views/gestion-usuarios-roles',
    title: 'Usuarios y Roles',
    group: 'admin',
    js: 'gestion.js',
    css: 'gestion.css',
  },
  'estado-sincronizacion': {
    path: 'src/views/estado-sincronizacion',
    title: 'Estado de Sincronización',
    group: 'admin',
    js: 'sincronizacion.js',
    css: 'sincronizacion.css',
  },
};

const Router = {
  currentRoute: null,
  currentScript: null,
  viewStyleEl: null,

  init() {
    window.addEventListener('hashchange', () => this.handleHash());
    document.addEventListener('click', (e) => this.handleNavClick(e));
    this.initSidebar();
    this.initThemeToggle();
    this.handleHash();
  },

  initSidebar() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const sidebar = document.getElementById('global-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    toggle?.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
      overlay?.classList.toggle('open');
    });

    overlay?.addEventListener('click', () => {
      sidebar?.classList.remove('open');
      overlay?.classList.remove('open');
    });
  },

  initThemeToggle() {
    const btn = document.getElementById('global-theme-toggle');
    const icon = document.getElementById('global-theme-icon');
    if (!btn) return;

    btn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
    });
  },

  handleNavClick(e) {
    const link = e.target.closest('[data-route]');
    if (!link) return;
    e.preventDefault();
    const route = link.getAttribute('data-route');
    this.navigate(route);
    document.getElementById('global-sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('open');
  },

  handleHash() {
    const hash = window.location.hash.replace(/^#\/?/, '') || 'iniciar-sesion';
    const routeKey = ROUTES[hash] ? hash : 'iniciar-sesion';
    this.loadView(routeKey);
  },

  navigate(routeKey, pushHash = true) {
    if (!ROUTES[routeKey]) {
      console.warn(`Ruta desconocida: ${routeKey}`);
      return;
    }
    if (pushHash) {
      window.location.hash = `#/${routeKey}`;
    } else {
      this.loadView(routeKey);
    }
  },

  updateActiveNav(routeKey) {
    document.querySelectorAll('[data-route]').forEach((el) => {
      el.classList.toggle('active', el.getAttribute('data-route') === routeKey);
    });
  },

  setLayout(routeKey) {
    const shell = document.getElementById('app-shell');
    const route = ROUTES[routeKey];
    if (shell) {
      shell.classList.toggle('layout-fullscreen', Boolean(route?.fullscreen));
    }
  },

  removeViewAssets() {
    if (this.viewStyleEl) {
      this.viewStyleEl.remove();
      this.viewStyleEl = null;
    }
    if (this.currentScript) {
      this.currentScript.remove();
      this.currentScript = null;
    }
  },

  async loadView(routeKey) {
    const route = ROUTES[routeKey];
    if (!route) return;

    this.currentRoute = routeKey;
    this.updateActiveNav(routeKey);
    this.setLayout(routeKey);
    document.title = `SIGMA-TE — ${route.title}`;

    const root = document.getElementById('app-root');
    if (!root) return;

    root.innerHTML = '<div class="view-loading"><span class="material-symbols-outlined animate-spin">progress_activity</span></div>';

    this.removeViewAssets();

    try {
      const templateRes = await fetch(`${route.path}/index.html`);
      if (!templateRes.ok) throw new Error(`No se pudo cargar ${route.path}/index.html`);
      const html = await templateRes.text();
      root.innerHTML = html;

      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = `${route.path}/${route.css}?v=${Date.now()}`;
      styleLink.id = 'view-stylesheet';
      styleLink.dataset.route = routeKey;
      document.head.appendChild(styleLink);
      this.viewStyleEl = styleLink;

      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${route.path}/${route.js}?v=${Date.now()}`;
        script.id = 'view-script';
        script.dataset.route = routeKey;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Error cargando ${route.path}/${route.js}`));
        document.body.appendChild(script);
        this.currentScript = script;
      });

      if (typeof window.initView === 'function') {
        window.initView({ route: routeKey, navigate: (r) => this.navigate(r) });
      }
    } catch (err) {
      console.error(err);
      root.innerHTML = `<div class="view-loading"><p>Error al cargar la vista: ${err.message}</p></div>`;
    }
  },
};

window.Router = Router;
window.ROUTES = ROUTES;

document.addEventListener('DOMContentLoaded', () => Router.init());
