"use client";

import { useState } from "react";
import Link from "next/link";

type Mode      = "login" | "register";
type Step      = 1 | 2 | 3 | 4 | 5;
type AccType   = "investor" | "issuer" | null;
type DocType   = "passport" | "id_card" | "drivers_license" | null;
type KycStatus = "idle" | "uploading" | "submitted" | "approved";

/* ─── tiny icon components ─── */
function Check() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function Eye({ open }: { open: boolean }) {
  return open ? (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
function Upload() {
  return (
    <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
    </svg>
  );
}

/* ─── Field ─── */
function Field({ label, type="text", placeholder, value, onChange, required=false, hint, error }: {
  label:string; type?:string; placeholder?:string; value:string;
  onChange:(v:string)=>void; required?:boolean; hint?:string; error?:string;
}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:12, fontWeight:600, color:"#b0b0c8", textTransform:"uppercase", letterSpacing:"0.05em" }}>
        {label} {required && <span style={{ color:"#d4af37" }}>*</span>}
      </label>
      <div style={{ position:"relative" as const }}>
        <input
          type={isPw ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width:"100%", padding:"12px 16px", borderRadius:10,
            background:"#0d0d14", border:`1.5px solid ${error ? "#ef4444" : "rgba(255,255,255,0.10)"}`,
            color:"#e8e8f0", fontSize:14, outline:"none", boxSizing:"border-box",
            fontFamily:"inherit", transition:"border-color 0.15s",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#d4af37"; }}
          onBlur={(e)  => { e.target.style.borderColor = error ? "#ef4444" : "rgba(255,255,255,0.10)"; }}
        />
        {isPw && (
          <button type="button" onClick={() => setShow(!show)}
            style={{ position:"absolute" as const, right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#7a7a96", cursor:"pointer", display:"flex" }}>
            <Eye open={show} />
          </button>
        )}
      </div>
      {hint  && !error && <p style={{ fontSize:11, color:"#7a7a96", margin:0 }}>{hint}</p>}
      {error && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>⚠ {error}</p>}
    </div>
  );
}

/* ─── Select ─── */
function Sel({ label, value, onChange, options, required, error }: {
  label:string; value:string; onChange:(v:string)=>void;
  options:{value:string;label:string}[]; required?:boolean; error?:string;
}) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:12, fontWeight:600, color:"#b0b0c8", textTransform:"uppercase", letterSpacing:"0.05em" }}>
        {label} {required && <span style={{ color:"#d4af37" }}>*</span>}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width:"100%", padding:"12px 16px", borderRadius:10, background:"#0d0d14", border:`1.5px solid ${error ? "#ef4444" : "rgba(255,255,255,0.10)"}`, color: value ? "#e8e8f0" : "#7a7a96", fontSize:14, outline:"none", cursor:"pointer", fontFamily:"inherit" }}>
        <option value="" disabled style={{ color:"#7a7a96" }}>Select country...</option>
        {options.map((o) => <option key={o.value} value={o.value} style={{ background:"#0d0d14" }}>{o.label}</option>)}
      </select>
      {error && <p style={{ fontSize:11, color:"#ef4444", margin:0 }}>⚠ {error}</p>}
    </div>
  );
}

