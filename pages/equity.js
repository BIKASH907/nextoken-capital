import Head from "next/head";
import Link from "next/link";

const stats = [
  { value: "12", label: "Live Equity Pipelines" },
  { value: "28", label: "Issuer Reviews" },
  { value: "9", label: "IPO Readiness Tracks" },
  { value: "4.6K", label: "Investor Interest Signals" },
];

const featuredDeals = [
  {
    code: "NGTI",
    title: "Nextoken Growth Token IPO",
    meta: "Token IPO • EU Regulated",
    status: "New",
    description:
      "Primary issuance presentation designed for growth-stage opportunities with a clear investor-facing structure.",
    detail1: "Price",
    value1: "€12.30",
    detail2: "Interest",
    value2: "Rising",
  },
  {
    code: "VPOP",
    title: "Vilnius Prime Office Portfolio",
    meta: "Real Estate • Vilnius, Lithuania",
    status: "Live",
    description:
      "Institutional-style presentation for issuer visibility, asset context, and structured offering communication.",
    detail1: "Price",
    value1: "€104.20",
    detail2: "Demand",
    value2: "Strong",
  },
  {
    code: "LCIF",
    title: "Logistics Chain Income Fund",
    meta: "Infrastructure • Central Europe",
    status: "Live",
    description:
      "A cleaner interface for showing offering summaries, market context, and investor-ready access points.",
    detail1: "Price",
    value1: "€112.08",
    detail2: "Liquidity",
    value2: "High",
  },
];

const workflow = [
  {
    step: "01",
    title: "Issuer Readiness",
    text: "Present company background, offering direction, and key preparation steps in a structured format.",
  },
  {
    step: "02",
    title: "Onboarding & KYC",
    text: "Make onboarding and verification steps visible so the page feels process-driven and credible.",
  },
  {
    step: "03",
    title: "Compliance Review",
    text: "Show documentation and review stages with a layout that supports trust and transparency.",
  },
  {
    step: "04",
    title: "Investor Access",
    text: "Create a more polished way for users to review opportunities and follow offering progress.",
  },
];

const insights = [
  {
    title: "Issuer Dashboard View",
    text: "A stronger visual section for onboarding progress, document flow, and readiness milestones.",
  },
  {
    title: "Offering Overview",
    text: "A cleaner block for presenting investment summary, project category, and current workflow stage.",
  },
  {
    title: "Investor Updates",
    text: "A more trustworthy layout for showing updates, timelines, and opportunity visibility.",
  },
];

