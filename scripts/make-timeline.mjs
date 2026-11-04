import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const videoFile = process.argv[2];
if (!videoFile) {
  console.error('Pakai: node scripts/make-timeline.mjs nama.mp4');
  process.exit(1);
}

const root = process.cwd();
const name = path.parse(videoFile).name;
const videoPath = path.join(root, 'public', 'videos', videoFile);
const capPath = path.join(root, 'public', 'data', `${name}.captions.json`);
const stylePath = path.join(root, 'public', 'data', `${name}.style.json`);
const outPath = path.join(root, 'public', 'data', `${name}.timeline.json`);

const clean = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

const STOP = new Set(
  [
    'yang', 'dengan', 'untuk', 'karena', 'supaya', 'sebenarnya', 'tetapi',
    'sehingga', 'kemudian', 'adalah', 'dalam', 'pada', 'dari', 'akan', 'sudah',
    'banget', 'bahwa', 'ketika', 'selalu', 'sebagai', 'tentang', 'seperti',
    'mereka', 'kita', 'kami', 'sangat', 'masih', 'harus', 'bukan', 'jadi',
  ].map(clean),
);

const keywordSet = new Set(
  (process.env.KEYWORDS || '')
    .split(',')
    .map(clean)
    .filter(Boolean),
);

if (!fs.existsSync(capPath)) {
  console.error(`Captions belum ada: ${capPath}`);
  process.exit(1);
}

const probe = JSON.parse(
  execFileSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'json',
    videoPath,
  ]).toString(),
);
const durationSec = Math.round(parseFloat(probe.format.duration) * 100) / 100;
const durationMs = durationSec * 1000;

const words = JSON.parse(fs.readFileSync(capPath, 'utf8')).words.filter(
  (w) => w.text && w.text.trim(),
);

const groups = [];
let cur = [];
for (const w of words) {
  if (cur.length) {
    const prev = cur[cur.length - 1];
    const gap = w.startMs - prev.endMs;
    const span = w.endMs - cur[0].startMs;
    const endsSentence = /[.?!]$/.test(prev.text);
    if (gap > 450 || cur.length >= 7 || span > 3400 || endsSentence) {
      groups.push(cur);
      cur = [];
    }
  }
  cur.push(w);
}
if (cur.length) groups.push(cur);

const merged = [];
for (const g of groups) {
  const prev = merged[merged.length - 1];
  if (
    prev &&
    g.length < 2 &&
    prev.length + g.length <= 8 &&
    g[0].startMs - prev[prev.length - 1].endMs < 700
  ) {
    prev.push(...g);
  } else {
    merged.push([...g]);
  }
}

const TRANSITIONS = ['cut', 'cut', 'wipe', 'cut', 'flash', 'cut'];

let lastEnd = 0;
let kickerToggle = 0;

const segments = merged.map((ws, i) => {
  const nextStart = i < merged.length - 1 ? merged[i + 1][0].startMs : durationMs;
  let startMs = Math.max(lastEnd, ws[0].startMs - 80);
  let endMs = Math.min(ws[ws.length - 1].endMs + 350, nextStart - 40);
  if (endMs <= startMs) endMs = startMs + 300;
  lastEnd = endMs;

  const hlIdx = new Set();
  ws.forEach((w, k) => {
    if (keywordSet.has(clean(w.text))) hlIdx.add(k);
  });
  const explicit = hlIdx.size > 0;

  if (!explicit) {
    let best = -1;
    let bestLen = 5;
    ws.forEach((w, k) => {
      const c = clean(w.text);
      if (/\d/.test(c)) {
        if (bestLen < 99) {
          best = k;
          bestLen = 99;
        }
      } else if (!STOP.has(c) && c.length > bestLen) {
        best = k;
        bestLen = c.length;
      }
    });
    if (best >= 0) hlIdx.add(best);
  }

  let kicker = null;
  if (hlIdx.size > 0 && endMs - startMs >= 1200) {
    const first = [...hlIdx][0];
    const show = explicit || kickerToggle % 2 === 0;
    kickerToggle += 1;
    if (show) {
      kicker = ws[first].text.replace(/[^\p{L}\p{N}'-]/gu, '').toLowerCase();
      if (!kicker) kicker = null;
    }
  }

  return {
    startMs: Math.round(startMs),
    endMs: Math.round(endMs),
    words: ws.map((w, k) => ({
      text: w.text,
      startMs: Math.round(w.startMs),
      endMs: Math.round(w.endMs),
      hl: hlIdx.has(k),
    })),
    kicker,
    zoomFrom: i % 2 === 0 ? 1.0 : 1.12,
    zoomTo: i % 2 === 0 ? 1.08 : 1.04,
    transition: i === 0 ? 'none' : TRANSITIONS[(i - 1) % TRANSITIONS.length],
  };
});

const defaults = {
  title: '',
  frame: 'editorial',
  theme: {accent: '#FFD84D', text: '#FFF9EF'},
  zones: {
    topY: 200,
    topH: 260,
    lowerY: 1120,
    lowerH: 360,
    leftX: 84,
    maxW: 820,
    faceCenterY: 36,
  },
};

const override = fs.existsSync(stylePath)
  ? JSON.parse(fs.readFileSync(stylePath, 'utf8'))
  : {};

const timeline = {
  videoFile,
  fps: 30,
  durationSec,
  title: process.env.TITLE || override.title || defaults.title,
  frame: override.frame || defaults.frame,
  theme: {...defaults.theme, ...(override.theme || {})},
  zones: {...defaults.zones, ...(override.zones || {})},
  segments,
};

fs.writeFileSync(outPath, JSON.stringify(timeline, null, 2));
console.log(
  `Timeline tersimpan: ${outPath} (${segments.length} segmen, ${durationSec} detik)`,
);
