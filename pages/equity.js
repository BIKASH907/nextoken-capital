import Head from "next/head";
import Link from "next/link";

const highlights = [
  {
    title: "Issuer Readiness",
    text: "Structured preparation for companies planning to present an equity opportunity with stronger visibility, clearer documentation, and a more professional digital presence.",
  },
  {
    title: "Offering Overview",
    text: "A dedicated presentation layer for equity and IPO-related information, helping visitors understand the opportunity, process, and key onboarding steps.",
  },
  {
    title: "Compliance Workflow",
    text: "A cleaner way to present KYC, issuer onboarding, and compliance-related checkpoints so the page feels credible and process-driven.",
  },
  {
    title: "Investor Experience",
    text: "A better interface for reviewing project details, following timelines, and accessing relevant information in a more organized format.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Initial Review",
    text: "Present the project with a clear summary, business context, and offering direction.",
  },
  {
    step: "02",
    title: "Issuer Onboarding",
    text: "Organize identity, entity, and readiness details in a more structured way.",
  },
  {
    step: "03",
    title: "KYC & Compliance",
    text: "Show key onboarding and verification stages in a format that feels transparent and professional.",
  },
  {
    step: "04",
    title: "Offering Visibility",
    text: "Display the opportunity, documentation flow, and investor-facing overview with stronger clarity.",
  },
];

const projectCards = [
  {
    title: "Equity Pipeline",
    text: "A dedicated section to showcase active and upcoming equity opportunities in a more credible and platform-consistent format.",
  },
  {
    title: "Investor Dashboard View",
    text: "A preview-style section that communicates how users can track offering progress, review materials, and follow updates.",
  },
  {
    title: "Digital Capital Markets Flow",
    text: "A page structure that better reflects the site’s broader positioning around modern digital capital markets and connected financial workflows.",
  },
];

