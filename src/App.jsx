import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════
// INDIA RISK DASHBOARD — V6.1 — INTELLIGENCE EDITION
// Pure React — NO external libraries
// Updated: March 19, 2026 — 5:00 PM IST (Day 20)
// ═══════════════════════════════════════════════════════════════════

const UPDATED = "March 19, 2026 — 5:00 PM IST";
const WAR_DAY = 20;

const C = {
  bg:"#0f1117",surface:"#171b23",card:"#1c2029",raised:"#242934",
  border:"#282e3c",text:"#d4d8e0",sub:"#8990a0",muted:"#555d70",
  red:"#ef4444",orange:"#f97316",amber:"#eab308",green:"#22c55e",
  cyan:"#06b6d4",purple:"#a855f7",pink:"#ec4899",white:"#f1f5f9",
};

const TICKER = [
  "⚡ SENSEX CRASHES 2,497 pts (-3.26%) — steepest single-day fall in 2 years",
  "🔴 BRENT SURGES TO $117 — Saudi Aramco refineries on FIRE after drone attack on Yanbu",
  "⚡ SOUTH PARS + RAS LAFFAN attacked — ENERGY INFRASTRUCTURE WAR has begun",
  "☢️ BUSHEHR NUCLEAR PLANT struck — first hit on working reactor",
  "🔴 4 top Iranian officials killed in 3 days (Larijani, Soleimani, Khatib + son)",
  "⚠️ IRGC EVACUATION ORDERS for energy assets in Qatar, Saudi Arabia, UAE",
  "🇮🇳 India gas crisis: Qatar supplies 60% of India's natural gas — Ras Laffan HIT",
  "📉 Nifty closes at 23,002 — breaching key support. VIX surges 22%",
  "🇺🇸 Fed holds rates — signals uncertain inflation outlook from war",
  "💰 HDFC Bank chairman RESIGNS citing 'values & ethics' — stock crashes 4.2%",
];

const NAV = [
  {id:"hormuz",l:"🚢 Hormuz"},{id:"economic",l:"📉 Economy"},{id:"kitchen",l:"🍳 Kitchen"},{id:"military",l:"⚔️ Military"},
  {id:"nuclear",l:"☢️ Nuclear"},{id:"projections",l:"📈 Forecast"},{id:"radar",l:"🎯 Radar"},{id:"warlog",l:"📋 Log"},{id:"assessment",l:"🔴 Verdict"},
];

const TL = [
  {d:1,l:"Feb 28",deaths:555,brent:78,nifty:25179,rupee:91.49,tag:"Op. Epic Fury. Khamenei killed",sev:1},
  {d:3,l:"Mar 2",deaths:787,brent:82,nifty:24866,rupee:91.49,tag:"Black Monday. Ras Tanura shut",sev:1},
  {d:5,l:"Mar 4",deaths:1045,brent:85,nifty:24481,rupee:92.30,tag:"IRIS Dena sunk off Sri Lanka",sev:2},
  {d:7,l:"Mar 6",deaths:1332,brent:88,nifty:24450,rupee:91.82,tag:"Oil depots hit. Worst week begins",sev:2},
  {d:9,l:"Mar 8",deaths:1332,brent:93,nifty:24450,rupee:91.82,tag:"Mojtaba Khamenei elected Supreme Leader",sev:2},
  {d:10,l:"Mar 9",deaths:1754,brent:104,nifty:24028,rupee:92.33,tag:"Brent $120 intraday. ₹8.5L cr wiped",sev:3},
  {d:11,l:"Mar 10",deaths:1754,brent:84,nifty:24200,rupee:92.10,tag:"Trump: very complete. Oil crashes",sev:1},
  {d:12,l:"Mar 11",deaths:1966,brent:93,nifty:23867,rupee:92.20,tag:"IEA 400M barrel SPR release",sev:2},
  {d:14,l:"Mar 13",deaths:2100,brent:99,nifty:23151,rupee:92.45,tag:"BLACK FRIDAY — Sensex -1,460",sev:3},
  {d:15,l:"Mar 14",deaths:2100,brent:99,nifty:23151,rupee:92.45,tag:"5K Marines + 10K AI drones deployed",sev:2},
  {d:16,l:"Mar 15",deaths:2200,brent:100,nifty:23151,rupee:92.45,tag:"Gulf exports -61%",sev:2},
  {d:17,l:"Mar 16",deaths:2200,brent:103,nifty:23409,rupee:92.41,tag:"2 Indian LPG tankers cross Hormuz",sev:1},
  {d:18,l:"Mar 17",deaths:2300,brent:103,nifty:23581,rupee:92.41,tag:"Larijani + Soleimani KILLED",sev:3},
  {d:19,l:"Mar 18",deaths:2500,brent:108,nifty:23778,rupee:92.74,tag:"Khatib killed. South Pars attacked. Brent $108",sev:3},
  {d:20,l:"Mar 19",deaths:2700,brent:117,nifty:23002,rupee:92.90,tag:"CRASH -2,497. Ras Laffan + Aramco hit. Brent $117. Bushehr struck",sev:3},
];

