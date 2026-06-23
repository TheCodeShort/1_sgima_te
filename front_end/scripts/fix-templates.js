const fs = require('fs');
const path = require('path');

const VIEWS_DIR = path.resolve(__dirname, '../src/views');

const FOLDERS = fs.readdirSync(VIEWS_DIR).filter((f) => {
  const p = path.join(VIEWS_DIR, f, 'index.html');
  return fs.existsSync(p) && fs.statSync(path.join(VIEWS_DIR, f)).isDirectory();
});

function fixTemplate(folder) {
  const file = path.join(VIEWS_DIR, folder, 'index.html');
  let html = fs.readFileSync(file, 'utf8');

  html = html.replace(/\smd:ml-\[260px\]/g, '');
  html = html.replace(/\smd:ml-sidebar-width/g, '');
  html = html.replace(/\sml-0 md:ml-\[260px\]/g, '');

  if (folder === 'iniciar-sesion' && !html.includes('data-view="iniciar-sesion"')) {
    html = `<div class="view-page" data-view="iniciar-sesion">\n${html}\n</div>`;
  }

  if (folder === 'registrar-falla' && !html.includes('data-view="registrar-falla"')) {
    html = `<div class="view-page" data-view="registrar-falla">\n${html}\n</div>`;
  }

  if (folder === 'cargar-evidencia' && !html.includes('data-view="cargar-evidencia"')) {
    html = `<div class="view-page flex flex-col min-h-screen" data-view="cargar-evidencia">\n${html}\n</div>`;
  }

  html = html.replace(
    /(<button[^>]*class="[^"]*bg-primary[^"]*"[^>]*type="button"[^>]*)>/gi,
    (m, p1) => {
      if (m.includes('data-action')) return m;
      if (/Nueva Falla|Registrar Falla/i.test(m)) return `${p1} data-action="registrar-falla">`;
      return m;
    }
  );

  html = html.replace(
    /Guardar Registro/g,
    'Guardar Registro'
  );

  if (folder.includes('panel-')) {
    html = html.replace(
      /(<a[^>]*>\s*<span class="material-symbols-outlined[^"]*">settings_suggest<\/span>\s*<span[^>]*>Equipos<\/span>\s*<\/a>)/gi,
      '<a href="#" data-nav="equipos" class="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all duration-200 rounded-lg"><span class="material-symbols-outlined">settings_suggest</span><span class="text-body-sm font-body-sm">Equipos</span></a>'
    );
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Fixed: ${folder}`);
}

FOLDERS.forEach(fixTemplate);
