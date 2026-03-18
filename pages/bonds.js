import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'

const bondsData = [
  {
    name: 'Baltic Green Bond 2027',
    symbol: 'BALT-GREEN-27',
    type: 'Green',
    issuer: 'Baltic Energy UAB',
    yield: 6.4,
    price: 98.4,
    term: '3Y',
    raised: '€3.6M',
    total: '€5M',
    progress: 72,
    minInvestment: '€500',
    rating: 'A-',
    status: 'Live',
  },
  {
    name: 'EU Infrastructure Bond 2029',
    symbol: 'EU-INFRA-29',
    type: 'Corporate',
    issuer: 'Euro Infra Group',
    yield: 5.1,
    price: 101.2,
    term: '5Y',
    raised: '€9M',
    total: '€20M',
    progress: 45,
    minInvestment: '€1,000',
    rating: 'BBB+',
    status: 'Live',
  },
  {
    name: 'SME Convertible Note I',
    symbol: 'SME-CNV-26',
    type: 'Convertible',
    issuer: 'Growth Capital Partners',
    yield: 8.2,
    price: 99.8,
    term: '2Y',
    raised: '€940K',
    total: '€1M',
    progress: 94,
    minInvestment: '€250',
    rating: 'BB',
    status: 'Closing',
  },
  {
    name: 'Renewable Yield Note 2030',
    symbol: 'RYN-30',
    type: 'Green',
    issuer: 'Nord Renewables',
    yield: 5.8,
    price: 100.4,
    term: '6Y',
    raised: '€4.2M',
    total: '€8M',
    progress: 53,
    minInvestment: '€750',
    rating: 'A',
    status: 'Live',
  },
  {
    name: 'Logistics Income Bond',
    symbol: 'LOGI-28',
    type: 'Corporate',
    issuer: 'Baltic Logistics REIT',
    yield: 6.9,
    price: 97.9,
    term: '4Y',
    raised: '€2.4M',
    total: '€4M',
    progress: 60,
    minInvestment: '€500',
    rating: 'BBB',
    status: 'Live',
  },
  {
    name: 'Municipal Development Note',
    symbol: 'MUNI-31',
    type: 'Municipal',
    issuer: 'Regional Development Fund',
    yield: 4.3,
    price: 102.1,
    term: '7Y',
    raised: '€6.5M',
    total: '€10M',
    progress: 65,
    minInvestment: '€1,500',
    rating: 'A+',
    status: 'Upcoming',
  },
]

const tabs = ['All', 'Green', 'Corporate', 'Convertible', 'Municipal']

