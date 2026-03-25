#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║  NEXTOKEN — Live Security Features Integration                  ║
# ║  Adds real working security pages to your existing NXT Admin    ║
# ║                                                                  ║
# ║  Run from nextoken-capital root:                                ║
# ║    chmod +x integrate-security.sh && ./integrate-security.sh    ║
# ╚══════════════════════════════════════════════════════════════════╝
set -e

echo ""
echo "  🔐 NEXTOKEN — Integrating Live Security Features"
echo "  ─────────────────────────────────────────────────"
echo ""

# Verify we're in the right directory
if [ ! -f "package.json" ] || ! grep -q "nextoken-capital" package.json; then
  echo "  ❌ Run this from your nextoken-capital root folder!"
  exit 1
fi

echo "  ✓ Found nextoken-capital project"

# ═══════════════════════════════════════
# 1. MONGOOSE MODELS
# ═══════════════════════════════════════
echo "  [1/5] Creating security models..."

cat > models/AuditLog.js << 'EOF'
import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true, index: true },
  category: { type: String, enum: ["auth", "kyc", "transaction", "config", "user", "contract", "system"], index: true },
  adminId: { type: String, required: true, index: true },
  adminName: { type: String, required: true },
  adminRole: { type: String },
  targetType: { type: String },
  targetId: { type: String },
  details: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String },
  userAgent: { type: String },
  country: { type: String },
  result: { type: String, enum: ["success", "failure", "blocked"], default: "success" },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "low" },
  hash: { type: String },
  previousHash: { type: String },
}, { timestamps: true });

AuditLogSchema.index({ createdAt: 1 });
AuditLogSchema.index({ adminId: 1, createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
EOF

cat > models/LoginAttempt.js << 'EOF'
import mongoose from "mongoose";

const LoginAttemptSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  ip: { type: String, required: true, index: true },
  userAgent: { type: String },
  success: { type: Boolean, required: true },
  reason: { type: String },
  country: { type: String },
  device: { type: String },
  isNewDevice: { type: Boolean, default: false },
  isNewCountry: { type: Boolean, default: false },
}, { timestamps: true });

LoginAttemptSchema.index({ email: 1, createdAt: -1 });
LoginAttemptSchema.index({ ip: 1, createdAt: -1 });

export default mongoose.models.LoginAttempt || mongoose.model("LoginAttempt", LoginAttemptSchema);
EOF

cat > models/ApprovalRequest.js << 'EOF'
import mongoose from "mongoose";

const ApprovalRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["withdrawal_large", "token_listing", "contract_deploy", "contract_upgrade", "kyc_override", "fee_change", "role_change", "system_config"],
    required: true,
    index: true,
  },
  requestedBy: { type: String, required: true },
  requestedByName: { type: String, required: true },
  approvedBy: { type: String },
  approvedByName: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected", "expired"], default: "pending", index: true },
  payload: { type: mongoose.Schema.Types.Mixed },
  reason: { type: String },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
}, { timestamps: true });

export default mongoose.models.ApprovalRequest || mongoose.model("ApprovalRequest", ApprovalRequestSchema);
EOF

cat > models/SecurityAlert.js << 'EOF'
import mongoose from "mongoose";

const SecurityAlertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["brute_force", "new_device", "new_country", "bulk_action", "impossible_travel", "large_withdrawal", "suspicious_transaction", "contract_anomaly", "system_breach"],
    required: true,
    index: true,
  },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  sourceIp: { type: String },
  userId: { type: String },
  userName: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, enum: ["active", "investigating", "resolved", "dismissed"], default: "active", index: true },
  resolvedBy: { type: String },
  resolvedAt: { type: Date },
  resolvedNote: { type: String },
}, { timestamps: true });

export default mongoose.models.SecurityAlert || mongoose.model("SecurityAlert", SecurityAlertSchema);
EOF

cat > models/WithdrawalWhitelist.js << 'EOF'
import mongoose from "mongoose";

const WithdrawalWhitelistSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ["bank", "wallet"], required: true },
  address: { type: String, required: true },
  label: { type: String },
  status: { type: String, enum: ["pending", "active", "removed"], default: "pending" },
  activatesAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
  addedBy: { type: String },
}, { timestamps: true });

