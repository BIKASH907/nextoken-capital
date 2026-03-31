import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SECTIONS = [
  { id:"1", title:"Our Commitment", content:"Nextoken Capital UAB is committed to the highest standards of Anti-Money Laundering (AML) and Counter-Terrorist Financing (CTF) compliance. We are subject to the EU AML Directives (AMLD4, AMLD5, AMLD6), the Lithuanian Law on the Prevention of Money Laundering and Terrorist Financing, and FATF recommendations for virtual asset service providers." },
  { id:"2", title:"Know Your Customer (KYC)", content:"All users must complete identity verification before investing or issuing assets on the platform. We verify: full legal name; date of birth; nationality and country of residence; government-issued photo ID (passport, national ID, or driver's license); and proof of address for higher-risk profiles. KYC is powered by Sumsub, a regulated identity verification provider." },
  { id:"3", title:"Risk-Based Approach", content:"We apply a risk-based approach to customer due diligence. Standard due diligence applies to most customers. Enhanced due diligence is applied to: politically exposed persons (PEPs); customers from high-risk jurisdictions as identified by FATF; customers with complex ownership structures; and transactions above defined thresholds." },
  { id:"4", title:"Transaction Monitoring", content:"We continuously monitor transactions on the platform for suspicious activity. Our monitoring systems flag: unusual transaction patterns; transactions inconsistent with a customer's profile; transactions involving high-risk jurisdictions; and rapid movement of funds without apparent economic purpose. Flagged transactions are reviewed by our compliance team." },
  { id:"5", title:"Suspicious Activity Reporting", content:"When we identify suspicious activity, we are required by law to file a Suspicious Activity Report (SAR) with the Financial Crime Investigation Service (FNTT) of Lithuania. We are prohibited by law from informing the customer that a report has been made. We cooperate fully with law enforcement agencies upon receipt of a valid legal request." },
  { id:"6", title:"Prohibited Jurisdictions", content:"We do not provide services to residents or entities from jurisdictions subject to comprehensive EU or UN sanctions, including but not limited to: North Korea, Iran, Russia (for certain services), Belarus, and other jurisdictions on the FATF blacklist or EU high-risk third country list. This list is updated regularly in line with regulatory changes." },
  { id:"7", title:"Source of Funds", content:"For investments above certain thresholds, we may request evidence of the source of funds, including: employment income documentation; business ownership or income records; inheritance or gift documentation; or proceeds from asset sales. We reserve the right to refuse transactions where the source of funds cannot be satisfactorily verified." },
  { id:"8", title:"Record Keeping", content:"We retain KYC and AML records for a minimum of 5 years after the end of the business relationship, in compliance with EU AML Directives. Records are stored securely and accessed only by registered compliance personnel." },
  { id:"9", title:"Training and Governance", content:"Our AML Compliance Officer oversees all AML/CTF activities and reports directly to senior management. All staff receive regular AML training. Our AML programme is reviewed annually and updated to reflect regulatory changes and emerging risks." },
  { id:"10", title:"Contact", content:"To report suspicious activity or for AML compliance enquiries, contact our Compliance Officer at compliance@nextokencapital.com. For urgent matters, you may also contact us by post at: Nextoken Capital UAB, Gynėjų g. 14, Vilnius 01109, Lithuania." },
];

export default function AMLPage() {
  return (
    <>
      <Head>
        <title>AML Policy — Nextoken Capital</title>
        <meta name="description" content="Anti-Money Laundering Policy for Nextoken Capital UAB, registered in Lithuania." />
      </Head>
      <Navbar />
      <style>{`
        .lp{min-height:100vh;background:#0B0E11;padding-top:64px}
        .lp-hero{padding:52px 20px 36px;border-bottom:1px solid rgba(255,255,255,0.07)}
        .lp-hero-inner{max-width:860px;margin:0 auto}
        .lp-tag{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
        .lp-h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#fff;letter-spacing:-1px;margin-bottom:10px}
        .lp-meta{font-size:13px;color:rgba(255,255,255,0.35)}
        .lp-body{max-width:860px;margin:0 auto;padding:40px 20px 72px;display:grid;grid-template-columns:200px 1fr;gap:40px;align-items:start}
        .lp-toc{position:sticky;top:84px}
        .lp-toc-title{font-size:11px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1px;margin-bottom:14px}
        .lp-toc a{display:block;font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none;padding:5px 0;border-left:2px solid rgba(255,255,255,0.08);padding-left:10px;transition:all .15s;margin-bottom:2px}
        .lp-toc a:hover{color:#F0B90B;border-color:#F0B90B}
        .lp-section{margin-bottom:36px;padding-bottom:36px;border-bottom:1px solid rgba(255,255,255,0.07)}
        .lp-section:last-child{border-bottom:none}
        .lp-section-num{font-size:11px;font-weight:700;color:#F0B90B;margin-bottom:6px}
        .lp-section-title{font-size:16px;font-weight:800;color:#fff;margin-bottom:12px}
        .lp-section-text{font-size:14px;color:rgba(255,255,255,0.55);line-height:1.85}
        .lp-footer-links{display:flex;gap:16px;flex-wrap:wrap;margin-top:40px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.07)}
        .lp-footer-links a{font-size:13px;color:#F0B90B;text-decoration:none}
        @media(max-width:768px){.lp-body{grid-template-columns:1fr}.lp-toc{display:none}}
      `}</style>
      <div className="lp">
        <div className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-tag">Legal</div>
            <h1 className="lp-h1">AML Policy</h1>
            <p className="lp-meta">Last updated: March 1, 2026 · Nextoken Capital UAB · FATF Aligned · Lithuania Registered</p>
          </div>
        </div>
        <div className="lp-body">
          <div className="lp-toc">
            <div className="lp-toc-title">Contents</div>
            {SECTIONS.map(s => <a key={s.id} href={`#s${s.id}`}>{s.id}. {s.title}</a>)}
          </div>
          <div>
            {SECTIONS.map(s => (
              <div key={s.id} id={`s${s.id}`} className="lp-section">
                <div className="lp-section-num">Section {s.id}</div>
                <div className="lp-section-title">{s.title}</div>
                <p className="lp-section-text">{s.content}</p>
              </div>
            ))}
            <div className="lp-footer-links">
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/risk">Risk Disclosure</Link>
              <Link href="/contact">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}