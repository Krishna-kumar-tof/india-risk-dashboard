import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════
// INDIA RISK DASHBOARD — V6.0 — PROFESSIONAL INTELLIGENCE EDITION
// Pure React + inline CSS animations — NO external libraries
// Updated: March 19, 2026 — 9:00 AM IST (Day 20)
// ═══════════════════════════════════════════════════════════════════

const UPDATED = "March 19, 2026 — 9:00 AM IST";
const WAR_DAY = 20;

const C = {
  bg:"#101218",surface:"#181c24",card:"#1e222c",raised:"#252a36",
  border:"#2a303e",text:"#d4d8e0",sub:"#8990a0",muted:"#555d70",
  red:"#ef4444",orange:"#f97316",amber:"#eab308",green:"#22c55e",
  cyan:"#06b6d4",purple:"#a855f7",pink:"#ec4899",white:"#f8fafc",
};

const TICKER_ITEMS = [
  "⚡ SOUTH PARS GAS FIELD (world's largest) ATTACKED by Israel — Iran retaliates by striking Qatar's RAS LAFFAN LNG terminal",
  "🔴 BRENT CRUDE surges to $112 — highest since war began",
  "📉 GIFT Nifty signals -453 point GAP DOWN opening today (Mar 19)",
  "☢️ BUSHEHR NUCLEAR PLANT hit by 'hostile projectile' — Iran Atomic Energy Org confirms",
  "🔴 Intel Minister KHATIB killed — 4th top official in 3 days — Iran confirms",
  "⚠️ IRGC issues EVACUATION ORDERS for energy assets in Qatar, Saudi Arabia, UAE",
  "🇺🇸 Fed holds rates steady — uncertain inflation outlook due to Iran war",
  "🇮🇳 India gas crisis deepens — Qatar supplies 60% of India's natural gas — Ras Laffan hit",
  "🇺🇦 200+ Ukrainian anti-drone experts deployed to Middle East",
  "📉 Asia tumbles — Nikkei -2.74%, Kospi -2.50% — global risk-off",
];

const NAV = [
  {id:"economic",l:"Economy"},{id:"kitchen",l:"Kitchen"},{id:"military",l:"Military"},{id:"nuclear",l:"Nuclear"},
  {id:"projections",l:"Forecast"},{id:"radar",l:"Radar"},{id:"warlog",l:"War Log"},{id:"assessment",l:"Verdict"},
];

const TL = [
  {d:1,l:"Feb 28",deaths:555,brent:78,nifty:25179,rupee:91.49,tag:"Op. Epic Fury. Khamenei killed"},
  {d:3,l:"Mar 2",deaths:787,brent:82,nifty:24866,rupee:91.49,tag:"Black Monday. Ras Tanura shut"},
  {d:5,l:"Mar 4",deaths:1045,brent:85,nifty:24481,rupee:92.30,tag:"IRIS Dena sunk off Sri Lanka"},
  {d:7,l:"Mar 6",deaths:1332,brent:88,nifty:24450,rupee:91.82,tag:"Oil depots hit. Worst week"},
  {d:9,l:"Mar 8",deaths:1332,brent:93,nifty:24450,rupee:91.82,tag:"Mojtaba Khamenei elected"},
  {d:10,l:"Mar 9",deaths:1754,brent:104,nifty:24028,rupee:92.33,tag:"Brent $120 intraday"},
  {d:11,l:"Mar 10",deaths:1754,brent:84,nifty:24200,rupee:92.10,tag:"Trump: very complete. Oil crash"},
  {d:12,l:"Mar 11",deaths:1966,brent:93,nifty:23867,rupee:92.20,tag:"IEA 400M barrel SPR release"},
  {d:14,l:"Mar 13",deaths:2100,brent:99,nifty:23151,rupee:92.45,tag:"BLACK FRIDAY -1,460 on Sensex"},
  {d:15,l:"Mar 14",deaths:2100,brent:99,nifty:23151,rupee:92.45,tag:"5K Marines + AI drones deployed"},
  {d:16,l:"Mar 15",deaths:2200,brent:100,nifty:23151,rupee:92.45,tag:"Gulf exports -61%"},
  {d:17,l:"Mar 16",deaths:2200,brent:103,nifty:23409,rupee:92.41,tag:"2 Indian LPG tankers cross Hormuz"},
  {d:18,l:"Mar 17",deaths:2300,brent:103,nifty:23581,rupee:92.41,tag:"Larijani + Soleimani KILLED"},
  {d:19,l:"Mar 18",deaths:2500,brent:108,nifty:23778,rupee:92.74,tag:"Khatib killed. South Pars hit. Brent $108"},
  {d:20,l:"Mar 19",deaths:2600,brent:112,nifty:23325,rupee:92.80,tag:"Ras Laffan hit. Bushehr struck. Asia crash"},
];

