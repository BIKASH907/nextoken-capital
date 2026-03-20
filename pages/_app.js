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
        <section style={styles.hero}>
          <div style={styles.card}>
            <p style={styles.badge}>Capital Markets</p>
            <h1 style={styles.title}>Equity & IPO</h1>
            <p style={styles.text}>
              Nextoken Capital supports modern equity offerings and public market
              readiness with a clear, investor-focused digital experience.
            </p>

            <div style={styles.actions}>
              <Link href="/" style={styles.primaryBtn}>
                Back to Home
              </Link>
              <a href="#learn-more" style={styles.secondaryBtn}>
                Learn More
              </a>
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