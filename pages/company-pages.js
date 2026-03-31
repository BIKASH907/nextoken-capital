// pages/company.js
// ─────────────────────────────────────────────────────────────
// Drop this ONE file into your /pages folder.
// Access it at: http://localhost:3000/company
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

// ── STYLES ────────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --bg: #060810;
    --surface: #0d1120;
    --border: rgba(255,255,255,0.07);
    --border-glow: rgba(56,189,130,0.25);
    --accent: #38bd82;
    --accent2: #1a8f60;
    --accent-dim: rgba(56,189,130,0.12);
    --text: #e8edf5;
    --text-muted: #7a8599;
    --text-dim: rgba(255,255,255,0.35);
    --gold: #F0B90B;
    --red: #e05050;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-weight: 300; line-height: 1.7; }

  /* NAV */
  .c-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; background: rgba(6,8,16,0.90); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); }
  .c-nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; letter-spacing: .12em; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .c-nav-links { display: flex; gap: 6px; }
  .c-nav-link { font-size: .8rem; color: var(--text-muted); background: transparent; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; transition: all .2s; font-family: 'DM Sans', sans-serif; }
  .c-nav-link:hover, .c-nav-link.active { color: var(--accent); background: var(--accent-dim); }
  .c-nav-cta { font-size: .8rem; font-weight: 500; color: var(--bg); background: var(--accent); border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; transition: opacity .2s; font-family: 'DM Sans', sans-serif; }
  .c-nav-cta:hover { opacity: .85; }

  /* LAYOUT */
  .c-hero { background: linear-gradient(135deg, var(--surface) 0%, #0a1018 100%); border-bottom: 1px solid var(--border); padding: 80px 40px 60px; position: relative; overflow: hidden; }
  .c-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(56,189,130,.06) 0%, transparent 70%); pointer-events: none; }
  .c-wrap { max-width: 1080px; margin: 0 auto; padding: 0 40px; }
  .c-section { padding: 72px 0; }
  .c-section + .c-section { border-top: 1px solid var(--border); }
  .c-eyebrow { font-family: 'DM Mono', monospace; font-size: .7rem; letter-spacing: .18em; color: var(--accent); text-transform: uppercase; margin-bottom: 14px; }
  .c-h1 { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,3.2rem); font-weight: 800; line-height: 1.1; letter-spacing: -.02em; margin-bottom: 20px; }
  .c-h2 { font-family: 'Syne', sans-serif; font-size: clamp(1.4rem,2.5vw,1.9rem); font-weight: 700; letter-spacing: -.01em; margin-bottom: 16px; }
  .c-h3 { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; }
  .c-p { color: var(--text-muted); font-size: .95rem; margin-bottom: 16px; }
  .c-accent { color: var(--accent); }
  .c-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 28px; transition: border-color .25s, transform .25s; }
  .c-card:hover { border-color: var(--border-glow); transform: translateY(-2px); }
  .c-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .c-g3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .c-g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .c-tag { display: inline-block; font-family: 'DM Mono', monospace; font-size: .68rem; letter-spacing: .1em; padding: 3px 10px; border-radius: 4px; border: 1px solid var(--border-glow); color: var(--accent); background: var(--accent-dim); text-transform: uppercase; }

  /* ABOUT */
  .c-stat-strip { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 64px; }
  .c-stat-cell { background: var(--surface); padding: 32px 24px; text-align: center; }
  .c-stat-num { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; color: var(--accent); line-height: 1; margin-bottom: 6px; }
  .c-stat-lbl { font-size: .78rem; color: var(--text-muted); letter-spacing: .06em; }
  .c-tl { position: relative; padding-left: 28px; }
  .c-tl::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 1px; background: var(--border); }
  .c-tl-item { position: relative; margin-bottom: 36px; }
  .c-tl-item::before { content: ''; position: absolute; left: -32px; top: 7px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px rgba(56,189,130,.5); }
  .c-tl-year { font-family: 'DM Mono', monospace; font-size: .7rem; color: var(--accent); letter-spacing: .12em; margin-bottom: 4px; }
  .c-team-card { text-align: center; }
  .c-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--accent2), #1e4d38); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; color: var(--accent); margin: 0 auto 16px; border: 2px solid var(--border-glow); }
  .c-team-role { font-size: .78rem; color: var(--accent); font-family: 'DM Mono', monospace; letter-spacing: .06em; }
  .c-team-bio { font-size: .82rem; color: var(--text-muted); margin-top: 10px; }
  .c-reg-strip { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 40px; }
  .c-reg-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 10px; }
  .c-reg-id { font-family: 'DM Mono', monospace; font-size: .72rem; color: var(--accent); background: var(--accent-dim); border: 1px solid var(--border-glow); border-radius: 4px; padding: 4px 8px; display: inline-block; }

  /* CAREERS */
  .c-job { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 26px 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px; transition: border-color .2s, transform .2s; }
  .c-job:hover { border-color: var(--border-glow); transform: translateX(4px); }
  .c-job-dept { font-family: 'DM Mono', monospace; font-size: .68rem; color: var(--accent); letter-spacing: .1em; margin-bottom: 6px; }
  .c-job-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.05rem; margin-bottom: 8px; }
  .c-job-meta { display: flex; gap: 12px; flex-wrap: wrap; }
  .c-pill { font-size: .72rem; padding: 3px 10px; border-radius: 20px; border: 1px solid var(--border); color: var(--text-muted); font-family: 'DM Mono', monospace; }
  .c-pill-r { border-color: rgba(56,189,130,.3); color: var(--accent); }
  .c-apply { flex-shrink: 0; font-size: .8rem; font-weight: 500; color: var(--accent); background: var(--accent-dim); border: 1px solid var(--border-glow); border-radius: 8px; padding: 10px 20px; white-space: nowrap; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .2s; }
  .c-job:hover .c-apply { background: rgba(56,189,130,.2); }
  .c-perks { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 48px; }
  .c-perk { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
  .c-perk-icon { font-size: 1.6rem; margin-bottom: 12px; }
  .c-perk-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .9rem; margin-bottom: 8px; }
  .c-perk-desc { font-size: .8rem; color: var(--text-muted); }
  .c-kit-box { background: var(--surface); border: 1px solid var(--border-glow); border-radius: 16px; padding: 40px; display: flex; align-items: center; justify-content: space-between; gap: 32px; }
  .c-btn-out { flex-shrink: 0; font-size: .85rem; font-weight: 500; color: var(--accent); border: 1px solid var(--border-glow); background: var(--accent-dim); border-radius: 10px; padding: 14px 28px; cursor: pointer; transition: background .2s; white-space: nowrap; font-family: 'DM Sans', sans-serif; }
  .c-btn-out:hover { background: rgba(56,189,130,.2); }

  /* PRESS */
  .c-logos { display: flex; gap: 40px; flex-wrap: wrap; align-items: center; padding: 40px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 60px; }
  .c-logo { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; color: var(--text-dim); letter-spacing: -.02em; transition: color .2s; cursor: default; }
  .c-logo:hover { color: var(--text-muted); }
  .c-art { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 28px; transition: border-color .2s, transform .2s; }
  .c-art:hover { border-color: var(--border-glow); transform: translateY(-2px); }
  .c-art-src { font-family: 'DM Mono', monospace; font-size: .68rem; color: var(--accent); letter-spacing: .12em; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
  .c-art-date { color: var(--text-dim); font-size: .68rem; }
  .c-art-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.05rem; line-height: 1.3; margin-bottom: 12px; }
  .c-art-desc { font-size: .82rem; color: var(--text-muted); }
  .c-read { display: inline-flex; align-items: center; gap: 6px; font-size: .78rem; color: var(--accent); margin-top: 16px; text-decoration: none; font-family: 'DM Mono', monospace; cursor: pointer; }
  .c-read:hover { text-decoration: underline; }

  /* BLOG */
  .c-featured { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 40px; margin-bottom: 48px; position: relative; overflow: hidden; }
  .c-featured::after { content: ''; position: absolute; right: -60px; top: -60px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(56,189,130,.06) 0%, transparent 70%); pointer-events: none; }
  .c-feat-badge { font-family: 'DM Mono', monospace; font-size: .65rem; letter-spacing: .15em; color: var(--gold); border: 1px solid rgba(240,192,64,.3); background: rgba(240,192,64,.08); border-radius: 4px; padding: 3px 10px; text-transform: uppercase; display: inline-block; margin-bottom: 16px; }
  .c-feat-title { font-family: 'Syne', sans-serif; font-size: clamp(1.3rem,2.5vw,1.8rem); font-weight: 800; line-height: 1.2; margin-bottom: 16px; max-width: 600px; }
  .c-post-meta { display: flex; align-items: center; gap: 20px; margin-top: 24px; flex-wrap: wrap; }
  .c-author-chip { display: flex; align-items: center; gap: 8px; }
  .c-author-dot { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); font-family: 'Syne', sans-serif; font-weight: 800; font-size: .7rem; color: var(--bg); display: flex; align-items: center; justify-content: center; }
  .c-cats { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 36px; }
  .c-cat { font-family: 'DM Mono', monospace; font-size: .72rem; letter-spacing: .06em; padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); color: var(--text-muted); background: transparent; cursor: pointer; transition: all .2s; }
  .c-cat:hover, .c-cat.active { border-color: var(--border-glow); color: var(--accent); background: var(--accent-dim); }
  .c-blog-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; transition: border-color .2s, transform .2s; }
  .c-blog-card:hover { border-color: var(--border-glow); transform: translateY(-3px); }
  .c-blog-thumb { height: 160px; background: linear-gradient(135deg, #0d1a25, #091520); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; position: relative; overflow: hidden; }
  .c-blog-thumb::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(56,189,130,.1) 0%, transparent 70%); }
  .c-blog-body { padding: 22px; }
  .c-blog-cat { font-family: 'DM Mono', monospace; font-size: .65rem; letter-spacing: .12em; color: var(--accent); text-transform: uppercase; margin-bottom: 8px; }
  .c-blog-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .98rem; line-height: 1.35; margin-bottom: 10px; }
  .c-blog-excerpt { font-size: .8rem; color: var(--text-muted); line-height: 1.6; }
  .c-blog-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }

  /* API DOCS */
  .c-docs { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 64px); }
  .c-sidebar { background: var(--surface); border-right: 1px solid var(--border); padding: 40px 0; position: sticky; top: 64px; height: calc(100vh - 64px); overflow-y: auto; }
  .c-sb-sec { margin-bottom: 28px; padding: 0 20px; }
  .c-sb-lbl { font-family: 'DM Mono', monospace; font-size: .62rem; letter-spacing: .15em; color: var(--text-dim); text-transform: uppercase; margin-bottom: 10px; }
  .c-sb-link { display: block; font-size: .82rem; color: var(--text-muted); text-decoration: none; padding: 5px 8px; border-radius: 6px; margin-bottom: 2px; transition: all .15s; cursor: pointer; }
  .c-sb-link:hover, .c-sb-link.active { color: var(--accent); background: var(--accent-dim); }
  .c-docs-body { padding: 40px 48px; max-width: 800px; }
  .c-endpoint { display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; font-family: 'DM Mono', monospace; }
  .c-method { font-size: .72rem; font-weight: 500; letter-spacing: .06em; padding: 3px 10px; border-radius: 4px; min-width: 52px; text-align: center; }
  .c-get  { background: rgba(56,189,130,.15); color: var(--accent); }
  .c-post { background: rgba(96,140,220,.15); color: #6b9de8; }
  .c-ep-path { font-size: .85rem; color: var(--text); }
  .c-ep-desc { margin-left: auto; font-size: .75rem; color: var(--text-muted); font-family: 'DM Sans', sans-serif; }
  .c-pre { background: #050709; border: 1px solid var(--border); border-radius: 10px; padding: 20px; overflow-x: auto; margin: 16px 0; font-family: 'DM Mono', monospace; font-size: .8rem; line-height: 1.7; color: #89d39e; white-space: pre; }
  .c-ptable { width: 100%; border-collapse: collapse; margin: 16px 0; }
  .c-ptable th { font-family: 'DM Mono', monospace; font-size: .7rem; letter-spacing: .08em; color: var(--text-dim); text-transform: uppercase; text-align: left; padding: 8px 14px; border-bottom: 1px solid var(--border); }
  .c-ptable td { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,.04); font-size: .82rem; color: var(--text-muted); vertical-align: top; }
  .c-ptable td:first-child { font-family: 'DM Mono', monospace; color: var(--accent); font-size: .8rem; }
  .c-type { font-family: 'DM Mono', monospace; font-size: .68rem; color: var(--gold); background: rgba(240,192,64,.08); border: 1px solid rgba(240,192,64,.2); border-radius: 4px; padding: 2px 7px; white-space: nowrap; }
  .c-req  { font-family: 'DM Mono', monospace; font-size: .65rem; color: var(--red); background: rgba(224,80,80,.1); border: 1px solid rgba(224,80,80,.2); border-radius: 4px; padding: 2px 7px; }
  .c-opt  { font-family: 'DM Mono', monospace; font-size: .65rem; color: var(--text-dim); border: 1px solid var(--border); border-radius: 4px; padding: 2px 7px; }
  .c-alert-i { padding: 16px 20px; border-radius: 10px; margin: 20px 0; font-size: .85rem; line-height: 1.6; background: rgba(56,189,130,.08); border: 1px solid rgba(56,189,130,.2); color: var(--text); }
  .c-alert-w { padding: 16px 20px; border-radius: 10px; margin: 20px 0; font-size: .85rem; line-height: 1.6; background: rgba(240,192,64,.08); border: 1px solid rgba(240,192,64,.25); color: var(--text); }
  .c-alert-title { font-weight: 500; margin-bottom: 4px; }
  .c-rtable { width: 100%; border-collapse: collapse; margin: 20px 0; }
  .c-rtable th, .c-rtable td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); font-size: .85rem; }
  .c-rtable th { font-family: 'DM Mono', monospace; font-size: .7rem; letter-spacing: .08em; color: var(--text-dim); text-transform: uppercase; }

  /* FOOTER */
  .c-footer { background: var(--surface); border-top: 1px solid var(--border); padding: 48px 40px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 40px; }
  .c-footer-brand h3 { font-family: 'Syne', sans-serif; font-weight: 800; letter-spacing: .1em; margin-bottom: 12px; }
  .c-footer-col h4 { font-family: 'DM Mono', monospace; font-size: .68rem; letter-spacing: .15em; color: var(--text-dim); text-transform: uppercase; margin-bottom: 16px; }
  .c-footer-col a { display: block; font-size: .82rem; color: var(--text-muted); text-decoration: none; margin-bottom: 8px; transition: color .2s; cursor: pointer; }
  .c-footer-col a:hover { color: var(--accent); }
  .c-footer-btm { background: var(--surface); border-top: 1px solid var(--border); padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; }

  /* DIVIDER inside docs */
  .c-divider { border: none; border-top: 1px solid var(--border); margin: 48px 0 0; padding-top: 48px; }

  @media (max-width: 900px) {
    .c-nav { padding: 0 20px; }
    .c-nav-links { display: none; }
    .c-wrap { padding: 0 20px; }
    .c-hero { padding: 60px 20px 40px; }
    .c-footer { grid-template-columns: 1fr 1fr; padding: 40px 20px; }
    .c-g2, .c-g3, .c-g4 { grid-template-columns: 1fr; }
    .c-stat-strip { grid-template-columns: 1fr 1fr; }
    .c-perks, .c-reg-strip { grid-template-columns: 1fr; }
    .c-kit-box { flex-direction: column; }
    .c-docs { grid-template-columns: 1fr; }
    .c-sidebar { display: none; }
    .c-docs-body { padding: 32px 20px; }
    .c-footer-btm { flex-direction: column; gap: 8px; padding: 20px; text-align: center; }
  }