const PROJ = [
  {w:"Pre-war",brent:65,rupee:91.0,lpg:803,petrol:94.72,deaths:0},
  {w:"Week 1",brent:85,rupee:92.30,lpg:803,petrol:94.72,deaths:1045},
  {w:"Now",brent:112,rupee:92.80,lpg:913,petrol:103.54,deaths:2600},
  {w:"Week 3*",brent:115,rupee:94.0,lpg:980,petrol:112,deaths:3800},
  {w:"Week 4*",brent:120,rupee:95.5,lpg:1050,petrol:118,deaths:5500},
  {w:"Week 6*",brent:125,rupee:97.0,lpg:1100,petrol:125,deaths:9000},
  {w:"Week 8*",brent:130,rupee:99.0,lpg:1200,petrol:135,deaths:14000},
];

const HH = [
  {item:"LPG Cylinder (14.2kg)",pre:"₹803",now:"₹913",chg:"+₹110 (+13.7%)",proj:"₹980+",note:"Only 10 DAYS stock. Dairy crisis looming. Shivalik reached Mundra (5% of monthly need). Qatar's Ras Laffan LNG terminal HIT by Iran overnight — 60% of India's natural gas comes via Qatar. Catastrophic if sustained.",s:3},
  {item:"LPG Commercial (19kg)",pre:"₹1,646",now:"₹1,790",chg:"+₹144 (+8.7%)",proj:"₹2,200",note:"Restaurants dropping menu items. Bengaluru cafe charging 'Gas Crisis Charge.' Railways advised caterers to find alt fuels. Bakeries warn bread shortage.",s:3},
  {item:"Petrol (Mumbai)",pre:"₹94.72/L",now:"₹103.54/L",chg:"+₹8.82 (+9.3%)",proj:"₹118/L",note:"Brent now $112. Oil cos losing ₹20,000 cr/day. JM Financial: every $1 oil = $2B added to India's import bill. US diesel $5/gallon.",s:3},
  {item:"Diesel (Mumbai)",pre:"₹82.69/L",now:"₹90.03/L",chg:"+₹7.34 (+8.9%)",proj:"₹102/L",note:"Every ₹1 diesel rise = ₹2,500 cr annual trucking cost. Freight + food transport rising fast.",s:2},
  {item:"Cooking Oil",pre:"~₹140/L",now:"~₹155/L",chg:"+~₹15 (+10.7%)",proj:"₹180/L",note:"Palm oil +5%. Sunflower +16%. India import-dependent. Rupee slide compounds.",s:2},
  {item:"Natural Gas (PNG)",pre:"Normal",now:"CRITICAL",chg:"Supply threat",proj:"Rationing likely",note:"BREAKING: Iran struck Qatar's Ras Laffan (world's largest LNG terminal). India imports 60% of natural gas from Middle East. CNG + piped gas to homes at severe risk. Fertiliser production threatened.",s:3},
  {item:"Onion / Vegetables",pre:"Stable",now:"Rising",chg:"Transport↑",proj:"₹60-80/kg",note:"400K tons Basmati stuck at ports. Diesel-driven freight costs rising.",s:1},
  {item:"Medicine",pre:"Stable",now:"Stable (for now)",chg:"Coming Apr",proj:"+10-15%",note:"Pharma raw materials costlier. Liquid paraffin +26% YoY. Nomura: impact from Q1 FY27.",s:1},
];

