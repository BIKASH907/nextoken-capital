import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";

const CATS = { photos:"📸 Photos", legal:"⚖️ Legal", financial:"💰 Financial", operational:"🏗️ Operational", compliance:"🔐 Compliance", technical:"⛓️ Technical" };

export default function AdminAssetDocs() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [docs, setDocs] = useState([]);
  const [filter, setFilter] = useState({ category: "", status: "pending" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = localStorage.getItem("adminToken"); if (!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if (token) load(); }, [token, filter]);

  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => {
    const q = new URLSearchParams();
    if (filter.category) q.set("category", filter.category);
    if (filter.status) q.set("status", filter.status);
    fetch("/api/admin/asset-documents?" + q, { headers }).then(r => r.json()).then(d => setDocs(d.documents || [])).finally(() => setLoading(false));
  };

  const review = async (docId, action, note, visibility) => {
    const r = await fetch("/api/admin/asset-documents", { method: "POST", headers, body: JSON.stringify({ docId, action, note, visibility }) });
    const d = await r.json();
    setMsg(r.ok ? d.message : d.error);
    load();
  };

  const badge = (s) => { const c = { pending: "#f59e0b", approved: "#22c55e", rejected: "#ef4444" }; return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: (c[s] || "#666") + "15", color: c[s] || "#666", fontWeight: 700 }}>{s}</span>; };
  const visBadge = (v) => { const c = { public: "#22c55e", investors_only: "#3b82f6", admin_only: "#f59e0b" }; const l = { public: "Public", investors_only: "Investors Only", admin_only: "Admin Only" }; return <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: (c[v] || "#666") + "15", color: c[v] || "#666", fontWeight: 600 }}>{l[v] || v}</span>; };

  return (
    <AdminShell title="Asset Document Review" subtitle="Review, approve, and set visibility for issuer documents.">
      {msg && <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#22c55e", marginBottom: 16 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })} style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 10px", color: "#fff", fontSize: 12, fontFamily: "inherit" }}>
          <option value="">All Categories</option>
          {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 10px", color: "#fff", fontSize: 12, fontFamily: "inherit" }}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        {loading ? <div style={{ padding: 30, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</div>
        : docs.length === 0 ? <div style={{ padding: 30, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No documents to review</div>
        : docs.map((d, i) => (
          <div key={i} style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <a href={d.fileUrl} target="_blank" rel="noopener" style={{ color: "#F0B90B", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>{d.fileName}</a>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{CATS[d.category] || d.category} · {d.docType} · {new Date(d.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {visBadge(d.visibility)}
                {badge(d.status)}
              </div>
            </div>
            {d.status === "pending" && (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => review(d._id, "approve", "", "public")} style={{ padding: "4px 12px", borderRadius: 4, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Approve (Public)</button>
                <button onClick={() => review(d._id, "approve", "", "investors_only")} style={{ padding: "4px 12px", borderRadius: 4, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Approve (Investors Only)</button>
                <button onClick={() => { const n = prompt("Rejection reason:"); if (n) review(d._id, "reject", n); }} style={{ padding: "4px 12px", borderRadius: 4, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Reject</button>
              </div>
            )}
            {d.reviewNote && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Note: {d.reviewNote}</div>}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
