import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════
// INDIA RISK DASHBOARD — V17.0 — EXECUTIVE RESTRUCTURE (Day 135, Jul 13 2026)
// Structural update per project instructions (no redesign):
// 1. NEW: Executive Snapshot (#overview) — Risk Level / Oil / Markets /
//    Shipping / Military / India Impact answered on first screen.
//    Derived from war-intel.json + market-data.json; optional override
//    via intel.exec {level, phase, shipping, military, india} keys.
// 2. REMOVED: Windy weather iframe (obsolete) → replaced with static
//    Atmospheric Transport assessment card. Removed duplicate nuclear
//    site mini-grid (sites already listed below).
// 3. REMOVED: hardcoded Day 102 block in Assessment (stale, duplicated
//    timeline). Removed top 4-metric grid (consolidated into Snapshot).
// 4. NAV: emoji pills → clean text labels; added Overview + Sources.
// 5. Featured Research moved below fold (near Sources).
// 6. Hormuz phase track updated through Jul re-escalation; overridable
//    via intel.hormuzPhases [{label,color,days}].
// All war content continues to load from war-intel.json — daily updates
// require JSON edits only, no code changes.
// V16.8 (Jul 8): re-escalation, tankers hit. V16.7 (Jul 6): ceasefire.
// ═══════════════════════════════════════════════════════════════════

const C = {
  bg:"#080c14",surface:"#0e1420",card:"#121826",raised:"#18202e",
  border:"#1e2a3d",border2:"#253047",text:"#c8d0e0",sub:"#7a8ba8",
  muted:"#3d4f6a",white:"#eef2fa",
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
const TICKER_FB = [];

// TL_BASE removed — timeline now read from intel.timeline in war-intel.json

const RADAR_FB = [];

const NUKES_FB = [
  {name:"Bushehr ☢️",type:"Reactor",status:"ACTIVE WAR ZONE — IAEA WARNED",risk:88,
   info:"IAEA: strikes 250ft from operating reactor. Rosatom evacuated 200 staff minutes before plant was hit. Reactor operational. IAEA cannot access site."},
  {name:"Natanz",type:"Enrichment + HEU",status:"75% DAMAGED — 6,000+ CENTRIFUGES DESTROYED",risk:90,
   info:"Main enrichment 75% damaged. R&D 95% destroyed. Key sticking point in talks — Vance offered 20-yr moratorium, Iran said 3-5 yrs."},
  {name:"Isfahan",type:"PRIMARY HEU STORAGE",status:"PRIMARY HEU LOCATION — 200kg+ HERE",risk:96,
   info:"IAEA: majority of Iran's ~440kg of 60% HEU in deeply buried tunnel complex. US demanded retrieval; Iran agreed only to monitored down-blending."},
  {name:"Fordow",type:"Underground Enrichment",status:"ONLY 30% DAMAGED — GREATEST PROLIFERATION RISK",risk:88,
   info:"Built into mountain near Qom. Only 30% damaged despite GBU-57 MOPs. Core enrichment capability potentially intact. Greatest long-term proliferation risk of the war."},
  {name:"Arak (IR-40)",type:"Heavy Water Reactor",status:"STRUCK — PLUTONIUM PATH CONCERN",risk:75,
   info:"Heavy water reactor capable of producing weapons-grade plutonium. Struck in early war waves. Iran reconstituting missile bases — same pattern expected here."},
];

const CITIES_FB = [
  {city:"Delhi NCR", pop:"32M",wind:72,sea:15,nuke:55,tot:64,
   info:"1,800km downwind from Iran. IAEA: ~1,000 lbs HEU. NO national iodine prophylaxis. TRUMP: deal largely negotiated. Brent $100. Deal = Brent $88-92, Rupee 93.00. Petrol Rs 103.54/L."},
  {city:"Mumbai",    pop:"21M",wind:40,sea:78,nuke:42,tot:58,
   info:"900km from Hormuz. Reliance Jamnagar refinery critical. Trump: largely negotiated. 35 vessels/24hr Iran claim. Sensex 75,415. Brent $100. Monday: Sensex +1,500-2,000 if deal confirmed. OMC stocks massive rally."},
  {city:"Ahmedabad", pop:"8.5M",wind:65,sea:55,nuke:46,tot:57,
   info:"Closest Indian metro to Iran. Jamnagar refinery nearby. Ceramic industry shutting down from gas shortage. Brent $108 still 60% above pre-war."},
  {city:"Jaipur",    pop:"4M", wind:68,sea:10,nuke:44,tot:47,
   info:"Rajasthan wind funnel. Kharif fertiliser at acute risk — 30% of global urea transits Hormuz. Gulf fertiliser at $1M+/ship toll = commercially impossible."},
  {city:"Kochi",     pop:"2.1M",wind:25,sea:70,nuke:24,tot:44,
   info:"Southern Naval Command + Op Urja Suraksha base. 280 Indian seafarers in Gulf zone. Fishing economy ₹4,000 cr exposed. Insurance 10x pre-war."},
  {city:"Goa",       pop:"1.5M",wind:30,sea:72,nuke:22,tot:42,
   info:"Konkan coast. Fishing economy ₹4,000 cr exposed. ATF surcharges active — aviation costs elevated. Tourism sector under pressure."},
  {city:"Lucknow",   pop:"3.5M",wind:58,sea:5, nuke:39,tot:40,
   info:"Indo-Gangetic plain. Most exposed to food inflation from fertiliser disruption. CNG vehicle users facing structural cost rise from Ras Laffan damage."},
  {city:"Chennai",   pop:"11M", wind:20,sea:55,nuke:18,tot:36,
   info:"East coast buffer. IT sector under war pressure — Nifty IT near 30-month lows. Port active for alternative routes. Auto sector (Maruti/Hyundai) under margin pressure."},
];

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
  {id:"scenarios", l:"Scenarios"},
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
  const id = `g${dataKey}${Math.random().toString(36).slice(2,7)}`;
  const step = Math.ceil(filtered.length / 8);
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
            <text x={pad.l-4} y={y+3} fill={C.muted} fontSize="7" textAnchor="end" fontFamily={MONO}>
              {typeof v==='number' && v>999 ? (v/1000).toFixed(1)+'k' : Math.round(v)}
            </text>
          </g>
        );
      })}
      {area && <path d={area} fill={`url(#${id})`}/>}
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (i===0 || i===pts.length-1 || i%step===0) && (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill={C.card} stroke={color} strokeWidth="1.5"/>
          <text x={p.x} y={p.y - 7} fill={color} fontSize="8" textAnchor="middle" fontWeight="700" fontFamily={MONO} opacity="0.9">
            {typeof p.v === 'number' && p.v > 999 ? (p.v/1000).toFixed(1)+'k' : p.v}
          </text>
          <text x={p.x} y={h-2} fill={C.muted} fontSize="7.5" textAnchor="middle" fontFamily={MONO}
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
            fill={C.sub} fontSize="8.5" textAnchor="middle" dominantBaseline="middle"
            fontWeight="600" fontFamily={MONO}>{d.axis}</text>
        );
      })}
      {[{l:'Week 1',c:C.green},{l:`Now (D${day})`,c:C.amber},{l:'Wk 12 Outlook',c:C.red}].map((lg,i)=>(
        <g key={i}>
          <rect x={8} y={H-30+i*10} width={10} height={3} fill={lg.c} rx="1"/>
          <text x={22} y={H-26+i*10} fill={C.sub} fontSize="8" fontFamily={MONO}>{lg.l}</text>
        </g>
      ))}
    </svg>
  );
};

