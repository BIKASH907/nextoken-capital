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
