import { useState, useEffect } from 'react';
export default function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('nxt_cookie_consent')) setShow(true);
  }, []);
  const accept = () => { localStorage.setItem('nxt_cookie_consent', 'accepted'); setShow(false); };
  const decline = () => { localStorage.setItem('nxt_cookie_consent', 'declined'); setShow(false); };
  if (!show) return null;
  return (
    <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:9999,background:'#161B22',borderTop:'1px solid rgba(255,255,255,0.1)',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
      <div style={{flex:1,minWidth:280}}>
        <div style={{fontSize:14,fontWeight:600,color:'#fff',marginBottom:4}}>We value your privacy</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:1.6}}>We use essential cookies for platform functionality and analytics cookies to improve your experience. By clicking Accept, you consent to our use of cookies. See our <a href="/privacy" style={{color:'#F0B90B',textDecoration:'none'}}>Privacy Policy</a>.</div>
      </div>
      <div style={{display:'flex',gap:8}}>
        <button onClick={decline} style={{padding:'8px 20px',borderRadius:8,fontSize:13,fontWeight:600,border:'1px solid rgba(255,255,255,0.15)',background:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontFamily:'inherit'}}>Decline</button>
        <button onClick={accept} style={{padding:'8px 20px',borderRadius:8,fontSize:13,fontWeight:700,border:'none',background:'#F0B90B',color:'#0B0E11',cursor:'pointer',fontFamily:'inherit'}}>Accept all</button>
      </div>
    </div>
  );
}