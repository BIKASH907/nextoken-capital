import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SECTIONS = [
  { id:"1", title:"Acceptance of Terms", content:"By accessing or using the Nextoken Capital platform, you agree to be bound by these Terms of Service. If you do not agree, you may not access or use the platform. These Terms constitute a legally binding agreement between you and Nextoken Capital UAB, a company registered in Lithuania." },
  { id:"2", title:"Eligibility", content:"You must be at least 18 years of age to use the platform. By using the platform, you represent that you are of legal age in your jurisdiction and have the legal capacity to enter into a binding agreement. The platform is not available to residents of jurisdictions where its use would be prohibited by applicable law." },
  { id:"3", title:"Regulated Services", content:"Nextoken Capital UAB is authorized as an Electronic Money Institution by the Bank of Lithuania and holds a MiCA CASP authorization. All services provided through the platform are subject to applicable EU financial regulation, including the Markets in Crypto-Assets Regulation (MiCA) and the EU DLT Pilot Regime." },
  { id:"4", title:"Account Registration", content:"To access certain features you must create an account and complete our KYC verification process. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account." },
  { id:"5", title:"Tokenized Assets", content:"The platform facilitates the issuance and trading of tokenized real-world assets, including real estate, bonds, and equity. All tokenized assets listed on the platform have undergone compliance review. Tokenized assets are subject to market risk, liquidity risk, and regulatory risk. Past performance is not indicative of future results." },
  { id:"6", title:"Trading Rules", content:"All trades executed on the platform are final and cannot be reversed. You are solely responsible for your trading decisions. The platform charges a flat fee of 0.2% on all executed trades. Additional fees may apply for asset issuance and withdrawal. Fee schedules are published on the platform and may be updated with 30 days notice." },
  { id:"7", title:"Prohibited Activities", content:"You may not use the platform to engage in market manipulation, wash trading, or any other activity that disrupts fair market conditions. You may not use the platform to launder money, finance terrorism, or engage in any activity that violates applicable law. Violation of these prohibitions may result in immediate account termination and reporting to competent authorities." },
  { id:"8", title:"Intellectual Property", content:"All content on the platform, including software, design, text, and graphics, is the property of Nextoken Capital UAB and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any platform content without our express written permission." },
  { id:"9", title:"Limitation of Liability", content:"To the maximum extent permitted by applicable law, Nextoken Capital UAB shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability to you shall not exceed the fees paid by you to the platform in the 12 months preceding the claim." },
  { id:"10", title:"Governing Law", content:"These Terms are governed by the laws of the Republic of Lithuania. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Vilnius, Lithuania, except where mandatory consumer protection laws in your jurisdiction provide otherwise." },
  { id:"11", title:"Changes to Terms", content:"We reserve the right to modify these Terms at any time. We will notify registered users of material changes via email at least 30 days before they take effect. Your continued use of the platform after changes take effect constitutes your acceptance of the revised Terms." },
  { id:"12", title:"Contact", content:"For questions regarding these Terms, contact us at legal@nextokencapital.com or by post at: Nextoken Capital UAB, Gynėjų g. 14, Vilnius 01109, Lithuania." },
];

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service — Nextoken Capital</title>
        <meta name="description" content="Terms of Service for Nextoken Capital UAB, registered in Lithuania." />
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
        .lp-content{}
        .lp-section{margin-bottom:36px;padding-bottom:36px;border-bottom:1px solid rgba(255,255,255,0.07)}
        .lp-section:last-child{border-bottom:none}
        .lp-section-num{font-size:11px;font-weight:700;color:#F0B90B;margin-bottom:6px}
        .lp-section-title{font-size:16px;font-weight:800;color:#fff;margin-bottom:12px}
        .lp-section-text{font-size:14px;color:rgba(255,255,255,0.55);line-height:1.85}
        .lp-footer-links{display:flex;gap:16px;flex-wrap:wrap;margin-top:40px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.07)}
        .lp-footer-links a{font-size:13px;color:#F0B90B;text-decoration:none}
        .lp-footer-links a:hover{text-decoration:underline}
        @media(max-width:768px){.lp-body{grid-template-columns:1fr}.lp-toc{display:none}}
      `}</style>
      <div className="lp">
        <div className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-tag">Legal</div>
            <h1 className="lp-h1">Terms of Service</h1>
            <p className="lp-meta">Last updated: March 1, 2026 · Effective: March 1, 2026 · Nextoken Capital UAB, Lithuania</p>
          </div>
        </div>
        <div className="lp-body">
          <div className="lp-toc">
            <div className="lp-toc-title">Contents</div>
            {SECTIONS.map(s => <a key={s.id} href={`#s${s.id}`}>{s.id}. {s.title}</a>)}
          </div>
          <div className="lp-content">
            {SECTIONS.map(s => (
              <div key={s.id} id={`s${s.id}`} className="lp-section">
                <div className="lp-section-num">Section {s.id}</div>
                <div className="lp-section-title">{s.title}</div>
                <p className="lp-section-text">{s.content}</p>
              </div>
            ))}
            <div className="lp-footer-links">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/risk">Risk Disclosure</Link>
              <Link href="/aml">AML Policy</Link>
              <Link href="/contact">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}