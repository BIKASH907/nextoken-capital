// pages/aml.js
import Head from 'next/head'
import Link from 'next/link'

export default function AML() {
  return (
    <>
      <Head><title>AML Policy — Nextoken Capital</title></Head>
      <main style={{background:'#060810',color:'#e8edf5',minHeight:'100vh',fontFamily:"'DM Sans',sans-serif",paddingTop:'80px'}}>
        <div style={{maxWidth:'780px',margin:'0 auto',padding:'0 32px 80px'}}>
          <Link href="/" style={{fontFamily:'monospace',fontSize:'.75rem',color:'#38bd82',textDecoration:'none',letterSpacing:'.1em',display:'inline-block',marginBottom:'40px'}}>← BACK TO HOME</Link>
          <div style={{fontFamily:'monospace',fontSize:'.7rem',letterSpacing:'.18em',color:'#38bd82',textTransform:'uppercase',marginBottom:'14px'}}>Legal</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(2rem,4vw,2.8rem)',fontWeight:800,lineHeight:1.1,marginBottom:'12px'}}>AML / KYC Policy</h1>
          <p style={{color:'#4a5568',fontFamily:'monospace',fontSize:'.8rem',marginBottom:'48px'}}>Anti-Money Laundering and Know Your Customer Policy · Last updated: March 1, 2026</p>

          {[
            { t:'1. Policy Statement', b:`Nextoken Capital UAB is committed to the highest standards of Anti-Money Laundering (AML) and Counter-Terrorism Financing (CTF) compliance. This policy establishes our framework for preventing the Platform from being used for money laundering, terrorist financing, or other financial crimes. We comply with the EU Anti-Money Laundering Directives (AMLD5 and AMLD6), the Financial Action Task Force (FATF) recommendations, and Lithuanian national AML legislation.` },
            { t:'2. KYC Verification Requirements', b:`All users of the Platform are required to complete Know Your Customer (KYC) verification before conducting any transactions. KYC verification is conducted in tiers: Level 1 (Email verification) grants read-only access; Level 2 (Identity verification) permits trading up to €50,000 per day; Level 3 (Enhanced due diligence) permits unlimited trading and asset issuance. Required documents include a government-issued photo ID (passport or national ID card) and proof of residential address dated within 3 months.` },
            { t:'3. Customer Due Diligence', b:`We conduct Customer Due Diligence (CDD) on all users, including: verification of identity using reliable, independent source documents; verification of beneficial ownership for corporate accounts; assessment of the nature and purpose of the business relationship; ongoing monitoring of transactions to detect unusual patterns. Enhanced Due Diligence (EDD) is applied to higher-risk customers, including Politically Exposed Persons (PEPs), customers from high-risk jurisdictions, and accounts with high transaction volumes.` },
            { t:'4. Transaction Monitoring', b:`We continuously monitor all transactions on the Platform for suspicious activity. Our automated monitoring system screens transactions for: unusual transaction patterns inconsistent with the user profile; transactions involving high-risk jurisdictions; structuring or smurfing patterns designed to evade reporting thresholds; rapid movement of funds without clear economic purpose. Suspicious transactions are reported to the Lithuanian Financial Intelligence Unit (FNTT) in accordance with applicable law.` },
            { t:'5. Prohibited Persons and Jurisdictions', b:`The Platform is not available to residents or nationals of jurisdictions subject to comprehensive EU or UN sanctions, including but not limited to: Belarus, Cuba, Iran, North Korea, Russia, Syria, and Venezuela. We conduct sanctions screening against EU, UN, OFAC, and other relevant sanctions lists for all users and transactions. Accounts found to be associated with sanctioned individuals or entities will be immediately suspended and reported to competent authorities.` },
            { t:'6. Source of Funds', b:`For transactions above certain thresholds, we may require users to provide evidence of the source of funds. Acceptable evidence includes payslips, bank statements, tax returns, or other documentation demonstrating the legitimate origin of funds. We reserve the right to refuse transactions where the source of funds cannot be satisfactorily established.` },
            { t:'7. Reporting Obligations', b:`Nextoken Capital UAB has a legal obligation to report suspicious activity to the Lithuanian Financial Intelligence Unit (FNTT). We are prohibited by law from disclosing to users or third parties that a suspicious activity report has been filed (tipping-off prohibition). We cooperate fully with law enforcement and regulatory authorities in investigations related to financial crime.` },
            { t:'8. Record Keeping', b:`We maintain records of all KYC documentation and transaction data for a minimum of 5 years following the end of the business relationship, as required by EU AML Directive. All records are stored securely and are available to competent authorities upon request.` },
            { t:'9. Staff Training', b:`All Nextoken Capital UAB employees receive regular AML/CTF training appropriate to their roles. Our compliance team holds relevant professional qualifications and maintains up-to-date knowledge of AML regulations and typologies.` },
            { t:'10. Contact', b:`For AML/KYC inquiries, contact our Compliance team at compliance@nextokencapital.com. To report suspicious activity, contact us at the same address or report directly to the Lithuanian Financial Intelligence Unit (FNTT) at www.fntt.lt.` },
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