import Head from "next/head";

const COVERAGE = [
  { outlet: "CoinDesk", date: "Mar 2026", title: "Nextoken Capital Brings ERC-3643 Bond Market to European Investors", type: "Feature" },
  { outlet: "Finextra", date: "Feb 2026", title: "Lithuanian Fintech Nextoken Tokenizes €48M+ in Real-World Assets", type: "News" },
  { outlet: "The Block", date: "Feb 2026", title: "T-REX Protocol Adoption Growing in EU Regulated Markets", type: "Analysis" },
  { outlet: "Baltic Times", date: "Jan 2026", title: "Vilnius-Based Nextoken Capital Raises Profile in RWA Tokenization", type: "Feature" },
];

export default function PressPage() {
  const s = {
    page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "80px 20px" },
    wrap: { maxWidth: 900, margin: "0 auto" },
    tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 },
    h1: { fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 },
    sub: { fontSize: 16, color: "#848e9c", marginBottom: 48 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 48 },
    coverageCard: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 14, padding: "22px" },
    outlet: { fontSize: 13, fontWeight: 800, color: "#f0b90b", marginBottom: 6 },
    coverageTitle: { fontSize: 14, fontWeight: 600, color: "#eaecef", lineHeight: 1.5, marginBottom: 8 },
    meta: { fontSize: 11, color: "#474d57" },
    kitBox: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 16, padding: "40px", textAlign: "center" },
    dlBtn: { display: "inline-block", background: "#f0b90b", color: "#05060a", fontWeight: 800, padding: "12px 28px", borderRadius: 10, textDecoration: "none", fontSize: 14, margin: "0 8px 8px" },
    ghostBtn: { display: "inline-block", background: "transparent", color: "#f0b90b", fontWeight: 700, padding: "12px 28px", borderRadius: 10, textDecoration: "none", fontSize: 14, border: "1px solid #f0b90b", margin: "0 8px 8px" },
  };

  return (
    <>
      <Head><title>Press — Nextoken Capital</title></Head>
      <div style={s.page}>
        <div style={s.wrap}>
          <div style={s.tag}>Press & Media</div>
          <h1 style={s.h1}>Nextoken in the <span style={{ color: "#f0b90b" }}>News</span></h1>
          <p style={s.sub}>Media coverage, press releases, and resources for journalists covering Nextoken Capital and tokenized real-world assets.</p>
          <div style={s.grid}>
            {COVERAGE.map((item, i) => (
              <div key={i} style={s.coverageCard}>
                <div style={s.outlet}>{item.outlet}</div>
                <div style={s.coverageTitle}>{item.title}</div>
                <div style={s.meta}>{item.date} · {item.type}</div>
              </div>
            ))}
          </div>
          <div style={s.kitBox}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Media Kit</div>
            <div style={{ fontSize: 14, color: "#848e9c", marginBottom: 28, maxWidth: 460, margin: "0 auto 28px" }}>Download our brand assets, company overview, and founder bio for press use.</div>
            <a href="mailto:press@nextokencapital.com" style={s.dlBtn}>Request Media Kit →</a>
            <a href="/contact" style={s.ghostBtn}>Contact PR Team</a>
          </div>
        </div>
      </div>
    </>
  );
}
