import Head from "next/head";

const STATS = [
  { num: "12,400+", label: "Investors & Issuers" },
  { num: "€48M+", label: "Raise Pipeline" },
  { num: "6+", label: "Bond Listings" },
  { num: "48hrs", label: "Tokenization Review" },
];

const TEAM = [
  { initials: "BB", name: "Bikash Bhat", role: "Founder & CEO", origin: "🇳🇵 Originally from Nepal" },
  { initials: "LT", name: "Legal Team", role: "Compliance & Regulation", origin: "🇱🇹 Vilnius, Lithuania" },
  { initials: "ET", name: "Engineering Team", role: "Platform & Blockchain", origin: "🌍 Remote-first" },
];

const VALUES = [
  { icon: "🔒", title: "Regulated & Compliant", desc: "Monitored by the Bank of Lithuania. Fully compliant with EU MiCA, GDPR, and AMLD5/AMLD6 regulations." },
  { icon: "⛓️", title: "Blockchain-Native", desc: "Built on ERC-3643 (T-REX) security token standards with on-chain KYC and automated transfer compliance." },
  { icon: "🌍", title: "Global Access", desc: "Connecting investors worldwide to tokenized real-world assets from our headquarters in Vilnius, Lithuania." },
  { icon: "⚡", title: "Fast Issuance", desc: "From asset submission to token issuance in as little as 48 hours — the fastest compliant tokenization workflow in Europe." },
];

export default function AboutPage() {
  const s = {
    page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif" },
    section: { padding: "80px 20px" },
    wrap: { maxWidth: 1100, margin: "0 auto" },
    tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 },
    h2: { fontSize: "clamp(24px,3vw,40px)", fontWeight: 800, marginBottom: 16 },
    sub: { fontSize: 16, color: "#848e9c", maxWidth: 580, lineHeight: 1.7 },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, margin: "60px 0" },
    statCard: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 14, padding: "24px 20px", textAlign: "center" },
    statNum: { fontSize: 32, fontWeight: 800, color: "#f0b90b" },
    statLabel: { fontSize: 12, color: "#848e9c", marginTop: 4 },
    valGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginTop: 40 },
    valCard: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 14, padding: "24px" },
    valIcon: { fontSize: 28, marginBottom: 12 },
    valTitle: { fontSize: 15, fontWeight: 700, marginBottom: 8 },
    valDesc: { fontSize: 13, color: "#848e9c", lineHeight: 1.6 },
    teamGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20, marginTop: 40 },
    teamCard: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 14, padding: "28px 24px", textAlign: "center" },
    avatar: { width: 64, height: 64, borderRadius: "50%", background: "#f0b90b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#05060a", margin: "0 auto 16px" },
    teamName: { fontSize: 15, fontWeight: 700, marginBottom: 4 },
    teamRole: { fontSize: 12, color: "#f0b90b", fontWeight: 600, marginBottom: 4 },
    teamOrigin: { fontSize: 12, color: "#848e9c" },
    divider: { height: 1, background: "#1e2329", margin: "0 20px" },
    heroBg: { background: "linear-gradient(180deg,#0f1117 0%,#05060a 100%)", borderBottom: "1px solid #1e2329" },
  };

  return (
    <>
      <Head><title>About Us — Nextoken Capital</title></Head>
      <div style={s.page}>
        {/* Hero */}
        <div style={s.heroBg}>
          <div style={{ ...s.section, ...s.wrap }}>
            <div style={s.tag}>About Nextoken Capital</div>
            <h1 style={{ fontSize: "clamp(32px,5vw,64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, maxWidth: 700 }}>
              The regulated infrastructure for <span style={{ color: "#f0b90b" }}>tokenized real-world assets</span>
            </h1>
            <p style={{ ...s.sub, fontSize: 17, marginBottom: 0 }}>
              Founded in Vilnius, Lithuania by Bikash Bhat, Nextoken Capital UAB is building the bridge between traditional finance and blockchain — making real-world asset investment accessible, compliant, and efficient for investors and issuers worldwide.
            </p>
            <div style={s.statsGrid}>
              {STATS.map(s2 => (
                <div key={s2.label} style={s.statCard}>
                  <div style={s.statNum}>{s2.num}</div>
                  <div style={s.statLabel}>{s2.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission */}
        <div style={s.section}>
          <div style={s.wrap}>
            <div style={s.tag}>Our Mission</div>
            <h2 style={s.h2}>Connecting investors, opportunities, <span style={{ color: "#f0b90b" }}>and financial access</span></h2>
            <p style={{ ...s.sub, marginBottom: 40 }}>
              We believe tokenization is the future of capital formation. By combining blockchain technology with EU regulatory compliance, we make it possible for anyone — from retail investors in Lithuania to institutions across Europe — to participate in real-world asset markets that were previously inaccessible.
            </p>
            <div style={s.valGrid}>
              {VALUES.map(v => (
                <div key={v.title} style={s.valCard}>
                  <div style={s.valIcon}>{v.icon}</div>
                  <div style={s.valTitle}>{v.title}</div>
                  <div style={s.valDesc}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={s.divider} />

        {/* Team */}
        <div style={s.section}>
          <div style={s.wrap}>
            <div style={s.tag}>Our Team</div>
            <h2 style={s.h2}>Built by people who <span style={{ color: "#f0b90b" }}>believe in open finance</span></h2>
            <div style={s.teamGrid}>
              {TEAM.map(t => (
                <div key={t.name} style={s.teamCard}>
                  <div style={s.avatar}>{t.initials}</div>
                  <div style={s.teamName}>{t.name}</div>
                  <div style={s.teamRole}>{t.role}</div>
                  <div style={s.teamOrigin}>{t.origin}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={s.divider} />

        {/* Location */}
        <div style={s.section}>
          <div style={s.wrap}>
            <div style={{ background: "#0f1117", border: "1px solid #1e2329", borderRadius: 20, padding: "40px", display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={s.tag}>Headquarters</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Vilnius, Lithuania 🇱🇹</h3>
                <div style={{ fontSize: 14, color: "#848e9c", lineHeight: 1.8 }}>
                  Gynėjų g. 14, Vilnius 01109<br />
                  Nextoken Capital UAB<br />
                  Monitored by: Bank of Lithuania<br />
                  EU Regulatory Framework: MiCA, GDPR, AMLD6
                </div>
              </div>
              <a href="/contact" style={{ display: "inline-block", background: "#f0b90b", color: "#05060a", fontWeight: 800, padding: "13px 32px", borderRadius: 12, textDecoration: "none", fontSize: 14 }}>
                Get in Touch →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
