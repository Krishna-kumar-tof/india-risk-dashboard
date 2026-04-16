import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════
// INDIA RISK DASHBOARD — V9.0 — INTELLIGENCE BRIEFING REDESIGN
// Fonts: Syne (display) + IBM Plex Mono (data) + Source Serif 4 (body)
// Aesthetic: Deep navy-black / saffron-amber / Reuters Wire meets
//            classified briefing document
// ═══════════════════════════════════════════════════════════════════

const C = {
  bg:      "#080c14",
  surface: "#0e1420",
  card:    "#121826",
  raised:  "#18202e",
  border:  "#1e2a3d",
  border2: "#253047",
  text:    "#c8d0e0",
  sub:     "#7a8ba8",
  muted:   "#3d4f6a",
  white:   "#eef2fa",
  // Amber is primary accent — reserved for important data
  amber:   "#f59e0b",
  amberDim:"#f59e0b14",
  amberMid:"#f59e0b30",
  // Red ONLY for genuine breaking alerts
  red:     "#ef4444",
  redDim:  "#ef444414",
  // Supporting palette
  green:   "#10b981",
  greenDim:"#10b98112",
  cyan:    "#38bdf8",
  cyanDim: "#38bdf810",
  orange:  "#fb923c",
  orangeDim:"#fb923c12",
  purple:  "#a78bfa",
  purpleDim:"#a78bfa10",
  teal:    "#2dd4bf",
};

const SYNE   = "'Syne','DM Sans',system-ui,sans-serif";
const MONO   = "'IBM Plex Mono','JetBrains Mono',monospace";
const SERIF  = "'Source Serif 4','Georgia',serif";

// ─── Fallbacks ───────────────────────────────────────────────────
const TICKER_FB = [
  "🚢 BLOCKADE DAY 3: US Navy intercepted 2 Iranian tankers from Chabahar — first confirmed naval interdiction",
  "🕊️ TRUMP: War 'very close to over' — Fox Business. Talks expected THURSDAY Islamabad",
  "🛢️ BRENT below $95 — Sensex +1,263 to 78,111. Nifty +388 to 24,231. All 30 stocks green",
  "💸 US TREASURY: Will NOT renew sanctions waiver on Iranian oil. Banks warned on secondary sanctions",
  "⚠️ IRAN threatens to shut RED SEA + Gulf of Oman + Persian Gulf if blockade continues",
  "📅 CEASEFIRE EXPIRES APR 21 — 6 DAYS. Thursday talks = most important market event of the week",
];

const TL_BASE = [
  {d:1, l:"Feb 28",deaths:555, brent:78, nifty:25179,rupee:91.49,tag:"Op. Epic Fury. Khamenei killed. War begins.",sev:3},
  {d:3, l:"Mar 2", deaths:787, brent:82, nifty:24866,rupee:91.49,tag:"Black Monday. Ras Tanura shut. Sensex -2%",sev:3},
  {d:5, l:"Mar 4", deaths:1045,brent:85, nifty:24481,rupee:92.30,tag:"IRIS Dena sunk. Iranian mines confirmed",sev:2},
  {d:7, l:"Mar 6", deaths:1332,brent:88, nifty:24450,rupee:91.82,tag:"Oil depots hit. Fujairah tanks burning",sev:2},
  {d:9, l:"Mar 8", deaths:1332,brent:93, nifty:24450,rupee:91.82,tag:"Mojtaba Khamenei elected Supreme Leader",sev:2},
  {d:10,l:"Mar 9", deaths:1754,brent:104,nifty:24028,rupee:92.33,tag:"Brent $120 intraday. ₹8.5L Cr wiped",sev:3},
  {d:11,l:"Mar 10",deaths:1754,brent:84, nifty:24200,rupee:92.10,tag:"Trump: 'very complete.' Oil crashes 20%",sev:1},
  {d:12,l:"Mar 11",deaths:1966,brent:93, nifty:23867,rupee:92.20,tag:"IEA 400M barrel SPR release",sev:2},
  {d:14,l:"Mar 13",deaths:2100,brent:99, nifty:23151,rupee:92.45,tag:"BLACK FRIDAY — Sensex -1,460",sev:3},
  {d:19,l:"Mar 18",deaths:2500,brent:108,nifty:23778,rupee:92.74,tag:"Ras Laffan + Aramco hit. Brent $108",sev:3},
  {d:20,l:"Mar 19",deaths:2700,brent:117,nifty:23002,rupee:93.23,tag:"CRASH -2,497. Bushehr struck. Brent $117",sev:3},
  {d:22,l:"Mar 21",deaths:3200,brent:112,nifty:23115,rupee:93.65,tag:"DIMONA hit — 100+ injured near nuclear site",sev:3},
  {d:24,l:"Mar 23",deaths:3700,brent:109,nifty:22513,rupee:93.88,tag:"Sensex -1,837. Nifty 22-mo low. ₹14L Cr wiped",sev:3},
  {d:25,l:"Mar 24",deaths:3800,brent:99, nifty:22912,rupee:93.88,tag:"Sensex +1,372. Modi-Trump call on Hormuz",sev:1},
  {d:28,l:"Mar 27",deaths:4300,brent:107,nifty:22820,rupee:94.56,tag:"Sensex -1,690. Rupee 94.56 ATL. Excise cut ₹10/L",sev:3},
  {d:31,l:"Mar 30",deaths:4700,brent:115,nifty:22331,rupee:94.84,tag:"Sensex 71,948 — worst month in 6 years",sev:3},
  {d:33,l:"Apr 1", deaths:4900,brent:101,nifty:22700,rupee:94.56,tag:"Iran parliament votes permanent Hormuz tolls",sev:2},
  {d:35,l:"Apr 3", deaths:5100,brent:108,nifty:22200,rupee:94.56,tag:"Sensex -1,400. Ceasefire deadline set",sev:3},
  {d:39,l:"Apr 7", deaths:5400,brent:95, nifty:23100,rupee:93.65,tag:"CEASEFIRE. Sensex +2,946 (+3.95%). Brent -11%",sev:1},
  {d:40,l:"Apr 8", deaths:5400,brent:96, nifty:23900,rupee:92.40,tag:"Hormuz partial reopen. Best day since Feb 2021",sev:1},
];

const RADAR_FB = [
  {axis:"Oil Shock",       w1:60,now:60,w4:42},
  {axis:"Market Crash",   w1:45,now:42,w4:30},
  {axis:"Nuclear Risk",   w1:20,now:88,w4:82},
  {axis:"Hormuz Closure", w1:80,now:90,w4:38},
  {axis:"Household",      w1:15,now:58,w4:48},
  {axis:"Currency",       w1:40,now:42,w4:36},
  {axis:"Social Unrest",  w1:25,now:58,w4:48},
  {axis:"Mil. Exposure",  w1:35,now:75,w4:52},
];

const NUKES_FB = [
  {name:"Bushehr ☢️",type:"Reactor",status:"ACTIVE WAR ZONE — IAEA WARNED",risk:88,
   info:"IAEA: strikes 250ft from operating reactor. Rosatom evacuated 200 staff 'minutes before plant was hit.' Reactor operational. IAEA cannot access.",lat:28.83,lon:50.88},
  {name:"Natanz",type:"Enrichment + HEU",status:"75% DAMAGED — 6,000+ CENTRIFUGES DESTROYED",risk:90,
   info:"Main enrichment plant 75% damaged. R&D 95% destroyed. Nuclear sticking point at Islamabad — Vance offered 20-yr moratorium, Iran said 3-5 yrs.",lat:33.72,lon:51.73},
  {name:"Isfahan",type:"PRIMARY HEU STORAGE",status:"PRIMARY HEU LOCATION — 200kg+ HERE",risk:96,
   info:"IAEA: MAJORITY of Iran's ~440kg of 60% HEU in deeply buried tunnel complex here. US demanded retrieval; Iran agreed only to 'monitored down-blending.'",lat:32.57,lon:51.81},
  {name:"Fordow",type:"Underground Enrichment",status:"ONLY 30% DAMAGED — GREATEST PROLIFERATION RISK",risk:88,
   info:"Built into mountain near Qom. Only 30% damaged despite GBU-57 MOPs. Core enrichment capability potentially intact. Greatest long-term proliferation risk.",lat:34.88,lon:51.73},
  {name:"Arak (IR-40)",type:"Heavy Water Reactor",status:"STRUCK — PLUTONIUM PATH CONCERN",risk:75,
   info:"Heavy water reactor capable of producing weapons-grade plutonium. Struck in early war waves. Iran reconstituting missile bases — same pattern expected here.",lat:34.10,lon:49.20},
];