const S = ({id, title, accent=C.amber, sub, children}) => (
  <section id={id} style={{marginBottom:44, scrollMarginTop:58}}>
    <div style={{marginBottom:16, paddingBottom:10, borderBottom:`1px solid ${C.border}`}}>
      <h2 style={{margin:0, fontSize:10, fontWeight:700, color:accent,
        letterSpacing:4, textTransform:'uppercase', fontFamily:MONO}}>{title}</h2>
      {sub && <p style={{margin:'5px 0 0', fontSize:11.5, color:C.sub, fontFamily:SERIF, lineHeight:1.5}}>{sub}</p>}
    </div>
    {children}
  </section>
);

const Chip = ({children, color=C.amber, size=9}) => (
  <span style={{display:'inline-block', padding:'2px 8px', borderRadius:4,
    background:`${color}18`, border:`1px solid ${color}30`,
    color, fontSize:size, fontWeight:700, fontFamily:MONO, letterSpacing:0.8,
    textTransform:'uppercase', whiteSpace:'nowrap'}}>{children}</span>
);

const Mc = ({label, value, sub, delta, accent=C.amber, deltaColor, indiaImpact}) => (
  <div style={{background:C.card, borderRadius:10, padding:'14px 14px',
    border:`1px solid ${C.border}`, borderTop:`2px solid ${accent}`,
    display:'flex', flexDirection:'column', gap:3}}>
    <div style={{fontSize:8.5, color:C.muted, letterSpacing:2.5, textTransform:'uppercase',
      fontWeight:700, fontFamily:MONO}}>{label}</div>
    <div style={{fontSize:24, fontWeight:700, color:accent, fontFamily:SYNE, lineHeight:1.1,
      letterSpacing:-0.5}}>{value}</div>
    {delta && <div style={{fontSize:11, color:deltaColor||C.sub, fontWeight:600, fontFamily:MONO}}>{delta}</div>}
    {sub && <div style={{fontSize:9.5, color:C.muted, lineHeight:1.4}}>{sub}</div>}
    {indiaImpact && (
      <div style={{marginTop:5, paddingTop:5, borderTop:`1px solid ${C.border}`,
        fontSize:9, color:C.amber, fontWeight:600, fontFamily:MONO, letterSpacing:0.3}}>
        🇮🇳 {indiaImpact}
      </div>
    )}
  </div>
);

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
            <div style={{fontSize:7.5,fontWeight:800,color:p.color,fontFamily:MONO,letterSpacing:0.5}}>{p.label}</div>
            <div style={{fontSize:7,color:C.muted,fontFamily:MONO,marginTop:2}}>{p.days}</div>
          </div>
        ))}
      </div>
      {/* Clickable events */}
      <div style={{position:'relative'}}>
        <div style={{position:'absolute',left:48,top:0,bottom:0,width:1,background:C.border}}/>
        {events.slice().reverse().map((e,i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:6,cursor:'pointer'}}
            onClick={()=>setActive(active===i?null:i)}>
            <div style={{flexShrink:0,width:48,textAlign:'right',paddingTop:3}}>
              <span style={{fontSize:9,fontWeight:700,color:C.cyan,fontFamily:MONO}}>{e.d}</span>
            </div>
            <div style={{flexShrink:0,width:10,display:'flex',alignItems:'flex-start',paddingTop:6}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:active===i?C.cyan:C.border2,
                border:`2px solid ${C.cyan}`,flexShrink:0,transition:'background 0.2s'}}/>
            </div>
            <div style={{flex:1,background:active===i?C.raised:C.card,borderRadius:8,
              padding:'8px 12px',border:`1px solid ${active===i?C.cyan+'40':C.border}`,
              transition:'all 0.2s'}}>
              <div style={{fontSize:11,color:active===i?C.white:C.sub,fontFamily:SERIF,lineHeight:1.5}}>
                {active===i ? e.e : e.e.split('.')[0] + (e.e.length > 60 ? '…' : '')}
              </div>
              {active!==i && <div style={{fontSize:8.5,color:C.muted,fontFamily:MONO,marginTop:3}}>Click to expand ▼</div>}
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

  useEffect(() => {
    fetch('./market-data.json?t='+Date.now())
      .then(r=>r.ok?r.json():null).then(d=>d&&setLive(d)).catch(()=>{});
    fetch('./war-intel.json?t='+Date.now())
      .then(r=>r.ok?r.json():null).then(d=>d&&setIntel(d)).catch(()=>{});
  }, []);

  const go = id => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  };

  const iT        = intel?.ticker        ?? TICKER_FB;
  const iDay      = intel?._day          ?? 0;
  const iUpdated  = intel?._updated      ?? "Loading...";
  const iDeaths   = intel?.deaths        ?? "6,700+";
  const iDeathsSub= intel?.deathsSub     ?? "";
  const iWC       = intel?.whatChanged   ?? {label:'Loading intelligence…', items:[]};
  const iEcon     = intel?.econ          ?? null;
  const iTlLatest = intel?.tlLatest      ?? [];
  const iRadar    = intel?.radar         ?? RADAR_FB;
  const iAssess   = intel?.assessment    ?? null;
  const iHLatest  = intel?.hormuzLatest  ?? [];
  const iKitchen  = intel?.kitchen       ?? [];
  const iMilitary = intel?.military      ?? [];
  const iNukes    = intel?.nukes         ?? NUKES_FB;
  const iCities   = intel?.cities        ?? CITIES_FB;
  const iHormuz   = intel?.hormuzStatus  ?? null;
  const iHEvents  = intel?.hormuzEvents  ?? iHLatest;
  const iPhase    = intel?._phase        ?? "BLOCKADE";
  const iScenarios= intel?.scenarios     ?? null;
  const iFeatured = intel?.featured      ?? FEATURED_FB;
  const iMilTop   = intel?.milTop        ?? [];

  // ── Executive snapshot (derived from JSON; overridable via intel.exec) ──
  const iExec    = intel?.exec ?? {};
  const radarNow = k => (intel?.radar ?? []).find(r=>r.axis===k)?.now;
  const riskAvg  = (intel?.radar?.length)
    ? Math.round(intel.radar.reduce((s,r)=>s+(r.now||0),0)/intel.radar.length) : null;
  const riskLevel = iExec.level ??
    (riskAvg==null ? "—" : riskAvg>=75 ? "SEVERE" : riskAvg>=60 ? "HIGH" : riskAvg>=45 ? "ELEVATED" : "MODERATE");
  const riskColor = riskLevel==="SEVERE" ? C.red : riskLevel==="HIGH" ? C.orange
    : riskLevel==="ELEVATED" ? C.amber : C.green;

  const fullTL = [...(intel?.timeline ?? [])]
    .sort((a,b)=>a.d-b.d);

  const brentRaw  = live?.brent?.price     ?? 100;
  const brentChg  = live?.brent?.changePct ?? -4.50;
  const niftyRaw  = live?.nifty?.price     ?? 23719;
  const niftyChg  = live?.nifty?.change    ?? 65;
  const sensexRaw = live?.sensex?.price    ? Math.round(live.sensex.price) : 75415;
  const rupeeRaw  = live?.rupee?.price     ?? 95.50;

  const brentColor = brentRaw > 110 ? C.red : brentRaw > 95 ? C.orange : C.amber;
  const niftyColor = niftyChg >= 0 ? C.green : C.red;
  const isBlockade = iPhase === "BLOCKADE";
  const isEscalation = iPhase === "ESCALATION";

  const scenHeaders = iScenarios?.headers ?? ["Pre-war","Current","Bull Case","Bear Case","Tail Risk"];
  const scenRows = [
    {m:"Brent ($)",  vals: iScenarios?.brent  ?? [65,null,null,null,null]},
    {m:"₹/USD",      vals: iScenarios?.rupee  ?? [91,null,null,null,null]},
    {m:"Deaths",     vals: iScenarios?.deaths ?? [0,"6,800+","7,500","11,000+","30,000+"]},
    {m:"Sensex",     vals: iScenarios?.sensex ?? ["78,699",null,null,null,null]},
    {m:"LPG",        vals: iScenarios?.lpg    ?? ["₹853",null,null,null,null]},
    {m:"FII",        vals: iScenarios?.fii    ?? ["-",null,null,null,null]},
  ];

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
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,fontFamily:SERIF,fontSize:13.5,maxWidth:1100,margin:'0 auto'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&display=swap');
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
          .hdr-inner { flex-direction:row !important; align-items:flex-start !important; }
          .hdr-h1 { font-size:32px !important; }
        }
        @media(max-width:767px){
          .grid2,.grid3,.grid4 { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      {/* ══ TICKER ══ */}
      <div style={{background:`linear-gradient(90deg,#7f1d1d,${C.red},#b91c1c)`,
        padding:'7px 0',overflow:'hidden',width:'100%',position:'relative'}}>
        <div style={{display:'flex',width:'max-content',flexWrap:'nowrap',
          animation:'ticker 150s linear infinite',
          WebkitAnimation:'ticker 150s linear infinite',willChange:'transform'}}>
          {[...iT,...iT,...iT].map((t,i) => (
            <span key={i} style={{fontSize:11.5,fontWeight:600,color:'#fff',
              letterSpacing:0.2,paddingRight:56,whiteSpace:'nowrap',flexShrink:0,
              display:'inline-block',fontFamily:MONO}}>
              {t}<span style={{paddingLeft:56,color:'#ffffff40'}}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ HEADER ══ */}
      <header style={{padding:'20px 20px 14px',borderBottom:`1px solid ${C.border}`,background:C.surface}}>
        <div className="hdr-inner" style={{display:'flex',flexDirection:'column',gap:14}}>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <div style={{fontSize:8,fontWeight:700,color:C.muted,letterSpacing:5,
                textTransform:'uppercase',fontFamily:MONO}}>India Risk Assessment</div>
              <div style={{height:1,flex:1,background:C.border}}/>
              <div style={{display:'flex',gap:5}}>
                {[{l:'𝕏',p:'x'},{l:'in',p:'li'},{l:'wa',p:'wa'},{l:'📋',p:'copy'}].map((s,i)=>(
                  <button key={i} onClick={()=>share(s.p)} className="btn-base"
                    style={{padding:'3px 7px',borderRadius:4,border:`1px solid ${C.border}`,
                      background:C.card,color:C.sub,fontSize:9,fontWeight:700,fontFamily:MONO}}>
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
            <h1 className="hdr-h1" style={{margin:0,fontSize:24,fontWeight:800,color:C.white,
              fontFamily:SYNE,lineHeight:1.1,letterSpacing:-0.5}}>
              How the West Asia War<br/>Is Hitting India
            </h1>
            <div style={{marginTop:7,fontSize:11,color:C.sub,fontFamily:MONO}}>
              {iUpdated} &nbsp;•&nbsp; 50+ verified sources
            </div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'flex-start',flexWrap:'wrap'}}>
            <div style={{background:C.amber,color:C.bg,fontSize:17,fontWeight:800,
              padding:'10px 20px',borderRadius:8,fontFamily:SYNE,letterSpacing:-0.3,
              boxShadow:`0 4px 20px ${C.amber}40`}}>DAY {iDay}</div>
            <div style={{fontSize:9,color:isEscalation?C.red:isBlockade?C.orange:C.green,
              padding:'5px 10px',border:`1px solid ${isEscalation?C.red:isBlockade?C.orange:C.green}40`,
              borderRadius:6,background:(isEscalation?C.red:isBlockade?C.orange:C.green)+'0c',
              fontWeight:700,fontFamily:MONO,
              animation:(isEscalation||isBlockade)?'pulse 1.8s infinite':undefined}}>
              {isEscalation?"🔴 ESCALATION — TANKERS HIT · US STRIKES IRAN":isBlockade?"⚠ HORMUZ RE-CLOSED (CONTESTED)":"● CEASEFIRE HOLDING — DOHA TALKS"}
            </div>
          </div>
        </div>
        <button className="btn-base" onClick={()=>setAboutOpen(!aboutOpen)}
          style={{marginTop:12,fontSize:10,color:C.sub,fontFamily:MONO,
            background:'none',padding:'4px 0',display:'flex',alignItems:'center',gap:5}}>
          {aboutOpen?"▲":"▼"} {aboutOpen?"Hide":"What is this tracker?"}
        </button>
        {aboutOpen && (
          <div style={{marginTop:10,padding:'14px 16px',background:C.card,
            borderRadius:8,border:`1px solid ${C.border}`,fontSize:12.5,
            color:C.sub,fontFamily:SERIF,lineHeight:1.9,animation:'fadein 0.25s ease both'}}>
            <strong style={{color:C.white,fontFamily:SYNE}}>India's war tracker — not a global one.</strong>
            {' '}This dashboard focuses exclusively on what the Iran-Gulf War means for India's 1.4 billion people:
            energy prices, food security, financial markets, nuclear exposure, and Indian seafarers in the Gulf.
            We track Hormuz because <strong style={{color:C.amber}}>85% of India's crude oil</strong> transits that
            39km chokepoint. Market data auto-syncs every 4 hours. War intelligence updated manually from 50+ verified sources.
          </div>
        )}
      </header>

      {/* ══ NAV ══ */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:C.bg+'f2',
        backdropFilter:'blur(20px)',borderBottom:`1px solid ${C.border}`,padding:'7px 14px'}}>
        <div style={{display:'flex',gap:4,overflowX:'auto',scrollbarWidth:'none'}}>
          {NAV.map(n=>(
            <button key={n.id} className="nav-pill btn-base" onClick={()=>go(n.id)}
              style={{flex:'0 0 auto',padding:'5px 12px',
                border:activeNav===n.id?`1px solid ${C.amber}60`:`1px solid ${C.border}`,
                borderRadius:20,background:activeNav===n.id?C.amberDim:'transparent',
                color:activeNav===n.id?C.amber:C.sub,fontSize:10.5,fontWeight:600,
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
              sub={`Composite ${riskAvg ?? "—"}/100 · Day ${iDay}`}/>
            <Mc label="Oil — Brent" value={`$${brentRaw}`}
              delta={(brentChg>0?"▲ +":"▼ ")+Math.abs(brentChg).toFixed(1)+"%"}
              deltaColor={brentChg>0?C.red:C.green} accent={brentColor}
              sub={iExec.oilNote ?? "85% of India's crude transits Hormuz"}/>
            <Mc label="Markets — Nifty 50"
              value={typeof niftyRaw==='number'?Math.round(niftyRaw).toLocaleString():niftyRaw}
              delta={(niftyChg>=0?"▲ +":"▼ ")+Math.abs(niftyChg).toLocaleString()}
              deltaColor={niftyColor} accent={niftyChg>=0?C.green:C.red}
              sub={`Sensex ${typeof sensexRaw==='number'?sensexRaw.toLocaleString():sensexRaw} · auto-synced 4h`}/>
            <Mc label="Shipping — Hormuz" value={iExec.shipping ?? "DISRUPTED"} accent={C.cyan}
              sub={iExec.shippingSub ?? `Pre-war ${iHormuz?.preWarFlow||"130-160 ships/day"} · ${iHormuz?.indianSeafarers??"—"} Indian seafarers in Gulf`}/>
            <Mc label="Military" value={iExec.military ?? `${radarNow('Mil. Exposure') ?? "—"}/100`} accent={C.red}
              delta={`Exposure ${radarNow('Mil. Exposure') ?? "—"}/100`} deltaColor={C.red}
              sub={iExec.militarySub ?? `War dead ${iDeaths}`}/>
            <Mc label="India Impact" value={`₹${typeof rupeeRaw==='number'?rupeeRaw.toFixed(2):rupeeRaw}`} accent={C.orange}
              delta="₹ / USD" deltaColor={C.orange}
              sub={iExec.indiaSub ?? `Household pressure ${radarNow('Household') ?? "—"}/100 · was ₹91.49 pre-war`}/>
          </div>
        </section>

        {/* ══ WHAT CHANGED — expandable ══ */}
        <div style={{background:C.redDim,border:`1px solid ${C.red}22`,
            borderLeft:`3px solid ${C.red}`,borderRadius:10,padding:'14px 16px',marginBottom:26}}>
            <div style={{fontSize:9,fontWeight:700,color:C.red,letterSpacing:4,
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
                    <span style={{color:col,fontWeight:900,flexShrink:0,fontSize:12,marginTop:1}}>▸</span>
                    <span style={{flex:1}}>
                      <strong style={{fontSize:12.5,color:col,fontWeight:700,fontFamily:SYNE,lineHeight:1.4}}>
                        {item.bold}
                      </strong>
                    </span>
                    <span style={{fontSize:9,color:C.muted,fontFamily:MONO,flexShrink:0,marginTop:3}}>
                      {isOpen?'▲':'▼'}
                    </span>
                  </button>
                  {isOpen && item.text && (
                    <div style={{fontSize:11.5,color:C.sub,lineHeight:1.75,fontFamily:SERIF,
                      paddingLeft:20,paddingTop:6,animation:'fadein 0.2s ease both'}}>
                      {item.text.split('. ').slice(0,3).join('. ')+'...'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        {/* ══ HORMUZ ══ */}
        <S id="hormuz" title="Maritime — Hormuz, India's Energy Lifeline" accent={C.cyan}
          sub="85% of India's crude oil transits this 39km chokepoint. What happens here lands at your pump.">

          {iHormuz?.headline && (
            <div style={{background:`linear-gradient(90deg,${C.red}18,${C.card})`,
              border:`1px solid ${C.red}40`,borderLeft:`3px solid ${C.red}`,
              borderRadius:8,padding:'10px 14px',marginBottom:12,
              display:'flex',alignItems:'flex-start',gap:10}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:C.red,
                animation:'pulse 1.5s infinite',flexShrink:0,marginTop:4}}/>
              <div style={{fontSize:12,fontWeight:700,color:C.red,fontFamily:SYNE,lineHeight:1.4}}>
                {iHormuz.headline}
              </div>
            </div>
          )}

          {/* Status + traffic — consistent font sizes */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
            <div style={{background:((isBlockade||isEscalation)?C.red:C.green)+'10',borderRadius:10,
              padding:12,textAlign:'center',border:`1px solid ${((isBlockade||isEscalation)?C.red:C.green)}25`}}>
              <div style={{fontSize:9,color:(isBlockade||isEscalation)?C.red:C.green,fontWeight:700,
                letterSpacing:2,fontFamily:MONO,marginBottom:5}}>STATUS</div>
              <div style={{fontSize:11.5,fontWeight:700,color:(isBlockade||isEscalation)?C.red:C.green,
                fontFamily:SYNE,lineHeight:1.3}}>{iHormuz?.status||"BLOCKADE ACTIVE"}</div>
            </div>
            <div style={{background:C.card,borderRadius:10,padding:12,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:9,color:C.muted,fontWeight:700,letterSpacing:2,
                fontFamily:MONO,marginBottom:5}}>SHIP TRAFFIC</div>
              <div style={{fontSize:11.5,fontWeight:700,color:C.orange,fontFamily:MONO,lineHeight:1.3}}>
                {iHormuz?.currentFlow||"Near-zero commercial transit"}
              </div>
              <div style={{fontSize:9,color:C.muted,marginTop:3}}>
                Pre-war: {iHormuz?.preWarFlow||"130-160 ships/day"}
              </div>
            </div>
          </div>

          {/* India stats — consistent sizing, with casualty alert */}
          {(iHormuz?.indianCasualties ?? 0) > 0 && (
            <div style={{background:`${C.red}14`,borderRadius:10,padding:'12px 14px',
              border:`1px solid ${C.red}50`,marginBottom:10,
              animation:'pulse 2.5s infinite'}}>
              <div style={{fontSize:9,color:C.red,fontWeight:700,letterSpacing:2.5,
                fontFamily:MONO,marginBottom:6}}>🇮🇳 INDIAN CASUALTIES — BLOCKADE ENFORCEMENT</div>
              <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:6}}>
                <div style={{fontSize:32,fontWeight:800,color:C.red,fontFamily:SYNE,lineHeight:1}}>
                  {iHormuz.indianCasualties}
                </div>
                <div style={{fontSize:11,color:C.red,fontWeight:700,fontFamily:MONO}}>
                  Indian sailors killed
                </div>
              </div>
              <div style={{fontSize:10,color:C.sub,lineHeight:1.5}}>
                {iHormuz?.indianCasualtyDetail || "Details pending."}
              </div>
            </div>
          )}

          <div style={{background:C.amberDim,borderRadius:10,padding:'12px 14px',
            border:`1px solid ${C.amber}25`,marginBottom:10}}>
            <div style={{fontSize:9,color:C.amber,fontWeight:700,letterSpacing:2.5,
              fontFamily:MONO,marginBottom:10}}>🇮🇳 INDIA'S HORMUZ EXPOSURE</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
              {[
                {l:"Ships in Gulf", v:iHormuz?.indianVesselsNear??8, sub:(iHormuz?.indianSeafarers??280)+" seafarers on Indian-flagged vessels"},
                {l:"Crossed Safely",v:iHormuz?.indianTransited??0,  sub:iHormuz?.totalShipsWaiting||"Status pending"},
                {l:"Navy Escort",   v:"ACTIVE", sub:"Op Urja Suraksha", isText:true},
              ].map((s,i)=>(
                <div key={i} style={{textAlign:'center'}}>
                  <div style={{fontSize:9,color:C.amber,fontWeight:700,letterSpacing:1,
                    fontFamily:MONO,marginBottom:4}}>{s.l}</div>
                  <div style={{fontSize:s.isText?13:22,fontWeight:700,color:C.amber,
                    fontFamily:SYNE,lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:9,color:C.sub,marginTop:3,lineHeight:1.3}}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive timeline */}
          <div style={{background:C.card,borderRadius:10,padding:14,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:9,fontWeight:700,color:C.cyan,letterSpacing:2.5,
              fontFamily:MONO,marginBottom:12}}>TIMELINE — CLICK TO EXPAND</div>
            <HormuzTimeline events={iHEvents.length ? iHEvents : iHLatest} phaseData={intel?.hormuzPhases}/>
            <div style={{fontSize:9,color:C.muted,marginTop:10,paddingTop:8,
              borderTop:`1px solid ${C.border}20`,fontFamily:MONO}}>
              🇮🇳 Latest: {iHormuz?.lastTransit||"Status pending"}
            </div>
          </div>
        </S>

        {/* ══ KITCHEN TABLE — moved up ══ */}
        <S id="kitchen" title="Household — Your Kitchen Table" accent={C.amber}
          sub="8+ weeks of war — what it costs Indian households today.">
          {(iKitchen.length ? iKitchen : [
            {item:"LPG Cylinder (14.2kg)",status:"orange",statusText:"Brent $108 — hike risk",pre:"₹853",now:"₹912.50",twoWeek:"₹912-960 if blockade holds",detail:"30+ days buffer. No dry-outs. Gulf fertiliser imports at $1M+/ship toll now commercially impossible."},
            {item:"Petrol (Delhi)",status:"red",statusText:"HIKED TO Rs 103.54 — OMC LOSSES Rs 18/L. BRENT $100 — DEAL MAY EASE FURTHER",pre:"₹94.72/L",now:"₹103.54/L (HIKED May 13)",twoWeek:"Deal confirmed + Brent $88-92 = OMC losses eliminated on petrol. Possible price reversal.",detail:"OMC losses Rs 30,000 Cr/month. Modi Hyderabad speech May 10: use with great restraint. Hike before May 15. Every Rs 1/L = Rs 12,000 Cr annual consumer burden."},
            {item:"Diesel (Delhi)",status:"yellow",statusText:"Trucking cost pressure",pre:"₹87.62/L",now:"₹87.67/L",twoWeek:"₹2-4/L hike risk",detail:"Every ₹1 diesel rise = ₹2,500 Cr annual trucking cost. Food and goods inflation building."},
            {item:"Kharif Fertiliser",status:"red",statusText:"ACUTE RISK — June planting",pre:"Normal",now:"Emergency",twoWeek:"Shortfall if Hormuz closed through May",detail:"Gulf produces 30% of global urea. $1M+/ship Hormuz toll makes imports commercially impossible. June-August planting at risk."},
          ]).map((h,i)=>{
            const sCol = (h.status||h.s)==='red'?C.red:(h.status||h.s)==='orange'?C.orange:C.green;
            const statusTxt = h.statusText || h.chg || '';
            return (
              <div key={i} className="card-lift"
                style={{background:C.card,borderRadius:10,padding:'12px 14px',
                  marginBottom:6,borderLeft:`3px solid ${sCol}`,
                  border:`1px solid ${C.border}`,transition:'all 0.15s'}}>
                <div style={{display:'flex',justifyContent:'space-between',
                  alignItems:'flex-start',gap:8,flexWrap:'wrap',marginBottom:6}}>
                  <span style={{fontSize:13,fontWeight:700,color:C.white,fontFamily:SYNE}}>
                    {h.item}
                  </span>
                  <span style={{fontSize:10,fontWeight:700,color:sCol,fontFamily:MONO,flexShrink:0}}>
                    {statusTxt}
                  </span>
                </div>
                <div style={{display:'flex',gap:16,fontSize:11,fontFamily:MONO,flexWrap:'wrap'}}>
                  <span style={{color:C.muted}}>Pre: <strong style={{color:C.sub}}>{h.pre}</strong></span>
                  <span style={{color:C.muted}}>Now: <strong style={{color:C.amber}}>{h.now}</strong></span>
                  <span style={{color:C.muted}}>2wk: <strong style={{color:(h.status||h.s)==='red'?C.red:C.green}}>{h.twoWeek||h.proj}</strong></span>
                </div>
                {(h.detail||h.note) && (
                  <div style={{fontSize:11,color:C.sub,marginTop:7,lineHeight:1.65,
                    borderTop:`1px solid ${C.border}40`,paddingTop:7,fontFamily:SERIF}}>
                    {h.detail||h.note}
                  </div>
                )}
              </div>
            );
          })}
        </S>

        {/* ══ ECONOMY ══ */}
        <S id="economic" title="Markets — Economic Impact on India" accent={C.orange}>
          {/* Key metrics row */}
          <div className="grid4" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
            <Mc label="BSE Market Cap" value={iEcon?.wealth||"—"} accent={C.orange}/>
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
              <div style={{fontSize:9,fontWeight:700,color:C.cyan,letterSpacing:2.5,fontFamily:MONO}}>
                NIFTY 50 — ALL {fullTL.length} WAR DAYS
              </div>
              <Chip color={C.cyan} size={8}>LIVE</Chip>
            </div>
            <MiniLine data={fullTL} dataKey="nifty" color={C.cyan} h={120}/>
          </div>

          <div style={{background:C.card,borderRadius:10,padding:'14px 14px 10px',
            marginBottom:10,border:`1px solid ${C.border}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <div style={{fontSize:9,fontWeight:700,color:C.orange,letterSpacing:2.5,fontFamily:MONO}}>
                BRENT CRUDE ($) — ALL WAR DAYS
              </div>
              <span style={{fontSize:9,color:C.sub,fontFamily:MONO}}>Currently ~${brentRaw}</span>
            </div>
            <MiniLine data={fullTL} dataKey="brent" color={C.orange} h={120}/>
          </div>

          {/* Market analysis — crisp */}
          {iEcon?.analysis && (
            <div style={{background:C.card,borderRadius:10,padding:'12px 14px',
              border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.orange}`}}>
              <div style={{fontSize:9,fontWeight:700,color:C.orange,letterSpacing:2.5,
                fontFamily:MONO,marginBottom:6}}>📊 MARKET ANALYSIS</div>
              <div style={{fontSize:12,color:C.sub,lineHeight:1.7,fontFamily:SERIF}}>
                {iEcon.analysis.split('. ').slice(0,4).join('. ') + '.'}
              </div>
            </div>
          )}
        </S>

        {/* ══ MILITARY — crisp ══ */}
        <S id="military" title="Military & Strategic Updates" accent={C.red}>
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
                  <span style={{fontSize:13,fontWeight:700,color:C.white,
                    fontFamily:SYNE,flex:1,lineHeight:1.3}}>{m.t}</span>
                  <Chip color={isBreaking?C.red:C.sub} size={8}>{m.lv}</Chip>
                </div>
                {/* Show only first 2 sentences */}
                <div style={{fontSize:11.5,color:C.sub,lineHeight:1.7,fontFamily:SERIF}}>
                  {(m.d||'').split('. ').slice(0,2).join('. ') + (m.d?.split('. ').length > 2 ? '.' : '')}
                </div>
              </div>
            );
          })}
        </S>

        {/* ══ NUCLEAR ══ */}
        <S id="nuclear" title="Nuclear Exposure" accent={C.purple}>
          <div style={{background:C.purpleDim,border:`1px solid ${C.purple}30`,
            borderLeft:`3px solid ${C.purple}`,borderRadius:10,padding:'13px 15px',marginBottom:14}}>
            <div style={{fontSize:9,fontWeight:700,color:C.purple,letterSpacing:2.5,
              fontFamily:MONO,marginBottom:7}}>🇮🇳 INDIA NUCLEAR RISK HEADLINE</div>
            <div style={{fontSize:12,color:C.sub,lineHeight:1.75,fontFamily:SERIF}}>
              <strong style={{color:C.purple}}>Bushehr — a working reactor — has been struck.</strong>{' '}
              IAEA: strikes 250ft from the operating reactor. Iran holds ~460kg of 60% enriched uranium
              — enough material for approximately 11 nuclear weapons (IAEA).
              Delhi is 4–7 days downwind at 500 hPa. India has{' '}
              <strong style={{color:C.red}}>NO national iodine prophylaxis program.</strong>
            </div>
          </div>

          <div style={{background:C.card,borderRadius:12,padding:'13px 15px',
            marginBottom:14,border:`1px solid ${C.purple}25`}}>
            <div style={{fontSize:9,fontWeight:700,color:C.purple,letterSpacing:2.5,
              fontFamily:MONO,marginBottom:8}}>ATMOSPHERIC TRANSPORT — ASSESSMENT</div>
            <div style={{fontSize:11.5,color:C.sub,lineHeight:1.75,fontFamily:SERIF}}>
              <div style={{marginBottom:4}}>• <strong style={{color:C.text}}>Key insight:</strong> Prevailing westerlies at 500 hPa place NW India 4–7 days downwind of Iranian nuclear sites.</div>
              <div style={{marginBottom:4}}>• <strong style={{color:C.text}}>Watchlist:</strong> Bushehr reactor integrity; Isfahan HEU tunnel complex; IAEA site access.</div>
              <div>• <strong style={{color:C.text}}>Confidence:</strong> Analytical estimate — no radiological release confirmed to date. Fallout modelling: <a href="https://www.ready.noaa.gov/HYSPLIT.php" target="_blank"
                rel="noopener noreferrer" style={{color:C.cyan}}>NOAA HYSPLIT</a>.</div>
            </div>
          </div>

          <div style={{fontSize:9,fontWeight:700,color:C.purple,marginBottom:8,
            letterSpacing:2.5,fontFamily:MONO}}>IRANIAN NUCLEAR SITES — STATUS</div>
          {iNukes.map((n,i)=>{
            const rCol = n.risk>85?C.red:n.risk>70?C.orange:C.amber;
            return (
              <div key={i} onClick={()=>setExpNuke(expNuke===i?null:i)}
                style={{background:C.card,borderRadius:10,padding:'11px 13px',
                  marginBottom:5,cursor:'pointer',border:`1px solid ${rCol}18`,transition:'all 0.15s'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                  <div style={{flex:1}}>
                    <span style={{fontSize:13,fontWeight:700,color:rCol,fontFamily:SYNE}}>{n.name}</span>
                    <span style={{fontSize:9,color:C.muted,marginLeft:8,fontFamily:MONO}}>{n.type}</span>
                  </div>
                  <Chip color={(n.status||'').match(/HIT|DAMAGED|STRUCK|WAR ZONE/)?C.red:C.orange} size={8}>
                    {n.status||n.st}
                  </Chip>
                </div>
                <Bar value={n.risk} color={rCol} h={4}/>
                <div style={{fontSize:9,color:C.muted,marginTop:3,
                  display:'flex',justifyContent:'space-between',fontFamily:MONO}}>
                  <span style={{color:rCol,fontWeight:700}}>{n.risk}/100 risk</span>
                  <span>{expNuke===i?"▲ collapse":"▼ expand"}</span>
                </div>
                {expNuke===i && (
                  <div style={{fontSize:11.5,color:C.sub,marginTop:8,lineHeight:1.75,
                    borderTop:`1px solid ${C.border}`,paddingTop:8,fontFamily:SERIF,
                    animation:'fadein 0.2s ease both'}}>{n.info}</div>
                )}
              </div>
            );
          })}

          <div style={{marginTop:20}}>
            <div style={{fontSize:9,fontWeight:700,color:C.amber,letterSpacing:2.5,
              fontFamily:MONO,marginBottom:5}}>🇮🇳 INDIAN CITY EXPOSURE</div>
            <div style={{fontSize:11,color:C.sub,marginBottom:10,fontFamily:SERIF,lineHeight:1.5}}>
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
                        <span style={{fontSize:13.5,fontWeight:700,color:C.white,fontFamily:SYNE}}>{c.city}</span>
                        <span style={{fontSize:10,color:C.muted,marginLeft:8,fontFamily:MONO}}>Pop: {c.pop}</span>
                      </div>
                      <div>
                        <span style={{fontSize:22,fontWeight:800,color:totCol,fontFamily:SYNE}}>{c.tot}</span>
                        <span style={{fontSize:10,color:C.muted}}>/100</span>
                      </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginBottom:8}}>
                      {[{l:"Wind",v:c.wind,cl:C.orange},{l:"Sea",v:c.sea,cl:C.cyan},{l:"Nuclear",v:c.nuke,cl:C.purple}].map((vv,j)=>(
                        <div key={j}>
                          <div style={{fontSize:9,color:vv.cl,fontWeight:700,marginBottom:2,fontFamily:MONO}}>{vv.l}: {vv.v}/100</div>
                          <Bar value={vv.v} color={vv.cl} h={4}/>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:11.5,color:C.sub,lineHeight:1.65,fontFamily:SERIF}}>{c.info}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </S>

        {/* ══ SCENARIOS ══ */}
        <S id="scenarios" title="Scenarios" accent={C.cyan}
          sub="Three paths for the West Asia War. One matters most for India.">
          <div className="grid3" style={{display:'grid',gridTemplateColumns:'1fr',gap:10,marginBottom:14}}>
            {[
              {label:"🟢 NUCLEAR DEAL + HORMUZ REOPENS",prob:"~30%",color:C.green,
               brent:"$78-85",sensex:"85,000+",rupee:"₹90-91",lpg:"₹853",
               desc:"Iran accepts nuclear deal + Hormuz opens. Mine clearing takes 4-6 months. Brent normalises gradually."},
              {label:"🟡 EXTENDED BLOCKADE + TOLL SYSTEM",prob:"~45%",color:C.amber,
               brent:"$100-115",sensex:"72,000-77,000",rupee:"₹95-98",lpg:"₹960+",
               desc:"Stalemate continues. Iran's Hormuz toll system formalised. India pays per-ship fees. Structural tightness through 2026."},
              {label:"🔴 CENTCOM STRIKES RESUME",prob:"~25%",color:C.red,
               brent:"$140-155",sensex:"52,000-60,000",rupee:"₹100-108",lpg:"₹1,800+",
               desc:"'Short and powerful' strikes approved. Iran retaliates on US bases. Nuclear sites targeted. Full war escalation."},
            ].map((sc,i)=>(
              <div key={i} className="card-lift"
                style={{background:C.card,borderRadius:12,padding:'14px 16px',
                  border:`1px solid ${sc.color}30`,borderTop:`3px solid ${sc.color}`,
                  transition:'all 0.18s'}}>
                <div style={{display:'flex',justifyContent:'space-between',
                  alignItems:'flex-start',marginBottom:8,flexWrap:'wrap',gap:6}}>
                  <div style={{fontSize:12,fontWeight:700,color:sc.color,fontFamily:SYNE,lineHeight:1.2}}>{sc.label}</div>
                  <div style={{padding:'3px 10px',borderRadius:20,background:`${sc.color}20`,
                    color:sc.color,fontSize:10,fontWeight:700,fontFamily:MONO}}>{sc.prob}</div>
                </div>
                <div style={{fontSize:11,color:C.sub,fontFamily:SERIF,lineHeight:1.6,marginBottom:10}}>{sc.desc}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>
                  {[["Brent",sc.brent],["Sensex",sc.sensex],["Rupee",sc.rupee],["LPG",sc.lpg]].map(([k,v])=>(
                    <div key={k} style={{background:C.surface,borderRadius:6,padding:'5px 8px'}}>
                      <div style={{fontSize:8.5,color:C.muted,fontFamily:MONO,fontWeight:700}}>{k}</div>
                      <div style={{fontSize:11,color:sc.color,fontWeight:700,fontFamily:MONO,marginTop:1}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{background:C.card,borderRadius:10,padding:12,overflowX:'auto',border:`1px solid ${C.border}`}}>
            <div style={{fontSize:9,fontWeight:700,color:C.sub,letterSpacing:2.5,fontFamily:MONO,marginBottom:8}}>
              FULL SCENARIO TABLE
            </div>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:10.5,minWidth:320,fontFamily:MONO}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.border}`}}>
                  <th style={{padding:'5px 6px',textAlign:'left',color:C.muted,fontWeight:700,fontSize:9}}>Metric</th>
                  {scenHeaders.map((h,i)=>(
                    <th key={i} style={{padding:'5px 4px',textAlign:'right',fontSize:9,
                      color:i===0?C.green:i===1?C.amber:i===2?C.green:C.red,fontWeight:700}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scenRows.map((r,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${C.border}20`}}>
                    <td style={{padding:'5px 6px',fontWeight:600,color:C.text,fontSize:10}}>{r.m}</td>
                    {(r.vals||[]).map((v,j)=>(
                      <td key={j} style={{padding:'5px 4px',textAlign:'right',
                        color:j===0?C.green:j===1?C.amber:j===2?C.green:C.red,fontWeight:600}}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </S>

        {/* ══ RADAR ══ */}
        <S id="radar" title="Risk Radar" accent={C.amber}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div style={{background:C.card,borderRadius:10,padding:12,border:`1px solid ${C.border}`}}>
              <RadarSVG data={iRadar} day={iDay}/>
            </div>
            <div style={{background:C.card,borderRadius:10,padding:'12px 12px',border:`1px solid ${C.border}`}}>
              <div style={{fontSize:9,fontWeight:700,color:C.amber,letterSpacing:2.5,
                fontFamily:MONO,marginBottom:10}}>CURRENT SCORES</div>
              {iRadar.map((r,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:8,
                  padding:'5px 0',borderBottom:`1px solid ${C.border}20`}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:9.5,color:C.sub,fontFamily:MONO,fontWeight:600,marginBottom:2}}>{r.axis}</div>
                    <Bar value={r.now} color={r.now>70?C.red:r.now>50?C.orange:C.amber} h={5}/>
                  </div>
                  <span style={{fontSize:14,fontWeight:800,
                    color:r.now>70?C.red:r.now>50?C.orange:C.amber,
                    fontFamily:SYNE,flexShrink:0,minWidth:28,textAlign:'right'}}>{r.now}</span>
                </div>
              ))}
            </div>
          </div>
        </S>

        {/* ══ WAR LOG ══ */}
        <S id="warlog" title="Archive — War Log, All Days" accent={C.sub}>
          <div style={{background:C.card,borderRadius:10,padding:12,border:`1px solid ${C.border}`}}>
            <div style={{display:'flex',justifyContent:'space-between',
              alignItems:'center',marginBottom:10,flexWrap:'wrap',gap:8}}>
              <button className="btn-base" onClick={()=>setLogExpanded(!logExpanded)}
                style={{fontSize:9,color:C.cyan,background:C.cyanDim,
                  border:`1px solid ${C.cyan}30`,borderRadius:4,padding:'4px 12px',
                  fontWeight:700,fontFamily:MONO}}>
                {logExpanded?"COLLAPSE ▲":"FULL ARCHIVE ▼"}
              </button>
              <input placeholder="Search war log..."
                value={logSearch} onChange={e=>setLogSearch(e.target.value)}
                style={{padding:'5px 10px',borderRadius:6,border:`1px solid ${C.border}`,
                  background:C.surface,color:C.text,fontSize:10.5,fontFamily:MONO,
                  outline:'none',minWidth:140,flex:1,maxWidth:220}}/>
            </div>
            {(logExpanded || logSearch ? filteredTL : filteredTL.slice(0,6)).map((d,i)=>(
              <div key={i} style={{padding:'7px 0',borderBottom:`1px solid ${C.border}18`,
                display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{minWidth:42,flexShrink:0}}>
                  <div style={{fontSize:10,fontWeight:800,
                    color:d.sev===3?C.red:d.sev===2?C.orange:C.green,fontFamily:MONO}}>D{d.d}</div>
                  <div style={{fontSize:8.5,color:C.muted,fontFamily:MONO}}>{d.l}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11.5,color:C.sub,lineHeight:1.5,fontFamily:SERIF}}>{d.tag}</div>
                  <div style={{display:'flex',gap:8,marginTop:3,flexWrap:'wrap'}}>
                    {[
                      {l:'Nifty',v:d.nifty?.toLocaleString(),c:d.nifty>24000?C.green:C.red},
                      {l:'Brent',v:'$'+d.brent,c:d.brent>100?C.red:C.amber},
                      {l:'₹',    v:d.rupee?.toFixed(2),c:C.orange},
                    ].map((m,j)=>(
                      <span key={j} style={{fontSize:9,color:m.c,fontFamily:MONO,fontWeight:700}}>{m.l}: {m.v}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {!logExpanded && !logSearch && (
              <div style={{fontSize:10,color:C.muted,textAlign:'center',
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
              <div style={{fontSize:15,fontWeight:800,color:C.red,lineHeight:1.5,
                marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${C.red}18`,
                fontFamily:SYNE}}>
                {iAssess.headline}
              </div>
            )}
            <div style={{fontSize:13,lineHeight:1.9,color:C.sub,fontFamily:SERIF}}>
              {(iAssess?.body||"").split('\n').map((p,i)=>{
                if (!p.trim()) return null;
                const isHead   = /^[A-Z][A-Z\s\+\-\']+$/.test(p.trim()) && p.trim().length < 60;
                const isBullet = p.startsWith('•');
                return (
                  <div key={i} style={{marginBottom:isHead?6:isBullet?4:10}}>
                    {isHead
                      ? <div style={{fontSize:9,fontWeight:700,color:C.amber,
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
            <div style={{fontSize:8,fontWeight:700,color:C.amber,letterSpacing:3.5,
              textTransform:'uppercase',fontFamily:MONO}}>Featured Research</div>
            <div style={{height:1,flex:1,background:`linear-gradient(90deg,${C.amber}30,transparent)`}}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            {(iFeatured.length ? iFeatured : FEATURED_FB).map((pub,i)=>(
              <a key={i} href={pub.url} target="_blank" rel="noopener noreferrer"
                style={{display:'flex',alignItems:'center',gap:10,background:C.card,
                  border:`1px solid ${C.border}`,borderLeft:`2px solid ${pub.tagColor||C.amber}`,
                  borderRadius:6,padding:'8px 12px',textDecoration:'none',transition:'all 0.15s'}}>
                <span style={{fontSize:14,flexShrink:0}}>{pub.icon||'📄'}</span>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{fontSize:11,fontWeight:700,color:C.white,fontFamily:SYNE}}>{pub.title}</span>
                  <span style={{fontSize:9,color:C.muted,fontFamily:MONO,marginLeft:8}}>{pub.org}</span>
                </div>
                <span style={{fontSize:9,color:pub.tagColor||C.amber,fontFamily:MONO,fontWeight:700,flexShrink:0}}>Read →</span>
              </a>
            ))}
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer id="sources" style={{scrollMarginTop:58,paddingTop:20,borderTop:`1px solid ${C.border}`,marginTop:8}}>
          <div style={{fontSize:10,color:C.muted,lineHeight:1.9,fontFamily:SERIF}}>
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
            <span style={{fontSize:10,color:C.muted,fontWeight:600,fontFamily:MONO}}>Share:</span>
            {[{l:'Share on X',p:'x'},{l:'Share on LinkedIn',p:'li'},{l:'Share on WhatsApp',p:'wa'},{l:'Copy Link',p:'copy'}].map((s,i)=>(
              <button key={i} className="btn-base" onClick={()=>share(s.p)}
                style={{padding:'5px 12px',borderRadius:6,border:`1px solid ${C.border}`,
                  background:C.card,color:C.sub,fontSize:10,fontWeight:700,fontFamily:MONO}}>
                {s.l}
              </button>
            ))}
          </div>
          <div style={{display:'flex',gap:5,marginTop:12,flexWrap:'wrap'}}>
            {NAV.map(n=>(
              <button key={n.id} className="btn-base" onClick={()=>go(n.id)}
                style={{padding:'5px 11px',border:`1px solid ${C.border}`,borderRadius:16,
                  background:'transparent',color:C.muted,fontSize:10,fontWeight:600,fontFamily:MONO}}>
                {n.l}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
