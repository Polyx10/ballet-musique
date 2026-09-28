// SPDX-License-Identifier: GPL-2.0-or-later
/* Lecteur : joue les paquets de son préparés par dsp-worker.js (étirement Rubber Band hors du fil audio).
   Ce fichier ne fait aucun calcul lourd : il ne fait que recopier le son prêt, avec un fondu à la pause. */

class Player extends AudioWorkletProcessor {
  constructor() {
    super();
    this.dsp = null;
    this.queue = []; this.cur = null; this.off = 0; this.gen = 0;
    this.playing = false; this.gain = 0; this.target = 0;
    this.tick = 0; this.under = 0;
    this.port.onmessage = e => {
      const m = e.data;
      if (m.type === 'link') {
        this.dsp = m.port;
        this.dsp.onmessage = ev => {
          const c = ev.data;
          if (c.type === 'chunk' && c.gen === this.gen) this.queue.push(c);
        };
      } else if (m.type === 'play') { this.playing = true; this.target = 1; }
      else if (m.type === 'pause') { this.playing = false; this.target = 0; }
      else if (m.type === 'clear') { this.gen = m.gen; this.queue = []; this.cur = null; this.off = 0; this.gain = 0; }
    };
  }

  process(inputs, outputs) {
    const out = outputs[0], frames = out[0].length;
    if (!this.playing && this.gain <= 0) { for (const ch of out) ch.fill(0); return true; }

    const step = 1 / 256;
    for (let i = 0; i < frames; i++) {
      if (!this.cur || this.off >= this.cur.chans[0].length) {
        if (this.cur) {
          this.dsp && this.dsp.postMessage({ gen: this.gen, ack: this.cur.chans[0].length });
          if (this.cur.last) { this.port.postMessage({ type: 'ended' }); this.playing = false; this.target = 0; }
          this.cur = null;
        }
        this.cur = this.queue.shift() || null; this.off = 0;
      }
      if (this.gain < this.target) this.gain = Math.min(this.target, this.gain + step);
      else if (this.gain > this.target) this.gain = Math.max(this.target, this.gain - step);

      if (this.cur && this.off < this.cur.chans[0].length) {
        const ch = this.cur.chans;
        for (let c = 0; c < out.length; c++) out[c][i] = ch[c < ch.length ? c : 0][this.off] * this.gain;
        this.off++;
      } else {
        for (let c = 0; c < out.length; c++) out[c][i] = 0;
        if (this.playing) this.under++;
      }
    }

    if (++this.tick % 12 === 0 && this.cur) {
      this.port.postMessage({ type: 'pos', frame: this.cur.src + this.off * this.cur.spo, under: this.under });
    }
    return true;
  }
}
registerProcessor('stretcher', Player);
