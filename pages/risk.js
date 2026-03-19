// pages/risk.js
import Head from 'next/head'
import Link from 'next/link'

export default function Risk() {
  return (
    <>
      <Head><title>Risk Disclosure — Nextoken Capital</title></Head>
      <main style={{background:'#060810',color:'#e8edf5',minHeight:'100vh',fontFamily:"'DM Sans',sans-serif",paddingTop:'80px'}}>
        <div style={{maxWidth:'780px',margin:'0 auto',padding:'0 32px 80px'}}>
          <Link href="/" style={{fontFamily:'monospace',fontSize:'.75rem',color:'#38bd82',textDecoration:'none',letterSpacing:'.1em',display:'inline-block',marginBottom:'40px'}}>← BACK TO HOME</Link>
          <div style={{fontFamily:'monospace',fontSize:'.7rem',letterSpacing:'.18em',color:'#38bd82',textTransform:'uppercase',marginBottom:'14px'}}>Legal</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(2rem,4vw,2.8rem)',fontWeight:800,lineHeight:1.1,marginBottom:'12px'}}>Risk Disclosure</h1>
          <p style={{color:'#4a5568',fontFamily:'monospace',fontSize:'.8rem',marginBottom:'24px'}}>Last updated: March 1, 2026</p>

          <div style={{background:'rgba(224,80,80,0.08)',border:'1px solid rgba(224,80,80,0.25)',borderRadius:'12px',padding:'20px 24px',marginBottom:'48px'}}>
            <p style={{color:'#e8edf5',fontWeight:500,margin:0,fontSize:'.92rem'}}>⚠️ Important Warning: Investing in tokenized assets involves significant risk. You may lose some or all of your invested capital. Past performance is not indicative of future results. Please read this entire document before investing.</p>
          </div>

          {[
            { t:'1. Market Risk', b:`The value of tokenized assets can fluctuate significantly due to market conditions, economic factors, and investor sentiment. Crypto-asset markets can be highly volatile and may experience rapid and substantial price movements. There is no guarantee that you will be able to sell your tokenized assets at a price equal to or greater than your purchase price.` },
            { t:'2. Liquidity Risk', b:`Tokenized assets may have limited liquidity, meaning you may not be able to sell your holdings quickly or at your desired price. Secondary market trading volumes for tokenized real-world assets may be low, particularly for smaller issuances. You should only invest funds that you can afford to have locked up for an extended period.` },
            { t:'3. Regulatory Risk', b:`The regulatory framework for tokenized assets and crypto-assets is evolving. Changes in laws, regulations, or regulatory guidance — including changes to MiCA, the EU DLT Pilot Regime, or national legislation — may adversely affect the value, transferability, or legality of tokenized assets. Nextoken Capital UAB cannot guarantee the continued regulatory compliance of any tokenized asset.` },
            { t:'4. Technology Risk', b:`The Platform relies on distributed ledger technology, which carries inherent technical risks including smart contract vulnerabilities, blockchain network failures, cybersecurity attacks, and protocol changes. Although we implement industry-standard security measures, no technology system is completely immune to failure or attack.` },
            { t:'5. Issuer Risk', b:`Tokenized assets represent claims on underlying real-world assets or issuers. The value of your investment is dependent on the financial health and performance of the underlying asset or issuer. Issuers may default on their obligations, and the value of underlying real assets may decline. Nextoken Capital UAB does not guarantee the performance of any issuer or underlying asset.` },
            { t:'6. Custody Risk', b:`Digital assets held on the Platform are subject to custody risk. While we implement robust security measures, including cold storage for digital assets, there is a risk of loss due to theft, hacking, or operational failure. Assets held on the Platform are not covered by the EU Deposit Guarantee Scheme or the Investor Compensation Scheme.` },
            { t:'7. Foreign Exchange Risk', b:`If you invest in tokenized assets denominated in a currency other than your home currency, you are exposed to foreign exchange risk. Currency fluctuations may increase or decrease the value of your investment when converted back to your home currency.` },
            { t:'8. Concentration Risk', b:`Investing a significant proportion of your portfolio in tokenized assets, or in a single tokenized asset, increases your exposure to the specific risks of that asset class or issuer. We recommend diversification across asset classes and issuers.` },
            { t:'9. Who Should Invest', b:`Tokenized assets are generally suitable for investors who: understand the risks described in this document; can afford to lose their entire investment; have a medium to long-term investment horizon; and have experience with digital assets or alternative investments. If you are uncertain whether tokenized assets are appropriate for you, please consult an independent financial advisor.` },
            { t:'10. No Investment Advice', b:`Nothing on the Platform constitutes investment advice, financial advice, or a recommendation to buy or sell any tokenized asset. All investment decisions are your own. Nextoken Capital UAB is not responsible for any investment losses you may incur.` },
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