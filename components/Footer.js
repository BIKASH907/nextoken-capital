import Link from "next/link";

export default function Footer() {
  const cols = [
    { title: "MARKETPLACE", links: [
      { href: "/markets", label: "All Markets" },
      { href: "/exchange", label: "Exchange" },
      { href: "/bonds", label: "Bonds" },
      { href: "/equity-ipo", label: "Equity & IPO" },
      { href: "/tokenize", label: "Tokenize Asset" },
    ]},
    { title: "COMPANY", links: [
      { href: "/about", label: "About Us" },
      { href: "/careers", label: "Careers" },
      { href: "/press", label: "Press" },
      { href: "/blog", label: "Blog" },
    ]},
    { title: "LEGAL", links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/risk", label: "Risk Disclosure" },
      { href: "/aml", label: "AML Policy" },
      { href: "/fees", label: "Fees & Pricing" },
    ]},
    { title: "SUPPORT", links: [
      { href: "/help", label: "Help Center" },
      { href: "/contact", label: "Contact Us" },
      { href: "/api", label: "API Docs" },
      { href: "/status", label: "System Status" },
    ]},
  ];

  return (
    <>
      <style>{`
        .footer { background:#05060a; border-top:1px solid rgba(255,255,255,0.07); padding:60px 20px 32px; }
        .footer-inner { max-width:1280px; margin:0 auto; }
        .footer-top { display:grid; grid-template-columns:1.6fr repeat(4,1fr); gap:48px; margin-bottom:48px; }
        .footer-brand-logo { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .footer-nxt { font-size:20px; font-weight:900; color:#F0B90B; }
        .footer-line { width:1px; height:28px; background:rgba(255,255,255,0.15); }
        .footer-brand-text { display:flex; flex-direction:column; line-height:1.1; }
        .footer-brand-text .bt1 { font-size:11px; font-weight:800; color:#fff; letter-spacing:2px; }
        .footer-brand-text .bt2 { font-size:9px; color:rgba(255,255,255,0.4); letter-spacing:3px; }
        .footer-tagline { font-size:13px; color:rgba(255,255,255,0.4); line-height:1.7; margin-bottom:20px; max-width:200px; }
        .footer-badge { display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:8px; background:rgba(240,185,11,0.06); border:1px solid rgba(240,185,11,0.2); }
        .footer-badge-label { font-size:10px; color:rgba(255,255,255,0.45); display:block; }
        .footer-badge-value { font-size:11px; font-weight:700; color:#F0B90B; display:block; }
        .footer-col-title { font-size:11px; font-weight:700; color:rgba(255,255,255,0.3); letter-spacing:2px; text-transform:uppercase; margin-bottom:16px; }
        .footer-col a { display:block; font-size:13px; color:rgba(255,255,255,0.5); text-decoration:none; margin-bottom:10px; transition:color .15s; }
        .footer-col a:hover { color:#fff; }
        .footer-bottom { border-top:1px solid rgba(255,255,255,0.06); padding-top:28px; }
        .footer-copy { font-size:12px; color:rgba(255,255,255,0.28); }
        .footer-risk { font-size:11px; color:rgba(255,255,255,0.18); line-height:1.7; margin-top:18px; }
        @media(max-width:1024px){ .footer-top{ grid-template-columns:1fr 1fr 1fr; gap:32px; } .footer-brand{ grid-column:1/-1; } }
        @media(max-width:640px){ .footer-top{ grid-template-columns:1fr 1fr; gap:24px; } .footer-brand{ grid-column:1/-1; } }
      `}</style>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-brand-logo">
                <span className="footer-nxt">NXT</span>
                <div className="footer-line" />
                <div className="footer-brand-text">
                  <span className="bt1">NEXTOKEN</span>
                  <span className="bt2">CAPITAL</span>
                </div>
              </div>
              <p className="footer-tagline">The regulated marketplace for tokenized real-world assets.</p>
              <div className="footer-badge">
                <span>🏛️</span>
                <div>
                  <span className="footer-badge-label">MONITORED BY</span>
                  <span className="footer-badge-value">Bank of Lithuania</span>
                </div>
              </div>
            </div>
            {cols.map((col) => (
              <div key={col.title} className="footer-col">
                <div className="footer-col-title">{col.title}</div>
                {col.links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
            <p className="footer-risk">Risk warning: Trading tokenized assets involves risk including potential loss of capital. Past performance is not indicative of future results. Nextoken Capital is a marketplace platform — we do not provide financial advice or manage funds.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
