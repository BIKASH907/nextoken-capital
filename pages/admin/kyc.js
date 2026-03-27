import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

const STATUS_COLORS = {
  pending: { bg: '#2d1f00', color: '#f5c842', border: '#5a3e00' },
  in_review: { bg: '#0a1628', color: '#60a5fa', border: '#1e3a5f' },
  approved: { bg: '#052e16', color: '#4ade80', border: '#065f46' },
  rejected: { bg: '#2d0a0a', color: '#f87171', border: '#7f1d1d' },
};

export default function KYCAdmin() {
  const [mode, setMode] = useState('kyc'); // 'kyc' or 'kyb'
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    setLoading(true);
    try {
      if (mode === 'kyb') {
        const res = await fetch(`/api/admin/kyb?status=${filterStatus}`);
        const data = await res.json();
        setItems(data.kyb || []);
        setCounts(data.counts || {});
      } else {
        const res = await fetch(`/api/admin/users?kycStatus=${filterStatus}&limit=100`);
        const data = await res.json();
        setItems(data.users || []);
        setCounts(data.counts || {});
      }
    } catch (e) {}
    setLoading(false);
  }

  useEffect(() => { load(); }, [mode, filterStatus]);

  async function updateStatus(id, status) {
    if (!confirm(`Set status to "${status}"?`)) return;
    const endpoint = mode === 'kyb' ? '/api/admin/kyb' : '/api/admin/users/kyc-status';
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, notes })
    });
    if (res.ok) {
      setMsg(`✅ Status updated to ${status}`);
      setSelected(null);
      load();
      setTimeout(() => setMsg(''), 3000);
    } else {
      setMsg('❌ Update failed');
    }
  }

  const statuses = ['pending', 'in_review', 'approved', 'rejected'];

  return (
    <AdminLayout>
      <div style={{ padding: '28px 32px', background: '#080808', minHeight: '100vh' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>
            {mode === 'kyb' ? '🏛️ KYB — Business Entity Verification' : '🪪 KYC — Individual Verification'}
          </h1>
          <p style={{ color: '#555', marginTop: '6px', fontSize: '14px' }}>
            {mode === 'kyb'
              ? 'Know Your Business: Corporate verification for issuers and institutional investors'
              : 'Know Your Customer: Identity verification for individual investors'}
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button onClick={() => setMode('kyc')} style={{
            background: mode === 'kyc' ? '#f5c842' : '#141414',
            color: mode === 'kyc' ? '#000' : '#888',
            border: '1px solid #2a2a2a', borderRadius: '8px',
            padding: '10px 20px', cursor: 'pointer', fontWeight: '700', fontSize: '13px'
          }}>🪪 KYC (Individuals)</button>
          <button onClick={() => setMode('kyb')} style={{
            background: mode === 'kyb' ? '#f5c842' : '#141414',
            color: mode === 'kyb' ? '#000' : '#888',
            border: '1px solid #2a2a2a', borderRadius: '8px',
            padding: '10px 20px', cursor: 'pointer', fontWeight: '700', fontSize: '13px'
          }}>🏛️ KYB (Businesses)</button>
        </div>

        {/* Count cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {statuses.map(s => {
            const c = STATUS_COLORS[s];
            return (
              <div key={s} onClick={() => setFilterStatus(s)} style={{
                background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px',
                padding: '16px 20px', cursor: 'pointer',
                outline: filterStatus === s ? `2px solid ${c.color}` : 'none'
              }}>
                <div style={{ color: c.color, fontSize: '28px', fontWeight: '800' }}>
                  {counts[s] ?? 0}
                </div>
                <div style={{ color: c.color, fontSize: '12px', textTransform: 'capitalize', marginTop: '4px', opacity: 0.8 }}>{s.replace('_', ' ')}</div>
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['all', ...statuses].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              background: filterStatus === s ? '#1e1e1e' : 'none',
              color: filterStatus === s ? '#fff' : '#555',
              border: `1px solid ${filterStatus === s ? '#333' : '#1a1a1a'}`,
              borderRadius: '20px', padding: '6px 16px', cursor: 'pointer',
              fontSize: '13px', fontWeight: '600', textTransform: 'capitalize'
            }}>{s === 'all' ? 'All' : s.replace('_', ' ')}</button>
          ))}
        </div>

        {msg && (
          <div style={{ background: msg.startsWith('✅') ? '#052e16' : '#2d0a0a', border: `1px solid ${msg.startsWith('✅') ? '#065f46' : '#7f1d1d'}`, borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: msg.startsWith('✅') ? '#4ade80' : '#f87171', fontSize: '14px' }}>
            {msg}
          </div>
        )}

        {/* Table */}
        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                {(mode === 'kyb'
                  ? ['Company', 'User', 'Email', 'Country', 'Status', 'Submitted', 'Actions']
                  : ['Name', 'Email', 'Country', 'Account Type', 'KYC Status', 'Joined', 'Actions']
                ).map(h => (
                  <th key={h} style={{ padding: '12px 16px', color: '#444', fontSize: '11px', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#333' }}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#333' }}>
                  {mode === 'kyb'
                    ? 'No business entities found. Issuers who register will appear here automatically.'
                    : 'No users found for this filter.'}
                </td></tr>
              ) : items.map((item, i) => {
                const isKYB = mode === 'kyb';
                const status = isKYB ? item.status : item.kycStatus || 'pending';
                const sc = STATUS_COLORS[status] || STATUS_COLORS.pending;
                return (
                  <tr key={item._id || i} style={{ borderBottom: '1px solid #111', background: selected?._id === item._id ? '#111' : 'transparent' }}
                    onClick={() => setSelected(selected?._id === item._id ? null : item)}>
                    <td style={{ padding: '14px 16px', color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                      {isKYB ? (item.companyName || item.userId?.name || '—') : item.name}
                    </td>
                    {isKYB && (
                      <td style={{ padding: '14px 16px', color: '#888', fontSize: '13px' }}>
                        {item.userId?.name || '—'}
                      </td>
                    )}
                    <td style={{ padding: '14px 16px', color: '#888', fontSize: '13px' }}>
                      {isKYB ? item.userId?.email : item.email}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#888', fontSize: '13px' }}>
                      {isKYB ? (item.userId?.country || item.incorporationCountry || '—') : item.country || '—'}
                    </td>
                    {!isKYB && (
                      <td style={{ padding: '14px 16px', color: '#888', fontSize: '13px', textTransform: 'capitalize' }}>
                        {item.accountType || 'investor'}
                      </td>
                    )}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' }}>
                        {status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#555', fontSize: '12px' }}>
                      {new Date(isKYB ? item.submittedAt : item.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {['in_review', 'approved', 'rejected'].filter(s => s !== status).map(s => {
                          const sc2 = STATUS_COLORS[s];
                          return (
                            <button key={s} onClick={e => { e.stopPropagation(); updateStatus(item._id, s); }} style={{
                              background: sc2.bg, color: sc2.color, border: `1px solid ${sc2.border}`,
                              borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
                              fontSize: '11px', fontWeight: '700', textTransform: 'capitalize'
                            }}>{s.replace('_', ' ')}</button>
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

        {/* Selected detail panel */}
        {selected && (
          <div style={{ background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#fff', marginBottom: '16px' }}>
              Review: {mode === 'kyb' ? (selected.companyName || selected.userId?.name) : selected.name}
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add review notes (optional)..."
              style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', color: '#ccc', borderRadius: '8px', padding: '12px', fontSize: '13px', minHeight: '80px', boxSizing: 'border-box', marginBottom: '12px', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['in_review', 'approved', 'rejected'].map(s => {
                const sc = STATUS_COLORS[s];
                return (
                  <button key={s} onClick={() => updateStatus(selected._id, s)} style={{
                    background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                    borderRadius: '8px', padding: '10px 20px', cursor: 'pointer',
                    fontWeight: '700', fontSize: '13px', textTransform: 'capitalize'
                  }}>{s === 'in_review' ? '🔍 Mark In Review' : s === 'approved' ? '✅ Approve' : '❌ Reject'}</button>
                );
              })}
              <button onClick={() => setSelected(null)} style={{ background: '#141414', color: '#666', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
