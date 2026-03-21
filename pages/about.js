import Head from "next/head";
const STATS = [{ num: "12,400+", label: "Investors & Issuers" }, { num: "€48M+", label: "Raise Pipeline" }, { num: "6+", label: "Bond Listings" }, { num: "48hrs", label: "Tokenization Review" }];
const VALUES = [{ icon: "🔒", title: "Regulated & Compliant", desc: "Monitored by the Bank of Lithuania. Fully compliant with EU MiCA, GDPR, and AMLD6." }, { icon: "⛓️", title: "Blockchain-Native", desc: "Built on ERC-3643 T-REX security token standards with on-chain KYC and automated compliance." }, { icon: "🌍", title: "Global Access", desc: "Connecting investors worldwide to tokenized real-world assets from Vilnius, Lithuania." }, { icon: "⚡", title: "Fast Issuance", desc: "From asset submission to token issuance in as little as 48 hours." }];
export default function AboutPage() {
  const s = { page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif" }, section: { padding: "80px 20px" }, wrap: { maxWidth: 1100, margin: "0 auto" }, tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }, h2: { fontSize: "clamp(24px,3vw,40px)", fontWeight: 800, marginBottom: 16 }, sub: { fontSize: 16, color: "#848e9c", maxWidth: 580, lineHeight: 1.7 }, statCard: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 14, padding: "24px 20px", textAlign: "center" }, valCard: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 14, padding: "24px" } };
  return (
    <>
      <Head><title>About Us — Nextoken Capital</title></Head>
      <div style={s.page}>
        <div style={{ background: "linear-gradient(180deg,#0f1117 0%,#05060a 100%)", borderBottom: "1px solid #1e2329" }}>
          <div style={{ ...s.section, ...s.wrap }}>
            <div style={s.tag}>About Nextoken Capital</div>
            <h1 style={{ fontSize: "clamp(32px,5vw,64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, maxWidth: 700 }}>The regulated infrastructure for <span style={{ color: "#f0b90b" }}>tokenized real-world assets</span></h1>
            <p style={{ ...s.sub, fontSize: 17, marginBottom: 0 }}>Founded in Vilnius, Lithuania by Bikash Bhat, Nextoken Capital UAB is building the bridge between traditional finance and blockchain.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, margin: "60px 0 0" }}>
              {STATS.map(s2 => <div key={s2.label} style={s.statCard}><div style={{ fontSize: 32, fontWeight: 800, color: "#f0b90b" }}>{s2.num}</div><div style={{ fontSize: 12, color: "#848e9c", marginTop: 4 }}>{s2.label}</div></div>)}
            </div>
          </div>
        </div>
        <div style={s.section}><div style={s.wrap}>
          <div style={s.tag}>Our Values</div>
          <h2 style={s.h2}>Built on <span style={{ color: "#f0b90b" }}>trust and compliance</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginTop: 40 }}>
            {VALUES.map(v => <div key={v.title} style={s.valCard}><div style={{ fontSize: 28, marginBottom: 12 }}>{v.icon}</div><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{v.title}</div><div style={{ fontSize: 13, color: "#848e9c", lineHeight: 1.6 }}>{v.desc}</div></div>)}
          </div>
        </div></div>
        <div style={{ height: 1, background: "#1e2329", margin: "0 20px" }} />
        <div style={s.section}><div style={s.wrap}>
          <div style={{ background: "#0f1117", border: "1px solid #1e2329", borderRadius: 20, padding: "40px", display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={s.tag}>Headquarters</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Vilnius, Lithuania 🇱🇹</h3>
              <div style={{ fontSize: 14, color: "#848e9c", lineHeight: 1.8 }}>Gynėjų g. 14, Vilnius 01109<br />CEO: Bikash Bhat<br />Monitored by: Bank of Lithuania</div>
            </div>
            <a href="/contact" style={{ display: "inline-block", background: "#f0b90b", color: "#05060a", fontWeight: 800, padding: "13px 32px", borderRadius: 12, textDecoration: "none", fontSize: 14 }}>Get in Touch</a>
          </div>
        </div></div>
      </div>
    </>
  );
}
