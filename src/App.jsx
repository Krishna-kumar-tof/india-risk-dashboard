import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════
// INDIA RISK DASHBOARD — V5.2 — PUBLIC DISCOURSE EDITION
// Pure React — NO external chart libraries needed
// Last updated: March 18, 2026 — 12:30 PM IST (Day 19)
// ═══════════════════════════════════════════════════════════════════

const UPDATED = "March 18, 2026 — 12:30 PM IST";
const WAR_DAY = 19;

const C = {
  bg: "#090b10", card: "#0e1219", border: "#1a2030", borderHi: "#2a3040",
  text: "#c8d0dc", dim: "#6b7a90", faint: "#3d4a5c",
  red: "#e53935", orange: "#ef6c00", amber: "#f9a825", green: "#43a047",
  cyan: "#00acc1", purple: "#7c4dff", pink: "#d81b60",
  navBg: "#0c0e14",
};

// ───── NAVIGATION SECTIONS ─────
const NAV = [
  { id: "economic", label: "Economy", icon: "📉" },
  { id: "kitchen", label: "Kitchen", icon: "🍳" },
  { id: "military", label: "Military", icon: "⚔️" },
  { id: "nuclear", label: "Nuclear", icon: "☢️" },
  { id: "projections", label: "Forecast", icon: "📈" },
  { id: "radar", label: "Radar", icon: "🎯" },
  { id: "warlog", label: "War Log", icon: "📋" },
  { id: "assessment", label: "Verdict", icon: "🔴" },
];

// ───── TIMELINE ─────
const TL = [
  { d:1,l:"Feb 28",deaths:555,brent:78,nifty:25179,rupee:91.49,tag:"War starts. Khamenei killed. Op. Epic Fury" },
  { d:3,l:"Mar 2",deaths:787,brent:82,nifty:24866,rupee:91.49,tag:"Black Monday. Ras Tanura shut" },
  { d:5,l:"Mar 4",deaths:1045,brent:85,nifty:24481,rupee:92.30,tag:"IRIS Dena sunk off Sri Lanka. Rupee ATL" },
  { d:7,l:"Mar 6",deaths:1332,brent:88,nifty:24450,rupee:91.82,tag:"Oil depots hit. Worst week" },
  { d:9,l:"Mar 8",deaths:1332,brent:93,nifty:24450,rupee:91.82,tag:"Mojtaba Khamenei elected Supreme Leader" },
  { d:10,l:"Mar 9",deaths:1754,brent:104,nifty:24028,rupee:92.33,tag:"Brent $120 intraday. ₹8.5L cr wiped" },
  { d:11,l:"Mar 10",deaths:1754,brent:84,nifty:24200,rupee:92.10,tag:"Trump: very complete. Oil crashes" },
  { d:12,l:"Mar 11",deaths:1966,brent:93,nifty:23867,rupee:92.20,tag:"Ships hit Hormuz. IEA 400M SPR" },
  { d:14,l:"Mar 13",deaths:2100,brent:99,nifty:23151,rupee:92.45,tag:"BLACK FRIDAY. ₹20L cr wiped in 1 wk" },
  { d:15,l:"Mar 14",deaths:2100,brent:99,nifty:23151,rupee:92.45,tag:"5K Marines + 10K AI Merops drones ordered" },
  { d:16,l:"Mar 15",deaths:2200,brent:100,nifty:23151,rupee:92.45,tag:"Gulf exports -61%. Trump: wrapped up soon" },
  { d:17,l:"Mar 16",deaths:2200,brent:103,nifty:23409,rupee:92.41,tag:"Relief rally +939. 2 India LPG tankers cross Hormuz" },
  { d:18,l:"Mar 17",deaths:2200,brent:103,nifty:23581,rupee:92.41,tag:"Sensex +568 (2-day gain 1,507). Ali Larijani KILLED" },
  { d:19,l:"Mar 18",deaths:2500,brent:105,nifty:23581,rupee:92.44,tag:"Day 19. IRGC retaliates for Larijani. US bunker busters on Hormuz sites" },
];

// ───── PROJECTIONS ─────
const PROJ = [
  { w:"Pre-war",brent:65,nifty:25179,rupee:91.0,lpg:803,petrol:94.72,deaths:0 },
  { w:"Week 1",brent:85,nifty:24481,rupee:92.30,lpg:803,petrol:94.72,deaths:1045 },
  { w:"Now",brent:105,nifty:23581,rupee:92.44,lpg:913,petrol:103.54,deaths:2500 },
  { w:"Week 3*",brent:108,nifty:22500,rupee:93.5,lpg:950,petrol:108,deaths:3500 },
  { w:"Week 4*",brent:115,nifty:21000,rupee:95.0,lpg:1000,petrol:112,deaths:5000 },
  { w:"Week 6*",brent:118,nifty:19000,rupee:96.0,lpg:1050,petrol:118,deaths:8000 },
  { w:"Week 8*",brent:125,nifty:17500,rupee:98.0,lpg:1100,petrol:125,deaths:12000 },
];

