/**
 * Genera script.js mejorado para cada vista
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const VIEW_SCRIPTS = {
  iniciar_sesi_n: `function initView(ctx) {
  const form = document.getElementById('login-form');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  themeToggle?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    if (themeIcon) themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username')?.value?.trim() || 'usuario';
    const role = detectRole(username);
    AppState.setUser(username, role);
    ctx.navigate(AppState.getPanelRoute());
  });
}

function detectRole(username) {
  const u = username.toLowerCase();
  if (u.includes('admin')) return 'admin';
  if (u.includes('audit')) return 'auditor';
  if (u.includes('super')) return 'supervisor';
  if (u.includes('tec') || u.includes('téc')) return 'tecnico';
  return 'operario';
}

window.initView = initView;`,

  registrar_falla: `function initView(ctx) {
  const root = document.querySelector('[data-view="registrar_falla"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const formatted = \`\${now.getFullYear()}-\${pad(now.getMonth() + 1)}-\${pad(now.getDate())} \${pad(now.getHours())}:\${pad(now.getMinutes())}\`;
  const dtElement = document.getElementById('current-datetime');
  if (dtElement) dtElement.textContent = formatted;

  root.querySelector('button.bg-primary, button[type="submit"]')?.addEventListener('click', (e) => {
    if (e.target.closest('form') || e.target.textContent.includes('Registrar')) {
      e.preventDefault();
      ctx.navigate('cargar_evidencia');
    }
  });

  root.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent.trim() === 'Cancelar') {
      btn.addEventListener('click', () => ctx.navigate('equipos'));
    }
  });
}

window.initView = initView;`,

  cargar_evidencia: `function initView(ctx) {
  const root = document.querySelector('[data-view="cargar_evidencia"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  const fileInput = root.querySelector('#file-upload');
  fileInput?.addEventListener('change', () => {
    const count = fileInput.files?.length || 0;
    if (count > 0) {
      const badge = root.querySelector('.font-status-micro.text-status-micro');
      if (badge) badge.textContent = \`\${count} ELEMENTOS\`;
    }
  });

  root.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent.includes('Finalizar')) {
      btn.addEventListener('click', () => ctx.navigate(AppState.getPanelRoute()));
    }
    if (btn.textContent.includes('Descartar')) {
      btn.addEventListener('click', () => ctx.navigate('registrar_mantenimiento'));
    }
  });
}

window.initView = initView;`,

  registrar_mantenimiento: `function initView(ctx) {
  const root = document.querySelector('[data-view="registrar_mantenimiento"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  root.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent.includes('Guardar')) {
      btn.addEventListener('click', () => ctx.navigate('cargar_evidencia'));
    }
    if (btn.textContent.includes('Volver')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        ctx.navigate('detalle_del_equipo');
      });
    }
  });
}

window.initView = initView;`,

  detalle_del_equipo: `function initView(ctx) {
  const root = document.querySelector('[data-view="detalle_del_equipo"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  root.querySelectorAll('button').forEach((btn) => {
    const text = btn.textContent.trim();
    if (text.includes('Registrar Falla')) btn.setAttribute('data-action', 'registrar-falla');
    if (text.includes('Nuevo Mantenimiento')) btn.setAttribute('data-action', 'registrar-mantenimiento');
  });

  bindViewNavigation(root, ctx);
}

window.initView = initView;`,

  estado_de_sincronizaci_n: `function initView(ctx) {
  const root = document.querySelector('[data-view="estado_de_sincronizaci_n"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  root.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent.includes('Forzar Sincronización')) {
      btn.addEventListener('click', () => {
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Sincronizando...';
        setTimeout(() => ctx.navigate(AppState.getPanelRoute()), 1500);
      });
    }
  });
}

window.initView = initView;`,

  gesti_n_de_usuarios_y_roles: `function initView(ctx) {
  const root = document.querySelector('[data-view="gesti_n_de_usuarios_y_roles"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);
}

window.initView = initView;`,
};

const DEFAULT = (folder) => `function initView(ctx) {
  const root = document.querySelector('[data-view="${folder}"]') || document.getElementById('app-root');
  bindViewNavigation(root, ctx);

  root.querySelectorAll('button, a').forEach((el) => {
    const text = el.textContent.trim();
    if (/^Equipos$/i.test(text)) el.setAttribute('data-nav', 'equipos');
    if (/Nueva Falla/i.test(text)) el.setAttribute('data-action', 'registrar-falla');
    if (/Usuarios/i.test(text)) el.setAttribute('data-nav', 'gesti_n_de_usuarios_y_roles');
    if (/Sincron/i.test(text) && el.tagName === 'BUTTON') el.setAttribute('data-action', 'sync');
    if (/Cerrar Sesión/i.test(text)) el.setAttribute('data-action', 'logout');
  });

  bindViewNavigation(root, ctx);
}

window.initView = initView;`;

const folders = fs.readdirSync(ROOT).filter((f) => fs.existsSync(path.join(ROOT, f, 'template.html')));

folders.forEach((folder) => {
  const content = VIEW_SCRIPTS[folder] || DEFAULT(folder);
  fs.writeFileSync(path.join(ROOT, folder, 'script.js'), content, 'utf8');
  console.log(`Script: ${folder}`);
});

console.log('Scripts actualizados.');
