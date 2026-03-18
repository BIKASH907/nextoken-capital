import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import Navbar from '../components/Navbar'
import AuthModal from '../components/AuthModal'

const PAIRS = {
  'EURO BOND 5Y / EUR': { price: '98.40', chg: '+0.18%', up: true, type: 'BOND' },
  'BALT GREEN BOND / EUR': { price: '99.80', chg: '+0.22%', up: true, type: 'GREEN' },
  'RE TOKEN LT / EUR': { price: '245.00', chg: '-0.82%', up: false, type: 'REIT' },
  'NXT / EUR': { price: '1.248', chg: '+3.42%', up: true, type: 'TOKEN' },
  'SME EQUITY A / EUR': { price: '18.75', chg: '+1.20%', up: true, type: 'EQUITY' },
}

const SELL_ORDERS = [
  { price: '98.65', qty: '18,000', total: '€1.77M', pct: 90 },
  { price: '98.60', qty: '12,400', total: '€1.22M', pct: 75 },
  { price: '98.55', qty: '8,200', total: '€808K', pct: 55 },
  { price: '98.50', qty: '5,000', total: '€492K', pct: 38 },
]
const BUY_ORDERS = [
  { price: '98.35', qty: '7,800', total: '€767K', pct: 50 },
  { price: '98.30', qty: '11,200', total: '€1.1M', pct: 72 },
  { price: '98.25', qty: '15,000', total: '€1.47M', pct: 88 },
  { price: '98.20', qty: '20,000', total: '€1.96M', pct: 95 },
]
const TRADES = [
  { time: '14:32:11', price: '98.42', qty: '1,200', buy: true },
  { time: '14:31:58', price: '98.39', qty: '800', buy: false },
  { time: '14:31:44', price: '98.41', qty: '2,500', buy: true },
  { time: '14:31:30', price: '98.38', qty: '400', buy: false },
  { time: '14:31:15', price: '98.40', qty: '1,800', buy: true },
]

