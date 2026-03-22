import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const STEPS = ["Account", "Personal", "Security", "KYC", "Done"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [form, setForm]     = useState({
    email: "", password: "", confirm: "",
    firstName: "", lastName: "", country: "", dob: "",
    agreeTerms: false, agreeRisk: false,
  });

  const handle = e => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
    setError("");
  };

  const next = () => {
    setError("");
    if (step === 0) {
      if (!form.email || !form.password || !form.confirm) { setError("Please fill in all fields."); return; }
      if (!form.email.includes("@")) { setError("Please enter a valid email address."); return; }
      if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
      if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    }
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.country || !form.dob) { setError("Please fill in all fields."); return; }
    }
    if (step === 2) {
      if (!form.agreeTerms || !form.agreeRisk) { setError("You must agree to the Terms and Risk Disclosure."); return; }
    }
    setStep(s => s + 1);
  };

  const submitKYC = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    // Save user to localStorage
    localStorage.setItem("nxt_user", JSON.stringify({
      email:     form.email,
      firstName: form.firstName,
      lastName:  form.lastName,
      country:   form.country,
    }));
    // Seed demo portfolio
    localStorage.setItem("nxt_portfolio", JSON.stringify({
      totalValue: 12450, totalInvested: 10000, totalReturn: 2450,
      holdings: [
        { symbol:"SOLAR-01", name:"Solar Farm Portfolio",      qty:120, price:10.42, value:1250.40, change:2.4  },
        { symbol:"WIND-07",  name:"Wind Energy Project",       qty:80,  price:12.15, value:972.00,  change:5.1  },
        { symbol:"TECH-08",  name:"Tech Business Park",        qty:50,  price:15.30, value:765.00,  change:3.7  },
        { symbol:"OFFIC-03", name:"Tokenized Office Building", qty:200, price:8.91,  value:1782.00, change:-0.8 },
      ],
    }));
    setLoading(false);
    setStep(4);
  };

  const pwdStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)  s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const pwdColor = ["#FF4D4D","#FF8C00","#F0B90B","#0ECB81","#0ECB81"][pwdStrength() - 1] || "#333";
  const pwdLabel = ["","Weak","Fair","Good","Strong","Very Strong"][pwdStrength()];

  const COUNTRIES = ["Lithuania","Estonia","Latvia","Germany","France","Netherlands","Poland","Spain","Italy","Portugal","Sweden","Denmark","Finland","Norway","Austria","Belgium","Ireland","United Kingdom","United States","Singapore","Other"];

  return (
    <>
      <Head>
        <title>Create Account — Nextoken Capital</title>
        <meta name="description" content="Create your free Nextoken Capital account and start investing in tokenized real-world assets." />
      </Head>
      <Navbar />
      <style>{`
        .rg-page{min-height:100vh;background:#0B0E11;display:flex;align-items:center;justify-content:center;padding:80px 20px 40px;position:relative;overflow:hidden}
        .rg-glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 60% 50% at 50% 40%,rgba(240,185,11,0.05),transparent)}
        .rg-wrap{width:100%;max-width:480px;position:relative}
        .rg-logo{text-align:center;margin-bottom:24px}
        .rg-logo-nxt{font-size:24px;font-weight:900;color:#F0B90B;letter-spacing:-1px}
        .rg-logo-sub{font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:3px;text-transform:uppercase;margin-top:3px}
        .rg-steps{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:28px}
        .rg-step{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.25);padding:0 8px}
        .rg-step.active{color:#F0B90B}
        .rg-step.done{color:#0ECB81}
        .rg-step-dot{width:22px;height:22px;border-radius:50%;border:2px solid currentColor;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
        .rg-step-line{width:20px;height:1px;background:rgba(255,255,255,0.1)}
        .rg-card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px}
        .rg-title{font-size:18px;font-weight:900;color:#fff;margin-bottom:4px}
        .rg-sub{font-size:13px;color:rgba(255,255,255,0.38);margin-bottom:24px;line-height:1.6}
        .rg-field{margin-bottom:16px}
        .rg-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}
        .rg-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px 14px;font-size:14px;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .rg-input:focus{border-color:rgba(240,185,11,0.5)}
        .rg-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .rg-pwd-bar{height:3px;border-radius:2px;background:#333;margin-top:6px;overflow:hidden}
        .rg-pwd-fill{height:100%;border-radius:2px;transition:all .3s}
        .rg-pwd-label{font-size:11px;margin-top:4px;font-weight:600}
        .rg-check{display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;cursor:pointer}
        .rg-check input{width:16px;height:16px;margin-top:2px;accent-color:#F0B90B;flex-shrink:0;cursor:pointer}
        .rg-check-text{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.6}
        .rg-check-text a{color:#F0B90B;text-decoration:none}
        .rg-error{background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.25);border-radius:8px;padding:11px 14px;font-size:13px;color:#FF6B6B;margin-bottom:16px;line-height:1.5}
        .rg-btn{width:100%;padding:13px;background:#F0B90B;color:#000;font-size:14px;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:inherit;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px}
        .rg-btn:hover:not(:disabled){background:#FFD000}
        .rg-btn:disabled{background:rgba(240,185,11,0.2);color:rgba(0,0,0,0.35);cursor:not-allowed}
        .rg-spin{width:16px;height:16px;border:2px solid rgba(0,0,0,0.2);border-top-color:#000;border-radius:50%;animation:rgspin .6s linear infinite}
        @keyframes rgspin{to{transform:rotate(360deg)}}
        .rg-kyc-box{text-align:center;padding:16px 0}
        .rg-kyc-icon{font-size:48px;margin-bottom:14px}
        .rg-kyc-title{font-size:16px;font-weight:800;color:#fff;margin-bottom:8px}
        .rg-kyc-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:22px}
        .rg-done-box{text-align:center;padding:16px 0}
        .rg-done-icon{font-size:52px;margin-bottom:16px}
        .rg-done-title{font-size:20px;font-weight:900;color:#0ECB81;margin-bottom:8px}
        .rg-done-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:24px}
        .rg-footer{text-align:center;font-size:13px;color:rgba(255,255,255,0.35);margin-top:18px}
        .rg-footer a{color:#F0B90B;text-decoration:none}
        @media(max-width:400px){.rg-row{grid-template-columns:1fr}.rg-steps{gap:0}}
      `}</style>

      <div className="rg-page">
        <div className="rg-glow" />
        <div className="rg-wrap">
          <div className="rg-logo">
            <div className="rg-logo-nxt">NXT</div>
            <div className="rg-logo-sub">Nextoken Capital</div>
          </div>

          {/* Step indicators */}
          <div className="rg-steps">
            {STEPS.map((s, i) => (
              <div key={s} style={{ display:"flex", alignItems:"center" }}>
                <div className={`rg-step ${i === step ? "active" : i < step ? "done" : ""}`}>
                  <div className="rg-step-dot">{i < step ? "✓" : i + 1}</div>
                  <span style={{ display: i === step ? "block" : "none" }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className="rg-step-line" />}
              </div>
            ))}
          </div>

          <div className="rg-card">
            {error && <div className="rg-error">⚠️ {error}</div>}

            {/* STEP 0 — Account */}
            {step === 0 && (
              <>
                <div className="rg-title">Create your account</div>
                <p className="rg-sub">Start investing in tokenized real-world assets in minutes.</p>
                <div className="rg-field">
                  <label className="rg-label">Email Address</label>
                  <input className="rg-input" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" />
                </div>
                <div className="rg-field">
                  <label className="rg-label">Password</label>
                  <input className="rg-input" name="password" type="password" value={form.password} onChange={handle} placeholder="Min. 8 characters" />
                  {form.password && (
                    <>
                      <div className="rg-pwd-bar"><div className="rg-pwd-fill" style={{ width: (pwdStrength()/5*100)+"%" , background: pwdColor }} /></div>
                      <div className="rg-pwd-label" style={{ color: pwdColor }}>{pwdLabel}</div>
                    </>
                  )}
                </div>
                <div className="rg-field">
                  <label className="rg-label">Confirm Password</label>
                  <input className="rg-input" name="confirm" type="password" value={form.confirm} onChange={handle} placeholder="Repeat password" />
                </div>
                <button className="rg-btn" onClick={next}>Continue →</button>
              </>
            )}

            {/* STEP 1 — Personal */}
            {step === 1 && (
              <>
                <div className="rg-title">Personal details</div>
                <p className="rg-sub">Required for KYC verification under EU AML regulations.</p>
                <div className="rg-row">
                  <div className="rg-field">
                    <label className="rg-label">First Name</label>
                    <input className="rg-input" name="firstName" value={form.firstName} onChange={handle} placeholder="Bikash" />
                  </div>
                  <div className="rg-field">
                    <label className="rg-label">Last Name</label>
                    <input className="rg-input" name="lastName" value={form.lastName} onChange={handle} placeholder="Bhat" />
                  </div>
                </div>
                <div className="rg-field">
                  <label className="rg-label">Country of Residence</label>
                  <select className="rg-input" name="country" value={form.country} onChange={handle} style={{ appearance:"none" }}>
                    <option value="">Select country...</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="rg-field">
                  <label className="rg-label">Date of Birth</label>
                  <input className="rg-input" name="dob" type="date" value={form.dob} onChange={handle} />
                </div>
                <div style={{ display:"flex", gap:10, marginTop:8 }}>
                  <button className="rg-btn" style={{ background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.6)", flex:0.5 }} onClick={() => setStep(0)}>← Back</button>
                  <button className="rg-btn" style={{ flex:1 }} onClick={next}>Continue →</button>
                </div>
              </>
            )}

            {/* STEP 2 — Agreements */}
            {step === 2 && (
              <>
                <div className="rg-title">Agreements</div>
                <p className="rg-sub">Please read and agree to our terms before proceeding.</p>
                <label className="rg-check">
                  <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handle} />
                  <span className="rg-check-text">I agree to the <Link href="/terms" target="_blank">Terms of Service</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link> of Nextoken Capital UAB.</span>
                </label>
                <label className="rg-check">
                  <input type="checkbox" name="agreeRisk" checked={form.agreeRisk} onChange={handle} />
                  <span className="rg-check-text">I have read the <Link href="/risk" target="_blank">Risk Disclosure</Link>. I understand that investing in tokenized assets involves risk and I may lose capital.</span>
                </label>
                <div style={{ display:"flex", gap:10, marginTop:8 }}>
                  <button className="rg-btn" style={{ background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.6)", flex:0.5 }} onClick={() => setStep(1)}>← Back</button>
                  <button className="rg-btn" style={{ flex:1 }} onClick={next}>Continue →</button>
                </div>
              </>
            )}

            {/* STEP 3 — KYC */}
            {step === 3 && (
              <div className="rg-kyc-box">
                <div className="rg-kyc-icon">🪪</div>
                <div className="rg-kyc-title">Identity Verification</div>
                <p className="rg-kyc-sub">
                  We are required by EU AML regulations to verify your identity.
                  This process takes under 2 minutes via our partner Sumsub.
                  You will need a government-issued photo ID.
                </p>
                <button className="rg-btn" disabled={loading} onClick={submitKYC}>
                  {loading ? <><div className="rg-spin" /> Verifying...</> : "Start KYC Verification →"}
                </button>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)", marginTop:14, lineHeight:1.6 }}>
                  Powered by Sumsub · Your data is encrypted and never shared with third parties.
                </p>
              </div>
            )}

            {/* STEP 4 — Done */}
            {step === 4 && (
              <div className="rg-done-box">
                <div className="rg-done-icon">🎉</div>
                <div className="rg-done-title">Account Created!</div>
                <p className="rg-done-sub">
                  Welcome to Nextoken Capital, <strong style={{ color:"#fff" }}>{form.firstName}</strong>!
                  Your demo portfolio has been loaded. Start exploring tokenized investments.
                </p>
                <button className="rg-btn" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard →
                </button>
              </div>
            )}
          </div>

          {step < 4 && (
            <p className="rg-footer">
              Already have an account? <Link href="/login">Log in →</Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}