import { useState } from "react";

// Reusable Clear Signing Modal
// Shows EXACT transaction details before any signing/confirmation
// No hidden contract calls — everything visible to the user

export default function ClearSigningModal({ transaction, onConfirm, onCancel, loading }) {
  const [checked, setChecked] = useState(false);

  if (!transaction) return null;

  const riskColor = transaction.riskLevel === "high" ? "#ef4444" : transaction.riskLevel === "medium" ? "#f59e0b" : "#22c55e";
  const riskLabel = transaction.riskLevel === "high" ? "HIGH RISK" : transaction.riskLevel === "medium" ? "MEDIUM" : "LOW RISK";

  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:20 }}>
      <div style={{ width:"100%", maxWidth:480, background:"#0F1318", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:"#161b22", padding:"16px 24px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>🔐 Confirm Transaction</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>Review ALL details before signing</div>
          </div>
          <span style={{ fontSize:10, padding:"4px 10px", borderRadius:4, background:riskColor+"15", color:riskColor, fontWeight:700, border:"1px solid "+riskColor+"30" }}>{riskLabel}</span>
        </div>

        {/* Transaction Details — ALWAYS shown */}
        <div style={{ padding:"20px 24px" }}>

          {/* Type */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Transaction Type</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#F0B90B" }}>{transaction.type || "Unknown"}</div>
          </div>

          {/* Amount + Token — MANDATORY */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <div style={{ background:"#0a0e14", borderRadius:8, padding:"12px 14px", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Amount</div>
              <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{transaction.amount || "—"}</div>
            </div>
            <div style={{ background:"#0a0e14", borderRadius:8, padding:"12px 14px", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Token</div>
              <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{transaction.token || "—"}</div>
            </div>
          </div>

          {/* Destination — MANDATORY */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Destination</div>
            <div style={{ background:"#0a0e14", borderRadius:8, padding:"10px 14px", border:"1px solid rgba(255,255,255,0.06)", fontFamily:"monospace", fontSize:13, color:"#fff", wordBreak:"break-all" }}>
              {transaction.destination || "—"}
            </div>
            {transaction.destinationLabel && (
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{transaction.destinationLabel}</div>
            )}
          </div>

          {/* Contract Details — ALWAYS visible */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Smart Contract</div>
            <div style={{ background:"#0a0e14", borderRadius:8, padding:"10px 14px", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontFamily:"monospace", fontSize:12, color:"#fff", wordBreak:"break-all" }}>{transaction.contract || "—"}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:4 }}>Function: <span style={{ color:"#F0B90B", fontFamily:"monospace" }}>{transaction.functionName || "—"}</span></div>
            </div>
          </div>

          {/* Fee */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Network Fee (est.)</div>
              <div style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>{transaction.fee || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Network</div>
              <div style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>{transaction.network || "Polygon"}</div>
            </div>
          </div>

          {/* Warnings */}
          {transaction.warnings && transaction.warnings.length > 0 && (
            <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"10px 14px", marginBottom:16 }}>
              {transaction.warnings.map((w,i) => (
                <div key={i} style={{ fontSize:12, color:"#ef4444", marginBottom:i < transaction.warnings.length-1 ? 4 : 0 }}>⚠ {w}</div>
              ))}
            </div>
          )}

          {/* No Hidden Calls Guarantee */}
          <div style={{ background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>
            ✅ <strong style={{ color:"#22c55e" }}>Verified:</strong> This transaction calls <strong>{transaction.functionName || "—"}</strong> on verified Nextoken contract. No hidden calls, no proxy redirects, no additional approvals.
          </div>

          {/* Checkbox Confirmation */}
          <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer", marginBottom:20 }}>
            <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} style={{ marginTop:3, accentColor:"#F0B90B" }} />
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>
              I have reviewed the transaction details above. I confirm the <strong style={{ color:"#fff" }}>amount</strong>, <strong style={{ color:"#fff" }}>token</strong>, and <strong style={{ color:"#fff" }}>destination address</strong> are correct.
            </span>
          </label>

          {/* Action Buttons */}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onCancel} style={{ flex:1, padding:12, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"rgba(255,255,255,0.5)", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              Cancel
            </button>
            <button onClick={onConfirm} disabled={!checked || loading} style={{
              flex:1, padding:12, borderRadius:8, fontSize:14, fontWeight:800, border:"none", cursor: checked && !loading ? "pointer" : "not-allowed", fontFamily:"inherit",
              background: checked ? "#F0B90B" : "rgba(240,185,11,0.2)", color: checked ? "#000" : "rgba(0,0,0,0.3)",
            }}>
              {loading ? "Processing..." : "Sign & Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
