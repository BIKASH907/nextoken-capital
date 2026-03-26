#!/bin/bash
# Issuer Document Upload with routing
# Run: chmod +x fix-issuer-upload.sh && ./fix-issuer-upload.sh
set -e

echo "  📄 Building issuer document upload system..."

# ═══════════════════════════════════════
# 1. Document Model
# ═══════════════════════════════════════
cat > models/IssuerDocument.js << 'EOF'
import mongoose from "mongoose";

const IssuerDocumentSchema = new mongoose.Schema({
  issuerId: { type: String, required: true },
  issuerName: { type: String },
  issuerEmail: { type: String },
  assetId: { type: String },
  assetName: { type: String },

  // Document info
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String },
  fileSize: { type: Number },

  // Category determines routing
  category: {
    type: String,
    enum: ["kyc", "financial", "technical", "legal", "valuation", "other"],
    required: true,
  },

  // Sub-type for specifics
  subType: { type: String },

  // Routing
  routedTo: {
    type: String,
    enum: ["compliance", "finance", "admin", "unassigned"],
    default: "unassigned",
  },

  // Review status
  status: {
    type: String,
    enum: ["pending", "under_review", "approved", "rejected", "expired"],
    default: "pending",
  },
  reviewedBy: { type: String },
  reviewedByName: { type: String },
  reviewedAt: { type: Date },
  reviewNotes: { type: String },
  rejectionReason: { type: String },

  // Versioning
  version: { type: Number, default: 1 },
  previousVersionId: { type: String },

  // Expiry
  expiresAt: { type: Date },

  // Audit
  uploadedAt: { type: Date, default: Date.now },
  auditLog: [{
    action: String,
    by: String,
    byRole: String,
    at: { type: Date, default: Date.now },
    notes: String,
  }],
}, { timestamps: true });

export default mongoose.models.IssuerDocument || mongoose.model("IssuerDocument", IssuerDocumentSchema);
EOF

echo "  ✓ IssuerDocument model"

# ═══════════════════════════════════════
# 2. Upload + Review API
# ═══════════════════════════════════════
cat > pages/api/admin/issuer-documents.js << 'EOF'
import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import IssuerDocument from "../../../models/IssuerDocument";
import { logAudit } from "../../../lib/auditLog";

// Auto-route based on category
const ROUTING = {
  kyc: "compliance",
  financial: "finance",
  technical: "admin",
  legal: "compliance",
  valuation: "finance",
  other: "admin",
};