// ───── HOUSEHOLD ─────
const HH = [
  { item:"LPG Cylinder (14.2kg)", pre:"₹803", now:"₹913", chg:"+₹110 (+13.7%)", proj:"₹950+", note:"Force majeure. Only 10 DAYS stock left. Dairy crisis: 10 days milk packaging left. Shivalik (45K MT) reached Mundra Port. 25-day inter-booking rule imposed. LPG production up 28% after govt order — but covers only 10% of national need.", s:3 },
  { item:"LPG Commercial (19kg)", pre:"₹1,646", now:"₹1,790", chg:"+₹144 (+8.7%)", proj:"₹2,100", note:"Restaurants dropping chapati, dosa, pooris. Bengaluru cafe charging 'Gas Crisis Charge' on lemonade. Indian Railways advised caterers to explore alternative fuels. Small bakeries warn bread shortage.", s:3 },
  { item:"Petrol (Mumbai)", pre:"₹94.72/L", now:"₹103.54/L", chg:"+₹8.82 (+9.3%)", proj:"₹112/L", note:"Oil cos losing ₹20,000 cr/day. Govt shielding prices — unsustainable. US diesel now $5/gallon. JM Financial: every $1 oil rise = $2B added to India's import bill.", s:3 },
  { item:"Diesel (Mumbai)", pre:"₹82.69/L", now:"₹90.03/L", chg:"+₹7.34 (+8.9%)", proj:"₹98/L", note:"Every ₹1 diesel rise = ₹2,500 cr annual cost to trucking. Freight + food transport costlier.", s:2 },
  { item:"Cooking Oil", pre:"~₹140/L", now:"~₹155/L", chg:"+~₹15 (+10.7%)", proj:"₹175/L", note:"Palm oil +5% (Nomura). Sunflower +16%. India import-dependent. Rupee fall compounds.", s:2 },
  { item:"Onion / Vegetables", pre:"Stable", now:"Rising", chg:"Transport cost↑", proj:"₹60-80/kg", note:"400K tons Basmati stuck at ports. Diesel-driven freight costs rising. Supply chain disrupting.", s:1 },
  { item:"Medicine", pre:"Stable", now:"Stable (for now)", chg:"Coming Q1 FY27", proj:"+10-15%", note:"Pharma raw materials costlier. Liquid paraffin +26% YoY. Impact expected from Apr (Nomura).", s:1 },
  { item:"Electricity", pre:"Normal", now:"Rising risk", chg:"Gas shortage", proj:"+5-10%", note:"60% of India's natural gas from Middle East (Qatar). Gas allocation cuts to power plants. Fertiliser + food production at risk.", s:1 },
];

// ───── MILITARY ─────
const MIL = [
  { t:"Ali Larijani KILLED (Mar 17)", lv:"BREAKING", c:C.red, d:"Iran's Supreme National Security Council confirmed top security chief Ali Larijani killed with his son in Israeli strike. IRGC launched 'intense' retaliatory attacks on Israel. 2 killed in central Israel from Iranian ballistic missile. CNN cameras captured cluster munitions over Tel Aviv. IRGC vowed 'decisive and regrettable' response." },
  { t:"US 5,000-lb Bunker Busters on Hormuz", lv:"CRITICAL", c:C.red, d:"US dropped multiple 5,000-lb deep-penetrator munitions on hardened Iranian missile sites along Strait of Hormuz coastline (CENTCOM confirmed). Part of ongoing effort to prevent Iran from striking commercial shipping. Israel planning to strike 'thousands' of targets over next 3 weeks." },
  { t:"Hormuz: 2 Indian LPG Tankers Crossed", lv:"CRITICAL", c:C.red, d:"Jaishankar diplomacy yielded results — Shivalik (45K MT) + Nanda Devi crossed Hormuz under Indian Navy escort (Mar 15-16). Shivalik reached Mundra Port. But covers only 5% of monthly need. Gulf oil exports still -61% (Kpler/Reuters). First non-Iranian tanker (Aframax Karachi) also transited with AIS on." },
  { t:"IRIS Dena — War in Indian Ocean", lv:"CRITICAL", c:C.red, d:"Iranian frigate torpedoed 40nm off Sri Lanka (87 killed, 32 rescued). Was returning from Indian Navy MILAN exercise. Iran's Navy commander vowed retribution: 'deadly strikes from where the enemy least expects.' War literally reached India's doorstep." },
  { t:"9 Million Indians in Gulf", lv:"HIGH", c:C.orange, d:"52,000+ returned. UAE airspace CLOSED twice (Mar 16-17) from Iranian missiles/drones. Pakistani killed by missile in Abu Dhabi. Dubai airport suspended flights. Fujairah oil zone fire. Qatar intercepted 13/14 ballistic missiles. Bahrain neutralised 129 missiles + 221 drones since war began." },
  { t:"Israel Ground Incursion — Lebanon", lv:"HIGH", c:C.orange, d:"Israel began 'limited and targeted ground operations' in southern Lebanon. 1 MILLION displaced (20% of population). 886 killed incl 111 children. Hundreds of thousands told not to return south of Litani river. Hezbollah + IRGC conducting joint strikes." },
  { t:"Kashmir & Domestic Stability", lv:"HIGH", c:C.orange, d:"3 days of restrictions after Shia protests in 12+ states. 2G internet. Schools closed. India's trade deficit widened to $27.1B in Feb — full Gulf disruption impact yet to show." },
  { t:"7,200+ Marines + 10,000 AI Drones", lv:"CRITICAL", c:C.red, d:"5,000 MORE Marines ordered (total 7,200+). IRGC warned US industrial facilities face 'imminent attack.' 200 US troops injured in 7 countries. 13 US killed (6 in refueling plane crash in Iraq). US Embassy Baghdad hit by drones/rockets. Counterterrorism Director Joe Kent RESIGNED over objections to war." },
  { t:"Nuclear Fallout Path to India", lv:"ELEVATED", c:C.purple, d:"Natanz DAMAGED (IAEA confirmed). Fordow enriching to 60%. US using 5,000-lb bunker busters near nuclear-adjacent sites. Plume reaches North India in 4-7 days if breached. India has NO iodine tablet program." },
  { t:"Amnesty: US Killed 170+ at School", lv:"HIGH", c:C.red, d:"Amnesty International confirmed US attack killed 170+ at primary school in Minab, Iran — including 160+ schoolgirls. UN human rights experts called earlier strikes potential war crimes under Rome Statute. Iran's internet blackout has lasted 240+ hours (2nd longest ever)." },
];