export default function EquityIpoPage() {
  return (
    <>
      <Head>
        <title>Equity & IPO | Nextoken Capital</title>
        <meta
          name="description"
          content="Equity and IPO presentation page for Nextoken Capital with issuer onboarding, compliance workflow, and investor-focused offering design."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={styles.page}>
        <section style={styles.heroSection}>
          <div style={styles.container}>
            <div style={styles.heroGrid}>
              <div style={styles.heroLeft}>
                <p style={styles.badge}>Capital Markets</p>
                <h1 style={styles.title}>Equity & IPO</h1>
                <p style={styles.text}>
                  Nextoken Capital supports modern equity offerings and public
                  market readiness with a more structured, trustworthy, and
                  investor-focused digital experience.
                </p>

                <div style={styles.actions}>
                  <Link href="/" style={styles.primaryBtn}>
                    Back to Home
                  </Link>
                  <a href="#featured" style={styles.secondaryBtn}>
                    Explore Offerings
                  </a>
                </div>

                <div style={styles.statsGrid}>
                  {stats.map((item) => (
                    <div key={item.label} style={styles.statCard}>
                      <span style={styles.statValue}>{item.value}</span>
                      <span style={styles.statLabel}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.heroRight}>
                <div style={styles.previewCard}>
                  <div style={styles.previewTop}>
                    <span style={styles.previewPill}>Equity Workflow</span>
                    <span style={styles.previewStatus}>Active</span>
                  </div>

                  <h3 style={styles.previewTitle}>Issuer Presentation Layer</h3>
                  <p style={styles.previewText}>
                    A professional equity page should connect opportunity
                    summary, onboarding, review stages, and investor access in
                    one clear interface.
                  </p>

                  <div style={styles.previewMetrics}>
                    <div style={styles.previewMetricCard}>
                      <span style={styles.metricLabel}>Onboarding</span>
                      <strong style={styles.metricValue}>Structured</strong>
                    </div>
                    <div style={styles.previewMetricCard}>
                      <span style={styles.metricLabel}>Compliance</span>
                      <strong style={styles.metricValue}>Visible</strong>
                    </div>
                    <div style={styles.previewMetricCard}>
                      <span style={styles.metricLabel}>Investor View</span>
                      <strong style={styles.metricValue}>Enhanced</strong>
                    </div>
                    <div style={styles.previewMetricCard}>
                      <span style={styles.metricLabel}>Offering Flow</span>
                      <strong style={styles.metricValue}>Clear</strong>
                    </div>
                  </div>

                  <div style={styles.progressWrap}>
                    <div style={styles.progressRow}>
                      <span style={styles.progressLabel}>Issuer onboarding</span>
                      <div style={styles.progressBar}>
                        <div style={{ ...styles.progressFill, width: "86%" }} />
                      </div>
                    </div>
                    <div style={styles.progressRow}>
                      <span style={styles.progressLabel}>KYC review</span>
                      <div style={styles.progressBar}>
                        <div style={{ ...styles.progressFill, width: "74%" }} />
                      </div>
                    </div>
                    <div style={styles.progressRow}>
                      <span style={styles.progressLabel}>Offer visibility</span>
                      <div style={styles.progressBar}>
                        <div style={{ ...styles.progressFill, width: "82%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="featured" style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <p style={styles.sectionTag}>Featured Opportunities</p>
              <h2 style={styles.sectionTitle}>Equity content connected to platform themes</h2>
              <p style={styles.sectionText}>
                This page now feels closer to the Exchange experience by using a
                similar card structure, strong hierarchy, and platform-connected
                offering sections.
              </p>
            </div>

            <div style={styles.dealsGrid}>
              {featuredDeals.map((item) => (
                <div key={item.code} style={styles.dealCard}>
                  <div style={styles.dealTop}>
                    <div>
                      <span style={styles.dealCode}>{item.code}</span>
                      <h3 style={styles.dealTitle}>{item.title}</h3>
                      <p style={styles.dealMeta}>{item.meta}</p>
                    </div>
                    <span style={styles.dealStatus}>{item.status}</span>
                  </div>

                  <p style={styles.dealText}>{item.description}</p>

                  <div style={styles.dealBottom}>
                    <div>
                      <span style={styles.dealLabel}>{item.detail1}</span>
                      <strong style={styles.dealValue}>{item.value1}</strong>
                    </div>
                    <div>
                      <span style={styles.dealLabel}>{item.detail2}</span>
                      <strong style={styles.dealValue}>{item.value2}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.sectionAlt}>
          <div style={styles.container}>
            <div style={styles.workflowGrid}>
              <div>
                <p style={styles.sectionTag}>Offering Workflow</p>
                <h2 style={styles.sectionTitle}>A more trustworthy equity journey</h2>
                <p style={styles.sectionText}>
                  Instead of a placeholder section, this layout shows the
                  sequence users expect on a serious capital markets platform:
                  issuer preparation, onboarding, review, and investor access.
                </p>
              </div>

              <div style={styles.workflowCards}>
                {workflow.map((item) => (
                  <div key={item.step} style={styles.workflowCard}>
                    <div style={styles.workflowStep}>{item.step}</div>
                    <div>
                      <h3 style={styles.workflowTitle}>{item.title}</h3>
                      <p style={styles.workflowText}>{item.text}</p>
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
              <p style={styles.sectionTag}>Platform Sections</p>
              <h2 style={styles.sectionTitle}>What makes this page look more real</h2>
              <p style={styles.sectionText}>
                These blocks help the Equity & IPO page feel connected to the
                wider Nextoken Capital product experience.
              </p>
            </div>

            <div style={styles.insightsGrid}>
              {insights.map((item) => (
                <div key={item.title} style={styles.insightCard}>
                  <h3 style={styles.insightTitle}>{item.title}</h3>
                  <p style={styles.insightText}>{item.text}</p>
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
                <h2 style={styles.ctaTitle}>Build a stronger Equity & IPO presence</h2>
                <p style={styles.ctaText}>
                  Present offerings, issuer readiness, compliance steps, and
                  investor-facing information in a way that feels aligned with
                  the rest of the platform.
                </p>
              </div>

              <div style={styles.ctaActions}>
                <Link href="/exchange" style={styles.primaryBtn}>
                  Open Exchange
                </Link>
                <Link href="/markets" style={styles.secondaryBtn}>
                  View Markets
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
    background: "linear-gradient(180deg, #050816 0%, #07111f 48%, #091427 100%)",
    color: "#ffffff",
    fontFamily: "Arial, Helvetica, sans-serif",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "0 20px",
    boxSizing: "border-box",
  },
  heroSection: {
    padding: "52px 0 76px",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at top right, rgba(37,99,235,0.16), transparent 28%), radial-gradient(circle at left center, rgba(6,182,212,0.12), transparent 24%)",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: "24px",
    alignItems: "stretch",
  },
  heroLeft: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    padding: "42px",
    boxShadow: "0 14px 48px rgba(0,0,0,0.24)",
    boxSizing: "border-box",
  },
  heroRight: {
    display: "flex",
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
    boxShadow: "0 10px 26px rgba(37,99,235,0.28)",
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
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "34px",
  },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "16px",
    boxSizing: "border-box",
  },
  statValue: {
    display: "block",
    fontSize: "24px",
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
  previewCard: {
    width: "100%",
    background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    padding: "26px",
    boxShadow: "0 14px 48px rgba(0,0,0,0.24)",
    boxSizing: "border-box",
  },
  previewTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    marginBottom: "16px",
  },
  previewPill: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "32px",
    padding: "0 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.06)",
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: 700,
  },
  previewStatus: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "32px",
    padding: "0 12px",
    borderRadius: "999px",
    background: "rgba(34,197,94,0.16)",
    color: "#86efac",
    fontSize: "12px",
    fontWeight: 700,
  },
  previewTitle: {
    margin: "0 0 10px",
    fontSize: "24px",
    fontWeight: 800,
  },
  previewText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.74)",
  },
  previewMetrics: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "18px",
    marginBottom: "18px",
  },
  previewMetricCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "16px",
  },
  metricLabel: {
    display: "block",
    fontSize: "12px",
    color: "rgba(255,255,255,0.56)",
    marginBottom: "8px",
  },
  metricValue: {
    fontSize: "16px",
    color: "#ffffff",
  },
  progressWrap: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "16px",
  },
  progressRow: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: "12px",
    alignItems: "center",
    marginBottom: "12px",
  },
  progressLabel: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.72)",
  },
  progressBar: {
    width: "100%",
    height: "10px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
  },
  section: {
    padding: "30px 0 80px",
    boxSizing: "border-box",
  },
  sectionAlt: {
    padding: "80px 0",
    background: "rgba(255,255,255,0.02)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
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
  dealsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },
  dealCard: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
  },
  dealTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "14px",
  },
  dealCode: {
    display: "inline-block",
    marginBottom: "8px",
    color: "#93c5fd",
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.08em",
  },
  dealTitle: {
    margin: "0 0 6px",
    fontSize: "22px",
    lineHeight: 1.25,
    fontWeight: 800,
  },
  dealMeta: {
    margin: 0,
    fontSize: "14px",
    color: "rgba(255,255,255,0.58)",
  },
  dealStatus: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "32px",
    padding: "0 12px",
    borderRadius: "999px",
    background: "rgba(37,99,235,0.16)",
    color: "#93c5fd",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  dealText: {
    margin: "0 0 16px",
    fontSize: "15px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.74)",
  },
  dealBottom: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },
  dealLabel: {
    display: "block",
    fontSize: "12px",
    color: "rgba(255,255,255,0.56)",
    marginBottom: "8px",
  },
  dealValue: {
    fontSize: "17px",
    color: "#ffffff",
  },
  workflowGrid: {
    display: "grid",
    gridTemplateColumns: "0.9fr 1.1fr",
    gap: "24px",
    alignItems: "start",
  },
  workflowCards: {
    display: "grid",
    gap: "14px",
  },
  workflowCard: {
    display: "grid",
    gridTemplateColumns: "72px 1fr",
    gap: "16px",
    alignItems: "start",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "20px",
  },
  workflowStep: {
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
  workflowTitle: {
    margin: "2px 0 8px",
    fontSize: "20px",
    fontWeight: 800,
  },
  workflowText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.72)",
  },
  insightsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },
  insightCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  },
  insightTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
    fontWeight: 800,
  },
  insightText: {
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
    background: "linear-gradient(135deg, rgba(37,99,235,0.16), rgba(6,182,212,0.12))",
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