const MIL = [
  {t:"🔴 SOUTH PARS + RAS LAFFAN ATTACKED",lv:"BREAKING",c:C.red,d:"Israel struck Iran's South Pars (world's LARGEST natural gas field, shared with Qatar). Iran retaliated by hitting Qatar's Ras Laffan — world's largest LNG export terminal. IRGC issued evacuation orders for energy assets in Qatar, Saudi Arabia, UAE. This is ENERGY INFRASTRUCTURE WAR. India gets 60% of natural gas from Middle East — catastrophic if sustained."},
  {t:"☢️ Bushehr Nuclear Plant HIT",lv:"BREAKING",c:C.red,d:"Iran's Atomic Energy Organization confirmed 'hostile projectile' struck Bushehr nuclear power plant site. No casualties or damage to reactor reported — but this is the first confirmed strike ON a working nuclear facility. Spent fuel rods on site. Escalation threshold crossed."},
  {t:"Intel Min. Khatib KILLED (Mar 18)",lv:"BREAKING",c:C.red,d:"Iran confirmed Intelligence Minister Esmail Khatib killed. 4th top official in 3 days (Larijani, Soleimani, Khatib + son). IDF authorized to kill ANY senior Iranian official on sight. Katz: 'significant surprises expected in all arenas.'"},
  {t:"Brent $112 — Oil Shock Deepens",lv:"CRITICAL",c:C.orange,d:"Brent surged +4.7% to $108-112 overnight after South Pars/Ras Laffan attacks. GIFT Nifty signals -453 point gap-down open. Asia crashing: Nikkei -2.74%, Kospi -2.50%. Fed held rates but flagged uncertain inflation outlook. Gold fell below $5,000."},
  {t:"Hormuz: 2 Indian LPG Tankers Crossed",lv:"CRITICAL",c:C.orange,d:"Shivalik (45K MT) + Nanda Devi crossed Hormuz under Navy escort. Shivalik reached Mundra. But covers only 5% of monthly need. Gulf exports -61%. Iran: Hormuz 'closed to our enemies.'"},
  {t:"IRIS Dena — War in Indian Ocean",lv:"CRITICAL",c:C.orange,d:"Iranian frigate torpedoed off Sri Lanka (87 killed). Was returning from Indian Navy MILAN exercise. Iran's Navy vowed 'deadly strikes from where the enemy least expects.'"},
  {t:"9M Indians in Gulf — UAE Airspace Closed Again",lv:"HIGH",c:C.amber,d:"52K+ returned. UAE closed airspace AGAIN (Mar 18). Saudi, Qatar, Kuwait all intercepting fire. 6 killed + 24 injured in Beirut strikes. Tyre mass evacuation. NATO Patriot systems deploying to Turkey. Australian military HQ in UAE nearly hit."},
  {t:"Israel Ground Ops — Tyre Exodus",lv:"HIGH",c:C.amber,d:"Israel 'limited ground ops' in southern Lebanon. Tyre mass evacuation (4th largest city). 1M+ displaced (20% of population). 886+ killed incl 111 children. Beirut highrise leveled near govt HQ."},
  {t:"7,200+ Marines — Diplomacy Dead",lv:"CRITICAL",c:C.orange,d:"US warship with Marines nearing Malacca Strait. IRGC warned US industrial facilities face 'imminent attack.' 200 US troops injured in 7 countries. Counterterrorism Director Kent RESIGNED. Iran reached out — Trump refused. Khamenei: 'not the right time for peace.'"},
  {t:"Nuclear Fallout Path to India",lv:"ELEVATED",c:C.purple,d:"Natanz DAMAGED (IAEA confirmed). Fordow at 60%. Bushehr NOW STRUCK. DNI Gabbard: enrichment program 'obliterated' in June strikes. But 460kg enriched uranium still exists. Delhi 4-7 days downwind. No iodine program."},
];

const NUKES = [
  {name:"Natanz",type:"Enrichment",st:"DAMAGED",risk:95,info:"IAEA confirmed. ~460kg enriched uranium. Underground halls. Tunnel damage visible on satellite."},
  {name:"Isfahan",type:"Conversion+Missile",st:"HEAVILY HIT",risk:88,info:"Missile complex destroyed. UCF processes UF6 gas. Significant debris field."},
  {name:"Parchin",type:"Military Nuclear",st:"STRUCK",risk:82,info:"Taleghan 2: nuclear weapon component testing. Confirmed damage."},
  {name:"Fordow",type:"Underground",st:"UNCERTAIN",risk:75,info:"80m under mountain. 60% enrichment. 5,000-lb bunker busters used nearby."},
  {name:"Bushehr",type:"Reactor",st:"HIT ☢️",risk:85,info:"CONFIRMED: 'hostile projectile' struck site (Iran Atomic Energy Org). No reactor damage reported. Spent fuel rods on site. First strike ON a working nuclear plant."},
];

const CITIES = [
  {city:"Delhi NCR",pop:"32M",wind:72,sea:15,nuke:48,tot:60,info:"1,800km downwind. March westerlies 3-5 days. Bushehr strike increases risk. NO iodine program."},
  {city:"Mumbai",pop:"21M",wind:40,sea:78,nuke:40,tot:56,info:"900km from Hormuz. Sea currents carry contaminants. JNPT + fishing at risk."},
  {city:"Ahmedabad",pop:"8.5M",wind:65,sea:55,nuke:44,tot:55,info:"Closest to Iran. Dual wind + maritime vectors. Jamnagar refinery takes Arabian Sea water."},
  {city:"Jaipur",pop:"4M",wind:68,sea:10,nuke:42,tot:46,info:"Rajasthan desert wind funnel. March dust storms carry Iranian plateau particles."},
  {city:"Kochi",pop:"2.1M",wind:25,sea:70,nuke:22,tot:43,info:"Southern Naval Command. Oil spill reaches coast 15-25 days."},
  {city:"Goa",pop:"1.5M",wind:30,sea:72,nuke:20,tot:41,info:"Konkan coast. Fishing economy ₹4,000 cr. Tourism devastated."},
  {city:"Lucknow",pop:"3.5M",wind:58,sea:5,nuke:37,tot:39,info:"Indo-Gangetic plain traps pollutants. Inversion layers concentrate particles."},
  {city:"Chennai",pop:"11M",wind:20,sea:55,nuke:17,tot:35,info:"IRIS Dena wreck 400km south. East coast currents."},
];

