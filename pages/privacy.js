import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SECTIONS = [
  { id:"1", title:"Who We Are", content:"Nextoken Capital UAB ('we', 'us', 'our') is a company registered in Lithuania (company number 306XXXXXX), authorized as an Electronic Money Institution by the Bank of Lithuania. Our registered address is Gynėjų g. 14, Vilnius 01109, Lithuania. We are the data controller for personal data processed through the Nextoken Capital platform." },
  { id:"2", title:"What Data We Collect", content:"We collect: (a) Identity data — full name, date of birth, nationality, government ID documents; (b) Contact data — email address, phone number, postal address; (c) Financial data — investment history, transaction records, wallet addresses; (d) KYC/AML data — identity verification results, source of funds information; (e) Technical data — IP address, browser type, device information, cookies; (f) Usage data — pages visited, features used, time spent on platform." },
  { id:"3", title:"How We Use Your Data", content:"We process your data to: provide and manage your account; verify your identity under AML/KYC regulations; process investments and transactions; comply with legal and regulatory obligations including Bank of Lithuania reporting; detect and prevent fraud; improve our platform and services; and communicate with you about your account, investments, and platform updates." },
  { id:"4", title:"Legal Basis for Processing", content:"We process your personal data on the following legal bases: (a) Contract performance — to provide the services you have requested; (b) Legal obligation — to comply with AML, KYC, MiCA, and other EU financial regulations; (c) Legitimate interests — to improve our platform, prevent fraud, and maintain security; (d) Consent — for marketing communications, which you may withdraw at any time." },
  { id:"5", title:"Data Sharing", content:"We share your data with: KYC/identity verification providers (Sumsub); payment processors; our legal and compliance advisors; the Bank of Lithuania and other regulatory authorities when required by law; and cloud infrastructure providers. We do not sell your personal data to third parties. All data processors are bound by data processing agreements." },
  { id:"6", title:"International Transfers", content:"Some of our service providers are located outside the European Economic Area. Where we transfer data internationally, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission." },
  { id:"7", title:"Data Retention", content:"We retain your personal data for as long as your account is active and for a minimum of 5 years after account closure to comply with AML and financial regulatory obligations. KYC documents are retained for 5 years after the end of the business relationship as required by EU AML directives." },
  { id:"8", title:"Your Rights", content:"Under GDPR, you have the right to: access your personal data; correct inaccurate data; request deletion (subject to legal retention obligations); restrict processing; data portability; and object to processing based on legitimate interests. To exercise your rights, contact privacy@nextokencapital.com. You also have the right to lodge a complaint with the State Data Protection Inspectorate of Lithuania." },
  { id:"9", title:"Cookies", content:"We use essential cookies to operate the platform, analytical cookies to understand usage, and preference cookies to remember your settings. You can control non-essential cookies through your browser settings. Our cookie policy is available in full on our website." },
  { id:"10", title:"Contact", content:"For privacy questions or to exercise your rights, contact our Data Protection Officer at privacy@nextokencapital.com or by post at: Nextoken Capital UAB, Gynėjų g. 14, Vilnius 01109, Lithuania." },
];

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Nextoken Capital</title>
        <meta name="description" content="Privacy Policy for Nextoken Capital UAB — how we collect, use, and protect your personal data." />
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
        .lp-footer-links a:hover{text-decoration:underline}
        @media(max-width:768px){.lp-body{grid-template-columns:1fr}.lp-toc{display:none}}
      `}</style>
      <div className="lp">
        <div className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-tag">Legal</div>
            <h1 className="lp-h1">Privacy Policy</h1>
            <p className="lp-meta">Last updated: March 1, 2026 · Nextoken Capital UAB, Lithuania · GDPR Compliant</p>
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