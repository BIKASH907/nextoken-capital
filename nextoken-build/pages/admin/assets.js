// pages/admin/assets.js
// Admin panel for reviewing and managing issuer asset submissions
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminAssets() {
  const { data: session } = useSession();
  const [assets, setAssets] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('pending_review');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  useEffect(() => { fetchAssets(); }, [filter]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/assets?status=${filter}`);
      const data = await res.json();
      setAssets(data.assets || []);
      setStats(data.stats || {});
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (assetId, action, reason = '') => {
    setActionLoading(assetId);
    try {
      const res = await fetch('/api/admin/approve-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, action, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchAssets();
      setShowRejectModal(null);
      setRejectReason('');
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (!session || session.user?.role !== 'admin') {
    return <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center text-red-400">Admin access required</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Asset Management</h1>
        <p className="text-gray-400 mb-6">Review, approve, and manage issuer asset submissions</p>

        {/* Stats Bar */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400', f: 'pending_review' },
            { label: 'Live', value: stats.live, color: 'text-green-400', f: 'live' },
            { label: 'Paused', value: stats.paused, color: 'text-orange-400', f: 'paused' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-400', f: 'rejected' },
            { label: 'All', value: stats.total, color: 'text-white', f: 'all' },
          ].map((s, i) => (
            <button key={i} onClick={() => setFilter(s.f)}
              className={`p-4 rounded-xl border text-center transition ${
                filter === s.f ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
              }`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value || 0}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Asset List */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : assets.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No assets found</div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset._id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{asset.name}</h3>
                    <div className="text-sm text-gray-400">
                      {asset.type} · {asset.issuer?.companyName || 'Unknown'} · {asset.issuer?.country || ''}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    asset.status === 'live' ? 'bg-green-900/30 text-green-400 border border-green-700' :
                    asset.status === 'pending_review' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' :
                    asset.status === 'paused' ? 'bg-orange-900/30 text-orange-400 border border-orange-700' :
                    'bg-red-900/30 text-red-400 border border-red-700'
                  }`}>{asset.status}</span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-500">Target</div>
                    <div className="text-white font-bold">€{(asset.targetAmount || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Tokens</div>
                    <div className="text-white font-bold">{(asset.tokenSupply || 0).toLocaleString()} × €{asset.pricePerToken}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Min Invest</div>
                    <div className="text-white font-bold">€{asset.minInvestment || 100}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Commission</div>
                    <div className="text-[#d4af37] font-bold">{((asset.commissionBps || 25) / 100).toFixed(2)}%</div>
                  </div>
                </div>

                {/* Issuer Info */}
                <div className="bg-gray-800/50 rounded-lg p-3 mb-4 text-sm">
                  <div className="flex gap-6">
                    <div>
                      <span className="text-gray-500">Wallet: </span>
                      <span className="text-white font-mono text-xs">
                        {asset.issuerWallet?.slice(0, 10)}...{asset.issuerWallet?.slice(-8)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Monerium: </span>
                      <span className={asset.issuer?.moneriumConnected ? 'text-green-400' : 'text-red-400'}>
                        {asset.issuer?.moneriumConnected ? '✓ Connected' : '✗ Not connected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">IBAN: </span>
                      <span className="text-white">{asset.issuer?.moneriumIBAN || asset.issuerIBAN || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">KYB: </span>
                      <span className={asset.issuer?.kybStatus === 'verified' ? 'text-green-400' : 'text-yellow-400'}>
                        {asset.issuer?.kybStatus || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contract Info (if approved) */}
                {asset.contractAssetId !== null && asset.contractAssetId !== undefined && (
                  <div className="bg-blue-900/10 border border-blue-800 rounded-lg p-3 mb-4 text-sm">
                    <span className="text-gray-400">Contract ID: </span>
                    <span className="text-blue-400 font-mono">{asset.contractAssetId}</span>
                    {asset.contractTxHash && (
                      <>
                        <span className="text-gray-400 ml-4">Tx: </span>
                        <a href={`https://polygonscan.com/tx/${asset.contractTxHash}`} target="_blank"
                           className="text-[#d4af37] underline font-mono text-xs">
                          {asset.contractTxHash.slice(0, 16)}...
                        </a>
                      </>
                    )}
                    <span className="text-gray-400 ml-4">Raised: </span>
                    <span className="text-green-400 font-bold">€{(asset.totalRaised || 0).toLocaleString()}</span>
                    <span className="text-gray-400 ml-4">Investors: </span>
                    <span className="text-white font-bold">{asset.totalInvestors || 0}</span>
                  </div>
                )}

                {/* Rejection reason */}
                {asset.status === 'rejected' && asset.rejectionReason && (
                  <div className="bg-red-900/10 border border-red-800 rounded-lg p-3 mb-4 text-sm text-red-400">
                    Rejection reason: {asset.rejectionReason}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {asset.status === 'pending_review' && (
                    <>
                      <button onClick={() => handleAction(asset._id, 'approve')}
                        disabled={actionLoading === asset._id}
                        className="px-5 py-2 rounded-lg font-bold text-black bg-green-500 hover:bg-green-400 disabled:opacity-50 transition text-sm">
                        {actionLoading === asset._id ? '⏳ Registering on chain...' : '✅ Approve & Deploy'}
                      </button>
                      <button onClick={() => setShowRejectModal(asset._id)}
                        className="px-5 py-2 rounded-lg font-bold text-red-400 border border-red-700 hover:bg-red-900/30 transition text-sm">
                        ✗ Reject
                      </button>
                    </>
                  )}
                  {asset.status === 'live' && (
                    <button onClick={() => handleAction(asset._id, 'pause')}
                      disabled={actionLoading === asset._id}
                      className="px-5 py-2 rounded-lg font-bold text-orange-400 border border-orange-700 hover:bg-orange-900/30 disabled:opacity-50 transition text-sm">
                      {actionLoading === asset._id ? '⏳...' : '⏸ Pause'}
                    </button>
                  )}
                  {asset.status === 'paused' && (
                    <button onClick={() => handleAction(asset._id, 'resume')}
                      disabled={actionLoading === asset._id}
                      className="px-5 py-2 rounded-lg font-bold text-green-400 border border-green-700 hover:bg-green-900/30 disabled:opacity-50 transition text-sm">
                      {actionLoading === asset._id ? '⏳...' : '▶ Resume'}
                    </button>
                  )}
                </div>

                {/* Reject Modal */}
                {showRejectModal === asset._id && (
                  <div className="mt-4 p-4 bg-red-900/10 border border-red-800 rounded-xl">
                    <label className="text-sm text-gray-400 block mb-2">Rejection Reason</label>
                    <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none resize-none"
                      rows={2} placeholder="Explain why this asset was rejected..." />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleAction(asset._id, 'reject', rejectReason)}
                        disabled={actionLoading === asset._id}
                        className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50">
                        Confirm Reject
                      </button>
                      <button onClick={() => { setShowRejectModal(null); setRejectReason(''); }}
                        className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-gray-700 hover:text-white">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
