const fs = require("fs");

// ── NAVBAR ────────────────────────────────────────────────────────────────────
fs.mkdirSync("components", { recursive: true });
fs.writeFileSync("components/Navbar.js", `
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [router.asPath]);

  const links = [
    { href: "/markets",    label: "Markets" },
    { href: "/exchange",   label: "Exchange" },
    { href: "/bonds",      label: "Bonds" },
    { href: "/equity-ipo", label: "Equity & IPO" },
    { href: "/tokenize",   label: "Tokenize" },
  ];

  const isActive = (href) => router.asPath === href;

  return (
    <>
      <style>{\`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: \${scrolled ? "rgba(11,14,17,0.97)" : "rgba(11,14,17,0.85)"};
          backdrop-filter: blur(12px);
          border-bottom: 1px solid \${scrolled ? "rgba(240,185,11,0.15)" : "rgba(255,255,255,0.05)"};
          transition: all 0.3s ease;
        }
        .navbar-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 20px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo-nxt {
          font-size: 20px; font-weight: 900; color: #F0B90B;
          letter-spacing: -0.5px;
        }
        .logo-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.15); }
        .logo-text { display: flex; flex-direction: column; line-height: 1; }
        .logo-text span:first-child { font-size: 11px; font-weight: 800; color: #fff; letter-spacing: 2px; }
        .logo-text span:last-child { font-size: 9px; color: rgba(255,255,255,0.4); letter-spacing: 3px; }
        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link {
          padding: 6px 14px; border-radius: 6px;
          font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7);
          text-decoration: none; transition: all 0.15s;
        }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .nav-link.active { color: #F0B90B; background: rgba(240,185,11,0.08); }
        .nav-right { display: flex; align-items: center; gap: 10px; }
        .btn-login {
          padding: 7px 16px; border-radius: 6px;
          font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8);
          background: transparent; border: 1px solid rgba(255,255,255,0.15);
          cursor: pointer; text-decoration: none; transition: all 0.15s;
        }
        .btn-login:hover { border-color: rgba(255,255,255,0.35); color: #fff; }
        .btn-register {
          padding: 7px 16px; border-radius: 6px;
          font-size: 13px; font-weight: 700; color: #000;
cd "/d/New folder/nextoken-capital" && cat > create-all-pages.js << 'SCRIPTEOF'
const fs = require("fs");

// ── NAVBAR ────────────────────────────────────────────────────────────────────
fs.mkdirSync("components", { recursive: true });
fs.writeFileSync("components/Navbar.js", `
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [router.asPath]);

  const links = [
    { href: "/markets",    label: "Markets" },
    { href: "/exchange",   label: "Exchange" },
    { href: "/bonds",      label: "Bonds" },
    { href: "/equity-ipo", label: "Equity & IPO" },
    { href: "/tokenize",   label: "Tokenize" },
  ];

  const isActive = (href) => router.asPath === href;

  return (
    <>
      <style>{\`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: \${scrolled ? "rgba(11,14,17,0.97)" : "rgba(11,14,17,0.85)"};
          backdrop-filter: blur(12px);
          border-bottom: 1px solid \${scrolled ? "rgba(240,185,11,0.15)" : "rgba(255,255,255,0.05)"};
          transition: all 0.3s ease;
        }
        .navbar-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 20px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo-nxt {
          font-size: 20px; font-weight: 900; color: #F0B90B;
          letter-spacing: -0.5px;
        }
        .logo-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.15); }
        .logo-text { display: flex; flex-direction: column; line-height: 1; }
        .logo-text span:first-child { font-size: 11px; font-weight: 800; color: #fff; letter-spacing: 2px; }
        .logo-text span:last-child { font-size: 9px; color: rgba(255,255,255,0.4); letter-spacing: 3px; }
        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link {
          padding: 6px 14px; border-radius: 6px;
          font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7);
          text-decoration: none; transition: all 0.15s;
        }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .nav-link.active { color: #F0B90B; background: rgba(240,185,11,0.08); }
        .nav-right { display: flex; align-items: center; gap: 10px; }
        .btn-login {
          padding: 7px 16px; border-radius: 6px;
          font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8);
          background: transparent; border: 1px solid rgba(255,255,255,0.15);
          cursor: pointer; text-decoration: none; transition: all 0.15s;
        }
        .btn-login:hover { border-color: rgba(255,255,255,0.35); color: #fff; }
        .btn-register {
          padding: 7px 16px; border-radius: 6px;
          font-size: 13px; font-weight: 700; color: #000;
          background: #F0B90B; border: none;
          cursor: pointer; text-decoration: none; transition: all 0.15s;
        }
        .btn-register:hover { background: #FFD000; }
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 4px;
        }
        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: #fff; border-radius: 2px; transition: all 0.3s;
        }
        .mobile-menu {
          display: none; position: fixed; inset: 0; top: 64px;
          background: rgba(11,14,17,0.98); backdrop-filter: blur(20px);
          padding: 24px 20px; overflow-y: auto; z-index: 999;
        }
        .mobile-menu.open { display: flex; flex-direction: column; gap: 6px; }
        .mobile-link {
          display: block; padding: 14px 16px; border-radius: 8px;
          font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.8);
          text-decoration: none; border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.15s;
        }
        .mobile-link:hover, .mobile-link.active {
          color: #F0B90B; background: rgba(240,185,11,0.08);
          border-color: rgba(240,185,11,0.2);
        }
        .mobile-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 10px 0; }
        .mobile-btn {
          display: block; padding: 14px; border-radius: 8px;
          font-size: 15px; font-weight: 700; text-align: center;
          text-decoration: none; cursor: pointer; border: none;
        }
        @media (max-width: 768px) {
          .nav-links, .btn-login, .btn-register { display: none !important; }
          .hamburger { display: flex !important; }
        }
      \`}</style>

      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            <span className="logo-nxt">NXT</span>
            <div className="logo-divider" />
            <div className="logo-text">
              <span>NEXTOKEN</span>
              <span>CAPITAL</span>
            </div>
          </Link>

          <div className="nav-links">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={\`nav-link \${isActive(l.href) ? "active" : ""}\`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="nav-right">
            <Link href="/login" className="btn-login">Log In</Link>
            <Link href="/register" className="btn-register">Get Started</Link>
            <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
              <span style={{ transform: open ? "rotate(45deg) translate(5px,5px)" : "none" }} />
              <span style={{ opacity: open ? 0 : 1 }} />
              <span style={{ transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      <div className={\`mobile-menu \${open ? "open" : ""}\`}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={\`mobile-link \${isActive(l.href) ? "active" : ""}\`}>
            {l.label}
          </Link>
        ))}
        <div className="mobile-divider" />
        <Link href="/login" className="mobile-btn" style={{ background: "rgba(255,255,255,0.06)", color: "#fff", marginBottom: 8 }}>Log In</Link>
        <Link href="/register" className="mobile-btn" style={{ background: "#F0B90B", color: "#000" }}>Get Started — Free</Link>
      </div>
    </>
  );
}
`);
console.log("✅ components/Navbar.js");

// ── FOOTER ────────────────────────────────────────────────────────────────────
fs.writeFileSync("components/Footer.js", `
import Link from "next/link";

export default function Footer() {
  const cols = [
    { title: "PRODUCTS", links: [
      { href: "/markets",    label: "Markets" },
      { href: "/exchange",   label: "Exchange" },
      { href: "/bonds",      label: "Bonds" },
      { href: "/equity-ipo", label: "Equity & IPO" },
      { href: "/tokenize",   label: "Tokenize" },
    ]},
    { title: "COMPANY", links: [
      { href: "/about",    label: "About Us" },
      { href: "/careers",  label: "Careers" },
      { href: "/press",    label: "Press" },
      { href: "/blog",     label: "Blog" },
    ]},
    { title: "LEGAL", links: [
      { href: "/terms",   label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/risk",    label: "Risk Disclosure" },
      { href: "/aml",     label: "AML Policy" },
    ]},
    { title: "SUPPORT", links: [
      { href: "/help",    label: "Help Center" },
      { href: "/contact", label: "Contact Us" },
      { href: "/api",     label: "API Docs" },
      { href: "/status",  label: "Status" },
    ]},
  ];

  return (
    <>
      <style>{\`
        .footer { background: #05060a; border-top: 1px solid rgba(255,255,255,0.07); padding: 56px 20px 32px; font-family: 'DM Sans', sans-serif; }
        .footer-inner { max-width: 1280px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 1.5fr repeat(4, 1fr); gap: 48px; margin-bottom: 48px; }
        .footer-brand p { color: rgba(255,255,255,0.4); font-size: 13px; line-height: 1.7; margin: 12px 0 20px; max-width: 220px; }
        .footer-logo { display: flex; align-items: center; gap: 10px; }
        .footer-logo-nxt { font-size: 20px; font-weight: 900; color: #F0B90B; }
        .footer-logo-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.15); }
        .footer-logo-text { display: flex; flex-direction: column; line-height: 1; }
        .footer-logo-text span:first-child { font-size: 11px; font-weight: 800; color: #fff; letter-spacing: 2px; }
        .footer-logo-text span:last-child { font-size: 9px; color: rgba(255,255,255,0.4); letter-spacing: 3px; }
        .footer-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; background: rgba(240,185,11,0.06); border: 1px solid rgba(240,185,11,0.2); border-radius: 8px; }
        .footer-badge span { font-size: 11px; color: rgba(255,255,255,0.5); }
        .footer-badge strong { font-size: 11px; color: #F0B90B; display: block; }
        .footer-col-title { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; }
        .footer-col a { display: block; font-size: 13px; color: rgba(255,255,255,0.55); text-decoration: none; margin-bottom: 10px; transition: color 0.15s; }
        .footer-col a:hover { color: #fff; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .footer-bottom p { font-size: 12px; color: rgba(255,255,255,0.3); }
        .footer-risk { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 20px; line-height: 1.7; }
        @media (max-width: 900px) {
          .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-top { grid-template-columns: 1fr 1fr; gap: 24px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      \`}</style>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="footer-logo-nxt">NXT</span>
                <div className="footer-logo-divider" />
                <div className="footer-logo-text">
                  <span>NEXTOKEN</span>
                  <span>CAPITAL</span>
                </div>
              </div>
              <p>The regulated infrastructure for tokenized real-world assets.</p>
              <div className="footer-badge">
                <span>🏛️</span>
                <div>
                  <span>MONITORED BY</span>
                  <strong>Bank of Lithuania</strong>
                </div>
              </div>
            </div>
            {cols.map((col) => (
              <div key={col.title} className="footer-col">
                <div className="footer-col-title">{col.title}</div>
                {col.links.map((l) => (
                  <Link key={l.href} href={l.href}>{l.label}</Link>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <p>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
          </div>
          <p className="footer-risk">Risk warning: Investing in tokenized assets involves risk. Past performance is not indicative of future results. Capital at risk.</p>
        </div>
      </footer>
    </>
  );
}
`);
console.log("✅ components/Footer.js");

// ── HOMEPAGE ──────────────────────────────────────────────────────────────────
fs.writeFileSync("pages/index.js", `
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TRUST = [
  { icon: "🏛️", label: "Bank of Lithuania" },
  { icon: "⚖️", label: "MiCA Compliant" },
  { icon: "🔗", label: "ERC-3643" },
  { icon: "🛡️", label: "ISO 27001" },
  { icon: "🪪", label: "Sumsub KYC" },
  { icon: "🌐", label: "FATF Aligned" },
];

const STATS = [
  { value: "EUR 140M+", label: "Assets Tokenized" },
  { value: "12,400+",   label: "Verified Investors" },
  { value: "180+",      label: "Countries" },
  { value: "EUR 100",   label: "Min. Investment" },
];

const FEATURES = [
  { icon: "🏢", title: "Real Estate",    desc: "Fractional ownership of commercial and residential property across Europe." },
  { icon: "📄", title: "Bonds",          desc: "Fixed-income digital securities with transparent lifecycle management." },
  { icon: "📈", title: "Equity & IPO",   desc: "Private and public company shares via compliant token issuance." },
  { icon: "⚡", title: "Energy",         desc: "Renewable energy projects open to retail and institutional investors." },
  { icon: "🏦", title: "Funds",          desc: "Tokenized alternative investment fund units with defined access rules." },
  { icon: "💎", title: "Commodities",    desc: "Asset-backed token structures with transparent supply and pricing." },
];

const STEPS = [
  { n: "01", title: "Create Account",      desc: "Register in minutes with email or wallet. KYC powered by Sumsub." },
  { n: "02", title: "Browse Opportunities",desc: "Filter by asset class, risk level, return, and investment term." },
  { n: "03", title: "Invest from EUR 100", desc: "Purchase tokens representing fractional ownership of real assets." },
  { n: "04", title: "Earn & Trade",        desc: "Receive returns and trade on the secondary market exchange." },
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Nextoken Capital — Tokenized Real-World Assets</title>
        <meta name="description" content="The regulated infrastructure for tokenized real-world assets. Invest in bonds, equity, real estate and energy from EUR 100." />
      </Head>
      <Navbar />

      <style>{\`
        * { box-sizing: border-box; }
        body { margin: 0; background: #0B0E11; color: #fff; font-family: 'DM Sans', 'Inter', system-ui, sans-serif; }

        /* HERO */
        .hero {
          min-height: 100svh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center;
          padding: 100px 20px 60px;
          position: relative; overflow: hidden;
          background: #0B0E11;
        }
        .hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 70% 55% at 50% 45%, rgba(240,185,11,0.07), transparent);
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 18px; border-radius: 999px;
          border: 1px solid rgba(240,185,11,0.3);
          background: rgba(240,185,11,0.06);
          color: #F0B90B; font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 28px; white-space: nowrap;
        }
        .hero-badge span { width: 6px; height: 6px; border-radius: 50%; background: #F0B90B; animation: blink 2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .hero h1 {
          font-size: clamp(2.2rem, 6vw, 5rem);
          font-weight: 900; line-height: 1.05;
          letter-spacing: -1.5px; margin: 0 0 24px;
          max-width: 820px;
        }
        .hero h1 em { color: #F0B90B; font-style: normal; }
        .hero p {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: rgba(255,255,255,0.55); line-height: 1.8;
          max-width: 560px; margin: 0 0 40px;
        }
        .hero-btns {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
          width: 100%; max-width: 420px; margin: 0 auto 48px;
        }
        .btn-primary {
          flex: 1; min-width: 180px;
          padding: 14px 28px; border-radius: 8px;
          background: #F0B90B; color: #000;
          font-size: 14px; font-weight: 800;
          border: none; cursor: pointer; text-decoration: none;
          text-align: center; transition: background 0.15s;
        }
        .btn-primary:hover { background: #FFD000; }
        .btn-outline {
          flex: 1; min-width: 180px;
          padding: 14px 28px; border-radius: 8px;
          background: transparent; color: rgba(255,255,255,0.8);
          font-size: 14px; font-weight: 700;
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer; text-decoration: none;
          text-align: center; transition: all 0.15s;
        }
        .btn-outline:hover { border-color: rgba(255,255,255,0.5); color: #fff; }
        .trust-strip {
          display: flex; flex-wrap: wrap; gap: 20px 28px;
          justify-content: center; align-items: center;
        }
        .trust-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: rgba(255,255,255,0.4); }
        .trust-item span:first-child { font-size: 15px; }

        /* STATS */
        .stats { background: #0F1318; border-top: 1px solid rgba(255,255,255,0.07); border-bottom: 1px solid rgba(255,255,255,0.07); padding: 40px 20px; }
        .stats-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; text-align: center; }
        .stat-val { font-size: clamp(1.6rem,3vw,2.5rem); font-weight: 900; color: #F0B90B; line-height: 1; margin-bottom: 6px; letter-spacing: -1px; }
        .stat-lbl { font-size: 12px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; }

        /* FEATURES */
        .section { padding: 80px 20px; }
        .section-inner { max-width: 1280px; margin: 0 auto; }
        .section-tag { font-size: 11px; font-weight: 700; color: #F0B90B; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
        .section-title { font-size: clamp(1.6rem,3vw,2.4rem); font-weight: 900; color: #fff; margin-bottom: 12px; letter-spacing: -0.5px; }
        .section-sub { font-size: 14px; color: rgba(255,255,255,0.45); margin-bottom: 48px; line-height: 1.7; max-width: 480px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .feature-card {
          background: #0F1318; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 28px 24px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .feature-card:hover { border-color: rgba(240,185,11,0.25); transform: translateY(-2px); }
        .feature-icon { font-size: 28px; margin-bottom: 14px; }
        .feature-title { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 8px; }
        .feature-desc { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.7; }

        /* HOW IT WORKS */
        .how-bg { background: #0F1318; }
        .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
        .step-num { font-size: 3rem; font-weight: 900; color: rgba(240,185,11,0.2); line-height: 1; margin-bottom: 16px; }
        .step-title { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 8px; }
        .step-desc { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.7; }

        /* CTA */
        .cta-section {
          background: #F0B90B; padding: 72px 20px; text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-section h2 { font-size: clamp(1.8rem,4vw,3rem); font-weight: 900; color: #000; margin: 0 0 16px; letter-spacing: -1px; }
        .cta-section p { font-size: 15px; color: rgba(0,0,0,0.6); margin: 0 auto 36px; max-width: 440px; line-height: 1.7; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .cta-btn-dark { padding: 14px 32px; background: #000; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 800; cursor: pointer; text-decoration: none; transition: background 0.15s; }
        .cta-btn-dark:hover { background: #1a1a1a; }
        .cta-btn-outline { padding: 14px 32px; background: transparent; color: rgba(0,0,0,0.65); border: 1.5px solid rgba(0,0,0,0.2); border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; text-decoration: none; transition: all 0.15s; }
        .cta-btn-outline:hover { border-color: rgba(0,0,0,0.5); color: #000; }

        @media (max-width: 900px) {
          .stats-inner { grid-template-columns: repeat(2,1fr); }
          .grid-3 { grid-template-columns: repeat(2,1fr); }
          .grid-4 { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 480px) {
          .hero { padding: 90px 16px 48px; }
          .hero-badge { font-size: 10px; padding: 7px 14px; }
          .hero-btns { flex-direction: column; max-width: 100%; }
          .btn-primary, .btn-outline { min-width: unset; width: 100%; }
          .stats-inner { grid-template-columns: repeat(2,1fr); gap: 16px; }
          .stat-val { font-size: 1.6rem; }
          .grid-3, .grid-4 { grid-template-columns: 1fr; }
          .section { padding: 56px 16px; }
          .cta-btns { flex-direction: column; }
          .cta-btn-dark, .cta-btn-outline { width: 100%; text-align: center; }
        }
      \`}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge">
          <span />&nbsp;Regulated · MiCA Compliant · Bank of Lithuania
        </div>
        <h1>Connecting Investors,<br /><em>Opportunities,</em> and Financial Access</h1>
        <p>Nextoken Capital delivers regulated infrastructure for tokenized real-world assets — bonds, equity, real estate, and energy — open to investors in 180+ countries from as little as EUR 100.</p>
        <div className="hero-btns">
          <Link href="/markets" className="btn-primary">Explore Markets</Link>
          <Link href="/tokenize" className="btn-outline">Tokenize Assets</Link>
        </div>
        <div className="trust-strip">
          {TRUST.map((t) => (
            <div key={t.label} className="trust-item">
              <span>{t.icon}</span><span>{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats-inner">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="stat-val">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ASSET CLASSES */}
      <section className="section">
        <div className="section-inner">
          <div className="section-tag">Asset Classes</div>
          <h2 className="section-title">Invest Across Real-World Sectors</h2>
          <p className="section-sub">Every asset on the platform is reviewed, structured, and tokenized by our compliance team.</p>
          <div className="grid-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-bg">
        <div className="section-inner">
          <div className="section-tag">How It Works</div>
          <h2 className="section-title">Start Investing in 4 Steps</h2>
          <p className="section-sub">From account creation to earning returns — the whole journey in one platform.</p>
          <div className="grid-4">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to tokenize the world?</h2>
        <p>Join 12,400+ investors and issuers already on the platform.</p>
        <div className="cta-btns">
          <Link href="/register" className="cta-btn-dark">Create Free Account</Link>
          <Link href="/markets" className="cta-btn-outline">Browse Markets</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
`);
console.log("✅ pages/index.js");

// ── TOKENIZE PAGE ─────────────────────────────────────────────────────────────
fs.writeFileSync("pages/tokenize.js", `
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ASSET_TYPES = [
  { icon: "🏢", label: "Real Estate",    desc: "Commercial & residential" },
  { icon: "📄", label: "Bonds",          desc: "Corporate & government" },
  { icon: "📈", label: "Equity & IPO",   desc: "Private & public shares" },
  { icon: "⚡", label: "Energy",         desc: "Renewable energy projects" },
  { icon: "🏦", label: "Funds",          desc: "Alternative investment funds" },
  { icon: "💎", label: "Commodities",    desc: "Gold, silver & materials" },
];

const STEPS = [
  { n: "01", title: "Submit Asset",       desc: "Add valuation, ownership documents, financial data, and issuance preferences." },
  { n: "02", title: "Compliance Review",  desc: "Structure, eligibility rules, and documents are reviewed by our team." },
  { n: "03", title: "Token Issuance",     desc: "Digital issuance parameters are prepared and tokens minted on-chain." },
  { n: "04", title: "Investor Access",    desc: "Eligible investors can participate under defined transfer rules." },
  { n: "05", title: "Market Readiness",   desc: "Assets progress toward exchange and secondary market liquidity." },
];

const BENEFITS = [
  { stat: "€100",  label: "Minimum investment" },
  { stat: "180+",  label: "Countries of investors" },
  { stat: "48hr",  label: "Compliance review" },
  { stat: "0.2%",  label: "Trading fee" },
];

export default function TokenizePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    assetName: "", assetType: "Commercial Real Estate",
    totalValue: "", tokenSupply: "", tokenPrice: "",
    expectedReturn: "", minInvestment: "", deadline: "",
    description: "", tokenStandard: "ERC-3643",
    eligibility: "EU Verified Investors",
  });
  const [submitted, setSubmitted] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <>
      <Head>
        <title>Tokenize Real-World Assets — Nextoken Capital</title>
        <meta name="description" content="Launch compliant digital offerings for real estate, bonds, equity, and funds in 48 hours." />
      </Head>
      <Navbar />

      <style>{\`
        * { box-sizing: border-box; }
        body { margin: 0; background: #0B0E11; color: #fff; font-family: 'DM Sans','Inter',system-ui,sans-serif; }

        /* PAGE HERO — teal accent to distinguish from other pages */
        .t-hero {
          min-height: 80vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 120px 20px 72px;
          position: relative; overflow: hidden;
          background: linear-gradient(180deg, #060d10 0%, #0B0E11 100%);
        }
        .t-hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 65% 55% at 50% 40%, rgba(0,200,180,0.07), transparent);
        }
        .t-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 18px; border-radius: 999px;
          border: 1px solid rgba(0,200,180,0.3); background: rgba(0,200,180,0.06);
          color: #00C8B4; font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 28px;
        }
        .t-hero h1 {
          font-size: clamp(2rem,5.5vw,4.2rem); font-weight: 900;
          line-height: 1.06; letter-spacing: -1.5px; margin: 0 0 24px; max-width: 780px;
        }
        .t-hero h1 em { color: #00C8B4; font-style: normal; }
        .t-hero p { font-size: clamp(1rem,1.8vw,1.1rem); color: rgba(255,255,255,0.5); line-height: 1.8; max-width: 520px; margin: 0 0 40px; }
        .t-hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; width: 100%; max-width: 420px; margin: 0 auto; }
        .btn-teal { flex:1; min-width:180px; padding:14px 28px; border-radius:8px; background:#00C8B4; color:#000; font-size:14px; font-weight:800; border:none; cursor:pointer; text-decoration:none; text-align:center; transition:background 0.15s; }
        .btn-teal:hover { background:#00e0ca; }
        .btn-teal-outline { flex:1; min-width:180px; padding:14px 28px; border-radius:8px; background:transparent; color:rgba(255,255,255,0.8); font-size:14px; font-weight:700; border:1px solid rgba(0,200,180,0.3); cursor:pointer; text-decoration:none; text-align:center; transition:all 0.15s; }
        .btn-teal-outline:hover { border-color:rgba(0,200,180,0.7); color:#00C8B4; }

        /* STATS BAR */
        .t-stats { background:#0A1012; border-top:1px solid rgba(0,200,180,0.1); border-bottom:1px solid rgba(0,200,180,0.1); padding:36px 20px; }
        .t-stats-inner { max-width:1280px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:20px; text-align:center; }
        .t-stat-val { font-size:clamp(1.5rem,2.5vw,2.2rem); font-weight:900; color:#00C8B4; line-height:1; margin-bottom:6px; letter-spacing:-0.5px; }
        .t-stat-lbl { font-size:12px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:1px; }

        /* SECTIONS */
        .t-section { padding:72px 20px; }
        .t-section-alt { padding:72px 20px; background:#0A1012; }
        .t-inner { max-width:1280px; margin:0 auto; }
        .t-tag { font-size:11px; font-weight:700; color:#00C8B4; letter-spacing:2px; text-transform:uppercase; margin-bottom:12px; }
        .t-title { font-size:clamp(1.5rem,2.8vw,2.2rem); font-weight:900; color:#fff; margin-bottom:12px; letter-spacing:-0.5px; }
        .t-sub { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:40px; line-height:1.7; max-width:480px; }

        /* ASSET CARDS */
        .asset-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:12px; }
        .asset-card { background:#0F1318; border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:20px 14px; text-align:center; transition:all 0.2s; cursor:default; }
        .asset-card:hover { border-color:rgba(0,200,180,0.3); background:rgba(0,200,180,0.04); transform:translateY(-2px); }
        .asset-card-icon { font-size:26px; margin-bottom:10px; }
        .asset-card-label { font-size:13px; font-weight:700; color:#fff; margin-bottom:4px; }
        .asset-card-desc { font-size:11px; color:rgba(255,255,255,0.35); line-height:1.5; }

        /* STEPS */
        .steps-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; }
        .step-card { background:#0F1318; border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:24px 18px; border-top:2px solid #00C8B4; }
        .step-num { font-size:1.8rem; font-weight:900; color:rgba(0,200,180,0.3); line-height:1; margin-bottom:14px; }
        .step-title { font-size:14px; font-weight:800; color:#fff; margin-bottom:8px; }
        .step-desc { font-size:12px; color:rgba(255,255,255,0.4); line-height:1.7; }

        /* FORM */
        .form-layout { display:grid; grid-template-columns:1.3fr 0.7fr; gap:28px; align-items:start; }
        .form-card { background:#0F1318; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:32px; }
        .form-title { font-size:18px; font-weight:800; color:#fff; margin-bottom:6px; }
        .form-sub { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:28px; line-height:1.6; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .field { margin-bottom:16px; }
        .field label { display:block; font-size:11px; font-weight:700; color:rgba(255,255,255,0.5); letter-spacing:0.5px; text-transform:uppercase; margin-bottom:7px; }
        .field input, .field select, .field textarea {
          width:100%; background:#161A1E; color:#fff;
          border:1px solid rgba(255,255,255,0.1); border-radius:8px;
          padding:11px 14px; font-size:13px; outline:none;
          font-family:inherit; transition:border-color 0.15s;
        }
        .field input:focus, .field select:focus, .field textarea:focus { border-color:rgba(0,200,180,0.5); }
        .field textarea { resize:vertical; }
        .field select option { background:#161A1E; }
        .submit-btn { width:100%; padding:14px; background:#00C8B4; color:#000; font-size:14px; font-weight:800; border:none; border-radius:8px; cursor:pointer; font-family:inherit; transition:background 0.15s; margin-top:8px; }
        .submit-btn:hover { background:#00e0ca; }

        /* SUMMARY CARD */
        .summary-card { background:#161A1E; border:1px solid rgba(0,200,180,0.15); border-radius:16px; padding:24px; position:sticky; top:90px; }
        .summary-title { font-size:15px; font-weight:800; color:#fff; margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.07); }
        .summary-row { display:flex; justify-content:space-between; gap:12px; margin-bottom:12px; }
        .summary-row span:first-child { font-size:12px; color:rgba(255,255,255,0.4); }
        .summary-row span:last-child { font-size:12px; color:#fff; font-weight:600; text-align:right; }
        .summary-divider { height:1px; background:rgba(255,255,255,0.07); margin:16px 0; }
        .summary-why { font-size:11px; font-weight:700; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
        .summary-bullet { font-size:12px; color:rgba(255,255,255,0.4); margin-bottom:8px; display:flex; align-items:flex-start; gap:6px; }
        .summary-bullet::before { content:"→"; color:#00C8B4; flex-shrink:0; }

        /* SUCCESS */
        .success-box { text-align:center; padding:60px 20px; }
        .success-icon { font-size:56px; margin-bottom:20px; }
        .success-title { font-size:22px; font-weight:800; color:#00C8B4; margin-bottom:10px; }
        .success-sub { font-size:14px; color:rgba(255,255,255,0.45); line-height:1.7; }

        /* WARNINGS */
        .warn-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .warn-card { border-radius:12px; padding:24px; }
        .warn-title { font-size:14px; font-weight:800; margin-bottom:14px; }
        .warn-item { font-size:12px; color:rgba(255,255,255,0.5); line-height:1.8; padding-left:16px; position:relative; margin-bottom:6px; }
        .warn-item::before { content:"•"; position:absolute; left:0; }

        /* FAQ */
        .faq-item { border-bottom:1px solid rgba(255,255,255,0.07); padding:18px 0; }
        .faq-q { font-size:14px; font-weight:700; color:#fff; margin-bottom:8px; }
        .faq-a { font-size:13px; color:rgba(255,255,255,0.45); line-height:1.7; }

        /* CTA */
        .t-cta { background:#00C8B4; padding:72px 20px; text-align:center; }
        .t-cta h2 { font-size:clamp(1.6rem,3.5vw,2.8rem); font-weight:900; color:#000; margin:0 0 14px; letter-spacing:-1px; }
        .t-cta p { font-size:14px; color:rgba(0,0,0,0.55); margin:0 auto 32px; max-width:420px; line-height:1.7; }
        .t-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .t-cta-dark { padding:14px 32px; background:#000; color:#fff; border:none; border-radius:8px; font-size:14px; font-weight:800; cursor:pointer; text-decoration:none; transition:background 0.15s; }
        .t-cta-dark:hover { background:#1a1a1a; }
        .t-cta-ghost { padding:14px 32px; background:transparent; color:rgba(0,0,0,0.6); border:1.5px solid rgba(0,0,0,0.2); border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; text-decoration:none; transition:all 0.15s; }
        .t-cta-ghost:hover { border-color:rgba(0,0,0,0.5); color:#000; }

        /* RISK */
        .t-risk { background:#0B0E11; padding:28px 20px; border-top:1px solid rgba(255,255,255,0.05); }
        .t-risk p { max-width:1280px; margin:0 auto; font-size:11px; color:rgba(255,255,255,0.2); line-height:1.8; }

        @media (max-width:1100px) {
          .asset-grid { grid-template-columns:repeat(3,1fr); }
          .steps-grid { grid-template-columns:repeat(3,1fr); }
        }
        @media (max-width:900px) {
          .t-stats-inner { grid-template-columns:repeat(2,1fr); }
          .asset-grid { grid-template-columns:repeat(2,1fr); }
          .steps-grid { grid-template-columns:repeat(2,1fr); }
          .form-layout { grid-template-columns:1fr; }
          .summary-card { position:static; }
          .warn-grid { grid-template-columns:1fr; }
          .form-row { grid-template-columns:1fr; }
        }
        @media (max-width:480px) {
          .t-hero { padding:100px 16px 56px; }
          .t-hero-btns { flex-direction:column; max-width:100%; }
          .btn-teal, .btn-teal-outline { min-width:unset; width:100%; }
          .t-stats-inner { grid-template-columns:repeat(2,1fr); gap:16px; }
          .asset-grid { grid-template-columns:repeat(2,1fr); }
          .steps-grid { grid-template-columns:1fr; }
          .t-section, .t-section-alt { padding:52px 16px; }
          .t-cta-btns { flex-direction:column; }
          .t-cta-dark, .t-cta-ghost { width:100%; text-align:center; }
          .form-card { padding:20px; }
        }
      \`}</style>

      {/* HERO */}
      <section className="t-hero">
        <div className="t-hero-glow" />
        <div className="t-badge">Issuer Portal</div>
        <h1>Tokenize Real-World Assets<br /><em>in 48 Hours</em></h1>
        <p>Launch compliant digital offerings for real estate, infrastructure, private equity, funds, and bonds — structured for modern capital access.</p>
        <div className="t-hero-btns">
          <a href="#issuance-form" className="btn-teal">Start Issuance</a>
          <Link href="/markets" className="btn-teal-outline">Explore Markets</Link>
        </div>
      </section>

      {/* STATS */}
      <div className="t-stats">
        <div className="t-stats-inner">
          {BENEFITS.map((b) => (
            <div key={b.label}>
              <div className="t-stat-val">{b.stat}</div>
              <div className="t-stat-lbl">{b.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WARNINGS */}
      <section className="t-section">
        <div className="t-inner">
          <div className="warn-grid">
            <div className="warn-card" style={{ background:"rgba(240,185,11,0.05)", border:"1px solid rgba(240,185,11,0.2)" }}>
              <div className="warn-title" style={{ color:"#F0B90B" }}>⚠️ Safety Warning</div>
              <div className="warn-item">Nextoken Capital will <strong>never</strong> ask for your Private Key or Seed Phrase.</div>
              <div className="warn-item">Always verify the URL is <strong>nextokencapital.com</strong> before connecting.</div>
              <div className="warn-item">Blockchain transactions are irreversible — verify all wallet addresses carefully.</div>
            </div>
            <div className="warn-card" style={{ background:"rgba(14,203,129,0.05)", border:"1px solid rgba(14,203,129,0.2)" }}>
              <div className="warn-title" style={{ color:"#0ECB81" }}>🔐 Wallet Backup Guide</div>
              <div className="warn-item">Write down your 12 or 24-word recovery phrase on physical paper.</div>
              <div className="warn-item">Store backups in a secure, fireproof location.</div>
              <div className="warn-item">If you lose your recovery phrase, your assets cannot be recovered.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ASSET CLASSES */}
      <section className="t-section-alt">
        <div className="t-inner">
          <div className="t-tag">Asset Classes</div>
          <h2 className="t-title">What You Can Tokenize</h2>
          <p className="t-sub">Any asset with legal title can be tokenized on our platform.</p>
          <div className="asset-grid">
            {ASSET_TYPES.map((a) => (
              <div key={a.label} className="asset-card">
                <div className="asset-card-icon">{a.icon}</div>
                <div className="asset-card-label">{a.label}</div>
                <div className="asset-card-desc">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="t-section">
        <div className="t-inner">
          <div className="t-tag">Workflow</div>
          <h2 className="t-title">How Tokenization Works</h2>
          <p className="t-sub">From asset submission to live secondary market trading in 5 steps.</p>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ISSUANCE FORM */}
      <section className="t-section-alt" id="issuance-form">
        <div className="t-inner">
          <div className="t-tag">Issuer Intake</div>
          <h2 className="t-title">Start Your Issuance</h2>
          <p className="t-sub">Complete the intake form and submit your asset for internal compliance review.</p>
          <div className="form-layout">
            <div className="form-card">
              {submitted ? (
                <div className="success-box">
                  <div className="success-icon">✅</div>
                  <div className="success-title">Submission Received!</div>
                  <div className="success-sub">Our compliance team will review your asset and contact you within 48 hours.</div>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="form-row">
                    <div className="field">
                      <label>Asset Name</label>
                      <input name="assetName" value={form.assetName} onChange={handle} placeholder="Baltic Office Tower" required />
                    </div>
                    <div className="field">
                      <label>Asset Type</label>
                      <select name="assetType" value={form.assetType} onChange={handle}>
                        {["Commercial Real Estate","Residential Real Estate","Private Equity","Infrastructure","Commodity","Fund","Bond","Other"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Total Asset Value</label>
                      <input name="totalValue" value={form.totalValue} onChange={handle} placeholder="€5,000,000" required />
                    </div>
                    <div className="field">
                      <label>Token Supply</label>
                      <input name="tokenSupply" value={form.tokenSupply} onChange={handle} placeholder="500,000" required />
                    </div>
                    <div className="field">
                      <label>Token Price</label>
                      <input name="tokenPrice" value={form.tokenPrice} onChange={handle} placeholder="€10" required />
                    </div>
                    <div className="field">
                      <label>Expected Return</label>
                      <input name="expectedReturn" value={form.expectedReturn} onChange={handle} placeholder="8% annual" />
                    </div>
                    <div className="field">
                      <label>Minimum Investment</label>
                      <input name="minInvestment" value={form.minInvestment} onChange={handle} placeholder="€500" />
                    </div>
                    <div className="field">
                      <label>Fundraising Deadline</label>
                      <input name="deadline" type="date" value={form.deadline} onChange={handle} />
                    </div>
                  </div>
                  <div className="field">
                    <label>Asset Description</label>
                    <textarea name="description" value={form.description} onChange={handle} rows={4} placeholder="Describe the asset, income model, structure, and investor proposition." required />
                  </div>
                  <div className="form-row">
                    <div className="field">
                      <label>Token Standard</label>
                      <select name="tokenStandard" value={form.tokenStandard} onChange={handle}>
                        {["ERC-3643","ERC-1400","ERC-20"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Investor Eligibility</label>
                      <select name="eligibility" value={form.eligibility} onChange={handle}>
                        {["EU Verified Investors","Accredited Investors","Retail + Verified","Private Placement Only"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="submit-btn">Submit for Review →</button>
                </form>
              )}
            </div>

            <div className="summary-card">
              <div className="summary-title">Issuance Summary</div>
              {[
                ["Asset Type",    form.assetType],
                ["Token Standard",form.tokenStandard],
                ["Eligibility",   form.eligibility],
                ["Token Supply",  form.tokenSupply || "—"],
                ["Token Price",   form.tokenPrice  || "—"],
                ["Min. Investment",form.minInvestment || "—"],
              ].map(([k,v]) => (
                <div key={k} className="summary-row"><span>{k}</span><span>{v}</span></div>
              ))}
              <div className="summary-divider" />
              <div className="summary-why">Why this works</div>
              {["Structured issuer intake","Clear eligibility setup","Document-driven review","Secondary market readiness"].map(b => (
                <div key={b} className="summary-bullet">{b}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="t-section">
        <div className="t-inner" style={{ maxWidth:860 }}>
          <div className="t-tag">FAQ</div>
          <h2 className="t-title">Common Questions</h2>
          {[
            ["How long does tokenization take?","Initial review can begin after submission; timing depends on documentation quality and structure complexity."],
            ["Who can invest?","This depends on the investor eligibility rules selected for the offering and applicable jurisdiction requirements."],
            ["What token standard is used?","We support ERC-3643, ERC-1400, and ERC-20 as selectable structure options."],
            ["Can tokens trade after issuance?","Where structure and review permit, assets can progress toward secondary market workflows."],
            ["What documents are required?","Valuation report, legal ownership proof, financial statements, and insurance documents."],
          ].map(([q,a]) => (
            <div key={q} className="faq-item">
              <div className="faq-q">{q}</div>
              <div className="faq-a">{a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="t-cta">
        <h2>Ready to Structure Your Asset?</h2>
        <p>Start your issuer intake, define your token structure, and prepare for digital capital formation.</p>
        <div className="t-cta-btns">
          <a href="#issuance-form" className="t-cta-dark">Start Issuance</a>
          <Link href="/markets" className="t-cta-ghost">Explore Markets</Link>
        </div>
      </section>

      {/* RISK */}
      <div className="t-risk">
        <p>Risk notice: Digital offerings, tokenized assets, and real-world asset investments may involve regulatory, market, custody, technology, and liquidity risks. Issuer eligibility, investor access, and secondary market availability depend on jurisdiction, structure, and internal review outcomes.</p>
      </div>

      <Footer />
    </>
  );
}
`);
console.log("✅ pages/tokenize.js");

console.log("\n✅ All files created successfully!");
console.log("   components/Navbar.js  — clean navbar, no duplicates, mobile hamburger");
console.log("   components/Footer.js  — single shared footer");
console.log("   pages/index.js        — full-width homepage, mobile-first");
console.log("   pages/tokenize.js     — teal accent, distinct from other pages\n");
