// pages/admin/kyb.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminKYB() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [issuers, setIssuers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("adminEmployee");
    if (!stored) return router.push("/admin/login");
    const emp = JSON.parse(stored);
    setEmployee(emp);
    fetchIssuers(emp.token || localStorage.getItem("adminToken"));
  }, []);

  async function fetchIssuers(token) {
    setLoading(true);
    try {
      const t = token || localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/kyb", {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIssuers(data.issuers || []);
      }
    } catch (err) {
      console.error("Failed to fetch issuers:", err);
    }
    setLoading(false);
  }

  async function updateKYB(userId, status) {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/kyb", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, kybStatus: status, comment }),
      });
      if (res.ok) {
        setMsg(`KYB ${status} successfully`);
        setComment("");
        fetchIssuers(token);
        if (selected && selected._id === userId) {
          setSelected((prev) => ({ ...prev, kybStatus: status }));
        }
      } else {
        const err = await res.json();
        setMsg(err.error || "Failed to update");
      }
    } catch {
      setMsg("Network error");
    }
    setTimeout(() => setMsg(""), 4000);
  }

  const filtered = issuers.filter((u) => {
    const matchFilter = filter === "all" || u.kybStatus === filter;
    const matchSearch =
      !search ||
      `${u.firstName} ${u.lastName} ${u.email} ${u.companyName || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: issuers.length,
    pending: issuers.filter((u) => u.kybStatus === "pending").length,
    approved: issuers.filter((u) => u.kybStatus === "approved").length,
    rejected: issuers.filter((u) => u.kybStatus === "rejected").length,
    under_review: issuers.filter((u) => u.kybStatus === "under_review").length,
  };

  if (!employee) return null;

  return (
    <>
      <Head>
        <title>KYB Review | Nextoken Admin</title>
      </Head>
      <style jsx global>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0D1117; color:#fff; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
        .layout { display:flex; min-height:100vh; }
        .main { flex:1; padding:32px; margin-left:240px; }
        .page-title { font-size:22px; font-weight:900; margin-bottom:4px; }
        .page-sub { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:24px; }
        .grid-2 { display:grid; grid-template-columns:1fr 1.2fr; gap:24px; }
        .card { background:#161B22; border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:20px; }
        .filter-bar { display:flex; gap:6px; margin-bottom:16px; flex-wrap:wrap; }
        .filter-btn { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:6px 14px; font-size:12px; color:rgba(255,255,255,0.5); cursor:pointer; transition:all .15s; }
        .filter-btn:hover { border-color:rgba(240,185,11,0.3); color:#F0B90B; }
        .filter-btn.active { background:rgba(240,185,11,0.1); border-color:rgba(240,185,11,0.3); color:#F0B90B; }
        .search-input { width:100%; background:#0D1117; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px 14px; font-size:13px; color:#fff; outline:none; margin-bottom:12px; }
        .search-input:focus { border-color:rgba(240,185,11,0.4); }
        .user-row { display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.04); cursor:pointer; transition:background .15s; border-radius:8px; }
        .user-row:hover { background:rgba(255,255,255,0.03); }
        .user-row.active { background:rgba(240,185,11,0.06); border:1px solid rgba(240,185,11,0.15); }
        .badge { padding:3px 10px; border-radius:6px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.3px; }
        .badge-green { background:rgba(14,203,129,0.1); color:#0ECB81; }
        .badge-yellow { background:rgba(240,185,11,0.1); color:#F0B90B; }
        .badge-red { background:rgba(255,77,77,0.1); color:#ff6b6b; }
        .badge-blue { background:rgba(59,130,246,0.1); color:#3B82F6; }
        .badge-gray { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.4); }
        .detail-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); font-size:13px; }
        .detail-row .lbl { color:rgba(255,255,255,0.4); }
        .detail-row span:last-child { font-weight:500; }
        .section-title { font-size:12px; font-weight:700; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:.5px; margin:20px 0 10px; }
        .doc-link { display:inline-block; background:rgba(240,185,11,0.06); border:1px solid rgba(240,185,11,0.15); border-radius:8px; padding:8px 14px; font-size:12px; color:#F0B90B; text-decoration:none; margin:4px 4px 4px 0; transition:all .15s; }
        .doc-link:hover { background:rgba(240,185,11,0.12); border-color:rgba(240,185,11,0.3); }
        .textarea { width:100%; background:#0D1117; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px 14px; font-size:13px; color:#fff; outline:none; font-family:inherit; resize:vertical; min-height:70px; margin-top:8px; }
        .textarea:focus { border-color:rgba(240,185,11,0.4); }
        .btn { padding:8px 20px; border-radius:8px; font-size:13px; font-weight:600; border:none; cursor:pointer; transition:all .15s; }
        .btn-green { background:rgba(14,203,129,0.15); color:#0ECB81; }
        .btn-green:hover { background:rgba(14,203,129,0.25); }
        .btn-red { background:rgba(255,77,77,0.12); color:#ff6b6b; }
        .btn-red:hover { background:rgba(255,77,77,0.22); }
        .btn-blue { background:rgba(59,130,246,0.12); color:#3B82F6; }
        .btn-blue:hover { background:rgba(59,130,246,0.22); }
        .btn-gray { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5); }
        .btn-gray:hover { background:rgba(255,255,255,0.1); }
        .success-msg { background:rgba(14,203,129,0.1); border:1px solid rgba(14,203,129,0.2); border-radius:8px; padding:10px 14px; font-size:13px; color:#0ECB81; margin-top:12px; }
        .error-msg { background:rgba(255,77,77,0.1); border:1px solid rgba(255,77,77,0.2); border-radius:8px; padding:10px 14px; font-size:13px; color:#ff6b6b; margin-top:12px; }
        .empty { text-align:center; padding:40px; color:rgba(255,255,255,0.25); font-size:14px; }
        .loading { text-align:center; padding:60px; color:rgba(255,255,255,0.3); }
        .asset-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:12px 14px; margin-bottom:8px; }
        .asset-card-title { font-size:13px; font-weight:600; margin-bottom:4px; }
        .asset-card-meta { font-size:11px; color:rgba(255,255,255,0.4); }
        @media(max-width:900px) { .grid-2 { grid-template-columns:1fr; } .main { margin-left:0; padding:16px; } }
      `}</style>

      <div className="layout">
        <AdminSidebar />
        <div className="main">
          <div className="page-title">KYB Review</div>
          <div className="page-sub">
            Review business verification for issuers who registered to tokenize assets
          </div>

          <div className="filter-bar">
            {["all", "pending", "under_review", "approved", "rejected"].map((f) => (
              <button
                key={f}
                className={`filter-btn${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "under_review" ? "Under Review" : f.charAt(0).toUpperCase() + f.slice(1)} (
                {counts[f] || 0})
              </button>
            ))}
          </div>

          <div className="grid-2">
            {/* LEFT — Issuer list */}
            <div>
              <input
                className="search-input"
                placeholder="Search by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="card" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {loading ? (
                  <div className="loading">Loading issuers...</div>
                ) : filtered.length === 0 ? (
                  <div className="empty">
                    No {filter !== "all" ? filter : ""} issuer registrations found
                  </div>
                ) : (
                  filtered.map((u) => (
                    <div
                      className={`user-row${selected?._id === u._id ? " active" : ""}`}
                      key={u._id}
                      onClick={() => {
                        setSelected(u);
                        setMsg("");
                        setComment("");
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {u.companyName || `${u.firstName} ${u.lastName}`}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                          {u.email} · {u.country || "N/A"}
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                          Registered {new Date(u.createdAt).toLocaleDateString()} ·{" "}
                          {u.assets?.length || 0} asset(s)
                        </div>
                      </div>
                      <span
                        className={`badge badge-${
                          u.kybStatus === "approved"
                            ? "green"
                            : u.kybStatus === "pending"
                            ? "yellow"
                            : u.kybStatus === "rejected"
                            ? "red"
                            : u.kybStatus === "under_review"
                            ? "blue"
                            : "gray"
                        }`}
                      >
                        {u.kybStatus || "pending"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT — Detail panel */}
            <div>
              {!selected ? (
                <div className="card" style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.25)" }}>
                  Select an issuer to review their KYB
                </div>
              ) : (
                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>
                        {selected.companyName || `${selected.firstName} ${selected.lastName}`}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                        {selected.accountType || "issuer"}
                      </div>
                    </div>
                    <span
                      className={`badge badge-${
                        selected.kybStatus === "approved"
                          ? "green"
                          : selected.kybStatus === "pending"
                          ? "yellow"
                          : selected.kybStatus === "rejected"
                          ? "red"
                          : selected.kybStatus === "under_review"
                          ? "blue"
                          : "gray"
                      }`}
                    >
                      {selected.kybStatus || "pending"}
                    </span>
                  </div>

                  <div className="section-title">Business Information</div>
                  <div className="detail-row"><span className="lbl">Contact Person</span><span>{selected.firstName} {selected.lastName}</span></div>
                  <div className="detail-row"><span className="lbl">Email</span><span>{selected.email}</span></div>
                  <div className="detail-row"><span className="lbl">Phone</span><span>{selected.phone || "N/A"}</span></div>
                  <div className="detail-row"><span className="lbl">Country</span><span>{selected.country || "N/A"}</span></div>
                  <div className="detail-row"><span className="lbl">Company Name</span><span>{selected.companyName || "N/A"}</span></div>
                  <div className="detail-row"><span className="lbl">Registration No.</span><span>{selected.companyRegNumber || "N/A"}</span></div>
                  <div className="detail-row"><span className="lbl">Company Address</span><span>{selected.companyAddress || "N/A"}</span></div>
                  <div className="detail-row"><span className="lbl">Account Type</span><span>{selected.accountType || "issuer"}</span></div>
                  <div className="detail-row"><span className="lbl">Registered</span><span>{new Date(selected.createdAt).toLocaleDateString()}</span></div>
                  <div className="detail-row"><span className="lbl">Wallet</span><span style={{ fontSize: 11, fontFamily: "monospace" }}>{selected.walletAddress || "Not connected"}</span></div>

                  {/* KYB Documents */}
                  <div className="section-title">KYB Documents</div>
                  {selected.kybDocuments && selected.kybDocuments.length > 0 ? (
                    <div style={{ marginBottom: 12 }}>
                      {selected.kybDocuments.map((doc, i) => (
                        <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="doc-link">
                          📄 {doc.type || doc.name || `Document ${i + 1}`}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>
                      No KYB documents uploaded yet
                    </div>
                  )}

                  {/* Submitted Assets */}
                  <div className="section-title">Submitted Assets ({selected.assets?.length || 0})</div>
                  {selected.assets && selected.assets.length > 0 ? (
                    selected.assets.map((asset, i) => (
                      <div className="asset-card" key={asset._id || i}>
                        <div className="asset-card-title">{asset.name} ({asset.ticker})</div>
                        <div className="asset-card-meta">
                          {asset.assetType} · €{Number(asset.targetRaise || 0).toLocaleString()} target · {asset.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>
                      No assets submitted yet
                    </div>
                  )}

                  {/* Admin Actions */}
                  <div className="section-title">Admin Action</div>
                  <textarea
                    className="textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a note (optional — sent to issuer on status change)"
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button className="btn btn-green" onClick={() => updateKYB(selected._id, "approved")}>
                      ✓ Approve KYB
                    </button>
                    <button className="btn btn-blue" onClick={() => updateKYB(selected._id, "under_review")}>
                      ⏳ Under Review
                    </button>
                    <button className="btn btn-red" onClick={() => updateKYB(selected._id, "rejected")}>
                      ✕ Reject
                    </button>
                    <button className="btn btn-gray" onClick={() => updateKYB(selected._id, "pending")}>
                      Reset
                    </button>
                  </div>
                  {msg && (
                    <div className={msg.includes("successfully") ? "success-msg" : "error-msg"}>{msg}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}