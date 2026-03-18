import { useState } from 'react'
import { useRouter } from 'next/router'
import AuthModal from '../components/AuthModal'

export default function TokenizePage() {
  const router = useRouter()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({
    assetName: '',
    assetType: 'Commercial Real Estate',
    totalValue: '',
    tokenSupply: '',
    tokenPrice: '',
    expectedReturn: '',
    minInvestment: '',
    deadline: '',
    description: '',
    tokenStandard: 'ERC-3643',
    eligibility: 'EU Verified Investors'
  })

  const gold = '#F0B90B'
  const dark = '#0B0E11'
  const dark2 = '#161A1E'
  const dark3 = '#1E2329'
  const green = '#0ECB81'
  const border = 'rgba(255,255,255,0.06)'
  const muted = 'rgba(255,255,255,0.5)'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Asset submitted for review.')
  }

  return (
    <div style={{ background: dark, minHeight: '100vh', color: 'rgba(255,255,255,0.88)', fontFamily: 'Inter, sans-serif' }}>
      {modal && (
        <AuthModal
          mode={modal}
          onClose={() => setModal(null)}
          onSwitch={(m) => setModal(m)}
        />
      )}

      {/* HERO */}
      <section
        style={{
          padding: '7rem 5% 4rem',
          background: dark,
          position: 'relative',
          overflow: 'hidden'
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
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '3rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
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
                marginBottom: '1rem'
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: green }} />
              Issuer Portal
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
              Tokenize Real-World Assets
              <span style={{ color: gold }}> in 48 Hours</span>
            </h1>

            <p
              style={{
                color: muted,
                fontSize: '1rem',
                lineHeight: 1.8,
                maxWidth: 580,
                marginBottom: '2rem'
              }}
            >
              Launch digital offerings for real estate, infrastructure, private equity,
              funds, and bonds with issuer-focused workflows designed for modern capital access.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('issuance-form')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  background: gold,
                  color: 'black',
                  border: 'none',
                  padding: '0.9rem 1.8rem',
                  borderRadius: 4,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Start Issuance
              </button>

              <button
                onClick={() => setModal('register')}
                style={{
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.82)',
                  border: '1px solid rgba(240,185,11,0.25)',
                  padding: '0.9rem 1.8rem',
                  borderRadius: 4,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Book a Demo
              </button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                ['Fast', 'Review Workflow'],
                ['Digital', 'Issuance Process'],
                ['Investor Ready', 'Eligibility Rules'],
                ['Exchange Ready', 'Secondary Market Path']
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

          <div
            style={{
              background: dark2,
              border: `1px solid ${border}`,
              padding: '1.5rem',
              borderRadius: 6
            }}
          >
            <div style={{ fontSize: '0.78rem', color: muted, marginBottom: '0.6rem' }}>
              Estimated issuance preview
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>
              €5M Asset Tokenization
            </div>
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: muted }}>Review Time</span>
                <span>24–48h</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: muted }}>Structure</span>
                <span>{form.tokenStandard}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: muted }}>Investor Scope</span>
                <span>{form.eligibility}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: muted }}>Settlement</span>
                <span>On-chain</span>
              </div>
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
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
            gap: '1rem'
          }}
        >
          {[
            ['Issuer Ready', 'Structured Workflow'],
            ['24/7', 'Digital Access'],
            ['Multi-Asset', 'Coverage'],
            ['Rule-Based', 'Transfer Controls'],
            ['Review Led', 'Submission Process']
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

      {/* ASSET TYPES */}
      <section style={{ background: dark, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            Asset Classes
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            What You Can Tokenize
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
              ['Real Estate', 'Commercial and residential assets with fractional ownership structure.'],
              ['Infrastructure', 'Energy, transport, and income-producing infrastructure issuance.'],
              ['Private Equity', 'Digitize cap tables and structure investor participation logic.'],
              ['Funds', 'Create tokenized fund units with access and transfer rules.'],
              ['Bonds', 'Issue fixed-income products with digital lifecycle management.'],
              ['Commodities', 'Build asset-backed token structures with transparent supply logic.']
            ].map(([title, desc]) => (
              <div key={title} style={{ background: dark2, padding: '1.5rem' }}>
                <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</div>
                <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: dark2, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            Workflow
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            How Tokenization Works
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
              ['01', 'Submit Asset', 'Add valuation, ownership, financial data, and issuance preferences.'],
              ['02', 'Compliance Review', 'Structure, eligibility rules, and documents are reviewed.'],
              ['03', 'Token Issuance', 'Digital issuance parameters are prepared and finalized.'],
              ['04', 'Investor Access', 'Eligible investors can participate under defined rules.'],
              ['05', 'Market Readiness', 'Assets can progress toward exchange and liquidity workflows.']
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

      {/* FORM + SUMMARY */}
      <section id="issuance-form" style={{ background: dark, padding: '4rem 5%' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2rem',
            alignItems: 'start'
          }}
        >
          <div
            style={{
              background: dark2,
              border: `1px solid ${border}`,
              padding: '2rem',
              borderRadius: 6
            }}
          >
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
              Issuer Intake
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.7rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              Start Your Issuance
            </h2>
            <p style={{ color: muted, marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Complete the issuer intake and submit your asset for internal review.
            </p>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <Field label="Asset Name">
                  <input name="assetName" value={form.assetName} onChange={handleChange} placeholder="Baltic Office Tower" style={inputStyle} />
                </Field>

                <Field label="Asset Type">
                  <select name="assetType" value={form.assetType} onChange={handleChange} style={inputStyle}>
                    <option>Commercial Real Estate</option>
                    <option>Residential Real Estate</option>
                    <option>Private Equity</option>
                    <option>Infrastructure</option>
                    <option>Commodity</option>
                    <option>Fund</option>
                    <option>Bond</option>
                    <option>Other</option>
                  </select>
                </Field>

                <Field label="Total Asset Value">
                  <input name="totalValue" value={form.totalValue} onChange={handleChange} placeholder="€5,000,000" style={inputStyle} />
                </Field>

                <Field label="Token Supply">
                  <input name="tokenSupply" value={form.tokenSupply} onChange={handleChange} placeholder="500000" style={inputStyle} />
                </Field>

                <Field label="Token Price">
                  <input name="tokenPrice" value={form.tokenPrice} onChange={handleChange} placeholder="€10" style={inputStyle} />
                </Field>

                <Field label="Expected Return">
                  <input name="expectedReturn" value={form.expectedReturn} onChange={handleChange} placeholder="8% annual" style={inputStyle} />
                </Field>

                <Field label="Minimum Investment">
                  <input name="minInvestment" value={form.minInvestment} onChange={handleChange} placeholder="€500" style={inputStyle} />
                </Field>

                <Field label="Fundraising Deadline">
                  <input name="deadline" type="date" value={form.deadline} onChange={handleChange} style={inputStyle} />
                </Field>
              </div>

              <Field label="Asset Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the asset, income model, structure, and investor proposition."
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </Field>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                  gap: '1rem',
                  marginTop: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <Field label="Token Standard">
                  <select name="tokenStandard" value={form.tokenStandard} onChange={handleChange} style={inputStyle}>
                    <option>ERC-3643</option>
                    <option>ERC-1400</option>
                    <option>ERC-20</option>
                  </select>
                </Field>

                <Field label="Investor Eligibility">
                  <select name="eligibility" value={form.eligibility} onChange={handleChange} style={inputStyle}>
                    <option>EU Verified Investors</option>
                    <option>Accredited Investors</option>
                    <option>Retail + Verified</option>
                    <option>Private Placement Only</option>
                  </select>
                </Field>
              </div>

              <Field label="Required Documents">
                <div
                  style={{
                    background: dark3,
                    border: `1px solid ${border}`,
                    borderRadius: 4,
                    padding: '1rem',
                    color: muted,
                    lineHeight: 1.8,
                    fontSize: '0.9rem'
                  }}
                >
                  • Asset Valuation Report<br />
                  • Legal Ownership Proof<br />
                  • Financial Statements<br />
                  • Insurance Documents
                </div>
              </Field>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  style={{
                    background: gold,
                    color: 'black',
                    border: 'none',
                    padding: '0.9rem 1.8rem',
                    borderRadius: 4,
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Submit for Review
                </button>

                <button
                  type="button"
                  onClick={() => setModal('register')}
                  style={{
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.82)',
                    border: '1px solid rgba(240,185,11,0.25)',
                    padding: '0.9rem 1.8rem',
                    borderRadius: 4,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Create Issuer Account
                </button>
              </div>
            </form>
          </div>

          <div
            style={{
              background: dark3,
              border: `1px solid ${border}`,
              padding: '1.5rem',
              borderRadius: 6,
              position: 'sticky',
              top: 90
            }}
          >
            <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: '1rem' }}>Issuance Summary</h3>
            <div style={{ display: 'grid', gap: '0.8rem', marginBottom: '1.25rem' }}>
              <SummaryRow label="Asset Type" value={form.assetType || '—'} />
              <SummaryRow label="Token Standard" value={form.tokenStandard || '—'} />
              <SummaryRow label="Eligibility" value={form.eligibility || '—'} />
              <SummaryRow label="Token Supply" value={form.tokenSupply || '—'} />
              <SummaryRow label="Token Price" value={form.tokenPrice || '—'} />
              <SummaryRow label="Min. Investment" value={form.minInvestment || '—'} />
            </div>

            <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.75rem' }}>Why this flow works</div>
              <div style={{ display: 'grid', gap: '0.7rem' }}>
                {[
                  'Structured issuer intake',
                  'Clear eligibility setup',
                  'Document-driven review',
                  'Secondary market readiness'
                ].map((item) => (
                  <div key={item} style={{ color: muted, fontSize: '0.88rem' }}>
                    • {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENT HELP */}
      <section style={{ background: dark2, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            Documents
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            Required Documents
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
              ['Asset Valuation Report', 'Independent or internal valuation showing basis, date, and methodology.'],
              ['Legal Ownership Proof', 'Documents proving title, ownership rights, or holding structure.'],
              ['Financial Statements', 'Recent financials supporting income, liabilities, and asset performance.'],
              ['Insurance Documents', 'Coverage details for insurable assets where applicable.']
            ].map(([title, desc]) => (
              <div key={title} style={{ background: dark3, padding: '1.5rem' }}>
                <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</div>
                <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY NEXTOKEN */}
      <section style={{ background: dark, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            Why Nextoken
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            Built for Modern Capital Formation
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
              ['Compliant Workflows', 'Structured digital issuance with investor eligibility and transfer logic.'],
              ['Lower Friction', 'Reduce administrative overhead compared with traditional processes.'],
              ['Faster Launch', 'Move from intake to review with a much shorter cycle.'],
              ['Global Access', 'Reach broader investor groups through digital workflows.'],
              ['Liquidity Ready', 'Prepare assets for secondary market pathways where applicable.'],
              ['Distribution Logic', 'Support digital payout and ownership management structures.']
            ].map(([title, desc]) => (
              <div key={title} style={{ background: dark2, padding: '1.5rem' }}>
                <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</div>
                <div style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: dark2, padding: '4rem 5%' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
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
            FAQ
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            Common Questions
          </h2>

          {[
            ['How long does tokenization take?', 'Initial review can begin after submission; timing depends on documentation quality and structure complexity.'],
            ['Who can invest?', 'This depends on the investor eligibility rules selected for the offering and applicable jurisdiction requirements.'],
            ['What token standard is used?', 'This page supports ERC-3643, ERC-1400, and ERC-20 as selectable structure options.'],
            ['Can tokens trade after issuance?', 'Where structure and review permit, an asset can progress toward secondary market workflows.'],
            ['What documents are required?', 'This intake requests valuation, ownership, financial statements, and insurance documents.']
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
            Ready to Structure Your Asset?
          </div>
          <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', margin: '0 auto 2rem', maxWidth: 480, lineHeight: 1.7 }}>
            Start your issuer intake, define your token structure, and prepare for digital capital formation.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const el = document.getElementById('issuance-form')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                padding: '0.85rem 2.2rem',
                background: 'black',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'Inter,sans-serif'
              }}
            >
              Start Issuance
            </button>
            <button
              onClick={() => router.push('/markets')}
              style={{
                padding: '0.85rem 2.2rem',
                background: 'transparent',
                color: 'rgba(0,0,0,0.75)',
                border: '1.5px solid rgba(0,0,0,0.2)',
                borderRadius: 4,
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Inter,sans-serif'
              }}
            >
              Explore Markets
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
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', lineHeight: 1.8 }}>
            Risk notice: Digital offerings, tokenized assets, and real-world asset investments may involve regulatory,
            market, custody, technology, and liquidity risks. Issuer eligibility, investor access, and secondary market
            availability depend on jurisdiction, structure, and internal review outcomes.
          </div>
        </div>
      </section>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '0.45rem',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.2px'
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <span style={{ color: '#fff', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  background: '#0B0E11',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 4,
  padding: '0.8rem 0.9rem',
  fontSize: '0.92rem',
  outline: 'none',
  fontFamily: 'Inter, sans-serif'
}