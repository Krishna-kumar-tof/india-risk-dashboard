import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// INDIA RISK DASHBOARD — V19.0
//
// DATA MODEL — three files, merged at load in this order:
//   war-reference.json  slow-moving context (kitchen basket, nuclear
//                       sites, city exposure, phases, pre-war
//                       baselines). Reviewed weekly.
//   war-archive.json    append-only history (timeline, maritime
//                       events). Written by scripts/roll-archive.mjs.
//   war-intel.json      today's brief, and the only file edited by
//                       hand each day.
// Splitting these cut the hand-written daily payload by ~87%: the
// archive no longer has to be re-emitted to change one sentence.
// A single fat war-intel.json still renders correctly — the merge
// treats every key as optional.
//
// LAYOUT CONTRACT — the reason this file used to break:
//   Fields that land in a small slot (metric values, status chips)
//   must be SHORT. Long prose belongs in the narrative fields, which
//   render as paragraphs. `short()` clamps anything oversized so a bad
//   update degrades instead of exploding, and scripts/validate-intel.mjs
//   fails the build before it ships.
//
// V19.0: phase tone no longer defaults to "all clear" for an
// unrecognised phase; severity 4 rows no longer render green; the
// charts collapse intraday duplicates; the ticker and share line are
// derived from whatChanged when absent.
// ═══════════════════════════════════════════════════════════════════

const C = {
  bg:"#080c14",surface:"#0e1420",card:"#121826",raised:"#18202e",
  border:"#1e2a3d",border2:"#253047",text:"#c8d0e0",sub:"#93a4bf",
  muted:"#7288a6",white:"#eef2fa",
  amber:"#f59e0b",amberDim:"#f59e0b14",amberMid:"#f59e0b30",
  red:"#ef4444",redDim:"#ef444414",
  green:"#10b981",greenDim:"#10b98112",
  cyan:"#38bdf8",cyanDim:"#38bdf810",
  orange:"#fb923c",orangeDim:"#fb923c12",
  purple:"#a78bfa",purpleDim:"#a78bfa10",
  teal:"#2dd4bf",
};

const SYNE = "'Syne','DM Sans',system-ui,sans-serif";
const MONO = "'IBM Plex Mono','JetBrains Mono',monospace";
const SERIF= "'Source Serif 4','Georgia',serif";

// ─── Fallbacks ────────────────────────────────────────────────────
const RADAR_FB  = [];

// War start — single source of truth for day numbering (V18.0).
// Overridable via intel._start. Day 1 = first day of the war.
const WAR_START = "2026-02-28";
const dayOf = (iso, start=WAR_START) =>
  Math.floor((Date.parse(iso+"T00:00:00Z") - Date.parse(start+"T00:00:00Z")) / 86400000) + 1;

// The war phase and the strait's operational state are different
// things. An unknown phase must read as caution, never as all-clear —
// the previous binary check turned the header green the day the phase
// label changed to one it did not recognise.
const PHASE_TONE = {
  "FULL CLOSURE":"red", "PEAK SHOCK":"orange", "CEASEFIRE":"green",
  "BLOCKADE":"red", "BLOCKADE II":"red", "ESCALATION":"red",
  "RE-ESCALATION":"red", "TALKS":"amber", "60-DAY TALKS":"amber",
  "OMAN FRAMEWORK":"amber", "TRUCE":"green",
};
const phaseTone = intel => {
  const explicit = intel?._phaseTone;
  if (explicit && C[explicit]) return C[explicit];
  return C[PHASE_TONE[(intel?._phase ?? "").toUpperCase()] ?? "amber"];
};

// Guard for values that render in a fixed-size slot. Oversized copy is
// a data error, but it must not blow the layout apart while it is live.
const short = (v, max=42) => {
  const s = v == null ? "" : String(v).trim();
  return s.length <= max ? s : s.slice(0, max - 1).replace(/[\s,;:.—-]+$/,"") + "\u2026";
};

// Pre-war baselines — overridable via intel.preWar. Used by the brief,
// the share card and every "vs pre-war" comparison so no component
// hardcodes a baseline of its own.
const PRE_FB = {brent:65, rupee:91.49, nifty:22124, lpg:853, petrol:94.72, diesel:87.62};