const CITIES_FB = [
  {city:"Delhi NCR",  pop:"32M",wind:72,sea:15,nuke:55,tot:64,info:"1,800km downwind from Iran. IAEA: ~1,000 lbs HEU = material for 11 nuclear weapons. NO iodine prophylaxis program."},
  {city:"Mumbai",     pop:"21M",wind:40,sea:78,nuke:42,tot:58,info:"900km from Hormuz. Reliance Jamnagar refinery. Sensex +1,263 today. Brent below $95 reducing import costs."},
  {city:"Ahmedabad",  pop:"8.5M",wind:65,sea:55,nuke:46,tot:57,info:"Closest Indian metro to Iran. Jamnagar refinery nearby. US Navy intercepted first tankers today."},
  {city:"Jaipur",     pop:"4M",  wind:68,sea:10,nuke:44,tot:47,info:"Rajasthan wind funnel. UN FAO food catastrophe risk — kharif crop under fertilizer pressure."},
  {city:"Kochi",      pop:"2.1M",wind:25,sea:70,nuke:24,tot:44,info:"Southern Naval Command + Op Urja Suraksha base. Iran Red Sea threat hits western coast routes."},
  {city:"Goa",        pop:"1.5M",wind:30,sea:72,nuke:22,tot:42,info:"Konkan coast. Fishing economy ₹4,000 cr exposed. Tourism recovering with Brent below $95."},
  {city:"Lucknow",    pop:"3.5M",wind:58,sea:5, nuke:39,tot:40,info:"Indo-Gangetic plain. Most exposed to food inflation from fertilizer disruption."},
  {city:"Chennai",    pop:"11M", wind:20,sea:55,nuke:18,tot:36,info:"East coast buffer. IT sector led today's rally. Wipro Q4 results tomorrow Apr 16."},
];

const FEATURED_FB = [
  {
    title:"Geopolitics of LPG Supply in India",
    date:"March 18, 2026",
    tag:"PUBLICATION",
    tagColor: C.amber,
    desc:"How India's LPG import dependency on the Gulf creates acute vulnerability. Explores Hormuz exposure, alternative supply routes, and policy imperatives for energy security.",
    url:"https://takshashila.org.in/content/publications/20260318-LPG-Geopolitics.html",
    org:"Takshashila Institution",
    icon:"🛢️",
  },
  {
    title:"Geopolitics of Fertiliser Supply in India",
    date:"April 2, 2026",
    tag:"PUBLICATION",
    tagColor: C.green,
    desc:"India imports 30%+ of its fertilisers via Hormuz. This paper maps the supply chain risks, impact on kharif crops, and the strategic case for diversification.",
    url:"https://takshashila.org.in/content/publications/20260402-Fertilizer-Geopolitics.html",
    org:"Takshashila Institution",
    icon:"🌾",
  },
];

// ─── Nav ─────────────────────────────────────────────────────────
const NAV = [
  {id:"hormuz",   l:"🚢 Hormuz"},
  {id:"economic", l:"📉 Economy"},
  {id:"kitchen",  l:"🍳 Kitchen"},
  {id:"military", l:"⚔️ Military"},
  {id:"nuclear",  l:"☢️ Nuclear"},
  {id:"scenarios",l:"📈 Apr 21"},
  {id:"radar",    l:"🎯 Radar"},
  {id:"warlog",   l:"📋 Archive"},
  {id:"assessment",l:"🔴 Verdict"},
];

// ─── MiniLine Chart (fixed labels) ────────────────────────────────
const MiniLine = ({data, dataKey, color, h=110}) => {
  const vals = data.map(d => d[dataKey]).filter(v => v != null && typeof v === 'number');
  if (!vals.length) return null;
  const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
  const W = 500, pad = {l:28, r:16, t:20, b:28};
  const iw = W - pad.l - pad.r, ih = h - pad.t - pad.b;
  const filtered = data.filter(d => d[dataKey] != null && typeof d[dataKey] === 'number');
  // Show every 3rd label to avoid clutter
  const pts = filtered.map((d, i) => ({
    x: pad.l + (i / Math.max(filtered.length - 1, 1)) * iw,
    y: pad.t + (1 - (d[dataKey] - mn) / rng) * ih,
    v: d[dataKey], l: d.l || d.w || "", i
  }));
  const line = pts.map((p, i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = pts.length ? line + ` L${pts[pts.length-1].x},${(pad.t+ih).toFixed(1)} L${pts[0].x},${(pad.t+ih).toFixed(1)} Z` : '';
  const id = `g${dataKey}${Math.random().toString(36).slice(2,7)}`;
  const showDot = (i, total) => total <= 20 || i % Math.ceil(total/20) === 0 || i === total - 1;
  const showLabel = (i, total) => i === 0 || i === total-1 || (total <= 12) || i % Math.ceil(total/8) === 0;
  return (
    <svg viewBox={`0 0 ${W} ${h}`} style={{width:'100%',height:'auto',overflow:'visible',display:'block'}}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {area && <path d={area} fill={`url(#${id})`}/>}
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => showDot(i, pts.length) && (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="2.5" fill={C.card} stroke={color} strokeWidth="1.4"/>
          <text x={p.x} y={p.y - 6} fill={color} fontSize="7.5" textAnchor="middle"
            fontWeight="700" fontFamily={MONO} opacity="0.9">
            {typeof p.v === 'number' && p.v > 999 ? (p.v/1000).toFixed(1)+'k' : p.v}
          </text>
        </g>
      ))}
      {pts.map((p, i) => showLabel(i, pts.length) && (
        <text key={`l${i}`} x={p.x} y={h - 2} fill={C.muted} fontSize="7.5"
          textAnchor={i===0?'start':i===pts.length-1?'end':'middle'} fontFamily={MONO}
          transform={pts.length > 15 ? `rotate(-35,${p.x},${h-2})` : undefined}>
          {p.l}
        </text>
      ))}
    </svg>
  );
};

// ─── Progress Bar ─────────────────────────────────────────────────
const Bar = ({value, max=100, color, h=4}) => (
  <div style={{height:h, background:C.border, borderRadius:h/2, overflow:'hidden', marginTop:3}}>
    <div style={{height:'100%', width:`${Math.min((value/max)*100,100)}%`,
      background: color || (value>70?C.red:value>50?C.orange:value>30?C.amber:C.green),
      borderRadius:h/2, transition:'width 0.5s ease'}}/>
  </div>
);

// ─── Radar SVG ────────────────────────────────────────────────────
const RadarSVG = ({data, day}) => {
  const W=300, H=300, cx=W/2, cy=H/2+10, r=98, n=data.length;
  const ang = i => (Math.PI*2*i)/n - Math.PI/2;
  const pt = (i, v) => ({
    x: cx + Math.cos(ang(i)) * (v/100) * r,
    y: cy + Math.sin(ang(i)) * (v/100) * r,
  });
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
            fill={C.sub} fontSize="8.5" textAnchor="middle" dominantBaseline="middle"
            fontWeight="600" fontFamily={MONO}>{d.axis}</text>
        );
      })}
      {/* Legend */}
      {[{l:'Week 1',c:C.green},{l:`Now (D${day})`,c:C.amber},{l:'Wk 6+ Proj',c:C.red}].map((lg,i)=>(
        <g key={i}>
          <rect x={8} y={H-30+i*10} width={10} height={3} fill={lg.c} rx="1"/>
          <text x={22} y={H-26+i*10} fill={C.sub} fontSize="8" fontFamily={MONO}>{lg.l}</text>
        </g>
      ))}
    </svg>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────
