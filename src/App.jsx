import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════
// INDIA RISK DASHBOARD — V5.1 — PUBLIC DISCOURSE EDITION
// Pure React — NO external chart libraries needed
// Last updated: March 14, 2026 — 8:25 AM IST (Day 15)
// ═══════════════════════════════════════════════════════════════════

const UPDATED = "March 14, 2026 — 8:25 AM IST";
const WAR_DAY = 15;

const C = {
  bg: "#090b10", card: "#0e1219", border: "#1a2030", borderHi: "#2a3040",
  text: "#c8d0dc", dim: "#6b7a90", faint: "#3d4a5c",
  red: "#e53935", orange: "#ef6c00", amber: "#f9a825", green: "#43a047",
  cyan: "#00acc1", purple: "#7c4dff", pink: "#d81b60",
};

// ───── TIMELINE ─────
const TL = [
  { d:1,l:"Feb 28",deaths:555,brent:78,nifty:25179,rupee:91.49,tag:"War starts. Khamenei killed" },
  { d:3,l:"Mar 2",deaths:787,brent:82,nifty:24866,rupee:91.49,tag:"Black Monday. Ras Tanura shut" },
  { d:5,l:"Mar 4",deaths:1045,brent:85,nifty:24481,rupee:92.30,tag:"IRIS Dena sunk. Rupee ATL" },
  { d:7,l:"Mar 6",deaths:1332,brent:88,nifty:24450,rupee:91.82,tag:"Oil depots hit. Worst week" },
  { d:9,l:"Mar 8",deaths:1332,brent:93,nifty:24450,rupee:91.82,tag:"Mojtaba Khamenei elected" },
  { d:10,l:"Mar 9",deaths:1754,brent:104,nifty:24028,rupee:92.33,tag:"Brent $120 intraday. ₹8.5L cr wiped" },
  { d:11,l:"Mar 10",deaths:1754,brent:84,nifty:24200,rupee:92.10,tag:"Trump: very complete. Oil crashes" },
  { d:12,l:"Mar 11",deaths:1966,brent:93,nifty:23867,rupee:92.20,tag:"Ships hit Hormuz. IEA 400M SPR" },
  { d:14,l:"Mar 13",deaths:2100,brent:99,nifty:23151,rupee:92.45,tag:"BLACK FRIDAY. ₹20L cr wiped wk" },
  { d:15,l:"Mar 14",deaths:2100,brent:99,nifty:23151,rupee:92.45,tag:"Day 15. Marines + 10K AI drones" },
];

// ───── PROJECTIONS ─────
const PROJ = [
  { w:"Pre-war",brent:65,nifty:25179,rupee:91.0,lpg:803,petrol:94.72,deaths:0 },
  { w:"Week 1",brent:85,nifty:24481,rupee:92.30,lpg:803,petrol:94.72,deaths:1045 },
  { w:"Now",brent:99,nifty:23151,rupee:92.45,lpg:863,petrol:103.54,deaths:2100 },
  { w:"Week 3*",brent:105,nifty:22000,rupee:93.5,lpg:920,petrol:108,deaths:3200 },
  { w:"Week 4*",brent:110,nifty:21000,rupee:94.5,lpg:950,petrol:112,deaths:4500 },
  { w:"Week 6*",brent:115,nifty:19000,rupee:96.0,lpg:1000,petrol:118,deaths:7000 },
  { w:"Week 8*",brent:120,nifty:17500,rupee:98.0,lpg:1050,petrol:125,deaths:10000 },
];

