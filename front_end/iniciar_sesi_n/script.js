function initView(ctx) {
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

window.initView = initView;