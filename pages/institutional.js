import Link from "next/link";
import { useState } from "react";

const S = {
  page:  { minHeight:"100vh", background:"#0B0E11", color:"rgba(255,255,255,0.85)", fontFamily:"'DM Sans',system-ui,sans-serif" },
  sec:   { maxWidth:1200, margin:"0 auto", padding:"72px 32px" },
  h2:    { fontFamily:"Syne,sans-serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:800, color:"rgba(255,255,255,0.85)", margin:"0 0 14px", letterSpacing:"-0.5px" },
  lbl:   { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:10, display:"block" },
  sub:   { fontSize:16, color:"rgba(255,255,255,0.5)", fontWeight:300, maxWidth:600, lineHeight:1.75, margin:"0 0 40px" },
  card:  { background:"#0B0E11", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:28, transition:"all 0.2s" },
  gold:  { padding:"14px 32px", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block" },
  out:   { padding:"14px 32px", borderRadius:10, background:"transparent", color:"#F0B90B", fontSize:14, fontWeight:600, border:"1px solid rgba(240,185,11,0.35)", cursor:"pointer", textDecoration:"none", display:"inline-block" },
};

const regions = [
  { flag:"🇱🇹", name:"European Union",    note:"MiCA regulated · VASP registered · Lithuanian authorities supervised",  color:"#8b5cf6" },
  { flag:"🇸🇬", name:"Singapore",         note:"MAS-compatible structure · APAC gateway for tokenized RWA",         color:"#0ECB81" },
  { flag:"🇦🇪", name:"UAE / Dubai",       note:"DIFC & ADGM compatible · MENA investor access",                     color:"#F0B90B" },
  { flag:"🇬🇧", name:"United Kingdom",    note:"FCA-aligned compliance · Post-Brexit digital asset framework",       color:"#38bdf8" },
  { flag:"🇨🇭", name:"Switzerland",       note:"FINMA compatible · DLT Act jurisdiction · Crypto Valley access",    color:"#ef4444" },
  { flag:"🇺🇸", name:"United States",     note:"Reg D / Reg S exemptions · Accredited investor access",             color:"#a78bfa" },
  { flag:"🇮🇳", name:"India",             note:"GIFT City IFSC · SEBI-aligned digital asset access",                color:"#fb923c" },
  { flag:"🇭🇰", name:"Hong Kong",         note:"SFC licensed pathway · Type 1 & 7 regulated activities",            color:"#0ECB81" },
];

const tiers = [
  {
    name:"Professional",
    icon:"🏦",
    minAUM:"$1M+",
    color:"#8b5cf6",
    features:["Dedicated account manager","Priority KYC processing","Access to pre-IPO allocations","Custom reporting dashboard","Direct API access","Quarterly market briefings"],
    cta:"Apply Now",
  },
  {
    name:"Institutional",
    icon:"🏛",
    minAUM:"$10M+",
    color:"#F0B90B",
    features:["White-glove onboarding","Custom SAFT/SAFE structuring","Co-asset listings","Real-time cap table management","Bespoke compliance support","Monthly analyst calls","Multi-signature custody setup"],
    cta:"Contact Our Team",
    featured:true,
  },
  {
    name:"Sovereign / Fund",
    icon:"👑",
    minAUM:"$50M+",
    color:"#0ECB81",
    features:["Direct CEO access","Exclusive deal flow","Primary market allocation priority","Custom tokenization mandates","Regulatory liaison service","Multi-jurisdiction structuring","24/7 dedicated support line"],
    cta:"Schedule Call",
  },
];

const useCases = [
  { icon:"🏢", title:"Family Offices",        desc:"Diversify into tokenized real estate, infrastructure, and private equity with institutional-grade custody and reporting." },
  { icon:"📊", title:"Hedge Funds",            desc:"Access tokenized RWA strategies, secondary market liquidity, and structured yield products on compliant infrastructure." },
  { icon:"🏦", title:"Asset Managers",         desc:"Offer clients tokenized bond and equity exposure through a regulated, ERC-3643 compliant issuance and distribution platform." },
  { icon:"🌐", title:"Sovereign Wealth Funds", desc:"Deploy capital into infrastructure, green bonds, and emerging market assets with full regulatory transparency and on-chain audit." },
  { icon:"🏗",  title:"Real Estate Funds",     desc:"Tokenize property portfolios, automate distributions, and offer fractional ownership to a global investor base." },
  { icon:"⚡",  title:"Energy & Infrastructure",desc:"Issue project finance bonds and equity tokens for renewable energy and infrastructure with transparent fundraising progress." },
];

const stats = [
  { v:"$2B+",   l:"Addressable AUM Pipeline"  },
  { v:"30+",    l:"Jurisdictions Covered"      },
  { v:"ERC-3643",l:"Institutional Token Standard"},
  { v:"T+0",    l:"Settlement Finality"        },
  { v:"99.9%",  l:"Platform Uptime SLA"        },
  { v:"Enterprise",l:"Security Standards"  },
];

const faqs = [
  { q:"What regulatory framework does Nextoken operate under?",         a:"Nextoken Capital UAB is registered and supervised by the Lithuanian authorities under the EU regulatory framework. Our tokens comply with MiCA (Markets in Crypto-Assets Regulation) and use the ERC-3643 standard for institutional-grade transfer controls, KYC/AML enforcement, and jurisdictional restrictions at the smart contract level." },
  { q:"How is investor eligibility verified for institutional deals?",  a:"All institutional investors undergo enhanced due diligence (EDD) through our KYC/AML partner Sumsub, supplemented by FATF-compliant AML screening, entity verification, UBO (Ultimate Beneficial Owner) identification, and source of funds documentation." },
  { q:"Can non-EU institutions participate on the platform?",           a:"Yes. Nextoken supports investors from 30+ jurisdictions including Singapore, UAE, UK, Switzerland, India, and Hong Kong. We work with legal counsel in each jurisdiction to ensure compliant access through appropriate exemptions such as Reg D/S for US accredited investors." },
  { q:"What custody solutions are available for institutional clients?", a:"We support multi-signature custody arrangements, integration with regulated custodians such as Fireblocks and Copper, and direct wallet self-custody for institutions that prefer to manage their own private keys under a compliant framework." },
  { q:"What is the minimum purchase for institutional access?",       a:"Professional tier starts at $1M AUM. Institutional tier from $10M. Sovereign and Fund structures from $50M. Custom structures and co-investment arrangements are available for strategic partners." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px", background:"#0B0E11", border:"none", color:"rgba(255,255,255,0.85)", fontSize:15, fontWeight:500, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
        <span>{q}</span>
        <span style={{ color:"#F0B90B", fontSize:22, flexShrink:0, marginLeft:16 }}>{open ? "−" : "+"}</span>
      </button>
      {open && <div style={{ padding:"0 20px 20px", background:"#0B0E11" }}><p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.75, margin:0 }}>{a}</p></div>}
    </div>
  );
}

