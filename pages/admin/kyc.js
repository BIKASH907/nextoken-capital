import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

const SC = {
  pending:   { bg: '#2d1f00', color: '#f5c842', border: '#5a3e00' },
  in_review: { bg: '#0a1628', color: '#60a5fa', border: '#1e3a5f' },
  approved:  { bg: '#052e16', color: '#4ade80', border: '#065f46' },
  rejected:  { bg: '#2d0a0a', color: '#f87171', border: '#7f1d1d' },
};

const COUNTRIES = ['Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Belize','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Bulgaria','Cambodia','Cameroon','Canada','Chile','China','Colombia','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Ecuador','Egypt','Estonia','Ethiopia','Finland','France','Georgia','Germany','Ghana','Greece','Guatemala','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kuwait','Latvia','Lebanon','Libya','Lithuania','Luxembourg','Malaysia','Malta','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco','Myanmar','Nepal','Netherlands','New Zealand','Nigeria','North Macedonia','Norway','Oman','Pakistan','Panama','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Saudi Arabia','Senegal','Serbia','Singapore','Slovakia','Slovenia','South Africa','South Korea','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria','Taiwan','Thailand','Turkey','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'];

const CHECKLIST = [
  { section: 'Corporate Identity', items: ['Certificate of incorporation / company registration','Articles of association / memorandum','Registered office address verification','Business license (if applicable)','Company structure / org chart'] },
  { section: 'Ultimate Beneficial Owners (UBOs)', items: ['Identify all UBOs with 25%+ ownership','KYC on each UBO (ID, proof of address, selfie)','PEP screening on all UBOs','Sanctions screening on all UBOs','Source of wealth documentation for UBOs'] },
  { section: 'Directors & Authorized Signatories', items: ['KYC on all directors with signing authority','Board resolution authorizing the account','Power of attorney (if applicable)','PEP and sanctions screening on all directors'] },
  { section: 'Financial Verification', items: ['Audited financial statements (last 3 years)','Bank reference letter','Source of funds documentation','Tax identification number (TIN)','VAT registration (if EU-based)'] },
  { section: 'Compliance & Legal', items: ['Anti-money laundering policy review','Sanctions compliance declaration','Data processing agreement (GDPR)','MiCA compliance assessment (if issuer)','Legal opinion on tokenization (if issuing tokens)'] },
];

const RISKS = [
  { level: 'Low Risk',    color: '#4ade80', bg: '#052e16', border: '#065f46', desc: 'EU-registered, regulated entity, clean ownership, audited financials' },
  { level: 'Medium Risk', color: '#f5c842', bg: '#2d1f00', border: '#5a3e00', desc: 'Non-EU but cooperative jurisdiction, complex ownership, limited financials' },
  { level: 'High Risk',   color: '#f87171', bg: '#2d0a0a', border: '#7f1d1d', desc: 'High-risk jurisdiction, PEP involvement, layered ownership, no audited financials' },
];

const inp = { background: '#0d0d0d', border: '1px solid #222', color: '#fff', padding: '9px 13px', borderRadius: '8px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' };

