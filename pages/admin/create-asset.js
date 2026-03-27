import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina",
  "Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic",
  "Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti",
  "Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau",
  "Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan",
  "Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein",
  "Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius",
  "Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal",
  "Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau",
  "Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe",
  "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia",
  "South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan",
  "Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan",
  "Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu",
  "Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

const ASSET_TYPES = [
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'bond', label: 'Bond' },
  { value: 'equity', label: 'Equity / IPO' },
  { value: 'commodity', label: 'Commodity' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'fund', label: 'Fund' },
  { value: 'private_equity', label: 'Private Equity' },
  { value: 'other', label: 'Other' },
];

const inputStyle = {
  width: '100%', background: '#0d0d0d', border: '1px solid #222',
  color: '#fff', padding: '12px 14px', borderRadius: '8px',
  fontSize: '14px', boxSizing: 'border-box', outline: 'none',
};
const labelStyle = {
  color: '#555', fontSize: '11px', letterSpacing: '1.2px',
  textTransform: 'uppercase', display: 'block', marginBottom: '7px', fontWeight: '700'
};
const sectionStyle = {
  marginBottom: '32px'
};
const sectionTitle = {
  color: '#f5c842', fontSize: '11px', letterSpacing: '2px',
  textTransform: 'uppercase', fontWeight: '800', marginBottom: '20px',
  paddingBottom: '8px', borderBottom: '1px solid #1a1a1a'
};
const gridTwo = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' };

