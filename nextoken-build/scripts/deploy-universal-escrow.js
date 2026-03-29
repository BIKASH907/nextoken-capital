// scripts/deploy-universal-escrow.js
// Deploy NextokenUniversalEscrow to Polygon Mainnet
//
// npx hardhat run scripts/deploy-universal-escrow.js --network polygon
//
// .env:
//   PRIVATE_KEY=your_deployer_wallet_key
//   POLYGON_RPC=https://polygon-rpc.com
//   TREASURY_WALLET=0xYourNextokenTreasuryWallet
//   TREASURY_IBAN=LTxxxxxxxxxxxxxxxxxxxx
//   POLYGONSCAN_API_KEY=your_key

const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with:', deployer.address);
  console.log('Balance:', hre.ethers.formatEther(
    await hre.ethers.provider.getBalance(deployer.address)
  ), 'POL\n');

  // ─── CONFIG ───
  const TREASURY = process.env.TREASURY_WALLET;
  const TREASURY_IBAN = process.env.TREASURY_IBAN || '';
  const COMMISSION = 25; // 0.25%

  if (!TREASURY) throw new Error('Set TREASURY_WALLET in .env');

  // ─── DEPLOY ───
  console.log('Deploying NextokenUniversalEscrow...');
  console.log('Treasury:', TREASURY);
  console.log('IBAN:', TREASURY_IBAN || '(not set)');
  console.log('Commission:', COMMISSION, 'bps (0.25%)\n');

  const Escrow = await hre.ethers.getContractFactory('NextokenUniversalEscrow');
  const escrow = await Escrow.deploy(TREASURY, TREASURY_IBAN, COMMISSION);
  await escrow.waitForDeployment();
  const address = await escrow.getAddress();

  console.log('✅ Deployed to:', address, '\n');

  // ─── REGISTER ASSETS ───
  // EURe has 6 decimals. So €100 = 100000000 (100 * 1e6)
  const eure = (amount) => BigInt(amount) * BigInt(1e6);

  console.log('Registering assets...\n');

  // Asset 0: Baltic Green Bond 2027
  const tx1 = await escrow.registerAsset(
    'Baltic Green Bond 2027',
    '0x0000000000000000000000000000000000000001', // REPLACE: issuer wallet
    'LTxxxxxxxxxxxxxxxxxx',                       // REPLACE: issuer IBAN
    25,                                            // 0.25%
    eure(500000),                                  // Target: €500,000
    10000,                                         // 10,000 tokens
    eure(50),                                      // €50 per token
    eure(100),                                     // Min invest: €100
    0                                              // No deadline
  );
  await tx1.wait();
  console.log('✅ Asset 0: Baltic Green Bond 2027');

  // Asset 1: Vilnius Office Complex
  const tx2 = await escrow.registerAsset(
    'Vilnius Office Complex',
    '0x0000000000000000000000000000000000000002', // REPLACE: issuer wallet
    'LTxxxxxxxxxxxxxxxxxx',                       // REPLACE: issuer IBAN
    25,
    eure(2000000),                                 // Target: €2,000,000
    20000,                                         // 20,000 tokens
    eure(100),                                     // €100 per token
    eure(100),                                     // Min invest: €100
    0
  );
  await tx2.wait();
  console.log('✅ Asset 1: Vilnius Office Complex\n');

  // ─── VERIFY ───
  console.log('Verifying on PolygonScan...');
  try {
    await hre.run('verify:verify', {
      address,
      constructorArguments: [TREASURY, TREASURY_IBAN, COMMISSION],
    });
    console.log('✅ Verified\n');
  } catch (e) {
    console.log('Verification skipped:', e.message, '\n');
  }

  // ─── SUMMARY ───
  console.log('════════════════════════════════════════════');
  console.log('  NEXTOKEN UNIVERSAL ESCROW — DEPLOYED');
  console.log('════════════════════════════════════════════');
  console.log('');
  console.log('Contract:     ', address);
  console.log('Treasury:     ', TREASURY);
  console.log('Commission:    0.25%');
  console.log('Assets:        2 registered');
  console.log('');
  console.log('SUPPORTED PAYMENT TOKENS:');
  console.log('  POL   (native)  — auto-swap → EURe');
  console.log('  USDC  (Polygon) — auto-swap → EURe');
  console.log('  USDT  (Polygon) — auto-swap → EURe');
  console.log('  WETH  (Polygon) — auto-swap → EURe');
  console.log('  WBTC  (Polygon) — auto-swap → EURe');
  console.log('  EURe  (Monerium) — direct (no swap, cheapest)');
  console.log('');
  console.log('MONEY FLOW:');
  console.log('  Investor pays ANY token');
  console.log('  → Auto-swaps to EURe on QuickSwap');
  console.log('  → Splits: 99.75% issuer + 0.25% Nextoken');
  console.log('  → Issuer redeems EURe → EUR in bank (FREE)');
  console.log('  → Nextoken redeems EURe → EUR in bank (FREE)');
  console.log('');
  console.log('TOTAL COST: ~0.45%');
  console.log('');
  console.log('NEXT STEPS:');
  console.log(`1. Add to .env.local: NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=${address}`);
  console.log(`2. Add to .env.local: ESCROW_CONTRACT_ADDRESS=${address}`);
  console.log('3. Update issuer wallets with real addresses');
  console.log('4. Setup Monerium accounts for treasury + issuers');
  console.log('5. Link IBANs in Monerium for auto EUR redemption');
  console.log('════════════════════════════════════════════');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
