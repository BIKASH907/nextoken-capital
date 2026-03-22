const fs = require("fs");

const code = `import Link from "next/link";
import { useState } from "react";

const S = {
  page:  { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  sec:   { maxWidth:1200, margin:"0 auto", padding:"64px 32px" },
  h2:    { fontFamily:"Syne,sans-serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:800, color:"#e8e8f0", margin:"0 0 12px", letterSpacing:"-0.5px" },
  lbl:   { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:10, display:"block" },
  sub:   { fontSize:15, color:"#8a9bb8", fontWeight:300, maxWidth:600, lineHeight:1.75, margin:"0 0 36px" },
  card:  { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:28, transition:"all 0.2s" },
  gold:  { padding:"13px 30px", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  out:   { padding:"13px 30px", borderRadius:10, background:"transparent", color:"#F0B90B", fontSize:14, fontWeight:600, border:"1px solid rgba(240,185,11,0.35)", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  badge: { display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:20, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase" },
  input: { width:"100%", padding:"12px 16px", borderRadius:10, background:"#12121c", border:"1px solid rgba(255,255,255,0.10)", color:"#e8e8f0", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" },
};

const assetTypes = [
  { icon:"🏢", name:"Real Estate",        desc:"Tokenize commercial, residential, or industrial property. Enable fractional ownership and global investor access.", minSize:"EUR 500K", timeline:"4-8 weeks" },
  { icon:"⚡", name:"Energy & Infrastructure", desc:"Issue project finance tokens for solar, wind, hydro, and infrastructure assets. Automate yield distributions.", minSize:"EUR 1M",   timeline:"6-10 weeks" },
  { icon:"📈", name:"Equity & Shares",    desc:"Launch a blockchain IPO or tokenize existing company equity. ERC-3643 compliant with on-chain cap table management.", minSize:"EUR 250K", timeline:"4-8 weeks" },
  { icon:"💼", name:"Private Credit",     desc:"Tokenize loan portfolios, invoice finance, or structured credit instruments. Enable secondary market liquidity.", minSize:"EUR 500K", timeline:"3-6 weeks" },
  { icon:"🌱", name:"Green Assets",       desc:"Issue certified green bonds and carbon credit tokens. Attract ESG-focused investors from 30+ jurisdictions.", minSize:"EUR 250K", timeline:"4-8 weeks" },
  { icon:"🏛", name:"Funds & Alternatives",desc:"Tokenize hedge fund interests, PE fund allocations, and alternative investment vehicles for broader distribution.", minSize:"EUR 2M",   timeline:"8-12 weeks" },
];

const steps = [
  { n:"01", icon:"📋", t:"Submit Application",    b:"Complete the tokenization intake form. Describe your asset, target raise size, investor profile, and timeline." },
  { n:"02", icon:"⚖️", t:"Legal Structuring",     b:"Our legal team works with you to define the token structure, investor rights, jurisdiction, and documentation framework." },
  { n:"03", icon:"🔐", t:"Smart Contract Setup",  b:"We deploy your ERC-3643 compliant token contract with built-in KYC/AML enforcement, transfer restrictions, and on-chain compliance." },
  { n:"04", icon:"🪪", t:"KYC Whitelisting",      b:"Investor onboarding via Sumsub. Only verified, eligible investors are whitelisted on-chain — fully automated and FATF compliant." },
  { n:"05", icon:"🚀", t:"Launch Fundraise",      b:"Go live on the Nextoken platform. Investors browse, subscribe, and invest. Real-time progress tracking for you and your team." },
  { n:"06", icon:"🔄", t:"Secondary Liquidity",   b:"Eligible tokens progress to the Nextoken Exchange for peer-to-peer secondary trading among verified investors." },
];

const benefits = [
  { icon:"🌍", title:"Global Investor Access",    desc:"Reach 12,400+ verified investors across 30+ countries from a single regulated issuance platform." },
  { icon:"⚡", title:"Instant Settlement",        desc:"T+0 on-chain settlement. No clearing houses, no delays, no counterparty risk on subscription and distribution." },
  { icon:"🔐", title:"Built-in Compliance",       desc:"ERC-3643 enforces KYC/AML at the smart contract level. Transfers are blocked for non-whitelisted wallets automatically." },
  { icon:"📊", title:"Real-Time Cap Table",       desc:"On-chain shareholder registry updated with every transfer. Full transparency for issuers and regulatory audits." },
  { icon:"💰", title:"Lower Cost of Capital",     desc:"Eliminate intermediaries. Reduce issuance costs by up to 70% vs traditional securitization or IPO processes." },
  { icon:"🏦", title:"Institutional Grade",       desc:"Built to ISDA standards. Compatible with Fireblocks, Copper, and major institutional custody solutions." },
];

const faqs = [
  { q:"What assets can be tokenized on Nextoken?",           a:"Any real-world asset with legal ownership and cash flows can be tokenized — real estate, energy projects, equity, private credit, funds, and green assets. Our legal team will assess your specific asset structure during onboarding." },
  { q:"What is ERC-3643 and why does it matter?",            a:"ERC-3643 is the institutional-grade security token standard on Ethereum. It enforces KYC/AML compliance at the smart contract level — only verified, whitelisted investors can hold or transfer tokens. This makes tokenized assets legally compliant across jurisdictions." },
  { q:"How long does the tokenization process take?",        a:"Typically 4-12 weeks depending on asset type and legal complexity. Real estate and equity tokens can launch in 4-8 weeks. More complex structures like fund tokenization may take 8-12 weeks." },
  { q:"What are the minimum asset sizes?",                   a:"Minimum issuance sizes start from EUR 250,000 for equity and green assets, EUR 500,000 for real estate and credit, and EUR 1M+ for energy infrastructure and fund structures." },
  { q:"Is Nextoken regulated?",                              a:"Yes. Nextoken Capital UAB is supervised by the Bank of Lithuania under EU financial regulations. Our token standard is ERC-3643 compliant and we operate under the MiCA (Markets in Crypto-Assets) regulatory framework." },
  { q:"Can international issuers use the platform?",         a:"Yes. Nextoken supports issuers from any jurisdiction. We work with legal counsel in each jurisdiction to structure compliant token offerings — including Reg D/S exemptions for US-linked issuances, DIFC structures for UAE, and MAS-compatible structures for Singapore." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px", background:"#0d0d14", border:"none", color:"#e8e8f0", fontSize:14.5, fontWeight:500, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
        <span>{q}</span>
        <span style={{ color:"#F0B90B", fontSize:20, flexShrink:0, marginLeft:16 }}>{open ? "-" : "+"}</span>
      </button>
      {open && <div style={{ padding:"0 20px 20px", background:"#0d0d14" }}><p style={{ fontSize:13.5, color:"#8a9bb8", lineHeight:1.75, margin:0 }}>{a}</p></div>}
    </div>
  );
}

export default function TokenizePage() {
  const [form, setForm] = useState({ name:"", email:"", company:"", assetType:"", size:"", message:"" });
  const [submitted, setSubmitted] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div style={S.page}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse { animation: pulse 2s infinite; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#05060a; }
        ::-webkit-scrollbar-thumb { background:rgba(240,185,11,0.3); border-radius:3px; }
        input:focus, select:focus, textarea:focus { border-color: #F0B90B !important; }
        select option { background:#0d0d14; }
      \`}</style>

      {/* HERO */}
      <div style={{ position:"relative", padding:"100px 32px 80px", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 900px 500px at 50% -60px,rgba(240,185,11,0.13) 0%,transparent 70%),radial-gradient(ellipse 500px 400px at 80% 100%,rgba(99,102,241,0.06) 0%,transparent 60%)", pointerEvents:"none" }} />
        <div style={{ ...S.badge, marginBottom:28 }}>
          <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
          Asset Tokenization Platform
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,6vw,72px)", fontWeight:800, lineHeight:1.04, letterSpacing:"-2px", color:"#e8e8f0", maxWidth:900, margin:"0 auto 22px" }}>
          Tokenize Any Real-World<br /><span style={{ color:"#F0B90B" }}>Asset. Globally.</span>
        </h1>
        <p style={{ fontSize:18, fontWeight:300, color:"#8a9bb8", maxWidth:640, margin:"0 auto 40px", lineHeight:1.75 }}>
          Turn real estate, energy, equity, credit, and alternative assets into regulated digital tokens. Raise capital from 12,400+ verified investors across 30+ countries on Nextoken's compliant infrastructure.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <a href="#apply" style={S.gold}>Start Tokenizing</a>
          <a href="#how"   style={S.out}>How It Works</a>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:24, justifyContent:"center", marginTop:48, opacity:0.65 }}>
          {["ERC-3643 Compliant","Bank of Lithuania Supervised","MiCA Ready","30+ Jurisdictions","Sumsub KYC/AML"].map((b) => (
            <span key={b} style={{ fontSize:12.5, color:"#8a9bb8", fontWeight:600 }}>{b}</span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ margin:"0 32px", borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#0d0d14", display:"flex", flexWrap:"wrap" }}>
        {[{v:"EUR 140M+",l:"Assets Tokenized"},{v:"12,400+",l:"Verified Investors"},{v:"30+",l:"Jurisdictions"},{v:"4-12",l:"Weeks to Launch"},{v:"ERC-3643",l:"Token Standard"},{v:"T+0",l:"Settlement"}].map((s,i,arr) => (
          <div key={s.l} style={{ flex:1, minWidth:120, padding:"22px 20px", textAlign:"center", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.07)":"none" }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:"#F0B90B" }}>{s.v}</div>
            <div style={{ fontSize:11, color:"#8a9bb8", marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ASSET TYPES */}
      <div style={S.sec}>
        <span style={S.lbl}>What Can Be Tokenized</span>
        <h2 style={S.h2}>Supported Asset Classes</h2>
        <p style={S.sub}>Nextoken supports tokenization of a broad range of real-world assets — from property and energy to equity, credit, and alternative funds.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          {assetTypes.map((a) => (
            <div key={a.name}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor="rgba(240,185,11,0.3)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="none"; }}
              style={{ ...S.card, cursor:"default" }}>
              <div style={{ fontSize:32, marginBottom:14 }}>{a.icon}</div>
              <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#e8e8f0", marginBottom:8 }}>{a.name}</h3>
              <p style={{ fontSize:13.5, color:"#8a9bb8", lineHeight:1.7, marginBottom:16 }}>{a.desc}</p>
              <div style={{ display:"flex", gap:12 }}>
                <span style={{ fontSize:11.5, color:"#F0B90B", fontWeight:600 }}>Min: {a.minSize}</span>
                <span style={{ fontSize:11.5, color:"#8a9bb8" }}>Timeline: {a.timeline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{ background:"#0a0a10", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <span style={S.lbl}>Process</span>
          <h2 style={S.h2}>How Tokenization Works</h2>
          <p style={S.sub}>A proven 6-step process from asset intake to live secondary market trading — with full compliance and legal support at every stage.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                <div style={{ flexShrink:0 }}>
                  <div style={{ width:48, height:48, borderRadius:"50%", border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.10)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Syne,sans-serif", fontSize:14, fontWeight:700, color:"#F0B90B" }}>{s.n}</div>
                </div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:18 }}>{s.icon}</span>
                    <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#e8e8f0", margin:0 }}>{s.t}</h4>
                  </div>
                  <p style={{ fontSize:13, color:"#8a9bb8", lineHeight:1.7, margin:0 }}>{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BENEFITS */}
      <div style={S.sec}>
        <span style={S.lbl}>Why Nextoken</span>
        <h2 style={S.h2}>Built for Global Issuers</h2>
        <p style={S.sub}>Institutional-grade tokenization infrastructure that reduces cost, expands reach, and maintains full regulatory compliance worldwide.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
          {benefits.map((b) => (
            <div key={b.title} style={{ ...S.card }}>
              <div style={{ fontSize:30, marginBottom:12 }}>{b.icon}</div>
              <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#F0B90B", marginBottom:8 }}>{b.title}</h4>
              <p style={{ fontSize:13, color:"#8a9bb8", lineHeight:1.65 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COMPLIANCE */}
      <div style={{ background:"#0a0a10", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <span style={S.lbl}>Compliance</span>
          <h2 style={S.h2}>Regulatory Framework</h2>
          <p style={S.sub}>Every token issued on Nextoken is built on institutional-grade legal and compliance infrastructure — not just smart contracts.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
            {[
              { icon:"⚖️", t:"MiCA Compliant",       d:"EU Markets in Crypto-Assets Regulation. Supervised by Bank of Lithuania." },
              { icon:"🔐", t:"ERC-3643",              d:"On-chain KYC/AML enforcement. Transfer restrictions at smart contract level." },
              { icon:"🌍", t:"FATF / Travel Rule",    d:"Cross-border AML compliance. VASP registration and reporting." },
              { icon:"📋", t:"Sumsub KYC",            d:"Third-party identity verification for all investors and issuers." },
              { icon:"🛡", t:"ISO 27001",             d:"Enterprise security and data protection certification." },
              { icon:"🔍", t:"On-Chain Audit",        d:"Immutable transaction records. Full compliance transparency." },
            ].map((c) => (
              <div key={c.t} style={{ ...S.card, padding:20 }}>
                <div style={{ fontSize:24, marginBottom:10 }}>{c.icon}</div>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:13.5, fontWeight:700, color:"#F0B90B", marginBottom:6 }}>{c.t}</div>
                <div style={{ fontSize:12.5, color:"#8a9bb8", lineHeight:1.6 }}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* APPLICATION FORM */}
      <div id="apply" style={S.sec}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"flex-start" }}>

          {/* LEFT — Info */}
          <div>
            <span style={S.lbl}>Get Started</span>
            <h2 style={{ ...S.h2, marginBottom:16 }}>Start Your Tokenization Journey</h2>
            <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.75, marginBottom:28 }}>
              Fill in the form and our team will review your asset and respond within 1-2 business days with a tailored tokenization proposal.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { icon:"✅", t:"Free Initial Assessment",    d:"No commitment. We review your asset and provide a detailed feasibility report." },
                { icon:"⚖️", t:"Dedicated Legal Support",    d:"Our legal partners in EU, UAE, Singapore, and UK guide the structuring process." },
                { icon:"🚀", t:"4 Weeks to First Close",     d:"From application to live fundraise — our fastest clients launch in under 4 weeks." },
                { icon:"🌍", t:"Global Investor Network",    d:"Instant access to 12,400+ verified investors across 30+ countries on day one." },
              ].map((item) => (
                <div key={item.t} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <span style={{ fontSize:20, flexShrink:0, marginTop:2 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:"#e8e8f0", margin:"0 0 3px" }}>{item.t}</p>
                    <p style={{ fontSize:13, color:"#8a9bb8", margin:0 }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:32 }}>
            {submitted ? (
              <div style={{ textAlign:"center", padding:"40px 0" }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
                <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#e8e8f0", marginBottom:8 }}>Application Received!</h3>
                <p style={{ fontSize:14, color:"#8a9bb8", lineHeight:1.7 }}>Our team will review your asset and respond within 1-2 business days with a detailed tokenization proposal.</p>
                <div style={{ marginTop:20, padding:16, borderRadius:12, background:"rgba(240,185,11,0.06)", border:"1px solid rgba(240,185,11,0.2)" }}>
                  <p style={{ fontSize:13, color:"#F0B90B", fontWeight:600, margin:0 }}>Next step: Check your email for confirmation</p>
                </div>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:800, color:"#e8e8f0", marginBottom:20 }}>Tokenization Application</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>Full Name *</label>
                    <input name="name" required placeholder="Jane Smith" value={form.name} onChange={handle} style={S.input} />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>Email *</label>
                    <input name="email" type="email" required placeholder="jane@company.com" value={form.email} onChange={handle} style={S.input} />
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>Company / Project Name *</label>
                  <input name="company" required placeholder="Your company or project" value={form.company} onChange={handle} style={S.input} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>Asset Type *</label>
                    <select name="assetType" required value={form.assetType} onChange={handle} style={{ ...S.input, cursor:"pointer" }}>
                      <option value="">Select asset type</option>
                      <option>Real Estate</option>
                      <option>Energy & Infrastructure</option>
                      <option>Equity & Shares</option>
                      <option>Private Credit</option>
                      <option>Green Assets</option>
                      <option>Funds & Alternatives</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>Target Raise Size *</label>
                    <select name="size" required value={form.size} onChange={handle} style={{ ...S.input, cursor:"pointer" }}>
                      <option value="">Select range</option>
                      <option>EUR 250K - 500K</option>
                      <option>EUR 500K - 1M</option>
                      <option>EUR 1M - 5M</option>
                      <option>EUR 5M - 20M</option>
                      <option>EUR 20M - 50M</option>
                      <option>EUR 50M+</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>Tell us about your asset</label>
                  <textarea name="message" rows={4} placeholder="Describe your asset, current structure, and what you want to achieve..." value={form.message} onChange={handle} style={{ ...S.input, resize:"vertical" }} />
                </div>
                <button type="submit" style={{ ...S.gold, width:"100%", textAlign:"center" }}>
                  Submit Tokenization Application
                </button>
                <p style={{ fontSize:11.5, color:"#8a9bb8", textAlign:"center", marginTop:12 }}>
                  Free assessment. No commitment. Response within 1-2 business days.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background:"#0a0a10", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <span style={S.lbl}>FAQ</span>
          <h2 style={{ ...S.h2, marginBottom:28 }}>Tokenization FAQ</h2>
          {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin:"0 32px 64px", borderRadius:20, padding:"72px 48px", textAlign:"center", position:"relative", overflow:"hidden", border:"1px solid rgba(240,185,11,0.25)", background:"linear-gradient(135deg,rgba(240,185,11,0.08) 0%,rgba(99,102,241,0.06) 100%)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 700px 400px at 50% 0%,rgba(240,185,11,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <span style={S.lbl}>Ready to Tokenize?</span>
          <h2 style={{ ...S.h2, marginBottom:14 }}>Tokenize the World's Assets.<br />Starting With Yours.</h2>
          <p style={{ fontSize:16, color:"#8a9bb8", fontWeight:300, maxWidth:500, margin:"0 auto 36px", lineHeight:1.75 }}>
            Join 100+ issuers who have already launched tokenized assets on Nextoken Capital's regulated infrastructure.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="#apply" style={S.gold}>Apply Now — It is Free</a>
            <Link href="/institutional" style={S.out}>Institutional Access</Link>
          </div>
          <p style={{ fontSize:11.5, color:"#8a9bb8", marginTop:24, opacity:0.7 }}>
            Regulated by Bank of Lithuania · MiCA Compliant · ERC-3643 · ISO 27001
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"48px 32px 28px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:48, marginBottom:40 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <span style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:900, color:"#F0B90B", letterSpacing:2 }}>NXT</span>
                <div style={{ width:1, height:22, background:"rgba(240,185,11,0.25)" }} />
                <div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:13, fontWeight:800, letterSpacing:"0.15em", color:"#F0B90B" }}>NEXTOKEN</div>
                  <div style={{ fontSize:9, letterSpacing:"0.2em", color:"#8a9bb8", textTransform:"uppercase" }}>CAPITAL</div>
                </div>
              </div>
              <p style={{ fontSize:13, color:"#8a9bb8", maxWidth:240, lineHeight:1.7, marginBottom:16 }}>The regulated infrastructure for tokenized real-world assets. Registered in Lithuania.</p>
              <p style={{ fontSize:11, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em" }}>MONITORED BY <a href="#" style={{ color:"#F0B90B", textDecoration:"none" }}>Bank of Lithuania</a></p>
            </div>
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8", marginBottom:16 }}>Products</h5>
              {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"],["Institutional","/institutional"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13, color:"#b0b0c8", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:20, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:10 }}>
            <p style={{ fontSize:12, color:"#8a9bb8", margin:0 }}>2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
            <p style={{ fontSize:11, color:"#8a9bb8", opacity:0.6, margin:0 }}>Tokenization services subject to eligibility, jurisdiction, and regulatory approval.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync("pages/tokenize.js", code, "utf8");
console.log("Done! pages/tokenize.js — " + code.length + " chars");