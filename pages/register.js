import { useState } from "react";
import Link from "next/link";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria",
  "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
  "Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica",
  "Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon",
  "Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel",
  "Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos",
  "Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi",
  "Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova",
  "Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
  "New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Palau","Panama",
  "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles",
  "Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain",
  "Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand",
  "Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine",
  "United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen",
  "Zambia","Zimbabwe"
];

const kycSteps = [
  { label:"Account Created",           done:true,  active:false },
  { label:"Documents Submitted",       done:true,  active:false },
  { label:"Sumsub Review in Progress", done:false, active:true  },
  { label:"Compliance Approval",       done:false, active:false },
  { label:"Full Platform Access",      done:false, active:false },
];

const S = {
  page:    { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  nav:     { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:64, background:"rgba(5,5,8,0.97)", borderBottom:"1px solid rgba(255,255,255,0.08)", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(20px)" },
  body:    { display:"flex", minHeight:"calc(100vh - 64px)" },
  left:    { width:400, flexShrink:0, background:"#0d0d14", borderRight:"1px solid rgba(255,255,255,0.07)", padding:48, display:"flex", flexDirection:"column", justifyContent:"space-between", position:"relative", overflow:"hidden" },
  right:   { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", padding:"40px 24px", overflowY:"auto" },
  panel:   { width:"100%", maxWidth:460 },
  input:   { width:"100%", padding:"12px 16px", borderRadius:10, background:"#0d0d14", border:"1.5px solid rgba(255,255,255,0.10)", color:"#e8e8f0", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.15s" },
  btnGold: { width:"100%", padding:"13px 0", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:"pointer", fontFamily:"inherit", transition:"opacity 0.15s" },
  btnGhost:{ width:"100%", padding:"13px 0", borderRadius:10, background:"transparent", color:"#b0b0c8", fontSize:13, fontWeight:500, border:"1px solid rgba(255,255,255,0.10)", cursor:"pointer", fontFamily:"inherit" },
  card:    { background:"#0d0d14", border:"2px solid rgba(255,255,255,0.08)", borderRadius:14, padding:20, cursor:"pointer", textAlign:"left", width:"100%", transition:"all 0.15s", marginBottom:10 },
  label:   { fontSize:11.5, fontWeight:600, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 },
  err:     { fontSize:11.5, color:"#ef4444", marginTop:4, display:"block" },
  info:    { padding:"14px 16px", borderRadius:12, border:"1px solid rgba(240,185,11,0.2)", background:"rgba(240,185,11,0.05)", display:"flex", gap:12, alignItems:"flex-start" },
  warn:    { padding:"14px 16px", borderRadius:12, border:"1px solid rgba(245,158,11,0.25)", background:"rgba(245,158,11,0.06)", display:"flex", gap:12 },
};

function Field({ label, type="text", name, placeholder, value, onChange, required, hint, error }) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div style={{ marginBottom:14 }}>
      <label style={S.label}>{label} {required && <span style={{ color:"#F0B90B" }}>*</span>}</label>
      <div style={{ position:"relative" }}>
        <input
          type={isPw ? (show ? "text" : "password") : type}
          placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...S.input, borderColor: error ? "#ef4444" : "rgba(255,255,255,0.10)" }}
          onFocus={(e) => e.target.style.borderColor="#F0B90B"}
          onBlur={(e)  => e.target.style.borderColor=error?"#ef4444":"rgba(255,255,255,0.10)"}
        />
        {isPw && (
          <button type="button" onClick={() => setShow(!show)}
            style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#8a9bb8", cursor:"pointer", fontSize:16 }}>
            {show ? "🙈" : "👁"}
          </button>
        )}
      </div>
      {hint && !error && <span style={{ fontSize:11, color:"#8a9bb8", marginTop:4, display:"block" }}>{hint}</span>}
      {error && <span style={S.err}>⚠ {error}</span>}
    </div>
  );
}

