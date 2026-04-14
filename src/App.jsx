import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════
// INDIA RISK DASHBOARD — V8.0 — FULL UX REDESIGN
// Market data: auto-fetched via GitHub Action (twice daily)
// War intelligence: update public/war-intel.json manually
// Redesigned: April 14, 2026 — 7:00 PM IST (Day 46)
// ═══════════════════════════════════════════════════════════════════

const WAR_UPDATED = "April 14, 2026 — 7:00 PM IST";
const WAR_DAY = 46;

const C = {
  bg:"#0a0d13",surface:"#111520",card:"#181d28",raised:"#1f2535",
  border:"#252d3e",text:"#cdd3e0",sub:"#7a8498",muted:"#424d63",
  red:"#ef4444",orange:"#f97316",amber:"#eab308",green:"#22c55e",
  cyan:"#06b6d4",purple:"#a855f7",pink:"#ec4899",white:"#f0f4fa",
  redDim:"#ef444418",orangeDim:"#f9731615",amberDim:"#eab30812",
  greenDim:"#22c55e15",cyanDim:"#06b6d412",purpleDim:"#a855f712",
};

// ─── Fallback hardcoded data (used if war-intel.json fails to load) ───
const TICKER_FB = [
  "🚨 BLOCKADE DAY 2: US-Iran 2nd round talks being discussed. Pakistan offering to host.",
  "🛢️ BRENT ~$98.6 falling on deal optimism. Commercial ships need BOTH US + Iran clearance.",
  "🇨🇳 INTEL: China planning air-defense weapons for Iran — Trump: 'China will have big problems'",
  "🏦 BSE/NSE CLOSED — Ambedkar Jayanti. Reopen Wednesday Apr 15. Sensex last: 76,847",
  "☢️ Iran war losses: $270 BILLION (preliminary). Reparations a core demand in any deal.",
  "🇱🇧 Hezbollah REJECTS Lebanon-Israel Washington talks. Ceasefire expires APR 22 — 8 days",
];

const NAV = [
  {id:"hormuz",l:"🚢 Hormuz"},{id:"economic",l:"📉 Economy"},{id:"kitchen",l:"🍳 Kitchen"},
  {id:"military",l:"⚔️ Military"},{id:"nuclear",l:"☢️ Nuclear"},{id:"projections",l:"📈 Forecast"},
  {id:"radar",l:"🎯 Radar"},{id:"warlog",l:"📋 War Log"},{id:"assessment",l:"🔴 Verdict"},
];

// Full war timeline (hardcoded base; war-intel tlLatest merges on top)
const TL_BASE = [
  {d:1,l:"Feb 28",deaths:555,brent:78,nifty:25179,rupee:91.49,tag:"Op. Epic Fury. Khamenei killed",sev:3},
  {d:3,l:"Mar 2",deaths:787,brent:82,nifty:24866,rupee:91.49,tag:"Black Monday. Ras Tanura shut",sev:3},
  {d:5,l:"Mar 4",deaths:1045,brent:85,nifty:24481,rupee:92.30,tag:"IRIS Dena sunk off Sri Lanka",sev:2},
  {d:7,l:"Mar 6",deaths:1332,brent:88,nifty:24450,rupee:91.82,tag:"Oil depots hit. Worst week begins",sev:2},
  {d:9,l:"Mar 8",deaths:1332,brent:93,nifty:24450,rupee:91.82,tag:"Mojtaba Khamenei elected Supreme Leader",sev:2},
  {d:10,l:"Mar 9",deaths:1754,brent:104,nifty:24028,rupee:92.33,tag:"Brent $120 intraday. ₹8.5L cr wiped",sev:3},
  {d:11,l:"Mar 10",deaths:1754,brent:84,nifty:24200,rupee:92.10,tag:"Trump: 'very complete.' Oil crashes",sev:1},
  {d:12,l:"Mar 11",deaths:1966,brent:93,nifty:23867,rupee:92.20,tag:"IEA 400M barrel SPR release",sev:2},
  {d:14,l:"Mar 13",deaths:2100,brent:99,nifty:23151,rupee:92.45,tag:"BLACK FRIDAY — Sensex -1,460",sev:3},
  {d:15,l:"Mar 14",deaths:2100,brent:99,nifty:23151,rupee:92.45,tag:"5K Marines + 10K AI drones deployed",sev:2},
  {d:16,l:"Mar 15",deaths:2200,brent:100,nifty:23151,rupee:92.45,tag:"Gulf exports -61%",sev:2},
  {d:17,l:"Mar 16",deaths:2200,brent:103,nifty:23409,rupee:92.41,tag:"2 Indian LPG tankers cross Hormuz",sev:1},
  {d:18,l:"Mar 17",deaths:2300,brent:103,nifty:23581,rupee:92.41,tag:"Larijani + Soleimani KILLED",sev:3},
  {d:19,l:"Mar 18",deaths:2500,brent:108,nifty:23778,rupee:92.74,tag:"Khatib killed. South Pars attacked. Brent $108",sev:3},
  {d:20,l:"Mar 19",deaths:2700,brent:117,nifty:23002,rupee:93.23,tag:"CRASH -2,497. Ras Laffan + Aramco hit. Brent $117. Bushehr struck",sev:3},
  {d:21,l:"Mar 20",deaths:3000,brent:108,nifty:23115,rupee:92.94,tag:"IRGC spokesman KILLED. Tehran struck on Nowruz",sev:3},
  {d:22,l:"Mar 21",deaths:3200,brent:112,nifty:23115,rupee:93.65,tag:"NATANZ hit again. Diego Garcia targeted. 70th wave",sev:3},
  {d:23,l:"Mar 22",deaths:3400,brent:112,nifty:23115,rupee:93.65,tag:"DIMONA hit — 100+ injured near Israel nuclear site",sev:3},
  {d:24,l:"Mar 23",deaths:3700,brent:109,nifty:22513,rupee:93.88,tag:"Sensex -1,837. Nifty 22,513 (22-mo low). ₹14L Cr wiped",sev:3},
  {d:25,l:"Mar 24",deaths:3800,brent:99,nifty:22912,rupee:93.88,tag:"Sensex +1,372. Brent $99. Modi-Trump call on Hormuz",sev:1},
  {d:26,l:"Mar 25",deaths:3800,brent:100,nifty:22912,rupee:93.88,tag:"Vance+Rubio lead talks. 82nd Airborne deploying. Philippines emergency",sev:2},
  {d:27,l:"Mar 26",deaths:4100,brent:95,nifty:23430,rupee:93.88,tag:"IRGC Navy chief Tangsiri killed. Iran rejects 15-point plan. Brent $95",sev:2},
  {d:28,l:"Mar 27",deaths:4300,brent:107,nifty:22820,rupee:94.56,tag:"Sensex -1,690. Rupee 94.56 ATL. India cuts excise ₹10/L",sev:3},
  {d:29,l:"Mar 28",deaths:4500,brent:110,nifty:22820,rupee:94.56,tag:"HOUTHIS join war. 10 US troops hit Saudi base. Wall St worst day",sev:3},
  {d:30,l:"Mar 29",deaths:4600,brent:106,nifty:22820,rupee:94.79,tag:"DAY 30. Pentagon plans ground ops. 8 Indian carriers crossed",sev:3},
  {d:31,l:"Mar 30",deaths:4700,brent:115,nifty:22331,rupee:94.84,tag:"Sensex crashes to 71,948 (-1,636). Worst month in 6 yrs. Tehran blackout",sev:3},
  {d:32,l:"Mar 31",deaths:4700,brent:106,nifty:22331,rupee:94.84,tag:"BW Tyr docks Mumbai. Hormuz tolls approved. 4 IDF killed Lebanon",sev:3},
  {d:33,l:"Apr 1",deaths:4900,brent:101,nifty:22700,rupee:94.56,tag:"Iran parliament votes permanent Hormuz tolls. BW Elm at Mangalore",sev:2},
  {d:35,l:"Apr 3",deaths:5100,brent:108,nifty:22200,rupee:94.56,tag:"Sensex -1,400. CMA CGM Kribi first French ship through Larak",sev:3},
  {d:37,l:"Apr 5",deaths:5300,brent:107,nifty:22500,rupee:94.30,tag:"Brent below $100. Trump: winding down. 8 Indian carriers crossed",sev:2},
  {d:39,l:"Apr 7",deaths:5400,brent:95,nifty:23100,rupee:93.65,tag:"CEASEFIRE announced. Sensex +2,946 (+3.95%). Brent -11% below $90",sev:1},
  {d:40,l:"Apr 8",deaths:5400,brent:96,nifty:23900,rupee:92.40,tag:"Hormuz partially reopened for 2 weeks. Ceasefire holding",sev:1},
];