/* ─── Password strength ─── */
function PwStrength({ pw }: { pw:string }) {
  const checks = [
    { label:"8+ chars",  ok: pw.length >= 8 },
    { label:"Uppercase", ok: /[A-Z]/.test(pw) },
    { label:"Number",    ok: /\d/.test(pw) },
    { label:"Special",   ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["","#ef4444","#f97316","#eab308","#22c55e"];
  const labels = ["","Weak","Fair","Good","Strong"];
  if (!pw) return null;
  return (
    <div style={{ marginTop:6 }}>
      <div style={{ display:"flex", gap:4, marginBottom:6 }}>
        {[1,2,3,4].map((i) => (
          <div key={i} style={{ height:4, flex:1, borderRadius:4, background: i<=score ? colors[score] : "rgba(255,255,255,0.08)", transition:"background 0.3s" }} />
        ))}
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 16px", alignItems:"center" }}>
        {checks.map((c) => (
          <span key={c.label} style={{ fontSize:11, color: c.ok ? "#22c55e" : "#7a7a96" }}>
            {c.ok ? "✓" : "○"} {c.label}
          </span>
        ))}
        <span style={{ fontSize:11, fontWeight:700, marginLeft:"auto", color: score>=3?"#22c55e":score===2?"#eab308":"#ef4444" }}>{labels[score]}</span>
      </div>
    </div>
  );
}

/* ─── Step progress ─── */
function StepBar({ step, total }: { step:number; total:number }) {
  const labels = ["Account Type","Personal Info","Security","KYC Verify","Complete"];
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", flex: i<total-1 ? 1 : "none" }}>
            <div style={{
              width:32, height:32, borderRadius:"50%", flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:700, transition:"all 0.3s",
              border: `2px solid ${i+1<=step ? "#d4af37" : "rgba(255,255,255,0.15)"}`,
              background: i+1<step ? "#d4af37" : "transparent",
              color: i+1<step ? "#000" : i+1===step ? "#d4af37" : "#7a7a96",
            }}>
              {i+1<step ? <Check /> : i+1}
            </div>
            {i < total-1 && (
              <div style={{ flex:1, height:2, margin:"0 4px", background: i+1<step ? "#d4af37" : "rgba(255,255,255,0.08)", transition:"background 0.5s" }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop:10 }}>
        <p style={{ fontSize:11, color:"#7a7a96", margin:"0 0 2px" }}>Step {step} of {total}</p>
        <p style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", margin:0 }}>{labels[step-1]}</p>
      </div>
    </div>
  );
}

/* ─── Upload Box ─── */
function UploadBox({ label, hint, file, onFile }: { label:string; hint:string; file:File|null; onFile:(f:File)=>void }) {
  const ref = { current: null as HTMLInputElement|null };
  return (
    <div>
      <p style={{ fontSize:12, fontWeight:600, color:"#b0b0c8", marginBottom:6 }}>{label}</p>
      <div onClick={() => (document.getElementById("upload-"+label) as HTMLInputElement)?.click()}
        style={{ border:`2px dashed ${file ? "#d4af37" : "rgba(255,255,255,0.12)"}`, borderRadius:12, padding:"20px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer", background: file ? "rgba(212,175,55,0.05)" : "rgba(255,255,255,0.02)", transition:"all 0.15s" }}>
        {file ? (
          <>
            <div style={{ width:36,height:36,borderRadius:"50%",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",display:"flex",alignItems:"center",justifyContent:"center",color:"#22c55e",fontSize:18 }}>✓</div>
            <p style={{ fontSize:12, color:"#22c55e", margin:0, fontWeight:600 }}>{file.name}</p>
            <p style={{ fontSize:11, color:"#7a7a96", margin:0 }}>Click to replace</p>
          </>
        ) : (
          <>
            <div style={{ color:"#7a7a96" }}><Upload /></div>
            <p style={{ fontSize:13, color:"#b0b0c8", margin:0, textAlign:"center" }}>{hint}</p>
            <p style={{ fontSize:11, color:"#7a7a96", margin:0 }}>JPG, PNG or PDF · Max 10 MB</p>
          </>
        )}
        <input id={"upload-"+label} type="file" accept="image/*,.pdf" style={{ display:"none" }}
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </div>
    </div>
  );
}

/* ─── Checkbox ─── */
function Checkbox({ checked, onChange, label }: { checked:boolean; onChange:()=>void; label:React.ReactNode }) {
  return (
    <label style={{ display:"flex", alignItems:"flex-start", gap:12, cursor:"pointer" }}>
      <div onClick={onChange} style={{ width:20, height:20, borderRadius:5, flexShrink:0, marginTop:2, border:`2px solid ${checked ? "#d4af37" : "rgba(255,255,255,0.2)"}`, background: checked ? "#d4af37" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", color:"#000", transition:"all 0.15s", cursor:"pointer" }}>
        {checked && <Check />}
      </div>
      <span style={{ fontSize:12.5, color:"#b0b0c8", lineHeight:1.6 }}>{label}</span>
    </label>
  );
}

const COUNTRIES = [
  {value:"LT",label:"Lithuania"},{value:"EE",label:"Estonia"},{value:"LV",label:"Latvia"},
  {value:"DE",label:"Germany"},{value:"FR",label:"France"},{value:"NL",label:"Netherlands"},
  {value:"PL",label:"Poland"},{value:"SE",label:"Sweden"},{value:"FI",label:"Finland"},
  {value:"DK",label:"Denmark"},{value:"NO",label:"Norway"},{value:"CH",label:"Switzerland"},
  {value:"AT",label:"Austria"},{value:"BE",label:"Belgium"},{value:"IE",label:"Ireland"},
  {value:"PT",label:"Portugal"},{value:"ES",label:"Spain"},{value:"IT",label:"Italy"},
  {value:"CZ",label:"Czech Republic"},{value:"HU",label:"Hungary"},{value:"RO",label:"Romania"},
  {value:"GR",label:"Greece"},{value:"GB",label:"United Kingdom"},{value:"US",label:"United States"},
  {value:"CA",label:"Canada"},{value:"AU",label:"Australia"},{value:"SG",label:"Singapore"},
  {value:"AE",label:"UAE"},{value:"IN",label:"India"},
];

const S = {
  page:    { minHeight:"100vh", background:"#050508", fontFamily:"'DM Sans',system-ui,sans-serif", color:"#e8e8f0" },
  nav:     { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:64, background:"rgba(5,5,8,0.95)", borderBottom:"1px solid rgba(255,255,255,0.08)", position:"sticky" as const, top:0, zIndex:100, backdropFilter:"blur(20px)" },
  body:    { display:"flex", minHeight:"calc(100vh - 64px)" },
  left:    { width:400, flexShrink:0, background:"#0d0d14", borderRight:"1px solid rgba(255,255,255,0.08)", padding:48, display:"flex", flexDirection:"column" as const, justifyContent:"space-between", position:"relative" as const, overflow:"hidden" },
  right:   { flex:1, display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"flex-start", padding:"40px 24px", overflowY:"auto" as const },
  panel:   { width:"100%", maxWidth:460 },
  card:    { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:24, marginBottom:12, cursor:"pointer", textAlign:"left" as const, width:"100%", transition:"all 0.15s" },
  input:   { width:"100%", padding:"12px 16px", borderRadius:10, background:"#0d0d14", border:"1.5px solid rgba(255,255,255,0.10)", color:"#e8e8f0", fontSize:14, outline:"none", boxSizing:"border-box" as const, fontFamily:"inherit" },
  btnGold: { width:"100%", padding:"13px 0", borderRadius:10, background:"#d4af37", color:"#000", fontSize:14, fontWeight:700, border:"none", cursor:"pointer", transition:"opacity 0.15s", fontFamily:"inherit" },
  btnGhost:{ width:"100%", padding:"13px 0", borderRadius:10, background:"transparent", color:"#b0b0c8", fontSize:13, fontWeight:500, border:"1px solid rgba(255,255,255,0.10)", cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" },
  badge:   { display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:20, border:"1px solid rgba(212,175,55,0.3)", background:"rgba(212,175,55,0.08)", color:"#d4af37", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase" as const },
  tag:     { padding:"3px 8px", borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", fontSize:10.5, color:"#7a7a96" },
  info:    { padding:"14px 16px", borderRadius:12, border:"1px solid rgba(212,175,55,0.2)", background:"rgba(212,175,55,0.05)", display:"flex", gap:12, alignItems:"flex-start" },
  err:     { padding:"12px 16px", borderRadius:10, border:"1px solid rgba(239,68,68,0.25)", background:"rgba(239,68,68,0.08)", color:"#f87171", fontSize:13 },
  warn:    { padding:"14px 16px", borderRadius:12, border:"1px solid rgba(245,158,11,0.25)", background:"rgba(245,158,11,0.06)", display:"flex", gap:12 },
  success: { padding:"14px 16px", borderRadius:12, border:"1px solid rgba(34,197,94,0.25)", background:"rgba(34,197,94,0.06)", display:"flex", gap:12 },
};

export default function RegisterPage() {
  const [mode, setMode]             = useState<Mode>("register");
  const [step, setStep]             = useState<Step>(1);
  const [accType, setAccType]       = useState<AccType>(null);

  /* personal info */
  const [firstName, setFirstName]   = useState("");
  const [lastName,  setLastName]    = useState("");
  const [email,     setEmail]       = useState("");
  const [phone,     setPhone]       = useState("");
  const [country,   setCountry]     = useState("");
  const [dob,       setDob]         = useState("");

  /* security */
  const [password,  setPassword]    = useState("");
  const [confirm,   setConfirm]     = useState("");
  const [agree,     setAgree]       = useState(false);
  const [marketing, setMarketing]   = useState(false);

  /* KYC */
  const [docType,   setDocType]     = useState<DocType>(null);
  const [docFront,  setDocFront]    = useState<File|null>(null);
  const [docBack,   setDocBack]     = useState<File|null>(null);
  const [selfie,    setSelfie]      = useState<File|null>(null);
  const [proofAddr, setProofAddr]   = useState<File|null>(null);
  const [kycStatus, setKycStatus]   = useState<KycStatus>("idle");

  /* login */
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading,  setLoginLoading]  = useState(false);
  const [loginError,    setLoginError]    = useState("");
  const [loggedIn,      setLoggedIn]      = useState(false);
  const [kycApproved,   setKycApproved]   = useState(false);

  const [errors, setErrors] = useState<Record<string,string>>({});

  /* ── validators ── */
  function validateStep1() {
    if (!accType) { setErrors({ accType:"Please select an account type to continue." }); return false; }
    setErrors({}); return true;
  }
  function validateStep2() {
    const e: Record<string,string> = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim())  e.lastName  = "Last name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email address required";
    if (!country)          e.country   = "Please select your country";
    if (!dob)              e.dob       = "Date of birth is required";
    setErrors(e); return Object.keys(e).length === 0;
  }
  function validateStep3() {
    const e: Record<string,string> = {};
    if (password.length < 8)  e.password = "Password must be at least 8 characters";
    if (password !== confirm)  e.confirm  = "Passwords do not match";
    if (!agree)                e.agree    = "You must accept the Terms of Service to continue";
    setErrors(e); return Object.keys(e).length === 0;
  }
  function kycReady() {
    if (!docType || !docFront || !selfie) return false;
    if (docType !== "passport" && !docBack) return false;
    return true;
  }

  /* ── KYC submit ── */
  async function submitKyc() {
    setKycStatus("uploading");
    await new Promise((r) => setTimeout(r, 2400));
    setKycStatus("submitted");
    setTimeout(() => setStep(5), 700);
  }

  /* ── Login ── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail.trim())    { setLoginError("Email address is required."); return; }
    if (!loginPassword.trim()) { setLoginError("Password is required."); return; }
    if (!/\S+@\S+\.\S+/.test(loginEmail)) { setLoginError("Please enter a valid email address."); return; }
    setLoginLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoginLoading(false);
    /* demo: any login succeeds but KYC not approved */
    setLoggedIn(true);
    setLoginError("");
  }

  function resetAll() {
    setStep(1); setAccType(null); setKycStatus("idle");
    setDocType(null); setDocFront(null); setDocBack(null);
    setSelfie(null); setProofAddr(null); setErrors({});
    setPassword(""); setConfirm(""); setAgree(false);
  }

  /* ── LOGGED IN STATE (no KYC) ── */
  if (loggedIn) {
    return (
      <div style={S.page}>
        <nav style={S.nav}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontWeight:800, fontSize:19, color:"#d4af37", letterSpacing:2 }}>NXT</span>
            <div style={{ width:1, height:22, background:"rgba(212,175,55,0.25)" }} />
            <div>
              <div style={{ fontSize:12.5, fontWeight:700, letterSpacing:"0.2em", color:"#d4af37" }}>NEXTOKEN</div>
              <div style={{ fontSize:8.5, letterSpacing:"0.2em", color:"#7a7a96", textTransform:"uppercase" }}>CAPITAL</div>
            </div>
          </div>
          <button onClick={() => setLoggedIn(false)} style={{ padding:"6px 16px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#b0b0c8", fontSize:13, cursor:"pointer" }}>Log Out</button>
        </nav>
        <div style={{ maxWidth:600, margin:"60px auto", padding:"0 24px" }}>
          <div style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:36 }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>👋</div>
              <h2 style={{ fontSize:24, fontWeight:800, color:"#e8e8f0", margin:"0 0 8px" }}>Welcome back!</h2>
              <p style={{ color:"#7a7a96", fontSize:14, margin:0 }}>You are logged in but your account has limited access.</p>
            </div>

            {/* KYC Warning Banner */}
            <div style={{ ...S.warn, marginBottom:20, borderRadius:14 }}>
              <span style={{ fontSize:20, flexShrink:0 }}>⚠️</span>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:"#f59e0b", margin:"0 0 4px" }}>KYC Verification Required</p>
                <p style={{ fontSize:12.5, color:"#b0b0c8", margin:0, lineHeight:1.6 }}>
                  Your identity has not been verified. You can browse the platform but <strong style={{ color:"#f59e0b" }}>cannot invest in assets or register assets for issuance</strong> until KYC is approved.
                </p>
              </div>
            </div>

            {/* What you can/cannot do */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
              <div style={{ background:"rgba(34,197,94,0.05)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:12, padding:16 }}>
                <p style={{ fontSize:11, fontWeight:700, color:"#22c55e", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 10px" }}>✓ You Can</p>
                {["Browse markets","View listings","Read bond details","Explore equity IPOs","Use the chatbot"].map((item) => (
                  <div key={item} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ color:"#22c55e", fontSize:12 }}>✓</span>
                    <span style={{ fontSize:12.5, color:"#b0b0c8" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:12, padding:16 }}>
                <p style={{ fontSize:11, fontWeight:700, color:"#ef4444", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 10px" }}>✗ Locked</p>
                {["Invest in assets","Buy bonds","Participate in IPOs","Register your assets","Tokenize property"].map((item) => (
                  <div key={item} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ color:"#ef4444", fontSize:12 }}>✗</span>
                    <span style={{ fontSize:12.5, color:"#b0b0c8" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button onClick={() => { setLoggedIn(false); setMode("register"); setStep(4); }}
              style={{ ...S.btnGold, marginBottom:10, borderRadius:12 }}>
              🪪 Complete KYC Verification Now
            </button>
            <a href="/" style={{ display:"block", textAlign:"center", padding:"13px 0", borderRadius:12, border:"1px solid rgba(255,255,255,0.10)", color:"#b0b0c8", fontSize:13, textDecoration:"none" }}>
              Browse Markets (Limited Access)
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .3s ease both; }
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse { animation: pulseDot 2s infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .spin { animation: spin 1s linear infinite; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor:pointer; }
        select option { background: #0d0d14; }
        button:hover { opacity: 0.88; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050508; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius:3px; }
      `}</style>

      {/* NAVBAR */}
      <nav style={S.nav}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
          <span style={{ fontWeight:800, fontSize:19, color:"#d4af37", letterSpacing:2, fontFamily:"Syne,sans-serif" }}>NXT</span>
          <div style={{ width:1, height:22, background:"rgba(212,175,55,0.25)" }} />
          <div>
            <div style={{ fontSize:12.5, fontWeight:700, letterSpacing:"0.2em", color:"#d4af37", fontFamily:"Syne,sans-serif" }}>NEXTOKEN</div>
            <div style={{ fontSize:8.5, letterSpacing:"0.2em", color:"#7a7a96", textTransform:"uppercase" }}>CAPITAL</div>
          </div>
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:13, color:"#7a7a96" }}>{mode==="login" ? "Need an account?" : "Already registered?"}</span>
          <button onClick={() => { setMode(mode==="login"?"register":"login"); setErrors({}); resetAll(); }}
            style={{ padding:"7px 18px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#b0b0c8", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            {mode==="login" ? "Sign Up" : "Log In"}
          </button>
        </div>
      </nav>

      <div style={S.body}>

        {/* LEFT PANEL */}
        <div style={{ ...S.left, display: typeof window !== "undefined" && window.innerWidth < 1024 ? "none" : "flex" }}>
          <div style={{ position:"absolute" as const, inset:0, background:"radial-gradient(ellipse 500px 600px at -80px 280px,rgba(212,175,55,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"relative" as const, zIndex:1 }}>
            <div style={S.badge} className="pulse">
              <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#d4af37", display:"inline-block" }} />
              Regulated Platform · EU Licensed
            </div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:30, fontWeight:800, color:"#e8e8f0", lineHeight:1.2, margin:"24px 0 14px" }}>
              Join the Future of<br /><span style={{ color:"#d4af37" }}>Capital Markets</span>
            </h2>
            <p style={{ fontSize:13.5, color:"#7a7a96", lineHeight:1.75, marginBottom:32 }}>
              Access tokenized real-world assets, blockchain IPOs, and digital bonds — regulated, verified, and built for modern investors.
            </p>
            {[
              { icon:"🔒", title:"Regulated & Compliant",    desc:"Licensed under Bank of Lithuania. ERC-3643 security token standard." },
              { icon:"🪪", title:"KYC / AML Verified",       desc:"Third-party identity verification by Sumsub required for all investors." },
              { icon:"🌍", title:"30+ Countries",             desc:"Multi-currency and EU-passported regulatory structure." },
              { icon:"📈", title:"Institutional-Grade Deals", desc:"Access opportunities previously reserved for professional investors." },
            ].map((f) => (
              <div key={f.title} style={{ display:"flex", gap:14, marginBottom:20 }}>
                <span style={{ fontSize:20, flexShrink:0, marginTop:2 }}>{f.icon}</span>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", margin:"0 0 3px" }}>{f.title}</p>
                  <p style={{ fontSize:12, color:"#7a7a96", margin:0, lineHeight:1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ position:"relative" as const, zIndex:1, borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:20, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
            {[{val:"12,400+",label:"Investors"},{val:"€140M+",label:"Deployed"},{val:"30+",label:"Countries"}].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:800, color:"#d4af37" }}>{s.val}</div>
                <div style={{ fontSize:11, color:"#7a7a96" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={S.right}>
          <div style={S.panel}>

            {/* ══ LOGIN ══ */}
            {mode==="login" && (
              <div className="fade-up">
                <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, color:"#e8e8f0", margin:"0 0 6px" }}>Welcome back</h1>
                <p style={{ fontSize:14, color:"#7a7a96", marginBottom:28 }}>Sign in to your Nextoken Capital account.</p>

                {/* Social buttons */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                  <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", color:"#b0b0c8", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                  </button>
                  <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", borderRadius:10, border:"1px solid rgba(212,175,55,0.3)", background:"rgba(212,175,55,0.08)", color:"#d4af37", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                    🔗 Connect Wallet
                  </button>
                </div>

                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
                  <span style={{ fontSize:11.5, color:"#7a7a96" }}>or continue with email</span>
                  <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
                </div>

                <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <Field label="Email address" type="email" placeholder="you@example.com" value={loginEmail} onChange={setLoginEmail} required />
                  <Field label="Password" type="password" placeholder="••••••••" value={loginPassword} onChange={setLoginPassword} required />
                  <div style={{ textAlign:"right" }}>
                    <a href="/forgot-password" style={{ fontSize:12.5, color:"#d4af37", textDecoration:"none" }}>Forgot password?</a>
                  </div>
                  {loginError && <div style={S.err}>{loginError}</div>}
                  <button type="submit" disabled={loginLoading}
                    style={{ ...S.btnGold, opacity: loginLoading ? 0.6 : 1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, borderRadius:10 }}>
                    {loginLoading
                      ? <><div className="spin" style={{ width:16, height:16, border:"2px solid rgba(0,0,0,0.3)", borderTop:"2px solid #000", borderRadius:"50%" }} /> Signing in...</>
                      : "Sign In"}
                  </button>
                </form>

                <p style={{ textAlign:"center", fontSize:13, color:"#7a7a96", marginTop:20 }}>
                  New to Nextoken?{" "}
                  <button onClick={() => { setMode("register"); resetAll(); }}
                    style={{ color:"#d4af37", fontWeight:600, background:"none", border:"none", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
                    Create an account →
                  </button>
                </p>

                {/* Security note */}
                <div style={{ marginTop:24, padding:16, borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)", display:"flex", gap:12, alignItems:"flex-start" }}>
                  <span style={{ fontSize:18 }}>🛡</span>
                  <div>
                    <p style={{ fontSize:12.5, fontWeight:700, color:"#e8e8f0", margin:"0 0 3px" }}>Secure & Regulated</p>
                    <p style={{ fontSize:11.5, color:"#7a7a96", margin:0, lineHeight:1.6 }}>End-to-end encrypted. Supervised by the Bank of Lithuania. Your data is never sold.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ══ REGISTER ══ */}
            {mode==="register" && (
              <div className="fade-up">
                {step < 5 && (
                  <>
                    <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:"#e8e8f0", margin:"0 0 4px" }}>Create your account</h1>
                    <p style={{ fontSize:13, color:"#7a7a96", marginBottom:24 }}>
                      Already registered?{" "}
                      <button onClick={() => { setMode("login"); setErrors({}); }}
                        style={{ color:"#d4af37", fontWeight:600, background:"none", border:"none", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
                        Sign in here
                      </button>
                    </p>
                    <StepBar step={step} total={5} />
                  </>
                )}

                {/* ── STEP 1: Account Type ── */}
                {step===1 && (
                  <div className="fade-up">
                    <p style={{ fontSize:14, color:"#b0b0c8", marginBottom:16 }}>How will you use Nextoken Capital?</p>
                    {([
                      { id:"investor" as AccType, emoji:"📈", title:"Investor",
                        desc:"Browse and invest in tokenized bonds, equity, real estate, and blockchain IPOs.",
                        tags:["Markets","Bonds","Equity & IPO","Secondary Trading"],
                        note:"🪪 KYC identity verification required", noteColor:"#f59e0b" },
                      { id:"issuer" as AccType, emoji:"🏢", title:"Issuer / Company",
                        desc:"Tokenize your assets, issue bonds or equity, and raise capital from global investors.",
                        tags:["Tokenize","Bond Issuance","Equity IPO","Cap Table"],
                        note:"📋 Corporate KYB verification required", noteColor:"#7a7a96" },
                    ]).map((card) => (
                      <button key={card.id as string} onClick={() => { setAccType(card.id); setErrors({}); }}
                        style={{ ...S.card, border:`2px solid ${accType===card.id ? "#d4af37" : "rgba(255,255,255,0.08)"}`, background: accType===card.id ? "rgba(212,175,55,0.07)" : "#0d0d14", marginBottom:12 }}>
                        <div style={{ display:"flex", alignItems:"flex-start", gap:16 }}>
                          <span style={{ fontSize:30, flexShrink:0 }}>{card.emoji}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                              <span style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#e8e8f0" }}>{card.title}</span>
                              {accType===card.id && (
                                <span style={{ width:22, height:22, borderRadius:"50%", background:"#d4af37", display:"flex", alignItems:"center", justifyContent:"center", color:"#000", flexShrink:0 }}><Check /></span>
                              )}
                            </div>
                            <p style={{ fontSize:12.5, color:"#7a7a96", margin:"0 0 10px", lineHeight:1.6 }}>{card.desc}</p>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                              {card.tags.map((t) => <span key={t} style={S.tag}>{t}</span>)}
                            </div>
                            <p style={{ fontSize:11.5, fontWeight:600, color:card.noteColor, margin:0 }}>{card.note}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                    {errors.accType && <div style={{ ...S.err, marginBottom:12 }}>{errors.accType}</div>}
                    <button onClick={() => { if (validateStep1()) setStep(2); }}
                      style={{ ...S.btnGold, borderRadius:10, marginTop:4 }}>
                      Continue →
                    </button>
                  </div>
                )}

                {/* ── STEP 2: Personal Info ── */}
                {step===2 && (
                  <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <Field label="First name" placeholder="Jane" value={firstName} onChange={setFirstName} required error={errors.firstName} />
                      <Field label="Last name"  placeholder="Doe"  value={lastName}  onChange={setLastName}  required error={errors.lastName} />
                    </div>
                    <Field label="Email address" type="email" placeholder="jane@example.com" value={email} onChange={setEmail} required error={errors.email} />
                    <Field label="Phone number" type="tel" placeholder="+370 600 00000" value={phone} onChange={setPhone} hint="Optional — used for 2FA" />
                    <Sel label="Country of residence" value={country} onChange={setCountry} options={COUNTRIES} required error={errors.country} />
                    <Field label="Date of birth" type="date" value={dob} onChange={setDob} required error={errors.dob} hint="You must be 18 or older to invest" />
                    {accType==="investor" && (
                      <div style={S.info}>
                        <span style={{ fontSize:16, flexShrink:0 }}>ℹ️</span>
                        <p style={{ fontSize:12, color:"#b0b0c8", margin:0, lineHeight:1.6 }}>
                          As an investor you will complete identity verification (KYC) powered by <strong style={{ color:"#d4af37" }}>Sumsub</strong> in Step 4. Required by EU AML regulations.
                        </p>
                      </div>
                    )}
                    <div style={{ display:"flex", gap:10, marginTop:4 }}>
                      <button onClick={() => setStep(1)} style={{ ...S.btnGhost, flex:1, borderRadius:10 }}>← Back</button>
                      <button onClick={() => { if (validateStep2()) setStep(3); }} style={{ ...S.btnGold, flex:2, borderRadius:10 }}>Continue →</button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Security ── */}
                {step===3 && (
                  <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <Field label="Create password" type="password" placeholder="Create a strong password" value={password} onChange={setPassword} required error={errors.password} />
                    <PwStrength pw={password} />
                    <Field label="Confirm password" type="password" placeholder="Repeat your password" value={confirm} onChange={setConfirm} required error={errors.confirm} />

                    <div style={{ padding:16, borderRadius:12, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                        <p style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", margin:0 }}>Two-Factor Authentication (2FA)</p>
                        <span style={{ padding:"2px 8px", borderRadius:20, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:10.5, fontWeight:700 }}>Recommended</span>
                      </div>
                      <p style={{ fontSize:12, color:"#7a7a96", margin:"0 0 10px" }}>Set up in account security settings after registration.</p>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {["Google Authenticator","Authy","SMS OTP"].map((a) => (
                          <span key={a} style={{ padding:"4px 10px", borderRadius:6, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", fontSize:10.5, color:"#7a7a96" }}>{a}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                      <Checkbox checked={agree} onChange={() => setAgree(!agree)} label={
                        <span>I accept the <a href="/terms" style={{ color:"#d4af37" }}>Terms of Service</a>, <a href="/privacy" style={{ color:"#d4af37" }}>Privacy Policy</a>, and <a href="/risk" style={{ color:"#d4af37" }}>Risk Disclosure</a>. <span style={{ color:"#d4af37" }}>*</span></span>
                      } />
                      {errors.agree && <p style={{ fontSize:11, color:"#ef4444", margin:"0 0 0 32px" }}>⚠ {errors.agree}</p>}
                      <Checkbox checked={marketing} onChange={() => setMarketing(!marketing)} label="Send me updates about new investment opportunities. (Optional)" />
                    </div>

                    <div style={{ display:"flex", gap:10, marginTop:4 }}>
                      <button onClick={() => setStep(2)} style={{ ...S.btnGhost, flex:1, borderRadius:10 }}>← Back</button>
                      <button onClick={() => { if (validateStep3()) { accType==="investor" ? setStep(4) : setStep(5); } }}
                        style={{ ...S.btnGold, flex:2, borderRadius:10 }}>
                        {accType==="investor" ? "Continue to KYC →" : "Create Account →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: KYC ── */}
                {step===4 && (
                  <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    <div style={S.warn}>
                      <span style={{ fontSize:20, flexShrink:0 }}>🪪</span>
                      <div>
                        <p style={{ fontSize:13, fontWeight:700, color:"#f59e0b", margin:"0 0 4px" }}>Identity Verification Required</p>
                        <p style={{ fontSize:12, color:"#b0b0c8", margin:0, lineHeight:1.6 }}>
                          All investors must verify identity under EU AML/KYC regulations. Handled securely by <strong style={{ color:"#d4af37" }}>Sumsub</strong>. Your data is never stored on Nextoken servers.
                        </p>
                      </div>
                    </div>

                    {kycStatus==="idle" && (
                      <>
                        {/* Doc type selector */}
                        <div>
                          <p style={{ fontSize:12, fontWeight:600, color:"#b0b0c8", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>Select identity document <span style={{ color:"#d4af37" }}>*</span></p>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                            {([
                              {id:"passport",        label:"Passport",        icon:"🛂"},
                              {id:"id_card",         label:"National ID",      icon:"🪪"},
                              {id:"drivers_license", label:"Driver License",   icon:"🚗"},
                            ] as {id:DocType,label:string,icon:string}[]).map((d) => (
                              <button key={d.id as string} onClick={() => setDocType(d.id)}
                                style={{ padding:"14px 8px", borderRadius:12, border:`2px solid ${docType===d.id ? "#d4af37" : "rgba(255,255,255,0.08)"}`, background: docType===d.id ? "rgba(212,175,55,0.10)" : "rgba(255,255,255,0.02)", cursor:"pointer", textAlign:"center", fontFamily:"inherit", transition:"all 0.15s" }}>
                                <div style={{ fontSize:24, marginBottom:6 }}>{d.icon}</div>
                                <div style={{ fontSize:11.5, fontWeight:600, color:"#e8e8f0" }}>{d.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {docType && (
                          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                            <UploadBox label={docType==="passport" ? "Passport — Photo page" : "Document — Front side"} hint="Drag & drop or click to upload" file={docFront} onFile={setDocFront} />
                            {docType!=="passport" && <UploadBox label="Document — Back side" hint="Drag & drop or click to upload" file={docBack} onFile={setDocBack} />}
                            <UploadBox label="Selfie holding your document" hint="Hold document next to your face — clear and well-lit" file={selfie} onFile={setSelfie} />
                            <UploadBox label="Proof of address (recommended)" hint="Bank statement or utility bill — dated within 3 months" file={proofAddr} onFile={setProofAddr} />
                          </div>
                        )}

                        <div style={{ padding:16, borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)" }}>
                          <p style={{ fontSize:12.5, fontWeight:700, color:"#e8e8f0", margin:"0 0 10px" }}>📷 Photo requirements</p>
                          {["All four corners of the document must be visible","Text must be sharp and legible — no glare or blur","Colour photos only — black and white not accepted","Maximum file size 10 MB per upload"].map((t) => (
                            <div key={t} style={{ display:"flex", gap:8, marginBottom:6 }}>
                              <span style={{ color:"#d4af37", flexShrink:0, marginTop:1 }}>→</span>
                              <span style={{ fontSize:11.5, color:"#7a7a96" }}>{t}</span>
                            </div>
                          ))}
                        </div>

                        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)" }}>
                          <span style={{ fontSize:18 }}>🛡</span>
                          <p style={{ fontSize:11.5, color:"#7a7a96", margin:0, lineHeight:1.5 }}>
                            Documents processed securely by <strong style={{ color:"#b0b0c8" }}>Sumsub</strong>. Never stored on Nextoken servers. GDPR compliant.
                          </p>
                        </div>

                        <div style={{ display:"flex", gap:10 }}>
                          <button onClick={() => setStep(3)} style={{ ...S.btnGhost, flex:1, borderRadius:10 }}>← Back</button>
                          <button onClick={submitKyc} disabled={!kycReady()}
                            style={{ ...S.btnGold, flex:2, borderRadius:10, opacity: kycReady() ? 1 : 0.35 }}>
                            Submit Verification →
                          </button>
                        </div>
                      </>
                    )}

                    {kycStatus==="uploading" && (
                      <div style={{ padding:"60px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:18 }}>
                        <div className="spin" style={{ width:56, height:56, borderRadius:"50%", border:"4px solid rgba(212,175,55,0.15)", borderTop:"4px solid #d4af37" }} />
                        <div style={{ textAlign:"center" }}>
                          <p style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#e8e8f0", margin:"0 0 6px" }}>Uploading documents...</p>
                          <p style={{ fontSize:13, color:"#7a7a96", margin:0 }}>Securely transmitting to Sumsub. Please wait.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 5: Success ── */}
                {step===5 && (
                  <div className="fade-up" style={{ paddingTop:8 }}>
                    <div style={{ textAlign:"center", marginBottom:28 }}>
                      <div style={{ width:80, height:80, borderRadius:"50%", border:"1px solid rgba(212,175,55,0.3)", background:"rgba(212,175,55,0.10)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 18px" }}>
                        {accType==="issuer" ? "🏢" : "⏳"}
                      </div>
                      <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:"#e8e8f0", margin:"0 0 8px" }}>
                        {accType==="issuer" ? "Account Created!" : "Verification Submitted!"}
                      </h1>
                      <p style={{ fontSize:14, color:"#7a7a96", maxWidth:360, margin:"0 auto", lineHeight:1.7 }}>
                        {accType==="issuer"
                          ? `Welcome, ${firstName}! Your issuer account is ready. Our team will review KYB documents within 1-3 business days.`
                          : `Thank you, ${firstName}! Documents sent to Sumsub. Verification usually takes 5-15 minutes but may take up to 24 hours.`}
                      </p>
                    </div>

                    {/* Status timeline */}
                    <div style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:20, marginBottom:16 }}>
                      <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#7a7a96", margin:"0 0 16px" }}>Verification Status</p>
                      {[
                        { label:"Account Created",           done:true,  active:false },
                        { label:"Documents Submitted",       done:true,  active:false },
                        { label:"Sumsub Review in Progress", done:false, active:true  },
                        { label:"Compliance Approval",       done:false, active:false },
                        { label:"Full Platform Access",      done:false, active:false },
                      ].map((s) => (
                        <div key={s.label} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                          <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, border:"1px solid", borderColor: s.done?"rgba(34,197,94,0.4)":s.active?"rgba(245,158,11,0.4)":"rgba(255,255,255,0.1)", background: s.done?"rgba(34,197,94,0.1)":s.active?"rgba(245,158,11,0.1)":"rgba(255,255,255,0.03)", color: s.done?"#22c55e":s.active?"#f59e0b":"#7a7a96" }}>
                            {s.done?"✓":s.active?"…":"○"}
                          </div>
                          <p style={{ fontSize:13, margin:0, fontWeight: s.active ? 700 : 400, color: s.done?"#22c55e":s.active?"#f59e0b":"#7a7a96" }}>{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div style={{ ...S.info, marginBottom:16, borderRadius:14 }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>📧</span>
                      <p style={{ fontSize:12.5, color:"#b0b0c8", margin:0, lineHeight:1.6 }}>
                        Confirmation sent to <strong style={{ color:"#d4af37" }}>{email || "your email"}</strong>. We will notify you once KYC is approved.
                      </p>
                    </div>

                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      <a href="/markets" style={{ display:"block", textAlign:"center", padding:"13px 0", borderRadius:12, background:"#d4af37", color:"#000", fontSize:14, fontWeight:700, textDecoration:"none" }}>
                        Explore Markets
                      </a>
                      <button onClick={() => { setMode("login"); resetAll(); }}
                        style={{ ...S.btnGhost, borderRadius:12 }}>
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
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:16, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:8 }}>
              <p style={{ fontSize:11, color:"#7a7a96", margin:0 }}>© 2026 Nextoken Capital UAB · Lithuania</p>
              <div style={{ display:"flex", gap:16 }}>
                {[["Terms","/terms"],["Privacy","/privacy"],["AML","/aml"]].map(([l,h]) => (
                  <a key={l} href={h} style={{ fontSize:11, color:"#7a7a96", textDecoration:"none" }}>{l}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