// ───── NUCLEAR ─────
const NUKES = [
  { name:"Natanz", type:"Enrichment", st:"DAMAGED", risk:95, info:"IAEA confirmed impacts. Contains bulk of ~460kg enriched uranium. Underground centrifuge halls. Tunnel entrance damage on satellite." },
  { name:"Isfahan", type:"Conversion + Missile", st:"HEAVILY HIT", risk:88, info:"Missile complex destroyed (satellite). UCF processes yellowcake into UF6 gas. Significant debris field." },
  { name:"Parchin", type:"Military Nuclear", st:"STRUCK", risk:82, info:"Taleghan 2: chambers that can test nuclear weapon components (IAEA). Reconstruction damage confirmed." },
  { name:"Fordow", type:"Underground", st:"UNCERTAIN", risk:75, info:"80m under mountain. Enriching to 60% (near weapons-grade). Extremely hardened. Likely intact. 5,000-lb bunker busters now being used nearby." },
  { name:"Bushehr", type:"Reactor", st:"NEAR MISS", risk:70, info:"Working nuclear power plant. Rosatom evacuated. Airport 12km away struck. Spent fuel rods on site." },
];

const CITIES = [
  { city:"Delhi NCR", pop:"32M", wind:72, sea:15, nuke:45, tot:58, info:"1,800km downwind from Isfahan. March westerlies carry particulates in 3-5 days. India has NO iodine tablet program." },
  { city:"Mumbai", pop:"21M", wind:40, sea:78, nuke:38, tot:55, info:"900km from Hormuz. Arabian Sea currents carry contaminants. 16+ ships attacked = massive spill risk. JNPT + fishing at risk." },
  { city:"Ahmedabad", pop:"8.5M", wind:65, sea:55, nuke:42, tot:54, info:"Closest major city to Iran. Both wind + maritime vectors converge. Jamnagar refinery takes Arabian Sea water." },
  { city:"Jaipur", pop:"4M", wind:68, sea:10, nuke:40, tot:45, info:"Rajasthan desert = natural wind funnel from Iran. March dust storms regularly carry Iranian plateau particles." },
  { city:"Kochi", pop:"2.1M", wind:25, sea:70, nuke:20, tot:42, info:"Major port + Southern Naval Command. Oil spill from Hormuz reaches coast in 15-25 days." },
  { city:"Goa", pop:"1.5M", wind:30, sea:72, nuke:18, tot:40, info:"Konkan coast in path of Arabian Sea currents from Gulf. Fishing economy ₹4,000 cr. Tourism devastated." },
  { city:"Lucknow", pop:"3.5M", wind:58, sea:5, nuke:35, tot:38, info:"Indo-Gangetic plain TRAPS airborne pollutants. Inversion layers could concentrate particles for weeks." },
  { city:"Chennai", pop:"11M", wind:20, sea:55, nuke:15, tot:35, info:"IRIS Dena wreck 400km south. East coast currents could carry contamination north. Major fishing port." },
];

