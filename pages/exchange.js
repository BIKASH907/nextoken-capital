import { useEffect, useMemo, useRef, useState } from 'react'

const PAIRS = [
  {
    name: 'BTC/EUR',
    symbol: 'BTCEUR',
    tvSymbol: 'BINANCE:BTCEUR',
    base: 'BTC',
    quote: 'EUR',
    type: 'Crypto',
  },
  {
    name: 'ETH/EUR',
    symbol: 'ETHEUR',
    tvSymbol: 'BINANCE:ETHEUR',
    base: 'ETH',
    quote: 'EUR',
    type: 'Crypto',
  },
  {
    name: 'BNB/EUR',
    symbol: 'BNBEUR',
    tvSymbol: 'BINANCE:BNBEUR',
    base: 'BNB',
    quote: 'EUR',
    type: 'Crypto',
  },
  {
    name: 'BTC/USDT',
    symbol: 'BTCUSDT',
    tvSymbol: 'BINANCE:BTCUSDT',
    base: 'BTC',
    quote: 'USDT',
    type: 'Crypto',
  },
]

const DEFAULT_WALLET = {
  EUR: 25000,
  USDT: 10000,
  BTC: 0.35,
  ETH: 4.2,
  BNB: 18,
}

export default function ExchangePage() {
  const gold = '#F0B90B'
  const dark = '#0B0E11'
  const dark2 = '#161A1E'
  const dark3 = '#1E2329'
  const green = '#0ECB81'
  const red = '#F6465D'
  const border = 'rgba(255,255,255,0.06)'
  const muted = 'rgba(255,255,255,0.5)'

  const [selectedPair, setSelectedPair] = useState(PAIRS[0])
  const [tickerMap, setTickerMap] = useState({})
  const [wallet, setWallet] = useState(DEFAULT_WALLET)
  const [orderHistory, setOrderHistory] = useState([])
  const [tradeSide, setTradeSide] = useState('buy')
  const [orderType, setOrderType] = useState('limit')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [chartReady, setChartReady] = useState(false)

  const chartContainerRef = useRef(null)
  const chartWidgetRef = useRef(null)
  const tvScriptLoadedRef = useRef(false)
  const wsRef = useRef(null)

  const currentTicker = tickerMap[selectedPair.symbol] || null
  const marketPrice = currentTicker?.lastPrice ? Number(currentTicker.lastPrice) : 0

  const total = useMemo(() => {
    const p = Number(price || 0)
    const a = Number(amount || 0)
    return p && a ? p * a : 0
  }, [price, amount])

  useEffect(() => {
    try {
      const savedWallet = localStorage.getItem('nxt_wallet')
      const savedOrders = localStorage.getItem('nxt_order_history')
      if (savedWallet) setWallet(JSON.parse(savedWallet))
      if (savedOrders) setOrderHistory(JSON.parse(savedOrders))
    } catch (err) {
      console.error('Failed to load local data', err)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('nxt_wallet', JSON.stringify(wallet))
      localStorage.setItem('nxt_order_history', JSON.stringify(orderHistory))
    } catch (err) {
      console.error('Failed to save local data', err)
    }
  }, [wallet, orderHistory])

  useEffect(() => {
    let ignore = false

    async function loadAllTickers() {
      try {
        const res = await fetch('https://data-api.binance.vision/api/v3/ticker/24hr')
        if (!res.ok) throw new Error(`Ticker request failed: ${res.status}`)
        const data = await res.json()

        if (ignore) return

        const nextMap = {}
        for (const item of data) {
          nextMap[item.symbol] = item
        }
        setTickerMap(nextMap)
      } catch (err) {
        console.error('Failed to load tickers', err)
      }
    }

    loadAllTickers()
    const interval = setInterval(loadAllTickers, 15000)

    return () => {
      ignore = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!selectedPair?.symbol) return

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    const streamName = `${selectedPair.symbol.toLowerCase()}@ticker`
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamName}`)
    wsRef.current = ws

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setTickerMap((prev) => ({
          ...prev,
          [selectedPair.symbol]: {
            ...(prev[selectedPair.symbol] || {}),
            symbol: data.s,
            lastPrice: data.c,
            priceChangePercent: data.P,
            highPrice: data.h,
            lowPrice: data.l,
            volume: data.v,
            quoteVolume: data.q,
          },
        }))
      } catch (err) {
        console.error('WebSocket parse error', err)
      }
    }

    ws.onerror = (err) => {
      console.error('WebSocket error', err)
    }

    return () => {
      ws.close()
    }
  }, [selectedPair])

  useEffect(() => {
    if (marketPrice > 0) {
      setPrice((prev) => (prev ? prev : String(marketPrice.toFixed(2))))
    }
  }, [marketPrice, selectedPair])

  useEffect(() => {
    function loadTradingViewScript() {
      return new Promise((resolve, reject) => {
        if (window.TradingView) {
          tvScriptLoadedRef.current = true
          resolve()
          return
        }

        const existing = document.getElementById('tradingview-widget-script')
        if (existing) {
          existing.addEventListener('load', () => resolve())
          existing.addEventListener('error', reject)
          return
        }

        const script = document.createElement('script')
        script.id = 'tradingview-widget-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.async = true
        script.onload = () => {
          tvScriptLoadedRef.current = true
          resolve()
        }
        script.onerror = reject
        document.body.appendChild(script)
      })
    }

    async function initChart() {
      try {
        await loadTradingViewScript()

        if (!chartContainerRef.current || !window.TradingView) return

        chartContainerRef.current.innerHTML = ''

        chartWidgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol: selectedPair.tvSymbol,
          interval: '60',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: 'tradingview_exchange_chart',
          studies: ['Volume@tv-basicstudies'],
          overrides: {
            'paneProperties.background': dark2,
            'paneProperties.vertGridProperties.color': 'rgba(255,255,255,0.05)',
            'paneProperties.horzGridProperties.color': 'rgba(255,255,255,0.05)',
            'symbolWatermarkProperties.transparency': 90,
            'scalesProperties.textColor': 'rgba(255,255,255,0.55)',
          },
        })

        setChartReady(true)
      } catch (err) {
        console.error('Failed to load TradingView widget', err)
        setChartReady(false)
      }
    }

    initChart()
  }, [selectedPair, dark2])

  const displayedPrice =
    orderType === 'market'
      ? marketPrice || Number(price || 0)
      : Number(price || 0)

  function formatMoney(value, currency = selectedPair.quote) {
    if (!Number.isFinite(value)) return `0 ${currency}`
    return `${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency}`
  }

  function formatAsset(value, symbol) {
    if (!Number.isFinite(value)) return `0 ${symbol}`
    return `${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })} ${symbol}`
  }

  function resetTradeForm() {
    setAmount('')
    setPrice(marketPrice > 0 ? String(marketPrice.toFixed(2)) : '')
  }

  function placeOrder() {
    const p = Number(displayedPrice)
    const a = Number(amount)

    if (!p || !a || p <= 0 || a <= 0) {
      setStatusMessage('Enter a valid price and amount.')
      return
    }

    const cost = p * a
    const baseAsset = selectedPair.base
    const quoteAsset = selectedPair.quote

    if (tradeSide === 'buy') {
      const availableQuote = Number(wallet[quoteAsset] || 0)
      if (availableQuote < cost) {
        setStatusMessage(`Insufficient ${quoteAsset} balance.`)
        return
      }

      const nextWallet = {
        ...wallet,
        [quoteAsset]: availableQuote - cost,
        [baseAsset]: Number(wallet[baseAsset] || 0) + a,
      }
      setWallet(nextWallet)
    } else {
      const availableBase = Number(wallet[baseAsset] || 0)
      if (availableBase < a) {
        setStatusMessage(`Insufficient ${baseAsset} balance.`)
        return
      }

      const nextWallet = {
        ...wallet,
        [baseAsset]: availableBase - a,
        [quoteAsset]: Number(wallet[quoteAsset] || 0) + cost,
      }
      setWallet(nextWallet)
    }

    const newOrder = {
      id: Date.now(),
      time: new Date().toLocaleString(),
      pair: selectedPair.name,
      side: tradeSide.toUpperCase(),
      type: orderType.toUpperCase(),
      price: p,
      amount: a,
      total: cost,
      status: 'FILLED',
    }

    setOrderHistory((prev) => [newOrder, ...prev].slice(0, 20))
    setStatusMessage(`${tradeSide.toUpperCase()} order filled successfully.`)
    resetTradeForm()
  }

  const bids = useMemo(() => {
    const base = marketPrice || 100
    return Array.from({ length: 7 }, (_, i) => ({
      price: Math.max(base - i * 0.25, 0.01),
      amount: 0.25 + i * 0.12,
    }))
  }, [marketPrice])

  const asks = useMemo(() => {
    const base = marketPrice || 100
    return Array.from({ length: 7 }, (_, i) => ({
      price: base + i * 0.25,
      amount: 0.28 + i * 0.14,
    }))
  }, [marketPrice])

  return (
    <div style={{ background: dark, minHeight: '100vh', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <section
        style={{
          padding: '7rem 5% 1.5rem',
          borderBottom: `1px solid ${border}`,
          background: dark,
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  border: '1px solid rgba(240,185,11,0.25)',
                  borderRadius: 999,
                  color: gold,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                }}
              >
                Exchange Terminal
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>
                {selectedPair.name}{' '}
                <span style={{ color: gold }}>Live Trading</span>
              </h1>
              <p style={{ color: muted, marginTop: '0.7rem', maxWidth: 720 }}>
                Interactive charting, live market price feed, wallet balances, simulated order execution,
                and order history in one exchange interface.
              </p>
            </div>

            <div
              style={{
                background: dark2,
                border: `1px solid ${border}`,
                borderRadius: 6,
                padding: '1rem 1.2rem',
                minWidth: 280,
              }}
            >
              <div style={{ fontSize: '0.75rem', color: muted, marginBottom: '0.35rem' }}>
                Last Price
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
                {marketPrice ? formatMoney(marketPrice) : '--'}
              </div>
              <div
                style={{
                  marginTop: '0.45rem',
                  color:
                    Number(currentTicker?.priceChangePercent || 0) >= 0 ? green : red,
                  fontWeight: 800,
                }}
              >
                {currentTicker?.priceChangePercent
                  ? `${Number(currentTicker.priceChangePercent) >= 0 ? '+' : ''}${Number(
                      currentTicker.priceChangePercent
                    ).toFixed(2)}%`
                  : '--'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '1rem 5%' }}>
        <div
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '260px 1fr 360px',
            gap: '1rem',
            alignItems: 'start',
          }}
        >
          <div style={panelStyle(dark2, border)}>
            <div style={panelTitleStyle}>Markets</div>
            <div style={{ display: 'grid', gap: '0.55rem' }}>
              {PAIRS.map((pair) => {
                const ticker = tickerMap[pair.symbol]
                const pct = Number(ticker?.priceChangePercent || 0)
                const last = Number(ticker?.lastPrice || 0)
                const selected = selectedPair.symbol === pair.symbol

                return (
                  <button
                    key={pair.symbol}
                    onClick={() => {
                      setSelectedPair(pair)
                      setPrice('')
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: selected ? dark3 : 'transparent',
                      border: `1px solid ${selected ? 'rgba(240,185,11,0.22)' : border}`,
                      borderRadius: 6,
                      padding: '0.8rem',
                      cursor: 'pointer',
                      color: 'white',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800 }}>{pair.name}</div>
                        <div style={{ fontSize: '0.76rem', color: muted }}>{pair.type}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800 }}>
                          {last ? formatMoney(last, pair.quote) : '--'}
                        </div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: pct >= 0 ? green : red,
                            fontWeight: 700,
                          }}
                        >
                          {pct >= 0 ? '+' : ''}
                          {pct.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div style={{ marginTop: '1rem', borderTop: `1px solid ${border}`, paddingTop: '1rem' }}>
              <div style={subTitleStyle}>Market Stats</div>
              <StatRow label="24h High" value={currentTicker?.highPrice ? formatMoney(Number(currentTicker.highPrice)) : '--'} muted={muted} />
              <StatRow label="24h Low" value={currentTicker?.lowPrice ? formatMoney(Number(currentTicker.lowPrice)) : '--'} muted={muted} />
              <StatRow label="Base Volume" value={currentTicker?.volume ? Number(currentTicker.volume).toLocaleString() : '--'} muted={muted} />
              <StatRow label="Quote Volume" value={currentTicker?.quoteVolume ? formatMoney(Number(currentTicker.quoteVolume)) : '--'} muted={muted} />
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={panelStyle(dark2, border)}>
              <div style={panelTitleStyle}>Advanced Chart</div>
              <div
                id="tradingview_exchange_chart"
                ref={chartContainerRef}
                style={{
                  width: '100%',
                  height: 480,
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: dark3,
                }}
              />
              {!chartReady && (
                <div style={{ color: muted, fontSize: '0.9rem', marginTop: '0.75rem' }}>
                  Loading TradingView chart...
                </div>
              )}
            </div>

            <div style={panelStyle(dark2, border)}>
              <div style={panelTitleStyle}>Order Book</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ color: green, fontWeight: 800, marginBottom: '0.7rem' }}>Bids</div>
                  {bids.map((row, idx) => (
                    <OrderBookRow
                      key={`bid-${idx}`}
                      price={row.price}
                      amount={row.amount}
                      color={green}
                      quote={selectedPair.quote}
                      base={selectedPair.base}
                    />
                  ))}
                </div>

                <div>
                  <div style={{ color: red, fontWeight: 800, marginBottom: '0.7rem' }}>Asks</div>
                  {asks.map((row, idx) => (
                    <OrderBookRow
                      key={`ask-${idx}`}
                      price={row.price}
                      amount={row.amount}
                      color={red}
                      quote={selectedPair.quote}
                      base={selectedPair.base}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={panelStyle(dark2, border)}>
              <div style={panelTitleStyle}>Order History</div>
              {orderHistory.length === 0 ? (
                <div style={{ color: muted }}>No orders yet.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                    <thead>
                      <tr>
                        {['Time', 'Pair', 'Side', 'Type', 'Price', 'Amount', 'Total', 'Status'].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: '0.8rem 0.6rem',
                              textAlign: 'left',
                              fontSize: '0.72rem',
                              letterSpacing: '1px',
                              textTransform: 'uppercase',
                              color: muted,
                              borderBottom: `1px solid ${border}`,
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map((order) => (
                        <tr key={order.id}>
                          <td style={tableCell(border)}>{order.time}</td>
                          <td style={tableCell(border)}>{order.pair}</td>
                          <td style={{ ...tableCell(border), color: order.side === 'BUY' ? green : red, fontWeight: 800 }}>
                            {order.side}
                          </td>
                          <td style={tableCell(border)}>{order.type}</td>
                          <td style={tableCell(border)}>{order.price.toFixed(2)}</td>
                          <td style={tableCell(border)}>{order.amount.toFixed(6)}</td>
                          <td style={tableCell(border)}>{order.total.toFixed(2)}</td>
                          <td style={tableCell(border)}>{order.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={panelStyle(dark2, border)}>
              <div style={panelTitleStyle}>Trade</div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {['buy', 'sell'].map((side) => (
                  <button
                    key={side}
                    onClick={() => setTradeSide(side)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontWeight: 800,
                      background:
                        tradeSide === side
                          ? side === 'buy'
                            ? green
                            : red
                          : dark3,
                      color:
                        tradeSide === side
                          ? 'white'
                          : 'rgba(255,255,255,0.72)',
                    }}
                  >
                    {side.toUpperCase()}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {['limit', 'market'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      border: `1px solid ${orderType === type ? 'rgba(240,185,11,0.22)' : border}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontWeight: 700,
                      background: orderType === type ? 'rgba(240,185,11,0.08)' : dark3,
                      color: orderType === type ? gold : 'rgba(255,255,255,0.72)',
                    }}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>

              <FormLabel text={`Price (${selectedPair.quote})`} muted={muted} />
              <input
                value={orderType === 'market' ? (marketPrice ? marketPrice.toFixed(2) : '') : price}
                onChange={(e) => setPrice(e.target.value)}
                readOnly={orderType === 'market'}
                style={inputStyle(orderType === 'market' ? dark3 : dark, border)}
                placeholder="Enter price"
              />

              <FormLabel text={`Amount (${selectedPair.base})`} muted={muted} />
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={inputStyle(dark, border)}
                placeholder="Enter amount"
              />

              <FormLabel text={`Total (${selectedPair.quote})`} muted={muted} />
              <input
                value={total ? total.toFixed(2) : ''}
                readOnly
                style={inputStyle(dark3, border)}
                placeholder="Calculated total"
              />

              <div style={{ marginTop: '1rem', display: 'grid', gap: '0.45rem' }}>
                <StatRow label="Available Quote" value={formatMoney(Number(wallet[selectedPair.quote] || 0), selectedPair.quote)} muted={muted} />
                <StatRow label="Available Base" value={formatAsset(Number(wallet[selectedPair.base] || 0), selectedPair.base)} muted={muted} />
              </div>

              <button
                onClick={placeOrder}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  background: tradeSide === 'buy' ? green : red,
                  border: 'none',
                  padding: '0.95rem',
                  borderRadius: 4,
                  fontWeight: 800,
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '0.95rem',
                }}
              >
                {tradeSide === 'buy' ? 'Buy' : 'Sell'} {selectedPair.base}
              </button>

              {statusMessage && (
                <div
                  style={{
                    marginTop: '0.8rem',
                    color: 'rgba(255,255,255,0.78)',
                    fontSize: '0.88rem',
                    background: dark3,
                    border: `1px solid ${border}`,
                    borderRadius: 4,
                    padding: '0.75rem',
                  }}
                >
                  {statusMessage}
                </div>
              )}
            </div>

            <div style={panelStyle(dark2, border)}>
              <div style={panelTitleStyle}>Wallet Balances</div>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {Object.entries(wallet).map(([asset, value]) => (
                  <div
                    key={asset}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      padding: '0.75rem 0.8rem',
                      border: `1px solid ${border}`,
                      borderRadius: 4,
                      background: dark3,
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{asset}</span>
                    <span style={{ color: '#fff' }}>
                      {asset === 'EUR' || asset === 'USDT'
                        ? Number(value).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : Number(value).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                          })}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setWallet(DEFAULT_WALLET)
                  setStatusMessage('Wallet reset to demo balances.')
                }}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  background: 'transparent',
                  border: `1px solid rgba(240,185,11,0.25)`,
                  padding: '0.85rem',
                  borderRadius: 4,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: gold,
                }}
              >
                Reset Demo Wallet
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function panelStyle(bg, border) {
  return {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 6,
    padding: '1rem',
  }
}

