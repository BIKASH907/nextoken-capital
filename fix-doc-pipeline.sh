#!/bin/bash
# Strict document review pipeline
# Run: chmod +x fix-doc-pipeline.sh && ./fix-doc-pipeline.sh
set -e

echo "  📋 Enforcing strict document review pipeline..."

cat > pages/api/admin/issuer-documents.js << 'EOF'
import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import IssuerDocument from "../../../models/IssuerDocument";
import { logAudit } from "../../../lib/auditLog";

// Document review pipeline (strict order, cannot skip):
// 1. pending → compliance_review (Compliance approves/rejects/comments)
// 2. compliance_approved → finance_review (Finance approves/rejects/comments)
// 3. finance_approved → final_review (Super Admin gives FINAL approval)
// 4. approved (live)

const PIPELINE = {
  pending:              { stage: "compliance", next: "compliance_approved", reviewRole: "compliance_admin" },
  compliance_approved:  { stage: "finance",    next: "finance_approved",    reviewRole: "finance_admin" },
  finance_approved:     { stage: "final",      next: "approved",            reviewRole: "super_admin" },
  approved:             { stage: "done",       next: null,                  reviewRole: null },
};

// Where rejections go back to
const REJECT_TO = {
  pending:              "rejected_compliance",    // Compliance rejects → issuer fixes → resubmit
  compliance_approved:  "pending",                // Finance rejects → back to Compliance
  finance_approved:     "compliance_approved",    // Super Admin rejects → back to Finance
};

