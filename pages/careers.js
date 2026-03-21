import Head from "next/head";

const JOBS = [
  { title: "Senior Blockchain Engineer", dept: "Engineering", location: "Vilnius / Remote", type: "Full-time", desc: "Build and maintain smart contract infrastructure using ERC-3643 and ERC-1400 token standards. Experience with Solidity and DeFi protocols required." },
  { title: "Compliance & AML Analyst", dept: "Legal & Compliance", location: "Vilnius, Lithuania", type: "Full-time", desc: "Manage KYC/AML processes, ensure compliance with Bank of Lithuania requirements, EU MiCA and AMLD6 regulations." },
  { title: "Product Manager — Tokenization", dept: "Product", location: "Vilnius / Remote", type: "Full-time", desc: "Own the tokenization issuer workflow product. Work with issuers, legal, and engineering to bring real-world assets on-chain." },
  { title: "Business Development Manager", dept: "Growth", location: "Remote (EU)", type: "Full-time", desc: "Develop partnerships with asset issuers, family offices, and institutional investors across Europe." },
  { title: "Frontend Engineer (Next.js)", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Build beautiful, performant UIs for our trading platform using Next.js, TypeScript, and Web3 integrations." },
];

const deptColors = { Engineering: "#1a3a5c", "Legal & Compliance": "#3a1a1a", Product: "#1a3a2a", Growth: "#2a2a1a" };

export default function CareersPage() {
  const s = {
    page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "80px 20px" },
    wrap: { maxWidth: 900, margin: "0 auto" },
    tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 },
    h1: { fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 },
    sub: { fontSize: 16, color: "#848e9c", marginBottom: 48 },
    card: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 14, padding: "24px 28px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" },
    left: { flex: 1, minWidth: 200 },
    jobTitle: { fontSize: 16, fontWeight: 700, color: "#eaecef", marginBottom: 6 },
    tags: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
    deptTag: { fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 },
    locTag: { fontSize: 10, color: "#848e9c", background: "#1e2329", padding: "2px 8px", borderRadius: 20, fontWeight: 600 },
    typeTag: { fontSize: 10, color: "#02c076", background: "rgba(2,192,118,0.1)", padding: "2px 8px", borderRadius: 20, fontWeight: 600 },
    desc: { fontSize: 13, color: "#848e9c", lineHeight: 1.6 },
    applyBtn: { background: "#f0b90b", color: "#05060a", fontWeight: 800, padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap", textDecoration: "none", display: "inline-block" },
    perksGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginTop: 48 },
    perkCard: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 12, padding: "20px", textAlign: "center" },
  };

  return (
    <>
      <Head><title>Careers — Nextoken Capital</title></Head>
      <div style={s.page}>
        <div style={s.wrap}>
          <div style={s.tag}>Join the team</div>
          <h1 style={s.h1}>Build the future of <span style={{ color: "#f0b90b" }}>finance with us</span></h1>
          <p style={s.sub}>We're a small, ambitious team in Vilnius, Lithuania building regulated infrastructure for the next generation of capital markets. Founded by Bikash Bhat.</p>

          {JOBS.map((job, i) => (
            <div key={i} style={s.card}>
              <div style={s.left}>
                <div style={s.jobTitle}>{job.title}</div>
                <div style={s.tags}>
                  <span style={{ ...s.deptTag, background: deptColors[job.dept] || "#1e2329", color: "#fff" }}>{job.dept}</span>
                  <span style={s.locTag}>📍 {job.location}</span>
                  <span style={s.typeTag}>✓ {job.type}</span>
                </div>
                <div style={s.desc}>{job.desc}</div>
              </div>
              <a href={`mailto:careers@nextokencapital.com?subject=Application: ${job.title}`} style={s.applyBtn}>Apply →</a>
            </div>
          ))}

          <div style={s.perksGrid}>
            {[["🌍","Remote-friendly","Work from anywhere in the EU"],["📈","Equity options","Share in our growth"],["🏥","Health coverage","Full medical in Lithuania"],["⚡","Fast-moving","Ship features, not presentations"]].map(([icon,title,desc]) => (
              <div key={title} style={s.perkCard}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: "#848e9c" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
