// SPDX-License-Identifier: GPL-2.0-or-later
/* Thème : Auto (suit l'appareil), Clair ou Sombre. Le choix est mémorisé sur l'appareil.
   Chargé dans le <head> pour appliquer le thème avant l'affichage (pas de flash). */
(() => {
  const KEY = 'theme';
  const get = () => { try { const v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : 'auto'; } catch (e) { return 'auto'; } };
  const apply = () => {
    const v = get(), root = document.documentElement;
    if (v === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', v);
    document.querySelectorAll('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeBtn === v)));
  };
  window.THEME = {
    get,
    set(v) { try { if (v === 'auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY, v); } catch (e) {} apply(); },
  };
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-btn]').forEach(b => { b.onclick = () => window.THEME.set(b.dataset.themeBtn); });
    apply();
  });
})();
