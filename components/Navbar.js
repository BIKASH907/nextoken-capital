export default function Navbar() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: "80px",
        background: "#000000",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "2px solid #f5c842",
      }}
    >
      <div style={{ fontSize: "28px", fontWeight: "900", color: "#f5c842" }}>
        NXT
      </div>

      <div style={{ display: "flex", gap: "24px", fontSize: "16px" }}>
        <span>Markets</span>
        <span>Exchange</span>
        <span>Bonds</span>
        <span>Equity & IPO</span>
        <span>Tokenize</span>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          style={{
            height: "42px",
            padding: "0 18px",
            background: "transparent",
            color: "#fff",
            border: "1px solid #666",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Log In
        </button>

        <button
          style={{
            height: "42px",
            padding: "0 18px",
            background: "#f5c842",
            color: "#111",
            border: "none",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}