// ───── RISK RADAR ─────
const RADAR = [
  { axis:"Oil Shock", w1:60, now:94, w4:96 },
  { axis:"Market Crash", w1:45, now:88, w4:85 },
  { axis:"Nuclear Risk", w1:20, now:58, w4:72 },
  { axis:"Hormuz Closure", w1:80, now:95, w4:92 },
  { axis:"Household Impact", w1:15, now:85, w4:94 },
  { axis:"Currency Crisis", w1:40, now:80, w4:88 },
  { axis:"Social Unrest", w1:25, now:58, w4:68 },
  { axis:"Military Exposure", w1:35, now:82, w4:88 },
];

// ═══════════════════════════════════════
// SVG MINI-CHART COMPONENTS (no libraries)
// ═══════════════════════════════════════
const MiniLine = ({ data, dataKey, color, w = 320, h = 100, showDots = true, labels }) => {
  const vals = data.map(d => d[dataKey]);
  const mn = Math.min(...vals), mx = Math.max(...vals);
  const range = mx - mn || 1;
  const pts = vals.map((v, i) => ({
    x: 30 + (i / (vals.length - 1)) * (w - 50),
    y: 10 + (1 - (v - mn) / range) * (h - 30),
    v
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = line + ` L${pts[pts.length-1].x},${h-8} L${pts[0].x},${h-8} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id={`g_${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g_${dataKey})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {showDots && pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill={C.bg} stroke={color} strokeWidth="1.5" />
          <text x={p.x} y={p.y - 8} fill={C.dim} fontSize="7" textAnchor="middle">{typeof p.v === "number" && p.v > 999 ? (p.v/1000).toFixed(1)+"k" : p.v}</text>
        </g>
      ))}
      {labels && data.map((d, i) => (
        <text key={i} x={30 + (i / (data.length - 1)) * (w - 50)} y={h - 1} fill={C.faint} fontSize="7" textAnchor="middle">{d.l || d.w || d.d}</text>
      ))}
    </svg>
  );
};

const MiniBar = ({ data, dataKey, color, w = 320, h = 80 }) => {
  const vals = data.map(d => Math.abs(d[dataKey] || 0));
  const mx = Math.max(...vals) || 1;
  const bw = (w - 40) / vals.length - 4;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
      {vals.map((v, i) => {
        const bh = (v / mx) * (h - 20);
        const x = 20 + i * ((w - 40) / vals.length) + 2;
        return (
          <g key={i}>
            <rect x={x} y={h - 10 - bh} width={bw} height={bh} fill={color} rx="2" opacity="0.85" />
            <text x={x + bw / 2} y={h - 12 - bh} fill={C.dim} fontSize="6" textAnchor="middle">
              {v > 999 ? (v/1000).toFixed(0)+"k" : v}
            </text>
            <text x={x + bw / 2} y={h - 2} fill={C.faint} fontSize="6" textAnchor="middle">{data[i].l || data[i].d}</text>
          </g>
        );
      })}
    </svg>
  );
};

const Bar = ({ value, max = 100, color, h = 5 }) => (
  <div style={{ height: h, background: C.border, borderRadius: h / 2, overflow: "hidden", marginTop: 4 }}>
    <div style={{ height: "100%", width: `${Math.min((value / max) * 100, 100)}%`, background: color || (value > 70 ? C.red : value > 50 ? C.orange : value > 30 ? C.amber : C.green), borderRadius: h / 2, transition: "width 0.5s" }} />
  </div>
);

const RadarSVG = ({ data, w = 300, h = 300 }) => {
  const cx = w / 2, cy = h / 2, r = Math.min(cx, cy) - 40;
  const n = data.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const toXY = (i, val) => ({
    x: cx + Math.cos(angle(i)) * (val / 100) * r,
    y: cy + Math.sin(angle(i)) * (val / 100) * r,
  });
  const poly = (key, color, dash) => {
    const pts = data.map((d, i) => toXY(i, d[key]));
    return <polygon points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill={color + "15"} stroke={color} strokeWidth={dash ? "1.5" : "2"} strokeDasharray={dash || "none"} />;
  };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
      {[20, 40, 60, 80, 100].map(v => (
        <polygon key={v} points={data.map((_, i) => toXY(i, v)).map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke={C.border} strokeWidth="0.5" />
      ))}
      {data.map((_, i) => {
        const p = toXY(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={C.border} strokeWidth="0.5" />;
      })}
      {poly("w1", C.green)}
      {poly("now", C.orange)}
      {poly("w4", C.red, "4 3")}
      {data.map((d, i) => {
        const p = toXY(i, 112);
        return <text key={i} x={p.x} y={p.y} fill={C.dim} fontSize="7" textAnchor="middle" dominantBaseline="middle">{d.axis}</text>;
      })}
      {/* Legend */}
      {[{ label: "Week 1", color: C.green, y: h - 20 }, { label: "Now (Day 19)", color: C.orange, y: h - 12 }, { label: "Week 4 Proj.", color: C.red, y: h - 4 }].map((lg, i) => (
        <g key={i}>
          <rect x={10} y={lg.y - 5} width={10} height={3} fill={lg.color} rx="1" />
          <text x={24} y={lg.y - 2} fill={C.dim} fontSize="7">{lg.label}</text>
        </g>
      ))}
    </svg>
  );
};

// ═══════════════════════════════════════
// SECTION COMPONENT
// ═══════════════════════════════════════
const Sec = ({ id, title, sub, accent = C.red, children }) => (
  <section id={id} style={{ marginBottom: 28, scrollMarginTop: 56 }}>
    <div style={{ marginBottom: 12, borderBottom: `2px solid ${accent}30`, paddingBottom: 8 }}>
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: accent, letterSpacing: 1.5, textTransform: "uppercase" }}>{title}</h2>
      {sub && <p style={{ margin: "4px 0 0", fontSize: 10, color: C.dim, lineHeight: 1.4 }}>{sub}</p>}
    </div>
    {children}
  </section>
);

