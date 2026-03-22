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

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simulate login — replace with real API call
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    if (form.email && form.password.length >= 6) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Log In — Nextoken Capital</title>
        <meta name="description" content="Log in to your Nextoken Capital account to manage your tokenized asset portfolio." />
      </Head>
      <Navbar />

      <style>{`
        .lg-page {
          min-height: 100vh; background: #0B0E11;
          display: flex; align-items: center; justify-content: center;
          padding: 80px 20px 60px;
        }
        .lg-wrap { width: 100%; max-width: 440px; }

        .lg-logo { text-align: center; margin-bottom: 32px; }
        .lg-logo-nxt { font-size: 28px; font-weight: 900; color: #F0B90B; letter-spacing: -1px; }
        .lg-logo-sub  { font-size: 12px; color: rgba(255,255,255,0.3); letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }

        .lg-card { background: #0F1318; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 36px; }
        .lg-card-title { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 6px; text-align: center; }
        .lg-card-sub   { font-size: 13px; color: rgba(255,255,255,0.4); text-align: center; margin-bottom: 28px; line-height: 1.6; }

        .lg-field { margin-bottom: 18px; }
        .lg-field label { display: block; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 7px; }
        .lg-field input {
          width: 100%; background: #161B22; color: #fff;
          border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
          padding: 12px 14px; font-size: 14px; outline: none;
          font-family: inherit; transition: border-color .15s;
        }
        .lg-field input:focus { border-color: rgba(240,185,11,0.5); }
        .lg-pwd-wrap { position: relative; }
        .lg-pwd-wrap input { padding-right: 44px; }
        .lg-pwd-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.4); padding: 4px; font-size: 16px; line-height: 1; }
        .lg-pwd-eye:hover { color: #fff; }

        .lg-forgot { display: block; text-align: right; font-size: 12px; color: rgba(255,255,255,0.4); text-decoration: none; margin-top: -8px; margin-bottom: 22px; }
        .lg-forgot:hover { color: #F0B90B; }

        .lg-error { background: rgba(255,77,77,0.1); border: 1px solid rgba(255,77,77,0.3); border-radius: 8px; padding: 12px 14px; font-size: 13px; color: #FF4D4D; margin-bottom: 18px; }

        .lg-btn { width: 100%; padding: 14px; background: #F0B90B; color: #000; font-size: 14px; font-weight: 800; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; transition: background .15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .lg-btn:hover:not(:disabled) { background: #FFD000; }
        .lg-btn:disabled { background: rgba(240,185,11,0.3); color: rgba(0,0,0,0.5); cursor: not-allowed; }

        .lg-spinner { width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.3); border-top-color: #000; border-radius: 50%; animation: lg-spin .6s linear infinite; }
        @keyframes lg-spin { to { transform: rotate(360deg); } }

        .lg-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .lg-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .lg-divider span { font-size: 12px; color: rgba(255,255,255,0.3); }

        .lg-wallet-btn {
          width: 100%; padding: 13px; background: transparent;
          border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
          color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit; transition: all .15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .lg-wallet-btn:hover { border-color: rgba(255,255,255,0.3); color: #fff; background: rgba(255,255,255,0.04); }

        .lg-register { text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 20px; }
        .lg-register a { color: #F0B90B; text-decoration: none; }
        .lg-register a:hover { text-decoration: underline; }

        .lg-trust { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 24px; }
        .lg-trust-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(255,255,255,0.25); }

        @media(max-width:480px){ .lg-card{ padding: 24px 18px; } }
      `}</style>

      <div className="lg-page">
        <div className="lg-wrap">

          <div className="lg-logo">
            <div className="lg-logo-nxt">NXT</div>
            <div className="lg-logo-sub">Nextoken Capital</div>
          </div>

          <div className="lg-card">
            <div className="lg-card-title">Welcome back</div>
            <p className="lg-card-sub">Log in to your account to manage your portfolio.</p>

            {error && <div className="lg-error">⚠️ {error}</div>}

            <form onSubmit={submit}>
              <div className="lg-field">
                <label>Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required autoComplete="email" />
              </div>

              <div className="lg-field">
                <label>Password</label>
                <div className="lg-pwd-wrap">
                  <input
                    name="password" type={showPwd ? "text" : "password"}
                    value={form.password} onChange={handle}
                    placeholder="Your password" required autoComplete="current-password"
                  />
                  <button type="button" className="lg-pwd-eye" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <Link href="/forgot-password" className="lg-forgot">Forgot password?</Link>

              <button type="submit" className="lg-btn" disabled={loading || !form.email || !form.password}>
                {loading ? <><div className="lg-spinner" /> Logging in...</> : "Log In →"}
              </button>
            </form>

            <div className="lg-divider">
              <div className="lg-divider-line" />
              <span>or</span>
              <div className="lg-divider-line" />
            </div>

            <button className="lg-wallet-btn" onClick={() => router.push("/dashboard")}>
              🦊 Connect Wallet
            </button>
          </div>

          <p className="lg-register">
            Don&apos;t have an account? <Link href="/register">Create one free</Link>
          </p>

          <div className="lg-trust">
            {["🏛️ Bank of Lithuania","⚖️ MiCA Compliant","🔐 256-bit SSL"].map(t => (
              <div key={t} className="lg-trust-item">{t}</div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}