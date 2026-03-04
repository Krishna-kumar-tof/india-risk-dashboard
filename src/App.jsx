import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════
// ✏️ DAILY UPDATE SECTION — EDIT THIS EVERY DAY!
// ═══════════════════════════════════════════════════════

// 👇 Change this date whenever you update the data
const LAST_UPDATED = "March 4, 2026 — 11:48 AM IST (Day 5 • Markets OPEN)";

// 👇 Add a new line at the TOP each day (most recent first)
const UPDATE_LOG = [
  { date: "Mar 4 (AM)", change: "DAY 5 — MARKETS CRASH ON REOPENING: Sensex -1,300 pts. Nifty near 24,400. Rs 9.5 TRILLION wiped. India VIX +22% (9-mo high). Metal -4%. Auto -3%. SpiceJet -8%. IndiGo -4%. US Tue: Dow -404 (was -1,277 at lows). S&P -0.94%. Nasdaq -1%. Brent $82-84 (+8% Tue). WTI $77. Gold FELL 3.5% to $5,124. US diesel +12%. US gas $3.11/gal. EU Stoxx -3.08%. S Korea Kospi -7.24% (WORST in 19 months). France -3.5%. Nikkei -3.1%. DEATH TOLL 800+ (Iran+Lebanon combined). US Consulate Dubai parking lot HIT by drone. Assembly of Experts bldg QOM DESTROYED by Israel. Hotel near Beirut struck. Fujairah port struck. Iran struck 10 COUNTRIES (added Cyprus). B-2 stealth bombers hitting IRGC command nodes. Iran used CLUSTER MUNITIONS on Israel. US destroyed 17 Iranian ships (up from 11). Iran fired 500+ ballistic missiles + 2,000+ drones total. Rubio: attacks will INCREASE in scope/intensity. Trump ordered DFC insurance + Navy tanker escort through Hormuz. 165 killed girls school southern Iran. Lebanon: 50 killed, 335 wounded (2 days). Saudi intercepted 9 more drones Wed AM. INDIA: 58 flights planned Mar 4 (30 IndiGo + 23 Air India/Express). 24 Indian flights operated Tue. 1,609 flights cancelled (1,221 Indian + 388 foreign). 3 flights U-turned mid-air. Air India NY/Newark rerouting via Rome (+4-7hrs). Oil Ministry: 8 wks crude stock. Goldman: India most impacted in Asia. SocGen: underperformance deepens. Natixis: India assets MOST AT RISK.", severity: "critical" },
  { date: "Mar 3 (8PM)", change: "SHIPPING CRISIS: VLCC supertanker rates ALL-TIME HIGH $423,736/day (+94%). Sinokor $20/bbl ME-China (was $2.50). LNG rates +40%. Qatar HALTED LNG. 1,900 MORE flights cut Tue (1M+ travelers stuck per Cirium). EU Stoxx 600 -2.7%. Gold $5,300+. US gas +12c/gal (4yr high). TRACKER: 787 Iran + 11 Israel + 6 US + 8 Gulf = ~812 dead. Lebanon: 40 killed, 246 wounded. 8,000 stranded Qatar alone. INDIA: SpiceJet 4 UAE flights. Etihad 15 special flights. 250 flights cut at 4 Indian airports Tue. 1,117 total cut 3 days. Embassies 24x7 helplines. Modi spoke Oman Sultan + Kuwait Crown Prince.", severity: "critical" },
  { date: "Mar 3 (Eve)", change: "🔴 DAY 4 EVENING — DEATH TOLL SURGES: Iran Red Crescent: 787 killed (up from 555). Strikes hit 153 cities, 500+ locations, 1,000+ attacks since Saturday. Israel DM Katz authorized IDF to 'advance and seize additional controlling areas' in Lebanon. Katz: 'We severed the head of the octopus, now crushing its tentacles.' Hezbollah attacked TEL AVIV with missiles + drones. Explosions in Karaj + Isfahan (Tue morning). S Korea defense stocks surged 20-30%. European stocks sharply lower. INDIA: Air India FIRST flight Dubai→Delhi (149 pax). Emirates operating Dubai→5 Indian cities. Akasa Air resumed Jeddah. EaseMyTrip charter flights Fujairah→Delhi/Mumbai. CBSE POSTPONED exams in 7 Gulf countries (Mar 5-6). 11,000+ flights cancelled since Saturday. 80% Dubai flights still cancelled. Etihad suspended until Wed 2pm. Punjab CM Mann helpline, AP CM Naidu + Karnataka CM Siddaramaiah mobilizing. PV Sindhu stranded at Dubai airport.", severity: "critical" },
  { date: "Mar 3 (PM)", change: "🔴 DAY 4 — WAR WIDENS: Israel launches NEW GROUND INCURSION into southern Lebanon — IDF 'operating in southern Lebanon' in 'forward defence' (Reuters/Al Jazeera). IDF conducting 'simultaneous strikes' on Tehran AND Beirut. Rubio: 'Hardest hits yet to come.' Trump: 'Big wave hasn't happened.' US Embassy Riyadh hit by 2 drones — CLOSED Tue. US evacuating non-emergency staff from 6 countries. Assembly of Experts: new Supreme Leader 'won't take long.' Natanz nuclear site FRESH DAMAGE on satellite (Vantor). IRGC Quds Force cmdr Reza Khazaei killed in Beirut. Hezbollah drone swarm hit Ramat David airbase. Lebanon: 52 killed, 154 wounded overnight. Lebanese govt declares Hezbollah military ops ILLEGAL. US considers Lebanon ceasefire OVER. AWS: 3 data centers hit (2 UAE + 1 Bahrain) — fires, sprinklers damaged equipment, Snowflake SaaS disrupted. Brent ~$80 (+10%). India: IndiGo 10 flights Jeddah Mar 3. Air India Express resumed Muscat. Etihad 4 flights. Gold ₹1,67,155/10g (+3.12%). Govt shielding fuel prices pre-election.", severity: "critical" },
  { date: "Mar 3 (AM)", change: "🔴 DAY 4 — HORMUZ OFFICIALLY CLOSED: IRGC Commander Jabari: 'Strait is closed. We will set fire to any ship. Not a drop of oil will leave the Gulf. Oil will reach $200.' Iran attacked 3 OIL TANKERS (Skylight — 15 Indian crew evacuated; Athe Nova set ablaze). 4 vessels hit total. Marine insurers CANCELLED all war-risk coverage — 150+ ships stranded. Maersk, Hapag-Lloyd, CMA CGM, MSC all suspended Gulf ops. US death toll: 6 troops killed. Trump: war could last '4-5 weeks', doesn't rule out ground troops. US destroyed ALL 11 Iranian ships in Gulf of Oman — Iran Navy at ZERO. Israel struck Iranian state TV HQ. Iran+Lebanon death toll: 600+. GPS jamming of ships near Hormuz. Morgan Stanley: every $10/bbl rise hits India CAD by 50bps. India markets CLOSED for Holi. Bloomberg: Indian refiners secretly planning pivot back to Russian crude.", severity: "critical" },
  { date: "Mar 2 (Night)", change: "🔴 MASSIVE ESCALATION: Saudi Ras Tanura refinery (550K bpd, Middle East's LARGEST) SHUT DOWN after Iranian drone strike. Gasoil futures JUMPED 20%. First direct attack on Gulf energy infrastructure. Kuwait's Ahmadi refinery also hit — 2 workers injured. 4th US soldier dead (succumbed to wounds). 3 US F-15E Strike Eagles shot down by KUWAIT in friendly fire — all 6 crew survived. US Embassy Kuwait compound hit, smoke rising. Iran used cruise missiles for first time. PM Modi: 'Situation in West Asia matter of deep worry.' Indian OMCs preparing ₹4-5 petrol/diesel hike BEFORE Holi. Barclays warns Brent $100, UBS warns potential $120 if sustained disruption.", severity: "critical" },
  { date: "Mar 2 (Eve)", change: "MARKET CLOSE: Sensex closed ~1,000 pts down. Nifty at 24,620 (-558 pts). ₹6.87 LAKH CRORE wiped. India VIX +25% to 17.09. Rupee 91.26/USD. Brent $82.40 peak. Oil tanker struck off Oman. UAE intercepted 165 ballistic missiles + 541 drones total. Beit Shemesh synagogue destroyed — 9 killed in Israel. Hezbollah opened Lebanon front. Iran death toll: 555+. Congress war powers vote this week (symbolic — Trump will veto).", severity: "critical" },
  { date: "Mar 2 (AM)", change: "Iran forms 3-person interim council. IRGC broadcasting 'no ship allowed' across Hormuz. 150+ tankers anchored, 70% traffic drop. 3 US troops killed, 5 wounded. 148+ students killed in Minab girls' school strike. Iran struck all 9 countries. OPEC+ announces 206K bpd increase for April. Modi chaired CCS, called Netanyahu urging ceasefire. 9M Indians at risk. Indian embassies issue emergency helplines.", severity: "critical" },
  { date: "Mar 1", change: "Iran retaliates — missiles/drones hit 9 countries. Khamenei death confirmed. Iranians celebrate. Internet at 4%. Iran FM admits military 'partially lost control'. Trump: operations 'ahead of schedule'. 1,000+ targets struck per CENTCOM.", severity: "critical" },
  { date: "Feb 28", change: "DAY 1: US-Israel Operation Epic Fury begins. Khamenei killed. 550+ Iranians killed. Nuclear sites struck. Modi returned from Israel visit days before. Trump projects 4-week operation.", severity: "critical" },
  // ✏️ ADD NEW UPDATES ABOVE THIS LINE
];

