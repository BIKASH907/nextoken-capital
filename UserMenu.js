// components/UserMenu.js
// Drop-in component: adds user avatar, dropdown with logout + password change
// Usage: <UserMenu user={session?.user} /> or <UserMenu user={{ name, email }} />
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function UserMenu({ user, isAdmin = false }) {
  const [open, setOpen] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const ref = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`
    : user?.name || user?.email || "User";

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function changePassword(e) {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) {
      setPwMsg("Passwords do not match");
      return;
    }
    if (pwForm.newPw.length < 8) {
      setPwMsg("New password must be at least 8 characters");
      return;
    }
    setPwLoading(true);
    setPwMsg("");
    try {
      const endpoint = isAdmin ? "/api/admin/change-password" : "/api/user/change-password";
      const headers = { "Content-Type": "application/json" };
      if (isAdmin) {
        headers.Authorization = `Bearer ${localStorage.getItem("adminToken")}`;
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          currentPassword: pwForm.current,
          newPassword: pwForm.newPw,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg("Password changed successfully!");
        setPwForm({ current: "", newPw: "", confirm: "" });
        setTimeout(() => {
          setShowPwModal(false);
          setPwMsg("");
        }, 2000);
      } else {
        setPwMsg(data.error || "Failed to change password");
      }
    } catch {
      setPwMsg("Network error");
    }
    setPwLoading(false);
  }

  function handleLogout() {
    if (isAdmin) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmployee");
      window.location.href = "/admin/login";
    } else {
      signOut({ callbackUrl: "/" });
    }
  }

  return (
    <>
      <style jsx>{`
        .um-wrap { position:relative; z-index:100; }
        .um-trigger { display:flex; align-items:center; gap:10px; cursor:pointer; padding:6px 12px; border-radius:10px; border:1px solid transparent; transition:all .15s; background:none; color:#fff; }
        .um-trigger:hover { background:rgba(255,255,255,0.04); border-color:rgba(255,255,255,0.08); }
        .um-avatar { width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg, #F0B90B 0%, #d4a20a 100%); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:#0D1117; flex-shrink:0; }
        .um-info { text-align:left; }
        .um-name { font-size:13px; font-weight:600; }
        .um-role { font-size:11px; color:rgba(255,255,255,0.35); }
        .um-arrow { font-size:10px; color:rgba(255,255,255,0.3); margin-left:4px; transition:transform .15s; }
        .um-arrow.open { transform:rotate(180deg); }
        .um-dropdown { position:absolute; right:0; top:calc(100% + 6px); background:#1C2128; border:1px solid rgba(255,255,255,0.1); border-radius:12px; min-width:200px; padding:6px; box-shadow:0 12px 40px rgba(0,0,0,0.5); }
        .um-item { display:block; width:100%; text-align:left; padding:10px 14px; border:none; background:none; color:rgba(255,255,255,0.7); font-size:13px; cursor:pointer; border-radius:8px; transition:all .12s; font-family:inherit; }
        .um-item:hover { background:rgba(255,255,255,0.06); color:#fff; }
        .um-item.danger { color:#ff6b6b; }
        .um-item.danger:hover { background:rgba(255,77,77,0.1); }
        .um-divider { height:1px; background:rgba(255,255,255,0.06); margin:4px 0; }

        /* Password Modal */
        .pw-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:1000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); }
        .pw-modal { background:#161B22; border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:28px; width:400px; max-width:90vw; }
        .pw-title { font-size:18px; font-weight:800; margin-bottom:4px; }
        .pw-sub { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:20px; }
        .pw-label { font-size:12px; font-weight:600; color:rgba(255,255,255,0.5); margin-bottom:6px; display:block; }
        .pw-input { width:100%; background:#0D1117; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px 14px; font-size:14px; color:#fff; outline:none; margin-bottom:14px; font-family:inherit; }
        .pw-input:focus { border-color:rgba(240,185,11,0.4); }
        .pw-actions { display:flex; gap:8px; justify-content:flex-end; margin-top:8px; }
        .pw-btn { padding:9px 20px; border-radius:8px; font-size:13px; font-weight:600; border:none; cursor:pointer; transition:all .15s; }
        .pw-btn-cancel { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5); }
        .pw-btn-cancel:hover { background:rgba(255,255,255,0.1); }
        .pw-btn-save { background:linear-gradient(135deg, #F0B90B, #d4a20a); color:#0D1117; }
        .pw-btn-save:hover { opacity:0.9; }
        .pw-btn-save:disabled { opacity:0.5; cursor:not-allowed; }
        .pw-msg { padding:10px 14px; border-radius:8px; font-size:13px; margin-top:10px; }
        .pw-msg.success { background:rgba(14,203,129,0.1); border:1px solid rgba(14,203,129,0.2); color:#0ECB81; }
        .pw-msg.error { background:rgba(255,77,77,0.1); border:1px solid rgba(255,77,77,0.2); color:#ff6b6b; }
      `}</style>

      {/* Password Change Modal */}
      {showPwModal && (
        <div className="pw-overlay" onClick={() => { setShowPwModal(false); setPwMsg(""); }}>
          <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pw-title">Change Password</div>
            <div className="pw-sub">Enter your current password and choose a new one</div>
            <form onSubmit={changePassword}>
              <label className="pw-label">Current Password</label>
              <input
                className="pw-input"
                type="password"
                value={pwForm.current}
                onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                required
                autoFocus
              />
              <label className="pw-label">New Password</label>
              <input
                className="pw-input"
                type="password"
                value={pwForm.newPw}
                onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                required
                minLength={8}
              />
              <label className="pw-label">Confirm New Password</label>
              <input
                className="pw-input"
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                required
              />
              <div className="pw-actions">
                <button type="button" className="pw-btn pw-btn-cancel" onClick={() => { setShowPwModal(false); setPwMsg(""); }}>
                  Cancel
                </button>
                <button type="submit" className="pw-btn pw-btn-save" disabled={pwLoading}>
                  {pwLoading ? "Saving..." : "Change Password"}
                </button>
              </div>
              {pwMsg && (
                <div className={`pw-msg ${pwMsg.includes("successfully") ? "success" : "error"}`}>
                  {pwMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="um-wrap" ref={ref}>
        <button className="um-trigger" onClick={() => setOpen(!open)}>
          <div className="um-avatar">{initials}</div>
          <div className="um-info">
            <div className="um-name">{displayName}</div>
            <div className="um-role">{user?.role || user?.accountType || (isAdmin ? "Admin" : "Investor")}</div>
          </div>
          <span className={`um-arrow${open ? " open" : ""}`}>▼</span>
        </button>

        {open && (
          <div className="um-dropdown">
            <button className="um-item" onClick={() => { setOpen(false); setShowPwModal(true); }}>
              🔒 Change Password
            </button>
            {!isAdmin && (
              <button className="um-item" onClick={() => { setOpen(false); window.location.href = "/dashboard"; }}>
                📊 Dashboard
              </button>
            )}
            {!isAdmin && (
              <button className="um-item" onClick={() => { setOpen(false); window.location.href = "/settings"; }}>
                ⚙️ Settings
              </button>
            )}
            <div className="um-divider" />
            <button className="um-item danger" onClick={handleLogout}>
              ↪ Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
}
