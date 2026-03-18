import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'

const marketData = [
  { name: 'Baltic Office RE Token', symbol: 'BORE', category: 'Real Estate', price: 12.48, change: 3.42, volume: '€1.2M', yield: '8.4%', status: 'Live' },
  { name: 'Green Energy Bond 2028', symbol: 'GEB28', category: 'Bond', price: 98.4, change: 0.18, volume: '€820K', yield: '6.1%', status: 'Live' },
  { name: 'SME Equity Series A', symbol: 'SMEA', category: 'Equity', price: 18.75, change: 1.2, volume: '€410K', yield: '—', status: 'Live' },
  { name: 'Infrastructure Yield Note', symbol: 'IYN3', category: 'Bond', price: 101.2, change: 0.54, volume: '€2.8M', yield: '5.3%', status: 'Live' },
  { name: 'Vilnius Housing Token', symbol: 'VHT', category: 'Real Estate', price: 24.5, change: -0.82, volume: '€690K', yield: '7.2%', status: 'Live' },
  { name: 'Convertible Growth Note', symbol: 'CGN26', category: 'Bond', price: 99.8, change: 0.22, volume: '€530K', yield: '7.8%', status: 'Upcoming' },
  { name: 'Agri Commodity Token', symbol: 'AGCT', category: 'Commodity', price: 7.15, change: 4.8, volume: '€350K', yield: '—', status: 'Live' },
  { name: 'Fintech Private Equity', symbol: 'FTPE', category: 'Equity', price: 31.2, change: -1.1, volume: '€260K', yield: '—', status: 'Private' },
]

const tabs = ['All', 'Bond', 'Equity', 'Real Estate', 'Commodity']

