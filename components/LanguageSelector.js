import { useState, useEffect } from 'react';

const LANGUAGES = [
  { code:"en", name:"English", flag:"\uD83C\uDDEC\uD83C\uDDE7" },
  { code:"de", name:"Deutsch", flag:"\uD83C\uDDE9\uD83C\uDDEA" },
  { code:"fr", name:"Fran\u00E7ais", flag:"\uD83C\uDDEB\uD83C\uDDF7" },
  { code:"es", name:"Espa\u00F1ol", flag:"\uD83C\uDDEA\uD83C\uDDF8" },
  { code:"it", name:"Italiano", flag:"\uD83C\uDDEE\uD83C\uDDF9" },
  { code:"pt", name:"Portugu\u00EAs", flag:"\uD83C\uDDF5\uD83C\uDDF9" },
  { code:"nl", name:"Nederlands", flag:"\uD83C\uDDF3\uD83C\uDDF1" },
  { code:"pl", name:"Polski", flag:"\uD83C\uDDF5\uD83C\uDDF1" },
  { code:"cs", name:"\u010Ce\u0161tina", flag:"\uD83C\uDDE8\uD83C\uDDFF" },
  { code:"ro", name:"Rom\u00E2n\u0103", flag:"\uD83C\uDDF7\uD83C\uDDF4" },
  { code:"el", name:"\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC", flag:"\uD83C\uDDEC\uD83C\uDDF7" },
  { code:"hu", name:"Magyar", flag:"\uD83C\uDDED\uD83C\uDDFA" },
  { code:"bg", name:"\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438", flag:"\uD83C\uDDE7\uD83C\uDDEC" },
  { code:"hr", name:"Hrvatski", flag:"\uD83C\uDDED\uD83C\uDDF7" },
  { code:"sk", name:"Sloven\u010Dina", flag:"\uD83C\uDDF8\uD83C\uDDF0" },
  { code:"sl", name:"Sloven\u0161\u010Dina", flag:"\uD83C\uDDF8\uD83C\uDDEE" },
  { code:"lt", name:"Lietuvi\u0173", flag:"\uD83C\uDDF1\uD83C\uDDF9" },
  { code:"lv", name:"Latvie\u0161u", flag:"\uD83C\uDDF1\uD83C\uDDFB" },
  { code:"et", name:"Eesti", flag:"\uD83C\uDDEA\uD83C\uDDEA" },
  { code:"fi", name:"Suomi", flag:"\uD83C\uDDEB\uD83C\uDDEE" },
  { code:"sv", name:"Svenska", flag:"\uD83C\uDDF8\uD83C\uDDEA" },
  { code:"da", name:"Dansk", flag:"\uD83C\uDDE9\uD83C\uDDF0" },
  { code:"mt", name:"Malti", flag:"\uD83C\uDDF2\uD83C\uDDF9" },
  { code:"ga", name:"Gaeilge", flag:"\uD83C\uDDEE\uD83C\uDDEA" },
  { code:"ar", name:"\u0627\u0644\u0639\u0631\u0628\u064A\u0629", flag:"\uD83C\uDDE6\uD83C\uDDEA" },
  { code:"zh", name:"\u4E2D\u6587", flag:"\uD83C\uDDE8\uD83C\uDDF3" },
  { code:"ja", name:"\u65E5\u672C\u8A9E", flag:"\uD83C\uDDEF\uD83C\uDDF5" },
  { code:"ko", name:"\uD55C\uAD6D\uC5B4", flag:"\uD83C\uDDF0\uD83C\uDDF7" },
  { code:"hi", name:"\u0939\u093F\u0928\u094D\u0926\u0940", flag:"\uD83C\uDDEE\uD83C\uDDF3" },
  { code:"ne", name:"\u0928\u0947\u092A\u093E\u0932\u0940", flag:"\uD83C\uDDF3\uD83C\uDDF5" },
  { code:"th", name:"\u0E44\u0E17\u0E22", flag:"\uD83C\uDDF9\uD83C\uDDED" },
  { code:"vi", name:"Ti\u1EBFng Vi\u1EC7t", flag:"\uD83C\uDDFB\uD83C\uDDF3" },
  { code:"ms", name:"Bahasa Melayu", flag:"\uD83C\uDDF2\uD83C\uDDFE" },
  { code:"id", name:"Bahasa Indonesia", flag:"\uD83C\uDDEE\uD83C\uDDE9" },
  { code:"tr", name:"T\u00FCrk\u00E7e", flag:"\uD83C\uDDF9\uD83C\uDDF7" },
  { code:"ru", name:"\u0420\u0443\u0441\u0441\u043A\u0438\u0439", flag:"\uD83C\uDDF7\uD83C\uDDFA" },
  { code:"uk", name:"\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430", flag:"\uD83C\uDDFA\uD83C\uDDE6" },
  { code:"he", name:"\u05E2\u05D1\u05E8\u05D9\u05EA", flag:"\uD83C\uDDEE\uD83C\uDDF1" },
  { code:"sw", name:"Kiswahili", flag:"\uD83C\uDDF0\uD83C\uDDEA" },
  { code:"af", name:"Afrikaans", flag:"\uD83C\uDDFF\uD83C\uDDE6" },
  { code:"bn", name:"\u09AC\u09BE\u0982\u09B2\u09BE", flag:"\uD83C\uDDE7\uD83C\uDDE9" },
  { code:"ur", name:"\u0627\u0631\u062F\u0648", flag:"\uD83C\uDDF5\uD83C\uDDF0" },
  { code:"fa", name:"\u0641\u0627\u0631\u0633\u06CC", flag:"\uD83C\uDDEE\uD83C\uDDF7" },
  { code:"fil", name:"Filipino", flag:"\uD83C\uDDF5\uD83C\uDDED" },
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("nxt_lang");
    if (saved) setCurrent(saved);
    if (!document.getElementById("gt-script")) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      };
      const s = document.createElement("script");
      s.id = "gt-script";
      s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(s);
    }
  }, []);

  const selectLang = (code) => {
    localStorage.setItem("nxt_lang", code);
    setCurrent(code);
    setOpen(false);
    setSearch("");
    const frame = document.querySelector(".goog-te-combo");
    if (frame) { frame.value = code; frame.dispatchEvent(new Event("change")); }
  };

  const currentLang = LANGUAGES.find(l => l.code === current) || LANGUAGES[0];
  const filtered = LANGUAGES.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.code.includes(search.toLowerCase()));

  return (
    <>
      <div id="google_translate_element" style={{position:"absolute",top:-9999,left:-9999}} />
      <div style={{position:"relative"}}>
        <button onClick={() => setOpen(!open)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
          <span style={{fontSize:14}}>{currentLang.flag}</span>
          <span>{currentLang.code.toUpperCase()}</span>
          <span style={{fontSize:8,opacity:0.4}}>{open ? "\u25B2" : "\u25BC"}</span>
        </button>
        {open && (
          <div style={{position:"absolute",top:"100%",right:0,marginTop:6,width:280,maxHeight:400,background:"#0F1318",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,boxShadow:"0 12px 40px rgba(0,0,0,0.5)",zIndex:9999,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search language..." autoFocus style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"8px 10px",fontSize:12,color:"#fff",outline:"none",fontFamily:"inherit"}} />
            </div>
            <div style={{overflowY:"auto",maxHeight:340}}>
              {filtered.map(l => (
                <button key={l.code} onClick={() => selectLang(l.code)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",border:"none",background:l.code===current?"rgba(240,185,11,0.08)":"transparent",color:l.code===current?"#F0B90B":"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer",fontFamily:"inherit",textAlign:"left",borderLeft:l.code===current?"2px solid #F0B90B":"2px solid transparent"}}>
                  <span style={{fontSize:16,width:24,textAlign:"center"}}>{l.flag}</span>
                  <span style={{fontWeight:l.code===current?700:400}}>{l.name}</span>
                  <span style={{marginLeft:"auto",fontSize:10,opacity:0.3}}>{l.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
