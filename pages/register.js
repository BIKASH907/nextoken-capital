// pages/register.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Navbar from "../components/Navbar";

// All 180+ countries with dial codes
const COUNTRIES = [
  { name:"Afghanistan", code:"AF", dial:"+93" },{ name:"Albania", code:"AL", dial:"+355" },
  { name:"Algeria", code:"DZ", dial:"+213" },{ name:"Andorra", code:"AD", dial:"+376" },
  { name:"Angola", code:"AO", dial:"+244" },{ name:"Argentina", code:"AR", dial:"+54" },
  { name:"Armenia", code:"AM", dial:"+374" },{ name:"Australia", code:"AU", dial:"+61" },
  { name:"Austria", code:"AT", dial:"+43" },{ name:"Azerbaijan", code:"AZ", dial:"+994" },
  { name:"Bahrain", code:"BH", dial:"+973" },{ name:"Bangladesh", code:"BD", dial:"+880" },
  { name:"Belarus", code:"BY", dial:"+375" },{ name:"Belgium", code:"BE", dial:"+32" },
  { name:"Bolivia", code:"BO", dial:"+591" },{ name:"Bosnia", code:"BA", dial:"+387" },
  { name:"Brazil", code:"BR", dial:"+55" },{ name:"Bulgaria", code:"BG", dial:"+359" },
  { name:"Cambodia", code:"KH", dial:"+855" },{ name:"Cameroon", code:"CM", dial:"+237" },
  { name:"Canada", code:"CA", dial:"+1" },{ name:"Chile", code:"CL", dial:"+56" },
  { name:"China", code:"CN", dial:"+86" },{ name:"Colombia", code:"CO", dial:"+57" },
  { name:"Costa Rica", code:"CR", dial:"+506" },{ name:"Croatia", code:"HR", dial:"+385" },
  { name:"Cyprus", code:"CY", dial:"+357" },{ name:"Czech Republic", code:"CZ", dial:"+420" },
  { name:"Denmark", code:"DK", dial:"+45" },{ name:"Dominican Republic", code:"DO", dial:"+1-809" },
  { name:"Ecuador", code:"EC", dial:"+593" },{ name:"Egypt", code:"EG", dial:"+20" },
  { name:"El Salvador", code:"SV", dial:"+503" },{ name:"Estonia", code:"EE", dial:"+372" },
  { name:"Ethiopia", code:"ET", dial:"+251" },{ name:"Finland", code:"FI", dial:"+358" },
  { name:"France", code:"FR", dial:"+33" },{ name:"Georgia", code:"GE", dial:"+995" },
  { name:"Germany", code:"DE", dial:"+49" },{ name:"Ghana", code:"GH", dial:"+233" },
  { name:"Greece", code:"GR", dial:"+30" },{ name:"Guatemala", code:"GT", dial:"+502" },
  { name:"Honduras", code:"HN", dial:"+504" },{ name:"Hong Kong", code:"HK", dial:"+852" },
  { name:"Hungary", code:"HU", dial:"+36" },{ name:"Iceland", code:"IS", dial:"+354" },
  { name:"India", code:"IN", dial:"+91" },{ name:"Indonesia", code:"ID", dial:"+62" },
  { name:"Iraq", code:"IQ", dial:"+964" },{ name:"Ireland", code:"IE", dial:"+353" },
  { name:"Israel", code:"IL", dial:"+972" },{ name:"Italy", code:"IT", dial:"+39" },
  { name:"Japan", code:"JP", dial:"+81" },{ name:"Jordan", code:"JO", dial:"+962" },
  { name:"Kazakhstan", code:"KZ", dial:"+7" },{ name:"Kenya", code:"KE", dial:"+254" },
  { name:"Kuwait", code:"KW", dial:"+965" },{ name:"Kyrgyzstan", code:"KG", dial:"+996" },
  { name:"Latvia", code:"LV", dial:"+371" },{ name:"Lebanon", code:"LB", dial:"+961" },
  { name:"Libya", code:"LY", dial:"+218" },{ name:"Liechtenstein", code:"LI", dial:"+423" },
  { name:"Lithuania", code:"LT", dial:"+370" },{ name:"Luxembourg", code:"LU", dial:"+352" },
  { name:"Macau", code:"MO", dial:"+853" },{ name:"Malaysia", code:"MY", dial:"+60" },
  { name:"Maldives", code:"MV", dial:"+960" },{ name:"Malta", code:"MT", dial:"+356" },
  { name:"Mexico", code:"MX", dial:"+52" },{ name:"Moldova", code:"MD", dial:"+373" },
  { name:"Monaco", code:"MC", dial:"+377" },{ name:"Mongolia", code:"MN", dial:"+976" },
  { name:"Montenegro", code:"ME", dial:"+382" },{ name:"Morocco", code:"MA", dial:"+212" },
  { name:"Mozambique", code:"MZ", dial:"+258" },{ name:"Myanmar", code:"MM", dial:"+95" },
  { name:"Nepal", code:"NP", dial:"+977" },{ name:"Netherlands", code:"NL", dial:"+31" },
  { name:"New Zealand", code:"NZ", dial:"+64" },{ name:"Nicaragua", code:"NI", dial:"+505" },
  { name:"Nigeria", code:"NG", dial:"+234" },{ name:"North Macedonia", code:"MK", dial:"+389" },
  { name:"Norway", code:"NO", dial:"+47" },{ name:"Oman", code:"OM", dial:"+968" },
  { name:"Pakistan", code:"PK", dial:"+92" },{ name:"Panama", code:"PA", dial:"+507" },
  { name:"Paraguay", code:"PY", dial:"+595" },{ name:"Peru", code:"PE", dial:"+51" },
  { name:"Philippines", code:"PH", dial:"+63" },{ name:"Poland", code:"PL", dial:"+48" },
  { name:"Portugal", code:"PT", dial:"+351" },{ name:"Qatar", code:"QA", dial:"+974" },
  { name:"Romania", code:"RO", dial:"+40" },{ name:"Rwanda", code:"RW", dial:"+250" },
  { name:"Saudi Arabia", code:"SA", dial:"+966" },{ name:"Senegal", code:"SN", dial:"+221" },
  { name:"Serbia", code:"RS", dial:"+381" },{ name:"Singapore", code:"SG", dial:"+65" },
  { name:"Slovakia", code:"SK", dial:"+421" },{ name:"Slovenia", code:"SI", dial:"+386" },
  { name:"South Africa", code:"ZA", dial:"+27" },{ name:"South Korea", code:"KR", dial:"+82" },
  { name:"Spain", code:"ES", dial:"+34" },{ name:"Sri Lanka", code:"LK", dial:"+94" },
  { name:"Sweden", code:"SE", dial:"+46" },{ name:"Switzerland", code:"CH", dial:"+41" },
  { name:"Taiwan", code:"TW", dial:"+886" },{ name:"Tajikistan", code:"TJ", dial:"+992" },
  { name:"Tanzania", code:"TZ", dial:"+255" },{ name:"Thailand", code:"TH", dial:"+66" },
  { name:"Tunisia", code:"TN", dial:"+216" },{ name:"Turkey", code:"TR", dial:"+90" },
  { name:"Turkmenistan", code:"TM", dial:"+993" },{ name:"Uganda", code:"UG", dial:"+256" },
  { name:"Ukraine", code:"UA", dial:"+380" },{ name:"United Arab Emirates", code:"AE", dial:"+971" },
  { name:"United Kingdom", code:"GB", dial:"+44" },{ name:"United States", code:"US", dial:"+1" },
  { name:"Uruguay", code:"UY", dial:"+598" },{ name:"Uzbekistan", code:"UZ", dial:"+998" },
  { name:"Venezuela", code:"VE", dial:"+58" },{ name:"Vietnam", code:"VN", dial:"+84" },
  { name:"Yemen", code:"YE", dial:"+967" },{ name:"Zambia", code:"ZM", dial:"+260" },
  { name:"Zimbabwe", code:"ZW", dial:"+263" },
];

