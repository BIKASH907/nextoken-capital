import { useState } from "react";

const mockData = [
  { name: "Tokenized Real Estate", symbol: "TRE", price: "$120.50", change: "+2.3%" },
  { name: "Green Energy Bond", symbol: "GEB", price: "$98.20", change: "-0.8%" },
  { name: "Equity Token - Tesla", symbol: "TSLA-T", price: "$245.10", change: "+1.5%" },
  { name: "Agro Asset Token", symbol: "AAT", price: "$75.00", change: "+4.2%" },
];

export default function Markets() {
  const [search, setSearch] = useState("");

  const filtered = mockData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#0b0f14", minHeight: "100vh", color: "white", padding: "40px" }}>
      
      {/* Header */}
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>Markets</h1>
      <p style={{ color: "#aaa", marginBottom: "30px" }}>
        Explore tokenized assets, bonds, and equity markets
      </p>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search assets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "6px",
          border: "none",
          marginBottom: "30px",
        }}
      />

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
              <th style={{ padding: "12px" }}>Asset</th>
              <th style={{ padding: "12px" }}>Symbol</th>
              <th style={{ padding: "12px" }}>Price</th>
              <th style={{ padding: "12px" }}>24h Change</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #222",
                  transition: "0.2s",
                }}
              >
                <td style={{ padding: "12px" }}>{item.name}</td>
                <td style={{ padding: "12px" }}>{item.symbol}</td>
                <td style={{ padding: "12px" }}>{item.price}</td>
                <td
                  style={{
                    padding: "12px",
                    color: item.change.includes("+") ? "#00ff9d" : "#ff4d4f",
                  }}
                >
                  {item.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <p style={{ marginTop: "30px", color: "#666" }}>
        Data shown is demo. Live market integration coming soon.
      </p>
    </div>
  );
}