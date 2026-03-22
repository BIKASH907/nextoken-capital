// pages/login.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const FEATURES = [
  { icon:"🏛️", text:"Bank of Lithuania regulated" },
  { icon:"⚖️", text:"MiCA compliant platform" },
  { icon:"🌍", text:"Open to 180+ countries" },
  { icon:"💶", text:"Invest from EUR 100" },
  { icon:"📈", text:"15–18% target annual ROI" },
  { icon:"🔐", text:"ISO 27001 certified" },
  { icon:"🔗", text:"ERC-3643 security tokens" },
  { icon:"🪪", text:"Sumsub KYC verification" },
];

const STATS = [
  ["EUR 140M+","Assets tokenized"],
  ["12,400+","Verified investors"],
  ["180+","Countries supported"],
  ["EUR 100","Minimum investment"],
  ["0.2%","Trading fee"],
  ["15–18%","Target annual ROI"],
];

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const redirect = router.query.redirect || "/dashboard";
        router.push(redirect);
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Log In — Nextoken Capital</title>
        <meta name="description" content="Log in to your Nextoken Capital account and manage your tokenized asset portfolio." />
      </Head>
      <Navbar />

      <style>{`
        .li-page{min-height:100vh;background:#0B0E11;padding:80px 20px 40px;display:flex;align-items:flex-start;justify-content:center;gap:32px}

        /* LEFT PANEL */
        .li-left{width:280px;flex-shrink:0;position:sticky;top:84px;display:flex;flex-direction:column;gap:16px}
        .li-brand{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:22px}
        .li-brand-logo{display:flex;align-items:center;gap:10px;margin-bottom:14px}
        .li-brand-nxt{font-size:22px;font-weight:900;color:#F0B90B}
        .li-brand-vl{width:1px;height:24px;background:rgba(255,255,255,0.2)}
        .li-brand-txt{display:flex;flex-direction:column;line-height:1.2}
        .li-brand-t1{font-size:10px;font-weight:800;color:#fff;letter-spacing:2px}
        .li-brand-t2{font-size:8px;color:rgba(255,255,255,0.4);letter-spacing:2px}
        .li-brand-desc{font-size:12px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:16px}
        .li-brand-feats{display:flex;flex-direction:column;gap:8px}
        .li-brand-feat{display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(255,255,255,0.55)}
        .li-brand-feat-ico{font-size:14px;flex-shrink:0}
        .li-stats-card{background:#0F1318;border:1px solid rgba(240,185,11,0.15);border-radius:14px;padding:18px}
        .li-stats-title{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px}
        .li-stat-row{display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-bottom:7px}
        .li-stat-v{font-weight:800;color:#fff}
        .li-stat-l{color:rgba(255,255,255,0.38)}

        /* RIGHT — form */
        .li-right{width:100%;max-width:420px}
        .li-logo{text-align:center;margin-bottom:24px}
        .li-logo-nxt{font-size:26px;font-weight:900;color:#F0B90B;letter-spacing:-1px}
        .li-logo-sub{font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:3px;text-transform:uppercase;margin-top:3px}
        .li-card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px}
        .li-title{font-size:20px;font-weight:900;color:#fff;margin-bottom:4px;text-align:center}
        .li-sub{font-size:13px;color:rgba(255,255,255,0.38);text-align:center;margin-bottom:26px;line-height:1.6}
        .li-field{margin-bottom:16px}
        .li-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}
        .li-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px 14px;font-size:14px;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .li-input:focus{border-color:rgba(240,185,11,0.5)}
        .li-pwd-wrap{position:relative}
        .li-pwd-wrap .li-input{padding-right:44px}
        .li-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.35);font-size:16px;padding:4px;line-height:1}
        .li-eye:hover{color:#fff}
        .li-forgot{display:block;text-align:right;font-size:12px;color:rgba(255,255,255,0.35);text-decoration:none;margin-top:-6px;margin-bottom:20px;transition:color .15s}
        .li-forgot:hover{color:#F0B90B}
        .li-error{background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.25);border-radius:8px;padding:11px 14px;font-size:13px;color:#FF6B6B;margin-bottom:16px;line-height:1.5}
        .li-btn{width:100%;padding:13px;background:#F0B90B;color:#000;font-size:14px;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:inherit;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:8px}
        .li-btn:hover:not(:disabled){background:#FFD000}
        .li-btn:disabled{background:rgba(240,185,11,0.2);color:rgba(0,0,0,0.35);cursor:not-allowed}
        .li-spin{width:16px;height:16px;border:2px solid rgba(0,0,0,0.2);border-top-color:#000;border-radius:50%;animation:lispin .6s linear infinite}
        @keyframes lispin{to{transform:rotate(360deg)}}
        .li-sep{display:flex;align-items:center;gap:10px;margin:18px 0}
        .li-sep-line{flex:1;height:1px;background:rgba(255,255,255,0.07)}
        .li-sep span{font-size:12px;color:rgba(255,255,255,0.25)}
        .li-wallet-btn{width:100%;padding:12px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:rgba(255,255,255,0.6);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px}
        .li-wallet-btn:hover{border-color:rgba(240,185,11,0.3);color:#fff;background:rgba(255,255,255,0.03)}
        .li-footer{text-align:center;font-size:13px;color:rgba(255,255,255,0.35);margin-top:18px}
        .li-footer a{color:#F0B90B;text-decoration:none}
        .li-trust{display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-top:16px}
        .li-trust span{font-size:11px;color:rgba(255,255,255,0.2)}

        /* Responsive */
        @media(max-width:1024px){
          .li-page{flex-direction:column;align-items:center}
          .li-left{position:static;width:100%;max-width:420px;flex-direction:row;flex-wrap:wrap;gap:12px}
          .li-brand{flex:1;min-width:220px}
          .li-stats-card{flex:1;min-width:180px}
        }
        @media(max-width:540px){.li-left{flex-direction:column}}
      `}</style>

      <div className="li-page">

        {/* LEFT PANEL */}
        <div className="li-left">
          <div className="li-brand">
            <div className="li-brand-logo">
              <span className="li-brand-nxt">NXT</span>
              <div className="li-brand-vl" />
              <div className="li-brand-txt">
                <span className="li-brand-t1">NEXTOKEN</span>
                <span className="li-brand-t2">CAPITAL</span>
              </div>
            </div>
            <p className="li-brand-desc">
              The regulated infrastructure for tokenized real-world assets.
              Nextoken Capital UAB is registered in Lithuania and supervised by the Bank of Lithuania.
            </p>
            <div className="li-brand-feats">
              {FEATURES.map(f => (
                <div key={f.text} className="li-brand-feat">
                  <span className="li-brand-feat-ico">{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="li-stats-card">
            <div className="li-stats-title">Platform Stats</div>
            {STATS.map(([v, l]) => (
              <div key={l} className="li-stat-row">
                <span className="li-stat-v">{v}</span>
                <span className="li-stat-l">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="li-right">
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
                <div className="li-pwd-wrap">
                  <input
                    className="li-input"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={handle}
                    placeholder="Your password"
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="li-eye" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? "🙈" : "👁️"}
                  </button>
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