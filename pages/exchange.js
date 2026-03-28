import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Exchange() {
  const { data: session } = useSession();
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [trades, setTrades] = useState([]);
  const [side, setSide] = useState('buy');
  const [orderType, setOrderType] = useState('limit');
  const [price, setPrice] = useState('');
  const [units, setUnits] = useState('');
  const [tab, setTab] = useState('orderbook');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [assetsLoading, setAssetsLoading] = useState(true);

  useEffect(() => {
    setAssetsLoading(true);
    fetch('/api/assets')
      .then(r => r.json())
      .then(data => {
        const list = data.assets || data || [];
        setAssets(list);
        if (list.length > 0) {
          setSelectedAsset(list[0]);
          setPrice(list[0].tokenPrice?.toString() || '');
        }
      })
      .catch(() => {})
      .finally(() => setAssetsLoading(false));
  }, []);

  const loadMarketData = useCallback(async () => {
    if (!selectedAsset?._id) return;
    try {
      const [obRes, trRes] = await Promise.all([
        fetch(`/api/orders?assetId=${selectedAsset._id}&status=open`),
        fetch(`/api/trades?assetId=${selectedAsset._id}&limit=10`)
      ]);
      const obData = await obRes.json();
      const trData = await trRes.json();
      const orders = obData.orders || [];
      setOrderBook({
        bids: orders.filter(o => o.side === 'buy').sort((a, b) => b.price - a.price).slice(0, 10),
        asks: orders.filter(o => o.side === 'sell').sort((a, b) => a.price - b.price).slice(0, 10)
      });
      setTrades(trData.trades || []);
    } catch (e) {}
  }, [selectedAsset]);

  useEffect(() => {
    loadMarketData();
    const iv = setInterval(loadMarketData, 10000);
    return () => clearInterval(iv);
  }, [loadMarketData]);

  useEffect(() => {
    if (selectedAsset?.tokenPrice) setPrice(selectedAsset.tokenPrice.toString());
  }, [selectedAsset]);

  async function placeOrder(e) {
    e.preventDefault();
    if (!session) { setMsg('Please log in to place orders'); window.location.href = '/login'; return; }
    if (!units || parseFloat(units) <= 0) return;
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: selectedAsset._id,
          side,
          type: orderType,
          price: parseFloat(price),
          units: parseFloat(units)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('✅ Order placed!');
        setUnits('');
        loadMarketData();
        setTimeout(() => setMsg(''), 4000);
      } else {
        setMsg('❌ ' + (data.error || 'Failed'));
      }
    } catch (e) {
      setMsg('❌ Network error');
    }
    setLoading(false);
  }

  const bestBid = orderBook.bids[0]?.price;
  const bestAsk = orderBook.asks[0]?.price;
  const spread = bestBid && bestAsk ? (bestAsk - bestBid).toFixed(2) : null;
  const midPrice = bestBid && bestAsk ? ((bestBid + bestAsk) / 2).toFixed(2) : selectedAsset?.tokenPrice;
  const total = price && units ? (parseFloat(price) * parseFloat(units)).toFixed(2) : '0.00';
  const fee = total !== '0.00' ? (parseFloat(total) * 0.005).toFixed(2) : '0.00';

  return (
    <>
      <Head><title>Exchange — Nextoken Capital</title>
        <style>{`
          @media(max-width:900px){
            .ex-main{grid-template-columns:1fr !important}
            .ex-sidebar{position:relative !important;top:auto !important;order:-1}
            .ex-hero-stats{gap:16px !important}
            .ex-hero-stats>div{min-width:auto}
          }
          @media(max-width:640px){
            .ex-ob-grid{grid-template-columns:1fr !important}
            .ex-ob-grid>div:first-child{border-right:none !important;border-bottom:1px solid #1a1a1a}
            .ex-hero-wrap{flex-direction:column !important;align-items:flex-start !important}
            .ex-hero-wrap select{width:100% !important;min-width:auto !important}
            .ex-hero-stats{flex-direction:column !important;gap:10px !important}
            .ex-tabs button{padding:10px 12px !important;font-size:12px !important}
            .ex-trades-row{grid-template-columns:1fr 1fr !important}
            .ex-trades-row span:nth-child(3),.ex-trades-row span:nth-child(4){display:none}
          }
        `}</style></Head>
      <Navbar />

      <div style={{ background: '#0B0E11', minHeight: '100vh', paddingTop: '72px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

        {/* ── HERO ASSET PICKER ── */}
        <div style={{ background: 'linear-gradient(180deg, #0F1318 0%, #0B0E11 100%)', borderBottom: '1px solid #1a1a1a', padding: '28px 24px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className='ex-hero-wrap' style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>

              {/* Asset Dropdown */}
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedAsset?._id || ''}
                  onChange={e => {
                    const a = assets.find(x => x._id === e.target.value);
                    setSelectedAsset(a || null);
                  }}
                  style={{
                    appearance: 'none', background: '#161B22', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff', padding: '12px 44px 12px 16px', borderRadius: '10px',
                    fontSize: '15px', fontWeight: '600', cursor: 'pointer', minWidth: '260px',
                    outline: 'none'
                  }}>
                  {assetsLoading && <option value="">Loading assets...</option>}
                  {!assetsLoading && assets.length === 0 && <option value="">No assets listed yet</option>}
                  {assets.map(a => (
                    <option key={a._id} value={a._id}>
                      {a.name} · {a.tokenSymbol || 'TKN'} · €{a.tokenPrice}
                    </option>
                  ))}
                </select>
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#F0B90B', pointerEvents: 'none', fontSize: '12px' }}>▼</span>
              </div>

              {/* Stats bar */}
              {selectedAsset && (
                <div className='ex-hero-stats' style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Mid Price</div>
                    <div style={{ color: '#F0B90B', fontSize: '22px', fontWeight: '800' }}>€{midPrice}</div>
                  </div>
                  {spread && (
                    <div>
                      <div style={{ color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Spread</div>
                      <div style={{ color: '#aaa', fontSize: '16px', fontWeight: '600' }}>€{spread}</div>
                    </div>
                  )}
                  <div>
                    <div style={{ color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Asset Type</div>
                    <div style={{ color: '#ccc', fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>{selectedAsset.assetType || '—'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Location</div>
                    <div style={{ color: '#ccc', fontSize: '14px' }}>{selectedAsset.location || '—'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Annual Yield</div>
                    <div style={{ color: '#0ECB81', fontSize: '16px', fontWeight: '700' }}>{selectedAsset.annualYield ? `${selectedAsset.annualYield}%` : '—'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Total Supply</div>
                    <div style={{ color: '#ccc', fontSize: '14px' }}>{selectedAsset.totalTokens?.toLocaleString() || '—'} tokens</div>
                  </div>
                </div>
              )}
            </div>

            {/* Asset category pills */}
            {assets.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                {[...new Set(assets.map(a => a.assetType).filter(Boolean))].map(type => (
                  <button key={type} onClick={() => {
                    const a = assets.find(x => x.assetType === type);
                    if (a) { setSelectedAsset(a); }
                  }}
                    style={{
                      background: selectedAsset?.assetType === type ? '#F0B90B' : '#161B22',
                      color: selectedAsset?.assetType === type ? '#000' : '#666',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
                      padding: '5px 14px', fontSize: '12px', cursor: 'pointer',
                      fontWeight: '600', textTransform: 'capitalize', transition: 'all 0.2s'
                    }}>
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── MAIN TRADING LAYOUT ── */}
        {!selectedAsset ? (
          <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
            <div style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>
              {assetsLoading ? 'Loading assets...' : 'No assets listed yet'}
            </div>
            <div style={{ color: '#555', fontSize: '15px', lineHeight: '1.7' }}>
              {assetsLoading
                ? 'Fetching available assets from the blockchain...'
                : 'Once assets are tokenized and approved, they will appear here for trading.'}
            </div>
          </div>
        ) : (
          <div className='ex-main' style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', className: 'ex-main', paddingBottom: '40px', paddingTop: '16px' }}>

            {/* ── LEFT PANEL ── */}
            <div>

              {/* Price chart area */}
              <div style={{ background: '#0F1318', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px', color: '#fff' }}>Price History</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['1D', '7D', '30D', '90D'].map(r => (
                      <button key={r} style={{ background: r === '7D' ? '#F0B90B' : '#161B22', color: r === '7D' ? '#000' : '#555', border: '1px solid #222', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>{r}</button>
                    ))}
                  </div>
                </div>
                <div style={{ height: '180px', background: '#0B0E11', borderRadius: '8px', border: '1px solid #161616', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '40px' }}>📈</div>
                  <div style={{ color: '#333', fontSize: '14px' }}>
                    {trades.length > 0 ? `${trades.length} trades executed — chart coming soon` : 'No trading data yet. Place orders to start.'}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ background: '#0F1318', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a' }}>
                  {[
                    { key: 'orderbook', label: 'Order Book' },
                    { key: 'trades', label: `Recent Trades${trades.length ? ` (${trades.length})` : ''}` },
                    { key: 'myorders', label: 'My Orders' }
                  ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                      padding: '14px 22px', background: 'none', border: 'none',
                      borderBottom: tab === t.key ? '2px solid #F0B90B' : '2px solid transparent',
                      color: tab === t.key ? '#F0B90B' : '#555', cursor: 'pointer',
                      fontSize: '13px', fontWeight: '600', transition: 'all 0.2s'
                    }}>{t.label}</button>
                  ))}
                </div>

                {/* ORDER BOOK */}
                {tab === 'orderbook' && (
                  <div className='ex-ob-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    {/* Bids */}
                    <div style={{ padding: '16px', borderRight: '1px solid #1a1a1a' }}>
                      <div style={{ color: '#0ECB81', fontWeight: '700', fontSize: '12px', letterSpacing: '1px', marginBottom: '14px' }}>▲ BIDS (Buyers)</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '8px' }}>
                        {['Price €', 'Units', 'Value €'].map(h => <span key={h} style={{ color: '#333', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>)}
                      </div>
                      {orderBook.bids.length === 0
                        ? <div style={{ color: 'rgba(255,255,255,0.08)', fontSize: '13px', paddingTop: '24px', textAlign: 'center' }}>No bids yet</div>
                        : orderBook.bids.map((b, i) => (
                          <div key={i} onClick={() => { setPrice(b.price.toString()); setSide('sell'); }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '6px 0', borderBottom: '1px solid #111', cursor: 'pointer', borderRadius: '4px' }}>
                            <span style={{ color: '#0ECB81', fontSize: '13px', fontWeight: '600' }}>{b.price}</span>
                            <span style={{ color: '#aaa', fontSize: '13px' }}>{b.units}</span>
                            <span style={{ color: '#555', fontSize: '13px' }}>{(b.price * b.units).toFixed(0)}</span>
                          </div>
                        ))}
                    </div>

                    {/* Asks */}
                    <div style={{ padding: '16px' }}>
                      <div style={{ color: '#ef4444', fontWeight: '700', fontSize: '12px', letterSpacing: '1px', marginBottom: '14px' }}>▼ ASKS (Sellers)</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '8px' }}>
                        {['Price €', 'Units', 'Value €'].map(h => <span key={h} style={{ color: '#333', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>)}
                      </div>
                      {orderBook.asks.length === 0
                        ? <div style={{ color: 'rgba(255,255,255,0.08)', fontSize: '13px', paddingTop: '24px', textAlign: 'center' }}>No asks yet</div>
                        : orderBook.asks.map((a, i) => (
                          <div key={i} onClick={() => { setPrice(a.price.toString()); setSide('buy'); }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '6px 0', borderBottom: '1px solid #111', cursor: 'pointer', borderRadius: '4px' }}>
                            <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '600' }}>{a.price}</span>
                            <span style={{ color: '#aaa', fontSize: '13px' }}>{a.units}</span>
                            <span style={{ color: '#555', fontSize: '13px' }}>{(a.price * a.units).toFixed(0)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* TRADES */}
                {tab === 'trades' && (
                  <div style={{ padding: '16px' }}>
                    {trades.length === 0
                      ? <div style={{ color: 'rgba(255,255,255,0.08)', textAlign: 'center', padding: '40px', fontSize: '14px' }}>No trades executed yet</div>
                      : trades.map((t, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '8px 0', borderBottom: '1px solid #111', fontSize: '13px' }}>
                          <span style={{ color: '#444' }}>{new Date(t.createdAt).toLocaleTimeString()}</span>
                          <span style={{ color: t.side === 'buy' ? '#0ECB81' : '#ef4444', fontWeight: '600', textTransform: 'uppercase' }}>{t.side || 'TRADE'}</span>
                          <span style={{ color: '#aaa' }}>{t.units} units</span>
                          <span style={{ color: '#F0B90B', fontWeight: '600' }}>€{t.price}</span>
                        </div>
                      ))}
                  </div>
                )}

                {/* MY ORDERS */}
                {tab === 'myorders' && (
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔐</div>
                    <div style={{ color: '#555', fontSize: '14px' }}>Log in to view and manage your orders</div>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT PANEL: Place Order ── */}
            <div className='ex-sidebar' style={{ position: 'sticky', top: '88px', height: 'fit-content' }}>
              <div style={{ background: '#0F1318', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '20px', color: '#fff' }}>Place Order</div>

                {/* Limit / Market toggle */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '16px', background: '#0F1318', padding: '4px', borderRadius: '10px', border: '1px solid #1a1a1a' }}>
                  {['limit', 'market'].map(t => (
                    <button key={t} onClick={() => setOrderType(t)} style={{
                      background: orderType === t ? '#1e1e1e' : 'none', border: orderType === t ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                      color: orderType === t ? '#fff' : '#555', borderRadius: '8px', padding: '9px',
                      cursor: 'pointer', fontSize: '13px', fontWeight: '600', textTransform: 'capitalize', transition: 'all 0.2s'
                    }}>{t}</button>
                  ))}
                </div>

                {/* Buy / Sell */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                  <button onClick={() => setSide('buy')} style={{
                    background: side === 'buy' ? 'linear-gradient(135deg,#0ECB81,#0A9D63)' : '#111',
                    border: `1px solid ${side === 'buy' ? '#0ECB81' : 'rgba(255,255,255,0.06)'}`,
                    color: '#fff', borderRadius: '10px', padding: '13px', cursor: 'pointer',
                    fontWeight: '800', fontSize: '15px', letterSpacing: '0.5px', transition: 'all 0.2s'
                  }}>BUY</button>
                  <button onClick={() => setSide('sell')} style={{
                    background: side === 'sell' ? 'linear-gradient(135deg,#cf2222,#991b1b)' : '#111',
                    border: `1px solid ${side === 'sell' ? '#cf2222' : 'rgba(255,255,255,0.06)'}`,
                    color: '#fff', borderRadius: '10px', padding: '13px', cursor: 'pointer',
                    fontWeight: '800', fontSize: '15px', letterSpacing: '0.5px', transition: 'all 0.2s'
                  }}>SELL</button>
                </div>

                <form onSubmit={placeOrder}>
                  {orderType === 'limit' && (
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ color: '#555', fontSize: '11px', letterSpacing: '1px', display: 'block', marginBottom: '7px', textTransform: 'uppercase' }}>Price (EUR)</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: '14px' }}>€</span>
                        <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)}
                          placeholder={selectedAsset.tokenPrice || '0'}
                          style={{ width: '100%', background: '#0F1318', border: '1px solid #222', color: '#fff', padding: '12px 12px 12px 28px', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }} />
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ color: '#555', fontSize: '11px', letterSpacing: '1px', display: 'block', marginBottom: '7px', textTransform: 'uppercase' }}>Units</label>
                    <input type="number" step="1" min="1" value={units} onChange={e => setUnits(e.target.value)}
                      placeholder="0"
                      style={{ width: '100%', background: '#0F1318', border: '1px solid #222', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }} />
                    {/* Quick picks */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      {['1', '5', '10', '25'].map(n => (
                        <button key={n} type="button" onClick={() => setUnits(n)}
                          style={{ flex: 1, background: '#111', border: '1px solid rgba(255,255,255,0.06)', color: '#666', borderRadius: '6px', padding: '5px 0', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>{n}</button>
                      ))}
                    </div>
                  </div>

                  {/* Summary box */}
                  <div style={{ background: '#0F1318', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ color: '#444' }}>Subtotal</span>
                      <span style={{ color: '#888' }}>€{total}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ color: '#444' }}>Fee (0.5%)</span>
                      <span style={{ color: '#888' }}>€{fee}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#666', fontWeight: '600' }}>Total</span>
                      <span style={{ color: '#F0B90B', fontWeight: '800' }}>€{(parseFloat(total) + parseFloat(fee)).toFixed(2)}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading || !units}
                    style={{
                      width: '100%',
                      background: !units ? '#111' : side === 'buy' ? 'linear-gradient(135deg,#0ECB81,#0A9D63)' : 'linear-gradient(135deg,#cf2222,#991b1b)',
                      color: !units ? '#333' : '#fff', border: 'none', borderRadius: '10px',
                      padding: '15px', fontSize: '15px', fontWeight: '800', cursor: loading || !units ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.5px', transition: 'all 0.2s'
                    }}>
                    {loading ? 'Placing...' : `${orderType === 'limit' ? 'Limit' : 'Market'} ${side === 'buy' ? 'Buy' : 'Sell'}`}
                  </button>
                </form>

                {msg && (
                  <div style={{ marginTop: '12px', padding: '12px', background: msg.startsWith('✅') ? '#062015' : '#2d0a0a', border: `1px solid ${msg.startsWith('✅') ? '#065f46' : '#7f1d1d'}`, borderRadius: '8px', fontSize: '13px', color: msg.startsWith('✅') ? '#0ECB81' : '#ef4444', textAlign: 'center', fontWeight: '600' }}>
                    {msg}
                  </div>
                )}

                {/* Asset details */}
                <div style={{ marginTop: '16px', background: '#0F1318', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ color: '#333', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '700' }}>Asset Details</div>
                  {[
                    ['Token Symbol', selectedAsset.tokenSymbol || '—'],
                    ['Token Price', `€${selectedAsset.tokenPrice}`],
                    ['Min Investment', selectedAsset.minInvestment ? `€${selectedAsset.minInvestment}` : '—'],
                    ['Annual Yield', selectedAsset.annualYield ? `${selectedAsset.annualYield}%` : '—'],
                    ['Investment Term', selectedAsset.investmentTerm || '—'],
                    ['Total Supply', selectedAsset.totalTokens?.toLocaleString() || '—'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px', fontSize: '12px' }}>
                      <span style={{ color: '#3a3a3a' }}>{k}</span>
                      <span style={{ color: '#888', fontWeight: '500' }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ color: 'rgba(255,255,255,0.08)', fontSize: '11px', textAlign: 'center', marginTop: '12px', lineHeight: '1.5' }}>
                  Orders auto-expire in 7 days · 0.5% fee per side · Refreshes every 10s
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}
