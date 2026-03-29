// pages/admin/kyc.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminKYC() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [viewDoc, setViewDoc] = useState(null); // document being previewed

  useEffect(() => {
    const stored = localStorage.getItem("adminEmployee");
    if (!stored) return router.push("/admin/login");
    const emp = JSON.parse(stored);
    setEmployee(emp);
    fetchUsers(emp.token || localStorage.getItem("adminToken"));
  }, []);

  async function fetchUsers(token) {
    setLoading(true);
    try {
      const t = token || localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || data || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
    setLoading(false);
  }

  async function updateKYC(userId, status) {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/kyc/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ kycStatus: status, comment }),
      });
      if (res.ok) {
        setMsg(`KYC ${status} successfully`);
        setComment("");
        fetchUsers(token);
        if (selected && selected._id === userId) {
          setSelected((prev) => ({ ...prev, kycStatus: status }));
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

  const filtered = users.filter((u) => {
    const matchFilter = filter === "all" || u.kycStatus === filter;
    const matchSearch =
      !search ||
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: users.length,
    pending: users.filter((u) => u.kycStatus === "pending").length,
    approved: users.filter((u) => u.kycStatus === "approved").length,
    rejected: users.filter((u) => u.kycStatus === "rejected").length,
  };

  function getDocIcon(doc) {
    const url = (doc.url || doc.path || "").toLowerCase();
    const type = (doc.type || doc.name || "").toLowerCase();
    if (url.endsWith(".pdf") || type.includes("pdf")) return "📋";
    if (url.match(/\.(jpg|jpeg|png|gif|webp)/) || type.includes("photo") || type.includes("selfie")) return "🖼️";
    return "📄";
  }

  function isImage(doc) {
    const url = (doc.url || doc.path || "").toLowerCase();
    return url.match(/\.(jpg|jpeg|png|gif|webp)/);
  }

  function isPDF(doc) {
    const url = (doc.url || doc.path || "").toLowerCase();
    return url.endsWith(".pdf");
  }

  if (!employee) return null;

  return (
    <>
      <Head>
        <title>KYC Review | Nextoken Admin</title>
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
        .badge-gray { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.4); }
        .detail-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); font-size:13px; }
        .detail-row .lbl { color:rgba(255,255,255,0.4); }
        .detail-row span:last-child { font-weight:500; }
        .section-title { font-size:12px; font-weight:700; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:.5px; margin:20px 0 10px; }
        .doc-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:12px 14px; margin-bottom:8px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; transition:all .15s; }
        .doc-card:hover { background:rgba(240,185,11,0.06); border-color:rgba(240,185,11,0.2); }
        .doc-info { display:flex; align-items:center; gap:10px; }
        .doc-icon { font-size:20px; }
        .doc-name { font-size:13px; font-weight:600; }
        .doc-meta { font-size:11px; color:rgba(255,255,255,0.35); margin-top:2px; }
        .doc-actions { display:flex; gap:6px; }
        .doc-btn { padding:5px 12px; border-radius:6px; font-size:11px; font-weight:600; border:none; cursor:pointer; transition:all .15s; }
        .doc-btn-view { background:rgba(59,130,246,0.12); color:#3B82F6; }
        .doc-btn-view:hover { background:rgba(59,130,246,0.22); }
        .doc-btn-dl { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5); }
        .doc-btn-dl:hover { background:rgba(255,255,255,0.1); }
        .textarea { width:100%; background:#0D1117; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px 14px; font-size:13px; color:#fff; outline:none; font-family:inherit; resize:vertical; min-height:70px; margin-top:8px; }
        .textarea:focus { border-color:rgba(240,185,11,0.4); }
        .btn { padding:8px 20px; border-radius:8px; font-size:13px; font-weight:600; border:none; cursor:pointer; transition:all .15s; }
        .btn-green { background:rgba(14,203,129,0.15); color:#0ECB81; }
        .btn-green:hover { background:rgba(14,203,129,0.25); }
        .btn-red { background:rgba(255,77,77,0.12); color:#ff6b6b; }
        .btn-red:hover { background:rgba(255,77,77,0.22); }
        .btn-gray { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5); }
        .btn-gray:hover { background:rgba(255,255,255,0.1); }
        .success-msg { background:rgba(14,203,129,0.1); border:1px solid rgba(14,203,129,0.2); border-radius:8px; padding:10px 14px; font-size:13px; color:#0ECB81; margin-top:12px; }
        .error-msg { background:rgba(255,77,77,0.1); border:1px solid rgba(255,77,77,0.2); border-radius:8px; padding:10px 14px; font-size:13px; color:#ff6b6b; margin-top:12px; }
        .empty { text-align:center; padding:40px; color:rgba(255,255,255,0.25); font-size:14px; }
        .loading { text-align:center; padding:60px; color:rgba(255,255,255,0.3); }

        /* Document Viewer Modal */
        .doc-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:1000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); }
        .doc-modal { background:#161B22; border:1px solid rgba(255,255,255,0.1); border-radius:16px; width:90vw; max-width:900px; max-height:90vh; display:flex; flex-direction:column; overflow:hidden; }
        .doc-modal-header { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.06); }
        .doc-modal-title { font-size:15px; font-weight:700; }
        .doc-modal-close { background:none; border:none; color:rgba(255,255,255,0.4); font-size:22px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:all .15s; }
        .doc-modal-close:hover { background:rgba(255,255,255,0.06); color:#fff; }
        .doc-modal-body { flex:1; overflow:auto; display:flex; align-items:center; justify-content:center; padding:20px; min-height:400px; background:#0D1117; }
        .doc-modal-body img { max-width:100%; max-height:70vh; border-radius:8px; object-fit:contain; }
        .doc-modal-body iframe { width:100%; height:70vh; border:none; border-radius:8px; }
        .doc-modal-footer { display:flex; justify-content:space-between; align-items:center; padding:12px 20px; border-top:1px solid rgba(255,255,255,0.06); }
        .doc-nav-btn { padding:6px 16px; border-radius:6px; font-size:12px; font-weight:600; border:none; cursor:pointer; background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5); transition:all .15s; }
        .doc-nav-btn:hover:not(:disabled) { background:rgba(240,185,11,0.1); color:#F0B90B; }
        .doc-nav-btn:disabled { opacity:0.3; cursor:not-allowed; }

        @media(max-width:900px) {
          .grid-2 { grid-template-columns:1fr; }
          .main { margin-left:0; padding:16px; }
          .doc-modal { width:96vw; }
        }
      `}</style>

      {/* Document Viewer Modal */}
      {viewDoc && (
        <div className="doc-modal-overlay" onClick={() => setViewDoc(null)}>
          <div className="doc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="doc-modal-header">
              <div className="doc-modal-title">
                {getDocIcon(viewDoc)} {viewDoc.type || viewDoc.name || "Document"}
              </div>
              <button className="doc-modal-close" onClick={() => setViewDoc(null)}>✕</button>
            </div>
            <div className="doc-modal-body">
              {isImage(viewDoc) ? (
                <img src={viewDoc.url || viewDoc.path} alt={viewDoc.type || "Document"} />
              ) : isPDF(viewDoc) ? (
                <iframe src={viewDoc.url || viewDoc.path} title={viewDoc.type || "Document"} />
              ) : (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                  <div style={{ fontSize: 14, marginBottom: 12 }}>Preview not available for this file type</div>
                  <a
                    href={viewDoc.url || viewDoc.path}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-green"
                    style={{ textDecoration: "none", display: "inline-block" }}
                  >
                    Download to view
                  </a>
                </div>
              )}
            </div>
            <div className="doc-modal-footer">
              {(() => {
                const docs = selected?.kycDocuments || [];
                const idx = docs.findIndex((d) => (d.url || d.path) === (viewDoc.url || viewDoc.path));
                return (
                  <>
                    <button
                      className="doc-nav-btn"
                      disabled={idx <= 0}
                      onClick={() => setViewDoc(docs[idx - 1])}
                    >
                      ← Previous
                    </button>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                      {idx + 1} of {docs.length}
                    </span>
                    <button
                      className="doc-nav-btn"
                      disabled={idx >= docs.length - 1}
                      onClick={() => setViewDoc(docs[idx + 1])}
                    >
                      Next →
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <div className="layout">
        <AdminSidebar />
        <div className="main">
          <div className="page-title">KYC Review</div>
          <div className="page-sub">Review and approve investor identity verification documents</div>

          <div className="filter-bar">
            {["all", "pending", "approved", "rejected"].map((f) => (
              <button
                key={f}
                className={`filter-btn${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f] || 0})
              </button>
            ))}
          </div>

          <div className="grid-2">
            {/* LEFT — User list */}
            <div>
              <input
                className="search-input"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="card" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {loading ? (
                  <div className="loading">Loading users...</div>
                ) : filtered.length === 0 ? (
                  <div className="empty">No {filter !== "all" ? filter : ""} KYC submissions</div>
                ) : (
                  filtered.map((u) => (
                    <div
                      className={`user-row${selected?._id === u._id ? " active" : ""}`}
                      key={u._id}
                      onClick={() => { setSelected(u); setMsg(""); setComment(""); }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{u.firstName} {u.lastName}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                          {u.email} · {u.country || "N/A"}
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                          {new Date(u.createdAt).toLocaleDateString()} · {u.kycDocuments?.length || 0} doc(s)
                        </div>
                      </div>
                      <span className={`badge badge-${u.kycStatus === "approved" ? "green" : u.kycStatus === "pending" ? "yellow" : u.kycStatus === "rejected" ? "red" : "gray"}`}>
                        {u.kycStatus || "pending"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT — Detail + Doc viewer */}
            <div>
              {!selected ? (
                <div className="card" style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.25)" }}>
                  Select a user to review their KYC
                </div>
              ) : (
                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 17, fontWeight: 800 }}>{selected.firstName} {selected.lastName}</div>
                    <span className={`badge badge-${selected.kycStatus === "approved" ? "green" : selected.kycStatus === "pending" ? "yellow" : selected.kycStatus === "rejected" ? "red" : "gray"}`}>
                      {selected.kycStatus || "pending"}
                    </span>
                  </div>

                  <div className="section-title">Personal Information</div>
                  <div className="detail-row"><span className="lbl">Email</span><span>{selected.email}</span></div>
                  <div className="detail-row"><span className="lbl">Country</span><span>{selected.country || "N/A"}</span></div>
                  <div className="detail-row"><span className="lbl">Phone</span><span>{selected.phone || "N/A"}</span></div>
                  <div className="detail-row"><span className="lbl">Date of Birth</span><span>{selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString() : "N/A"}</span></div>
                  <div className="detail-row"><span className="lbl">Account Type</span><span>{selected.accountType || "investor"}</span></div>
                  <div className="detail-row"><span className="lbl">Joined</span><span>{new Date(selected.createdAt).toLocaleDateString()}</span></div>
                  <div className="detail-row"><span className="lbl">Wallet</span><span style={{ fontSize: 11, fontFamily: "monospace" }}>{selected.walletAddress || "Not connected"}</span></div>

                  {/* KYC Documents with viewer */}
                  <div className="section-title">
                    KYC Documents ({selected.kycDocuments?.length || 0})
                  </div>
                  {selected.kycDocuments && selected.kycDocuments.length > 0 ? (
                    selected.kycDocuments.map((doc, i) => (
                      <div className="doc-card" key={i}>
                        <div className="doc-info">
                          <span className="doc-icon">{getDocIcon(doc)}</span>
                          <div>
                            <div className="doc-name">{doc.type || doc.name || `Document ${i + 1}`}</div>
                            <div className="doc-meta">
                              {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ""}
                              {doc.size ? ` · ${(doc.size / 1024).toFixed(0)}KB` : ""}
                            </div>
                          </div>
                        </div>
                        <div className="doc-actions">
                          <button className="doc-btn doc-btn-view" onClick={() => setViewDoc(doc)}>
                            👁 View
                          </button>
                          <a
                            href={doc.url || doc.path}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-btn doc-btn-dl"
                            style={{ textDecoration: "none" }}
                          >
                            ↓ Download
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginBottom: 12, padding: "16px 0" }}>
                      No KYC documents uploaded yet
                    </div>
                  )}

                  {/* Sumsub data if available */}
                  {selected.sumsubApplicantId && (
                    <>
                      <div className="section-title">Sumsub Verification</div>
                      <div className="detail-row"><span className="lbl">Applicant ID</span><span style={{ fontSize: 11, fontFamily: "monospace" }}>{selected.sumsubApplicantId}</span></div>
                      <div className="detail-row"><span className="lbl">Review Status</span><span>{selected.sumsubReviewStatus || "N/A"}</span></div>
                    </>
                  )}

                  {/* Admin Actions */}
                  <div className="section-title">Admin Action</div>
                  <textarea
                    className="textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a note (optional — sent to user on rejection)"
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button className="btn btn-green" onClick={() => updateKYC(selected._id, "approved")}>
                      ✓ Approve KYC
                    </button>
                    <button className="btn btn-red" onClick={() => updateKYC(selected._id, "rejected")}>
                      ✕ Reject
                    </button>
                    <button className="btn btn-gray" onClick={() => updateKYC(selected._id, "pending")}>
                      Reset to Pending
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
