// components/UniversalInvestment.js
// Supports: POL, USDC, USDT, WETH, WBTC, EURe — any wallet via WalletConnect
'use client';
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS;
const POLYGON_CHAIN_ID = '0x89';

// Polygon Mainnet token addresses
const TOKENS = {
  POL:  { address: null, symbol: 'POL',  name: 'Polygon',  decimals: 18, icon: '💜' },
  EURE: { address: '0x18ec0A6E18E5bc3784fDd3a3669906d2bfc5075d', symbol: 'EURe', name: 'Monerium EUR', decimals: 6, icon: '🇪🇺' },
  USDC: { address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', symbol: 'USDC', name: 'USD Coin',    decimals: 6, icon: '💵' },
  USDT: { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', name: 'Tether',      decimals: 6, icon: '💲' },
  WETH: { address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', symbol: 'WETH', name: 'Wrapped ETH', decimals: 18, icon: '⟠' },
  WBTC: { address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', symbol: 'WBTC', name: 'Wrapped BTC', decimals: 8, icon: '₿' },
};

const CONTRACT_ABI = [
  'function investWithPOL(uint256 assetId) payable',
  'function investWithToken(uint256 assetId, address token, uint256 amount)',
  'function investWithEURe(uint256 assetId, uint256 amount)',
  'function getAsset(uint256 id) view returns (tuple(string name, address issuerWallet, string issuerIBAN, uint256 commissionBps, uint256 targetAmountEUR, uint256 totalRaisedEUR, uint256 totalCommissionEUR, uint256 totalInvestors, uint256 tokenSupply, uint256 tokensSold, uint256 pricePerTokenEUR, uint256 minInvestmentEUR, uint256 deadline, bool active, bool exists))',
  'function getFundraisingProgressBps(uint256 id) view returns (uint256)',
  'function getTokenSaleProgressBps(uint256 id) view returns (uint256)',
  'function getInvestorTokens(uint256 id, address investor) view returns (uint256)',
  'event InvestmentProcessed(uint256 indexed assetId, address indexed investor, address tokenPaid, uint256 amountPaid, uint256 eureTotal, uint256 issuerReceived, uint256 commissionTaken, uint256 tokensBought, uint256 timestamp)',
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
];

export default function UniversalInvestment({ assetId }) {
  const [selectedToken, setSelectedToken] = useState('POL');
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState(null);
  const [progress, setProgress] = useState(0);
  const [tokenProgress, setTokenProgress] = useState(0);
  const [myTokens, setMyTokens] = useState(0);
  const [walletBalances, setWalletBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');

  // ─── CONNECT WALLET ─────────────────────────────────

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask, Coinbase Wallet, or any Web3 wallet');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setConnected(true);

      // Switch to Polygon
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: POLYGON_CHAIN_ID }],
        });
      } catch (switchErr) {
        if (switchErr.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: POLYGON_CHAIN_ID,
              chainName: 'Polygon Mainnet',
              nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
              rpcUrls: ['https://polygon-rpc.com'],
              blockExplorerUrls: ['https://polygonscan.com'],
            }],
          });
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── FETCH ASSET DATA ───────────────────────────────

  const fetchAssetData = useCallback(async () => {
    try {
      const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const a = await contract.getAsset(assetId);
      const progressBps = await contract.getFundraisingProgressBps(assetId);
      const tokenBps = await contract.getTokenSaleProgressBps(assetId);

      setAsset({
        name: a.name,
        commissionBps: Number(a.commissionBps),
        targetAmountEUR: Number(a.targetAmountEUR) / 1e6,
        totalRaisedEUR: Number(a.totalRaisedEUR) / 1e6,
        totalInvestors: Number(a.totalInvestors),
        tokenSupply: Number(a.tokenSupply),
        tokensSold: Number(a.tokensSold),
        pricePerTokenEUR: Number(a.pricePerTokenEUR) / 1e6,
        minInvestmentEUR: Number(a.minInvestmentEUR) / 1e6,
        active: a.active,
      });

      setProgress(Number(progressBps) / 100);
      setTokenProgress(Number(tokenBps) / 100);

      // Fetch investor's tokens if connected
      if (account) {
        const tokens = await contract.getInvestorTokens(assetId, account);
        setMyTokens(Number(tokens));
      }
    } catch (e) {
      console.error('Fetch error:', e);
    }
  }, [assetId, account]);

  useEffect(() => {
    fetchAssetData();
    const interval = setInterval(fetchAssetData, 10000);
    return () => clearInterval(interval);
  }, [fetchAssetData]);

  // ─── FETCH WALLET BALANCES ──────────────────────────

  useEffect(() => {
    if (!connected || !account) return;
    fetchBalances();
  }, [connected, account]);

  const fetchBalances = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balances = {};

      // Native POL balance
      const polBal = await provider.getBalance(account);
      balances.POL = parseFloat(ethers.formatEther(polBal));

      // ERC-20 balances
      for (const [key, token] of Object.entries(TOKENS)) {
        if (token.address) {
          const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
          const bal = await contract.balanceOf(account);
          balances[key] = parseFloat(ethers.formatUnits(bal, token.decimals));
        }
      }

      setWalletBalances(balances);
    } catch (e) {
      console.error('Balance fetch error:', e);
    }
  };

  // ─── INVEST ─────────────────────────────────────────

  const handleInvest = async () => {
    setError('');
    setTxHash('');
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tokenInfo = TOKENS[selectedToken];
      const parsedAmount = selectedToken === 'POL'
        ? ethers.parseEther(amount)
        : ethers.parseUnits(amount, tokenInfo.decimals);

      let tx;

      if (selectedToken === 'POL') {
        // ── Pay with native POL ──
        tx = await contract.investWithPOL(assetId, { value: parsedAmount });

      } else if (selectedToken === 'EURE') {
        // ── Pay with EURe (cheapest — no swap) ──
        // Check & approve
        await ensureApproval(tokenInfo.address, parsedAmount, signer);
        tx = await contract.investWithEURe(assetId, parsedAmount);

      } else {
        // ── Pay with any other token (auto-swaps to EURe) ──
        await ensureApproval(tokenInfo.address, parsedAmount, signer);
        tx = await contract.investWithToken(assetId, tokenInfo.address, parsedAmount);
      }

      setTxHash(tx.hash);
      await tx.wait();
      await fetchAssetData();
      await fetchBalances();
      setAmount('');

    } catch (err) {
      setError(err.reason || err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const ensureApproval = async (tokenAddress, amount, signer) => {
    setApproving(true);
    try {
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const allowance = await token.allowance(account, CONTRACT_ADDRESS);

      if (allowance < amount) {
        const approveTx = await token.approve(CONTRACT_ADDRESS, ethers.MaxUint256);
        await approveTx.wait();
      }
    } finally {
      setApproving(false);
    }
  };

  // ─── RENDER ─────────────────────────────────────────

  if (!asset) {
    return (
      <div className="bg-[#0d0e12] border border-[#d4af37]/20 rounded-2xl p-8 max-w-lg animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2"></div>
      </div>
    );
  }

  const tokenInfo = TOKENS[selectedToken];
  const balance = walletBalances[selectedToken] || 0;

  return (
    <div className="bg-[#0d0e12] border border-[#d4af37]/20 rounded-2xl p-6 max-w-lg">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{asset.name}</h3>
          <p className="text-gray-500 text-sm">€{asset.pricePerTokenEUR} per token</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          asset.active ? 'bg-green-900/30 text-green-400 border border-green-700' 
                       : 'bg-red-900/30 text-red-400 border border-red-700'
        }`}>
          {asset.active ? '● Live' : '● Closed'}
        </div>
      </div>

      {/* Fundraising Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Fundraising</span>
          <span className="text-[#d4af37] font-bold">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-[#d4af37] to-[#f0d060] h-2.5 rounded-full transition-all" 
               style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>€{asset.totalRaisedEUR.toLocaleString()} raised</span>
          <span>Target: €{asset.targetAmountEUR.toLocaleString()}</span>
        </div>
      </div>

      {/* Token Sale Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Tokens Sold</span>
          <span className="text-white font-bold">{asset.tokensSold.toLocaleString()} / {asset.tokenSupply.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2.5 rounded-full transition-all"
               style={{ width: `${Math.min(tokenProgress, 100)}%` }} />
        </div>
      </div>

      {/* Connect Wallet */}
      {!connected ? (
        <button
          onClick={connectWallet}
          className="w-full py-4 rounded-xl font-bold text-black bg-[#d4af37] hover:bg-[#c9a432] transition-all text-lg"
        >
          🔗 Connect Wallet to Invest
        </button>
      ) : (
        <>
          {/* Token Selector */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Pay With</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(TOKENS).map(([key, token]) => (
                <button
                  key={key}
                  onClick={() => setSelectedToken(key)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedToken === key
                      ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                      : 'border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="text-lg">{token.icon}</div>
                  <div className="text-xs font-bold mt-1">{token.symbol}</div>
                  {walletBalances[key] !== undefined && (
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {walletBalances[key]?.toFixed(2)}
                    </div>
                  )}
                </button>
              ))}
            </div>
            {selectedToken === 'EURE' && (
              <div className="mt-2 px-3 py-2 bg-green-900/20 border border-green-800 rounded-lg text-xs text-green-400">
                ✨ Cheapest option — no swap fee. Only 0.25% platform commission.
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Amount ({tokenInfo.symbol})</span>
              <button
                onClick={() => setAmount(balance.toString())}
                className="text-[#d4af37] text-xs hover:underline"
              >
                Max: {balance.toFixed(4)} {tokenInfo.symbol}
              </button>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter ${tokenInfo.symbol} amount`}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3.5 text-white text-lg focus:border-[#d4af37] outline-none transition-colors"
            />
          </div>

          {/* Transaction Preview */}
          {parseFloat(amount) > 0 && (
            <div className="bg-gray-900/60 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>You Pay</span>
                <span className="text-white font-bold">{amount} {tokenInfo.symbol}</span>
              </div>
              {selectedToken !== 'EURE' && (
                <div className="flex justify-between text-gray-400">
                  <span>Auto-Swap to EURe</span>
                  <span className="text-yellow-400">~0.1-0.3% slippage</span>
                </div>
              )}
              <div className="border-t border-gray-700 my-1"></div>
              <div className="flex justify-between text-gray-400">
                <span>Platform Fee</span>
                <span className="text-yellow-400">{(asset.commissionBps / 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Issuer Receives</span>
                <span className="text-green-400">EUR (direct to bank)</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Settlement</span>
                <span className="text-white">Instant (same transaction)</span>
              </div>
            </div>
          )}

          {/* Invest Button */}
          <button
            onClick={handleInvest}
            disabled={loading || approving || !asset.active || !parseFloat(amount)}
            className="w-full py-4 rounded-xl font-bold text-black bg-[#d4af37] hover:bg-[#c9a432] 
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all text-lg"
          >
            {approving ? '⏳ Approving Token...' :
             loading ? '⏳ Processing Investment...' :
             `Invest with ${tokenInfo.symbol}`}
          </button>

          {/* Success */}
          {txHash && (
            <div className="mt-4 p-4 bg-green-900/20 border border-green-700 rounded-xl">
              <p className="text-green-400 font-bold text-sm">✅ Investment Successful!</p>
              <p className="text-gray-400 text-xs mt-1">
                Issuer received EUR • Commission deducted • Tokens credited
              </p>
              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank" rel="noopener noreferrer"
                className="text-[#d4af37] text-xs underline mt-2 inline-block"
              >
                View on PolygonScan →
              </a>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-xl text-sm text-red-400">
              {error}
            </div>
          )}

          {/* My Holdings */}
          {myTokens > 0 && (
            <div className="mt-4 p-4 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-xl">
              <div className="text-xs text-gray-400">Your Holdings</div>
              <div className="text-2xl font-bold text-[#d4af37]">{myTokens.toLocaleString()} tokens</div>
              <div className="text-xs text-gray-500">
                ≈ €{(myTokens * asset.pricePerTokenEUR).toLocaleString()}
              </div>
            </div>
          )}

          {/* Stats Footer */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-gray-900/50 rounded-xl p-3 text-center">
              <div className="text-[#d4af37] font-bold">{asset.totalInvestors}</div>
              <div className="text-gray-600 text-xs">Investors</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3 text-center">
              <div className="text-white font-bold">{(asset.commissionBps / 100).toFixed(2)}%</div>
              <div className="text-gray-600 text-xs">Fee</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3 text-center">
              <div className="text-white font-bold">€{asset.minInvestmentEUR}</div>
              <div className="text-gray-600 text-xs">Min Invest</div>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="mt-4 text-center text-xs text-gray-600">
            Connected: {account.slice(0, 6)}...{account.slice(-4)} · Polygon Mainnet
          </div>
        </>
      )}
    </div>
  );
}