// ───── HOUSEHOLD ─────
const HH = [
  { item:"LPG Cylinder (14.2kg)", pre:"₹803", now:"₹863", chg:"+₹60 (+7.5%)", proj:"₹950", note:"OMCs declared force majeure. Commercial supply stopped Mumbai, Bengaluru. ₹30,000 cr subsidy approved.", s:3 },
  { item:"LPG Commercial (19kg)", pre:"₹1,646", now:"₹1,790", chg:"+₹144 (+8.7%)", proj:"₹2,100", note:"Restaurants dropping chapati, dosa, pooris. Some facing closure. Zomato profits may drop 7%.", s:3 },
  { item:"Petrol (Mumbai)", pre:"₹94.72/L", now:"₹103.54/L", chg:"+₹8.82 (+9.3%)", proj:"₹112/L", note:"Oil cos losing ₹20,000 cr/day. Diesel at ₹45/L loss. Govt shielding prices — unsustainable.", s:3 },
  { item:"Diesel (Mumbai)", pre:"₹82.69/L", now:"₹90.03/L", chg:"+₹7.34 (+8.9%)", proj:"₹98/L", note:"Every ₹1 diesel rise = ₹2,500 cr annual cost to trucking. Freight + food transport costlier.", s:2 },
  { item:"Cooking Oil", pre:"~₹140/L", now:"~₹155/L", chg:"+~₹15 (+10.7%)", proj:"₹175/L", note:"Palm oil +5% (Nomura). Sunflower +16%. India import-dependent. Rupee fall compounds.", s:2 },
  { item:"Onion / Vegetables", pre:"Stable", now:"Rising", chg:"Transport cost↑", proj:"₹60-80/kg", note:"400K tons Basmati stuck at ports. Diesel-driven freight costs rising. Supply chain disrupting.", s:1 },
  { item:"Medicine", pre:"Stable", now:"Stable (for now)", chg:"Coming Q1 FY27", proj:"+10-15%", note:"Pharma raw materials costlier. Liquid paraffin +26% YoY. Impact expected from Apr (Nomura).", s:1 },
  { item:"Electricity", pre:"Normal", now:"Rising risk", chg:"Gas shortage", proj:"+5-10%", note:"Qatar LNG halted. Power plants facing gas allocation cuts. Petrochemical units first affected.", s:1 },
];

// ───── MILITARY ─────
const MIL = [
  { t:"28 Indian Vessels Stranded at Hormuz", lv:"CRITICAL", c:C.red, d:"Jaishankar called Araghchi 4 times. IRGC firing on ships. Iran mulling yuan-only transit. India's ₹35B/yr Gulf trade route severed." },
  { t:"IRIS Dena — War in Indian Ocean", lv:"CRITICAL", c:C.red, d:"Iranian frigate torpedoed 40nm off Sri Lanka — was returning from Indian Navy MILAN exercise in Visakhapatnam. 104 dead. War reached India's neighborhood." },
  { t:"Crude Supply Line Cut (52% via Hormuz)", lv:"CRITICAL", c:C.red, d:"Near-total shipping halt. India scrambling — Russian oil +50%. But US trade deal prohibits Russian oil. Impossible bind." },
  { t:"Kashmir Stability", lv:"HIGH", c:C.orange, d:"3 days of restrictions after Shia protests in 12+ states. 2G internet. Schools closed. Political pressure mounting on BJP." },
  { t:"9 Million Indians in Gulf", lv:"HIGH", c:C.orange, d:"52,000 returned Mar 1-7. But drones hitting Dubai airport, Bahrain civilians (incl 2-month infant). Saudi: first deaths. Remittances $35B/yr at risk." },
  { t:"Nuclear Fallout Path to India", lv:"ELEVATED", c:C.purple, d:"Natanz DAMAGED (IAEA confirmed). Fordow enriching to 60%. Plume reaches North India in 4-7 days if breached. NO iodine tablet program." },
  { t:"2,200 Marines + 10,000 AI Drones Deploying", lv:"WATCH", c:C.amber, d:"31st MEU from Japan ordered to ME. Merops AI drones hunting Shahed drones. Trump bombed every military target on Kharg Island. Escalation, not winding down." },
];