const Metric = ({ label, value, sub, accent = C.red, big }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: big ? "12px 8px" : "8px 6px", textAlign: "center", borderTop: `2px solid ${accent}40` }}>
    <div style={{ fontSize: 8, color: C.dim, letterSpacing: 1.2, textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: big ? 18 : 14, fontWeight: 800, color: accent, marginTop: 3 }}>{value}</div>
    {sub && <div style={{ fontSize: 7, color: C.faint, marginTop: 2 }}>{sub}</div>}
  </div>
);

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const [projKey, setProjKey] = useState("brent");
  const [expNuke, setExpNuke] = useState(null);
  const [activeNav, setActiveNav] = useState(null);
  const sev = (s) => s === 3 ? "🔴" : s === 2 ? "🟠" : "🟡";

  const scrollTo = (id) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "Georgia, 'Crimson Text', serif", fontSize: 12,
      maxWidth: 540, margin: "0 auto", padding: "0 10px 40px",
    }}>
      {/* ═══════ HEADER ═══════ */}
      <header style={{ textAlign: "center", padding: "24px 12px 14px", borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
        <div style={{ fontSize: 8, letterSpacing: 5, color: C.red, textTransform: "uppercase", marginBottom: 6 }}>India Risk Assessment</div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>
          How the Iran War<br />Is Hitting India
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 11, color: C.dim, lineHeight: 1.5 }}>
          Day {WAR_DAY} of the US-Israel war on Iran. Economic damage, household costs,<br />military risks, nuclear exposure — tracked and projected.
        </p>
        <div style={{ marginTop: 10, fontSize: 9, color: C.faint }}>{UPDATED} • 50+ verified sources</div>
      </header>

      {/* ═══════ STICKY NAVIGATION ═══════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: C.navBg + "f2",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "6px 0", marginBottom: 18,
      }}>
        <div style={{
          display: "flex", gap: 2, overflowX: "auto", padding: "0 4px",
          scrollbarWidth: "none", msOverflowStyle: "none",
        }}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              style={{
                flex: "0 0 auto",
                padding: "6px 8px",
                border: activeNav === n.id ? `1px solid ${C.cyan}50` : `1px solid transparent`,
                borderRadius: 6,
                background: activeNav === n.id ? C.cyan + "15" : "transparent",
                color: activeNav === n.id ? C.cyan : C.dim,
                cursor: "pointer",
                fontSize: 9,
                fontWeight: 700,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 3,
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 11 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ═══════ KEY METRICS ═══════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 24 }}>
        <Metric label="War Dead" value="2,500+" sub="15+ countries" accent={C.red} />
        <Metric label="Brent Oil" value="$105" sub="was $65" accent={C.orange} />
        <Metric label="Nifty 50" value="23,581" sub="-6.3% since war" accent={C.red} />
        <Metric label="Rupee" value="₹92.44" sub="all-time low" accent={C.orange} />
      </div>

      {/* ═══════ BREAKING TICKER ═══════ */}
      <div style={{ background: C.red + "12", border: `1px solid ${C.red}30`, borderRadius: 8, padding: "8px 12px", marginBottom: 20 }}>
        <div style={{ fontSize: 8, fontWeight: 800, color: C.red, letterSpacing: 2, marginBottom: 4 }}>⚡ LATEST (MAR 18)</div>
        <div style={{ fontSize: 9, color: C.text, lineHeight: 1.7 }}>
          <strong style={{ color: C.red }}>Ali Larijani killed</strong> — Iran's top security chief confirmed dead with his son. IRGC launched "intense" retaliation on Israel. <strong style={{ color: C.orange }}>US bunker busters</strong> dropped on Iranian missile sites along Hormuz. <strong style={{ color: C.amber }}>Europe rejects</strong> Trump's demand to join war — "no appetite" for troops. Trump delays China trip by a month. Brent futures open $105+.
        </div>
      </div>

      {/* ═══════ 1. ECONOMIC IMPACT ═══════ */}
      <Sec id="economic" title="Economic Impact" sub="19 days of war have cost India trillions" accent={C.orange}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
          <Metric label="Wealth Destroyed" value="₹20L+ Cr" sub="worst week in 4 yrs" accent={C.red} big />
          <Metric label="FPI Outflow (Mar)" value="$6.9B+" sub="relentless FII selling" accent={C.red} big />
          <Metric label="Oil Co. Daily Loss" value="₹20,000 Cr" sub="diesel ₹45/L loss" accent={C.orange} />
          <Metric label="Trade Deficit (Feb)" value="$27.1B" sub="full impact yet to show" accent={C.orange} />
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.cyan, marginBottom: 6 }}>NIFTY 50 — 19-DAY TRACK</div>
          <MiniLine data={TL} dataKey="nifty" color={C.cyan} labels showDots />
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.orange, marginBottom: 6 }}>BRENT CRUDE ($) — 19-DAY SURGE</div>
          <MiniLine data={TL} dataKey="brent" color={C.orange} labels showDots />
        </div>
        <div style={{ background: C.card + "aa", border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, fontSize: 9, color: C.dim, lineHeight: 1.6 }}>
          <strong style={{ color: C.amber }}>MUFG Research:</strong> If oil stays at $100+, rupee likely to breach <strong style={{ color: C.red }}>₹95</strong> by Dec 2026. If $120 with energy shortages: <strong style={{ color: C.red }}>₹97.50+</strong>. Bloomberg: India growth forecasts being cut. ICRA: current account deficit may double to 2% of GDP.
        </div>
      </Sec>

      {/* ═══════ 2. KITCHEN TABLE ═══════ */}
      <Sec id="kitchen" title="Your Kitchen Table" sub="How the war 5,000km away is raising your family's bills" accent={C.amber}>
        {HH.map((h, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 6, borderLeft: `3px solid ${h.s === 3 ? C.red : h.s === 2 ? C.orange : C.amber}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{sev(h.s)} {h.item}</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: C.red }}>{h.chg}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: C.dim, flexWrap: "wrap", gap: 2 }}>
              <span>Pre-war: {h.pre}</span>
              <span style={{ color: C.orange, fontWeight: 700 }}>Now: {h.now}</span>
              <span style={{ color: C.red }}>4-wk: {h.proj}</span>
            </div>
            <div style={{ fontSize: 8, color: C.dim, marginTop: 5, lineHeight: 1.5, fontStyle: "italic" }}>{h.note}</div>
          </div>
        ))}
      </Sec>

      {/* ═══════ 3. MILITARY EXPOSURE ═══════ */}
      <Sec id="military" title="India's Military & Strategic Exposure" sub="Direct threats to India's security, trade and citizens" accent={C.red}>
        {MIL.map((m, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${m.lv === "BREAKING" ? C.red + "50" : C.border}`, borderRadius: 8, padding: 10, marginBottom: 6, borderLeft: `3px solid ${m.c}`, ...(m.lv === "BREAKING" ? { background: C.red + "08" } : {}) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{m.t}</span>
              <span style={{ fontSize: 7, padding: "2px 6px", borderRadius: 3, background: `${m.c}20`, color: m.c, fontWeight: 800, ...(m.lv === "BREAKING" ? { animation: "none", background: C.red + "30" } : {}) }}>{m.lv}</span>
            </div>
            <div style={{ fontSize: 8, color: C.dim, marginTop: 5, lineHeight: 1.5 }}>{m.d}</div>
          </div>
        ))}
      </Sec>

      {/* ═══════ 4. NUCLEAR EXPOSURE ═══════ */}
      <Sec id="nuclear" title="☢️ Nuclear Exposure Risk" sub="Iranian nuclear sites are being bombed. What does this mean for Indian cities?" accent={C.purple}>
        <div style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}25`, borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 9, color: C.dim, lineHeight: 1.6 }}>
          Iran has <strong style={{ color: C.purple }}>~460kg enriched uranium</strong> (some at 60% — near weapons-grade). IAEA confirmed damage at Natanz. US now dropping 5,000-lb bunker busters on hardened sites. Sustained bombing raises containment breach risk. <strong style={{ color: C.red }}>Risk is NON-ZERO and INCREASING.</strong> India has no iodine tablet program.
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: C.purple, marginBottom: 8 }}>IRANIAN NUCLEAR FACILITIES</div>
        {NUKES.map((n, i) => (
          <div key={i} onClick={() => setExpNuke(expNuke === i ? null : i)} style={{ background: C.card, border: `1px solid ${n.risk > 85 ? C.red + "30" : C.border}`, borderRadius: 8, padding: 10, marginBottom: 5, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: n.risk > 85 ? C.red : n.risk > 70 ? C.orange : C.amber }}>{n.name}</span>
                <span style={{ fontSize: 8, color: C.dim, marginLeft: 6 }}>{n.type}</span>
              </div>
              <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, fontWeight: 800, background: n.st.includes("DAMAGED") || n.st.includes("HIT") || n.st.includes("STRUCK") ? C.red + "20" : C.orange + "15", color: n.st.includes("DAMAGED") || n.st.includes("HIT") || n.st.includes("STRUCK") ? C.red : C.orange }}>{n.st}</span>
            </div>
            <Bar value={n.risk} color={n.risk > 85 ? C.red : n.risk > 70 ? C.orange : C.amber} />
            <div style={{ fontSize: 7, color: C.faint, marginTop: 2, textAlign: "right" }}>Risk: {n.risk}/100 {expNuke === i ? "▲" : "▼ tap for detail"}</div>
            {expNuke === i && <div style={{ fontSize: 8, color: C.dim, marginTop: 6, lineHeight: 1.6, borderTop: `1px solid ${C.border}`, paddingTop: 6 }}>{n.info}</div>}
          </div>
        ))}

        <div style={{ fontSize: 10, fontWeight: 700, color: C.pink, marginTop: 16, marginBottom: 8 }}>INDIAN CITIES — CONTAMINATION EXPOSURE</div>
        <div style={{ fontSize: 8, color: C.dim, marginBottom: 10, lineHeight: 1.5 }}>
          Scores combine: <strong style={{ color: C.orange }}>Wind</strong> (March westerlies, 3-7 days), <strong style={{ color: C.cyan }}>Maritime</strong> (Hormuz spills + IRIS Dena, 15-40 days), <strong style={{ color: C.purple }}>Nuclear</strong> (if containment breached).
        </div>
        {CITIES.map((c, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{c.city}</span>
                <span style={{ fontSize: 8, color: C.faint, marginLeft: 6 }}>Pop: {c.pop}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 900, color: c.tot > 50 ? C.red : c.tot > 40 ? C.orange : C.amber }}>{c.tot}<span style={{ fontSize: 8 }}>/100</span></span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {[{ l: "Wind", v: c.wind, cl: C.orange }, { l: "Maritime", v: c.sea, cl: C.cyan }, { l: "Nuclear", v: c.nuke, cl: C.purple }].map((vv, j) => (
                <div key={j} style={{ flex: 1 }}>
                  <div style={{ fontSize: 7, color: vv.cl, marginBottom: 2 }}>{vv.l}: {vv.v}</div>
                  <Bar value={vv.v} color={vv.cl} h={4} />
                </div>
              ))}
            </div>
            <div style={{ fontSize: 8, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>{c.info}</div>
          </div>
        ))}
      </Sec>

      {/* ═══════ 5. PROJECTIONS ═══════ */}
      <Sec id="projections" title="If This Continues..." sub="What happens to India at week 3, 4, 6, and 8" accent={C.cyan}>
        <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
          {[{k:"brent",l:"Oil"},{k:"nifty",l:"Nifty"},{k:"rupee",l:"Rupee"},{k:"petrol",l:"Petrol"},{k:"lpg",l:"LPG"},{k:"deaths",l:"Deaths"}].map(m => (
            <button key={m.k} onClick={() => setProjKey(m.k)} style={{ padding: "5px 10px", border: projKey === m.k ? `1px solid ${C.cyan}` : `1px solid ${C.border}`, borderRadius: 6, background: projKey === m.k ? C.cyan + "12" : C.card, color: projKey === m.k ? C.cyan : C.dim, cursor: "pointer", fontSize: 9, fontWeight: 700, fontFamily: "inherit" }}>
              {m.l}
            </button>
          ))}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.cyan, marginBottom: 6 }}>{projKey.toUpperCase()} — ACTUAL + PROJECTED</div>
          <MiniLine data={PROJ} dataKey={projKey} color={C.cyan} labels showDots />
          <div style={{ fontSize: 7, color: C.faint, marginTop: 4, textAlign: "center" }}>* Projections based on 19-day trend. Vertical line at "Now" separates actual from projected.</div>
        </div>

        {/* Scenario Table */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, overflowX: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.amber, marginBottom: 8 }}>SCENARIO TABLE — INDIA IMPACT BY DURATION</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8, minWidth: 360 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.borderHi}` }}>
                {["", "Pre-war", "Now", "Wk 3", "Wk 4", "Wk 8"].map((h, i) => (
                  <th key={i} style={{ padding: "5px 3px", textAlign: i === 0 ? "left" : "right", color: i > 2 ? C.amber : C.dim, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { m: "Brent ($)", v: [65, 105, 108, 115, 125] },
                { m: "Nifty", v: ["25,179", "23,581", "22,500", "21,000", "18,000"] },
                { m: "₹/USD", v: [91.0, 92.44, 93.5, 95.0, 98.0] },
                { m: "Petrol/L", v: ["₹94.72", "₹103.54", "₹108", "₹112", "₹125"] },
                { m: "LPG Cyl", v: ["₹803", "₹913", "₹950", "₹1,000", "₹1,100"] },
                { m: "Deaths", v: [0, "2,500+", "3,500", "5,000", "12,000"] },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "5px 3px", fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>{r.m}</td>
                  {r.v.map((v, j) => (
                    <td key={j} style={{ padding: "5px 3px", textAlign: "right", color: j === 0 ? C.green : j === 1 ? C.red : C.amber, whiteSpace: "nowrap" }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sec>

      {/* ═══════ 6. RISK RADAR ═══════ */}
      <Sec id="radar" title="Risk Radar" sub="How India's exposure expanded — Week 1 vs Now vs Projected" accent={C.cyan}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
          <RadarSVG data={RADAR} />
        </div>
      </Sec>

      {/* ═══════ 7. WAR LOG ═══════ */}
      <Sec id="warlog" title="19-Day War Log" sub="How we got here — day by day" accent={C.dim}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
          {[...TL].reverse().map((d, i) => (
            <div key={i} style={{ padding: "6px 0", borderBottom: `1px solid ${C.border}22`, display: "flex", gap: 8 }}>
              <div style={{ minWidth: 48 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.orange }}>Day {d.d}</div>
                <div style={{ fontSize: 7, color: C.faint }}>{d.l}</div>
              </div>
              <div style={{ fontSize: 8, color: C.dim, lineHeight: 1.5 }}>{d.tag}</div>
            </div>
          ))}
        </div>
      </Sec>

      {/* ═══════ 8. BOTTOM LINE ═══════ */}
      <Sec id="assessment" title="Strategic Assessment" accent={C.red}>
        <div style={{ background: C.red + "08", border: `1px solid ${C.red}25`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 10, lineHeight: 1.8, color: C.dim }}>
            <strong style={{ color: C.red, fontSize: 12 }}>Week 3. No exit ramp. India is in the blast radius.</strong>
            <br /><br />
            Ali Larijani — Iran's top security chief — has been killed. IRGC vowed "decisive" retaliation. US dropping 5,000-lb bunker busters on Hormuz-adjacent sites. Gulf oil exports DOWN 61%. Europe has refused to join. Trump delayed his China trip. His own Counterterrorism Director resigned. Israel plans "thousands" more targets over 3 weeks. Iran's FM: "We never asked for a ceasefire."
            <br /><br />
            <strong style={{ color: C.orange }}>For Indian families:</strong> LPG ₹913 (+₹110 since war). Only 10 days stock nationally. Milk packaging running out — dairy crisis imminent. Shivalik (45K MT LPG) reached Mundra Port but covers only 5% of monthly need. Induction stove sales surging — households adapting. Petrol ₹103.54. Trade deficit $27.1B in Feb. MUFG warns rupee could hit ₹95-97.50.
            <br /><br />
            <strong style={{ color: C.purple }}>The nuclear risk continues escalating.</strong> Natanz damaged. Fordow enriches at 60%. US now using its heaviest conventional munitions near nuclear-adjacent sites. Each strike wave increases accidental dispersal probability. Delhi is 4-7 days downwind. India has no iodine program. No public preparedness plan exists.
            <br /><br />
            <strong style={{ color: C.cyan }}>Two Indian tankers crossed Hormuz — fragile progress, but Gulf exports still -61%. India must plan for $100+ oil for months, not weeks.</strong> Emergency LPG diversification (US, Norway, Canada, Russia), fiscal reserves activation, rupee defense, nuclear contamination preparedness, and food supply chain resilience are not optional — they are survival necessities.
          </div>
        </div>
      </Sec>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}`, marginTop: 8 }}>
        <div style={{ fontSize: 7, color: C.faint, lineHeight: 1.6 }}>
          <strong style={{ color: C.dim }}>Sources:</strong> Al Jazeera, CNN, NPR, NBC, CBS, ABC News, AP, Reuters, Bloomberg, Euronews, Iran International, Atlantic Council, Amnesty International, Business Standard, BusinessToday, Goodreturns, Outlook Business, News24, Trading Economics, Wikipedia, IAEA, WHO, UNESCO, HRW, CSIS, IEA, EIA, Kpler, MarineTraffic, MUFG Research, ORF, VisionIAS, MEA India, Nomura, Elara Capital, UBS, HSBC, Kotak, JM Financial, ICRA, Bajaj Broking
          <br /><br />
          <strong style={{ color: C.dim }}>Methodology:</strong> Nuclear/contamination scores are analytical estimates based on IAEA reports, March wind patterns, and maritime current models — NOT confirmed measurements. Projections use 19-day trend extrapolation (scenarios, not forecasts). Household prices from official OMC data and Goodreturns.
          <br /><br />
          <strong style={{ color: C.dim }}>Disclaimer:</strong> This dashboard was built with significant help from AI tools. The project is ongoing and evolving. For informational purposes only — not financial, safety, or evacuation advice.
        </div>
      </footer>
    </div>
  );
}