export default function BondsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('yield')

  const gold = '#F0B90B'
  const dark = '#0B0E11'
  const dark2 = '#161A1E'
  const dark3 = '#1E2329'
  const green = '#0ECB81'
  const red = '#F6465D'
  const border = 'rgba(255,255,255,0.06)'
  const muted = 'rgba(255,255,255,0.5)'

  const filteredData = useMemo(() => {
    let data = [...bondsData]

    if (activeTab !== 'All') {
      data = data.filter((item) => item.type === activeTab)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.symbol.toLowerCase().includes(q) ||
          item.issuer.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
      )
    }

    data.sort((a, b) => {
      if (sortBy === 'yield') return b.yield - a.yield
      if (sortBy === 'price') return b.price - a.price
      if (sortBy === 'term') return a.term.localeCompare(b.term)
      if (sortBy === 'progress') return b.progress - a.progress
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
              Fixed Income Market
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
              Tokenized
              <span style={{ color: gold }}> Bond Market</span>
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
              Explore corporate, green, municipal, and convertible bonds with digital issuance,
              transparent fundraising progress, and modern fixed-income discovery tools.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.25rem' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('bond-table')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                style={primaryButton(gold)}
              >
                Explore Bonds
              </button>

              <button
                onClick={() => router.push('/tokenize')}
                style={secondaryButton(gold)}
              >
                Issue a Bond
              </button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                ['Live', 'Fundraising'],
                ['Digital', 'Issuance'],
                ['Multi-Type', 'Bond Access'],
                ['Yield-Focused', 'Discovery'],
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
            ['6+', 'Bond Listings'],
            ['8.2%', 'Top Visible Yield'],
            ['€48M+', 'Visible Raise Pipeline'],
            ['4', 'Bond Types'],
            ['€250', 'Lowest Entry Point'],
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

      {/* BOND TYPES */}
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
            Bond Categories
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            Fixed-Income Structures You Can Access
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
              ['Green Bonds', 'Finance sustainability-focused infrastructure and energy projects with transparent yield structures.'],
              ['Corporate Bonds', 'Raise working capital and growth funding through modern digital bond issuance workflows.'],
              ['Convertible Notes', 'Blend debt yield with future equity conversion logic for growth-stage issuers.'],
              ['Municipal Bonds', 'Support public and regional development initiatives with long-term funding structures.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: dark2, padding: '1.5rem' }}>
                <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</div>
                <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABLE SECTION */}
      <section id="bond-table" style={{ background: dark2, padding: '4rem 5%' }}>
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
                Bond Directory
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search bond, issuer, symbol"
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
                <option value="yield">Sort: Yield</option>
                <option value="price">Sort: Price</option>
                <option value="term">Sort: Term</option>
                <option value="progress">Sort: Progress</option>
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
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1180 }}>
                <thead>
                  <tr>
                    {['Bond', 'Type', 'Issuer', 'Yield', 'Price', 'Term', 'Rating', 'Progress', 'Min Invest', 'Status', 'Action'].map((h) => (
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
                  {filteredData.map((bond) => (
                    <tr
                      key={bond.symbol}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <td style={cellStyle(border)}>
                        <div style={{ color: '#fff', fontWeight: 700 }}>{bond.name}</div>
                        <div style={{ color: muted, fontSize: '0.78rem' }}>{bond.symbol}</div>
                      </td>

                      <td style={cellStyle(border)}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 3,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background:
                              bond.type === 'Green'
                                ? 'rgba(14,203,129,0.1)'
                                : bond.type === 'Convertible'
                                ? 'rgba(24,144,255,0.1)'
                                : bond.type === 'Municipal'
                                ? 'rgba(255,255,255,0.08)'
                                : 'rgba(240,185,11,0.08)',
                            color:
                              bond.type === 'Green'
                                ? green
                                : bond.type === 'Convertible'
                                ? '#1890FF'
                                : bond.type === 'Municipal'
                                ? 'rgba(255,255,255,0.82)'
                                : gold,
                          }}
                        >
                          {bond.type}
                        </span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: muted }}>{bond.issuer}</span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: green, fontWeight: 800 }}>{bond.yield}%</span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: '#fff', fontWeight: 700 }}>€{bond.price}</span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: muted }}>{bond.term}</span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: gold, fontWeight: 700 }}>{bond.rating}</span>
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
                                width: `${bond.progress}%`,
                                height: '100%',
                                background: gold,
                              }}
                            />
                          </div>
                          <div style={{ color: muted, fontSize: '0.72rem' }}>
                            {bond.progress}% · {bond.raised}/{bond.total}
                          </div>
                        </div>
                      </td>

                      <td style={cellStyle(border)}>
                        <span style={{ color: muted }}>{bond.minInvestment}</span>
                      </td>

                      <td style={cellStyle(border)}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 3,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background:
                              bond.status === 'Live'
                                ? 'rgba(14,203,129,0.1)'
                                : bond.status === 'Closing'
                                ? 'rgba(240,185,11,0.1)'
                                : 'rgba(255,255,255,0.08)',
                            color:
                              bond.status === 'Live'
                                ? green
                                : bond.status === 'Closing'
                                ? gold
                                : 'rgba(255,255,255,0.8)',
                          }}
                        >
                          {bond.status}
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
                        No bonds found for your current search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARDS */}
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
            High-Interest Bond Opportunities
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: 1,
              background: border,
            }}
          >
            {bondsData
              .slice()
              .sort((a, b) => b.yield - a.yield)
              .slice(0, 4)
              .map((bond) => (
                <div key={bond.symbol} style={{ background: dark2, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 800 }}>{bond.name}</div>
                      <div style={{ color: muted, fontSize: '0.78rem' }}>{bond.symbol}</div>
                    </div>
                    <div style={{ color: green, fontWeight: 900 }}>{bond.yield}%</div>
                  </div>

                  <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    {bond.type} bond issued by {bond.issuer} with {bond.term} maturity and
                    a minimum entry point of {bond.minInvestment}.
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

      {/* PIPELINE */}
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
            How Bond Issuance Works
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
              ['01', 'Submit Bond Structure', 'Define size, maturity, yield, investor profile, and offering goals.'],
              ['02', 'Review Documentation', 'Prepare issuer data, legal structure, financials, and disclosure package.'],
              ['03', 'Launch Fundraise', 'Open the offering to eligible investors through a digital bond issuance workflow.'],
              ['04', 'Track Progress', 'Monitor subscriptions, allocation progress, and fundraising milestones in real time.'],
              ['05', 'Secondary Market Path', 'Move eligible instruments toward digital exchange visibility and liquidity workflows.'],
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
            Common Bond Questions
          </h2>

          {[
            ['What types of bonds are listed?', 'This page includes green, corporate, convertible, and municipal bond structures.'],
            ['How is fundraising progress shown?', 'Each bond displays a visible completion percentage and raised-versus-target amount.'],
            ['Can bonds trade digitally?', 'Where structure and review permit, digital bonds can progress toward exchange-based workflows.'],
            ['What is the minimum investment?', 'Minimum ticket size varies by bond and is shown directly in each listing.'],
            ['How do issuers launch a bond?', 'Issuers can begin through the tokenize workflow and define structure, maturity, and investor terms.'],
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
            Ready to Launch a Digital Bond?
          </div>
          <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', margin: '0 auto 2rem', maxWidth: 480, lineHeight: 1.7 }}>
            Build a modern fixed-income offering with digital fundraising, transparent progress, and exchange-ready visibility.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/tokenize')} style={darkCtaButton()}>
              Issue a Bond
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
            Bond market notice: Yield, price, maturity, fundraising progress, and secondary market access may vary
            depending on issuer structure, investor eligibility, order flow, jurisdiction, and review status.
            Fixed-income products may involve credit, liquidity, regulatory, and market risks.
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