export default function MarketsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const gold = '#F0B90B'
  const dark = '#0B0E11'
  const dark2 = '#161A1E'
  const dark3 = '#1E2329'
  const green = '#0ECB81'
  const red = '#F6465D'
  const border = 'rgba(255,255,255,0.06)'
  const muted = 'rgba(255,255,255,0.5)'

  const filteredData = useMemo(() => {
    let data = [...marketData]

    if (activeTab !== 'All') {
      data = data.filter((item) => item.category === activeTab)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.symbol.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
    }

    data.sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price
      if (sortBy === 'change') return b.change - a.change
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      return a.name.localeCompare(b.name)
    })

    return data
  }, [activeTab, search, sortBy])

  return (
    <div style={{ background: dark, minHeight: '100vh', color: 'rgba(255,255,255,0.88)', fontFamily: 'Inter, sans-serif' }}>
      {/* HERO */}
      <section
        style={{
          padding: '7rem 5% 4rem',
          position: 'relative',
          overflow: 'hidden',
          background: dark
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(240,185,11,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(240,185,11,0.04) 1px,transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse at 60% 50%,black 20%,transparent 70%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '-5%',
            top: '-10%',
            width: 600,
            height: 500,
            background: 'radial-gradient(circle,rgba(240,185,11,0.06),transparent 65%)',
            pointerEvents: 'none'
          }}
        />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 760 }}>
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
                marginBottom: '1rem'
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: green }} />
              Live Marketplace
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem,4vw,3.8rem)',
                lineHeight: 1.05,
                fontWeight: 900,
                marginBottom: '1rem',
                color: '#fff',
                letterSpacing: '-1.5px'
              }}
            >
              Explore
              <span style={{ color: gold }}> Tokenized Markets</span>
            </h1>

            <p
              style={{
                color: muted,
                fontSize: '1rem',
                lineHeight: 1.8,
                maxWidth: 620,
                marginBottom: '2rem'
              }}
            >
              Track tokenized bonds, equity offerings, real estate assets, and digital structured products
              from one modern capital markets interface.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.25rem' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('market-table')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                style={primaryButton(gold)}
              >
                Explore Listings
              </button>

              <button
                onClick={() => router.push('/exchange')}
                style={secondaryButton(gold)}
              >
                Open Exchange
              </button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                ['24/7', 'Market Access'],
                ['Multi-Asset', 'Listings'],
                ['Live', 'Order Flow Ready'],
                ['Issuer', 'Discovery']
              ].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: gold }}>{n}</div>
                  <div style={{ fontSize: '0.68rem', color: muted, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section
        style={{
          background: dark2,
          borderTop: `1px solid ${border}`,
          borderBottom: `1px solid ${border}`,
          padding: '1rem 5%'
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
            gap: '1rem'
          }}
        >
          {[
            ['8+', 'Live Listings'],
            ['4', 'Asset Classes'],
            ['€7M+', 'Visible Volume'],
            ['24/7', 'Market Availability'],
            ['0.2%', 'Trading Fee Target']
          ].map(([n, l]) => (
            <div key={l}>
              <div style={{ color: gold, fontSize: '1.2rem', fontWeight: 900 }}>{n}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section style={{ background: dark, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              color: gold,
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}
          >
            Market Overview
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            What You Can Access
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: 1,
              background: border
            }}
          >
            {[
              ['Tokenized Bonds', 'Fixed-income products with yield visibility and lifecycle tracking.'],
              ['Equity Offerings', 'Private and public-style digital equity access with structured discovery.'],
              ['Real Estate', 'Fractional real estate exposure with digital ownership logic.'],
              ['Alternative Assets', 'Commodities and structured products with issuer-led listings.']
            ].map(([title, desc]) => (
              <div key={title} style={{ background: dark2, padding: '1.5rem' }}>
                <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</div>
                <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET TABLE */}
      <section id="market-table" style={{ background: dark2, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem'
            }}
          >
            <div>
              <div
                style={{
                  color: gold,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}
              >
                Listings
              </div>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, margin: 0 }}>
                Market Directory
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search by asset, symbol, category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  minWidth: 260,
                  background: dark3,
                  color: 'white',
                  border: `1px solid ${border}`,
                  borderRadius: 4,
                  padding: '0.8rem 0.9rem',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: dark3,
                  color: 'white',
                  border: `1px solid ${border}`,
                  borderRadius: 4,
                  padding: '0.8rem 0.9rem',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="name">Sort: Name</option>
                <option value="price">Sort: Price</option>
                <option value="change">Sort: 24h Change</option>
                <option value="category">Sort: Category</option>
              </select>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.65rem 1rem',
                  background: activeTab === tab ? gold : dark3,
                  color: activeTab === tab ? 'black' : 'rgba(255,255,255,0.78)',
                  border: 'none',
                  borderRadius: 4,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div
            style={{
              background: dark,
              border: `1px solid ${border}`,
              borderRadius: 6,
              overflow: 'hidden'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
                <thead>
                  <tr>
                    {['Asset', 'Symbol', 'Category', 'Price', '24h Change', 'Volume', 'Yield', 'Status', 'Action'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '0.9rem 1rem',
                          textAlign: 'left',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          letterSpacing: '1.5px',
                          textTransform: 'uppercase',
                          color: muted,
                          background: dark3,
                          borderBottom: `1px solid ${border}`,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((item) => {
                    const up = item.change >= 0
                    return (
                      <tr
                        key={item.symbol}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <td style={cellStyle(border)}>
                          <div style={{ color: '#fff', fontWeight: 700 }}>{item.name}</div>
                        </td>
                        <td style={cellStyle(border)}>
                          <span style={{ color: muted, fontWeight: 700 }}>{item.symbol}</span>
                        </td>
                        <td style={cellStyle(border)}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: 3,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: 'rgba(240,185,11,0.08)',
                              color: gold
                            }}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td style={cellStyle(border)}>
                          <span style={{ color: '#fff', fontWeight: 700 }}>€{item.price}</span>
                        </td>
                        <td style={cellStyle(border)}>
                          <span
                            style={{
                              color: up ? green : red,
                              fontWeight: 800
                            }}
                          >
                            {up ? '+' : ''}
                            {item.change}%
                          </span>
                        </td>
                        <td style={cellStyle(border)}>
                          <span style={{ color: muted }}>{item.volume}</span>
                        </td>
                        <td style={cellStyle(border)}>
                          <span style={{ color: item.yield === '—' ? muted : gold, fontWeight: 700 }}>{item.yield}</span>
                        </td>
                        <td style={cellStyle(border)}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: 3,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background:
                                item.status === 'Live'
                                  ? 'rgba(14,203,129,0.1)'
                                  : item.status === 'Upcoming'
                                  ? 'rgba(240,185,11,0.1)'
                                  : 'rgba(255,255,255,0.08)',
                              color:
                                item.status === 'Live'
                                  ? green
                                  : item.status === 'Upcoming'
                                  ? gold
                                  : 'rgba(255,255,255,0.7)'
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td style={cellStyle(border)}>
                          <button
                            onClick={() => router.push('/exchange')}
                            style={{
                              background: gold,
                              color: 'black',
                              border: 'none',
                              padding: '0.5rem 0.9rem',
                              borderRadius: 4,
                              fontWeight: 800,
                              cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}

                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        style={{
                          padding: '2rem 1rem',
                          textAlign: 'center',
                          color: muted
                        }}
                      >
                        No assets found for your current search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* TOP MOVERS */}
      <section style={{ background: dark, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              color: gold,
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}
          >
            Highlights
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            Top Movers
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
              gap: 1,
              background: border
            }}
          >
            {marketData
              .slice()
              .sort((a, b) => b.change - a.change)
              .slice(0, 4)
              .map((item) => (
                <div key={item.symbol} style={{ background: dark2, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 800 }}>{item.name}</div>
                      <div style={{ color: muted, fontSize: '0.8rem' }}>{item.symbol}</div>
                    </div>
                    <div style={{ color: green, fontWeight: 900 }}>
                      +{item.change}%
                    </div>
                  </div>
                  <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    {item.category} listing with visible price activity and volume tracking.
                  </div>
                  <button
                    onClick={() => router.push('/exchange')}
                    style={secondaryButton(gold)}
                  >
                    Trade Market
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* WHY THIS MARKET */}
      <section style={{ background: dark2, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              color: gold,
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}
          >
            Why Nextoken Markets
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            Built for Discovery and Liquidity
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              gap: 1,
              background: border
            }}
          >
            {[
              ['Cross-Asset Access', 'View bonds, equity, real estate, and alternatives from one interface.'],
              ['Market Visibility', 'Compare pricing, change, volume, and yield with fast filtering.'],
              ['Issuer Discovery', 'Highlight new listings and support capital formation visibility.'],
              ['Exchange Pathway', 'Move from market exploration into exchange and trading workflows.'],
              ['Structured Listings', 'Create a premium listing layer for tokenized capital market products.'],
              ['Institutional Style', 'Deliver a data-first experience aligned with modern trading platforms.']
            ].map(([title, desc]) => (
              <div key={title} style={{ background: dark3, padding: '1.5rem' }}>
                <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</div>
                <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: gold, padding: '4rem 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%,rgba(255,255,255,0.12),transparent 50%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 900, color: 'black', letterSpacing: '-1px', marginBottom: '0.75rem' }}>
            Ready to Explore the Exchange?
          </div>
          <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', margin: '0 auto 2rem', maxWidth: 480, lineHeight: 1.7 }}>
            Move from market discovery to live exchange access and start building a modern capital markets experience.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/exchange')} style={darkCtaButton()}>
              Open Exchange
            </button>
            <button onClick={() => router.push('/tokenize')} style={lightCtaButton()}>
              Tokenize an Asset
            </button>
          </div>
        </div>
      </section>

      {/* RISK NOTICE */}
      <section
        style={{
          background: dark,
          padding: '2rem 5% 4rem',
          borderTop: `1px solid ${border}`
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', lineHeight: 1.8 }}>
            Market notice: Pricing, yield, liquidity, and listing availability on digital asset marketplaces may vary
            based on issuer structure, investor eligibility, order flow, and market conditions. Asset availability and
            trading access may depend on internal review and jurisdictional constraints.
          </div>
        </div>
      </section>
    </div>
  )
}

function cellStyle(border) {
  return {
    padding: '0.9rem 1rem',
    borderBottom: `1px solid ${border}`,
    whiteSpace: 'nowrap'
  }
}

function primaryButton(gold) {
  return {
    background: gold,
    color: 'black',
    border: 'none',
    padding: '0.9rem 1.8rem',
    borderRadius: 4,
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  }
}

function secondaryButton(gold) {
  return {
    background: 'transparent',
    color: 'rgba(255,255,255,0.82)',
    border: '1px solid rgba(240,185,11,0.25)',
    padding: '0.9rem 1.8rem',
    borderRadius: 4,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif'
  }
}

function darkCtaButton() {
  return {
    padding: '0.85rem 2.2rem',
    background: 'black',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    fontSize: '0.9rem',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'Inter,sans-serif'
  }
}

function lightCtaButton() {
  return {
    padding: '0.85rem 2.2rem',
    background: 'transparent',
    color: 'rgba(0,0,0,0.75)',
    border: '1.5px solid rgba(0,0,0,0.2)',
    borderRadius: 4,
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'Inter,sans-serif'
  }
}