// pages/company.js
// ─── Drop into /pages — works at /company — zero SSR errors ───

import { useState } from 'react'
import Head from 'next/head'

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:#060810;color:#e8edf5;font-family:'DM Sans',sans-serif;font-weight:300;line-height:1.7}
  :root{--bg:#060810;--surface:#0d1120;--border:rgba(255,255,255,0.07);--glow:rgba(56,189,130,0.25);--accent:#38bd82;--dim:rgba(56,189,130,0.12);--muted:#7a8599;--faint:#4a5568;--gold:#f0c040;--red:#e05050}
  nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:64px;background:rgba(6,8,16,0.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
  .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;letter-spacing:.12em;color:#e8edf5;cursor:pointer;display:flex;align-items:center;gap:10px;border:none;background:none}
  .logo span{color:var(--accent)}
  .navlinks{display:flex;gap:4px}
  .navbtn{font-size:.8rem;color:var(--muted);background:transparent;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
  .navbtn:hover,.navbtn.on{color:var(--accent);background:var(--dim)}
  .cta{font-size:.8rem;font-weight:500;color:#060810;background:var(--accent);border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-family:'DM Sans',sans-serif}
  .hero{background:linear-gradient(135deg,var(--surface) 0%,#0a1018 100%);border-bottom:1px solid var(--border);padding:80px 40px 60px;position:relative;overflow:hidden}
  .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 80% 50%,rgba(56,189,130,.06) 0%,transparent 70%);pointer-events:none}
  .wrap{max-width:1080px;margin:0 auto;padding:0 40px}
  .sec{padding:72px 0}
  .sec+.sec{border-top:1px solid var(--border)}
  .eye{font-family:'DM Mono',monospace;font-size:.7rem;letter-spacing:.18em;color:var(--accent);text-transform:uppercase;margin-bottom:14px}
  h1{font-family:'Syne',sans-serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:20px}
  h2{font-family:'Syne',sans-serif;font-size:clamp(1.4rem,2.5vw,1.9rem);font-weight:700;letter-spacing:-.01em;margin-bottom:16px}
  h3{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:600;margin-bottom:10px}
  p{color:var(--muted);font-size:.95rem;margin-bottom:16px}
  p:last-child{margin-bottom:0}
  .ac{color:var(--accent)}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:28px;transition:border-color .25s,transform .25s}
  .card:hover{border-color:var(--glow);transform:translateY(-2px)}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
  .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
  .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:64px}
  .stat{background:var(--surface);padding:32px 24px;text-align:center}
  .statnum{font-family:'Syne',sans-serif;font-size:2.2rem;font-weight:800;color:var(--accent);line-height:1;margin-bottom:6px}
  .statlbl{font-size:.78rem;color:var(--muted);letter-spacing:.06em}
  .tl{position:relative;padding-left:28px}
  .tl::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:1px;background:var(--border)}
  .tli{position:relative;margin-bottom:36px}
  .tli::before{content:'';position:absolute;left:-32px;top:7px;width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px rgba(56,189,130,.5)}
  .tly{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--accent);letter-spacing:.12em;margin-bottom:4px}
  .tc{text-align:center}
  .av{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#1a8f60,#1e4d38);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;color:var(--accent);margin:0 auto 16px;border:2px solid var(--glow)}
  .trole{font-size:.78rem;color:var(--accent);font-family:'DM Mono',monospace;letter-spacing:.06em}
  .tbio{font-size:.82rem;color:var(--muted);margin-top:10px}
  .regs{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px}
  .reg{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:10px}
  .regid{font-family:'DM Mono',monospace;font-size:.72rem;color:var(--accent);background:var(--dim);border:1px solid var(--glow);border-radius:4px;padding:4px 8px;display:inline-block}
  .job{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:26px 28px;display:flex;align-items:center;justify-content:space-between;gap:20px;transition:border-color .2s,transform .2s}
  .job:hover{border-color:var(--glow);transform:translateX(4px)}
  .jdept{font-family:'DM Mono',monospace;font-size:.68rem;color:var(--accent);letter-spacing:.1em;margin-bottom:6px}
  .jtitle{font-family:'Syne',sans-serif;font-weight:700;font-size:1.05rem;margin-bottom:8px}
  .jmeta{display:flex;gap:12px;flex-wrap:wrap}
  .pill{font-size:.72rem;padding:3px 10px;border-radius:20px;border:1px solid var(--border);color:var(--muted);font-family:'DM Mono',monospace}
  .pillr{border-color:rgba(56,189,130,.3);color:var(--accent)}
  .apply{flex-shrink:0;font-size:.8rem;font-weight:500;color:var(--accent);background:var(--dim);border:1px solid var(--glow);border-radius:8px;padding:10px 20px;white-space:nowrap;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .2s}
  .job:hover .apply{background:rgba(56,189,130,.2)}
  .perks{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
  .perk{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px}
  .picon{font-size:1.6rem;margin-bottom:12px}
  .ptitle{font-family:'Syne',sans-serif;font-weight:700;font-size:.9rem;margin-bottom:8px}
  .pdesc{font-size:.8rem;color:var(--muted)}
  .kitbox{background:var(--surface);border:1px solid var(--glow);border-radius:16px;padding:40px;display:flex;align-items:center;justify-content:space-between;gap:32px}
  .outbtn{flex-shrink:0;font-size:.85rem;font-weight:500;color:var(--accent);border:1px solid var(--glow);background:var(--dim);border-radius:10px;padding:14px 28px;cursor:pointer;transition:background .2s;white-space:nowrap;font-family:'DM Sans',sans-serif}
  .outbtn:hover{background:rgba(56,189,130,.2)}
  .logos{display:flex;gap:40px;flex-wrap:wrap;align-items:center;padding:40px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:60px}
  .logo2{font-family:'Syne',sans-serif;font-weight:700;font-size:1.1rem;color:var(--faint);letter-spacing:-.02em;transition:color .2s}
  .logo2:hover{color:var(--muted)}
  .art{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:28px;transition:border-color .2s,transform .2s}
  .art:hover{border-color:var(--glow);transform:translateY(-2px)}
  .asrc{font-family:'DM Mono',monospace;font-size:.68rem;color:var(--accent);letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between}
  .adate{color:var(--faint);font-size:.68rem}
  .atitle{font-family:'Syne',sans-serif;font-weight:700;font-size:1.05rem;line-height:1.3;margin-bottom:12px}
  .adesc{font-size:.82rem;color:var(--muted)}
  .rlink{display:inline-flex;align-items:center;gap:6px;font-size:.78rem;color:var(--accent);margin-top:16px;text-decoration:none;font-family:'DM Mono',monospace;cursor:pointer}
  .rlink:hover{text-decoration:underline}
  .feat{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:40px;margin-bottom:48px;position:relative;overflow:hidden}
  .feat::after{content:'';position:absolute;right:-60px;top:-60px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,130,.06) 0%,transparent 70%);pointer-events:none}
  .fbadge{font-family:'DM Mono',monospace;font-size:.65rem;letter-spacing:.15em;color:var(--gold);border:1px solid rgba(240,192,64,.3);background:rgba(240,192,64,.08);border-radius:4px;padding:3px 10px;text-transform:uppercase;display:inline-block;margin-bottom:16px}
  .ftitle{font-family:'Syne',sans-serif;font-size:clamp(1.3rem,2.5vw,1.8rem);font-weight:800;line-height:1.2;margin-bottom:16px;max-width:600px}
  .pmeta{display:flex;align-items:center;gap:20px;margin-top:24px;flex-wrap:wrap}
  .achip{display:flex;align-items:center;gap:8px}
  .adot{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#1a8f60);font-family:'Syne',sans-serif;font-weight:800;font-size:.7rem;color:#060810;display:flex;align-items:center;justify-content:center}
  .cats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:36px}
  .catbtn{font-family:'DM Mono',monospace;font-size:.72rem;letter-spacing:.06em;padding:6px 14px;border-radius:20px;border:1px solid var(--border);color:var(--muted);background:transparent;cursor:pointer;transition:all .2s}
  .catbtn:hover,.catbtn.on{border-color:var(--glow);color:var(--accent);background:var(--dim)}
  .bcard{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;transition:border-color .2s,transform .2s}
  .bcard:hover{border-color:var(--glow);transform:translateY(-3px)}
  .bthumb{height:160px;background:linear-gradient(135deg,#0d1a25,#091520);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:2.5rem;position:relative;overflow:hidden}
  .bthumb::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at center,rgba(56,189,130,.1) 0%,transparent 70%)}
  .bbody{padding:22px}
  .bcat{font-family:'DM Mono',monospace;font-size:.65rem;letter-spacing:.12em;color:var(--accent);text-transform:uppercase;margin-bottom:8px}
  .btitle{font-family:'Syne',sans-serif;font-weight:700;font-size:.98rem;line-height:1.35;margin-bottom:10px}
  .bex{font-size:.8rem;color:var(--muted);line-height:1.6}
  .bfoot{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:16px;border-top:1px solid var(--border)}
  .docs{display:grid;grid-template-columns:220px 1fr;min-height:calc(100vh - 64px)}
  .dsidebar{background:var(--surface);border-right:1px solid var(--border);padding:40px 0;position:sticky;top:64px;height:calc(100vh - 64px);overflow-y:auto}
  .dsec{margin-bottom:28px;padding:0 20px}
  .dlbl{font-family:'DM Mono',monospace;font-size:.62rem;letter-spacing:.15em;color:var(--faint);text-transform:uppercase;margin-bottom:10px}
  .dlink{display:block;font-size:.82rem;color:var(--muted);text-decoration:none;padding:5px 8px;border-radius:6px;margin-bottom:2px;transition:all .15s;cursor:pointer}
  .dlink:hover,.dlink.on{color:var(--accent);background:var(--dim)}
  .dcontent{padding:40px 48px;max-width:800px}
  .ep{display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 18px;margin-bottom:16px;font-family:'DM Mono',monospace}
  .m{font-size:.72rem;font-weight:500;letter-spacing:.06em;padding:3px 10px;border-radius:4px;min-width:52px;text-align:center}
  .mget{background:rgba(56,189,130,.15);color:var(--accent)}
  .mpost{background:rgba(96,140,220,.15);color:#6b9de8}
  .epath{font-size:.85rem;color:#e8edf5}
  .edesc{margin-left:auto;font-size:.75rem;color:var(--muted);font-family:'DM Sans',sans-serif}
  pre{background:#050709;border:1px solid var(--border);border-radius:10px;padding:20px;overflow-x:auto;margin:16px 0;font-family:'DM Mono',monospace;font-size:.8rem;line-height:1.7;color:#89d39e;white-space:pre}
  .ptbl{width:100%;border-collapse:collapse;margin:16px 0}
  .ptbl th{font-family:'DM Mono',monospace;font-size:.7rem;letter-spacing:.08em;color:var(--faint);text-transform:uppercase;text-align:left;padding:8px 14px;border-bottom:1px solid var(--border)}
  .ptbl td{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.04);font-size:.82rem;color:var(--muted);vertical-align:top}
  .ptbl td:first-child{font-family:'DM Mono',monospace;color:var(--accent);font-size:.8rem}
  .ptyp{font-family:'DM Mono',monospace;font-size:.68rem;color:var(--gold);background:rgba(240,192,64,.08);border:1px solid rgba(240,192,64,.2);border-radius:4px;padding:2px 7px;white-space:nowrap}
  .preq{font-family:'DM Mono',monospace;font-size:.65rem;color:var(--red);background:rgba(224,80,80,.1);border:1px solid rgba(224,80,80,.2);border-radius:4px;padding:2px 7px}
  .popt{font-family:'DM Mono',monospace;font-size:.65rem;color:var(--faint);border:1px solid var(--border);border-radius:4px;padding:2px 7px}
  .ai{padding:16px 20px;border-radius:10px;margin:20px 0;font-size:.85rem;line-height:1.6;background:rgba(56,189,130,.08);border:1px solid rgba(56,189,130,.2);color:#e8edf5}
  .aw{padding:16px 20px;border-radius:10px;margin:20px 0;font-size:.85rem;line-height:1.6;background:rgba(240,192,64,.08);border:1px solid rgba(240,192,64,.25);color:#e8edf5}
  .atit{font-weight:500;margin-bottom:4px}
  .rtbl{width:100%;border-collapse:collapse;margin:20px 0}
  .rtbl th,.rtbl td{padding:12px 16px;text-align:left;border-bottom:1px solid var(--border);font-size:.85rem}
  .rtbl th{font-family:'DM Mono',monospace;font-size:.7rem;letter-spacing:.08em;color:var(--faint);text-transform:uppercase}
  .tier{color:var(--accent);font-family:'DM Mono',monospace;font-size:.82rem}
  footer{background:var(--surface);border-top:1px solid var(--border);padding:48px 40px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;gap:40px}
  .fbrand h3{font-family:'Syne',sans-serif;font-weight:800;letter-spacing:.1em;margin-bottom:12px}
  .fcol h4{font-family:'DM Mono',monospace;font-size:.68rem;letter-spacing:.15em;color:var(--faint);text-transform:uppercase;margin-bottom:16px}
  .fcol a{display:block;font-size:.82rem;color:var(--muted);text-decoration:none;margin-bottom:8px;cursor:pointer;transition:color .2s}
  .fcol a:hover{color:var(--accent)}
  .fbtm{background:var(--surface);border-top:1px solid var(--border);padding:20px 40px;display:flex;align-items:center;justify-content:space-between}
  .fbtm p{font-size:.75rem;color:var(--faint);margin:0}
  .tag{display:inline-block;font-family:'DM Mono',monospace;font-size:.68rem;letter-spacing:.1em;padding:3px 10px;border-radius:4px;border:1px solid var(--glow);color:var(--accent);background:var(--dim);text-transform:uppercase}
  @media(max-width:900px){nav{padding:0 20px}.navlinks{display:none}.wrap{padding:0 20px}.hero{padding:60px 20px 40px}footer{grid-template-columns:1fr 1fr;padding:40px 20px}.g2,.g3,.g4{grid-template-columns:1fr}.stats{grid-template-columns:1fr 1fr}.perks,.regs{grid-template-columns:1fr}.kitbox{flex-direction:column}.docs{grid-template-columns:1fr}.dsidebar{display:none}.dcontent{padding:32px 20px}.fbtm{flex-direction:column;gap:8px;padding:20px;text-align:center}}
`

const STATS = [
  { num:'2022',    lbl:'Founded' },
  { num:'1,000+', lbl:'Investors & Issuers' },
  { num:'190+',    lbl:'Countries Served' },
  { num:'€420M+',  lbl:'Assets Tokenized' },
]

const TIMELINE = [
  { y:'2022 · Q1', t:'Founded in Vilnius',               b:'Nextoken Capital UAB incorporated in Lithuania, selected for its progressive DLT regulatory environment and EU membership.' },
  { y:'2022 · Q4', t:'Bank of Lithuania Authorization',  b:'Received authorization from Lietuvos bankas as an Electronic Money Institution, enabling regulated digital asset custody.' },
  { y:'2023 · Q3', t:'DLT Pilot Regime Admission',       b:'Admitted to the EU DLT Pilot Regime, granting permission to operate a DLT-based multilateral trading facility.' },
  { y:'2024 · Q2', t:'MiCA License Granted',             b:'Full MiCA license issued — the first of its class for an RWA tokenization platform in the Baltics.' },
  { y:'2025 · Q1', t:'€420M in Tokenized Assets',        b:'Platform surpassed 420M EUR in total tokenized asset value across real estate, sovereign bonds, and venture equity.' },
]

const TEAM = [
  { photo:'/bikash.png.jpg', i:'BK', n:'Bikash Bhat',              r:'CEO & Founder',            b:'Founder of Nextoken Capital. Passionate about regulated DeFi, tokenized real-world assets, and building the future of capital markets.' },
  { photo:null,          i:'EV', n:'Elena Vaitkute',      r:'CTO & Co-Founder',         b:'Ex-Ethereum Foundation researcher. Led DLT integrations at Nasdaq Nordic. PhD, KTU.' },
  { photo:null,          i:'JP', n:'Jonas Petrauskas',    r:'Chief Compliance Officer', b:'Former Senior Inspector at Lietuvos bankas. AML/KYC architect for 3 EU fintechs.' },
  { photo:null,          i:'SK', n:'Simona Kazlauskiene', r:'Chief Risk Officer',        b:'10 years at ECB in market risk supervision. Certified FRM. Led Basel IV across two Baltic banks.' },
]

const LICENSES = [
  { f:'🇱🇹', t:'Bank of Lithuania', id:'License EMI-2022-041',       d:'Authorized EMI under the Lithuanian Law on Electronic Money and Electronic Money Institutions.' },
  { f:'🇪🇺', t:'MiCA Authorization',id:'MiCA Ref: LT-CASP-2024-007', d:'Full authorization under EU Regulation 2023/1114 for CASP services across all EEA states.' },
  { f:'⚖️',  t:'DLT Pilot Regime', id:'DLT-MTF: ESMA-2023-LT-004',  d:'Approved DLT MTF under EU Regulation 2022/858, permitting tokenized securities trading.' },
]

const JOBS = [
  { dept:'Engineering', title:'Senior Blockchain Engineer',                  tags:['Remote','Full-time','Solidity EVM'],     r:true  },
  { dept:'Engineering', title:'Backend Engineer — Core API',                 tags:['Remote / Vilnius','Full-time','Go Rust'], r:true  },
  { dept:'Engineering', title:'Frontend Engineer — Exchange UI',             tags:['Remote','Full-time','React TypeScript'],  r:true  },
  { dept:'Engineering', title:'DevSecOps Engineer',                          tags:['Vilnius','Full-time','AWS Terraform'],    r:false },
  { dept:'Compliance',  title:'AML Compliance Analyst',                      tags:['Vilnius','Full-time','MiCA KYC'],         r:false },
  { dept:'Legal',       title:'Senior Legal Counsel — Financial Regulation', tags:['Vilnius / Remote','Full-time','EU Law'],  r:true  },
  { dept:'Product',     title:'Product Manager — Tokenization Platform',     tags:['Remote','Full-time'],                     r:true  },
  { dept:'Growth',      title:'Head of Business Development — Issuers',      tags:['Vilnius / London','Full-time'],           r:false },
  { dept:'Growth',      title:'Institutional Sales Manager',                 tags:['Remote','Full-time','B2B'],               r:true  },
]

const PERKS = [
  { i:'🌍', t:'Remote-First Culture',   d:'Work from anywhere. We operate across 12 time zones and default to async communication.' },
  { i:'📈', t:'Equity and Token Grants', d:'Every full-time employee receives equity and NXT token allocations with a 4-year vesting schedule.' },
  { i:'🏥', t:'Full Health Coverage',   d:'Comprehensive private health insurance for you and your dependents across the EU.' },
  { i:'📚', t:'3000 EUR Learning Budget',d:'Annual budget for courses, conferences, and books. No approval needed under 500 EUR.' },
  { i:'⚡', t:'Meaningful Impact',       d:'Work on infrastructure that affects how capital flows globally across 190 countries.' },
  { i:'🏖️', t:'35 Days PTO',            d:'30 days annual leave plus holidays. We actively encourage people to fully disconnect.' },
]

const PRESS_LOGOS = ['Financial Times','Bloomberg','CoinDesk','The Block','Reuters','Verslo zinios','Decrypt']

const ARTICLES = [
  { src:'The Block',      date:'Feb 14, 2026', title:'Nextoken Capital reaches 420M tokenized asset milestone under MiCA regime',          desc:'The Vilnius-based platform surpassed a major threshold, signaling growing institutional appetite for regulated on-chain securities.' },
  { src:'CoinDesk',       date:'Jan 28, 2026', title:'How Lithuania became Europe quiet leader in tokenized capital markets regulation',    desc:'A deep dive into how the Bank of Lithuania pragmatic approach to DLT licensing created a cluster of RWA platforms.' },
  { src:'Financial Times',date:'Dec 10, 2025', title:'Tokenized real estate: the Baltic platforms reshaping European property investment', desc:'FT Alphaville covers Nextoken Vilnius Office Token as a case study for compliant fractional property ownership.' },
  { src:'Bloomberg',      date:'Nov 3, 2025',  title:'EU DLT Pilot Regime: one year in, the platforms that are making it work',           desc:'Bloomberg Markets profiles the five most active DLT MTF operators. Nextoken Capital placed second by trading volume.' },
  { src:'Decrypt',        date:'Sep 18, 2025', title:'MiCA first cohort: which crypto platforms earned the EU highest compliance badge',  desc:'Analysis of the initial wave of MiCA CASP licenses, with Nextoken Capital highlighted as a model for RWA-focused platforms.' },
  { src:'Verslo zinios',  date:'Aug 5, 2025',  title:'Nextoken pritrauke 12 000 investuotoju is 190 saliu',                              desc:'Lietuvos verslo leidinys apie Nextoken Capital augima ir Lietuvos banko priezura per pirmuosius trejus veiklos metus.' },
]

const RELEASES = [
  { date:'March 1, 2026',    title:'Nextoken Capital launches sovereign bond tokenization program for Baltic issuers' },
  { date:'January 15, 2026', title:'420 million EUR in tokenized assets milestone — platform update and outlook 2026' },
  { date:'June 3, 2024',     title:'Nextoken Capital receives MiCA CASP license from the Bank of Lithuania' },
]

const BLOG_CATS = ['All','Regulation','Product','Real Estate','Bonds','Technology','Market Analysis']

const POSTS = [
  { e:'🏛️', cat:'Regulation',      title:'DLT Pilot Regime explained: what issuers need to know before tokenizing securities',  ex:'A plain-English breakdown of EU Regulation 2022/858 and the permissions it grants for on-chain securities trading.',                    by:'Elena Vaitkute',  at:'8 min · Feb 28' },
  { e:'🏗️', cat:'Real Estate',     title:'How we tokenized a 2.4M EUR Vilnius office building in under 72 hours',               ex:'A step-by-step walkthrough of the legal structure, smart contract architecture, and investor onboarding for the Vilnius Office Token.', by:'Andrius Mazulis', at:'10 min · Feb 14' },
  { e:'📊', cat:'Market Analysis', title:'Q4 2025 tokenized bond market report: yield compression and new entrants',            ex:'Our quarterly analysis of the EU tokenized fixed-income market, covering 47 active issuances across six DLT platforms.',              by:'Research Team',   at:'15 min · Jan 31' },
  { e:'⛓️', cat:'Technology',      title:'Why we chose an EVM-compatible chain for regulated securities',                       ex:'Our CTO shares the architecture decisions behind our settlement layer, including tradeoffs on chain selection and gas abstraction.',   by:'Elena Vaitkute',  at:'11 min · Jan 15' },
  { e:'🪙', cat:'Product',         title:'NXT Token: utility, governance rights, and staking mechanics explained',              ex:'A full explainer of the NXT platform token — how it reduces trading fees, grants governance votes, and accrues platform revenue.',  by:'Product Team',    at:'7 min · Jan 8'   },
  { e:'🌍', cat:'Regulation',      title:'Investing from outside the EU: what MiCA means for global access to tokenized securities', ex:'MiCA is an EU regulation but its passporting regime and third-country rules have major implications for non-EU investors.',       by:'Compliance Team', at:'9 min · Dec 19'  },
]

const API_SIDEBAR = [
  { lbl:'Getting Started', links:[{id:'intro',t:'Introduction'},{id:'auth',t:'Authentication'},{id:'errors',t:'Error Handling'},{id:'rate',t:'Rate Limits'}] },
  { lbl:'Markets',         links:[{id:'markets',t:'List Markets'},{id:'ticker',t:'Ticker'},{id:'orderbook',t:'Order Book'},{id:'trades',t:'Recent Trades'}] },
  { lbl:'Trading',         links:[{id:'orders',t:'Place Order'},{id:'cancel',t:'Cancel Order'},{id:'history',t:'Order History'}] },
  { lbl:'Assets',          links:[{id:'assets',t:'List Assets'},{id:'detail',t:'Asset Detail'},{id:'tokenize',t:'Tokenize Asset'}] },
  { lbl:'Account',         links:[{id:'balance',t:'Balance'},{id:'portfolio',t:'Portfolio'},{id:'kyc',t:'KYC Status'}] },
]

function Nav({ page, setPage }) {
  const tabs = [
    { id:'about',   lbl:'About'    },
    { id:'careers', lbl:'Careers'  },
    { id:'press',   lbl:'Press'    },
    { id:'blog',    lbl:'Blog'     },
    { id:'api',     lbl:'API Docs' },
  ]
  return (
    <nav>
      <button className="logo" onClick={() => setPage('about')}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <polygon points="11,2 20,7 20,15 11,20 2,15 2,7" stroke="#38bd82" strokeWidth="1.5" fill="rgba(56,189,130,0.1)"/>
          <circle cx="11" cy="11" r="3" fill="#38bd82"/>
        </svg>
        NXT <span>NEXTOKEN</span>
      </button>
      <div className="navlinks">
        {tabs.map(tab => (
          <button key={tab.id} className={page === tab.id ? 'navbtn on' : 'navbtn'} onClick={() => setPage(tab.id)}>
            {tab.lbl}
          </button>
        ))}
      </div>
      <button className="cta">Open Exchange</button>
    </nav>
  )
}

function Footer({ setPage }) {
  return (
    <>
      <footer>
        <div className="fbrand">
          <h3>NXT NEXTOKEN</h3>
          <p style={{fontSize:'.8rem',color:'#7a8599',maxWidth:'260px'}}>
            The regulated infrastructure for tokenized real-world assets. Supervised by the Bank of Lithuania.
          </p>
        </div>
        <div className="fcol">
          <h4>Products</h4>
          <a>Exchange</a><a>Bonds</a><a>Equity and IPO</a><a>Tokenize</a>
        </div>
        <div className="fcol">
          <h4>Company</h4>
          <a onClick={() => setPage('about')}>About Us</a>
          <a onClick={() => setPage('careers')}>Careers</a>
          <a onClick={() => setPage('press')}>Press</a>
          <a onClick={() => setPage('blog')}>Blog</a>
        </div>
        <div className="fcol">
          <h4>Legal</h4>
          <a>Terms of Service</a><a>Privacy Policy</a><a>Risk Disclosure</a><a>AML Policy</a>
        </div>
        <div className="fcol">
          <h4>Support</h4>
          <a>Help Center</a><a>Contact Us</a>
          <a onClick={() => setPage('api')}>API Docs</a>
          <a>Status</a>
        </div>
      </footer>
      <div className="fbtm">
        <p>2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
        <p>Risk warning: Investing in tokenized assets involves risk. Past performance is not indicative of future results.</p>
      </div>
    </>
  )
}

function About() {
  return (
    <main style={{paddingTop:'64px',minHeight:'100vh',background:'#060810'}}>
      <div className="hero">
        <div className="wrap">
          <div className="eye">About Nextoken Capital</div>
          <h1>Building the regulated infrastructure for <span className="ac">tokenized markets</span></h1>
          <p style={{fontSize:'clamp(1rem,1.6vw,1.18rem)',color:'#e8edf5',fontWeight:300,lineHeight:1.8,maxWidth:'680px',margin:0}}>
            Nextoken Capital UAB is a regulated financial technology company headquartered in Vilnius, Lithuania. We exist to bridge the 300 trillion USD global asset market with blockchain-native infrastructure — compliantly, openly, and at scale.
          </p>
        </div>
      </div>
      <div className="wrap">
        <div className="sec">
          <div className="stats">
            {STATS.map(s => (
              <div key={s.lbl} className="stat">
                <div className="statnum">{s.num}</div>
                <div className="statlbl">{s.lbl}</div>
              </div>
            ))}
          </div>
          <div className="g2" style={{gap:'48px',alignItems:'start'}}>
            <div>
              <div className="eye">Our Mission</div>
              <h2>Capital markets should not have gatekeepers</h2>
              <p>Today, access to real estate bonds, pre-IPO equity, and institutional-grade fixed income is limited to a small fraction of the global population — blocked by geography, minimum investment thresholds, and legacy intermediaries.</p>
              <p>Nextoken Capital was built to fix that. By combining distributed ledger technology with a full EU regulatory stack, we enable any issuer to raise capital on-chain and any investor — anywhere in the world — to access it compliantly.</p>
              <p>We believe the future of capital markets is programmable, borderless, and always-on. We are building it now.</p>
            </div>
            <div>
              <div className="eye">Our Story</div>
              <h2>From Vilnius to 190 countries</h2>
              <div className="tl">
                {TIMELINE.map(item => (
                  <div key={item.y} className="tli">
                    <div className="tly">{item.y}</div>
                    <h3>{item.t}</h3>
                    <p style={{fontSize:'.85rem',margin:0}}>{item.b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="sec">
          <div className="eye">Leadership</div>
          <h2>The team behind the platform</h2>
          <p style={{marginBottom:'40px'}}>Our leadership team brings together decades of experience across traditional capital markets, blockchain infrastructure, and EU financial regulation.</p>
          <div className="g4">
            {TEAM.map(m => (
              <div key={m.n} className="card tc">
                {m.photo
                  ? <img src={m.photo} alt={m.n} style={{width:'72px',height:'72px',borderRadius:'50%',objectFit:'cover',objectPosition:'top',margin:'0 auto 16px',display:'block',border:'2px solid #38bd82'}} />
                  : <div className="av">{m.i}</div>
                }
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:'4px'}}>{m.n}</div>
                <div className="trole">{m.r}</div>
                <div className="tbio">{m.b}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sec">
          <div className="eye">Regulation</div>
          <h2>Fully licensed. Fully transparent.</h2>
          <p>Nextoken Capital operates under multiple layers of EU financial regulation. Our licenses are publicly verifiable through official registries.</p>
          <div className="regs">
            {LICENSES.map(l => (
              <div key={l.t} className="reg">
                <div style={{fontSize:'1.8rem'}}>{l.f}</div>
                <h4 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'.95rem'}}>{l.t}</h4>
                <p style={{fontSize:'.8rem',margin:0}}>{l.d}</p>
                <span className="regid">{l.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function Careers() {
  return (
    <main style={{paddingTop:'64px',minHeight:'100vh',background:'#060810'}}>
      <div className="hero">
        <div className="wrap">
          <div className="eye">Careers at Nextoken</div>
          <h1>Build the future of <span className="ac">capital markets</span></h1>
          <p style={{maxWidth:'560px',fontSize:'1.02rem',margin:0}}>
            We are a team of engineers, financiers, and regulatory experts reimagining how capital flows globally. Join us from Vilnius or anywhere in the world.
          </p>
        </div>
      </div>
      <div className="wrap">
        <div className="sec">
          <div className="eye">Open Positions</div>
          <h2>{JOBS.length} roles across 5 teams</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'12px',marginTop:'32px'}}>
            {JOBS.map(j => (
              <div key={j.title} className="job">
                <div>
                  <div className="jdept">{j.dept}</div>
                  <div className="jtitle">{j.title}</div>
                  <div className="jmeta">
                    {j.tags.map((tg, i) => (
                      <span key={tg} className={i === 0 && j.r ? 'pill pillr' : 'pill'}>{tg}</span>
                    ))}
                  </div>
                </div>
                <span className="apply">Apply</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sec">
          <div className="eye">Why Nextoken</div>
          <h2>What we offer</h2>
          <div className="perks">
            {PERKS.map(p => (
              <div key={p.t} className="perk">
                <div className="picon">{p.i}</div>
                <div className="ptitle">{p.t}</div>
                <div className="pdesc">{p.d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sec">
          <div className="kitbox">
            <div>
              <h2>Do not see your role?</h2>
              <p style={{maxWidth:'480px',margin:0}}>
                We are always looking for exceptional people passionate about regulated DeFi and capital markets infrastructure. Send us your CV and we will reach out when a match opens.
              </p>
            </div>
            <button className="outbtn">Send Open Application</button>
          </div>
        </div>
      </div>
    </main>
  )
}

function Press() {
  return (
    <main style={{paddingTop:'64px',minHeight:'100vh',background:'#060810'}}>
      <div className="hero">
        <div className="wrap">
          <div className="eye">Press and Media</div>
          <h1>Nextoken Capital in the <span className="ac">news</span></h1>
          <p style={{margin:0}}>Press inquiries: <span style={{color:'#38bd82'}}>press@nextokencapital.com</span> — Response within 4 business hours.</p>
        </div>
      </div>
      <div className="wrap">
        <div className="sec">
          <div className="eye">As Seen In</div>
          <div className="logos">
            {PRESS_LOGOS.map(l => <div key={l} className="logo2">{l}</div>)}
          </div>
          <div className="eye">Recent Coverage</div>
          <h2 style={{marginBottom:'32px'}}>Latest Press Articles</h2>
          <div className="g3">
            {ARTICLES.map(a => (
              <div key={a.title} className="art">
                <div className="asrc">{a.src}<span className="adate">{a.date}</span></div>
                <div className="atitle">{a.title}</div>
                <div className="adesc">{a.desc}</div>
                <span className="rlink">Read article</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sec">
          <div className="eye">Key Announcements</div>
          <h2 style={{marginBottom:'32px'}}>Official Press Releases</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {RELEASES.map(r => (
              <div key={r.title} className="card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'20px',padding:'20px 28px'}}>
                <div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:'.68rem',color:'rgba(255,255,255,0.35)',marginBottom:'6px'}}>{r.date}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'.98rem'}}>{r.title}</div>
                </div>
                <span className="rlink" style={{flexShrink:0}}>PDF</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sec">
          <div className="kitbox">
            <div>
              <h2>Press Kit and Brand Assets</h2>
              <p style={{maxWidth:'480px',margin:0}}>
                Download our official press kit including logos, executive photos, company fact sheet, and approved brand guidelines. All assets are cleared for editorial use with attribution.
              </p>
            </div>
            <button className="outbtn">Download Press Kit</button>
          </div>
        </div>
      </div>
    </main>
  )
}

function Blog() {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? POSTS : POSTS.filter(p => p.cat === cat)
  return (
    <main style={{paddingTop:'64px',minHeight:'100vh',background:'#060810'}}>
      <div className="hero">
        <div className="wrap">
          <div className="eye">Nextoken Journal</div>
          <h1>Insights on <span className="ac">tokenized markets</span></h1>
          <p style={{maxWidth:'500px',margin:0}}>Research, regulatory analysis, and product updates from the Nextoken Capital team.</p>
        </div>
      </div>
      <div className="wrap">
        <div className="sec">
          <div className="feat">
            <div className="fbadge">Featured</div>
            <div className="ftitle">MiCA one year on: what regulated tokenization actually looks like in practice</div>
            <p style={{maxWidth:'620px',margin:0,fontSize:'.9rem'}}>
              Twelve months since the first MiCA CASP licenses were issued, we look at what compliance really required, what surprised us, and what it means for issuers entering the EU capital market.
            </p>
            <div className="pmeta">
              <div className="achip">
                <div className="adot">JK</div>
                <div>
                  <div style={{fontSize:'.82rem',color:'#e8edf5'}}>Jonas Kazlauskas</div>
                  <div style={{fontSize:'.72rem',color:'rgba(255,255,255,0.35)',fontFamily:"'DM Mono',monospace"}}>Head of Compliance</div>
                </div>
              </div>
              <span style={{fontSize:'.78rem',color:'rgba(255,255,255,0.35)',fontFamily:"'DM Mono',monospace"}}>March 12, 2026</span>
              <span style={{fontSize:'.78rem',color:'rgba(255,255,255,0.35)'}}>12 min read</span>
              <span className="rlink">Read</span>
            </div>
          </div>
          <div className="cats">
            {BLOG_CATS.map(c => (
              <button key={c} className={cat === c ? 'catbtn on' : 'catbtn'} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="g3">
            {filtered.map(p => (
              <div key={p.title} className="bcard">
                <div className="bthumb">{p.e}</div>
                <div className="bbody">
                  <div className="bcat">{p.cat}</div>
                  <div className="btitle">{p.title}</div>
                  <div className="bex">{p.ex}</div>
                  <div className="bfoot">
                    <span style={{fontSize:'.75rem',color:'rgba(255,255,255,0.35)'}}>{p.by}</span>
                    <span style={{fontSize:'.72rem',color:'rgba(255,255,255,0.35)',fontFamily:"'DM Mono',monospace"}}>{p.at}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function ApiDocs() {
  const [active, setActive] = useState('intro')
  return (
    <div style={{paddingTop:'64px',background:'#060810'}}>
      <div className="docs">
        <div className="dsidebar">
          {API_SIDEBAR.map(s => (
            <div key={s.lbl} className="dsec">
              <div className="dlbl">{s.lbl}</div>
              {s.links.map(l => (
                <a key={l.id} className={active === l.id ? 'dlink on' : 'dlink'} href={'#' + l.id} onClick={() => setActive(l.id)}>{l.t}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="dcontent">
          <div className="eye">Developer Reference</div>
          <h1 id="intro" style={{fontFamily:"'Syne',sans-serif",fontSize:'2rem',fontWeight:800,marginBottom:'12px'}}>
            Nextoken API <span className="ac">v2</span>
          </h1>
          <p>The Nextoken Capital REST API gives you programmatic access to markets, trading, asset tokenization, and account management. All endpoints are served over HTTPS and return JSON.</p>
          <span className="tag">Base URL</span>
          <pre style={{marginTop:'10px'}}>https://api.nextokencapital.com/v2</pre>

          <h2 id="auth" style={{fontFamily:"'Syne',sans-serif",marginTop:'48px',paddingTop:'48px',borderTop:'1px solid rgba(255,255,255,0.07)'}}>Authentication</h2>
          <p>All API requests require an API key in the request header. Generate your key from Account and then API Keys.</p>
          <div className="ai">
            <div className="atit">Keep your API key secret</div>
            Never expose it in client-side code or public repositories. Use environment variables.
          </div>
          <pre>{`curl https://api.nextokencapital.com/v2/markets \\\n  -H "X-API-Key: nxt_live_your_key_here" \\\n  -H "Content-Type: application/json"`}</pre>

          <h2 id="errors" style={{fontFamily:"'Syne',sans-serif",marginTop:'48px',paddingTop:'48px',borderTop:'1px solid rgba(255,255,255,0.07)'}}>Error Handling</h2>
          <p>All error responses include a machine-readable code and human-readable message.</p>
          <pre>{`{\n  "error": {\n    "code":    "INSUFFICIENT_BALANCE",\n    "message": "Your EUR balance is too low to place this order.",\n    "status":  422\n  }\n}`}</pre>

          <h2 id="rate" style={{fontFamily:"'Syne',sans-serif",marginTop:'48px',paddingTop:'48px',borderTop:'1px solid rgba(255,255,255,0.07)'}}>Rate Limits</h2>
          <table className="rtbl">
            <thead>
              <tr><th>Tier</th><th>Requests per min</th><th>Orders per min</th><th>WebSocket</th></tr>
            </thead>
            <tbody>
              {[['Free','60','10','2'],['Standard','300','60','10'],['Professional','1200','300','50'],['Institutional','Unlimited','Unlimited','Unlimited']].map(([tier, ...vals]) => (
                <tr key={tier}>
                  <td className="tier">{tier}</td>
                  {vals.map(v => <td key={v}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>

          <h2 id="markets" style={{fontFamily:"'Syne',sans-serif",marginTop:'48px',paddingTop:'48px',borderTop:'1px solid rgba(255,255,255,0.07)'}}>Markets</h2>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:'1rem',fontWeight:600,marginBottom:'12px'}}>GET /markets</h3>
          <div className="ep">
            <span className="m mget">GET</span>
            <span className="epath">/markets</span>
            <span className="edesc">List all trading pairs</span>
          </div>
          <pre>{`{\n  "markets": [\n    { "pair": "BTC/EUR", "status": "active", "min_order": 10.00 }\n  ]\n}`}</pre>

          <h2 id="orders" style={{fontFamily:"'Syne',sans-serif",marginTop:'48px',paddingTop:'48px',borderTop:'1px solid rgba(255,255,255,0.07)'}}>Place Order</h2>
          <div className="ep">
            <span className="m mpost">POST</span>
            <span className="epath">/orders</span>
            <span className="edesc">Place a new order</span>
          </div>
          <div className="aw">
            <div className="atit">KYC Required</div>
            Your account must complete Level 2 KYC verification before placing orders.
          </div>
          <table className="ptbl">
            <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
              {[
                ['pair','string',true,'Trading pair e.g. BTC-EUR'],
                ['side','enum',true,'buy or sell'],
                ['type','enum',true,'market, limit, or stop_limit'],
                ['amount','number',true,'Base currency amount'],
                ['price','number',false,'Limit price required for limit orders'],
                ['client_id','string',false,'Your reference ID max 64 chars'],
              ].map(([f, t, req, d]) => (
                <tr key={String(f)}>
                  <td>{f}</td>
                  <td><span className="ptyp">{t}</span></td>
                  <td>{req ? <span className="preq">required</span> : <span className="popt">optional</span>}</td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <pre>{`// Request\n{\n  "pair":   "BTC-EUR",\n  "side":   "buy",\n  "type":   "limit",\n  "amount": 0.05,\n  "price":  61500.00\n}\n// Response\n{\n  "order_id": "ord_9f3k2m1x",\n  "status":   "open",\n  "filled":   0\n}`}</pre>

          <h2 id="tokenize" style={{fontFamily:"'Syne',sans-serif",marginTop:'48px',paddingTop:'48px',borderTop:'1px solid rgba(255,255,255,0.07)'}}>Tokenize an Asset</h2>
          <div className="ep">
            <span className="m mpost">POST</span>
            <span className="epath">/assets/tokenize</span>
            <span className="edesc">Submit a tokenization request</span>
          </div>
          <pre>{`// Request\n{\n  "asset_type":   "real_estate",\n  "name":         "Vilnius Office Block A",\n  "total_value":  2400000,\n  "token_supply": 847,\n  "yield_rate":   4.8\n}\n// Response\n{\n  "issuance_id": "iss_7g8h9i0j",\n  "status":      "pending_review",\n  "review_eta":  "48h"\n}`}</pre>

          <div className="ai" style={{marginTop:'48px'}}>
            <div className="atit">Need help?</div>
            Developer support: api-support@nextokencapital.com — For institutional integrations contact your account manager.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CompanyPage() {
  const [page, setPage] = useState('about')

  const go = (p) => {
    setPage(p)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const pages = {
    about:   <About />,
    careers: <Careers />,
    press:   <Press />,
    blog:    <Blog />,
    api:     <ApiDocs />,
  }

  return (
    <>
      <Head>
        <title>Nextoken Capital — Company</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: S }} />
      </Head>
      <Nav page={page} setPage={go} />
      {pages[page]}
      {page !== 'api' && <Footer setPage={go} />}
    </>
  )
}