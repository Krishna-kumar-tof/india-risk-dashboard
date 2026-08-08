// ═══════════════════════════════════════════════════════════════
// MARKET DATA FETCHER — Runs via GitHub Action every 4 hours
// Fetches: Brent Crude, Nifty 50, Sensex, USD/INR
// Writes to: public/market-data.json
// ═══════════════════════════════════════════════════════════════

import { writeFileSync, readFileSync, existsSync } from 'fs';

const YAHOO_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
};

const SYMBOLS = {
  brent:  'BZ=F',
  nifty:  '^NSEI',
  sensex: '^BSESN',
  usdinr: 'USDINR=X',
};

async function fetchYahoo(symbol) {
  try {
    const url = `${YAHOO_BASE}${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) throw new Error('No meta data');
    return {
      price: parseFloat(meta.regularMarketPrice?.toFixed(2)),
      prevClose: parseFloat(meta.chartPreviousClose?.toFixed(2)),
      change: parseFloat((meta.regularMarketPrice - meta.chartPreviousClose).toFixed(2)),
      changePct: parseFloat(((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100).toFixed(2)),
      marketState: meta.currentTradingPeriod?.regular ? 'available' : 'unknown',
    };
  } catch (err) {
    console.error(`Failed to fetch ${symbol}:`, err.message);
    return null;
  }
}

// Fallback: ExchangeRate API for USD/INR (free, no key)
async function fetchForexFallback() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data?.rates?.INR ? parseFloat(data.rates.INR.toFixed(2)) : null;
  } catch (err) {
    console.error('Forex fallback failed:', err.message);
    return null;
  }
}

async function main() {
  console.log('Fetching market data...');
  const now = new Date();
  const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const timestamp = istTime.toISOString().replace('T', ' — ').substring(0, 19) + ' IST';

  // Load existing data as fallback
  let existing = {};
  if (existsSync('public/market-data.json')) {
    try {
      existing = JSON.parse(readFileSync('public/market-data.json', 'utf8'));
    } catch (e) { /* ignore */ }
  }

  // Fetch all in parallel
  const [brent, nifty, sensex, usdinr] = await Promise.all([
    fetchYahoo(SYMBOLS.brent),
    fetchYahoo(SYMBOLS.nifty),
    fetchYahoo(SYMBOLS.sensex),
    fetchYahoo(SYMBOLS.usdinr),
  ]);

  // Forex fallback
  let rupee = usdinr?.price;
  if (!rupee) {
    console.log('Trying forex fallback...');
    rupee = await fetchForexFallback();
  }

  const output = {
    _updated: timestamp,
    _utc: now.toISOString(),
    _source: 'Yahoo Finance + ExchangeRate API',
    _note: 'Auto-updated via GitHub Action every 4 hours. War content updated manually.',

    brent: brent ? {
      price: brent.price,
      change: brent.change,
      changePct: brent.changePct,
    } : existing.brent || { price: 106, change: 0, changePct: 0 },

    nifty: nifty ? {
      price: nifty.price,
      change: nifty.change,
      changePct: nifty.changePct,
    } : existing.nifty || { price: 23002, change: 0, changePct: 0 },

    sensex: sensex ? {
      price: sensex.price,
      change: sensex.change,
      changePct: sensex.changePct,
    } : existing.sensex || { price: 74207, change: 0, changePct: 0 },

    rupee: rupee ? {
      price: rupee,
      change: usdinr?.change || 0,
      changePct: usdinr?.changePct || 0,
    } : existing.rupee || { price: 93.20, change: 0, changePct: 0 },
  };

  writeFileSync('public/market-data.json', JSON.stringify(output, null, 2));
  console.log('✅ Market data updated:', timestamp);
  console.log(JSON.stringify(output, null, 2));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
