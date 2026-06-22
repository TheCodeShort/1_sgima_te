const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const FOLDERS = fs.readdirSync(ROOT).filter((f) => {
  const p = path.join(ROOT, f, 'template.html');
  return fs.existsSync(p) && fs.statSync(path.join(ROOT, f)).isDirectory();
});

function fixTemplate(folder) {
  const file = path.join(ROOT, folder, 'template.html');
  let html = fs.readFileSync(file, 'utf8');

  html = html.replace(/\smd:ml-\[260px\]/g, '');
  html = html.replace(/\smd:ml-sidebar-width/g, '');
  html = html.replace(/\sml-0 md:ml-\[260px\]/g, '');

  if (folder === 'iniciar_sesi_n' && !html.includes('data-view="iniciar_sesi_n"')) {
    html = `<div class="view-page" data-view="iniciar_sesi_n">\n${html}\n</div>`;
  }

  if (folder === 'registrar_falla' && !html.includes('data-view="registrar_falla"')) {
    html = `<div class="view-page" data-view="registrar_falla">\n${html}\n</div>`;
  }

  if (folder === 'cargar_evidencia' && !html.includes('data-view="cargar_evidencia"')) {
    html = `<div class="view-page flex flex-col min-h-screen" data-view="cargar_evidencia">\n${html}\n</div>`;
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

  if (folder.includes('panel_del_')) {
    html = html.replace(
      /(<a[^>]*>\s*<span class="material-symbols-outlined[^"]*">settings_suggest<\/span>\s*<span[^>]*>Equipos<\/span>\s*<\/a>)/gi,
      '<a href="#" data-nav="equipos" class="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all duration-200 rounded-lg"><span class="material-symbols-outlined">settings_suggest</span><span class="text-body-sm font-body-sm">Equipos</span></a>'
    );
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Fixed: ${folder}`);
}

FOLDERS.forEach(fixTemplate);