function PwStrength({ pw }) {
  const checks = [
    { l:"8+ chars", ok: pw.length >= 8 },
    { l:"Uppercase", ok: /[A-Z]/.test(pw) },
    { l:"Number",    ok: /\d/.test(pw) },
    { l:"Special",   ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["","#ef4444","#f97316","#eab308","#22c55e"];
  const lbls   = ["","Weak","Fair","Good","Strong"];
  if (!pw) return null;
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", gap:4, marginBottom:6 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ height:4, flex:1, borderRadius:4, background:i<=score?colors[score]:"rgba(255,255,255,0.08)", transition:"background 0.3s" }} />)}
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 14px" }}>
        {checks.map(c => <span key={c.l} style={{ fontSize:11, color:c.ok?"#22c55e":"#8a9bb8" }}>{c.ok?"✓":"○"} {c.l}</span>)}
        <span style={{ fontSize:11, fontWeight:700, marginLeft:"auto", color:score>=3?"#22c55e":score===2?"#eab308":"#ef4444" }}>{lbls[score]}</span>
      </div>
    </div>
  );
}

function StepBar({ step }) {
  const labels = ["Account Type","Personal Info","Security","KYC","Complete"];
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", alignItems:"center" }}>
        {[1,2,3,4,5].map((n,i) => (
          <div key={n} style={{ display:"flex", alignItems:"center", flex:i<4?1:"none" }}>
            <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, border:"2px solid "+(n<=step?"#F0B90B":"rgba(255,255,255,0.15)"), background:n<step?"#F0B90B":"transparent", color:n<step?"#000":n===step?"#F0B90B":"#8a9bb8", transition:"all 0.3s" }}>
              {n<step ? "✓" : n}
            </div>
            {i<4 && <div style={{ flex:1, height:2, margin:"0 4px", background:n<step?"#F0B90B":"rgba(255,255,255,0.08)", transition:"background 0.5s" }} />}
          </div>
        ))}
      </div>
      <div style={{ marginTop:10 }}>
        <p style={{ fontSize:11, color:"#8a9bb8", margin:"0 0 2px" }}>Step {step} of 5</p>
        <p style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", margin:0 }}>{labels[step-1]}</p>
      </div>
    </div>
  );
}

function UploadBox({ label, file, onFile }) {
  return (
    <div style={{ marginBottom:12 }}>
      <label style={S.label}>{label}</label>
      <div onClick={() => document.getElementById("upload-"+label).click()}
        style={{ border:"2px dashed "+(file?"#F0B90B":"rgba(255,255,255,0.12)"), borderRadius:12, padding:"18px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer", background:file?"rgba(240,185,11,0.04)":"rgba(255,255,255,0.02)", transition:"all 0.15s" }}>
        {file ? (
          <>
            <span style={{ fontSize:24 }}>✅</span>
            <p style={{ fontSize:12.5, color:"#22c55e", fontWeight:600, margin:0 }}>{file.name}</p>
            <p style={{ fontSize:11, color:"#8a9bb8", margin:0 }}>Click to replace</p>
          </>
        ) : (
          <>
            <span style={{ fontSize:24, color:"#8a9bb8" }}>📎</span>
            <p style={{ fontSize:13, color:"#b0b0c8", margin:0, textAlign:"center" }}>Drag and drop or click to upload</p>
            <p style={{ fontSize:11, color:"#8a9bb8", margin:0 }}>JPG, PNG or PDF · Max 10 MB</p>
          </>
        )}
        <input id={"upload-"+label} type="file" accept="image/*,.pdf" style={{ display:"none" }} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, children }) {
  return (
    <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer", marginBottom:10 }}>
      <div onClick={onChange} style={{ width:20, height:20, borderRadius:5, flexShrink:0, marginTop:2, border:"2px solid "+(checked?"#F0B90B":"rgba(255,255,255,0.2)"), background:checked?"#F0B90B":"transparent", display:"flex", alignItems:"center", justifyContent:"center", color:"#000", cursor:"pointer", transition:"all 0.15s" }}>
        {checked && <span style={{ fontSize:12, fontWeight:900 }}>✓</span>}
      </div>
      <span style={{ fontSize:12.5, color:"#b0b0c8", lineHeight:1.6 }}>{children}</span>
    </label>
  );
}

