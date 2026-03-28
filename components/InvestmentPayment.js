import { useState } from 'react';

export default function InvestmentPayment({ asset, units, onSuccess, onBack }) {
  const [status, setStatus] = useState('ready');
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const amount = (asset.tokenPrice || 0) * units;
  const receiver = process.env.NEXT_PUBLIC_PAYMENT_RECEIVER || '';

  async function switchToPolygon() {
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
            rpcUrls: ['https://polygon-rpc.com'],
            blockExplorerUrls: ['https://polygonscan.com'],
          }],
        });
      } else throw err;
    }
  }

  async function payWithPOL() {
    if (!window.ethereum) { setError('MetaMask not found. Please install MetaMask.'); return; }
    setStatus('switching');
    setError('');
    try {
      await switchToPolygon();
      setStatus('connecting');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const from = accounts[0];

      // Convert EUR amount to approximate POL value
      // Fetch current POL price
      setStatus('calculating');
      let polPrice = 0.08;
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=eur');
        const data = await res.json();
        polPrice = data['matic-network']?.eur || 0.08;
      } catch(e) {}

      const polAmount = amount / polPrice;
      const weiHex = '0x' + BigInt(Math.floor(polAmount * 1e18)).toString(16);

      setStatus('confirming');
      const tx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from,
          to: receiver,
          value: weiHex,
          chainId: '0x89',
        }],
      });

      setTxHash(tx);
      setStatus('recording');

      // Record investment
      try {
        const res = await fetch('/api/investments/blockchain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assetId: asset._id,
            units,
            amount,
            txHash: tx,
            fromChain: 137,
            fromToken: 'POL',
            walletAddress: from,
          })
        });
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setTimeout(() => onSuccess(data), 2000);
        } else {
          setStatus('success');
          setError('Payment sent but record failed: ' + (data.error || 'Unknown'));
        }
      } catch(e) {
        setStatus('success');
        setError('Payment sent! Record will sync shortly.');
      }
    } catch (err) {
      setStatus('ready');
      if (err.code === 4001) setError('Transaction rejected.');
      else setError(err.message || 'Payment failed. Try again.');
    }
  }

  const statusMsg = {
    switching: 'Switching to Polygon...',
    connecting: 'Connecting wallet...',
    calculating: 'Calculating POL amount...',
    confirming: 'Confirm in MetaMask...',
    recording: 'Recording investment...',
    success: 'Payment successful!',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 }}>
          ← Back
        </button>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Pay for Investment</div>
      </div>

      {/* Summary */}
      <div style={{ background: 'rgba(240,185,11,0.06)', border: '1px solid rgba(240,185,11,0.15)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Asset</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{asset.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Tokens</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{units} x EUR {asset.tokenPrice}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8, marginTop: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>Total</span>
          <span style={{ color: '#F0B90B', fontWeight: 900 }}>EUR {amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Pay Button */}
      {status === 'success' ? (
        <div style={{ background: '#062015', border: '1px solid #065f46', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
          <div style={{ color: '#0ECB81', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Payment Successful!</div>
          {txHash && (
            <a href={'https://polygonscan.com/tx/' + txHash} target="_blank" rel="noopener noreferrer"
              style={{ color: '#F0B90B', fontSize: 12, textDecoration: 'underline' }}>
              View on PolygonScan
            </a>
          )}
        </div>
      ) : (
        <button onClick={payWithPOL} disabled={status !== 'ready'}
          style={{
            width: '100%', padding: 16, borderRadius: 12, border: 'none', cursor: status === 'ready' ? 'pointer' : 'wait',
            background: status === 'ready' ? '#F0B90B' : '#161B22',
            color: status === 'ready' ? '#000' : '#F0B90B',
            fontWeight: 800, fontSize: 16, fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}>
          {status === 'ready' ? `Pay EUR ${amount.toFixed(2)} with POL` : statusMsg[status] || 'Processing...'}
        </button>
      )}

      {error && (
        <div style={{ marginTop: 12, padding: 10, background: error.includes('sent') ? '#062015' : '#2d0a0a', border: '1px solid ' + (error.includes('sent') ? '#065f46' : '#7f1d1d'), borderRadius: 8, fontSize: 12, color: error.includes('sent') ? '#0ECB81' : '#ef4444', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Info */}
      <div style={{ marginTop: 16, background: '#0F1318', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
          <div style={{ marginBottom: 6 }}><strong style={{ color: 'rgba(255,255,255,0.5)' }}>How it works:</strong></div>
          <div>1. Click Pay — MetaMask opens automatically</div>
          <div>2. Auto-switches to Polygon network</div>
          <div>3. Confirm the transaction in MetaMask</div>
          <div>4. Investment recorded on blockchain</div>
        </div>
      </div>

      <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
        Polygon Network · Non-custodial · KYC required · EU regulated
      </div>
    </div>
  );
}