export default function CreateAsset() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    name: '', tokenSymbol: '', assetType: 'real_estate',
    issuerName: '', location: '', country: 'Lithuania',
    description: '', tokenPrice: '', totalTokens: '',
    minInvestment: '', targetRaise: '', annualYield: '',
    investmentTerm: '', riskLevel: 'medium',
    status: 'pending',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const required = ['name', 'tokenSymbol', 'assetType', 'issuerName', 'country', 'tokenPrice', 'totalTokens', 'minInvestment'];

  async function handleSubmit(e) {
    e.preventDefault();
    // Validate required
    const missing = required.filter(k => !form[k]?.toString().trim());
    if (missing.length > 0) {
      setMsg(`❌ Required fields missing: ${missing.join(', ')}`);
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tokenPrice: parseFloat(form.tokenPrice),
          totalTokens: parseInt(form.totalTokens),
          minInvestment: parseFloat(form.minInvestment),
          targetRaise: parseFloat(form.targetRaise) || 0,
          annualYield: parseFloat(form.annualYield) || 0,
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('✅ Asset created successfully!');
        setTimeout(() => router.push('/admin/assets'), 1500);
      } else {
        setMsg('❌ ' + (data.error || data.message || 'Failed to create asset'));
      }
    } catch (e) {
      setMsg('❌ Network error: ' + e.message);
    }
    setLoading(false);
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Create New Asset</h1>
          <p style={{ color: '#555', marginTop: '6px', fontSize: '14px' }}>Fill in the details to list a new investment</p>
        </div>

        {msg && (
          <div style={{
            background: msg.startsWith('✅') ? '#052e16' : '#2d0a0a',
            border: `1px solid ${msg.startsWith('✅') ? '#065f46' : '#7f1d1d'}`,
            borderRadius: '8px', padding: '14px 16px', marginBottom: '24px',
            color: msg.startsWith('✅') ? '#4ade80' : '#f87171', fontSize: '14px', fontWeight: '600'
          }}>{msg}</div>
        )}

        <form onSubmit={handleSubmit}>

          {/* BASIC INFO */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>Basic Info</div>

            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>Asset Name *</label>
                <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Vilnius Office Tower" required />
              </div>
              <div>
                <label style={labelStyle}>Ticker Symbol *</label>
                <input style={inputStyle} value={form.tokenSymbol} onChange={e => set('tokenSymbol', e.target.value.toUpperCase())}
                  placeholder="e.g. VPOP" maxLength={8} required />
              </div>
            </div>

            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>Asset Type *</label>
                <select style={inputStyle} value={form.assetType} onChange={e => set('assetType', e.target.value)} required>
                  {ASSET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Company / Issuer Name *</label>
                <input style={{...inputStyle, borderColor: !form.issuerName ? '#7f1d1d' : '#222'}}
                  value={form.issuerName} onChange={e => set('issuerName', e.target.value)}
                  placeholder="Company name (required)" required />
                {!form.issuerName && <span style={{ color: '#f87171', fontSize: '11px', marginTop: '4px', display: 'block' }}>Required</span>}
              </div>
            </div>

            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>Location / City</label>
                <input style={inputStyle} value={form.location} onChange={e => set('location', e.target.value)}
                  placeholder="e.g. Vilnius, Lithuania" />
              </div>
              <div>
                <label style={labelStyle}>Country *</label>
                <select style={inputStyle} value={form.country} onChange={e => set('country', e.target.value)} required>
                  <option value="">— Select Country —</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe the investment opportunity..." />
            </div>
          </div>

          {/* FINANCIALS */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>Financials</div>

            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>Token Price (EUR) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}>€</span>
                  <input style={{ ...inputStyle, paddingLeft: '28px' }} type="number" step="0.01" min="0.01"
                    value={form.tokenPrice} onChange={e => set('tokenPrice', e.target.value)}
                    placeholder="100" required />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Total Token Supply *</label>
                <input style={inputStyle} type="number" min="1"
                  value={form.totalTokens} onChange={e => set('totalTokens', e.target.value)}
                  placeholder="10000" required />
              </div>
            </div>

            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>Min Investment (EUR) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}>€</span>
                  <input style={{ ...inputStyle, paddingLeft: '28px' }} type="number" step="0.01" min="1"
                    value={form.minInvestment} onChange={e => set('minInvestment', e.target.value)}
                    placeholder="100" required />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Target Raise (EUR)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}>€</span>
                  <input style={{ ...inputStyle, paddingLeft: '28px' }} type="number" step="0.01" min="0"
                    value={form.targetRaise} onChange={e => set('targetRaise', e.target.value)}
                    placeholder="1000000" />
                </div>
              </div>
            </div>

            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>Annual Yield (%)</label>
                <div style={{ position: 'relative' }}>
                  <input style={{ ...inputStyle, paddingRight: '28px' }} type="number" step="0.1" min="0" max="100"
                    value={form.annualYield} onChange={e => set('annualYield', e.target.value)}
                    placeholder="8.5" />
                  <span style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}>%</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Investment Term</label>
                <input style={inputStyle} value={form.investmentTerm} onChange={e => set('investmentTerm', e.target.value)}
                  placeholder="e.g. 3 years, 24 months" />
              </div>
            </div>
          </div>

          {/* RISK & STATUS */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>Risk & Status</div>
            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>Risk Level</label>
                <select style={inputStyle} value={form.riskLevel} onChange={e => set('riskLevel', e.target.value)}>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Initial Status</label>
                <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="pending">Pending (review required)</option>
                  <option value="approved">Approved (visible on markets)</option>
                  <option value="live">Live (trading enabled)</option>
                </select>
              </div>
            </div>

            {/* Status explanation */}
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '14px 16px', fontSize: '12px', color: '#555', lineHeight: '1.7' }}>
              <strong style={{ color: '#888' }}>Status guide:</strong><br/>
              🟡 <strong style={{ color: '#888' }}>Pending</strong> — Not visible to investors yet, under review<br/>
              🔵 <strong style={{ color: '#888' }}>Approved</strong> — Visible on Markets & Exchange pages<br/>
              🟢 <strong style={{ color: '#888' }}>Live</strong> — Visible + trading enabled on Exchange
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/admin/assets')}
              style={{ background: '#141414', color: '#666', border: '1px solid #222', borderRadius: '8px', padding: '12px 24px', cursor: 'pointer', fontWeight: '600' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ background: loading ? '#333' : '#f5c842', color: '#000', border: 'none', borderRadius: '8px', padding: '12px 32px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '800', fontSize: '15px' }}>
              {loading ? 'Creating...' : '+ Create Asset'}
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}
