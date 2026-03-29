# Nextoken Capital — Monerium + Escrow + Issuer Dashboard Setup Guide

## What's Included

| File | Path in your project | Purpose |
|---|---|---|
| `lib/monerium.js` | `lib/monerium.js` | Monerium SDK wrapper (OAuth, IBAN, orders) |
| `components/MoneriumConnect.js` | `components/MoneriumConnect.js` | Bank connection UI (3-step flow) |
| `pages/api/monerium/callback.js` | `pages/api/monerium/callback.js` | OAuth redirect handler |
| `pages/api/monerium/index.js` | `pages/api/monerium/index.js` | Status/IBANs/balances + link/request actions |
| `pages/api/issuer/dashboard.js` | `pages/api/issuer/dashboard.js` | Issuer data API (stats, assets, investors) |
| `pages/dashboard/issuer.js` | `pages/dashboard/issuer.js` | Full redesigned issuer dashboard (6 tabs) |
| `PATCH-tokenize.js` | READ THIS, don't copy | Instructions to patch your existing tokenize.js |

---

## Step 1: Copy Files

```bash
cd "D:/New folder/nextoken-capital"

# Copy all files to correct locations (don't overwrite existing files without checking)
cp lib/monerium.js lib/monerium.js.bak 2>/dev/null  # backup if exists
# Then copy the new files from your downloads into the matching paths above
```

Copy each downloaded file to its matching path in your project.

---

## Step 2: Install Monerium SDK (optional, not required)

The implementation uses direct API calls via fetch, so no npm package is needed.
If you want the SDK for future use:

```bash
npm install @monerium/sdk
```

---

## Step 3: Add MongoDB Schema Fields

Your User model needs a `monerium` field. Open `lib/models/User.js` (or wherever your User schema is) and add:

```javascript
// Add inside the User schema definition:
monerium: {
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
  profileId: String,
  connectedAt: Date,
  iban: String,
  ibanAddress: String,
  ibanChain: String,
},
```

MongoDB is schemaless, so existing documents won't break — new fields are just added when set.

---

## Step 4: Set Up Monerium Account

### Sandbox (test first):
1. Go to https://sandbox.monerium.dev
2. Sign up for a developer account
3. Go to Developer Portal → Create New App
4. Select "Authorization Code Flow" as the auth type
5. Set redirect URI: `https://nextokencapital.com/api/monerium/callback`
6. Copy Client ID and Client Secret

### Add to .env.local:

```env
# Monerium
NEXT_PUBLIC_MONERIUM_CLIENT_ID=your_client_id_here
MONERIUM_CLIENT_SECRET=your_secret_here
NEXT_PUBLIC_MONERIUM_REDIRECT_URI=https://nextokencapital.com/api/monerium/callback
NEXT_PUBLIC_MONERIUM_ENV=sandbox
```

### Also add to Vercel:
```bash
vercel env add NEXT_PUBLIC_MONERIUM_CLIENT_ID
vercel env add MONERIUM_CLIENT_SECRET
vercel env add NEXT_PUBLIC_MONERIUM_REDIRECT_URI
vercel env add NEXT_PUBLIC_MONERIUM_ENV
```

---

## Step 5: Patch tokenize.js

Open `pages/tokenize.js` in VS Code and follow the instructions in `PATCH-tokenize.js`:

1. Add the MoneriumConnect import
2. Add walletAddress and iban state
3. Add the MoneriumConnect component in the form section
4. Include wallet/IBAN data in form submission

---

## Step 6: Deploy Smart Contract

Make sure your Hardhat setup is ready:

```bash
cd "D:/New folder/nextoken-capital"

# Verify hardhat config
cat hardhat.config.cjs

# Compile
npx hardhat compile --config hardhat.config.cjs

# Deploy to Polygon (needs ~5 POL for gas)
npx hardhat run scripts/deploy-escrow.js --network polygon --config hardhat.config.cjs
```

After deployment, add the contract address:

```bash
# Add to .env.local
echo "ESCROW_CONTRACT_ADDRESS=0x...your_deployed_address" >> .env.local
echo "NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...your_deployed_address" >> .env.local
```

Also add to Vercel:
```bash
vercel env add ESCROW_CONTRACT_ADDRESS
vercel env add NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS
```

---

## Step 7: Deploy to Vercel

```bash
cd "D:/New folder/nextoken-capital"
git add -A
git commit -m "feat: Monerium bank connection, redesigned issuer dashboard, escrow integration"
git push origin main
npx vercel --prod
```

---

## Step 8: Test the Flow

### Issuer Flow:
1. Register as issuer on https://nextokencapital.com/register
2. Login → Go to `/dashboard/issuer`
3. "Bank & Wallet" tab → Connect MetaMask → Connect Monerium → Link Wallet → Request IBAN
4. "Create Asset" tab → Fill form → Submit

### Monerium Flow:
1. Issuer clicks "Connect Monerium Account"
2. Redirected to Monerium OAuth (sandbox.monerium.dev)
3. Signs up / logs in on Monerium
4. Authorizes Nextoken Capital
5. Redirected back to `/tokenize?monerium=success`
6. Clicks "Link Wallet" → MetaMask signature
7. Clicks "Request IBAN" → Personal IBAN provisioned
8. IBAN displayed in the component

### Investment Flow:
1. Investor sends EUR via SEPA to the issuer's Monerium IBAN
2. EUR is automatically minted as EURe tokens on Polygon
3. EURe appears in the issuer's wallet
4. Issuer can hold EURe or send it back to any bank (SEPA off-ramp)

---

## Step 9: Go to Production

When sandbox testing is done:

1. Register at https://monerium.app (production)
2. Create production app → get production Client ID/Secret
3. Update `.env.local`:
   ```
   NEXT_PUBLIC_MONERIUM_ENV=production
   NEXT_PUBLIC_MONERIUM_CLIENT_ID=production_client_id
   MONERIUM_CLIENT_SECRET=production_secret
   ```
4. Update Vercel env vars
5. Redeploy: `npx vercel --prod`

---

## Architecture Summary

```
INVESTOR                    SMART CONTRACT               ISSUER
   │                              │                         │
   │──── POL payment ────────────>│                         │
   │                              │── 99.75% ──────────────>│ (Polygon wallet)
   │                              │── 0.25% ───> Treasury   │
   │                              │                         │
   │                              │         Monerium        │
   │                              │            │            │
   │                    EUR via SEPA ──> IBAN ──> EURe ─────>│ (Polygon wallet)
   │                              │            │            │
   │                              │     EURe ──> IBAN ──> EUR to bank
```

Two payment paths:
1. **Crypto**: POL → Escrow Contract → auto-split → Issuer wallet + Treasury
2. **Fiat**: EUR → SEPA → Monerium IBAN → EURe on Polygon → Issuer wallet

Both end up on Polygon. The escrow contract handles crypto splits.
Monerium handles fiat on/off-ramp.