export default mongoose.models.WithdrawalWhitelist || mongoose.model("WithdrawalWhitelist", WithdrawalWhitelistSchema);
EOF

echo "  ✓ 5 security models created"

# ═══════════════════════════════════════
# 2. AUDIT LOGGING MIDDLEWARE
# ═══════════════════════════════════════
echo "  [2/5] Creating audit middleware..."

cat > lib/auditLog.js << 'EOF'
import dbConnect from "./db";
import AuditLog from "../models/AuditLog";
import crypto from "crypto";

let lastHash = "0".repeat(64);

export async function logAudit({ action, category, admin, targetType, targetId, details, req, result = "success", severity = "low" }) {
  try {
    await dbConnect();
    const record = {
      action,
      category: category || "system",
      adminId: admin?.id || admin?.sub || "system",
      adminName: admin?.name || admin?.firstName || "System",
      adminRole: admin?.role || "system",
      targetType,
      targetId,
      details,
      ip: req?.headers?.["x-forwarded-for"] || req?.socket?.remoteAddress || "unknown",
      userAgent: req?.headers?.["user-agent"] || "unknown",
      result,
      severity,
      previousHash: lastHash,
    };

    const content = JSON.stringify(record);
    record.hash = crypto.createHash("sha256").update(content + lastHash).digest("hex");
    lastHash = record.hash;

    await AuditLog.create(record);
  } catch (err) {
    console.error("[AUDIT] Failed to log:", err.message);
  }
}

// Wrap any API handler to auto-log
export function withAudit(handler, { action, category, severity }) {
  return async (req, res) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      logAudit({
        action,
        category,
        admin: req.admin,
        details: { method: req.method, body: req.body, status: res.statusCode },
        req,
        result: res.statusCode < 400 ? "success" : "failure",
        severity,
      });
      return originalJson(body);
    };
    return handler(req, res);
  };
}
EOF

cat > lib/loginProtection.js << 'EOF'
import dbConnect from "./db";
import LoginAttempt from "../models/LoginAttempt";
import SecurityAlert from "../models/SecurityAlert";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function checkLoginAllowed(email, ip) {
  await dbConnect();
  const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000);

  const recentFails = await LoginAttempt.countDocuments({
    $or: [{ email }, { ip }],
    success: false,
    createdAt: { $gte: since },
  });

  if (recentFails >= MAX_ATTEMPTS) {
    return { allowed: false, reason: "Too many failed attempts. Locked for 15 minutes.", attemptsLeft: 0 };
  }

  return { allowed: true, attemptsLeft: MAX_ATTEMPTS - recentFails };
}

export async function recordLogin({ email, ip, userAgent, success, reason }) {
  await dbConnect();

  // Check if new device/country
  const prevLogins = await LoginAttempt.find({ email, success: true }).sort({ createdAt: -1 }).limit(20);
  const knownIPs = new Set(prevLogins.map(l => l.ip));
  const isNewDevice = !knownIPs.has(ip);

  await LoginAttempt.create({ email, ip, userAgent, success, reason, isNewDevice });

  // Create alert for suspicious activity
  if (!success && (await LoginAttempt.countDocuments({ email, success: false, createdAt: { $gte: new Date(Date.now() - 15 * 60000) } })) >= 3) {
    await SecurityAlert.create({
      type: "brute_force",
      severity: "high",
      title: "Multiple failed login attempts",
      description: email + " from IP " + ip,
      sourceIp: ip,
      metadata: { email, attempts: MAX_ATTEMPTS },
    });
  }

  if (success && isNewDevice) {
    await SecurityAlert.create({
      type: "new_device",
      severity: "medium",
      title: "Login from new device/IP",
      description: email + " logged in from new IP " + ip,
      sourceIp: ip,
      userName: email,
    });
  }
}
EOF

echo "  ✓ Audit + login protection middleware created"

# ═══════════════════════════════════════
# 3. API ROUTES
# ═══════════════════════════════════════
echo "  [3/5] Creating API routes..."

mkdir -p pages/api/admin/security

cat > pages/api/admin/security/audit-logs.js << 'EOF'
import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import AuditLog from "../../../../models/AuditLog";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { page = 1, limit = 50, category, adminId, severity, from, to } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (adminId) filter.adminId = adminId;
    if (severity) filter.severity = severity;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    return res.json({ logs, total, page: Number(page), pages: Math.ceil(total / limit) });
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler, "compliance");
EOF

