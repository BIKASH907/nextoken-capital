import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div style={{ background: "#05060a", minHeight: "100vh", color: "white", fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <main style={styles.heroSection}>
        <div style={styles.contentBox}>
          {/* Eyebrow Heading */}
          <h4 style={styles.eyebrow}>CAPITAL SOLUTIONS FOR MODERN MARKETS</h4>
          
          {/* Main Headline */}
          <h1 style={styles.mainHeadline}>
            Connecting Investors,<br />
            Opportunities, and <br />
            <span style={{ color: "#F0B90B" }}>Financial Access</span>
          </h1>
          
          {/* Detailed Description */}
          <p style={styles.description}>
            Nextoken Capital delivers a modern platform experience for market access, 
            capital solutions, investment visibility, and structured financial services.
          </p>

          <div style={styles.buttonGroup}>
            <button style={styles.primaryButton}>Explore Markets</button>
            <button style={styles.secondaryButton}>Learn More</button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  heroSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "120px 20px",
    textAlign: "center",
  },
  contentBox: { maxWidth: "950px" },
  eyebrow: { 
    color: "#F0B90B", 
    fontSize: "14px", 
    fontWeight: "700", 
    letterSpacing: "3px", 
    marginBottom: "24px",
    textTransform: "uppercase"
  },
  mainHeadline: { 
    fontSize: "82px", 
    fontWeight: "800", 
    lineHeight: "1.05", 
    letterSpacing: "-2px",
    marginBottom: "32px"
  },
  description: { 
    fontSize: "20px", 
    color: "#a0a0a0", 
    lineHeight: "1.6", 
    maxWidth: "750px", 
    margin: "0 auto 48px auto",
    fontWeight: "400"
  },
  buttonGroup: { display: "flex", gap: "20px", justifyContent: "center" },
  primaryButton: { 
    background: "#F0B90B", 
    color: "#000", 
    padding: "18px 42px", 
    borderRadius: "10px", 
    border: "none", 
    fontSize: "16px", 
    fontWeight: "bold", 
    cursor: "pointer",
    transition: "0.3s" 
  },
  secondaryButton: { 
    background: "rgba(255,255,255,0.03)", 
    color: "#fff", 
    padding: "18px 42px", 
    borderRadius: "10px", 
    border: "1px solid #333", 
    fontSize: "16px", 
    fontWeight: "bold", 
    cursor: "pointer" 
  }
};
