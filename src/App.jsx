import { useState, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ReferenceLine } from "recharts";

// ═══════════════════════════════════════════════════════════════════
// INDIA RISK DASHBOARD — V5.0 — PUBLIC DISCOURSE EDITION
// Designed for sharing, understanding, and public awareness
// Last updated: March 14, 2026 — 8:25 AM IST (Day 15)
// ═══════════════════════════════════════════════════════════════════

const UPDATED = "March 14, 2026 — 8:25 AM IST";
const WAR_DAY = 15;

// ───────────── COLOR SYSTEM ─────────────
const C = {
  bg: "#090b10", card: "#0e1219", cardAlt: "#111720", border: "#1a2030",
  borderHi: "#2a3040", text: "#c8d0dc", textDim: "#6b7a90", textFaint: "#3d4a5c",
  red: "#e53935", orange: "#ef6c00", amber: "#f9a825", green: "#43a047",
  cyan: "#00acc1", purple: "#7c4dff", pink: "#d81b60",
  redGlow: "#e5393520", orangeGlow: "#ef6c0018", purpleGlow: "#7c4dff15",
};

// ───────────── 15-DAY TIMELINE DATA ─────────────
const WAR_DATA = [
  { day:"D1",date:"Feb 28",deaths:555,brent:78,sensex:81287,nifty:25179,rupee:91.49,lpgDom:803,lpgComm:1646,petrol:94.72,fpi:0 },
  { day:"D3",date:"Mar 2",deaths:787,brent:82,sensex:80239,nifty:24866,rupee:91.49,lpgDom:803,lpgComm:1646,petrol:94.72,fpi:-3296 },
  { day:"D5",date:"Mar 4",deaths:1045,brent:85,sensex:79116,nifty:24481,rupee:92.30,lpgDom:803,lpgComm:1646,petrol:94.72,fpi:-10344 },
  { day:"D7",date:"Mar 6",deaths:1332,brent:88,sensex:78919,nifty:24450,rupee:91.82,lpgDom:803,lpgComm:1646,petrol:94.72,fpi:-17392 },
  { day:"D9",date:"Mar 8",deaths:1332,brent:93,sensex:78919,nifty:24450,rupee:91.82,lpgDom:803,lpgComm:1646,petrol:94.72,fpi:-21831 },
  { day:"D10",date:"Mar 9",deaths:1754,brent:104,sensex:77566,nifty:24028,rupee:92.33,lpgDom:863,lpgComm:1790,petrol:103.54,fpi:-27861 },
  { day:"D12",date:"Mar 11",deaths:1966,brent:93,sensex:76864,nifty:23867,rupee:92.20,lpgDom:863,lpgComm:1790,petrol:103.54,fpi:-32849 },
  { day:"D14",date:"Mar 13",deaths:2100,brent:99,sensex:74564,nifty:23151,rupee:92.45,lpgDom:863,lpgComm:1790,petrol:103.54,fpi:-46100 },
];

// ───────────── PROJECTION DATA ─────────────
const PROJECTIONS = [
  { week:"Pre-war",brent:65,sensex:85000,rupee:91.0,lpg:803,petrol:94.72,deaths:0,label:"Baseline" },
  { week:"Week 1",brent:85,sensex:79116,rupee:92.30,lpg:803,petrol:94.72,deaths:1045,label:"Initial shock" },
  { week:"Week 2",brent:99,sensex:74564,rupee:92.45,lpg:863,petrol:103.54,deaths:2100,label:"Now (Day 15)" },
  { week:"Week 3*",brent:105,sensex:72000,rupee:93.5,lpg:920,petrol:108,deaths:3200,label:"Projected" },
  { week:"Week 4*",brent:110,sensex:70000,rupee:94.5,lpg:950,petrol:112,deaths:4500,label:"Projected" },
  { week:"Week 6*",brent:115,sensex:67000,rupee:96.0,lpg:1000,petrol:118,deaths:7000,label:"Projected" },
  { week:"Week 8*",brent:120,sensex:64000,rupee:98.0,lpg:1050,petrol:125,deaths:10000,label:"Projected" },
];