export default function KYCAdmin() {
  const [mode, setMode]             = useState('kyb');
  const [allItems, setAllItems]     = useState([]);
  const [counts, setCounts]         = useState({});
  const [filterStatus, setFilter]   = useState('all');
  const [search, setSearch]         = useState('');
  const [country, setCountry]       = useState('');
  const [gender, setGender]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [notes, setNotes]           = useState('');
  const [msg, setMsg]               = useState('');
  const [docModal, setDocModal]     = useState(null);
  const [checks, setChecks]         = useState({});
  const [showList, setShowList]     = useState(false);

  async function load() {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };
      if (mode === 'kyb') {
        const res  = await fetch('/api/admin/kyb?status=all', { headers });
        const data = await res.json();
        setAllItems(data.kyb   || []);
        setCounts(data.counts || {});
      } else {
        const res  = await fetch('/api/admin/users?limit=200', { headers });
        const data = await res.json();
        const list = data.users || [];
        setAllItems(list);
        const c = { pending: 0, in_review: 0, approved: 0, rejected: 0 };
        list.forEach(u => { const s = u.kycStatus || 'pending'; if (c[s] !== undefined) c[s]++; });
        setCounts(c);
      }
    } catch (e) {}
    setLoading(false);
  }

  useEffect(() => { load(); }, [mode]);

  const items = allItems.filter(item => {
    const isKYB  = mode === 'kyb';
    const status = isKYB ? item.status : (item.kycStatus || 'pending');
    const name   = (isKYB ? item.companyName || item.userId?.name : item.name) || '';
    const email  = (isKYB ? item.userId?.email : item.email) || '';
    const ctry   = (isKYB ? item.userId?.country || item.incorporationCountry : item.country) || '';
    const gen    = item.gender || item.userId?.gender || '';
    if (filterStatus !== 'all' && status !== filterStatus) return false;
    if (search && !name.toLowerCase().includes(search.toLowerCase()) && !email.toLowerCase().includes(search.toLowerCase())) return false;
    if (country && ctry !== country) return false;
    if (gender && gen !== gender) return false;
    return true;
  });

  async function updateStatus(id, status) {
    if (!confirm('Set status to "' + status + '"?')) return;
    const token = localStorage.getItem('adminToken');
    const endpoint = mode === 'kyb' ? '/api/admin/kyb' : '/api/admin/users/kyc-status';
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ id, status, notes })
    });
    if (res.ok) {
      setMsg('Status updated to ' + status);
      setSelected(null); setNotes('');
      load();
      setTimeout(() => setMsg(''), 3000);
    } else {
      setMsg('Update failed');
    }
  }

  const statuses = ['pending', 'in_review', 'approved', 'rejected'];

  function DocModal({ record, onClose }) {
    const docs = record.documents || record.kycDocuments || [];
    const name = record.companyName || record.userId?.name || record.name || 'User';
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '14px', width: '100%', maxWidth: '640px', maxHeight: '85vh', overflow: 'auto', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ color: '#fff', fontWeight: '800', fontSize: '16px' }}>Documents — {name}</div>
              <div style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>{mode === 'kyb' ? 'KYB Business Verification' : 'KYC Identity Verification'}</div>
            </div>
            <button onClick={onClose} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: '700' }}>✕</button>
          </div>

          <div style={{ background: '#141414', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ color: '#444', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '700' }}>Profile Info</div>
            {[
              ['Name',      record.userId?.name  || record.name  || '—'],
              ['Email',     record.userId?.email || record.email || '—'],
              ['Country',   record.userId?.country || record.country || record.incorporationCountry || '—'],
              ['Gender',    record.gender || record.userId?.gender || '—'],
              ['Account',   record.userId?.accountType || record.accountType || '—'],
              ['Submitted', record.submittedAt || record.createdAt ? new Date(record.submittedAt || record.createdAt).toLocaleString() : '—'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px', fontSize: '13px' }}>
                <span style={{ color: '#555' }}>{k}</span>
                <span style={{ color: '#ccc', textTransform: 'capitalize' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ color: '#444', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '700' }}>Uploaded Documents</div>
          {docs.length === 0
            ? <div style={{ background: '#141414', borderRadius: '10px', padding: '32px', textAlign: 'center', color: '#333' }}>No documents uploaded yet</div>
            : docs.map((doc, i) => (
              <div key={i} style={{ background: '#141414', border: '1px solid #1f1f1f', borderRadius: '8px', padding: '14px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#ccc', fontWeight: '600', fontSize: '13px', textTransform: 'capitalize' }}>📎 {doc.type || doc.name || 'Document ' + (i + 1)}</div>
                  {doc.uploadedAt && <div style={{ color: '#555', fontSize: '11px', marginTop: '3px' }}>{new Date(doc.uploadedAt).toLocaleDateString()}</div>}
                </div>
                {doc.url
                  ? <a href={doc.url} target="_blank" rel="noreferrer" style={{ background: '#1e3a5f', color: '#60a5fa', border: '1px solid #1e3a5f', borderRadius: '6px', padding: '6px 14px', textDecoration: 'none', fontSize: '12px', fontWeight: '700' }}>View ↗</a>
                  : <span style={{ color: '#333', fontSize: '12px' }}>No URL</span>}
              </div>
            ))
          }

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {['in_review', 'approved', 'rejected'].map(s => {
              const c = SC[s];
              return (
                <button key={s} onClick={() => { updateStatus(record._id, s); onClose(); }} style={{ background: c.bg, color: c.color, border: '1px solid ' + c.border, borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                  {s === 'in_review' ? '🔍 Review' : s === 'approved' ? '✅ Approve' : '❌ Reject'}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      {docModal && <DocModal record={docModal} onClose={() => setDocModal(null)} />}

      <div style={{ padding: '28px 32px', background: '#080808', minHeight: '100vh' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>
            {mode === 'kyb' ? '🏛️ KYB — Business Entity Verification' : '🪪 KYC — Individual Verification'}
          </h1>
          <p style={{ color: '#555', marginTop: '6px', fontSize: '14px' }}>
            {mode === 'kyb' ? 'Corporate verification for issuers and institutional investors' : 'Identity verification for individual investors'}
          </p>
        </div>

        {/* Mode + Checklist toggle */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[['kyc', '🪪 KYC (Individuals)'], ['kyb', '🏛️ KYB (Businesses)']].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setFilter('all'); setSearch(''); setCountry(''); setGender(''); }} style={{ background: mode === m ? '#f5c842' : '#141414', color: mode === m ? '#000' : '#888', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>{label}</button>
          ))}
          <button onClick={() => setShowList(!showList)} style={{ background: showList ? '#1e3a5f' : '#141414', color: showList ? '#60a5fa' : '#888', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', marginLeft: 'auto' }}>
            📋 KYB Checklist
          </button>
        </div>

        {/* KYB CHECKLIST */}
        {showList && (
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ fontWeight: '800', fontSize: '16px', color: '#fff', marginBottom: '4px' }}>KYB Verification Checklist</div>
            <div style={{ color: '#555', fontSize: '13px', marginBottom: '20px' }}>Track required documents per applicant</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              {CHECKLIST.map(group => (
                <div key={group.section} style={{ background: '#141414', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ color: '#f5c842', fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '14px' }}>{group.section}</div>
                  {group.items.map(item => {
                    const key = group.section + item;
                    const done = checks[key];
                    return (
                      <label key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px', cursor: 'pointer' }}>
                        <div onClick={() => setChecks(p => ({ ...p, [key]: !p[key] }))} style={{ width: '16px', height: '16px', minWidth: '16px', borderRadius: '4px', marginTop: '2px', background: done ? '#4ade80' : 'transparent', border: '2px solid ' + (done ? '#4ade80' : '#333'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {done && <span style={{ color: '#000', fontSize: '10px', fontWeight: '900' }}>✓</span>}
                        </div>
                        <span style={{ color: done ? '#555' : '#aaa', fontSize: '13px', lineHeight: '1.4', textDecoration: done ? 'line-through' : 'none' }}>{item}</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
            <div style={{ color: '#f5c842', fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '12px' }}>Risk Classification</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
              {RISKS.map(r => (
                <div key={r.level} style={{ background: r.bg, border: '1px solid ' + r.border, borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ color: r.color, fontWeight: '800', fontSize: '14px', marginBottom: '6px' }}>{r.level}</div>
                  <div style={{ color: r.color, fontSize: '12px', opacity: 0.7, lineHeight: '1.5' }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Count cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
          {statuses.map(s => {
            const c = SC[s];
            return (
              <div key={s} onClick={() => setFilter(s)} style={{ background: c.bg, border: '1px solid ' + c.border, borderRadius: '10px', padding: '16px 20px', cursor: 'pointer', outline: filterStatus === s ? '2px solid ' + c.color : 'none' }}>
                <div style={{ color: c.color, fontSize: '28px', fontWeight: '800' }}>{counts[s] || 0}</div>
                <div style={{ color: c.color, fontSize: '12px', textTransform: 'capitalize', marginTop: '4px', opacity: 0.8 }}>{s.replace('_', ' ')}</div>
              </div>
            );
          })}
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', marginBottom: '14px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." style={{ ...inp, paddingLeft: '36px' }} />
          </div>
          <select value={country} onChange={e => setCountry(e.target.value)} style={inp}>
            <option value="">All Countries</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={gender} onChange={e => setGender(e.target.value)} style={inp}>
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          <button onClick={() => { setSearch(''); setCountry(''); setGender(''); setFilter('all'); }} style={{ background: '#141414', color: '#666', border: '1px solid #222', borderRadius: '8px', padding: '9px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>✕ Clear</button>
        </div>

        {/* Status tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['all', ...statuses].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ background: filterStatus === s ? '#1e1e1e' : 'none', color: filterStatus === s ? '#fff' : '#555', border: '1px solid ' + (filterStatus === s ? '#333' : '#1a1a1a'), borderRadius: '20px', padding: '6px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', textTransform: 'capitalize' }}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
          <span style={{ color: '#444', fontSize: '12px', marginLeft: 'auto' }}>Showing {items.length} of {allItems.length}</span>
        </div>

        {msg && (
          <div style={{ background: msg.includes('updated') ? '#052e16' : '#2d0a0a', border: '1px solid ' + (msg.includes('updated') ? '#065f46' : '#7f1d1d'), borderRadius: '8px', padding: '12px 16px', marginBottom: '14px', color: msg.includes('updated') ? '#4ade80' : '#f87171', fontSize: '14px' }}>
            {msg.includes('updated') ? '✅ ' : '❌ '}{msg}
          </div>
        )}

        {/* Table */}
        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                {(mode === 'kyb'
                  ? ['Company', 'User', 'Email', 'Country', 'Status', 'Submitted', 'Actions']
                  : ['Name', 'Email', 'Country', 'Gender', 'Type', 'KYC Status', 'Joined', 'Actions']
                ).map(h => (
                  <th key={h} style={{ padding: '12px 16px', color: '#444', fontSize: '11px', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#333' }}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#333' }}>No records match your filters.</td></tr>
              ) : items.map((item, i) => {
                const isKYB  = mode === 'kyb';
                const status = isKYB ? item.status : (item.kycStatus || 'pending');
                const c      = SC[status] || SC.pending;
                return (
                  <tr key={item._id || i} style={{ borderBottom: '1px solid #111', background: selected?._id === item._id ? '#111' : 'transparent', cursor: 'pointer' }} onClick={() => setSelected(selected?._id === item._id ? null : item)}>
                    <td style={{ padding: '13px 16px', color: '#fff', fontSize: '13px', fontWeight: '600' }}>
                      {isKYB ? (item.companyName || item.userId?.name || '—') : item.name}
                    </td>
                    {isKYB && <td style={{ padding: '13px 16px', color: '#888', fontSize: '13px' }}>{item.userId?.name || '—'}</td>}
                    <td style={{ padding: '13px 16px', color: '#888', fontSize: '13px' }}>{isKYB ? (item.userId?.email || '—') : item.email}</td>
                    <td style={{ padding: '13px 16px', color: '#888', fontSize: '13px' }}>{isKYB ? (item.userId?.country || item.incorporationCountry || '—') : (item.country || '—')}</td>
                    {!isKYB && <td style={{ padding: '13px 16px', color: '#888', fontSize: '12px', textTransform: 'capitalize' }}>{item.gender || '—'}</td>}
                    {!isKYB && <td style={{ padding: '13px 16px', color: '#888', fontSize: '12px', textTransform: 'capitalize' }}>{item.accountType || 'investor'}</td>}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ background: c.bg, color: c.color, border: '1px solid ' + c.border, borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize' }}>
                        {status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', color: '#555', fontSize: '12px' }}>
                      {new Date(isKYB ? item.submittedAt : item.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        <button onClick={e => { e.stopPropagation(); setDocModal(item); }} style={{ background: '#0a1628', color: '#60a5fa', border: '1px solid #1e3a5f', borderRadius: '6px', padding: '4px 9px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>📄 Docs</button>
                        {['in_review', 'approved', 'rejected'].filter(s => s !== status).map(s => {
                          const c2 = SC[s];
                          return (
                            <button key={s} onClick={e => { e.stopPropagation(); updateStatus(item._id, s); }} style={{ background: c2.bg, color: c2.color, border: '1px solid ' + c2.border, borderRadius: '6px', padding: '4px 9px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                              {s.replace('_', ' ')}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Notes panel */}
        {selected && (
          <div style={{ background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#fff', marginBottom: '14px' }}>
              Review: {mode === 'kyb' ? (selected.companyName || selected.userId?.name) : selected.name}
            </div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add review notes (optional)..."
              style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', color: '#ccc', borderRadius: '8px', padding: '12px', fontSize: '13px', minHeight: '80px', boxSizing: 'border-box', marginBottom: '12px', resize: 'vertical', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => setDocModal(selected)} style={{ background: '#0a1628', color: '#60a5fa', border: '1px solid #1e3a5f', borderRadius: '8px', padding: '10px 18px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📄 View Documents</button>
              {['in_review', 'approved', 'rejected'].map(s => {
                const c = SC[s];
                return (
                  <button key={s} onClick={() => updateStatus(selected._id, s)} style={{ background: c.bg, color: c.color, border: '1px solid ' + c.border, borderRadius: '8px', padding: '10px 18px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', textTransform: 'capitalize' }}>
                    {s === 'in_review' ? '🔍 Mark In Review' : s === 'approved' ? '✅ Approve' : '❌ Reject'}
                  </button>
                );
              })}
              <button onClick={() => { setSelected(null); setNotes(''); }} style={{ background: '#141414', color: '#666', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 18px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}