const PROJ = [
  {w:"Pre-war",brent:65,rupee:91.0,lpg:803,petrol:94.72,deaths:0},
  {w:"Week 1",brent:85,rupee:92.30,lpg:803,petrol:94.72,deaths:1045},
  {w:"Now",brent:117,rupee:92.90,lpg:913,petrol:103.54,deaths:2700},
  {w:"Week 3*",brent:120,rupee:94.5,lpg:1000,petrol:115,deaths:4000},
  {w:"Week 4*",brent:125,rupee:96.0,lpg:1100,petrol:122,deaths:6000},
  {w:"Week 6*",brent:130,rupee:98.0,lpg:1200,petrol:130,deaths:10000},
  {w:"Week 8*",brent:140,rupee:100.0,lpg:1300,petrol:142,deaths:16000},
];

const HH = [
  {item:"LPG Cylinder (14.2kg)",pre:"₹803",now:"₹913",chg:"+₹110 (+13.7%)",proj:"₹1,000+",note:"Only 10 DAYS stock. Dairy crisis. Ras Laffan hit = 60% of India's gas at risk. Shivalik reached Mundra (5% of monthly need).",s:3},
  {item:"Natural Gas (PNG/CNG)",pre:"Normal",now:"CRITICAL ⚠️",chg:"Supply threat",proj:"Rationing likely",note:"BREAKING: Iran struck Qatar's Ras Laffan (world's largest LNG terminal). India imports 60% of natural gas from Middle East. CNG vehicles + piped gas homes + fertiliser production at SEVERE risk.",s:3},
  {item:"Petrol (Mumbai)",pre:"₹94.72/L",now:"₹103.54/L",chg:"+₹8.82 (+9.3%)",proj:"₹122/L",note:"Brent now $117. Saudi Aramco refineries on fire. Oil cos losing ₹20K cr/day. US diesel $5/gal.",s:3},
  {item:"LPG Commercial (19kg)",pre:"₹1,646",now:"₹1,790",chg:"+₹144 (+8.7%)",proj:"₹2,200",note:"Restaurants shutting menus. 'Gas Crisis Charge' in Bengaluru. Railways seeking alt fuels. Bakeries warn bread shortage.",s:3},
  {item:"Diesel (Mumbai)",pre:"₹82.69/L",now:"₹90.03/L",chg:"+₹7.34 (+8.9%)",proj:"₹105/L",note:"₹1 diesel rise = ₹2,500 cr annual trucking cost. Freight + food transport surging.",s:2},
  {item:"Cooking Oil",pre:"~₹140/L",now:"~₹155/L",chg:"+~₹15 (+10.7%)",proj:"₹185/L",note:"Palm oil +5%. Sunflower +16%. Rupee slide compounds imports.",s:2},
  {item:"Vegetables/Onion",pre:"Stable",now:"Rising",chg:"Transport↑",proj:"₹60-80/kg",note:"400K tons Basmati stuck. Diesel freight costs rising.",s:1},
  {item:"Medicine",pre:"Stable",now:"Stable (for now)",chg:"Coming Apr",proj:"+10-15%",note:"Pharma raw materials costlier. Impact from Q1 FY27.",s:1},
];

const MIL = [
  {t:"🔴 SOUTH PARS + RAS LAFFAN + ARAMCO ATTACKED",lv:"BREAKING",c:C.red,d:"Israel struck South Pars (world's largest gas field, shared with Qatar). Iran retaliated: hit Qatar's Ras Laffan (largest LNG terminal) + Saudi Aramco's Samref refinery in Yanbu (Red Sea). Multiple Aramco facilities on fire. IRGC issued evacuation orders for energy assets in Qatar, Saudi, UAE. THIS IS ENERGY INFRASTRUCTURE WAR."},
  {t:"☢️ Bushehr Nuclear Plant STRUCK",lv:"BREAKING",c:C.red,d:"Iran Atomic Energy Org confirmed 'hostile projectile' struck Bushehr nuclear plant site. No reactor damage claimed. But this crosses an unprecedented threshold — first strike ON a working nuclear facility. Spent fuel rods on site."},
  {t:"4 Top Officials Killed in 72 Hours",lv:"BREAKING",c:C.red,d:"Larijani (security chief) + Soleimani (Basij) + Khatib (intelligence minister) + Larijani's son. IDF authorized killing ANY senior Iranian official on sight. Iran executed Israeli spy. Mojtaba Khamenei: 'not the right time for peace.'"},
  {t:"Brent $117 — Aramco on Fire",lv:"CRITICAL",c:C.red,d:"Brent surged 8.9% to $117 after Saudi drone hit Samref refinery in Yanbu + multiple Aramco facilities. Sensex crashed 2,497 pts (-3.26%). VIX surged 22%. 3-day rally completely wiped."},
  {t:"Hormuz: Indian Tankers Crossed (Fragile)",lv:"CRITICAL",c:C.orange,d:"Shivalik + Nanda Devi crossed under Navy escort. Shivalik reached Mundra. Covers only 5% monthly need. Gulf exports -61%. Iran: 'Hormuz closed to our enemies.' IRGC firing on ships."},
  {t:"IRIS Dena — Indian Ocean War Zone",lv:"CRITICAL",c:C.orange,d:"Iranian frigate torpedoed 40nm off Sri Lanka (87 killed). Returning from Indian Navy MILAN exercise. Iran vowed 'deadly strikes from where enemy least expects.'"},
  {t:"9M Indians in Gulf — Airspace Closures",lv:"HIGH",c:C.amber,d:"52K+ returned. UAE + Qatar airspace closed repeatedly. Saudi, Kuwait all intercepting fire. British Airways suspended Doha flights till Apr 30. NATO deploying more Patriot systems. Australian military HQ in UAE nearly hit."},
  {t:"Israel Ground Ops — Lebanon Exodus",lv:"HIGH",c:C.amber,d:"Ground ops in southern Lebanon. Tyre mass evacuation. 1M+ displaced. 886+ killed incl 111 children. 6 killed + 24 injured in Beirut today. Highrise leveled near govt HQ."},
  {t:"7,200+ Marines — Diplomacy Dead",lv:"CRITICAL",c:C.orange,d:"Marines warship nearing Malacca Strait. Trump: 'not afraid' of boots on ground. Kent resigned: 'we started this war due to pressure from Israel.' Iran reached out — Trump refused. Europe refused. Diplomacy is dead."},
  {t:"Nuclear Fallout Path to India",lv:"ELEVATED",c:C.purple,d:"Natanz DAMAGED. Fordow at 60%. Bushehr NOW STRUCK. DNI Gabbard: enrichment 'obliterated' in June. But 460kg uranium exists. Delhi 4-7 days downwind. No iodine program."},
];