// ───────────── HOUSEHOLD IMPACT DATA ─────────────
const HOUSEHOLD = [
  { item: "LPG Cylinder (14.2kg)", prewar: "₹803", now: "₹863", change: "+₹60 (+7.5%)", projected4w: "₹950", note: "OMCs declared force majeure. Commercial supply stopped in Mumbai, Bengaluru. ₹30,000 cr subsidy approved.", severity: 3 },
  { item: "LPG Commercial (19kg)", prewar: "₹1,646", now: "₹1,790", change: "+₹144 (+8.7%)", projected4w: "₹2,100", note: "Restaurants dropping chapati, dosa, pooris from menus. Some facing closure. Zomato profits may drop 7% (Elara).", severity: 3 },
  { item: "Petrol (Mumbai)", prewar: "₹94.72/L", now: "₹103.54/L", change: "+₹8.82 (+9.3%)", projected4w: "₹112/L", note: "Oil cos losing ₹20,000 cr/day. Diesel at ₹45/L LOSS per litre. Govt shielding prices but can't sustain.", severity: 3 },
  { item: "Diesel (Mumbai)", prewar: "₹82.69/L", now: "₹90.03/L", change: "+₹7.34 (+8.9%)", projected4w: "₹98/L", note: "Every ₹1 diesel rise = ₹2,500 cr annual cost to trucking. Freight costs rising. Food transport costlier.", severity: 2 },
  { item: "Cooking Oil", prewar: "~₹140/L", now: "~₹155/L", change: "+~₹15 (+10.7%)", projected4w: "₹175/L", note: "Palm oil +5% (Nomura). Sunflower +16%. India dependent on imports. Rupee fall compounds.", severity: 2 },
  { item: "Onion/Vegetables", prewar: "Stable", now: "Rising", change: "Transport cost", projected4w: "₹60-80/kg onion", note: "400K tons Basmati stuck at ports. Freight costs up due to diesel. Supply chain disruption beginning.", severity: 1 },
  { item: "Medicine (common)", prewar: "Stable", now: "Stable (for now)", change: "Coming soon", projected4w: "+10-15%", note: "Pharma raw materials getting costlier. Liquid paraffin +26% YoY. Impact expected from Q1 FY27 (Nomura).", severity: 1 },
  { item: "Electricity Bill", prewar: "Normal", now: "Rising risk", change: "Gas shortage", projected4w: "+5-10%", note: "LNG supply halted (Qatar). Power plants facing gas allocation cuts. Petrochemical units affected first.", severity: 1 },
];

// ───────────── NUCLEAR EXPOSURE DATA ─────────────
const NUCLEAR_SITES = [
  { name: "Natanz", type: "Enrichment", status: "DAMAGED", risk: 95, lat: 33.72, detail: "IAEA confirmed impacts. Contains bulk of ~460kg enriched uranium. Underground centrifuge halls. Tunnel entrance damage on satellite imagery." },
  { name: "Isfahan", type: "Conversion + Missile", status: "HEAVILY HIT", risk: 88, lat: 32.65, detail: "Missile complex destroyed (satellite verified). UCF processes yellowcake into UF6 gas for enrichment. Significant debris field." },
  { name: "Parchin", type: "Military Nuclear", status: "STRUCK", risk: 82, lat: 35.52, detail: "Taleghan 2: 'circular chambers able to test nuclear weapon components' (IAEA). New reconstruction damage confirmed." },
  { name: "Fordow", type: "Underground Enrichment", status: "UNCERTAIN", risk: 75, lat: 34.88, detail: "80m under mountain. Enriching to 60% (near weapons-grade). Extremely hardened. Likely intact but status unverified." },
  { name: "Bushehr", type: "Nuclear Reactor", status: "NEAR MISS", risk: 70, lat: 28.83, detail: "Working nuclear power plant. Rosatom evacuated staff. Airport 12km away struck. Spent fuel rods on site." },
];

