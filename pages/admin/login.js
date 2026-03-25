import dynamic from "next/dynamic";
// pages/admin/login.js
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmployee", JSON.stringify(data.employee));
      router.push("/admin");
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <>
      <Head><title>Admin Login — Nextoken Capital</title></Head>
      <style>{`
        body{background:#0B0E11;color:#fff;font-family:"DM Sans",system-ui,sans-serif;margin:0}
        .al{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
        .al-box{width:100%;max-width:380px;background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px}
        .al-logo{text-align:center;margin-bottom:28px}
        .al-nxt{font-size:20px;font-weight:900;color:#F0B90B}
        .al-sub{font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:1px;margin-top:2px}
        .al-title{font-size:18px;font-weight:800;margin-bottom:4px}
        .al-desc{font-size:13px;color:rgba(255,255,255,0.38);margin-bottom:24px}
        .al-field{margin-bottom:16px}
        .al-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .al-input{width:100%;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:11px 14px;font-size:14px;color:#fff;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .al-input:focus{border-color:rgba(240,185,11,0.5)}
        .al-btn{width:100%;padding:13px;background:#F0B90B;color:#000;font-size:14px;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:inherit;transition:background .15s}
        .al-btn:hover:not(:disabled){background:#FFD000}
        .al-btn:disabled{opacity:.5;cursor:not-allowed}
        .al-err{background:rgba(255,77,77,0.1);border:1px solid rgba(255,77,77,0.2);border-radius:8px;padding:10px 14px;font-size:13px;color:#ff6b6b;margin-bottom:16px}
        .al-warn{background:rgba(240,185,11,0.06);border:1px solid rgba(240,185,11,0.15);border-radius:8px;padding:12px 14px;font-size:12px;color:rgba(255,255,255,0.45);margin-top:20px;line-height:1.6}
      `}</style>
      <div className="al">
        <div className="al-box">
          <div className="al-logo">
            <div className="al-nxt">NXT</div>
            <div className="al-sub">ADMIN PORTAL</div>
          </div>
          <div className="al-title">Admin Sign In</div>
          <div className="al-desc">Restricted access — authorised personnel only</div>
          {error && <div className="al-err">⚠️ {error}</div>}
          <form onSubmit={submit}>
            <div className="al-field">
              <label className="al-label">Email</label>
              <input className="al-input" type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="admin@nextokencapital.com" required autoComplete="email" />
            </div>
            <div className="al-field">
              <label className="al-label">Password</label>
              <input className="al-input" type="password" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} placeholder="Your password" required autoComplete="current-password" />
            </div>
            <button className="al-btn" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In →"}</button>
          </form>
          <div className="al-warn">
            🔒 This area is monitored. Unauthorised access attempts are logged and reported.
          </div>
        </div>
      </div>
    </>
  );
}