const PROJ_BASE = [
  {w:"Pre-war",brent:65,rupee:91.0,lpg:853,petrol:94.72,deaths:0},
  {w:"Week 1",brent:85,rupee:92.30,lpg:853,petrol:94.72,deaths:1045},
  {w:"Week 3",brent:108,rupee:93.23,lpg:913,petrol:94.77,deaths:2700},
  {w:"Now",brent:98,rupee:93.33,lpg:912,petrol:94.77,deaths:6400},
  {w:"Deal*",brent:78,rupee:91.0,lpg:853,petrol:94.77,deaths:7000},
  {w:"War→May*",brent:130,rupee:98.0,lpg:1100,petrol:110,deaths:15000},
  {w:"War→Jun*",brent:150,rupee:105.0,lpg:1300,petrol:135,deaths:30000},
];

const RADAR_FB = [
  {axis:"Oil Shock",w1:60,now:70,w4:55},{axis:"Market Crash",w1:45,now:52,w4:40},
  {axis:"Nuclear Risk",w1:20,now:88,w4:80},{axis:"Hormuz Closure",w1:80,now:90,w4:48},
  {axis:"Household Impact",w1:15,now:66,w4:55},{axis:"Currency Crisis",w1:40,now:50,w4:44},
  {axis:"Social Unrest",w1:25,now:68,w4:58},{axis:"Military Exposure",w1:35,now:80,w4:60},
];

const NUKES_FB = [
  {name:"Bushehr ☢️",type:"Reactor",status:"ACTIVE WAR ZONE — IAEA WARNED",risk:92,info:"IAEA: strikes 250ft from operating reactor. Rosatom evacuated 200 staff. Reactor operational. IAEA cannot access.",lat:28.83,lon:50.88},
  {name:"Natanz",type:"Enrichment + HEU",status:"75% DAMAGED — 6,000+ CENTRIFUGES DESTROYED",risk:90,info:"Main enrichment plant 75% damaged. R&D 95% destroyed. Nuclear was Islamabad dealbreaker.",lat:33.72,lon:51.73},
  {name:"Isfahan",type:"PRIMARY HEU STORAGE",status:"PRIMARY HEU LOCATION — 200kg+ HERE",risk:96,info:"IAEA Grossi: MAJORITY of Iran's 440.9kg of 60% HEU in deeply buried tunnel complex here.",lat:32.57,lon:51.81},
  {name:"Fordow",type:"Underground Enrichment",status:"ONLY 30% DAMAGED — PROLIFERATION RISK",risk:88,info:"Built into mountain near Qom. Only 30% damaged despite GBU-57 MOPs. Greatest long-term proliferation risk.",lat:34.88,lon:51.73},
  {name:"Arak (IR-40)",type:"Heavy Water Reactor",status:"STRUCK — PLUTONIUM PATH CONCERN",risk:75,info:"Heavy water reactor capable of weapons-grade plutonium. Struck in early war waves.",lat:34.10,lon:49.20},
];

const CITIES_FB = [
  {city:"Delhi NCR",pop:"32M",wind:72,sea:15,nuke:55,tot:64,info:"1,800km downwind from Iran. 440.9kg HEU at Isfahan/Fordow unaccounted. NO iodine prophylaxis program."},
  {city:"Mumbai",pop:"21M",wind:40,sea:78,nuke:42,tot:58,info:"900km from Hormuz. Reliance Jamnagar refinery at risk. JNPT port exposure."},
  {city:"Ahmedabad",pop:"8.5M",wind:65,sea:55,nuke:46,tot:57,info:"Closest Indian metro to Iran. Dual exposure. Jamnagar refinery nearby."},
  {city:"Jaipur",pop:"4M",wind:68,sea:10,nuke:44,tot:47,info:"Rajasthan wind funnel. Food inflation risk from fertilizer disruption."},
  {city:"Kochi",pop:"2.1M",wind:25,sea:70,nuke:24,tot:44,info:"Southern Naval Command. Op Urja Suraksha base. Oil spill risk."},
  {city:"Goa",pop:"1.5M",wind:30,sea:72,nuke:22,tot:42,info:"Konkan coast. Fishing economy ₹4,000 cr exposed."},
  {city:"Lucknow",pop:"3.5M",wind:58,sea:5,nuke:39,tot:40,info:"Indo-Gangetic plain trap. Most exposed to food inflation."},
  {city:"Chennai",pop:"11M",wind:20,sea:55,nuke:18,tot:36,info:"East coast currents provide buffer. Auto sector pressure."},
];

// ── SVG Mini Line Chart ──
const mono = "'JetBrains Mono','SF Mono',Consolas,monospace";

const MiniLine = ({data, dataKey, color, h=90, labels}) => {
  const vals = data.map(d => d[dataKey]).filter(v => v !== undefined && v !== null);
  if (!vals.length) return null;
  const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
  const w = 320;
  const pts = data.filter(d => d[dataKey] != null).map((d, i, arr) => ({
    x: 24 + (i / Math.max(arr.length - 1, 1)) * (w - 40),
    y: 10 + (1 - (d[dataKey] - mn) / rng) * (h - 28),
    v: d[dataKey], l: d.l || d.w
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = line + ` L${pts[pts.length-1].x},${h-8} L${pts[0].x},${h-8} Z`;
  const id = `g_${dataKey}_${Math.random().toString(36).slice(2)}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:'auto',overflow:'visible'}}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`}/>
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill={C.surface} stroke={color} strokeWidth="1.5"/>
          <text x={p.x} y={p.y - 7} fill={C.sub} fontSize="6.5" textAnchor="middle" fontWeight="700" fontFamily={mono}>
            {typeof p.v === 'number' && p.v > 999 ? (p.v/1000).toFixed(1)+'k' : p.v}
          </text>
          {labels && (
            <text x={p.x} y={h - 1} fill={C.muted} fontSize="6" textAnchor="middle" fontFamily={mono}>{p.l}</text>
          )}
        </g>
      ))}
    </svg>
  );
};

// ── Progress Bar ──
const Bar = ({value, max=100, color, h=5}) => (
  <div style={{height:h,background:C.border,borderRadius:h/2,overflow:'hidden',marginTop:3}}>
    <div style={{height:'100%',width:`${Math.min((value/max)*100,100)}%`,
      background: color || (value>70?C.red:value>50?C.orange:value>30?C.amber:C.green),
      borderRadius:h/2, transition:'width 0.6s ease'}}/>
  </div>
);

