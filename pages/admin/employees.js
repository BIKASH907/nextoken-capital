import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../components/AdminSidebar";
import { ROLES } from "../../lib/rbac";

export default function EmployeeManagement() {
  const router = useRouter();
  const [data, setData] = useState({ employees: [], roleCounts: {}, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", role: "support_admin" });
  const [msg, setMsg] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };

  const load = () => {
    if (!token) { router.push("/admin/login"); return; }
    setLoading(true);
    fetch("/api/admin/employees", { headers }).then(r => r.json()).then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const createEmployee = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/employees", { method: "POST", headers, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error); return; }
    setMsg("✅ Employee created: " + data.employee.email);
    setForm({ firstName: "", lastName: "", email: "", password: "", role: "support_admin" });
    setShowCreate(false);
    load();
  };

  const toggleActive = async (id, isActive) => {
    if (isActive) {
      if (!confirm("Deactivate this employee?")) return;
      await fetch("/api/admin/employees", { method: "DELETE", headers, body: JSON.stringify({ employeeId: id }) });
    } else {
      await fetch("/api/admin/employees", { method: "PATCH", headers, body: JSON.stringify({ employeeId: id, updates: { isActive: true } }) });
    }
    load();
  };

  const changeRole = async (id, role) => {
    await fetch("/api/admin/employees", { method: "PATCH", headers, body: JSON.stringify({ employeeId: id, updates: { role } }) });
    load();
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:230, padding:"28px 36px", flex:1, color:"#fff" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>👑 Employee Management</h1>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>{data.total} employees • RBAC role assignment</p>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} style={{ background:"#F0B90B", color:"#000", border:"none", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
            + Create Employee
          </button>
        </div>

        {/* Role distribution */}
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
          {Object.entries(ROLES).map(([key, r]) => (
            <div key={key} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 18px", minWidth:140 }}>
              <div style={{ fontSize:24, fontWeight:800, color:r.color }}>{data.roleCounts?.[key] || 0}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{r.icon} {r.label}</div>
            </div>
          ))}
        </div>

        {msg && <div style={{ background:msg.startsWith("✅")?"rgba(34,197,94,0.1)":"rgba(255,77,77,0.1)", border:"1px solid "+(msg.startsWith("✅")?"rgba(34,197,94,0.2)":"rgba(255,77,77,0.2)"), borderRadius:8, padding:"10px 14px", fontSize:13, color:msg.startsWith("✅")?"#22c55e":"#ff6b6b", marginBottom:16 }}>{msg}</div>}

        {/* Create Form */}
        {showCreate && (
          <div style={{ background:"#161b22", border:"1px solid rgba(240,185,11,0.2)", borderRadius:12, padding:24, marginBottom:24 }}>
            <h3 style={{ fontSize:16, fontWeight:700, color:"#F0B90B", marginBottom:16 }}>Create New Employee Account</h3>
            <form onSubmit={createEmployee} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>FIRST NAME</label>
                <input value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})} required style={{ width:"100%", background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"9px 12px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
              </div>
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>LAST NAME</label>
                <input value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})} required style={{ width:"100%", background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"9px 12px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
              </div>
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>EMAIL</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required style={{ width:"100%", background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"9px 12px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
              </div>
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>PASSWORD</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required minLength={8} style={{ width:"100%", background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"9px 12px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
              </div>
              <div style={{ gridColumn:"span 2" }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>ASSIGN ROLE</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {Object.entries(ROLES).map(([key, r]) => (
                    <button type="button" key={key} onClick={() => setForm({...form, role:key})} style={{
                      padding:"8px 14px", borderRadius:7, fontSize:12, fontWeight:600, cursor:"pointer",
                      background: form.role===key ? r.color+"20" : "rgba(255,255,255,0.04)",
                      color: form.role===key ? r.color : "rgba(255,255,255,0.4)",
                      border: "1px solid " + (form.role===key ? r.color+"40" : "rgba(255,255,255,0.06)"),
                      fontFamily:"inherit",
                    }}>
                      {r.icon} {r.label}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:6 }}>
                  {ROLES[form.role]?.description}
                </div>
              </div>
              <div style={{ gridColumn:"span 2", display:"flex", gap:8 }}>
                <button type="submit" style={{ padding:"10px 24px", background:"#F0B90B", color:"#000", border:"none", borderRadius:7, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Create Account</button>
                <button type="button" onClick={() => setShowCreate(false)} style={{ padding:"10px 24px", background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:7, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Employee Table */}
        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"200px 200px 140px 100px 80px 120px", padding:"10px 20px", background:"rgba(255,255,255,0.03)", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:.5 }}>
            <span>Name</span><span>Email</span><span>Role</span><span>Status</span><span>MFA</span><span>Actions</span>
          </div>
          {loading ? <div style={{ padding:24, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div> : data.employees.length === 0 ? (
            <div style={{ padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No employees yet. Create the first one above.</div>
          ) : data.employees.map(emp => {
            const ri = ROLES[emp.role] || {};
            return (
              <div key={emp._id} style={{ display:"grid", gridTemplateColumns:"200px 200px 140px 100px 80px 120px", padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:13, alignItems:"center" }}>
                <span style={{ fontWeight:600 }}>{emp.firstName} {emp.lastName}</span>
                <span style={{ color:"rgba(255,255,255,0.5)" }}>{emp.email}</span>
                <span>
                  <select value={emp.role} onChange={e => changeRole(emp._id, e.target.value)} style={{ background:"#0a0e14", border:"1px solid "+(ri.color||"#333")+"40", borderRadius:5, padding:"3px 6px", color:ri.color, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", outline:"none" }}>
                    {Object.entries(ROLES).map(([k,r]) => <option key={k} value={k}>{r.icon} {r.label}</option>)}
                  </select>
                </span>
                <span style={{ color: emp.isActive ? "#22c55e" : "#ef4444", fontWeight:600, fontSize:11 }}>{emp.isActive ? "● Active" : "● Inactive"}</span>
                <span style={{ fontSize:11, color: emp.mfaEnabled ? "#22c55e" : "rgba(255,255,255,0.25)" }}>{emp.mfaEnabled ? "✓ On" : "— Off"}</span>
                <span>
                  <button onClick={() => toggleActive(emp._id, emp.isActive)} style={{
                    padding:"4px 10px", borderRadius:5, fontSize:10, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                    background: emp.isActive ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                    border: "1px solid " + (emp.isActive ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"),
                    color: emp.isActive ? "#ef4444" : "#22c55e",
                  }}>
                    {emp.isActive ? "Deactivate" : "Activate"}
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
