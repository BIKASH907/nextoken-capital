// pages/register.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const STEPS = ["Account","Personal","Agreements","KYC","Done"];
const COUNTRIES = ["Lithuania","Estonia","Latvia","Germany","France","Netherlands","Poland","Spain","Italy","Portugal","Sweden","Denmark","Finland","Norway","Austria","Belgium","Ireland","United Kingdom","United States","Singapore","Australia","Canada","Japan","India","UAE","Other"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [kycUrl, setKycUrl] = useState("");
  const [form, setForm]     = useState({
    email:"", password:"", confirm:"",
    firstName:"", lastName:"", country:"", dob:"",
    agreeTerms: false, agreeRisk: false,
  });

  const handle = e => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
    setError("");
  };

  const nextStep = () => {
    setError("");
    if (step === 0) {
      if (!form.email || !form.password || !form.confirm) { setError("Please fill in all fields."); return; }
      if (!form.email.includes("@")) { setError("Please enter a valid email address."); return; }
      if (form.password.length < 8)  { setError("Password must be at least 8 characters."); return; }
      if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    }
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.country || !form.dob) { setError("Please fill in all fields."); return; }
      const age = (new Date() - new Date(form.dob)) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 18) { setError("You must be at least 18 years old to invest."); return; }
    }
    if (step === 2) {
      if (!form.agreeTerms || !form.agreeRisk) { setError("You must agree to both the Terms of Service and Risk Disclosure."); return; }
    }
    setStep(s => s + 1);
  };

  // Step 3: Create account in MongoDB then start KYC
  const createAccountAndKYC = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Create account in MongoDB
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:     form.email,
          password:  form.password,
          firstName: form.firstName,
          lastName:  form.lastName,
          country:   form.country,
          dob:       form.dob,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Get Sumsub KYC token
      const kycRes = await fetch("/api/kyc/token", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.user.userId, email: form.email }),
      });

      if (kycRes.ok) {
        const kycData = await kycRes.json();
        setKycUrl(kycData.url || "");
      }

      setStep(4); // Move to KYC step
    } catch (e) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
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
    return Math.min(s, 5);
  };
  const strengthColors = ["#333","#FF4D4D","#FF8C00","#F0B90B","#0ECB81","#0ECB81"];
  const strengthLabels = ["","Weak","Fair","Good","Strong","Very Strong"];

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
        .rg-logo{text-align:center;margin-bottom:22px}
        .rg-logo-nxt{font-size:24px;font-weight:900;color:#F0B90B;letter-spacing:-1px}
        .rg-logo-sub{font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:3px;text-transform:uppercase;margin-top:3px}
        .rg-steps{display:flex;align-items:center;justify-content:center;margin-bottom:24px;gap:0}
        .rg-step{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.22);padding:0 6px}
        .rg-step.active{color:#F0B90B}
        .rg-step.done{color:#0ECB81}
        .rg-dot{width:20px;height:20px;border-radius:50%;border:2px solid currentColor;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0}
        .rg-line{width:16px;height:1px;background:rgba(255,255,255,0.1)}
        .rg-card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:30px}
        .rg-title{font-size:18px;font-weight:900;color:#fff;margin-bottom:4px}
        .rg-sub{font-size:13px;color:rgba(255,255,255,0.38);margin-bottom:22px;line-height:1.6}
        .rg-field{margin-bottom:15px}
        .rg-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .rg-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:11px 14px;font-size:14px;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .rg-input:focus{border-color:rgba(240,185,11,0.5)}
        .rg-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .rg-bar{height:3px;border-radius:2px;background:#1a1a1a;margin-top:6px;overflow:hidden}
        .rg-bar-fill{height:100%;border-radius:2px;transition:all .3s}
        .rg-strength{font-size:11px;font-weight:600;margin-top:4px}
        .rg-check{display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;cursor:pointer}
        .rg-check input{width:16px;height:16px;margin-top:2px;accent-color:#F0B90B;flex-shrink:0;cursor:pointer}
        .rg-check-text{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.7}
        .rg-check-text a{color:#F0B90B;text-decoration:none}
        .rg-error{background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.25);border-radius:8px;padding:11px 14px;font-size:13px;color:#FF6B6B;margin-bottom:16px;line-height:1.5}
        .rg-btn{width:100%;padding:13px;background:#F0B90B;color:#000;font-size:14px;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:inherit;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:8px}
        .rg-btn:hover:not(:disabled){background:#FFD000}
        .rg-btn:disabled{background:rgba(240,185,11,0.2);color:rgba(0,0,0,0.35);cursor:not-allowed}
        .rg-btn-ghost{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1)}
        .rg-btn-ghost:hover:not(:disabled){background:rgba(255,255,255,0.1);color:#fff}
        .rg-spin{width:16px;height:16px;border:2px solid rgba(0,0,0,0.2);border-top-color:#000;border-radius:50%;animation:rgspin .6s linear infinite}
        @keyframes rgspin{to{transform:rotate(360deg)}}
        .rg-two{display:grid;grid-template-columns:0.6fr 1fr;gap:10px;margin-top:6px}
        .rg-kyc-box{text-align:center;padding:10px 0 4px}
        .rg-kyc-ico{font-size:48px;margin-bottom:14px}
        .rg-kyc-title{font-size:17px;font-weight:800;color:#fff;margin-bottom:8px}
        .rg-kyc-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:20px}
        .rg-kyc-iframe{width:100%;height:500px;border:none;border-radius:10px;background:#161B22}
        .rg-done-box{text-align:center;padding:10px 0 4px}
        .rg-done-ico{font-size:52px;margin-bottom:14px}
        .rg-done-title{font-size:20px;font-weight:900;color:#0ECB81;margin-bottom:8px}
        .rg-done-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:22px}
        .rg-footer{text-align:center;font-size:13px;color:rgba(255,255,255,0.35);margin-top:18px}
        .rg-footer a{color:#F0B90B;text-decoration:none}
        .rg-pending-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;background:rgba(240,185,11,0.1);border:1px solid rgba(240,185,11,0.25);color:#F0B90B;font-size:12px;font-weight:700;margin-bottom:16px}
        @media(max-width:400px){.rg-row{grid-template-columns:1fr}.rg-two{grid-template-columns:1fr}}
      `}</style>

      <div className="rg-page">
        <div className="rg-glow" />
        <div className="rg-wrap">
          <div className="rg-logo">
            <div className="rg-logo-nxt">NXT</div>
            <div className="rg-logo-sub">Nextoken Capital</div>
          </div>

          {/* Step indicator */}
          <div className="rg-steps">
            {STEPS.map((s, i) => (
              <div key={s} style={{display:"flex",alignItems:"center"}}>
                <div className={`rg-step ${i===step?"active":i<step?"done":""}`}>
                  <div className="rg-dot">{i<step?"✓":i+1}</div>
                  <span style={{display:i===step?"block":"none"}}>{s}</span>
                </div>
                {i<STEPS.length-1 && <div className="rg-line"/>}
              </div>
            ))}
          </div>

          <div className="rg-card">
            {error && <div className="rg-error">⚠️ {error}</div>}

            {/* STEP 0 — Account */}
            {step === 0 && <>
              <div className="rg-title">Create your account</div>
              <p className="rg-sub">Start investing in tokenized real-world assets. Takes 3 minutes.</p>
              <div className="rg-field">
                <label className="rg-label">Email Address</label>
                <input className="rg-input" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" />
              </div>
              <div className="rg-field">
                <label className="rg-label">Password</label>
                <input className="rg-input" name="password" type="password" value={form.password} onChange={handle} placeholder="Min. 8 characters" />
                {form.password && <>
                  <div className="rg-bar"><div className="rg-bar-fill" style={{width:(pwdStrength()/5*100)+"%",background:strengthColors[pwdStrength()]}}/></div>
                  <div className="rg-strength" style={{color:strengthColors[pwdStrength()]}}>{strengthLabels[pwdStrength()]}</div>
                </>}
              </div>
              <div className="rg-field">
                <label className="rg-label">Confirm Password</label>
                <input className="rg-input" name="confirm" type="password" value={form.confirm} onChange={handle} placeholder="Repeat password" />
                {form.confirm && form.confirm !== form.password && <div style={{fontSize:12,color:"#FF6B6B",marginTop:4}}>Passwords do not match</div>}
                {form.confirm && form.confirm === form.password && <div style={{fontSize:12,color:"#0ECB81",marginTop:4}}>✓ Passwords match</div>}
              </div>
              <button className="rg-btn" onClick={nextStep}>Continue →</button>
            </>}

            {/* STEP 1 — Personal */}
            {step === 1 && <>
              <div className="rg-title">Personal details</div>
              <p className="rg-sub">Required for KYC verification under EU AML regulations (AMLD6).</p>
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
                <select className="rg-input" name="country" value={form.country} onChange={handle} style={{appearance:"none"}}>
                  <option value="">Select country...</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="rg-field">
                <label className="rg-label">Date of Birth</label>
                <input className="rg-input" name="dob" type="date" value={form.dob} onChange={handle} max={new Date(Date.now()-18*365.25*24*60*60*1000).toISOString().split("T")[0]} />
              </div>
              <div className="rg-two">
                <button className="rg-btn rg-btn-ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="rg-btn" onClick={nextStep}>Continue →</button>
              </div>
            </>}

            {/* STEP 2 — Agreements */}
            {step === 2 && <>
              <div className="rg-title">Agreements</div>
              <p className="rg-sub">Please read and accept our terms before creating your account.</p>
              <label className="rg-check">
                <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handle} />
                <span className="rg-check-text">
                  I agree to the <Link href="/terms" target="_blank">Terms of Service</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link> of Nextoken Capital UAB, a company registered in Lithuania.
                </span>
              </label>
              <label className="rg-check">
                <input type="checkbox" name="agreeRisk" checked={form.agreeRisk} onChange={handle} />
                <span className="rg-check-text">
                  I have read the <Link href="/risk" target="_blank">Risk Disclosure</Link> and <Link href="/aml" target="_blank">AML Policy</Link>. I understand that investing in tokenized assets involves significant risk and I may lose my invested capital.
                </span>
              </label>
              <div style={{background:"rgba(240,185,11,0.06)",border:"1px solid rgba(240,185,11,0.2)",borderRadius:8,padding:"12px 14px",fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:16}}>
                🏛️ Nextoken Capital UAB is authorized by the Bank of Lithuania (EMI license) and operates under MiCA regulation. All investors must complete KYC verification.
              </div>
              <div className="rg-two">
                <button className="rg-btn rg-btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="rg-btn" onClick={nextStep}>Continue →</button>
              </div>
            </>}

            {/* STEP 3 — Create Account + KYC */}
            {step === 3 && <>
              <div className="rg-kyc-box">
                <div className="rg-kyc-ico">🪪</div>
                <div className="rg-kyc-title">Identity Verification</div>
                <p className="rg-kyc-sub">
                  Your account will be created and then we will launch identity verification via Sumsub.
                  You will need a valid government-issued photo ID. The process takes 2–5 minutes.
                </p>
                <div style={{background:"#161B22",borderRadius:10,padding:"14px 16px",fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:20,textAlign:"left"}}>
                  <div style={{fontWeight:700,color:"rgba(255,255,255,0.7)",marginBottom:6}}>What you need:</div>
                  <div>✅ Passport, national ID, or driver's license</div>
                  <div>✅ Camera access (for selfie)</div>
                  <div>✅ Good lighting</div>
                </div>
                <button className="rg-btn" disabled={loading} onClick={createAccountAndKYC}>
                  {loading ? <><div className="rg-spin"/>Creating account...</> : "Create Account & Start KYC →"}
                </button>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:12,lineHeight:1.6}}>
                  Powered by Sumsub · EU GDPR compliant · Your data is encrypted
                </p>
              </div>
            </>}

            {/* STEP 4 — KYC in progress / Done */}
            {step === 4 && <>
              <div className="rg-done-box">
                <div className="rg-done-ico">✅</div>
                <div className="rg-done-title">Account Created!</div>
                <div className="rg-pending-badge">⏳ KYC Verification Pending</div>
                <p className="rg-done-sub">
                  Welcome, <strong style={{color:"#fff"}}>{form.firstName}</strong>! Your account has been created.
                  To start investing, you need to complete KYC verification.
                  We have sent verification instructions to <strong style={{color:"#fff"}}>{form.email}</strong>.
                </p>
                {kycUrl ? (
                  <>
                    <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:14}}>Or complete verification directly below:</p>
                    <iframe src={kycUrl} className="rg-kyc-iframe" title="KYC Verification" />
                  </>
                ) : (
                  <div style={{background:"rgba(240,185,11,0.06)",border:"1px solid rgba(240,185,11,0.2)",borderRadius:10,padding:"16px",fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:20}}>
                    <div style={{color:"#F0B90B",fontWeight:700,marginBottom:6}}>Next step: Complete KYC</div>
                    Check your email for a verification link, or visit the KYC page from your dashboard.
                    Verification typically takes 1–2 business days after document submission.
                  </div>
                )}
                <button className="rg-btn" style={{marginTop:kycUrl?16:0}} onClick={() => router.push("/dashboard")}>
                  Go to Dashboard →
                </button>
              </div>
            </>}
          </div>

          {step < 3 && (
            <p className="rg-footer">
              Already have an account? <Link href="/login">Log in →</Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}