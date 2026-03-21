'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const C = {
  navy:      '#0A0F1E',
  navyMid:   '#0F1729',
  blue:      '#1E6FD9',
  teal:      '#00C896',
  white:     '#FFFFFF',
  textMuted: '#8A9BBF',
  border:    '#1E2D4D',
  msgUser:   '#1E6FD9',
  msgBot:    '#141C2E',
  inputBg:   '#0D1526',
};

const SUGGESTIONS = [
  'How do I tokenize an asset?',
  'What bonds are available?',
  'How does the secondary market work?',
  'What is ERC-3643?',
  'How do blockchain IPOs work?',
  'How do I create an account?',
];

export default function NxtChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: "Hi! I'm the NXT Assistant. Ask me about tokenization, bonds, blockchain IPOs, the secondary market, or anything about Nextoken Capital." }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (text: string) => {
    const userText = text.trim();
    if (!userText || loading) return;
    setInput('');
    setShowSuggestions(false);
    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again or visit nextokencapital.com/contact.";
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Connection error. Please check your internet and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div style={{ position:'fixed', bottom:'90px', right:'24px', width:'360px', maxHeight:'560px', display:'flex', flexDirection:'column', background:C.navyMid, border:`1px solid ${C.border}`, borderRadius:'16px', overflow:'hidden', zIndex:9999, fontFamily:"'Inter',-apple-system,sans-serif", boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ background:C.navy, padding:'14px 16px', display:'flex', alignItems:'center', gap:'10px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:C.blue, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:700, color:C.white, flexShrink:0 }}>N</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.white }}>NXT Assistant</div>
              <div style={{ fontSize:11, color:C.textMuted, display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:C.teal, display:'inline-block' }} />
                Online · Nextoken Capital
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted, fontSize:20, lineHeight:1, padding:'0 2px' }}>×</button>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'14px', display:'flex', flexDirection:'column', gap:'8px', background:C.navy }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf:msg.role==='user'?'flex-end':'flex-start', maxWidth:'85%' }}>
                <div style={{ padding:'9px 12px', borderRadius:msg.role==='user'?'12px 4px 12px 12px':'4px 12px 12px 12px', background:msg.role==='user'?C.msgUser:C.msgBot, color:C.white, fontSize:13, lineHeight:1.55, border:msg.role==='assistant'?`1px solid ${C.border}`:'none' }}>{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf:'flex-start' }}>
                <div style={{ padding:'9px 14px', borderRadius:'4px 12px 12px 12px', background:C.msgBot, border:`1px solid ${C.border}`, display:'flex', gap:5, alignItems:'center' }}>
                  {[0,1,2].map(i => <span key={i} style={{ width:6, height:6, borderRadius:'50%', background:C.blue, animation:'nxtPulse 1.2s ease-in-out infinite', animationDelay:`${i*0.2}s`, display:'inline-block' }} />)}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && (
            <div style={{ padding:'8px 12px', display:'flex', flexWrap:'wrap', gap:6, background:C.navy, borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
              {SUGGESTIONS.map(s => <button key={s} onClick={() => sendMessage(s)} style={{ fontSize:11, padding:'4px 10px', borderRadius:20, border:`1px solid ${C.border}`, background:C.navyMid, color:C.textMuted, cursor:'pointer', whiteSpace:'nowrap' }}>{s}</button>)}
            </div>
          )}

          <div style={{ display:'flex', gap:8, padding:'10px 12px', borderTop:`1px solid ${C.border}`, background:C.navyMid, flexShrink:0 }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && sendMessage(input)} placeholder="Ask about tokenization, bonds, IPO..." style={{ flex:1, fontSize:13, border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 11px', background:C.inputBg, color:C.white, outline:'none' }} />
            <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{ background:input.trim()?C.blue:C.border, border:'none', borderRadius:8, width:36, height:36, cursor:input.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, alignSelf:'center' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 8L14 2L10 8L14 14L2 8Z" fill="white"/></svg>
            </button>
          </div>

          <div style={{ textAlign:'center', fontSize:10, color:C.textMuted, padding:'5px', background:C.navyMid, borderTop:`1px solid ${C.border}` }}>Powered by Claude AI · Nextoken Capital</div>
        </div>
      )}

      <button onClick={() => setOpen(o => !o)} title="Chat with NXT Support" style={{ position:'fixed', bottom:24, right:24, width:52, height:52, borderRadius:'50%', background:open?C.navyMid:C.blue, border:`1px solid ${open?C.border:C.blue}`, cursor:'pointer', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(30,111,217,0.35)', transition:'background 0.2s' }}>
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/></svg>
        }
      </button>
      <style>{`@keyframes nxtPulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
    </>
  );
}
