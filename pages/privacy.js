// pages/privacy.js
import Head from 'next/head'
import Link from 'next/link'

export default function Privacy() {
  return (
    <>
      <Head><title>Privacy Policy — Nextoken Capital</title></Head>
      <main style={{background:'#060810',color:'#e8edf5',minHeight:'100vh',fontFamily:"'DM Sans',sans-serif",paddingTop:'80px'}}>
        <div style={{maxWidth:'780px',margin:'0 auto',padding:'0 32px 80px'}}>
          <Link href="/" style={{fontFamily:'monospace',fontSize:'.75rem',color:'#38bd82',textDecoration:'none',letterSpacing:'.1em',display:'inline-block',marginBottom:'40px'}}>← BACK TO HOME</Link>
          <div style={{fontFamily:'monospace',fontSize:'.7rem',letterSpacing:'.18em',color:'#38bd82',textTransform:'uppercase',marginBottom:'14px'}}>Legal</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(2rem,4vw,2.8rem)',fontWeight:800,lineHeight:1.1,marginBottom:'12px'}}>Privacy Policy</h1>
          <p style={{color:'#4a5568',fontFamily:'monospace',fontSize:'.8rem',marginBottom:'48px'}}>Last updated: March 1, 2026 · Effective: March 1, 2026</p>

          {[
            { t:'1. Data Controller', b:`Nextoken Capital UAB (company number 306XXXXXX), registered at Gynėjų g. 14, Vilnius 01109, Lithuania, is the data controller responsible for your personal data. We are subject to the EU General Data Protection Regulation (GDPR) and the Law on Legal Protection of Personal Data of the Republic of Lithuania.` },
            { t:'2. Data We Collect', b:`We collect the following categories of personal data: Identity data (full name, date of birth, nationality, government-issued ID); Contact data (email address, phone number, residential address); Financial data (bank account details, transaction history, portfolio holdings); Technical data (IP address, browser type, device identifiers, cookies); KYC/AML data (identity verification documents, source of funds declarations, PEP screening results).` },
            { t:'3. How We Use Your Data', b:`We process your personal data for the following purposes: To provide and maintain the Platform services; To comply with our legal and regulatory obligations under MiCA, AML/CFT laws, and the EU DLT Pilot Regime; To verify your identity and conduct KYC/AML screening; To process transactions and maintain account records; To communicate important service updates and legal notices; To detect and prevent fraud, market manipulation, and other prohibited activities.` },
            { t:'4. Legal Basis for Processing', b:`We process your personal data on the following legal bases: Performance of a contract (Art. 6(1)(b) GDPR) — processing necessary to provide Platform services; Legal obligation (Art. 6(1)(c) GDPR) — processing required by AML, financial, and tax regulations; Legitimate interests (Art. 6(1)(f) GDPR) — fraud prevention and platform security; Consent (Art. 6(1)(a) GDPR) — for marketing communications, which you may withdraw at any time.` },
            { t:'5. Data Retention', b:`We retain personal data for as long as necessary to fulfill the purposes for which it was collected. KYC/AML records are retained for a minimum of 5 years after the end of the business relationship, as required by EU Anti-Money Laundering Directive. Transaction records are retained for 7 years for tax and regulatory compliance purposes.` },
            { t:'6. Data Sharing', b:`We do not sell your personal data. We may share your data with: Regulatory authorities and law enforcement when required by law; Identity verification providers (KYC/AML service providers); Payment processors and banking partners; IT infrastructure and cloud service providers operating under GDPR-compliant data processing agreements; Legal and compliance advisors under strict confidentiality obligations.` },
            { t:'7. Your Rights', b:`Under GDPR, you have the following rights: Right of access to your personal data; Right to rectification of inaccurate data; Right to erasure ("right to be forgotten") where legally permissible; Right to restriction of processing; Right to data portability; Right to object to processing based on legitimate interests; Right to withdraw consent at any time. To exercise these rights, contact privacy@nextokencapital.com.` },
            { t:'8. Cookies', b:`We use essential cookies necessary for Platform operation, and analytical cookies to improve user experience. You may manage cookie preferences through your browser settings. Declining non-essential cookies will not affect your ability to use the Platform.` },
            { t:'9. Contact', b:`For privacy-related inquiries, contact our Data Protection Officer at privacy@nextokencapital.com. You also have the right to lodge a complaint with the State Data Protection Inspectorate of Lithuania (www.vdai.lrv.lt) or your local supervisory authority.` },
          ].map(s => (
            <div key={s.t} style={{marginBottom:'36px'}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:'1.15rem',fontWeight:700,marginBottom:'12px',color:'#e8edf5'}}>{s.t}</h2>
              <p style={{color:'#7a8599',lineHeight:1.8,fontSize:'.92rem',margin:0}}>{s.b}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}