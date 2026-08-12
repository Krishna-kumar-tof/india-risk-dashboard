# Daily update

The dashboard used to be one 95KB JSON file. Rewriting a sentence meant
re-emitting the whole thing, including 60 archived sessions and 27 maritime
entries that had not changed since April.

It is now three files, and **you only edit one of them.**

| File | Size | Who writes it | How often |
| --- | --- | --- | --- |
| `public/war-intel.json` | ~16KB | you | daily |
| `public/war-reference.json` | ~9KB | you | when a price or a site status actually changes |
| `public/war-archive.json` | ~68KB | `scripts/roll-archive.mjs` | automatically |
| `public/market-data.json` | ~1KB | `scripts/fetch-market-data.mjs` | automatically, 8× a day |

## Never type these again

The market feed already fetched them, and the roll script already filed them:

- Brent, Nifty, Sensex and the rupee — including the day-over-day change
- The archive row for the session (day number, date label, prices, severity)
- The maritime timeline entry
- The share card image

If you find yourself typing a number that a market feed knows, stop.

## What to hand Claude

Do **not** paste the existing file in and ask for it back. That is what made
each update cost twice: once to read the archive, once to reprint it. Paste the
skeleton below plus your source material, and ask for the skeleton back filled
in.

<details>
<summary>Daily skeleton — copy this into the prompt</summary>

```json
{
  "_asOf": "YYYY-MM-DD",
  "_updated": "Month D, YYYY — H:MM AM IST",
  "_start": "2026-02-28",
  "_phase": "OMAN FRAMEWORK",
  "_phaseTone": "red",
  "_phaseBadge": "one line, under 150 chars",
  "deaths": "0,000+",
  "shareLine": "1–2 sentences for the share card",
  "brief": [
    "Four plain-language points, under 240 chars each. No jargon.",
    "Do not open with the day number or the risk level — both are already on screen.",
    "", ""
  ],
  "whatChanged": {
    "label": "WHAT CHANGED — DAY N — WEEKDAY MONTH D",
    "items": [
      { "color": "red", "bold": "HEADLINE IN CAPS", "text": "2–4 sentences." }
    ]
  },
  "exec": {
    "level": "HIGH",
    "phase": "short phrase",
    "oilNote": "one sentence",
    "shipping": "SHORT STATUS",
    "shippingSub": "one or two sentences",
    "militarySub": "one or two sentences",
    "indiaSub": "one or two sentences"
  },
  "hormuzStatus": {
    "state": "SHORT STATUS",
    "trafficState": "SHORT STATUS",
    "navyEscort": "ACTIVE",
    "transitedNote": "short caption",
    "preWarFlow": "~90-140 ships/day",
    "headline": "one sentence alert",
    "status": "the day's maritime narrative, a paragraph",
    "currentFlow": "enforcement and traffic picture, a paragraph",
    "totalShipsWaiting": "queue and repatriation picture, a paragraph",
    "lastTransit": "one sentence",
    "indianVesselsNear": 0,
    "indianSeafarers": 0,
    "indianTransited": 0,
    "indianNavyEscort": "a paragraph",
    "indianCasualties": 0,
    "indianCasualtyDetail": "a paragraph"
  },
  "military": [
    { "lv": "BREAKING", "color": "red", "t": "DATE — TITLE", "d": "2–4 sentences." }
  ],
  "econ": {
    "sensex": "00,000.00 (close, -0.00%)",
    "sensexSub": "one or two sentences",
    "vix": "~00.0 — EASING",
    "vixDelta": "one or two sentences",
    "fpi": "+$0.0bn in MONTH so far",
    "fpiDelta": "one or two sentences",
    "wealth": "~₹000–000 lakh crore",
    "wealthSub": "one or two sentences",
    "analysis": "the market read, a paragraph"
  },
  "radar": [
    { "axis": "Oil Shock", "w1": 0, "now": 0, "w4": 0 },
    { "axis": "Market Crash", "w1": 0, "now": 0, "w4": 0 },
    { "axis": "Nuclear Risk", "w1": 0, "now": 0, "w4": 0 },
    { "axis": "Hormuz Closure", "w1": 0, "now": 0, "w4": 0 },
    { "axis": "Household", "w1": 0, "now": 0, "w4": 0 },
    { "axis": "Currency", "w1": 0, "now": 0, "w4": 0 },
    { "axis": "Social Unrest", "w1": 0, "now": 0, "w4": 0 },
    { "axis": "Mil. Exposure", "w1": 0, "now": 0, "w4": 0 }
  ],
  "assessment": {
    "headline": "the day in one long sentence, caps",
    "body": "SECTION HEADS IN CAPS\n• bullets under them\n\nNext section..."
  }
}
```