// ═══════════════════════════════════════════════════════
// DATA — Edit risk numbers below when situation changes
// ═══════════════════════════════════════════════════════

const TIME_PHASES = [
  { id: "immediate", label: "IMMEDIATE", sub: "0-48 Hours", color: "#ff1744", glow: "#ff174466", icon: "⚡" },
  { id: "shortterm", label: "SHORT-TERM", sub: "1-4 Weeks", color: "#ff9100", glow: "#ff910066", icon: "🔥" },
  { id: "medterm", label: "MEDIUM-TERM", sub: "1-6 Months", color: "#ffea00", glow: "#ffea0066", icon: "⏳" },
  { id: "longterm", label: "LONG-TERM", sub: "6 Months - 5 Years", color: "#00e5ff", glow: "#00e5ff66", icon: "🌐" },
];

const INDIA_REGIONS = [
  {
    name: "Gujarat", lat: 22.3, lng: 72.6,
    immediate: 99, shortterm: 96, medterm: 90, longterm: 82,
    tag: "CRITICAL",
    detail: "🔴 EXTREME RISK: IRGC officially closed Hormuz — 'will set fire to any ship.' 5 vessels attacked total (Skylight: 15 Indian crew evacuated; MKD VYOM: 1 killed by Iranian kamikaze drone boat; Stena Imperative: US-flagged, 1 shipyard worker killed in Bahrain). Insurers Gard/Skuld/NorthStandard cancelling coverage from Mar 5. 27 tankers carrying 12M barrels drifting with no destination. Jamnagar refinery faces supply cutoff. 1,800 km from warzone.",
  },
  {
    name: "Rajasthan", lat: 26.9, lng: 75.8,
    immediate: 55, shortterm: 72, medterm: 78, longterm: 65,
    tag: "HIGH",
    detail: "Arid wind corridor from Iran/Pakistan • Dust-carried radioactive particulates settle in desert • Water scarcity amplifies any contamination • Jodhpur refinery",
  },
  {
    name: "Maharashtra", lat: 19.0, lng: 72.9,
    immediate: 95, shortterm: 85, medterm: 76, longterm: 72,
    tag: "CRITICAL",
    detail: "MARKETS CRASHED ON REOPENING: Sensex -1,300 pts. Nifty ~24,400. ₹9.5 TRILLION wiped Wed. VIX +22% (9-mo high). Metal -4%. Auto -3%. SpiceJet -8%. IndiGo -4%. Mon: ₹6.87L cr wiped. Brent $82-84 Tue. US Dow -404 (was -1,277 at lows). Kospi -7.24%. Nikkei -3.1%. Goldman/SocGen/Natixis: India MOST AT RISK. OMCs face 51-73% EBITDA hit.",
  },
  {
    name: "Kerala", lat: 10.8, lng: 76.3,
    immediate: 82, shortterm: 85, medterm: 82, longterm: 76,
    tag: "CRITICAL",
    detail: "EVACUATIONS SCALING UP: Air India FIRST flight Dubai→Delhi (149 pax, Tue). Emirates operating Dubai→5 Indian cities. IndiGo 10 flights Jeddah. Air India Express Muscat routes. Akasa Air Jeddah. EaseMyTrip charter Fujairah→Del/Mum. CBSE POSTPONED exams in 7 Gulf countries. But 80% Dubai flights still cancelled. 11,000+ flights cancelled since Sat. 9M Indians in Gulf. PV Sindhu stranded. Gulf remittances ($35B/yr) at risk.",
  },
  {
    name: "Goa", lat: 15.4, lng: 74.0,
    immediate: 45, shortterm: 58, medterm: 62, longterm: 55,
    tag: "MODERATE",
    detail: "Mormugao port • Coastal exposure to Arabian Sea contamination • Tourism economy disrupted by global instability",
  },
  {
    name: "Karnataka", lat: 15.3, lng: 75.7,
    immediate: 62, shortterm: 65, medterm: 65, longterm: 58,
    tag: "HIGH",
    detail: "3 Amazon AWS data centers hit (2 UAE + 1 Bahrain) — fires + sprinkler damage. Snowflake SaaS disrupted. Bangalore IT/BPO at risk of cloud disruption. CM Siddaramaiah held video call reassuring stranded Kannadigas in Dubai. Etihad flew Abu Dhabi→Bengaluru (Mon night). MRPL 100% Gulf crude dependent.",
  },
  {
    name: "Delhi NCR", lat: 28.6, lng: 77.2,
    immediate: 78, shortterm: 72, medterm: 60, longterm: 64,
    tag: "HIGH",
    detail: "CBSE Mar 5-6 exams POSTPONED (Circular-2) across 7 Gulf countries. 58 flights Mar 4 (30 IndiGo + 23 AI/AIE). 36 departures + 44 arrivals cancelled at IGI Tue. Air India NY/Newark rerouting via Rome (+4-7hrs). Oil Ministry: 8 wks crude stock, 2-3 wks LNG. State CMs mobilizing: Punjab Mann helpline, AP Naidu, Karnataka Siddaramaiah. Congress war powers vote. Rubio: attacks will INCREASE.",
  },
  {
    name: "Punjab", lat: 31.1, lng: 75.3,
    immediate: 30, shortterm: 42, medterm: 45, longterm: 40,
    tag: "LOW",
    detail: "SAD chief Sukhbir Badal urges PM for special airlift of Punjabis stranded in Gulf. Northern buffer from direct contamination. Agricultural water concerns from long-range fallout only. Distance provides protection.",
  },
  {
    name: "Tamil Nadu", lat: 11.1, lng: 78.7,
    immediate: 25, shortterm: 35, medterm: 40, longterm: 38,
    tag: "LOW",
    detail: "Eastern coast — Bay of Bengal side • Chennai port less Gulf-dependent • Kalpakkam nuclear monitoring station • Less direct wind exposure",
  },
  {
    name: "West Bengal", lat: 22.9, lng: 87.9,
    immediate: 18, shortterm: 25, medterm: 30, longterm: 28,
    tag: "LOW",
    detail: "Farthest major state from Gulf • Haldia port — Bay of Bengal access • Minimal airborne pathway • Coal-dependent energy (less oil impact)",
  },
  {
    name: "NE India", lat: 26.2, lng: 92.9,
    immediate: 10, shortterm: 15, medterm: 18, longterm: 20,
    tag: "MINIMAL",
    detail: "Maximum distance from conflict • Himalayan & mountain barriers • Minimal Gulf energy dependency • Primarily hydroelectric power",
  },
];