export default function EquityIpoPage() {
  return (
    <>
      <Head>
        <title>Equity & IPO | Nextoken Capital</title>
        <meta
          name="description"
          content="Explore Nextoken Capital Equity & IPO workflows, issuer onboarding, compliance presentation, and investor-focused offering experience."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={styles.page}>
        <section style={styles.hero}>
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div style={styles.container}>
            <div style={styles.heroCard}>
              <div style={styles.heroLeft}>
                <p style={styles.badge}>Capital Markets</p>
                <h1 style={styles.title}>Equity & IPO</h1>
                <p style={styles.text}>
                  Nextoken Capital supports modern equity offerings and public
                  market readiness with a clearer, more professional, and
                  investor-focused digital experience.
                </p>

                <div style={styles.actions}>
                  <Link href="/" style={styles.primaryBtn}>
                    Back to Home
                  </Link>
                  <a href="#learn-more" style={styles.secondaryBtn}>
                    Learn More
                  </a>
                </div>

                <div style={styles.heroStats}>
                  <div style={styles.statBox}>
                    <span style={styles.statValue}>Issuer</span>
                    <span style={styles.statLabel}>Onboarding Focus</span>
                  </div>
                  <div style={styles.statBox}>
                    <span style={styles.statValue}>KYC</span>
                    <span style={styles.statLabel}>Process Visibility</span>
                  </div>
                  <div style={styles.statBox}>
                    <span style={styles.statValue}>Investor</span>
                    <span style={styles.statLabel}>Experience Design</span>
                  </div>
                </div>
              </div>

              <div style={styles.heroRight}>
                <div style={styles.previewPanel}>
                  <div style={styles.previewHeader}>
                    <span style={styles.previewDot} />
                    <span style={styles.previewDot} />
                    <span style={styles.previewDot} />
                  </div>

                  <div style={styles.previewBody}>
                    <div style={styles.previewTopCard}>
                      <div>
                        <p style={styles.previewKicker}>Offering Overview</p>
                        <h3 style={styles.previewTitle}>Equity Opportunity</h3>
                      </div>
                      <span style={styles.previewStatus}>Active Workflow</span>
                    </div>

                    <div style={styles.previewGrid}>
                      <div style={styles.previewMiniCard}>
                        <span style={styles.previewMiniLabel}>Stage</span>
                        <strong style={styles.previewMiniValue}>Readiness</strong>
                      </div>
                      <div style={styles.previewMiniCard}>
                        <span style={styles.previewMiniLabel}>Review</span>
                        <strong style={styles.previewMiniValue}>Compliance</strong>
                      </div>
                      <div style={styles.previewMiniCard}>
                        <span style={styles.previewMiniLabel}>Access</span>
                        <strong style={styles.previewMiniValue}>Investor View</strong>
                      </div>
                      <div style={styles.previewMiniCard}>
                        <span style={styles.previewMiniLabel}>Flow</span>
                        <strong style={styles.previewMiniValue}>Dashboard</strong>
                      </div>
                    </div>

                    <div style={styles.previewTimeline}>
                      <div style={styles.timelineRow}>
                        <span style={styles.timelineLabel}>Issuer onboarding</span>
                        <span style={styles.timelineBar}>
                          <span style={{ ...styles.timelineFill, width: "88%" }} />
                        </span>
                      </div>
                      <div style={styles.timelineRow}>
                        <span style={styles.timelineLabel}>KYC review</span>
                        <span style={styles.timelineBar}>
                          <span style={{ ...styles.timelineFill, width: "72%" }} />
                        </span>
                      </div>
                      <div style={styles.timelineRow}>
                        <span style={styles.timelineLabel}>Offering visibility</span>
                        <span style={styles.timelineBar}>
                          <span style={{ ...styles.timelineFill, width: "80%" }} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="learn-more" style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <p style={styles.sectionTag}>Platform Fit</p>
              <h2 style={styles.sectionTitle}>
                A stronger Equity page that matches the rest of the platform
              </h2>
              <p style={styles.sectionText}>
                This version makes the page feel more complete, more credible,
                and closer to the visual quality expected from a modern capital
                markets platform.
              </p>
            </div>

            <div style={styles.highlightGrid}>
              {highlights.map((item) => (
                <div key={item.title} style={styles.highlightCard}>
                  <h3 style={styles.highlightTitle}>{item.title}</h3>
                  <p style={styles.highlightText}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.sectionAlt}>
          <div style={styles.container}>
            <div style={styles.splitLayout}>
              <div>
                <p style={styles.sectionTag}>Process Design</p>
                <h2 style={styles.sectionTitle}>Equity workflow presentation</h2>
                <p style={styles.sectionText}>
                  Instead of placeholder text, the page should present a clear
                  sequence that helps visitors understand readiness, onboarding,
                  compliance, and offering visibility.
                </p>
              </div>

              <div style={styles.processWrap}>
                {processSteps.map((item) => (
                  <div key={item.step} style={styles.processCard}>
                    <div style={styles.processStep}>{item.step}</div>
                    <div>
                      <h3 style={styles.processTitle}>{item.title}</h3>
                      <p style={styles.processText}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <p style={styles.sectionTag}>Project View</p>
              <h2 style={styles.sectionTitle}>Trust-building content blocks</h2>
              <p style={styles.sectionText}>
                These sections make the page look more real by showing how the
                Equity & IPO area can connect to the broader Nextoken Capital
                experience.
              </p>
            </div>

            <div style={styles.projectGrid}>
              {projectCards.map((item) => (
                <div key={item.title} style={styles.projectCard}>
                  <h3 style={styles.projectTitle}>{item.title}</h3>
                  <p style={styles.projectText}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.ctaSection}>
          <div style={styles.container}>
            <div style={styles.ctaCard}>
              <div>
                <p style={styles.sectionTag}>Nextoken Capital</p>
                <h2 style={styles.ctaTitle}>
                  Build a more trustworthy Equity & IPO experience
                </h2>
                <p style={styles.ctaText}>
                  Improve page credibility with clearer sections, better visual
                  hierarchy, and a more professional offering presentation.
                </p>
              </div>

              <div style={styles.ctaActions}>
                <Link href="/" style={styles.primaryBtn}>
                  Return Home
                </Link>
                <Link href="/markets" style={styles.secondaryBtn}>
                  Explore Markets
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #050816 0%, #08101f 42%, #0a1224 100%)",
    color: "#ffffff",
    fontFamily:
      'Inter, Arial, Helvetica, sans-serif',
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "0 20px",
    boxSizing: "border-box",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    padding: "54px 0 72px",
    boxSizing: "border-box",
  },

  heroGlowOne: {
    position: "absolute",
    top: "-120px",
    right: "-80px",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "rgba(37,99,235,0.18)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },

  heroGlowTwo: {
    position: "absolute",
    left: "-100px",
    top: "120px",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background: "rgba(6,182,212,0.14)",
    filter: "blur(70px)",
    pointerEvents: "none",
  },

  heroCard: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: "26px",
    alignItems: "stretch",
  },

  heroLeft: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    padding: "42px",
    boxShadow: "0 16px 50px rgba(0,0,0,0.28)",
    backdropFilter: "blur(10px)",
    boxSizing: "border-box",
  },

  heroRight: {
    display: "flex",
  },

  badge: {
    display: "inline-block",
    margin: 0,
    marginBottom: "18px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(37,99,235,0.18)",
    color: "#93c5fd",
    fontWeight: 700,
    fontSize: "14px",
  },

  title: {
    fontSize: "56px",
    lineHeight: 1.05,
    margin: "0 0 16px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },

  text: {
    fontSize: "18px",
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.78)",
    margin: 0,
  },

  actions: {
    display: "flex",
    gap: "14px",
    marginTop: "30px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50px",
    padding: "12px 22px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    boxShadow: "0 10px 30px rgba(37,99,235,0.32)",
  },

  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50px",
    padding: "12px 22px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },

  heroStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "34px",
  },

  statBox: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "16px",
    boxSizing: "border-box",
  },

  statValue: {
    display: "block",
    fontSize: "18px",
    fontWeight: 800,
    color: "#ffffff",
    marginBottom: "6px",
  },

  statLabel: {
    display: "block",
    fontSize: "13px",
    color: "rgba(255,255,255,0.62)",
    lineHeight: 1.5,
  },

  previewPanel: {
    width: "100%",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    overflow: "hidden",
    boxShadow: "0 16px 50px rgba(0,0,0,0.28)",
    backdropFilter: "blur(10px)",
  },

  previewHeader: {
    display: "flex",
    gap: "8px",
    padding: "18px 18px 0",
  },

  previewDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.35)",
  },

  previewBody: {
    padding: "18px",
  },

  previewTopCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "flex-start",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "18px",
    marginBottom: "16px",
  },

  previewKicker: {
    margin: "0 0 6px",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.55)",
  },

  previewTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 800,
    color: "#ffffff",
  },

  previewStatus: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "32px",
    padding: "0 12px",
    borderRadius: "999px",
    background: "rgba(34,197,94,0.14)",
    color: "#86efac",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  },

  previewMiniCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "16px",
  },

  previewMiniLabel: {
    display: "block",
    fontSize: "12px",
    color: "rgba(255,255,255,0.58)",
    marginBottom: "8px",
  },

  previewMiniValue: {
    fontSize: "16px",
    color: "#ffffff",
  },

  previewTimeline: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "16px",
  },

  timelineRow: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: "12px",
    alignItems: "center",
    marginBottom: "12px",
  },

  timelineLabel: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.72)",
  },

  timelineBar: {
    display: "block",
    width: "100%",
    height: "10px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  timelineFill: {
    display: "block",
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
  },

  section: {
    padding: "28px 0 74px",
    boxSizing: "border-box",
  },

  sectionAlt: {
    padding: "80px 0",
    background: "rgba(255,255,255,0.02)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    boxSizing: "border-box",
  },

  sectionHeader: {
    maxWidth: "760px",
    marginBottom: "28px",
  },

  sectionTag: {
    margin: "0 0 10px",
    color: "#93c5fd",
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  sectionTitle: {
    margin: "0 0 14px",
    fontSize: "40px",
    lineHeight: 1.15,
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },

  sectionText: {
    margin: 0,
    fontSize: "17px",
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.74)",
  },

  highlightGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "18px",
  },

  highlightCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  },

  highlightTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
    fontWeight: 800,
  },

  highlightText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.74)",
  },

  splitLayout: {
    display: "grid",
    gridTemplateColumns: "0.9fr 1.1fr",
    gap: "24px",
    alignItems: "start",
  },

  processWrap: {
    display: "grid",
    gap: "14px",
  },

  processCard: {
    display: "grid",
    gridTemplateColumns: "72px 1fr",
    gap: "16px",
    alignItems: "start",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "20px",
  },

  processStep: {
    width: "72px",
    height: "72px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(37,99,235,0.14)",
    border: "1px solid rgba(37,99,235,0.28)",
    color: "#93c5fd",
    fontWeight: 800,
    fontSize: "20px",
  },

  processTitle: {
    margin: "2px 0 8px",
    fontSize: "20px",
    fontWeight: 800,
  },

  processText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.72)",
  },

  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },

  projectCard: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
  },

  projectTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
    fontWeight: 800,
  },

  projectText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.74)",
  },

  ctaSection: {
    padding: "0 0 88px",
  },

  ctaCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "30px",
    borderRadius: "26px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.16), rgba(6,182,212,0.12))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
  },

  ctaTitle: {
    margin: "0 0 10px",
    fontSize: "34px",
    lineHeight: 1.15,
    fontWeight: 800,
  },

  ctaText: {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.78)",
    maxWidth: "680px",
  },

  ctaActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
};