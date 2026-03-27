import { useEffect, useState } from 'react';

export default function InvestmentPayment({ asset, units, onSuccess, onBack }) {
  const [LiFiWidget, setLiFiWidget] = useState(null);
  const amount = (asset.tokenPrice || 0) * units;

  useEffect(() => {
    import('@lifi/widget').then(mod => {
      setLiFiWidget(() => mod.LiFiWidget);
    }).catch(e => console.error('LiFi load error:', e));
  }, []);

  const widgetConfig = {
    toChain: 137,
    toToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    toAmount: amount.toString(),
    toAddress: process.env.NEXT_PUBLIC_PAYMENT_RECEIVER || '',
    integrator: 'nextoken-capital',
    appearance: 'dark',
    theme: {
      palette: {
        primary:    { main: '#F0B90B' },
        secondary:  { main: '#F0B90B' },
        background: { default: '#0B0E11', paper: '#0F1318' },
        text:       { primary: '#ffffff', secondary: 'rgba(255,255,255,0.5)' },
      },
      shape: { borderRadius: 12, borderRadiusSecondary: 8 },
    },
    hiddenUI: ['appearance', 'language'],
    chains: {
      allow: [1, 137, 42161, 10, 56, 43114, 8453],
    },
    tokens: {
      allow: [
        { chainId: 1,     address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }, // USDC ETH
        { chainId: 1,     address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' }, // USDT ETH
        { chainId: 1,     address: '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c' }, // EURC ETH
        { chainId: 137,   address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' }, // USDC Polygon
        { chainId: 137,   address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' }, // USDT Polygon
        { chainId: 137,   address: '0x0000000000000000000000000000000000001010' }, // MATIC
        { chainId: 42161, address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8' }, // USDC Arbitrum
        { chainId: 10,    address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607' }, // USDC Optimism
        { chainId: 8453,  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' }, // USDC Base
      ],
    },
    onRouteExecutionCompleted: async (route) => {
      try {
        const lastStep = route.steps[route.steps.length - 1];
        const txHash = lastStep?.execution?.process?.find(p => p.txHash)?.txHash;
        const res = await fetch('/api/investments/blockchain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assetId:       asset._id,
            units,
            amount,
            txHash:        txHash || 'lifi-' + Date.now(),
            fromChain:     route.fromChainId,
            fromToken:     route.fromToken?.symbol,
            walletAddress: route.fromAddress,
          })
        });
        const data = await res.json();
        if (res.ok) onSuccess(data);
        else console.error('Investment record failed:', data.error);
      } catch(e) {
        console.error('Post-payment error:', e);
      }
    },
    onRouteExecutionFailed: (route) => {
      console.error('Payment failed:', route);
    },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 }}>
          ← Back
        </button>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
          Pay for Investment
        </div>
      </div>

      {/* Investment summary */}
      <div style={{ background: 'rgba(240,185,11,0.06)', border: '1px solid rgba(240,185,11,0.15)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Asset</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{asset.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Tokens</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{units} × €{asset.tokenPrice}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8, marginTop: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>Total</span>
          <span style={{ color: '#F0B90B', fontWeight: 900 }}>€{amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Supported chains info */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC', 'Base'].map(chain => (
          <span key={chain} style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: '#888', fontWeight: 600 }}>
            {chain}
          </span>
        ))}
      </div>

      <div style={{ background: '#052e16', border: '1px solid #065f46', borderRadius: 8, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#4ade80' }}>
        ✅ Pay with <strong>any token from any network</strong> — auto-converted to USDC on Polygon
      </div>

      {/* LiFi Widget */}
      {LiFiWidget ? (
        <LiFiWidget config={widgetConfig} />
      ) : (
        <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)', background: '#0F1318', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div>Loading payment widget...</div>
        </div>
      )}

      <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
        🔒 Powered by LI.FI · Non-custodial · KYC required · EU regulated
      </div>
    </div>
  );
}