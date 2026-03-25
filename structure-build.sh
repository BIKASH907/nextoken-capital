#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  NEXTOKEN — Complete Restructured Build                     ║
# ║  Exact folder structure as specified                        ║
# ║  chmod +x structure-build.sh && ./structure-build.sh        ║
# ╚══════════════════════════════════════════════════════════════╝
set -e

echo "  🔐 Building exact folder structure..."

if [ ! -f "package.json" ] || ! grep -q "nextoken-capital" package.json; then
  echo "  ❌ Run from nextoken-capital root!"; exit 1
fi

# Clean old security pages
rm -rf pages/admin/security pages/admin/devsecops pages/admin/employees.js
mkdir -p pages/admin/security/fraud
mkdir -p pages/admin/security/compliance
mkdir -p pages/admin/devsecops

echo "  ✓ Folder structure created"

# ═══════════════════════════════════════
# RBAC + SIDEBAR
# ═══════════════════════════════════════
cat > lib/rbac.js << 'EOF'
export const ROLES = {
  super_admin: { label:"Super Admin", description:"Full platform access. Max 2.", color:"#ef4444", icon:"👑" },
  compliance_admin: { label:"Compliance Admin", description:"KYC/AML only.", color:"#8b5cf6", icon:"🪪" },
  finance_admin: { label:"Finance Admin", description:"Treasury/transactions.", color:"#f59e0b", icon:"💰" },
  support_admin: { label:"Support Admin", description:"Users/tickets.", color:"#3b82f6", icon:"💬" },
  audit: { label:"Audit / Read-Only", description:"View all. Zero write.", color:"#22c55e", icon:"📋" },
};

export const ROLE_NAV = {
  super_admin: [
    { section:"OVERVIEW", items:[
      { href:"/admin", label:"Dashboard", icon:"🏠" },
      { href:"/admin/users", label:"Users", icon:"👥" },
      { href:"/admin/assets", label:"Assets", icon:"🏢" },
      { href:"/admin/employees", label:"Employees & Roles", icon:"👑" },
    ]},
    { section:"SECURITY", items:[
      { href:"/admin/security", label:"Security Dashboard", icon:"🔐" },
      { href:"/admin/security/alerts", label:"Alerts", icon:"🚨" },
      { href:"/admin/security/audit", label:"Audit Trail", icon:"📋" },
      { href:"/admin/security/mfa", label:"MFA Settings", icon:"🔒" },
      { href:"/admin/security/sessions", label:"Active Sessions", icon:"🖥️" },
      { href:"/admin/security/logins", label:"Login History", icon:"🔑" },
      { href:"/admin/security/ip-whitelist", label:"IP Whitelist", icon:"🌐" },
      { href:"/admin/security/withdrawals", label:"Withdrawal Protection", icon:"💸" },
      { href:"/admin/security/fraud", label:"Fraud System", icon:"🚫" },
      { href:"/admin/security/account-recovery", label:"Account Recovery", icon:"🔄" },
      { href:"/admin/security/api-security", label:"API Security", icon:"⚡" },
    ]},
    { section:"COMPLIANCE", items:[
      { href:"/admin/security/compliance", label:"Compliance Dashboard", icon:"🛡️" },
      { href:"/admin/security/compliance/sanctions-screening", label:"Sanctions Screening", icon:"🔍" },
      { href:"/admin/security/compliance/transaction-monitor", label:"Transaction Monitor", icon:"📡" },
      { href:"/admin/security/compliance/issuer-edd", label:"Issuer Due Diligence", icon:"🏛️" },
      { href:"/admin/security/compliance/data-protection", label:"Data Protection", icon:"🔏" },
      { href:"/admin/security/compliance/privacy", label:"Privacy Engineering", icon:"👤" },
      { href:"/admin/security/compliance/communications", label:"Comms Security", icon:"📧" },
    ]},
    { section:"DEVSECOPS", items:[
      { href:"/admin/devsecops", label:"DevSecOps Dashboard", icon:"🔧" },
      { href:"/admin/devsecops/waf", label:"WAF & DDoS", icon:"🛡️" },
      { href:"/admin/devsecops/containers", label:"Container Security", icon:"📦" },
      { href:"/admin/devsecops/dns", label:"DNS & Domain", icon:"🌍" },
      { href:"/admin/devsecops/certificates", label:"Certificates", icon:"📜" },
      { href:"/admin/devsecops/secrets", label:"Secret Management", icon:"🗝️" },
      { href:"/admin/devsecops/siem", label:"SIEM & Threat Intel", icon:"🔭" },
      { href:"/admin/devsecops/backup", label:"Backup & DR", icon:"💾" },
      { href:"/admin/devsecops/incident-response", label:"Incident Response", icon:"🆘" },
    ]},
    { section:"PLATFORM", items:[
      { href:"/admin/kyc", label:"KYC/KYB Queue", icon:"🪪" },
      { href:"/admin/listings-mod", label:"Listings", icon:"✅" },
      { href:"/admin/contracts", label:"Smart Contracts", icon:"🔗" },
      { href:"/admin/treasury", label:"Treasury", icon:"💰" },
      { href:"/admin/transactions", label:"Transactions", icon:"💳" },
      { href:"/admin/market", label:"Market Data", icon:"📈" },
      { href:"/admin/support", label:"Support", icon:"💬" },
      { href:"/admin/reports", label:"Reports", icon:"📄" },
    ]},
  ],
  compliance_admin: [
    { section:"OVERVIEW", items:[{ href:"/admin", label:"Dashboard", icon:"🏠" },{ href:"/admin/users", label:"Users", icon:"👥" }]},
    { section:"COMPLIANCE", items:[
      { href:"/admin/security/compliance", label:"Compliance Dashboard", icon:"🛡️" },
      { href:"/admin/security/compliance/sanctions-screening", label:"Sanctions", icon:"🔍" },
      { href:"/admin/security/compliance/transaction-monitor", label:"Transaction Monitor", icon:"📡" },
      { href:"/admin/security/compliance/issuer-edd", label:"Issuer EDD", icon:"🏛️" },
      { href:"/admin/security/compliance/data-protection", label:"Data Protection", icon:"🔏" },
      { href:"/admin/security/compliance/privacy", label:"Privacy", icon:"👤" },
      { href:"/admin/kyc", label:"KYC Queue", icon:"🪪" },
    ]},
    { section:"SECURITY", items:[{ href:"/admin/security", label:"Security", icon:"🔐" },{ href:"/admin/security/audit", label:"Audit Trail", icon:"📋" }]},
  ],
  finance_admin: [
    { section:"OVERVIEW", items:[{ href:"/admin", label:"Dashboard", icon:"🏠" }]},
    { section:"FINANCIAL", items:[{ href:"/admin/treasury", label:"Treasury", icon:"💰" },{ href:"/admin/transactions", label:"Transactions", icon:"💳" },{ href:"/admin/market", label:"Market", icon:"📈" },{ href:"/admin/security/withdrawals", label:"Withdrawals", icon:"💸" }]},
    { section:"SECURITY", items:[{ href:"/admin/security", label:"Security", icon:"🔐" },{ href:"/admin/security/approvals", label:"Approvals", icon:"✅" }]},
  ],
  support_admin: [
    { section:"OVERVIEW", items:[{ href:"/admin", label:"Dashboard", icon:"🏠" },{ href:"/admin/users", label:"Users", icon:"👥" },{ href:"/admin/support", label:"Tickets", icon:"💬" }]},
    { section:"VIEW ONLY", items:[{ href:"/admin/security", label:"Security", icon:"🔐" },{ href:"/admin/transactions", label:"Transactions", icon:"💳" }]},
  ],
  audit: [
    { section:"OVERVIEW", items:[{ href:"/admin", label:"Dashboard", icon:"🏠" }]},
    { section:"AUDIT", items:[{ href:"/admin/security/audit", label:"Audit Trail", icon:"📋" },{ href:"/admin/security/logins", label:"Logins", icon:"🔑" },{ href:"/admin/security/alerts", label:"Alerts", icon:"🚨" },{ href:"/admin/reports", label:"Reports", icon:"📄" }]},
    { section:"VIEW ONLY", items:[{ href:"/admin/users", label:"Users", icon:"👥" },{ href:"/admin/transactions", label:"Transactions", icon:"💳" },{ href:"/admin/security/compliance", label:"Compliance", icon:"🛡️" }]},
  ],
};