// ── Radar Chart ──
const RadarSVG = ({data, day}) => {
  const w=280, h=280, cx=w/2, cy=h/2, r=Math.min(cx,cy)-38, n=data.length;
  const ang = i => (Math.PI*2*i)/n - Math.PI/2;
  const xy = (i, v) => ({x: cx + Math.cos(ang(i))*(v/100)*r, y: cy + Math.sin(ang(i))*(v/100)*r});
  const pg = (key, cl, dash) => {
    const p = data.map((d,i) => xy(i, d[key]));
    return <polygon points={p.map(pp=>`${pp.x},${pp.y}`).join(' ')}
      fill={cl+'1a'} stroke={cl} strokeWidth={dash?'1':'1.8'} strokeDasharray={dash||'none'}/>;
  };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:'auto'}}>
      {[20,40,60,80,100].map(v => (
        <polygon key={v} points={data.map((_,i)=>xy(i,v)).map(p=>`${p.x},${p.y}`).join(' ')}
          fill="none" stroke={C.border} strokeWidth="0.5"/>
      ))}
      {data.map((_,i) => { const p=xy(i,100); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={C.border} strokeWidth="0.5"/>; })}
      {pg('w1',C.green)}{pg('now',C.orange)}{pg('w4',C.red,'3 2')}
      {data.map((d,i) => {
        const p = xy(i, 118);
        return <text key={i} x={p.x} y={p.y} fill={C.sub} fontSize="7" textAnchor="middle"
          dominantBaseline="middle" fontWeight="700" fontFamily={mono}>{d.axis}</text>;
      })}
      <g>
        {[{l:'Week 1',c:C.green},{l:`Now (D${day})`,c:C.orange},{l:'Wk 4+ Proj',c:C.red}].map((lg,i) => (
          <g key={i}>
            <rect x={8} y={h-24+i*9} width={8} height={3} fill={lg.c} rx="1"/>
            <text x={20} y={h-21+i*9} fill={C.sub} fontSize="7" fontFamily={mono}>{lg.l}</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

// ── Section wrapper ──
const S = ({id, title, accent=C.red, children}) => (
  <section id={id} style={{marginBottom:40,scrollMarginTop:56}}>
    <div style={{marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
      <h2 style={{margin:0,fontSize:13,fontWeight:800,color:accent,letterSpacing:3,
        textTransform:'uppercase',fontFamily:mono}}>{title}</h2>
    </div>
    {children}
  </section>
);

// ── Metric Card ──
const Mc = ({label, value, sub, delta, accent=C.red, deltaColor}) => (
  <div style={{background:C.card,borderRadius:10,padding:'16px 12px',textAlign:'center',
    borderLeft:`3px solid ${accent}`,border:`1px solid ${accent}20`,
    borderLeftWidth:3,transition:'transform 0.15s'}}>
    <div style={{fontSize:9,color:C.muted,letterSpacing:2,textTransform:'uppercase',fontWeight:800}}>{label}</div>
    <div style={{fontSize:24,fontWeight:900,color:accent,marginTop:5,fontFamily:mono,lineHeight:1}}>{value}</div>
    {delta && <div style={{fontSize:11,color:deltaColor||C.sub,fontWeight:700,marginTop:4,fontFamily:mono}}>{delta}</div>}
    {sub && <div style={{fontSize:9,color:C.muted,marginTop:3,lineHeight:1.4}}>{sub}</div>}
  </div>
);

// ── Main App ──
export default function App() {
  const [projKey, setProjKey] = useState('brent');
  const [expNuke, setExpNuke] = useState(null);
  const [activeNav, setActiveNav] = useState(null);
  const [live, setLive] = useState(null);
  const [liveErr, setLiveErr] = useState(false);
  const [intel, setIntel] = useState(null);
  const [logExpanded, setLogExpanded] = useState(false);
  const [hormuzExpanded, setHormuzExpanded] = useState(false);

  useEffect(() => {
    fetch('./market-data.json?t='+Date.now())
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(d => setLive(d)).catch(() => setLiveErr(true));
    fetch('./war-intel.json?t='+Date.now())
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(d => setIntel(d)).catch(() => {});
  }, []);

  const go = id => { setActiveNav(id); document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}); };

  // Data bindings
  const iT = intel?.ticker ?? TICKER_FB;
  const iDay = intel?._day ?? WAR_DAY;
  const iUpdated = intel?._updated ?? WAR_UPDATED;
  const iDeaths = intel?.deaths ?? "6,400+";
  const iDeathsSub = intel?.deathsSub ?? "";
  const iWC = intel?.whatChanged ?? null;
  const iEcon = intel?.econ ?? null;
  const iTlLatest = intel?.tlLatest ?? [];
  const iRadar = intel?.radar ?? RADAR_FB;
  const iAssess = intel?.assessment ?? null;
  const iHormuzLatest = intel?.hormuzLatest ?? [];
  const iKitchen = intel?.kitchen ?? [];
  const iMilitary = intel?.military ?? null;
  const iNukes = intel?.nukes ?? NUKES_FB;
  const iCities = intel?.cities ?? CITIES_FB;
  const iHormuzStatus = intel?.hormuzStatus ?? null;
  const iHormuzEvents = intel?.hormuzEvents ?? null;
  const iPhase = intel?._phase ?? null;
  const iScenarios = intel?.scenarios ?? null;

  const fullTL = [...TL_BASE.filter(t => !iTlLatest.some(lt => lt.d === t.d)), ...iTlLatest].sort((a,b) => a.d - b.d);
  const fullHormuzEvents = iHormuzEvents ?? iHormuzLatest;

  // Scenario headers/data
  const scenHeaders = iScenarios?.headers ?? ["Pre-war","Week 1","Week 3","Now","Deal*","May*","Jun*"];
  const scenRows = [
    {m:"Brent ($)",vals: iScenarios?.brent ?? PROJ_BASE.map(p=>p.brent)},
    {m:"₹/USD",vals: iScenarios?.rupee ?? PROJ_BASE.map(p=>p.rupee)},
    {m:"Deaths",vals: iScenarios?.deaths ?? PROJ_BASE.map(p=>p.deaths)},
    {m:"Sensex",vals: iScenarios?.sensex ?? ["78,699","76,847","85,000+","55,000"]},
    {m:"LPG",vals: iScenarios?.lpg ?? ["₹853","₹912","₹853","₹1,500+"]},
    {m:"FII",vals: iScenarios?.fii ?? ["-","OUT","return","OUT"]},
  ];

  // Live market
  const brentPrice = live?.brent?.price ?? 98.6;
  const brentChg = live?.brent?.changePct ?? -0.8;
  const brentDelta = brentChg ? (brentChg>0?"▲":"▼")+` ${Math.abs(brentChg).toFixed(1)}%` : "";
  const niftyPrice = live?.nifty?.price ?? 23842;
  const niftyChg = live?.nifty?.change ?? -207;
  const niftyDelta = niftyChg ? (niftyChg>0?"▲ +":"▼ ")+Math.abs(niftyChg).toLocaleString() : "";
  const sensexPrice = live?.sensex?.price ? Math.round(live.sensex.price).toLocaleString() : "76,847";
  const rupeePrice = live?.rupee?.price?.toFixed(2) ?? "93.33";
  const rawTime = live?._updated ?? iUpdated;
  const dataTime = rawTime?.includes?.('2026-') ? rawTime.replace(/^(\d{4})-(\d{2})-(\d{2})\s*—?\s*/, (m,y,mo,d) => {
    const months=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[parseInt(mo)]+' '+parseInt(d)+', '+y+' — ';
  }) : rawTime;
  const brentColor = brentPrice > 100 ? C.red : brentPrice > 90 ? C.orange : C.amber;
  const niftyColor = niftyChg >= 0 ? C.green : C.red;
  const isBlockade = iPhase === "BLOCKADE";

  // Severity icon
  const sv = s => s===3?"🔴":s===2?"🟠":"🟡";

  // Radar label update
  const radarLabel = `Week 1 → Now (D${iDay}) → Wk 6+`;

  // Proj chart data from scenarios
  const projChartData = iScenarios ? [
    {w:"Pre-war", brent:iScenarios.brent[0], rupee:iScenarios.rupee[0], deaths:0, lpg:853},
    {w:"Now",     brent:iScenarios.brent[1], rupee:iScenarios.rupee[1], deaths:6400, lpg:912},
    {w:"Blockade",brent:iScenarios.brent[2], rupee:iScenarios.rupee[2], deaths:7000, lpg:1100},
    {w:"Deal",    brent:iScenarios.brent[3], rupee:iScenarios.rupee[3], deaths:7000, lpg:853},
    {w:"Strikes", brent:iScenarios.brent[4], rupee:iScenarios.rupee[4], deaths:30000, lpg:1500},
  ] : PROJ_BASE;

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,
      fontFamily:"'DM Sans',system-ui,sans-serif",fontSize:13,
      maxWidth:1200,margin:'0 auto',padding:0}}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes nukepulse { 0%{transform:translate(-50%,-50%) scale(0.8);opacity:0.7} 100%{transform:translate(-50%,-50%) scale(2.4);opacity:0} }
        @keyframes fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { height:3px; width:3px; }
        ::-webkit-scrollbar-thumb { background:#252d3e; border-radius:4px; }
        .nav-btn:hover { background: #06b6d415 !important; color: #06b6d4 !important; }
        .card-hover:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(0,0,0,0.3); }
        @media(min-width:768px){
          .grid2{grid-template-columns:1fr 1fr!important;}
          .grid4{grid-template-columns:1fr 1fr 1fr 1fr!important;}
          .hdr-h1{font-size:32px!important;}
          .ticker-txt{font-size:13px!important;}
          .nav-btn{font-size:13px!important;padding:9px 18px!important;}
          .section-title{font-size:15px!important;}
          .mc-val{font-size:28px!important;}
          .mc-lbl{font-size:11px!important;}
          .mc-delta{font-size:12px!important;}
          .mc-sub{font-size:10px!important;}
          .wc-label{font-size:12px!important;}
          .wc-item{font-size:13.5px!important;}
          .mil-title{font-size:14px!important;}
          .mil-body{font-size:12.5px!important;line-height:1.85!important;}
          .assess-body{font-size:13.5px!important;line-height:2!important;}
          .kit-item{font-size:13px!important;}
          .kit-note{font-size:11px!important;}
          .city-name{font-size:14px!important;}
          .city-info{font-size:11px!important;}
          .tl-tag{font-size:11px!important;}
          .dash-content{padding:24px 32px 70px!important;}
          .assess-hl{font-size:16px!important;}
        }
        @media(max-width:767px){
          .grid2{grid-template-columns:1fr!important;}
          .grid4{grid-template-columns:1fr 1fr!important;}
        }
      `}</style>

      {/* ═══ TICKER ═══ */}
      <div style={{background:`linear-gradient(90deg,${C.red},#b91c1c)`,padding:'8px 0',overflow:'hidden'}}>
        <div style={{display:'flex',width:'max-content',animation:'ticker 80s linear infinite',willChange:'transform'}}>
          {[...iT,...iT].map((t,i) => (
            <span key={i} className="ticker-txt" style={{fontSize:11.5,fontWeight:600,color:'#fff',
              letterSpacing:0.3,paddingRight:60,whiteSpace:'nowrap',flexShrink:0}}>
              {t}<span style={{paddingLeft:60,color:'#ffffff50'}}>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ HEADER ═══ */}
      <header style={{padding:'18px 20px 14px',borderBottom:`1px solid ${C.border}`,
        display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
        <div>
          <div style={{fontSize:8.5,letterSpacing:5,color:C.muted,textTransform:'uppercase',fontWeight:800,fontFamily:mono}}>
            India Risk Assessment
          </div>
          <h1 className="hdr-h1" style={{margin:'6px 0 0',fontSize:22,fontWeight:900,color:C.white,lineHeight:1.15}}>
            How the Iran War<br/>Is Hitting India
          </h1>
          <div style={{fontSize:9,color:C.muted,marginTop:6,fontStyle:'italic'}}>
            {iUpdated} • 50+ verified sources
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6,flexShrink:0}}>
          <div style={{background:`linear-gradient(135deg,${C.red},#b91c1c)`,color:'#fff',
            fontSize:15,fontWeight:900,padding:'8px 18px',borderRadius:8,fontFamily:mono,
            boxShadow:`0 4px 16px ${C.red}40`}}>DAY {iDay}</div>
          <div style={{fontSize:8.5,color:isBlockade?C.red:C.cyan,padding:'3px 8px',
            border:`1px solid ${isBlockade?C.red:C.cyan}40`,borderRadius:4,
            background:(isBlockade?C.red:C.cyan)+'0a',fontWeight:700,fontFamily:mono,
            animation:isBlockade?'pulse 2s infinite':undefined}}>
            {isBlockade?"⚠ BLOCKADE ACTIVE":"● DATA AUTO-SYNCED"}
          </div>
          {/* Share buttons */}
          <div style={{display:'flex',gap:5,marginTop:2}}>
            {[
              {icon:'𝕏',label:'X/Twitter',url:`https://twitter.com/intent/tweet?text=${encodeURIComponent('Iran-Gulf War: India Threat Matrix — Day '+iDay+' '+iUpdated)}&url=${encodeURIComponent('https://nithiyageo.github.io/india-risk-dashboard/')}`},
              {icon:'in',label:'LinkedIn',url:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://nithiyageo.github.io/india-risk-dashboard/')}`},
              {icon:'📋',label:'Copy link',url:null},
            ].map((s,i) => (
              <button key={i} title={s.label}
                onClick={() => s.url ? window.open(s.url,'_blank') : navigator.clipboard?.writeText('https://nithiyageo.github.io/india-risk-dashboard/')}
                style={{padding:'4px 8px',borderRadius:5,border:`1px solid ${C.border}`,
                  background:C.surface,color:C.sub,cursor:'pointer',fontSize:10,fontWeight:700,
                  fontFamily:mono,transition:'all 0.15s'}}>
                {s.icon}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ═══ NAV ═══ */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:C.bg+'f0',
        backdropFilter:'blur(16px)',borderBottom:`1px solid ${C.border}`,padding:'8px 16px'}}>
        <div style={{display:'flex',gap:5,overflowX:'auto',scrollbarWidth:'none',WebkitOverflowScrolling:'touch'}}>
          {NAV.map(n => (
            <button key={n.id} className="nav-btn"
              onClick={() => go(n.id)}
              style={{flex:'0 0 auto',padding:'7px 14px',border:activeNav===n.id?`1px solid ${C.cyan}`:`1px solid ${C.border}`,
                borderRadius:20,background:activeNav===n.id?C.cyan+'18':'transparent',
                color:activeNav===n.id?C.cyan:C.sub,cursor:'pointer',fontSize:11,fontWeight:700,
                fontFamily:'inherit',whiteSpace:'nowrap',transition:'all 0.2s'}}>
              {n.l}
            </button>
          ))}
        </div>
      </nav>

      <div className="dash-content" style={{padding:'18px 16px 60px'}}>

        {/* ═══ WHAT CHANGED ═══ */}
        <div style={{background:C.redDim,border:`1px solid ${C.red}25`,borderRadius:10,
          padding:'16px 18px',marginBottom:22}}>
          <div className="wc-label" style={{fontSize:10,fontWeight:900,color:C.red,
            letterSpacing:3,marginBottom:14,fontFamily:mono}}>
            {iWC?.label || "WHAT CHANGED"}
          </div>
          <div>
            {(iWC?.items || []).map((item, i) => (
              <div key={i} className="wc-item" style={{display:'flex',gap:10,marginBottom:i===iWC.items.length-1?0:12,
                paddingBottom:i===iWC.items.length-1?0:12,
                borderBottom:i===iWC.items.length-1?'none':`1px solid ${C.border}30`,
                fontSize:12,lineHeight:1.65,animation:`fadein 0.3s ease ${i*0.05}s both`}}>
                <span style={{color:C[item.color]||C.red,fontWeight:900,flexShrink:0,fontSize:14,marginTop:-1}}>▸</span>
                <span>
                  <strong style={{color:C[item.color]||C.red,fontWeight:800}}>{item.bold} </strong>
                  <span style={{color:C.sub}}>{item.text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ METRICS ═══ */}
        <div className="grid4" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:24}}>
          <Mc label="War Dead" value={iDeaths} sub={iDeathsSub} accent={C.red}/>
          <Mc label="Brent" value={`$${brentPrice}`} delta={brentDelta}
            deltaColor={brentChg>0?C.red:C.green} sub="was $65 pre-war" accent={brentColor}/>
          <Mc label="Nifty" value={niftyPrice.toLocaleString()} delta={niftyDelta}
            deltaColor={niftyColor} sub="Apr 13 close. Holiday today" accent={niftyChg>=0?C.green:C.red}/>
          <Mc label="₹/USD" value={rupeePrice} delta="ATL zone" deltaColor={C.red}
            sub="was ₹91.49 pre-war" accent={C.orange}/>
        </div>

        {/* ═══ HORMUZ ═══ */}
        <S id="hormuz" title="🚢 Strait of Hormuz — Shipping Status" accent={C.cyan}>
          <div style={{fontSize:12,color:isBlockade?C.red:C.sub,marginBottom:12,fontWeight:600}}>
            {iHormuzStatus?.headline || "Real-time status of the world's most critical oil chokepoint"}
          </div>

          {/* Status cards */}
          <div className="grid2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
            <div style={{background:(isBlockade?C.red:C.green)+'12',borderRadius:10,padding:14,textAlign:'center',
              border:`1px solid ${(isBlockade?C.red:C.green)}30`}}>
              <div style={{fontSize:9,color:isBlockade?C.red:C.green,fontWeight:800,letterSpacing:2}}>STATUS</div>
              <div style={{fontSize:13,fontWeight:900,color:isBlockade?C.red:C.green,marginTop:5,lineHeight:1.3}}>
                {iHormuzStatus?.status || "SELECTIVE BLOCKADE"}
              </div>
            </div>
            <div style={{background:C.card,borderRadius:10,padding:14,textAlign:'center',border:`1px solid ${C.border}`}}>
              <div style={{fontSize:9,color:C.muted,fontWeight:800,letterSpacing:2}}>SHIP TRAFFIC</div>
              <div style={{fontSize:15,fontWeight:900,color:C.orange,marginTop:5,fontFamily:mono,lineHeight:1.3}}>
                {iHormuzStatus?.currentFlow || "< 10% of pre-war"}
              </div>
              <div style={{fontSize:9,color:C.muted,marginTop:3}}>Pre-war: {iHormuzStatus?.preWarFlow || "130-160 ships/day"}</div>
            </div>
          </div>

          {/* Indian ships stats */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:14}}>
            {[
              {l:"🇮🇳 Ships in Gulf", v:iHormuzStatus?.indianVesselsNear??8, sub:(iHormuzStatus?.indianSeafarers??280)+" seafarers", c:C.orange},
              {l:"🇮🇳 Crossed Safely", v:iHormuzStatus?.indianTransited??10, sub:"8 LPG + 1 crude + 1 gas", c:C.green},
              {l:"Navy Escort", v:"ACTIVE", sub:iHormuzStatus?.indianNavyEscort||"Op Urja Suraksha", c:C.cyan, isText:true},
            ].map((s,i) => (
              <div key={i} style={{background:C.card,borderRadius:10,padding:'12px 8px',textAlign:'center',border:`1px solid ${C.border}`}}>
                <div style={{fontSize:8.5,color:C.muted,fontWeight:700,letterSpacing:1,lineHeight:1.4}}>{s.l}</div>
                <div style={{fontSize:s.isText?14:26,fontWeight:900,color:s.c,fontFamily:mono,marginTop:4}}>{s.v}</div>
                <div style={{fontSize:8.5,color:C.muted,marginTop:2,lineHeight:1.3}}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Interactive Hormuz timeline */}
          <div style={{background:C.card,borderRadius:10,padding:14,border:`1px solid ${C.border}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <div style={{fontSize:10,fontWeight:800,color:C.cyan,letterSpacing:2,fontFamily:mono}}>
                HORMUZ TIMELINE
              </div>
              <button onClick={() => setHormuzExpanded(!hormuzExpanded)}
                style={{fontSize:9,color:C.cyan,background:C.cyanDim,border:`1px solid ${C.cyan}30`,
                  borderRadius:4,padding:'3px 10px',cursor:'pointer',fontWeight:700,fontFamily:mono}}>
                {hormuzExpanded?"SHOW LESS ▲":"FULL HISTORY ▼"}
              </button>
            </div>
            {(hormuzExpanded ? fullHormuzEvents : fullHormuzEvents.slice(0,4)).map((e,i) => (
              <div key={i} style={{display:'flex',gap:10,padding:'7px 0',
                borderBottom:`1px solid ${C.border}25`,alignItems:'flex-start'}}>
                <span style={{fontSize:10,color:C.cyan,fontWeight:800,minWidth:52,fontFamily:mono,flexShrink:0}}>{e.d}</span>
                <span className="tl-tag" style={{fontSize:10.5,color:C.sub,lineHeight:1.6}}>{e.e}</span>
              </div>
            ))}
            <div style={{fontSize:9,color:C.muted,marginTop:8,paddingTop:6,borderTop:`1px solid ${C.border}25`}}>
              🇮🇳 Last transit: {iHormuzStatus?.lastTransit || "See timeline above"}
            </div>
          </div>
        </S>

        {/* ═══ ECONOMIC IMPACT ═══ */}
        <S id="economic" title="📉 Economic Impact" accent={C.orange}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:14}}>
            <Mc label="BSE Market Cap" value={iEcon?.wealth||"₹446L Cr"} sub="recovering from ₹443L Cr Mon low" accent={C.red}/>
            <Mc label="FPI Apr 13" value={iEcon?.fpi||"₹1,244 Cr OUT"} delta={iEcon?.fpiDelta||"DII ₹2,051 Cr IN"} sub="net flow" accent={C.orange}/>
            <Mc label="Sensex" value={iEcon?.sensex||"76,847"} delta={iEcon?.sensexDelta||"▼ -702 (-0.91%)"} sub={iEcon?.sensexSub||"Closed today"} accent={C.red}/>
            <Mc label="India VIX" value={iEcon?.vix||"~18-20"} delta={iEcon?.vixDelta||"easing"} sub="recovered from 22+ spike" accent={C.amber}/>
          </div>

          {/* Nifty chart */}
          <div style={{background:C.card,borderRadius:10,padding:'14px 14px 10px',marginBottom:10,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:10,fontWeight:800,color:C.cyan,marginBottom:6,letterSpacing:2,fontFamily:mono,
              display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span>NIFTY 50 — 46-DAY TRACK</span>
              <span style={{fontSize:8,color:C.muted,fontWeight:400}}>All war days</span>
            </div>
            <MiniLine data={fullTL} dataKey="nifty" color={C.cyan} h={100} labels/>
          </div>

          {/* Brent chart */}
          <div style={{background:C.card,borderRadius:10,padding:'14px 14px 10px',border:`1px solid ${C.border}`}}>
            <div style={{fontSize:10,fontWeight:800,color:C.orange,marginBottom:6,letterSpacing:2,fontFamily:mono,
              display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span>BRENT CRUDE ($) — 46-DAY TRACK</span>
              <span style={{fontSize:8,color:C.muted,fontWeight:400}}>Currently ~$98.6</span>
            </div>
            <MiniLine data={fullTL} dataKey="brent" color={C.orange} h={100} labels/>
          </div>

          {iEcon?.analysis && (
            <div style={{background:C.card,borderRadius:10,padding:14,marginTop:10,
              border:`1px solid ${C.border}`,fontSize:11,color:C.sub,lineHeight:1.8}}>
              <strong style={{color:C.orange,fontSize:11.5}}>📊 Market Analysis</strong><br/>{iEcon.analysis}
            </div>
          )}
        </S>

        {/* ═══ KITCHEN ═══ */}
        <S id="kitchen" title="🍳 Your Kitchen Table" accent={C.amber}>
          <div style={{fontSize:11,color:C.sub,marginBottom:12,lineHeight:1.6}}>
            Gas crisis impacts on Indian households — prices updated daily from war-intel.json
          </div>
          {iKitchen.map((h,i) => (
            <div key={i} className="card-hover" style={{background:C.card,borderRadius:10,padding:'12px 14px',
              marginBottom:8,borderLeft:`3px solid ${h.s===3?C.red:h.s===2?C.orange:C.green}`,
              border:`1px solid ${C.border}`,transition:'all 0.15s'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,flexWrap:'wrap'}}>
                <span className="kit-item" style={{fontSize:13,fontWeight:700,color:C.white}}>
                  {sv(h.s)} {h.item}
                </span>
                <span style={{fontSize:11.5,fontWeight:800,color:h.s===1?C.green:h.s===3?C.red:C.orange,
                  fontFamily:mono,flexShrink:0}}>{h.chg}</span>
              </div>
              <div style={{display:'flex',gap:12,marginTop:8,fontSize:11,flexWrap:'wrap'}}>
                <span style={{color:C.muted}}>Pre: <strong style={{color:C.sub}}>{h.pre}</strong></span>
                <span>Now: <strong style={{color:C.orange}}>{h.now}</strong></span>
                <span>2wk: <strong style={{color:h.s===3?C.red:C.amber}}>{h.proj}</strong></span>
              </div>
              <div className="kit-note" style={{fontSize:10.5,color:C.muted,marginTop:7,lineHeight:1.7,borderTop:`1px solid ${C.border}40`,paddingTop:7}}>
                {h.note}
              </div>
            </div>
          ))}
        </S>

        {/* ═══ MILITARY ═══ */}
        <S id="military" title="⚔️ Military & Strategic Updates" accent={C.red}>
          {(iMilitary || []).map((m,i) => {
            const mc = C[m.color] || C.amber;
            return (
              <div key={i} className="card-hover" style={{background:m.lv==="BREAKING"?mc+'0d':C.card,
                border:`1px solid ${mc}${m.lv==="BREAKING"?'35':'15'}`,
                borderRadius:10,padding:'13px 14px',marginBottom:8,borderLeft:`3px solid ${mc}`,
                transition:'all 0.15s'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,flexWrap:'wrap'}}>
                  <span className="mil-title" style={{fontSize:13,fontWeight:700,color:C.white,flex:1,lineHeight:1.4}}>{m.t}</span>
                  <span style={{fontSize:9,padding:'3px 10px',borderRadius:4,
                    background:m.lv==="BREAKING"?mc:`${mc}20`,
                    color:m.lv==="BREAKING"?'#fff':mc,fontWeight:800,whiteSpace:'nowrap',
                    letterSpacing:0.8,flexShrink:0}}>{m.lv}</span>
                </div>
                <div className="mil-body" style={{fontSize:11.5,color:C.sub,marginTop:8,lineHeight:1.75}}>{m.d}</div>
              </div>
            );
          })}
        </S>

        {/* ═══ NUCLEAR ═══ */}
        <S id="nuclear" title="☢️ Nuclear Exposure" accent={C.purple}>
          <div style={{background:C.purpleDim,border:`1px solid ${C.purple}30`,borderRadius:10,
            padding:14,marginBottom:14,fontSize:12,color:C.sub,lineHeight:1.8}}>
            <strong style={{color:C.purple}}>Bushehr — a working nuclear reactor — has been struck.</strong>{' '}
            First confirmed hit on an active nuclear facility. IAEA: strikes 250ft from operating reactor. Rosatom evacuated 200 staff "minutes before plant was hit."
            460kg of 60% enriched uranium across Iran's sites. Delhi 4-7 days downwind at 500 hPa. India has NO national iodine prophylaxis program.
            Blockade + China air-defense intelligence raises escalation risk.
          </div>

          {/* Live wind map */}
          <div style={{background:C.card,borderRadius:12,padding:14,marginBottom:16,border:`1px solid ${C.purple}30`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,flexWrap:'wrap',gap:8}}>
              <div>
                <div style={{fontSize:12,fontWeight:800,color:C.purple,letterSpacing:1.5,fontFamily:mono}}>
                  🌬️ LIVE WIND FORECAST — IRAN → INDIA
                </div>
                <div style={{fontSize:10,color:C.muted,marginTop:2}}>Real-time atmospheric transport vectors at 500 hPa (~5.5 km altitude)</div>
              </div>
              <div style={{fontSize:9,color:C.cyan,padding:'4px 10px',border:`1px solid ${C.cyan}40`,
                borderRadius:4,background:C.cyanDim,fontWeight:700,fontFamily:mono}}>● LIVE • windy.com</div>
            </div>
            <div style={{position:'relative',width:'100%',paddingBottom:'58%',height:0,
              borderRadius:8,overflow:'hidden',border:`1px solid ${C.border}`,background:'#0a0e17'}}>
              <iframe title="Windy.com wind forecast — Iran nuclear sites"
                src="https://embed.windy.com/embed2.html?lat=30&lon=54&detailLat=32.5&detailLon=51.7&width=650&height=450&zoom=5&level=500h&overlay=wind&product=ecmwf&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
                style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:0}} frameBorder="0"/>
            </div>
            <div style={{background:C.amberDim,border:`1px solid ${C.amber}30`,borderRadius:6,
              padding:10,marginTop:10,fontSize:10,color:C.sub,lineHeight:1.7}}>
              <strong style={{color:C.amber}}>⚠️ Note:</strong> Map shows wind direction and speed only at 500 hPa — relevant for long-range particulate transport.
              Does NOT show radiation levels or fallout. Site markers shown below map are approximate positions — the live map overlay markers may shift when panning or zooming.
              For actual fallout modeling, see <strong style={{color:C.cyan}}>NOAA HYSPLIT</strong>.
            </div>
            {/* Static site legend below map (not overlaid, so no shift problem) */}
            <div style={{display:'flex',gap:6,marginTop:10,flexWrap:'wrap'}}>
              {[{n:'B',label:'Bushehr'},{n:'N',label:'Natanz'},{n:'I',label:'Isfahan'},{n:'A',label:'Arak'},{n:'F',label:'Fordow'},{n:'Y',label:'Yazd'}].map(s => (
                <div key={s.n} style={{display:'flex',alignItems:'center',gap:5,background:C.bg,
                  border:`1px solid ${C.red}30`,borderRadius:5,padding:'3px 8px'}}>
                  <div style={{width:16,height:16,borderRadius:'50%',background:C.red,border:'2px solid #fff',
                    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <span style={{fontSize:7,fontWeight:900,color:'#fff'}}>{s.n}</span>
                  </div>
                  <span style={{fontSize:9,color:C.sub,fontWeight:600,fontFamily:mono}}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <style>{`@keyframes nukepulse{0%{transform:translate(-50%,-50%) scale(0.8);opacity:0.7}100%{transform:translate(-50%,-50%) scale(2.4);opacity:0}}`}</style>

          {/* Nuclear sites */}
          <div style={{fontSize:10,fontWeight:800,color:C.purple,marginBottom:10,letterSpacing:2,fontFamily:mono}}>SITE STATUS</div>
          {iNukes.map((n,i) => {
            const isHit = (n.status||n.st||"").match(/HIT|DAMAGED|STRUCK|WAR ZONE/);
            const riskColor = n.risk>85?C.red:n.risk>70?C.orange:C.amber;
            return (
              <div key={i} onClick={() => setExpNuke(expNuke===i?null:i)}
                style={{background:C.card,borderRadius:10,padding:'12px 14px',marginBottom:8,
                  cursor:'pointer',border:`1px solid ${riskColor}20`,transition:'all 0.15s'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                  <div style={{flex:1}}>
                    <span style={{fontSize:14,fontWeight:800,color:riskColor,fontFamily:mono}}>{n.name}</span>
                    <span style={{fontSize:10,color:C.muted,marginLeft:8}}>{n.type}</span>
                  </div>
                  <span style={{fontSize:9,padding:'3px 10px',borderRadius:4,fontWeight:800,
                    background:isHit?C.red+'20':C.orange+'15',color:isHit?C.red:C.orange,
                    whiteSpace:'nowrap'}}>{n.status||n.st}</span>
                </div>
                <Bar value={n.risk} color={riskColor} h={5}/>
                <div style={{fontSize:10,color:C.muted,marginTop:4,display:'flex',justifyContent:'space-between'}}>
                  <span style={{fontFamily:mono,fontWeight:700,color:riskColor}}>{n.risk}/100 risk</span>
                  <span>{expNuke===i?"▲ collapse":"▼ expand"}</span>
                </div>
                {expNuke===i && (
                  <div style={{fontSize:11.5,color:C.sub,marginTop:10,lineHeight:1.8,
                    borderTop:`1px solid ${C.border}`,paddingTop:10}}>{n.info}</div>
                )}
              </div>
            );
          })}

          {/* City exposure */}
          <div style={{fontSize:10,fontWeight:800,color:C.pink,marginTop:20,marginBottom:10,letterSpacing:2,fontFamily:mono}}>
            INDIAN CITY EXPOSURE
          </div>
          <div style={{fontSize:11,color:C.muted,marginBottom:10}}>
            Composite risk score based on wind trajectory (nuclear), sea proximity (oil shock), and nuclear facility distance.
          </div>
          {iCities.map((c,i) => (
            <div key={i} style={{background:C.card,borderRadius:10,padding:'12px 14px',marginBottom:8,border:`1px solid ${C.border}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <div>
                  <span className="city-name" style={{fontSize:13,fontWeight:800,color:C.white}}>{c.city}</span>
                  <span style={{fontSize:10,color:C.muted,marginLeft:8}}>Pop: {c.pop}</span>
                </div>
                <div style={{textAlign:'right'}}>
                  <span style={{fontSize:22,fontWeight:900,color:c.tot>55?C.red:c.tot>42?C.orange:C.amber,
                    fontFamily:mono}}>{c.tot}</span>
                  <span style={{fontSize:10,color:C.muted}}>/100</span>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginBottom:8}}>
                {[{l:"Wind",v:c.wind,cl:C.orange},{l:"Sea",v:c.sea,cl:C.cyan},{l:"Nuclear",v:c.nuke,cl:C.purple}].map((vv,j) => (
                  <div key={j}>
                    <div style={{fontSize:9,color:vv.cl,fontWeight:700,marginBottom:2}}>{vv.l}: {vv.v}/100</div>
                    <Bar value={vv.v} color={vv.cl} h={4}/>
                  </div>
                ))}
              </div>
              <div className="city-info" style={{fontSize:10.5,color:C.muted,lineHeight:1.7}}>{c.info}</div>
            </div>
          ))}
        </S>

        {/* ═══ PROJECTIONS ═══ */}
        <S id="projections" title="📈 If This Continues..." accent={C.cyan}>
          <div style={{fontSize:11,color:C.sub,marginBottom:12}}>
            Scenario projections — energy-focused. Nifty excluded (too volatile to model).
          </div>
          <div style={{display:'flex',gap:4,marginBottom:10,flexWrap:'wrap'}}>
            {[{k:'brent',l:'🛢 Oil'},{k:'rupee',l:'₹ Rupee'},{k:'lpg',l:'🍳 LPG'},{k:'deaths',l:'💀 Deaths'}].map(m => (
              <button key={m.k} onClick={() => setProjKey(m.k)}
                style={{padding:'5px 12px',border:projKey===m.k?`1px solid ${C.cyan}`:`1px solid ${C.border}`,
                  borderRadius:6,background:projKey===m.k?C.cyanDim:'transparent',
                  color:projKey===m.k?C.cyan:C.sub,cursor:'pointer',fontSize:10,fontWeight:700,
                  fontFamily:'inherit',transition:'all 0.15s'}}>{m.l}</button>
            ))}
          </div>
          <div style={{background:C.card,borderRadius:10,padding:'14px 14px 10px',marginBottom:12,border:`1px solid ${C.border}`}}>
            <MiniLine data={projChartData} dataKey={projKey} color={C.cyan} h={100} labels/>
          </div>
          <div style={{background:C.card,borderRadius:10,padding:14,overflowX:'auto',border:`1px solid ${C.border}`}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:10,minWidth:300,fontFamily:mono}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.border}`}}>
                  <th style={{padding:'5px 4px',textAlign:'left',color:C.muted,fontWeight:700}}>Metric</th>
                  {(scenHeaders).map((h,i) => (
                    <th key={i} style={{padding:'5px 4px',textAlign:'right',
                      color:i===0?C.green:i===1?C.orange:i===3?C.green:i>=4?C.red:C.sub,fontWeight:700}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scenRows.map((r,i) => (
                  <tr key={i} style={{borderBottom:`1px solid ${C.border}25`}}>
                    <td style={{padding:'5px 4px',fontWeight:700,color:C.text}}>{r.m}</td>
                    {(r.vals||[]).map((v,j) => (
                      <td key={j} style={{padding:'5px 4px',textAlign:'right',
                        color:j===0?C.green:j===1?C.orange:j===3?C.green:j>=4?C.red:C.amber,
                        fontWeight:600}}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </S>

        {/* ═══ RADAR ═══ */}
        <S id="radar" title="🎯 Risk Radar" accent={C.cyan}>
          <div style={{fontSize:11,color:C.sub,marginBottom:10}}>{radarLabel}</div>
          <div style={{background:C.card,borderRadius:10,padding:14,border:`1px solid ${C.border}`}}>
            <RadarSVG data={iRadar} day={iDay}/>
          </div>
          <div style={{background:C.card,borderRadius:10,padding:12,marginTop:10,border:`1px solid ${C.border}`}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              {iRadar.map((r,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'4px 0',borderBottom:`1px solid ${C.border}25`}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,color:C.sub,fontWeight:600,marginBottom:2}}>{r.axis}</div>
                    <Bar value={r.now} color={r.now>70?C.red:r.now>50?C.orange:C.amber} h={4}/>
                  </div>
                  <span style={{fontSize:12,fontWeight:900,color:r.now>70?C.red:r.now>50?C.orange:C.amber,
                    fontFamily:mono,flexShrink:0}}>{r.now}</span>
                </div>
              ))}
            </div>
          </div>
        </S>

        {/* ═══ WAR LOG ═══ */}
        <S id="warlog" title="📋 War Log — All 46 Days" accent={C.muted}>
          <div style={{background:C.card,borderRadius:10,padding:12,border:`1px solid ${C.border}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <div style={{fontSize:10,color:C.sub}}>Recent events shown. Click to expand full archive.</div>
              <button onClick={() => setLogExpanded(!logExpanded)}
                style={{fontSize:9,color:C.cyan,background:C.cyanDim,border:`1px solid ${C.cyan}30`,
                  borderRadius:4,padding:'4px 12px',cursor:'pointer',fontWeight:800,fontFamily:mono}}>
                {logExpanded?"COLLAPSE ▲":"FULL ARCHIVE ▼"}
              </button>
            </div>
            {(logExpanded ? [...fullTL].reverse() : [...fullTL].reverse().slice(0,10)).map((d,i) => (
              <div key={i} style={{padding:'6px 0',borderBottom:`1px solid ${C.border}20`,
                display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{minWidth:40,flexShrink:0}}>
                  <div style={{fontSize:10,fontWeight:800,color:d.sev===3?C.red:d.sev===2?C.orange:C.green,
                    fontFamily:mono}}>D{d.d}</div>
                  <div style={{fontSize:8,color:C.muted,fontFamily:mono}}>{d.l}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <span className="tl-tag" style={{fontSize:11,color:C.sub,lineHeight:1.5}}>{d.tag}</span>
                  <div style={{display:'flex',gap:8,marginTop:3,flexWrap:'wrap'}}>
                    {[{l:'Nifty',v:d.nifty?.toLocaleString(),c:d.nifty>24000?C.green:C.red},
                      {l:'Brent',v:'$'+d.brent,c:d.brent>100?C.red:C.amber},
                      {l:'₹',v:d.rupee?.toFixed(2),c:C.orange}].map((m,j) => (
                      <span key={j} style={{fontSize:8.5,color:m.c,fontFamily:mono,fontWeight:700}}>
                        {m.l}: {m.v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {!logExpanded && <div style={{fontSize:10,color:C.muted,textAlign:'center',marginTop:8,padding:'6px 0',borderTop:`1px solid ${C.border}25`}}>
              {fullTL.length - 10} more days — click FULL ARCHIVE to see all
            </div>}
          </div>
        </S>

        {/* ═══ STRATEGIC ASSESSMENT ═══ */}
        <S id="assessment" title="🔴 Strategic Assessment" accent={C.red}>
          <div style={{background:C.redDim,border:`1px solid ${C.red}20`,borderRadius:12,padding:'18px 20px'}}>
            <div className="assess-hl" style={{fontSize:14,fontWeight:800,color:C.red,lineHeight:1.5,marginBottom:16,
              paddingBottom:14,borderBottom:`1px solid ${C.red}20`}}>
              {iAssess?.headline}
            </div>
            <div className="assess-body" style={{fontSize:12,lineHeight:1.9,color:C.sub}}>
              {(iAssess?.body || "").split('\n').map((p, i) => {
                if (!p.trim()) return null;
                const isHeader = p.match(/^[A-Z][A-Z\s+]+$/);
                const isBullet = p.startsWith('•');
                return (
                  <div key={i} style={{marginBottom: isHeader ? 10 : isBullet ? 4 : 10}}>
                    {isHeader
                      ? <div style={{fontSize:10,fontWeight:900,color:C.orange,letterSpacing:2.5,
                          fontFamily:mono,marginTop:14,marginBottom:6,paddingTop:10,
                          borderTop:`1px solid ${C.border}`}}>{p}</div>
                      : <span style={{color:isBullet?C.sub:C.text}}>{p}</span>
                    }
                  </div>
                );
              })}
            </div>
            <div style={{background:C.orangeDim,border:`1px solid ${C.orange}30`,borderRadius:8,
              padding:12,marginTop:14,fontSize:12,color:C.sub,lineHeight:1.8}}>
              <strong style={{color:C.orange}}>For India, this is an energy emergency.</strong> Qatar = 60% of India's natural gas.
              Ras Laffan 17% capacity GONE for 3-5 years. QatarEnergy force majeure.
              India has ~60 days crude stock, LPG 30+ days (PIB). But long-term costs rising permanently — Hormuz now a dual-blockade zone.
              <br/><br/>
              <strong style={{color:C.cyan}}>India must act now:</strong> Emergency gas rationing. Non-Gulf LPG acceleration. Rupee defense. Nuclear monitoring. Food supply protection. This is India's crisis — not a distant war.
            </div>
          </div>
        </S>

        {/* ═══ FOOTER ═══ */}
        <footer style={{padding:'14px 0',borderTop:`1px solid ${C.border}`,marginTop:8}}>
          <div style={{fontSize:9.5,color:C.muted,lineHeight:1.9}}>
            <strong style={{color:C.sub}}>Sources:</strong> Al Jazeera, CNN, CBS, NBC, ABC, AP, Reuters, Bloomberg, NPR, CNBC,
            Iran International, Times of Israel, ACLED, Atlantic Council, Amnesty Intl, Business Standard, BusinessToday,
            Goodreturns, Trading Economics, Fortune, Wikipedia, IAEA, HRW, CSIS, IEA, EIA, Kpler, MarineTraffic, MUFG,
            ORF, MEA India, Nomura, Elara, UBS, HSBC, Kotak, JM Financial, ICRA, Motilal Oswal, SBI Securities, Choice Broking
            <br/><br/>
            <strong style={{color:C.sub}}>Methodology:</strong> Nuclear/contamination scores are analytical estimates — NOT confirmed measurements.
            Projections are trend extrapolations, not forecasts. Nifty projections excluded. All timestamps IST (UTC+5:30).
            Hormuz shipping data from Kpler, MarineTraffic, Windward, and news reports.
            <br/><br/>
            <strong style={{color:C.sub}}>Update cadence:</strong> Market data (Brent, Nifty, Sensex, Rupee) auto-syncs twice daily via GitHub Action.
            War intelligence updated manually via <code style={{background:C.surface,padding:'1px 4px',borderRadius:3,color:C.cyan}}>public/war-intel.json</code>.
            <br/><br/>
            <strong style={{color:C.sub}}>Disclaimer:</strong> Built with AI tools. Ongoing project. Not financial, safety, or evacuation advice.
          </div>
          {/* Footer share */}
          <div style={{display:'flex',gap:8,marginTop:14,alignItems:'center',flexWrap:'wrap'}}>
            <span style={{fontSize:10,color:C.muted,fontWeight:600}}>Share this dashboard:</span>
            {[
              {l:'Share on X',url:`https://twitter.com/intent/tweet?text=${encodeURIComponent('🇮🇳 Iran-Gulf War: India Threat Matrix — Day '+iDay+' live dashboard')}&url=${encodeURIComponent('https://nithiyageo.github.io/india-risk-dashboard/')}&hashtags=IndiaRiskDashboard,HormuzBlockade`},
              {l:'Share on LinkedIn',url:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://nithiyageo.github.io/india-risk-dashboard/')}`},
              {l:'Share on WhatsApp',url:`https://wa.me/?text=${encodeURIComponent('🇮🇳 Iran-Gulf War: India Threat Matrix — Day '+iDay+' — '+iUpdated+'\n\nhttps://nithiyageo.github.io/india-risk-dashboard/')}`},
              {l:'Copy Link',url:null},
            ].map((s,i) => (
              <button key={i}
                onClick={() => s.url ? window.open(s.url,'_blank') : (navigator.clipboard?.writeText('https://nithiyageo.github.io/india-risk-dashboard/') && alert('Link copied!'))}
                style={{padding:'5px 12px',borderRadius:6,border:`1px solid ${C.border}`,
                  background:C.surface,color:C.sub,cursor:'pointer',fontSize:10,fontWeight:700,
                  fontFamily:'inherit',transition:'all 0.15s'}}>
                {s.l}
              </button>
            ))}
          </div>
          {/* Bottom nav */}
          <div style={{display:'flex',gap:6,marginTop:14,flexWrap:'wrap'}}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => go(n.id)}
                style={{padding:'6px 12px',border:`1px solid ${C.border}`,borderRadius:16,
                  background:'transparent',color:C.muted,cursor:'pointer',fontSize:10,
                  fontWeight:600,fontFamily:'inherit'}}>
                {n.l}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