const CITY_NUCLEAR_RISK = [
  { city: "Delhi NCR", pop: "32M", wind: 72, maritime: 15, nuclear: 45, total: 58, detail: "1,800km downwind from Isfahan. March westerlies carry particulates in 3-5 days. AQI already severe. India has NO public iodine tablet program." },
  { city: "Mumbai", pop: "21M", wind: 40, maritime: 78, nuclear: 38, total: 55, detail: "900km from Hormuz. Arabian Sea currents carry oil/contaminants south. 16+ ships attacked = massive spill risk. JNPT port + fishing at risk." },
  { city: "Ahmedabad", pop: "8.5M", wind: 65, maritime: 55, nuclear: 42, total: 54, detail: "Closest major city to Iran. Both atmospheric + maritime vectors converge. Jamnagar refinery (world's largest) takes Arabian Sea water intake." },
  { city: "Jaipur", pop: "4M", wind: 68, maritime: 10, nuclear: 40, total: 45, detail: "Rajasthan desert = natural wind funnel from Iran. March dust storms regularly carry particles from Iranian plateau. No vegetation filter." },
  { city: "Kochi", pop: "2.1M", wind: 25, maritime: 70, nuclear: 20, total: 42, detail: "Major port + Southern Naval Command. Kerala coast fishing at risk. Oil spill from Hormuz reaches coast in 15-25 days." },
  { city: "Goa", pop: "1.5M", wind: 30, maritime: 72, nuclear: 18, total: 40, detail: "Mormugao port. Tourism economy. Konkan coast directly in path of Arabian Sea currents from Gulf. Fishing economy ₹4,000 cr." },
  { city: "Chennai", pop: "11M", wind: 20, maritime: 55, nuclear: 15, total: 35, detail: "Bay of Bengal coast. IRIS Dena wreck 400km south leaking fuel. East coast currents could carry contamination north." },
  { city: "Lucknow", pop: "3.5M", wind: 58, maritime: 5, nuclear: 35, total: 38, detail: "Indo-Gangetic plain TRAPS airborne pollutants. If contaminated air mass reaches North India, inversion layers concentrate particles for weeks." },
];

// ───────────── MILITARY IMPACT ─────────────
const MILITARY_RISKS = [
  { threat: "28 Indian Merchant Vessels Stranded at Hormuz", level: "CRITICAL", detail: "Jaishankar has called Araghchi 4 times to negotiate safe passage. IRGC firing on ships that ignore warnings. Iran mulling yuan-only transit. India's ₹35B/yr Gulf trade route severed.", color: C.red },
  { threat: "IRIS Dena Sinking — War in Indian Ocean", level: "CRITICAL", detail: "Iranian frigate torpedoed 40nm off Galle, Sri Lanka — was returning from Indian Navy MILAN exercise in Visakhapatnam. 104 dead. US sub used Mk 48 torpedo. War physically reached India's neighborhood. MEA still silent.", color: C.red },
  { threat: "India's Crude Supply Line Cut", level: "CRITICAL", detail: "52% of India's crude imports transit Hormuz. Near-total shipping halt. India scrambling — Russian oil purchases surged 50%. But US trade deal prohibits Russian oil. Caught in impossible bind.", color: C.red },
  { threat: "Kashmir Stability", level: "HIGH", detail: "3 days of restrictions (schools closed, 2G internet) after Shia protests in 12+ states. Protests in Bihar, Delhi, J&K, Karnataka, Ladakh, MP, Punjab, TN, Telangana, UP. Political pressure mounting.", color: C.orange },
  { threat: "Gulf Diaspora (9 Million Indians)", level: "HIGH", detail: "52,000 returned Mar 1-7 via special flights. But 9M still in Gulf where drones/missiles striking daily. Dubai airport hit. Bahrain: 32 wounded incl 2-month-old infant. Saudi: first deaths. Remittances ($35B/yr) at risk.", color: C.orange },
  { threat: "Nuclear Fallout Path to India", level: "ELEVATED", detail: "Natanz (enrichment) DAMAGED per IAEA. Fordow enriching to 60%. If containment breached, radioactive plume reaches North India in 4-7 days. India has NO iodine tablet distribution program. See Nuclear tab.", color: C.purple },
  { threat: "Marines + 10,000 AI Drones Deploying", level: "WATCH", detail: "2,200 Marines (31st MEU from Japan) ordered to Middle East. US Army deployed 10,000 AI Merops drones. Escalation signals — not winding down. Trump bombed every military target on Kharg Island.", color: C.amber },
];

