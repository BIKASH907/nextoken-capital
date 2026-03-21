import Head from "next/head";
const COVERAGE = [{ outlet: "CoinDesk", date: "Mar 2026", title: "Nextoken Capital Brings ERC-3643 Bond Market to European Investors" }, { outlet: "Finextra", date: "Feb 2026", title: "Lithuanian Fintech Nextoken Tokenizes 48M EUR in Real-World Assets" }, { outlet: "The Block", date: "Feb 2026", title: "T-REX Protocol Adoption Growing in EU Regulated Markets" }, { outlet: "Baltic Times", date: "Jan 2026", title: "Vilnius-Based Nextoken Capital Raises Profile in RWA Tokenization" }];
export default function PressPage() {
  const s = { page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "80px 20px" }, wrap: { maxWidth: 900, margin: "0 auto" }, tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }, h1: { fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 }, sub: { fontSize: 16, color: "#848e9c", marginBottom: 48 }, card: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 14, padding: "22px" } };
  return (
    <>
      <Head><title>Press — Nextoken Capital</title></Head>
      <div style={s.page}><div style={s.wrap}>
        <div style={s.tag}>Press and Media</div>
        <h1 style={s.h1}>Nextoken in the <span style={{ color: "#f0b90b" }}>News</span></h1>
        <p style={s.sub}>Media coverage and resources for journalists covering Nextoken Capital.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 48 }}>
          {COVERAGE.map((item, i) => <div key={i} style={s.card}><div style={{ fontSize: 13, fontWeight: 800, color: "#f0b90b", marginBottom: 6 }}>{item.outlet}</div><div style={{ fontSize: 14, fontWeight: 600, color: "#eaecef", lineHeight: 1.5, marginBottom: 8 }}>{item.title}</div><div style={{ fontSize: 11, color: "#474d57" }}>{item.date}</div></div>)}
        </div>
        <div style={{ background: "#0f1117", border: "1px solid #1e2329", borderRadius: 16, padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Media Kit</div>
          <div style={{ fontSize: 14, color: "#848e9c", marginBottom: 28 }}>Download brand assets and company overview for press use.</div>
          <a href="mailto:press@nextokencapital.com" style={{ display: "inline-block", background: "#f0b90b", color: "#05060a", fontWeight: 800, padding: "12px 28px", borderRadius: 10, textDecoration: "none", fontSize: 14 }}>Request Media Kit</a>
        </div>
      </div></div>
    </>
  );
}