const STEPS = ["Account","Personal","Agreements","Done"];

const FEATURES = [
  { icon:"🏛️", text:"EU compliance-ready platform" },
  { icon:"⚖️", text:"MiCA compliant platform" },
  { icon:"🌍", text:"Open to 180+ countries" },
  { icon:"💶", text:"Invest from EUR 100" },
  { icon:"📈", text:"15–18% target annual ROI" },
  { icon:"🔐", text:"Enterprise-grade security" },
  { icon:"🔗", text:"ERC-3643 asset tokens" },
  { icon:"🪪", text:"Sumsub KYC verification" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep]       = useState(0);
  const [otpSent, setOtpSent]   = useState(false);
  const [otp, setOtp]           = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm] = useState({ role: "investor",
    preferredLanguage, email:"", password:"", confirm:"",
    firstName:"", lastName:"", country:"", dialCode:"+370", phone:"", dob:"",
    agreeTerms: false, agreeRisk: false,
  });

  const handle = e => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (e.target.name === "country") {
      const found = COUNTRIES.find(c => c.name === e.target.value);
      setForm(f => ({ ...f, country: e.target.value, dialCode: found?.dial || f.dialCode }));
    } else {
      setForm(f => ({ ...f, [e.target.name]: val }));
    }
    setError("");
  };

  const nextStep = () => {
    setError("");
    if (step === 0) {
      if (!form.email || !form.password || !form.confirm) { setError("Please fill in all fields."); return; }
      if (!form.email.includes("@") || !form.email.includes(".")) { setError("Please enter a valid email address."); return; }
      if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
      if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    }
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.country || !form.dob) { setError("Please fill in all fields."); return; }
      const age = (Date.now() - new Date(form.dob)) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 18) { setError("You must be at least 18 years old to register."); return; }
    }
    if (step === 2) {
      if (!form.agreeTerms || !form.agreeRisk) { setError("You must agree to both the Terms of Service and Risk Disclosure."); return; }
    }
    if (step === 0 && !otpVerified) { sendOtp(); return; }
    setStep(s => s + 1);
  };

  const sendOtp = async () => {
    setOtpLoading(true); setOtpError("");
    try {
      const r = await fetch("/api/auth/send-otp", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({email: form.email}) });
      const d = await r.json();
      if (r.ok) setOtpSent(true);
      else setOtpError(d.error || "Failed to send code");
    } catch(e) { setOtpError("Network error"); }
    setOtpLoading(false);
  };
  const verifyOtp = async () => {
    setOtpLoading(true); setOtpError("");
    try {
      const r = await fetch("/api/auth/verify-otp", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({role: form.role, email: form.email, preferredLanguage, otp}) });
      const d = await r.json();
      if (r.ok && d.verified) { setOtpVerified(true); setStep(1); setOtpSent(false); setOtp(""); }
      else setOtpError(d.error || "Invalid code");
    } catch(e) { setOtpError("Network error"); }
    setOtpLoading(false);
  };
  const submitRegistration = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: form.role, email: form.email, password: form.password,
          firstName: form.firstName, lastName: form.lastName,
          country: form.country, countryCode: form.dialCode,
          phone: form.phone, dob: form.dob,
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.user)) {
        setStep(3);
      } else {
        setError(data.error || "Registration failed. Please try again.");
        setStep(2); // go back to agreements to show error
      }
    } catch (e) {
      setError("Network error — please check your connection and try again.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const pwdStr = () => {
    const p = form.password; if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++; if (p.length >= 12) s++;
    if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 5);
  };
  const SC = ["#1a1a1a","#ef4444","#FF8C00","#F0B90B","#0ECB81","#0ECB81"];
  const SL = ["","Weak","Fair","Good","Strong","Very Strong"];

  return (
    <>
      <Head>
        <title>Create Account — Nextoken Capital</title>
        <meta name="description" content="Create your Nextoken Capital account. Invest in tokenized real-world assets from EUR 100." />
      </Head>
      <Navbar />
      <style>{`
        .rg{min-height:100vh;background:#0B0E11;padding:80px 20px 40px;display:flex;align-items:flex-start;justify-content:center;gap:32px}
        .rg-left{width:280px;flex-shrink:0;position:sticky;top:84px;display:flex;flex-direction:column;gap:16px}
        .rg-brand{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:22px}
        .rg-brand-logo{display:flex;align-items:center;gap:10px;margin-bottom:14px}
        .rg-brand-nxt{font-size:22px;font-weight:900;color:#F0B90B}
        .rg-brand-vl{width:1px;height:24px;background:rgba(255,255,255,0.2)}
        .rg-brand-txt{display:flex;flex-direction:column;line-height:1.2}
        .rg-brand-t1{font-size:10px;font-weight:800;color:#fff;letter-spacing:2px}
        .rg-brand-t2{font-size:8px;color:rgba(255,255,255,0.4);letter-spacing:2px}
        .rg-brand-desc{font-size:12px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:16px}
        .rg-brand-feat{display:flex;flex-direction:column;gap:8px}
        .rg-brand-feat-item{display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(255,255,255,0.55)}
        .rg-brand-feat-ico{font-size:14px;flex-shrink:0}
        .rg-reg-info{background:#0F1318;border:1px solid rgba(240,185,11,0.15);border-radius:14px;padding:18px}
        .rg-reg-info-title{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px}
        .rg-reg-stat{display:flex;justify-content:space-between;font-size:12px;margin-bottom:7px}
        .rg-reg-stat-v{font-weight:800;color:#fff}
        .rg-reg-stat-l{color:rgba(255,255,255,0.38)}
        .rg-wrap{width:100%;max-width:500px}
        .rg-steps{display:flex;align-items:center;justify-content:center;margin-bottom:22px}
        .rg-step-item{display:flex;align-items:center}
        .rg-dot{width:22px;height:22px;border-radius:50%;border:2px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);transition:all .2s}
        .rg-dot.active{border-color:#F0B90B;color:#F0B90B}
        .rg-dot.done{border-color:#0ECB81;background:#0ECB81;color:#000}
        .rg-step-lbl{font-size:11px;font-weight:600;margin-left:5px;display:none}
        .rg-dot.active + .rg-step-lbl{display:block;color:#F0B90B}
        .rg-step-line{width:28px;height:1px;background:rgba(255,255,255,0.08);margin:0 4px}
        .rg-card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:30px}
        .rg-title{font-size:18px;font-weight:900;color:#fff;margin-bottom:4px}
        .rg-sub{font-size:13px;color:rgba(255,255,255,0.38);margin-bottom:22px;line-height:1.6}
        .rg-err{background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.25);border-radius:8px;padding:11px 14px;font-size:13px;color:#FF6B6B;margin-bottom:16px;line-height:1.5}
        .rg-field{margin-bottom:15px}
        .rg-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .rg-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:11px 14px;font-size:14px;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .rg-input:focus{border-color:rgba(240,185,11,0.5)}
        .rg-input option{background:#161B22;color:#fff}
        .rg-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .rg-phone-row{display:grid;grid-template-columns:140px 1fr;gap:10px}
        .rg-bar{height:3px;border-radius:2px;background:#1a1a1a;margin-top:5px;overflow:hidden}
        .rg-bar-fill{height:100%;border-radius:2px;transition:all .3s}
        .rg-str{font-size:11px;font-weight:600;margin-top:3px}
        .rg-check{display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;cursor:pointer}
        .rg-check input{width:16px;height:16px;margin-top:2px;accent-color:#F0B90B;flex-shrink:0;cursor:pointer}
        .rg-check-txt{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.7}
        .rg-check-txt a{color:#F0B90B;text-decoration:none}
        .rg-reg-note{background:rgba(240,185,11,0.05);border:1px solid rgba(240,185,11,0.15);border-radius:8px;padding:12px 14px;font-size:12px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:16px}
        .rg-btn{width:100%;padding:13px;background:#F0B90B;color:#000;font-size:14px;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:inherit;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:8px}
        .rg-btn:hover:not(:disabled){background:#FFD000}
        .rg-btn:disabled{background:rgba(240,185,11,0.2);color:rgba(0,0,0,0.3);cursor:not-allowed}
        .rg-btn-ghost{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.55);border:1px solid rgba(255,255,255,0.1)}
        .rg-btn-ghost:hover:not(:disabled){background:rgba(255,255,255,0.09);color:#fff}
        .rg-two{display:grid;grid-template-columns:0.55fr 1fr;gap:10px;margin-top:6px}
        .rg-spin{width:16px;height:16px;border:2px solid rgba(0,0,0,0.2);border-top-color:#000;border-radius:50%;animation:rgspin .6s linear infinite}
        @keyframes rgspin{to{transform:rotate(360deg)}}
        .rg-done{text-align:center;padding:10px 0}
        .rg-done-ico{font-size:54px;margin-bottom:14px}
        .rg-done-title{font-size:20px;font-weight:900;color:#0ECB81;margin-bottom:8px}
        .rg-done-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:22px}
        .rg-done-kyc{background:rgba(240,185,11,0.06);border:1px solid rgba(240,185,11,0.2);border-radius:10px;padding:16px;margin-bottom:20px;text-align:left}
        .rg-done-kyc-title{font-size:13px;font-weight:700;color:#F0B90B;margin-bottom:6px}
        .rg-done-kyc-sub{font-size:12px;color:rgba(255,255,255,0.45);line-height:1.6}
        .rg-footer{text-align:center;font-size:13px;color:rgba(255,255,255,0.35);margin-top:16px}
        .rg-footer a{color:#F0B90B;text-decoration:none}
        @media(max-width:1024px){.rg{flex-direction:column;align-items:center}.rg-left{position:static;width:100%;max-width:500px;flex-direction:row;flex-wrap:wrap;gap:12px}.rg-brand{flex:1;min-width:220px}.rg-reg-info{flex:1;min-width:180px}}
        @media(max-width:540px){.rg-left{flex-direction:column}.rg-row{grid-template-columns:1fr}.rg-two{grid-template-columns:1fr}.rg-phone-row{grid-template-columns:1fr}}
      `}</style>

      <div className="rg">

        {/* LEFT PANEL — company info */}
        <div className="rg-left">
          <div className="rg-brand">
            <div className="rg-brand-logo">
              <span className="rg-brand-nxt">NXT</span>
              <div className="rg-brand-vl" />
              <div className="rg-brand-txt">
                <span className="rg-brand-t1">NEXTOKEN</span>
                <span className="rg-brand-t2">CAPITAL</span>
              </div>
            </div>
            <p className="rg-brand-desc">
              The regulated infrastructure for tokenized real-world assets.
              Nextoken Capital UAB is registered in Lithuania and registered in Lithuania.
            </p>
            <div className="rg-brand-feat">
              {FEATURES.map(f => (
                <div key={f.text} className="rg-brand-feat-item">
                  <span className="rg-brand-feat-ico">{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rg-reg-info">
            <div className="rg-reg-info-title">Platform Stats</div>
            {[
              ["Live","Platform active"],
              ["Growing","Investor community"],
              ["180+","Countries supported"],
              ["EUR 100","Minimum purchase"],
              ["0.2%","Trading fee"],
              ["15–18%","Target annual ROI"],
            ].map(([v,l]) => (
              <div key={l} className="rg-reg-stat">
                <span className="rg-reg-stat-v">{v}</span>
                <span className="rg-reg-stat-l">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="rg-wrap">

          {/* Step dots */}
          <div className="rg-steps">
            {STEPS.map((s, i) => (
              <div key={s} className="rg-step-item">
                <div className={`rg-dot ${i===step?"active":i<step?"done":""}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="rg-step-lbl">{s}</span>
                {i < STEPS.length - 1 && <div className="rg-step-line" />}
              </div>
            ))}
          </div>

          <div className="rg-card">
            {error && <div className="rg-err">⚠️ {error}</div>}

            {/* STEP 0 — Account */}
            {step === 0 && <>
              <button onClick={async () => { const res = await fetch("/api/auth/csrf"); const {csrfToken} = await res.json(); const form = document.createElement("form"); form.method = "POST"; form.action = "/api/auth/signin/google"; const cb = document.createElement("input"); cb.type = "hidden"; cb.name = "callbackUrl"; cb.value = "/dashboard"; const csrf = document.createElement("input"); csrf.type = "hidden"; csrf.name = "csrfToken"; csrf.value = csrfToken; form.appendChild(cb); form.appendChild(csrf); document.body.appendChild(form); form.submit(); }} style={{width:"100%",padding:"12px",background:"#fff",color:"#000",border:"none",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:20}}><img src="https://www.google.com/favicon.ico" width={18} height={18} alt="" />Continue with Google</button>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}><div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}></div><span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>or register with email</span><div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}></div></div>
              <div className="rg-title">Create your account</div>
              <p className="rg-sub">Join our investor community. Takes 3 minutes.</p>
              <div style={{marginBottom:16}}><label style={{display:"block",fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>I WANT TO</label><div style={{display:"flex",gap:10}}><button type="button" onClick={()=>setForm({...form,role:"investor"})} style={{flex:1,padding:"14px 12px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,textAlign:"center",background:form.role==="investor"?"rgba(240,185,11,0.12)":"#161B22",color:form.role==="investor"?"#F0B90B":"rgba(255,255,255,0.4)",border:form.role==="investor"?"2px solid #F0B90B":"2px solid rgba(255,255,255,0.08)"}}>Invest in Assets<div style={{fontSize:10,fontWeight:400,color:"rgba(255,255,255,0.3)",marginTop:4}}>Buy tokenized bonds, equity</div></button><button type="button" onClick={()=>setForm({...form,role:"issuer"})} style={{flex:1,padding:"14px 12px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,textAlign:"center",background:form.role==="issuer"?"rgba(139,92,246,0.12)":"#161B22",color:form.role==="issuer"?"#8b5cf6":"rgba(255,255,255,0.4)",border:form.role==="issuer"?"2px solid #8b5cf6":"2px solid rgba(255,255,255,0.08)"}}>Tokenize My Assets<div style={{fontSize:10,fontWeight:400,color:"rgba(255,255,255,0.3)",marginTop:4}}>List assets for buyers</div></button></div></div>
              <div className="rg-field">
                <label className="rg-label">Email Address</label>
                <input className="rg-input" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" autoComplete="email" />
              </div>
              <div className="rg-field">
                <label className="rg-label">Password</label>
                <input className="rg-input" name="password" type="password" value={form.password} onChange={handle} placeholder="Min. 8 characters" autoComplete="new-password" />
                {form.password && <>
                  <div className="rg-bar"><div className="rg-bar-fill" style={{width:(pwdStr()/5*100)+"%",background:SC[pwdStr()]}}/></div>
                  <div className="rg-str" style={{color:SC[pwdStr()]}}>{SL[pwdStr()]}</div>
                </>}
              </div>
              <div className="rg-field">
                <label className="rg-label">Confirm Password</label>
                <input className="rg-input" name="confirm" type="password" value={form.confirm} onChange={handle} placeholder="Repeat password" autoComplete="new-password" />
                {form.confirm && <div style={{fontSize:12,marginTop:4,color:form.confirm===form.password?"#0ECB81":"#ef4444"}}>
                  {form.confirm===form.password ? "✓ Passwords match" : "✗ Passwords do not match"}
                </div>}
              </div>
              <button className="rg-btn" onClick={nextStep}>Continue →</button>
            </>}

            {/* OTP VERIFICATION */}
            {step === 0 && otpSent && !otpVerified && <>
              <div className="rg-title">Verify your email</div>
              <p className="rg-sub">We sent a 6-digit code to <strong>{form.email}</strong></p>
              <div className="rg-field" style={{marginTop:24}}>
                <label className="rg-label">Verification Code</label>
                <input className="rg-input" type="text" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/[^0-9]/g,''))} placeholder="000000" style={{fontSize:24,letterSpacing:8,textAlign:'center'}} autoFocus />
              </div>
              {otpError && <div className="rg-err">⚠️ {otpError}</div>}
              <button className="rg-btn" onClick={verifyOtp} disabled={otpLoading || otp.length !== 6} style={{marginTop:16}}>{otpLoading ? 'Verifying...' : 'Verify Email →'}</button>
              <button className="rg-btn" style={{background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:13,marginTop:8,cursor:'pointer'}} onClick={sendOtp} disabled={otpLoading}>Resend code</button>
              <button className="rg-btn rg-btn-ghost" style={{marginTop:8}} onClick={() => setOtpSent(false)}>← Back</button>
            </>}
            {/* STEP 1 — Personal */}
            {step === 1 && <>
              <div className="rg-title">Personal details</div>
              <p className="rg-sub">Required under EU AML/KYC regulation (AMLD6).</p>
              <div className="rg-row">
                <div className="rg-field"><label className="rg-label">Country</label><select className="rg-input" name="country" value={form.country} onChange={handle} style={{appearance:"none",cursor:"pointer"}}><option value="">Select country</option>{COUNTRIES.map(c=><option key={c.code} value={c.name}>{c.name}</option>)}</select></div>
              </div>
              <div className="rg-field">
                <label className="rg-label">Phone Number</label>
                <div className="rg-phone-row">
                  <select className="rg-input" name="dialCode" value={form.dialCode} onChange={handle} style={{appearance:"none",cursor:"pointer"}}>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.dial}>{c.name} {c.dial}</option>
                    ))}
                  </select>
                  <input className="rg-input" name="phone" type="tel" value={form.phone} onChange={handle} placeholder="Phone number" autoComplete="tel" />
                </div>
              </div>
              <div className="rg-field">
                <label className="rg-label">Date of Birth</label>
                <input className="rg-input" name="dob" type="date" value={form.dob} onChange={handle}
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} />
                <div style={{fontSize:11,color:"rgba(255,255,255,0.28)",marginTop:4}}>You must be 18 or older to invest.</div>
              </div>
              <div className="rg-two">
                <button className="rg-btn rg-btn-ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="rg-btn" onClick={nextStep}>Continue →</button>
              </div>
            </>}

            {/* STEP 2 — Agreements */}
            {step === 2 && <>
              <div className="rg-title">Review & agree</div>
              <p className="rg-sub">Please read and accept our terms before creating your account.</p>
              <label className="rg-check">
                <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handle} />
                <span className="rg-check-txt">
                  I agree to the <Link href="/terms" target="_blank">Terms of Service</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link> of Nextoken Capital UAB, a company registered in Lithuania , registered in Lithuania.
                </span>
              </label>
              <label className="rg-check">
                <input type="checkbox" name="agreeRisk" checked={form.agreeRisk} onChange={handle} />
                <span className="rg-check-txt">
                  I have read the <Link href="/risk" target="_blank">Risk Disclosure</Link> and <Link href="/aml" target="_blank">AML Policy</Link>. I understand that tokenized asset investments involve significant risk and I may lose my invested capital.
                </span>
              </label>
              <div className="rg-reg-note">
                🏛️ <strong style={{color:"rgba(255,255,255,0.7)"}}>Nextoken Capital UAB</strong> holds an EMI license and MiCA CASP authorization from the Lithuanian authorities. All investors must complete Sumsub KYC before investing. Your identity documents are stored securely and processed under EU GDPR.
              </div>
              <div className="rg-two">
                <button className="rg-btn rg-btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="rg-btn" disabled={!form.agreeTerms || !form.agreeRisk || loading} onClick={submitRegistration}>
                  {loading ? <><div className="rg-spin" /> Creating...</> : "Create Account →"}
                </button>
              </div>
            </>}

            {/* STEP 3 — Done */}
            {step === 3 && (
              <div className="rg-done">
                <div className="rg-done-ico">🎉</div>
                <div className="rg-done-title">Account Created!</div>
                <p className="rg-done-sub">
                  Welcome to Nextoken Capital, <strong style={{color:"#fff"}}>{form.firstName}</strong>!<br />
                  A confirmation has been sent to <strong style={{color:"#fff"}}>{form.email}</strong>.
                </p>
                <div className="rg-done-kyc">
                  <div className="rg-done-kyc-title">⚠️ Next step: Complete KYC verification</div>
                  <p className="rg-done-kyc-sub">
                    You must verify your identity before you can invest. This takes 2–5 minutes via Sumsub. You will need a government-issued photo ID.
                  </p>
                </div>
                <button className="rg-btn" style={{marginBottom:10}} onClick={() => router.push("/kyc")}>
                  Start KYC Verification →
                </button>
                <button className="rg-btn" style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.1)"}} onClick={() => router.push(form.role === "issuer" ? "/issuer-dashboard" : "/dashboard")}>
                  Skip for now — Go to Dashboard
                </button>
              </div>
            )}
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