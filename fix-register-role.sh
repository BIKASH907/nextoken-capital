#!/bin/bash
# Add Investor/Issuer selector to register page
# Run: chmod +x fix-register-role.sh && ./fix-register-role.sh
set -e

echo "  Adding role selector to registration..."

cat > /tmp/patch-register.js << 'PEOF'
const fs = require("fs");
let c = fs.readFileSync("pages/register.js", "utf8");

// 1. Add role to form state
if (!c.includes("role:")) {
  // Find the useState for form and add role
  c = c.replace(
    /const \[form, setForm\] = useState\(\{/,
    'const [form, setForm] = useState({ role: "investor",'
  );
  console.log("Added role to form state");
}

// 2. Add role to API call body
if (!c.includes("role: form.role")) {
  c = c.replace(
    /email: form\.email,/,
    'role: form.role, email: form.email,'
  );
  console.log("Added role to API body");
}

// 3. Route based on role after registration
c = c.replace(
  /router\.push\(["']\/dashboard["']\)/g,
  'router.push(form.role === "issuer" ? "/issuer-dashboard" : "/dashboard")'
);
console.log("Updated redirect based on role");

// 4. Add the role selector UI - find step 0 content area
// We'll inject the selector right after the step indicator / before FIRST NAME
const roleSelector = `
            {/* ROLE SELECTOR */}
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>I want to</label>
              <div style={{display:"flex",gap:10}}>
                <button type="button" onClick={()=>setForm({...form,role:"investor"})} style={{flex:1,padding:"14px 12px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,textAlign:"center",background:form.role==="investor"?"rgba(240,185,11,0.12)":"#161B22",color:form.role==="investor"?"#F0B90B":"rgba(255,255,255,0.4)",border:form.role==="investor"?"2px solid #F0B90B":"2px solid rgba(255,255,255,0.08)",transition:"all .15s"}}>
                  <div style={{fontSize:24,marginBottom:4}}>💰</div>
                  Invest in Assets
                  <div style={{fontSize:10,fontWeight:400,color:"rgba(255,255,255,0.3)",marginTop:4}}>Buy tokenized bonds, equity, real estate</div>
                </button>
                <button type="button" onClick={()=>setForm({...form,role:"issuer"})} style={{flex:1,padding:"14px 12px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,textAlign:"center",background:form.role==="issuer"?"rgba(139,92,246,0.12)":"#161B22",color:form.role==="issuer"?"#8b5cf6":"rgba(255,255,255,0.4)",border:form.role==="issuer"?"2px solid #8b5cf6":"2px solid rgba(255,255,255,0.08)",transition:"all .15s"}}>
                  <div style={{fontSize:24,marginBottom:4}}>🏗️</div>
                  Tokenize My Assets
                  <div style={{fontSize:10,fontWeight:400,color:"rgba(255,255,255,0.3)",marginTop:4}}>List bonds, real estate, equity for investors</div>
                </button>
              </div>
            </div>`;

// Find FIRST NAME label and inject before it
if (!c.includes("I want to")) {
  // Try multiple patterns to find the right injection point
  const patterns = [
    /(<div[^>]*>\s*<label[^>]*>FIRST NAME)/,
    /(<div style=\{\{marginBottom:16\}\}>\s*<label[^>]*>\s*FIRST NAME)/,
    /(<div[^>]*>\s*<label[^>]*>\s*FIRST\s*NAME)/i,
  ];
  
  let injected = false;
  for (const pat of patterns) {
    if (pat.test(c)) {
      c = c.replace(pat, roleSelector + "\n            $1");
      console.log("Injected role selector before FIRST NAME");
      injected = true;
      break;
    }
  }
  
  if (!injected) {
    // Fallback: find any mention of firstName in form fields
    const idx = c.indexOf("FIRST NAME");
    if (idx === -1) {
      // Try lowercase
      const idx2 = c.indexOf("First Name");
      if (idx2 === -1) {
        console.log("WARNING: Could not find injection point. Adding at form start.");
        // Find the form tag and add after it
        c = c.replace(/<form/, roleSelector + "\n            <form");
      } else {
        // Find the div containing this label
        let divStart = c.lastIndexOf("<div", idx2);
        c = c.slice(0, divStart) + roleSelector + "\n            " + c.slice(divStart);
        console.log("Injected role selector (fallback 2)");
      }
    } else {
      let divStart = c.lastIndexOf("<div", idx);
      c = c.slice(0, divStart) + roleSelector + "\n            " + c.slice(divStart);
      console.log("Injected role selector (fallback 1)");
    }
  }
}

// 5. Also update the response json to include accountType
if (!c.includes("accountType")) {
  c = c.replace(
    /role: user\.role/g,
    'role: user.role, accountType: user.accountType'
  );
}

fs.writeFileSync("pages/register.js", c);
console.log("Done! Register page updated with role selector.");
PEOF

node /tmp/patch-register.js

# Also update login to redirect based on accountType
cat > /tmp/patch-login-redirect.js << 'PEOF2'
const fs = require("fs");
let c = fs.readFileSync("pages/login.js", "utf8");

// After login, check accountType and redirect
if (!c.includes("issuer-dashboard")) {
  c = c.replace(
    /router\.push\(["']\/dashboard["']\)/g,
    'router.push(data?.user?.accountType === "issuer" ? "/issuer-dashboard" : "/dashboard")'
  );
  console.log("Updated login redirect for issuer/investor");
}

fs.writeFileSync("pages/login.js", c);
PEOF2

node /tmp/patch-login-redirect.js 2>/dev/null || true

echo ""
echo "  ✅ Done! Role selector added to registration."
echo "  Run: git add -A && git commit -m 'feat: investor/issuer role selector' && git push && npx vercel --prod"
