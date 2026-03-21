import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div style={{ background: "#05060a", minHeight: "100vh", color: "white", fontFamily: "sans-serif" }}>
      <Navbar />
      <main style={styles.hero}>
        <div style={styles.content}>
          <h4 style={styles.eyebrow}>CAPITAL SOLUTIONS FOR MODERN MARKETS</h4>
          <h1 style={styles.headline}>
            Connecting Investors,<br />
            Opportunities, and <br />
            <span style={{ color: "#F0B90B" }}>Financial Access</span>
          </h1>
          <p style={styles.subtext}>
            Nextoken Capital delivers a modern platform experience for market access, 
            capital solutions, investment visibility, and structured financial services.
          </p>
          <div style={styles.btnGroup}>
            <button style={styles.mainBtn}>Explore Markets</button>
            <button style={styles.secBtn}>Tokenize Assets</button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  hero: { display: "flex", justifyContent: "center", alignItems: "center", padding: "120px 20px", textAlign: "center" },
  content: { maxWidth: "950px" },
  eyebrow: { color: "#F0B90B", fontSize: "14px", fontWeight: "700", letterSpacing: "3px", marginBottom: "25px" },
  headline: { fontSize: "82px", fontWeight: "800", lineHeight: "1.05", marginBottom: "35px", letterSpacing: "-2px" },
  subtext: { fontSize: "20px", color: "#888", lineHeight: "1.6", marginBottom: "50px", maxWidth: "750px", margin: "0 auto 50px auto" },
  btnGroup: { display: "flex", gap: "20px", justifyContent: "center" },
  mainBtn: { background: "#F0B90B", color: "#000", padding: "18px 45px", borderRadius: "10px", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer" },
  secBtn: { background: "rgba(255,255,255,0.05)", color: "#fff", padding: "18px 45px", borderRadius: "10px", border: "1px solid #333", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }
};