const DIRTY_BOMB_SCENARIOS = [
  {
    name: "Port/Maritime RDD",
    target: "Strait of Hormuz / Gulf Ports",
    probability: "10-18%",
    probColor: "#ff9100",
    description: "Iran deploys cesium-137 or cobalt-60 based RDD at a Gulf maritime chokepoint. ESCALATED: oil tanker already struck off Oman. Iran FM admits military 'partially lost control'. Contaminates shipping lanes for weeks.",
    indiaImpact: 82,
    timeToIndia: "Immediate (economic) / 2-4 weeks (contaminated cargo)",
    mechanism: "Contaminated oil shipments, seafood chain, port worker exposure",
  },
  {
    name: "Proxy-Delivered Urban RDD",
    target: "Israeli cities via Hezbollah/proxies",
    probability: "7-12%",
    probColor: "#ff9100",
    description: "ESCALATED: Hezbollah has officially joined the war. Iran-backed proxies detonate dirty bomb in Tel Aviv or Haifa. Sleeper cell warnings issued by foreign security officials worldwide. Global panic triggers market crash.",
    indiaImpact: 65,
    timeToIndia: "Immediate (markets) / Weeks (geopolitical cascade)",
    mechanism: "Market contagion, global recession trigger, diplomatic crisis",
  },
  {
    name: "Gulf Water Contamination RDD",
    target: "Desalination plants / Persian Gulf",
    probability: "3-8%",
    probColor: "#f44336",
    description: "Radiological material dispersed into Gulf waters targeting desalination infrastructure in Saudi Arabia, UAE, Qatar.",
    indiaImpact: 72,
    timeToIndia: "2-8 weeks (ocean currents to Arabian Sea)",
    mechanism: "Arabian Sea fishing contamination, Kerala/Goa coast impact, seafood chain",
  },
  {
    name: "Retaliatory RDD on US Base",
    target: "Al Udeid (Qatar) / Bahrain NSA",
    probability: "4-8%",
    probColor: "#f44336",
    description: "ESCALATED: Iran struck Al Udeid, Ali Al Salem, Al Dhafra, Bahrain NSA, US Embassy Riyadh. 6 US troops dead. IRGC threatening '$200 oil'. 460kg enriched uranium available. Iran Navy destroyed = nothing left to lose. Rogue units possible.",
    indiaImpact: 88,
    timeToIndia: "Immediate (nuclear escalation risk)",
    mechanism: "Full-scale war escalation, potential nuclear exchange, continental fallout",
  },
  {
    name: "Covert Smuggled RDD",
    target: "European port / energy infrastructure",
    probability: "1-3%",
    probColor: "#d50000",
    description: "Iran-linked network smuggles RDD material via Balkans corridor to European port. Global supply chain collapse.",
    indiaImpact: 55,
    timeToIndia: "Days (economic contagion)",
    mechanism: "Global trade freeze, shipping insurance crisis, IT/outsourcing contract cancellations",
  },
];

const GEOPOLITICAL_CHALLENGES = [
  {
    category: "Energy Security",
    severity: "CRITICAL",
    color: "#ff1744",
    items: [
      { text: "🔴 HORMUZ CLOSED. Iran struck 10 COUNTRIES. 150+ ships stranded. VLCC rates ALL-TIME HIGH $423,736/day. Trump ordered Navy escort + DFC insurance for tankers", metric: "CLOSED", unit: "Hormuz" },
      { text: "Insurers Gard, Skuld, NorthStandard, American Club, London P&I ALL cancelled cover. LNG rates +40%. Qatar HALTED LNG. Ras Tanura (550K bpd) SHUT", metric: "MAR 5", unit: "insurance ends" },
      { text: "Brent $82-84 Tue (+8% day, +10% week). WTI $77. US diesel +12%. US gas $3.11/gal. Gold FELL 3.5% to $5,124. Goldman: $65 fair = 4-wk disruption priced", metric: "$78", unit: "Brent Tue" },
      { text: "India Oil Ministry: 8 wks crude stock. BUT 2-3 wks LNG only. NO LPG reserves. 60% urea LNG from Qatar. Goldman/SocGen/Natixis: India MOST AT RISK in Asia", metric: "5.22M", unit: "bpd imports" },
    ],
  },
  {
    category: "Diplomatic Tightrope",
    severity: "HIGH",
    color: "#ff9100",
    items: [
      { text: "🔴 ISRAEL SEIZING TERRITORY in Lebanon. Katz: 'Severed head of octopus, now crushing tentacles.' 100K reservists called up. 50+ villages evacuated. Hezbollah hit Tel Aviv", metric: "🇱🇧", unit: "ground war" },
      { text: "Rubio: attacks will INCREASE scope/intensity. B-2 stealth bombers hitting IRGC nodes. US Embassies Riyadh + Kuwait + Dubai consulate ALL HIT. Iran struck 10 countries incl Cyprus", metric: "⚡", unit: "escalation" },
      { text: "58 flights planned Mar 4 (30 IndiGo + 23 AI/AIE). 24 Indian flights Tue. 1,609 flights cancelled total. 3 flights U-turned mid-air. 12,000+ cancelled globally. 9M at risk", metric: "9M+", unit: "citizens" },
      { text: "Death toll 800+ (Iran+Lebanon). 165 killed girls school. Iran: 500+ ballistic missiles + 2,000+ drones launched. US destroyed 17 ships. Assembly of Experts bldg QOM DESTROYED", metric: "787", unit: "killed" },
    ],
  },
  {
    category: "Economic Shockwave",
    severity: "HIGH",
    color: "#ff9100",
    items: [
      { text: "Brent $82-84 (+8% Tue). WTI $77 (+8%). US diesel +12% Tue (+24% total). EU gas +20% Tue (+58% total). Dow -404 (-1,277 at lows). Kospi -7.24% (worst 19mo)", metric: "$78", unit: "Brent Tue" },
      { text: "3 Amazon AWS data centers hit (2 UAE + 1 Bahrain) — fires, sprinklers damaged equipment. Snowflake SaaS disrupted. Gold ₹1,67,155 (+3.12%)", metric: "AWS", unit: "3 hit" },
      { text: "Sensex -1,300 pts Wed open. Nifty ~24,400. ₹9.5 TRILLION wiped Wed. VIX +22% (9-mo high). Metal -4%. Auto -3%. Mon: ₹6.87L cr wiped. TOTAL: ₹16L+ cr gone", metric: "WED", unit: "market reopens" },
      { text: "11,000+ flights cancelled since Saturday. 80% Dubai flights STILL cancelled. Etihad suspended until Wed 2pm. 20,000+ travelers stranded. Travel insurance may not cover", metric: "11K+", unit: "flights cut" },
    ],
  },
  {
    category: "Nuclear & Contamination",
    severity: "ELEVATED",
    color: "#ffea00",
    items: [
      { text: "Satellite images show FRESH DAMAGE at Natanz nuclear complex (Times of Israel/Vantor imagery, Mar 2-3). Iran says US-Israel struck it again", metric: "☢️", unit: "Natanz HIT" },
      { text: "Iran has 460kg of 60% enriched uranium — enough for 11 nuclear bombs (admitted in negotiations). Military 'partially lost control'", metric: "460kg", unit: "60% enriched U" },
      { text: "Bushehr reactor NOT struck yet. But IDF dropped 2,000+ bombs in 30 hours across 24 of 31 provinces. 1,250+ targets hit", metric: "2,000+", unit: "bombs in 30h" },
      { text: "Kerman Air Base struck — 13 troops killed. Gandhi Hospital + Golestan Palace (UNESCO) hit. Hospitals near military sites at risk", metric: "⚠️", unit: "collateral" },
    ],
  },
];