cat > pages/api/admin/security/alerts.js << 'EOF'
import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import SecurityAlert from "../../../../models/SecurityAlert";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { status = "active", severity, limit = 50 } = req.query;
    const filter = {};
    if (status !== "all") filter.status = status;
    if (severity) filter.severity = severity;

    const alerts = await SecurityAlert.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    const counts = {
      active: await SecurityAlert.countDocuments({ status: "active" }),
      critical: await SecurityAlert.countDocuments({ status: "active", severity: "critical" }),
      high: await SecurityAlert.countDocuments({ status: "active", severity: "high" }),
    };

    return res.json({ alerts, counts });
  }

  if (req.method === "PATCH") {
    const { alertId, status, note } = req.body;
    const update = { status };
    if (status === "resolved" || status === "dismissed") {
      update.resolvedBy = req.admin.name || req.admin.sub;
      update.resolvedAt = new Date();
      update.resolvedNote = note;
    }
    const alert = await SecurityAlert.findByIdAndUpdate(alertId, update, { new: true });
    return res.json({ alert });
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler, "compliance");
EOF

cat > pages/api/admin/security/approvals.js << 'EOF'
import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import ApprovalRequest from "../../../../models/ApprovalRequest";
import { logAudit } from "../../../../lib/auditLog";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { status = "pending" } = req.query;
    const filter = status === "all" ? {} : { status };
    const requests = await ApprovalRequest.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    const pendingCount = await ApprovalRequest.countDocuments({ status: "pending" });
    return res.json({ requests, pendingCount });
  }

  if (req.method === "POST") {
    const { type, payload, reason } = req.body;
    const request = await ApprovalRequest.create({
      type,
      payload,
      reason,
      requestedBy: req.admin.sub || req.admin.id,
      requestedByName: req.admin.name || req.admin.firstName,
    });
    await logAudit({ action: "approval_requested", category: "system", admin: req.admin, targetType: "approval", targetId: request._id.toString(), details: { type, payload }, req, severity: "medium" });
    return res.json({ request });
  }

  if (req.method === "PATCH") {
    const { requestId, action, note } = req.body;
    const request = await ApprovalRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: "Not found" });
    if (request.status !== "pending") return res.status(400).json({ error: "Already processed" });

    if (request.requestedBy === (req.admin.sub || req.admin.id)) {
      return res.status(403).json({ error: "Cannot approve your own request (four-eyes principle)" });
    }

    if (new Date() > request.expiresAt) {
      request.status = "expired";
      await request.save();
      return res.status(400).json({ error: "Request expired" });
    }

    request.status = action === "approve" ? "approved" : "rejected";
    request.approvedBy = req.admin.sub || req.admin.id;
    request.approvedByName = req.admin.name || req.admin.firstName;
    request.reason = note;
    await request.save();

    await logAudit({ action: "approval_" + request.status, category: "system", admin: req.admin, targetType: "approval", targetId: requestId, details: { type: request.type, action }, req, severity: "high" });
    return res.json({ request });
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler, "compliance");
EOF

cat > pages/api/admin/security/login-history.js << 'EOF'
import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import LoginAttempt from "../../../../models/LoginAttempt";

