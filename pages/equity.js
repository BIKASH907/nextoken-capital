import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'

const equityData = [
  {
    name: 'Fintech Growth Series A',
    symbol: 'FTGS-A',
    sector: 'Fintech',
    issuer: 'NextPay Technologies',
    price: 12.8,
    change: 4.2,
    raise: '€4.8M',
    target: '€8M',
    progress: 60,
    minInvestment: '€250',
    stage: 'Series A',
    valuation: '€42M',
    status: 'Live',
  },
  {
    name: 'Green Mobility Equity',
    symbol: 'GMEQ',
    sector: 'Mobility',
    issuer: 'EcoMotion Systems',
    price: 18.2,
    change: 1.8,
    raise: '€2.1M',
    target: '€5M',
    progress: 42,
    minInvestment: '€500',
    stage: 'Growth',
    valuation: '€28M',
    status: 'Live',
  },
  {
    name: 'AgriTech Token Offering',
    symbol: 'AGTX',
    sector: 'AgriTech',
    issuer: 'AgroChain Labs',
    price: 7.4,
    change: -0.9,
    raise: '€1.6M',
    target: '€2M',
    progress: 80,
    minInvestment: '€100',
    stage: 'Seed',
    valuation: '€9M',
    status: 'Closing',
  },
  {
    name: 'Real Estate Platform Equity',
    symbol: 'REPF',
    sector: 'PropTech',
    issuer: 'UrbanLedger',
    price: 24.5,
    change: 2.3,
    raise: '€6.5M',
    target: '€10M',
    progress: 65,
    minInvestment: '€1,000',
    stage: 'Series B',
    valuation: '€75M',
    status: 'Live',
  },
  {
    name: 'Health Data Infrastructure',
    symbol: 'HDI',
    sector: 'HealthTech',
    issuer: 'MediGrid',
    price: 15.6,
    change: 0.7,
    raise: '€3.4M',
    target: '€6M',
    progress: 57,
    minInvestment: '€300',
    stage: 'Series A',
    valuation: '€31M',
    status: 'Upcoming',
  },
  {
    name: 'Digital Commerce Network',
    symbol: 'DCN',
    sector: 'E-Commerce',
    issuer: 'MarketLink Europe',
    price: 10.2,
    change: 3.6,
    raise: '€2.9M',
    target: '€4M',
    progress: 73,
    minInvestment: '€200',
    stage: 'Growth',
    valuation: '€22M',
    status: 'Live',
  },
]

const tabs = ['All', 'Fintech', 'Mobility', 'AgriTech', 'PropTech', 'HealthTech', 'E-Commerce']

