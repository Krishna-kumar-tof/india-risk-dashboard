// ═══════════════════════════════════════════════════════════════
// SHARE CARD — renders public/share-card.png
//
// index.html points og:image and twitter:image at share-card.png, which
// never existed, so every link shared to WhatsApp, X or LinkedIn showed
// no preview. This regenerates it from the same data the page displays,
// so the preview is current rather than a screenshot from launch day.
//
// Never fails the build: a missing preview image is worth less than a
// deploy.
// ═══════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

const P = 'public/';
const OUT = P + 'share-card.png';
const SITE = 'nithiyageo.github.io/india-risk-dashboard';
const WAR_START = '2026-02-28';

const readJSON = f => (existsSync(P + f) ? JSON.parse(readFileSync(P + f, 'utf8')) : {});

// Pick whatever is actually installed — CI runners carry DejaVu or
// Liberation, a developer machine may have the real thing.
const pick = (...names) => {
  const have = new Set(GlobalFonts.families.map(f => f.family));
  return names.find(n => have.has(n)) ?? names[names.length - 1];
};
const DISPLAY = pick('Syne', 'DejaVu Sans', 'Liberation Sans', 'Arial', 'sans-serif');
const MONO = pick('IBM Plex Mono', 'DejaVu Sans Mono', 'Liberation Mono', 'Courier New', 'monospace');
const SERIF = pick('Source Serif 4', 'DejaVu Serif', 'Liberation Serif', 'Georgia', 'serif');

const COL = {
  bg: '#080c14', border: '#1e2a3d', card: '#121826',
  amber: '#f59e0b', cyan: '#38bdf8', orange: '#fb923c',
  red: '#ef4444', green: '#10b981', sub: '#93a4bf', white: '#eef2fa',
};

const dayOf = (iso, start = WAR_START) =>
  Math.floor((Date.parse(iso + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / 86400000) + 1;

const num = (v, dp = 0) =>
  Number.isFinite(v) ? v.toLocaleString('en-IN', { minimumFractionDigits: dp, maximumFractionDigits: dp }) : '—';

function wrap(ctx, text, x, y, maxW, lh, maxLines) {
  const words = String(text ?? '').split(/\s+/).filter(Boolean);
  let line = '', lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      if (lines === maxLines - 1) { ctx.fillText(line.replace(/\S{0,3}$/, '') + '…', x, y); return; }
      ctx.fillText(line, x, y);
      y += lh; lines++; line = word;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, y);
}

function build() {
  const intel = readJSON('war-intel.json');
  const market = readJSON('market-data.json');
  const reference = readJSON('war-reference.json');

  const day = intel._asOf ? dayOf(intel._asOf, intel._start ?? WAR_START) : intel._day ?? 0;
  const radar = intel.radar ?? [];
  const avg = radar.length ? Math.round(radar.reduce((s, r) => s + (r.now || 0), 0) / radar.length) : null;
  const level = intel.exec?.level
    ?? (avg == null ? '—' : avg >= 75 ? 'SEVERE' : avg >= 60 ? 'HIGH' : avg >= 45 ? 'ELEVATED' : 'MODERATE');
  const levelColor = { SEVERE: COL.red, HIGH: COL.orange, ELEVATED: COL.amber }[level] ?? COL.green;

  const pre = reference.preWar ?? intel.preWar ?? {};
  const lpg = reference.budget?.lpgNow ?? intel.budget?.lpgNow;
  const brentPct = market.brent?.changePct;
  const headline = intel.shareLine ?? intel.whatChanged?.items?.[0]?.bold ?? intel.assessment?.headline ?? '';

  const cv = createCanvas(1080, 1080);
  const x = cv.getContext('2d');

  x.fillStyle = COL.bg; x.fillRect(0, 0, 1080, 1080);
  x.strokeStyle = COL.border; x.lineWidth = 2; x.strokeRect(24, 24, 1032, 1032);
  x.fillStyle = COL.amber; x.fillRect(24, 24, 1032, 8);

  x.fillStyle = COL.amber; x.font = `700 26px "${MONO}"`;
  x.fillText('WEST ASIA WAR — INDIA RISK TRACKER', 64, 110);
  x.fillStyle = COL.sub; x.font = `400 22px "${MONO}"`;
  x.fillText(intel._updated ?? '', 64, 148);

  x.fillStyle = COL.white; x.font = `800 120px "${DISPLAY}"`;
  x.fillText(`DAY ${day}`, 64, 290);
  x.fillStyle = levelColor; x.font = `800 44px "${DISPLAY}"`;
  x.fillText(`RISK: ${level}`, 64, 356);

  x.strokeStyle = COL.border; x.beginPath(); x.moveTo(64, 400); x.lineTo(1016, 400); x.stroke();

  const cells = [
    ['OIL — BRENT', `$${num(market.brent?.price, 2)}`,
     Number.isFinite(brentPct) ? `${brentPct > 0 ? '▲ +' : '▼ '}${Math.abs(brentPct).toFixed(1)}% on the day` : '', COL.amber],
    ['NIFTY 50', num(market.nifty?.price), pre.nifty ? `was ${num(pre.nifty)} pre-war` : '', COL.cyan],
    ['RUPEE / USD', `₹${num(market.rupee?.price, 2)}`, pre.rupee ? `was ₹${pre.rupee} pre-war` : '', COL.orange],
    ['LPG 14.2KG', lpg ? `₹${num(lpg, 0)}` : '—', pre.lpg ? `was ₹${pre.lpg} pre-war` : '', COL.red],
  ];

  cells.forEach((cell, i) => {
    const cx = 64 + (i % 2) * 486;
    const cy = 460 + Math.floor(i / 2) * 180;
    x.fillStyle = COL.card; x.fillRect(cx - 14, cy - 40, 458, 150);
    x.fillStyle = cell[3]; x.fillRect(cx - 14, cy - 40, 6, 150);
    x.fillStyle = COL.sub; x.font = `700 22px "${MONO}"`;
    x.fillText(cell[0], cx + 14, cy);
    x.fillStyle = cell[3]; x.font = `800 58px "${DISPLAY}"`;
    x.fillText(String(cell[1]), cx + 14, cy + 62);
    x.fillStyle = COL.sub; x.font = `400 20px "${MONO}"`;
    x.fillText(String(cell[2] ?? ''), cx + 14, cy + 96);
  });

  x.fillStyle = '#c8d0e0'; x.font = `600 32px "${SERIF}"`;
  wrap(x, headline, 64, 820, 952, 44, 4);

  x.fillStyle = COL.amber; x.font = `700 24px "${MONO}"`;
  x.fillText(SITE, 64, 1020);

  writeFileSync(OUT, cv.toBuffer('image/png'));
  console.log(`✅ ${OUT} — day ${day}, risk ${level} (fonts: ${DISPLAY} / ${MONO})`);
}

try {
  build();
} catch (err) {
  console.log(`::warning::share card not regenerated — ${err.message}`);
}
