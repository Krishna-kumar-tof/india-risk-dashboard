// ═══════════════════════════════════════════════════════════════
// INTEL VALIDATOR — runs in CI before the site is built
//
// The dashboard broke repeatedly for one reason: prose was written
// into a field that renders in a fixed-size slot. A 700-character
// paragraph landed in a centred status chip, a headline landed in a
// 24px metric value. Nothing caught it, so it shipped.
//
// This checks the shape of the data against the slots that display it.
// Errors fail the build; warnings are printed and do not.
//
// Usage: node scripts/validate-intel.mjs
// ═══════════════════════════════════════════════════════════════

import { readFileSync, existsSync } from 'fs';

const P = 'public/';
const errors = [];
const warnings = [];

const err = m => errors.push(m);
const warn = m => warnings.push(m);

function load(file, required) {
  const path = P + file;
  if (!existsSync(path)) {
    if (required) err(`${file}: missing`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    err(`${file}: invalid JSON — ${e.message}`);
    return null;
  }
}

const intel = load('war-intel.json', true);
const reference = load('war-reference.json', false);
const archive = load('war-archive.json', false);
const market = load('market-data.json', false);

// Every field below renders in a slot with a fixed size. The limit is
// the point past which it stops fitting, not a style preference.
const SHORT_FIELDS = [
  ['exec.level', 12], ['exec.phase', 60],
  ['exec.shipping', 30], ['exec.military', 30],
  ['hormuzStatus.state', 40], ['hormuzStatus.trafficState', 40],
  ['hormuzStatus.navyEscort', 14], ['hormuzStatus.transitedNote', 46],
  ['hormuzStatus.preWarFlow', 30],
  ['econ.sensex', 40], ['econ.vix', 40], ['econ.fpi', 40], ['econ.wealth', 40],
  ['deaths', 14], ['_phase', 24], ['_phaseBadge', 150],
];

// Long-form fields render as paragraphs; a one-word value there usually
// means the day's narrative was left out.
const PROSE_FIELDS = [
  ['assessment.body', 200], ['hormuzStatus.status', 80], ['econ.analysis', 80],
];

const dig = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

if (intel) {
  for (const key of ['_asOf', '_updated', 'brief', 'whatChanged', 'exec']) {
    if (intel[key] == null) err(`war-intel.json: "${key}" is required`);
  }

  if (intel._asOf && !/^\d{4}-\d{2}-\d{2}$/.test(intel._asOf)) {
    err(`war-intel.json: _asOf "${intel._asOf}" must be YYYY-MM-DD`);
  } else if (intel._asOf) {
    const ageDays = (Date.now() - Date.parse(intel._asOf + 'T00:00:00+05:30')) / 86400000;
    if (ageDays < -1) err(`war-intel.json: _asOf "${intel._asOf}" is in the future`);
    else if (ageDays > 3) warn(`war-intel.json: the brief is ${Math.floor(ageDays)} days old`);
  }

  for (const [path, max] of SHORT_FIELDS) {
    const v = dig(intel, path);
    if (v == null) continue;
    const len = String(v).length;
    if (len > max) {
      err(`war-intel.json: ${path} is ${len} chars, max ${max} — it renders in a fixed-size slot. ` +
          `Put the detail in the matching narrative field instead.`);
    }
  }

  for (const [path, min] of PROSE_FIELDS) {
    const v = dig(intel, path);
    if (v != null && String(v).length < min) {
      warn(`war-intel.json: ${path} is only ${String(v).length} chars — expected a paragraph`);
    }
  }

  if (Array.isArray(intel.brief) && (intel.brief.length < 3 || intel.brief.length > 7)) {
    warn(`war-intel.json: brief has ${intel.brief.length} lines — 5 reads best`);
  }

  const items = intel.whatChanged?.items;
  if (!Array.isArray(items) || !items.length) {
    err('war-intel.json: whatChanged.items must have at least one entry');
  } else {
    const TOKENS = ['red', 'orange', 'amber', 'green', 'cyan', 'purple', 'teal'];
    items.forEach((it, i) => {
      if (!it.bold) err(`war-intel.json: whatChanged.items[${i}].bold is required`);
      else if (String(it.bold).length > 120) {
        warn(`war-intel.json: whatChanged.items[${i}].bold is ${String(it.bold).length} chars — it also becomes a ticker line`);
      }
      if (it.color && !TOKENS.includes(it.color)) {
        err(`war-intel.json: whatChanged.items[${i}].color "${it.color}" is not one of ${TOKENS.join(', ')}`);
      }
    });
  }

  if (!Array.isArray(intel.military) || !intel.military.length) {
    warn('war-intel.json: "military" is empty — that section will show an empty state');
  } else {
    intel.military.forEach((m, i) => {
      if (!m.t) err(`war-intel.json: military[${i}].t (title) is required`);
      if (!m.d) warn(`war-intel.json: military[${i}] has no body text`);
      if (String(m.t ?? '').length > 130) {
        warn(`war-intel.json: military[${i}].t is ${String(m.t).length} chars — titles read better under 130`);
      }
    });
  }

  // The executive snapshot reads these axes by name.
  if (Array.isArray(intel.radar)) {
    for (const axis of ['Mil. Exposure', 'Household']) {
      if (!intel.radar.some(r => r.axis === axis)) {
        warn(`war-intel.json: radar has no "${axis}" axis — the snapshot will show a dash`);
      }
    }
    intel.radar.forEach((r, i) => {
      for (const k of ['w1', 'now', 'w4']) {
        if (!Number.isFinite(r[k]) || r[k] < 0 || r[k] > 100) {
          err(`war-intel.json: radar[${i}].${k} must be a number from 0 to 100`);
        }
      }
    });
  }
}

if (archive) {
  const timeline = archive.timeline ?? [];
  if (!timeline.length) err('war-archive.json: timeline is empty');

  const seen = new Map();
  for (const row of timeline) {
    if (!Number.isFinite(row.d)) { err(`war-archive.json: a row has no day number (${row.l ?? '?'})`); continue; }
    const key = `${row.d}|${row.l}`;
    if (seen.has(key)) {
      err(`war-archive.json: day ${row.d} "${row.l}" appears twice — give the second entry a distinct label`);
    }
    seen.set(key, true);
    if (row.sev != null && ![1, 2, 3, 4].includes(row.sev)) {
      warn(`war-archive.json: day ${row.d} has sev ${row.sev} — expected 1-4`);
    }
  }

  const latest = Math.max(...timeline.map(r => r.d));
  if (intel?._asOf) {
    const start = intel._start ?? '2026-02-28';
    const today = Math.floor((Date.parse(intel._asOf + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / 86400000) + 1;
    if (today - latest > 3) {
      warn(`war-archive.json: newest session is day ${latest} but the brief is day ${today} — the roll script may not be running`);
    }
  }
}

if (reference) {
  for (const key of ['kitchen', 'nukes', 'cities']) {
    if (!Array.isArray(reference[key]) || !reference[key].length) {
      warn(`war-reference.json: "${key}" is empty — that section will show an empty state`);
    }
  }
  const b = reference.budget ?? {};
  for (const k of ['petrolPre', 'petrolNow', 'dieselPre', 'dieselNow', 'lpgPre', 'lpgNow']) {
    if (!Number.isFinite(b[k])) err(`war-reference.json: budget.${k} must be a number — the calculator needs all six`);
  }
}

if (market) {
  const stale = Object.entries(market._status ?? {}).filter(([, v]) => v !== 'ok');
  if (stale.length) warn(`market-data.json: ${stale.map(([k]) => k).join(', ')} did not refresh on the last run`);
}

for (const w of warnings) console.log(`⚠ ${w}`);
for (const e of errors) console.error(`✖ ${e}`);

if (errors.length) {
  console.error(`\n${errors.length} error${errors.length > 1 ? 's' : ''} — not publishing.`);
  process.exit(1);
}
console.log(`\n✅ Data valid${warnings.length ? ` (${warnings.length} warning${warnings.length > 1 ? 's' : ''})` : ''}.`);