const NUKES = [
  {name:"Natanz",type:"Enrichment",st:"DAMAGED",risk:95,info:"IAEA confirmed. ~460kg enriched uranium. Underground. Tunnel damage."},
  {name:"Isfahan",type:"Conversion",st:"HEAVILY HIT",risk:88,info:"Missile complex destroyed. UCF processes UF6 gas."},
  {name:"Bushehr",type:"Reactor ☢️",st:"HIT",risk:88,info:"CONFIRMED: 'hostile projectile' struck site. First strike on working reactor. Spent fuel on site."},
  {name:"Parchin",type:"Military Nuclear",st:"STRUCK",risk:82,info:"Nuclear weapon component testing facility. Confirmed damage."},
  {name:"Fordow",type:"Underground",st:"UNCERTAIN",risk:75,info:"80m underground. 60% enrichment. 5,000-lb bunker busters used nearby."},
];

const CITIES = [
  {city:"Delhi NCR",pop:"32M",wind:72,sea:15,nuke:50,tot:62,info:"1,800km downwind. Bushehr strike raises risk. NO iodine program."},
  {city:"Mumbai",pop:"21M",wind:40,sea:78,nuke:42,tot:58,info:"900km from Hormuz. Sea + Aramco fire particulates. JNPT at risk."},
  {city:"Ahmedabad",pop:"8.5M",wind:65,sea:55,nuke:46,tot:57,info:"Closest to Iran. Dual vectors. Jamnagar refinery uses Arabian Sea water."},
  {city:"Jaipur",pop:"4M",wind:68,sea:10,nuke:44,tot:47,info:"Rajasthan wind funnel. Aramco smoke plumes may reach in 5-8 days."},
  {city:"Kochi",pop:"2.1M",wind:25,sea:70,nuke:24,tot:44,info:"Southern Naval Command. Oil spill 15-25 days."},
  {city:"Goa",pop:"1.5M",wind:30,sea:72,nuke:22,tot:42,info:"Konkan coast. Fishing ₹4,000 cr. Tourism destroyed."},
  {city:"Lucknow",pop:"3.5M",wind:58,sea:5,nuke:39,tot:40,info:"Indo-Gangetic trap. Inversion layers concentrate particles."},
  {city:"Chennai",pop:"11M",wind:20,sea:55,nuke:18,tot:36,info:"IRIS Dena wreck 400km south. East coast currents."},
];

const RADAR = [
  {axis:"Oil Shock",w1:60,now:98,w4:99},{axis:"Market Crash",w1:45,now:94,w4:90},{axis:"Nuclear Risk",w1:20,now:68,w4:82},
  {axis:"Hormuz Closure",w1:80,now:97,w4:95},{axis:"Household Impact",w1:15,now:92,w4:98},{axis:"Currency Crisis",w1:40,now:86,w4:94},
  {axis:"Social Unrest",w1:25,now:62,w4:75},{axis:"Military Exposure",w1:35,now:90,w4:94},
];

// ═══════ HORMUZ DATA ═══════
const HORMUZ = {
  status: "EFFECTIVELY CLOSED",
  preWarFlow: "25.1M bpd",
  currentFlow: "9.7M bpd (est.)",
  reduction: "61%",
  indianVesselsWaiting: 28,
  indianTransited: 2,
  totalShipsWaiting: "180+",
  lastTransit: "Aframax Karachi (Mar 16)",
  indianNavyEscort: "Op. Sankalp active",
  events: [
    {d:"Mar 4",e:"IRIS Dena torpedoed off Sri Lanka"},
    {d:"Mar 12",e:"3 commercial ships hit in Hormuz"},
    {d:"Mar 15-16",e:"Shivalik + Nanda Devi cross under Navy escort"},
    {d:"Mar 16",e:"Aframax Karachi transits with AIS on"},
    {d:"Mar 18",e:"US drops 5,000-lb bunker busters on Hormuz missile sites"},
    {d:"Mar 19",e:"Saudi Aramco Yanbu refinery hit — Red Sea route threatened too"},
  ]
};