export default function Exchange() {
  const { user } = useAuth()
  const [modal, setModal] = useState(null)
  const [pair, setPair] = useState('EURO BOND 5Y / EUR')
  const [side, setSide] = useState('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('98.40')
  const [msg, setMsg] = useState('')

  const gold = '#F0B90B'; const dark = '#0B0E11'; const dark2 = '#161A1E'
  const dark3 = '#1E2329'; const green = '#0ECB81'; const red = '#F6465D'
  const border = 'rgba(255,255,255,0.06)'; const muted = 'rgba(255,255,255,0.4)'
  const cur = PAIRS[pair]

  function placeTrade() {
    if (!user) { setModal('login'); return }
    if (!amount || parseFloat(amount) <= 0) { setMsg('Please enter a valid amount'); return }
    setMsg(`✓ ${side.toUpperCase()} order submitted for €${(parseFloat(amount) * parseFloat(price)).toFixed(2)}. Complete KYC to execute.`)
    setAmount('')
  }

  return (
    <div style={{ background: dark, minHeight: '100vh', color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter,sans-serif' }}>
      <Navbar onLogin={() => setModal('login')} onRegister={() => setModal('register')} />
      {modal && <AuthModal mode={modal} onClose={() => setModal(null)} onSwitch={m => setModal(m)} />}

      <div style={{ paddingTop: 60, display: 'grid', gridTemplateColumns: '1fr 280px', minHeight: 'calc(100vh - 60px)' }}>
        {/* Main */}
        <div style={{ borderRight: `1px solid ${border}` }}>
          {/* Top bar */}
          <div style={{ padding: '0.75rem 1.25rem', background: dark2, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '1.5rem', overflowX: 'auto' }}>
            <select value={pair} onChange={e => { setPair(e.target.value); setPrice(PAIRS[e.target.value].price) }}
              style={{ padding: '0.4rem 0.75rem', background: dark3, border: `1px solid ${border}`, borderRadius: 4, color: '#fff', fontSize: '0.82rem', fontFamily: 'Inter,sans-serif', cursor: 'pointer', outline: 'none' }}>
              {Object.keys(PAIRS).map(p => <option key={p}>{p}</option>)}
            </select>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff' }}>€{cur.price}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: cur.up ? green : red }}>{cur.up ? '▲' : '▼'} {cur.chg} today</div>
            </div>
            {[['24h High','€99.20'],['24h Low','€97.80'],['24h Volume','€14.2M'],['Type',cur.type]].map(([l,v]) => (
              <div key={l} style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '0.62rem', color: muted, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{ height: 280, display: 'flex', alignItems: 'flex-end', gap: 4, padding: '1.25rem', background: dark }}>
            {[25,18,32,44,15,50,36,20,46,58,28,52,62,24,55,68,40,22,60,72,35,48,65,30,58,75,42,20,66,80].map((h,i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <div style={{ width: 1, height: Math.floor(h * 0.2), background: 'rgba(255,255,255,0.12)' }} />
                <div style={{ width: '100%', height: h, background: i % 4 === 2 ? red : green, borderRadius: 1 }} />
                <div style={{ width: 1, height: Math.floor(h * 0.12), background: 'rgba(255,255,255,0.12)' }} />
              </div>
            ))}
          </div>

          {/* Trade history */}
          <div style={{ borderTop: `1px solid ${border}`, background: dark2 }}>
            <div style={{ padding: '0 1.25rem', borderBottom: `1px solid ${border}` }}>
              <div style={{ display: 'inline-block', padding: '0.75rem 1.25rem', fontSize: '0.82rem', fontWeight: 600, color: gold, borderBottom: `2px solid ${gold}`, marginBottom: -1 }}>Recent Trades</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Time','Price (EUR)','Amount','Side'].map(h => <th key={h} style={{ padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: muted, background: dark3, borderBottom: `1px solid ${border}` }}>{h}</th>)}</tr></thead>
              <tbody>
                {TRADES.map((t,i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.8rem 1rem', borderBottom: `1px solid ${border}`, color: muted, fontSize: '0.8rem' }}>{t.time}</td>
                    <td style={{ padding: '0.8rem 1rem', borderBottom: `1px solid ${border}`, fontWeight: 700, fontSize: '0.82rem' }}>€{t.price}</td>
                    <td style={{ padding: '0.8rem 1rem', borderBottom: `1px solid ${border}`, fontSize: '0.82rem' }}>{t.qty}</td>
                    <td style={{ padding: '0.8rem 1rem', borderBottom: `1px solid ${border}` }}>
                      <span style={{ padding: '2px 7px', borderRadius: 2, fontSize: '0.68rem', fontWeight: 700, background: t.buy ? 'rgba(14,203,129,0.1)' : 'rgba(246,70,93,0.08)', color: t.buy ? green : red }}>{t.buy ? 'Buy' : 'Sell'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order book + trade form */}
        <div style={{ background: dark2, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Order Book</span>
            <span style={{ fontSize: '0.62rem', fontWeight: 600, color: green }}>● Live</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: muted, background: dark3 }}>
            <span>Price</span><span>Amount</span><span>Total</span>
          </div>
          {SELL_ORDERS.map((o,i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 1rem', fontSize: '0.72rem', position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: `${o.pct}%`, background: red, opacity: 0.07 }} />
              <span style={{ fontWeight: 600, color: red, position: 'relative', zIndex: 1 }}>{o.price}</span>
              <span style={{ color: muted, fontSize: '0.68rem', position: 'relative', zIndex: 1 }}>{o.qty}</span>
              <span style={{ color: muted, fontSize: '0.68rem', position: 'relative', zIndex: 1 }}>{o.total}</span>
            </div>
          ))}
          <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.95rem', fontWeight: 900, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, color: '#fff' }}>€{cur.price} {cur.up ? '▲' : '▼'}</div>
          {BUY_ORDERS.map((o,i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 1rem', fontSize: '0.72rem', position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: `${o.pct}%`, background: green, opacity: 0.07 }} />
              <span style={{ fontWeight: 600, color: green, position: 'relative', zIndex: 1 }}>{o.price}</span>
              <span style={{ color: muted, fontSize: '0.68rem', position: 'relative', zIndex: 1 }}>{o.qty}</span>
              <span style={{ color: muted, fontSize: '0.68rem', position: 'relative', zIndex: 1 }}>{o.total}</span>
            </div>
          ))}

          {/* Trade form */}
          <div style={{ padding: '1rem', borderTop: `1px solid ${border}`, marginTop: 'auto' }}>
            <div style={{ display: 'flex', gap: 1, background: dark3, borderRadius: 4, overflow: 'hidden', marginBottom: '1rem' }}>
              {['buy','sell'].map(s => (
                <button key={s} onClick={() => setSide(s)} style={{ flex: 1, padding: '0.5rem', fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', background: side === s ? (s === 'buy' ? green : red) : 'transparent', color: side === s ? (s === 'buy' ? 'black' : 'white') : muted, transition: 'all 0.15s' }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: muted, marginBottom: 4 }}>Price (EUR)</div>
              <input value={price} onChange={e => setPrice(e.target.value)} type="number" style={{ width: '100%', padding: '0.6rem 0.8rem', background: dark3, border: `1px solid ${border}`, borderRadius: 4, color: '#fff', fontSize: '0.82rem', fontFamily: 'Inter,sans-serif', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: muted, marginBottom: 4 }}>Amount</div>
              <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="0" style={{ width: '100%', padding: '0.6rem 0.8rem', background: dark3, border: `1px solid ${border}`, borderRadius: 4, color: '#fff', fontSize: '0.82rem', fontFamily: 'Inter,sans-serif', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: muted, marginBottom: '0.75rem' }}>
              <span>Fee (0.2%)</span>
              <span>€{amount && price ? (parseFloat(amount) * parseFloat(price) * 0.002).toFixed(2) : '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: muted, marginBottom: '1rem' }}>
              <span>Total</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>€{amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0.00'}</span>
            </div>
            <button onClick={placeTrade} style={{ width: '100%', padding: '0.75rem', background: side === 'buy' ? green : red, color: side === 'buy' ? 'black' : 'white', border: 'none', borderRadius: 4, fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
              Place {side === 'buy' ? 'Buy' : 'Sell'} Order
            </button>
            {msg && <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: msg.startsWith('✓') ? green : red, lineHeight: 1.5 }}>{msg}</div>}
            <div style={{ textAlign: 'center', fontSize: '0.65rem', color: muted, marginTop: '0.6rem' }}>KYC required to execute trades</div>
          </div>
        </div>
      </div>
    </div>
  )
}