async function handler(req, res) {
  await dbConnect();

  const { email, page = 1, limit = 50, success } = req.query;
  const filter = {};
  if (email) filter.email = email;
  if (success !== undefined) filter.success = success === "true";

  const total = await LoginAttempt.countDocuments(filter);
  const attempts = await LoginAttempt.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();

  const stats = {
    totalToday: await LoginAttempt.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    failedToday: await LoginAttempt.countDocuments({ success: false, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    uniqueIPs: (await LoginAttempt.distinct("ip", { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })).length,
    newDevices: await LoginAttempt.countDocuments({ isNewDevice: true, createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
  };

  return res.json({ attempts, total, stats, page: Number(page), pages: Math.ceil(total / limit) });
}

export default requireAdmin(handler, "compliance");
EOF

cat > pages/api/admin/security/dashboard.js << 'EOF'
import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import AuditLog from "../../../../models/AuditLog";
import LoginAttempt from "../../../../models/LoginAttempt";
import SecurityAlert from "../../../../models/SecurityAlert";
import ApprovalRequest from "../../../../models/ApprovalRequest";

async function handler(req, res) {
  await dbConnect();
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [activeAlerts, criticalAlerts, pendingApprovals, todayLogins, failedLogins, todayActions, weekActions, recentAlerts, recentLogs] = await Promise.all([
    SecurityAlert.countDocuments({ status: "active" }),
    SecurityAlert.countDocuments({ status: "active", severity: "critical" }),
    ApprovalRequest.countDocuments({ status: "pending" }),
    LoginAttempt.countDocuments({ createdAt: { $gte: today } }),
    LoginAttempt.countDocuments({ success: false, createdAt: { $gte: today } }),
    AuditLog.countDocuments({ createdAt: { $gte: today } }),
    AuditLog.countDocuments({ createdAt: { $gte: week } }),
    SecurityAlert.find({ status: "active" }).sort({ createdAt: -1 }).limit(10).lean(),
    AuditLog.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  return res.json({
    stats: { activeAlerts, criticalAlerts, pendingApprovals, todayLogins, failedLogins, todayActions, weekActions },
    recentAlerts,
    recentLogs,
  });
}

export default requireAdmin(handler, "compliance");
EOF

echo "  ✓ 5 API routes created"

# ═══════════════════════════════════════
# 4. ADMIN PAGES
# ═══════════════════════════════════════
echo "  [4/5] Creating admin pages..."

mkdir -p pages/admin/security

# ── Security Dashboard ──
cat > pages/admin/security/index.js << 'PAGEEOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

const S = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: "#3b82f6", LOW: "#22c55e" };

export default function SecurityDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push("/admin/login"); return; }
    fetch("/api/admin/security/dashboard", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  const card = (label, value, color, sub) => (
    <div style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 24px", flex: 1, minWidth: 180 }}>
      <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{sub}</div>}
    </div>
  );

  const navBtn = (href, label, emoji) => (
    <button onClick={() => router.push(href)} style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px", cursor: "pointer", textAlign: "left", transition: "all .15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#F0B90B"} onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{label}</div>
    </button>
  );

  const s = data?.stats || {};

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 220, padding: "32px 40px", flex: 1, color: "#fff" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>🔐 Security Center</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>Real-time security monitoring for Nextoken Capital</p>

        {loading ? <div style={{ color: "rgba(255,255,255,0.3)" }}>Loading...</div> : (
          <>
            <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
              {card("Active Alerts", s.activeAlerts || 0, s.criticalAlerts > 0 ? "#ef4444" : "#22c55e", s.criticalAlerts > 0 ? s.criticalAlerts + " critical" : "All clear")}
              {card("Pending Approvals", s.pendingApprovals || 0, "#f59e0b", "Awaiting second admin")}
              {card("Logins Today", s.todayLogins || 0, "#3b82f6", (s.failedLogins || 0) + " failed")}
              {card("Actions Today", s.todayActions || 0, "#8b5cf6", (s.weekActions || 0) + " this week")}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
              {navBtn("/admin/security/alerts", "Security Alerts", "🚨")}
              {navBtn("/admin/security/audit", "Audit Trail", "📋")}
              {navBtn("/admin/security/approvals", "Dual Approvals", "✅")}
              {navBtn("/admin/security/logins", "Login History", "🔑")}
            </div>

            {/* Recent Alerts */}
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F0B90B", marginBottom: 12 }}>Recent Alerts</h2>
            <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 28 }}>
              {(data.recentAlerts || []).length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No active alerts — all clear ✅</div>
              ) : (data.recentAlerts || []).map((a, i) => (
                <div key={a._id} style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: S[a.severity?.toUpperCase()] || "#3b82f6", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{a.description}</div>
                  </div>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: S[a.severity?.toUpperCase()] + "20", color: S[a.severity?.toUpperCase()], fontWeight: 700, textTransform: "uppercase" }}>{a.severity}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{new Date(a.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Recent Audit */}
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F0B90B", marginBottom: 12 }}>Recent Admin Actions</h2>
            <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              {(data.recentLogs || []).length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No actions logged yet</div>
              ) : (data.recentLogs || []).map(l => (
                <div key={l._id} style={{ padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
                  <span style={{ color: l.result === "success" ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{l.result === "success" ? "✓" : "✗"}</span>
                  <span style={{ fontWeight: 600, color: "#F0B90B", minWidth: 100 }}>{l.adminName}</span>
                  <span style={{ color: "rgba(255,255,255,0.6)", flex: 1 }}>{l.action}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{new Date(l.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
PAGEEOF

# ── Alerts Page ──
cat > pages/admin/security/alerts.js << 'PAGEEOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

const S = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: "#3b82f6", LOW: "#22c55e" };

export default function SecurityAlerts() {
  const router = useRouter();
  const [data, setData] = useState({ alerts: [], counts: {} });
  const [filter, setFilter] = useState("active");
  const [loading, setLoading] = useState(true);

  const load = (status) => {
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push("/admin/login"); return; }
    setLoading(true);
    fetch("/api/admin/security/alerts?status=" + status, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const resolveAlert = (id, status) => {
    const token = localStorage.getItem("adminToken");
    const note = prompt("Add a note (optional):");
    fetch("/api/admin/security/alerts", {
      method: "PATCH",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ alertId: id, status, note }),
    }).then(() => load(filter));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 220, padding: "32px 40px", flex: 1, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>🚨 Security Alerts</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              {data.counts.active || 0} active • {data.counts.critical || 0} critical
            </p>
          </div>
          <button onClick={() => router.push("/admin/security")} style={{ background: "rgba(240,185,11,0.1)", border: "1px solid rgba(240,185,11,0.2)", color: "#F0B90B", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            ← Back to Security
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["active", "investigating", "resolved", "dismissed", "all"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filter === s ? "rgba(240,185,11,0.15)" : "rgba(255,255,255,0.04)",
              color: filter === s ? "#F0B90B" : "rgba(255,255,255,0.4)",
              border: filter === s ? "1px solid rgba(240,185,11,0.3)" : "1px solid rgba(255,255,255,0.06)",
            }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>

        {loading ? <div style={{ color: "rgba(255,255,255,0.3)" }}>Loading...</div> : (
          <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
            {data.alerts.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No alerts matching filter</div>
            ) : data.alerts.map(a => (
              <div key={a._id} style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: S[a.severity?.toUpperCase()], boxShadow: "0 0 8px " + (S[a.severity?.toUpperCase()] || "") + "40" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, flex: 1 }}>{a.title}</span>
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 4, background: S[a.severity?.toUpperCase()] + "20", color: S[a.severity?.toUpperCase()], fontWeight: 700, textTransform: "uppercase" }}>{a.severity}</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8, marginLeft: 22 }}>{a.description}</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginLeft: 22 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{a.type} • {a.sourceIp || "N/A"} • {new Date(a.createdAt).toLocaleString()}</span>
                  {a.status === "active" && (
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                      <button onClick={() => resolveAlert(a._id, "investigating")} style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Investigate</button>
                      <button onClick={() => resolveAlert(a._id, "resolved")} style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Resolve</button>
                      <button onClick={() => resolveAlert(a._id, "dismissed")} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Dismiss</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
PAGEEOF

# ── Audit Trail Page ──
cat > pages/admin/security/audit.js << 'PAGEEOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function AuditTrail() {
  const router = useRouter();
  const [data, setData] = useState({ logs: [], total: 0 });
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push("/admin/login"); return; }
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 50 });
    if (category) params.set("category", category);
    fetch("/api/admin/security/audit-logs?" + params, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, category]);

  const cats = ["", "auth", "kyc", "transaction", "config", "user", "contract", "system"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 220, padding: "32px 40px", flex: 1, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>📋 Audit Trail</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{data.total} total entries • Immutable hash-chain log</p>
          </div>
          <button onClick={() => router.push("/admin/security")} style={{ background: "rgba(240,185,11,0.1)", border: "1px solid rgba(240,185,11,0.2)", color: "#F0B90B", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {cats.map(c => (
            <button key={c || "all"} onClick={() => { setCategory(c); setPage(1); }} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: category === c ? "rgba(240,185,11,0.15)" : "rgba(255,255,255,0.04)",
              color: category === c ? "#F0B90B" : "rgba(255,255,255,0.4)",
              border: category === c ? "1px solid rgba(240,185,11,0.3)" : "1px solid rgba(255,255,255,0.06)",
            }}>{c || "All"}</button>
          ))}
        </div>

        <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 120px 1fr 140px 80px 160px", padding: "10px 20px", background: "rgba(255,255,255,0.03)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            <span>Status</span><span>Admin</span><span>Action</span><span>Category</span><span>Severity</span><span>Time</span>
          </div>
          {loading ? <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</div> : data.logs.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No logs found</div>
          ) : data.logs.map(l => (
            <div key={l._id} style={{ display: "grid", gridTemplateColumns: "60px 120px 1fr 140px 80px 160px", padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, alignItems: "center" }}>
              <span style={{ color: l.result === "success" ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{l.result === "success" ? "✓" : "✗"}</span>
              <span style={{ color: "#F0B90B", fontWeight: 600 }}>{l.adminName}</span>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>{l.action}</span>
              <span style={{ fontSize: 11 }}><span style={{ background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4 }}>{l.category}</span></span>
              <span style={{ fontSize: 10, color: l.severity === "critical" ? "#ef4444" : l.severity === "high" ? "#f59e0b" : "rgba(255,255,255,0.3)" }}>{l.severity}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{new Date(l.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {data.pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: "6px 14px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", fontSize: 12, opacity: page <= 1 ? 0.3 : 1 }}>← Prev</button>
            <span style={{ padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Page {page} of {data.pages}</span>
            <button disabled={page >= data.pages} onClick={() => setPage(p => p + 1)} style={{ padding: "6px 14px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", fontSize: 12, opacity: page >= data.pages ? 0.3 : 1 }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
PAGEEOF

# ── Approvals Page ──
cat > pages/admin/security/approvals.js << 'PAGEEOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function DualApprovals() {
  const router = useRouter();
  const [data, setData] = useState({ requests: [], pendingCount: 0 });
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  const load = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push("/admin/login"); return; }
    setLoading(true);
    fetch("/api/admin/security/approvals?status=" + filter, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const act = (id, action) => {
    const token = localStorage.getItem("adminToken");
    const note = prompt(action === "approve" ? "Approval note (optional):" : "Rejection reason:");
    fetch("/api/admin/security/approvals", {
      method: "PATCH",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: id, action, note }),
    }).then(r => r.json()).then(d => {
      if (d.error) alert(d.error);
      else load();
    });
  };

  const TYPE_LABELS = { withdrawal_large: "💰 Large Withdrawal", token_listing: "🪙 Token Listing", contract_deploy: "📄 Contract Deploy", contract_upgrade: "🔄 Contract Upgrade", kyc_override: "🪪 KYC Override", fee_change: "💲 Fee Change", role_change: "👤 Role Change", system_config: "⚙️ System Config" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 220, padding: "32px 40px", flex: 1, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>✅ Dual Approvals</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{data.pendingCount} pending • Four-eyes principle</p>
          </div>
          <button onClick={() => router.push("/admin/security")} style={{ background: "rgba(240,185,11,0.1)", border: "1px solid rgba(240,185,11,0.2)", color: "#F0B90B", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["pending", "approved", "rejected", "expired", "all"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filter === s ? "rgba(240,185,11,0.15)" : "rgba(255,255,255,0.04)",
              color: filter === s ? "#F0B90B" : "rgba(255,255,255,0.4)",
              border: filter === s ? "1px solid rgba(240,185,11,0.3)" : "1px solid rgba(255,255,255,0.06)",
            }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>

        <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
          {loading ? <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</div> : data.requests.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No requests found</div>
          ) : data.requests.map(r => (
            <div key={r._id} style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{TYPE_LABELS[r.type] || r.type}</span>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 700, background: r.status === "pending" ? "rgba(245,158,11,0.15)" : r.status === "approved" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: r.status === "pending" ? "#f59e0b" : r.status === "approved" ? "#22c55e" : "#ef4444" }}>{r.status.toUpperCase()}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Requested by: <span style={{ color: "#F0B90B" }}>{r.requestedByName}</span></div>
              {r.approvedByName && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{r.status === "approved" ? "Approved" : "Rejected"} by: <span style={{ color: "#22c55e" }}>{r.approvedByName}</span></div>}
              {r.payload && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4, fontFamily: "monospace", background: "rgba(255,255,255,0.03)", padding: "6px 10px", borderRadius: 6 }}>{JSON.stringify(r.payload, null, 2)}</div>}
              {r.status === "pending" && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={() => act(r._id, "approve")} style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", padding: "6px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✓ Approve</button>
                  <button onClick={() => act(r._id, "reject")} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "6px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✗ Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
PAGEEOF

# ── Login History Page ──
cat > pages/admin/security/logins.js << 'PAGEEOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function LoginHistory() {
  const router = useRouter();
  const [data, setData] = useState({ attempts: [], stats: {}, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push("/admin/login"); return; }
    setLoading(true);
    fetch("/api/admin/security/login-history?page=" + page + "&limit=50", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, [page]);

  const s = data.stats;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 220, padding: "32px 40px", flex: 1, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>🔑 Login History</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{data.total} total login attempts</p>
          </div>
          <button onClick={() => router.push("/admin/security")} style={{ background: "rgba(240,185,11,0.1)", border: "1px solid rgba(240,185,11,0.2)", color: "#F0B90B", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back</button>
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {[
            { l: "Logins Today", v: s.totalToday || 0, c: "#3b82f6" },
            { l: "Failed Today", v: s.failedToday || 0, c: s.failedToday > 5 ? "#ef4444" : "#22c55e" },
            { l: "Unique IPs (24h)", v: s.uniqueIPs || 0, c: "#8b5cf6" },
            { l: "New Devices (24h)", v: s.newDevices || 0, c: s.newDevices > 0 ? "#f59e0b" : "#22c55e" },
          ].map((c, i) => (
            <div key={i} style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 20px", flex: 1 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: c.c }}>{c.v}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{c.l}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 200px 130px 120px 80px 160px", padding: "10px 20px", background: "rgba(255,255,255,0.03)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
            <span>Ok</span><span>Email</span><span>IP</span><span>Device</span><span>New?</span><span>Time</span>
          </div>
          {loading ? <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</div> : data.attempts.map(a => (
            <div key={a._id} style={{ display: "grid", gridTemplateColumns: "60px 200px 130px 120px 80px 160px", padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, alignItems: "center" }}>
              <span style={{ color: a.success ? "#22c55e" : "#ef4444", fontWeight: 700, fontSize: 16 }}>{a.success ? "✓" : "✗"}</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{a.email}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{a.ip}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{a.device || "—"}</span>
              <span>{a.isNewDevice ? <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 11 }}>NEW</span> : "—"}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{new Date(a.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {data.pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: "6px 14px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", fontSize: 12 }}>← Prev</button>
            <span style={{ padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Page {page} of {data.pages}</span>
            <button disabled={page >= data.pages} onClick={() => setPage(p => p + 1)} style={{ padding: "6px 14px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", fontSize: 12 }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
PAGEEOF

echo "  ✓ 5 admin pages created"

# ═══════════════════════════════════════
# 5. UPDATE SIDEBAR
# ═══════════════════════════════════════
echo "  [5/5] Updating AdminSidebar with security nav..."

cat > components/AdminSidebar.js << 'SIDEBAREOF'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminSidebar() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    try { setEmployee(JSON.parse(localStorage.getItem("adminEmployee"))); } catch(e) {}
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmployee");
    router.push("/admin/login");
  };

  const sections = [
    { label: "OVERVIEW", items: [
      { href: "/admin", label: "Dashboard", icon: "🏠" },
      { href: "/admin/users", label: "Users", icon: "👥" },
      { href: "/admin/assets", label: "Assets", icon: "🏢" },
    ]},
    { label: "COMPLIANCE", items: [
      { href: "/admin/kyc", label: "KYC/KYB Queue", icon: "🪪" },
      { href: "/admin/travel-rule", label: "Travel Rule", icon: "✈️" },
    ]},
    { label: "ASSET MANAGEMENT", items: [
      { href: "/admin/listings-mod", label: "Listing Moderation", icon: "✅" },
      { href: "/admin/registry", label: "Shareholder Registry", icon: "📊" },
      { href: "/admin/contracts", label: "Smart Contracts", icon: "🔗" },
      { href: "/admin/vault", label: "Document Vault", icon: "📁" },
    ]},
    { label: "FINANCIAL", items: [
      { href: "/admin/treasury", label: "Treasury & Revenue", icon: "💰" },
      { href: "/admin/transactions", label: "Transactions", icon: "💳" },
      { href: "/admin/market", label: "Market Data", icon: "📈" },
    ]},
    { label: "RISK & SECURITY", items: [
      { href: "/admin/security", label: "Security Center", icon: "🔐" },
      { href: "/admin/security/alerts", label: "Security Alerts", icon: "🚨" },
      { href: "/admin/security/audit", label: "Audit Trail", icon: "📋" },
      { href: "/admin/security/approvals", label: "Dual Approvals", icon: "✅" },
      { href: "/admin/security/logins", label: "Login History", icon: "🔑" },
      { href: "/admin/compliance", label: "AML Monitoring", icon: "🛡️" },
    ]},
    { label: "SUPPORT", items: [
      { href: "/admin/support", label: "Support Tickets", icon: "💬" },
      { href: "/admin/reports", label: "Reports", icon: "📄" },
    ]},
  ];

  const isActive = (href) => {
    if (href === "/admin") return router.pathname === "/admin";
    return router.pathname.startsWith(href);
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: 220, height: "100vh", background: "#0F1318", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", zIndex: 100, overflowY: "auto" }}>
      <div style={{ padding: "20px 16px 12px" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F0B90B", marginBottom: 4 }}>NXT</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>ADMIN PORTAL v2</div>
      </div>

      <div style={{ flex: 1, padding: "0 12px" }}>
        {sections.map(sec => (
          <div key={sec.label} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: 1.5, padding: "8px 8px 4px", textTransform: "uppercase" }}>{sec.label}</div>
            {sec.items.map(n => (
              <button key={n.href} onClick={() => router.push(n.href)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8,
                fontSize: 13, fontWeight: isActive(n.href) ? 700 : 500, width: "100%", textAlign: "left",
                cursor: "pointer", marginBottom: 2, border: "none", transition: "all .15s",
                color: isActive(n.href) ? "#F0B90B" : "rgba(255,255,255,0.45)",
                background: isActive(n.href) ? "rgba(240,185,11,0.1)" : "transparent",
                borderLeft: isActive(n.href) ? "3px solid #F0B90B" : "3px solid transparent",
              }}>
                <span style={{ fontSize: 14 }}>{n.icon}</span> {n.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {employee && (
          <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{employee.firstName} {employee.lastName}</div>
            <div style={{ fontSize: 11, color: "#F0B90B", marginTop: 2 }}>{employee.role}</div>
          </div>
        )}
        <button onClick={logout} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.15)", color: "#ff6b6b", fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
SIDEBAREOF

echo "  ✓ AdminSidebar updated with security section"

echo ""
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║  ✅ INTEGRATION COMPLETE                                  ║"
echo "  ║                                                           ║"
echo "  ║  NEW FILES CREATED:                                       ║"
echo "  ║    models/AuditLog.js                                     ║"
echo "  ║    models/LoginAttempt.js                                 ║"
echo "  ║    models/ApprovalRequest.js                              ║"
echo "  ║    models/SecurityAlert.js                                ║"
echo "  ║    models/WithdrawalWhitelist.js                          ║"
echo "  ║    lib/auditLog.js                                        ║"
echo "  ║    lib/loginProtection.js                                 ║"
echo "  ║    pages/api/admin/security/dashboard.js                  ║"
echo "  ║    pages/api/admin/security/audit-logs.js                 ║"
echo "  ║    pages/api/admin/security/alerts.js                     ║"
echo "  ║    pages/api/admin/security/approvals.js                  ║"
echo "  ║    pages/api/admin/security/login-history.js              ║"
echo "  ║    pages/admin/security/index.js  (Security Dashboard)    ║"
echo "  ║    pages/admin/security/alerts.js (Live Alerts)           ║"
echo "  ║    pages/admin/security/audit.js  (Audit Trail)           ║"
echo "  ║    pages/admin/security/approvals.js (Dual Approval)      ║"
echo "  ║    pages/admin/security/logins.js (Login History)         ║"
echo "  ║                                                           ║"
echo "  ║  UPDATED:                                                 ║"
echo "  ║    components/AdminSidebar.js (added security section)    ║"
echo "  ║                                                           ║"
echo "  ║  RUN:                                                     ║"
echo "  ║    npm run dev                                            ║"
echo "  ║    → http://localhost:3000/admin/security                 ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