// ═══════ SVG CHARTS ═══════
const MiniLine=({data,dataKey,color,w=320,h=85,showDots=true,labels})=>{const vals=data.map(d=>d[dataKey]);const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;const pts=vals.map((v,i)=>({x:28+(i/(vals.length-1))*(w-46),y:8+(1-(v-mn)/rng)*(h-24),v}));const line=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");const area=line+` L${pts[pts.length-1].x},${h-5} L${pts[0].x},${h-5} Z`;return(<svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:"auto"}}><defs><linearGradient id={`g${dataKey}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.18"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs><path d={area} fill={`url(#g${dataKey})`}/><path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>{showDots&&pts.map((p,i)=>(<g key={i}><circle cx={p.x} cy={p.y} r="2.5" fill={C.surface} stroke={color} strokeWidth="1.2"/><text x={p.x} y={p.y-6} fill={C.sub} fontSize="6" textAnchor="middle" fontWeight="600">{typeof p.v==="number"&&p.v>999?(p.v/1000).toFixed(1)+"k":p.v}</text></g>))}{labels&&data.map((d,i)=>(<text key={i} x={28+(i/(data.length-1))*(w-46)} y={h-0.5} fill={C.muted} fontSize="5.5" textAnchor="middle">{d.l||d.w}</text>))}</svg>);};
const Bar=({value,max=100,color,h=5})=>(<div style={{height:h,background:C.border,borderRadius:h/2,overflow:"hidden",marginTop:3}}><div style={{height:"100%",width:`${Math.min((value/max)*100,100)}%`,background:color||(value>70?C.red:value>50?C.orange:value>30?C.amber:C.green),borderRadius:h/2}}/></div>);
const RadarSVG=({data,w=270,h=270})=>{const cx=w/2,cy=h/2,r=Math.min(cx,cy)-34,n=data.length;const ang=i=>(Math.PI*2*i)/n-Math.PI/2;const xy=(i,v)=>({x:cx+Math.cos(ang(i))*(v/100)*r,y:cy+Math.sin(ang(i))*(v/100)*r});const pg=(k,cl,ds)=>{const p=data.map((d,i)=>xy(i,d[k]));return<polygon points={p.map(pp=>`${pp.x},${pp.y}`).join(" ")} fill={cl+"18"} stroke={cl} strokeWidth={ds?"1.2":"1.8"} strokeDasharray={ds||"none"}/>;};return(<svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:"auto"}}>{[20,40,60,80,100].map(v=>(<polygon key={v} points={data.map((_,i)=>xy(i,v)).map(p=>`${p.x},${p.y}`).join(" ")} fill="none" stroke={C.border} strokeWidth="0.4"/>))}{data.map((_,i)=>{const p=xy(i,100);return<line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={C.border} strokeWidth="0.4"/>;})}{pg("w1",C.green)}{pg("now",C.orange)}{pg("w4",C.red,"3 2")}{data.map((d,i)=>{const p=xy(i,115);return<text key={i} x={p.x} y={p.y} fill={C.sub} fontSize="6" textAnchor="middle" dominantBaseline="middle" fontWeight="600">{d.axis}</text>;})}{[{l:"Week 1",c:C.green,y:h-17},{l:`Now (D${WAR_DAY})`,c:C.orange,y:h-9},{l:"Wk 4 Proj",c:C.red,y:h-1}].map((lg,i)=>(<g key={i}><rect x={8} y={lg.y-4} width={8} height={3} fill={lg.c} rx="1"/><text x={20} y={lg.y-1} fill={C.sub} fontSize="6">{lg.l}</text></g>))}</svg>);};

