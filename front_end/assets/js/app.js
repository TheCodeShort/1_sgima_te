/**
 * Enrutador SPA nativo — SIGMA-TE
 */
const ROUTES = {
  'iniciar-sesion': {
    path: 'src/views/iniciar-sesion',
    title: 'Iniciar Sesión',
    fullscreen: true,
    group: 'auth',
    public: true,
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
    this.initTheme();
    window.addEventListener('hashchange', () => this.handleHash());
    document.addEventListener('click', (e) => this.handleNavClick(e));
    this.initSidebar();
    this.initThemeToggle();
    this.initLogout();
    this.handleHash();
  },

  initTheme() {
    const saved = localStorage.getItem('sigma_theme');
    const prefersDark = saved ? saved === 'dark' : true;
    document.documentElement.classList.toggle('dark', prefersDark);
    this.syncThemeIcons(prefersDark);
  },

  syncThemeIcons(isDark) {
    const iconName = isDark ? 'light_mode' : 'dark_mode';
    document.querySelectorAll('#global-theme-icon, #themeIcon').forEach((icon) => {
      icon.textContent = iconName;
    });
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
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isDark = !document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('sigma_theme', isDark ? 'dark' : 'light');
      this.syncThemeIcons(isDark);
    });
  },

  initLogout() {
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      this.logout();
    });
  },

  logout() {
    const result = typeof AuthService !== 'undefined'
      ? AuthService.logout()
      : { message: 'Sesión cerrada.' };
    AppState.clear();
    if (typeof showToast === 'function') {
      showToast(result.message, 'info');
    }
    this.navigate('iniciar-sesion');
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
    const resolved = this.resolveRoute(routeKey);
    if (resolved !== routeKey) {
      window.location.replace(`#/${resolved}`);
      return;
    }
    this.loadView(resolved);
  },

  resolveRoute(routeKey) {
    const route = ROUTES[routeKey];
    if (!route) return 'iniciar-sesion';

    if (routeKey === 'iniciar-sesion' && AppState.isAuthenticated()) {
      return AppState.getPanelRoute();
    }

    if (!route.public && !AppState.isAuthenticated()) {
      if (typeof showToast === 'function') {
        showToast('Debe iniciar sesión para acceder a esta sección.', 'warning');
      }
      return 'iniciar-sesion';
    }

    return routeKey;
  },

  navigate(routeKey, pushHash = true) {
    const resolved = this.resolveRoute(routeKey);
    if (!ROUTES[resolved]) {
      console.warn(`Ruta desconocida: ${routeKey}`);
      return;
    }
    if (pushHash) {
      window.location.hash = `#/${resolved}`;
    } else {
      this.loadView(resolved);
    }
  },

  updateActiveNav(routeKey) {
    document.querySelectorAll('[data-route]').forEach((el) => {
      el.classList.toggle('active', el.getAttribute('data-route') === routeKey);
    });
  },

  updateSidebarUser() {
    const label = document.getElementById('sidebar-user-label');
    if (!label) return;

    if (AppState.isAuthenticated()) {
      label.textContent = `${AppState.displayName || AppState.user} · ${AppState.getRoleLabel(AppState.role)}`;
      label.hidden = false;
    } else {
      label.hidden = true;
      label.textContent = '';
    }
  },

  setLayout(routeKey) {
    const shell = document.getElementById('app-shell');
    const route = ROUTES[routeKey];
    if (shell) {
      shell.classList.toggle('layout-fullscreen', Boolean(route?.fullscreen));
    }
    this.updateSidebarUser();
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
    window.initView = undefined;
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

    root.innerHTML = `
      <div class="view-loading" role="status" aria-live="polite">
        <span class="material-symbols-outlined animate-spin">progress_activity</span>
        <span>Cargando vista…</span>
      </div>
    `;

    this.removeViewAssets();

    try {
      const templateRes = await fetch(`${route.path}/index.html`);
      if (!templateRes.ok) throw new Error(`No se pudo cargar la plantilla de ${route.title}`);
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
        script.onerror = () => reject(new Error(`No se pudo cargar el script de ${route.title}`));
        document.body.appendChild(script);
        this.currentScript = script;
      });

      if (typeof window.initView === 'function') {
        window.initView({ route: routeKey, navigate: (r) => this.navigate(r) });
      }
    } catch (err) {
      console.error(err);
      root.innerHTML = `
        <div class="view-loading view-loading--error" role="alert">
          <span class="material-symbols-outlined">error</span>
          <p>No se pudo cargar la vista.</p>
          <p class="view-loading__detail">${err.message}</p>
          <button type="button" class="view-loading__retry" data-route="iniciar-sesion">Volver al inicio</button>
        </div>
      `;
      root.querySelector('.view-loading__retry')?.addEventListener('click', () => {
        this.navigate('iniciar-sesion');
      });
    }
  },
};

window.Router = Router;
window.ROUTES = ROUTES;

document.addEventListener('DOMContentLoaded', () => Router.init());
