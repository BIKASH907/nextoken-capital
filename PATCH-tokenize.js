// PATCH-tokenize.js
// ============================================================================
// HOW TO ADD MONERIUM BANK CONNECTION TO YOUR EXISTING pages/tokenize.js
// ============================================================================
//
// This is NOT a full file replacement. Follow these 3 steps to patch your
// existing tokenize.js page.
//
// ─── STEP 1: Add import at the top of tokenize.js ──────────────────────────
//
// Add this line near the other imports:

import MoneriumConnect from "../components/MoneriumConnect";

// ─── STEP 2: Add state variables inside the component function ──────────────
//
// Near the top of your component function (where useState hooks are), add:

const [walletAddress, setWalletAddress] = useState("");
const [iban, setIban] = useState(null);

// And add a useEffect to detect wallet:

useEffect(() => {
  if (typeof window !== "undefined" && window.ethereum) {
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts[0]) setWalletAddress(accounts[0]);
    }).catch(() => {});
  }
}, []);

const connectWallet = async () => {
  if (!window.ethereum) return;
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setWalletAddress(accounts[0] || "");
  } catch (e) {
    console.error(e);
  }
};

// ─── STEP 3: Add the MoneriumConnect component in the JSX ───────────────────
//
// Find the issuer form section in your tokenize.js page.
// After the "Required Documents" or "Issuance Summary" section,
// and BEFORE the submit button, add this block:

/*
  {session && (
    <div style={{ marginTop: 24, marginBottom: 24 }}>
      <MoneriumConnect
        walletAddress={walletAddress}
        onIBANReceived={(ibanData) => setIban(ibanData)}
      />
    </div>
  )}
*/

// If you also want a wallet connect button, add this near the top of the form:
/*
  {!walletAddress ? (
    <button type="button" onClick={connectWallet} style={{
      padding: "12px 20px", borderRadius: 8, border: "1px solid rgba(240,185,11,0.3)",
      background: "rgba(240,185,11,0.08)", color: "#F0B90B", fontSize: 13,
      fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 16,
    }}>
      Connect MetaMask Wallet
    </button>
  ) : (
    <div style={{
      background: "#161b22", borderRadius: 8, padding: "10px 14px",
      border: "1px solid rgba(255,255,255,0.06)", fontSize: 12, marginBottom: 16,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
      <span style={{ fontFamily: "monospace", color: "#F0B90B" }}>
        {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
      </span>
    </div>
  )}
*/

// ─── STEP 4: Include IBAN in form submission ────────────────────────────────
//
// When submitting the tokenize form to your API, include:
//   walletAddress,
//   iban: iban?.iban || null,
// in the request body so the issuer's payout info is saved with the asset.

// ─── THAT'S IT ──────────────────────────────────────────────────────────────
// The MoneriumConnect component handles the full 3-step flow:
//   1. OAuth with Monerium (redirect flow)
//   2. Link wallet (MetaMask signature)
//   3. Request IBAN (auto-provisions a personal IBAN on Polygon)
//
// Investors can then send EUR via SEPA → auto-minted as EURe on Polygon.
// Issuer can send EURe back → auto-converted to EUR via SEPA to any bank.
