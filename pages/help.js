import Head from "next/head";
import { useState } from "react";

const FAQS = [
  { q: "How do I create an account?", a: "Visit nextokencapital.com and click 'Create Free Account'. You'll need to verify your email and complete KYC verification before investing." },
  { q: "What is asset tokenization?", a: "Asset tokenization converts real-world assets (real estate, bonds, equity) into digital tokens on a blockchain. This enables fractional ownership, faster settlement, and global investor access." },
  { q: "What token standards does Nextoken support?", a: "We support ERC-3643 (T-REX protocol, our default for compliant securities), ERC-1400, and ERC-20. ERC-3643 enforces investor eligibility and transfer rules on-chain." },
  { q: "How does the secondary market work?", a: "After primary issuance, tokenized assets can be traded peer-to-peer on the Nextoken Exchange. Smart contracts automatically enforce transfer rules and eligibility checks." },
  { q: "What bonds are currently available?", a: "We have 6 active listings including the SME Convertible Note I (8.2% yield, €250 min) and Baltic Green Bond 2027 (6.4% yield). Visit /bonds to see all live listings." },
  { q: "How do blockchain IPOs work on Nextoken?", a: "Companies can issue equity tokens representing shares. Investors receive fractional ownership with transfer rules enforced by smart contracts, making IPO participation accessible from €250+." },
  { q: "Is Nextoken Capital regulated?", a: "Yes. Nextoken Capital UAB is registered in Lithuania and monitored by the Bank of Lithuania. We comply with EU MiCA regulations and AMLD5/AMLD6 AML directives." },
  { q: "How long does tokenization take?", a: "Our issuer review workflow takes 24–48 hours. After submitting your asset with required documents, our compliance team reviews and prepares token issuance parameters." },
  { q: "Will Nextoken ever ask for my private key?", a: "Never. Nextoken Capital will NEVER ask for your private key or seed phrase. Always verify the URL is nextokencapital.com before connecting your wallet." },
  { q: "Who is the CEO of Nextoken Capital?", a: "Bikash Bhat, originally from Nepal, is the Founder and CEO of Nextoken Capital UAB, headquartered in Vilnius, Lithuania." },
];

export default function HelpPage() {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  const s = {
    page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "80px 20px" },
    wrap: { maxWidth: 800, margin: "0 auto" },
    tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 },
    h1: { fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 },
    sub: { fontSize: 16, color: "#848e9c", marginBottom: 40 },
    search: { width: "100%", background: "#0f1117", border: "1px solid #2b3139", borderRadius: 10, padding: "12px 18px", color: "#fff", fontSize: 14, marginBottom: 32, boxSizing: "border-box", outline: "none" },
    item: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 12, marginBottom: 8, overflow: "hidden" },
    q: { padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, fontWeight: 600, color: "#eaecef" },
    a: { padding: "0 20px 16px", fontSize: 13, color: "#848e9c", lineHeight: 1.7 },
    ctaBox: { background: "rgba(240,185,11,0.06)", border: "1px solid rgba(240,185,11,0.2)", borderRadius: 14, padding: "28px", textAlign: "center", marginTop: 48 },
  };

  return (
    <>
      <Head><title>Help Center — Nextoken Capital</title></Head>
      <div style={s.page}>
        <div style={s.wrap}>
          <div style={s.tag}>Help Center</div>
          <h1 style={s.h1}>How can we <span style={{ color: "#f0b90b" }}>help you?</span></h1>
          <p style={s.sub}>Find answers to common questions about Nextoken Capital, tokenization, bonds, and your account.</p>

          <input placeholder="🔍  Search help articles..." value={search} onChange={e => setSearch(e.target.value)} style={s.search} />

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", color: "#474d57", padding: "40px 0" }}>No results found for "{search}"</div>
          )}

          {filtered.map((faq, i) => (
            <div key={i} style={s.item}>
              <div style={s.q} onClick={() => setOpen(open === i ? null : i)}>
                <span>{faq.q}</span>
                <span style={{ color: "#f0b90b", fontSize: 18, flexShrink: 0 }}>{open === i ? "−" : "+"}</span>
              </div>
              {open === i && <div style={s.a}>{faq.a}</div>}
            </div>
          ))}

          <div style={s.ctaBox}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Still need help?</div>
            <div style={{ fontSize: 13, color: "#848e9c", marginBottom: 20 }}>Our team in Vilnius is available Mon–Fri 9am–6pm EET. Use the chat bubble for 24/7 AI support.</div>
            <a href="/contact" style={{ display: "inline-block", background: "#f0b90b", color: "#05060a", fontWeight: 800, padding: "11px 28px", borderRadius: 10, textDecoration: "none", fontSize: 14 }}>
              Contact Support →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