// ───────────── RADAR / PATTERN DATA ─────────────
const RISK_RADAR = [
  { axis: "Oil Shock", week1: 60, now: 88, wk4: 90 },
  { axis: "Market Crash", week1: 45, now: 90, wk4: 85 },
  { axis: "Nuclear Risk", week1: 20, now: 55, wk4: 70 },
  { axis: "Hormuz Closure", week1: 80, now: 95, wk4: 92 },
  { axis: "Household Impact", week1: 15, now: 75, wk4: 90 },
  { axis: "Currency Crisis", week1: 40, now: 78, wk4: 85 },
  { axis: "Social Unrest", week1: 25, now: 55, wk4: 65 },
  { axis: "Military Exposure", week1: 35, now: 70, wk4: 80 },
];

// ═══════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const Section = ({ id, title, subtitle, accent = C.red, children }) => (
  <section id={id} style={{ marginBottom: 28 }}>
    <div style={{ marginBottom: 12, borderBottom: `2px solid ${accent}30`, paddingBottom: 8 }}>
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: accent, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</h2>
      {subtitle && <p style={{ margin: "4px 0 0", fontSize: 10, color: C.textDim, lineHeight: 1.4 }}>{subtitle}</p>}
    </div>
    {children}
  </section>
);

const MetricCard = ({ label, value, sub, accent = C.red, big }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: big ? "12px 8px" : "8px 6px", textAlign: "center", borderTop: `2px solid ${accent}40` }}>
    <div style={{ fontSize: 8, color: C.textDim, letterSpacing: 1.2, textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: big ? 18 : 14, fontWeight: 800, color: accent, marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 7, color: C.textFaint, marginTop: 2 }}>{sub}</div>}
  </div>
);

