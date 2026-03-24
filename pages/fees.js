import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const FEES = [
  { icon:'🏦', title:'Account Opening', fee:'Free', color:'#0ECB81', desc:'Create your account, complete KYC verification, and access the platform at no cost.', detail:'There are no fees to open an account, verify your identity, or browse investment opportunities.' },
  { icon:'📥', title:'Deposits', fee:'Free', color:'#0ECB81', desc:'Add funds to your account via bank transfer (SEPA, SWIFT).', detail:'We do not charge any fees on deposits. Your bank may charge its own transfer fees.' },
  { icon:'🔗', title:'Token Purchase', fee:'0.2%', color:'#F0B90B', desc:'A small fee applied when you invest in any tokenized asset on the platform.', detail:'Example: If you invest EUR 1,000 in a real estate token, the fee is EUR 2.00. This fee is deducted automatically at the time of purchase.', example:'EUR 1,000 investment → EUR 2.00 fee' },
  { icon:'🔄', title:'Secondary Market Trading', fee:'0.3%', color:'#F0B90B', desc:'Fee per side when you buy or sell tokens on the secondary market exchange.', detail:'Applied to both buyer and seller. Example: Selling EUR 500 worth of tokens costs EUR 1.50. Buying EUR 500 worth of tokens also costs EUR 1.50.', example:'EUR 500 trade → EUR 1.50 fee per side' },
  { icon:'📤', title:'Withdrawals', fee:'0.3%', color:'#F0B90B', desc:'Fee when withdrawing funds from your Nextoken Capital account to your bank.', detail:'Minimum fee: EUR 2.00. Maximum fee: EUR 50.00. Example: Withdrawing EUR 1,000 costs EUR 3.00.', example:'EUR 1,000 withdrawal → EUR 3.00 fee' },
  { icon:'💸', title:'Yield / Returns', fee:'Free', color:'#0ECB81', desc:'Receive investment returns, dividends, and yield payments with no deduction.', detail:'All returns are paid directly to your account balance. No platform fee is applied to incoming yield distributions.' },
  { icon:'🪪', title:'KYC Verification', fee:'Free', color:'#0ECB81', desc:'Full identity verification powered by Sumsub — required to invest.', detail:'KYC is free for all investors. Enhanced due diligence for high-value investors is also provided at no cost.' },
  { icon:'📄', title:'Documents & Reports', fee:'Free', color:'#0ECB81', desc:'Download investment contracts, statements, and tax reports anytime.', detail:'All legal documents, transaction history, annual statements, and tax reports are available for free download.' },
];
const EXAMPLES = [
  {tx:'Token Purchase',amt:'EUR 500',rate:'0.2%',pay:'EUR 1.00'},
  {tx:'Token Purchase',amt:'EUR 5,000',rate:'0.2%',pay:'EUR 10.00'},
  {tx:'Secondary Market Buy',amt:'EUR 1,000',rate:'0.3%',pay:'EUR 3.00'},
  {tx:'Secondary Market Sell',amt:'EUR 1,000',rate:'0.3%',pay:'EUR 3.00'},
  {tx:'Withdrawal',amt:'EUR 500',rate:'0.3%',pay:'EUR 2.00 (min)'},
  {tx:'Withdrawal',amt:'EUR 2,000',rate:'0.3%',pay:'EUR 6.00'},
  {tx:'Withdrawal',amt:'EUR 20,000',rate:'0.3%',pay:'EUR 50.00 (max)'},
];
export default function FeesPage() {
  return (
    <>
      <Head><title>Fees and Pricing — Nextoken Capital</title><meta name="description" content="Transparent fee schedule for Nextoken Capital. See all charges for investing, trading, withdrawals and more." /></Head>
      <Navbar />
      <div style={{minHeight:'100vh',background:'#0B0E11',color:'#fff',fontFamily:"'DM Sans',system-ui,sans-serif",paddingTop:100,paddingBottom:80}}>
        <div style={{maxWidth:960,margin:'0 auto',padding:'0 20px'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div style={{fontSize:12,fontWeight:700,color:'#F0B90B',letterSpacing:3,textTransform:'uppercase',marginBottom:12}}>Transparent Pricing</div>
            <h1 style={{fontSize:44,fontWeight:900,marginBottom:16,lineHeight:1.1}}>Simple, Fair Fees</h1>
            <p style={{fontSize:16,color:'rgba(255,255,255,0.5)',maxWidth:520,margin:'0 auto',lineHeight:1.7}}>No hidden charges. No surprises. Every fee is disclosed upfront in accordance with MiCA regulation and Bank of Lithuania requirements.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:48}}>
            {[{label:'Token Purchase',value:'0.2%'},{label:'Secondary Market',value:'0.3%'},{label:'Withdrawals',value:'0.3%'}].map(item => (
              <div key={item.label} style={{background:'rgba(240,185,11,0.06)',border:'1px solid rgba(240,185,11,0.2)',borderRadius:12,padding:'20px 24px',textAlign:'center'}}>
                <div style={{fontSize:32,fontWeight:900,color:'#F0B90B',marginBottom:4}}>{item.value}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(440px,1fr))',gap:16,marginBottom:48}}>
            {FEES.map(item => (
              <div key={item.title} style={{background:'#0F1318',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:24}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{fontSize:24}}>{item.icon}</div>
                    <div style={{fontSize:16,fontWeight:700}}>{item.title}</div>
                  </div>
                  <div style={{fontSize:20,fontWeight:900,color:item.color,flexShrink:0,marginLeft:16}}>{item.fee}</div>
                </div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.55)',marginBottom:8,lineHeight:1.6}}>{item.desc}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',lineHeight:1.6}}>{item.detail}</div>
                {item.example && <div style={{marginTop:12,padding:'8px 12px',background:'rgba(240,185,11,0.06)',borderRadius:6,fontSize:12,color:'#F0B90B',fontWeight:600}}>Example: {item.example}</div>}
              </div>
            ))}
          </div>
          <div style={{background:'#0F1318',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:32,marginBottom:32}}>
            <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>Fee Examples</div>
            <div style={{fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:24}}>Here is what you would pay on common transactions:</div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:14}}>
                <thead><tr style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                  {['Transaction','Amount','Fee Rate','You Pay'].map(h => <th key={h} style={{textAlign:'left',padding:'8px 16px 12px 0',fontSize:11,color:'rgba(255,255,255,0.4)',fontWeight:700,textTransform:'uppercase',letterSpacing:.5}}>{h}</th>)}
                </tr></thead>
                <tbody>{EXAMPLES.map((row,i) => (
                  <tr key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <td style={{padding:'12px 16px 12px 0',fontWeight:600}}>{row.tx}</td>
                    <td style={{padding:'12px 16px 12px 0',color:'rgba(255,255,255,0.6)'}}>{row.amt}</td>
                    <td style={{padding:'12px 16px 12px 0',color:'#F0B90B',fontWeight:700}}>{row.rate}</td>
                    <td style={{padding:'12px 16px 12px 0',color:'#0ECB81',fontWeight:700}}>{row.pay}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          <div style={{background:'rgba(240,185,11,0.06)',border:'1px solid rgba(240,185,11,0.15)',borderRadius:12,padding:32,marginBottom:32}}>
            <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>Institutional and Issuer Pricing</div>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.6)',marginBottom:20,lineHeight:1.7}}>For institutional investors, asset issuers, and partners with transaction volumes above EUR 500,000, we offer custom fee arrangements including volume discounts and white-label options. Contact our team to discuss your requirements.</p>
            <Link href="/contact" style={{display:'inline-block',padding:'10px 24px',background:'#F0B90B',color:'#000',borderRadius:8,fontWeight:700,fontSize:14,textDecoration:'none'}}>Contact Sales</Link>
          </div>
          <div style={{background:'#0F1318',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:32}}>
            <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Important Notes</div>
            {['All fees are inclusive of VAT where applicable under Lithuanian law.','Fees are deducted automatically from your account balance at the time of transaction.','Withdrawal fee minimum is EUR 2.00 and maximum is EUR 50.00 regardless of amount.','Nextoken Capital will provide 30 days written notice before any fee changes.','Fee waivers or promotions may apply during special periods and will be announced separately.','This fee schedule is effective as of March 1, 2026 and supersedes all previous schedules.'].map((note,i) => (
              <div key={i} style={{display:'flex',gap:12,marginBottom:10,fontSize:13,color:'rgba(255,255,255,0.55)',lineHeight:1.6}}>
                <span style={{color:'#F0B90B',flexShrink:0,marginTop:1}}>→</span>{note}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