export default function InstitutionalPage() {
  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse { animation: pulse 2s infinite; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#05060a; }
        ::-webkit-scrollbar-thumb { background:rgba(240,185,11,0.3); border-radius:3px; }
      `}</style>

      
      {/* HERO */}
      <div style={{ position:"relative", padding:"100px 32px 80px", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 900px 500px at 50% -60px,rgba(240,185,11,0.12) 0%,transparent 70%),radial-gradient(ellipse 600px 400px at 80% 90%,rgba(99,102,241,0.06) 0%,transparent 60%)", pointerEvents:"none" }} />
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 16px", borderRadius:20, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:28 }}>
          <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
          Institutional & Professional Access
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,6vw,72px)", fontWeight:800, lineHeight:1.04, letterSpacing:"-2px", color:"rgba(255,255,255,0.85)", maxWidth:900, margin:"0 auto 22px" }}>
          Built for the World's<br /><span style={{ color:"#F0B90B" }}>Largest Capital Allocators</span>
        </h1>
        <p style={{ fontSize:18, fontWeight:300, color:"rgba(255,255,255,0.5)", maxWidth:640, margin:"0 auto 40px", lineHeight:1.75 }}>
          Nextoken Capital provides institutional-grade tokenized asset infrastructure for family offices, hedge funds, sovereign wealth funds, and asset managers across 30+ global jurisdictions.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <Link href="/register" style={S.gold}>Apply for Institutional Access</Link>
          <Link href="/contact"  style={S.out}>Schedule a Call</Link>
        </div>

        {/* Trust badges */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:24, justifyContent:"center", marginTop:48, opacity:0.7 }}>
          {["🏦 EU Regulatory Framework","⚖️ MiCA Compliant","🔐 ERC-3643 Token Standard","🌍 30+ Jurisdictions","🛡 Enterprise Security Standards"].map((b) => (
            <span key={b} style={{ fontSize:12.5, color:"rgba(255,255,255,0.5)", fontWeight:600 }}>{b}</span>
          ))}
        </div>
      </div>

      {/* STAT STRIP */}
      <div style={{ margin:"0 32px", borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#0B0E11", display:"flex", flexWrap:"wrap" }}>
        {stats.map((s,i,arr) => (
          <div key={s.l} style={{ flex:1, minWidth:130, padding:"24px 20px", textAlign:"center", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.07)":"none" }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:"#F0B90B" }}>{s.v}</div>
            <div style={{ fontSize:11.5, color:"rgba(255,255,255,0.5)", marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* USE CASES */}
      <div style={S.sec}>
        <span style={S.lbl}>Who We Serve</span>
        <h2 style={S.h2}>Global Institutional Use Cases</h2>
        <p style={S.sub}>From family offices to sovereign wealth funds — Nextoken's compliant infrastructure powers institutional capital deployment at scale, worldwide.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          {useCases.map((c) => (
            <div key={c.title}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor="rgba(240,185,11,0.3)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="none"; }}
              style={{ ...S.card, cursor:"default" }}>
              <div style={{ fontSize:32, marginBottom:14 }}>{c.icon}</div>
              <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:8 }}>{c.title}</h3>
              <p style={{ fontSize:13.5, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GLOBAL REACH */}
      <div style={{ background:"#0B0E11", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <span style={S.lbl}>Global Jurisdiction Coverage</span>
          <h2 style={S.h2}>Worldwide Regulatory Access</h2>
          <p style={S.sub}>Nextoken's legal and compliance infrastructure spans major financial jurisdictions globally — enabling institutional investors anywhere to access tokenized assets compliantly.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
            {regions.map((r) => (
              <div key={r.name} style={{ ...S.card, display:"flex", alignItems:"center", gap:16 }}>
                <span style={{ fontSize:36, flexShrink:0 }}>{r.flag}</span>
                <div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:r.color, marginBottom:4 }}>{r.name}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>{r.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TIERS */}
      <div style={S.sec}>
        <span style={S.lbl}>Access Tiers</span>
        <h2 style={S.h2}>Institutional Access Levels</h2>
        <p style={S.sub}>Three tiers of institutional access designed for different scales of capital deployment, from professional investors to sovereign mandates.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {tiers.map((t) => (
            <div key={t.name} style={{ ...S.card, border: t.featured ? "1px solid rgba(240,185,11,0.4)" : "1px solid rgba(255,255,255,0.07)", background: t.featured ? "linear-gradient(135deg,rgba(240,185,11,0.06) 0%,#0B0E11 100%)" : "#0B0E11", position:"relative" }}>
              {t.featured && <div style={{ position:"absolute", top:-1, left:"50%", transform:"translateX(-50%)", padding:"3px 16px", borderRadius:"0 0 10px 10px", background:"#F0B90B", color:"#000", fontSize:10, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase" }}>Most Popular</div>}
              <div style={{ fontSize:36, marginBottom:12, marginTop: t.featured ? 16 : 0 }}>{t.icon}</div>
              <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:800, color:t.color, marginBottom:4 }}>{t.name}</h3>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:20 }}>Min. AUM: <strong style={{ color:"rgba(255,255,255,0.85)" }}>{t.minAUM}</strong></div>
              <div style={{ marginBottom:24 }}>
                {t.features.map((f) => (
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color:t.color, fontSize:13, flexShrink:0 }}>✓</span>
                    <span style={{ fontSize:13.5, color:"rgba(255,255,255,0.6)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" style={{ display:"block", textAlign:"center", padding:"12px 0", borderRadius:10, background: t.featured ? "#F0B90B" : "transparent", color: t.featured ? "#000" : t.color, border: t.featured ? "none" : "1px solid "+t.color+"66", fontSize:14, fontWeight:700, textDecoration:"none" }}>
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* COMPLIANCE */}
      <div style={{ background:"#0B0E11", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <span style={S.lbl}>Compliance Infrastructure</span>
          <h2 style={S.h2}>Institutional-Grade Compliance</h2>
          <p style={S.sub}>Every layer of Nextoken's infrastructure is built for institutional compliance — from smart contract enforcement to legal documentation and regulatory reporting.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
            {[
              { icon:"⚖️", title:"MiCA Compliant",       desc:"Full compliance with EU Markets in Crypto-Assets Regulation. Regulated by Lithuanian authorities." },
              { icon:"🔐", title:"ERC-3643 Standard",    desc:"On-chain KYC/AML enforcement. Transfer restrictions and investor whitelisting at smart contract level." },
              { icon:"🌍", title:"FATF Compliant",       desc:"Travel Rule compliance, VASP registration, and cross-border reporting aligned with FATF recommendations." },
              { icon:"🛡", title:"Enterprise Security",  desc:"Information security management following international standards. Data protection and cybersecurity at enterprise grade." },
              { icon:"📋", title:"Sumsub KYC/AML",      desc:"Third-party identity verification with enhanced due diligence (EDD) for institutional onboarding." },
              { icon:"🔍", title:"On-Chain Audit Trail", desc:"Full transaction transparency with immutable audit logs. Real-time compliance monitoring and reporting." },
            ].map((c) => (
              <div key={c.title} style={{ ...S.card }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{c.icon}</div>
                <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:14.5, fontWeight:700, color:"#F0B90B", marginBottom:8 }}>{c.title}</h4>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={S.sec}>
        <span style={S.lbl}>Onboarding Process</span>
        <h2 style={S.h2}>Institutional Onboarding in 5 Steps</h2>
        <p style={S.sub}>Streamlined institutional onboarding with dedicated support from application to first investment.</p>
        <div style={{ position:"relative", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:32, marginTop:16 }}>
          <div style={{ position:"absolute", top:24, left:60, right:60, height:1, background:"linear-gradient(90deg,transparent,rgba(240,185,11,0.3),transparent)" }} />
          {[
            { n:"01", t:"Submit Application",    b:"Complete institutional onboarding form with entity details, AUM size, and investment objectives." },
            { n:"02", t:"Enhanced Due Diligence",b:"Our compliance team conducts EDD including UBO verification, source of funds, and entity documentation." },
            { n:"03", t:"Legal Documentation",   b:"Execute ISDA-standard agreements, subscription documents, and custody arrangements tailored to your jurisdiction." },
            { n:"04", t:"Wallet & Custody Setup",b:"Configure multi-signature custody, connect institutional wallets, and complete on-chain whitelisting via ERC-3643." },
            { n:"05", t:"Deploy Capital",         b:"Access primary issuances, secondary market, and bespoke deal flow through your dedicated institutional portal." },
          ].map((s) => (
            <div key={s.n}>
              <div style={{ width:48, height:48, borderRadius:"50%", border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.10)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#F0B90B", marginBottom:16, position:"relative", zIndex:1 }}>{s.n}</div>
              <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:8 }}>{s.t}</h4>
              <p style={{ fontSize:12.5, color:"rgba(255,255,255,0.5)", lineHeight:1.65, margin:0 }}>{s.b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background:"#0B0E11", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <span style={S.lbl}>FAQ</span>
          <h2 style={{ ...S.h2, marginBottom:28 }}>Institutional FAQ</h2>
          {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin:"0 32px 64px", borderRadius:20, padding:"72px 48px", textAlign:"center", position:"relative", overflow:"hidden", border:"1px solid rgba(240,185,11,0.25)", background:"linear-gradient(135deg,rgba(240,185,11,0.08) 0%,rgba(99,102,241,0.06) 100%)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 700px 400px at 50% 0%,rgba(240,185,11,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <span style={S.lbl}>Ready to Deploy Capital?</span>
          <h2 style={{ ...S.h2, marginBottom:14 }}>Start Your Institutional<br />Onboarding Today</h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.5)", fontWeight:300, maxWidth:500, margin:"0 auto 36px", lineHeight:1.75 }}>
            Join leading family offices, hedge funds, and asset managers already deploying capital through Nextoken Capital's compliant infrastructure.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/register" style={S.gold}>Apply for Access</Link>
            <Link href="/contact"  style={S.out}>Talk to Our Team</Link>
          </div>
          <p style={{ fontSize:11.5, color:"rgba(255,255,255,0.5)", marginTop:24, opacity:0.7 }}>
            MiCA Compliance-Ready · EU Regulatory Framework · ERC-3643 · Enterprise Security
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
                <div style={{ width:1, height:22, background:"rgba(240,185,11,0.3)" }} />
                <div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:13, fontWeight:800, letterSpacing:"0.15em", color:"#F0B90B" }}>NEXTOKEN</div>
                  <div style={{ fontSize:9, letterSpacing:"0.2em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>CAPITAL</div>
                </div>
              </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", maxWidth:260, lineHeight:1.75, marginBottom:16 }}>The compliant infrastructure for tokenized real-world assets. Registered in Lithuania.</p>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.05em" }}>MONITORED BY <a href="#" style={{ color:"#F0B90B", textDecoration:"none" }}>Lithuanian authorities</a></p>
            </div>
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:16 }}>Products</h5>
              {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13.5, color:"rgba(255,255,255,0.6)", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:20, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:10 }}>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:0 }}>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.5)", opacity:0.6, margin:0 }}>Institutional services are subject to eligibility, jurisdiction, and regulatory approval.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
