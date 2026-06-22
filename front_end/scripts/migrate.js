/**
 * Script de migración: separa code.html en template.html, style.css y script.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const FOLDERS = [
  'cargar_evidencia',
  'detalle_del_equipo',
  'equipos',
  'estado_de_sincronizaci_n',
  'gesti_n_de_usuarios_y_roles',
  'iniciar_sesi_n',
  'panel_del_administrador',
  'panel_del_auditor',
  'panel_del_operario',
  'panel_del_supervisor',
  'panel_del_t_cnico',
  'registrar_falla',
  'registrar_mantenimiento',
];

function extractStyles(html) {
  const styles = [];
  const cleaned = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => {
    styles.push(css.trim());
    return '';
  });
  return { html: cleaned, css: styles.join('\n\n') };
}

function extractScripts(html) {
  const scripts = [];
  const cleaned = html.replace(/<script(?![^>]*tailwind-config)[^>]*>([\s\S]*?)<\/script>/gi, (_, js) => {
    if (js.trim()) scripts.push(js.trim());
    return '';
  });
  return { html: cleaned, js: scripts.join('\n\n') };
}

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1].trim() : html;
}

function stripEmbeddedNav(body) {
  let result = body;
  result = result.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  result = result.replace(/<aside[\s\S]*?<\/aside>/gi, '');
  result = result.replace(/<!-- SideNavBar[\s\S]*?-->/gi, '');
  result = result.replace(/<!-- SIDE NAV BAR[\s\S]*?-->/gi, '');
  result = result.replace(/<!-- TopNavBar[\s\S]*?Shell[\s\S]*?-->/gi, '');
  return result.trim();
}

function unwrapMainContent(body, folder) {
  const fullscreenViews = ['iniciar_sesi_n', 'registrar_falla', 'cargar_evidencia'];
  if (fullscreenViews.includes(folder)) {
    return body;
  }

  const stripped = stripEmbeddedNav(body);

  const mainMatch = stripped.match(/<main[^>]*>([\s\S]*)<\/main>/i);
  if (mainMatch) {
    return `<div class="view-page" data-view="${folder}">\n${mainMatch[0]}\n</div>`;
  }

  const wrapperMatch = stripped.match(/<div class="flex-1 flex flex-col[\s\S]*$/i);
  if (wrapperMatch) {
    return `<div class="view-page" data-view="${folder}">\n${wrapperMatch[0]}\n</div>`;
  }

  return `<div class="view-page" data-view="${folder}">\n${stripped}\n</div>`;
}

function defaultScript(folder) {
  return `/**
 * Vista: ${folder}
 */
function initView(ctx) {
  const root = document.querySelector('[data-view="${folder}"]') || document.getElementById('app-root');
  if (!root) return;

  bindNavigation(root, ctx);
}

function bindNavigation(root, ctx) {
  root.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const route = el.getAttribute('data-nav');
      if (route) ctx.navigate(route);
    });
  });

  root.querySelectorAll('[data-action="registrar-falla"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      ctx.navigate('registrar_falla');
    });
  });

  root.querySelectorAll('[data-action="registrar-mantenimiento"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      ctx.navigate('registrar_mantenimiento');
    });
  });

  root.querySelectorAll('[data-action="cargar-evidencia"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      ctx.navigate('cargar_evidencia');
    });
  });

  root.querySelectorAll('[data-action="detalle-equipo"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      ctx.navigate('detalle_del_equipo');
    });
  });

  root.querySelectorAll('[data-action="equipos"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      ctx.navigate('equipos');
    });
  });

  root.querySelectorAll('[data-action="volver"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.back();
    });
  });
}

