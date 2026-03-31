import Link from "next/link";
import { useState } from "react";

const S = {
  page:  { minHeight:"100vh", background:"#0B0E11", color:"rgba(255,255,255,0.85)", fontFamily:"'DM Sans',system-ui,sans-serif" },
  sec:   { maxWidth:1200, margin:"0 auto", padding:"72px 32px" },
  h2:    { fontFamily:"Syne,sans-serif", fontSize:"clamp(26px,4vw,44px)", fontWeight:800, color:"rgba(255,255,255,0.85)", margin:"0 0 14px", letterSpacing:"-0.5px" },
  lbl:   { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:10, display:"block" },
  sub:   { fontSize:16, color:"rgba(255,255,255,0.5)", fontWeight:300, maxWidth:620, lineHeight:1.75, margin:"0 0 44px" },
  card:  { background:"#0B0E11", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:28, transition:"all 0.2s" },
  gold:  { padding:"13px 30px", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  out:   { padding:"13px 30px", borderRadius:10, background:"transparent", color:"#F0B90B", fontSize:14, fontWeight:600, border:"1px solid rgba(240,185,11,0.35)", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  badge: { display:"inline-flex", alignItems:"center", gap:8, padding:"5px 16px", borderRadius:20, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" },
};

const frameworks = [
  {
    icon:"⚖️", color:"#8b5cf6",
    title:"MiCA — Markets in Crypto-Assets",
    region:"European Union",
    status:"Compliant",
    desc:"Nextoken Capital operates in full compliance with the EU Markets in Crypto-Assets Regulation. As a regulated CASP (Crypto-Asset Service Provider), we maintain capital requirements, conduct regular audits, and publish transparent white papers for all tokenized asset offerings.",
    points:["CASP license maintained","Capital adequacy requirements met","Mandatory white paper publication","Consumer protection standards enforced","Regular regulatory reporting to Bank of Lithuania"],
  },
  {
    icon:"🏦", color:"#F0B90B",
    title:"Bank of Lithuania Supervision",
    region:"Lithuania / EU",
    status:"Supervised",
    desc:"Nextoken Capital UAB is registered and directly supervised by the Bank of Lithuania, the national financial regulator. This provides EU-wide passporting rights, enabling compliant operations across all 27 EU member states without additional licenses.",
    points:["Direct supervisory relationship","EU passporting rights across 27 member states","Annual compliance audits","Mandatory incident reporting","Consumer complaint resolution framework"],
  },
  {
    icon:"🌍", color:"#0ECB81",
    title:"FATF Recommendations",
    region:"Global",
    status:"Compliant",
    desc:"We comply with all 40 FATF (Financial Action Task Force) recommendations for virtual asset service providers (VASPs). This includes the Travel Rule for cross-border transfers, transaction monitoring, suspicious activity reporting, and enhanced due diligence for high-risk jurisdictions.",
    points:["Travel Rule compliance for cross-border transfers","Suspicious activity reporting (SAR) framework","Risk-based AML/CFT approach","High-risk jurisdiction enhanced due diligence","VASP registration maintained"],
  },
  {
    icon:"🔐", color:"#38bdf8",
    title:"ERC-3643 Token Standard",
    region:"On-Chain",
    status:"Implemented",
    desc:"All asset tokens issued on Nextoken use the ERC-3643 standard — the institutional-grade framework for regulated asset tokens on Ethereum. Compliance is enforced at the smart contract level, meaning non-compliant transfers are blocked automatically without human intervention.",
    points:["On-chain KYC/AML enforcement via smart contracts","Automatic transfer blocking for non-whitelisted wallets","Jurisdiction-based transfer restrictions","Freezing and recovery mechanisms for court orders","Full on-chain audit trail for all transfers"],
  },
  {
    icon:"🪪", color:"#a78bfa",
    title:"AML / KYC — Sumsub Integration",
    region:"Global",
    status:"Operational",
    desc:"All investors and issuers on Nextoken undergo identity verification through Sumsub, a leading global KYC/AML provider. We apply risk-based due diligence proportionate to transaction size and investor profile — from standard KYC to enhanced due diligence (EDD) for institutional clients.",
    points:["Automated identity verification in 180+ countries","Document verification and liveness detection","PEP and sanctions screening (global watchlists)","Ongoing monitoring and re-verification triggers","Enhanced due diligence (EDD) for institutional investors"],
  },
  {
    icon:"🛡", color:"#fb923c",
    title:"Information Security Standards",
    region:"Global",
    status:"Certified",
    desc:"Nextoken's information security management system follows ISO 27001 standards, the international standard for data protection and cybersecurity. We are working toward formal certification. This covers data encryption, access controls, incident response, business continuity, and third-party vendor risk management.",
    points:["Annual third-party security audits","AES-256 encryption for data at rest","TLS 1.3 for all data in transit","Multi-factor authentication enforced","Penetration testing every 6 months"],
  },
];

const jurisdictions = [
  { flag:"🇪🇺", name:"European Union",    framework:"MiCA · GDPR · AMLD6",             access:"Full",       color:"#8b5cf6" },
  { flag:"🇬🇧", name:"United Kingdom",    framework:"FCA Aligned · UK GDPR",           access:"Full",       color:"#38bdf8" },
  { flag:"🇸🇬", name:"Singapore",         framework:"MAS Compatible · PS Act",          access:"Full",       color:"#0ECB81" },
  { flag:"🇦🇪", name:"UAE / Dubai",       framework:"VARA · DIFC · ADGM",              access:"Full",       color:"#F0B90B" },
  { flag:"🇺🇸", name:"United States",     framework:"Reg D · Reg S · Accredited Only", access:"Limited",    color:"#a78bfa" },
  { flag:"🇨🇭", name:"Switzerland",       framework:"FINMA · DLT Act",                 access:"Full",       color:"#ef4444" },
  { flag:"🇮🇳", name:"India",             framework:"GIFT City IFSC · SEBI Aligned",   access:"Full",       color:"#fb923c" },
  { flag:"🇭🇰", name:"Hong Kong",         framework:"SFC · VASP Licensed Pathway",     access:"Full",       color:"#0ECB81" },
  { flag:"🇦🇺", name:"Australia",         framework:"AUSTRAC · ASIC Compatible",       access:"Full",       color:"#fbbf24" },
  { flag:"🇨🇦", name:"Canada",            framework:"FINTRAC · CSA Aligned",           access:"Full",       color:"#60a5fa" },
  { flag:"🇧🇷", name:"Brazil",            framework:"CVM · Banco Central",             access:"Limited",    color:"#34d399" },
  { flag:"🇯🇵", name:"Japan",             framework:"FSA · JVCEA Member",              access:"Full",       color:"#f472b6" },
];

const faqs = [
  { q:"Is Nextoken Capital regulated?",                                   a:"Yes. Nextoken Capital UAB is directly supervised by the Bank of Lithuania under EU financial regulations. We operate as a regulated Crypto-Asset Service Provider (CASP) under MiCA and maintain full compliance with EU AML/CFT directives." },
  { q:"How is investor money protected?",                                  a:"Investor funds are held in segregated accounts separate from Nextoken's operational accounts. We maintain mandatory capital reserves as required by the Bank of Lithuania and carry professional indemnity insurance coverage." },
  { q:"What happens if Nextoken ceases operations?",                       a:"As a regulated entity, Nextoken maintains a documented wind-down plan approved by the Bank of Lithuania. Investor tokens are held in self-custody wallets — Nextoken cannot access or freeze investor assets without a court order. The ERC-3643 smart contracts continue to function independently." },
  { q:"How does on-chain KYC enforcement work?",                           a:"Every investor is whitelisted on-chain after completing KYC verification. The ERC-3643 smart contract checks eligibility on every transfer — if the receiving wallet is not whitelisted, the transfer is automatically rejected. This means compliance is enforced 24/7 without manual oversight." },
  { q:"Are US investors allowed to participate?",                          a:"US persons may participate through applicable exemptions including Regulation D (Rule 506(b) and 506(c)) for accredited investors and Regulation S for offshore transactions. All US-linked investments require enhanced KYC and accredited investor verification." },
  { q:"How do you handle data privacy and GDPR?",                          a:"We are fully GDPR compliant. All personal data is processed lawfully, stored in EU-based servers, and protected under AES-256 encryption. Investors have the right to access, rectify, and delete their personal data. KYC data is handled by Sumsub under a separate data processing agreement." },
  { q:"What is the Travel Rule and how do you comply?",                    a:"The FATF Travel Rule requires VASPs to share sender and recipient information for crypto transfers above certain thresholds. We use an automated Travel Rule solution to collect, verify, and transmit required originator and beneficiary information for all qualifying transactions." },
  { q:"How are suspicious transactions monitored?",                        a:"We run continuous transaction monitoring using automated AML screening tools. All transactions are screened against global sanctions lists (OFAC, EU, UN), PEP databases, and adverse media. Suspicious activity reports (SARs) are filed with the Financial Intelligence Unit (FIU) of Lithuania as required." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px", background:"#0B0E11", border:"none", color:"rgba(255,255,255,0.85)", fontSize:15, fontWeight:500, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
        <span>{q}</span>
        <span style={{ color:"#F0B90B", fontSize:22, flexShrink:0, marginLeft:16 }}>{open ? "−" : "+"}</span>
      </button>
      {open && <div style={{ padding:"0 22px 20px", background:"#0B0E11" }}><p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8, margin:0 }}>{a}</p></div>}
    </div>
  );
}

export default function CompliancePage() {
  const [activeFramework, setActiveFramework] = useState(0);

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
      <div style={{ position:"relative", padding:"96px 32px 72px", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 900px 500px at 50% -40px,rgba(240,185,11,0.12) 0%,transparent 70%),radial-gradient(ellipse 500px 400px at 80% 90%,rgba(99,102,241,0.05) 0%,transparent 60%)", pointerEvents:"none" }} />
        <div style={{ ...S.badge, marginBottom:26 }}>
          <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
          Regulatory Compliance
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,6vw,72px)", fontWeight:800, lineHeight:1.04, letterSpacing:"-2px", color:"rgba(255,255,255,0.85)", maxWidth:900, margin:"0 auto 22px" }}>
          Compliance at Every<br /><span style={{ color:"#F0B90B" }}>Layer of the Stack</span>
        </h1>
        <p style={{ fontSize:18, fontWeight:300, color:"rgba(255,255,255,0.5)", maxWidth:660, margin:"0 auto 40px", lineHeight:1.75 }}>
          Nextoken Capital is pursuing regulation by the Bank of Lithuania, designed for MiCA compliance, FATF aligned, and follows ISO 27001 standards — with on-chain enforcement via ERC-3643. Compliance is not a checkbox. It is our marketplace infrastructure.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:48 }}>
          <Link href="/register"      style={S.gold}>Start Buying</Link>
          <Link href="/institutional" style={S.out}>Institutional Access</Link>
        </div>
        {/* Compliance badges */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center" }}>
          {[
            { icon:"🏦", t:"Bank of Lithuania" },
            { icon:"⚖️", t:"MiCA Compliant"    },
            { icon:"🌍", t:"FATF Aligned"       },
            { icon:"🔐", t:"ERC-3643"           },
            { icon:"🛡", t:"Security Standards"          },
            { icon:"🪪", t:"Sumsub KYC"         },
            { icon:"📋", t:"GDPR"               },
          ].map(b => (
            <span key={b.t} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.10)", background:"rgba(255,255,255,0.03)", fontSize:12.5, color:"rgba(255,255,255,0.6)", fontWeight:600 }}>
              {b.icon} {b.t}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ margin:"0 32px", borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#0B0E11", display:"flex", flexWrap:"wrap" }}>
        {[{v:"6",l:"Regulatory Frameworks"},{v:"180+",l:"Jurisdictions"},{v:"100%",l:"On-Chain Enforcement"},{v:"24/7",l:"Transaction Monitoring"},{v:"Security Standards",l:"Security Certified"},{v:"T+0",l:"Compliant Settlement"}].map((s,i,arr) => (
          <div key={s.l} style={{ flex:1, minWidth:120, padding:"24px 20px", textAlign:"center", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.07)":"none" }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#F0B90B" }}>{s.v}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* FRAMEWORKS — Interactive */}
      <div style={S.sec}>
        <span style={S.lbl}>Regulatory Frameworks</span>
        <h2 style={S.h2}>Our Compliance Infrastructure</h2>
        <p style={S.sub}>Six interlocking regulatory frameworks ensuring Nextoken operates to the highest legal standards across every jurisdiction we serve.</p>

        <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:20, alignItems:"flex-start" }}>
          {/* Sidebar tabs */}
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {frameworks.map((f,i) => (
              <button key={f.title} onClick={() => setActiveFramework(i)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderRadius:12, border:"1px solid "+(i===activeFramework?"rgba(240,185,11,0.4)":"rgba(255,255,255,0.07)"), background:i===activeFramework?"rgba(240,185,11,0.07)":"#0B0E11", cursor:"pointer", textAlign:"left", fontFamily:"inherit", transition:"all 0.15s" }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize:12.5, fontWeight:700, color:i===activeFramework?"#F0B90B":"rgba(255,255,255,0.85)", lineHeight:1.3 }}>{f.title.split("—")[0].trim()}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:2 }}>{f.region}</div>
                </div>
                <span style={{ marginLeft:"auto", padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"rgba(34,197,94,0.1)", color:"#0ECB81", border:"1px solid rgba(34,197,94,0.2)", flexShrink:0 }}>{f.status}</span>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div style={{ ...S.card, border:"1px solid rgba(240,185,11,0.2)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
              <div style={{ width:56, height:56, borderRadius:14, background:"rgba(240,185,11,0.10)", border:"1px solid rgba(240,185,11,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>
                {frameworks[activeFramework].icon}
              </div>
              <div>
                <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:800, color:frameworks[activeFramework].color, margin:"0 0 4px" }}>{frameworks[activeFramework].title}</h3>
                <div style={{ display:"flex", gap:8 }}>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>{frameworks[activeFramework].region}</span>
                  <span style={{ padding:"1px 8px", borderRadius:20, fontSize:10.5, fontWeight:700, background:"rgba(34,197,94,0.1)", color:"#0ECB81", border:"1px solid rgba(34,197,94,0.2)" }}>{frameworks[activeFramework].status}</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize:14.5, color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:24 }}>{frameworks[activeFramework].desc}</p>
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:20 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", margin:"0 0 14px" }}>Key Requirements Met</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {frameworks[activeFramework].points.map(p => (
                  <div key={p} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                    <span style={{ width:20, height:20, borderRadius:"50%", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", display:"flex", alignItems:"center", justifyContent:"center", color:"#0ECB81", fontSize:11, fontWeight:800, flexShrink:0, marginTop:1 }}>✓</span>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JURISDICTIONS */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <span style={S.lbl}>Global Access</span>
          <h2 style={S.h2}>Jurisdiction Coverage</h2>
          <p style={S.sub}>Nextoken's legal framework enables compliant investor access across 180+ countries. Below are key supported jurisdictions and their applicable regulatory structures.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:14 }}>
            {jurisdictions.map(j => (
              <div key={j.name} style={{ ...S.card, display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ fontSize:32, flexShrink:0 }}>{j.flag}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:14.5, fontWeight:700, color:j.color, marginBottom:3 }}>{j.name}</div>
                  <div style={{ fontSize:11.5, color:"rgba(255,255,255,0.5)", lineHeight:1.5, marginBottom:6 }}>{j.framework}</div>
                  <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10.5, fontWeight:700, background:j.access==="Full"?"rgba(34,197,94,0.1)":"rgba(245,158,11,0.1)", color:j.access==="Full"?"#0ECB81":"#f59e0b", border:"1px solid "+(j.access==="Full"?"rgba(34,197,94,0.25)":"rgba(245,158,11,0.25)") }}>
                    {j.access} Access
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20, padding:18, borderRadius:12, border:"1px solid rgba(245,158,11,0.2)", background:"rgba(245,158,11,0.05)", display:"flex", gap:12, alignItems:"flex-start" }}>
            <span style={{ fontSize:20, flexShrink:0 }}>⚠️</span>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:0, lineHeight:1.7 }}>
              <strong style={{ color:"#f59e0b" }}>US Investors:</strong> Participation is restricted to accredited investors under Regulation D (Rule 506(b)/506(c)) or offshore offerings under Regulation S. All US-linked investors require enhanced KYC and accredited investor verification. Contact our compliance team for details.
            </p>
          </div>
        </div>
      </div>

      {/* ON-CHAIN COMPLIANCE */}
      <div style={S.sec}>
        <span style={S.lbl}>On-Chain Enforcement</span>
        <h2 style={S.h2}>Compliance Is Code</h2>
        <p style={S.sub}>Unlike traditional compliance which relies on manual oversight, Nextoken enforces regulatory requirements directly in smart contract code via ERC-3643 — automatically, 24/7, with zero human intervention required.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16 }}>
          {[
            { icon:"🔐", t:"Whitelist Enforcement",    d:"Only KYC-verified, jurisdiction-eligible wallets can receive token transfers. Non-compliant transfers are rejected at the contract level." },
            { icon:"🚫", t:"Auto Transfer Blocking",   d:"Any attempt to transfer tokens to a non-whitelisted address is automatically blocked — no manual review needed, no delays." },
            { icon:"❄️", t:"Freeze & Recovery",        d:"Regulatory compliance orders, court orders, or fraud cases can trigger address freezing and asset recovery through contract-level controls." },
            { icon:"🌍", t:"Jurisdiction Controls",    d:"Transfer rules can be scoped by investor jurisdiction — enabling automatic blocking of transfers to restricted regions like sanctioned countries." },
            { icon:"📊", t:"Immutable Audit Trail",    d:"Every token issuance, transfer, and compliance event is permanently recorded on-chain — providing a tamper-proof audit trail for regulators." },
            { icon:"🔄", t:"Real-Time Compliance",     d:"Investor KYC status is checked on every transfer in real time. Expired or revoked KYC automatically prevents further transactions." },
          ].map(c => (
            <div key={c.t} style={{ ...S.card }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{c.icon}</div>
              <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:14.5, fontWeight:700, color:"#F0B90B", marginBottom:8 }}>{c.t}</h4>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* INVESTOR PROTECTIONS */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <span style={S.lbl}>Buyer Protections</span>
          <h2 style={S.h2}>Your Rights as an Investor</h2>
          <p style={S.sub}>As a compliant platform, Nextoken must uphold specific buyer protection obligations under EU law. Here is what you are entitled to.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
            {[
              { icon:"💰", t:"Segregated Funds",         d:"Your investment funds are held in segregated accounts. Nextoken cannot use investor money for operational expenses." },
              { icon:"📋", t:"Mandatory Disclosure",      d:"All token offerings require a legally compliant white paper with full risk disclosures, financials, and investor rights." },
              { icon:"🔍", t:"Right to Information",      d:"You have the right to access all information about your investments, transactions, fees, and KYC data held about you." },
              { icon:"🏛", t:"Regulatory Recourse",       d:"Complaints can be escalated to the Bank of Lithuania if unresolved by Nextoken. EU investors have additional ADR rights." },
              { icon:"🗳", t:"Investor Rights",           d:"Security token holders retain the economic rights of the underlying asset including earnings distributions, interest, and voting where applicable." },
              { icon:"🔒", t:"Self-Custody Option",       d:"Tokens are held in your own wallet — Nextoken does not control your assets. Only a court order can trigger regulatory freeze." },
            ].map(c => (
              <div key={c.t} style={{ ...S.card }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{c.icon}</div>
                <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:8 }}>{c.t}</h4>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.65 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={S.sec}>
        <span style={S.lbl}>FAQ</span>
        <h2 style={{ ...S.h2, marginBottom:32 }}>Compliance FAQ</h2>
        {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
      </div>

      {/* CTA */}
      <div style={{ margin:"0 32px 64px", borderRadius:20, padding:"72px 48px", textAlign:"center", position:"relative", overflow:"hidden", border:"1px solid rgba(240,185,11,0.25)", background:"linear-gradient(135deg,rgba(240,185,11,0.08) 0%,rgba(99,102,241,0.05) 100%)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 700px 400px at 50% 0%,rgba(240,185,11,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <span style={S.lbl}>Questions About Compliance?</span>
          <h2 style={{ ...S.h2, marginBottom:14 }}>Talk to Our Compliance Team</h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.5)", fontWeight:300, maxWidth:520, margin:"0 auto 36px", lineHeight:1.75 }}>
            Our in-house compliance and legal team is available to answer questions from investors, issuers, and institutional partners about our regulatory framework.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/contact"      style={S.gold}>Contact Compliance Team</Link>
            <Link href="/institutional" style={S.out}>Institutional Onboarding</Link>
          </div>
          <p style={{ fontSize:11.5, color:"rgba(255,255,255,0.5)", marginTop:24, opacity:0.7 }}>
            Designed for EU Regulation · MiCA Compliance-Ready · FATF Aligned · ERC-3643 · Security Standards · GDPR
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"48px 32px 28px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:48, marginBottom:40 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <span style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:900, color:"#F0B90B", letterSpacing:2 }}>NXT</span>
                <div style={{ width:1, height:22, background:"rgba(240,185,11,0.25)" }} />
                <div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:13, fontWeight:800, letterSpacing:"0.15em", color:"#F0B90B" }}>NEXTOKEN</div>
                  <div style={{ fontSize:9, letterSpacing:"0.2em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>CAPITAL</div>
                </div>
              </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", maxWidth:260, lineHeight:1.75, marginBottom:16 }}>The regulated infrastructure for tokenized real-world assets. Registered in Lithuania.</p>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.05em" }}>MONITORED BY <a href="#" style={{ color:"#F0B90B", textDecoration:"none" }}>Bank of Lithuania</a></p>
            </div>
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:16 }}>Products</h5>
              {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:16 }}>Legal</h5>
              {[["Terms of Service","/terms"],["Privacy Policy","/privacy"],["Risk Disclosure","/risk"],["AML Policy","/aml"],["Compliance","/compliance"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13, color:"rgba(255,255,255,0.6)", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:20, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:10 }}>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", margin:0 }}>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.5)", opacity:0.6, margin:0 }}>This page is for informational purposes only and does not constitute legal or financial guidance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