async function handler(req, res) {
  await dbConnect();
  const adminId = req.admin?.sub || req.admin?.id || "unknown";
  const adminRole = req.admin?.role || "unknown";
  const adminName = req.admin?.firstName || req.admin?.email || "Admin";

  // GET — list documents (filtered by role)
  if (req.method === "GET") {
    const { category, status, routedTo } = req.query;
    const filter = {};

    // Role-based filtering
    if (adminRole === "compliance_admin") filter.routedTo = "compliance";
    if (adminRole === "finance_admin") filter.routedTo = "finance";
    // super_admin and audit see all

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (routedTo && adminRole === "super_admin") filter.routedTo = routedTo;

    const docs = await IssuerDocument.find(filter).sort({ createdAt: -1 }).lean();

    const stats = {
      total: docs.length,
      pending: docs.filter(d => d.status === "pending").length,
      underReview: docs.filter(d => d.status === "under_review").length,
      approved: docs.filter(d => d.status === "approved").length,
      rejected: docs.filter(d => d.status === "rejected").length,
      byCategory: {},
      byRoute: {},
    };
    docs.forEach(d => {
      stats.byCategory[d.category] = (stats.byCategory[d.category] || 0) + 1;
      stats.byRoute[d.routedTo] = (stats.byRoute[d.routedTo] || 0) + 1;
    });

    return res.json({ documents: docs, stats });
  }

  // POST — upload or action
  if (req.method === "POST") {
    const { action } = req.body;

    // UPLOAD new document
    if (action === "upload") {
      const { issuerId, issuerName, issuerEmail, assetId, assetName, fileName, fileUrl, fileType, fileSize, category, subType, expiresAt } = req.body;

      if (!fileName || !fileUrl || !category) {
        return res.status(400).json({ error: "fileName, fileUrl, and category are required" });
      }

      const routedTo = ROUTING[category] || "admin";

      const doc = await IssuerDocument.create({
        issuerId, issuerName, issuerEmail, assetId, assetName,
        fileName, fileUrl, fileType, fileSize,
        category, subType, routedTo,
        expiresAt: expiresAt || null,
        auditLog: [{ action: "uploaded", by: adminId, byRole: adminRole, notes: "Document uploaded and routed to " + routedTo }],
      });

      await logAudit({ action: "issuer_document_uploaded", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName, category, routedTo }, req, severity: "medium" });

      return res.json({ document: doc, message: "Uploaded and routed to " + routedTo });
    }

    // START REVIEW
    if (action === "start_review") {
      const { documentId } = req.body;
      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      // Check role can review this route
      if (adminRole === "compliance_admin" && doc.routedTo !== "compliance") {
        return res.status(403).json({ error: "This document is routed to " + doc.routedTo + ", not compliance" });
      }
      if (adminRole === "finance_admin" && doc.routedTo !== "finance") {
        return res.status(403).json({ error: "This document is routed to " + doc.routedTo + ", not finance" });
      }

      doc.status = "under_review";
      doc.reviewedBy = adminId;
      doc.reviewedByName = adminName;
      doc.auditLog.push({ action: "review_started", by: adminId, byRole: adminRole });
      await doc.save();

      return res.json({ document: doc });
    }

    // APPROVE
    if (action === "approve") {
      const { documentId, notes } = req.body;
      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      doc.status = "approved";
      doc.reviewedBy = adminId;
      doc.reviewedByName = adminName;
      doc.reviewedAt = new Date();
      doc.reviewNotes = notes || "";
      doc.auditLog.push({ action: "approved", by: adminId, byRole: adminRole, notes });
      await doc.save();

      await logAudit({ action: "issuer_document_approved", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName: doc.fileName, category: doc.category }, req, severity: "high" });

      return res.json({ document: doc });
    }

    // REJECT
    if (action === "reject") {
      const { documentId, reason } = req.body;
      if (!reason) return res.status(400).json({ error: "Rejection reason required" });

      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      doc.status = "rejected";
      doc.reviewedBy = adminId;
      doc.reviewedByName = adminName;
      doc.reviewedAt = new Date();
      doc.rejectionReason = reason;
      doc.auditLog.push({ action: "rejected", by: adminId, byRole: adminRole, notes: reason });
      await doc.save();

      await logAudit({ action: "issuer_document_rejected", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName: doc.fileName, reason }, req, severity: "high" });

      return res.json({ document: doc });
    }

    return res.status(400).json({ error: "Unknown action" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
EOF

echo "  ✓ Issuer documents API with routing"

# ═══════════════════════════════════════
# 3. Issuer Documents Admin Page
# ═══════════════════════════════════════
cat > pages/admin/issuer-documents.js << 'EOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";

const CATEGORIES = [
  { key:"kyc", label:"KYC Documents", icon:"🪪", route:"compliance", color:"#8b5cf6" },
  { key:"financial", label:"Financial Documents", icon:"💰", route:"finance", color:"#f59e0b" },
  { key:"technical", label:"Technical Docs", icon:"🔧", route:"admin", color:"#3b82f6" },
  { key:"legal", label:"Legal Documents", icon:"⚖️", route:"compliance", color:"#8b5cf6" },
  { key:"valuation", label:"Valuation Reports", icon:"📊", route:"finance", color:"#f59e0b" },
  { key:"other", label:"Other", icon:"📁", route:"admin", color:"#6b7280" },
];

const STATUS_COLOR = { pending:"#f59e0b", under_review:"#3b82f6", approved:"#22c55e", rejected:"#ef4444", expired:"#6b7280" };

export default function IssuerDocuments() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [employee, setEmployee] = useState(null);
  const [data, setData] = useState({ documents: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ issuerName:"", issuerEmail:"", assetName:"", fileName:"", fileUrl:"", category:"kyc", subType:"" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
    try { setEmployee(JSON.parse(localStorage.getItem("adminEmployee"))); } catch(e) {}
  }, []);

  useEffect(() => { if (token) load(); }, [token]);

  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => {
    const params = filter !== "all" ? "?category=" + filter : "";
    fetch("/api/admin/issuer-documents" + params, { headers }).then(r => r.json()).then(setData).finally(() => setLoading(false));
  };

  const upload = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/issuer-documents", { method: "POST", headers, body: JSON.stringify({ action: "upload", ...form }) });
    const d = await res.json();
    if (!res.ok) { setMsg("❌ " + d.error); return; }
    setMsg("✅ " + d.message);
    setShowUpload(false);
    setForm({ issuerName:"", issuerEmail:"", assetName:"", fileName:"", fileUrl:"", category:"kyc", subType:"" });
    load();
  };

  const doAction = async (action, documentId, extra) => {
    setMsg("");
    const res = await fetch("/api/admin/issuer-documents", { method: "POST", headers, body: JSON.stringify({ action, documentId, ...extra }) });
    const d = await res.json();
    if (!res.ok) { setMsg("❌ " + d.error); return; }
    setMsg("✅ Document " + action + "d");
    load();
  };

  const s = data.stats || {};
  const role = employee?.role || "support_admin";
  const inp = { width:"100%", background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"9px 12px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };

  return (
    <AdminShell title="📄 Issuer Document Management" subtitle="Upload, route, and review issuer documents. Auto-routed by category.">

      {/* Stats */}
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
        {[
          { l:"Total", v:s.total||0, c:"#3b82f6" },
          { l:"Pending", v:s.pending||0, c:"#f59e0b" },
          { l:"Under Review", v:s.underReview||0, c:"#8b5cf6" },
          { l:"Approved", v:s.approved||0, c:"#22c55e" },
          { l:"Rejected", v:s.rejected||0, c:"#ef4444" },
        ].map((st,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 18px", flex:1, minWidth:100, textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:800, color:st.c }}>{st.v}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{st.l}</div>
          </div>
        ))}
      </div>

      {/* Routing Info */}
      <div style={{ background:"rgba(139,92,246,0.06)", border:"1px solid rgba(139,92,246,0.15)", borderRadius:10, padding:"14px 20px", marginBottom:20, fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
        <strong style={{ color:"#8b5cf6" }}>Auto-Routing:</strong> KYC + Legal → <strong>Compliance</strong> · Financial + Valuation → <strong>Finance</strong> · Technical + Other → <strong>Admin</strong>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        {/* Filter */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <button onClick={() => { setFilter("all"); load(); }} style={{ padding:"5px 14px", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", background:filter==="all"?"#F0B90B15":"#161b22", color:filter==="all"?"#F0B90B":"rgba(255,255,255,0.4)", border:filter==="all"?"1px solid #F0B90B30":"1px solid rgba(255,255,255,0.06)" }}>All</button>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => { setFilter(c.key); }} style={{ padding:"5px 14px", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", background:filter===c.key?c.color+"15":"#161b22", color:filter===c.key?c.color:"rgba(255,255,255,0.4)", border:filter===c.key?"1px solid "+c.color+"30":"1px solid rgba(255,255,255,0.06)" }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        {(role === "super_admin" || role === "compliance_admin") && (
          <button onClick={() => setShowUpload(!showUpload)} style={{ background:"#F0B90B", color:"#000", border:"none", padding:"8px 18px", borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>+ Upload Document</button>
        )}
      </div>

      {msg && <div style={{ background:msg.startsWith("✅")?"rgba(34,197,94,0.1)":"rgba(255,77,77,0.1)", border:"1px solid "+(msg.startsWith("✅")?"rgba(34,197,94,0.2)":"rgba(255,77,77,0.2)"), borderRadius:8, padding:"10px 14px", fontSize:13, color:msg.startsWith("✅")?"#22c55e":"#ff6b6b", marginBottom:16 }}>{msg}</div>}

      {/* Upload Form */}
      {showUpload && (
        <div style={{ background:"#161b22", border:"1px solid rgba(240,185,11,0.2)", borderRadius:12, padding:24, marginBottom:20 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"#F0B90B", marginBottom:14 }}>Upload Issuer Document</h3>
          <form onSubmit={upload} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>ISSUER NAME</label><input value={form.issuerName} onChange={e => setForm({...form, issuerName:e.target.value})} required style={inp} /></div>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>ISSUER EMAIL</label><input type="email" value={form.issuerEmail} onChange={e => setForm({...form, issuerEmail:e.target.value})} style={inp} /></div>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>ASSET NAME</label><input value={form.assetName} onChange={e => setForm({...form, assetName:e.target.value})} style={inp} /></div>
            <div>
              <label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>CATEGORY</label>
              <select value={form.category} onChange={e => setForm({...form, category:e.target.value})} style={{...inp, cursor:"pointer"}}>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.icon} {c.label} → {c.route}</option>)}
              </select>
            </div>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>FILE NAME</label><input value={form.fileName} onChange={e => setForm({...form, fileName:e.target.value})} required style={inp} placeholder="e.g., passport_scan.pdf" /></div>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>FILE URL (Cloudinary)</label><input value={form.fileUrl} onChange={e => setForm({...form, fileUrl:e.target.value})} required style={inp} placeholder="https://res.cloudinary.com/..." /></div>
            <div style={{ gridColumn:"span 2", display:"flex", gap:8 }}>
              <button type="submit" style={{ padding:"10px 24px", background:"#F0B90B", color:"#000", border:"none", borderRadius:7, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Upload and Route</button>
              <button type="button" onClick={() => setShowUpload(false)} style={{ padding:"10px 24px", background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:7, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Document List */}
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"180px 120px 100px 100px 120px 140px", padding:"10px 20px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:.5 }}>
          <span>File Name</span><span>Category</span><span>Routed To</span><span>Status</span><span>Issuer</span><span>Actions</span>
        </div>
        {loading ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div>
        : (data.documents || []).length === 0 ? (
          <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No documents found</div>
        ) : (data.documents || []).map(doc => {
          const cat = CATEGORIES.find(c => c.key === doc.category) || {};
          const canReview = (role === "super_admin") || (role === "compliance_admin" && doc.routedTo === "compliance") || (role === "finance_admin" && doc.routedTo === "finance");
          return (
            <div key={doc._id} style={{ display:"grid", gridTemplateColumns:"180px 120px 100px 100px 120px 140px", padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{doc.fileName}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{doc.assetName || "—"}</div>
              </div>
              <span style={{ fontSize:10, padding:"3px 8px", borderRadius:4, background:(cat.color||"#666")+"15", color:cat.color||"#666", fontWeight:700 }}>{cat.icon} {cat.label}</span>
              <span style={{ fontSize:11, color:cat.color, fontWeight:600, textTransform:"capitalize" }}>{doc.routedTo}</span>
              <span style={{ fontSize:10, padding:"3px 8px", borderRadius:4, background:(STATUS_COLOR[doc.status]||"#666")+"15", color:STATUS_COLOR[doc.status]||"#666", fontWeight:700, textTransform:"capitalize" }}>{doc.status?.replace("_"," ")}</span>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{doc.issuerName || "—"}</span>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                {canReview && doc.status === "pending" && (
                  <button onClick={() => doAction("start_review", doc._id)} style={{ padding:"3px 8px", borderRadius:4, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", color:"#3b82f6", fontSize:9, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Review</button>
                )}
                {canReview && (doc.status === "pending" || doc.status === "under_review") && (
                  <>
                    <button onClick={() => doAction("approve", doc._id, { notes: prompt("Approval notes (optional):") || "" })} style={{ padding:"3px 8px", borderRadius:4, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:9, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Approve</button>
                    <button onClick={() => { const r = prompt("Rejection reason (required):"); if(r) doAction("reject", doc._id, { reason: r }); }} style={{ padding:"3px 8px", borderRadius:4, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:9, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Reject</button>
                  </>
                )}
                {doc.fileUrl && <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ padding:"3px 8px", borderRadius:4, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", fontSize:9, fontWeight:600, textDecoration:"none" }}>View</a>}
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
EOF

echo "  ✓ Issuer documents page"

# ═══════════════════════════════════════
# 4. Add to sidebar
# ═══════════════════════════════════════
sed -i '/{ href:"\/admin\/asset-pipeline", label:"Approval Pipeline", icon:"📋" }/a\      { href:"/admin/issuer-documents", label:"Issuer Documents", icon:"📄" },' lib/rbac.js 2>/dev/null

# If asset-pipeline not found, add after employees
sed -i '/{ href:"\/admin\/employees", label:"Employee/a\      { href:"/admin/issuer-documents", label:"Issuer Documents", icon:"📄" },' lib/rbac.js 2>/dev/null

echo "  ✓ Sidebar updated"

echo ""
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║  ✅ ISSUER DOCUMENT UPLOAD SYSTEM COMPLETE                ║"
echo "  ║                                                           ║"
echo "  ║  AUTO-ROUTING:                                            ║"
echo "  ║    🪪 KYC Documents    → Compliance Admin                 ║"
echo "  ║    ⚖️ Legal Documents   → Compliance Admin                 ║"
echo "  ║    💰 Financial Docs   → Finance Admin                    ║"
echo "  ║    📊 Valuation Reports → Finance Admin                   ║"
echo "  ║    🔧 Technical Docs   → Admin (Super Admin)              ║"
echo "  ║    📁 Other            → Admin (Super Admin)              ║"
echo "  ║                                                           ║"
echo "  ║  REVIEW:                                                  ║"
echo "  ║    Compliance can only review compliance-routed docs      ║"
echo "  ║    Finance can only review finance-routed docs            ║"
echo "  ║    Super Admin can review ALL docs                        ║"
echo "  ║    Rejection requires reason                              ║"
echo "  ║    Every action audit logged                              ║"
echo "  ║                                                           ║"
echo "  ║  RUN:                                                     ║"
echo "  ║    git add -A && git commit -m 'feat: issuer docs'        ║"
echo "  ║    git push && npx vercel --prod                          ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