// ═══════ LAYOUT ═══════
const mono="'SF Mono',Consolas,'Courier New',monospace";
const S=({id,title,sub,accent=C.red,children})=>(<section id={id} style={{marginBottom:30,scrollMarginTop:48}}><div style={{marginBottom:12,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}><h2 style={{margin:0,fontSize:12,fontWeight:700,color:accent,letterSpacing:2,textTransform:"uppercase",fontFamily:mono}}>{title}</h2>{sub&&<p style={{margin:"4px 0 0",fontSize:9.5,color:C.sub,lineHeight:1.5}}>{sub}</p>}</div>{children}</section>);
const Mc=({label,value,sub,delta,accent=C.red})=>(<div style={{background:C.card,borderRadius:6,padding:"10px 7px",textAlign:"center",borderLeft:`3px solid ${accent}`}}><div style={{fontSize:7,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}>{label}</div><div style={{fontSize:16,fontWeight:800,color:accent,marginTop:2,fontFamily:mono}}>{value}</div>{delta&&<div style={{fontSize:7.5,color:delta.startsWith("+")||delta.startsWith("▲")?C.green:C.red,fontWeight:700,marginTop:1,fontFamily:mono}}>{delta}</div>}{sub&&<div style={{fontSize:6.5,color:C.muted,marginTop:1}}>{sub}</div>}</div>);

// ═══════ MAIN ═══════
export default function App(){
  const[projKey,setProjKey]=useState("brent");
  const[expNuke,setExpNuke]=useState(null);
  const[activeNav,setActiveNav]=useState(null);
  const sv=s=>s===3?"🔴":s===2?"🟠":"🟡";
  const go=id=>{setActiveNav(id);document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});};
  const tickerText=TICKER.join("     •     ");

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif",fontSize:12,maxWidth:600,margin:"0 auto",padding:0}}>
      <style>{`@keyframes tk{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>

      {/* ═══ TICKER ═══ */}
      <div style={{background:C.red,padding:"5px 0",overflow:"hidden",whiteSpace:"nowrap"}}>
        <div style={{display:"inline-block",animation:"tk 80s linear infinite",paddingLeft:"100%"}}>
          <span style={{fontSize:9.5,fontWeight:600,color:"#fff"}}>{tickerText}     •     {tickerText}</span>
        </div>
      </div>

      {/* ═══ HEADER ═══ */}
      <header style={{padding:"16px 14px 10px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:6.5,letterSpacing:4,color:C.muted,textTransform:"uppercase",fontWeight:600}}>India Risk Assessment</div>
          <h1 style={{margin:"4px 0 0",fontSize:18,fontWeight:800,color:C.white,lineHeight:1.2}}>How the Iran War<br/>Is Hitting India</h1>
          <div style={{fontSize:7.5,color:C.muted,marginTop:4,fontStyle:"italic"}}>{UPDATED} • 50+ sources</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{background:C.red,color:"#fff",fontSize:12,fontWeight:900,padding:"5px 10px",borderRadius:4,fontFamily:mono}}>DAY {WAR_DAY}</div>
          <div style={{fontSize:7,color:C.muted,marginTop:3,padding:"2px 6px",border:`1px solid ${C.muted}40`,borderRadius:3}}>MARKET: CLOSED</div>
        </div>
      </header>

      {/* ═══ NAV ═══ */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:C.bg+"f0",backdropFilter:"blur(10px)",borderBottom:`1px solid ${C.border}`,padding:"5px 10px"}}>
        <div style={{display:"flex",gap:1,overflowX:"auto",scrollbarWidth:"none"}}>
          {NAV.map(n=>(<button key={n.id} onClick={()=>go(n.id)} style={{flex:"0 0 auto",padding:"3px 8px",border:"none",borderRadius:3,background:activeNav===n.id?C.cyan+"15":"transparent",color:activeNav===n.id?C.cyan:C.sub,cursor:"pointer",fontSize:8.5,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap",borderBottom:activeNav===n.id?`2px solid ${C.cyan}`:"2px solid transparent"}}>{n.l}</button>))}
        </div>
      </nav>

      <div style={{padding:"14px 12px 40px"}}>

      {/* ═══ WHAT CHANGED TODAY ═══ */}
      <div style={{background:C.red+"0c",border:`1px solid ${C.red}20`,borderRadius:6,padding:"10px 12px",marginBottom:16}}>
        <div style={{fontSize:7.5,fontWeight:800,color:C.red,letterSpacing:2,marginBottom:5,fontFamily:mono}}>WHAT CHANGED TODAY — MAR 19</div>
        <div style={{fontSize:9,color:C.text,lineHeight:1.8}}>
          • <strong style={{color:C.red}}>Sensex crashed 2,497 pts</strong> (-3.26%) — steepest single-day fall in 2 years. Nifty breached 23,000 support<br/>
          • <strong style={{color:C.red}}>Brent surged to $117</strong> — Saudi Aramco's Yanbu refinery hit by drone. Multiple Aramco facilities on fire<br/>
          • <strong style={{color:C.orange}}>Iran hit Qatar's Ras Laffan</strong> LNG terminal — India gets 60% of natural gas from Qatar<br/>
          • <strong style={{color:C.purple}}>Bushehr nuclear plant</strong> confirmed struck — first hit on working reactor<br/>
          • <strong style={{color:C.amber}}>HDFC Bank chairman resigned</strong> citing 'values & ethics' — stock crashed 4.2%<br/>
          • <strong style={{color:C.muted}}>Fed held rates</strong> — Powell flagged uncertain inflation outlook from war
        </div>
      </div>

      {/* ═══ METRICS ═══ */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5,marginBottom:18}}>
        <Mc label="War Dead" value="2,700+" delta="" sub="15+ countries" accent={C.red}/>
        <Mc label="Brent" value="$117" delta="▲ +$9 today" sub="was $65 pre-war" accent={C.red}/>
        <Mc label="Nifty" value="23,002" delta="▼ -776 (-3.3%)" sub="2-yr worst day" accent={C.red}/>
        <Mc label="₹/USD" value="92.90" delta="▼ ATL zone" sub="was 91.49" accent={C.orange}/>
      </div>

      {/* ═══ HORMUZ STATUS ═══ */}
      <S id="hormuz" title="🚢 Strait of Hormuz — Shipping Status" sub="Real-time status of the world's most critical oil chokepoint" accent={C.cyan}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
          <div style={{background:C.red+"12",borderRadius:6,padding:10,textAlign:"center",border:`1px solid ${C.red}25`}}>
            <div style={{fontSize:7,color:C.red,fontWeight:700,letterSpacing:1.5}}>STATUS</div>
            <div style={{fontSize:11,fontWeight:900,color:C.red,marginTop:3}}>{HORMUZ.status}</div>
          </div>
          <div style={{background:C.card,borderRadius:6,padding:10,textAlign:"center"}}>
            <div style={{fontSize:7,color:C.muted,fontWeight:700,letterSpacing:1.5}}>OIL FLOW REDUCTION</div>
            <div style={{fontSize:18,fontWeight:900,color:C.orange,marginTop:3,fontFamily:mono}}>{HORMUZ.reduction}</div>
            <div style={{fontSize:7,color:C.sub}}>{HORMUZ.preWarFlow} → {HORMUZ.currentFlow}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
          <div style={{background:C.card,borderRadius:6,padding:8,textAlign:"center"}}>
            <div style={{fontSize:6.5,color:C.muted,letterSpacing:1}}>SHIPS WAITING</div>
            <div style={{fontSize:16,fontWeight:800,color:C.orange,fontFamily:mono}}>{HORMUZ.totalShipsWaiting}</div>
            <div style={{fontSize:6.5,color:C.sub}}>both sides</div>
          </div>
          <div style={{background:C.card,borderRadius:6,padding:8,textAlign:"center"}}>
            <div style={{fontSize:6.5,color:C.muted,letterSpacing:1}}>INDIAN STRANDED</div>
            <div style={{fontSize:16,fontWeight:800,color:C.red,fontFamily:mono}}>{HORMUZ.indianVesselsWaiting}</div>
            <div style={{fontSize:6.5,color:C.sub}}>merchant vessels</div>
          </div>
          <div style={{background:C.card,borderRadius:6,padding:8,textAlign:"center"}}>
            <div style={{fontSize:6.5,color:C.muted,letterSpacing:1}}>INDIAN TRANSITED</div>
            <div style={{fontSize:16,fontWeight:800,color:C.green,fontFamily:mono}}>{HORMUZ.indianTransited}</div>
            <div style={{fontSize:6.5,color:C.sub}}>LPG tankers</div>
          </div>
        </div>
        <div style={{background:C.card,borderRadius:6,padding:10}}>
          <div style={{fontSize:8,fontWeight:700,color:C.cyan,marginBottom:6,letterSpacing:1}}>HORMUZ TIMELINE</div>
          {HORMUZ.events.map((e,i)=>(<div key={i} style={{display:"flex",gap:8,padding:"4px 0",borderBottom:`1px solid ${C.border}25`}}>
            <span style={{fontSize:7.5,color:C.cyan,fontWeight:700,minWidth:42,fontFamily:mono}}>{e.d}</span>
            <span style={{fontSize:8,color:C.sub,lineHeight:1.4}}>{e.e}</span>
          </div>))}
          <div style={{fontSize:7,color:C.muted,marginTop:6}}>🇮🇳 Indian Navy: {HORMUZ.indianNavyEscort} • Last non-Iranian transit: {HORMUZ.lastTransit}</div>
        </div>
      </S>

      {/* ═══ 1. ECONOMIC ═══ */}
      <S id="economic" title="Economic Impact" sub="Energy infrastructure war = direct hit on India's economy" accent={C.orange}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
          <Mc label="Wealth Destroyed" value="₹24.5L+ Cr" delta="" sub="since war began" accent={C.red}/>
          <Mc label="FPI (Mar)" value="$6.9B+" delta="₹73,700 Cr MTD" sub="FII selling" accent={C.red}/>
          <Mc label="Oil Loss/Day" value="₹20K Cr" delta="" sub="OMCs bleeding" accent={C.orange}/>
          <Mc label="VIX" value="+22%" delta="▲ surged today" sub="extreme fear" accent={C.red}/>
        </div>
        <div style={{background:C.card,borderRadius:6,padding:12,marginBottom:8}}><div style={{fontSize:9,fontWeight:700,color:C.cyan,marginBottom:5,letterSpacing:1,textTransform:"uppercase"}}>Nifty 50 — 20-Day Track</div><MiniLine data={TL} dataKey="nifty" color={C.cyan} labels showDots/></div>
        <div style={{background:C.card,borderRadius:6,padding:12,marginBottom:8}}><div style={{fontSize:9,fontWeight:700,color:C.orange,marginBottom:5,letterSpacing:1,textTransform:"uppercase"}}>Brent Crude ($) — 20-Day</div><MiniLine data={TL} dataKey="brent" color={C.orange} labels showDots/></div>
      </S>

      {/* ═══ 2. KITCHEN ═══ */}
      <S id="kitchen" title="Your Kitchen Table" sub="Gas crisis deepens — Qatar's Ras Laffan hit overnight" accent={C.amber}>
        {HH.map((h,i)=>(<div key={i} style={{background:C.card,borderRadius:6,padding:10,marginBottom:6,borderLeft:`3px solid ${h.s===3?C.red:h.s===2?C.orange:C.amber}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:4}}><span style={{fontSize:10,fontWeight:700,color:C.white}}>{sv(h.s)} {h.item}</span><span style={{fontSize:9.5,fontWeight:800,color:C.red,fontFamily:mono}}>{h.chg}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:8,color:C.sub,flexWrap:"wrap",gap:2}}><span>Pre: {h.pre}</span><span style={{color:C.orange,fontWeight:700}}>Now: {h.now}</span><span style={{color:C.red}}>4wk: {h.proj}</span></div>
          <div style={{fontSize:7.5,color:C.muted,marginTop:5,lineHeight:1.6}}>{h.note}</div>
        </div>))}
      </S>

      {/* ═══ 3. MILITARY ═══ */}
      <S id="military" title="Military & Strategic Exposure" sub="Energy infrastructure war + assassination campaign" accent={C.red}>
        {MIL.map((m,i)=>(<div key={i} style={{background:m.lv==="BREAKING"?C.red+"0a":C.card,border:m.lv==="BREAKING"?`1px solid ${C.red}20`:"none",borderRadius:6,padding:10,marginBottom:6,borderLeft:`3px solid ${m.c}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4}}><span style={{fontSize:9.5,fontWeight:700,color:C.white,flex:1}}>{m.t}</span><span style={{fontSize:6.5,padding:"2px 7px",borderRadius:3,background:m.lv==="BREAKING"?C.red:`${m.c}20`,color:m.lv==="BREAKING"?"#fff":m.c,fontWeight:800,whiteSpace:"nowrap"}}>{m.lv}</span></div>
          <div style={{fontSize:7.5,color:C.muted,marginTop:5,lineHeight:1.6}}>{m.d}</div>
        </div>))}
      </S>

      {/* ═══ 4. NUCLEAR ═══ */}
      <S id="nuclear" title="☢️ Nuclear Exposure" sub="Bushehr struck. What does this mean for India?" accent={C.purple}>
        <div style={{background:C.purple+"0c",border:`1px solid ${C.purple}18`,borderRadius:6,padding:10,marginBottom:12,fontSize:9,color:C.sub,lineHeight:1.6}}>
          <strong style={{color:C.purple}}>Bushehr — a working nuclear reactor — has been struck.</strong> First confirmed hit on an active nuclear facility. 460kg enriched uranium across Iran's sites. Delhi 4-7 days downwind. India has NO iodine program.
        </div>
        {NUKES.map((n,i)=>(<div key={i} onClick={()=>setExpNuke(expNuke===i?null:i)} style={{background:C.card,borderRadius:6,padding:10,marginBottom:5,cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:10.5,fontWeight:700,color:n.risk>85?C.red:n.risk>70?C.orange:C.amber}}>{n.name}</span><span style={{fontSize:7.5,color:C.muted,marginLeft:5}}>{n.type}</span></div><span style={{fontSize:7,padding:"2px 6px",borderRadius:3,fontWeight:800,background:n.st.includes("HIT")||n.st.includes("DAMAGED")||n.st.includes("STRUCK")?C.red+"15":C.orange+"12",color:n.st.includes("HIT")||n.st.includes("DAMAGED")||n.st.includes("STRUCK")?C.red:C.orange}}>{n.st}</span></div>
          <Bar value={n.risk} color={n.risk>85?C.red:n.risk>70?C.orange:C.amber}/><div style={{fontSize:6.5,color:C.muted,marginTop:2,textAlign:"right"}}>{n.risk}/100 {expNuke===i?"▲":"▼"}</div>
          {expNuke===i&&<div style={{fontSize:7.5,color:C.sub,marginTop:5,lineHeight:1.6,borderTop:`1px solid ${C.border}`,paddingTop:5}}>{n.info}</div>}
        </div>))}
        <div style={{fontSize:9,fontWeight:700,color:C.pink,marginTop:16,marginBottom:6,letterSpacing:1,textTransform:"uppercase"}}>Indian City Exposure</div>
        {CITIES.map((c,i)=>(<div key={i} style={{background:C.card,borderRadius:6,padding:10,marginBottom:5}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:11,fontWeight:800,color:C.white}}>{c.city}</span><span style={{fontSize:7,color:C.muted,marginLeft:5}}>{c.pop}</span></div><span style={{fontSize:14,fontWeight:900,color:c.tot>55?C.red:c.tot>42?C.orange:C.amber,fontFamily:mono}}>{c.tot}<span style={{fontSize:7}}>/100</span></span></div>
          <div style={{display:"flex",gap:6,marginTop:5}}>{[{l:"Wind",v:c.wind,cl:C.orange},{l:"Sea",v:c.sea,cl:C.cyan},{l:"Nuke",v:c.nuke,cl:C.purple}].map((vv,j)=>(<div key={j} style={{flex:1}}><div style={{fontSize:6,color:vv.cl,fontWeight:600}}>{vv.l}: {vv.v}</div><Bar value={vv.v} color={vv.cl} h={4}/></div>))}</div>
          <div style={{fontSize:7,color:C.muted,marginTop:4,lineHeight:1.5}}>{c.info}</div>
        </div>))}
      </S>

      {/* ═══ 5. PROJECTIONS ═══ */}
      <S id="projections" title="If This Continues..." sub="Nifty excluded (too volatile). Energy-focused projections." accent={C.cyan}>
        <div style={{display:"flex",gap:3,marginBottom:8,flexWrap:"wrap"}}>
          {[{k:"brent",l:"Oil"},{k:"rupee",l:"₹"},{k:"petrol",l:"Petrol"},{k:"lpg",l:"LPG"},{k:"deaths",l:"Deaths"}].map(m=>(<button key={m.k} onClick={()=>setProjKey(m.k)} style={{padding:"3px 10px",border:projKey===m.k?`1px solid ${C.cyan}`:`1px solid ${C.border}`,borderRadius:3,background:projKey===m.k?C.cyan+"12":"transparent",color:projKey===m.k?C.cyan:C.sub,cursor:"pointer",fontSize:8,fontWeight:700,fontFamily:"inherit"}}>{m.l}</button>))}
        </div>
        <div style={{background:C.card,borderRadius:6,padding:12,marginBottom:8}}>
          <MiniLine data={PROJ} dataKey={projKey} color={C.cyan} labels showDots/>
        </div>
        <div style={{background:C.card,borderRadius:6,padding:12,overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:7.5,minWidth:280}}>
            <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["","Pre","Now","Wk3","Wk4","Wk8"].map((h,i)=>(<th key={i} style={{padding:"4px 2px",textAlign:i===0?"left":"right",color:i>2?C.amber:C.muted,fontWeight:700}}>{h}</th>))}</tr></thead>
            <tbody>{[{m:"Brent",v:[65,117,120,125,140]},{m:"₹/USD",v:[91.0,92.90,94.5,96.0,100.0]},{m:"Petrol",v:["₹94.72","₹103.54","₹115","₹122","₹142"]},{m:"LPG",v:["₹803","₹913","₹1,000","₹1,100","₹1,300"]},{m:"Deaths",v:[0,"2,700+","4,000","6,000","16,000"]}].map((r,i)=>(<tr key={i} style={{borderBottom:`1px solid ${C.border}25`}}><td style={{padding:"4px 2px",fontWeight:700,color:C.text}}>{r.m}</td>{r.v.map((v,j)=>(<td key={j} style={{padding:"4px 2px",textAlign:"right",color:j===0?C.green:j===1?C.red:C.amber,fontWeight:600}}>{v}</td>))}</tr>))}</tbody>
          </table>
        </div>
      </S>

      {/* ═══ 6. RADAR ═══ */}
      <S id="radar" title="Risk Radar" sub="Week 1 → Now → Week 4" accent={C.cyan}>
        <div style={{background:C.card,borderRadius:6,padding:12}}><RadarSVG data={RADAR}/></div>
      </S>

      {/* ═══ 7. WAR LOG ═══ */}
      <S id="warlog" title="20-Day War Log" accent={C.muted}>
        <div style={{background:C.card,borderRadius:6,padding:12}}>
          {[...TL].reverse().map((d,i)=>(<div key={i} style={{padding:"5px 0",borderBottom:`1px solid ${C.border}25`,display:"flex",gap:8,alignItems:"flex-start"}}>
            <div style={{minWidth:38}}><div style={{fontSize:9,fontWeight:800,color:d.sev===3?C.red:d.sev===2?C.orange:C.green,fontFamily:mono}}>D{d.d}</div><div style={{fontSize:6,color:C.muted}}>{d.l}</div></div>
            <div style={{fontSize:7.5,color:C.sub,lineHeight:1.5}}>{d.tag}</div>
          </div>))}
        </div>
      </S>

      {/* ═══ 8. ASSESSMENT ═══ */}
      <S id="assessment" title="Strategic Assessment" accent={C.red}>
        <div style={{background:C.red+"08",border:`1px solid ${C.red}15`,borderRadius:6,padding:14}}>
          <div style={{fontSize:9.5,lineHeight:1.85,color:C.sub}}>
            <strong style={{color:C.red,fontSize:12}}>Day 20. Energy infrastructure war has begun. India is in the blast radius.</strong><br/><br/>
            Israel struck South Pars. Iran hit Ras Laffan + Saudi Aramco. Brent $117. Sensex crashed 2,497 — steepest in 2 years. 4 top officials killed in 72 hours. Bushehr nuclear plant struck. Diplomacy dead. Trump "not afraid" of ground troops. His own counterterrorism director quit.<br/><br/>
            <strong style={{color:C.orange}}>For India, this is an energy emergency.</strong> Qatar = 60% of natural gas. Ras Laffan hit. LPG 10 days stock. Petrol will breach ₹110+ at $117 Brent. Rupee 92.90. VIX +22%. ₹24.5 lakh crore destroyed since war began. HDFC Bank chairman resigned — domestic shocks compounding war shocks.<br/><br/>
            <strong style={{color:C.purple}}>Bushehr nuclear reactor has been struck.</strong> First-ever hit on a working nuclear plant in this war. 460kg enriched uranium exists. Delhi 4-7 days downwind. India has no preparedness plan.<br/><br/>
            <strong style={{color:C.cyan}}>India must act now:</strong> Emergency gas rationing. Non-Gulf LPG acceleration. Rupee defense. Nuclear monitoring. Food supply protection. This is India's crisis — not a distant war.
          </div>
        </div>
      </S>

      {/* ═══ FOOTER ═══ */}
      <footer style={{padding:"12px 0",borderTop:`1px solid ${C.border}`,marginTop:8}}>
        <div style={{fontSize:6.5,color:C.muted,lineHeight:1.7}}>
          <strong style={{color:C.sub}}>Sources:</strong> Al Jazeera, CNN, CBS, NBC, ABC, AP, Reuters, Bloomberg, Euronews, Iran International, Times of Israel, ACLED, Atlantic Council, Amnesty Intl, Business Standard, BusinessToday, Goodreturns, News24, Trading Economics, Fortune, Wikipedia, IAEA, HRW, CSIS, IEA, EIA, Kpler, MarineTraffic, MUFG, ORF, MEA India, Nomura, Elara, UBS, HSBC, Kotak, JM Financial, ICRA, Motilal Oswal, SBI Securities, Choice Broking
          <br/><br/>
          <strong style={{color:C.sub}}>Methodology:</strong> Nuclear/contamination scores are analytical estimates — NOT confirmed measurements. Projections are trend extrapolations, not forecasts. Nifty projections excluded. All timestamps IST (UTC+5:30). Hormuz shipping data from Kpler, MarineTraffic, and news reports.
          <br/><br/>
          <strong style={{color:C.sub}}>Disclaimer:</strong> Built with AI tools. Ongoing project. Not financial, safety, or evacuation advice.
        </div>
      </footer>
      </div>
    </div>
  );
}