const RADAR = [
  {axis:"Oil Shock",w1:60,now:96,w4:98},{axis:"Market Crash",w1:45,now:90,w4:88},{axis:"Nuclear Risk",w1:20,now:65,w4:78},
  {axis:"Hormuz Closure",w1:80,now:96,w4:94},{axis:"Household Impact",w1:15,now:90,w4:96},{axis:"Currency Crisis",w1:40,now:84,w4:92},
  {axis:"Social Unrest",w1:25,now:60,w4:72},{axis:"Military Exposure",w1:35,now:88,w4:92},
];

// ═══════ SVG CHARTS ═══════
const MiniLine=({data,dataKey,color,w=320,h=90,showDots=true,labels})=>{const vals=data.map(d=>d[dataKey]);const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;const pts=vals.map((v,i)=>({x:28+(i/(vals.length-1))*(w-46),y:8+(1-(v-mn)/rng)*(h-26),v}));const line=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");const area=line+` L${pts[pts.length-1].x},${h-6} L${pts[0].x},${h-6} Z`;return(<svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:"auto"}}><defs><linearGradient id={`g${dataKey}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.2"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs><path d={area} fill={`url(#g${dataKey})`}/><path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>{showDots&&pts.map((p,i)=>(<g key={i}><circle cx={p.x} cy={p.y} r="2.5" fill={C.surface} stroke={color} strokeWidth="1.2"/><text x={p.x} y={p.y-7} fill={C.sub} fontSize="6.5" textAnchor="middle" fontWeight="600">{typeof p.v==="number"&&p.v>999?(p.v/1000).toFixed(1)+"k":p.v}</text></g>))}{labels&&data.map((d,i)=>(<text key={i} x={28+(i/(data.length-1))*(w-46)} y={h-0.5} fill={C.muted} fontSize="6" textAnchor="middle">{d.l||d.w}</text>))}</svg>);};
const Bar=({value,max=100,color,h=5})=>(<div style={{height:h,background:C.border,borderRadius:h/2,overflow:"hidden",marginTop:3}}><div style={{height:"100%",width:`${Math.min((value/max)*100,100)}%`,background:color||(value>70?C.red:value>50?C.orange:value>30?C.amber:C.green),borderRadius:h/2}}/></div>);
const RadarSVG=({data,w=280,h=280})=>{const cx=w/2,cy=h/2,r=Math.min(cx,cy)-36,n=data.length;const ang=i=>(Math.PI*2*i)/n-Math.PI/2;const xy=(i,v)=>({x:cx+Math.cos(ang(i))*(v/100)*r,y:cy+Math.sin(ang(i))*(v/100)*r});const pg=(k,cl,ds)=>{const p=data.map((d,i)=>xy(i,d[k]));return<polygon points={p.map(pp=>`${pp.x},${pp.y}`).join(" ")} fill={cl+"18"} stroke={cl} strokeWidth={ds?"1.2":"1.8"} strokeDasharray={ds||"none"}/>;};return(<svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:"auto"}}>{[20,40,60,80,100].map(v=>(<polygon key={v} points={data.map((_,i)=>xy(i,v)).map(p=>`${p.x},${p.y}`).join(" ")} fill="none" stroke={C.border} strokeWidth="0.4"/>))}{data.map((_,i)=>{const p=xy(i,100);return<line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={C.border} strokeWidth="0.4"/>;})}{pg("w1",C.green)}{pg("now",C.orange)}{pg("w4",C.red,"3 2")}{data.map((d,i)=>{const p=xy(i,115);return<text key={i} x={p.x} y={p.y} fill={C.sub} fontSize="6.5" textAnchor="middle" dominantBaseline="middle" fontWeight="600">{d.axis}</text>;})}{[{l:"Week 1",c:C.green,y:h-18},{l:`Now (Day ${WAR_DAY})`,c:C.orange,y:h-10},{l:"Week 4 Proj.",c:C.red,y:h-2}].map((lg,i)=>(<g key={i}><rect x={8} y={lg.y-4} width={8} height={3} fill={lg.c} rx="1"/><text x={20} y={lg.y-1} fill={C.sub} fontSize="6.5">{lg.l}</text></g>))}</svg>);};

