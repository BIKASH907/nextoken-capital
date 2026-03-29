// pages/admin/employees.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../components/AdminSidebar";

const ROLES = [
  { id: "super_admin", label: "Super Admin", color: "#F0B90B", desc: "Full access — everything" },
  { id: "admin", label: "Admin", color: "#3B82F6", desc: "Full access except creating admins" },
  { id: "compliance", label: "Compliance", color: "#8B5CF6", desc: "KYC/KYB review, AML, user management" },
  { id: "operations", label: "Operations", color: "#0ECB81", desc: "Asset management, investments" },
  { id: "finance", label: "Finance", color: "#EC4899", desc: "Transactions, reports, treasury" },
  { id: "support", label: "Support", color: "#6B7280", desc: "View-only users, support tickets" },
];

export default function AdminEmployees() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
    role: "support", department: "", phone: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("adminEmployee");
    if (!stored) return router.push("/admin/login");
    const emp = JSON.parse(stored);
    // Only super_admin can access this page
    if (emp.role !== "super_admin") {
      router.push("/admin");
      return;
    }
    setEmployee(emp);
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.employees || []);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("adminToken");
      const isEdit = !!editingId;
      const res = await fetch("/api/admin/employees", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(isEdit ? { employeeId: editingId, ...form } : form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(isEdit ? "Employee updated successfully" : "Employee created successfully");
        setShowCreate(false);
        setEditingId(null);
        setForm({ firstName: "", lastName: "", email: "", password: "", role: "support", department: "", phone: "" });
        fetchEmployees();
      } else {
        setMsg(data.error || "Failed");
      }
    } catch {
      setMsg("Network error");
    }
    setTimeout(() => setMsg(""), 4000);
  }

  async function toggleActive(emp) {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/employees", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ employeeId: emp._id, isActive: !emp.isActive }),
      });
      if (res.ok) {
        setMsg(`Employee ${emp.isActive ? "deactivated" : "activated"} successfully`);
        fetchEmployees();
      }
    } catch {
      setMsg("Network error");
    }
    setTimeout(() => setMsg(""), 4000);
  }

  async function deleteEmployee(id) {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/employees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ employeeId: id }),
      });
      if (res.ok) {
        setMsg("Employee deleted successfully");
        setConfirmDelete(null);
        fetchEmployees();
      } else {
        const data = await res.json();
        setMsg(data.error || "Failed to delete");
      }
    } catch {
      setMsg("Network error");
    }
    setTimeout(() => setMsg(""), 4000);
  }

  function startEdit(emp) {
    setEditingId(emp._id);
    setForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      password: "", // don't pre-fill
      role: emp.role,
      department: emp.department || "",
      phone: emp.phone || "",
    });
    setShowCreate(true);
  }

  function getRoleInfo(roleId) {
    return ROLES.find((r) => r.id === roleId) || ROLES[ROLES.length - 1];
  }

  if (!employee) return null;

  return (
    <>
      <Head>
        <title>Employees | Nextoken Admin</title>
      </Head>
      <style jsx global>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0D1117; color:#fff; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
        .layout { display:flex; min-height:100vh; }
        .main { flex:1; padding:32px; margin-left:240px; }
        .page-title { font-size:22px; font-weight:900; margin-bottom:4px; }
        .page-sub { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:24px; }
        .card { background:#161B22; border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:20px; margin-bottom:20px; }
        .card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
        .card-title { font-size:15px; font-weight:700; }
        .create-btn { background:linear-gradient(135deg, #F0B90B, #d4a20a); color:#0D1117; border:none; padding:8px 20px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; transition:all .15s; }
        .create-btn:hover { opacity:0.9; transform:translateY(-1px); }

        /* Table */
        .emp-table { width:100%; border-collapse:collapse; }
        .emp-table th { text-align:left; padding:10px 14px; font-size:11px; font-weight:700; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:.5px; border-bottom:1px solid rgba(255,255,255,0.06); }
        .emp-table td { padding:12px 14px; font-size:13px; border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:middle; }
        .emp-table tr:hover td { background:rgba(255,255,255,0.02); }
        .emp-name { font-weight:600; }
        .emp-email { color:rgba(255,255,255,0.45); font-size:12px; margin-top:2px; }
        .role-badge { display:inline-block; padding:3px 10px; border-radius:6px; font-size:11px; font-weight:600; }
        .status-dot { display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:6px; }
        .status-active { background:#0ECB81; }
        .status-inactive { background:#ff6b6b; }
        .action-btn { background:none; border:1px solid rgba(255,255,255,0.08); border-radius:6px; padding:5px 12px; font-size:11px; color:rgba(255,255,255,0.5); cursor:pointer; transition:all .12s; margin-right:4px; }
        .action-btn:hover { border-color:rgba(240,185,11,0.3); color:#F0B90B; }
        .action-btn.danger { color:#ff6b6b; }
        .action-btn.danger:hover { border-color:rgba(255,77,77,0.3); background:rgba(255,77,77,0.06); }

        /* Create/Edit Form */
        .form-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:1000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); }
        .form-modal { background:#161B22; border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:28px; width:520px; max-width:90vw; max-height:90vh; overflow-y:auto; }
        .form-title { font-size:18px; font-weight:800; margin-bottom:4px; }
        .form-sub { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:20px; }
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .form-group { margin-bottom:14px; }
        .form-group.full { grid-column:1/-1; }
        .form-label { font-size:12px; font-weight:600; color:rgba(255,255,255,0.5); margin-bottom:6px; display:block; }
        .form-input { width:100%; background:#0D1117; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px 14px; font-size:14px; color:#fff; outline:none; font-family:inherit; }
        .form-input:focus { border-color:rgba(240,185,11,0.4); }
        .form-select { width:100%; background:#0D1117; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px 14px; font-size:14px; color:#fff; outline:none; font-family:inherit; appearance:none; }
        .form-select:focus { border-color:rgba(240,185,11,0.4); }

        /* Role selector cards */
        .role-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .role-card { padding:10px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.06); cursor:pointer; transition:all .15s; }
        .role-card:hover { border-color:rgba(255,255,255,0.15); }
        .role-card.selected { border-width:2px; }
        .role-card-label { font-size:13px; font-weight:600; }
        .role-card-desc { font-size:11px; color:rgba(255,255,255,0.35); margin-top:2px; }

        .form-actions { display:flex; gap:8px; justify-content:flex-end; margin-top:16px; }
        .btn-cancel { padding:9px 20px; border-radius:8px; font-size:13px; font-weight:600; border:none; cursor:pointer; background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5); }
        .btn-cancel:hover { background:rgba(255,255,255,0.1); }
        .btn-save { padding:9px 24px; border-radius:8px; font-size:13px; font-weight:700; border:none; cursor:pointer; background:linear-gradient(135deg, #F0B90B, #d4a20a); color:#0D1117; }
        .btn-save:hover { opacity:0.9; }

        /* Confirm delete modal */
        .confirm-modal { background:#161B22; border:1px solid rgba(255,77,77,0.2); border-radius:16px; padding:28px; width:400px; max-width:90vw; text-align:center; }
        .confirm-title { font-size:18px; font-weight:800; margin-bottom:8px; }
        .confirm-text { font-size:13px; color:rgba(255,255,255,0.5); margin-bottom:20px; }
        .confirm-actions { display:flex; gap:8px; justify-content:center; }

        .success-msg { background:rgba(14,203,129,0.1); border:1px solid rgba(14,203,129,0.2); border-radius:8px; padding:10px 14px; font-size:13px; color:#0ECB81; margin-bottom:16px; }
        .error-msg { background:rgba(255,77,77,0.1); border:1px solid rgba(255,77,77,0.2); border-radius:8px; padding:10px 14px; font-size:13px; color:#ff6b6b; margin-bottom:16px; }
        .empty { text-align:center; padding:40px; color:rgba(255,255,255,0.25); }
        .stat-row { display:flex; gap:16px; margin-bottom:20px; }
        .stat-card { background:#161B22; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:16px 20px; flex:1; }
        .stat-val { font-size:24px; font-weight:900; }
        .stat-lbl { font-size:11px; color:rgba(255,255,255,0.35); margin-top:4px; text-transform:uppercase; letter-spacing:.5px; }

        @media(max-width:900px) {
          .main { margin-left:0; padding:16px; }
          .form-grid { grid-template-columns:1fr; }
          .role-grid { grid-template-columns:1fr; }
          .stat-row { flex-direction:column; }
        }
      `}</style>

      {/* Create/Edit Modal */}
      {showCreate && (
        <div className="form-overlay" onClick={() => { setShowCreate(false); setEditingId(null); }}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-title">{editingId ? "Edit Employee" : "Create Employee"}</div>
            <div className="form-sub">{editingId ? "Update employee details and role" : "Add a new team member to the admin panel"}</div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className="form-input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input className="form-input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required disabled={!!editingId} />
                </div>
                <div className="form-group">
                  <label className="form-label">{editingId ? "New Password (leave blank to keep)" : "Password *"}</label>
                  <input className="form-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} minLength={8} />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input className="form-input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Compliance" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+370..." />
                </div>
              </div>

              {/* Role Selection */}
              <div className="form-group full" style={{ marginTop: 8 }}>
                <label className="form-label">Role *</label>
                <div className="role-grid">
                  {ROLES.map((r) => (
                    <div
                      key={r.id}
                      className={`role-card${form.role === r.id ? " selected" : ""}`}
                      style={{
                        borderColor: form.role === r.id ? r.color : undefined,
                        background: form.role === r.id ? `${r.color}10` : undefined,
                      }}
                      onClick={() => setForm({ ...form, role: r.id })}
                    >
                      <div className="role-card-label" style={{ color: form.role === r.id ? r.color : "#fff" }}>
                        {r.label}
                      </div>
                      <div className="role-card-desc">{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => { setShowCreate(false); setEditingId(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingId ? "Save Changes" : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="form-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-title">Delete Employee?</div>
            <div className="confirm-text">
              Are you sure you want to permanently delete <strong>{confirmDelete.firstName} {confirmDelete.lastName}</strong>?
              This cannot be undone.
            </div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn-save"
                style={{ background: "linear-gradient(135deg, #ff6b6b, #ef4444)" }}
                onClick={() => deleteEmployee(confirmDelete._id)}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="layout">
        <AdminSidebar />
        <div className="main">
          <div className="page-title">Employee Management</div>
          <div className="page-sub">Manage admin team accounts, roles, and access</div>

          {msg && <div className={msg.includes("successfully") ? "success-msg" : "error-msg"}>{msg}</div>}

          {/* Stats */}
          <div className="stat-row">
            <div className="stat-card">
              <div className="stat-val">{employees.length}</div>
              <div className="stat-lbl">Total Employees</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">{employees.filter((e) => e.isActive).length}</div>
              <div className="stat-lbl">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">{employees.filter((e) => e.role === "super_admin").length}</div>
              <div className="stat-lbl">Super Admins</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">{employees.filter((e) => !e.isActive).length}</div>
              <div className="stat-lbl">Deactivated</div>
            </div>
          </div>

          {/* Employee Table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Team Members</div>
              <button className="create-btn" onClick={() => {
                setEditingId(null);
                setForm({ firstName: "", lastName: "", email: "", password: "", role: "support", department: "", phone: "" });
                setShowCreate(true);
              }}>
                + Add Employee
              </button>
            </div>

            {loading ? (
              <div className="empty">Loading...</div>
            ) : employees.length === 0 ? (
              <div className="empty">No employees yet. Click &quot;Add Employee&quot; to create one.</div>
            ) : (
              <table className="emp-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const role = getRoleInfo(emp.role);
                    return (
                      <tr key={emp._id}>
                        <td>
                          <div className="emp-name">{emp.firstName} {emp.lastName}</div>
                          <div className="emp-email">{emp.email}</div>
                        </td>
                        <td>
                          <span className="role-badge" style={{ background: `${role.color}15`, color: role.color }}>
                            {role.label}
                          </span>
                        </td>
                        <td style={{ color: "rgba(255,255,255,0.5)" }}>{emp.department || "—"}</td>
                        <td>
                          <span className={`status-dot ${emp.isActive ? "status-active" : "status-inactive"}`} />
                          {emp.isActive ? "Active" : "Inactive"}
                        </td>
                        <td style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                          {emp.lastLogin ? new Date(emp.lastLogin).toLocaleString() : "Never"}
                        </td>
                        <td>
                          <button className="action-btn" onClick={() => startEdit(emp)}>Edit</button>
                          <button className="action-btn" onClick={() => toggleActive(emp)}>
                            {emp.isActive ? "Deactivate" : "Activate"}
                          </button>
                          {emp.role !== "super_admin" && (
                            <button className="action-btn danger" onClick={() => setConfirmDelete(emp)}>
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
