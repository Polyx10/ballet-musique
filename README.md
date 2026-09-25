# Musique de classe

Lecteur de musique pour cours de danse : le tempo se règle en direct (40 à 160 %) sans changer la hauteur du son.

- Les musiques restent **dans le navigateur de chaque utilisateur** (IndexedDB) : rien n'est envoyé à un serveur.
- Étirement temporel en temps réel par [Rubber Band](https://breakfastquay.com/rubberband/) (WebAssembly, licence GPL, voir `vendor/LICENSE-rubberband.txt`), calculé dans un Worker (`dsp-worker.js`) et joué par un AudioWorklet (`stretch-processor.js`).
- Site statique sans étape de build : `index.html` + quelques fichiers. Utilisable hors connexion (`sw.js`) et installable sur l'écran d'accueil (`manifest.webmanifest`).

## Tester en local

```bash
python3 -m http.server 3050
```

puis ouvrir http://localhost:3050 (un serveur est nécessaire : les Workers et le service worker ne fonctionnent pas en `file://`).

## Formats

MP3, M4A/AAC, WAV, FLAC, Ogg. Le WMA n'est lisible par aucun navigateur : le convertir d'abord (par exemple avec `ffmpeg -i in.wma -c:a libmp3lame -q:a 2 out.mp3`).