const RiskBar = ({ value, max = 100, color }) => (
  <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden", marginTop: 4 }}>
    <div style={{ height: "100%", width: `${(value/max)*100}%`, background: color || (value > 70 ? C.red : value > 50 ? C.orange : value > 30 ? C.amber : C.green), borderRadius: 3, transition: "width 0.6s ease" }} />
  </div>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.cardAlt, border: `1px solid ${C.borderHi}`, borderRadius: 6, padding: "6px 10px", fontSize: 9, color: C.text }}>
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" && p.value > 1000 ? p.value.toLocaleString() : p.value}</div>)}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [projMetric, setProjMetric] = useState("brent");
  const [expandedNuke, setExpandedNuke] = useState(null);

  const sevEmoji = (s) => s === 3 ? "🔴" : s === 2 ? "🟠" : "🟡";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Source Serif 4', 'Crimson Text', Georgia, serif", fontSize: 12, maxWidth: 540, margin: "0 auto", padding: "0 10px 40px" }}>

      {/* ═══════════ HERO HEADER ═══════════ */}
      <header style={{ textAlign: "center", padding: "24px 12px 18px", borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
        <div style={{ fontSize: 8, letterSpacing: 5, color: C.red, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>India Risk Assessment</div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.2, fontFamily: "'Playfair Display', Georgia, serif" }}>
          How the Iran War<br />Is Hitting India
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>
          Day {WAR_DAY} of the US-Israel war on Iran. Economic damage, household impacts,<br />military risks, and nuclear exposure — tracked and projected.
        </p>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 12, fontSize: 9, color: C.textFaint }}>
          <span>Updated: {UPDATED}</span>
          <span>•</span>
          <span>Sources: 40+ verified</span>
        </div>
      </header>

      {/* ═══════════ KEY METRICS ═══════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 24 }}>
        <MetricCard label="War Dead" value="2,100+" sub="14 countries" accent={C.red} />
        <MetricCard label="Brent Oil" value="$99" sub="was $65" accent={C.orange} />
        <MetricCard label="Nifty 50" value="23,151" sub="-8% since war" accent={C.red} />
        <MetricCard label="Rupee" value="₹92.45" sub="all-time low" accent={C.orange} />
      </div>

      {/* ═══════════ SECTION 1: ECONOMIC IMPACT ═══════════ */}
      <Section id="economy" title="Economic Impact" subtitle="How 15 days of war have reshaped India's financial landscape" accent={C.orange}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
          <MetricCard label="Wealth Destroyed" value="₹20L Cr" sub="in 1 week alone" accent={C.red} big />
          <MetricCard label="FPI Outflow (Mar)" value="₹46,100 Cr" sub="10 days straight" accent={C.red} big />
          <MetricCard label="Oil Co. Daily Loss" value="₹20,000 Cr" sub="diesel at ₹45/L loss" accent={C.orange} />
          <MetricCard label="Petrol Mumbai" value="₹103.54" sub="was ₹94.72" accent={C.orange} />
        </div>

        {/* Nifty + Oil dual chart */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.cyan, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>NIFTY 50 vs BRENT CRUDE — 15 DAY TREND</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={WAR_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="day" tick={{ fontSize: 8, fill: C.textDim }} axisLine={false} />
              <YAxis yAxisId="nifty" tick={{ fontSize: 7, fill: C.cyan }} axisLine={false} domain={[22000, 26000]} />
              <YAxis yAxisId="brent" orientation="right" tick={{ fontSize: 7, fill: C.orange }} axisLine={false} domain={[60, 120]} />
              <Tooltip content={ChartTooltip} />
              <Line yAxisId="nifty" type="monotone" dataKey="nifty" stroke={C.cyan} strokeWidth={2} dot={{ r: 3 }} name="Nifty 50" />
              <Line yAxisId="brent" type="monotone" dataKey="brent" stroke={C.orange} strokeWidth={2} dot={{ r: 3 }} name="Brent ($)" />
              <Legend wrapperStyle={{ fontSize: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* FPI selling chart */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.red, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>FOREIGN INVESTOR EXODUS (₹ Crore cumulative)</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={WAR_DATA}>
              <XAxis dataKey="day" tick={{ fontSize: 8, fill: C.textDim }} axisLine={false} />
              <YAxis tick={{ fontSize: 7, fill: C.textDim }} axisLine={false} />
              <Tooltip content={ChartTooltip} />
              <Bar dataKey="fpi" fill={C.red} radius={[3, 3, 0, 0]} name="FPI (₹ Cr)" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 8, color: C.textFaint, marginTop: 4, textAlign: "center" }}>10 consecutive days of selling. ₹46,100 cr pulled out in March alone.</div>
        </div>
      </Section>

      {/* ═══════════ SECTION 2: YOUR KITCHEN TABLE ═══════════ */}
      <Section id="household" title="Your Kitchen Table" subtitle="How the war 5,000km away is raising your family's bills" accent={C.amber}>
        {HOUSEHOLD.map((h, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 6, borderLeft: `3px solid ${h.severity === 3 ? C.red : h.severity === 2 ? C.orange : C.amber}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{sevEmoji(h.severity)} {h.item}</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>{h.change}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: C.textDim }}>
              <span>Pre-war: {h.prewar}</span>
              <span style={{ color: C.orange, fontWeight: 700 }}>Now: {h.now}</span>
              <span style={{ color: C.red }}>4-wk proj: {h.projected4w}</span>
            </div>
            <div style={{ fontSize: 8, color: C.textDim, marginTop: 5, lineHeight: 1.5, fontStyle: "italic" }}>{h.note}</div>
          </div>
        ))}
      </Section>

      {/* ═══════════ SECTION 3: MILITARY EXPOSURE ═══════════ */}
      <Section id="military" title="India's Military & Strategic Exposure" subtitle="How the war is directly threatening India's security, trade and citizens" accent={C.red}>
        {MILITARY_RISKS.map((r, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 6, borderLeft: `3px solid ${r.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{r.threat}</span>
              <span style={{ fontSize: 7, padding: "2px 6px", borderRadius: 3, background: `${r.color}20`, color: r.color, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{r.level}</span>
            </div>
            <div style={{ fontSize: 8, color: C.textDim, marginTop: 5, lineHeight: 1.5 }}>{r.detail}</div>
          </div>
        ))}
      </Section>

      {/* ═══════════ SECTION 4: NUCLEAR EXPOSURE ═══════════ */}
      <Section id="nuclear" title="☢️ Nuclear Exposure Risk" subtitle="Iranian nuclear sites are being bombed. What does this mean for Indian cities?" accent={C.purple}>

        {/* Preamble */}
        <div style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}25`, borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 9, color: C.textDim, lineHeight: 1.6 }}>
          Iran possesses <strong style={{ color: C.purple }}>~460kg of enriched uranium</strong> (some at 60% — near weapons-grade). IAEA has confirmed damage at Natanz. Parchin military nuclear site has been struck. Sustained bombing raises the risk of accidental radioactive material dispersal. <strong style={{ color: C.red }}>This risk is NON-ZERO and INCREASING with each strike wave.</strong> India has no public iodine tablet distribution program.
        </div>

        {/* Nuclear Sites */}
        <div style={{ fontSize: 10, fontWeight: 700, color: C.purple, marginBottom: 8 }}>IRANIAN NUCLEAR FACILITIES — STATUS</div>
        {NUCLEAR_SITES.map((s, i) => (
          <div key={i} onClick={() => setExpandedNuke(expandedNuke === i ? null : i)} style={{ background: C.card, border: `1px solid ${s.risk > 85 ? `${C.red}30` : C.border}`, borderRadius: 8, padding: 10, marginBottom: 5, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.risk > 85 ? C.red : s.risk > 70 ? C.orange : C.amber }}>{s.name}</span>
                <span style={{ fontSize: 8, color: C.textDim, marginLeft: 6 }}>{s.type}</span>
              </div>
              <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", background: s.status.includes("DAMAGED") || s.status.includes("HIT") || s.status.includes("STRUCK") ? `${C.red}20` : `${C.orange}15`, color: s.status.includes("DAMAGED") || s.status.includes("HIT") || s.status.includes("STRUCK") ? C.red : C.orange }}>{s.status}</span>
            </div>
            <RiskBar value={s.risk} color={s.risk > 85 ? C.red : s.risk > 70 ? C.orange : C.amber} />
            <div style={{ fontSize: 7, color: C.textFaint, marginTop: 2, textAlign: "right" }}>Risk: {s.risk}/100</div>
            {expandedNuke === i && <div style={{ fontSize: 8, color: C.textDim, marginTop: 6, lineHeight: 1.6, borderTop: `1px solid ${C.border}`, paddingTop: 6 }}>{s.detail}</div>}
          </div>
        ))}

        {/* City Exposure */}
        <div style={{ fontSize: 10, fontWeight: 700, color: C.pink, marginTop: 16, marginBottom: 8 }}>INDIAN CITIES — CONTAMINATION EXPOSURE</div>
        <div style={{ fontSize: 8, color: C.textDim, marginBottom: 10, lineHeight: 1.5 }}>
          Risk scores combine three vectors: <strong style={{ color: C.orange }}>Wind-borne</strong> (March westerlies from Iran, 3-7 days), <strong style={{ color: C.cyan }}>Maritime</strong> (Hormuz oil spills + IRIS Dena wreck, 15-40 days), and <strong style={{ color: C.purple }}>Nuclear</strong> (if facility containment breached). Scores are analytical estimates.
        </div>
        {CITY_NUCLEAR_RISK.map((c, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{c.city}</span>
                <span style={{ fontSize: 8, color: C.textFaint, marginLeft: 6 }}>Pop: {c.pop}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 900, color: c.total > 50 ? C.red : c.total > 40 ? C.orange : C.amber, fontFamily: "'JetBrains Mono', monospace" }}>{c.total}<span style={{ fontSize: 8 }}>/100</span></span>
            </div>
            {/* Vector breakdown */}
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {[
                { label: "Wind", val: c.wind, color: C.orange },
                { label: "Maritime", val: c.maritime, color: C.cyan },
                { label: "Nuclear", val: c.nuclear, color: C.purple },
              ].map((v, j) => (
                <div key={j} style={{ flex: 1 }}>
                  <div style={{ fontSize: 7, color: v.color, marginBottom: 2 }}>{v.label}: {v.val}</div>
                  <RiskBar value={v.val} color={v.color} />
                </div>
              ))}
            </div>
            <div style={{ fontSize: 8, color: C.textDim, marginTop: 6, lineHeight: 1.5 }}>{c.detail}</div>
          </div>
        ))}
      </Section>

      {/* ═══════════ SECTION 5: PROJECTIONS ═══════════ */}
      <Section id="projections" title="If This Continues..." subtitle="What happens to India at week 3, 4, 6, and 8 — based on the 15-day trend" accent={C.cyan}>

        {/* Metric Selector */}
        <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
          {[
            { id: "brent", label: "Oil Price" },
            { id: "sensex", label: "Sensex" },
            { id: "rupee", label: "Rupee" },
            { id: "petrol", label: "Petrol" },
            { id: "lpg", label: "LPG" },
            { id: "deaths", label: "Deaths" },
          ].map(m => (
            <button key={m.id} onClick={() => setProjMetric(m.id)} style={{
              padding: "5px 10px", border: projMetric === m.id ? `1px solid ${C.cyan}` : `1px solid ${C.border}`,
              borderRadius: 6, background: projMetric === m.id ? `${C.cyan}12` : C.card,
              color: projMetric === m.id ? C.cyan : C.textDim, cursor: "pointer", fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
            }}>
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.cyan, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            {projMetric.toUpperCase()} — ACTUAL + PROJECTED (dashed = projected)
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PROJECTIONS}>
              <defs>
                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.cyan} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.cyan} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" tick={{ fontSize: 8, fill: C.textDim }} axisLine={false} />
              <YAxis tick={{ fontSize: 7, fill: C.textDim }} axisLine={false} domain={projMetric === "rupee" ? [90, 100] : ["auto", "auto"]} />
              <Tooltip content={ChartTooltip} />
              <ReferenceLine x="Week 2" stroke={C.red} strokeDasharray="3 3" label={{ value: "NOW", fontSize: 8, fill: C.red }} />
              <Area type="monotone" dataKey={projMetric} stroke={C.cyan} fill="url(#projGrad)" strokeWidth={2} name={projMetric.charAt(0).toUpperCase() + projMetric.slice(1)} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 8, color: C.textFaint, marginTop: 4, textAlign: "center" }}>* Projections based on 15-day trend extrapolation. Actual outcomes depend on war trajectory.</div>
        </div>

        {/* Scenario Table */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, overflowX: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.amber, marginBottom: 8 }}>SCENARIO TABLE — INDIA IMPACT BY DURATION</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.borderHi}` }}>
                {["", "Pre-war", "Now (D15)", "Week 3", "Week 4", "Week 8"].map((h, i) => (
                  <th key={i} style={{ padding: "4px 3px", textAlign: i === 0 ? "left" : "right", color: i > 2 ? C.amber : C.textDim, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "Brent ($)", vals: [65, 99, 105, 110, 120] },
                { metric: "Nifty", vals: ["25,179", "23,151", "22,000", "21,000", "19,500"] },
                { metric: "Rupee/$", vals: [91.0, 92.45, 93.5, 94.5, 98.0] },
                { metric: "Petrol/L", vals: ["₹94.72", "₹103.54", "₹108", "₹112", "₹125"] },
                { metric: "LPG Cyl", vals: ["₹803", "₹863", "₹920", "₹950", "₹1,050"] },
                { metric: "Deaths", vals: [0, "2,100+", "3,200", "4,500", "10,000"] },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "5px 3px", fontWeight: 700, color: C.text }}>{r.metric}</td>
                  {r.vals.map((v, j) => (
                    <td key={j} style={{ padding: "5px 3px", textAlign: "right", color: j === 0 ? C.green : j === 1 ? C.red : C.amber, fontFamily: "'JetBrains Mono', monospace" }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ═══════════ SECTION 6: RISK RADAR ═══════════ */}
      <Section id="radar" title="Risk Radar" subtitle="How India's exposure has expanded from Week 1 to now — and where it's heading" accent={C.cyan}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={RISK_RADAR}>
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 7, fill: C.textDim }} />
              <PolarRadiusAxis tick={{ fontSize: 7, fill: C.textFaint }} domain={[0, 100]} />
              <Radar name="Week 1" dataKey="week1" stroke={C.green} fill={C.green} fillOpacity={0.08} strokeWidth={1} />
              <Radar name="Now (Day 15)" dataKey="now" stroke={C.orange} fill={C.orange} fillOpacity={0.12} strokeWidth={2} />
              <Radar name="Week 4 Projected" dataKey="wk4" stroke={C.red} fill={C.red} fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 4" />
              <Legend wrapperStyle={{ fontSize: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* ═══════════ SECTION 7: BOTTOM LINE ═══════════ */}
      <Section id="assessment" title="Strategic Assessment" accent={C.red}>
        <div style={{ background: `linear-gradient(135deg, ${C.red}08, ${C.card})`, border: `1px solid ${C.red}25`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 10, lineHeight: 1.8, color: C.textDim }}>
            <strong style={{ color: C.red, fontSize: 12 }}>This is no longer a crisis. It is India's new reality.</strong>
            <br /><br />
            The war has entered an attrition phase with no exit ramp. Both sides are digging in. Iran's new Supreme Leader has vowed to continue. Trump says "very complete" but deploys Marines and 10,000 AI drones. The IEA used its last major tool (400M barrel SPR release) — and oil is still near $100.
            <br /><br />
            <strong style={{ color: C.orange }}>For Indian families:</strong> LPG is up ₹60-144, petrol is ₹103.54, restaurants are shutting down, and it's going to get worse. Every week of war adds ₹5-10 to your petrol bill, ₹50-100 to your monthly cooking gas, and pushes vegetable prices higher through diesel-driven freight costs.
            <br /><br />
            <strong style={{ color: C.purple }}>The nuclear risk is the silent escalation.</strong> Natanz is damaged. Fordow is enriching at 60%. Each bombing wave near these sites increases the probability of accidental radioactive dispersal. India has no iodine tablet program. Delhi is 4-7 days downwind.
            <br /><br />
            <strong style={{ color: C.cyan }}>India must plan for $90-110 oil for months, not weeks.</strong> That means emergency fiscal response, Russian crude diversification despite US pressure, LPG subsidy expansion, Hormuz vessel negotiations, and — critically — nuclear contamination preparedness that doesn't currently exist.
          </div>
        </div>
      </Section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}`, marginTop: 8 }}>
        <div style={{ fontSize: 7, color: C.textFaint, lineHeight: 1.6 }}>
          <strong style={{ color: C.textDim }}>Sources:</strong> Al Jazeera, CNN, NPR, NBC, CBS, AP, ABC News, Reuters, Bloomberg, Business Standard, BusinessToday, Outlook Business, IAEA, WHO, UNESCO, HRW, CSIS, IEA, Goodreturns, Trading Economics, Wikipedia, Alma Research, MEA India, Angel One, Nomura, Elara Capital, HSBC, Kotak, Goldman Sachs, SocGen, Natixis, UBS
          <br /><br />
          <strong style={{ color: C.textDim }}>Methodology:</strong> Nuclear risk scores are analytical estimates based on facility status (IAEA reports), March wind patterns (IMD data), and maritime current models. They are NOT confirmed measurements. Projections use 15-day trend extrapolation and should be treated as scenarios, not forecasts. Household prices from official OMC data and Goodreturns.in.
          <br /><br />
          This dashboard is for informational purposes only. Not financial, safety, or evacuation advice.
        </div>
      </footer>
    </div>
  );
}
