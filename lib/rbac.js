// ═══════════════════════════════════════════════════════
// RBAC — Role-Based Access Control for Nextoken Admin
// ═══════════════════════════════════════════════════════

export const ROLES = {
  super_admin: {
    label: "Super Admin",
    description: "Full platform access. Max 2 people. Dual-approval for critical actions.",
    color: "#ef4444",
    icon: "👑",
  },
  compliance_admin: {
    label: "Compliance Admin",
    description: "KYC review, AML monitoring, SAR filing. No financials or system config.",
    color: "#8b5cf6",
    icon: "🪪",
  },
  finance_admin: {
    label: "Finance Admin",
    description: "Transactions, withdrawals, fees, treasury. No KYC or user roles.",
    color: "#f59e0b",
    icon: "💰",
  },
  support_admin: {
    label: "Support Admin",
    description: "User accounts, tickets. Read-only financials. No KYC or withdrawals.",
    color: "#3b82f6",
    icon: "💬",
  },
  audit: {
    label: "Audit / Read-Only",
    description: "View all logs, reports, dashboards. Zero write access. For auditors.",
    color: "#22c55e",
    icon: "📋",
  },
};

// What each role can see in the sidebar
export const ROLE_NAV = {
  super_admin: [
    { section: "OVERVIEW", items: [
      { href: "/admin", label: "Dashboard", icon: "🏠" },
      { href: "/admin/users", label: "Users", icon: "👥" },
      { href: "/admin/assets", label: "Assets", icon: "🏢" },
      { href: "/admin/employees", label: "Employee Management", icon: "👑" },
    ]},
    { section: "COMPLIANCE", items: [
      { href: "/admin/compliance/kyc", label: "KYC/KYB Queue", icon: "🪪" },
      { href: "/admin/travel-rule", label: "Travel Rule", icon: "✈️" },
      { href: "/admin/compliance", label: "AML Monitoring", icon: "🛡️" },
    ]},
    { section: "ASSET MANAGEMENT", items: [
      { href: "/admin/listings-mod", label: "Listing Moderation", icon: "✅" },
      { href: "/admin/registry", label: "Shareholder Registry", icon: "📊" },
      { href: "/admin/contracts", label: "Smart Contracts", icon: "🔗" },
      { href: "/admin/vault", label: "Document Vault", icon: "📁" },
    ]},
    { section: "FINANCIAL", items: [
      { href: "/admin/treasury", label: "Treasury & Revenue", icon: "💰" },
      { href: "/admin/transactions", label: "Transactions", icon: "💳" },
      { href: "/admin/market", label: "Market Data", icon: "📈" },
    ]},
    { section: "SECURITY", items: [
      { href: "/admin/security", label: "Security Center", icon: "🔐" },
      { href: "/admin/security/alerts", label: "Security Alerts", icon: "🚨" },
      { href: "/admin/security/audit", label: "Audit Trail", icon: "📋" },
      { href: "/admin/security/approvals", label: "Dual Approvals", icon: "✅" },
      { href: "/admin/security/logins", label: "Login History", icon: "🔑" },
      { href: "/admin/security/mfa", label: "MFA Settings", icon: "🔒" },
      { href: "/admin/security/sessions", label: "Active Sessions", icon: "🖥️" },
      { href: "/admin/security/ip-whitelist", label: "IP Whitelist", icon: "🌐" },
    ]},
    { section: "SYSTEM", items: [
      { href: "/admin/security/config", label: "System Config", icon: "⚙️" },
      { href: "/admin/support", label: "Support Tickets", icon: "💬" },
      { href: "/admin/reports", label: "Reports", icon: "📄" },
    ]},
  ],

  compliance_admin: [
    { section: "OVERVIEW", items: [
      { href: "/admin", label: "Dashboard", icon: "🏠" },
      { href: "/admin/users", label: "Users (View)", icon: "👥" },
    ]},
    { section: "COMPLIANCE", items: [
      { href: "/admin/compliance/kyc", label: "KYC/KYB Queue", icon: "🪪" },
      { href: "/admin/travel-rule", label: "Travel Rule", icon: "✈️" },
      { href: "/admin/compliance", label: "AML Monitoring", icon: "🛡️" },
    ]},
    { section: "SECURITY", items: [
      { href: "/admin/security", label: "Security Center", icon: "🔐" },
      { href: "/admin/security/audit", label: "Audit Trail", icon: "📋" },
      { href: "/admin/security/approvals", label: "Dual Approvals", icon: "✅" },
    ]},
    { section: "SUPPORT", items: [
      { href: "/admin/reports", label: "Reports", icon: "📄" },
    ]},
  ],

  finance_admin: [
    { section: "OVERVIEW", items: [
      { href: "/admin", label: "Dashboard", icon: "🏠" },
    ]},
    { section: "FINANCIAL", items: [
      { href: "/admin/treasury", label: "Treasury & Revenue", icon: "💰" },
      { href: "/admin/transactions", label: "Transactions", icon: "💳" },
      { href: "/admin/market", label: "Market Data", icon: "📈" },
    ]},
    { section: "ASSET MANAGEMENT", items: [
      { href: "/admin/assets", label: "Assets", icon: "🏢" },
      { href: "/admin/registry", label: "Shareholder Registry", icon: "📊" },
    ]},
    { section: "SECURITY", items: [
      { href: "/admin/security", label: "Security Center", icon: "🔐" },
      { href: "/admin/security/approvals", label: "Dual Approvals", icon: "✅" },
    ]},
  ],

  support_admin: [
    { section: "OVERVIEW", items: [
      { href: "/admin", label: "Dashboard", icon: "🏠" },
      { href: "/admin/users", label: "Users", icon: "👥" },
    ]},
    { section: "SUPPORT", items: [
      { href: "/admin/support", label: "Support Tickets", icon: "💬" },
    ]},
    { section: "VIEW ONLY", items: [
      { href: "/admin/transactions", label: "Transactions (View)", icon: "💳" },
      { href: "/admin/security", label: "Security Center", icon: "🔐" },
    ]},
  ],

  audit: [
    { section: "OVERVIEW", items: [
      { href: "/admin", label: "Dashboard", icon: "🏠" },
    ]},
    { section: "AUDIT & REPORTS", items: [
      { href: "/admin/security/audit", label: "Audit Trail", icon: "📋" },
      { href: "/admin/security/logins", label: "Login History", icon: "🔑" },
      { href: "/admin/security/alerts", label: "Security Alerts", icon: "🚨" },
      { href: "/admin/reports", label: "Reports", icon: "📄" },
    ]},
    { section: "VIEW ONLY", items: [
      { href: "/admin/users", label: "Users (View)", icon: "👥" },
      { href: "/admin/transactions", label: "Transactions (View)", icon: "💳" },
      { href: "/admin/compliance", label: "AML (View)", icon: "🛡️" },
    ]},
  ],
};

// API permission checks
export const PERMISSIONS = {
  super_admin: ["*"],
  compliance_admin: ["kyc:read", "kyc:write", "aml:read", "aml:write", "sar:create", "users:read", "audit:read", "approvals:read", "approvals:write", "reports:read"],
  finance_admin: ["transactions:read", "withdrawals:read", "withdrawals:write", "fees:read", "fees:write", "treasury:read", "assets:read", "registry:read", "approvals:read", "approvals:write"],
  support_admin: ["users:read", "users:write_basic", "tickets:read", "tickets:write", "transactions:read"],
  audit: ["*:read"],
};

export function hasPermission(role, permission) {
  const perms = PERMISSIONS[role] || [];
  if (perms.includes("*")) return true;
  if (perms.includes("*:read") && permission.endsWith(":read")) return true;
  return perms.includes(permission);
}

export function canWrite(role) {
  return role !== "audit";
}
