import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";

export default function ProofOfReserve() {
  const router = useRouter();
  const [token, setToken] = useState("");
  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);

  return (
    <AdminShell title="Proof of Reserve" subtitle="Real-time asset backing verification: on-chain + off-chain.">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
        {[
          { l:"Total AUM", v:"EUR 0", c:"#F0B90B" },
          { l:"On-Chain Verified", v:"EUR 0", c:"#22c55e" },
          { l:"Off-Chain Verified", v:"EUR 0", c:"#3b82f6" },
        ].map((s,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px", textAlign:"center" }}>
            <div style={{ fontSize:24, fontWeight:800, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {["On-chain token supply matches issued tokens","Bank account balances verified monthly","Independent auditor attestation quarterly","Real estate valuations updated semi-annually","Smart contract reserves publicly verifiable"].map((d,i) => (
        <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
          <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
        </div>
      ))}
    </AdminShell>
  );
}
