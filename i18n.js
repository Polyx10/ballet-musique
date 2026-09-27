/* Français / English. La langue vient du navigateur, ou du choix de l'utilisateur (mémorisé sur l'appareil). */
(() => {
  const D = {
    fr: {
      appTitle: 'The Ballet Pianist', helpTitle: "Mode d'emploi — The Ballet Pianist", backToApp: '← Retour au lecteur',
      player: 'Lecture', pick: 'Choisis un morceau',
      back: 'Reculer de 5 s', fwd: 'Avancer de 5 s', playPause: 'Lecture / pause', position: 'Position',
      volume: 'Volume', clarity: 'Clarté', qualityReset: 'Qualité audio réinitialisée sur cet appareil.', resetQuality: 'Réinitialiser la qualité audio sur cet appareil', tempo: 'Tempo', reset: "Tempo d'origine (100 %)",
      setA: 'Départ de boucle', setB: 'Fin de boucle', clearLoop: 'Effacer',
      auto: 'Enchaîner avec le morceau suivant',
      shortcuts: 'Raccourcis : espace = lecture · ↑ ↓ = tempo ±1 % · ← → = ±5 s',
      library: 'Bibliothèque', drop: 'Glisse ici des fichiers ou un dossier de musique',
      addFiles: 'Ajouter des fichiers…', addFolder: 'Ajouter un dossier…', search: 'Rechercher…',
      selAll: 'Tout sélectionner', help: "Mode d'emploi", helpOther: 'User guide', switchLang: 'English',
      noResult: 'Aucun résultat.', emptyLib: 'Bibliothèque vide. Ajoute de la musique.', remove: 'Retirer',
      confirmOne: "Retirer « {name} » de la bibliothèque ? (le fichier d'origine reste sur ton appareil)",
      delSel0: 'Retirer la sélection', delSelN: 'Retirer la sélection ({n})',
      confirmMany: ["Retirer {n} morceau de la bibliothèque ? (le fichier d'origine reste sur ton appareil)", "Retirer {n} morceaux de la bibliothèque ? (les fichiers d'origine restent sur ton appareil)"],
      removed: ['{n} morceau retiré.', '{n} morceaux retirés.'],
      noAudio: 'Aucun fichier audio reconnu.', importing: 'Import… {a} / {b}', importErr: "Erreur d'import : {e}",
      added: ['{n} morceau ajouté', '{n} morceaux ajoutés'], skipped: [', {n} déjà présent', ', {n} déjà présents'],
      firefoxPersist: "Si Firefox te demande d'autoriser le stockage permanent, accepte : sinon tes musiques risquent d'être effacées.",
      unreadable: '{name} — format non lisible par le navigateur',
      prevTrack: 'Morceau précédent', nextTrack: 'Morceau suivant',
      delay: 'Départ différé', delayNone: 'Aucun', startingIn: 'Départ dans {n} s… (touchez ✕ pour annuler)',
      bgTrim: 'Volume écran éteint',
      bgNotice: "Android : pour que la musique continue écran éteint, autorisez votre navigateur à tourner en arrière-plan (Réglages > Applications > votre navigateur > Batterie > Sans restriction).", learnMore: 'En savoir plus', gotIt: 'Compris',
      themeLabel: 'Thème', themeAuto: 'Auto', themeLight: 'Clair', themeDark: 'Sombre',
      lite: "Mode économique : l'appareil ne suit pas le rythme, le son est un peu moins raffiné.",
      noLoop: 'Pas de boucle.', loopInfo: "Boucle : {a} → {b} (temps du morceau d'origine)", loopEnd: 'fin',
    },
    en: {
      appTitle: 'The Ballet Pianist', helpTitle: 'How to use — The Ballet Pianist', backToApp: '← Back to the player',
      player: 'Player', pick: 'Pick a track',
      back: 'Back 5 s', fwd: 'Forward 5 s', playPause: 'Play / pause', position: 'Position',
      volume: 'Volume', clarity: 'Clarity', qualityReset: 'Audio quality reset on this device.', resetQuality: 'Reset audio quality on this device', tempo: 'Tempo', reset: 'Original tempo (100 %)',
      setA: 'Loop start', setB: 'Loop end', clearLoop: 'Clear',
      auto: 'Continue with the next track',
      shortcuts: 'Shortcuts: space = play/pause · ↑ ↓ = tempo ±1 % · ← → = ±5 s',
      library: 'Library', drop: 'Drop music files or a folder here',
      addFiles: 'Add files…', addFolder: 'Add a folder…', search: 'Search…',
      selAll: 'Select all', help: 'How to use', helpOther: "Mode d'emploi", switchLang: 'Français',
      noResult: 'No results.', emptyLib: 'The library is empty. Add some music.', remove: 'Remove',
      confirmOne: 'Remove "{name}" from the library? (your original file stays on your device)',
      delSel0: 'Remove selected', delSelN: 'Remove selected ({n})',
      confirmMany: ['Remove {n} track from the library? (your original file stays on your device)', 'Remove {n} tracks from the library? (your original files stay on your device)'],
      removed: ['{n} track removed.', '{n} tracks removed.'],
      noAudio: 'No audio file recognized.', importing: 'Importing… {a} / {b}', importErr: 'Import error: {e}',
      added: ['{n} track added', '{n} tracks added'], skipped: [', {n} already there', ', {n} already there'],
      firefoxPersist: 'If Firefox asks you to allow persistent storage, accept: otherwise your music may be erased.',
      unreadable: "{name} — format not readable by this browser",
      prevTrack: 'Previous track', nextTrack: 'Next track',
      delay: 'Start delay', delayNone: 'None', startingIn: 'Starting in {n} s… (tap ✕ to cancel)',
      bgTrim: 'Screen-off volume',
      bgNotice: "Android: to keep the music playing with the screen off, allow your browser to run in the background (Settings > Apps > your browser > Battery > Unrestricted).", learnMore: 'Learn more', gotIt: 'Got it',
      themeLabel: 'Theme', themeAuto: 'Auto', themeLight: 'Light', themeDark: 'Dark',
      lite: "Economy mode: your device can't keep up, so the sound is slightly less refined.",
      noLoop: 'No loop.', loopInfo: 'Loop: {a} → {b} (time in the original track)', loopEnd: 'end',
    },
  };

  let lang = 'en';
  const forced = (new URLSearchParams(location.search).get('lang') || '').toLowerCase();
  try { const s = localStorage.getItem('lang'); if (s === 'fr' || s === 'en') lang = s; else lang = /^fr/i.test(navigator.language || '') ? 'fr' : 'en'; }
  catch (e) { lang = /^fr/i.test(navigator.language || '') ? 'fr' : 'en'; }
  if (forced === 'fr' || forced === 'en') lang = forced;

  const I = window.I18N = {
    onchange: null,
    lang: () => lang,
    // t('clé', {n: 3}) : une valeur peut être une paire [singulier, pluriel] selon n
    t(key, v = {}) {
      let s = (D[lang] && D[lang][key]) ?? D.fr[key] ?? key;
      if (Array.isArray(s)) s = (lang === 'fr' ? (v.n <= 1) : (v.n === 1)) ? s[0] : s[1];
      return s.replace(/\{(\w+)\}/g, (_, k) => (v[k] === undefined ? '' : v[k]));
    },
    apply() {
      document.documentElement.lang = lang;
      document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = I.t(el.dataset.i18n); });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = I.t(el.dataset.i18nPlaceholder); });
      document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = I.t(el.dataset.i18nTitle); });
      document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', I.t(el.dataset.i18nAria)); });
      if (document.documentElement.dataset.titleKey) document.title = I.t(document.documentElement.dataset.titleKey);
    },
    set(l) {
      lang = l;
      try { localStorage.setItem('lang', l); } catch (e) {}
      I.apply();
      I.onchange && I.onchange();
    },
    toggle() { I.set(lang === 'fr' ? 'en' : 'fr'); },
  };
  I.apply();
})();