const S = ({id, title, accent=C.amber, sub, children}) => (
  <section id={id} style={{marginBottom:44, scrollMarginTop:58}}>
    <div style={{marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${C.border}`}}>
      <h2 style={{margin:0, fontSize:10, fontWeight:700, color:accent,
        letterSpacing:4, textTransform:'uppercase', fontFamily:MONO}}>{title}</h2>
      {sub && <p style={{margin:'6px 0 0', fontSize:12, color:C.sub, fontFamily:SERIF, lineHeight:1.5}}>{sub}</p>}
    </div>
    {children}
  </section>
);

// ─── Metric Card ──────────────────────────────────────────────────
const Mc = ({label, value, sub, delta, accent=C.amber, deltaColor, indiaImpact}) => (
  <div style={{background:C.card, borderRadius:10, padding:'16px 14px',
    border:`1px solid ${C.border}`, borderTop:`2px solid ${accent}`,
    display:'flex', flexDirection:'column', gap:3}}>
    <div style={{fontSize:8.5, color:C.muted, letterSpacing:2.5, textTransform:'uppercase',
      fontWeight:700, fontFamily:MONO}}>{label}</div>
    <div style={{fontSize:26, fontWeight:700, color:accent, fontFamily:SYNE, lineHeight:1.1,
      letterSpacing:-0.5}}>{value}</div>
    {delta && <div style={{fontSize:11, color:deltaColor||C.sub, fontWeight:600,
      fontFamily:MONO}}>{delta}</div>}
    {sub && <div style={{fontSize:9.5, color:C.muted, lineHeight:1.4}}>{sub}</div>}
    {indiaImpact && (
      <div style={{marginTop:6, paddingTop:6, borderTop:`1px solid ${C.border}`,
        fontSize:9, color:C.amber, fontWeight:600, fontFamily:MONO, letterSpacing:0.3}}>
        🇮🇳 {indiaImpact}
      </div>
    )}
  </div>
);

// ─── Label Chip ───────────────────────────────────────────────────
const Chip = ({children, color=C.amber, size=9}) => (
  <span style={{display:'inline-block', padding:'2px 8px', borderRadius:4,
    background:`${color}18`, border:`1px solid ${color}30`,
    color, fontSize:size, fontWeight:700, fontFamily:MONO, letterSpacing:0.8,
    textTransform:'uppercase', whiteSpace:'nowrap'}}>{children}</span>
);

// ─── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [expNuke,       setExpNuke]       = useState(null);
  const [activeNav,     setActiveNav]     = useState(null);
  const [live,          setLive]          = useState(null);
  const [intel,         setIntel]         = useState(null);
  const [logExpanded,   setLogExpanded]   = useState(false);
  const [logSearch,     setLogSearch]     = useState('');
  const [hormuzExp,     setHormuzExp]     = useState(false);
  const [projTab,       setProjTab]       = useState('deal');
  const [aboutOpen,     setAboutOpen]     = useState(false);

  useEffect(() => {
    fetch('./market-data.json?t='+Date.now())
      .then(r => r.ok ? r.json() : null).then(d => d && setLive(d)).catch(()=>{});
    fetch('./war-intel.json?t='+Date.now())
      .then(r => r.ok ? r.json() : null).then(d => d && setIntel(d)).catch(()=>{});
  }, []);

  const go = id => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'});
  };

  // ── Data bindings ──
  const iT          = intel?.ticker         ?? TICKER_FB;
  const iDay        = intel?._day           ?? 47;
  const iUpdated    = intel?._updated       ?? "April 15, 2026 — 7:30 PM IST";
  const iDeaths     = intel?.deaths         ?? "6,500+";
  const iDeathsSub  = intel?.deathsSub      ?? "";
  const iWC         = intel?.whatChanged    ?? null;
  const iEcon       = intel?.econ           ?? null;
  const iTlLatest   = intel?.tlLatest       ?? [];
  const iRadar      = intel?.radar          ?? RADAR_FB;
  const iAssess     = intel?.assessment     ?? null;
  const iHLatest    = intel?.hormuzLatest   ?? [];
  const iKitchen    = intel?.kitchen        ?? [];
  const iMilitary   = intel?.military       ?? [];
  const iNukes      = intel?.nukes          ?? NUKES_FB;
  const iCities     = intel?.cities         ?? CITIES_FB;
  const iHormuz     = intel?.hormuzStatus   ?? null;
  const iHEvents    = intel?.hormuzEvents   ?? iHLatest;
  const iPhase      = intel?._phase         ?? "BLOCKADE";
  const iScenarios  = intel?.scenarios      ?? null;
  const iFeatured   = intel?.featured       ?? FEATURED_FB;

  const fullTL = [...TL_BASE.filter(t => !iTlLatest.some(lt=>lt.d===t.d)), ...iTlLatest]
    .sort((a,b) => a.d - b.d);

  // Live market
  const brentRaw  = live?.brent?.price      ?? 94;
  const brentChg  = live?.brent?.changePct  ?? -1.1;
  const niftyRaw  = live?.nifty?.price      ?? 24231;
  const niftyChg  = live?.nifty?.change     ?? 388;
  const sensexRaw = live?.sensex?.price     ? Math.round(live.sensex.price) : 78111;
  const rupeeRaw  = live?.rupee?.price      ?? 93.15;

  const brentColor  = brentRaw > 105 ? C.red : brentRaw > 95 ? C.orange : C.amber;
  const niftyColor  = niftyChg >= 0 ? C.green : C.red;
  const isBlockade  = iPhase === "BLOCKADE";

  // Scenario data
  const scenHeaders = iScenarios?.headers ?? ["Pre-war","Now (D47)","Thursday deal","Ceasefire lapses","Strikes resume"];
  const scenRows = [
    {m:"Brent ($)",  vals: iScenarios?.brent   ?? [65, 94, 72, 125, 145]},
    {m:"₹/USD",      vals: iScenarios?.rupee   ?? [91, 93.15, 90.0, 99, 105]},
    {m:"Deaths",     vals: iScenarios?.deaths  ?? [0,"6,500+","7,200","9,000+","30,000+"]},
    {m:"Sensex",     vals: iScenarios?.sensex  ?? ["78,699","78,111","90,000+","68,000","52,000"]},
    {m:"LPG",        vals: iScenarios?.lpg     ?? ["₹853","₹912","₹853","₹1,200+","₹1,600+"]},
    {m:"FII",        vals: iScenarios?.fii     ?? ["-","₹1,983 Cr OUT","$15B return","$12B out","$45B out"]},
  ];

  const filteredTL = logSearch.trim()
    ? [...fullTL].reverse().filter(d =>
        d.tag?.toLowerCase().includes(logSearch.toLowerCase()) ||
        d.l?.toLowerCase().includes(logSearch.toLowerCase()))
    : [...fullTL].reverse();

  const sv = s => s===3?"🔴":s===2?"🟠":"🟡";
  const share = (platform) => {
    const url = 'https://nithiyageo.github.io/india-risk-dashboard/';
    const txt = `🇮🇳 Iran-Gulf War: India Threat Matrix — Day ${iDay} | ${iUpdated}`;
    if (platform==='x')    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(url)}`,'_blank');
    if (platform==='li')   window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,'_blank');
    if (platform==='wa')   window.open(`https://wa.me/?text=${encodeURIComponent(txt+'\n\n'+url)}`,'_blank');
    if (platform==='copy') navigator.clipboard?.writeText(url);
  };

  return (
    <div style={{minHeight:'100vh', background:C.bg, color:C.text,
      fontFamily:SERIF, fontSize:13.5, maxWidth:1100, margin:'0 auto'}}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&display=swap');
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        @keyframes glow   { 0%,100%{box-shadow:0 0 8px #f59e0b30} 50%{box-shadow:0 0 20px #f59e0b50} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { height:3px; width:3px; }
        ::-webkit-scrollbar-thumb { background:#253047; border-radius:4px; }
        a { color:${C.amber}; text-decoration:none; }
        a:hover { text-decoration:underline; }
        .nav-pill:hover { background:${C.amberDim} !important; color:${C.amber} !important; border-color:${C.amber}40 !important; }
        .card-lift:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(0,0,0,0.35); }
        .btn-base { border:none; cursor:pointer; font-family:inherit; transition:all 0.15s; }
        .pub-card:hover { border-color:${C.amber}60 !important; transform:translateY(-2px); }
        .about-toggle:hover { color:${C.amber} !important; }
        @media(min-width:768px){
          .grid2  { grid-template-columns:1fr 1fr !important; }
          .grid3  { grid-template-columns:1fr 1fr 1fr !important; }
          .grid4  { grid-template-columns:1fr 1fr 1fr 1fr !important; }
          .dash-pad { padding:28px 36px 80px !important; }
          .hdr-inner { flex-direction:row !important; align-items:flex-start !important; }
          .hdr-h1 { font-size:34px !important; }
          .mc-val  { font-size:28px !important; }
          .tk-txt  { font-size:13px !important; }
          .assess-body { font-size:14px !important; line-height:2 !important; }
          .kit-note { font-size:11.5px !important; }
          .pub-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media(max-width:767px){
          .grid2 { grid-template-columns:1fr !important; }
          .grid3 { grid-template-columns:1fr !important; }
          .grid4 { grid-template-columns:1fr 1fr !important; }
          .pub-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ══ TICKER ══ */}
      <div style={{background:`linear-gradient(90deg,#7f1d1d,${C.red},#b91c1c)`,
        padding:'7px 0', overflow:'hidden'}}>
        <div style={{display:'flex', width:'max-content',
          animation:'ticker 90s linear infinite', willChange:'transform'}}>
          {[...iT,...iT].map((t,i) => (
            <span key={i} className="tk-txt" style={{fontSize:11.5, fontWeight:600, color:'#fff',
              letterSpacing:0.2, paddingRight:56, whiteSpace:'nowrap', flexShrink:0,
              fontFamily:MONO}}>
              {t}<span style={{paddingLeft:56, color:'#ffffff40'}}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ HEADER ══ */}
      <header style={{padding:'22px 20px 16px', borderBottom:`1px solid ${C.border}`,
        background:C.surface}}>
        <div className="hdr-inner" style={{display:'flex', flexDirection:'column', gap:16}}>
          {/* Left: masthead */}
          <div style={{flex:1}}>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}>
              <div style={{fontSize:8, fontWeight:700, color:C.muted, letterSpacing:5,
                textTransform:'uppercase', fontFamily:MONO}}>India Risk Assessment</div>
              <div style={{height:1, flex:1, background:C.border}}/>
              <div style={{display:'flex', gap:5}}>
                {[{l:'𝕏',p:'x'},{l:'in',p:'li'},{l:'wa',p:'wa'},{l:'📋',p:'copy'}].map((s,i) => (
                  <button key={i} onClick={()=>share(s.p)} className="btn-base"
                    style={{padding:'3px 7px', borderRadius:4, border:`1px solid ${C.border}`,
                      background:C.card, color:C.sub, fontSize:9, fontWeight:700, fontFamily:MONO}}>
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
            <h1 className="hdr-h1" style={{margin:0, fontSize:26, fontWeight:800, color:C.white,
              fontFamily:SYNE, lineHeight:1.1, letterSpacing:-0.5}}>
              How the Iran War<br/>Is Hitting India
            </h1>
            <div style={{marginTop:8, fontSize:11, color:C.sub, fontFamily:MONO}}>
              {iUpdated} &nbsp;•&nbsp; 50+ verified sources
            </div>
          </div>

          {/* Right: badges */}
          <div style={{display:'flex', gap:8, alignItems:'flex-start', flexWrap:'wrap'}}>
            <div style={{background:C.amber, color:C.bg, fontSize:17, fontWeight:800,
              padding:'10px 20px', borderRadius:8, fontFamily:SYNE, letterSpacing:-0.3,
              boxShadow:`0 4px 20px ${C.amber}40`}}>DAY {iDay}</div>
            <div style={{fontSize:9, color:isBlockade?C.red:C.green,
              padding:'5px 10px', border:`1px solid ${isBlockade?C.red:C.green}40`,
              borderRadius:6, background:(isBlockade?C.red:C.green)+'0c',
              fontWeight:700, fontFamily:MONO,
              animation:isBlockade?'pulse 2.5s infinite':undefined}}>
              {isBlockade?"⚠ BLOCKADE ACTIVE":"● CEASEFIRE"}
            </div>
          </div>
        </div>

        {/* About toggle */}
        <button className="btn-base about-toggle"
          onClick={()=>setAboutOpen(!aboutOpen)}
          style={{marginTop:14, fontSize:10, color:C.sub, fontFamily:MONO,
            background:'none', padding:'5px 0', display:'flex', alignItems:'center', gap:5}}>
          {aboutOpen?"▲":"▼"} {aboutOpen?"Hide":"What is this tracker?"}
        </button>
        {aboutOpen && (
          <div style={{marginTop:10, padding:'14px 16px', background:C.card,
            borderRadius:8, border:`1px solid ${C.border}`, fontSize:12.5,
            color:C.sub, fontFamily:SERIF, lineHeight:1.9,
            animation:'fadein 0.25s ease both'}}>
            <strong style={{color:C.white, fontFamily:SYNE}}>This is India's war tracker — not a global one.</strong>
            {' '}While the Iran-Gulf War is a global crisis, this dashboard focuses exclusively on what it means
            for India's 1.4 billion people: energy prices, food security, financial markets, nuclear exposure,
            and the 280+ Indian seafarers in the Gulf right now.
            <br/><br/>
            We track Hormuz because <strong style={{color:C.amber}}>85% of India's crude oil</strong> transits that
            39km chokepoint. We track Brent because it sets your LPG and petrol price. We track the Nifty because
            every major escalation has cost Indian investors lakhs of crore in a single session. We track nuclear
            sites because Delhi is 4–7 days downwind of Iran at 500 hPa.
            <br/><br/>
            Market data auto-syncs twice daily via GitHub Action. War intelligence is updated manually twice daily
            from 50+ verified sources. Built by researchers at Takshashila Institution.
          </div>
        )}
      </header>

      {/* ══ NAV ══ */}
      <nav style={{position:'sticky', top:0, zIndex:100, background:C.bg+'f2',
        backdropFilter:'blur(20px)', borderBottom:`1px solid ${C.border}`, padding:'8px 16px'}}>
        <div style={{display:'flex', gap:4, overflowX:'auto', scrollbarWidth:'none', WebkitOverflowScrolling:'touch'}}>
          {NAV.map(n => (
            <button key={n.id} className="nav-pill btn-base"
              onClick={()=>go(n.id)}
              style={{flex:'0 0 auto', padding:'6px 13px',
                border:activeNav===n.id?`1px solid ${C.amber}60`:`1px solid ${C.border}`,
                borderRadius:20, background:activeNav===n.id?C.amberDim:'transparent',
                color:activeNav===n.id?C.amber:C.sub, fontSize:10.5, fontWeight:600,
                fontFamily:MONO, whiteSpace:'nowrap'}}>
              {n.l}
            </button>
          ))}
        </div>
      </nav>

      <div className="dash-pad" style={{padding:'22px 18px 72px'}}>

        {/* ══ FEATURED PUBLICATIONS ══ */}
        <section style={{marginBottom:36}}>
          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14}}>
            <div style={{fontSize:8.5, fontWeight:700, color:C.amber, letterSpacing:4,
              textTransform:'uppercase', fontFamily:MONO}}>Featured Research</div>
            <div style={{height:1, flex:1, background:`linear-gradient(90deg,${C.amber}40,transparent)`}}/>
          </div>
          <div className="pub-grid" style={{display:'grid', gridTemplateColumns:'1fr', gap:12}}>
            {(iFeatured.length ? iFeatured : FEATURED_FB).map((pub, i) => (
              <a key={i} href={pub.url} target="_blank" rel="noopener noreferrer"
                className="pub-card card-lift"
                style={{display:'flex', gap:14, background:C.card,
                  border:`1px solid ${C.border}`, borderLeft:`3px solid ${pub.tagColor||C.amber}`,
                  borderRadius:10, padding:'14px 16px', textDecoration:'none',
                  transition:'all 0.18s', animation:`fadein 0.3s ease ${i*0.1}s both`}}>
                <div style={{fontSize:28, flexShrink:0, lineHeight:1}}>{pub.icon||'📄'}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:'flex', gap:6, alignItems:'center', marginBottom:5, flexWrap:'wrap'}}>
                    <Chip color={pub.tagColor||C.amber} size={8}>{pub.tag||'PUBLICATION'}</Chip>
                    <span style={{fontSize:9, color:C.muted, fontFamily:MONO}}>{pub.org}</span>
                    <span style={{fontSize:9, color:C.muted, fontFamily:MONO}}>• {pub.date}</span>
                  </div>
                  <div style={{fontSize:13.5, fontWeight:700, color:C.white, fontFamily:SYNE,
                    lineHeight:1.3, marginBottom:6}}>{pub.title}</div>
                  <div style={{fontSize:11.5, color:C.sub, fontFamily:SERIF,
                    lineHeight:1.6}}>{pub.desc}</div>
                  <div style={{marginTop:8, fontSize:10, color:pub.tagColor||C.amber,
                    fontFamily:MONO, fontWeight:600}}>Read publication →</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ══ WHAT CHANGED ══ */}
        {iWC && (
          <div style={{background:C.redDim, border:`1px solid ${C.red}22`,
            borderLeft:`3px solid ${C.red}`, borderRadius:10, padding:'16px 18px', marginBottom:28}}>
            <div style={{fontSize:9, fontWeight:700, color:C.red, letterSpacing:4,
              marginBottom:14, fontFamily:MONO}}>{iWC.label||"WHAT CHANGED"}</div>
            <div>
              {(iWC.items||[]).map((item, i) => {
                const col = C[item.color] || C.amber;
                return (
                  <div key={i} style={{display:'flex', gap:10, marginBottom:i===iWC.items.length-1?0:13,
                    paddingBottom:i===iWC.items.length-1?0:13,
                    borderBottom:i===iWC.items.length-1?'none':`1px solid ${C.border}30`,
                    lineHeight:1.7, animation:`fadein 0.3s ease ${i*0.04}s both`}}>
                    <span style={{color:col, fontWeight:900, flexShrink:0, fontSize:13, marginTop:1}}>▸</span>
                    <span style={{fontSize:12.5}}>
                      <strong style={{color:col, fontWeight:700, fontFamily:SYNE}}>{item.bold} </strong>
                      <span style={{color:C.sub, fontFamily:SERIF}}>{item.text}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ METRICS ══ */}
        <div className="grid4" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:28}}>
          <Mc label="War Dead" value={iDeaths} sub={iDeathsSub} accent={C.red}
            indiaImpact="280+ Indian seafarers in Gulf zone"/>
          <Mc label="Brent Crude" value={`$${brentRaw}`}
            delta={(brentChg>0?"▲ +":"▼ ")+Math.abs(brentChg).toFixed(1)+"%"}
            deltaColor={brentChg>0?C.red:C.green} sub="was $65 pre-war" accent={brentColor}
            indiaImpact="India imports 85%+ via Hormuz"/>
          <Mc label="Nifty 50" value={typeof niftyRaw==='number'?Math.round(niftyRaw).toLocaleString():niftyRaw}
            delta={(niftyChg>=0?"▲ +":"▼ ")+Math.abs(niftyChg).toLocaleString()}
            deltaColor={niftyColor} sub="Apr 15 close" accent={niftyChg>=0?C.green:C.red}
            indiaImpact={`Sensex ${typeof sensexRaw==='number'?sensexRaw.toLocaleString():sensexRaw} • All 30 green`}/>
          <Mc label="₹ / USD" value={typeof rupeeRaw==='number'?rupeeRaw.toFixed(2):rupeeRaw}
            delta="ATL zone" deltaColor={C.red} sub="was ₹91.49 pre-war" accent={C.orange}
            indiaImpact="Every ₹1 fall = ₹4,000cr import bill rise"/>
        </div>

        {/* ══ HORMUZ ══ */}
        <S id="hormuz" title="🚢 Hormuz — India's Energy Lifeline" accent={C.cyan}
          sub="85% of India's crude oil transits this 39km chokepoint. What happens here lands at your pump.">

          {/* Status strip */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10}}>
            <div style={{background:(isBlockade?C.red:C.green)+'10', borderRadius:10,
              padding:14, textAlign:'center', border:`1px solid ${(isBlockade?C.red:C.green)}25`}}>
              <div style={{fontSize:8, color:isBlockade?C.red:C.green, fontWeight:700, letterSpacing:2.5, fontFamily:MONO}}>STATUS</div>
              <div style={{fontSize:12, fontWeight:700, color:isBlockade?C.red:C.green, marginTop:6,
                fontFamily:SYNE, lineHeight:1.3}}>{iHormuz?.status||"BLOCKADE ACTIVE"}</div>
            </div>
            <div style={{background:C.card, borderRadius:10, padding:14, textAlign:'center', border:`1px solid ${C.border}`}}>
              <div style={{fontSize:8, color:C.muted, fontWeight:700, letterSpacing:2.5, fontFamily:MONO}}>SHIP TRAFFIC</div>
              <div style={{fontSize:13, fontWeight:700, color:C.orange, marginTop:6,
                fontFamily:MONO, lineHeight:1.3}}>{iHormuz?.currentFlow||"ZERO past blockade Day 1"}</div>
              <div style={{fontSize:9, color:C.muted, marginTop:3}}>Pre-war: {iHormuz?.preWarFlow||"130-160 ships/day"}</div>
            </div>
          </div>

          {/* India-specific stats — PROMINENT */}
          <div style={{background:C.amberDim, borderRadius:10, padding:'12px 14px',
            border:`1px solid ${C.amber}25`, marginBottom:10}}>
            <div style={{fontSize:8.5, color:C.amber, fontWeight:700, letterSpacing:3,
              fontFamily:MONO, marginBottom:10}}>🇮🇳 INDIA'S HORMUZ EXPOSURE</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
              {[
                {l:"Ships in Gulf",  v:iHormuz?.indianVesselsNear??8, sub:(iHormuz?.indianSeafarers??280)+" seafarers"},
                {l:"Crossed Safely", v:iHormuz?.indianTransited??10,  sub:"8 LPG + 1 crude + 1 gas"},
                {l:"Navy Escort",    v:"ACTIVE", sub:iHormuz?.indianNavyEscort||"Op Urja Suraksha", isText:true},
              ].map((s,i) => (
                <div key={i} style={{textAlign:'center'}}>
                  <div style={{fontSize:8, color:C.amber, fontWeight:700, letterSpacing:1.5,
                    fontFamily:MONO, marginBottom:4}}>{s.l}</div>
                  <div style={{fontSize:s.isText?13:24, fontWeight:700, color:C.amber,
                    fontFamily:SYNE, lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:8.5, color:C.sub, marginTop:3, lineHeight:1.3}}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hormuz timeline */}
          <div style={{background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
              <div style={{fontSize:8.5, fontWeight:700, color:C.cyan, letterSpacing:3, fontFamily:MONO}}>TIMELINE</div>
              <button className="btn-base" onClick={()=>setHormuzExp(!hormuzExp)}
                style={{fontSize:9, color:C.cyan, background:C.cyanDim,
                  border:`1px solid ${C.cyan}30`, borderRadius:4, padding:'3px 10px',
                  fontWeight:700, fontFamily:MONO}}>
                {hormuzExp?"SHOW LESS ▲":"FULL HISTORY ▼"}
              </button>
            </div>
            {(hormuzExp ? iHEvents : iHEvents.slice(0,4)).map((e,i) => (
              <div key={i} style={{display:'flex', gap:10, padding:'7px 0',
                borderBottom:`1px solid ${C.border}20`, alignItems:'flex-start'}}>
                <span style={{fontSize:9.5, color:C.cyan, fontWeight:700, minWidth:54,
                  fontFamily:MONO, flexShrink:0}}>{e.d}</span>
                <span style={{fontSize:11.5, color:C.sub, lineHeight:1.65, fontFamily:SERIF}}>{e.e}</span>
              </div>
            ))}
            <div style={{fontSize:9, color:C.muted, marginTop:8, paddingTop:6,
              borderTop:`1px solid ${C.border}20`, fontFamily:MONO}}>
              🇮🇳 Last transit: {iHormuz?.lastTransit||"US destroyer intercepted 2 tankers from Chabahar (Tue)"}
            </div>
          </div>
        </S>

        {/* ══ ECONOMY ══ */}
        <S id="economic" title="📉 Economic Impact on India" accent={C.orange}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:14}}>
            <Mc label="BSE Market Cap" value={iEcon?.wealth||"~₹452L Cr"}
              sub="recovering from ₹443L Cr low Apr 13" accent={C.orange}/>
            <Mc label="FII Flow Apr 13" value={iEcon?.fpi||"₹1,983 Cr OUT"}
              delta={iEcon?.fpiDelta||"DII +₹2,432 Cr IN"} sub="net flow" accent={C.red}/>
            <Mc label="Sensex" value={iEcon?.sensex||"78,111"}
              delta={iEcon?.sensexDelta||"▲ +1,263 (+1.65%)"}
              deltaColor={C.green} sub={iEcon?.sensexSub||"Apr 15 close. All 30 green."} accent={C.green}/>
            <Mc label="India VIX" value={iEcon?.vix||"~15-17"}
              delta={iEcon?.vixDelta||"falling"} sub="fear gauge easing" accent={C.amber}/>
          </div>

          {/* Nifty chart */}
          <div style={{background:C.card, borderRadius:10, padding:'14px 14px 10px',
            marginBottom:10, border:`1px solid ${C.border}`}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
              marginBottom:10}}>
              <div style={{fontSize:9, fontWeight:700, color:C.cyan, letterSpacing:3, fontFamily:MONO}}>NIFTY 50 — ALL {fullTL.length} WAR DAYS</div>
              <Chip color={C.cyan} size={8}>LIVE</Chip>
            </div>
            <MiniLine data={fullTL} dataKey="nifty" color={C.cyan} h={110}/>
          </div>

          {/* Brent chart */}
          <div style={{background:C.card, borderRadius:10, padding:'14px 14px 10px',
            marginBottom:10, border:`1px solid ${C.border}`}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
              marginBottom:10}}>
              <div style={{fontSize:9, fontWeight:700, color:C.orange, letterSpacing:3, fontFamily:MONO}}>BRENT CRUDE ($) — ALL WAR DAYS</div>
              <span style={{fontSize:9, color:C.sub, fontFamily:MONO}}>Currently ~${brentRaw}</span>
            </div>
            <MiniLine data={fullTL} dataKey="brent" color={C.orange} h={110}/>
          </div>

          {iEcon?.analysis && (
            <div style={{background:C.card, borderRadius:10, padding:'14px 16px',
              border:`1px solid ${C.border}`, borderLeft:`3px solid ${C.orange}`}}>
              <div style={{fontSize:9, fontWeight:700, color:C.orange, letterSpacing:3,
                fontFamily:MONO, marginBottom:8}}>📊 MARKET ANALYSIS</div>
              <div style={{fontSize:12.5, color:C.sub, lineHeight:1.85, fontFamily:SERIF}}>
                {iEcon.analysis}
              </div>
            </div>
          )}
        </S>

        {/* ══ KITCHEN TABLE ══ */}
        <S id="kitchen" title="🍳 Your Kitchen Table" accent={C.amber}
          sub="What the war means for Indian households — LPG, petrol, food, medicine. Updated from war-intel.json.">
          {iKitchen.map((h, i) => {
            const sCol = h.s===3?C.red:h.s===2?C.orange:C.green;
            return (
              <div key={i} className="card-lift"
                style={{background:C.card, borderRadius:10, padding:'13px 15px',
                  marginBottom:8, borderLeft:`3px solid ${sCol}`,
                  border:`1px solid ${C.border}`, transition:'all 0.15s'}}>
                <div style={{display:'flex', justifyContent:'space-between',
                  alignItems:'flex-start', gap:8, flexWrap:'wrap'}}>
                  <span style={{fontSize:13.5, fontWeight:700, color:C.white, fontFamily:SYNE}}>
                    {sv(h.s)} {h.item}
                  </span>
                  <span style={{fontSize:11, fontWeight:700, color:sCol, fontFamily:MONO, flexShrink:0}}>
                    {h.chg}
                  </span>
                </div>
                <div style={{display:'flex', gap:14, marginTop:8, fontSize:11,
                  flexWrap:'wrap', fontFamily:MONO}}>
                  <span style={{color:C.muted}}>Pre: <strong style={{color:C.sub}}>{h.pre}</strong></span>
                  <span style={{color:C.muted}}>Now: <strong style={{color:C.amber}}>{h.now}</strong></span>
                  <span style={{color:C.muted}}>2wk: <strong style={{color:h.s===3?C.red:C.green}}>{h.proj}</strong></span>
                </div>
                <div className="kit-note" style={{fontSize:11, color:C.sub, marginTop:8,
                  lineHeight:1.75, borderTop:`1px solid ${C.border}40`, paddingTop:8,
                  fontFamily:SERIF}}>{h.note}</div>
              </div>
            );
          })}
        </S>

        {/* ══ MILITARY ══ */}
        <S id="military" title="⚔️ Military & Strategic Updates" accent={C.red}>
          {iMilitary.map((m, i) => {
            const mc = C[m.color] || C.amber;
            const isBreaking = m.lv === "BREAKING";
            return (
              <div key={i} className="card-lift"
                style={{background:isBreaking?`${mc}0c`:C.card,
                  border:`1px solid ${mc}${isBreaking?'30':'15'}`,
                  borderLeft:`3px solid ${mc}`, borderRadius:10,
                  padding:'13px 15px', marginBottom:8, transition:'all 0.15s'}}>
                <div style={{display:'flex', justifyContent:'space-between',
                  alignItems:'flex-start', gap:8, flexWrap:'wrap', marginBottom:8}}>
                  <span style={{fontSize:13.5, fontWeight:700, color:C.white,
                    fontFamily:SYNE, flex:1, lineHeight:1.35}}>{m.t}</span>
                  <Chip color={isBreaking?C.red:C.sub} size={8}>{m.lv}</Chip>
                </div>
                <div style={{fontSize:12, color:C.sub, lineHeight:1.8, fontFamily:SERIF}}>{m.d}</div>
              </div>
            );
          })}
        </S>

        {/* ══ NUCLEAR ══ */}
        <S id="nuclear" title="☢️ Nuclear Exposure" accent={C.purple}>

          {/* India risk FIRST */}
          <div style={{background:C.purpleDim, border:`1px solid ${C.purple}30`,
            borderLeft:`3px solid ${C.purple}`, borderRadius:10, padding:'14px 16px', marginBottom:16}}>
            <div style={{fontSize:9, fontWeight:700, color:C.purple, letterSpacing:3,
              fontFamily:MONO, marginBottom:8}}>🇮🇳 INDIA NUCLEAR RISK HEADLINE</div>
            <div style={{fontSize:12.5, color:C.sub, lineHeight:1.85, fontFamily:SERIF}}>
              <strong style={{color:C.purple}}>Bushehr — a working reactor — has been struck.</strong>{' '}
              IAEA: strikes landed 250ft from the operating reactor. Rosatom evacuated 200 staff
              "minutes before plant was hit." Iran holds ~460kg of 60% enriched uranium across five sites —
              enough material for approximately 11 nuclear weapons (IAEA).
              Delhi is 4–7 days downwind at 500 hPa. India has{' '}
              <strong style={{color:C.red}}>NO national iodine prophylaxis program.</strong>
            </div>
          </div>

          {/* Live wind map */}
          <div style={{background:C.card, borderRadius:12, padding:14,
            marginBottom:16, border:`1px solid ${C.purple}25`}}>
            <div style={{display:'flex', justifyContent:'space-between',
              alignItems:'center', marginBottom:10, flexWrap:'wrap', gap:8}}>
              <div>
                <div style={{fontSize:10, fontWeight:700, color:C.purple, letterSpacing:2, fontFamily:MONO}}>
                  🌬️ LIVE WIND FORECAST — IRAN → INDIA
                </div>
                <div style={{fontSize:10, color:C.muted, marginTop:2, fontFamily:SERIF}}>
                  Real-time atmospheric transport at 500 hPa (~5.5 km altitude)
                </div>
              </div>
              <Chip color={C.cyan} size={8}>● LIVE • windy.com</Chip>
            </div>
            <div style={{position:'relative', width:'100%', paddingBottom:'56%', height:0,
              borderRadius:8, overflow:'hidden', border:`1px solid ${C.border}`, background:'#07090f'}}>
              <iframe title="Wind forecast — Iran nuclear sites to India"
                src="https://embed.windy.com/embed2.html?lat=30&lon=54&detailLat=32.5&detailLon=51.7&width=650&height=450&zoom=5&level=500h&overlay=wind&product=ecmwf&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
                style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:0}} frameBorder="0"/>
            </div>
            <div style={{background:C.amberDim, border:`1px solid ${C.amber}25`,
              borderRadius:6, padding:10, marginTop:10,
              fontSize:10, color:C.sub, lineHeight:1.7, fontFamily:SERIF}}>
              <strong style={{color:C.amber}}>⚠️ Note:</strong> Shows wind direction/speed at 500 hPa only —
              relevant for long-range particulate transport. Does NOT show radiation levels or fallout.
              For actual fallout modelling, see <strong>NOAA HYSPLIT</strong>.
            </div>
            <div style={{display:'flex', gap:5, marginTop:10, flexWrap:'wrap'}}>
              {[{n:'B',l:'Bushehr'},{n:'N',l:'Natanz'},{n:'I',l:'Isfahan'},
                {n:'A',l:'Arak'},{n:'F',l:'Fordow'},{n:'Y',l:'Yazd'}].map(s => (
                <div key={s.n} style={{display:'flex', alignItems:'center', gap:4,
                  background:C.bg, border:`1px solid ${C.red}25`, borderRadius:4, padding:'3px 7px'}}>
                  <div style={{width:14,height:14,borderRadius:'50%',background:C.red,
                    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <span style={{fontSize:7,fontWeight:900,color:'#fff'}}>{s.n}</span>
                  </div>
                  <span style={{fontSize:9,color:C.sub,fontWeight:600,fontFamily:MONO}}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nuclear sites — collapsible reference */}
          <div style={{fontSize:9, fontWeight:700, color:C.purple, marginBottom:10,
            letterSpacing:3, fontFamily:MONO}}>IRANIAN NUCLEAR SITES — STATUS</div>
          {iNukes.map((n, i) => {
            const rCol = n.risk>85?C.red:n.risk>70?C.orange:C.amber;
            const isHit = (n.status||"").match(/HIT|DAMAGED|STRUCK|WAR ZONE/);
            return (
              <div key={i} onClick={()=>setExpNuke(expNuke===i?null:i)}
                style={{background:C.card, borderRadius:10, padding:'12px 14px',
                  marginBottom:6, cursor:'pointer', border:`1px solid ${rCol}18`,
                  transition:'all 0.15s'}}>
                <div style={{display:'flex', justifyContent:'space-between',
                  alignItems:'center', gap:8, flexWrap:'wrap'}}>
                  <div style={{flex:1}}>
                    <span style={{fontSize:13, fontWeight:700, color:rCol,
                      fontFamily:SYNE}}>{n.name}</span>
                    <span style={{fontSize:9.5, color:C.muted, marginLeft:8,
                      fontFamily:MONO}}>{n.type}</span>
                  </div>
                  <Chip color={isHit?C.red:C.orange} size={8}>{n.status||n.st}</Chip>
                </div>
                <Bar value={n.risk} color={rCol} h={4}/>
                <div style={{fontSize:9.5, color:C.muted, marginTop:4,
                  display:'flex', justifyContent:'space-between', fontFamily:MONO}}>
                  <span style={{color:rCol, fontWeight:700}}>{n.risk}/100 risk</span>
                  <span>{expNuke===i?"▲ collapse":"▼ expand"}</span>
                </div>
                {expNuke===i && (
                  <div style={{fontSize:11.5, color:C.sub, marginTop:10, lineHeight:1.8,
                    borderTop:`1px solid ${C.border}`, paddingTop:10, fontFamily:SERIF,
                    animation:'fadein 0.2s ease both'}}>{n.info}</div>
                )}
              </div>
            );
          })}

          {/* City exposure — PROMOTED */}
          <div style={{marginTop:24}}>
            <div style={{fontSize:9, fontWeight:700, color:C.amber, letterSpacing:3,
              fontFamily:MONO, marginBottom:6}}>🇮🇳 INDIAN CITY EXPOSURE</div>
            <div style={{fontSize:11.5, color:C.sub, marginBottom:12, fontFamily:SERIF, lineHeight:1.6}}>
              Composite risk score: wind trajectory (nuclear) + sea proximity (oil shock) + nuclear facility distance.
            </div>
            {iCities.map((c, i) => {
              const totCol = c.tot>55?C.red:c.tot>42?C.orange:C.amber;
              return (
                <div key={i} style={{background:C.card, borderRadius:10,
                  padding:'13px 15px', marginBottom:8, border:`1px solid ${C.border}`}}>
                  <div style={{display:'flex', justifyContent:'space-between',
                    alignItems:'center', marginBottom:10}}>
                    <div>
                      <span style={{fontSize:14, fontWeight:700, color:C.white,
                        fontFamily:SYNE}}>{c.city}</span>
                      <span style={{fontSize:10, color:C.muted, marginLeft:8,
                        fontFamily:MONO}}>Pop: {c.pop}</span>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <span style={{fontSize:24, fontWeight:800, color:totCol,
                        fontFamily:SYNE}}>{c.tot}</span>
                      <span style={{fontSize:10, color:C.muted}}>/100</span>
                    </div>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
                    gap:8, marginBottom:10}}>
                    {[{l:"Wind",v:c.wind,cl:C.orange},{l:"Sea",v:c.sea,cl:C.cyan},{l:"Nuclear",v:c.nuke,cl:C.purple}].map((vv,j)=>(
                      <div key={j}>
                        <div style={{fontSize:9, color:vv.cl, fontWeight:700,
                          marginBottom:3, fontFamily:MONO}}>{vv.l}: {vv.v}/100</div>
                        <Bar value={vv.v} color={vv.cl} h={5}/>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:11.5, color:C.sub, lineHeight:1.7,
                    fontFamily:SERIF}}>{c.info}</div>
                </div>
              );
            })}
          </div>
        </S>

        {/* ══ SCENARIOS — APRIL 21 DECISION TREE ══ */}
        <S id="scenarios" title="📈 April 21 Decision Tree" accent={C.cyan}
          sub="Ceasefire expires in 6 days. Three paths. One matters most for India.">

          {/* 3 scenario cards */}
          <div className="grid3" style={{display:'grid', gridTemplateColumns:'1fr', gap:10, marginBottom:16}}>
            {[
              {
                label:"🟢 DEAL / EXTENSION",
                prob:"~60%",
                color:C.green,
                brent:"$70–80",
                sensex:"82,000–90,000+",
                rupee:"₹90–91",
                lpg:"₹853",
                fii:"$15B return",
                desc:"Thursday talks produce ceasefire extension 45–60 days. Blockade eases. Brent collapses. Nifty surges.",
              },
              {
                label:"🟡 PARTIAL DEAL",
                prob:"~15%",
                color:C.amber,
                brent:"$80–90",
                sensex:"79,000–82,000",
                rupee:"₹91–93",
                lpg:"₹880",
                fii:"$5B return",
                desc:"Nuclear issues deferred; blockade partially lifted. Oil eases but HEU question unresolved.",
              },
              {
                label:"🔴 CEASEFIRE LAPSES",
                prob:"~25%",
                color:C.red,
                brent:"$125–145",
                sensex:"52,000–68,000",
                rupee:"₹99–105",
                lpg:"₹1,200–1,600+",
                fii:"$12–45B out",
                desc:"No deal, no extension by Apr 21. Iran maximum alert. Trump 'locked and loaded.' Extreme escalation.",
              },
            ].map((sc, i) => (
              <div key={i} className="card-lift"
                style={{background:C.card, borderRadius:12, padding:'16px 16px',
                  border:`1px solid ${sc.color}30`, borderTop:`3px solid ${sc.color}`,
                  transition:'all 0.18s', animation:`fadein 0.3s ease ${i*0.1}s both`}}>
                <div style={{display:'flex', justifyContent:'space-between',
                  alignItems:'flex-start', marginBottom:10, flexWrap:'wrap', gap:6}}>
                  <div style={{fontSize:12, fontWeight:700, color:sc.color,
                    fontFamily:SYNE, lineHeight:1.2}}>{sc.label}</div>
                  <div style={{padding:'3px 10px', borderRadius:20,
                    background:`${sc.color}20`, color:sc.color,
                    fontSize:10, fontWeight:700, fontFamily:MONO}}>{sc.prob}</div>
                </div>
                <div style={{fontSize:11.5, color:C.sub, fontFamily:SERIF,
                  lineHeight:1.65, marginBottom:12}}>{sc.desc}</div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6}}>
                  {[["Brent",sc.brent],["Sensex",sc.sensex],["Rupee",sc.rupee],["LPG",sc.lpg]].map(([k,v])=>(
                    <div key={k} style={{background:C.surface, borderRadius:6, padding:'6px 8px'}}>
                      <div style={{fontSize:8.5, color:C.muted, fontFamily:MONO,
                        fontWeight:700, letterSpacing:1}}>{k}</div>
                      <div style={{fontSize:11.5, color:sc.color, fontWeight:700,
                        fontFamily:MONO, marginTop:2}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Full scenario table */}
          <div style={{background:C.card, borderRadius:10, padding:14,
            overflowX:'auto', border:`1px solid ${C.border}`}}>
            <div style={{fontSize:9, fontWeight:700, color:C.sub, letterSpacing:3,
              fontFamily:MONO, marginBottom:10}}>FULL SCENARIO TABLE</div>
            <table style={{width:'100%', borderCollapse:'collapse',
              fontSize:10.5, minWidth:320, fontFamily:MONO}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.border}`}}>
                  <th style={{padding:'5px 6px', textAlign:'left',
                    color:C.muted, fontWeight:700, fontSize:9}}>Metric</th>
                  {scenHeaders.map((h,i) => (
                    <th key={i} style={{padding:'5px 4px', textAlign:'right', fontSize:9,
                      color:i===0?C.green:i===1?C.amber:i===2?C.green:i>=3?C.red:C.sub,
                      fontWeight:700}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scenRows.map((r,i) => (
                  <tr key={i} style={{borderBottom:`1px solid ${C.border}20`}}>
                    <td style={{padding:'5px 6px', fontWeight:600,
                      color:C.text, fontSize:10}}>{r.m}</td>
                    {(r.vals||[]).map((v,j) => (
                      <td key={j} style={{padding:'5px 4px', textAlign:'right',
                        color:j===0?C.green:j===1?C.amber:j===2?C.green:j>=3?C.red:C.sub,
                        fontWeight:600}}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </S>

        {/* ══ RADAR ══ */}
        <S id="radar" title="🎯 Risk Radar" accent={C.amber}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <div style={{background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`}}>
              <RadarSVG data={iRadar} day={iDay}/>
            </div>
            <div style={{background:C.card, borderRadius:10, padding:'14px 12px', border:`1px solid ${C.border}`}}>
              <div style={{fontSize:9, fontWeight:700, color:C.amber, letterSpacing:3,
                fontFamily:MONO, marginBottom:12}}>CURRENT SCORES</div>
              {iRadar.map((r,i) => (
                <div key={i} style={{display:'flex', alignItems:'center', gap:8,
                  padding:'5px 0', borderBottom:`1px solid ${C.border}20`}}>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:9.5, color:C.sub, fontFamily:MONO,
                      fontWeight:600, marginBottom:3}}>{r.axis}</div>
                    <Bar value={r.now} color={r.now>70?C.red:r.now>50?C.orange:C.amber} h={5}/>
                  </div>
                  <span style={{fontSize:14, fontWeight:800,
                    color:r.now>70?C.red:r.now>50?C.orange:C.amber,
                    fontFamily:SYNE, flexShrink:0, minWidth:28, textAlign:'right'}}>{r.now}</span>
                </div>
              ))}
            </div>
          </div>
        </S>

        {/* ══ WAR LOG / ARCHIVE ══ */}
        <S id="warlog" title="📋 War Log — All Days" accent={C.sub}>
          <div style={{background:C.card, borderRadius:10, padding:14, border:`1px solid ${C.border}`}}>
            <div style={{display:'flex', justifyContent:'space-between',
              alignItems:'center', marginBottom:12, flexWrap:'wrap', gap:8}}>
              <button className="btn-base" onClick={()=>setLogExpanded(!logExpanded)}
                style={{fontSize:9, color:C.cyan, background:C.cyanDim,
                  border:`1px solid ${C.cyan}30`, borderRadius:4, padding:'4px 12px',
                  fontWeight:700, fontFamily:MONO}}>
                {logExpanded?"COLLAPSE ▲":"FULL ARCHIVE ▼"}
              </button>
              <input
                placeholder="Search war log..."
                value={logSearch}
                onChange={e=>setLogSearch(e.target.value)}
                style={{padding:'5px 10px', borderRadius:6, border:`1px solid ${C.border}`,
                  background:C.surface, color:C.text, fontSize:10.5,
                  fontFamily:MONO, outline:'none', minWidth:140,
                  flex:1, maxWidth:220}}/>
            </div>
            {(logExpanded || logSearch ? filteredTL : filteredTL.slice(0,6)).map((d,i) => (
              <div key={i} style={{padding:'7px 0', borderBottom:`1px solid ${C.border}18`,
                display:'flex', gap:10, alignItems:'flex-start'}}>
                <div style={{minWidth:42, flexShrink:0}}>
                  <div style={{fontSize:10, fontWeight:800,
                    color:d.sev===3?C.red:d.sev===2?C.orange:C.green,
                    fontFamily:MONO}}>D{d.d}</div>
                  <div style={{fontSize:8.5, color:C.muted, fontFamily:MONO}}>{d.l}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11.5, color:C.sub, lineHeight:1.55, fontFamily:SERIF}}>{d.tag}</div>
                  <div style={{display:'flex', gap:8, marginTop:3, flexWrap:'wrap'}}>
                    {[
                      {l:'Nifty',v:d.nifty?.toLocaleString(),c:d.nifty>24000?C.green:C.red},
                      {l:'Brent',v:'$'+d.brent,c:d.brent>100?C.red:C.amber},
                      {l:'₹',    v:d.rupee?.toFixed(2),c:C.orange},
                    ].map((m,j) => (
                      <span key={j} style={{fontSize:9, color:m.c,
                        fontFamily:MONO, fontWeight:700}}>{m.l}: {m.v}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {!logExpanded && !logSearch && (
              <div style={{fontSize:10, color:C.muted, textAlign:'center',
                marginTop:8, padding:'6px 0', borderTop:`1px solid ${C.border}20`,
                fontFamily:MONO}}>
                {fullTL.length - 6} more days — click FULL ARCHIVE or search above
              </div>
            )}
          </div>
        </S>

        {/* ══ STRATEGIC ASSESSMENT ══ */}
        <S id="assessment" title="🔴 Strategic Assessment" accent={C.red}>
          <div style={{background:C.redDim, border:`1px solid ${C.red}20`,
            borderLeft:`3px solid ${C.red}`, borderRadius:12, padding:'20px 22px'}}>
            <div style={{fontSize:15, fontWeight:800, color:C.red, lineHeight:1.5,
              marginBottom:18, paddingBottom:16, borderBottom:`1px solid ${C.red}18`,
              fontFamily:SYNE}}>
              {iAssess?.headline}
            </div>
            <div className="assess-body" style={{fontSize:13, lineHeight:1.95,
              color:C.sub, fontFamily:SERIF}}>
              {(iAssess?.body||"").split('\n').map((p, i) => {
                if (!p.trim()) return null;
                const isHead   = /^[A-Z][A-Z\s\+]+$/.test(p.trim());
                const isBullet = p.startsWith('•');
                return (
                  <div key={i} style={{marginBottom: isHead?8:isBullet?4:11}}>
                    {isHead
                      ? <div style={{fontSize:9, fontWeight:700, color:C.amber,
                          letterSpacing:3, fontFamily:MONO, marginTop:16, marginBottom:6,
                          paddingTop:12, borderTop:`1px solid ${C.border}`}}>{p}</div>
                      : <span style={{color:isBullet?C.sub:C.text}}>{p}</span>
                    }
                  </div>
                );
              })}
            </div>
            <div style={{background:`${C.amber}0c`, border:`1px solid ${C.amber}25`,
              borderRadius:8, padding:'14px 16px', marginTop:16,
              fontSize:12.5, color:C.sub, lineHeight:1.85, fontFamily:SERIF}}>
              <strong style={{color:C.amber}}>For India, this is an energy emergency.</strong> Qatar = 60%
              of India's natural gas. Ras Laffan 17% capacity GONE for 3–5 years. QatarEnergy force majeure.
              India has ~60 days crude stock, LPG 30+ days (PIB). But long-term costs rising permanently —
              Hormuz now a dual-blockade zone.
              <br/><br/>
              <strong style={{color:C.cyan}}>India must act now:</strong> Emergency gas rationing.
              Non-Gulf LPG acceleration. Rupee defence. Nuclear monitoring. Food supply protection.
              This is India's crisis — not a distant war.
            </div>
          </div>
        </S>

        {/* ══ FOOTER ══ */}
        <footer style={{paddingTop:20, borderTop:`1px solid ${C.border}`, marginTop:8}}>
          <div style={{fontSize:10, color:C.muted, lineHeight:1.9, fontFamily:SERIF}}>
            <strong style={{color:C.sub}}>Sources:</strong>{' '}
            Al Jazeera, CNN, CBS, NBC, ABC, AP, Reuters, Bloomberg, NPR, CNBC, Iran International,
            Times of Israel, ACLED, Atlantic Council, Amnesty Intl, Business Standard, BusinessToday,
            Goodreturns, Trading Economics, Wikipedia, IAEA, HRW, CSIS, IEA, EIA, Kpler, MarineTraffic,
            MUFG, ORF, MEA India, Nomura, Elara, UBS, HSBC, Kotak, SBI Securities, Choice Broking
            <br/><br/>
            <strong style={{color:C.sub}}>Methodology:</strong>{' '}
            Nuclear/contamination scores are analytical estimates — NOT confirmed measurements.
            Projections are trend extrapolations, not forecasts. All timestamps IST (UTC+5:30).
            Hormuz shipping data from Kpler, MarineTraffic, Windward, and news reports.
            <br/><br/>
            <strong style={{color:C.sub}}>Update cadence:</strong>{' '}
            Market data (Brent, Nifty, Sensex, Rupee) auto-syncs twice daily via GitHub Action.
            War intelligence updated manually via{' '}
            <code style={{background:C.surface,padding:'1px 5px',borderRadius:3,
              color:C.amber,fontFamily:MONO,fontSize:9}}>public/war-intel.json</code>.
            <br/><br/>
            <strong style={{color:C.sub}}>Disclaimer:</strong>{' '}
            Built with AI tools. Ongoing project. Not financial, safety, or evacuation advice.
          </div>

          {/* Share */}
          <div style={{display:'flex', gap:8, marginTop:16, alignItems:'center', flexWrap:'wrap'}}>
            <span style={{fontSize:10, color:C.muted, fontWeight:600, fontFamily:MONO}}>Share:</span>
            {[
              {l:'Share on X',   p:'x'},
              {l:'Share on LinkedIn', p:'li'},
              {l:'Share on WhatsApp', p:'wa'},
              {l:'Copy Link',    p:'copy'},
            ].map((s,i) => (
              <button key={i} className="btn-base" onClick={()=>share(s.p)}
                style={{padding:'5px 12px', borderRadius:6, border:`1px solid ${C.border}`,
                  background:C.card, color:C.sub, fontSize:10, fontWeight:700,
                  fontFamily:MONO}}>
                {s.l}
              </button>
            ))}
          </div>

          {/* Bottom nav */}
          <div style={{display:'flex', gap:5, marginTop:14, flexWrap:'wrap'}}>
            {NAV.map(n => (
              <button key={n.id} className="btn-base" onClick={()=>go(n.id)}
                style={{padding:'5px 11px', border:`1px solid ${C.border}`, borderRadius:16,
                  background:'transparent', color:C.muted, fontSize:10,
                  fontWeight:600, fontFamily:MONO}}>
                {n.l}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
