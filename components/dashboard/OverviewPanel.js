cat << 'EOF' > components/OverviewPanel.js
export default function OverviewPanel({
  user,
  setPanel,
  router,
  gold,
  green,
  red,
  dark2,
  dark3,
  dark4,
  border,
  muted,
}) {
  const statCards = [
    ["Portfolio Value", "€0.00", "Start investing"],
    ["Active Investments", "0", "Browse markets"],
    ["Pending Returns", "€0.00", "No positions yet"],
    ["Assets Issued", "0", "Issue first asset"],
  ];

  const marketRows = [
    ["NXT/EUR", "€1.248", "+3.42%", true, "€2.4M"],
    ["EURO BOND 5Y", "€98.40", "+0.18%", true, "€14.2M"],
    ["RE TOKEN LT", "€245.00", "-0.82%", false, "€890K"],
    ["SME EQUITY A", "€18.75", "+1.20%", true, "€440K"],
    ["GREEN BOND 7Y", "€99.80", "+0.22%", true, "€5.6M"],
  ];

  const quickActions = [
    { label: "+ Tokenize an Asset", target: "tokenize", bg: gold, color: "black" },
    { label: "+ Issue a Bond", target: "issue-bond", bg: dark4, color: "rgba(255,255,255,0.7)" },
    { label: "+ Launch IPO", target: "ipo", bg: dark4, color: "rgba(255,255,255,0.7)" },
    { label: "Open Exchange", target: "/exchange", bg: dark4, color: "rgba(255,255,255,0.7)" },
    { label: "Complete KYC", target: "kyc", bg: dark4, color: "rgba(255,255,255,0.7)" },
  ];

  const openPanelOrRoute = (target) => {
    if (target.startsWith("/")) {
      router.push(target);
    } else {
      setPanel(target);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.5px" }}>
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 17
              ? "afternoon"
              : "evening"}
            {user ? `, ${user.first_name || user.email || "User"}` : ""}
          </div>
          <div style={{ fontSize: "0.78rem", color: muted }}>
            Your Nextoken Capital overview
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPanel("tokenize")}
          style={{
            padding: "0.5rem 1.1rem",
            background: gold,
            color: "black",
            border: "none",
            borderRadius: 6,
            fontSize: "0.78rem",
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          + New Issuance
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1px",
          background: border,
          marginBottom: "1.5rem",
        }}
      >
        {statCards.map(([label, value, caption]) => (
          <div key={label} style={{ background: dark2, padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "0.72rem", color: muted, marginBottom: "0.35rem" }}>
              {label}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
              {value}
            </div>
            <div style={{ fontSize: "0.72rem", color: muted, marginTop: 4 }}>
              {caption}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(560px, 1fr) 280px",
          gap: "1.25rem",
        }}
      >
        <div
          style={{
            background: dark2,
            border: `1px solid ${border}`,
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.25rem",
              borderBottom: `1px solid ${border}`,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>Market Overview</span>
            <span style={{ fontSize: "0.65rem", fontWeight: 600, color: green }}>● Live</span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
            <thead>
              <tr>
                {["Asset", "Price", "24h Change", "Volume"].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "0.6rem 1rem",
                      textAlign: "left",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color: muted,
                      background: dark3,
                      borderBottom: `1px solid ${border}`,
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {marketRows.map(([name, price, change, up, volume]) => (
                <tr key={name}>
                  <td style={{ padding: "0.85rem 1rem", borderBottom: `1px solid ${border}`, fontWeight: 700 }}>
                    {name}
                  </td>
                  <td style={{ padding: "0.85rem 1rem", borderBottom: `1px solid ${border}` }}>
                    {price}
                  </td>
                  <td style={{ padding: "0.85rem 1rem", borderBottom: `1px solid ${border}` }}>
                    <span
                      style={{
                        padding: "2px 7px",
                        borderRadius: 3,
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        background: up ? "rgba(14,203,129,0.1)" : "rgba(246,70,93,0.08)",
                        color: up ? green : red,
                      }}
                    >
                      {change}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1rem", borderBottom: `1px solid ${border}`, color: muted }}>
                    {volume}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            background: dark2,
            border: `1px solid ${border}`,
            borderRadius: 6,
          }}
        >
          <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${border}` }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>Quick Actions</span>
          </div>

          <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {quickActions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => openPanelOrRoute(item.target)}
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  background: item.bg,
                  color: item.color,
                  border: "none",
                  borderRadius: 6,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  textAlign: "left",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
