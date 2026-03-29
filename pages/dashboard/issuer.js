// pages/dashboard/issuer.js
// Issuer Dashboard — manage assets, view investments, redeem EURe to EUR
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function IssuerDashboard() {
  const { data: session } = useSession();
  const [issuer, setIssuer] = useState(null);
  const [assets, setAssets] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemResult, setRedeemResult] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/issuer/dashboard');
      const data = await res.json();
      if (data.issuer) setIssuer(data.issuer);
      if (data.assets) setAssets(data.assets);
      if (data.redemptions) setRedemptions(data.redemptions);
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (issuerId) => {
    setRedeemLoading(true);
    setRedeemResult(null);
    try {
      const res = await fetch('/api/issuer/redeem-eure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issuerId, mode: 'manual' }),
      });
      const data = await res.json();
      setRedeemResult(data);
      await fetchData();
    } catch (e) {
      setRedeemResult({ error: e.message });
    } finally {
      setRedeemLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <div className="text-[#d4af37] text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const totalRaised = assets.reduce((sum, a) => sum + (a.totalRaised || 0), 0);
  const totalInvestors = assets.reduce((sum, a) => sum + (a.totalInvestors || 0), 0);
  const totalCommission = totalRaised * 0.0025;
  const netReceived = totalRaised - totalCommission;

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Issuer Dashboard</h1>
            <p className="text-gray-400">{issuer?.companyName || 'Your Company'}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
            issuer?.onboardingStatus === 'complete'
              ? 'bg-green-900/30 text-green-400 border border-green-700'
              : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
          }`}>
            {issuer?.onboardingStatus === 'complete' ? '● Active' : '● ' + (issuer?.onboardingStatus || 'Pending')}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="text-gray-500 text-xs mb-1">TOTAL RAISED</div>
            <div className="text-2xl font-bold text-[#d4af37]">€{totalRaised.toLocaleString()}</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="text-gray-500 text-xs mb-1">NET RECEIVED</div>
            <div className="text-2xl font-bold text-green-400">€{netReceived.toLocaleString()}</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="text-gray-500 text-xs mb-1">PLATFORM FEE (0.25%)</div>
            <div className="text-2xl font-bold text-yellow-400">€{totalCommission.toLocaleString()}</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="text-gray-500 text-xs mb-1">INVESTORS</div>
            <div className="text-2xl font-bold text-white">{totalInvestors}</div>
          </div>
        </div>

        {/* Payout Info */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold">Payout Settings</h2>
              <p className="text-sm text-gray-400">Where your investment funds are sent</p>
            </div>
            <button
              onClick={() => handleRedeem(issuer?._id)}
              disabled={redeemLoading}
              className="px-5 py-2 rounded-xl font-bold text-black bg-[#d4af37] hover:bg-[#c9a432] disabled:opacity-50 transition text-sm"
            >
              {redeemLoading ? '⏳ Processing...' : '💶 Withdraw to Bank'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">WALLET</div>
              <div className="text-sm text-white font-mono">
                {issuer?.walletAddress
                  ? `${issuer.walletAddress.slice(0, 10)}...${issuer.walletAddress.slice(-8)}`
                  : 'Not connected'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">BANK IBAN</div>
              <div className="text-sm text-white font-mono">
                {issuer?.bankIBAN || issuer?.moneriumIBAN || 'Not configured'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">MONERIUM</div>
              <div className="text-sm text-white">
                {issuer?.moneriumProfileId ? (
                  <span className="text-green-400">✓ Connected — FREE EUR conversion</span>
                ) : (
                  <button
                    onClick={() => window.location.href = `/api/monerium/connect?issuerId=${issuer?._id}`}
                    className="px-4 py-2 rounded-lg border border-[#d4af37] text-[#d4af37] text-xs font-bold hover:bg-[#d4af37]/10 transition"
                  >
                    🔗 Connect Monerium
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* EURe Balance */}
          {issuer?.eureBalance > 0 && (
            <div className="mt-4 p-3 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-xl flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-400">EURe Balance in Wallet</div>
                <div className="text-xl font-bold text-[#d4af37]">€{issuer.eureBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              </div>
              <button
                onClick={() => handleRedeem(issuer?._id)}
                disabled={redeemLoading || !issuer?.moneriumProfileId}
                className="px-4 py-2 rounded-lg font-bold text-black bg-[#d4af37] hover:bg-[#c9a432] disabled:opacity-50 transition text-sm"
              >
                {redeemLoading ? '⏳...' : 'Withdraw All to Bank'}
              </button>
            </div>
          )}

          {redeemResult && (
            <div className={`mt-4 p-3 rounded-xl text-sm ${
              redeemResult.error
                ? 'bg-red-900/20 border border-red-700 text-red-400'
                : 'bg-green-900/20 border border-green-700 text-green-400'
            }`}>
              {redeemResult.error
                ? redeemResult.error
                : redeemResult.results?.map((r, i) => (
                    <div key={i}>
                      {r.status === 'success'
                        ? `✅ €${r.amountEURe?.toFixed(2)} sent to ${r.destinationIBAN}. Arrives in 1-2 days.`
                        : `${r.status}: ${r.reason || r.error}`
                      }
                    </div>
                  ))
              }
            </div>
          )}
        </div>

        {/* Assets */}
        <h2 className="text-lg font-bold mb-4">Your Assets</h2>
        {assets.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 mb-4">No assets listed yet</p>
            <a href="/issuer/onboard" className="px-6 py-3 rounded-xl font-bold text-black bg-[#d4af37] hover:bg-[#c9a432] transition inline-block">
              List Your First Asset →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset, i) => {
              const progress = asset.targetAmount > 0
                ? (asset.totalRaised / asset.targetAmount * 100)
                : 0;
              const tokenProgress = asset.tokenSupply > 0
                ? (asset.tokensSold / asset.tokenSupply * 100)
                : 0;

              return (
                <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-white text-lg">{asset.name}</h3>
                      <span className="text-xs text-gray-500">{asset.type} · Contract ID: {asset.contractAssetId ?? 'Pending'}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      asset.status === 'live' ? 'bg-green-900/30 text-green-400 border border-green-700' :
                      asset.status === 'pending_review' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' :
                      'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}>
                      {asset.status}
                    </div>
                  </div>

                  {/* Fundraising */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Fundraising</span>
                      <span className="text-[#d4af37] font-bold">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-[#d4af37] h-2 rounded-full transition-all"
                           style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>€{(asset.totalRaised || 0).toLocaleString()} raised</span>
                      <span>€{(asset.targetAmount || 0).toLocaleString()} target</span>
                    </div>
                  </div>

                  {/* Token Sale */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Tokens Sold</span>
                      <span className="text-white font-bold">{asset.tokensSold || 0} / {asset.tokenSupply}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full transition-all"
                           style={{ width: `${Math.min(tokenProgress, 100)}%` }} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="text-center">
                      <div className="text-[#d4af37] font-bold">{asset.totalInvestors || 0}</div>
                      <div className="text-gray-600 text-xs">Investors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">€{asset.pricePerToken}</div>
                      <div className="text-gray-600 text-xs">Token Price</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">€{asset.minInvestment}</div>
                      <div className="text-gray-600 text-xs">Min Invest</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-bold">0.25%</div>
                      <div className="text-gray-600 text-xs">Platform Fee</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent Redemptions */}
        {redemptions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Payout History</h2>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-gray-500 font-normal">Date</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-normal">Amount</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-normal">Destination</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((r, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-white font-bold">
                        €{r.amountEURe?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        {r.iban?.replace(/(.{4})(.*)(.{4})/, '$1****$3')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          r.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                          r.status === 'processing' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-gray-800 text-gray-400'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