// Sentence clamp that does not break on abbreviations (Rs., U.S., Jul.)
const clampSentences = (txt, n) => {
  if (!txt) return "";
  const parts = txt.match(/[^.!?]+(?:[.!?]+(?=\s+[A-Z0-9"\u201c]|$)|$)/g);
  if (!parts || parts.length <= n) return txt.trim();
  return parts.slice(0, n).join(" ").trim() + " \u2026";
};

// Absolute base path, so the data still loads when the site is opened
// without a trailing slash (a relative "./" resolves one level up).
const BASE = import.meta.env.BASE_URL || './';
const loadJSON = async file => {
  const res = await fetch(`${BASE}${file}?t=${Date.now()}`, {cache:'no-store'});
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  return res.json();
};

const Empty = ({label}) => (
  <div style={{background:C.card,border:`1px dashed ${C.border2}`,borderRadius:10,
    padding:'16px 14px',fontSize:12.5,color:C.sub,fontFamily:MONO,textAlign:'center'}}>
    {label} unavailable — data feed not loaded. Try a refresh.
  </div>
);

const FEATURED_FB = [
  {title:"The Strait of Hormuz and the New Logic of Chokepoint Control",date:"April 30, 2026",tag:"GEOSPATIAL",tagColor:C.cyan,
   desc:"Chokepoint control is no longer binary (open/closed) but a layered spatial contest spanning seabed topology, island sovereignty, electronic warfare, and visibility asymmetry — by Dr Y Nithiyanandam.",
   url:"https://geospatialbulletin.takshashila.org.in/p/15-the-strait-of-hormuz-and-the-new",org:"Takshashila Geospatial Bulletin",icon:"🗺️"},
  {title:"Geopolitics of LPG Supply in India",date:"March 18, 2026",tag:"PUBLICATION",tagColor:C.amber,
   desc:"How India's LPG import dependency on the Gulf creates acute vulnerability during the West Asia War. Explores Hormuz exposure, alternative supply routes, and policy imperatives for energy security.",
   url:"https://takshashila.org.in/content/publications/20260318-LPG-Geopolitics.html",org:"Takshashila Institution",icon:"🛢️"},
  {title:"Geopolitics of Fertiliser Supply in India",date:"April 2, 2026",tag:"PUBLICATION",tagColor:C.green,
   desc:"India imports 30%+ of its fertilisers via the Strait of Hormuz. Maps supply chain risks to kharif and rabi crops and the strategic case for diversification.",
   url:"https://takshashila.org.in/content/publications/20260402-Fertilizer-Geopolitics.html",org:"Takshashila Institution",icon:"🌾"},
];

const NAV = [
  {id:"overview",  l:"Overview"},
  {id:"hormuz",    l:"Maritime"},
  {id:"kitchen",   l:"Household"},
  {id:"economic",  l:"Markets"},
  {id:"military",  l:"Military"},
  {id:"nuclear",   l:"Nuclear"},
  {id:"radar",     l:"Risk Index"},
  {id:"warlog",    l:"Archive"},
  {id:"assessment",l:"Assessment"},
  {id:"sources",   l:"Sources"},
];

// ─── Mini Line Chart ───────────────────────────────────────────────
const MiniLine = ({data, dataKey, color, h=110}) => {
  const vals = data.map(d => d[dataKey]).filter(v => v != null && typeof v === 'number');
  if (!vals.length) return null;
  const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
  const W = 500, pad = {l:32, r:16, t:22, b:30};
  const iw = W - pad.l - pad.r, ih = h - pad.t - pad.b;
  const filtered = data.filter(d => d[dataKey] != null && typeof d[dataKey] === 'number');
  const pts = filtered.map((d, i) => ({
    x: pad.l + (i / Math.max(filtered.length - 1, 1)) * iw,
    y: pad.t + (1 - (d[dataKey] - mn) / rng) * ih,
    v: d[dataKey], l: d.l || d.w || "", i
  }));
  const line = pts.map((p, i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = pts.length ? line + ` L${pts[pts.length-1].x},${(pad.t+ih).toFixed(1)} L${pts[0].x},${(pad.t+ih).toFixed(1)} Z` : '';
  const id = `grad-${dataKey}`;
  // Label every point that clears a minimum spacing, always keeping the
  // first and last. Evenly-spaced sampling used to collide at the right
  // edge and print two figures on top of each other.
  const MIN_GAP = 54;
  const marks = [];
  pts.forEach((p, i) => {
    if (i === 0) { marks.push(i); return; }
    const prevX = pts[marks[marks.length - 1]].x;
    if (i === pts.length - 1) {
      if (p.x - prevX < MIN_GAP && marks.length > 1) marks.pop();
      marks.push(i);
    } else if (p.x - prevX >= MIN_GAP) marks.push(i);
  });
  const marked = new Set(marks);
  return (
    <svg viewBox={`0 0 ${W} ${h}`} style={{width:'100%',height:'auto',overflow:'visible',display:'block'}}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Y-axis gridlines */}
      {[0,25,50,75,100].map(pct => {
        const y = pad.t + (pct/100) * ih;
        const v = mx - (pct/100) * rng;
        return (
          <g key={pct}>
            <line x1={pad.l} y1={y} x2={pad.l+iw} y2={y} stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3"/>
            <text x={pad.l-4} y={y+3} fill={C.muted} fontSize="8.5" textAnchor="end" fontFamily={MONO}>
              {typeof v==='number' && v>999 ? (v/1000).toFixed(1)+'k' : Math.round(v)}
            </text>
          </g>
        );
      })}
      {area && <path d={area} fill={`url(#${id})`}/>}
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => marked.has(i) && (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill={C.card} stroke={color} strokeWidth="1.5"/>
          <text x={p.x} y={p.y - 7} fill={color} fontSize="9.5" textAnchor="middle" fontWeight="700" fontFamily={MONO} opacity="0.9">
            {typeof p.v === 'number' && p.v > 999 ? (p.v/1000).toFixed(1)+'k' : p.v}
          </text>
          <text x={p.x} y={h-2} fill={C.muted} fontSize="9" textAnchor="middle" fontFamily={MONO}
            transform={pts.length>12 ? `rotate(-40,${p.x},${h-2})` : undefined}>
            {p.l}
          </text>
        </g>
      ))}
    </svg>
  );
};

const Bar = ({value, max=100, color, h=4}) => (
  <div style={{height:h, background:C.border, borderRadius:h/2, overflow:'hidden', marginTop:3}}>
    <div style={{height:'100%', width:`${Math.min((value/max)*100,100)}%`,
      background: color || (value>70?C.red:value>50?C.orange:value>30?C.amber:C.green),
      borderRadius:h/2, transition:'width 0.5s ease'}}/>
  </div>
);

const RadarSVG = ({data, day}) => {
  const W=300, H=300, cx=W/2, cy=H/2+10, r=98, n=data.length;
  const ang = i => (Math.PI*2*i)/n - Math.PI/2;
  const pt = (i, v) => ({x: cx + Math.cos(ang(i)) * (v/100) * r, y: cy + Math.sin(ang(i)) * (v/100) * r});
  const polygon = (key, col, dash) => {
    const p = data.map((d,i) => pt(i, d[key]));
    return <polygon points={p.map(pp=>`${pp.x.toFixed(1)},${pp.y.toFixed(1)}`).join(' ')}
      fill={`${col}18`} stroke={col} strokeWidth={dash?'1.2':'1.8'} strokeDasharray={dash||'none'}/>;
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto'}}>
      {[20,40,60,80,100].map(v => (
        <polygon key={v} points={data.map((_,i)=>pt(i,v)).map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
          fill="none" stroke={C.border} strokeWidth="0.6"/>
      ))}
      {data.map((_,i) => {
        const p = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke={C.border} strokeWidth="0.6"/>;
      })}
      {polygon('w1', C.green)}
      {polygon('now', C.amber)}
      {polygon('w4', C.red, '4 2')}
      {data.map((d, i) => {
        const lp = pt(i, 128);
        return (
          <text key={i} x={lp.x.toFixed(1)} y={lp.y.toFixed(1)}
            fill={C.sub} fontSize="10" textAnchor="middle" dominantBaseline="middle"
            fontWeight="600" fontFamily={MONO}>{d.axis}</text>
        );
      })}
      {[{l:'Week 1',c:C.green},{l:`Now (D${day})`,c:C.amber},{l:'Wk 12 Outlook',c:C.red}].map((lg,i)=>(
        <g key={i}>
          <rect x={8} y={H-30+i*10} width={10} height={3} fill={lg.c} rx="1"/>
          <text x={22} y={H-26+i*10} fill={C.sub} fontSize="9.5" fontFamily={MONO}>{lg.l}</text>
        </g>
      ))}
    </svg>
  );
};

const S = ({id, title, accent=C.amber, sub, children}) => (
  <section id={id} style={{marginBottom:48, scrollMarginTop:58}}>
    <div style={{marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:'flex', alignItems:'center', gap:11}}>
        <span style={{width:24, height:4, background:accent, borderRadius:2, flexShrink:0,
          boxShadow:`0 0 12px ${accent}50`}}/>
        <h2 style={{margin:0, fontSize:16, fontWeight:800, color:C.white,
          letterSpacing:1.2, textTransform:'uppercase', fontFamily:SYNE}}>{title}</h2>
      </div>
      {sub && <p style={{margin:'7px 0 0 35px', fontSize:13, color:C.sub, fontFamily:SERIF, lineHeight:1.6}}>{sub}</p>}
    </div>
    {children}
  </section>
);

const Chip = ({children, color=C.amber, size=10.5}) => (
  <span style={{display:'inline-block', padding:'2px 8px', borderRadius:4,
    background:`${color}18`, border:`1px solid ${color}30`,
    color, fontSize:size, fontWeight:700, fontFamily:MONO, letterSpacing:0.8,
    textTransform:'uppercase', whiteSpace:'nowrap'}}>{children}</span>
);

// Metric card. The headline value is sized to its own length so a
// short number stays big and a phrase still fits the box.
const Mc = ({label, value, sub, delta, accent=C.amber, deltaColor, indiaImpact}) => {
  const v = value == null || value === "" ? "\u2014" : short(String(value), 64);
  const vSize = v.length > 44 ? 13 : v.length > 30 ? 15 : v.length > 20 ? 18 : v.length > 13 ? 21 : 24;
  return (
    <div style={{background:C.card, borderRadius:10, padding:'14px 14px',
      border:`1px solid ${C.border}`, borderTop:`2px solid ${accent}`,
      display:'flex', flexDirection:'column', gap:3, minWidth:0}}>
      <div style={{fontSize:10, color:C.muted, letterSpacing:2.5, textTransform:'uppercase',
        fontWeight:700, fontFamily:MONO}}>{label}</div>
      <div title={String(value ?? "")}
        style={{fontSize:vSize, fontWeight:700, color:accent, fontFamily:SYNE,
          lineHeight:1.2, letterSpacing:vSize>18?-0.5:0, overflowWrap:'anywhere'}}>{v}</div>
      {delta && <div style={{fontSize:12.5, color:deltaColor||C.sub, fontWeight:600,
        fontFamily:MONO, lineHeight:1.45, overflowWrap:'anywhere'}}>{short(delta, 72)}</div>}
      {sub && <div style={{fontSize:11, color:C.muted, lineHeight:1.55}}>{sub}</div>}
      {indiaImpact && (
        <div style={{marginTop:5, paddingTop:5, borderTop:`1px solid ${C.border}`,
          fontSize:10.5, color:C.amber, fontWeight:600, fontFamily:MONO, letterSpacing:0.3}}>
          🇮🇳 {indiaImpact}
        </div>
      )}
    </div>
  );
};

// ─── Household Budget Calculator (V17.1) ──────────────────────────
// Prices read from intel.budget in war-intel.json; fallback below.
// Daily update = edit the six numbers in JSON only.
const BUDGET_FB = {petrolPre:94.72, petrolNow:103.54, dieselPre:87.62, dieselNow:90.03, lpgPre:853, lpgNow:912.5};
const BudgetCalc = ({budget}) => {
  const b = {...BUDGET_FB, ...(budget||{})};
  const [petrol, setPetrol] = useState(40);
  const [diesel, setDiesel] = useState(0);
  const [lpg,    setLpg]    = useState(1);
  const extra =
    petrol*(b.petrolNow-b.petrolPre) +
    diesel*(b.dieselNow-b.dieselPre) +
    lpg*(b.lpgNow-b.lpgPre);
  const fmt = n => "₹"+Math.round(n).toLocaleString('en-IN');
  const rows = [
    {label:"Petrol", unit:"litres", val:petrol, set:setPetrol, pre:b.petrolPre, now:b.petrolNow},
    {label:"Diesel", unit:"litres", val:diesel, set:setDiesel, pre:b.dieselPre, now:b.dieselNow},
    {label:"LPG Cylinder (14.2kg)", unit:"cylinders", val:lpg, set:setLpg, pre:b.lpgPre, now:b.lpgNow},
  ];
  return (
    <div style={{background:C.card,borderRadius:10,padding:'14px 16px',marginTop:12,
      border:`1px solid ${C.border}`,borderTop:`3px solid ${C.amber}`}}>
      <div style={{fontSize:10.5,fontWeight:700,color:C.amber,letterSpacing:2.5,
        fontFamily:MONO,marginBottom:4}}>YOUR MONTHLY WAR COST — CALCULATOR</div>
      <div style={{fontSize:11.5,color:C.sub,fontFamily:SERIF,lineHeight:1.6,marginBottom:8}}>
        Enter your household's monthly usage. Extra cost vs pre-war (Feb 27) prices, Delhi rates.
      </div>
      {rows.map((r,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',
          padding:'7px 0',borderBottom:`1px solid ${C.border}30`}}>
          <div style={{flex:'1 1 130px',minWidth:120}}>
            <div style={{fontSize:12.5,color:C.text,fontWeight:600,fontFamily:SYNE}}>{r.label}</div>
            <div style={{fontSize:10,color:C.muted,fontFamily:MONO}}>₹{r.pre} → ₹{r.now} {r.unit}</div>
          </div>
          <input type="number" min="0" value={r.val}
            onChange={e=>r.set(Math.max(0, Number(e.target.value)||0))}
            style={{width:64,padding:'5px 8px',borderRadius:6,border:`1px solid ${C.border}`,
              background:C.surface,color:C.amber,fontSize:13,fontFamily:MONO,
              fontWeight:700,outline:'none',textAlign:'right'}}/>
          <div style={{fontSize:10.5,color:C.muted,fontFamily:MONO,minWidth:70}}>{r.unit}/month</div>
          <div style={{fontSize:13,color:C.orange,fontWeight:700,fontFamily:MONO,
            minWidth:78,textAlign:'right'}}>+{fmt(r.val*(r.now-r.pre))}</div>
        </div>
      ))}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',
        flexWrap:'wrap',gap:8,marginTop:10}}>
        <div>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,fontFamily:MONO,fontWeight:700}}>EXTRA PER MONTH</div>
          <div style={{fontSize:26,fontWeight:800,color:extra>0?C.red:C.green,fontFamily:SYNE,letterSpacing:-0.5}}>
            {extra>0?"+":""}{fmt(extra)}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,fontFamily:MONO,fontWeight:700}}>PER YEAR AT THESE RATES</div>
          <div style={{fontSize:15,fontWeight:700,color:C.orange,fontFamily:MONO}}>
            {extra>0?"+":""}{fmt(extra*12)}</div>
        </div>
      </div>
    </div>
  );
};

