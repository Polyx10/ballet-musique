// SPDX-License-Identifier: GPL-2.0-or-later
/* Permet d'ouvrir l'outil sans connexion (salle de cours sans wifi). Les musiques sont déjà dans le navigateur. */
const CACHE = 'musique-classe-v17';
const FILES = ['./', 'index.html', 'aide.html', 'mentions-legales.html', 'don.html', 'i18n.js', 'theme.js', 'stretch-processor.js', 'dsp-worker.js', 'vendor/rubberband.umd.min.js', 'vendor/rubberband.wasm', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'logo-emblem.png', 'apple-touch-icon.png', 'og-image.png'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Réponse immédiate depuis le cache, mise à jour en arrière-plan pour la prochaine ouverture.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
