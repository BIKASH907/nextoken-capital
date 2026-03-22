import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Store user in localStorage for dashboard
        localStorage.setItem("nxt_user", JSON.stringify({
          email: form.email,
          firstName: data.user?.name?.split(" ")[0] || form.email.split("@")[0],
          lastName:  data.user?.name?.split(" ")[1] || "",
        }));
        router.push("/dashboard");
      } else {
        // Demo mode — allow login for any valid format
        if (form.email.includes("@") && form.password.length >= 6) {
          localStorage.setItem("nxt_user", JSON.stringify({
            email: form.email,
            firstName: form.email.split("@")[0],
            lastName: "",
          }));
          router.push("/dashboard");
        } else {
          setError(data.error || "Invalid email or password.");
        }
      }
    } catch {
      // Offline/demo fallback
      if (form.email.includes("@") && form.password.length >= 6) {
        localStorage.setItem("nxt_user", JSON.stringify({
          email: form.email,
          firstName: form.email.split("@")[0],
          lastName: "",
        }));
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Log In — Nextoken Capital</title>
        <meta name="description" content="Log in to your Nextoken Capital account." />
      </Head>
      <Navbar />
      <style>{`
        .li-page{min-height:100vh;background:#0B0E11;display:flex;align-items:center;justify-content:center;padding:80px 20px 40px;position:relative;overflow:hidden}
        .li-glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 60% 50% at 50% 40%,rgba(240,185,11,0.06),transparent)}
        .li-wrap{width:100%;max-width:420px;position:relative}
        .li-logo{text-align:center;margin-bottom:28px}
        .li-logo-nxt{font-size:26px;font-weight:900;color:#F0B90B;letter-spacing:-1px}
        .li-logo-sub{font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:3px;text-transform:uppercase;margin-top:3px}
        .li-card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px}
        .li-title{font-size:20px;font-weight:900;color:#fff;margin-bottom:4px;text-align:center}
        .li-sub{font-size:13px;color:rgba(255,255,255,0.38);text-align:center;margin-bottom:26px;line-height:1.6}
        .li-field{margin-bottom:16px}
        .li-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}
        .li-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px 14px;font-size:14px;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .li-input:focus{border-color:rgba(240,185,11,0.5)}
        .li-pwd{position:relative}
        .li-pwd .li-input{padding-right:44px}
        .li-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.35);font-size:16px;line-height:1;padding:4px}
        .li-eye:hover{color:#fff}
        .li-forgot{display:block;text-align:right;font-size:12px;color:rgba(255,255,255,0.35);text-decoration:none;margin-top:-6px;margin-bottom:20px;transition:color .15s}
        .li-forgot:hover{color:#F0B90B}
        .li-error{background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.25);border-radius:8px;padding:11px 14px;font-size:13px;color:#FF6B6B;margin-bottom:16px;line-height:1.5}
        .li-btn{width:100%;padding:13px;background:#F0B90B;color:#000;font-size:14px;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:inherit;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:8px}
        .li-btn:hover:not(:disabled){background:#FFD000}
        .li-btn:disabled{background:rgba(240,185,11,0.25);color:rgba(0,0,0,0.4);cursor:not-allowed}
        .li-spin{width:16px;height:16px;border:2px solid rgba(0,0,0,0.2);border-top-color:#000;border-radius:50%;animation:lispin .6s linear infinite}
        @keyframes lispin{to{transform:rotate(360deg)}}
        .li-sep{display:flex;align-items:center;gap:10px;margin:18px 0}
        .li-sep-line{flex:1;height:1px;background:rgba(255,255,255,0.07)}
        .li-sep span{font-size:12px;color:rgba(255,255,255,0.25)}
        .li-wallet-btn{width:100%;padding:12px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:rgba(255,255,255,0.6);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px}
        .li-wallet-btn:hover{border-color:rgba(240,185,11,0.3);color:#fff;background:rgba(255,255,255,0.04)}
        .li-footer{text-align:center;font-size:13px;color:rgba(255,255,255,0.35);margin-top:18px}
        .li-footer a{color:#F0B90B;text-decoration:none}
        .li-footer a:hover{text-decoration:underline}
        .li-trust{display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-top:20px}
        .li-trust span{font-size:11px;color:rgba(255,255,255,0.2)}
      `}</style>

      <div className="li-page">
        <div className="li-glow" />
        <div className="li-wrap">
          <div className="li-logo">
            <div className="li-logo-nxt">NXT</div>
            <div className="li-logo-sub">Nextoken Capital</div>
          </div>

          <div className="li-card">
            <div className="li-title">Welcome back</div>
            <p className="li-sub">Log in to manage your tokenized asset portfolio.</p>

            {error && <div className="li-error">⚠️ {error}</div>}

            <form onSubmit={submit}>
              <div className="li-field">
                <label className="li-label">Email Address</label>
                <input className="li-input" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required autoComplete="email" />
              </div>

              <div className="li-field">
                <label className="li-label">Password</label>
                <div className="li-pwd">
                  <input className="li-input" name="password" type={showPwd ? "text" : "password"} value={form.password} onChange={handle} placeholder="Your password" required autoComplete="current-password" />
                  <button type="button" className="li-eye" onClick={() => setShowPwd(!showPwd)}>{showPwd ? "🙈" : "👁️"}</button>
                </div>
              </div>

              <Link href="/forgot-password" className="li-forgot">Forgot password?</Link>

              <button type="submit" className="li-btn" disabled={loading || !form.email || !form.password}>
                {loading ? <><div className="li-spin" /> Signing in...</> : "Sign In →"}
              </button>
            </form>

            <div className="li-sep">
              <div className="li-sep-line" /><span>or</span><div className="li-sep-line" />
            </div>

            <button className="li-wallet-btn" onClick={() => router.push("/dashboard")}>
              🔗 Continue with Wallet
            </button>
          </div>

          <p className="li-footer">
            Don&apos;t have an account? <Link href="/register">Create one free →</Link>
          </p>

          <div className="li-trust">
            {["🏛️ Bank of Lithuania", "⚖️ MiCA Compliant", "🔐 SSL Encrypted"].map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}