// ═══════ LAYOUT ═══════
const S=({id,title,sub,accent=C.red,children})=>(<section id={id} style={{marginBottom:32,scrollMarginTop:52}}><div style={{marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}><h2 style={{margin:0,fontSize:13,fontWeight:700,color:accent,letterSpacing:2,textTransform:"uppercase",fontFamily:"'SF Mono',Consolas,monospace"}}>{title}</h2>{sub&&<p style={{margin:"5px 0 0",fontSize:10,color:C.sub,lineHeight:1.5}}>{sub}</p>}</div>{children}</section>);
const M=({label,value,sub,accent=C.red,big})=>(<div style={{background:C.card,borderRadius:8,padding:big?"14px 8px":"10px 6px",textAlign:"center",borderLeft:`3px solid ${accent}`}}><div style={{fontSize:7.5,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}>{label}</div><div style={{fontSize:big?20:15,fontWeight:800,color:accent,marginTop:3,fontFamily:"'SF Mono',Consolas,monospace"}}>{value}</div>{sub&&<div style={{fontSize:7,color:C.sub,marginTop:2}}>{sub}</div>}</div>);

// ═══════ MAIN ═══════
export default function App(){
  const[projKey,setProjKey]=useState("brent");
  const[expNuke,setExpNuke]=useState(null);
  const[activeNav,setActiveNav]=useState(null);
  const sv=s=>s===3?"🔴":s===2?"🟠":"🟡";
  const go=id=>{setActiveNav(id);document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});};

  // Ticker CSS
  const tickerCSS=`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`;
  const tickerText=TICKER_ITEMS.join("     •     ");

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"system-ui,-apple-system,'Segoe UI',sans-serif",fontSize:12,maxWidth:600,margin:"0 auto",padding:0}}>
      <style>{tickerCSS}</style>

      {/* ═══ SCROLLING TICKER ═══ */}
      <div style={{background:C.red,padding:"6px 0",overflow:"hidden",whiteSpace:"nowrap",position:"relative"}}>
        <div style={{display:"inline-block",animation:"ticker 60s linear infinite",paddingLeft:"100%"}}>
          <span style={{fontSize:10,fontWeight:600,color:"#fff",letterSpacing:0.3}}>{tickerText}     •     {tickerText}</span>
        </div>
      </div>

      {/* ═══ HEADER ═══ */}
      <header style={{padding:"20px 16px 14px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:7,letterSpacing:4,color:C.muted,textTransform:"uppercase",fontWeight:600,marginBottom:4}}>India Risk Assessment</div>
            <h1 style={{margin:0,fontSize:20,fontWeight:800,color:C.white,lineHeight:1.2}}>How the Iran War<br/>Is Hitting India</h1>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{background:C.red,color:"#fff",fontSize:11,fontWeight:800,padding:"4px 10px",borderRadius:4,fontFamily:"'SF Mono',Consolas,monospace"}}>DAY {WAR_DAY}</div>
            <div style={{fontSize:7,color:C.muted,marginTop:4}}>{UPDATED}</div>
          </div>
        </div>
      </header>

      {/* ═══ NAV ═══ */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:C.bg+"f0",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:`1px solid ${C.border}`,padding:"6px 12px"}}>
        <div style={{display:"flex",gap:2,overflowX:"auto",scrollbarWidth:"none"}}>
          {NAV.map(n=>(<button key={n.id} onClick={()=>go(n.id)} style={{flex:"0 0 auto",padding:"4px 10px",border:"none",borderRadius:4,background:activeNav===n.id?C.cyan+"18":"transparent",color:activeNav===n.id?C.cyan:C.sub,cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap",borderBottom:activeNav===n.id?`2px solid ${C.cyan}`:"2px solid transparent"}}>{n.l}</button>))}
        </div>
      </nav>

      <div style={{padding:"16px 14px 40px"}}>

      {/* ═══ METRICS ═══ */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:20}}>
        <M label="War Dead" value="2,600+" sub="15+ countries" accent={C.red}/>
        <M label="Brent" value="$112" sub="was $65 pre-war" accent={C.red}/>
        <M label="GIFT Nifty" value="23,325" sub="▼ -453 gap down" accent={C.red}/>
        <M label="₹/USD" value="92.80" sub="ATL zone" accent={C.orange}/>
      </div>

      {/* ═══ 1. ECONOMIC ═══ */}
      <S id="economic" title="Economic Impact" sub="Day 20 — energy infrastructure war has begun. India directly in the blast radius." accent={C.orange}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
          <M label="Wealth Destroyed" value="₹24.5L Cr" sub="since war began" accent={C.red} big/>
          <M label="FPI Outflow (Mar)" value="$6.9B+" sub="FIIs relentless" accent={C.red} big/>
          <M label="Oil Daily Loss" value="₹20,000 Cr" sub="OMCs bleeding" accent={C.orange}/>
          <M label="Sensex (Mar 18)" value="76,704" sub="3-day rally wiped today" accent={C.amber}/>
        </div>
        <div style={{background:C.card,borderRadius:8,padding:14,marginBottom:10}}>
          <div style={{fontSize:9,fontWeight:700,color:C.cyan,marginBottom:6,letterSpacing:1,textTransform:"uppercase"}}>Nifty 50 — 20-Day Track</div>
          <MiniLine data={TL} dataKey="nifty" color={C.cyan} labels showDots/>
        </div>
        <div style={{background:C.card,borderRadius:8,padding:14,marginBottom:10}}>
          <div style={{fontSize:9,fontWeight:700,color:C.orange,marginBottom:6,letterSpacing:1,textTransform:"uppercase"}}>Brent Crude ($) — 20-Day Surge</div>
          <MiniLine data={TL} dataKey="brent" color={C.orange} labels showDots/>
        </div>
        <div style={{background:C.red+"0c",border:`1px solid ${C.red}20`,borderRadius:8,padding:12,fontSize:9,color:C.sub,lineHeight:1.7}}>
          <strong style={{color:C.red}}>OVERNIGHT ESCALATION:</strong> Israel struck South Pars gas field. Iran retaliated by hitting Qatar's Ras Laffan LNG terminal. Brent surged to $112. GIFT Nifty signals -453 gap-down. 3-day rally wiped in pre-market. MUFG: rupee could breach ₹95-97.50. ICRA: current account deficit may double. India gas supply now in CRITICAL danger — Qatar is 60% of India's natural gas imports.
        </div>
      </S>

      {/* ═══ 2. KITCHEN ═══ */}
      <S id="kitchen" title="Your Kitchen Table" sub="How the war is raising your family's bills — gas crisis deepens" accent={C.amber}>
        {HH.map((h,i)=>(<div key={i} style={{background:C.card,borderRadius:8,padding:12,marginBottom:8,borderLeft:`3px solid ${h.s===3?C.red:h.s===2?C.orange:C.amber}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:4}}><span style={{fontSize:10.5,fontWeight:700,color:C.white}}>{sv(h.s)} {h.item}</span><span style={{fontSize:10,fontWeight:800,color:C.red,fontFamily:"'SF Mono',Consolas,monospace"}}>{h.chg}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:8.5,color:C.sub,flexWrap:"wrap",gap:2}}><span>Pre: {h.pre}</span><span style={{color:C.orange,fontWeight:700}}>Now: {h.now}</span><span style={{color:C.red}}>4-wk: {h.proj}</span></div>
          <div style={{fontSize:8,color:C.muted,marginTop:6,lineHeight:1.6}}>{h.note}</div>
        </div>))}
      </S>

      {/* ═══ 3. MILITARY ═══ */}
      <S id="military" title="Military & Strategic Exposure" sub="Energy infrastructure war + assassination campaign = no exit ramp" accent={C.red}>
        {MIL.map((m,i)=>(<div key={i} style={{background:m.lv==="BREAKING"?C.red+"0a":C.card,border:m.lv==="BREAKING"?`1px solid ${C.red}25`:"none",borderRadius:8,padding:12,marginBottom:8,borderLeft:`3px solid ${m.c}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4}}><span style={{fontSize:10,fontWeight:700,color:C.white,flex:1}}>{m.t}</span><span style={{fontSize:7,padding:"2px 8px",borderRadius:3,background:m.lv==="BREAKING"?C.red:`${m.c}20`,color:m.lv==="BREAKING"?"#fff":m.c,fontWeight:800,whiteSpace:"nowrap"}}>{m.lv}</span></div>
          <div style={{fontSize:8,color:C.muted,marginTop:6,lineHeight:1.6}}>{m.d}</div>
        </div>))}
      </S>

      {/* ═══ 4. NUCLEAR ═══ */}
      <S id="nuclear" title="☢️ Nuclear Exposure Risk" sub="Bushehr nuclear plant now confirmed struck. What does this mean for India?" accent={C.purple}>
        <div style={{background:C.purple+"0c",border:`1px solid ${C.purple}20`,borderRadius:8,padding:12,marginBottom:14,fontSize:9,color:C.sub,lineHeight:1.6}}>
          <strong style={{color:C.purple}}>Bushehr — a working nuclear reactor — has been struck.</strong> Iran's Atomic Energy Org confirmed a 'hostile projectile' hit the site. No reactor damage claimed. But this crosses a threshold never crossed before in this war. Natanz damaged. Fordow at 60%. DNI Gabbard says enrichment program was 'obliterated' in June 2025 strikes — but <strong style={{color:C.red}}>460kg enriched uranium still exists.</strong> India has no iodine program.
        </div>
        <div style={{fontSize:9,fontWeight:700,color:C.purple,marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>Iranian Nuclear Facilities</div>
        {NUKES.map((n,i)=>(<div key={i} onClick={()=>setExpNuke(expNuke===i?null:i)} style={{background:C.card,border:n.st.includes("HIT")&&n.name==="Bushehr"?`1px solid ${C.red}30`:"none",borderRadius:8,padding:12,marginBottom:6,cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:11,fontWeight:700,color:n.risk>85?C.red:n.risk>70?C.orange:C.amber}}>{n.name}</span><span style={{fontSize:8,color:C.muted,marginLeft:6}}>{n.type}</span></div><span style={{fontSize:7.5,padding:"2px 7px",borderRadius:3,fontWeight:800,background:n.st.includes("DAMAGED")||n.st.includes("HIT")||n.st.includes("STRUCK")?C.red+"15":C.orange+"12",color:n.st.includes("DAMAGED")||n.st.includes("HIT")||n.st.includes("STRUCK")?C.red:C.orange}}>{n.st}</span></div>
          <Bar value={n.risk} color={n.risk>85?C.red:n.risk>70?C.orange:C.amber}/><div style={{fontSize:7,color:C.muted,marginTop:3,textAlign:"right"}}>{n.risk}/100 {expNuke===i?"▲":"▼ detail"}</div>
          {expNuke===i&&<div style={{fontSize:8,color:C.sub,marginTop:6,lineHeight:1.6,borderTop:`1px solid ${C.border}`,paddingTop:6}}>{n.info}</div>}
        </div>))}
        <div style={{fontSize:9,fontWeight:700,color:C.pink,marginTop:18,marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>Indian Cities — Contamination Exposure</div>
        <div style={{fontSize:8,color:C.sub,marginBottom:10,lineHeight:1.5}}>Scores: <strong style={{color:C.orange}}>Wind</strong> (3-7 days) + <strong style={{color:C.cyan}}>Maritime</strong> (15-40 days) + <strong style={{color:C.purple}}>Nuclear</strong> (if breached). Bushehr strike raises all nuclear scores.</div>
        {CITIES.map((c,i)=>(<div key={i} style={{background:C.card,borderRadius:8,padding:12,marginBottom:6}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:12,fontWeight:800,color:C.white}}>{c.city}</span><span style={{fontSize:7.5,color:C.muted,marginLeft:6}}>{c.pop}</span></div><span style={{fontSize:14,fontWeight:900,color:c.tot>55?C.red:c.tot>42?C.orange:C.amber,fontFamily:"'SF Mono',Consolas,monospace"}}>{c.tot}<span style={{fontSize:7}}>/100</span></span></div>
          <div style={{display:"flex",gap:8,marginTop:6}}>{[{l:"Wind",v:c.wind,cl:C.orange},{l:"Sea",v:c.sea,cl:C.cyan},{l:"Nuke",v:c.nuke,cl:C.purple}].map((vv,j)=>(<div key={j} style={{flex:1}}><div style={{fontSize:6.5,color:vv.cl,fontWeight:600}}>{vv.l}: {vv.v}</div><Bar value={vv.v} color={vv.cl} h={4}/></div>))}</div>
          <div style={{fontSize:7.5,color:C.muted,marginTop:5,lineHeight:1.5}}>{c.info}</div>
        </div>))}
      </S>

      {/* ═══ 5. PROJECTIONS ═══ */}
      <S id="projections" title="If This Continues..." sub="Projections at week 3, 4, 6, 8 — Nifty excluded (too volatile)" accent={C.cyan}>
        <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>
          {[{k:"brent",l:"Oil"},{k:"rupee",l:"Rupee"},{k:"petrol",l:"Petrol"},{k:"lpg",l:"LPG"},{k:"deaths",l:"Deaths"}].map(m=>(<button key={m.k} onClick={()=>setProjKey(m.k)} style={{padding:"4px 11px",border:projKey===m.k?`1px solid ${C.cyan}`:`1px solid ${C.border}`,borderRadius:4,background:projKey===m.k?C.cyan+"12":"transparent",color:projKey===m.k?C.cyan:C.sub,cursor:"pointer",fontSize:8.5,fontWeight:700,fontFamily:"inherit"}}>{m.l}</button>))}
        </div>
        <div style={{background:C.card,borderRadius:8,padding:14,marginBottom:10}}>
          <div style={{fontSize:9,fontWeight:700,color:C.cyan,marginBottom:6,letterSpacing:1,textTransform:"uppercase"}}>{projKey} — Actual + Projected</div>
          <MiniLine data={PROJ} dataKey={projKey} color={C.cyan} labels showDots/>
        </div>
        <div style={{background:C.card,borderRadius:8,padding:14,overflowX:"auto"}}>
          <div style={{fontSize:9,fontWeight:700,color:C.amber,marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>Scenario Table</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:8,minWidth:300}}>
            <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["","Pre","Now","Wk3","Wk4","Wk8"].map((h,i)=>(<th key={i} style={{padding:"5px 3px",textAlign:i===0?"left":"right",color:i>2?C.amber:C.muted,fontWeight:700}}>{h}</th>))}</tr></thead>
            <tbody>{[{m:"Brent ($)",v:[65,112,115,120,130]},{m:"₹/USD",v:[91.0,92.80,94.0,95.5,99.0]},{m:"Petrol/L",v:["₹94.72","₹103.54","₹112","₹118","₹135"]},{m:"LPG",v:["₹803","₹913","₹980","₹1,050","₹1,200"]},{m:"Deaths",v:[0,"2,600+","3,800","5,500","14,000"]}].map((r,i)=>(<tr key={i} style={{borderBottom:`1px solid ${C.border}30`}}><td style={{padding:"5px 3px",fontWeight:700,color:C.text}}>{r.m}</td>{r.v.map((v,j)=>(<td key={j} style={{padding:"5px 3px",textAlign:"right",color:j===0?C.green:j===1?C.red:C.amber,fontWeight:600}}>{v}</td>))}</tr>))}</tbody>
          </table>
        </div>
      </S>

      {/* ═══ 6. RADAR ═══ */}
      <S id="radar" title="Risk Radar" sub="Week 1 vs Now vs Week 4 Projected" accent={C.cyan}>
        <div style={{background:C.card,borderRadius:8,padding:14}}><RadarSVG data={RADAR}/></div>
      </S>

      {/* ═══ 7. WAR LOG ═══ */}
      <S id="warlog" title="20-Day War Log" sub="How we got here" accent={C.muted}>
        <div style={{background:C.card,borderRadius:8,padding:14}}>
          {[...TL].reverse().map((d,i)=>(<div key={i} style={{padding:"6px 0",borderBottom:`1px solid ${C.border}30`,display:"flex",gap:10}}>
            <div style={{minWidth:44}}><div style={{fontSize:9,fontWeight:800,color:C.orange,fontFamily:"'SF Mono',Consolas,monospace"}}>D{d.d}</div><div style={{fontSize:6.5,color:C.muted}}>{d.l}</div></div>
            <div style={{fontSize:8,color:C.sub,lineHeight:1.5}}>{d.tag}</div>
          </div>))}
        </div>
      </S>

      {/* ═══ 8. ASSESSMENT ═══ */}
      <S id="assessment" title="Strategic Assessment" accent={C.red}>
        <div style={{background:C.red+"08",border:`1px solid ${C.red}18`,borderRadius:8,padding:16}}>
          <div style={{fontSize:10,lineHeight:1.85,color:C.sub}}>
            <strong style={{color:C.red,fontSize:13}}>Week 3. Energy infrastructure war has begun. India is in the blast radius.</strong><br/><br/>
            The war crossed a new threshold overnight. Israel struck South Pars — the world's largest natural gas field (shared with Qatar). Iran retaliated by hitting Qatar's Ras Laffan — the world's largest LNG export terminal. IRGC issued evacuation orders for energy assets across the Gulf. Bushehr nuclear plant confirmed struck. Brent surged to $112. Four top Iranian officials killed in 3 days. Diplomacy is dead.<br/><br/>
            <strong style={{color:C.orange}}>For India, this is now an energy emergency.</strong> Qatar supplies 60% of India's natural gas. If Ras Laffan damage is sustained, CNG for vehicles, piped gas for homes, and fertiliser production face immediate disruption. LPG already at ₹913 with only 10 days stock. Petrol will breach ₹110+ as Brent crosses $112. GIFT Nifty signals -453 point crash today, wiping the 3-day rally. Rupee at 92.80.<br/><br/>
            <strong style={{color:C.purple}}>Bushehr — a working nuclear reactor — has been struck.</strong> This is unprecedented. While no reactor damage is reported, the strike crosses a line. 460kg of enriched uranium exists across Iran's facilities. Delhi is 4-7 days downwind. India has no public preparedness plan.<br/><br/>
            <strong style={{color:C.cyan}}>India must act now:</strong> Emergency gas rationing plans. Accelerated non-Gulf LPG procurement. Rupee defense. Nuclear contamination monitoring. Food supply chain protection. This is no longer a distant conflict — it is India's crisis.
          </div>
        </div>
      </S>

      {/* ═══ FOOTER ═══ */}
      <footer style={{padding:"14px 0",borderTop:`1px solid ${C.border}`,marginTop:8}}>
        <div style={{fontSize:7,color:C.muted,lineHeight:1.7}}>
          <strong style={{color:C.sub}}>Sources:</strong> Al Jazeera, CNN, CBS, NBC, ABC, AP, Reuters, Bloomberg, Euronews, Iran International, Times of Israel, Atlantic Council, Amnesty International, ACLED, Business Standard, BusinessToday, Goodreturns, News24, Trading Economics, Wikipedia, Fortune, IAEA, HRW, CSIS, IEA, EIA, Kpler, MarineTraffic, MUFG, ORF, MEA India, Nomura, Elara, UBS, HSBC, Kotak, JM Financial, ICRA, Motilal Oswal, SBI Securities
          <br/><br/>
          <strong style={{color:C.sub}}>Methodology:</strong> Nuclear/contamination scores are analytical estimates based on IAEA reports, March wind patterns, and maritime models — NOT confirmed measurements. Projections use 20-day trend extrapolation. Nifty projections excluded (unreliable in extreme volatility). All timestamps IST (UTC+5:30).
          <br/><br/>
          <strong style={{color:C.sub}}>Disclaimer:</strong> Built with AI tools. Ongoing project. Not financial, safety, or evacuation advice.
        </div>
      </footer>
      </div>
    </div>
  );
}