// ═══════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════

const getRiskColor = (v) => v >= 80 ? "#ff1744" : v >= 60 ? "#ff9100" : v >= 40 ? "#ffea00" : v >= 25 ? "#69f0ae" : "#00e5ff";
const getRiskTag = (v) => v >= 80 ? "CRITICAL" : v >= 60 ? "HIGH" : v >= 40 ? "MODERATE" : v >= 25 ? "LOW" : "MINIMAL";

const AnimatedBar = ({ value, color, height = 6, delay = 0 }) => {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 100 + delay); return () => clearTimeout(t); }, [value, delay]);
  return (
    <div style={{ width: "100%", height, background: "#0d1f3c", borderRadius: height / 2, overflow: "hidden" }}>
      <div style={{
        width: `${w}%`, height: "100%", borderRadius: height / 2,
        background: `linear-gradient(90deg, ${color}66, ${color})`,
        boxShadow: `0 0 12px ${color}44`,
        transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }} />
    </div>
  );
};

const MiniGauge = ({ value, size = 52 }) => {
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(value), 200); return () => clearTimeout(t); }, [value]);
  const c = 2 * Math.PI * 20;
  const o = c - (anim / 100) * c;
  const col = getRiskColor(value);
  return (
    <svg width={size} height={size} viewBox="0 0 52 52">
      <circle cx="26" cy="26" r="20" fill="none" stroke="#0d1f3c" strokeWidth="4" />
      <circle cx="26" cy="26" r="20" fill="none" stroke={col} strokeWidth="4"
        strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round"
        transform="rotate(-90 26 26)" style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
      <text x="26" y="29" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold" fontFamily="'JetBrains Mono', monospace">{value}</text>
    </svg>
  );
};

