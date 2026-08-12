// ═══════════════════════════════════════════════════════════════
// ARCHIVE ROLL — appends the day's row to public/war-archive.json
//
// The archive used to be part of war-intel.json, which meant the whole
// 95KB history had to be re-emitted every time the brief was rewritten.
// It now lives on its own and this script maintains it: market numbers
// come from market-data.json and the summary is derived from the brief
// that was already written, so no figure is typed twice.
//
// Idempotent — safe to run on every market refresh.
// ═══════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, existsSync } from 'fs';

const P = 'public/';
const INTEL = P + 'war-intel.json';
const MARKET = P + 'market-data.json';
const ARCHIVE = P + 'war-archive.json';

const WAR_START = '2026-02-28';
const dayOf = (iso, start = WAR_START) =>
  Math.floor((Date.parse(iso + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / 86400000) + 1;
const labelOf = iso =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const readJSON = f => JSON.parse(readFileSync(f, 'utf8'));

const sessionDay = (isoStamp, tz = 'Asia/Kolkata') =>
  isoStamp ? new Date(isoStamp).toLocaleDateString('en-CA', { timeZone: tz }) : null;

// "7,199+" -> 7199
const toNumber = v => {
  if (typeof v === 'number') return v;
  const n = parseInt(String(v ?? '').replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) ? n : null;
};

const SEV_BY_LEVEL = { SEVERE: 3, HIGH: 3, ELEVATED: 2, MODERATE: 1 };

// The archive summary is built from the headlines already written for
// the "what changed" block, so the day is never described twice.
function deriveTag(intel) {
  if (intel.today?.tag) return intel.today.tag;
  const bolds = (intel.whatChanged?.items ?? []).map(i => i.bold).filter(Boolean);
  if (bolds.length) return bolds.join(' · ');
  return intel.shareLine ?? intel.assessment?.headline ?? '';
}

function deriveHormuzEvent(intel) {
  if (intel.today?.hormuzEvent) return intel.today.hormuzEvent;
  const h = intel.hormuzStatus ?? {};
  const parts = [h.headline, h.status].filter(Boolean);
  return parts.length ? parts.join(' ') : null;
}

function main() {
  for (const f of [INTEL, MARKET]) {
    if (!existsSync(f)) {
      console.log(`skip: ${f} not found`);
      return;
    }
  }

  const intel = readJSON(INTEL);
  const market = readJSON(MARKET);
  const archive = existsSync(ARCHIVE)
    ? readJSON(ARCHIVE)
    : { _generated: null, _note: '', timeline: [], hormuzEvents: [] };

  archive.timeline ??= [];
  archive.hormuzEvents ??= [];

  // Date the row by the Indian trading session the numbers belong to,
  // not by "now" — a pre-market brief describes the previous close.
  const iso =
    sessionDay(market.nifty?.asOf) ??
    sessionDay(market._utc) ??
    intel._asOf;
  if (!iso) {
    console.log('skip: cannot determine a session date');
    return;
  }

  const start = intel._start ?? WAR_START;
  const d = dayOf(iso, start);
  const l = labelOf(iso);

  const row = {
    d,
    l,
    deaths: toNumber(intel.deaths),
    brent: market.brent?.price ?? null,
    nifty: market.nifty?.price ?? null,
    rupee: market.rupee?.price ?? null,
    tag: deriveTag(intel),
    sev: intel.today?.sev ?? SEV_BY_LEVEL[intel.exec?.level] ?? 2,
  };

  if (row.brent == null && row.nifty == null) {
    console.log('skip: no market prices available to log');
    return;
  }

  const at = archive.timeline.findIndex(t => t.d === d && t.l === l);
  if (at >= 0) {
    const current = archive.timeline[at];
    const before = JSON.stringify(current);
    // Rows this script wrote are refreshed as the session develops.
    // Hand-curated rows are only ever topped up where a field is empty,
    // so a published figure is never silently rewritten.
    const merged = current.auto
      ? { ...current, ...row, auto: true }
      : Object.fromEntries(
          Object.entries(current).concat(
            Object.entries(row).filter(([k, v]) => current[k] == null && v != null)
          )
        );
    archive.timeline[at] = merged;
    console.log(
      JSON.stringify(merged) === before
        ? `archive: day ${d} (${l}) already current — nothing to do`
        : `archive: ${current.auto ? 'refreshed' : 'topped up'} day ${d} (${l})`
    );
  } else {
    archive.timeline.push({ ...row, auto: true });
    archive.timeline.sort((a, b) => a.d - b.d || String(a.l).localeCompare(String(b.l)));
    console.log(`archive: appended day ${d} (${l}) — brent ${row.brent}, nifty ${row.nifty}, rupee ${row.rupee}`);
  }

  const event = deriveHormuzEvent(intel);
  if (event) {
    const eventDate = labelOf(intel._asOf ?? iso);
    const idx = archive.hormuzEvents.findIndex(e => e.d === eventDate);
    if (idx < 0) archive.hormuzEvents.unshift({ d: eventDate, e: event, auto: true });
    else if (archive.hormuzEvents[idx].auto) archive.hormuzEvents[idx].e = event;
  }

  archive._generated = new Date().toISOString();
  archive._note = 'Append-only history. Maintained by scripts/roll-archive.mjs — do not hand-edit.';
  writeFileSync(ARCHIVE, JSON.stringify(archive, null, 2) + '\n');
  console.log(`archive: ${archive.timeline.length} sessions, ${archive.hormuzEvents.length} maritime entries`);
}

main();