function panelTitleStyle() {
  return {
    fontWeight: 800,
    marginBottom: '1rem',
    fontSize: '1rem',
  }
}

function subTitleStyle() {
  return {
    fontWeight: 800,
    marginBottom: '0.75rem',
    fontSize: '0.9rem',
    color: 'white',
  }
}

function tableCell(border) {
  return {
    padding: '0.8rem 0.6rem',
    borderBottom: `1px solid ${border}`,
    color: 'rgba(255,255,255,0.82)',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  }
}

function inputStyle(bg, border) {
  return {
    width: '100%',
    padding: '0.8rem 0.85rem',
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 4,
    color: 'white',
    outline: 'none',
    marginBottom: '0.85rem',
    fontSize: '0.92rem',
  }
}

function FormLabel({ text, muted }) {
  return (
    <label
      style={{
        display: 'block',
        fontSize: '0.78rem',
        color: muted,
        marginBottom: '0.35rem',
        fontWeight: 700,
      }}
    >
      {text}
    </label>
  )
}

function StatRow({ label, value, muted }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
      <span style={{ color: muted }}>{label}</span>
      <span style={{ color: 'white', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function OrderBookRow({ price, amount, color, quote, base }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '0.45rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        fontSize: '0.88rem',
      }}
    >
      <span style={{ color, fontWeight: 700 }}>
        {price.toFixed(2)} {quote}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.72)' }}>
        {amount.toFixed(4)} {base}
      </span>
    </div>
  )
}