export default function RegisterPage() {
  const [mode, setMode]         = useState("register");
  const [step, setStep]         = useState(1);
  const [accType, setAccType]   = useState(null);
  const [firstName, setFN]      = useState("");
  const [lastName,  setLN]      = useState("");
  const [email,     setEmail]   = useState("");
  const [phone,     setPhone]   = useState("");
  const [country,   setCountry] = useState("");
  const [dob,       setDob]     = useState("");
  const [password,  setPassword]= useState("");
  const [confirm,   setConfirm] = useState("");
  const [agree,     setAgree]   = useState(false);
  const [marketing, setMkt]     = useState(false);
  const [docType,   setDocType] = useState(null);
  const [docFront,  setDocFront]= useState(null);
  const [docBack,   setDocBack] = useState(null);
  const [selfie,    setSelfie]  = useState(null);
  const [proofAddr, setProofAddr]= useState(null);
  const [kycStatus, setKyc]     = useState("idle");
  const [loginEmail,  setLE]    = useState("");
  const [loginPw,     setLP]    = useState("");
  const [loginLoading,setLL]    = useState(false);
  const [loginError,  setLErr]  = useState("");
  const [errors, setErrors]     = useState({});

  function v2() {
    const e = {};
    if (!firstName.trim()) e.fn = "First name is required";
    if (!lastName.trim())  e.ln = "Last name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    if (!country) e.country = "Please select your country";
    if (!dob)     e.dob = "Date of birth is required";
    setErrors(e); return Object.keys(e).length === 0;
  }
  function v3() {
    const e = {};
    if (password.length < 8) e.pw = "Minimum 8 characters";
    if (password !== confirm) e.cf = "Passwords do not match";
    if (!agree) e.agree = "You must accept the terms";
    setErrors(e); return Object.keys(e).length === 0;
  }
  function kycReady() {
    if (!docType || !docFront || !selfie) return false;
    if (docType !== "passport" && !docBack) return false;
    return true;
  }
  async function submitKyc() {
    setKyc("uploading");
    await new Promise(r => setTimeout(r, 2200));
    setKyc("submitted");
    setTimeout(() => setStep(5), 600);
  }
  async function handleLogin(e) {
    e.preventDefault();
    if (!loginEmail || !loginPw) { setLErr("Please enter your email and password."); return; }
    setLL(true); setLErr("");
    await new Promise(r => setTimeout(r, 1400));
    setLL(false);
    setLErr("Invalid credentials. Please try again.");
  }
  function reset() {
    setStep(1); setAccType(null); setKyc("idle");
    setDocType(null); setDocFront(null); setDocBack(null);
    setSelfie(null); setProofAddr(null); setErrors({});
  }

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation: fadeUp .3s ease both; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse { animation: pulse 2s infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .spin { animation: spin 1s linear infinite; }
        input:focus, select:focus, textarea:focus { border-color:#F0B90B !important; outline:none; }
        select option { background:#0d0d14; }
        input[type=date]::-webkit-calendar-picker-indicator { filter:invert(.5); cursor:pointer; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#05060a; }
        ::-webkit-scrollbar-thumb { background:rgba(240,185,11,0.3); border-radius:3px; }
      `}</style>

      {/* NAVBAR */}
      <nav style={S.nav}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
          <span style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:900, color:"#F0B90B", letterSpacing:2 }}>NXT</span>
          <div style={{ width:1, height:22, background:"rgba(240,185,11,0.25)" }} />
          <div>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:12.5, fontWeight:800, letterSpacing:"0.2em", color:"#F0B90B" }}>NEXTOKEN</div>
            <div style={{ fontSize:8.5, letterSpacing:"0.2em", color:"#8a9bb8", textTransform:"uppercase" }}>CAPITAL</div>
          </div>
        </Link>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:13, color:"#8a9bb8" }}>{mode==="login"?"Need an account?":"Already registered?"}</span>
          <button onClick={() => { setMode(mode==="login"?"register":"login"); setErrors({}); reset(); }}
            style={{ padding:"7px 18px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#b0b0c8", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            {mode==="login" ? "Sign Up" : "Log In"}
          </button>
        </div>
      </nav>

      <div style={S.body}>

        {/* LEFT PANEL */}
        <div style={{ ...S.left, display: "flex" }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 500px 600px at -80px 280px,rgba(240,185,11,0.09) 0%,transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:20, border:"1px solid rgba(240,185,11,0.25)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:24 }}>
              <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
              Regulated Platform
            </div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:28, fontWeight:800, color:"#e8e8f0", lineHeight:1.2, margin:"0 0 14px" }}>
              Join the Future of<br /><span style={{ color:"#F0B90B" }}>Capital Markets</span>
            </h2>
            <p style={{ fontSize:13.5, color:"#8a9bb8", lineHeight:1.75, marginBottom:28 }}>
              Access tokenized real-world assets, blockchain IPOs, and digital bonds — regulated, verified, and built for investors across 180+ countries.
            </p>
            {[
              { icon:"🔒", t:"Regulated and Compliant",    d:"Licensed under Bank of Lithuania. ERC-3643 security token standard." },
              { icon:"🪪", t:"KYC / AML Verified",          d:"Third-party identity verification by Sumsub for all investors." },
              { icon:"🌍", t:"180+ Countries",               d:"Multi-currency support and global regulatory structure." },
              { icon:"📈", t:"Institutional-Grade Deals",   d:"Access opportunities previously reserved for professional investors." },
            ].map(f => (
              <div key={f.t} style={{ display:"flex", gap:14, marginBottom:18 }}>
                <span style={{ fontSize:20, flexShrink:0, marginTop:2 }}>{f.icon}</span>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", margin:"0 0 2px" }}>{f.t}</p>
                  <p style={{ fontSize:12, color:"#8a9bb8", margin:0, lineHeight:1.6 }}>{f.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ position:"relative", zIndex:1, borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:20, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
            {[{v:"12,400+",l:"Investors"},{v:"EUR 140M+",l:"Deployed"},{v:"180+",l:"Countries"}].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:800, color:"#F0B90B" }}>{s.v}</div>
                <div style={{ fontSize:11, color:"#8a9bb8" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={S.right}>
          <div style={S.panel}>

            {/* LOGIN */}
            {mode==="login" && (
              <div className="fu">
                <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, color:"#e8e8f0", margin:"0 0 6px" }}>Welcome back</h1>
                <p style={{ fontSize:14, color:"#8a9bb8", marginBottom:24 }}>Sign in to your Nextoken Capital account.</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                  <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", color:"#b0b0c8", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                  </button>
                  <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", borderRadius:10, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    🔗 Connect Wallet
                  </button>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
                  <span style={{ fontSize:11.5, color:"#8a9bb8" }}>or continue with email</span>
                  <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
                </div>
                <form onSubmit={handleLogin}>
                  <Field label="Email address" type="email" placeholder="you@example.com" value={loginEmail} onChange={setLE} required />
                  <Field label="Password" type="password" placeholder="••••••••" value={loginPw} onChange={setLP} required />
                  <div style={{ textAlign:"right", marginBottom:16, marginTop:-8 }}>
                    <Link href="/forgot-password" style={{ fontSize:12.5, color:"#F0B90B", textDecoration:"none" }}>Forgot password?</Link>
                  </div>
                  {loginError && <div style={{ padding:"12px 16px", borderRadius:10, border:"1px solid rgba(239,68,68,0.25)", background:"rgba(239,68,68,0.08)", color:"#f87171", fontSize:13, marginBottom:14 }}>{loginError}</div>}
                  <button type="submit" disabled={loginLoading}
                    style={{ ...S.btnGold, opacity:loginLoading?0.6:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    {loginLoading ? <><div className="spin" style={{ width:16, height:16, border:"2px solid rgba(0,0,0,0.3)", borderTop:"2px solid #000", borderRadius:"50%" }} /> Signing in...</> : "Sign In"}
                  </button>
                </form>
                <p style={{ textAlign:"center", fontSize:13, color:"#8a9bb8", marginTop:20 }}>
                  New to Nextoken?{" "}
                  <button onClick={() => { setMode("register"); reset(); }} style={{ color:"#F0B90B", fontWeight:600, background:"none", border:"none", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
                    Create an account
                  </button>
                </p>
              </div>
            )}

            {/* REGISTER */}
            {mode==="register" && (
              <div className="fu">
                {step < 5 && (
                  <>
                    <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:"#e8e8f0", margin:"0 0 4px" }}>Create your account</h1>
                    <p style={{ fontSize:13, color:"#8a9bb8", marginBottom:20 }}>
                      Already registered?{" "}
                      <button onClick={() => { setMode("login"); setErrors({}); }} style={{ color:"#F0B90B", fontWeight:600, background:"none", border:"none", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Sign in here</button>
                    </p>
                    <StepBar step={step} />
                  </>
                )}

                {/* STEP 1 */}
                {step===1 && (
                  <div className="fu">
                    <p style={{ fontSize:14, color:"#b0b0c8", marginBottom:16 }}>How will you use Nextoken Capital?</p>
                    {[
                      { id:"investor", emoji:"📈", title:"Investor", desc:"Browse and invest in tokenized bonds, equity, real estate, and blockchain IPOs.", tags:["Markets","Bonds","Equity & IPO","Secondary Trading"], note:"🪪 KYC identity verification required", nc:"#f59e0b" },
                      { id:"issuer",   emoji:"🏢", title:"Issuer / Company", desc:"Tokenize your assets, issue bonds or equity, and raise capital from global investors.", tags:["Tokenize","Bond Issuance","Equity IPO","Cap Table"], note:"📋 Corporate KYB verification required", nc:"#8a9bb8" },
                    ].map(card => (
                      <button key={card.id} onClick={() => { setAccType(card.id); setErrors({}); }}
                        style={{ ...S.card, borderColor:accType===card.id?"#F0B90B":"rgba(255,255,255,0.08)", background:accType===card.id?"rgba(240,185,11,0.06)":"#0d0d14" }}>
                        <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                          <span style={{ fontSize:28, flexShrink:0 }}>{card.emoji}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                              <span style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#e8e8f0" }}>{card.title}</span>
                              {accType===card.id && <span style={{ width:22, height:22, borderRadius:"50%", background:"#F0B90B", display:"flex", alignItems:"center", justifyContent:"center", color:"#000", fontSize:12, fontWeight:900 }}>✓</span>}
                            </div>
                            <p style={{ fontSize:12.5, color:"#8a9bb8", margin:"0 0 10px", lineHeight:1.6 }}>{card.desc}</p>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                              {card.tags.map(t => <span key={t} style={{ padding:"2px 8px", borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", fontSize:10.5, color:"#8a9bb8" }}>{t}</span>)}
                            </div>
                            <p style={{ fontSize:11.5, fontWeight:600, color:card.nc, margin:0 }}>{card.note}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                    {errors.accType && <p style={{ ...S.err, marginBottom:10 }}>{errors.accType}</p>}
                    <button onClick={() => { if(!accType){setErrors({accType:"Please select an account type"});return;} setStep(2); }}
                      style={{ ...S.btnGold, marginTop:6 }}>Continue →</button>
                  </div>
                )}

                {/* STEP 2 */}
                {step===2 && (
                  <div className="fu">
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <Field label="First name" placeholder="Jane" value={firstName} onChange={setFN} required error={errors.fn} />
                      <Field label="Last name" placeholder="Doe" value={lastName} onChange={setLN} required error={errors.ln} />
                    </div>
                    <Field label="Email address" type="email" placeholder="jane@example.com" value={email} onChange={setEmail} required error={errors.email} />
                    <Field label="Phone number" type="tel" placeholder="+1 555 000 0000" value={phone} onChange={setPhone} hint="Optional — used for 2FA" />
                    <div style={{ marginBottom:14 }}>
                      <label style={S.label}>Country of residence <span style={{ color:"#F0B90B" }}>*</span></label>
                      <select value={country} onChange={e => setCountry(e.target.value)}
                        style={{ ...S.input, cursor:"pointer", color:country?"#e8e8f0":"#8a9bb8" }}>
                        <option value="">Select country (180+ supported)...</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.country && <span style={S.err}>{errors.country}</span>}
                    </div>
                    <Field label="Date of birth" type="date" value={dob} onChange={setDob} required error={errors.dob} hint="Must be 18+ to invest" />
                    {accType==="investor" && (
                      <div style={{ ...S.info, marginBottom:14 }}>
                        <span style={{ fontSize:16, flexShrink:0 }}>ℹ️</span>
                        <p style={{ fontSize:12, color:"#b0b0c8", margin:0, lineHeight:1.6 }}>You will complete KYC powered by <strong style={{ color:"#F0B90B" }}>Sumsub</strong> in Step 4. Required by EU AML regulations.</p>
                      </div>
                    )}
                    <div style={{ display:"flex", gap:10 }}>
                      <button onClick={() => setStep(1)} style={{ ...S.btnGhost, flex:1 }}>← Back</button>
                      <button onClick={() => { if(v2()) setStep(3); }} style={{ ...S.btnGold, flex:2 }}>Continue →</button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step===3 && (
                  <div className="fu">
                    <Field label="Create password" type="password" placeholder="Create a strong password" value={password} onChange={setPassword} required error={errors.pw} />
                    <PwStrength pw={password} />
                    <Field label="Confirm password" type="password" placeholder="Repeat your password" value={confirm} onChange={setConfirm} required error={errors.cf} />
                    <div style={{ padding:16, borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)", marginBottom:16 }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                        <p style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", margin:0 }}>Two-Factor Authentication</p>
                        <span style={{ padding:"2px 8px", borderRadius:20, background:"rgba(34,197,94,0.1)", color:"#22c55e", fontSize:10.5, fontWeight:700, border:"1px solid rgba(34,197,94,0.2)" }}>Recommended</span>
                      </div>
                      <p style={{ fontSize:12, color:"#8a9bb8", margin:"0 0 10px" }}>Set up after registration in security settings.</p>
                      <div style={{ display:"flex", gap:6 }}>
                        {["Google Authenticator","Authy","SMS OTP"].map(a => <span key={a} style={{ padding:"3px 8px", borderRadius:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", fontSize:10.5, color:"#8a9bb8" }}>{a}</span>)}
                      </div>
                    </div>

                    {/* WALLET BACKUP GUIDE */}
                    <div style={{ padding:16, borderRadius:14, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.05)", marginBottom:16 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                        <span style={{ fontSize:20 }}>🔐</span>
                        <p style={{ fontSize:13.5, fontWeight:700, color:"#F0B90B", margin:0 }}>Wallet Backup Guide</p>
                      </div>
                      <p style={{ fontSize:12, color:"#8a9bb8", margin:"0 0 10px", lineHeight:1.65 }}>
                        If you connect a Web3 wallet, protect your assets by following these steps:
                      </p>
                      {[
                        { icon:"📝", t:"Write it down", d:"Write your 12 or 24-word recovery phrase on physical paper. Never store it digitally or take a screenshot." },
                        { icon:"🔒", t:"Store securely", d:"Keep backups in a secure, fireproof location. Consider a safety deposit box for large holdings." },
                        { icon:"⚠️", t:"Never share it", d:"Your recovery phrase gives full access to your wallet. Nextoken will NEVER ask for it." },
                        { icon:"🚨", t:"Lost phrase = lost assets", d:"If you lose your recovery phrase, your crypto assets cannot be recovered by anyone — including us." },
                      ].map(item => (
                        <div key={item.t} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                          <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{item.icon}</span>
                          <div>
                            <p style={{ fontSize:12.5, fontWeight:700, color:"#e8e8f0", margin:"0 0 2px" }}>{item.t}</p>
                            <p style={{ fontSize:11.5, color:"#8a9bb8", margin:0, lineHeight:1.55 }}>{item.d}</p>
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop:10, padding:"8px 12px", borderRadius:8, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)" }}>
                        <p style={{ fontSize:12, color:"#f87171", fontWeight:600, margin:0 }}>
                          🛡 Nextoken will NEVER ask for your seed phrase, private key, or wallet password.
                        </p>
                      </div>
                    </div>
                    <Checkbox checked={agree} onChange={() => setAgree(!agree)}>
                      I accept the <Link href="/terms" style={{ color:"#F0B90B" }}>Terms of Service</Link>, <Link href="/privacy" style={{ color:"#F0B90B" }}>Privacy Policy</Link>, and <Link href="/risk" style={{ color:"#F0B90B" }}>Risk Disclosure</Link>. <span style={{ color:"#F0B90B" }}>*</span>
                    </Checkbox>
                    {errors.agree && <p style={{ ...S.err, marginBottom:10, marginLeft:30 }}>{errors.agree}</p>}
                    <Checkbox checked={marketing} onChange={() => setMkt(!marketing)}>
                      Send me updates about new investment opportunities. (Optional)
                    </Checkbox>
                    <div style={{ display:"flex", gap:10, marginTop:8 }}>
                      <button onClick={() => setStep(2)} style={{ ...S.btnGhost, flex:1 }}>← Back</button>
                      <button onClick={() => { if(v3()) { accType==="investor" ? setStep(4) : setStep(5); } }}
                        style={{ ...S.btnGold, flex:2 }}>
                        {accType==="investor" ? "Continue to KYC →" : "Create Account →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4 — KYC */}
                {step===4 && (
                  <div className="fu">
                    <div style={{ ...S.warn, marginBottom:16 }}>
                      <span style={{ fontSize:20, flexShrink:0 }}>🪪</span>
                      <div>
                        <p style={{ fontSize:13, fontWeight:700, color:"#f59e0b", margin:"0 0 4px" }}>Identity Verification Required</p>
                        <p style={{ fontSize:12, color:"#b0b0c8", margin:0, lineHeight:1.6 }}>All investors must verify identity via <strong style={{ color:"#F0B90B" }}>Sumsub</strong>. GDPR compliant. Your data is never stored on Nextoken servers.</p>
                      </div>
                    </div>

                    {kycStatus==="idle" && (
                      <>
                        <label style={S.label}>Select identity document <span style={{ color:"#F0B90B" }}>*</span></label>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
                          {[{id:"passport",l:"Passport",i:"🛂"},{id:"id_card",l:"National ID",i:"🪪"},{id:"drivers_license",l:"Driver License",i:"🚗"}].map(d => (
                            <button key={d.id} onClick={() => setDocType(d.id)}
                              style={{ padding:"14px 8px", borderRadius:12, border:"2px solid "+(docType===d.id?"#F0B90B":"rgba(255,255,255,0.08)"), background:docType===d.id?"rgba(240,185,11,0.08)":"rgba(255,255,255,0.02)", cursor:"pointer", textAlign:"center", fontFamily:"inherit", transition:"all 0.15s" }}>
                              <div style={{ fontSize:24, marginBottom:6 }}>{d.i}</div>
                              <div style={{ fontSize:11.5, fontWeight:600, color:"#e8e8f0" }}>{d.l}</div>
                            </button>
                          ))}
                        </div>
                        {docType && (
                          <>
                            <UploadBox label={docType==="passport"?"Passport — Photo page":"Document — Front side"} file={docFront} onFile={setDocFront} />
                            {docType!=="passport" && <UploadBox label="Document — Back side" file={docBack} onFile={setDocBack} />}
                            <UploadBox label="Selfie holding your document" file={selfie} onFile={setSelfie} />
                            <UploadBox label="Proof of address (recommended)" file={proofAddr} onFile={setProofAddr} />
                          </>
                        )}
                        <div style={{ padding:14, borderRadius:10, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)", marginBottom:16 }}>
                          <p style={{ fontSize:12, fontWeight:700, color:"#e8e8f0", margin:"0 0 8px" }}>📷 Requirements</p>
                          {["All four corners must be visible","Text must be sharp — no glare","Colour photos only","Max 10 MB per file"].map(t => (
                            <div key={t} style={{ display:"flex", gap:8, marginBottom:5 }}>
                              <span style={{ color:"#F0B90B", fontSize:11 }}>→</span>
                              <span style={{ fontSize:11.5, color:"#8a9bb8" }}>{t}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display:"flex", gap:10 }}>
                          <button onClick={() => setStep(3)} style={{ ...S.btnGhost, flex:1 }}>← Back</button>
                          <button onClick={submitKyc} disabled={!kycReady()}
                            style={{ ...S.btnGold, flex:2, opacity:kycReady()?1:0.35 }}>
                            Submit Verification →
                          </button>
                        </div>
                      </>
                    )}

                    {kycStatus==="uploading" && (
                      <div style={{ padding:"60px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
                        <div className="spin" style={{ width:56, height:56, borderRadius:"50%", border:"4px solid rgba(240,185,11,0.15)", borderTop:"4px solid #F0B90B" }} />
                        <p style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#e8e8f0", margin:0 }}>Uploading documents...</p>
                        <p style={{ fontSize:13, color:"#8a9bb8", margin:0 }}>Securely transmitting to Sumsub. Please wait.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 5 — Success */}
                {step===5 && (
                  <div className="fu">
                    <div style={{ textAlign:"center", marginBottom:24 }}>
                      <div style={{ width:80, height:80, borderRadius:"50%", border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 16px" }}>
                        {accType==="issuer" ? "🏢" : "⏳"}
                      </div>
                      <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:"#e8e8f0", margin:"0 0 8px" }}>
                        {accType==="issuer" ? "Account Created!" : "Verification Submitted!"}
                      </h1>
                      <p style={{ fontSize:14, color:"#8a9bb8", maxWidth:360, margin:"0 auto", lineHeight:1.7 }}>
                        {accType==="issuer"
                          ? "Welcome, " + firstName + "! Your issuer account is ready. Our team reviews KYB documents within 1-3 business days."
                          : "Thank you, " + firstName + "! Documents sent to Sumsub. Verification usually takes 5-15 minutes but may take up to 24 hours."}
                      </p>
                    </div>
                    <div style={{ border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:20, marginBottom:16 }}>
                      <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#8a9bb8", margin:"0 0 14px" }}>Verification Status</p>
                      {kycSteps.map(s => (
                        <div key={s.label} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                          <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, border:"1px solid", borderColor:s.done?"rgba(34,197,94,0.4)":s.active?"rgba(245,158,11,0.4)":"rgba(255,255,255,0.1)", background:s.done?"rgba(34,197,94,0.1)":s.active?"rgba(245,158,11,0.1)":"rgba(255,255,255,0.03)", color:s.done?"#22c55e":s.active?"#f59e0b":"#8a9bb8" }}>
                            {s.done?"✓":s.active?"…":"○"}
                          </div>
                          <p style={{ fontSize:13, margin:0, fontWeight:s.active?700:400, color:s.done?"#22c55e":s.active?"#f59e0b":"#8a9bb8" }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ ...S.info, marginBottom:16 }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>📧</span>
                      <p style={{ fontSize:12.5, color:"#b0b0c8", margin:0, lineHeight:1.6 }}>
                        Confirmation sent to <strong style={{ color:"#F0B90B" }}>{email || "your email"}</strong>. We will notify you once KYC is approved.
                      </p>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      <Link href="/markets" style={{ display:"block", textAlign:"center", padding:"13px 0", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, textDecoration:"none" }}>
                        Explore Markets
                      </Link>
                      <button onClick={() => { setMode("login"); reset(); }}
                        style={S.btnGhost}>
                        Sign In to Your Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer */}
          <div style={{ width:"100%", maxWidth:460, marginTop:32, paddingBottom:16 }}>
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:14, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:8 }}>
              <p style={{ fontSize:11, color:"#8a9bb8", margin:0 }}>2026 Nextoken Capital UAB · Lithuania</p>
              <div style={{ display:"flex", gap:16 }}>
                {[["Terms","/terms"],["Privacy","/privacy"],["AML","/aml"]].map(([l,h]) => (
                  <Link key={l} href={h} style={{ fontSize:11, color:"#8a9bb8", textDecoration:"none" }}>{l}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
