import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
} from '@remotion/install-whisper-cpp';

const videoFile = process.argv[2];
if (!videoFile) {
  console.error('Pakai: node scripts/transcribe.mjs nama.mp4');
  process.exit(1);
}

const root = process.cwd();
const name = path.parse(videoFile).name;
const videoPath = path.join(root, 'public', 'videos', videoFile);
const dataDir = path.join(root, 'public', 'data');
const outPath = path.join(dataDir, `${name}.captions.json`);
const whisperPath = path.join(root, 'whisper.cpp');
const whisperCppVersion = '1.5.5';
const model = process.env.WHISPER_MODEL || 'small';
const language = process.env.WHISPER_LANG || 'id';

if (!fs.existsSync(videoPath)) {
  console.error(`Video tidak ditemukan: ${videoPath}`);
  process.exit(1);
}

fs.mkdirSync(dataDir, {recursive: true});

const wavPath = path.join(os.tmpdir(), `${name}.wav`);
execFileSync(
  'ffmpeg',
  ['-y', '-i', videoPath, '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', wavPath],
  {stdio: 'inherit'},
);

await installWhisperCpp({to: whisperPath, version: whisperCppVersion});
await downloadWhisperModel({model, folder: whisperPath});

const {transcription} = await transcribe({
  model,
  whisperPath,
  whisperCppVersion,
  inputPath: wavPath,
  tokenLevelTimestamps: true,
  splitOnWord: true,
  language,
});

const parseStamp = (value) => {
  const m = /(\d+):(\d+):(\d+)[,.](\d+)/.exec(value || '');
  if (!m) return 0;
  return (
    Number(m[1]) * 3600000 +
    Number(m[2]) * 60000 +
    Number(m[3]) * 1000 +
    Number(m[4].padEnd(3, '0').slice(0, 3))
  );
};

const readMs = (item, key) => {
  if (item.offsets && typeof item.offsets[key] === 'number') {
    return item.offsets[key];
  }
  return parseStamp(item.timestamps && item.timestamps[key]);
};

const words = [];
for (const item of transcription) {
  const raw = item.text;
  if (!raw) continue;
  if (/^\s*\[.*\]\s*$/.test(raw) || /^\s*\(.*\)\s*$/.test(raw)) continue;
  const piece = raw.trim();
  if (!piece) continue;
  const startMs = readMs(item, 'from');
  const endMs = readMs(item, 'to');
  const startsNewWord = /^\s/.test(raw) || words.length === 0;
  if (startsNewWord) {
    words.push({text: piece, startMs, endMs});
  } else {
    const last = words[words.length - 1];
    last.text += piece;
    last.endMs = endMs;
  }
}

for (const w of words) {
  if (w.endMs <= w.startMs) w.endMs = w.startMs + 200;
}

fs.writeFileSync(outPath, JSON.stringify({language, model, words}, null, 2));
console.log(`Captions tersimpan: ${outPath} (${words.length} kata)`);