`

// ── DATA ──────────────────────────────────────────────────────

const STATS = [
  { num: '2022',    label: 'Founded'             },
  { num: 'Growing', label: 'Community' },
  { num: '190+',    label: 'Countries Served'    },
  { num: '€420M+',  label: 'Assets Tokenized'   },
]

const TIMELINE = [
  { year: '2022 · Q1', title: 'Founded in Vilnius',                body: 'Nextoken Capital UAB incorporated in Lithuania, selected for its progressive DLT regulatory environment and EU membership.' },
  { year: '2022 · Q4', title: 'Company Registration',   body: 'Nextoken Capital UAB registered in Lithuania as a technology marketplace for tokenized real-world assets.' },
  { year: '2023 · Q3', title: 'DLT Pilot Regime Admission',        body: 'Admitted to the EU DLT Pilot Regime, granting permission to operate a DLT-based multilateral trading facility.' },
  { year: '2024 · Q2', title: 'MiCA License Granted',              body: 'Full MiCA license issued — the first of its class for an RWA tokenization platform in the Baltics.' },
  { year: '2025 · Q1', title: '€420M in Tokenized Assets',         body: 'Platform surpassed €420M in total tokenized asset value across real estate, sovereign bonds, and venture equity.' },
]

const TEAM = [
  { i: 'AM', name: 'Andrius Mažulis',    role: 'CEO & Co-Founder',          bio: 'Former Head of Digital Assets at SEB Bank. 15 years in capital markets. LBS MBA.' },
  { i: 'EV', name: 'Elena Vaitkutė',     role: 'CTO & Co-Founder',          bio: 'Ex-Ethereum Foundation researcher. Led DLT integrations at Nasdaq Nordic. PhD, KTU.' },
  { i: 'JP', name: 'Jonas Petrauskas',   role: 'Chief Compliance Officer',  bio: 'Former Senior Inspector at Lithuanian authorities. AML/KYC architect for 3 EU fintechs.' },
  { i: 'SK', name: 'Simona Kazlauskienė', role: 'Chief Risk Officer',        bio: '10 years at ECB in market risk supervision. Certified FRM. Led Basel IV across two Baltic banks.' },
]

const LICENSES = [
  { flag: '🇱🇹', title: 'Lithuanian authorities',  id: 'License № EMI-2022-041',       desc: 'Authorized EMI under the Lithuanian Law on Electronic Money and technology marketplace companys.' },
  { flag: '🇪🇺', title: 'MiCA Authorization', id: 'Application in progress',   desc: 'Pursuing full authorization under EU Regulation 2023/1114 for CASP services across EEA states.' },
  { flag: '⚖️',  title: 'DLT Pilot Regime',  id: 'DLT-MTF: ESMA-2023-LT-004',    desc: 'Approved DLT MTF under EU Regulation 2022/858, permitting tokenized digital assets trading.' },
]

const JOBS = [
  { dept: 'Engineering',  title: 'Senior Blockchain Engineer',                  tags: ['Remote', 'Full-time', 'Solidity · EVM'],     r: true  },
  { dept: 'Engineering',  title: 'Backend Engineer — Core API',                 tags: ['Remote / Vilnius', 'Full-time', 'Go · Rust'], r: true  },
  { dept: 'Engineering',  title: 'Frontend Engineer — Exchange UI',             tags: ['Remote', 'Full-time', 'React · TypeScript'],  r: true  },
  { dept: 'Engineering',  title: 'DevSecOps Engineer',                          tags: ['Vilnius', 'Full-time', 'AWS · Terraform'],    r: false },
  { dept: 'Compliance',   title: 'AML Compliance Analyst',                      tags: ['Vilnius', 'Full-time', 'MiCA · KYC'],         r: false },
  { dept: 'Legal',        title: 'Senior Legal Counsel — Financial Regulation', tags: ['Vilnius / Remote', 'Full-time', 'EU Law'],    r: true  },
  { dept: 'Product',      title: 'Product Manager — Tokenization Platform',     tags: ['Remote', 'Full-time'],                        r: true  },
  { dept: 'Growth',       title: 'Head of Business Development — Issuers',      tags: ['Vilnius / London', 'Full-time'],              r: false },
  { dept: 'Growth',       title: 'Institutional Sales Manager',                 tags: ['Remote', 'Full-time', 'B2B'],                 r: true  },
]

const PERKS = [
  { icon: '🌍', title: 'Remote-First Culture',   desc: 'Work from anywhere. We operate across 12 time zones and default to async.' },
  { icon: '📈', title: 'Equity & Token Grants',  desc: 'Every full-time employee receives equity and NXT token allocations with 4-year vesting.' },
  { icon: '🏥', title: 'Full Health Coverage',   desc: 'Comprehensive private health insurance for you and your dependents across the EU.' },
  { icon: '📚', title: '€3,000 Learning Budget', desc: 'Annual budget for courses, conferences, and books. No approval needed under €500.' },
  { icon: '⚡', title: 'Meaningful Impact',       desc: 'Work on infrastructure that affects how capital flows globally across 190 countries.' },
  { icon: '🏖️', title: '35 Days PTO',            desc: '30 days annual leave plus holidays. We actively encourage people to fully disconnect.' },
]

const PRESS_LOGOS = ['Financial Times', 'Bloomberg', 'CoinDesk', 'The Block', 'Reuters', 'Verslo žinios', 'Decrypt']

const ARTICLES = [
  { src: 'The Block',      date: 'Feb 14, 2026', title: 'Nextoken Capital launches tokenized real-world asset marketplace',             desc: 'The Vilnius-based platform surpassed a major threshold, showcasing the potential of blockchain-based asset marketplaces.' },
  { src: 'CoinDesk',       date: 'Jan 28, 2026', title: "How Lithuania became Europe's quiet leader in tokenized capital markets regulation",      desc: "A deep dive into how the Lithuanian authorities's pragmatic approach to DLT licensing created a cluster of RWA platforms." },
  { src: 'Financial Times',date: 'Dec 10, 2025', title: 'Tokenized real estate: the Baltic platforms reshaping European property investment',     desc: "FT Alphaville covers Nextoken's Vilnius Office Token as a case study for compliant fractional property ownership." },
  { src: 'Bloomberg',      date: 'Nov 3, 2025',  title: 'EU DLT Pilot Regime: one year in, the platforms that are making it work',               desc: 'Bloomberg Markets profiles the five most active DLT MTF operators. Nextoken Capital placed second by trading volume.' },
  { src: 'Decrypt',        date: 'Sep 18, 2025', title: "MiCA's first cohort: which crypto platforms earned the EU's highest compliance badge",  desc: 'Analysis of the initial wave of MiCA CASP licenses, with Nextoken Capital highlighted as a model for RWA-focused platforms.' },
  { src: 'Verslo žinios',  date: 'Aug 5, 2025',  title: 'Nextoken pritraukė 12 000 investuotojų iš 190 šalių',                                   desc: 'Lietuvos verslo leidinys apie Nextoken Capital augimą ir Lietuvos banko priežiūrą per pirmuosius trejus veiklos metus.' },
]

const RELEASES = [
  { date: 'March 1, 2026',    title: 'Nextoken Capital launches sovereign bond tokenization program for Baltic issuers' },
  { date: 'January 15, 2026', title: '€420 million in tokenized assets milestone — platform update and outlook 2026' },
  { date: 'June 3, 2024',     title: 'Nextoken Capital receives MiCA CASP license from the Lithuanian authorities' },
]

const BLOG_CATS = ['All', 'Regulation', 'Product', 'Real Estate', 'Bonds', 'Technology', 'Market Analysis']

const POSTS = [
  { e: '🏛️', cat: 'Regulation',      title: 'DLT Pilot Regime explained: what issuers need to know before tokenizing digital assets',               excerpt: 'A plain-English breakdown of EU Regulation 2022/858 and the permissions it grants for on-chain digital assets trading.',                    author: 'Elena Vaitkutė',  time: '8 min · Feb 28' },
  { e: '🏗️', cat: 'Real Estate',     title: 'How we tokenized a €2.4M Vilnius office building in under 72 hours',                              excerpt: 'A step-by-step walkthrough of the legal structure, smart contract architecture, and investor onboarding for the Vilnius Office Token.', author: 'Andrius Mažulis', time: '10 min · Feb 14' },
  { e: '📊', cat: 'Market Analysis', title: 'Q4 2025 tokenized bond market report: yield compression and new entrants',                         excerpt: 'Our quarterly analysis of the EU tokenized fixed-income market, covering 47 active issuances across six DLT platforms.',              author: 'Research Team',   time: '15 min · Jan 31' },
  { e: '⛓️', cat: 'Technology',      title: 'Why we chose an EVM-compatible chain for tokenized assets (and what we\'d do differently)',    excerpt: 'Our CTO shares the architecture decisions behind our settlement layer, including tradeoffs on chain selection and gas abstraction.',   author: 'Elena Vaitkutė',  time: '11 min · Jan 15' },
  { e: '🪙', cat: 'Product',         title: 'NXT Token: utility, governance rights, and staking mechanics explained',                           excerpt: 'A full explainer of the NXT platform token — how it reduces trading fees, grants governance votes, and accrues platform revenue.',  author: 'Product Team',    time: '7 min · Jan 8'   },
  { e: '🌍', cat: 'Regulation',      title: 'Investing from outside the EU: what MiCA means for global access to tokenized digital assets',        excerpt: 'MiCA is an EU regulation — but its passporting regime and third-country rules have major implications for non-EU investors.',        author: 'Compliance Team', time: '9 min · Dec 19'  },
]

const API_SIDEBAR = [
  { label: 'Getting Started', links: [{ id:'intro', text:'Introduction' },{ id:'auth', text:'Authentication' },{ id:'errors', text:'Error Handling' },{ id:'rate', text:'Rate Limits' }] },
  { label: 'Markets',         links: [{ id:'markets', text:'List Markets' },{ id:'ticker', text:'Ticker' },{ id:'orderbook', text:'Order Book' },{ id:'trades', text:'Recent Trades' }] },
  { label: 'Trading',         links: [{ id:'orders', text:'Place Order' },{ id:'cancel', text:'Cancel Order' },{ id:'history', text:'Order History' }] },
  { label: 'Assets',          links: [{ id:'assets', text:'List Assets' },{ id:'detail', text:'Asset Detail' },{ id:'tokenize', text:'Tokenize Asset' }] },
  { label: 'Account',         links: [{ id:'balance', text:'Balance' },{ id:'portfolio', text:'Portfolio' },{ id:'kyc', text:'KYC Status' }] },
]

// ── SHARED COMPONENTS ─────────────────────────────────────────

function Nav({ active, setPage }) {
  const tabs = ['about', 'careers', 'press', 'blog', 'api']
  const labels = { about:'About', careers:'Careers', press:'Press', blog:'Blog', api:'API Docs' }
  return (
    <nav className="c-nav">
      <div className="c-nav-logo" onClick={() => setPage('about')}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <polygon points="11,2 20,7 20,15 11,20 2,15 2,7" stroke="#38bd82" strokeWidth="1.5" fill="rgba(56,189,130,0.1)"/>
          <circle cx="11" cy="11" r="3" fill="#38bd82"/>
        </svg>
        NXT <span style={{color:'#38bd82'}}>NEXTOKEN</span>
      </div>
      <div className="c-nav-links">
        {tabs.map(t => (
          <button key={t} className={`c-nav-link ${active===t?'active':''}`} onClick={() => setPage(t)}>
            {labels[t]}
          </button>
        ))}
      </div>
      <button className="c-nav-cta">Open Exchange →</button>
    </nav>
  )
}

function Footer({ setPage }) {
  return (
    <>
      <footer className="c-footer">
        <div className="c-footer-brand">
          <h3>NXT NEXTOKEN</h3>
          <p style={{fontSize:'.8rem',color:'#7a8599',maxWidth:'260px'}}>The compliant infrastructure for tokenized real-world assets. Supervised by the Lithuanian authorities.</p>
        </div>
        <div className="c-footer-col"><h4>Products</h4><a>Exchange</a><a>Bonds</a><a>Equity & IPO</a><a>Tokenize</a></div>
        <div className="c-footer-col"><h4>Company</h4>
          {['about','careers','press','blog'].map(p => (
            <a key={p} onClick={() => setPage(p)} style={{cursor:'pointer',textTransform:'capitalize'}}>{p === 'about' ? 'About Us' : p.charAt(0).toUpperCase()+p.slice(1)}</a>
          ))}
        </div>
        <div className="c-footer-col"><h4>Legal</h4><a>Terms of Service</a><a>Privacy Policy</a><a>Risk Disclosure</a><a>AML Policy</a></div>
        <div className="c-footer-col"><h4>Support</h4><a>Help Center</a><a>Contact Us</a><a onClick={() => setPage('api')} style={{cursor:'pointer'}}>API Docs</a><a>Status</a></div>
      </footer>
      <div className="c-footer-btm">
        <p style={{fontSize:'.75rem',color:'rgba(255,255,255,0.35)',margin:0}}>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
        <p style={{fontSize:'.75rem',color:'rgba(255,255,255,0.35)',margin:0}}>Risk warning: Investing in tokenized assets involves risk. Past performance is not indicative of future results.</p>
      </div>
    </>
  )
}

// ── PAGE: ABOUT ───────────────────────────────────────────────

function AboutPage() {
  return (
    <main style={{paddingTop:'64px',minHeight:'100vh',background:'#060810',color:'#e8edf5'}}>
      <div className="c-hero">
        <div className="c-wrap">
          <div className="c-eyebrow">About Nextoken Capital</div>
          <h1 className="c-h1">Building the regulated<br/>infrastructure for <span className="c-accent">tokenized markets</span></h1>
          <p style={{fontSize:'clamp(1rem,1.6vw,1.18rem)',color:'#e8edf5',fontWeight:300,lineHeight:1.8,maxWidth:'680px',margin:0}}>
            Nextoken Capital UAB is a regulated financial technology company headquartered in Vilnius, Lithuania. We exist to bridge the $300 trillion global asset market with blockchain-native infrastructure — compliantly, openly, and at scale.
          </p>
        </div>
      </div>

      <div className="c-wrap">
        <div className="c-section">
          <div className="c-stat-strip">
            {STATS.map(s => (
              <div key={s.label} className="c-stat-cell">
                <div className="c-stat-num">{s.num}</div>
                <div className="c-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="c-g2" style={{gap:'48px',alignItems:'start'}}>
            <div>
              <div className="c-eyebrow">Our Mission</div>
              <h2 className="c-h2">Capital markets shouldn't have gatekeepers</h2>
              <p className="c-p">Today, access to real estate bonds, pre-IPO equity, and institutional-grade fixed income is limited to a small fraction of the global population — blocked by geography, minimum purchase thresholds, and legacy intermediaries.</p>
              <p className="c-p">Nextoken Capital was built to fix that. By combining distributed ledger technology with a full EU regulatory stack, we enable any issuer to raise capital on-chain and any investor — anywhere in the world — to access it compliantly.</p>
              <p className="c-p" style={{marginBottom:0}}>We believe the future of capital markets is programmable, borderless, and always-on. We're building it now.</p>
            </div>
            <div>
              <div className="c-eyebrow">Our Story</div>
              <h2 className="c-h2">From Vilnius to 190 countries</h2>
              <div className="c-tl">
                {TIMELINE.map(t => (
                  <div key={t.year} className="c-tl-item">
                    <div className="c-tl-year">{t.year}</div>
                    <h3 className="c-h3">{t.title}</h3>
                    <p className="c-p" style={{marginBottom:0,fontSize:'.85rem'}}>{t.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="c-section">
          <div className="c-eyebrow">Leadership</div>
          <h2 className="c-h2">The team behind the platform</h2>
          <p className="c-p" style={{marginBottom:'40px'}}>Our leadership team brings together decades of experience across traditional capital markets, blockchain infrastructure, and EU financial regulation.</p>
          <div className="c-g4">
            {TEAM.map(m => (
              <div key={m.name} className="c-card c-team-card">
                <div className="c-avatar">{m.i}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:'4px'}}>{m.name}</div>
                <div className="c-team-role">{m.role}</div>
                <div className="c-team-bio">{m.bio}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="c-section">
          <div className="c-eyebrow">Regulation</div>
          <h2 className="c-h2">Fully licensed. Fully transparent.</h2>
          <p className="c-p">Nextoken Capital operates under multiple layers of EU financial regulation. Our licenses are publicly verifiable through official registries.</p>
          <div className="c-reg-strip">
            {LICENSES.map(l => (
              <div key={l.title} className="c-reg-card">
                <div style={{fontSize:'1.8rem'}}>{l.flag}</div>
                <h4 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'.95rem'}}>{l.title}</h4>
                <p style={{fontSize:'.8rem',color:'#7a8599',margin:0}}>{l.desc}</p>
                <span className="c-reg-id">{l.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// ── PAGE: CAREERS ─────────────────────────────────────────────

function CareersPage() {
  return (
    <main style={{paddingTop:'64px',minHeight:'100vh',background:'#060810',color:'#e8edf5'}}>
      <div className="c-hero">
        <div className="c-wrap">
          <div className="c-eyebrow">Careers at Nextoken</div>
          <h1 className="c-h1">Build the future of<br/><span className="c-accent">capital markets</span></h1>
          <p style={{maxWidth:'560px',fontSize:'1.02rem',color:'#7a8599',margin:0}}>We're a team of engineers, financiers, and regulatory experts reimagining how capital flows globally. Join us from Vilnius or anywhere in the world.</p>
        </div>
      </div>

      <div className="c-wrap">
        <div className="c-section">
          <div className="c-eyebrow">Open Positions</div>
          <h2 className="c-h2">{JOBS.length} roles across 5 teams</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'12px',marginTop:'32px'}}>
            {JOBS.map(j => (
              <div key={j.title} className="c-job">
                <div>
                  <div className="c-job-dept">{j.dept}</div>
                  <div className="c-job-title">{j.title}</div>
                  <div className="c-job-meta">
                    {j.tags.map((t,i) => <span key={t} className={`c-pill${i===0&&j.r?' c-pill-r':''}`}>{t}</span>)}
                  </div>
                </div>
                <span className="c-apply">Apply →</span>
              </div>
            ))}
          </div>
        </div>

        <div className="c-section">
          <div className="c-eyebrow">Why Nextoken</div>
          <h2 className="c-h2">What we offer</h2>
          <div className="c-perks">
            {PERKS.map(p => (
              <div key={p.title} className="c-perk">
                <div className="c-perk-icon">{p.icon}</div>
                <div className="c-perk-title">{p.title}</div>
                <div className="c-perk-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="c-section">
          <div className="c-kit-box">
            <div>
              <h2 className="c-h2">Don't see your role?</h2>
              <p className="c-p" style={{maxWidth:'480px',marginBottom:0}}>We're always looking for exceptional people passionate about regulated DeFi and capital markets infrastructure. Send us your CV and we'll reach out when a match opens.</p>
            </div>
            <button className="c-btn-out">Send Open Application →</button>
          </div>
        </div>
      </div>
    </main>
  )
}

// ── PAGE: PRESS ───────────────────────────────────────────────

function PressPage() {
  return (
    <main style={{paddingTop:'64px',minHeight:'100vh',background:'#060810',color:'#e8edf5'}}>
      <div className="c-hero">
        <div className="c-wrap">
          <div className="c-eyebrow">Press & Media</div>
          <h1 className="c-h1">Nextoken Capital<br/>in the <span className="c-accent">news</span></h1>
          <p style={{fontSize:'1rem',color:'#7a8599',margin:0}}>Press inquiries: <span style={{color:'#38bd82'}}>press@nextokencapital.com</span> · Response within 4 business hours.</p>
        </div>
      </div>

      <div className="c-wrap">
        <div className="c-section">
          <div className="c-eyebrow">As Seen In</div>
          <div className="c-logos">
            {PRESS_LOGOS.map(l => <div key={l} className="c-logo">{l}</div>)}
          </div>

          <div className="c-eyebrow">Recent Coverage</div>
          <h2 className="c-h2" style={{marginBottom:'32px'}}>Latest Press Articles</h2>
          <div className="c-g3">
            {ARTICLES.map(a => (
              <div key={a.title} className="c-art">
                <div className="c-art-src">{a.src}<span className="c-art-date">{a.date}</span></div>
                <div className="c-art-title">{a.title}</div>
                <div className="c-art-desc">{a.desc}</div>
                <span className="c-read">Read article ↗</span>
              </div>
            ))}
          </div>
        </div>

        <div className="c-section">
          <div className="c-eyebrow">Key Announcements</div>
          <h2 className="c-h2" style={{marginBottom:'32px'}}>Official Press Releases</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {RELEASES.map(r => (
              <div key={r.title} className="c-card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'20px',padding:'20px 28px'}}>
                <div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:'.68rem',color:'rgba(255,255,255,0.35)',marginBottom:'6px'}}>{r.date}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'.98rem'}}>{r.title}</div>
                </div>
                <span className="c-read" style={{flexShrink:0}}>PDF ↗</span>
              </div>
            ))}
          </div>
        </div>

        <div className="c-section">
          <div className="c-kit-box">
            <div>
              <h2 className="c-h2">Press Kit & Brand Assets</h2>
              <p className="c-p" style={{maxWidth:'480px',marginBottom:0}}>Download our official press kit including logos, executive photos, company fact sheet, and approved brand guidelines. All assets are cleared for editorial use with attribution.</p>
            </div>
            <button className="c-btn-out">Download Press Kit →</button>
          </div>
        </div>
      </div>
    </main>
  )
}

// ── PAGE: BLOG ────────────────────────────────────────────────

function BlogPage() {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? POSTS : POSTS.filter(p => p.cat === cat)
  return (
    <main style={{paddingTop:'64px',minHeight:'100vh',background:'#060810',color:'#e8edf5'}}>
      <div className="c-hero">
        <div className="c-wrap">
          <div className="c-eyebrow">Nextoken Journal</div>
          <h1 className="c-h1">Insights on<br/><span className="c-accent">tokenized markets</span></h1>
          <p style={{maxWidth:'500px',fontSize:'1rem',color:'#7a8599',margin:0}}>Research, regulatory analysis, and product updates from the Nextoken Capital team.</p>
        </div>
      </div>

      <div className="c-wrap">
        <div className="c-section">
          <div className="c-featured">
            <div className="c-feat-badge">⭐ Featured</div>
            <div className="c-feat-title">MiCA one year on: what compliant tokenization actually looks like in practice</div>
            <p style={{maxWidth:'620px',fontSize:'.9rem',color:'#7a8599',margin:0}}>Twelve months since the first MiCA CASP licenses were issued, we look at what compliance really required, what surprised us, and what it means for issuers entering the EU capital market.</p>
            <div className="c-post-meta">
              <div className="c-author-chip">
                <div className="c-author-dot">JK</div>
                <div>
                  <div style={{fontSize:'.82rem',color:'#e8edf5'}}>Jonas Kazlauskas</div>
                  <div style={{fontSize:'.72rem',color:'rgba(255,255,255,0.35)',fontFamily:"'DM Mono',monospace"}}>Head of Compliance</div>
                </div>
              </div>
              <span style={{fontSize:'.78rem',color:'rgba(255,255,255,0.35)',fontFamily:"'DM Mono',monospace"}}>March 12, 2026</span>
              <span style={{fontSize:'.78rem',color:'rgba(255,255,255,0.35)'}}>12 min read</span>
              <span className="c-read">Read →</span>
            </div>
          </div>

          <div className="c-cats">
            {BLOG_CATS.map(c => (
              <button key={c} className={`c-cat ${cat===c?'active':''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>

          <div className="c-g3">
            {filtered.map(p => (
              <div key={p.title} className="c-blog-card">
                <div className="c-blog-thumb">{p.e}</div>
                <div className="c-blog-body">
                  <div className="c-blog-cat">{p.cat}</div>
                  <div className="c-blog-title">{p.title}</div>
                  <div className="c-blog-excerpt">{p.excerpt}</div>
                  <div className="c-blog-footer">
                    <span style={{fontSize:'.75rem',color:'rgba(255,255,255,0.35)'}}>{p.author}</span>
                    <span style={{fontSize:'.72rem',color:'rgba(255,255,255,0.35)',fontFamily:"'DM Mono',monospace"}}>{p.time}</span>
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

// ── PAGE: API DOCS ────────────────────────────────────────────

function ApiDocsPage() {
  const [active, setActive] = useState('intro')
  return (
    <div style={{paddingTop:'64px',background:'#060810',color:'#e8edf5'}}>
      <div className="c-docs">
        <div className="c-sidebar">
          {API_SIDEBAR.map(s => (
            <div key={s.label} className="c-sb-sec">
              <div className="c-sb-lbl">{s.label}</div>
              {s.links.map(l => (
                <a key={l.id} className={`c-sb-link ${active===l.id?'active':''}`} href={`#${l.id}`} onClick={() => setActive(l.id)}>{l.text}</a>
              ))}
            </div>
          ))}
        </div>

        <div className="c-docs-body">
          <div className="c-eyebrow">Developer Reference</div>
          <h1 id="intro" style={{fontFamily:"'Syne',sans-serif",fontSize:'2rem',fontWeight:800,marginBottom:'12px'}}>Nextoken API <span className="c-accent">v2</span></h1>
          <p className="c-p">The Nextoken Capital REST API gives you programmatic access to markets, trading, asset tokenization, and account management. All endpoints are served over HTTPS and return JSON.</p>
          <span className="c-tag">Base URL</span>
          <pre className="c-pre" style={{marginTop:'10px'}}>https://api.nextokencapital.com/v2</pre>

          <hr id="auth" className="c-divider" style={{border:'none',borderTop:'1px solid rgba(255,255,255,0.07)',marginTop:'48px'}}/>
          <h2 className="c-h2">Authentication</h2>
          <p className="c-p">All API requests require an API key in the request header. Generate your key from <strong style={{color:'#e8edf5'}}>Account → API Keys</strong>.</p>
          <div className="c-alert-i"><div className="c-alert-title">🔒 Keep your API key secret</div>Never expose it in client-side code or public repositories. Use environment variables.</div>
          <pre className="c-pre">{`curl https://api.nextokencapital.com/v2/markets \\
  -H "X-API-Key: nxt_live_your_key_here" \\
  -H "Content-Type: application/json"`}</pre>

          <hr id="errors" className="c-divider" style={{border:'none',borderTop:'1px solid rgba(255,255,255,0.07)',marginTop:'48px'}}/>
          <h2 className="c-h2">Error Handling</h2>
          <p className="c-p">All error responses include a JSON body with a machine-readable <code style={{fontFamily:"'DM Mono',monospace"}}>code</code> and human-readable <code style={{fontFamily:"'DM Mono',monospace"}}>message</code>.</p>
          <pre className="c-pre">{`{
  "error": {
    "code":    "INSUFFICIENT_BALANCE",
    "message": "Your EUR balance is too low to place this order.",
    "status":  422
  }
}`}</pre>

          <hr id="rate" className="c-divider" style={{border:'none',borderTop:'1px solid rgba(255,255,255,0.07)',marginTop:'48px'}}/>
          <h2 className="c-h2">Rate Limits</h2>
          <table className="c-rtable">
            <thead><tr><th>Tier</th><th>Requests / min</th><th>Orders / min</th><th>WebSocket</th></tr></thead>
            <tbody>
              {[['Free','60','10','2'],['Standard','300','60','10'],['Professional','1,200','300','50'],['Institutional','Unlimited','Unlimited','Unlimited']].map(([tier,...vals]) => (
                <tr key={tier}><td style={{color:'#38bd82',fontFamily:"'DM Mono',monospace",fontSize:'.82rem'}}>{tier}</td>{vals.map(v=><td key={v}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>

          <hr id="markets" className="c-divider" style={{border:'none',borderTop:'1px solid rgba(255,255,255,0.07)',marginTop:'48px'}}/>
          <h2 className="c-h2">Markets</h2>
          <h3 className="c-h3">GET /markets</h3>
          <div className="c-endpoint"><span className={`c-method c-get`}>GET</span><span className="c-ep-path">/markets</span><span className="c-ep-desc">List all trading pairs</span></div>
          <pre className="c-pre">{`{
  "markets": [
    {
      "pair":   "BTC/EUR",
      "status": "active",
      "min_order": 10.00
    }
  ]
}`}</pre>

          <hr id="orders" className="c-divider" style={{border:'none',borderTop:'1px solid rgba(255,255,255,0.07)',marginTop:'48px'}}/>
          <h2 className="c-h2">Place Order</h2>
          <div className="c-endpoint"><span className={`c-method c-post`}>POST</span><span className="c-ep-path">/orders</span><span className="c-ep-desc">Place a new order</span></div>
          <div className="c-alert-w"><div className="c-alert-title">⚠️ KYC Required</div>Your account must complete Level 2 KYC verification before placing orders.</div>
          <table className="c-ptable">
            <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
              {[
                ['pair','string',true,'Trading pair e.g. BTC-EUR'],
                ['side','enum',true,'buy or sell'],
                ['type','enum',true,'market, limit, or stop_limit'],
                ['amount','number',true,'Base currency amount'],
                ['price','number',false,'Limit price (required for limit orders)'],
                ['client_id','string',false,'Your reference ID (max 64 chars)'],
              ].map(([f,t,r,d]) => (
                <tr key={f}><td>{f}</td><td><span className="c-type">{t}</span></td><td>{r?<span className="c-req">required</span>:<span className="c-opt">optional</span>}</td><td>{d}</td></tr>
              ))}
            </tbody>
          </table>
          <pre className="c-pre">{`// Request
{
  "pair":   "BTC-EUR",
  "side":   "buy",
  "type":   "limit",
  "amount": 0.05,
  "price":  61500.00
}
// Response
{
  "order_id": "ord_9f3k2m1x",
  "status":   "open",
  "filled":   0
}`}</pre>

          <hr id="tokenize" className="c-divider" style={{border:'none',borderTop:'1px solid rgba(255,255,255,0.07)',marginTop:'48px'}}/>
          <h2 className="c-h2">Tokenize an Asset</h2>
          <div className="c-endpoint"><span className={`c-method c-post`}>POST</span><span className="c-ep-path">/assets/tokenize</span><span className="c-ep-desc">Submit a tokenization request</span></div>
          <pre className="c-pre">{`// Request
{
  "asset_type":   "real_estate",
  "name":         "Vilnius Office Block A",
  "total_value":  2400000,
  "token_supply": 847,
  "yield_rate":   4.8,
  "documents":    ["upl_a1b2c3", "upl_d4e5f6"]
}
// Response
{
  "issuance_id": "iss_7g8h9i0j",
  "status":      "pending_review",
  "review_eta":  "48h"
}`}</pre>

          <div className="c-alert-i" style={{marginTop:'48px'}}>
            <div className="c-alert-title">📬 Need help?</div>
            Developer support: <strong>api-support@nextokencapital.com</strong>. For institutional integrations and custom rate limits, contact your account manager.
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MAIN EXPORT ───────────────────────────────────────────────

export default function CompanyPage() {
  const [page, setPage] = useState('about')

  const pages = { about: <AboutPage />, careers: <CareersPage />, press: <PressPage />, blog: <BlogPage />, api: <ApiDocsPage /> }

  const handleSetPage = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Head>
        <title>Nextoken Capital — Company</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      </Head>

      <Nav active={page} setPage={handleSetPage} />
      {pages[page]}
      {page !== 'api' && <Footer setPage={handleSetPage} />}
    </>
  )
}