// pages/terms.js
import Head from 'next/head'
import Link from 'next/link'

export default function Terms() {
  return (
    <>
      <Head><title>Terms of Service — Nextoken Capital</title></Head>
      <main style={{background:'#060810',color:'#e8edf5',minHeight:'100vh',fontFamily:"'DM Sans',sans-serif",paddingTop:'80px'}}>
        <div style={{maxWidth:'780px',margin:'0 auto',padding:'0 32px 80px'}}>
          <Link href="/" style={{fontFamily:'monospace',fontSize:'.75rem',color:'#38bd82',textDecoration:'none',letterSpacing:'.1em',display:'inline-block',marginBottom:'40px'}}>← BACK TO HOME</Link>
          <div style={{fontFamily:'monospace',fontSize:'.7rem',letterSpacing:'.18em',color:'#38bd82',textTransform:'uppercase',marginBottom:'14px'}}>Legal</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(2rem,4vw,2.8rem)',fontWeight:800,lineHeight:1.1,marginBottom:'12px'}}>Terms of Service</h1>
          <p style={{color:'#4a5568',fontFamily:'monospace',fontSize:'.8rem',marginBottom:'48px'}}>Last updated: March 1, 2026 · Effective: March 1, 2026</p>

          {[
            { t:'1. Acceptance of Terms', b:`By accessing or using the Nextoken Capital platform ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Platform. These Terms constitute a legally binding agreement between you and Nextoken Capital UAB, a company registered in Lithuania (company number 306XXXXXX).` },
            { t:'2. Eligibility', b:`You must be at least 18 years of age to use the Platform. By using the Platform, you represent and warrant that you are of legal age in your jurisdiction and have the legal capacity to enter into a binding agreement. The Platform is not available to residents of jurisdictions where its use would be prohibited by applicable law.` },
            { t:'3. Regulated Services', b:`Nextoken Capital UAB is authorized as an Electronic Money Institution by the Bank of Lithuania (License № EMI-2022-041) and holds a MiCA CASP authorization (Ref: LT-CASP-2024-007). All services provided through the Platform are subject to applicable EU financial regulation, including but not limited to the Markets in Crypto-Assets Regulation (MiCA) and the EU DLT Pilot Regime.` },
            { t:'4. Account Registration', b:`To access certain features of the Platform, you must create an account and complete our KYC (Know Your Customer) verification process. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.` },
            { t:'5. Tokenized Assets', b:`The Platform facilitates the issuance and trading of tokenized real-world assets, including real estate, bonds, and equity. All tokenized assets listed on the Platform have undergone compliance review. However, tokenized assets are subject to market risk, liquidity risk, and regulatory risk. Past performance is not indicative of future results.` },
            { t:'6. Trading Rules', b:`All trades executed on the Platform are final and cannot be reversed. You are solely responsible for your trading decisions. The Platform charges a flat fee of 0.2% on all executed trades. Additional fees may apply for asset issuance and withdrawal. Fee schedules are published on the Platform and may be updated with 30 days notice.` },
            { t:'7. Prohibited Activities', b:`You may not use the Platform to engage in market manipulation, wash trading, or any other activity that disrupts fair market conditions. You may not use the Platform to launder money, finance terrorism, or engage in any activity that violates applicable law. Violation of these prohibitions may result in immediate account termination and reporting to competent authorities.` },
            { t:'8. Intellectual Property', b:`All content on the Platform, including software, design, text, and graphics, is the property of Nextoken Capital UAB and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any Platform content without our express written permission.` },
            { t:'9. Limitation of Liability', b:`To the maximum extent permitted by applicable law, Nextoken Capital UAB shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. Our total liability to you shall not exceed the fees paid by you to the Platform in the 12 months preceding the claim.` },
            { t:'10. Governing Law', b:`These Terms are governed by the laws of the Republic of Lithuania. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Vilnius, Lithuania, except where mandatory consumer protection laws in your jurisdiction provide otherwise.` },
            { t:'11. Contact', b:`For questions regarding these Terms, please contact us at legal@nextokencapital.com or by post at: Nextoken Capital UAB, Gynėjų g. 14, Vilnius 01109, Lithuania.` },
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