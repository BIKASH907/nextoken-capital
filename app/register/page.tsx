"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type Mode = "login" | "register";
type Step = 1 | 2 | 3 | 4 | 5;
type AccType = "investor" | "issuer" | null;
type DocType = "passport" | "id_card" | "drivers_license" | null;
type KycStatus = "idle" | "uploading" | "submitted";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function Input({ label, type = "text", placeholder, value, onChange, required = false, hint, error }: {
  label: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; required?: boolean; hint?: string; error?: string;
}) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[#b0b0c8]">
        {label} {required && <span className="text-[#d4af37]">*</span>}
      </label>
      <div className="relative">
        <input
          type={isPw ? (showPw ? "text" : "password") : type}
          placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg bg-[#0d0d14] border text-[14px] text-[#e8e8f0] placeholder-[#7a7a96] focus:outline-none focus:border-yellow-600/60 focus:ring-1 focus:ring-yellow-600/20 transition-all ${error ? "border-red-500/50" : "border-white/[0.08]"}`}
        />
        {isPw && (
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7a7a96] hover:text-[#b0b0c8]">
            <EyeIcon open={showPw} />
          </button>
        )}
      </div>
      {hint && !error && <p className="text-[11.5px] text-[#7a7a96]">{hint}</p>}
      {error && <p className="text-[11.5px] text-red-400">{error}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[#b0b0c8]">
        {label} {required && <span className="text-[#d4af37]">*</span>}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-[#0d0d14] border border-white/[0.08] text-[14px] text-[#e8e8f0] focus:outline-none focus:border-yellow-600/60 transition-all cursor-pointer">
        <option value="" disabled>Select country...</option>
        {options.map((o) => <option key={o.value} value={o.value} className="bg-[#0d0d14]">{o.label}</option>)}
      </select>
    </div>
  );
}

function PasswordStrength({ pw }: { pw: string }) {
  const checks = [
    { label: "8+ characters", ok: pw.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(pw) },
    { label: "Number", ok: /\d/.test(pw) },
    { label: "Special char", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-400"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  if (!pw) return null;
  return (
    <div className="mt-1.5 space-y-1.5">
      <div className="flex gap-1">
        {[1,2,3,4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? colors[score] : "bg-white/10"}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 items-center justify-between">
        {checks.map((c) => (
          <span key={c.label} className={`text-[10.5px] ${c.ok ? "text-green-400" : "text-[#7a7a96]"}`}>
            {c.ok ? "✓" : "○"} {c.label}
          </span>
        ))}
        <span className={`text-[11px] font-semibold ml-auto ${score >= 3 ? "text-green-400" : score === 2 ? "text-yellow-400" : "text-red-400"}`}>
          {labels[score]}
        </span>
      </div>
    </div>
  );
}

function StepBar({ step, total }: { step: number; total: number }) {
  const stepLabels = ["Account Type", "Personal Info", "Security", "KYC Verification", "Complete"];
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 flex-shrink-0 transition-all ${i+1<step ? "border-[#d4af37] bg-[#d4af37] text-black" : i+1===step ? "border-[#d4af37] text-[#d4af37]" : "border-white/20 text-[#7a7a96]"}`}>
              {i+1 < step ? <CheckIcon /> : i+1}
            </div>
            {i < total-1 && <div className={`flex-1 h-[2px] mx-1 transition-all ${i+1<step ? "bg-[#d4af37]" : "bg-white/[0.08]"}`} />}
          </div>
        ))}
      </div>
      <div className="mt-2.5">
        <p className="text-[11px] text-[#7a7a96]">Step {step} of {total}</p>
        <p className="text-[13px] font-semibold text-[#e8e8f0]">{stepLabels[step-1]}</p>
      </div>
    </div>
  );
}

function UploadBox({ label, hint, file, onFile }: {
  label: string; hint: string; file: File | null; onFile: (f: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <p className="text-[12.5px] font-medium text-[#b0b0c8] mb-1.5">{label}</p>
      <div onClick={() => ref.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-all ${file ? "border-yellow-600/50 bg-yellow-600/[0.06]" : "border-white/[0.10] bg-white/[0.02] hover:border-yellow-600/30"}`}>
        {file ? (
          <>
            <div className="w-9 h-9 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 text-lg">✓</div>
            <p className="text-[12.5px] font-medium text-green-400">{file.name}</p>
            <p className="text-[11px] text-[#7a7a96]">Click to replace</p>
          </>
        ) : (
          <>
            <div className="text-[#7a7a96]"><UploadIcon /></div>
            <p className="text-[13px] font-medium text-[#b0b0c8]">{hint}</p>
            <p className="text-[11px] text-[#7a7a96]">JPG, PNG or PDF · Max 10 MB</p>
          </>
        )}
        <input ref={ref} type="file" accept="image/*,.pdf" className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </div>
    </div>
  );
}

const COUNTRIES = [
  {value:"LT",label:"Lithuania"},{value:"EE",label:"Estonia"},{value:"LV",label:"Latvia"},
  {value:"DE",label:"Germany"},{value:"FR",label:"France"},{value:"NL",label:"Netherlands"},
  {value:"PL",label:"Poland"},{value:"SE",label:"Sweden"},{value:"FI",label:"Finland"},
  {value:"DK",label:"Denmark"},{value:"NO",label:"Norway"},{value:"CH",label:"Switzerland"},
  {value:"AT",label:"Austria"},{value:"BE",label:"Belgium"},{value:"IE",label:"Ireland"},
  {value:"PT",label:"Portugal"},{value:"ES",label:"Spain"},{value:"IT",label:"Italy"},
  {value:"CZ",label:"Czech Republic"},{value:"SK",label:"Slovakia"},{value:"HU",label:"Hungary"},
  {value:"RO",label:"Romania"},{value:"BG",label:"Bulgaria"},{value:"HR",label:"Croatia"},
  {value:"GR",label:"Greece"},{value:"GB",label:"United Kingdom"},{value:"US",label:"United States"},
  {value:"CA",label:"Canada"},{value:"AU",label:"Australia"},{value:"SG",label:"Singapore"},
  {value:"AE",label:"UAE"},{value:"IN",label:"India"},
];

export default function RegisterPage() {
  const [mode, setMode]           = useState<Mode>("register");
  const [step, setStep]           = useState<Step>(1);
  const [accType, setAccType]     = useState<AccType>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [country,   setCountry]   = useState("");
  const [phone,     setPhone]     = useState("");
  const [dob,       setDob]       = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [agree,     setAgree]     = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [docType,   setDocType]   = useState<DocType>(null);
  const [docFront,  setDocFront]  = useState<File|null>(null);
  const [docBack,   setDocBack]   = useState<File|null>(null);
  const [selfie,    setSelfie]    = useState<File|null>(null);
  const [proofAddr, setProofAddr] = useState<File|null>(null);
  const [kycStatus, setKycStatus] = useState<KycStatus>("idle");
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading,  setLoginLoading]  = useState(false);
  const [loginError,    setLoginError]    = useState("");
  const [errors, setErrors] = useState<Record<string,string>>({});

  function validateStep2() {
    const e: Record<string,string> = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim())  e.lastName  = "Last name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    if (!country) e.country = "Please select your country";
    if (!dob)     e.dob = "Date of birth is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3() {
    const e: Record<string,string> = {};
    if (password.length < 8) e.password = "Minimum 8 characters";
    if (password !== confirm) e.confirm  = "Passwords do not match";
    if (!agree)               e.agree    = "You must accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function kycReady() {
    if (!docType || !docFront || !selfie) return false;
    if (docType !== "passport" && !docBack) return false;
    return true;
  }

  async function submitKyc() {
    setKycStatus("uploading");
    await new Promise((r) => setTimeout(r, 2200));
    setKycStatus("submitted");
    setTimeout(() => setStep(5), 600);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { setLoginError("Please enter your email and password."); return; }
    setLoginLoading(true); setLoginError("");
    await new Promise((r) => setTimeout(r, 1400));
    setLoginLoading(false);
    setLoginError("Invalid credentials. Please try again.");
  }

  function resetAll() {
    setStep(1); setAccType(null); setKycStatus("idle");
    setDocType(null); setDocFront(null); setDocBack(null);
    setSelfie(null); setProofAddr(null); setErrors({});
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .35s ease both; }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse-dot { animation: pulse-dot 2s infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(.5); cursor: pointer; }
        select option { background: #0d0d14; }
      `}</style>

      <div className="min-h-screen bg-[#050508]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* NAVBAR */}
        <nav className="flex items-center justify-between px-8 h-16 border-b border-white/[0.08] bg-[rgba(5,5,8,0.95)] backdrop-blur-xl sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <span className="font-syne text-[19px] font-extrabold text-[#d4af37] tracking-wide">NXT</span>
            <div className="w-px h-[22px] bg-yellow-600/25" />
            <div className="leading-tight">
              <span className="font-syne block text-[12.5px] font-bold tracking-[3px] text-[#d4af37]">NEXTOKEN</span>
              <span className="block text-[8.5px] tracking-[2.5px] text-[#7a7a96] uppercase">CAPITAL</span>
            </div>
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-[#7a7a96] hidden sm:block">
              {mode === "login" ? "Need an account?" : "Already registered?"}
            </span>
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setErrors({}); resetAll(); }}
              className="px-4 py-1.5 rounded-lg border border-white/[0.08] text-[#b0b0c8] text-[13px] font-medium hover:border-yellow-600/50 hover:text-[#d4af37] transition-all">
              {mode === "login" ? "Sign Up" : "Log In"}
            </button>
          </div>
        </nav>

        <div className="flex min-h-[calc(100vh-64px)]">

          {/* LEFT PANEL */}
          <div className="hidden lg:flex flex-col justify-between w-[400px] flex-shrink-0 bg-[#0d0d14] border-r border-white/[0.08] p-12 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 500px 600px at -80px 280px, rgba(212,175,55,0.10) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-600/25 bg-yellow-600/[0.08] text-[#d4af37] text-[11px] font-semibold tracking-[1.5px] uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] pulse-dot" />
                Regulated Platform
              </div>
              <h2 className="font-syne text-[30px] font-bold text-[#e8e8f0] leading-tight mb-4">
                Join the Future of<br /><span className="text-[#d4af37]">Capital Markets</span>
              </h2>
              <p className="text-[13.5px] text-[#7a7a96] leading-[1.75] mb-10">
                Access tokenized real-world assets, blockchain IPOs, and digital bonds — regulated, verified, and built for modern investors.
              </p>
              {[
                { icon: "🔒", title: "Regulated & Compliant",    desc: "Licensed under Bank of Lithuania. ERC-3643 token standard." },
                { icon: "🪪", title: "KYC / AML Verified",       desc: "Third-party identity verification by Sumsub for all investors." },
                { icon: "🌍", title: "30+ Countries",             desc: "Multi-currency and EU-passported regulatory structure." },
                { icon: "📈", title: "Institutional-Grade Deals", desc: "Access opportunities previously reserved for professionals." },
              ].map((f) => (
                <div key={f.title} className="flex gap-3.5 mb-6">
                  <div className="text-xl flex-shrink-0 mt-0.5">{f.icon}</div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#e8e8f0] mb-0.5">{f.title}</p>
                    <p className="text-[12px] text-[#7a7a96] leading-[1.6]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative z-10 border-t border-white/[0.08] pt-6 grid grid-cols-3 gap-4">
              {[{val:"12,400+",label:"Investors"},{val:"€140M+",label:"Deployed"},{val:"30+",label:"Countries"}].map((s) => (
                <div key={s.label}>
                  <div className="font-syne text-[18px] font-bold text-[#d4af37]">{s.val}</div>
                  <div className="text-[11px] text-[#7a7a96]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col items-center justify-start py-10 px-5 overflow-y-auto">
            <div className="w-full max-w-[460px]">

              {/* LOGIN MODE */}
              {mode === "login" && (
                <div className="fade-up">
                  <div className="mb-8">
                    <h1 className="font-syne text-[26px] font-bold text-[#e8e8f0] mb-1.5">Welcome back</h1>
                    <p className="text-[14px] text-[#7a7a96]">Sign in to your Nextoken Capital account.</p>
                  </div>
                  <div className="flex gap-3 mb-6">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[13px] text-[#b0b0c8] hover:border-white/20 transition-all">
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-yellow-600/30 bg-yellow-600/[0.08] text-[13px] text-[#d4af37] hover:bg-yellow-600/[0.14] transition-all">
                      🔗 Connect Wallet
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-white/[0.07]" />
                    <span className="text-[11.5px] text-[#7a7a96]">or email</span>
                    <div className="flex-1 h-px bg-white/[0.07]" />
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input label="Email address" type="email" placeholder="you@example.com" value={loginEmail} onChange={setLoginEmail} required />
                    <Input label="Password" type="password" placeholder="••••••••" value={loginPassword} onChange={setLoginPassword} required />
                    <div className="flex justify-end">
                      <Link href="/forgot-password" className="text-[12.5px] text-[#d4af37] no-underline hover:underline">Forgot password?</Link>
                    </div>
                    {loginError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">{loginError}</div>
                    )}
                    <button type="submit" disabled={loginLoading}
                      className="w-full py-3 rounded-lg bg-[#d4af37] text-black text-[14px] font-semibold hover:opacity-85 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                      {loginLoading
                        ? <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full spin" /> Signing in...</>
                        : "Sign In"}
                    </button>
                  </form>
                  <p className="text-center text-[13px] text-[#7a7a96] mt-6">
                    New to Nextoken?{" "}
                    <button onClick={() => { setMode("register"); resetAll(); }}
                      className="text-[#d4af37] font-medium hover:underline bg-transparent border-0 cursor-pointer">
                      Create an account
                    </button>
                  </p>
                  <div className="mt-7 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] flex gap-3 items-start">
                    <div className="text-[#d4af37] mt-0.5 flex-shrink-0"><ShieldIcon /></div>
                    <div>
                      <p className="text-[12.5px] font-semibold text-[#e8e8f0] mb-0.5">Secure & Regulated</p>
                      <p className="text-[11.5px] text-[#7a7a96] leading-[1.6]">End-to-end encrypted. Supervised by the Bank of Lithuania.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* REGISTER MODE */}
              {mode === "register" && (
                <div className="fade-up">
                  {step < 5 && (
                    <>
                      <div className="mb-6">
                        <h1 className="font-syne text-[24px] font-bold text-[#e8e8f0] mb-1">Create your account</h1>
                        <p className="text-[13px] text-[#7a7a96]">
                          Already registered?{" "}
                          <button onClick={() => { setMode("login"); setErrors({}); }}
                            className="text-[#d4af37] font-medium hover:underline bg-transparent border-0 cursor-pointer">
                            Sign in here
                          </button>
                        </p>
                      </div>
                      <StepBar step={step} total={5} />
                    </>
                  )}

                  {/* STEP 1 — Account Type */}
                  {step === 1 && (
                    <div className="fade-up space-y-4">
                      <p className="text-[14px] text-[#b0b0c8]">How will you use Nextoken Capital?</p>
                      {([
                        { id: "investor" as AccType, emoji: "📈", title: "Investor",
                          desc: "Browse and invest in tokenized bonds, equity, real estate, and blockchain IPOs.",
                          tags: ["Markets","Bonds","Equity & IPO","Secondary Trading"],
                          note: "🪪 KYC identity verification required", nc: "text-amber-400" },
                        { id: "issuer" as AccType, emoji: "🏢", title: "Issuer / Company",
                          desc: "Tokenize your assets, issue bonds or equity, and raise capital from global investors.",
                          tags: ["Tokenize","Bond Issuance","Equity IPO","Cap Table"],
                          note: "📋 Corporate KYB verification required", nc: "text-[#7a7a96]" },
                      ]).map((card) => (
                        <button key={card.id as string} onClick={() => setAccType(card.id)}
                          className={`w-full text-left p-5 rounded-xl border-2 transition-all ${accType === card.id ? "border-yellow-600/70 bg-yellow-600/[0.08]" : "border-white/[0.08] bg-white/[0.02] hover:border-yellow-600/30"}`}>
                          <div className="flex items-start gap-4">
                            <div className="text-3xl flex-shrink-0">{card.emoji}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-syne text-[15px] font-bold text-[#e8e8f0]">{card.title}</span>
                                {accType === card.id && <span className="w-5 h-5 rounded-full bg-[#d4af37] flex items-center justify-center text-black"><CheckIcon /></span>}
                              </div>
                              <p className="text-[12.5px] text-[#7a7a96] leading-[1.6] mb-2">{card.desc}</p>
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {card.tags.map((t) => <span key={t} className="px-2 py-0.5 rounded bg-white/[0.05] text-[10.5px] text-[#7a7a96] border border-white/[0.07]">{t}</span>)}
                              </div>
                              <p className={`text-[11.5px] font-semibold ${card.nc}`}>{card.note}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                      <button disabled={!accType} onClick={() => setStep(2)}
                        className="w-full py-3 rounded-lg bg-[#d4af37] text-black text-[14px] font-semibold disabled:opacity-35 hover:opacity-85 transition-opacity">
                        Continue →
                      </button>
                    </div>
                  )}

                  {/* STEP 2 — Personal Info */}
                  {step === 2 && (
                    <div className="fade-up space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="First name" placeholder="Jane" value={firstName} onChange={setFirstName} required error={errors.firstName} />
                        <Input label="Last name"  placeholder="Doe"  value={lastName}  onChange={setLastName}  required error={errors.lastName} />
                      </div>
                      <Input label="Email address" type="email" placeholder="jane@example.com" value={email} onChange={setEmail} required error={errors.email} />
                      <Input label="Phone number" type="tel" placeholder="+370 600 00000" value={phone} onChange={setPhone} hint="Optional - used for 2FA" />
                      <Select label="Country of residence" value={country} onChange={setCountry} options={COUNTRIES} required />
                      {errors.country && <p className="text-[11.5px] text-red-400">{errors.country}</p>}
                      <Input label="Date of birth" type="date" value={dob} onChange={setDob} required error={errors.dob} hint="Must be 18+ to invest" />
                      {accType === "investor" && (
                        <div className="p-3.5 rounded-xl border border-yellow-600/20 bg-yellow-600/[0.05] flex gap-3">
                          <span className="flex-shrink-0 text-lg">ℹ️</span>
                          <p className="text-[12px] text-[#b0b0c8] leading-[1.6]">
                            You will complete KYC powered by <strong className="text-[#d4af37]">Sumsub</strong> in Step 4. Required by EU AML regulations.
                          </p>
                        </div>
                      )}
                      <div className="flex gap-3 pt-1">
                        <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg border border-white/[0.10] text-[#b0b0c8] text-[13px] hover:border-white/20 transition-all">← Back</button>
                        <button onClick={() => { if (validateStep2()) setStep(3); }} className="flex-[2] py-3 rounded-lg bg-[#d4af37] text-black text-[14px] font-semibold hover:opacity-85 transition-opacity">Continue →</button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 — Security */}
                  {step === 3 && (
                    <div className="fade-up space-y-4">
                      <Input label="Create password" type="password" placeholder="Create a strong password" value={password} onChange={setPassword} required error={errors.password} />
                      <PasswordStrength pw={password} />
                      <Input label="Confirm password" type="password" placeholder="Repeat your password" value={confirm} onChange={setConfirm} required error={errors.confirm} />
                      <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[13px] font-semibold text-[#e8e8f0]">Two-Factor Authentication</p>
                          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10.5px] font-semibold border border-green-500/20">Recommended</span>
                        </div>
                        <p className="text-[12px] text-[#7a7a96] mb-2.5">Set up authenticator app after registration in security settings.</p>
                        <div className="flex gap-2 flex-wrap">
                          {["Google Authenticator","Authy","SMS OTP"].map((a) => (
                            <span key={a} className="px-2 py-1 rounded bg-white/[0.04] text-[10.5px] text-[#7a7a96] border border-white/[0.06]">{a}</span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3 pt-1">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <div onClick={() => setAgree(!agree)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agree ? "border-[#d4af37] bg-[#d4af37]" : "border-white/20"}`}>
                            {agree && <CheckIcon />}
                          </div>
                          <p className="text-[12.5px] text-[#b0b0c8] leading-[1.6]">
                            I accept the <Link href="/terms" className="text-[#d4af37] no-underline hover:underline">Terms of Service</Link>, <Link href="/privacy" className="text-[#d4af37] no-underline hover:underline">Privacy Policy</Link>, and <Link href="/risk" className="text-[#d4af37] no-underline hover:underline">Risk Disclosure</Link>. <span className="text-[#d4af37]">*</span>
                          </p>
                        </label>
                        {errors.agree && <p className="text-[11.5px] text-red-400 ml-8">{errors.agree}</p>}
                        <label className="flex items-start gap-3 cursor-pointer">
                          <div onClick={() => setMarketing(!marketing)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${marketing ? "border-[#d4af37] bg-[#d4af37]" : "border-white/20"}`}>
                            {marketing && <CheckIcon />}
                          </div>
                          <p className="text-[12.5px] text-[#b0b0c8]">Send me updates about new investment opportunities. (Optional)</p>
                        </label>
                      </div>
                      <div className="flex gap-3 pt-1">
                        <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg border border-white/[0.10] text-[#b0b0c8] text-[13px] hover:border-white/20 transition-all">← Back</button>
                        <button onClick={() => { if (validateStep3()) { accType === "investor" ? setStep(4) : setStep(5); } }}
                          className="flex-[2] py-3 rounded-lg bg-[#d4af37] text-black text-[14px] font-semibold hover:opacity-85 transition-opacity">
                          {accType === "investor" ? "Continue to KYC →" : "Create Account →"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4 — KYC */}
                  {step === 4 && (
                    <div className="fade-up space-y-5">
                      <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] flex gap-3">
                        <span className="text-xl flex-shrink-0">🪪</span>
                        <div>
                          <p className="text-[13px] font-semibold text-amber-300 mb-0.5">Identity Verification Required</p>
                          <p className="text-[12px] text-[#b0b0c8] leading-[1.6]">
                            All investors must verify identity under EU AML/KYC regulations via <strong className="text-[#d4af37]">Sumsub</strong>. Your data is never stored on Nextoken servers.
                          </p>
                        </div>
                      </div>

                      {kycStatus === "idle" && (
                        <>
                          <div>
                            <p className="text-[13px] font-medium text-[#b0b0c8] mb-3">Select identity document <span className="text-[#d4af37]">*</span></p>
                            <div className="grid grid-cols-3 gap-2">
                              {([
                                {id:"passport",        label:"Passport",         icon:"🛂"},
                                {id:"id_card",         label:"National ID",       icon:"🪪"},
                                {id:"drivers_license", label:"Driver License",    icon:"🚗"},
                              ] as {id:DocType, label:string, icon:string}[]).map((d) => (
                                <button key={d.id as string} onClick={() => setDocType(d.id)}
                                  className={`p-3 rounded-lg border-2 text-center transition-all ${docType === d.id ? "border-yellow-600/60 bg-yellow-600/[0.10]" : "border-white/[0.08] bg-white/[0.02] hover:border-yellow-600/25"}`}>
                                  <div className="text-2xl mb-1">{d.icon}</div>
                                  <div className="text-[11px] font-medium text-[#e8e8f0]">{d.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                          {docType && (
                            <div className="space-y-3">
                              <UploadBox label={docType === "passport" ? "Passport — Photo page" : "Document — Front side"} hint="Drag & drop or click to upload" file={docFront} onFile={setDocFront} />
                              {docType !== "passport" && <UploadBox label="Document — Back side" hint="Drag & drop or click to upload" file={docBack} onFile={setDocBack} />}
                              <UploadBox label="Selfie holding your document" hint="Hold document next to your face — must be clear" file={selfie} onFile={setSelfie} />
                              <UploadBox label="Proof of address (recommended)" hint="Bank statement or utility bill — within 3 months" file={proofAddr} onFile={setProofAddr} />
                            </div>
                          )}
                          <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                            <p className="text-[12.5px] font-semibold text-[#e8e8f0] mb-2">📷 Requirements</p>
                            <ul className="space-y-1.5">
                              {["All four corners of the document must be visible","Text must be sharp and fully legible — no glare","Colour photos only","Maximum file size 10 MB per upload"].map((t) => (
                                <li key={t} className="flex items-start gap-2 text-[11.5px] text-[#7a7a96]">
                                  <span className="text-[#d4af37] flex-shrink-0 mt-0.5">→</span> {t}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-lg border border-white/[0.10] text-[#b0b0c8] text-[13px] hover:border-white/20 transition-all">← Back</button>
                            <button onClick={submitKyc} disabled={!kycReady()}
                              className="flex-[2] py-3 rounded-lg bg-[#d4af37] text-black text-[14px] font-semibold disabled:opacity-35 hover:opacity-85 transition-opacity">
                              Submit Verification →
                            </button>
                          </div>
                        </>
                      )}

                      {kycStatus === "uploading" && (
                        <div className="py-16 flex flex-col items-center gap-5">
                          <div className="w-16 h-16 rounded-full border-4 border-yellow-600/20 border-t-[#d4af37] spin" />
                          <div className="text-center">
                            <p className="font-syne text-[17px] font-bold text-[#e8e8f0] mb-1">Uploading documents...</p>
                            <p className="text-[13px] text-[#7a7a96]">Securely transmitting to Sumsub. Please wait.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 5 — Success */}
                  {step === 5 && (
                    <div className="fade-up py-4">
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 rounded-full bg-yellow-600/[0.12] border border-yellow-600/30 flex items-center justify-center text-4xl mx-auto mb-5">
                          {accType === "issuer" ? "🏢" : "⏳"}
                        </div>
                        <h1 className="font-syne text-[24px] font-bold text-[#e8e8f0] mb-2">
                          {accType === "issuer" ? "Account Created!" : "Verification Submitted!"}
                        </h1>
                        <p className="text-[14px] text-[#7a7a96] max-w-[360px] mx-auto leading-[1.7]">
                          {accType === "issuer"
                            ? `Welcome, ${firstName}! Your issuer account is ready. Our compliance team will review your KYB documents within 1-3 business days.`
                            : `Thank you, ${firstName}! Your documents have been sent to Sumsub. Verification usually takes 5-15 minutes but may take up to 24 hours.`}
                        </p>
                      </div>
                      <div className="border border-white/[0.08] rounded-xl p-5 mb-5 space-y-3.5">
                        <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-[#7a7a96]">Verification Status</p>
                        {[
                          { label: "Account Created",           done: true,  active: false },
                          { label: "Documents Submitted",       done: true,  active: false },
                          { label: "Sumsub Review in Progress", done: false, active: true  },
                          { label: "Compliance Approval",       done: false, active: false },
                          { label: "Full Platform Access",      done: false, active: false },
                        ].map((s) => (
                          <div key={s.label} className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold border ${s.done ? "bg-green-500/15 border-green-500/40 text-green-400" : s.active ? "bg-amber-500/15 border-amber-500/40 text-amber-400" : "bg-white/[0.04] border-white/[0.10] text-[#7a7a96]"}`}>
                              {s.done ? "✓" : s.active ? "…" : "○"}
                            </div>
                            <p className={`text-[13px] ${s.done ? "text-green-400" : s.active ? "text-amber-300 font-semibold" : "text-[#7a7a96]"}`}>{s.label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 rounded-xl border border-yellow-600/20 bg-yellow-600/[0.05] flex gap-3 mb-6">
                        <span className="text-xl flex-shrink-0">📧</span>
                        <p className="text-[12.5px] text-[#b0b0c8] leading-[1.6]">
                          Confirmation sent to <strong className="text-[#d4af37]">{email || "your email"}</strong>. We will notify you once KYC is approved.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Link href="/markets" className="block text-center py-3 rounded-lg bg-[#d4af37] text-black text-[14px] font-semibold no-underline hover:opacity-85 transition-opacity">
                          Explore Markets
                        </Link>
                        <button onClick={() => { setMode("login"); resetAll(); }}
                          className="py-3 rounded-lg border border-white/[0.10] text-[#b0b0c8] text-[13px] hover:border-white/20 transition-all">
                          Sign In to Your Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-full max-w-[460px] mt-10 pb-4">
              <div className="border-t border-white/[0.06] pt-5 flex flex-wrap justify-between gap-3">
                <p className="text-[11px] text-[#7a7a96]">© 2026 Nextoken Capital UAB · Lithuania</p>
                <div className="flex gap-4">
                  {([["Terms","/terms"],["Privacy","/privacy"],["AML","/aml"]] as [string,string][]).map(([l,h]) => (
                    <Link key={l} href={h} className="text-[11px] text-[#7a7a96] no-underline hover:text-[#d4af37] transition-colors">{l}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}