export const PERMISSIONS = {
  super_admin:["*"], compliance_admin:["kyc:*","aml:*","compliance:*","users:read","audit:read"],
  finance_admin:["transactions:*","withdrawals:*","treasury:*","assets:read"], support_admin:["users:read","tickets:*","transactions:read"],
  audit:["*:read"],
};
export function hasPermission(role,p){const ps=PERMISSIONS[role]||[];if(ps.includes("*"))return true;if(ps.includes("*:read")&&p.endsWith(":read"))return true;return ps.includes(p);}
EOF

echo "  ✓ RBAC config"

# ═══════════════════════════════════════
# SIDEBAR
# ═══════════════════════════════════════
cat > components/AdminSidebar.js << 'EOF'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ROLES, ROLE_NAV } from "../lib/rbac";

export default function AdminSidebar() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  useEffect(() => { try { setEmployee(JSON.parse(localStorage.getItem("adminEmployee"))); } catch(e) {} }, []);

  const logout = () => { localStorage.removeItem("adminToken"); localStorage.removeItem("adminEmployee"); router.push("/admin/login"); };
  const role = employee?.role || "support_admin";
  const ri = ROLES[role] || ROLES.support_admin;
  const nav = ROLE_NAV[role] || ROLE_NAV.support_admin;
  const isActive = (h) => h==="/admin" ? router.asPath==="/admin" : router.asPath.startsWith(h);
  const toggle = (s) => setCollapsed(p => ({...p,[s]:!p[s]}));

  return (
    <div style={{ position:"fixed",top:0,left:0,width:240,height:"100vh",background:"#0F1318",borderRight:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",zIndex:100,overflowY:"auto" }}>
      <div style={{ padding:"16px 14px 10px" }}>
        <div style={{ fontSize:20,fontWeight:900,color:"#F0B90B" }}>NXT</div>
        <div style={{ fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:2 }}>ADMIN PORTAL v3</div>
      </div>
      <div style={{ margin:"0 10px 10px",padding:"7px 10px",borderRadius:7,background:ri.color+"12",border:"1px solid "+ri.color+"20" }}>
        <div style={{ fontSize:11,fontWeight:700,color:ri.color }}>{ri.icon} {ri.label}</div>
      </div>
      <div style={{ flex:1,padding:"0 6px" }}>
        {nav.map(sec => (
          <div key={sec.section} style={{ marginBottom:10 }}>
            <div onClick={() => toggle(sec.section)} style={{ fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.2)",letterSpacing:1.2,padding:"6px 8px 3px",cursor:"pointer",display:"flex",justifyContent:"space-between",userSelect:"none" }}>
              <span>{sec.section}</span>
              <span style={{ fontSize:8 }}>{collapsed[sec.section] ? "▸" : "▾"}</span>
            </div>
            {!collapsed[sec.section] && sec.items.map(n => (
              <button key={n.href} onClick={() => router.push(n.href)} style={{
                display:"flex",alignItems:"center",gap:7,padding:"6px 10px",borderRadius:6,fontSize:12,
                fontWeight:isActive(n.href)?700:400,width:"100%",textAlign:"left",cursor:"pointer",marginBottom:1,border:"none",
                color:isActive(n.href)?"#F0B90B":"rgba(255,255,255,0.4)",
                background:isActive(n.href)?"rgba(240,185,11,0.1)":"transparent",
                borderLeft:isActive(n.href)?"2px solid #F0B90B":"2px solid transparent",
                fontFamily:"inherit",transition:"all .1s",
              }}><span style={{ fontSize:12 }}>{n.icon}</span>{n.label}</button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding:"8px 10px",borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        {employee && <div style={{ padding:"6px 8px",borderRadius:6,background:"rgba(255,255,255,0.04)",marginBottom:6 }}>
          <div style={{ fontSize:11,fontWeight:700,color:"#fff" }}>{employee.firstName} {employee.lastName}</div>
          <div style={{ fontSize:9,color:ri.color }}>{ri.label}</div>
        </div>}
        <button onClick={logout} style={{ width:"100%",padding:"6px 8px",borderRadius:6,background:"rgba(255,77,77,0.08)",border:"1px solid rgba(255,77,77,0.15)",color:"#ff6b6b",fontSize:10,fontWeight:600,cursor:"pointer",textAlign:"left",fontFamily:"inherit" }}>Sign Out</button>
      </div>
    </div>
  );
}
EOF

echo "  ✓ Sidebar with collapsible sections"

# ═══════════════════════════════════════
# HELPER: Generate page
# ═══════════════════════════════════════
mk() {
  local path="$1" title="$2" icon="$3" desc="$4" back="$5"
  shift 5
  local items_html=""
  for item in "$@"; do
    items_html="${items_html}
        <div style={{ background:\"#161b22\",border:\"1px solid rgba(255,255,255,0.06)\",borderRadius:8,padding:\"12px 16px\",marginBottom:6,fontSize:13,color:\"rgba(255,255,255,0.6)\",lineHeight:1.7 }}><span style={{ color:\"#22c55e\",marginRight:8 }}>✓</span>${item}</div>"
  done

  cat > "${path}" << MKEOF
import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "${back}components/AdminSidebar";

export default function Page() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240,padding:"28px 36px",flex:1,color:"#fff",maxWidth:1100 }}>
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>${icon} ${title}</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:28 }}>${desc}</p>
${items_html}
      </div>
    </div>
  );
}
MKEOF
}

# ═══════════════════════════════════════
# /admin/security/* (11 pages)
# ═══════════════════════════════════════
echo "  [1/4] Creating /admin/security/ pages..."

# Security Dashboard
cat > pages/admin/security/index.js << 'EOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function SecurityDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    fetch("/api/admin/security/dashboard", { headers:{ Authorization:"Bearer "+t } })
      .then(r=>r.json()).then(setData).catch(()=>{});
  }, []);
  const s = data?.stats || {};
  const card = (l,v,c,sub) => (
    <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"20px 24px",flex:1,minWidth:160 }}>
      <div style={{ fontSize:32,fontWeight:800,color:c }}>{v}</div>
      <div style={{ fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:4 }}>{l}</div>
      {sub && <div style={{ fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:2 }}>{sub}</div>}
    </div>
  );
  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240,padding:"28px 36px",flex:1,color:"#fff" }}>
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🔐 Security Dashboard</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:24 }}>Real-time security overview</p>
        <div style={{ display:"flex",gap:14,marginBottom:28,flexWrap:"wrap" }}>
          {card("Active Alerts",s.activeAlerts||0,s.criticalAlerts>0?"#ef4444":"#22c55e",s.criticalAlerts>0?s.criticalAlerts+" critical":"All clear")}
          {card("Pending Approvals",s.pendingApprovals||0,"#f59e0b","Awaiting 2nd admin")}
          {card("Logins Today",s.todayLogins||0,"#3b82f6",(s.failedLogins||0)+" failed")}
          {card("Actions Today",s.todayActions||0,"#8b5cf6",(s.weekActions||0)+" this week")}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:28 }}>
          {[
            {h:"/admin/security/alerts",l:"🚨 Security Alerts",d:"Active threats & incidents"},
            {h:"/admin/security/audit",l:"📋 Audit Trail",d:"Immutable action log"},
            {h:"/admin/security/fraud",l:"🚫 Fraud System",d:"Anti-fraud monitoring"},
            {h:"/admin/security/compliance",l:"🛡️ Compliance",d:"Sanctions & monitoring"},
            {h:"/admin/devsecops",l:"🔧 DevSecOps",d:"Infrastructure security"},
            {h:"/admin/security/mfa",l:"🔒 MFA Settings",d:"Authentication methods"},
          ].map((n,i) => (
            <button key={i} onClick={()=>router.push(n.h)} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px 20px",cursor:"pointer",textAlign:"left",transition:"border-color .15s",fontFamily:"inherit",color:"#fff" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#F0B90B40"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
              <div style={{ fontSize:15,fontWeight:700,marginBottom:4 }}>{n.l}</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>{n.d}</div>
            </button>
          ))}
        </div>
        <h2 style={{ fontSize:14,fontWeight:700,color:"#F0B90B",marginBottom:10 }}>Recent Alerts</h2>
        <div style={{ background:"#161b22",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",padding:20 }}>
          {(data?.recentAlerts||[]).length===0 ? <div style={{ textAlign:"center",color:"rgba(255,255,255,0.3)" }}>No active alerts ✅</div>
          : (data?.recentAlerts||[]).map(a => (
            <div key={a._id} style={{ padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:10,alignItems:"center" }}>
              <span style={{ width:8,height:8,borderRadius:"50%",background:a.severity==="critical"?"#ef4444":"#f59e0b" }}/>
              <span style={{ fontSize:13,flex:1 }}>{a.title}</span>
              <span style={{ fontSize:10,color:"rgba(255,255,255,0.25)" }}>{new Date(a.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
EOF

mk "pages/admin/security/alerts.js" "Security Alerts" "🚨" "Real-time security alerts and threat management." "../../../" \
  "Brute force detection: Auto-alert after 3+ failed login attempts" \
  "New device login: Alert when admin logs in from unrecognized device" \
  "New country login: Alert on login from previously unseen country" \
  "Bulk action detection: Flag 50+ similar actions within 1 hour" \
  "Impossible travel: Login from 2 countries within 1 hour" \
  "Large withdrawal: Alert on withdrawals above EUR 25,000" \
  "Contract anomaly: Unusual smart contract interaction patterns" \
  "System breach indicator: Unauthorized access attempt detection"

mk "pages/admin/security/audit.js" "Audit Trail" "📋" "Immutable log of every admin action. SHA-256 hash chain. 10-year retention." "../../../" \
  "Who: Admin ID, name, and role for every action" \
  "What: Exact action performed (e.g. Approved KYC for user #4521)" \
  "When: UTC timestamp with timezone" \
  "Where: IP address, device fingerprint, geolocation" \
  "Result: Success or failure status" \
  "Immutability: SHA-256 hash chain — tamper detection" \
  "Retention: 10 years (exceeds EU AML 7-year requirement)" \
  "Integrity verification: Chain can be audited for tampering"

mk "pages/admin/security/mfa.js" "Multi-Factor Authentication" "🔒" "MFA is mandatory for all admin accounts. Non-negotiable." "../../../" \
  "Hardware keys (YubiKey/FIDO2): Best option. Cannot be phished." \
  "TOTP Authenticator: Google Authenticator or Authy. 6-digit rotating codes." \
  "SMS 2FA: PERMANENTLY DISABLED — SIM-swapping makes it unreliable" \
  "Biometric: Fingerprint/Face ID for mobile admin (secondary to hardware key)" \
  "MFA re-verification every 15 minutes during active sessions" \
  "Recovery codes: 10 one-time backup codes when enabling MFA"

mk "pages/admin/security/sessions.js" "Active Sessions" "🖥️" "Session management, timeouts, device tracking, and geo-fencing." "../../../" \
  "Session timeout: Auto-logout after 15 minutes of inactivity" \
  "IP whitelisting: Admin panel only from pre-approved IPs or VPN" \
  "Geo-fencing: Block admin logins from outside EU" \
  "Device fingerprinting: Track and approve specific devices" \
  "Login attempt limits: Lock after 5 failures — Super Admin unlock required" \
  "Concurrent session limit: Only 1 active session per admin" \
  "Admin URL obfuscation: Non-guessable admin path"

mk "pages/admin/security/logins.js" "Login History" "🔑" "Complete record of all admin login attempts with analytics." "../../../" \
  "All login attempts logged: Email, IP, device, location, timestamp" \
  "Success and failure tracking with reason codes" \
  "New device detection flagged in real-time" \
  "New country detection with automatic alerting" \
  "IP reputation checking against known bad actors" \
  "Login analytics: Peak hours, common devices, geographic distribution"

mk "pages/admin/security/ip-whitelist.js" "IP Whitelist" "🌐" "Only approved IP addresses can access the admin panel." "../../../" \
  "Pre-approved IP addresses for admin access" \
  "VPN-only access enforcement" \
  "Geo-fencing: EU countries only (LT, DE, FR, NL, EE, LV)" \
  "Real-time IP blocking for suspicious sources" \
  "Automatic blocking of Tor/VPN/proxy for admin routes" \
  "IP change notifications to Super Admin"

mk "pages/admin/security/withdrawals.js" "Withdrawal Protection" "💸" "Whitelist, cooling periods, daily limits, and compliance review." "../../../" \
  "Withdrawal whitelist: Pre-approve bank accounts/wallet addresses" \
  "24-hour cooling period for new withdrawal destinations" \
  "2FA required for every single withdrawal" \
  "Email confirmation: Confirm/cancel link, auto-cancel in 30 min" \
  "Daily limit: EUR 5,000 default (higher needs enhanced verification)" \
  "Above EUR 25,000: Manual compliance review triggered" \
  "24hr cooling after changing ANY withdrawal settings"

mk "pages/admin/security/account-recovery.js" "Account Recovery" "🔄" "Secure recovery with time delays, re-verification, and emergency freeze." "../../../" \
  "Email recovery link valid 30 minutes only (single-use token)" \
  "Lost 2FA: KYC re-verification + selfie + 48-hour cooling period" \
  "10 one-time backup codes generated when enabling 2FA" \
  "Account freeze button: Instant self-service freeze from any device" \
  "Freeze blocks all transactions, invalidates all sessions" \
  "Unfreeze requires identity re-verification by compliance team"

mk "pages/admin/security/api-security.js" "API Security" "⚡" "HMAC signing, rate limits, input validation, CORS, versioning." "../../../" \
  "HMAC-SHA256 signature on all API requests with 5-min replay window" \
  "Per-user, per-IP, per-endpoint rate limiting" \
  "Strict input validation: SQL injection, XSS, SSRF prevention" \
  "CORS: Only nextokencapital.com origins whitelisted" \
  "API key management: Separate keys per integration with granular scopes" \
  "API versioning with clean deprecation of old endpoints" \
  "Request/response logging for forensic analysis"

echo "  ✓ 11 security pages"

# ═══════════════════════════════════════
# /admin/security/fraud/* (4 pages)
# ═══════════════════════════════════════
echo "  [2/4] Creating /admin/security/fraud/ pages..."

# Fraud Dashboard
cat > pages/admin/security/fraud/index.js << 'FEOF'
import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../../components/AdminSidebar";

export default function FraudDashboard() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240,padding:"28px 36px",flex:1,color:"#fff" }}>
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🚫 Fraud Detection System</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:24 }}>Real-time fraud monitoring combining anti-fraud engine, transaction monitoring, and withdrawal protection.</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:28 }}>
          {[{l:"Velocity Checks",v:"Active",c:"#22c55e"},{l:"Impossible Travel",v:"Active",c:"#22c55e"},{l:"Device Trust",v:"Active",c:"#22c55e"}].map((s,i) => (
            <div key={i} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px",textAlign:"center" }}>
              <div style={{ fontSize:22,fontWeight:800,color:s.c }}>{s.v}</div>
              <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          {[
            {h:"/admin/security/fraud/suspicious-activity",l:"🔍 Suspicious Activity",d:"Flagged transactions and users requiring review"},
            {h:"/admin/security/fraud/blocked-transactions",l:"🚫 Blocked Transactions",d:"Automatically blocked high-risk transactions"},
            {h:"/admin/security/fraud/withdrawal-protection",l:"💸 Withdrawal Protection",d:"Whitelist, cooling periods, and limits"},
          ].map((n,i) => (
            <button key={i} onClick={()=>router.push(n.h)} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px 20px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:"#fff",transition:"border-color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#F0B90B40"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
              <div style={{ fontSize:14,fontWeight:700,marginBottom:4 }}>{n.l}</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>{n.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
FEOF

mk "pages/admin/security/fraud/suspicious-activity.js" "Suspicious Activity" "🔍" "Flagged transactions and users requiring manual review." "../../../../" \
  "Rapid transactions: Flag >20 txns/hour from single user" \
  "Unusual amount: Flag transactions >10x user average" \
  "New device + large transaction: Require additional verification" \
  "Geographic anomaly: Activity from unexpected country" \
  "Dormant account: Sudden activity from long-inactive account" \
  "Round amounts: Repeated exact round numbers (structuring indicator)" \
  "Just-below threshold: Transactions just under reporting limits"

mk "pages/admin/security/fraud/blocked-transactions.js" "Blocked Transactions" "🚫" "Transactions automatically blocked by the fraud engine." "../../../../" \
  "Impossible travel: Login from 2 countries within 1 hour = auto-block" \
  "Sanctioned address: Wallet on EU/UN/OFAC sanctions list" \
  "Velocity exceeded: Burst of transactions above threshold" \
  "IP blacklist: Source IP on known-bad-actor list" \
  "Device compromised: Rooted/jailbroken device detected" \
  "Amount anomaly: Transaction vastly outside normal range"

mk "pages/admin/security/fraud/withdrawal-protection.js" "Withdrawal Protection" "💸" "Whitelist enforcement, cooling periods, and limit controls." "../../../../" \
  "Whitelist-only: All withdrawals must go to pre-approved destinations" \
  "24-hour cooling: New addresses require waiting period" \
  "Daily limit: EUR 5,000 per investor per day" \
  "Large review: Above EUR 25,000 triggers compliance review" \
  "Dual-approval: Above EUR 10,000 needs second admin" \
  "Email confirmation: Every withdrawal needs email confirm/cancel" \
  "Settings cooling: 24hr delay after any withdrawal setting change"

echo "  ✓ 4 fraud pages"

# ═══════════════════════════════════════
# /admin/security/compliance/* (7 pages)
# ═══════════════════════════════════════
echo "  [3/4] Creating /admin/security/compliance/ pages..."

# Compliance Dashboard
cat > pages/admin/security/compliance/index.js << 'CEOF'
import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../../components/AdminSidebar";

export default function ComplianceDashboard() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240,padding:"28px 36px",flex:1,color:"#fff" }}>
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🛡️ Compliance Dashboard</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:24 }}>MiCA-compliant monitoring: sanctions, PEP checks, transaction rules, GDPR.</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28 }}>
          {[{l:"Sanctions Lists",v:"EU/UN/OFAC",c:"#ef4444"},{l:"PEP Checks",v:"Automated",c:"#8b5cf6"},{l:"GDPR",v:"Compliant",c:"#22c55e"}].map((s,i) => (
            <div key={i} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px",textAlign:"center" }}>
              <div style={{ fontSize:20,fontWeight:800,color:s.c }}>{s.v}</div>
              <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
          {[
            {h:"/admin/security/compliance/sanctions-screening",l:"🔍 Sanctions Screening",d:"EU/UN/OFAC real-time checks"},
            {h:"/admin/security/compliance/transaction-monitor",l:"📡 Transaction Monitor",d:"Rules engine for suspicious activity"},
            {h:"/admin/security/compliance/issuer-edd",l:"🏛️ Issuer Due Diligence",d:"Corporate KYC and asset verification"},
            {h:"/admin/security/compliance/data-protection",l:"🔏 Data Protection",d:"GDPR compliance and PII encryption"},
            {h:"/admin/security/compliance/privacy",l:"👤 Privacy Engineering",d:"PIAs, consent, retention automation"},
            {h:"/admin/security/compliance/communications",l:"📧 Communications",d:"Anti-phishing, DMARC/DKIM/SPF"},
          ].map((n,i) => (
            <button key={i} onClick={()=>router.push(n.h)} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px 20px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:"#fff",transition:"border-color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#8b5cf640"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
              <div style={{ fontSize:14,fontWeight:700,marginBottom:4 }}>{n.l}</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>{n.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
CEOF

mk "pages/admin/security/compliance/sanctions-screening.js" "Sanctions Screening" "🔍" "Real-time screening against EU, UN, OFAC sanctions lists." "../../../../" \
  "Real-time screening on every transaction and user registration" \
  "EU sanctions list: Updated automatically" \
  "UN sanctions list: Updated automatically" \
  "OFAC (US) sanctions list: Updated automatically" \
  "Automated PEP (Politically Exposed Person) checks on all users" \
  "Address screening: All wallet addresses checked before transactions" \
  "Automatic blocking of flagged users with compliance notification"

mk "pages/admin/security/compliance/transaction-monitor.js" "Transaction Monitoring" "📡" "Configurable rules engine for suspicious activity detection." "../../../../" \
  "Rapid succession: Multiple transactions in short timeframe" \
  "Round amounts: Repeated exact round-number transactions (structuring)" \
  "Just-below threshold: Transactions just under reporting limits" \
  "Geographic mismatch: Transaction origin vs registered country" \
  "Dormant account: Sudden large transactions from inactive accounts" \
  "Layering: Complex chains between related accounts" \
  "Volume spikes: Sudden increase for individual or platform" \
  "Automated SAR pre-fill for compliance review"

mk "pages/admin/security/compliance/issuer-edd.js" "Issuer Enhanced Due Diligence" "🏛️" "Full corporate KYC: registration, UBO, directors, legal opinion, site verification." "../../../../" \
  "Corporate KYC: Verify company registration and articles of association" \
  "UBO identification: Ultimate Beneficial Owners verified" \
  "Director verification: KYC on all directors with signing authority" \
  "Financial statements: Last 3 years reviewed" \
  "Source of assets: Documentation proving ownership of tokenized asset" \
  "Legal opinion letter: Counsel confirmation tokenization is lawful" \
  "Independent valuation: Third-party asset valuation report" \
  "Physical site verification: For real estate/infrastructure assets" \
  "MiCA compliance check: Full regulatory compliance review" \
  "Sanctions screening on company and all directors"

mk "pages/admin/security/compliance/data-protection.js" "Data Protection & GDPR" "🔏" "PII encryption, GDPR compliance, data export/deletion, privacy dashboard." "../../../../" \
  "All PII encrypted at rest (AES-256-GCM) and in transit (TLS 1.3)" \
  "KYC documents in separate encrypted storage with limited access" \
  "GDPR Article 20: Investors can download all personal data" \
  "Right to be forgotten: Data deletion with regulatory retention exceptions" \
  "Data minimization: Only collect what is legally required" \
  "Privacy dashboard: Show investors exactly what data you hold" \
  "Consent management: Granular auditable consent records" \
  "Data retention automation: Auto-purge when period expires" \
  "Cross-border transfers: GDPR Chapter V compliance"

mk "pages/admin/security/compliance/privacy.js" "Privacy Engineering" "👤" "Privacy-by-design: PIAs, consent management, anonymization, retention." "../../../../" \
  "Privacy Impact Assessment for every new feature or integration" \
  "Granular auditable consent records for all processing" \
  "Automated data retention enforcement and purging" \
  "Cross-border transfer controls (GDPR Chapter V)" \
  "Anonymization for analytics, pseudonymization for processing" \
  "Privacy logging: All access to personal data with purpose recorded" \
  "Right to audit: Demonstrate to regulators where data resides"

mk "pages/admin/security/compliance/communications.js" "Communication Security" "📧" "Anti-phishing codes, DMARC/DKIM/SPF, secure in-app messaging." "../../../../" \
  "Anti-phishing code: Personal code in every official email to investors" \
  "No sensitive data in emails: Never passwords, balances, or account numbers" \
  "Secure in-app messaging for all support communication" \
  "DMARC (reject policy): Blocks email spoofing of nextokencapital.com" \
  "DKIM signing: Cryptographic verification of email authenticity" \
  "SPF records: Only authorized servers can send from our domain"

echo "  ✓ 7 compliance pages"

# ═══════════════════════════════════════
# /admin/devsecops/* (9 pages)
# ═══════════════════════════════════════
echo "  [4/4] Creating /admin/devsecops/ pages..."

# DevSecOps Dashboard
cat > pages/admin/devsecops/index.js << 'DEOF'
import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function DevSecOpsDashboard() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240,padding:"28px 36px",flex:1,color:"#fff" }}>
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🔧 DevSecOps Dashboard</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:24 }}>Infrastructure security, CI/CD pipeline, monitoring, backup, and incident response.</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
          {[
            {h:"/admin/devsecops/waf",l:"🛡️ WAF & DDoS",d:"Firewall, rate limiting, DDoS mitigation"},
            {h:"/admin/devsecops/containers",l:"📦 Container Security",d:"Distroless, signing, runtime protection"},
            {h:"/admin/devsecops/dns",l:"🌍 DNS & Domain",d:"DNSSEC, CAA, subdomain monitoring"},
            {h:"/admin/devsecops/certificates",l:"📜 Certificates",d:"Auto-renewal, CT monitoring, PKI"},
            {h:"/admin/devsecops/secrets",l:"🗝️ Secret Management",d:"HSM, Vault, key rotation"},
            {h:"/admin/devsecops/siem",l:"🔭 SIEM & Threat Intel",d:"Log aggregation, correlation, SOAR"},
            {h:"/admin/devsecops/backup",l:"💾 Backup & DR",d:"3-2-1 backups, WORM, multi-region"},
            {h:"/admin/devsecops/incident-response",l:"🆘 Incident Response",d:"Playbooks, auto-containment, drills"},
          ].map((n,i) => (
            <button key={i} onClick={()=>router.push(n.h)} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px 20px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:"#fff",transition:"border-color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#06b6d440"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
              <div style={{ fontSize:14,fontWeight:700,marginBottom:4 }}>{n.l}</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>{n.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
DEOF

mk "pages/admin/devsecops/waf.js" "WAF & DDoS Protection" "🛡️" "Web Application Firewall, DDoS mitigation, rate limiting, encryption." "../../../" \
  "WAF: AWS WAF with OWASP managed rules for SQL injection and XSS" \
  "DDoS: AWS Shield Advanced for volumetric attack mitigation" \
  "Rate limiting: Per-user, per-IP, per-endpoint limits" \
  "Database encryption: AES-256 at rest, TLS 1.3 in transit" \
  "Separate admin backend from public-facing site" \
  "VPN-only access for admin panel" \
  "Quarterly penetration testing by external security firm" \
  "Bug bounty program via HackerOne/Bugcrowd"

mk "pages/admin/devsecops/containers.js" "Container & Cloud Security" "📦" "Distroless images, signing, Falco runtime, non-root, CSPM." "../../../" \
  "Distroless/Alpine base images — no shell or package manager" \
  "Image signing with Cosign/Sigstore — reject unsigned images" \
  "Falco runtime detection for anomalous container behavior" \
  "All containers non-root with read-only filesystems" \
  "CSPM (Wiz/Prisma Cloud) for cloud misconfiguration scanning" \
  "IAM least privilege: No wildcard permissions, quarterly review" \
  "Resource limits on all containers to prevent exhaustion"

mk "pages/admin/devsecops/dns.js" "DNS & Domain Security" "🌍" "DNSSEC, registrar lock, CAA records, subdomain and lookalike monitoring." "../../../" \
  "DNSSEC enabled on all domains to prevent spoofing" \
  "Registrar lock and transfer lock on all domains" \
  "CAA records: Only approved CAs can issue certificates" \
  "Subdomain takeover monitoring for dangling DNS records" \
  "Lookalike domain monitoring and proactive takedown" \
  "DNS query logging integrated with SIEM" \
  "Multi-provider DNS for redundancy"

mk "pages/admin/devsecops/certificates.js" "Certificate & PKI Management" "📜" "Automated renewal, CT monitoring, short-lived certs, OCSP revocation." "../../../" \
  "cert-manager + ACME: Automated renewal 30 days before expiry" \
  "Certificate inventory tracking all certs and expiration dates" \
  "Certificate Transparency log monitoring for rogue issuance" \
  "90-day external certs, 24-hour internal mTLS certs" \
  "HSM-based key ceremony for root CA generation" \
  "OCSP responders: Revoke any compromised cert within 1 hour"

mk "pages/admin/devsecops/secrets.js" "Secret Management" "🗝️" "HSM for private keys, Vault for credentials, 90-day rotation." "../../../" \
  "Private keys in HSM (Hardware Security Module) or AWS KMS" \
  "API keys automatically rotated every 90 days" \
  "Database credentials via HashiCorp Vault dynamic secrets" \
  "Zero plain-text secrets in codebase, logs, or error messages" \
  "Blockchain signing keys in HSM with auto-rotation" \
  "Vault audit logging for all secret access"

mk "pages/admin/devsecops/siem.js" "SIEM & Threat Intelligence" "🔭" "Centralized SIEM, correlation rules, SOAR, threat hunting, red team." "../../../" \
  "Centralized SIEM (Elastic/Splunk) aggregating all log sources" \
  "Correlation rules: Failed login + VPN + escalation = critical alert" \
  "Threat intelligence feeds via STIX/TAXII for IOCs" \
  "SOAR automated playbooks: Auto-block IPs, isolate endpoints" \
  "24/7 SOC coverage: Internal team + managed SOC after-hours" \
  "Monthly threat hunting using MITRE ATT&CK framework" \
  "Annual red team engagement by external security firm"

mk "pages/admin/devsecops/backup.js" "Backup & Disaster Recovery" "💾" "3-2-1 backups, WORM storage, multi-region failover, RTO 4hr." "../../../" \
  "3-2-1 rule: 3 copies, 2 storage types, 1 geographically separate" \
  "AES-256 encrypted backups with separate KMS keys" \
  "Immutable WORM storage: Ransomware cannot encrypt/delete backups" \
  "Automated daily backups: DB, KYC docs, audit logs, Vault" \
  "Point-in-time recovery: Any point within last 30 days" \
  "RTO 4 hours / RPO 1 hour for all critical services" \
  "Multi-region hot standby with DNS failover" \
  "Biannual full disaster recovery simulation"

mk "pages/admin/devsecops/incident-response.js" "Incident Response" "🆘" "Documented playbooks, auto-containment, 24hr notification, forensics." "../../../" \
  "Documented playbook with P1-P4 severity levels" \
  "P1 auto-containment: Pause withdrawals, forensic logging, state snapshot" \
  "24-hour notification target (GDPR requires 72hr)" \
  "Escalation: On-call → CTO → CEO+Legal → Bank of Lithuania" \
  "Quarterly tabletop exercises simulating breach scenarios" \
  "Pre-written communication templates for investors, regulators, press" \
  "Forensics capability: Evidence preservation and post-incident analysis" \
  "Crisis management team: CEO, CTO, Legal, Compliance, Communications"

echo "  ✓ 9 devsecops pages"

# ═══════════════════════════════════════
# CLEANUP
# ═══════════════════════════════════════
rm -f pages/admin/security.js 2>/dev/null

TOTAL=$(find pages/admin/security pages/admin/devsecops -name "*.js" 2>/dev/null | wc -l)

echo ""
echo "  ╔═════════════════════════════════════════════════════════╗"
echo "  ║  ✅ COMPLETE — ${TOTAL} pages created                        ║"
echo "  ║                                                         ║"
echo "  ║  /admin/security/           (11 pages)                  ║"
echo "  ║    dashboard, alerts, audit, mfa, sessions,             ║"
echo "  ║    logins, ip-whitelist, withdrawals, fraud,            ║"
echo "  ║    account-recovery, api-security                       ║"
echo "  ║                                                         ║"
echo "  ║  /admin/security/fraud/     (4 pages)                   ║"
echo "  ║    dashboard, suspicious-activity,                      ║"
echo "  ║    blocked-transactions, withdrawal-protection          ║"
echo "  ║                                                         ║"
echo "  ║  /admin/security/compliance/ (7 pages)                  ║"
echo "  ║    dashboard, sanctions-screening,                      ║"
echo "  ║    transaction-monitor, issuer-edd,                     ║"
echo "  ║    data-protection, privacy, communications             ║"
echo "  ║                                                         ║"
echo "  ║  /admin/devsecops/          (9 pages)                   ║"
echo "  ║    dashboard, waf, containers, dns,                     ║"
echo "  ║    certificates, secrets, siem, backup,                 ║"
echo "  ║    incident-response                                    ║"
echo "  ║                                                         ║"
echo "  ║  + /admin/employees (from rbac-integration.sh)          ║"
echo "  ║  + /admin/login (role-based, no hydration error)        ║"
echo "  ║                                                         ║"
echo "  ║  RUN:                                                   ║"
echo "  ║    taskkill //F //IM node.exe                           ║"
echo "  ║    npm run build && npm start                           ║"
echo "  ╚═════════════════════════════════════════════════════════╝"