async function handler(req, res) {
  await dbConnect();
  const adminId = req.admin?.sub || req.admin?.id || "unknown";
  const adminRole = req.admin?.role || "unknown";
  const adminName = req.admin?.firstName || req.admin?.email || "Admin";

  // ── GET: List documents ──
  if (req.method === "GET") {
    const { category, status } = req.query;
    const filter = {};

    // Role-based: show only what this role can act on
    if (adminRole === "compliance_admin") {
      filter.status = { $in: ["pending", "rejected_compliance"] };
    } else if (adminRole === "finance_admin") {
      filter.status = { $in: ["compliance_approved"] };
    } else if (adminRole === "audit") {
      // sees all, no filter
    }
    // super_admin sees all

    if (category) filter.category = category;
    if (status && adminRole === "super_admin") filter.status = status;

    const docs = await IssuerDocument.find(filter).sort({ createdAt: -1 }).lean();

    const allDocs = await IssuerDocument.find().lean();
    const stats = {
      total: allDocs.length,
      pending: allDocs.filter(d => d.status === "pending").length,
      complianceApproved: allDocs.filter(d => d.status === "compliance_approved").length,
      financeApproved: allDocs.filter(d => d.status === "finance_approved").length,
      approved: allDocs.filter(d => d.status === "approved").length,
      rejected: allDocs.filter(d => d.status?.startsWith("rejected")).length,
    };

    return res.json({ documents: docs, stats });
  }

  // ── POST: Actions ──
  if (req.method === "POST") {
    const { action } = req.body;

    // UPLOAD
    if (action === "upload") {
      const { issuerId, issuerName, issuerEmail, assetId, assetName, fileName, fileUrl, fileType, fileSize, category, subType } = req.body;
      if (!fileName || !fileUrl || !category) return res.status(400).json({ error: "fileName, fileUrl, and category required" });

      const doc = await IssuerDocument.create({
        issuerId, issuerName, issuerEmail, assetId, assetName,
        fileName, fileUrl, fileType, fileSize, category, subType,
        routedTo: "compliance",
        status: "pending",
        auditLog: [{ action: "uploaded", by: adminId, byRole: adminRole, notes: "Document uploaded. Starts with Compliance review." }],
      });

      await logAudit({ action: "issuer_document_uploaded", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName, category }, req, severity: "medium" });
      return res.json({ document: doc, message: "Uploaded. Pending Compliance review." });
    }

    // APPROVE (stage-locked)
    if (action === "approve") {
      const { documentId, notes } = req.body;
      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      const stage = PIPELINE[doc.status];
      if (!stage || !stage.next) return res.status(400).json({ error: "Document cannot be approved at status: " + doc.status });

      // ENFORCE: Only the correct role can approve at each stage
      if (adminRole !== "super_admin" && adminRole !== stage.reviewRole) {
        const stageNames = { compliance_admin: "Compliance", finance_admin: "Finance", super_admin: "Super Admin" };
        return res.status(403).json({ error: "This document is at " + stage.stage + " stage. Only " + (stageNames[stage.reviewRole] || stage.reviewRole) + " can approve." });
      }

      // ENFORCE: Super Admin can ONLY do final approval (cannot skip stages)
      if (adminRole === "super_admin" && doc.status !== "finance_approved") {
        if (doc.status === "pending") return res.status(403).json({ error: "Cannot skip stages. This document needs Compliance approval first." });
        if (doc.status === "compliance_approved") return res.status(403).json({ error: "Cannot skip stages. This document needs Finance approval first." });
      }

      const prevStatus = doc.status;
      doc.status = stage.next;
      doc.auditLog.push({ action: "approved_" + stage.stage, by: adminId, byRole: adminRole, notes: notes || "", at: new Date() });

      // Track who approved at each stage
      if (stage.stage === "compliance") {
        doc.complianceApprovedBy = adminId;
        doc.complianceApprovedByName = adminName;
        doc.complianceApprovedAt = new Date();
        doc.complianceNotes = notes || "";
      } else if (stage.stage === "finance") {
        doc.financeApprovedBy = adminId;
        doc.financeApprovedByName = adminName;
        doc.financeApprovedAt = new Date();
        doc.financeNotes = notes || "";
      } else if (stage.stage === "final") {
        doc.finalApprovedBy = adminId;
        doc.finalApprovedByName = adminName;
        doc.finalApprovedAt = new Date();
        doc.finalNotes = notes || "";
      }

      await doc.save();

      const stageLabel = { compliance: "Compliance", finance: "Finance", final: "Final" };
      await logAudit({ action: "document_" + stage.stage + "_approved", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName: doc.fileName, from: prevStatus, to: doc.status, notes }, req, severity: stage.stage === "final" ? "critical" : "high" });

      const nextStage = PIPELINE[doc.status];
      const msg = stageLabel[stage.stage] + " approved." + (nextStage?.stage !== "done" ? " Next: " + (stageLabel[nextStage?.stage] || "Done") + " review." : " Document is now LIVE.");
      return res.json({ document: doc, message: msg });
    }

    // REJECT (sends back to previous stage)
    if (action === "reject") {
      const { documentId, reason } = req.body;
      if (!reason) return res.status(400).json({ error: "Rejection reason is required" });

      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      const stage = PIPELINE[doc.status];
      if (!stage) return res.status(400).json({ error: "Cannot reject at status: " + doc.status });

      // ENFORCE role
      if (adminRole !== "super_admin" && adminRole !== stage.reviewRole) {
        return res.status(403).json({ error: "Only " + stage.reviewRole + " can reject at this stage." });
      }

      // ENFORCE: Super Admin can only reject at final stage
      if (adminRole === "super_admin" && doc.status !== "finance_approved") {
        if (doc.status === "pending") return res.status(403).json({ error: "Cannot skip stages. Compliance must review first." });
        if (doc.status === "compliance_approved") return res.status(403).json({ error: "Cannot skip stages. Finance must review first." });
      }

      const prevStatus = doc.status;
      const rejectTo = REJECT_TO[doc.status] || "pending";
      doc.status = rejectTo;
      doc.rejectionReason = reason;
      doc.rejectedBy = adminId;
      doc.rejectedByName = adminName;
      doc.rejectedAt = new Date();
      doc.auditLog.push({ action: "rejected_at_" + stage.stage, by: adminId, byRole: adminRole, notes: reason, at: new Date() });
      await doc.save();

      await logAudit({ action: "document_" + stage.stage + "_rejected", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName: doc.fileName, from: prevStatus, to: rejectTo, reason }, req, severity: "high" });

      const rejectMsg = {
        rejected_compliance: "Rejected by Compliance. Issuer must fix and resubmit.",
        pending: "Rejected by Finance. Sent back to Compliance for review.",
        compliance_approved: "Rejected by Super Admin. Sent back to Finance for review.",
      };
      return res.json({ document: doc, message: rejectMsg[rejectTo] || "Rejected." });
    }

    // COMMENT (any reviewer can add notes without changing status)
    if (action === "comment") {
      const { documentId, comment } = req.body;
      if (!comment) return res.status(400).json({ error: "Comment is required" });

      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      doc.auditLog.push({ action: "comment", by: adminId, byRole: adminRole, notes: comment, at: new Date() });
      await doc.save();

      return res.json({ document: doc, message: "Comment added." });
    }

    // RESUBMIT (from rejected_compliance back to pending)
    if (action === "resubmit") {
      const { documentId } = req.body;
      const doc = await IssuerDocument.findById(documentId);
      if (!doc) return res.status(404).json({ error: "Document not found" });
      if (doc.status !== "rejected_compliance") return res.status(400).json({ error: "Only rejected documents can be resubmitted" });

      doc.status = "pending";
      doc.rejectionReason = null;
      doc.rejectedBy = null;
      doc.version = (doc.version || 1) + 1;
      doc.auditLog.push({ action: "resubmitted", by: adminId, byRole: adminRole, notes: "Version " + doc.version, at: new Date() });
      await doc.save();

      await logAudit({ action: "document_resubmitted", category: "compliance", admin: req.admin, targetType: "document", targetId: doc._id.toString(), details: { fileName: doc.fileName, version: doc.version }, req, severity: "medium" });
      return res.json({ document: doc, message: "Resubmitted for Compliance review (v" + doc.version + ")" });
    }

    return res.status(400).json({ error: "Unknown action" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
EOF

echo "  ✓ Strict pipeline API"

# ═══════════════════════════════════════
# 2. Update IssuerDocument model with stage fields
# ═══════════════════════════════════════
cat > models/IssuerDocument.js << 'EOF'
import mongoose from "mongoose";

const IssuerDocumentSchema = new mongoose.Schema({
  issuerId: { type: String },
  issuerName: { type: String },
  issuerEmail: { type: String },
  assetId: { type: String },
  assetName: { type: String },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String },
  fileSize: { type: Number },
  category: { type: String, enum: ["kyc", "financial", "technical", "legal", "valuation", "other"], required: true },
  subType: { type: String },
  routedTo: { type: String, default: "compliance" },

  // Pipeline status
  status: {
    type: String,
    enum: ["pending", "compliance_approved", "finance_approved", "approved", "rejected_compliance", "rejected_finance", "rejected_final"],
    default: "pending",
  },

  // Stage approvals
  complianceApprovedBy: String,
  complianceApprovedByName: String,
  complianceApprovedAt: Date,
  complianceNotes: String,

  financeApprovedBy: String,
  financeApprovedByName: String,
  financeApprovedAt: Date,
  financeNotes: String,

  finalApprovedBy: String,
  finalApprovedByName: String,
  finalApprovedAt: Date,
  finalNotes: String,

  // Rejection
  rejectionReason: String,
  rejectedBy: String,
  rejectedByName: String,
  rejectedAt: Date,

  // Versioning
  version: { type: Number, default: 1 },

  // Audit
  auditLog: [{
    action: String,
    by: String,
    byRole: String,
    notes: String,
    at: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

export default mongoose.models.IssuerDocument || mongoose.model("IssuerDocument", IssuerDocumentSchema);
EOF

echo "  ✓ Updated model with stage tracking"

# ═══════════════════════════════════════
# 3. Updated page with pipeline visual
# ═══════════════════════════════════════
cat > pages/admin/issuer-documents.js << 'EOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";

const STAGES = [
  { key:"pending", label:"Pending Compliance", color:"#8b5cf6", icon:"🪪" },
  { key:"compliance_approved", label:"Pending Finance", color:"#f59e0b", icon:"💰" },
  { key:"finance_approved", label:"Pending Final", color:"#ef4444", icon:"👑" },
  { key:"approved", label:"Approved (Live)", color:"#22c55e", icon:"✅" },
];

const STATUS_INFO = {
  pending: { label:"Pending Compliance", color:"#8b5cf6" },
  compliance_approved: { label:"Pending Finance", color:"#f59e0b" },
  finance_approved: { label:"Pending Final Approval", color:"#ef4444" },
  approved: { label:"Approved", color:"#22c55e" },
  rejected_compliance: { label:"Rejected (Compliance)", color:"#ef4444" },
};

const CATEGORIES = [
  { key:"kyc", label:"KYC", icon:"🪪", color:"#8b5cf6" },
  { key:"financial", label:"Financial", icon:"💰", color:"#f59e0b" },
  { key:"technical", label:"Technical", icon:"🔧", color:"#3b82f6" },
  { key:"legal", label:"Legal", icon:"⚖️", color:"#8b5cf6" },
  { key:"valuation", label:"Valuation", icon:"📊", color:"#f59e0b" },
  { key:"other", label:"Other", icon:"📁", color:"#6b7280" },
];

export default function IssuerDocuments() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [employee, setEmployee] = useState(null);
  const [data, setData] = useState({ documents: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ issuerName:"", assetName:"", fileName:"", fileUrl:"", category:"kyc" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
    try { setEmployee(JSON.parse(localStorage.getItem("adminEmployee"))); } catch(e) {}
  }, []);

  useEffect(() => { if (token) load(); }, [token]);

  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => { fetch("/api/admin/issuer-documents", { headers }).then(r => r.json()).then(setData).finally(() => setLoading(false)); };

  const doAction = async (action, documentId, extra) => {
    setMsg("");
    const res = await fetch("/api/admin/issuer-documents", { method: "POST", headers, body: JSON.stringify({ action, documentId, ...extra }) });
    const d = await res.json();
    setMsg(res.ok ? "✅ " + d.message : "❌ " + d.error);
    load();
  };

  const upload = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/issuer-documents", { method: "POST", headers, body: JSON.stringify({ action: "upload", ...form }) });
    const d = await res.json();
    if (res.ok) { setMsg("✅ " + d.message); setShowUpload(false); load(); } else { setMsg("❌ " + d.error); }
  };

  const s = data.stats || {};
  const role = employee?.role || "support_admin";
  const inp = { width:"100%", background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"9px 12px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };

  // What can this role do?
  const canApprove = (status) => {
    if (role === "compliance_admin" && status === "pending") return true;
    if (role === "finance_admin" && status === "compliance_approved") return true;
    if (role === "super_admin" && status === "finance_approved") return true;
    return false;
  };
  const canReject = canApprove; // same stages
  const canComment = () => role !== "audit";

  return (
    <AdminShell title="📄 Issuer Document Pipeline" subtitle="Strict review: Compliance → Finance → Super Admin Final Approval. Cannot skip stages.">

      {/* Pipeline Visual */}
      <div style={{ display:"flex", gap:4, marginBottom:24 }}>
        {STAGES.map((st, i) => (
          <div key={st.key} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ padding:"10px 16px", borderRadius:8, background:st.color+"15", border:"1px solid "+st.color+"30", textAlign:"center", minWidth:120 }}>
              <div style={{ fontSize:16 }}>{st.icon}</div>
              <div style={{ fontSize:10, fontWeight:700, color:st.color, marginTop:2 }}>{st.label}</div>
              <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginTop:2 }}>{s[st.key === "pending" ? "pending" : st.key === "compliance_approved" ? "complianceApproved" : st.key === "finance_approved" ? "financeApproved" : "approved"] || 0}</div>
            </div>
            {i < 3 && <div style={{ color:"rgba(255,255,255,0.15)", fontSize:18, margin:"0 4px" }}>→</div>}
          </div>
        ))}
      </div>

      {/* Rules */}
      <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:10, padding:"12px 18px", marginBottom:20, fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
        <strong style={{ color:"#ef4444" }}>Pipeline Rules:</strong> Compliance approves/rejects first → Finance approves/rejects second → Super Admin gives FINAL approval. <strong style={{ color:"#fff" }}>Cannot skip stages.</strong> Rejections go back to previous stage.
      </div>

      {msg && <div style={{ background:msg.startsWith("✅")?"rgba(34,197,94,0.1)":"rgba(255,77,77,0.1)", border:"1px solid "+(msg.startsWith("✅")?"rgba(34,197,94,0.2)":"rgba(255,77,77,0.2)"), borderRadius:8, padding:"10px 14px", fontSize:13, color:msg.startsWith("✅")?"#22c55e":"#ff6b6b", marginBottom:16 }}>{msg}</div>}

      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:700 }}>Documents ({(data.documents||[]).length})</div>
        {(role === "super_admin" || role === "compliance_admin") && (
          <button onClick={() => setShowUpload(!showUpload)} style={{ background:"#F0B90B", color:"#000", border:"none", padding:"8px 18px", borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>+ Upload</button>
        )}
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div style={{ background:"#161b22", border:"1px solid rgba(240,185,11,0.2)", borderRadius:12, padding:20, marginBottom:16 }}>
          <form onSubmit={upload} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>ISSUER NAME</label><input value={form.issuerName} onChange={e => setForm({...form, issuerName:e.target.value})} required style={inp} /></div>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>ASSET NAME</label><input value={form.assetName} onChange={e => setForm({...form, assetName:e.target.value})} style={inp} /></div>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>CATEGORY</label><select value={form.category} onChange={e => setForm({...form, category:e.target.value})} style={{...inp, cursor:"pointer"}}>{CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}</select></div>
            <div><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>FILE NAME</label><input value={form.fileName} onChange={e => setForm({...form, fileName:e.target.value})} required style={inp} /></div>
            <div style={{ gridColumn:"span 2" }}><label style={{ display:"block", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>FILE URL</label><input value={form.fileUrl} onChange={e => setForm({...form, fileUrl:e.target.value})} required style={inp} placeholder="https://res.cloudinary.com/..." /></div>
            <div style={{ gridColumn:"span 2", display:"flex", gap:8 }}>
              <button type="submit" style={{ padding:"8px 20px", background:"#F0B90B", color:"#000", border:"none", borderRadius:6, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Upload</button>
              <button type="button" onClick={() => setShowUpload(false)} style={{ padding:"8px 20px", background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Document List */}
      {loading ? <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", padding:40 }}>Loading...</div>
      : (data.documents||[]).length === 0 ? (
        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No documents in your queue</div>
      ) : (data.documents||[]).map(doc => {
        const si = STATUS_INFO[doc.status] || { label: doc.status, color: "#6b7280" };
        const cat = CATEGORIES.find(c => c.key === doc.category) || {};
        return (
          <div key={doc._id} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px 20px", marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700 }}>{doc.fileName} <span style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>v{doc.version || 1}</span></div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{doc.issuerName || "—"} · {doc.assetName || "—"} · {cat.icon} {cat.label}</div>
              </div>
              <span style={{ fontSize:10, padding:"4px 10px", borderRadius:5, background:si.color+"15", color:si.color, fontWeight:700 }}>{si.label}</span>
            </div>

            {/* Stage Progress */}
            <div style={{ display:"flex", gap:4, marginBottom:10 }}>
              {[
                { done: !!doc.complianceApprovedAt, label:"Compliance", who: doc.complianceApprovedByName, c:"#8b5cf6" },
                { done: !!doc.financeApprovedAt, label:"Finance", who: doc.financeApprovedByName, c:"#f59e0b" },
                { done: !!doc.finalApprovedAt, label:"Final", who: doc.finalApprovedByName, c:"#22c55e" },
              ].map((st, i) => (
                <div key={i} style={{ flex:1, padding:"6px 10px", borderRadius:6, background: st.done ? st.c+"12" : "#0a0e14", border: "1px solid " + (st.done ? st.c+"30" : "rgba(255,255,255,0.04)") }}>
                  <div style={{ fontSize:9, fontWeight:700, color: st.done ? st.c : "rgba(255,255,255,0.2)" }}>{st.done ? "✓" : "○"} {st.label}</div>
                  {st.who && <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>by {st.who}</div>}
                </div>
              ))}
            </div>

            {/* Rejection info */}
            {doc.rejectionReason && <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:6, padding:"8px 12px", marginBottom:10, fontSize:11, color:"#ef4444" }}>Rejected: {doc.rejectionReason}</div>}

            {/* Actions */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {canApprove(doc.status) && (
                <button onClick={() => doAction("approve", doc._id, { notes: prompt("Approval notes (optional):") || "" })} style={{ padding:"5px 14px", borderRadius:5, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>✅ Approve</button>
              )}
              {canReject(doc.status) && (
                <button onClick={() => { const r = prompt("Rejection reason (required):"); if(r) doAction("reject", doc._id, { reason: r }); }} style={{ padding:"5px 14px", borderRadius:5, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>❌ Reject</button>
              )}
              {canComment() && (
                <button onClick={() => { const c = prompt("Add comment:"); if(c) doAction("comment", doc._id, { comment: c }); }} style={{ padding:"5px 14px", borderRadius:5, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>💬 Comment</button>
              )}
              {doc.status === "rejected_compliance" && (role === "super_admin" || role === "compliance_admin") && (
                <button onClick={() => doAction("resubmit", doc._id)} style={{ padding:"5px 14px", borderRadius:5, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", color:"#3b82f6", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>🔄 Resubmit</button>
              )}
              {doc.fileUrl && <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ padding:"5px 14px", borderRadius:5, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", fontSize:11, textDecoration:"none" }}>📎 View File</a>}
            </div>

            {/* Audit Log */}
            {doc.auditLog && doc.auditLog.length > 0 && (
              <div style={{ marginTop:10, borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:8 }}>
                {doc.auditLog.slice(-3).reverse().map((log, i) => (
                  <div key={i} style={{ fontSize:10, color:"rgba(255,255,255,0.3)", padding:"2px 0" }}>
                    <span style={{ color:"#F0B90B" }}>{log.action}</span> by {log.by} ({log.byRole}) · {new Date(log.at).toLocaleString()}
                    {log.notes && <span> — {log.notes}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </AdminShell>
  );
}
EOF

echo "  ✓ Pipeline page with stage progress"

echo ""
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║  ✅ STRICT DOCUMENT PIPELINE COMPLETE                     ║"
echo "  ║                                                           ║"
echo "  ║  FLOW:                                                    ║"
echo "  ║    Upload → Pending Compliance                            ║"
echo "  ║    🪪 Compliance → Approve / Reject / Comment             ║"
echo "  ║    💰 Finance → Approve / Reject / Comment                ║"
echo "  ║    👑 Super Admin → FINAL APPROVAL ONLY                   ║"
echo "  ║                                                           ║"
echo "  ║  CANNOT SKIP:                                             ║"
echo "  ║    Super Admin at pending → ERROR (needs Compliance)      ║"
echo "  ║    Super Admin at compliance_approved → ERROR (needs Fin) ║"
echo "  ║    Finance at pending → ERROR (needs Compliance first)    ║"
echo "  ║                                                           ║"
echo "  ║  REJECTION:                                               ║"
echo "  ║    Compliance rejects → Issuer fixes → resubmit          ║"
echo "  ║    Finance rejects → Back to Compliance                   ║"
echo "  ║    Super Admin rejects → Back to Finance                  ║"
echo "  ║                                                           ║"
echo "  ║  RUN:                                                     ║"
echo "  ║    git add -A && git commit -m 'feat: strict pipeline'    ║"
echo "  ║    git push && npx vercel --prod                          ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
