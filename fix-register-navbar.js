const fs = require("fs");

let code = fs.readFileSync("pages/register.js", "utf8");

// Remove the entire inline nav from register page
code = code.replace(
  `      {/* NAVBAR */}
      <nav style={S.nav}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
          <span style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:900, color:"#F0B90B", letterSpacing:2 }}>NXT</span>
          <div style={{ width:1, height:22, background:"rgba(240,185,11,0.25)" }} />
          <div>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:12.5, fontWeight:800, letterSpacing:"0.2em", color:"#F0B90B" }}>NEXTOKEN</div>
            <div style={{ fontSize:8.5, letterSpacing:"0.2em", color:"#8a9bb8", textTransform:"uppercase" }}>CAPITAL</div>
          </div>
        </Link>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:13, color:"#8a9bb8" }}>{mode==="login"?"Need an account?":"Already registered?"}</span>
          <button onClick={() => { setMode(mode==="login"?"register":"login"); setErrors({}); reset(); }}
            style={{ padding:"7px 18px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#b0b0c8", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            {mode==="login" ? "Sign Up" : "Log In"}
          </button>
        </div>
      </nav>`,
  ``
);

// Also remove nav from S styles to clean up
fs.writeFileSync("pages/register.js", code, "utf8");
console.log("Done! Inline navbar removed from register page");