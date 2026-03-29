// components/MoneriumConnect.js
// Bank connection widget — OAuth + Link Wallet + IBAN
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const API_BASE = MONERIUM_ENV === "production" ? "https://api.monerium.app" : "https://api.monerium.dev";

export default function MoneriumConnect({ walletAddress, onIBANReceived }) {
  const { data: session } = useSession();
  const [status, setStatus] = useState("loading");
  const [ibans, setIbans] = useState([]);
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState("");
  const [linking, setLinking] = useState(false);
  const [requestingIBAN, setRequestingIBAN] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/monerium");
      const data = await res.json();
      if (data.connected) {
        setIbans(data.ibans || []);
        setBalances(data.balances || []);
        setStatus(data.ibans?.length > 0 ? "has_iban" : "connected");
        if (data.ibans?.length > 0 && onIBANReceived) onIBANReceived(data.ibans[0]);
      } else {
        setStatus("disconnected");
      }
    } catch { setStatus("disconnected"); }
  }, [onIBANReceived]);

  useEffect(() => { if (session) checkStatus(); }, [session, checkStatus]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("monerium") === "success") {
      checkStatus();
      window.history.replaceState({}, "", window.location.pathname);
    } else if (params.get("monerium") === "error") {
      setError(params.get("reason") || "Connection failed");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [checkStatus]);

  const connectMonerium = () => {
    const clientId = process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URI ||
      `${window.location.origin}/api/monerium/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      state: "nextoken_issuer",
    });
    window.location.href = `${API_BASE}/auth?${params.toString()}`;
  };

  const linkWallet = async () => {
    if (!walletAddress) { setError("Connect MetaMask first"); return; }
    setLinking(true); setError("");
    try {
      const message = "I hereby declare that I am the address owner.";
      const signature = await window.ethereum.request({
        method: "personal_sign", params: [message, walletAddress],
      });
      const res = await fetch("/api/monerium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "link_address", address: walletAddress, message, signature, chain: "polygon" }),
      });
      const data = await res.json();
      if (data.success) await checkStatus();
      else setError(data.error || "Failed to link wallet");
    } catch (err) { setError(err.message); }
    setLinking(false);
  };

  const doRequestIBAN = async () => {
    if (!walletAddress) { setError("Connect wallet first"); return; }
    setRequestingIBAN(true); setError("");
    try {
      const res = await fetch("/api/monerium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_iban", address: walletAddress, chain: "polygon" }),
      });
      const data = await res.json();
      if (data.success) await checkStatus();
      else setError(data.error || "Failed to request IBAN");
    } catch (err) { setError(err.message); }
    setRequestingIBAN(false);
  };

  const card = { background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:24, marginBottom:24 };
  const badgeStyle = (c) => ({ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:`${c}15`, color:c, border:`1px solid ${c}30` });
  const btnStyle = (bg, fg, off) => ({ padding:"12px 24px", borderRadius:8, border:"none", background:off?"#1e242c":bg, color:off?"rgba(255,255,255,0.3)":fg, fontSize:14, fontWeight:700, cursor:off?"not-allowed":"pointer", fontFamily:"inherit", width:"100%", transition:"all 0.2s" });

  if (!session) return null;

  return (
    <div style={card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>🏦 Bank Account Connection</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>Powered by Monerium · EU Licensed EMI · SEPA + EURe on Polygon</div>
        </div>
        <div style={badgeStyle(status==="has_iban"?"#22c55e":status==="connected"?"#3b82f6":"#6b7280")}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:status==="has_iban"?"#22c55e":status==="connected"?"#3b82f6":"#6b7280" }} />
          {status==="has_iban"?"IBAN Active":status==="connected"?"Connected":status==="loading"?"Checking...":"Not Connected"}
        </div>
      </div>

      {error && (
        <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#ef4444", marginBottom:16 }}>
          {error} <span onClick={() => setError("")} style={{ float:"right", cursor:"pointer", opacity:0.6 }}>x</span>
        </div>
      )}

      {status === "disconnected" && (
        <div>
          <div style={{ background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:10, padding:16, marginBottom:16, fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.7 }}>
            <strong style={{ color:"#3b82f6" }}>How it works:</strong> Connect your Monerium account to get a personal <strong style={{ color:"#fff" }}>IBAN</strong> linked to your Polygon wallet. Investors send EUR via SEPA — automatically converted to <strong style={{ color:"#F0B90B" }}>EURe</strong> tokens on Polygon.
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12, marginBottom:20 }}>
            {[{i:"🔗",t:"1. Connect",d:"Authorize Monerium"},{i:"👛",t:"2. Link Wallet",d:"Sign to verify"},{i:"🏦",t:"3. Get IBAN",d:"Personal IBAN"}].map((s,j) => (
              <div key={j} style={{ background:"#0d1117", borderRadius:8, padding:"14px 12px", textAlign:"center", border:"1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{s.i}</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{s.t}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{s.d}</div>
              </div>
            ))}
          </div>
          <button onClick={connectMonerium} style={btnStyle("#3b82f6","#fff",false)}>Connect Monerium Account</button>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", textAlign:"center", marginTop:10 }}>
            Monerium is a licensed EU Electronic Money Institution. Funds protected under EU e-money regulations.
          </div>
        </div>
      )}

      {status === "connected" && (
        <div>
          <div style={{ background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:10, padding:14, marginBottom:16, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            Monerium connected. Link your wallet and request an IBAN.
          </div>
          {walletAddress ? (
            <div>
              <div style={{ background:"#0d1117", borderRadius:8, padding:"12px 16px", marginBottom:16, border:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(240,185,11,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>W</div>
                <div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Polygon Wallet</div>
                  <div style={{ fontSize:13, fontFamily:"monospace", color:"#F0B90B" }}>{walletAddress.slice(0,8)}...{walletAddress.slice(-6)}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <button onClick={linkWallet} disabled={linking} style={btnStyle("#8b5cf6","#fff",linking)}>{linking?"Signing...":"1. Link Wallet"}</button>
                <button onClick={doRequestIBAN} disabled={requestingIBAN} style={btnStyle("#F0B90B","#000",requestingIBAN)}>{requestingIBAN?"Requesting...":"2. Request IBAN"}</button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:20, color:"rgba(255,255,255,0.4)", fontSize:13 }}>Connect MetaMask first.</div>
          )}
        </div>
      )}

      {status === "has_iban" && (
        <div>
          {ibans.map((ib,i) => (
            <div key={i} style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Your Personal IBAN</div>
              <div style={{ background:"rgba(240,185,11,0.06)", border:"1px solid rgba(240,185,11,0.2)", borderRadius:10, padding:"16px 20px", fontFamily:"monospace", fontSize:16, fontWeight:700, color:"#F0B90B", letterSpacing:"1.5px", textAlign:"center" }}>
                {ib.iban || ib}
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:6, textAlign:"center" }}>EUR sent here becomes EURe on Polygon automatically</div>
            </div>
          ))}
          {balances.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:10, marginBottom:16 }}>
              {balances.map((b,i) => (
                <div key={i} style={{ background:"#0d1117", borderRadius:8, padding:"12px 16px", border:"1px solid rgba(255,255,255,0.04)", textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:800, color:"#22c55e" }}>{parseFloat(b.amount||0).toLocaleString()} EUR</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>EURe Balance</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:10, padding:14, fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
            <strong style={{ color:"#22c55e" }}>Bank active.</strong> Investors pay via SEPA to your IBAN. Funds auto-tokenized as EURe on Polygon. Send EURe back to convert to EUR via SEPA.
          </div>
        </div>
      )}

      {status === "loading" && (
        <div style={{ textAlign:"center", padding:30, color:"rgba(255,255,255,0.3)", fontSize:13 }}>Checking Monerium connection...</div>
      )}
    </div>
  );
}
