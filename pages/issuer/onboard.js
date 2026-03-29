// pages/issuer/onboard.js
// Multi-step issuer onboarding flow
// Step 1: Company Details
// Step 2: Payout Setup (Wallet + Monerium + IBAN)
// Step 3: Asset Details
// Step 4: Document Upload
// Step 5: Review & Submit
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import MoneriumConnect from '@/components/MoneriumConnect';

export default function IssuerOnboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  // Handle OAuth callback params
  useEffect(() => {
    if (router.query.monerium === 'connected') {
      setForm(prev => ({ ...prev, moneriumConnected: true }));
      if (router.query.step) setStep(parseInt(router.query.step));
      else setStep(2);
    }
    if (router.query.error === 'monerium_failed') {
      setError('Monerium connection failed. You can try again later from your dashboard.');
    }
  }, [router.query]);

  const [form, setForm] = useState({
    // Step 1: Company
    companyName: '',
    registrationNumber: '',
    country: '',
    companyAddress: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    
    // Step 2: Payout
    payoutMethod: 'wallet_monerium',
    walletAddress: '',
    bankIBAN: '',
    bankAccountHolder: '',
    moneriumConnected: false,
    moneriumIBAN: '',
    savedIssuerId: '',
    
    // Step 3: Asset
    assetName: '',
    assetType: 'real_estate',
    assetDescription: '',
    targetAmount: '',
    tokenSupply: '',
    pricePerToken: '',
    minInvestment: '100',
    expectedReturn: '',
    deadline: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/issuer/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(data);
      setStep(6); // Success screen
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Install MetaMask or any Web3 wallet');
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      update('walletAddress', accounts[0]);
      
      // Switch to Polygon
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }],
        });
      } catch (e) {}
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-[#d4af37]">List Your Asset</span> on Nextoken
          </h1>
          <p className="text-gray-400">
            Tokenize real-world assets and reach investors in 180+ countries
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-10">
          {['Company', 'Payout', 'Asset', 'Documents', 'Review'].map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > i + 1 ? 'bg-green-600 text-white' :
                step === i + 1 ? 'bg-[#d4af37] text-black' :
                'bg-gray-800 text-gray-500'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-xs hidden sm:block ${
                step === i + 1 ? 'text-[#d4af37]' : 'text-gray-500'
              }`}>{label}</span>
              {i < 4 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                step > i + 1 ? 'bg-green-600' : 'bg-gray-800'
              }`} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Company Details ── */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold mb-4">Company Information</h2>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Company Name *</label>
              <input
                value={form.companyName}
                onChange={(e) => update('companyName', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                placeholder="e.g. Baltic Energy UAB"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Registration Number</label>
                <input
                  value={form.registrationNumber}
                  onChange={(e) => update('registrationNumber', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="e.g. 306123456"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Country *</label>
                <select
                  value={form.country}
                  onChange={(e) => update('country', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                >
                  <option value="">Select country</option>
                  <option value="LT">Lithuania</option>
                  <option value="EE">Estonia</option>
                  <option value="LV">Latvia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="NL">Netherlands</option>
                  <option value="FI">Finland</option>
                  <option value="SE">Sweden</option>
                  <option value="AT">Austria</option>
                  <option value="CH">Switzerland</option>
                  <option value="OTHER">Other EU</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Company Address</label>
              <input
                value={form.companyAddress}
                onChange={(e) => update('companyAddress', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                placeholder="Street, City, Postal Code"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Contact Name *</label>
                <input
                  value={form.contactName}
                  onChange={(e) => update('contactName', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Email *</label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => update('contactEmail', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Phone</label>
                <input
                  value={form.contactPhone}
                  onChange={(e) => update('contactPhone', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!form.companyName || !form.contactName || !form.contactEmail) {
                  setError('Fill required fields');
                  return;
                }
                setError('');
                setStep(2);
              }}
              className="w-full py-3 rounded-xl font-bold text-black bg-[#d4af37] hover:bg-[#c9a432] transition"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 2: Payout Setup ── */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold mb-4">Payout Setup</h2>
            <p className="text-gray-400 text-sm mb-4">
              Choose how you want to receive investment funds. We recommend Monerium for automatic EUR conversion at zero cost.
            </p>

            {/* Payout Method */}
            <div className="space-y-3">
              <div
                onClick={() => update('payoutMethod', 'wallet_monerium')}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  form.payoutMethod === 'wallet_monerium'
                    ? 'border-[#d4af37] bg-[#d4af37]/5'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Wallet + Monerium (Recommended)</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Receive EURe → auto-converts to EUR in your bank. <span className="text-green-400 font-bold">FREE conversion.</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    form.payoutMethod === 'wallet_monerium'
                      ? 'border-[#d4af37] bg-[#d4af37]' : 'border-gray-600'
                  }`} />
                </div>
              </div>

              <div
                onClick={() => update('payoutMethod', 'wallet_only')}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  form.payoutMethod === 'wallet_only'
                    ? 'border-[#d4af37] bg-[#d4af37]/5'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">Wallet Only (Crypto)</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Receive EURe in your wallet. Convert to EUR yourself via exchange.
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    form.payoutMethod === 'wallet_only'
                      ? 'border-[#d4af37] bg-[#d4af37]' : 'border-gray-600'
                  }`} />
                </div>
              </div>
            </div>

            {/* Wallet Connection */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">Polygon Wallet Address *</label>
              {form.walletAddress ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-900 border border-green-700 rounded-xl px-4 py-3 text-green-400 font-mono text-sm">
                    {form.walletAddress.slice(0, 10)}...{form.walletAddress.slice(-8)}
                  </div>
                  <button
                    onClick={() => update('walletAddress', '')}
                    className="px-4 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full py-3 rounded-xl border border-[#d4af37] text-[#d4af37] font-bold hover:bg-[#d4af37]/10 transition"
                >
                  🔗 Connect Wallet
                </button>
              )}
            </div>

            {/* Monerium Setup (if selected) */}
            {form.payoutMethod === 'wallet_monerium' && (
              <>
                <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4">
                  <h4 className="font-bold text-blue-400 mb-2">How It Works</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>1. Click the button below — a secure panel opens</p>
                    <p>2. Sign up on Monerium (5 minutes, never leaves this page)</p>
                    <p>3. Wallet + bank account are auto-linked</p>
                    <p>4. You receive EUR in bank automatically</p>
                  </div>
                  <div className="mt-2 text-xs text-green-400 font-bold">Cost: FREE — 0% EUR conversion</div>
                </div>

                {form.moneriumConnected ? (
                  <div className="p-4 bg-green-900/20 border border-green-700 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">✓</div>
                      <div>
                        <div className="text-green-400 font-bold text-sm">Monerium Connected</div>
                        {form.moneriumIBAN && (
                          <div className="text-white font-mono text-xs mt-0.5">IBAN: {form.moneriumIBAN}</div>
                        )}
                        <div className="text-gray-400 text-xs">EUR payouts active • 0% fee</div>
                      </div>
                    </div>
                  </div>
                ) : form.savedIssuerId ? (
                  <MoneriumConnect
                    issuerId={form.savedIssuerId}
                    walletAddress={form.walletAddress}
                    onConnected={({ profileId, iban }) => {
                      update('moneriumConnected', true);
                      update('moneriumIBAN', iban || '');
                    }}
                    onError={(err) => setError('Monerium: ' + err)}
                  />
                ) : (
                  <button
                    onClick={async () => {
                      if (!form.walletAddress) { setError('Connect your wallet first'); return; }
                      if (!form.companyName || !form.contactName || !form.contactEmail) {
                        setError('Fill in company details in Step 1 first');
                        return;
                      }
                      setError('');
                      try {
                        const saveRes = await fetch('/api/issuer/onboard', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            ...form,
                            assetName: form.assetName || 'Draft Asset',
                            targetAmount: form.targetAmount || '0',
                            tokenSupply: form.tokenSupply || '1',
                            pricePerToken: form.pricePerToken || '1',
                          }),
                        });
                        const saveData = await saveRes.json();
                        if (saveData.issuerId) {
                          update('savedIssuerId', saveData.issuerId);
                        } else {
                          throw new Error(saveData.error || 'Failed to save');
                        }
                      } catch (e) {
                        setError('Failed: ' + e.message);
                      }
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold hover:from-blue-500 hover:to-blue-400 transition flex items-center justify-center gap-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="4" width="20" height="16" rx="3" stroke="white" strokeWidth="2"/>
                      <path d="M2 10h20" stroke="white" strokeWidth="2"/>
                    </svg>
                    Connect Bank Account via Monerium
                  </button>
                )}

                {!form.moneriumConnected && (
                  <div className="border-t border-gray-800 pt-4">
                    <div className="text-xs text-gray-500 mb-3">Or enter bank details manually (Monerium setup needed later):</div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Bank IBAN</label>
                        <input value={form.bankIBAN} onChange={(e) => update('bankIBAN', e.target.value.toUpperCase())}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none font-mono"
                          placeholder="LT12 3456 7890 1234 5678" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Account Holder Name</label>
                        <input value={form.bankAccountHolder} onChange={(e) => update('bankAccountHolder', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                          placeholder="Company name as registered with bank" />
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">You can also connect Monerium later from your issuer dashboard</p>
              </>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition">
                ← Back
              </button>
              <button
                onClick={() => {
                  if (!form.walletAddress) { setError('Connect your wallet'); return; }
                  setError('');
                  setStep(3);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-black bg-[#d4af37] hover:bg-[#c9a432] transition"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Asset Details ── */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold mb-4">Asset Details</h2>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Asset Name *</label>
              <input
                value={form.assetName}
                onChange={(e) => update('assetName', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                placeholder="e.g. Baltic Green Bond 2027"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Asset Type *</label>
                <select
                  value={form.assetType}
                  onChange={(e) => update('assetType', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                >
                  <option value="real_estate">Real Estate</option>
                  <option value="bond">Bond</option>
                  <option value="equity">Equity</option>
                  <option value="fund">Fund</option>
                  <option value="commodity">Commodity</option>
                  <option value="infrastructure">Infrastructure</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Expected Return</label>
                <input
                  value={form.expectedReturn}
                  onChange={(e) => update('expectedReturn', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="e.g. 6.4% annual"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Description</label>
              <textarea
                value={form.assetDescription}
                onChange={(e) => update('assetDescription', e.target.value)}
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none resize-none"
                placeholder="Describe the asset, its income source, and investment thesis..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Fundraising Target (EUR) *</label>
                <input
                  type="number"
                  value={form.targetAmount}
                  onChange={(e) => update('targetAmount', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="e.g. 500000"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Token Supply *</label>
                <input
                  type="number"
                  value={form.tokenSupply}
                  onChange={(e) => update('tokenSupply', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="e.g. 10000"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Price Per Token (EUR) *</label>
                <input
                  type="number"
                  value={form.pricePerToken}
                  onChange={(e) => update('pricePerToken', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="e.g. 50"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Min Investment (EUR)</label>
                <input
                  type="number"
                  value={form.minInvestment}
                  onChange={(e) => update('minInvestment', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => update('deadline', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                />
              </div>
            </div>

            {/* Auto-calculated summary */}
            {form.targetAmount && form.tokenSupply && form.pricePerToken && (
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-sm space-y-1">
                <div className="flex justify-between text-gray-400">
                  <span>Total Token Value</span>
                  <span className="text-white">€{(form.tokenSupply * form.pricePerToken).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Platform Commission (0.25%)</span>
                  <span className="text-[#d4af37]">€{(form.targetAmount * 0.0025).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>You Receive</span>
                  <span className="text-green-400 font-bold">€{(form.targetAmount * 0.9975).toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition">
                ← Back
              </button>
              <button
                onClick={() => {
                  if (!form.assetName || !form.tokenSupply || !form.pricePerToken || !form.targetAmount) {
                    setError('Fill required fields');
                    return;
                  }
                  setError('');
                  setStep(4);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-black bg-[#d4af37] hover:bg-[#c9a432] transition"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Document Upload ── */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold mb-4">Required Documents</h2>
            <p className="text-gray-400 text-sm">Upload supporting documents. You can also add these after submission.</p>

            {[
              { key: 'valuation', label: 'Asset Valuation Report', desc: 'Independent or internal valuation' },
              { key: 'ownership', label: 'Legal Ownership Proof', desc: 'Title deed, share certificates, etc.' },
              { key: 'financials', label: 'Financial Statements', desc: 'Recent P&L, balance sheet' },
              { key: 'insurance', label: 'Insurance Documents', desc: 'Coverage details (if applicable)' },
            ].map((doc) => (
              <div key={doc.key} className="p-4 rounded-xl border border-gray-700 bg-gray-900/30">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white text-sm">{doc.label}</div>
                    <div className="text-xs text-gray-500">{doc.desc}</div>
                  </div>
                  <label className="px-4 py-2 rounded-lg border border-[#d4af37] text-[#d4af37] text-sm cursor-pointer hover:bg-[#d4af37]/10 transition">
                    Upload
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                  </label>
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition">
                ← Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 py-3 rounded-xl font-bold text-black bg-[#d4af37] hover:bg-[#c9a432] transition"
              >
                Review & Submit →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Review & Submit ── */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold mb-4">Review & Submit</h2>

            <div className="space-y-3">
              <div className="bg-gray-900/50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">COMPANY</div>
                <div className="text-white font-bold">{form.companyName}</div>
                <div className="text-gray-400 text-sm">{form.country} · {form.registrationNumber}</div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">PAYOUT</div>
                <div className="text-white font-mono text-sm">
                  {form.walletAddress?.slice(0, 10)}...{form.walletAddress?.slice(-8)}
                </div>
                <div className="text-gray-400 text-sm">
                  {form.payoutMethod === 'wallet_monerium' ? 'Monerium → EUR to bank (free)' : 'Wallet only (EURe)'}
                </div>
                {form.bankIBAN && (
                  <div className="text-gray-400 text-sm">IBAN: {form.bankIBAN}</div>
                )}
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">ASSET</div>
                <div className="text-white font-bold">{form.assetName}</div>
                <div className="text-gray-400 text-sm">
                  {form.assetType} · €{parseInt(form.targetAmount).toLocaleString()} target · {parseInt(form.tokenSupply).toLocaleString()} tokens · €{form.pricePerToken}/token
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">FEES</div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Platform commission</span>
                    <span className="text-[#d4af37]">0.25%</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>EUR conversion (Monerium)</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>SEPA payout</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-white font-bold border-t border-gray-700 pt-1">
                    <span>Total cost to you</span>
                    <span className="text-[#d4af37]">0.25%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(4)} className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-black bg-[#d4af37] hover:bg-[#c9a432] disabled:opacity-50 transition"
              >
                {loading ? '⏳ Submitting...' : '✅ Submit for Review'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6: Success ── */}
        {step === 6 && success && (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-[#d4af37]">Asset Submitted!</h2>
            <p className="text-gray-400">Your asset is under review. You'll be notified within 24-48 hours.</p>

            <div className="bg-gray-900/50 rounded-xl p-6 text-left space-y-3">
              <h3 className="font-bold text-white">Next Steps:</h3>
              {success.nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-[#d4af37]">{i + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {success.moneriumIBAN && (
              <div className="bg-green-900/20 border border-green-700 rounded-xl p-4">
                <div className="text-sm text-green-400 font-bold">Your Monerium IBAN</div>
                <div className="text-white font-mono text-lg mt-1">{success.moneriumIBAN}</div>
                <div className="text-xs text-gray-400 mt-1">EURe will auto-redeem to EUR at this IBAN</div>
              </div>
            )}

            <button
              onClick={() => router.push('/dashboard/issuer')}
              className="w-full py-3 rounded-xl font-bold text-black bg-[#d4af37] hover:bg-[#c9a432] transition"
            >
              Go to Issuer Dashboard →
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-xl text-sm text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
