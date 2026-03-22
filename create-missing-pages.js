const fs = require("fs");

const pages = {
  "pages/bonds.js": `import Navbar from "../components/Navbar";
export default function Bonds() {
  return (<><Navbar /><div style={{minHeight:"100vh",background:"#05060a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>Bonds — Loading...</div></>);
}`,

  "pages/equity-ipo.js": `import Navbar from "../components/Navbar";
export default function EquityIPO() {
  return (<><Navbar /><div style={{minHeight:"100vh",background:"#05060a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>Equity and IPO — Loading...</div></>);
}`,

  "pages/register.js": `import Navbar from "../components/Navbar";
export default function Register() {
  return (<><Navbar /><div style={{minHeight:"100vh",background:"#05060a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>Register — Loading...</div></>);
}`,

  "pages/api.js": `import Navbar from "../components/Navbar";
export default function ApiDocs() {
  return (<><Navbar /><div style={{minHeight:"100vh",background:"#05060a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>API Docs</div></>);
}`,

  "pages/institutional.js": `import Navbar from "../components/Navbar";
export default function Institutional() {
  return (<><Navbar /><div style={{minHeight:"100vh",background:"#05060a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>Institutional — Coming Soon</div></>);
}`,

  "pages/compliance.js": `import Navbar from "../components/Navbar";
export default function Compliance() {
  return (<><Navbar /><div style={{minHeight:"100vh",background:"#05060a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>Compliance — Coming Soon</div></>);
}`,

  "pages/fees.js": `import Navbar from "../components/Navbar";
export default function Fees() {
  return (<><Navbar /><div style={{minHeight:"100vh",background:"#05060a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>Fees — Coming Soon</div></>);
}`,

  "pages/learn.js": `import Navbar from "../components/Navbar";
export default function Learn() {
  return (<><Navbar /><div style={{minHeight:"100vh",background:"#05060a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>Learn — Coming Soon</div></>);
}`,
};

Object.entries(pages).forEach(([path, content]) => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, content, "utf8");
    console.log("Created: " + path);
  } else {
    console.log("Exists:  " + path);
  }
});
console.log("Done!");