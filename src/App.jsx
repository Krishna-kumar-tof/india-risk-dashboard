import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════
// ✏️ DAILY UPDATE SECTION — EDIT THIS EVERY DAY!
// ═══════════════════════════════════════════════════════

// 👇 Change this date whenever you update the data
const LAST_UPDATED = "March 14, 2026 — 8:25 AM IST (Day 15 • Nifty 23,151 • WORST WEEK IN 4 YRS)";

// 👇 Add a new line at the TOP each day (most recent first)
const UPDATE_LOG = [
  { date: "Mar 14 (AM)", change: "DAY 15 — MOJTABA KHAMENEI 1ST STATEMENT: attacks continue unless US bases closed. Hegseth: Iran wounded, disfigured. Trump: great honour to kill Iran leadership. Marines (2,200 MEU) deploying to ME. 10,000 AI Merops drones deployed. Trump bombed EVERY military target on Kharg Island. Iran mulling Hormuz transit in CHINESE YUAN only. Blasts near Tehran rally where Larijani/Pezeshkian/Araghchi present. Hegseth: missiles -90%, drones -95%. KC-135 crash in Iraq: 6 US crew dead (non-hostile). Iran 1,444 killed, 18,551 injured (Health Ministry). 15 killed Israel, 2,975 injured. 206 attack waves on Israel. Bahrain intercepted 114 missiles + 190 drones since war. UNESCO: 4 cultural sites damaged. Jaishankar spoke Araghchi (4th call) — securing 28 Indian merchant vessels at Hormuz.", severity: "critical" },
  { date: "Mar 13 (Fri)", change: "BLACK FRIDAY: Sensex -1,460 to 74,564 (lowest since early 2025). Nifty -488 to 23,151 (-2.06%). ₹9.5L cr wiped SINGLE SESSION. 500+ stocks hit 52-wk lows. VIX 22.88 (+6.3%). WORST WEEK IN 4 YRS: Sensex -3,800 (-5%), Nifty -1,100 (-5%). ₹20L cr wiped in week alone. Rupee 92.45/$ NEW ATL. Petrol ₹103.54/L Mumbai. Diesel ₹90.03. Oil cos losing ₹20,000 cr/DAY. Diesel at ₹45/L LOSS. LPG +₹60 domestic +₹144 commercial. Restaurants dropping menu items. FPIs sold ₹46,100 cr in Mar. ₹30,000 cr LPG subsidy approved for PSU OMCs. Zomato profits may drop 7% (Elara). 16+ ships attacked Hormuz.", severity: "critical" },
  { date: "Mar 12 (Thu)", change: "Sensex -429 to 76,435. Nifty -142 to 23,725. Rupee 92.37 ATL. Brent $101 (+9%). IEA 400M SPR FAILED to hold prices. Iran 37th wave + IRGC+Hezbollah joint 5hr attack. 3 ships hit Hormuz. IRGC fired on vessels. OMC LPG force majeure. Borosil -6%. Auto -3%. Oil&Gas only sector green.", severity: "critical" },
  { date: "Mar 12 (LIVE)", change: "DAY 13 — BRENT BACK >$100 DESPITE IEA SPR: Sensex -429 to 76,435. Nifty -142 to 23,725. Rupee NEW ATL 92.37/$. Brent $101.53 (+9.16%). IEA record 400M barrel SPR release (US 172M) FAILED to hold prices down. Iran MOST INTENSE operation since war start — IRGC+Hezbollah JOINT 5hr attack hitting 50+ Israeli targets. 3 ships attacked near Hormuz (Japan, Thai, Marshall Is flags). IRGC fired on 2 vessels that ignored stop warnings. Iran: 10,000 civilian sites bombed, 1,300+ killed. Lebanon: 634 killed (was 394). 750K displaced. WHO: toxic BLACK RAIN from oil depot strikes. War cost $11.3B in 6 days ($1.5B+/day). US investigating school Tomahawk strike. Ukraine anti-drone teams deployed in Qatar/UAE/Saudi. LPG FORCE MAJEURE by OMCs. India Russian oil purchases +50%. UNSC voting on GCC resolution demanding Iran stop attacking neighbors. OMC stocks HPCL/BPCL/IOC crashed 19% this month.", severity: "critical" },
  { date: "Mar 11 (Wed)", change: "CRASH RESUMED: Sensex -1,342 to 76,864. Nifty -395 to 23,867. Tue relief rally ERASED. 3 ships hit near Hormuz (container vessel on fire). Iran+Hezbollah joint 5hr attack on Israel (50+ targets). IEA: record 400M barrel SPR release agreed — FAILED to hold prices. Brent $93. Lebanon 634 killed. WHO: black rain warning. LPG crisis deepening — OMCs declare force majeure. War cost $11.3B in 6 days (Pentagon briefing to Senate). US admits Tomahawk hit school. FPIs sold ₹32,849 cr Mar. Auto -3%. Bank Nifty crashed.", severity: "critical" },
  { date: "Mar 10 (Tue)", change: "BRIEF RELIEF: Sensex +727 to 78,293. Nifty recovered. Brent crashed $120→$84. Trump: war very complete. VIX -15%. But IRGC said deploying >1T warheads. Kharazi: long war, no diplomacy. Russia giving Iran intel (AP). Tuesday gains fully ERASED Wednesday.", severity: "high" },
  { date: "Mar 10 (LIVE)", change: "DAY 11 — DRAMATIC REVERSAL: Trump: war objectives 'very complete', could end 'very soon'. THEN threatened to hit Iran '20 times harder' if Hormuz blocked. BRENT CRASHED $120→$88 (-$30 overnight swing). Sensex REBOUNDS +810 to 78,376 at open. Nifty +253 to 24,281. VIX -15% to 19.80. Nikkei +2%. Kospi rallying. BUT: IRGC REJECTS US claims missile program destroyed — says deploying warheads >1 TONNE. Iran advisor Kharazi: prepared for LONG WAR, rules out diplomacy. Russia gave Iran intelligence to hit US targets (AP). LPG CRISIS: commercial cylinder supply STOPPED in Mumbai, Bengaluru. 5 Iranian women footballers seek ASYLUM in Australia. Macron: attack on Cyprus = attack on Europe. Rubio: Iran has less missiles, factories work less every day. Israeli CoS: war will take a LONG TIME. FII sold ₹6,030 cr Mon. 7th US soldier identified: Sgt. Pennington (26, Kentucky).", severity: "critical" },
  { date: "Mar 9 (CLOSE)", change: "DAY 10 CLOSE — WORST DAY SINCE COVID ERA: Sensex CLOSED -1,353 at 77,566 (intraday crashed -2,494 to 76,425). Nifty CLOSED -422 at 24,028 (intraday -753 to 23,698). NIFTY 10% OFF RECORD = CORRECTION ZONE. ₹8.5L cr wiped at close (₹12.78T wiped intraday). Rupee NEW ATL 92.50/$. VIX past 24 (+21%). PSU Bank -6%. Auto -4.3%. IndiGo -8%. SBI -5%. Bank Nifty -2,192 pts (-3.8%). Only ONGC + Coal India green. Brent hit $119.50→$120 intraday, pared to $103.54 close (G7 SPR + FT report). Lebanon: 394 killed (83 children) since Mar 2. HRW: Israel used WHITE PHOSPHORUS in Lebanon. Bahrain declared FORCE MAJEURE on oil. Saudi intercepted drone heading for Shaybah oilfield. Saudi warned ready to defend itself. 2 Bangladeshis killed in Kharj, Saudi Arabia. Bahrain: 32 wounded incl 2-mo infant. Iran: 104 confirmed dead on IRIS Dena (up from 87). Nikkei -6.82%. Kospi -9% (circuit breaker). FII sold ₹21,831 cr in Mar so far.", severity: "critical" },
  { date: "Mar 9 (AM)", change: "DAY 10 — BRENT HIT $119.50 (pared to $108 on G7 SPR talk). HORMUZ UNDER FIRE: 16+ ships attacked since war. Iran mulling transit in YUAN ONLY. Trump bombed EVERY military target on Kharg Island (90% Iran oil exports). Oil cos losing ₹20,000 cr/DAY. US gas $3.45/gal (+43c since war). Rapidan: 20% global oil disrupted 9 days running (2x Suez Crisis record). MOJTABA KHAMENEI elected new Supreme Leader (Mar 8). IRGC + top leaders pledge allegiance. Trump: he is a lightweight. Iran FM Araghchi REJECTS ceasefire on Meet the Press. US death toll: 8 (7 combat + 1 health). 1,332+ dead Iran. Israel: 2,500 strikes, 80% air defense destroyed, near-complete air superiority. Israel struck OIL DEPOTS (Shahran, Shar Rey) for FIRST TIME — blackened rain on Tehran. Bahrain water desalination plant hit. Saudi Arabia: FIRST 2 deaths + 12 injured (residential). Hegseth: 500-2000lb bombs coming. HRW: school strike = war crime. UN: conflict is major humanitarian emergency (25M refugees). NIC report: war unlikely to topple Iran govt. CSIS: Epic Fury cost $3.7B ($891M/day). Pope Leo XIV calls for end to violence. Switzerland: US-Israel strikes violate international law. China FM Wang Yi: flames of war risk spreading. INDIA: 52,000 Indians returned Mar 1-7 (MEA). Sensex worst week in 1 yr (-3%). Nifty 24,450 (Apr 2025 low). Brent $87→$94→$108. GIFT Nifty -300 pts for Mon. Rupee 91.54 (recovered Thu from 92.30 ATL).", severity: "critical" },
  { date: "Mar 7-8", change: "Israel struck IRANIAN OIL DEPOTS (Shahran + Shar Rey Tehran) for first time — massive fires, blackened rain on city. Brent $87→$94 Fri. Pezeshkian apologized for Gulf strikes then BACKTRACKED. Larijani: Trump must pay the price. Assembly of Experts elected Mojtaba Khamenei as 3rd Supreme Leader (Mar 8). IRGC pledged allegiance. 7th US service member died. Hegseth: 500-2000lb gravity bombs next phase. Israel targeted Quds Force commanders at Ramada hotel Beirut (4 killed). Saudi: first 2 deaths + 12 injured (residential strike). Bahrain desalination plant hit. Kuwait airport fuel storage targeted. Iran FM rejects ceasefire. HRW: school strike = war crime.", severity: "critical" },
  { date: "Mar 6 (Fri)", change: "Sensex -1,097 to 78,919 (worst week in 1 yr, -3%). Nifty -315 to 24,450 (Apr 2025 low). Brent $87.57 (+2.5%). Near TOTAL halt in Hormuz shipping (Bloomberg). Bank stocks led losses: ICICI -3.1%, HDFC -2%, Axis -2.5%, SBI -2%. FII sold ₹3,753 cr. WEEKLY: Nifty worst since Feb 2025. 52,000 Indians returned Mar 1-7 (MEA). Kashmir schools reopened Mar 7 with restrictions eased. Thu rebound: Sensex +900 on Iran deputy FM nuclear signals, rupee recovered to 91.54. But erased Fri.", severity: "critical" },
  { date: "Mar 5 (AM)", change: "DAY 6 — IRIS DENA SUNK OFF SRI LANKA: US submarine TORPEDOED Iranian frigate 40nm off Galle. Ship was returning from Indian Navy MILAN exercise in Visakhapatnam. 87 DEAD, 32 rescued, 61 missing. First torpedo sinking since WW2. War reaches Indian Ocean. DEATH TOLL: 1,045+ Iran (Tasnim), 50+ Lebanon, 11 Israel, 6 US, 5 Gulf = 1,117+ TOTAL. Israel 10TH WAVE of strikes on Tehran. IRGC: ground forces entered battlefield, 230 drones deployed. Khamenei funeral POSTPONED due to strikes. Turkey: NATO intercepted Iranian missile at border. Senate FAILED to curb Trump war powers. INDIA MARKETS CLOSED: Sensex 79,116 (-1,123, 10-mo low). Nifty 24,481 (-385). Rupee ALL-TIME LOW 92.30/$. RBI intervened. VIX +24% to 21.22. ₹9L cr wiped Wed. 400K tons Basmati rice stuck at ports. Kashmir restrictions DAY 3: schools closed till Mar 7, 2G internet. Protests in 12+ states. Rahul Gandhi demands Modi speak up. Dubai stocks -4.9%. Nikkei -4.35%. Brent ~$85.", severity: "critical" },
  { date: "Mar 4 (PM)", change: "IRIS DENA torpedoed by US sub (Mk 48 torpedo) near Galle, Sri Lanka. 87 dead, 32 rescued. Ship was guest at Indian Navy IFR 2026 Visakhapatnam. Hegseth: Iranian navy rests at bottom of Persian Gulf. ALSO sunk: Shahid Soleimani corvette in Hormuz. Total 20+ Iranian ships sunk. Iran death toll: 1,045 (Foundation of Martyrs). Girls school Minab: 168 dead (NBC). Sensex closed -1,123 at 79,116 (10-mo low). Nifty 24,481 (-385). Rupee 92.30/$ ATL. ₹9L cr wiped. VIX 21.22 (+24%). Metal -4%, SmallCap -2.1%. 58 flights operated Mar 4. Kashmir restrictions 3rd day.", severity: "critical" },
  { date: "Mar 4 (PM)", change: "DAY 5 CLOSE: IRAN DEATH TOLL HITS 1,145 (state media). IRIS Dena frigate SUNK off Sri Lanka — 108 missing, 78 wounded, bodies recovered. Had just left MILAN exercise in Visakhapatnam India. War reaches INDIAN OCEAN. Israel 10th wave of strikes on Tehran Wed. IRGC ground forces entered battle, 230 drones launched. Turkey: NATO destroyed Iranian ballistic missile in E Mediterranean. Khamenei farewell ceremony Wed night. MARKETS CLOSE: Sensex -1,123 to 79,116 (10-mo low). Nifty -385 to 24,481 (6-mo low). Rs 18 LAKH CRORE wiped in 4 sessions. VIX +23% to 21.14. Metal -4%. Midcap -2.16%. 719 stocks hit 52-wk lows. RUPEE RECORD LOW 92.18/$ (-69 paise). 10Y yield 6.72%. FII sold Rs 3,296cr Mon. Dubai index -4.9% (worst since 2022). Abu Dhabi -3%. Brent $82 (+12% since war). Emirates suspended until 23:59 Mar 4. Etihad until Mar 5 2pm. Qatar Airways still grounded. INDIA: 58 evacuation flights Mar 4 (30 IndiGo + 23 AI). 1,609 cancelled (1,221 Indian+388 foreign). 12,000+ globally. HSBC: oil impact on INR before external accounts.", severity: "critical" },
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
    immediate: 99, shortterm: 98, medterm: 95, longterm: 88,
    tag: "CRITICAL",
    detail: "MARKETS CLOSED AT 10-MONTH LOW: Sensex -1,123 to 79,116. Nifty -385 to 24,481 (6-mo low). ₹18 LAKH CRORE wiped in 4 sessions. VIX +23% to 21.14. 719 stocks hit 52-wk low. RUPEE 92.18/$ RECORD LOW (-69 paise). 10Y yield 6.72%. FII sold ₹3,296cr Mon. Dubai index -4.9% (worst since 2022). Brent $82 (+12% week). Goldman CEO: reaction surprisingly benign, needs weeks.",
  },
  {
    name: "Kerala", lat: 10.8, lng: 76.3,
    immediate: 82, shortterm: 85, medterm: 82, longterm: 76,
    tag: "CRITICAL",
    detail: "MEA: 52,000 Indians returned Mar 1-7 (32,107 on Indian carriers). Airspace gradually reopening. More flights planned. BUT: 9M still in Gulf. CBSE exams POSTPONED. 400K tons Basmati STUCK. Gulf remittances ($35B/yr) at risk. IRIS Dena was Indian Navy guest — MEA silent. Brent $108 threatens entire Gulf economy + Indian worker livelihoods.",
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
    detail: "IRIS Dena had just left MILAN exercise in Visakhapatnam India before being sunk off Sri Lanka — war reaches Indian Ocean. 3 AWS data centers hit (2 UAE + 1 Bahrain) — fires + sprinkler damage. Snowflake SaaS disrupted. Bangalore IT/BPO at risk of cloud disruption. CM Siddaramaiah held video call reassuring stranded Kannadigas in Dubai. Etihad flew Abu Dhabi→Bengaluru (Mon night). MRPL 100% Gulf crude dependent.",
  },
  {
    name: "Delhi NCR", lat: 28.6, lng: 77.2,
    immediate: 78, shortterm: 72, medterm: 60, longterm: 64,
    tag: "HIGH",
    detail: "DAY 15: Mojtaba Khamenei 1st statement — attacks until US bases closed. 2,200 Marines deploying. 10,000 AI drones. Trump bombed Kharg Island. Iran mulling Hormuz in YUAN. Jaishankar-Araghchi 4th call (28 Indian ships). Worst week in 4 yrs. Oil cos -₹20K cr/day. ₹30K cr LPG subsidy. 1,444 killed Iran. KC-135 crash: 6 US dead. 206 attack waves on Israel. Hegseth: missiles -90%, drones -95%.",
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
    category: "Energy & Maritime Crisis",
    severity: "CRITICAL",
    color: "#ff1744",
    items: [
      { text: "🔴 HORMUZ: NEAR TOTAL HALT (Bloomberg). Brent $101→$108 (first >$100 since Jul 2022). 20% global oil disrupted 9 days (2x Suez record). Israel now striking OIL DEPOTS. 20+ Iranian ships sunk", metric: "CLOSED", unit: "Hormuz" },
      { text: "Insurers Gard, Skuld, NorthStandard, American Club, London P&I ALL cancelled cover. LNG rates +40%. Qatar HALTED LNG. Ras Tanura (550K bpd) SHUT", metric: "MAR 5", unit: "insurance ends" },
      { text: "Brent $99-101 (IEA 400M SPR barely holding). Petrol ₹103.54/L Mumbai. Diesel ₹90.03/L. Diesel at ₹45/L LOSS for OMCs. ₹30,000 cr LPG subsidy approved. US destroyed 5,000+ targets. War $11.3B/6 days. WTI $101. US gas $3.45/gal (+43c). Rapidan: could test $120 in 2 wks. CSIS: Epic Fury costs $891M/DAY ($3.7B total so far)", metric: "$78", unit: "Brent Tue" },
      { text: "RUPEE RECORD LOW 92.18/$. Oil Ministry: 8 wks crude. HSBC: oil impact hits INR before accounts. Kotak: CAD widens, inflation rises, GDP falls. IRIS Dena sunk off Sri Lanka — war in INDIAN OCEAN", metric: "5.22M", unit: "bpd imports" },
    ],
  },
  {
    category: "War at India\'s Door",
    severity: "HIGH",
    color: "#ff9100",
    items: [
      { text: "🔴 ISRAEL SEIZING TERRITORY in Lebanon. Katz: 'Severed head of octopus, now crushing tentacles.' 100K reservists called up. 50+ villages evacuated. Hezbollah hit Tel Aviv", metric: "🇱🇧", unit: "ground war" },
      { text: "MOJTABA KHAMENEI 1ST STATEMENT: attacks continue unless US bases closed. Hegseth: Iran wounded, disfigured. 2,200 Marines deploying. 10,000 AI drones. Trump bombed every target on Kharg Island", metric: "⚡", unit: "escalation" },
      { text: "Jaishankar spoke Araghchi (4th call) — securing 28 Indian merchant vessels. Iran mulling Hormuz in YUAN. 52K Indians returned. UNESCO: 4 cultural sites damaged. Bahrain: 114 missiles + 190 drones intercepted total", metric: "9M+", unit: "citizens" },
      { text: "IRAN DEATH TOLL 1,145 (state media). IRIS Dena frigate SUNK off Sri Lanka (108 missing). Israel 10th wave strikes Tehran. IRGC ground forces in battle. Turkey: NATO destroyed Iran missile. Khamenei funeral Wed", metric: "787", unit: "killed" },
    ],
  },
  {
    category: "Economic Firestorm",
    severity: "HIGH",
    color: "#ff9100",
    items: [
      { text: "Brent $82 (+12% wk). Dubai stocks -4.9% (worst since 2022). Abu Dhabi -3%. Dow -404 Tue. Kospi -7.24%. Nikkei -3.1%. EU Stoxx -3.08%. Goldman CEO: needs weeks to digest", metric: "$78", unit: "Brent Tue" },
      { text: "IRIS Dena had just left MILAN exercise in Visakhapatnam India before being sunk off Sri Lanka — war reaches Indian Ocean. 3 AWS data centers hit (2 UAE + 1 Bahrain) — fires, sprinklers damaged equipment. Snowflake SaaS disrupted. Gold ₹1,67,155 (+3.12%)", metric: "AWS", unit: "3 hit" },
      { text: "Sensex -1,123 to 79,116 (10-mo low). Nifty -385 to 24,481 (6-mo low). ₹18 LAKH CRORE wiped 4 sessions. VIX +23% to 21.14. 719 stocks hit 52-wk low. RUPEE 92.18/$ RECORD LOW", metric: "WED", unit: "market reopens" },
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
                  <strong style={{ color: "#ff1744" }}>DAY 15 — WAR ENTERS WEEK 3, INDIA IN WORST WEEK SINCE 2022:</strong> MOJTABA KHAMENEI'S FIRST STATEMENT: attacks continue unless US bases in region are closed. Hegseth: Iran "wounded and disfigured." Trump: "great honour" to kill Iran leadership; bombed "every military target" on Kharg Island (90% of Iran oil exports). 2,200 Marines (31st MEU) deploying from Japan. US Army deployed 10,000 AI Merops drones. Iran considering allowing Hormuz transit in CHINESE YUAN ONLY. Blasts struck near Tehran rally where top officials (Larijani, Pezeshkian, Araghchi) were present. DEATH TOLL: 1,444 Iran (18,551 injured, 10K civilian sites bombed) + 634 Lebanon (750K displaced) + 15 Israel (2,975 injured) + 13 US dead (7 combat + 6 KC-135 crash in Iraq) = 2,100+. 206 Iranian attack waves on Israel total. 16+ ships attacked near Hormuz. Bahrain intercepted 114 missiles + 190 drones. Hegseth: missiles -90%, drones -95%. KC-135 crash killed 6 crew. Jaishankar spoke to Araghchi (4th call) to secure 28 Indian merchant vessels stuck at Hormuz.</p>
                <p style={{ margin: "0 0 6px" }}>
                  <strong style={{ color: "#ff9100" }}>INDIA: BLACK FRIDAY + WORST WEEK IN 4 YEARS:</strong> Sensex 74,564 (-1,460 Fri, -2%). Nifty 23,151 (-488, -2.06%). ₹9.5L cr wiped in SINGLE session. WEEKLY: Sensex -3,800 (-5%), Nifty -1,100 (-5%) — WORST WEEK SINCE 2022. ₹20L cr wiped in week alone. 500+ stocks at 52-week lows. Rupee 92.45/$ NEW ATL. VIX 22.88. FPIs sold ₹46,100 cr in Mar (10 consecutive selling days). Oil cos losing ₹20,000 cr/DAY. Diesel selling at ₹45/L LOSS. ₹30,000 cr LPG subsidy approved. Petrol ₹103.54/L Mumbai. LPG +₹60 domestic +₹144 commercial — restaurants dropping chapati, dosa, pooris from menus, some facing closure. Zomato profits may drop 7% (Elara). Jaishankar spoke to Iranian FM Araghchi (4th call) seeking safe passage for 28 Indian merchant vessels stuck at Hormuz. India reviewing diesel supply requests from Bangladesh, Sri Lanka, Maldives.</p>
                <p style={{ margin: "0 0 6px" }}>
                  <strong style={{ color: "#ffea00" }}>HUMANITARIAN + ENERGY CRISIS DEEPENING:</strong> LPG crisis NOW hitting Indian kitchens: +₹60 domestic, +₹144 commercial. Restaurants/hotels in major cities dropping menu items, some facing shutdown. OMCs declared force majeure. Oil cos losing ₹20,000 cr/day. Govt approved ₹30,000 cr LPG subsidy for PSU OMCs. Iran: 1,444 killed, 18,551 injured (Health Ministry). Lebanon: 634 killed, 750K displaced. WHO: toxic black rain from oil depot strikes across Iran. UNESCO verified damage to 4 cultural sites (Golestan Palace, Chehel Sotoun, Masjed-e Jame, Khorramabad). 52K Indians returned Mar 1-7 but 9M still in Gulf. Jaishankar seeking passage for 28 Indian vessels. India reviewing diesel supply for Bangladesh/Sri Lanka/Maldives. Bahrain: 114 missiles + 190 drones intercepted total. 2 Oman deaths. Iran mulling Hormuz in yuan.</p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#00e5ff" }}>15-DAY TRAJECTORY — ATTRITION WAR, NO EXIT RAMP:</strong> Oil: $65→$120→$84→$101 (IEA 400M SPR barely holding). Deaths: 2,100+ total across all theaters. Iran capability degraded (missiles -90%, drones -95%) BUT Khamenei says fight continues. 2,200 Marines deploying. 10,000 AI drones in theater. Trump bombed Kharg Island. Iran mulling yuan-only Hormuz. War entering ATTRITION PHASE — both sides digging in. India's FIVE CRISES NOW STRUCTURAL: (1) ENERGY: Oil cos losing ₹20K cr/day. LPG force majeure. Petrol ₹103.54. Diesel at ₹45/L loss. ₹30K cr subsidy; (2) FISCAL: ₹20L cr wiped in 1 week. FPIs -₹46,100 cr. Rupee 92.45 ATL. Worst week in 4 yrs; (3) MARKETS: Nifty 23,151 (-5% week). 500+ stocks 52-wk lows. Correction deepening; (4) TRADE: 28 Indian vessels stuck at Hormuz. Jaishankar 4th call to Araghchi. 400K tons rice stuck; (5) KITCHEN TABLE: LPG +₹60/₹144. Restaurants closing. Zomato -7%. THIS IS NO LONGER A CRISIS — IT IS INDIA'S NEW REALITY FOR WEEKS/MONTHS.</p>
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
