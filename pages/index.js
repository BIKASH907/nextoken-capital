import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATS = [
  { value: "EUR 140M+", label: "Assets Tokenized" },
  { value: "12,400+",   label: "Verified Investors" },
  { value: "180+",      label: "Countries" },
  { value: "EUR 100",   label: "Min. Investment" },
];

const FEATURES = [
  { icon: "🏢", title: "Real Estate",  desc: "Fractional ownership of commercial and residential property across Europe." },
  { icon: "📄", title: "Bonds",        desc: "Fixed-income digital securities with transparent lifecycle management." },
  { icon: "📈", title: "Equity & IPO", desc: "Private and public company shares via compliant token issuance." },
  { icon: "⚡", title: "Energy",       desc: "Renewable energy projects open to retail and institutional investors." },
  { icon: "🏦", title: "Funds",        desc: "Tokenized fund units with defined access and transfer rules." },
  { icon: "💎", title: "Commodities",  desc: "Asset-backed token structures with transparent supply and pricing." },
];

const STEPS = [
  { n: "01", title: "Create Account",        desc: "Register in minutes. KYC powered by Sumsub takes under 5 minutes." },
  { n: "02", title: "Browse Opportunities",  desc: "Filter by asset class, risk level, return, and investment term." },
  { n: "03", title: "Invest from EUR 100",   desc: "Purchase tokens representing fractional ownership of real assets." },
  { n: "04", title: "Earn and Trade",        desc: "Receive returns and trade on the secondary market exchange." },
];

