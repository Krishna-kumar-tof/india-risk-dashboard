// ═══════════════════════════════════════════════════════════════
// MARKET DATA FETCHER — runs from .github/workflows/update-market.yml
// Fetches: Brent Crude, Nifty 50, Sensex, USD/INR
// Writes:  public/market-data.json
//
// Why the change is computed from the daily close series rather than
// meta.chartPreviousClose: Yahoo returns the close from *before the
// requested window*, so with range=1d a currency pair reports its own
// price as the previous close and the change is always exactly 0.
// That is what pinned the rupee at "change: 0" on every run.
// ═══════════════════════════════════════════════════════════════

import { writeFileSync, readFileSync, existsSync } from 'fs';

const OUT = 'public/market-data.json';
const YAHOO = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'application/json',
};

const SYMBOLS = {
  brent: { symbol: 'BZ=F', label: 'Brent Crude', dp: 2 },
  nifty: { symbol: '^NSEI', label: 'Nifty 50', dp: 2 },
  sensex: { symbol: '^BSESN', label: 'Sensex', dp: 2 },
  rupee: { symbol: 'USDINR=X', label: 'USD/INR', dp: 2 },
};

const round = (n, dp) => (n == null ? null : parseFloat(n.toFixed(dp)));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const isoDay = (epochSec, tz) =>
  new Date(epochSec * 1000).toLocaleDateString('en-CA', { timeZone: tz || 'UTC' });

async function getJSON(url, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await sleep(1000 * 2 ** i);
    }
  }
  throw lastErr;
}

// One quote, with the previous close taken from the daily bar series so
// the day-over-day change is real for indices, futures and currencies.
async function fetchQuote({ symbol, dp }) {
  const url = `${YAHOO}${encodeURIComponent(symbol)}?interval=1d&range=1mo`;
  const data = await getJSON(url);
  const result = data?.chart?.result?.[0];
  const meta = result?.meta;
  if (!meta) throw new Error('no meta in response');

  const stamps = result.timestamp || [];
  const closes = result.indicators?.quote?.[0]?.close || [];
  // Yahoo emits placeholder bars with a null close for sessions it has
  // not consolidated yet; those must not be read as a previous close.
  const bars = stamps
    .map((t, i) => ({ t, c: closes[i] }))
    .filter(b => b.c != null && Number.isFinite(b.c));

  const price = Number.isFinite(meta.regularMarketPrice)
    ? meta.regularMarketPrice
    : bars.at(-1)?.c;
  if (!Number.isFinite(price)) throw new Error('no usable price');

  const tz = meta.exchangeTimezoneName;
  const priceDay = isoDay(meta.regularMarketTime || bars.at(-1)?.t, tz);
  // The reference is the most recent close from an earlier session than
  // the one the current price belongs to.
  const prevBar = [...bars].reverse().find(b => isoDay(b.t, tz) < priceDay);
  const prevClose = prevBar?.c ?? null;

  return {
    price: round(price, dp),
    change: prevClose == null ? null : round(price - prevClose, dp),
    changePct: prevClose ? round(((price - prevClose) / prevClose) * 100, 2) : null,
    prevClose: round(prevClose, dp),
    prevCloseDate: prevBar ? isoDay(prevBar.t, tz) : null,
    asOf: new Date((meta.regularMarketTime || 0) * 1000).toISOString(),
    ok: true,
  };
}

// Free, keyless backstop for the rupee only.
async function fetchRupeeFallback() {
  const data = await getJSON('https://open.er-api.com/v6/latest/USD', 2);
  const rate = data?.rates?.INR;
  if (!Number.isFinite(rate)) throw new Error('no INR rate');
  return { price: round(rate, 2), change: null, changePct: null, prevClose: null,
    prevCloseDate: null, asOf: new Date().toISOString(), ok: true, source: 'exchangerate-api' };
}

function istStamp(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date).reduce((a, p) => ((a[p.type] = p.value), a), {});
  return `${parts.day} ${parts.month} ${parts.year} — ${parts.hour}:${parts.minute} IST`;
}

// Ignore the clock when deciding whether anything actually moved, so a
// run that changes nothing does not produce a commit and a redeploy.
const priceSignature = obj =>
  JSON.stringify(Object.keys(SYMBOLS).map(k => [k, obj?.[k]?.price ?? null, obj?.[k]?.prevClose ?? null]));

async function main() {
  const now = new Date();
  let existing = {};
  if (existsSync(OUT)) {
    try { existing = JSON.parse(readFileSync(OUT, 'utf8')); } catch { /* start clean */ }
  }

  const results = await Promise.all(
    Object.entries(SYMBOLS).map(async ([key, cfg]) => {
      try {
        return [key, await fetchQuote(cfg)];
      } catch (err) {
        console.error(`✖ ${cfg.label} (${cfg.symbol}): ${err.message}`);
        return [key, null];
      }
    })
  );

  const output = { _updated: null, _utc: now.toISOString(), _source: 'Yahoo Finance', _status: {} };
  const failed = [];

  for (const [key, quote] of results) {
    let value = quote;

    if (!value && key === 'rupee') {
      try {
        value = await fetchRupeeFallback();
        console.log('→ rupee: used ExchangeRate API fallback');
      } catch (err) {
        console.error(`✖ rupee fallback: ${err.message}`);
      }
    }

    if (value) {
      output[key] = value;
      output._status[key] = 'ok';
    } else if (existing[key]) {
      // Carry the last good value forward, but say so rather than
      // presenting a stale number as if it were fresh.
      output[key] = { ...existing[key], ok: false, stale: true,
        staleSince: existing[key].asOf ?? existing._utc ?? null };
      output._status[key] = 'stale';
      failed.push(key);
    } else {
      output[key] = null;
      output._status[key] = 'missing';
      failed.push(key);
    }
  }

  output._updated = istStamp(now);
  output._partial = failed.length > 0;
  output._note = 'Market data is fetched automatically. War intelligence is written by hand.';

  if (priceSignature(output) === priceSignature(existing)) {
    console.log('No price movement since the last run — leaving the file untouched.');
    return;
  }

  writeFileSync(OUT, JSON.stringify(output, null, 2) + '\n');
  console.log(`✅ ${OUT} updated: ${output._updated}`);
  for (const [key, cfg] of Object.entries(SYMBOLS)) {
    const q = output[key];
    console.log(
      `   ${cfg.label.padEnd(12)} ${String(q?.price ?? '—').padStart(10)}` +
      `  chg ${String(q?.change ?? '—').padStart(9)}` +
      ` (${q?.changePct ?? '—'}%) vs ${q?.prevCloseDate ?? '—'}  [${output._status[key]}]`
    );
  }

  if (failed.length) {
    // Surfaces in the Actions summary instead of passing silently green.
    console.log(`::warning::Market feed incomplete — ${failed.join(', ')} not refreshed this run.`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