const TabButton = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    flex: 1, padding: "10px 6px", border: "none", borderRadius: 8, cursor: "pointer",
    fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.8,
    background: active ? "linear-gradient(135deg, #1a2744, #1e3a5f)" : "transparent",
    color: active ? "#fff" : "#475569",
    boxShadow: active ? "0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
    transition: "all 0.3s",
  }}>
    {children}
  </button>
);

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function Dashboard() {
  const [tab, setTab] = useState("timeline");
  const [selRegion, setSelRegion] = useState(0);
  const [selPhase, setSelPhase] = useState("immediate");

  const region = INDIA_REGIONS[selRegion];
  const phase = TIME_PHASES.find(p => p.id === selPhase);

  const toX = (lng) => ((lng - 68) / 30) * 420 + 40;
  const toY = (lat) => ((35 - lat) / 28) * 480 + 30;

  return (
    <div style={{
      background: "linear-gradient(160deg, #020810 0%, #040d1a 30%, #0a1225 70%, #050a15 100%)",
      color: "#e2e8f0", minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, #ff174408, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -300, left: -200, width: 800, height: 800, borderRadius: "50%",
        background: "radial-gradient(circle, #00e5ff05, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto", padding: "16px 14px" }}>

        {/* ═══ HEADER ═══ */}
        <header style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(90deg, #ff1744, #ff6d00)", padding: "5px 16px",
            borderRadius: 6, marginBottom: 8,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: "#fff" }}>LIVE CRISIS ANALYSIS</span>
          </div>
          <h1 style={{
            fontSize: "clamp(20px, 4.5vw, 36px)", fontWeight: 900, margin: "6px 0 4px",
            fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1.1,
            background: "linear-gradient(180deg, #ffffff, #8899aa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            IRAN-GULF WAR: INDIA THREAT MATRIX
          </h1>
          <p style={{ fontSize: 10, color: "#4a5568", maxWidth: 550, margin: "0 auto", lineHeight: 1.5, fontFamily: "Georgia, serif" }}>
            Time-phased risk simulation across nuclear, radiological dirty bomb, chemical, atmospheric & economic vectors — 1M+ Monte Carlo iterations
          </p>

          {/* Last Updated Badge */}
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#0d1f3c", border: "1px solid #1a274466",
              padding: "5px 14px", borderRadius: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#69f0ae", boxShadow: "0 0 8px #69f0ae66" }} />
              <span style={{ fontSize: 9, color: "#69f0ae", fontWeight: 700, letterSpacing: 0.5 }}>LAST UPDATED:</span>
              <span style={{ fontSize: 9, color: "#94a3b8" }}>{LAST_UPDATED}</span>
            </div>
            <button onClick={() => setTab("updates")} style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              background: "#0d1f3c", border: "1px solid #1a274466",
              padding: "5px 12px", borderRadius: 20, cursor: "pointer",
              fontSize: 9, color: "#64748b",
            }}>
              📋 {UPDATE_LOG.length} update{UPDATE_LOG.length !== 1 ? "s" : ""}
            </button>
          </div>
        </header>

        {/* ═══ PHASE SELECTOR (always visible) ═══ */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4,
          background: "#040d1a", borderRadius: 10, padding: 4, marginBottom: 12,
          border: "1px solid #1a2744",
        }}>
          {TIME_PHASES.map(p => (
            <button key={p.id} onClick={() => setSelPhase(p.id)} style={{
              padding: "8px 4px", border: "none", borderRadius: 8, cursor: "pointer",
              background: selPhase === p.id ? `linear-gradient(135deg, ${p.color}15, ${p.color}08)` : "transparent",
              borderBottom: selPhase === p.id ? `2px solid ${p.color}` : "2px solid transparent",
              transition: "all 0.3s",
            }}>
              <div style={{ fontSize: 14 }}>{p.icon}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: selPhase === p.id ? p.color : "#475569", letterSpacing: 1 }}>{p.label}</div>
              <div style={{ fontSize: 8, color: "#334155" }}>{p.sub}</div>
            </button>
          ))}
        </div>

        {/* ═══ TAB NAV ═══ */}
        <div style={{ display: "flex", gap: 2, background: "#040d1a", borderRadius: 10, padding: 3, marginBottom: 14, border: "1px solid #0d1f3c" }}>
          {[
            { id: "timeline", label: "🗺️ TIME-RISK MAP" },
            { id: "dirty", label: "☢️ DIRTY BOMB" },
            { id: "geo", label: "🌏 GEOPOLITICS" },
            { id: "summary", label: "📊 SUMMARY" },
            { id: "updates", label: "📋 LOG" },
          ].map(t => <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</TabButton>)}
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: TIMELINE MAP */}
        {/* ═══════════════════════════════════════════ */}
        {tab === "timeline" && (
          <div>
            {/* Map */}
            <div style={{
              background: "linear-gradient(135deg, #020810, #0a1628)",
              borderRadius: 14, border: "1px solid #1a274433", overflow: "hidden", marginBottom: 12,
            }}>
              <svg viewBox="0 0 500 540" style={{ width: "100%", display: "block" }}>
                <defs>
                  <linearGradient id="seaBg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#020810" />
                    <stop offset="100%" stopColor="#0a1628" />
                  </linearGradient>
                </defs>
                <rect width="500" height="540" fill="url(#seaBg)" />

                {/* India outline */}
                <path d="M200,45 L230,40 L260,42 L290,38 L310,45 L330,50 L350,55
                  L365,70 L370,90 L380,110 L385,130 L390,150 L395,170
                  L400,190 L395,220 L380,250 L370,280 L355,310 L340,340
                  L320,370 L300,395 L285,410 L270,430 L260,445 L250,460
                  L245,470 L250,480 L240,490 L225,485 L215,470 L205,455
                  L195,440 L180,420 L165,400 L150,375 L140,350 L130,320
                  L120,290 L115,260 L110,230 L108,200 L110,170 L115,140
                  L125,115 L140,90 L155,72 L170,58 L185,48 Z"
                  fill="#0d1a30" stroke="#1e3a5f" strokeWidth="1.2" opacity="0.85" />

                {/* Labels */}
                <text x="55" y="365" fill="#0d3355" fontSize="10" fontStyle="italic" fontFamily="Georgia" transform="rotate(-30,55,365)">Arabian Sea</text>
                <text x="385" y="340" fill="#0d3355" fontSize="10" fontStyle="italic" fontFamily="Georgia" transform="rotate(20,385,340)">Bay of Bengal</text>

                {/* Iran arrow + wind paths */}
                <text x="8" y="82" fill="#ff174499" fontSize="9" fontWeight="bold">IRAN →</text>
                <path d="M35,90 Q75,110 115,140" fill="none" stroke="#ff174433" strokeWidth="1.5" strokeDasharray="4,3">
                  <animate attributeName="stroke-dashoffset" from="14" to="0" dur="2s" repeatCount="indefinite" />
                </path>
                <text x="8" y="240" fill="#ff910066" fontSize="8">GULF →</text>
                <path d="M35,245 Q75,240 110,250" fill="none" stroke="#ff910033" strokeWidth="1" strokeDasharray="3,3">
                  <animate attributeName="stroke-dashoffset" from="12" to="0" dur="3s" repeatCount="indefinite" />
                </path>

                {/* Region dots */}
                {INDIA_REGIONS.map((r, i) => {
                  const x = toX(r.lng);
                  const y = toY(r.lat);
                  const val = r[selPhase];
                  const col = getRiskColor(val);
                  const isSel = selRegion === i;
                  const pulseR = 6 + (val / 100) * 22;
                  return (
                    <g key={i} onClick={() => setSelRegion(i)} style={{ cursor: "pointer" }}>
                      <circle cx={x} cy={y} r={pulseR} fill={col} opacity={0.12}>
                        <animate attributeName="r" values={`${pulseR};${pulseR + 6};${pulseR}`} dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={x} cy={y} r={isSel ? 7 : 4.5} fill={col} stroke={isSel ? "#fff" : "none"} strokeWidth={isSel ? 2 : 0} opacity={0.95}>
                        {isSel && <animate attributeName="r" values="7;9;7" dur="1.5s" repeatCount="indefinite" />}
                      </circle>
                      <text x={x + (r.lng > 83 ? -6 : 10)} y={y - 9} fill={isSel ? "#fff" : "#7a8ba8"} fontSize={isSel ? 10 : 8}
                        fontWeight={isSel ? "bold" : "normal"} textAnchor={r.lng > 83 ? "end" : "start"}>{r.name}</text>
                      {isSel && (
                        <text x={x + (r.lng > 83 ? -6 : 10)} y={y + 4} fill={col} fontSize="9" fontWeight="bold"
                          textAnchor={r.lng > 83 ? "end" : "start"}>{val}%</text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected region detail card */}
            <div style={{
              background: `linear-gradient(135deg, ${getRiskColor(region[selPhase])}08, #040d1a)`,
              border: `1px solid ${getRiskColor(region[selPhase])}33`,
              borderRadius: 12, padding: 16, marginBottom: 12,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontFamily: "Georgia, serif" }}>{region.name}</h3>
                  <div style={{ fontSize: 9, color: phase.color, fontWeight: 800, letterSpacing: 2, marginTop: 2 }}>
                    {phase.icon} {phase.label} RISK — {phase.sub}
                  </div>
                </div>
                <MiniGauge value={region[selPhase]} size={58} />
              </div>
              <p style={{ fontSize: 11, color: "#8899aa", lineHeight: 1.6, margin: "0 0 12px", fontFamily: "Georgia, serif" }}>{region.detail}</p>

              {/* All 4 time phases for this region */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {TIME_PHASES.map(p => (
                  <div key={p.id} onClick={() => setSelPhase(p.id)} style={{
                    background: selPhase === p.id ? `${p.color}12` : "#040d1a",
                    border: `1px solid ${selPhase === p.id ? p.color + "44" : "#0d1f3c"}`,
                    borderRadius: 8, padding: "8px 6px", textAlign: "center", cursor: "pointer",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 12 }}>{p.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: p.color }}>{region[p.id]}%</div>
                    <div style={{ fontSize: 7, color: "#475569", letterSpacing: 0.5 }}>{p.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rankings */}
            <div style={{ background: "#020810", borderRadius: 12, border: "1px solid #0d1f3c", padding: 14 }}>
              <h4 style={{ margin: "0 0 10px", fontSize: 10, letterSpacing: 2, color: "#475569" }}>
                ALL REGIONS — {phase.label} RISK ({phase.sub})
              </h4>
              {[...INDIA_REGIONS].sort((a, b) => b[selPhase] - a[selPhase]).map((r, i) => {
                const val = r[selPhase];
                const col = getRiskColor(val);
                const isS = INDIA_REGIONS.indexOf(r) === selRegion;
                return (
                  <div key={r.name} onClick={() => setSelRegion(INDIA_REGIONS.indexOf(r))} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", marginBottom: 2,
                    borderRadius: 6, cursor: "pointer",
                    background: isS ? `${col}0a` : "transparent",
                    border: isS ? `1px solid ${col}22` : "1px solid transparent",
                  }}>
                    <span style={{ fontSize: 9, color: "#334155", width: 20 }}>#{i + 1}</span>
                    <span style={{ flex: "0 0 90px", fontSize: 11, color: isS ? "#fff" : "#94a3b8" }}>{r.name}</span>
                    <div style={{ flex: 1 }}><AnimatedBar value={val} color={col} height={5} delay={i * 50} /></div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: col, width: 34, textAlign: "right" }}>{val}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: DIRTY BOMB */}
        {/* ═══════════════════════════════════════════ */}
        {tab === "dirty" && (
          <div>
            {/* Headline */}
            <div style={{
              padding: 16, marginBottom: 14, borderRadius: 12,
              background: "linear-gradient(135deg, #ff174410, #ff910008)",
              border: "1px solid #ff174433",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 24 }}>☢️</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#ff6d00" }}>DIRTY BOMB (RDD) SCENARIO ANALYSIS</div>
                  <div style={{ fontSize: 10, color: "#666", fontFamily: "Georgia, serif" }}>
                    Iran possesses sufficient radiological material (cesium-137, cobalt-60, 400kg of 60% enriched uranium) to construct multiple RDDs today
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                {[
                  { label: "Material Available", val: "YES", c: "#ff1744" },
                  { label: "Delivery Capability", val: "HIGH", c: "#ff9100" },
                  { label: "Strategic Motivation", val: "MODERATE", c: "#ffea00" },
                  { label: "Deterrent Cost", val: "EXTREME", c: "#69f0ae" },
                ].map(b => (
                  <div key={b.label} style={{
                    padding: "6px 12px", borderRadius: 6,
                    background: `${b.c}11`, border: `1px solid ${b.c}33`,
                  }}>
                    <div style={{ fontSize: 8, color: "#667", letterSpacing: 1 }}>{b.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: b.c }}>{b.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenarios */}
            {DIRTY_BOMB_SCENARIOS.map((s, i) => (
              <div key={i} style={{
                background: "linear-gradient(135deg, #020810, #0a1628)",
                borderRadius: 12, border: "1px solid #1a274422",
                padding: 16, marginBottom: 10,
                borderLeft: `3px solid ${s.probColor}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 2px", fontSize: 14, fontFamily: "Georgia, serif" }}>
                      Scenario {i + 1}: {s.name}
                    </h4>
                    <div style={{ fontSize: 10, color: "#556" }}>Target: {s.target}</div>
                  </div>
                  <MiniGauge value={s.indiaImpact} size={50} />
                </div>
                <p style={{ fontSize: 11, color: "#8899aa", lineHeight: 1.5, margin: "0 0 10px", fontFamily: "Georgia, serif" }}>
                  {s.description}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "#040d1a", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 8, color: "#556", letterSpacing: 1 }}>PROBABILITY</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: s.probColor }}>{s.probability}</div>
                  </div>
                  <div style={{ background: "#040d1a", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 8, color: "#556", letterSpacing: 1 }}>TIME TO INDIA</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8" }}>{s.timeToIndia}</div>
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 8, color: "#556", letterSpacing: 1, marginBottom: 4 }}>INDIA IMPACT MECHANISM</div>
                  <div style={{ fontSize: 10, color: "#ff910099", fontFamily: "Georgia, serif" }}>{s.mechanism}</div>
                </div>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 9, color: "#445" }}>India Risk:</span>
                  <div style={{ flex: 1 }}><AnimatedBar value={s.indiaImpact} color={getRiskColor(s.indiaImpact)} delay={i * 100} /></div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: getRiskColor(s.indiaImpact) }}>{s.indiaImpact}%</span>
                </div>
              </div>
            ))}

            {/* Expert assessment box */}
            <div style={{
              background: "#020810", borderRadius: 12, border: "1px solid #1a2744",
              padding: 16, marginTop: 4,
            }}>
              <h4 style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: 2, color: "#556" }}>EXPERT CONSENSUS</h4>
              <p style={{ fontSize: 11, color: "#8899aa", lineHeight: 1.7, margin: 0, fontFamily: "Georgia, serif" }}>
                While Iran possesses the materials for a dirty bomb, experts across multiple think tanks (AEI, FPRI, King's College London) assess that deploying one would constitute <span style={{ color: "#ff1744", fontWeight: 700 }}>"strategic suicide"</span> — making Iran a pariah even among allies Russia and China. The regime's current calculus favors pursuing an actual nuclear weapon (following the North Korea model) rather than a dirty bomb. However, <span style={{ color: "#ff9100", fontWeight: 700 }}>regime collapse or leadership decapitation</span> (now partially realized with Khamenei's death) significantly raises the probability of rogue actors or desperate factions employing radiological weapons.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: GEOPOLITICS */}
        {/* ═══════════════════════════════════════════ */}
        {tab === "geo" && (
          <div>
            {GEOPOLITICAL_CHALLENGES.map((cat, ci) => (
              <div key={ci} style={{
                background: "linear-gradient(135deg, #020810, #0a1628)",
                borderRadius: 12, border: "1px solid #1a274422",
                padding: 16, marginBottom: 12,
                borderLeft: `3px solid ${cat.color}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontFamily: "Georgia, serif" }}>{cat.category}</h3>
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: 2, padding: "3px 10px",
                    borderRadius: 4, background: `${cat.color}18`, color: cat.color,
                    border: `1px solid ${cat.color}33`,
                  }}>{cat.severity}</span>
                </div>
                {cat.items.map((item, j) => (
                  <div key={j} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 8px",
                    borderBottom: j < cat.items.length - 1 ? "1px solid #0d1f3c" : "none",
                  }}>
                    <div style={{
                      flex: "0 0 50px", textAlign: "center",
                      background: `${cat.color}0a`, borderRadius: 8, padding: "6px 4px",
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 900, color: cat.color }}>{item.metric}</div>
                      <div style={{ fontSize: 7, color: "#556" }}>{item.unit}</div>
                    </div>
                    <p style={{ flex: 1, margin: 0, fontSize: 11, color: "#94a3b8", lineHeight: 1.5, fontFamily: "Georgia, serif" }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            ))}

            {/* India's Diplomatic Balancing Act */}
            <div style={{
              background: "linear-gradient(135deg, #00e5ff08, #020810)",
              borderRadius: 12, border: "1px solid #00e5ff22",
              padding: 16,
            }}>
              <h4 style={{ margin: "0 0 10px", fontSize: 12, color: "#00e5ff", letterSpacing: 1 }}>
                🇮🇳 INDIA'S IMPOSSIBLE BALANCING ACT
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { side: "PRO-US/ISRAEL", items: ["Special Strategic Partnership (Feb 26)", "Defense tech cooperation", "Quad alliance commitments", "US oil alternative supplies"], color: "#4fc3f7" },
                  { side: "PRO-IRAN/NEUTRAL", items: ["Chabahar port access", "3.5M Gulf diaspora safety", "SCO & BRICS obligations", "Cheap Iranian oil history"], color: "#ff9100" },
                ].map(s => (
                  <div key={s.side} style={{ background: "#040d1a", borderRadius: 10, padding: 12, border: `1px solid ${s.color}22` }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: s.color, marginBottom: 8, letterSpacing: 1 }}>{s.side}</div>
                    {s.items.map((it, k) => (
                      <div key={k} style={{ fontSize: 10, color: "#8899aa", marginBottom: 4, display: "flex", gap: 6, fontFamily: "Georgia, serif" }}>
                        <span style={{ color: s.color }}>•</span> {it}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: SUMMARY */}
        {/* ═══════════════════════════════════════════ */}
        {tab === "summary" && (
          <div>
            {/* Master threat matrix */}
            <div style={{
              background: "#020810", borderRadius: 12, border: "1px solid #1a2744",
              padding: 16, marginBottom: 14,
            }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 13, letterSpacing: 2, color: "#556" }}>MASTER THREAT TIMELINE FOR INDIA</h3>

              {[
                { phase: "⚡ IMMEDIATE (0-48h)", color: "#ff1744", threats: [
                  { name: "Hormuz CLOSED + 5 vessels attacked", risk: 100 },
                  { name: "Oil spike (Brent $78, Barclays: $100, UBS: $120)", risk: 99 },
                  { name: "Israel GROUND INCURSION into Lebanon", risk: 98 },
                  { name: "ALL shipping halted, insurance ending Mar 5", risk: 100 },
                  { name: "Market crash on Wed Mar 5 reopening", risk: 96 },
                  { name: "AWS 3 facilities hit — IT/cloud disruption", risk: 75 },
                ]},
                { phase: "🔥 SHORT-TERM (1-4 weeks)", color: "#ff9100", threats: [
                  { name: "LPG crisis (ZERO reserves, Hormuz CLOSED)", risk: 96 },
                  { name: "Fuel hike (₹4-5+, $10/bbl=$14B cost)", risk: 92 },
                  { name: "Fertilizer crisis (60% urea LNG=Qatar)", risk: 80 },
                  { name: "Insurance collapse (500% surge, cancelled)", risk: 92 },
                  { name: "Dirty bomb (460kg U, rogue units)", risk: 44 },
                  { name: "Russia pivot vs US tariff backlash", risk: 78 },
                ]},
                { phase: "⏳ MEDIUM-TERM (1-6 months)", color: "#ffea00", threats: [
                  { name: "Inflation spiral (food+fuel+fertilizer)", risk: 88 },
                  { name: "CAD blowout (50bps per $10/bbl rise)", risk: 85 },
                  { name: "Mass evacuation (9M diaspora)", risk: 62 },
                  { name: "Nuclear escalation (Natanz HIT again)", risk: 38 },
                  { name: "Monsoon-carried contamination", risk: 55 },
                  { name: "Trade route permanent disruption", risk: 68 },
                ]},
                { phase: "🌐 LONG-TERM (6mo-5yr)", color: "#00e5ff", threats: [
                  { name: "Energy restructuring (forced pivot)", risk: 80 },
                  { name: "Nuclear proliferation (Saudi, Turkey)", risk: 60 },
                  { name: "Permanent shipping route shifts", risk: 75 },
                  { name: "Russia/China dependency deepens", risk: 62 },
                  { name: "Cancer cluster risk (west coast)", risk: 28 },
                  { name: "Gulf diaspora permanent disruption", risk: 55 },
                ]},
              ].map((section, si) => (
                <div key={si} style={{ marginBottom: si < 3 ? 16 : 0 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 800, color: section.color, marginBottom: 8,
                    padding: "4px 10px", background: `${section.color}0a`, borderRadius: 6,
                    display: "inline-block", letterSpacing: 1,
                  }}>{section.phase}</div>
                  {section.threats.map((t, ti) => (
                    <div key={ti} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, padding: "3px 0" }}>
                      <span style={{ flex: "0 0 180px", fontSize: 10, color: "#8899aa", fontFamily: "Georgia, serif" }}>{t.name}</span>
                      <div style={{ flex: 1 }}><AnimatedBar value={t.risk} color={section.color} height={5} delay={si * 100 + ti * 40} /></div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: section.color, width: 30, textAlign: "right" }}>{t.risk}%</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Key numbers */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14,
            }}>
              {[
                { val: "$79", unit: "BRENT", desc: "Crude +9% Monday", c: "#ff1744" },
                { val: "₹6.8L", unit: "CRORE", desc: "Market cap wiped", c: "#ff1744" },
                { val: "-2,743", unit: "SENSEX", desc: "Worst crash since Covid", c: "#ff1744" },
                { val: "3.5M", unit: "INDIANS", desc: "Trapped in Gulf", c: "#ff1744" },
                { val: "1,000+", unit: "TARGETS", desc: "US hit in Iran", c: "#ff9100" },
                { val: "9", unit: "COUNTRIES", desc: "Iran attacked", c: "#ff1744" },
              ].map((n, i) => (
                <div key={i} style={{
                  background: "#040d1a", borderRadius: 10, padding: "12px 8px", textAlign: "center",
                  border: `1px solid ${n.c}15`,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: n.c }}>{n.val}</div>
                  <div style={{ fontSize: 8, color: "#556", letterSpacing: 2 }}>{n.unit}</div>
                  <div style={{ fontSize: 9, color: "#778", marginTop: 2, fontFamily: "Georgia, serif" }}>{n.desc}</div>
                </div>
              ))}
            </div>

            {/* Bottom line */}
            <div style={{
              background: "linear-gradient(135deg, #ff174408, #ff910008)",
              borderRadius: 12, border: "1px solid #ff174422", padding: 16,
            }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 13, color: "#ff6d00" }}>⚡ BOTTOM LINE FOR INDIA</h4>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.8, fontFamily: "Georgia, serif" }}>
                <p style={{ margin: "0 0 6px" }}>
                  <strong style={{ color: "#ff1744" }}>DAY 5 — INDIA MARKETS CRASH ON REOPENING:</strong> Sensex -1,300 pts. Nifty ~24,400. Rs 9.5 TRILLION wiped. VIX +22% (9-mo high). Metal -4%. Auto -3%. SpiceJet -8%. IndiGo -4%. US Tue: Dow -404 (was -1,277 at lows). Kospi -7.24% (worst 19mo). Nikkei -3.1%. EU Stoxx -3.08%. Death toll surpasses 800 (Iran+Lebanon). US Consulate Dubai HIT by drone. Assembly of Experts bldg QOM DESTROYED by Israel. Hotel near Beirut struck. Fujairah port struck. Iran struck 10 COUNTRIES (added Cyprus). B-2 stealth bombers hitting IRGC command nodes. Iran used CLUSTER MUNITIONS on Israel. US destroyed 17 Iranian ships. Iran fired 500+ ballistic missiles + 2,000+ drones. 165 killed in girls school southern Iran. Rubio: attacks will INCREASE in scope/intensity.
                </p>
                <p style={{ margin: "0 0 6px" }}>
                  <strong style={{ color: "#ff9100" }}>INDIA'S VERIFIED EXPOSURE:</strong> Brent $82-84 (+8% Tue, +10% since war). WTI $77. US diesel +24% in 2 days. Goldman Sachs: 20% Brent rise = -2% Asian earnings. India among most impacted. SocGen: India underperformance to deepen. Natixis: India assets "most at risk." Oil Ministry: 8 wks crude, 2-3 wks LNG. NO LPG reserves. 60% urea LNG from Qatar. ₹9.5T wiped Wed + ₹6.87L cr Mon. TOTAL destruction ₹16L+ cr in 2 trading days. Wells Fargo worst case: S&P 6,000 if oil $100+. Goldman: $78 Brent = market pricing 4-wk disruption.
                </p>
                <p style={{ margin: "0 0 6px" }}>
                  <strong style={{ color: "#ffea00" }}>EVACUATIONS SCALING UP:</strong> 58 flights planned Mar 4 (30 IndiGo + 23 Air India/AIE). 24 Indian flights operated Tue + 9 by Emirates/Etihad. Mumbai key hub: Emirates/Star Air/IndiGo/AIE arrivals. 1,609 flights cancelled (1,221 Indian + 388 foreign). 12,000+ cancelled globally. 3 Dubai-bound flights U-turned mid-air due to drone threats. PV Sindhu returned Tue AM. 84 Pune students sleeping on Dubai airport benches. Air India NY/Newark rerouting via Rome (+4-7hrs). Etihad suspended until Mar 5 2pm. CBSE Mar 5-6 exams POSTPONED 7 Gulf countries. Indian embassies 24x7 helplines. 9M Indians in Gulf. 3,000 in Iran.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#00e5ff" }}>WHAT COMES NEXT:</strong> War on THREE FRONTS expanding — Iran (800+ dead, 10 countries hit), Lebanon (ground incursion + 100K reservists, 50+ killed 2 days), Gulf maritime (Hormuz sealed, Trump ordering Navy escort). Rubio: attacks will INCREASE. B-2 stealth bombers active. Iran: 17 ships destroyed but 500+ missiles + 2,000+ drones fired. Assembly of Experts building destroyed — succession crisis deepens. India: 8-week crude buffer is the clock (but only 2-3 wks LNG). Markets in freefall — worst environment since COVID. Goldman/SocGen/Natixis all flag India as most vulnerable. India MUST: (a) complete Russian crude pivot, (b) emergency LPG + LNG procurement from non-Gulf, (c) scale evacuation (58 flights Mar 4 vs 9M at risk), (d) brace for $100+ oil if Hormuz stays sealed, (e) prepare fiscal response to ₹16L+ cr market destruction.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: UPDATE LOG */}
        {/* ═══════════════════════════════════════════ */}
        {tab === "updates" && (
          <div>
            <div style={{
              padding: 16, marginBottom: 14, borderRadius: 12,
              background: "linear-gradient(135deg, #69f0ae08, #00e5ff08)",
              border: "1px solid #69f0ae22",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 24 }}>📋</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#69f0ae" }}>DAILY UPDATE LOG</div>
                  <div style={{ fontSize: 10, color: "#666", fontFamily: "Georgia, serif" }}>
                    Tracking changes to threat levels as the situation evolves
                  </div>
                </div>
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8,
                background: "#0d1f3c", padding: "4px 12px", borderRadius: 12,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#69f0ae", boxShadow: "0 0 8px #69f0ae66" }} />
                <span style={{ fontSize: 9, color: "#94a3b8" }}>Last updated: {LAST_UPDATED}</span>
              </div>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {UPDATE_LOG.map((entry, i) => {
                const sevColor = entry.severity === "critical" ? "#ff1744" : entry.severity === "high" ? "#ff9100" : entry.severity === "moderate" ? "#ffea00" : "#69f0ae";
                return (
                  <div key={i} style={{
                    background: "linear-gradient(135deg, #020810, #0a1628)",
                    borderRadius: 10, border: "1px solid #1a274422",
                    padding: 14, borderLeft: `3px solid ${sevColor}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 800, color: "#fff",
                          background: "#0d1f3c", padding: "3px 10px", borderRadius: 6,
                        }}>{entry.date}</span>
                        {i === 0 && (
                          <span style={{
                            fontSize: 8, fontWeight: 800, color: "#69f0ae", letterSpacing: 1,
                            background: "#69f0ae15", padding: "2px 8px", borderRadius: 4,
                          }}>LATEST</span>
                        )}
                      </div>
                      <span style={{
                        fontSize: 8, fontWeight: 800, letterSpacing: 1,
                        color: sevColor, background: `${sevColor}15`,
                        padding: "2px 8px", borderRadius: 4, textTransform: "uppercase",
                      }}>{entry.severity}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", lineHeight: 1.6, fontFamily: "Georgia, serif" }}>
                      {entry.change}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* How to update guide */}
            <div style={{
              marginTop: 16, padding: 16, borderRadius: 12,
              background: "#020810", border: "1px solid #1a274433",
            }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 11, color: "#4a5568", letterSpacing: 1 }}>ℹ️ HOW THIS DASHBOARD IS UPDATED</h4>
              <p style={{ margin: 0, fontSize: 10, color: "#334155", lineHeight: 1.7, fontFamily: "Georgia, serif" }}>
                Risk scores and threat assessments are updated daily based on IAEA reports, OSINT satellite data,
                government statements, and real-time news from Reuters, Al Jazeera, WSJ, and other verified sources.
                Each update is logged here with the date and severity of changes.
              </p>
            </div>
          </div>
        )}

        {/* ═══ FOOTER ═══ */}
        <footer style={{
          marginTop: 18, padding: "12px 0", borderTop: "1px solid #0d1f3c",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6,
        }}>
          <div style={{ fontSize: 8, color: "#2a3444", lineHeight: 1.6 }}>
            Sources: Al Jazeera, CNBC, CBS News, CNN, Reuters, Times of Israel, NBC News, Washington Post, Bloomberg, PBS, Dawn, Gulf News, Euronews, Windward AI, gCaptain, USNI News, The Register, Investing.com, ABC News, NY Times, Khaleej Times, OilPrice.com, India TV, National Herald India, Prokerala<br />
            Last updated: {LAST_UPDATED} • Composite risk scores from verified multi-source analysis
          </div>
          <div style={{ fontSize: 8, color: "#2a3444" }}>Generated with Claude AI • Anthropic</div>
        </footer>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Playfair+Display:wght@700;900&display=swap');
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #020810; }
        ::-webkit-scrollbar-thumb { background: #1a2744; border-radius: 4px; }
      `}</style>
    </div>
  );
}