window.initView = initView;
`;
}

function enhanceTemplate(html, folder) {
  let result = html;

  result = result.replace(
    /<button([^>]*?)>\s*Nueva Falla\s*<\/button>/gi,
    '<button$1 data-action="registrar-falla">Nueva Falla</button>'
  );

  result = result.replace(
    /<button([^>]*?)>\s*Registrar Falla\s*<\/button>/gi,
    '<button$1 data-action="registrar-falla">Registrar Falla</button>'
  );

  result = result.replace(
    /<button([^>]*?)>\s*Nuevo Mantenimiento\s*<\/button>/gi,
    '<button$1 data-action="registrar-mantenimiento">Nuevo Mantenimiento</button>'
  );

  result = result.replace(
    /title="Ver detalle"[^>]*>/gi,
    (m) => m.replace('>', ' data-action="detalle-equipo">')
  );

  result = result.replace(
    /<button([^>]*?)>\s*<span class="material-symbols-outlined">arrow_back<\/span>/gi,
    '<button$1 data-action="volver"><span class="material-symbols-outlined">arrow_back</span>'
  );

  result = result.replace(
    /<button([^>]*?)>\s*<span class="material-symbols-outlined text-\[20px\] group-hover:-translate-x-1[^"]*">arrow_back<\/span>/gi,
    '<button$1 data-action="volver"><span class="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>'
  );

  if (folder === 'iniciar_sesi_n') {
    result = result.replace(
      /<form([^>]*)>/i,
      '<form$1 id="login-form">'
    );
    result = result.replace(
      /type="submit"/,
      'type="submit" id="login-submit"'
    );
  }

  return result;
}

function loginScript() {
  return `function initView(ctx) {
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
  if (u.includes('oper')) return 'operario';
  return 'operario';
}

window.initView = initView;
`;
}

function registrarFallaScript() {
  return `function initView(ctx) {
  const root = document.querySelector('[data-view="registrar_falla"]') || document.getElementById('app-root');
  bindNavigation(root, ctx);

  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const formatted = \`\${now.getFullYear()}-\${pad(now.getMonth() + 1)}-\${pad(now.getDate())} \${pad(now.getHours())}:\${pad(now.getMinutes())}\`;
  const dtElement = document.getElementById('current-datetime');
  if (dtElement) dtElement.textContent = formatted;

  root.querySelector('[data-action="volver"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    ctx.navigate('equipos');
  });

  root.querySelector('button[type="submit"], .bg-primary.text-on-primary')?.addEventListener('click', (e) => {
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

function bindNavigation(root, ctx) {
  root.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); ctx.navigate(el.getAttribute('data-nav')); });
  });
  root.querySelectorAll('[data-action="volver"]').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); ctx.navigate('equipos'); });
  });
}

window.initView = initView;
`;
}

function migrateFolder(folder) {
  const codePath = path.join(ROOT, folder, 'code.html');
  if (!fs.existsSync(codePath)) {
    console.warn(`Omitido (no existe): ${folder}/code.html`);
    return;
  }

  let html = fs.readFileSync(codePath, 'utf8');
  const { html: noStyles, css } = extractStyles(html);
  const { html: noScripts, js: extractedJs } = extractScripts(noStyles);
  let body = extractBody(noScripts);
  body = unwrapMainContent(body, folder);
  body = enhanceTemplate(body, folder);

  const viewCss = css || `/* Estilos específicos: ${folder} */\n.view-page[data-view="${folder}"] { min-height: 100%; }\n`;

  let viewJs = extractedJs;
  if (folder === 'iniciar_sesi_n') {
    viewJs = loginScript();
  } else if (folder === 'registrar_falla') {
    viewJs = registrarFallaScript();
  } else if (!viewJs.trim()) {
    viewJs = defaultScript(folder);
  } else if (!viewJs.includes('initView')) {
    viewJs = defaultScript(folder).replace('function initView', `/* Script original */\n${viewJs}\n\nfunction initView`);
  }

  fs.writeFileSync(path.join(ROOT, folder, 'template.html'), body, 'utf8');
  fs.writeFileSync(path.join(ROOT, folder, 'style.css'), viewCss, 'utf8');
  fs.writeFileSync(path.join(ROOT, folder, 'script.js'), viewJs, 'utf8');
  fs.unlinkSync(codePath);

  const screenPath = path.join(ROOT, folder, 'screen.png');
  if (fs.existsSync(screenPath)) {
    fs.unlinkSync(screenPath);
  }

  console.log(`✓ Migrado: ${folder}`);
}

FOLDERS.forEach(migrateFolder);
console.log('\nMigración completada.');