// ─── War in Numbers — Day 1 vs Day 100 vs Today (V17.1) ───────────
// Pure derivation from intel.timeline. No new data required.
const WarInNumbers = ({timeline}) => {
  if (!timeline?.length) return null;
  const tl = [...timeline].sort((a,b)=>a.d-b.d);
  const d1 = tl[0];
  const today = tl[tl.length-1];
  const mid = tl.reduce((best,t)=>Math.abs(t.d-100)<Math.abs(best.d-100)?t:best, tl[0]);
  if (mid.d===d1.d || mid.d===today.d) return null;
  const pct = (a,b) => (a==null||b==null||!b) ? "" :
    ` (${a>=b?"+":""}${Math.round((a/b-1)*100)}%)`;
  const rows = [
    {m:"Brent ($)", f:t=>t.brent!=null?"$"+t.brent:"—", chg:pct(today.brent,d1.brent), c:C.amber},
    {m:"₹ / USD",   f:t=>t.rupee!=null?t.rupee.toFixed(2):"—", chg:pct(today.rupee,d1.rupee), c:C.orange},
    {m:"Nifty 50",  f:t=>t.nifty!=null?t.nifty.toLocaleString():"—", chg:pct(today.nifty,d1.nifty), c:C.cyan},
    {m:"War dead",  f:t=>t.deaths!=null?t.deaths.toLocaleString():"—", chg:"", c:C.red},
  ];
  const cols = [d1, mid, today];
  return (
    <div style={{background:C.card,borderRadius:10,padding:'12px 14px',marginBottom:12,
      border:`1px solid ${C.border}`,overflowX:'auto'}}>
      <div style={{fontSize:10.5,fontWeight:700,color:C.sub,letterSpacing:2.5,
        fontFamily:MONO,marginBottom:8}}>THE WAR IN NUMBERS — THEN vs NOW</div>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:11.5,fontFamily:MONO,minWidth:300}}>
        <thead>
          <tr style={{borderBottom:`1px solid ${C.border}`}}>
            <th style={{padding:'4px 6px',textAlign:'left',color:C.muted,fontSize:10.5,fontWeight:700}}>Metric</th>
            {cols.map((t,i)=>(
              <th key={i} style={{padding:'4px 6px',textAlign:'right',fontSize:10.5,fontWeight:700,
                color:i===2?C.amber:C.muted}}>
                {i===2?`LATEST (D${t.d})`:`DAY ${t.d}`}<br/>
                <span style={{fontWeight:400,fontSize:10}}>{t.l}</span>
              </th>
            ))}
            <th style={{padding:'4px 6px',textAlign:'right',color:C.muted,fontSize:10.5,fontWeight:700}}>vs Day 1</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${C.border}20`}}>
              <td style={{padding:'5px 6px',fontWeight:600,color:C.text,fontSize:11.5}}>{r.m}</td>
              {cols.map((t,j)=>(
                <td key={j} style={{padding:'5px 6px',textAlign:'right',
                  color:j===2?r.c:C.sub,fontWeight:j===2?700:500}}>{r.f(t)}</td>
              ))}
              <td style={{padding:'5px 6px',textAlign:'right',color:r.c,fontWeight:700}}>{r.chg||"—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Shareable Daily Card — canvas PNG for WhatsApp/X (V17.1) ─────
const wrapText = (ctx, text, x, y, maxW, lh, maxLines=3) => {
  const words = (text||"").split(/\s+/); let line="", lines=0;
  for (let i=0;i<words.length;i++){
    const test = line ? line+" "+words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line){
      if (lines===maxLines-1){ ctx.fillText(line.replace(/.{3}$/,"")+"…", x, y); return y; }
      ctx.fillText(line, x, y); y+=lh; lines++; line=words[i];
    } else line = test;
  }
  if (line) ctx.fillText(line, x, y);
  return y;
};

const makeShareCard = ({day, level, levelColor, brent, brentChg, nifty, rupee, lpg, rupeePre, lpgPre, headline, updated}) => {
  const cv = document.createElement('canvas');
  cv.width = 1080; cv.height = 1080;
  const x = cv.getContext('2d');
  // background
  x.fillStyle = "#080c14"; x.fillRect(0,0,1080,1080);
  x.strokeStyle = "#1e2a3d"; x.lineWidth = 2; x.strokeRect(24,24,1032,1032);
  x.fillStyle = "#f59e0b"; x.fillRect(24,24,1032,8);
  // header
  x.fillStyle = "#f59e0b"; x.font = "700 26px 'IBM Plex Mono', monospace";
  x.fillText("WEST ASIA WAR — INDIA RISK TRACKER", 64, 110);
  x.fillStyle = "#93a4bf"; x.font = "400 22px 'IBM Plex Mono', monospace";
  x.fillText(updated||"", 64, 148);
  // day + risk
  x.fillStyle = "#eef2fa"; x.font = "800 120px 'Syne', sans-serif";
  x.fillText(`DAY ${day}`, 64, 290);
  const lw = x.measureText(`DAY ${day}`).width;
  x.fillStyle = levelColor; x.font = "800 44px 'Syne', sans-serif";
  x.fillText(`RISK: ${level}`, 64, 356);
  // divider
  x.strokeStyle = "#1e2a3d"; x.beginPath(); x.moveTo(64,400); x.lineTo(1016,400); x.stroke();
  // metric grid (2x2)
  const cells = [
    ["OIL — BRENT", `$${brent}`, brentChg, "#f59e0b"],
    ["NIFTY 50", nifty, "", "#38bdf8"],
    ["RUPEE / USD", `₹${rupee}`, rupeePre ? `was ₹${rupeePre} pre-war` : "", "#fb923c"],
    ["LPG 14.2KG", lpg, lpgPre ? `was ₹${lpgPre} pre-war` : "", "#ef4444"],
  ];
  cells.forEach((cel,i)=>{
    const cx = 64 + (i%2)*486, cy = 460 + Math.floor(i/2)*180;
    x.fillStyle = "#121826"; x.fillRect(cx-14, cy-40, 458, 150);
    x.fillStyle = cel[3]; x.fillRect(cx-14, cy-40, 6, 150);
    x.fillStyle = "#93a4bf"; x.font = "700 22px 'IBM Plex Mono', monospace";
    x.fillText(cel[0], cx+14, cy);
    x.fillStyle = cel[3]; x.font = "800 58px 'Syne', sans-serif";
    x.fillText(String(cel[1]), cx+14, cy+62);
    x.fillStyle = "#93a4bf"; x.font = "400 20px 'IBM Plex Mono', monospace";
    x.fillText(String(cel[2]||""), cx+14, cy+96);
  });
  // headline
  x.fillStyle = "#c8d0e0"; x.font = "600 32px 'Source Serif 4', Georgia, serif";
  wrapText(x, headline, 64, 890, 952, 44, 3);
  // footer
  x.fillStyle = "#f59e0b"; x.font = "700 24px 'IBM Plex Mono', monospace";
  x.fillText("nithiyageo.github.io/india-risk-dashboard", 64, 1020);
  return cv;
};

const shareCard = (payload) => {
  const cv = makeShareCard(payload);
  cv.toBlob(async blob => {
    if (!blob) return;
    const file = new File([blob], `india-risk-day${payload.day}.png`, {type:'image/png'});
    if (navigator.canShare && navigator.canShare({files:[file]})) {
      try { await navigator.share({files:[file], title:`West Asia War — Day ${payload.day}`}); return; }
      catch(e){ /* user cancelled → fall through to download */ }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
  }, 'image/png');
};

// ─── Horizontal Interactive Timeline ──────────────────────────────
const HormuzTimeline = ({events, phaseData}) => {
  const [active, setActive] = useState(null);
  if (!events || !events.length) return null;
  const phases = (phaseData?.length ? phaseData.map(p=>({...p, color:C[p.color]||p.color||C.amber})) : [
    {label:"FULL CLOSURE", color:C.red,   days:"Feb 28–Mar 10"},
    {label:"PEAK SHOCK",   color:C.orange,days:"Mar 11–Apr 7"},
    {label:"CEASEFIRE",    color:C.green, days:"Apr 7–18"},
    {label:"BLOCKADE",     color:C.red,   days:"Apr 18–Jun 7"},
    {label:"ESCALATION",   color:C.red,   days:"Jun 8–16"},
    {label:"60-DAY TALKS", color:C.amber, days:"Jun 17–Aug 16"},
    {label:"RE-ESCALATION",color:C.red,   days:"Jul 7–9"},
  ]);
  return (
    <div>
      {/* Phase track */}
      <div style={{display:'flex',gap:3,marginBottom:10,flexWrap:'wrap'}}>
        {phases.map((p,i)=>(
          <div key={i} style={{flex:1,minWidth:80,background:`${p.color}14`,
            border:`1px solid ${p.color}30`,borderRadius:6,padding:'6px 8px',textAlign:'center'}}>
            <div style={{fontSize:10,fontWeight:800,color:p.color,fontFamily:MONO,letterSpacing:0.5}}>{p.label}</div>
            <div style={{fontSize:10,color:C.muted,fontFamily:MONO,marginTop:2}}>{p.days}</div>
          </div>
        ))}
      </div>
      {/* Clickable events */}
      <div style={{position:'relative'}}>
        <div style={{position:'absolute',left:48,top:0,bottom:0,width:1,background:C.border}}/>
        {events.map((e,i)=>(
          <div key={i} role="button" tabIndex={0} aria-expanded={active===i}
            style={{display:'flex',gap:10,marginBottom:6,cursor:'pointer'}}
            onClick={()=>setActive(active===i?null:i)}
            onKeyDown={ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();setActive(active===i?null:i);}}}>
            <div style={{flexShrink:0,width:48,textAlign:'right',paddingTop:3}}>
              <span style={{fontSize:10.5,fontWeight:700,color:C.cyan,fontFamily:MONO}}>{e.d}</span>
            </div>
            <div style={{flexShrink:0,width:10,display:'flex',alignItems:'flex-start',paddingTop:6}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:active===i?C.cyan:C.border2,
                border:`2px solid ${C.cyan}`,flexShrink:0,transition:'background 0.2s'}}/>
            </div>
            <div style={{flex:1,background:active===i?C.raised:C.card,borderRadius:8,
              padding:'8px 12px',border:`1px solid ${active===i?C.cyan+'40':C.border}`,
              transition:'all 0.2s'}}>
              <div style={{fontSize:12.5,color:active===i?C.white:C.sub,fontFamily:SERIF,lineHeight:1.6}}>
                {active===i ? e.e : clampSentences(e.e, 1)}
              </div>
              {active!==i && <div style={{fontSize:10,color:C.muted,fontFamily:MONO,marginTop:3}}>Click to expand ▼</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [expNuke,     setExpNuke]     = useState(null);
  const [activeNav,   setActiveNav]   = useState(null);
  const [live,        setLive]        = useState(null);
  const [intel,       setIntel]       = useState(null);
  const [logExpanded, setLogExpanded] = useState(false);
  const [logSearch,   setLogSearch]   = useState('');
  const [aboutOpen,   setAboutOpen]   = useState(false);
  const [wcExpanded,  setWcExpanded]  = useState({});
  const [loadErr,     setLoadErr]     = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [market, reference, archive, daily] = await Promise.all(
        ['market-data.json','war-reference.json','war-archive.json','war-intel.json']
          .map(f => loadJSON(f).catch(err => { console.warn(err.message); return null; }))
      );
      if (!alive) return;
      if (market) setLive(market);
      // Later files win. Every key is optional, so a single legacy
      // war-intel.json carrying everything still renders.
      if (daily || reference || archive) {
        setIntel({...(reference ?? {}), ...(archive ?? {}), ...(daily ?? {})});
      }
      if (!daily || !market) setLoadErr(true);
    })();
    return () => { alive = false; };
  }, []);

  // Scroll-spy: keep the sticky nav in step with the section on screen.
  useEffect(() => {
    const els = NAV.map(n=>document.getElementById(n.id)).filter(Boolean);
    if (!els.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e=>e.isIntersecting)
        .sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
      if (vis) setActiveNav(vis.target.id);
    }, {rootMargin:'-58px 0px -70% 0px', threshold:0});
    els.forEach(el=>io.observe(el));
    return () => io.disconnect();
  }, [intel]);

  const go = id => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  };

  // Day number is derived from the war start date so it can never drift
  // out of step with the calendar; intel._day is honoured only as a fallback.
  const iDay      = intel?._asOf ? dayOf(intel._asOf, intel?._start ?? WAR_START)
                                 : (intel?._day ?? 0);
  const iUpdated  = intel?._updated      ?? "Loading...";
  const iDeaths   = intel?.deaths        ?? "\u2014";
  const iWC       = intel?.whatChanged   ?? {label:'Loading intelligence…', items:[]};
  const iEcon     = intel?.econ          ?? null;
  const iRadar    = intel?.radar         ?? RADAR_FB;
  const iAssess   = intel?.assessment    ?? null;
  const iHLatest  = intel?.hormuzLatest  ?? [];
  const iKitchen  = intel?.kitchen       ?? [];
  const iMilitary = intel?.military      ?? [];
  const iNukes    = intel?.nukes         ?? [];
  const iCities   = intel?.cities        ?? [];
  const iHormuz   = intel?.hormuzStatus  ?? null;
  const iHEvents  = intel?.hormuzEvents  ?? iHLatest;
  const iPhase    = intel?._phase        ?? "";
  const PRE       = {...PRE_FB, ...(intel?.preWar||{})};
  const iFeatured = intel?.featured      ?? FEATURED_FB;
  const iMilTop   = intel?.milTop        ?? [];

  // The ticker restates the day's headlines, so derive it from them
  // rather than asking for the same lines to be written twice.
  const iT = intel?.ticker?.length
    ? intel.ticker
    : (iWC.items ?? []).map(it => it.bold).filter(Boolean);

  const phaseCol  = phaseTone(intel);
  const phaseCalm = phaseCol === C.green;

  // Chips take the short state fields; anything long is prose. Files
  // written before the split kept a short string in `status`, so fall
  // back to that when it is genuinely short.
  const isLong = v => String(v ?? "").length > 44;
  const hormuzState = short(
    iHormuz?.state ?? (isLong(iHormuz?.status) ? "SEE BRIEFING" : iHormuz?.status) ?? "STATUS PENDING", 40);
  const hormuzTraffic = short(
    iHormuz?.trafficState ?? (isLong(iHormuz?.currentFlow) ? "SEE BRIEFING" : iHormuz?.currentFlow) ?? "\u2014", 40);
  const maritimeBriefing = [
    iHormuz?.status, iHormuz?.currentFlow, iHormuz?.totalShipsWaiting, iHormuz?.indianNavyEscort,
  ].filter(isLong);

  // ── Executive snapshot (derived from JSON; overridable via intel.exec) ──
  const iExec    = intel?.exec ?? {};
  const radarNow = k => (intel?.radar ?? []).find(r=>r.axis===k)?.now;
  const riskAvg  = (intel?.radar?.length)
    ? Math.round(intel.radar.reduce((s,r)=>s+(r.now||0),0)/intel.radar.length) : null;
  const derivedLevel = riskAvg==null ? null
    : riskAvg>=75 ? "SEVERE" : riskAvg>=60 ? "HIGH" : riskAvg>=45 ? "ELEVATED" : "MODERATE";
  const riskLevel = iExec.level ?? derivedLevel ?? "—";
  const riskColor = riskLevel==="SEVERE" ? C.red : riskLevel==="HIGH" ? C.orange
    : riskLevel==="ELEVATED" ? C.amber : C.green;

  const fullTL = [...(intel?.timeline ?? [])]
    .sort((a,b)=>a.d-b.d);

  // Some days carry a morning and an evening entry. The archive keeps
  // both, but a line chart needs one point per day or the x-axis stops
  // being monotonic and two markers land on the same tick.
  const chartTL = Object.values(
    fullTL.reduce((acc,t)=>{ acc[t.d]=t; return acc; }, {})
  ).sort((a,b)=>a.d-b.d);

  const brentRaw  = live?.brent?.price     ?? 100;
  const brentChg  = live?.brent?.changePct ?? -4.50;
  const niftyRaw  = live?.nifty?.price     ?? 23719;
  const niftyChg  = live?.nifty?.change    ?? 65;
  const sensexRaw = live?.sensex?.price    ? Math.round(live.sensex.price) : 75415;
  const rupeeRaw  = live?.rupee?.price     ?? 95.50;

  const brentColor = brentRaw > 110 ? C.red : brentRaw > 95 ? C.orange : C.amber;
  const niftyColor = niftyChg >= 0 ? C.green : C.red;

  // ── 60-Second Brief (plain language; overridable via intel.brief array) ──
  const lpgNow = intel?.budget?.lpgNow ?? 912.5;
  const iBrief = intel?.brief ?? [
    `Day ${iDay} of the West Asia war. Overall risk to India right now: ${riskLevel}.`,
    `Oil: Brent crude is around $${brentRaw} a barrel — about ${Math.round((brentRaw/PRE.brent-1)*100)}% higher than before the war. Most of India's imported oil passes through the Strait of Hormuz, which is currently disrupted.`,
    `Your money: the rupee is at ₹${typeof rupeeRaw==='number'?rupeeRaw.toFixed(2):rupeeRaw} per dollar (₹${PRE.rupee} pre-war), which makes imports costlier. Petrol has already been hiked; an LPG cylinder now costs ₹${lpgNow}.`,
    `Markets: the Nifty is at ${typeof niftyRaw==='number'?Math.round(niftyRaw).toLocaleString():niftyRaw}. Volatile, but not crashing.`,
    `Bottom line: no shortages in India today, but fuel and kitchen costs are rising. This page is updated daily — check the Household section for what it means for your budget.`,
  ];

  // ── Shareable daily card payload ──
  const sharePayload = {
    day: iDay, level: riskLevel, levelColor: riskColor,
    brent: brentRaw, brentChg: (brentChg>0?"▲ +":"▼ ")+Math.abs(brentChg).toFixed(1)+"% today",
    nifty: typeof niftyRaw==='number'?Math.round(niftyRaw).toLocaleString():String(niftyRaw),
    rupee: typeof rupeeRaw==='number'?rupeeRaw.toFixed(2):String(rupeeRaw),
    lpg: "₹"+lpgNow, rupeePre: PRE.rupee, lpgPre: PRE.lpg,
    headline: intel?.shareLine ?? (iAssess?.headline||"").split(/\.\s/)[0].slice(0,160) ?? "",
    updated: iUpdated,
  };

  // Freshness — the war brief is written by hand, market data is fetched.
  const asOfMs   = intel?._asOf ? Date.parse(intel._asOf+"T00:00:00+05:30") : null;
  const hoursOld = asOfMs ? (Date.now()-asOfMs)/3600000 : null;
  const isStale  = hoursOld != null && hoursOld > 36;
  const liveStamp = live?._updated || null;
  // A feed that quietly kept yesterday's number should say so.
  const staleFeeds = Object.entries(live?._status ?? {})
    .filter(([,v]) => v !== 'ok').map(([k]) => k);

  const filteredTL = logSearch.trim()
    ? [...fullTL].reverse().filter(d =>
        d.tag?.toLowerCase().includes(logSearch.toLowerCase()) ||
        d.l?.toLowerCase().includes(logSearch.toLowerCase()))
    : [...fullTL].reverse();

  const share = (platform) => {
    const url = 'https://nithiyageo.github.io/india-risk-dashboard/';
    const txt = `🇮🇳 West Asia War: India Risk Dashboard — Day ${iDay} | ${iUpdated}`;
    if (platform==='x')    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(url)}`,'_blank');
    if (platform==='li')   window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,'_blank');
    if (platform==='wa')   window.open(`https://wa.me/?text=${encodeURIComponent(txt+'\n\n'+url)}`,'_blank');
    if (platform==='copy') navigator.clipboard?.writeText(url);
  };

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,fontFamily:SERIF,fontSize:14,maxWidth:1100,margin:'0 auto'}}>
      <style>{`
        /* Fonts are preconnected + linked in index.html (faster first paint) */
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { height:3px; width:3px; }
        ::-webkit-scrollbar-thumb { background:#253047; border-radius:4px; }
        a { color:${C.amber}; text-decoration:none; }
        a:hover { text-decoration:underline; }
        .nav-pill:hover { background:${C.amberDim} !important; color:${C.amber} !important; }
        .card-lift:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(0,0,0,0.35); }
        .btn-base { border:none; cursor:pointer; font-family:inherit; transition:all 0.15s; }
        .wc-expand:hover { background:${C.raised} !important; }
        @media(min-width:768px){
          .grid2  { grid-template-columns:1fr 1fr !important; }
          .grid3  { grid-template-columns:1fr 1fr 1fr !important; }
          .grid4  { grid-template-columns:1fr 1fr 1fr 1fr !important; }
          .dash-pad { padding:28px 36px 80px !important; }
          .hdr-inner { flex-direction:row !important; align-items:center !important; justify-content:space-between; gap:28px !important; }
          .hdr-left { flex:0 1 auto !important; min-width:0; }
          .hdr-badges { flex:0 0 auto !important; justify-content:flex-end; }
          .hdr-badges > div:last-child { flex:0 1 340px !important; }
          .brief-grid { display:grid !important; grid-template-columns:1fr 1fr; column-gap:28px; }
          .brief-grid > div { border-bottom:none !important; padding:6px 0 !important; }
          .hdr-h1 { font-size:32px !important; }
        }
        @media(max-width:767px){
          .grid2,.grid3,.grid4 { grid-template-columns:1fr 1fr !important; }
        }
        /* Keyboard focus must be visible on a dashboard this dense */
        :focus-visible { outline:2px solid ${C.cyan}; outline-offset:2px; border-radius:4px; }
        .skip-link { position:absolute; left:-9999px; top:0; z-index:200; }
        .skip-link:focus { left:8px; top:8px; background:${C.card}; color:${C.white};
          padding:8px 14px; border:1px solid ${C.cyan}; border-radius:6px; font-family:${MONO}; }
        .ticker-wrap:hover .ticker-track, .ticker-wrap:focus-within .ticker-track { animation-play-state:paused; }
        /* Respect the OS setting — this is a crisis page, not a showreel */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration:0.001ms !important; animation-iteration-count:1 !important;
            transition-duration:0.001ms !important; scroll-behavior:auto !important;
          }
          .ticker-track { animation:none !important; transform:none !important; }
        }
        @media print {
          nav, .ticker-wrap, .btn-base { display:none !important; }
          body { background:#fff !important; }
        }
      `}</style>

      <a href="#overview" className="skip-link">Skip to today's snapshot</a>

      {/* ══ TICKER ══ */}
      <div className="ticker-wrap" aria-label="Latest headlines"
        style={{background:`linear-gradient(90deg,#7f1d1d,${C.red},#b91c1c)`,
        padding:'7px 0',overflow:'hidden',width:'100%',position:'relative'}}>
        <div className="ticker-track" style={{display:'flex',width:'max-content',flexWrap:'nowrap',
          animation:'ticker 240s linear infinite',
          WebkitAnimation:'ticker 240s linear infinite',willChange:'transform'}}>
          {[...iT,...iT,...iT].map((t,i) => (
            <span key={i} style={{fontSize:13,fontWeight:600,color:'#fff',
              letterSpacing:0.2,paddingRight:56,whiteSpace:'nowrap',flexShrink:0,
              display:'inline-block',fontFamily:MONO}}>
              {t}<span style={{paddingLeft:56,color:'#ffffff40'}}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ HEADER ══ */}
      <header style={{padding:'22px 20px 16px',borderBottom:`1px solid ${C.border}`,background:C.surface}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:5,
            textTransform:'uppercase',fontFamily:MONO}}>India Risk Assessment</div>
          <div style={{height:1,flex:1,background:C.border}}/>
          <div style={{display:'flex',gap:5}}>
            {[{l:'𝕏',p:'x',t:'Share on X'},{l:'in',p:'li',t:'Share on LinkedIn'},
              {l:'wa',p:'wa',t:'Share on WhatsApp'},{l:'📋',p:'copy',t:'Copy link'}].map((s,i)=>(
              <button key={i} onClick={()=>share(s.p)} className="btn-base"
                aria-label={s.t} title={s.t}
                style={{padding:'3px 7px',borderRadius:4,border:`1px solid ${C.border}`,
                  background:C.card,color:C.sub,fontSize:10.5,fontWeight:700,fontFamily:MONO}}>
                {s.l}
              </button>
            ))}
          </div>
        </div>

        <div className="hdr-inner" style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="hdr-left" style={{flex:'1 1 auto',minWidth:0}}>
            <h1 className="hdr-h1" style={{margin:0,fontSize:24,fontWeight:800,color:C.white,
              fontFamily:SYNE,lineHeight:1.14,letterSpacing:-0.7}}>
              How the West Asia War Is Hitting <span style={{color:C.amber}}>India</span>
            </h1>
            <div style={{marginTop:8,fontSize:12.5,color:C.sub,fontFamily:MONO,
              display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
              <span>Intel: {iUpdated}</span>
              {liveStamp && <span style={{color:C.muted}}>· Markets: {liveStamp}</span>}
              {isStale && (
                <span style={{color:C.amber,border:`1px solid ${C.amber}40`,
                  background:C.amberDim,borderRadius:4,padding:'1px 7px',fontWeight:700}}>
                  BRIEF {Math.floor(hoursOld/24)}D OLD
                </span>
              )}
              {staleFeeds.length > 0 && (
                <span title={`Last refresh did not update: ${staleFeeds.join(', ')}`}
                  style={{color:C.orange,border:`1px solid ${C.orange}40`,
                  background:C.orangeDim,borderRadius:4,padding:'1px 7px',fontWeight:700}}>
                  {staleFeeds.length} FEED{staleFeeds.length>1?'S':''} STALE
                </span>
              )}
            </div>
          </div>
          <div className="hdr-badges" style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            <div style={{background:C.amber,color:C.bg,fontSize:16,fontWeight:800,
              padding:'8px 16px',borderRadius:8,fontFamily:SYNE,letterSpacing:-0.3,
              boxShadow:`0 4px 20px ${C.amber}40`,whiteSpace:'nowrap'}}>DAY {iDay}</div>
            <button className="btn-base" onClick={()=>shareCard(sharePayload)}
              title="Download / share today's summary as an image"
              style={{fontSize:10.5,color:C.cyan,background:C.cyanDim,
                border:`1px solid ${C.cyan}30`,borderRadius:6,padding:'8px 12px',
                fontWeight:700,fontFamily:MONO,letterSpacing:0.5,cursor:'pointer',whiteSpace:'nowrap'}}>
              📤 SHARE TODAY'S CARD
            </button>
            <div style={{fontSize:10.5,color:phaseCol,
              padding:'6px 12px',border:`1px solid ${phaseCol}40`,
              borderRadius:6,background:phaseCol+'0c',
              fontWeight:700,fontFamily:MONO,lineHeight:1.5,flex:'1 1 260px',minWidth:220}}>
              {intel?._phaseBadge ?? (iPhase ? `${phaseCalm?"●":"⚠"} ${iPhase}` : "\u2014")}
            </div>
          </div>
        </div>

        {/* 60-Second Brief — full-width, no dead space either side */}
        <div style={{marginTop:16,background:C.card,border:`1px solid ${C.cyan}22`,
          borderLeft:`3px solid ${C.cyan}`,borderRadius:10,overflow:'hidden'}}>
          <div style={{padding:'10px 14px 0',display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:10.5,fontWeight:700,color:C.cyan,letterSpacing:2.5,fontFamily:MONO}}>
              ⏱ THE 60-SECOND BRIEF
            </span>
            <span style={{fontSize:10.5,color:C.muted,fontFamily:MONO,marginLeft:'auto'}}>plain language</span>
          </div>
          <div className="brief-grid" style={{padding:'4px 14px 12px'}}>
              {iBrief.map((line,i)=>(
                <div key={i} style={{display:'flex',gap:9,alignItems:'flex-start',
                  padding:'5px 0',borderBottom:i===iBrief.length-1?'none':`1px solid ${C.border}25`}}>
                  <span style={{fontSize:11,fontWeight:800,color:C.cyan,fontFamily:MONO,
                    flexShrink:0,minWidth:14,paddingTop:2}}>{i+1}.</span>
                  <span style={{fontSize:12.5,color:C.text,lineHeight:1.65,fontFamily:SERIF}}>{line}</span>
                </div>
              ))}
          </div>
        </div>
        <button className="btn-base" onClick={()=>setAboutOpen(!aboutOpen)}
          style={{marginTop:12,fontSize:11.5,color:C.sub,fontFamily:MONO,
            background:'none',padding:'4px 0',display:'flex',alignItems:'center',gap:5}}>
          {aboutOpen?"▲":"▼"} {aboutOpen?"Hide":"What is this tracker?"}
        </button>
        {aboutOpen && (
          <div style={{marginTop:10,padding:'14px 16px',background:C.card,
            borderRadius:8,border:`1px solid ${C.border}`,fontSize:13.5,
            color:C.sub,fontFamily:SERIF,lineHeight:1.9,animation:'fadein 0.25s ease both'}}>
            <strong style={{color:C.white,fontFamily:SYNE}}>India's war tracker — not a global one.</strong>
            {' '}This dashboard focuses exclusively on what the Iran-Gulf War means for India's 1.4 billion people:
            energy prices, food security, financial markets, nuclear exposure, and Indian seafarers in the Gulf.
            We track Hormuz because before the war, <strong style={{color:C.amber}}>40% of India's crude, 60% of its LNG, and 90% of its LPG</strong>
            imports transited this 39km chokepoint. Emergency rerouting and a pivot toward Russian crude have since cut that exposure sharply. Market data is fetched automatically through the day. War intelligence is written by hand from 50+ verified sources.
          </div>
        )}
      </header>

      {loadErr && (
        <div role="alert" style={{background:C.redDim,borderTop:`1px solid ${C.red}40`,
          borderBottom:`1px solid ${C.red}40`,padding:'8px 16px',fontSize:12,
          color:C.red,fontFamily:MONO,textAlign:'center'}}>
          Live data feed unreachable — figures below may be incomplete. Refresh to retry.
        </div>
      )}

      {/* ══ NAV ══ */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:C.bg+'f2',
        backdropFilter:'blur(20px)',borderBottom:`1px solid ${C.border}`,padding:'7px 14px'}}>
        <div style={{display:'flex',gap:4,overflowX:'auto',scrollbarWidth:'none'}}>
          {NAV.map(n=>(
            <button key={n.id} className="nav-pill btn-base" onClick={()=>go(n.id)}
              style={{flex:'0 0 auto',padding:'5px 12px',
                border:activeNav===n.id?`1px solid ${C.amber}60`:`1px solid ${C.border}`,
                borderRadius:20,background:activeNav===n.id?C.amberDim:'transparent',
                color:activeNav===n.id?C.amber:C.sub,fontSize:11.5,fontWeight:600,
                fontFamily:MONO,whiteSpace:'nowrap'}}>
              {n.l}
            </button>
          ))}
        </div>
      </nav>

      <div className="dash-pad" style={{padding:'20px 16px 72px'}}>

        {/* ══ EXECUTIVE SNAPSHOT — 30-second situation read ══ */}
        <section id="overview" style={{marginBottom:26,scrollMarginTop:58}}>
          <div className="grid3" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <Mc label="Risk Level" value={riskLevel} accent={riskColor}
              delta={iExec.phase ?? iPhase} deltaColor={riskColor}
              sub={`Composite ${riskAvg ?? "—"}/100 · Day ${iDay}${
                (iExec.level && derivedLevel && iExec.level !== derivedLevel)
                  ? ` · index reads ${derivedLevel}` : ""}`}/>
            <Mc label="Oil — Brent" value={`$${brentRaw}`}
              delta={(brentChg>0?"▲ +":"▼ ")+Math.abs(brentChg).toFixed(1)+"%"}
              deltaColor={brentChg>0?C.red:C.green} accent={brentColor}
              sub={iExec.oilNote ?? "Pre-war: 40% of crude, 60% of LNG, 90% of LPG imports via Hormuz — since diversified"}/>
            <Mc label="Markets — Nifty 50"
              value={typeof niftyRaw==='number'?Math.round(niftyRaw).toLocaleString():niftyRaw}
              delta={(niftyChg>=0?"▲ +":"▼ ")+Math.abs(niftyChg).toLocaleString()}
              deltaColor={niftyColor} accent={niftyChg>=0?C.green:C.red}
              sub={`Sensex ${typeof sensexRaw==='number'?sensexRaw.toLocaleString():sensexRaw} · auto-synced`}/>
            <Mc label="Shipping — Hormuz" value={iExec.shipping ?? "DISRUPTED"} accent={C.cyan}
              sub={iExec.shippingSub ?? `Pre-war ${iHormuz?.preWarFlow||"~90-140 ships/day"} · ${iHormuz?.indianSeafarers??"—"} Indian seafarers in Gulf`}/>
            <Mc label="Military" value={iExec.military ?? `${radarNow('Mil. Exposure') ?? "—"}/100`} accent={C.red}
              delta={`Exposure ${radarNow('Mil. Exposure') ?? "—"}/100`} deltaColor={C.red}
              sub={iExec.militarySub ?? `War dead ${iDeaths}`}/>
            <Mc label="India Impact" value={`₹${typeof rupeeRaw==='number'?rupeeRaw.toFixed(2):rupeeRaw}`} accent={C.orange}
              delta="₹ / USD" deltaColor={C.orange}
              sub={iExec.indiaSub ?? `Household pressure ${radarNow('Household') ?? "—"}/100 · was ₹${PRE.rupee} pre-war`}/>
          </div>
        </section>

        {/* ══ WHAT CHANGED — expandable ══ */}
        <div style={{background:C.redDim,border:`1px solid ${C.red}22`,
            borderLeft:`3px solid ${C.red}`,borderRadius:10,padding:'14px 16px',marginBottom:26}}>
            <div style={{fontSize:10.5,fontWeight:700,color:C.red,letterSpacing:4,
              marginBottom:12,fontFamily:MONO}}>{iWC.label||"WHAT CHANGED"}</div>
            {(iWC.items||[]).map((item,i)=>{
              const col = C[item.color] || C.amber;
              const isOpen = wcExpanded[i];
              return (
                <div key={i} style={{marginBottom:i===iWC.items.length-1?0:8,
                  paddingBottom:i===iWC.items.length-1?0:8,
                  borderBottom:i===iWC.items.length-1?'none':`1px solid ${C.border}30`}}>
                  <button className="btn-base wc-expand" onClick={()=>setWcExpanded(p=>({...p,[i]:!p[i]}))}
                    style={{width:'100%',textAlign:'left',background:'transparent',padding:'4px 0',
                      display:'flex',alignItems:'flex-start',gap:8}}>
                    <span style={{color:col,fontWeight:900,flexShrink:0,fontSize:13,marginTop:1}}>▸</span>
                    <span style={{flex:1}}>
                      <strong style={{fontSize:13.5,color:col,fontWeight:700,fontFamily:SYNE,lineHeight:1.55}}>
                        {item.bold}
                      </strong>
                    </span>
                    <span style={{fontSize:10.5,color:C.muted,fontFamily:MONO,flexShrink:0,marginTop:3}}>
                      {isOpen?'▲':'▼'}
                    </span>
                  </button>
                  {isOpen && item.text && (
                    <div style={{fontSize:13,color:C.sub,lineHeight:1.75,fontFamily:SERIF,
                      paddingLeft:20,paddingTop:6,animation:'fadein 0.2s ease both'}}>
                      {clampSentences(item.text, 3)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        {/* ══ HORMUZ ══ */}
        <S id="hormuz" title="Maritime — Hormuz, India's Energy Lifeline" accent={C.cyan}
          sub="Pre-war, this 39km chokepoint carried 40% of India's crude, 60% of its LNG, and 90% of its LPG imports. What happens here still lands at your pump.">

          {iHormuz?.headline && (
            <div style={{background:`linear-gradient(90deg,${C.red}18,${C.card})`,
              border:`1px solid ${C.red}40`,borderLeft:`3px solid ${C.red}`,
              borderRadius:8,padding:'10px 14px',marginBottom:12,
              display:'flex',alignItems:'flex-start',gap:10}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:C.red,
                animation:'pulse 1.5s infinite',flexShrink:0,marginTop:4}}/>
              <div style={{fontSize:13,fontWeight:700,color:C.red,fontFamily:SYNE,lineHeight:1.55}}>
                {iHormuz.headline}
              </div>
            </div>
          )}

          {/* Two short state chips. The day's narrative is prose, below —
              it used to be rendered here, centred and bold, at 700 chars. */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
            <div style={{background:phaseCol+'10',borderRadius:10,
              padding:12,textAlign:'center',border:`1px solid ${phaseCol}25`}}>
              <div style={{fontSize:10.5,color:phaseCol,fontWeight:700,
                letterSpacing:2,fontFamily:MONO,marginBottom:5}}>STRAIT STATUS</div>
              <div style={{fontSize:14,fontWeight:700,color:phaseCol,
                fontFamily:SYNE,lineHeight:1.45}}>{hormuzState}</div>
            </div>
            <div style={{background:C.card,borderRadius:10,padding:12,textAlign:'center',
              border:`1px solid ${C.border}`}}>
              <div style={{fontSize:10.5,color:C.muted,fontWeight:700,letterSpacing:2,
                fontFamily:MONO,marginBottom:5}}>SHIP TRAFFIC</div>
              <div style={{fontSize:14,fontWeight:700,color:C.orange,fontFamily:SYNE,lineHeight:1.45}}>
                {hormuzTraffic}
              </div>
              <div style={{fontSize:10.5,color:C.muted,marginTop:4,fontFamily:MONO}}>
                Pre-war: {iHormuz?.preWarFlow||"\u2014"}
              </div>
            </div>
          </div>

          {maritimeBriefing.length > 0 && (
            <div style={{background:C.card,borderRadius:10,padding:'12px 14px',marginBottom:10,
              border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.cyan}`}}>
              <div style={{fontSize:10.5,fontWeight:700,color:C.cyan,letterSpacing:2.5,
                fontFamily:MONO,marginBottom:7}}>MARITIME BRIEFING</div>
              {maritimeBriefing.map((para,i)=>(
                <p key={i} style={{margin:i?'9px 0 0':0,fontSize:13,color:C.sub,
                  lineHeight:1.75,fontFamily:SERIF}}>{para}</p>
              ))}
            </div>
          )}

          {/* India stats — consistent sizing, with casualty alert */}
          {(iHormuz?.indianCasualties ?? 0) > 0 && (
            <div style={{background:`${C.red}14`,borderRadius:10,padding:'12px 14px',
              border:`1px solid ${C.red}50`,marginBottom:10,
              animation:'pulse 2.5s infinite'}}>
              <div style={{fontSize:10.5,color:C.red,fontWeight:700,letterSpacing:2.5,
                fontFamily:MONO,marginBottom:6}}>🇮🇳 INDIAN CASUALTIES — BLOCKADE ENFORCEMENT</div>
              <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:6}}>
                <div style={{fontSize:32,fontWeight:800,color:C.red,fontFamily:SYNE,lineHeight:1}}>
                  {iHormuz.indianCasualties}
                </div>
                <div style={{fontSize:12.5,color:C.red,fontWeight:700,fontFamily:MONO}}>
                  Indian sailors killed
                </div>
              </div>
              <div style={{fontSize:11.5,color:C.sub,lineHeight:1.6}}>
                {iHormuz?.indianCasualtyDetail || "Details pending."}
              </div>
            </div>
          )}

          <div style={{background:C.amberDim,borderRadius:10,padding:'12px 14px',
            border:`1px solid ${C.amber}25`,marginBottom:10}}>
            <div style={{fontSize:10.5,color:C.amber,fontWeight:700,letterSpacing:2.5,
              fontFamily:MONO,marginBottom:10}}>🇮🇳 INDIA'S HORMUZ EXPOSURE</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
              {[
                {l:"Ships in Gulf", v:iHormuz?.indianVesselsNear??"\u2014",
                 sub:(iHormuz?.indianSeafarers??"\u2014")+" seafarers on Indian-flagged vessels"},
                {l:"Crossed Safely",v:iHormuz?.indianTransited??"\u2014",
                 sub:short(iHormuz?.transitedNote ?? "See maritime briefing", 46)},
                {l:"Navy Escort",   v:short(iHormuz?.navyEscort ?? "ACTIVE", 14),
                 sub:"Op Urja Suraksha", isText:true},
              ].map((s,i)=>(
                <div key={i} style={{textAlign:'center'}}>
                  <div style={{fontSize:10.5,color:C.amber,fontWeight:700,letterSpacing:1,
                    fontFamily:MONO,marginBottom:4}}>{s.l}</div>
                  <div style={{fontSize:s.isText?14:22,fontWeight:700,color:C.amber,
                    fontFamily:SYNE,lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:10.5,color:C.sub,marginTop:3,lineHeight:1.45}}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive timeline */}
          <div style={{background:C.card,borderRadius:10,padding:14,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:10.5,fontWeight:700,color:C.cyan,letterSpacing:2.5,
              fontFamily:MONO,marginBottom:12}}>TIMELINE — LATEST FIRST · CLICK TO EXPAND</div>
            <HormuzTimeline events={iHEvents.length ? iHEvents : iHLatest} phaseData={intel?.hormuzPhases}/>
            <div style={{fontSize:10.5,color:C.muted,marginTop:10,paddingTop:8,
              borderTop:`1px solid ${C.border}20`,fontFamily:MONO}}>
              🇮🇳 Latest: {iHormuz?.lastTransit||"Status pending"}
            </div>
          </div>
        </S>

        {/* ══ KITCHEN TABLE — moved up ══ */}
        <S id="kitchen" title="Household — Your Kitchen Table" accent={C.amber}
          sub="8+ weeks of war — what it costs Indian households today.">
          {(iKitchen.length ? iKitchen : []).map((h,i)=>{
            const sCol = (h.status||h.s)==='red'?C.red:(h.status||h.s)==='orange'?C.orange:C.green;
            const statusTxt = h.statusText || h.chg || '';
            return (
              <div key={i} className="card-lift"
                style={{background:C.card,borderRadius:10,padding:'12px 14px',
                  marginBottom:6,borderLeft:`3px solid ${sCol}`,
                  border:`1px solid ${C.border}`,transition:'all 0.15s'}}>
                <div style={{display:'flex',justifyContent:'space-between',
                  alignItems:'flex-start',gap:8,flexWrap:'wrap',marginBottom:6}}>
                  <span style={{fontSize:14,fontWeight:700,color:C.white,fontFamily:SYNE}}>
                    {h.item}
                  </span>
                  <span style={{fontSize:11.5,fontWeight:700,color:sCol,fontFamily:MONO,flexShrink:0}}>
                    {statusTxt}
                  </span>
                </div>
                <div style={{display:'flex',gap:16,fontSize:12.5,fontFamily:MONO,flexWrap:'wrap'}}>
                  <span style={{color:C.muted}}>Pre: <strong style={{color:C.sub}}>{h.pre}</strong></span>
                  <span style={{color:C.muted}}>Now: <strong style={{color:C.amber}}>{h.now}</strong></span>
                  <span style={{color:C.muted}}>2wk: <strong style={{color:(h.status||h.s)==='red'?C.red:C.green}}>{h.twoWeek||h.proj}</strong></span>
                </div>
                {(h.detail||h.note) && (
                  <div style={{fontSize:12.5,color:C.sub,marginTop:7,lineHeight:1.7,
                    borderTop:`1px solid ${C.border}40`,paddingTop:7,fontFamily:SERIF}}>
                    {h.detail||h.note}
                  </div>
                )}
              </div>
            );
          })}
          {!iKitchen.length && <Empty label="Household price table"/>}
          <BudgetCalc budget={intel?.budget}/>
        </S>

        {/* ══ ECONOMY ══ */}
        <S id="economic" title="Markets — Economic Impact on India" accent={C.orange}>
          {/* Key metrics row */}
          <div className="grid4" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
            <Mc label="BSE Market Cap" value={iEcon?.wealth||"—"}
              sub={iEcon?.wealthSub||""} accent={C.orange}/>
            <Mc label="FII Flow" value={iEcon?.fpi||"—"}
              sub={iEcon?.fpiDelta||""} accent={C.red}/>
            <Mc label="Sensex" value={iEcon?.sensex||"—"}
              sub={iEcon?.sensexSub||""} accent={C.red}/>
            <Mc label="India VIX" value={iEcon?.vix||"—"}
              sub={iEcon?.vixDelta||"Fear gauge"} accent={C.amber}/>
          </div>

          {/* Charts */}
          <div style={{background:C.card,borderRadius:10,padding:'14px 14px 10px',
            marginBottom:10,border:`1px solid ${C.border}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <div style={{fontSize:10.5,fontWeight:700,color:C.cyan,letterSpacing:2.5,fontFamily:MONO}}>
                NIFTY 50 — {chartTL.length} LOGGED SESSIONS · DAY 1–{chartTL.at(-1)?.d ?? iDay}
              </div>
              <Chip color={C.cyan} size={8}>LIVE</Chip>
            </div>
            <MiniLine data={chartTL} dataKey="nifty" color={C.cyan} h={120}/>
          </div>

          <div style={{background:C.card,borderRadius:10,padding:'14px 14px 10px',
            marginBottom:10,border:`1px solid ${C.border}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <div style={{fontSize:10.5,fontWeight:700,color:C.orange,letterSpacing:2.5,fontFamily:MONO}}>
                BRENT CRUDE ($) — {chartTL.length} LOGGED SESSIONS · DAY 1–{chartTL.at(-1)?.d ?? iDay}
              </div>
              <span style={{fontSize:10.5,color:C.sub,fontFamily:MONO}}>Currently ~${brentRaw}</span>
            </div>
            <MiniLine data={chartTL} dataKey="brent" color={C.orange} h={120}/>
          </div>

          {/* Market analysis — crisp */}
          {iEcon?.analysis && (
            <div style={{background:C.card,borderRadius:10,padding:'12px 14px',
              border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.orange}`}}>
              <div style={{fontSize:10.5,fontWeight:700,color:C.orange,letterSpacing:2.5,
                fontFamily:MONO,marginBottom:6}}>📊 MARKET ANALYSIS</div>
              <div style={{fontSize:13,color:C.sub,lineHeight:1.7,fontFamily:SERIF}}>
                {clampSentences(iEcon.analysis, 4)}
              </div>
            </div>
          )}
        </S>

        {/* ══ MILITARY — crisp ══ */}
        <S id="military" title="Military & Strategic Updates" accent={C.red}>
          {!iMilitary.length && !iMilTop.length && <Empty label="Military updates"/>}
          {(iMilitary.length ? iMilitary : iMilTop).map((m,i)=>{
            const mc = C[m.color] || C.amber;
            const isBreaking = m.lv === "BREAKING";
            return (
              <div key={i} className="card-lift"
                style={{background:isBreaking?`${mc}0c`:C.card,
                  border:`1px solid ${mc}${isBreaking?'30':'15'}`,
                  borderLeft:`3px solid ${mc}`,borderRadius:10,
                  padding:'12px 14px',marginBottom:7,transition:'all 0.15s'}}>
                <div style={{display:'flex',justifyContent:'space-between',
                  alignItems:'flex-start',gap:8,flexWrap:'wrap',marginBottom:6}}>
                  <span style={{fontSize:14,fontWeight:700,color:C.white,
                    fontFamily:SYNE,flex:1,lineHeight:1.45}}>{m.t}</span>
                  <Chip color={isBreaking?C.red:C.sub} size={8}>{m.lv}</Chip>
                </div>
                {/* Show only first 2 sentences */}
                <div style={{fontSize:13,color:C.sub,lineHeight:1.7,fontFamily:SERIF}}>
                  {clampSentences(m.d, 2)}
                </div>
              </div>
            );
          })}
        </S>

        {/* ══ NUCLEAR ══ */}
        <S id="nuclear" title="Nuclear Exposure" accent={C.purple}>
          <div style={{background:C.purpleDim,border:`1px solid ${C.purple}30`,
            borderLeft:`3px solid ${C.purple}`,borderRadius:10,padding:'13px 15px',marginBottom:14}}>
            <div style={{fontSize:10.5,fontWeight:700,color:C.purple,letterSpacing:2.5,
              fontFamily:MONO,marginBottom:7}}>🇮🇳 INDIA NUCLEAR RISK HEADLINE</div>
            <div style={{fontSize:13,color:C.sub,lineHeight:1.75,fontFamily:SERIF}}>
              <strong style={{color:C.purple}}>Bushehr — a working reactor — has been struck.</strong>{' '}
              IAEA: strikes 250ft from the operating reactor. Iran holds ~460kg of 60% enriched uranium
              — enough material for approximately 11 nuclear weapons (IAEA).
              Delhi is 4–7 days downwind at 500 hPa. India has{' '}
              <strong style={{color:C.red}}>NO national iodine prophylaxis program.</strong>
            </div>
          </div>

          <div style={{background:C.card,borderRadius:12,padding:'13px 15px',
            marginBottom:14,border:`1px solid ${C.purple}25`}}>
            <div style={{fontSize:10.5,fontWeight:700,color:C.purple,letterSpacing:2.5,
              fontFamily:MONO,marginBottom:8}}>ATMOSPHERIC TRANSPORT — ASSESSMENT</div>
            <div style={{fontSize:13,color:C.sub,lineHeight:1.75,fontFamily:SERIF}}>
              <div style={{marginBottom:4}}>• <strong style={{color:C.text}}>Key insight:</strong> Prevailing westerlies at 500 hPa place NW India 4–7 days downwind of Iranian nuclear sites.</div>
              <div style={{marginBottom:4}}>• <strong style={{color:C.text}}>Watchlist:</strong> Bushehr reactor integrity; Isfahan HEU tunnel complex; IAEA site access.</div>
              <div>• <strong style={{color:C.text}}>Confidence:</strong> Analytical estimate — no radiological release confirmed to date. Fallout modelling: <a href="https://www.ready.noaa.gov/HYSPLIT.php" target="_blank"
                rel="noopener noreferrer" style={{color:C.cyan}}>NOAA HYSPLIT</a>.</div>
            </div>
          </div>

          <div style={{fontSize:10.5,fontWeight:700,color:C.purple,marginBottom:8,
            letterSpacing:2.5,fontFamily:MONO}}>IRANIAN NUCLEAR SITES — STATUS</div>
          {!iNukes.length && <Empty label="Nuclear site status"/>}
          {iNukes.map((n,i)=>{
            const rCol = n.risk>85?C.red:n.risk>70?C.orange:C.amber;
            return (
              <div key={i} role="button" tabIndex={0} aria-expanded={expNuke===i}
                onClick={()=>setExpNuke(expNuke===i?null:i)}
                onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setExpNuke(expNuke===i?null:i);}}}
                style={{background:C.card,borderRadius:10,padding:'11px 13px',
                  marginBottom:5,cursor:'pointer',border:`1px solid ${rCol}18`,transition:'all 0.15s'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                  <div style={{flex:1}}>
                    <span style={{fontSize:14,fontWeight:700,color:rCol,fontFamily:SYNE}}>{n.name}</span>
                    <span style={{fontSize:10.5,color:C.muted,marginLeft:8,fontFamily:MONO}}>{n.type}</span>
                  </div>
                  <Chip color={(n.status||'').match(/HIT|DAMAGED|STRUCK|WAR ZONE/)?C.red:C.orange} size={8}>
                    {n.status||n.st}
                  </Chip>
                </div>
                <Bar value={n.risk} color={rCol} h={4}/>
                <div style={{fontSize:10.5,color:C.muted,marginTop:3,
                  display:'flex',justifyContent:'space-between',fontFamily:MONO}}>
                  <span style={{color:rCol,fontWeight:700}}>{n.risk}/100 risk</span>
                  <span>{expNuke===i?"▲ collapse":"▼ expand"}</span>
                </div>
                {expNuke===i && (
                  <div style={{fontSize:13,color:C.sub,marginTop:8,lineHeight:1.75,
                    borderTop:`1px solid ${C.border}`,paddingTop:8,fontFamily:SERIF,
                    animation:'fadein 0.2s ease both'}}>{n.info}</div>
                )}
              </div>
            );
          })}

          <div style={{marginTop:20}}>
            <div style={{fontSize:10.5,fontWeight:700,color:C.amber,letterSpacing:2.5,
              fontFamily:MONO,marginBottom:5}}>🇮🇳 INDIAN CITY EXPOSURE</div>
            <div style={{fontSize:12.5,color:C.sub,marginBottom:10,fontFamily:SERIF,lineHeight:1.6}}>
              Composite risk: wind trajectory (nuclear) + sea proximity (oil shock) + nuclear facility distance.
            </div>
            <div className="grid2" style={{display:'grid',gridTemplateColumns:'1fr',gap:8}}>
              {iCities.map((c,i)=>{
                const totCol = c.tot>55?C.red:c.tot>42?C.orange:C.amber;
                return (
                  <div key={i} style={{background:C.card,borderRadius:10,
                    padding:'12px 14px',border:`1px solid ${C.border}`}}>
                    <div style={{display:'flex',justifyContent:'space-between',
                      alignItems:'center',marginBottom:8}}>
                      <div>
                        <span style={{fontSize:14,fontWeight:700,color:C.white,fontFamily:SYNE}}>{c.city}</span>
                        <span style={{fontSize:11.5,color:C.muted,marginLeft:8,fontFamily:MONO}}>Pop: {c.pop}</span>
                      </div>
                      <div>
                        <span style={{fontSize:22,fontWeight:800,color:totCol,fontFamily:SYNE}}>{c.tot}</span>
                        <span style={{fontSize:11.5,color:C.muted}}>/100</span>
                      </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginBottom:8}}>
                      {[{l:"Wind",v:c.wind,cl:C.orange},{l:"Sea",v:c.sea,cl:C.cyan},{l:"Nuclear",v:c.nuke,cl:C.purple}].map((vv,j)=>(
                        <div key={j}>
                          <div style={{fontSize:10.5,color:vv.cl,fontWeight:700,marginBottom:2,fontFamily:MONO}}>{vv.l}: {vv.v}/100</div>
                          <Bar value={vv.v} color={vv.cl} h={4}/>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:13,color:C.sub,lineHeight:1.7,fontFamily:SERIF}}>{c.info}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </S>

        {/* ══ RADAR ══ */}
        <S id="radar" title="Risk Radar" accent={C.amber}>
          {!iRadar.length && <Empty label="Risk index"/>}
          {iRadar.length > 0 && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div style={{background:C.card,borderRadius:10,padding:12,border:`1px solid ${C.border}`}}>
              <RadarSVG data={iRadar} day={iDay}/>
            </div>
            <div style={{background:C.card,borderRadius:10,padding:'12px 12px',border:`1px solid ${C.border}`}}>
              <div style={{fontSize:10.5,fontWeight:700,color:C.amber,letterSpacing:2.5,
                fontFamily:MONO,marginBottom:10}}>CURRENT SCORES</div>
              {iRadar.map((r,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:8,
                  padding:'5px 0',borderBottom:`1px solid ${C.border}20`}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,color:C.sub,fontFamily:MONO,fontWeight:600,marginBottom:2}}>{r.axis}</div>
                    <Bar value={r.now} color={r.now>70?C.red:r.now>50?C.orange:C.amber} h={5}/>
                  </div>
                  <span style={{fontSize:15,fontWeight:800,
                    color:r.now>70?C.red:r.now>50?C.orange:C.amber,
                    fontFamily:SYNE,flexShrink:0,minWidth:28,textAlign:'right'}}>{r.now}</span>
                </div>
              ))}
            </div>
          </div>
          )}
        </S>

        {/* ══ WAR LOG ══ */}
        <S id="warlog" title="Archive — War Log, All Days" accent={C.sub}>
          <WarInNumbers timeline={intel?.timeline}/>
          <div style={{background:C.card,borderRadius:10,padding:12,border:`1px solid ${C.border}`}}>
            <div style={{display:'flex',justifyContent:'space-between',
              alignItems:'center',marginBottom:10,flexWrap:'wrap',gap:8}}>
              <button className="btn-base" onClick={()=>setLogExpanded(!logExpanded)}
                style={{fontSize:10.5,color:C.cyan,background:C.cyanDim,
                  border:`1px solid ${C.cyan}30`,borderRadius:4,padding:'4px 12px',
                  fontWeight:700,fontFamily:MONO}}>
                {logExpanded?"COLLAPSE ▲":"FULL ARCHIVE ▼"}
              </button>
              <input placeholder="Search war log..."
                value={logSearch} onChange={e=>setLogSearch(e.target.value)}
                style={{padding:'5px 10px',borderRadius:6,border:`1px solid ${C.border}`,
                  background:C.surface,color:C.text,fontSize:11.5,fontFamily:MONO,
                  outline:'none',minWidth:140,flex:1,maxWidth:220}}/>
            </div>
            {(logExpanded || logSearch ? filteredTL : filteredTL.slice(0,6)).map((d,i)=>(
              <div key={i} style={{padding:'7px 0',borderBottom:`1px solid ${C.border}18`,
                display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{minWidth:42,flexShrink:0}}>
                  <div style={{fontSize:11.5,fontWeight:800,
                    color:d.sev>=3?C.red:d.sev===2?C.orange:C.green,fontFamily:MONO}}>D{d.d}</div>
                  <div style={{fontSize:10.5,color:C.sub,fontFamily:MONO}}>{d.l}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:C.sub,lineHeight:1.6,fontFamily:SERIF}}>{d.tag}</div>
                  <div style={{display:'flex',gap:8,marginTop:3,flexWrap:'wrap'}}>
                    {[
                      {l:'Nifty',v:d.nifty?.toLocaleString(),c:d.nifty>24000?C.green:C.red},
                      {l:'Brent',v:'$'+d.brent,c:d.brent>100?C.red:C.amber},
                      {l:'₹',    v:d.rupee?.toFixed(2),c:C.orange},
                    ].map((m,j)=>(
                      <span key={j} style={{fontSize:10.5,color:m.c,fontFamily:MONO,fontWeight:700}}>{m.l}: {m.v}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {!logExpanded && !logSearch && (
              <div style={{fontSize:11.5,color:C.muted,textAlign:'center',
                marginTop:8,padding:'6px 0',borderTop:`1px solid ${C.border}20`,fontFamily:MONO}}>
                {fullTL.length - 6} more days — click FULL ARCHIVE or search above
              </div>
            )}
          </div>
        </S>

        {/* ══ STRATEGIC ASSESSMENT ══ */}
        <S id="assessment" title="Strategic Assessment" accent={C.red}>
          <div style={{background:C.redDim,border:`1px solid ${C.red}20`,
            borderLeft:`3px solid ${C.red}`,borderRadius:12,padding:'18px 20px'}}>
            {iAssess?.headline && (
              <div style={{fontSize:15,fontWeight:800,color:C.red,lineHeight:1.6,
                marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${C.red}18`,
                fontFamily:SYNE}}>
                {iAssess.headline}
              </div>
            )}
            <div style={{fontSize:14,lineHeight:1.9,color:C.sub,fontFamily:SERIF}}>
              {(iAssess?.body||"").split('\n').map((p,i)=>{
                if (!p.trim()) return null;
                const isHead   = /^[A-Z][A-Z\s\+\-\']+$/.test(p.trim()) && p.trim().length < 60;
                const isBullet = p.startsWith('•');
                return (
                  <div key={i} style={{marginBottom:isHead?6:isBullet?4:10}}>
                    {isHead
                      ? <div style={{fontSize:10.5,fontWeight:700,color:C.amber,
                          letterSpacing:2.5,fontFamily:MONO,marginTop:14,marginBottom:5,
                          paddingTop:12,borderTop:`1px solid ${C.border}`}}>{p}</div>
                      : <span style={{color:isBullet?C.sub:C.text}}>{p}</span>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        </S>

        {/* ══ FEATURED RESEARCH — relocated near sources ══ */}
        <section style={{marginBottom:22}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,color:C.amber,letterSpacing:3.5,
              textTransform:'uppercase',fontFamily:MONO}}>Featured Research</div>
            <div style={{height:1,flex:1,background:`linear-gradient(90deg,${C.amber}30,transparent)`}}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            {(iFeatured.length ? iFeatured : FEATURED_FB).map((pub,i)=>(
              <a key={i} href={pub.url} target="_blank" rel="noopener noreferrer"
                style={{display:'flex',alignItems:'center',gap:10,background:C.card,
                  border:`1px solid ${C.border}`,borderLeft:`2px solid ${pub.tagColor||C.amber}`,
                  borderRadius:6,padding:'8px 12px',textDecoration:'none',transition:'all 0.15s'}}>
                <span style={{fontSize:15,flexShrink:0,alignSelf:'flex-start',marginTop:2}}>{pub.icon||'📄'}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div>
                    <span style={{fontSize:12.5,fontWeight:700,color:C.white,fontFamily:SYNE}}>{pub.title}</span>
                    <span style={{fontSize:10.5,color:C.muted,fontFamily:MONO,marginLeft:8}}>
                      {pub.org}{pub.date?` · ${pub.date}`:''}
                    </span>
                  </div>
                  {pub.desc && (
                    <div style={{fontSize:11.5,color:C.sub,fontFamily:SERIF,lineHeight:1.6,marginTop:3}}>
                      {clampSentences(pub.desc, 1)}
                    </div>
                  )}
                </div>
                <span style={{fontSize:10.5,color:pub.tagColor||C.amber,fontFamily:MONO,fontWeight:700,flexShrink:0}}>Read →</span>
              </a>
            ))}
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer id="sources" style={{scrollMarginTop:58,paddingTop:20,borderTop:`1px solid ${C.border}`,marginTop:8}}>
          <div style={{fontSize:11.5,color:C.muted,lineHeight:1.9,fontFamily:SERIF}}>
            <strong style={{color:C.sub}}>Sources:</strong>{' '}
            Al Jazeera, CNN, CBS, NBC, ABC, AP, Reuters, Bloomberg, NPR, CNBC, Iran International,
            Times of Israel, ACLED, Atlantic Council, Amnesty Intl, Business Standard, BusinessToday,
            Goodreturns, Trading Economics, IAEA, HRW, CSIS, IEA, EIA, Kpler, MarineTraffic,
            MUFG, ORF, MEA India, Nomura, Elara, UBS, HSBC, Kotak, SBI Securities, Choice Broking
            <br/><br/>
            <strong style={{color:C.sub}}>Methodology:</strong>{' '}
            Nuclear/contamination scores are analytical estimates — NOT confirmed measurements.
            Projections are trend extrapolations, not forecasts. All timestamps IST (UTC+5:30).
            Hormuz shipping data from Kpler, MarineTraffic, Windward, and news reports.
            <br/><br/>
            <strong style={{color:C.sub}}>Disclaimer:</strong>{' '}
            Built with AI tools. Ongoing project. Not financial, safety, or evacuation advice.
          </div>
          <div style={{display:'flex',gap:8,marginTop:14,alignItems:'center',flexWrap:'wrap'}}>
            <span style={{fontSize:11.5,color:C.muted,fontWeight:600,fontFamily:MONO}}>Share:</span>
            {[{l:'Share on X',p:'x'},{l:'Share on LinkedIn',p:'li'},{l:'Share on WhatsApp',p:'wa'},{l:'Copy Link',p:'copy'}].map((s,i)=>(
              <button key={i} className="btn-base" onClick={()=>share(s.p)}
                style={{padding:'5px 12px',borderRadius:6,border:`1px solid ${C.border}`,
                  background:C.card,color:C.sub,fontSize:11.5,fontWeight:700,fontFamily:MONO}}>
                {s.l}
              </button>
            ))}
          </div>
          <div style={{display:'flex',gap:5,marginTop:12,flexWrap:'wrap'}}>
            {NAV.map(n=>(
              <button key={n.id} className="btn-base" onClick={()=>go(n.id)}
                style={{padding:'5px 11px',border:`1px solid ${C.border}`,borderRadius:16,
                  background:'transparent',color:C.muted,fontSize:11.5,fontWeight:600,fontFamily:MONO}}>
                {n.l}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