export default function EquityPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('progress')

  const gold = '#F0B90B'
  const dark = '#0B0E11'
  const dark2 = '#161A1E'
  const dark3 = '#1E2329'
  const green = '#0ECB81'
  const red = '#F6465D'
  const border = 'rgba(255,255,255,0.06)'
  const muted = 'rgba(255,255,255,0.5)'

  const filteredData = useMemo(() => {
    let data = [...equityData]

    if (activeTab !== 'All') {
      data = data.filter((item) => item.sector === activeTab)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.symbol.toLowerCase().includes(q) ||
          item.issuer.toLowerCase().includes(q) ||
          item.sector.toLowerCase().includes(q)
      )
    }

    data.sort((a, b) => {
      if (sortBy === 'progress') return b.progress - a.progress
      if (sortBy === 'price') return b.price - a.price
      if (sortBy === 'change') return b.change - a.change
      if (sortBy === 'stage') return a.stage.localeCompare(b.stage)
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
          background: dark,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(240,185,11,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(240,185,11,0.04) 1px,transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse at 60% 50%,black 20%,transparent 70%)',
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
            pointerEvents: 'none',
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
                marginBottom: '1rem',
              }}
            >
              Equity & IPO Market
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem,4vw,3.8rem)',
                lineHeight: 1.05,
                fontWeight: 900,
                marginBottom: '1rem',
                color: '#fff',
                letterSpacing: '-1.5px',
              }}
            >
              Digital
              <span style={{ color: gold }}> Equity Offerings</span>
            </h1>

            <p
              style={{
                color: muted,
                fontSize: '1rem',
                lineHeight: 1.8,
                maxWidth: 620,
                marginBottom: '2rem',
              }}
            >
              Discover tokenized equity rounds, digital fundraising opportunities, and modern
              ownership structures across high-growth sectors and issuer categories.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.25rem' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('equity-table')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                style={primaryButton(gold)}
              >
                Explore Equity
              </button>

              <button
                onClick={() => router.push('/tokenize')}
                style={secondaryButton(gold)}
              >
                Launch Offering
              </button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                ['Live', 'Fundraising'],
                ['Sector-Based', 'Discovery'],
                ['Digital', 'Ownership Access'],
                ['Growth', 'Capital Formation'],
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
          padding: '1rem 5%',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
            gap: '1rem',
          }}
        >
          {[
            ['6+', 'Live Offerings'],
            ['€35M+', 'Visible Raise Pipeline'],
            ['7', 'Sector Filters'],
            ['€100', 'Lowest Entry Point'],
            ['Series A–B', 'Growth Stages'],
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

      {/* SECTORS */}
      <section style={{ background: dark, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              color: gold,
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Sectors
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            Equity Opportunities by Sector
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: 1,
              background: border,
            }}
          >
            {[
              ['Fintech', 'Digital payments, banking infrastructure, and capital markets technology offerings.'],
              ['Mobility', 'Smart transport, EV systems, and mobility networks with growth-stage funding needs.'],
              ['AgriTech', 'Digitally enabled agriculture, supply chain, and food-tech investment opportunities.'],
              ['PropTech', 'Real estate platforms and infrastructure digitization with tokenized ownership logic.'],
              ['HealthTech', 'Healthcare data, digital health infrastructure, and patient-platform innovation.'],
              ['E-Commerce', 'Marketplace, logistics, and digital commerce growth capital opportunities.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: dark2, padding: '1.5rem' }}>
                <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</div>
                <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section id="equity-table" style={{ background: dark2, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
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
                  textTransform: 'uppercase',
                }}
              >
                Listings
              </div>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, margin: 0 }}>
                Equity Directory
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search offering, issuer, symbol"
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
                  outline: 'none',
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
                  outline: 'none',
                }}
              >
                <option value="progress">Sort: Progress</option>
                <option value="price">Sort: Price</option>
                <option value="change">Sort: 24h Change</option>
                <option value="stage">Sort: Stage</option>
                <option value="name">Sort: Name</option>
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
                  fontFamily: 'Inter, sans-serif',
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
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1220 }}>
                <thead>
                  <tr>
                    {['Offering', 'Sector', 'Issuer', 'Price', '24h Change', 'Stage', 'Valuation', 'Progress', 'Min Invest', 'Status', 'Action'].map((h) => (
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
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((equity) => (
                    <tr
                      key={equity.symbol}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <td style={cellStyle(border)}>
                        <div style={{ color: '#fff', fontWeight: 700 }}>{equity.name}</div>
                        <div style={{ color: muted, fontSize: '0.78rem' }}>{equity.symbol}</div>
                      </td>

                      <td style={cellStyle(border)}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 3,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: 'rgba(240,185,11,0.08)',
                            color: gold,
                          }}
                        >
                          {equity.sector}
                        </span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: muted }}>{equity.issuer}</span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: '#fff', fontWeight: 700 }}>€{equity.price}</span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: equity.change >= 0 ? green : red, fontWeight: 800 }}>
                          {equity.change >= 0 ? '+' : ''}
                          {equity.change}%
                        </span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: gold, fontWeight: 700 }}>{equity.stage}</span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: muted }}>{equity.valuation}</span>
                      </td>

                      <td style={cellStyle(border)}>
                        <div style={{ width: 120 }}>
                          <div
                            style={{
                              width: '100%',
                              height: 5,
                              background: 'rgba(255,255,255,0.08)',
                              borderRadius: 3,
                              overflow: 'hidden',
                              marginBottom: 5,
                            }}
                          >
                            <div
                              style={{
                                width: `${equity.progress}%`,
                                height: '100%',
                                background: gold,
                              }}
                            />
                          </div>
                          <div style={{ color: muted, fontSize: '0.72rem' }}>
                            {equity.progress}% · {equity.raise}/{equity.target}
                          </div>
                        </div>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: muted }}>{equity.minInvestment}</span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 3,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background:
                              equity.status === 'Live'
                                ? 'rgba(14,203,129,0.1)'
                                : equity.status === 'Closing'
                                ? 'rgba(240,185,11,0.1)'
                                : 'rgba(255,255,255,0.08)',
                            color:
                              equity.status === 'Live'
                                ? green
                                : equity.status === 'Closing'
                                ? gold
                                : 'rgba(255,255,255,0.8)',
                          }}
                        >
                          {equity.status}
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
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Invest
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan={11}
                        style={{
                          padding: '2rem 1rem',
                          textAlign: 'center',
                          color: muted,
                        }}
                      >
                        No equity offerings found for your current search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ background: dark, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              color: gold,
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Featured
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            High-Momentum Equity Opportunities
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: 1,
              background: border,
            }}
          >
            {equityData
              .slice()
              .sort((a, b) => b.progress - a.progress)
              .slice(0, 4)
              .map((equity) => (
                <div key={equity.symbol} style={{ background: dark2, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 800 }}>{equity.name}</div>
                      <div style={{ color: muted, fontSize: '0.78rem' }}>{equity.symbol}</div>
                    </div>
                    <div style={{ color: gold, fontWeight: 900 }}>{equity.progress}%</div>
                  </div>

                  <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    {equity.sector} issuer {equity.issuer} is currently raising {equity.target} at
                    a visible valuation of {equity.valuation}.
                  </div>

                  <button
                    onClick={() => router.push('/exchange')}
                    style={secondaryButton(gold)}
                  >
                    View Opportunity
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section style={{ background: dark2, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              color: gold,
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Issuer Workflow
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            How Digital Equity Raising Works
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              gap: 1,
              background: border,
            }}
          >
            {[
              ['01', 'Define the Offering', 'Set valuation, target raise, investor eligibility, and digital ownership structure.'],
              ['02', 'Prepare Documentation', 'Upload issuer data, cap table information, legal documentation, and disclosures.'],
              ['03', 'Launch the Raise', 'Open the equity round to eligible investors through a digital offering workflow.'],
              ['04', 'Track Subscriptions', 'Monitor fundraising progress, order flow, and investor participation in real time.'],
              ['05', 'Support Market Access', 'Prepare eligible offerings for visibility and future liquidity pathways.'],
            ].map(([n, title, desc]) => (
              <div key={n} style={{ background: dark3, padding: '1.5rem', borderTop: `2px solid ${gold}` }}>
                <div style={{ color: gold, fontWeight: 900, marginBottom: '0.75rem' }}>{n}</div>
                <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.4rem' }}>{title}</div>
                <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: dark, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div
            style={{
              color: gold,
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            FAQ
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            Common Equity Questions
          </h2>

          {[
            ['What stages are available?', 'This page includes seed, growth, Series A, and Series B style digital equity offerings.'],
            ['How is progress shown?', 'Each listing displays visible fundraising progress along with raised-versus-target capital.'],
            ['Can retail investors participate?', 'Investor access depends on the eligibility rules and structure of each offering.'],
            ['How do issuers launch an offering?', 'Issuers can begin through the tokenize workflow and define valuation, stage, and raise parameters.'],
            ['Can equity offerings become tradable?', 'Where structure and review permit, offerings can progress toward exchange-based visibility and liquidity.'],
          ].map(([q, a]) => (
            <div key={q} style={{ borderBottom: `1px solid ${border}`, padding: '1rem 0' }}>
              <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.35rem' }}>{q}</div>
              <div style={{ color: muted, lineHeight: 1.8 }}>{a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: gold, padding: '4rem 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%,rgba(255,255,255,0.12),transparent 50%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 900, color: 'black', letterSpacing: '-1px', marginBottom: '0.75rem' }}>
            Ready to Launch an Equity Offering?
          </div>
          <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', margin: '0 auto 2rem', maxWidth: 480, lineHeight: 1.7 }}>
            Build a modern digital equity raise with visible progress, structured access, and exchange-ready design.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/tokenize')} style={darkCtaButton()}>
              Launch Offering
            </button>
            <button onClick={() => router.push('/exchange')} style={lightCtaButton()}>
              Explore Exchange
            </button>
          </div>
        </div>
      </section>

      {/* RISK NOTICE */}
      <section
        style={{
          background: dark,
          padding: '2rem 5% 4rem',
          borderTop: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', lineHeight: 1.8 }}>
            Equity market notice: Valuation, fundraising progress, pricing, investor access, and future liquidity may vary
            depending on issuer structure, review status, eligibility rules, market conditions, and jurisdictional constraints.
            Equity-style digital offerings may involve capital, liquidity, technology, and regulatory risks.
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
    whiteSpace: 'nowrap',
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
    fontFamily: 'Inter, sans-serif',
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
    fontFamily: 'Inter, sans-serif',
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
    fontFamily: 'Inter,sans-serif',
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
    fontFamily: 'Inter,sans-serif',
  }
}