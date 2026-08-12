# india-risk-dashboard

**West Asia War: India Risk Dashboard** — a daily tracker of what the Iran-Gulf
war costs India: oil, the rupee, Nifty and Sensex, Hormuz shipping, household
fuel prices, and nuclear exposure.

Live at <https://nithiyageo.github.io/india-risk-dashboard/>

## How it fits together

A React single page built with Vite and deployed to GitHub Pages. There is no
backend — the page reads four JSON files from its own origin.

```
public/
  war-intel.json       today's brief          hand-written, daily
  war-reference.json   slow-moving context    hand-written, weekly
  war-archive.json     append-only history    scripts/roll-archive.mjs
  market-data.json     live prices            scripts/fetch-market-data.mjs
  share-card.png       social preview         scripts/make-share-card.mjs
```

`src/App.jsx` merges the first three at load, later files winning, and treats
every key as optional — a single file carrying everything still renders.

To change what the page says, edit the data. See **[DAILY_UPDATE.md](DAILY_UPDATE.md)**.

## Commands

```bash
npm install

npm run dev        # local dev server
npm run build      # production build into dist/
npm run preview    # serve the production build

npm run validate   # check the data against the layout it has to fit
npm run market     # fetch Brent, Nifty, Sensex and USD/INR
npm run roll       # file the session into the archive
npm run card       # render the social preview image
npm run daily      # all four, in order
```

## Automation

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `update-market.yml` | 8× daily, weighted to Indian market hours | Fetches prices, files the archive row, regenerates the share card, validates, pushes |
| `deploy.yml` | push to `main` | Validates, builds, deploys to Pages |
| `validate.yml` | pull request | Validates and builds, so a broken brief fails the check instead of the site |

`scripts/validate-intel.mjs` is the guard rail. It checks the data against the
slots that render it: prose written into a fixed-size status chip, a headline
in a metric value, an unknown colour token, a radar score above 100, a
duplicated archive day. All of those had shipped to production before it
existed.

## Data conventions

- All timestamps are IST (UTC+05:30).
- Day 1 of the war is `_start` in `war-intel.json` (2026-02-28). Day numbers
  are always derived from it, never hand-typed.
- Colour tokens in the data are names — `red`, `orange`, `amber`, `green`,
  `cyan`, `purple`, `teal` — resolved against the palette in `src/App.jsx`.
- Fields that render in a fixed-size slot have character limits. They are
  listed in [DAILY_UPDATE.md](DAILY_UPDATE.md) and enforced by the validator.

## Disclaimer

Built with AI tools. Ongoing project. Nuclear and contamination scores are
analytical estimates, not measurements. Projections are trend extrapolations,
not forecasts. Not financial, safety, or evacuation advice.
