/* Calcul de l'étirement (Rubber Band) hors du fil audio.
   Il produit le son quelques dixièmes de seconde à l'avance et l'envoie au lecteur (stretch-processor.js),
   ce qui absorbe les à-coups de calcul : plus de craquements même sur un appareil moins rapide. */
importScripts('vendor/rubberband.umd.min.js');

const RT = 0x00000001;           // temps réel
const ENGINE_FINER = 0x20000000; // moteur « très haute qualité »
const FEED = 512;                // images source injectées à chaque tour
const CHUNK = 1024;              // images produites par paquet
let engineName = 'finer';        // 'finer' (très haute qualité) ou 'faster' (plus léger pour les appareils lents)
let AHEAD_SEC = 0.3;             // avance visée sur le son joué (plus grande écran éteint)

let api = null, port = null, st = 0, arr = 0, ptrs = [], scratch = [];
let pcm = null, len = 0, pos = 0, sr = 48000, gen = 0;
let ratio = 1, loopA = null, loopB = null, latency = 0;
let sent = 0, acked = 0, silenceFed = 0, finished = false, pumping = false, timer = 0;

function freeState() {
  if (!st) return;
  api.rubberband_delete(st);
  ptrs.forEach(p => api.free(p)); api.free(arr);
  st = 0;
}

function makeState() {
  freeState();
  const n = pcm.length;
  st = api.rubberband_new(sr, n, RT | (engineName === 'faster' ? 0 : ENGINE_FINER), ratio, 1);
  arr = api.malloc(n * 4);
  ptrs = pcm.map((_, c) => { const p = api.malloc(Math.max(FEED, CHUNK) * 4); api.memWritePtr(arr + c * 4, p); return p; });
  scratch = pcm.map(() => new Float32Array(FEED));
  latency = api.rubberband_get_latency(st);
}

function feed() {
  for (let i = 0; i < FEED; i++) {
    if (loopA !== null && loopB !== null && loopB > loopA && pos >= loopB) pos = loopA;
    if (pos < len) {
      for (let c = 0; c < pcm.length; c++) scratch[c][i] = pcm[c][pos];
      pos++;
    } else {
      for (let c = 0; c < pcm.length; c++) scratch[c][i] = 0;
      silenceFed++;
    }
  }
  for (let c = 0; c < pcm.length; c++) api.memWrite(ptrs[c], scratch[c]);
  api.rubberband_process(st, arr, FEED, 0);
}

function makeChunk() {
  let guard = 0;
  while (api.rubberband_available(st) < CHUNK && guard++ < 64) feed();
  const avail = Math.max(0, api.rubberband_available(st));
  const n = Math.min(CHUNK, avail);
  const src = Math.max(0, Math.min(len, pos - (avail + latency) / ratio));
  const spo = 1 / ratio;
  if (n > 0) api.rubberband_retrieve(st, arr, n);
  const chans = ptrs.map(p => Float32Array.from(api.memReadF32(p, n)));
  const last = pos >= len && silenceFed * ratio > latency + 4096;
  if (last) finished = true;
  port.postMessage({ type: 'chunk', gen, chans, src, spo, last }, chans.map(c => c.buffer));
  sent += n;
}

function pump() {
  if (!pcm || !st || pumping) return;
  pumping = true;
  try {
    const target = AHEAD_SEC * sr;
    let budget = 8;   // on rend la main régulièrement pour traiter les messages
    while (!finished && sent - acked < target && budget-- > 0) makeChunk();
  } finally { pumping = false; }
  clearTimeout(timer);
  if (!finished) timer = setTimeout(pump, sent - acked < AHEAD_SEC * sr ? 0 : 8);
}

onmessage = async e => {
  const m = e.data;
  switch (m.type) {
    case 'init': {
      port = m.port;
      // Chaque paquet joué par le lecteur réveille le calcul : les minuteurs sont ralentis quand la page est
      // en arrière-plan (écran éteint sur Android), les messages du lecteur non.
      port.onmessage = ev => { if (ev.data.gen === gen) { acked += ev.data.ack; pump(); } };
      const wasm = await WebAssembly.compile(m.bytes);
      api = await rubberband.RubberBandInterface.initialize(wasm);
      postMessage({ type: 'ready' });
      break;
    }
    case 'load':
      pcm = m.channels; len = pcm[0].length; sr = m.sampleRate; gen = m.gen;
      pos = 0; sent = acked = 0; silenceFed = 0; finished = false; loopA = loopB = null;
      makeState();
      postMessage({ type: 'loaded', frames: len, sampleRate: sr });
      pump();
      break;
    case 'seek':
      if (!pcm) break;
      gen = m.gen; pos = Math.max(0, Math.min(len, Math.round(m.frame)));
      sent = acked = 0; silenceFed = 0; finished = false;
      api.rubberband_reset(st);
      pump();
      break;
    case 'engine': {
      if (m.name === engineName) break;
      if (st) {
        // on repart juste après le dernier paquet envoyé : le son déjà préparé n'est pas rejoué
        const avail = Math.max(0, api.rubberband_available(st));
        pos = Math.max(0, Math.min(len, pos - (avail + latency) / ratio));
        silenceFed = 0;
      }
      engineName = m.name;
      if (pcm) { makeState(); pump(); }
      break;
    }
    case 'ahead': AHEAD_SEC = m.sec; pump(); break;
    case 'tempo':
      ratio = 100 / m.tempo;
      if (st) api.rubberband_set_time_ratio(st, ratio);
      break;
    case 'loop':
      loopA = m.a === null ? null : Math.round(m.a);
      loopB = m.b === null ? null : Math.round(m.b);
      break;
  }
};
