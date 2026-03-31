import { useState, useEffect, useCallback } from 'react';
export default function SessionGuard({ children, timeoutMs = 900000, warningMs = 60000 }) {
  const [warning, setWarning] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const reset = useCallback(() => { setWarning(false); window.__nxtLastActivity = Date.now(); }, []);
  useEffect(() => {
    window.__nxtLastActivity = Date.now();
    const events = ['mousedown','keydown','scroll','touchstart'];
    events.forEach(e => window.addEventListener(e, reset));
    const interval = setInterval(() => {
      const idle = Date.now() - (window.__nxtLastActivity || Date.now());
      const left = timeoutMs - idle;
      if (left <= 0) { window.location.href = '/login'; }
      else if (left <= warningMs) { setWarning(true); setRemaining(Math.ceil(left / 1000)); }
      else { setWarning(false); }
    }, 1000);
    return () => { events.forEach(e => window.removeEventListener(e, reset)); clearInterval(interval); };
  }, [timeoutMs, warningMs, reset]);
  return (<>
    {children}
    {warning && (
      <div style={{position:'fixed',top:20,right:20,zIndex:10000,background:'#161B22',border:'1px solid rgba(240,185,11,0.3)',borderRadius:12,padding:'16px 20px',maxWidth:320,boxShadow:'0 8px 32px rgba(0,0,0,0.5)'}}>
        <div style={{fontSize:14,fontWeight:700,color:'#F0B90B',marginBottom:4}}>Session expiring</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>Your session will expire in {remaining}s due to inactivity. Move your mouse to stay logged in.</div>
      </div>
    )}
  </>);
}