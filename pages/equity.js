import Head from "next/head";
import Link from "next/link";

export default function EquityIpoPage() {
  return (
    <>
      <Head>
        <title>Equity & IPO | Nextoken Capital</title>
        <meta
          name="description"
          content="Equity and IPO solutions by Nextoken Capital."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={styles.page}>
        <header style={styles.header}>
          <div style={styles.logoWrap}>
            <img src="/logo.png" alt="Nextoken Capital" style={styles.logo} />
            <span style={styles.brand}>Nextoken Capital</span>
          </div>

          <nav style={styles.nav}>
            <Link href="/" style={styles.link}>Home</Link>
            <Link href="/equity" style={styles.link}>Equity & IPO</Link>
          </nav>
        </header>

        <section style={styles.hero}>
          <div style={styles.card}>
            <p style={styles.badge}>Capital Markets</p>
            <h1 style={styles.title}>Equity & IPO</h1>
            <p style={styles.text}>
              Nextoken Capital supports modern equity offerings and public market
              readiness with a clear, investor-focused digital experience.
            </p>

            <div style={styles.actions}>
              <Link href="/" style={styles.primaryBtn}>Back to Home</Link>
              <a href="#learn-more" style={styles.secondaryBtn}>Learn More</a>
            </div>
          </div>
        </section>

        <section id="learn-more" style={styles.section}>
          <div style={styles.infoBox}>
            <h2 style={styles.sectionTitle}>What this page can include</h2>
            <p style={styles.text}>
              You can add IPO pipeline, issuer onboarding, KYC flow, compliance
              process, investor dashboard, and offering overview here.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050816",
    color: "#ffffff",
    fontFamily: "Arial, Helvetica, sans-serif",
    boxSizing: "border-box",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(5,8,22,0.92)",
    position: "sticky",
    top: 0,
    zIndex: 50,
    boxSizing: "border-box",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    width: "42px",
    height: "42px",
    objectFit: "contain",
  },
  brand: {
    fontSize: "18px",
    fontWeight: 700,
  },
  nav: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 600,
  },
  hero: {
    padding: "80px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "900px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
    boxSizing: "border-box",
  },
  badge: {
    display: "inline-block",
    margin: 0,
    marginBottom: "16px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(37,99,235,0.18)",
    color: "#93c5fd",
    fontWeight: 700,
    fontSize: "14px",
  },
  title: {
    fontSize: "52px",
    lineHeight: 1.1,
    margin: "0 0 16px",
  },
  text: {
    fontSize: "18px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.78)",
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: "14px",
    marginTop: "28px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "48px",
    padding: "12px 22px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "48px",
    padding: "12px 22px",
    borderRadius: "12px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
  section: {
    padding: "0 20px 80px",
    display: "flex",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  infoBox: {
    width: "100%",
    maxWidth: "900px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "28px",
    boxSizing: "border-box",
  },
  sectionTitle: {
    margin: "0 0 12px",
    fontSize: "28px",
  },
};