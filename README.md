# The Ballet Pianist

Lecteur de musique pour cours de danse : le tempo se règle en direct (40 à 160 %) sans changer la hauteur du son.

Développé par / Developed by Aymeric Guilluy-Eyraud

- Les musiques restent **dans le navigateur de chaque utilisateur** (IndexedDB) : rien n'est envoyé à un serveur.
- Étirement temporel en temps réel par [Rubber Band](https://breakfastquay.com/rubberband/) (WebAssembly, licence GPL v2 ou ultérieure, voir `NOTICE.md`), calculé dans un Worker (`dsp-worker.js`) et joué par un AudioWorklet (`stretch-processor.js`).
- Site statique sans étape de build : `index.html` + quelques fichiers. Utilisable hors connexion (`sw.js`) et installable sur l'écran d'accueil (`manifest.webmanifest`).

## Tester en local

```bash
python3 -m http.server 3050
```

puis ouvrir http://localhost:3050 (un serveur est nécessaire : les Workers et le service worker ne fonctionnent pas en `file://`).

## Formats

MP3, M4A/AAC, WAV, FLAC, Ogg. Le WMA n'est lisible par aucun navigateur : le convertir d'abord (par exemple avec `ffmpeg -i in.wma -c:a libmp3lame -q:a 2 out.mp3`).

## Licence

Le code est distribué sous licence **GNU GPL version 2 ou ultérieure** (`GPL-2.0-or-later`), voir [`LICENSE`](LICENSE).
Les composants tiers et le code source correspondant sont indiqués dans [`NOTICE.md`](NOTICE.md).
Le nom « The Ballet Pianist », le logo et les icônes **ne sont pas couverts** par cette licence (tous droits réservés).

## License

The code is distributed under the **GNU GPL version 2 or later** (`GPL-2.0-or-later`), see [`LICENSE`](LICENSE).
Third-party components and their corresponding source code are listed in [`NOTICE.md`](NOTICE.md).
The name "The Ballet Pianist", the logo and the icons are **not covered** by this license (all rights reserved).