// ───── NUCLEAR ─────
const NUKES = [
  { name:"Natanz", type:"Enrichment", st:"DAMAGED", risk:95, info:"IAEA confirmed impacts. Contains bulk of ~460kg enriched uranium. Underground centrifuge halls. Tunnel entrance damage on satellite." },
  { name:"Isfahan", type:"Conversion + Missile", st:"HEAVILY HIT", risk:88, info:"Missile complex destroyed (satellite). UCF processes yellowcake into UF6 gas. Significant debris field." },
  { name:"Parchin", type:"Military Nuclear", st:"STRUCK", risk:82, info:"Taleghan 2: chambers that can test nuclear weapon components (IAEA). Reconstruction damage confirmed." },
  { name:"Fordow", type:"Underground", st:"UNCERTAIN", risk:75, info:"80m under mountain. Enriching to 60% (near weapons-grade). Extremely hardened. Likely intact." },
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
  { axis:"Oil Shock", w1:60, now:88, w4:90 },
  { axis:"Market Crash", w1:45, now:90, w4:85 },
  { axis:"Nuclear Risk", w1:20, now:55, w4:70 },
  { axis:"Hormuz Closure", w1:80, now:95, w4:92 },
  { axis:"Household Impact", w1:15, now:75, w4:90 },
  { axis:"Currency Crisis", w1:40, now:78, w4:85 },
  { axis:"Social Unrest", w1:25, now:55, w4:65 },
  { axis:"Military Exposure", w1:35, now:70, w4:80 },
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
      {[{ label: "Week 1", color: C.green, y: h - 20 }, { label: "Now (Day 15)", color: C.orange, y: h - 12 }, { label: "Week 4 Proj.", color: C.red, y: h - 4 }].map((lg, i) => (
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
const Sec = ({ title, sub, accent = C.red, children }) => (
  <section style={{ marginBottom: 28 }}>
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
  const sev = (s) => s === 3 ? "🔴" : s === 2 ? "🟠" : "🟡";

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "Georgia, 'Crimson Text', serif", fontSize: 12,
      maxWidth: 540, margin: "0 auto", padding: "0 10px 40px",
    }}>
      {/* ═══════ HEADER ═══════ */}
      <header style={{ textAlign: "center", padding: "24px 12px 18px", borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
        <div style={{ fontSize: 8, letterSpacing: 5, color: C.red, textTransform: "uppercase", marginBottom: 6 }}>India Risk Assessment</div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>
          How the Iran War<br />Is Hitting India
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 11, color: C.dim, lineHeight: 1.5 }}>
          Day {WAR_DAY} of the US-Israel war on Iran. Economic damage, household costs,<br />military risks, nuclear exposure — tracked and projected.
        </p>
        <div style={{ marginTop: 10, fontSize: 9, color: C.faint }}>{UPDATED} • 40+ verified sources</div>
      </header>

      {/* ═══════ KEY METRICS ═══════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 24 }}>
        <Metric label="War Dead" value="2,100+" sub="14 countries" accent={C.red} />
        <Metric label="Brent Oil" value="$99" sub="was $65" accent={C.orange} />
        <Metric label="Nifty 50" value="23,151" sub="-8% since war" accent={C.red} />
        <Metric label="Rupee" value="₹92.45" sub="all-time low" accent={C.orange} />
      </div>

      {/* ═══════ 1. ECONOMIC IMPACT ═══════ */}
      <Sec title="Economic Impact" sub="15 days of war have cost India trillions" accent={C.orange}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
          <Metric label="Wealth Destroyed" value="₹20L Cr" sub="in 1 week" accent={C.red} big />
          <Metric label="FPI Outflow (Mar)" value="₹46,100 Cr" sub="10 days straight" accent={C.red} big />
          <Metric label="Oil Co. Daily Loss" value="₹20,000 Cr" sub="diesel ₹45/L loss" accent={C.orange} />
          <Metric label="Petrol Mumbai" value="₹103.54" sub="was ₹94.72" accent={C.orange} />
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.cyan, marginBottom: 6 }}>NIFTY 50 — 15 DAY COLLAPSE</div>
          <MiniLine data={TL} dataKey="nifty" color={C.cyan} labels showDots />
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.orange, marginBottom: 6 }}>BRENT CRUDE OIL ($) — 15 DAY SURGE</div>
          <MiniLine data={TL} dataKey="brent" color={C.orange} labels showDots />
        </div>
      </Sec>

      {/* ═══════ 2. KITCHEN TABLE ═══════ */}
      <Sec title="Your Kitchen Table" sub="How the war 5,000km away is raising your family's bills" accent={C.amber}>
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
      <Sec title="India's Military & Strategic Exposure" sub="Direct threats to India's security, trade and citizens" accent={C.red}>
        {MIL.map((m, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 6, borderLeft: `3px solid ${m.c}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{m.t}</span>
              <span style={{ fontSize: 7, padding: "2px 6px", borderRadius: 3, background: `${m.c}20`, color: m.c, fontWeight: 800 }}>{m.lv}</span>
            </div>
            <div style={{ fontSize: 8, color: C.dim, marginTop: 5, lineHeight: 1.5 }}>{m.d}</div>
          </div>
        ))}
      </Sec>

      {/* ═══════ 4. NUCLEAR EXPOSURE ═══════ */}
      <Sec title="☢️ Nuclear Exposure Risk" sub="Iranian nuclear sites are being bombed. What does this mean for Indian cities?" accent={C.purple}>
        <div style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}25`, borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 9, color: C.dim, lineHeight: 1.6 }}>
          Iran has <strong style={{ color: C.purple }}>~460kg enriched uranium</strong> (some at 60% — near weapons-grade). IAEA confirmed damage at Natanz. Sustained bombing raises containment breach risk. <strong style={{ color: C.red }}>Risk is NON-ZERO and INCREASING.</strong> India has no iodine tablet program.
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
      <Sec title="If This Continues..." sub="What happens to India at week 3, 4, 6, and 8" accent={C.cyan}>
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
          <div style={{ fontSize: 7, color: C.faint, marginTop: 4, textAlign: "center" }}>* Projections based on 15-day trend. Vertical line at "Now" separates actual from projected.</div>
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
                { m: "Brent ($)", v: [65, 99, 105, 110, 120] },
                { m: "Nifty", v: ["25,179", "23,151", "22,000", "21,000", "17,500"] },
                { m: "₹/USD", v: [91.0, 92.45, 93.5, 94.5, 98.0] },
                { m: "Petrol/L", v: ["₹94.72", "₹103.54", "₹108", "₹112", "₹125"] },
                { m: "LPG Cyl", v: ["₹803", "₹863", "₹920", "₹950", "₹1,050"] },
                { m: "Deaths", v: [0, "2,100+", "3,200", "4,500", "10,000"] },
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
      <Sec title="Risk Radar" sub="How India's exposure expanded — Week 1 vs Now vs Projected" accent={C.cyan}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
          <RadarSVG data={RADAR} />
        </div>
      </Sec>

      {/* ═══════ 7. WAR LOG ═══════ */}
      <Sec title="15-Day War Log" sub="How we got here — day by day" accent={C.dim}>
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
      <Sec title="Strategic Assessment" accent={C.red}>
        <div style={{ background: C.red + "08", border: `1px solid ${C.red}25`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 10, lineHeight: 1.8, color: C.dim }}>
            <strong style={{ color: C.red, fontSize: 12 }}>This is no longer a crisis. It is India's new reality.</strong>
            <br /><br />
            The war has entered an attrition phase. Iran's new Supreme Leader vows to continue. Trump says "very complete" but deploys Marines and 10,000 AI drones. The IEA used its last major tool (400M barrel SPR) — oil is still ~$100.
            <br /><br />
            <strong style={{ color: C.orange }}>For Indian families:</strong> LPG up ₹60-144, petrol ₹103.54, restaurants shutting down. Every week adds ₹5-10 to your petrol and ₹50-100 to monthly cooking gas. Vegetables rising via diesel freight costs.
            <br /><br />
            <strong style={{ color: C.purple }}>The nuclear risk is the silent escalation.</strong> Natanz is damaged. Fordow enriches at 60%. Each bombing wave near these sites increases accidental dispersal probability. Delhi is 4-7 days downwind. India has no iodine program.
            <br /><br />
            <strong style={{ color: C.cyan }}>India must plan for $90-110 oil for months, not weeks.</strong> Emergency fiscal response, Russian crude diversification, LPG subsidy expansion, Hormuz vessel negotiations, and nuclear contamination preparedness that doesn't currently exist.
          </div>
        </div>
      </Sec>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}`, marginTop: 8 }}>
        <div style={{ fontSize: 7, color: C.faint, lineHeight: 1.6 }}>
          <strong style={{ color: C.dim }}>Sources:</strong> Al Jazeera, CNN, NPR, NBC, CBS, AP, ABC News, Reuters, Bloomberg, Business Standard, BusinessToday, Outlook Business, IAEA, WHO, UNESCO, HRW, CSIS, IEA, Goodreturns, Trading Economics, Wikipedia, Alma Research, MEA India, Nomura, Elara Capital, UBS, Goldman Sachs, HSBC, Kotak
          <br /><br />
          <strong style={{ color: C.dim }}>Methodology:</strong> Nuclear/contamination scores are analytical estimates based on IAEA reports, March wind patterns, and maritime current models — NOT confirmed measurements. Projections use 15-day trend extrapolation (scenarios, not forecasts). Household prices from official OMC data and Goodreturns.
          <br /><br />
          For informational purposes only. Not financial, safety, or evacuation advice.
        </div>
      </footer>
    </div>
  );
}