</details>

Prompt that goes with it:

> Fill in this JSON skeleton from the sources below for **&lt;date&gt;**. Return
> only the JSON, nothing else. Keep every field marked SHORT under its
> character limit. Do not invent market prices — those are fetched
> automatically. Do not include a timeline or an archive.

## Length limits

These are not style preferences. Each of these fields renders in a fixed-size
slot, and a paragraph in one of them is what used to blow the layout apart —
a 700-character narrative once rendered inside a centred status chip.

| Field | Max |
| --- | --- |
| `_phase` | 24 |
| `_phaseBadge` | 150 |
| `deaths` | 14 |
| `exec.level` | 12 |
| `exec.phase` | 60 |
| `exec.shipping`, `exec.military` | 30 |
| `hormuzStatus.state`, `hormuzStatus.trafficState` | 40 |
| `hormuzStatus.navyEscort` | 14 |
| `hormuzStatus.transitedNote` | 46 |
| `econ.sensex`, `econ.vix`, `econ.fpi`, `econ.wealth` | 40 |

Everything else is prose and is rendered as paragraphs — write as much as the
day deserves.

One exception: `brief` is the 60-second brief, so it has to actually read in
about a minute. Four points, under 240 characters each, under 1,100 characters
in total. It sits in two balanced columns, so points of roughly equal length
look best. Do not open it by restating the day number or the risk level — the
header badge and the Risk Level card are directly above it.

`npm run validate` checks all of it. So does CI, on every pull request and
before every deploy, so a bad brief cannot reach the live site.

## Publishing

```bash
npm run validate     # check the brief before it goes anywhere
git add public/war-intel.json
git commit -m "intel: day N"
git push
```

The rest happens on its own: the market refresh files the archive row and
regenerates the share card, and the push redeploys the site.

To do a full local dry run:

```bash
npm run daily        # fetch market data, roll the archive, render the card, validate
npm run dev          # look at it
```

## Weekly, not daily

`public/war-reference.json` holds the things that move slowly. Check it once a
week and after any policy change:

- `kitchen` — the household price table. Update when a pump price or an LPG
  cylinder rate actually changes, not to restate that it did not.
- `budget` — the six numbers behind the calculator. These must match `kitchen`.
- `nukes`, `cities` — site status and city exposure scores.
- `featured` — published research links.
- `hormuzPhases` — the phase track.
- `preWar` — pre-war baselines. These should never change.

Some of this content is currently older than it looks. `nukes[0].info` still
refers to an April ceasefire, and `cities[0].info` still predicts a pump hike
that has since happened. Worth a pass.

## Automating further

The brief is the part that needs judgement, so it is the part worth keeping
manual. If you do want to automate it, the pieces are already here:

1. Give a scheduled workflow the skeleton above and the day's sources, have it
   write `public/war-intel.json`, and let `npm run validate` gate the result.
   The validator failing is the signal to look at it yourself.
2. Open it as a pull request rather than pushing to `main`. The
   `Validate` workflow already runs on pull requests, so a bad brief shows up
   as a red check instead of a broken page.
3. Keep the sourcing manual either way. Getting the facts right is the job;
   formatting them is what the scripts are for.
