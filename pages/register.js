import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";

const COUNTRIES = ["Lithuania","Estonia","Latvia","Germany","France","Netherlands","Spain","Poland","Italy","Portugal","Sweden","Denmark","Finland","Austria","Belgium","United Kingdom","United States","Singapore","Other"];

export default function RegisterPage() {
  const [step, setStep]     = useState(1);
  const [type, setType]     = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm]     = useState({
    firstName:"", lastName:"", email:"", password:"",
    country:"", phone:"", dob:"",
    agreedTerms: false, agreedRisk: false,
  });

  const handle = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const next = (e) => { e && e.preventDefault(); setStep(s => Math.min(s + 1, 5)); };
  const back = ()  => setStep(s => Math.max(s - 1, 1));

  const STEPS = ["Account Type","Personal Info","Security","Verification","Complete"];

  return (
    <>
      <Head>
        <title>Create Account — Nextoken Capital</title>
        <meta name="description" content="Create your free Nextoken Capital account and start investing in tokenized real-world assets." />
      </Head>
      <Navbar />

      <style>{`
        .rg-page { min-height:100vh; background:#0B0E11; padding:80px 20px 60px; display:flex; flex-direction:column; align-items:center; }
        .rg-wrap { width:100%; max-width:560px; }

        /* STEPS */
        .rg-steps { display:flex; align-items:center; margin-bottom:36px; }
        .rg-step-item { display:flex; flex-direction:column; align-items:center; flex:1; position:relative; }
        .rg-step-item:not(:last-child)::after { content:""; position:absolute; top:14px; left:calc(50% + 14px); right:calc(-50% + 14px); height:1px; background:rgba(255,255,255,0.1); z-index:0; }
        .rg-step-circle { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; position:relative; z-index:1; transition:all .2s; }
        .rg-step-circle.done   { background:#F0B90B; color:#000; }
        .rg-step-circle.active { background:#F0B90B; color:#000; box-shadow:0 0 0 4px rgba(240,185,11,0.2); }
        .rg-step-circle.future { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.3); border:1px solid rgba(255,255,255,0.1); }
        .rg-step-label { font-size:10px; color:rgba(255,255,255,0.35); margin-top:5px; text-align:center; display:none; }
        @media(min-width:480px){ .rg-step-label{ display:block; } }

        /* CARD */
        .rg-card { background:#0F1318; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:36px; }
        .rg-card-title { font-size:20px; font-weight:800; color:#fff; margin-bottom:6px; }
        .rg-card-sub   { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:28px; line-height:1.6; }

        /* ACCOUNT TYPE */
        .rg-type-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:24px; }
        .rg-type-card { border:2px solid rgba(255,255,255,0.08); border-radius:12px; padding:22px 18px; cursor:pointer; text-align:center; transition:all .2s; background:#161B22; }
        .rg-type-card:hover { border-color:rgba(240,185,11,0.35); }
        .rg-type-card.selected { border-color:#F0B90B; background:rgba(240,185,11,0.06); }
        .rg-type-icon  { font-size:28px; margin-bottom:10px; }
        .rg-type-name  { font-size:15px; font-weight:800; color:#fff; margin-bottom:5px; }
        .rg-type-desc  { font-size:12px; color:rgba(255,255,255,0.4); line-height:1.5; }

        /* FIELDS */
        .rg-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .rg-field { margin-bottom:16px; }
        .rg-field label { display:block; font-size:11px; font-weight:700; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:.5px; margin-bottom:7px; }
        .rg-field input, .rg-field select {
          width:100%; background:#161B22; color:#fff;
          border:1px solid rgba(255,255,255,0.1); border-radius:8px;
          padding:12px 14px; font-size:13px; outline:none;
          font-family:inherit; transition:border-color .15s;
        }
        .rg-field input:focus, .rg-field select:focus { border-color:rgba(240,185,11,0.5); }
        .rg-field select option { background:#161B22; }
        .rg-pwd-wrap { position:relative; }
        .rg-pwd-wrap input { padding-right:44px; }
        .rg-pwd-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.4); padding:4px; }
        .rg-pwd-eye:hover { color:#fff; }

        /* PASSWORD STRENGTH */
        .rg-pwd-strength { display:flex; gap:4px; margin-top:8px; }
        .rg-pwd-bar { flex:1; height:3px; border-radius:2px; background:rgba(255,255,255,0.08); transition:background .2s; }
        .rg-pwd-bar.weak   { background:#FF4D4D; }
        .rg-pwd-bar.medium { background:#F0B90B; }
        .rg-pwd-bar.strong { background:#0ECB81; }

        /* CHECKBOXES */
        .rg-check { display:flex; align-items:flex-start; gap:10px; margin-bottom:14px; cursor:pointer; }
        .rg-check input[type=checkbox] { width:16px; height:16px; flex-shrink:0; margin-top:1px; accent-color:#F0B90B; cursor:pointer; }
        .rg-check span { font-size:13px; color:rgba(255,255,255,0.55); line-height:1.5; }
        .rg-check a { color:#F0B90B; text-decoration:none; }
        .rg-check a:hover { text-decoration:underline; }

        /* BUTTONS */
        .rg-btn-next { width:100%; padding:14px; background:#F0B90B; color:#000; font-size:14px; font-weight:800; border:none; border-radius:8px; cursor:pointer; font-family:inherit; transition:background .15s; margin-top:6px; }
        .rg-btn-next:hover { background:#FFD000; }
        .rg-btn-next:disabled { background:rgba(240,185,11,0.3); color:rgba(0,0,0,0.5); cursor:not-allowed; }
        .rg-btn-back { background:none; border:none; color:rgba(255,255,255,0.4); font-size:13px; cursor:pointer; font-family:inherit; padding:0; margin-bottom:12px; }
        .rg-btn-back:hover { color:#fff; }

        /* KYC */
        .rg-kyc-box { background:#161B22; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:20px; margin-bottom:20px; }
        .rg-kyc-title { font-size:14px; font-weight:700; color:#fff; margin-bottom:10px; }
        .rg-kyc-item { display:flex; align-items:center; gap:10px; font-size:13px; color:rgba(255,255,255,0.5); margin-bottom:8px; }
        .rg-kyc-item::before { content:"✓"; color:#0ECB81; font-weight:800; }
        .rg-kyc-note { font-size:12px; color:rgba(255,255,255,0.3); line-height:1.6; margin-top:12px; }

        /* SUCCESS */
        .rg-success { text-align:center; padding:20px 0; }
        .rg-success-icon  { font-size:56px; margin-bottom:18px; }
        .rg-success-title { font-size:22px; font-weight:900; color:#F0B90B; margin-bottom:10px; }
        .rg-success-sub   { font-size:14px; color:rgba(255,255,255,0.45); line-height:1.7; margin-bottom:28px; }
        .rg-success-btns  { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .rg-success-btn-primary { padding:13px 28px; background:#F0B90B; color:#000; border-radius:8px; font-size:14px; font-weight:800; text-decoration:none; }
        .rg-success-btn-ghost   { padding:13px 28px; background:transparent; color:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.2); border-radius:8px; font-size:14px; font-weight:700; text-decoration:none; }

        .rg-divider { text-align:center; font-size:13px; color:rgba(255,255,255,0.3); margin:20px 0; }
        .rg-login-link { text-align:center; font-size:13px; color:rgba(255,255,255,0.45); margin-top:20px; }
        .rg-login-link a { color:#F0B90B; text-decoration:none; }

        @media(max-width:480px){ .rg-row{ grid-template-columns:1fr; } .rg-type-grid{ grid-template-columns:1fr; } .rg-card{ padding:24px 18px; } }
      `}</style>

      <div className="rg-page">
        <div className="rg-wrap">

          {/* Step indicators */}
          <div className="rg-steps">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const state = n < step ? "done" : n === step ? "active" : "future";
              return (
                <div key={label} className="rg-step-item">
                  <div className={`rg-step-circle ${state}`}>
                    {n < step ? "✓" : n}
                  </div>
                  <span className="rg-step-label">{label}</span>
                </div>
              );
            })}
          </div>

          <div className="rg-card">

            {/* STEP 1 — Account Type */}
            {step === 1 && (
              <>
                <div className="rg-card-title">Choose Account Type</div>
                <p className="rg-card-sub">Select the account type that best describes how you will use the platform.</p>
                <div className="rg-type-grid">
                  {[
                    { id:"investor", icon:"💼", name:"Investor",   desc:"I want to invest in tokenized assets and build a portfolio." },
                    { id:"issuer",   icon:"🏗️", name:"Issuer",     desc:"I want to tokenize my assets and raise capital on the platform." },
                  ].map(t => (
                    <div key={t.id} className={`rg-type-card ${type===t.id?"selected":""}`} onClick={()=>setType(t.id)}>
                      <div className="rg-type-icon">{t.icon}</div>
                      <div className="rg-type-name">{t.name}</div>
                      <div className="rg-type-desc">{t.desc}</div>
                    </div>
                  ))}
                </div>
                <button className="rg-btn-next" onClick={next} disabled={!type}>Continue →</button>
              </>
            )}

            {/* STEP 2 — Personal Info */}
            {step === 2 && (
              <form onSubmit={next}>
                <button type="button" className="rg-btn-back" onClick={back}>← Back</button>
                <div className="rg-card-title">Personal Information</div>
                <p className="rg-card-sub">Enter your details as they appear on your government-issued ID.</p>
                <div className="rg-row">
                  <div className="rg-field">
                    <label>First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handle} placeholder="Bikash" required />
                  </div>
                  <div className="rg-field">
                    <label>Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handle} placeholder="Bhat" required />
                  </div>
                </div>
                <div className="rg-field">
                  <label>Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handle} placeholder="bikash@example.com" required />
                </div>
                <div className="rg-row">
                  <div className="rg-field">
                    <label>Country of Residence</label>
                    <select name="country" value={form.country} onChange={handle} required>
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="rg-field">
                    <label>Date of Birth</label>
                    <input name="dob" type="date" value={form.dob} onChange={handle} required />
                  </div>
                </div>
                <div className="rg-field">
                  <label>Phone Number</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handle} placeholder="+370 600 00000" />
                </div>
                <button type="submit" className="rg-btn-next">Continue →</button>
              </form>
            )}

            {/* STEP 3 — Password */}
            {step === 3 && (
              <form onSubmit={next}>
                <button type="button" className="rg-btn-back" onClick={back}>← Back</button>
                <div className="rg-card-title">Create Password</div>
                <p className="rg-card-sub">Use at least 8 characters with a mix of letters, numbers and symbols.</p>
                <div className="rg-field">
                  <label>Password</label>
                  <div className="rg-pwd-wrap">
                    <input
                      name="password" type={showPwd?"text":"password"}
                      value={form.password} onChange={handle}
                      placeholder="Create a strong password" minLength={8} required
                    />
                    <button type="button" className="rg-pwd-eye" onClick={()=>setShowPwd(!showPwd)}>
                      {showPwd ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {form.password.length > 0 && (
                    <div className="rg-pwd-strength">
                      {[1,2,3,4].map(i => {
                        const len = form.password.length;
                        const hasNum = /\d/.test(form.password);
                        const hasSym = /[^a-zA-Z0-9]/.test(form.password);
                        const score = (len >= 8 ? 1:0) + (len >= 12 ? 1:0) + (hasNum ? 1:0) + (hasSym ? 1:0);
                        const cls = score >= i ? (score <= 1 ? "weak" : score <= 2 ? "medium" : "strong") : "";
                        return <div key={i} className={`rg-pwd-bar ${cls}`} />;
                      })}
                    </div>
                  )}
                </div>
                <div className="rg-kyc-box" style={{ marginTop:8 }}>
                  <div className="rg-kyc-title">🔐 Wallet Backup Reminder</div>
                  <div className="rg-kyc-item">Never share your password with anyone</div>
                  <div className="rg-kyc-item">Use a unique password not used elsewhere</div>
                  <div className="rg-kyc-item">Enable 2FA after account creation</div>
                  <p className="rg-kyc-note">If you connect a wallet, write down your 12 or 24-word recovery phrase and store it securely offline. Nextoken Capital will never ask for it.</p>
                </div>
                <label className="rg-check">
                  <input type="checkbox" name="agreedTerms" checked={form.agreedTerms} onChange={handle} required />
                  <span>I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link></span>
                </label>
                <label className="rg-check">
                  <input type="checkbox" name="agreedRisk" checked={form.agreedRisk} onChange={handle} required />
                  <span>I understand investing in tokenized assets involves risk and I have read the <Link href="/risk">Risk Disclosure</Link></span>
                </label>
                <button type="submit" className="rg-btn-next" disabled={!form.agreedTerms || !form.agreedRisk}>Create Account →</button>
              </form>
            )}

            {/* STEP 4 — KYC */}
            {step === 4 && (
              <>
                <button type="button" className="rg-btn-back" onClick={back}>← Back</button>
                <div className="rg-card-title">Identity Verification</div>
                <p className="rg-card-sub">To comply with EU regulations, we need to verify your identity before you can invest. This takes under 5 minutes.</p>
                <div className="rg-kyc-box">
                  <div className="rg-kyc-title">What you will need</div>
                  <div className="rg-kyc-item">Government-issued ID (passport, national ID, or driver's license)</div>
                  <div className="rg-kyc-item">A device with a camera for a quick selfie</div>
                  <div className="rg-kyc-item">Good lighting and a clear background</div>
                  <p className="rg-kyc-note">Verification is powered by Sumsub and typically completes within 2 minutes. Your documents are encrypted and handled in accordance with our Privacy Policy.</p>
                </div>
                <div className="rg-kyc-box">
                  <div className="rg-kyc-title">Accepted Documents</div>
                  {["Passport","National Identity Card","Driver's License"].map(d => (
                    <div key={d} className="rg-kyc-item">{d}</div>
                  ))}
                </div>
                <button className="rg-btn-next" onClick={next}>Start Verification →</button>
                <div className="rg-divider">or</div>
                <button className="rg-btn-next" style={{ background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", marginTop:0 }} onClick={next}>
                  Skip for now — verify later
                </button>
              </>
            )}

            {/* STEP 5 — Complete */}
            {step === 5 && (
              <div className="rg-success">
                <div className="rg-success-icon">🎉</div>
                <div className="rg-success-title">Account Created!</div>
                <p className="rg-success-sub">
                  Welcome to Nextoken Capital, {form.firstName || "investor"}!<br />
                  Your account is ready. Start exploring investment opportunities.
                </p>
                <div className="rg-success-btns">
                  <Link href="/markets" className="rg-success-btn-primary">Browse Markets</Link>
                  <Link href="/dashboard" className="rg-success-btn-ghost">Go to Dashboard</Link>
                </div>
              </div>
            )}

          </div>

          {step < 5 && (
            <p className="rg-login-link">
              Already have an account? <Link href="/login">Log in</Link>
            </p>
          )}

        </div>
      </div>
    </>
  );
}