const TRUST = [
  "🏛️ Bank of Lithuania",
  "⚖️ MiCA Compliant",
  "🔗 ERC-3643",
  "🛡️ ISO 27001",
  "🪪 Sumsub KYC",
  "🌐 FATF Aligned",
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Nextoken Capital — Tokenized Real-World Assets</title>
        <meta name="description" content="The regulated infrastructure for tokenized real-world assets. Invest in bonds, equity, real estate and energy from EUR 100." />
      </Head>
      <Navbar />

      <div style={{ background: "#0B0E11", minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <section style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "100px 20px 64px",
          position: "relative",
          overflow: "hidden",
          background: "#0B0E11",
        }}>
          {/* glow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(240,185,11,0.07), transparent)",
          }} />

          {/* badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 18px", borderRadius: 999,
            border: "1px solid rgba(240,185,11,0.3)",
            background: "rgba(240,185,11,0.06)",
            color: "#F0B90B", fontSize: 11, fontWeight: 700,
            letterSpacing: "2px", textTransform: "uppercase",
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F0B90B", animation: "pulse 2s infinite" }} />
            Regulated · MiCA Compliant · Bank of Lithuania
          </div>

          <h1 style={{
            fontSize: "clamp(2.2rem, 6vw, 5rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-1.5px",
            margin: "0 0 24px",
            maxWidth: 820,
            color: "#fff",
          }}>
            Connecting Investors,{" "}
            <span style={{ color: "#F0B90B" }}>Opportunities,</span>{" "}
            and Financial Access
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.8,
            maxWidth: 560,
            margin: "0 0 40px",
          }}>
            Nextoken Capital delivers regulated infrastructure for tokenized
            real-world assets — bonds, equity, real estate, and energy —
            open to investors in 180+ countries from as little as EUR 100.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <Link href="/markets" style={{
              padding: "14px 32px", borderRadius: 8,
              background: "#F0B90B", color: "#000",
              fontSize: 14, fontWeight: 800,
              textDecoration: "none", transition: "background .15s",
            }}>
              Explore Markets
            </Link>
            <Link href="/register" style={{
              padding: "14px 32px", borderRadius: 8,
              background: "transparent", color: "rgba(255,255,255,0.8)",
              fontSize: 14, fontWeight: 700,
              border: "1px solid rgba(255,255,255,0.2)",
              textDecoration: "none",
            }}>
              Create Free Account
            </Link>
          </div>

          {/* trust badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 20px", justifyContent: "center" }}>
            {TRUST.map(t => (
              <span key={t} style={{ fontSize: 12, color: "rgba(255,255,255,0.38)" }}>{t}</span>
            ))}
          </div>

          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
        </section>

        {/* ── STATS ── */}
        <section style={{
          background: "#0F1318",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "40px 20px",
        }}>
          <div style={{
            maxWidth: 1280, margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            gap: 20, textAlign: "center",
          }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "clamp(1.6rem,3vw,2.6rem)", fontWeight: 900, color: "#F0B90B", lineHeight: 1, marginBottom: 6, letterSpacing: "-1px" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ASSET CLASSES ── */}
        <section style={{ padding: "80px 20px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#F0B90B", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
              Asset Classes
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, color: "#fff", marginBottom: 12, letterSpacing: "-0.5px" }}>
              Invest Across Real-World Sectors
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", maxWidth: 480, lineHeight: 1.7, marginBottom: 48 }}>
              Every asset on the platform is reviewed, structured, and tokenized by our compliance team.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {FEATURES.map(f => (
                <div key={f.title} style={{
                  background: "#161B22",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12, padding: "28px 24px",
                  transition: "border-color .2s",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.43)", lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: "80px 20px", background: "#0F1318" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#F0B90B", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
              How It Works
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, color: "#fff", marginBottom: 12, letterSpacing: "-0.5px" }}>
              Start Investing in 4 Steps
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", maxWidth: 480, lineHeight: 1.7, marginBottom: 48 }}>
              From account creation to earning returns — the whole journey on one platform.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
              {STEPS.map(s => (
                <div key={s.n}>
                  <div style={{ fontSize: "3.2rem", fontWeight: 900, color: "rgba(240,185,11,0.18)", lineHeight: 1, marginBottom: 18 }}>{s.n}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY REGULATED ── */}
        <section style={{ padding: "80px 20px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#F0B90B", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
              Why Nextoken
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, color: "#fff", marginBottom: 40, letterSpacing: "-0.5px" }}>
              Built on Regulated Infrastructure
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[
                { icon: "🏛️", title: "Bank of Lithuania",  desc: "Authorized as an EMI and MiCA CASP by the Bank of Lithuania — one of the EU's leading fintech regulators." },
                { icon: "⚖️", title: "MiCA Compliant",      desc: "Full compliance with the EU Markets in Crypto-Assets Regulation, the gold standard for crypto-asset services." },
                { icon: "🔗", title: "ERC-3643 Tokens",     desc: "All security tokens use the ERC-3643 standard with full transfer controls, whitelisting and compliance rules." },
                { icon: "🪪", title: "Sumsub KYC",          desc: "Identity verification for all investors via Sumsub — fast, secure, and accepted in 180+ countries." },
                { icon: "🛡️", title: "ISO 27001",           desc: "Our platform infrastructure is ISO 27001 certified, meeting international information security standards." },
                { icon: "🌐", title: "FATF Aligned",        desc: "Our AML policies follow FATF recommendations for virtual asset service providers across all jurisdictions." },
              ].map(r => (
                <div key={r.title} style={{
                  background: "#0F1318",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12, padding: "24px",
                }}>
                  <div style={{ fontSize: 26, marginBottom: 12 }}>{r.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          background: "#F0B90B",
          padding: "80px 20px",
          textAlign: "center",
        }}>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)", fontWeight: 900, color: "#000", letterSpacing: "-1px", marginBottom: 14 }}>
            Ready to tokenize the world?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(0,0,0,0.58)", margin: "0 auto 36px", maxWidth: 440, lineHeight: 1.7 }}>
            Join 12,400+ investors and issuers already on the platform.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{
              padding: "14px 32px", background: "#000", color: "#fff",
              borderRadius: 8, fontSize: 14, fontWeight: 800,
              textDecoration: "none",
            }}>
              Create Free Account
            </Link>
            <Link href="/markets" style={{
              padding: "14px 32px",
              background: "transparent", color: "rgba(0,0,0,0.65)",
              border: "1.5px solid rgba(0,0,0,0.22)",
              borderRadius: 8, fontSize: 14, fontWeight: 700,
              textDecoration: "none",
            }}>
              Browse Markets
            </Link>
          </div>
        </section>

        {/* responsive */}
        <style>{`
          @media(max-width:900px){
            section > div > div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr)!important}
            section > div > div[style*="repeat(3,1fr)"]{grid-template-columns:repeat(2,1fr)!important}
          }
          @media(max-width:540px){
            section > div > div[style*="repeat(4,1fr)"]{grid-template-columns:1fr!important}
            section > div > div[style*="repeat(3,1fr)"]{grid-template-columns:1fr!important}
            section > div > div[style*="repeat(2,1fr)"]{grid-template-columns:1fr!important}
          }
        `}</style>

      </div>
      <Footer />
    </>
  );
}