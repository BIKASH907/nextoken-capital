'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function isOfficeHours(): boolean {
  const vilnius = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Vilnius' }));
  const day = vilnius.getDay();
  const hour = vilnius.getHours();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

function getOfficeStatus() {
  const on = isOfficeHours();
  const vilnius = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Vilnius' }));
  const hour = vilnius.getHours();
  const day = vilnius.getDay();
  if (on) return { online: true, label: 'Agents available · Mon–Fri 9am–6pm EET' };
  if (day === 0 || day === 6) return { online: false, label: 'Agents offline · Back Monday 9am EET' };
  if (hour < 9) return { online: false, label: 'Agents offline · Opens 9am EET today' };
  return { online: false, label: 'Agents offline · Back tomorrow 9am EET' };
}

const SUGGESTIONS = [
  'What bonds are available?',
  'How do I tokenize an asset?',
  'How does secondary market work?',
  'What is ERC-3643?',
  'How do blockchain IPOs work?',
  'Who is the CEO?',
];

const WELCOME: Message = {
  role: 'assistant',
  content: "👋 Hi! Welcome to Nextoken Capital. I'm your 24/7 AI assistant — ask me anything about tokenization, bonds, blockchain IPOs, the secondary market, or your account.",
};

export default function NxtChatbot() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [view, setView] = useState<'chat' | 'agent'>('chat');
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentMsg, setAgentMsg] = useState('');
  const [agentSent, setAgentSent] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const office = getOfficeStatus();

  const handleClose = () => {
    setOpen(false);
    setDismissed(true);
    dismissedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (!dismissedRef.current) setOpen(true);
    }, 1500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open && view === 'chat') setTimeout(() => inputRef.current?.focus(), 200);
  }, [open, view]);

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
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please visit nextokencapital.com/contact.";
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const submitAgent = () => {
    if (!agentName.trim() || !agentEmail.trim() || !agentMsg.trim()) return;
    setAgentSent(true);
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <>
      {/* Chat Panel */}
      <div style={{
        position: 'fixed',
        bottom: open ? '88px' : '-700px',
        right: '20px',
        width: 'min(400px, calc(100vw - 32px))',
        height: 'min(620px, calc(100vh - 120px))',
        display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(180deg,#13171F 0%,#0B0E11 100%)',
        border: '1px solid #2B3139', borderRadius: '20px', overflow: 'hidden',
        zIndex: 999999,
        fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
        boxShadow: '0 32px 80px rgba(0,0,0,0.8),0 0 0 1px rgba(240,185,11,0.08)',
        transition: 'bottom 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Gold accent bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,#F0B90B,#F8D12F,#F0B90B)', flexShrink: 0 }} />

        {/* Header */}
        <div style={{ background: '#151A1F', padding: '14px 16px 12px', borderBottom: '1px solid #2B3139', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg,#F0B90B,#F8D12F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#0B0E11', flexShrink: 0, boxShadow: '0 0 0 3px rgba(240,185,11,0.2)' }}>NXT</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#F5F5F5' }}>Nextoken Support</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#02C076', display: 'inline-block', boxShadow: '0 0 6px #02C076' }} />
                  <span style={{ fontSize: 11, color: '#02C076', fontWeight: 600 }}>AI Online 24/7</span>
                  <span style={{ fontSize: 11, color: '#474D57' }}>· Vilnius, Lithuania</span>
                </div>
              </div>
            </div>
            <button onClick={handleClose} style={{ background: '#2B3139', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#848E9C', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#0B0E11', borderRadius: 12, padding: 3, gap: 3 }}>
            {(['chat', 'agent'] as const).map(tab => (
              <button key={tab} onClick={() => setView(tab)} style={{
                flex: 1, padding: '8px 0', borderRadius: 10, border: 'none',
                background: view === tab ? (tab === 'chat' ? 'linear-gradient(135deg,#F0B90B,#F8D12F)' : '#2B3139') : 'transparent',
                color: view === tab ? (tab === 'chat' ? '#0B0E11' : '#EAECEF') : '#474D57',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {tab === 'chat' ? '⚡ AI Chat 24/7' : `👤 Live Agent ${office.online ? '🟢' : '⚫'}`}
              </button>
            ))}
          </div>
        </div>

        {/* AI Chat */}
        {view === 'chat' && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 8px', display: 'flex', flexDirection: 'column', gap: 12, background: '#0B0E11' }}>
              <div style={{ textAlign: 'center', fontSize: 10, color: '#474D57', background: '#1E2329', borderRadius: 20, padding: '3px 12px', alignSelf: 'center', border: '1px solid #2B3139' }}>{today}</div>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
                  {msg.role === 'assistant' && (
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F0B90B,#F8D12F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#0B0E11', flexShrink: 0 }}>NXT</div>
                  )}
                  <div style={{ maxWidth: '73%', padding: '11px 15px', borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px', background: msg.role === 'user' ? 'linear-gradient(135deg,#F0B90B,#F8D12F)' : '#1E2329', color: msg.role === 'user' ? '#0B0E11' : '#EAECEF', fontSize: 13, lineHeight: 1.65, fontWeight: msg.role === 'user' ? 600 : 400, border: msg.role === 'assistant' ? '1px solid #2B3139' : 'none', boxShadow: msg.role === 'user' ? '0 4px 12px rgba(240,185,11,0.25)' : '0 2px 8px rgba(0,0,0,0.3)' }}>{msg.content}</div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F0B90B,#F8D12F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#0B0E11', flexShrink: 0 }}>NXT</div>
                  <div style={{ padding: '13px 18px', borderRadius: '4px 18px 18px 18px', background: '#1E2329', border: '1px solid #2B3139', display: 'flex', gap: 6, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#F0B90B', display: 'inline-block', animation: 'nxtDot 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {showSuggestions && (
              <div style={{ padding: '10px 12px', background: '#0D1117', borderTop: '1px solid #1E2329', flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: '#474D57', fontWeight: 700, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Quick questions</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => sendMessage(s)} style={{ fontSize: 11, padding: '5px 11px', borderRadius: 20, border: '1px solid #2B3139', background: '#1E2329', color: '#848E9C', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = '#F0B90B'; e.currentTarget.style.color = '#F0B90B'; e.currentTarget.style.background = 'rgba(240,185,11,0.08)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = '#2B3139'; e.currentTarget.style.color = '#848E9C'; e.currentTarget.style.background = '#1E2329'; }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid #2B3139', background: '#151A1F', flexShrink: 0 }}>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)} placeholder="Ask anything about Nextoken..."
                style={{ flex: 1, fontSize: 13, border: '1px solid #2B3139', borderRadius: 24, padding: '10px 16px', background: '#0B0E11', color: '#EAECEF', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#F0B90B')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2B3139')}
              />
              <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{ background: input.trim() ? 'linear-gradient(135deg,#F0B90B,#F8D12F)' : '#2B3139', border: 'none', borderRadius: '50%', width: 42, height: 42, flexShrink: 0, alignSelf: 'center', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: input.trim() ? '0 4px 12px rgba(240,185,11,0.4)' : 'none' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8L14 2L10 8L14 14L2 8Z" fill={input.trim() ? '#0B0E11' : '#474D57'} /></svg>
              </button>
            </div>
          </>
        )}

        {/* Live Agent */}
        {view === 'agent' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px', background: '#0B0E11' }}>
            <div style={{ background: office.online ? 'rgba(2,192,118,0.08)' : 'rgba(71,77,87,0.2)', border: `1px solid ${office.online ? '#02C076' : '#2B3139'}`, borderRadius: 14, padding: '13px 16px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, background: office.online ? '#02C076' : '#474D57', display: 'inline-block', boxShadow: office.online ? '0 0 8px #02C076' : 'none' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: office.online ? '#02C076' : '#848E9C' }}>{office.online ? '✅ Agents are online right now' : '🔴 Agents are currently offline'}</div>
                <div style={{ fontSize: 11, color: '#474D57', marginTop: 2 }}>{office.label}</div>
              </div>
            </div>

            <div style={{ background: '#151A1F', border: '1px solid #2B3139', borderRadius: 14, padding: '14px 16px', marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#F0B90B', marginBottom: 12 }}>🕐 Office Hours — Vilnius, Lithuania</div>
              {[
                { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM EET', active: true },
                { day: 'Saturday', hours: 'Closed', active: false },
                { day: 'Sunday', hours: 'Closed', active: false },
                { day: 'AI Assistant', hours: '24/7 Always online', active: true },
              ].map(r => (
                <div key={r.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1E2329', fontSize: 12 }}>
                  <span style={{ color: '#848E9C' }}>{r.day}</span>
                  <span style={{ color: r.active ? '#EAECEF' : '#474D57', fontWeight: r.active ? 600 : 400 }}>{r.hours}</span>
                </div>
              ))}
            </div>

            {!agentSent ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#EAECEF', marginBottom: 14 }}>
                  {office.online ? '💬 Send a message to a live agent' : "📩 Leave a message — we'll reply soon"}
                </div>
                {[
                  { val: agentName, set: setAgentName, ph: 'Your full name', type: 'text' },
                  { val: agentEmail, set: setAgentEmail, ph: 'Your email address', type: 'email' },
                ].map(f => (
                  <input key={f.ph} value={f.val} type={f.type} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                    style={{ width: '100%', fontSize: 13, border: '1px solid #2B3139', borderRadius: 10, padding: '10px 13px', marginBottom: 10, background: '#1E2329', color: '#EAECEF', outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.2s' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#F0B90B')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2B3139')}
                  />
                ))}
                <textarea value={agentMsg} onChange={e => setAgentMsg(e.target.value)} placeholder="Describe your question or issue..." rows={4}
                  style={{ width: '100%', fontSize: 13, border: '1px solid #2B3139', borderRadius: 10, padding: '10px 13px', marginBottom: 14, background: '#1E2329', color: '#EAECEF', outline: 'none', resize: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', lineHeight: 1.55, transition: 'border-color 0.2s' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#F0B90B')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#2B3139')}
                />
                <button onClick={submitAgent} disabled={!agentName.trim() || !agentEmail.trim() || !agentMsg.trim()}
                  style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: 'none', background: (agentName && agentEmail && agentMsg) ? 'linear-gradient(135deg,#F0B90B,#F8D12F)' : '#2B3139', color: (agentName && agentEmail && agentMsg) ? '#0B0E11' : '#474D57', fontSize: 14, fontWeight: 700, cursor: (agentName && agentEmail && agentMsg) ? 'pointer' : 'default', transition: 'all 0.2s' }}>
                  {office.online ? '🚀 Send to Live Agent' : '📨 Leave a Message'}
                </button>
                <div style={{ textAlign: 'center', marginTop: 14 }}>
                  <a href="mailto:support@nextokencapital.com" style={{ fontSize: 12, color: '#F0B90B', textDecoration: 'none' }}>✉️ support@nextokencapital.com</a>
                </div>
              </>
            ) : (
              <div style={{ background: 'rgba(2,192,118,0.08)', border: '1px solid #02C076', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#02C076', marginBottom: 8 }}>Message Sent!</div>
                <div style={{ fontSize: 12, color: '#848E9C', lineHeight: 1.7 }}>
                  Thanks <strong style={{ color: '#EAECEF' }}>{agentName}</strong>!<br />
                  We'll reply to <strong style={{ color: '#F0B90B' }}>{agentEmail}</strong><br />
                  during office hours (Mon–Fri 9am–6pm EET).
                </div>
                <button onClick={() => { setAgentSent(false); setAgentName(''); setAgentEmail(''); setAgentMsg(''); }}
                  style={{ marginTop: 16, background: 'transparent', border: '1px solid #2B3139', borderRadius: 10, padding: '8px 20px', color: '#848E9C', fontSize: 12, cursor: 'pointer' }}>
                  Send another message
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: 10, color: '#2B3139', padding: '6px 8px', background: '#0D1017', borderTop: '1px solid #1A1F27', flexShrink: 0 }}>
          Nextoken Capital UAB · Vilnius 🇱🇹 · CEO: Bikash Bhat · Powered by Claude AI
        </div>
      </div>

      {/* Launcher */}
      <button
        onClick={() => { setDismissed(false); dismissedRef.current = false; setOpen(o => !o); }}
        title="24/7 Nextoken Support"
        style={{
          position: 'fixed', bottom: '20px', right: '20px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: open ? '#1E2329' : 'linear-gradient(135deg,#F0B90B,#F8D12F)',
          border: open ? '2px solid #2B3139' : '2px solid #F8D12F',
          cursor: 'pointer', zIndex: 999999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open ? '0 4px 20px rgba(0,0,0,0.4)' : '0 0 0 4px rgba(240,185,11,0.15),0 8px 32px rgba(240,185,11,0.5)',
          transition: 'all 0.3s',
        }}
      >
        {open
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="#848E9C" strokeWidth="2.5" strokeLinecap="round" /></svg>
          : <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 6.477 2 12C2 13.89 2.525 15.66 3.438 17.168L2.079 21.121C1.962 21.48 2.303 21.82 2.661 21.703L6.668 20.33C8.15 21.389 9.995 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#0B0E11" /><circle cx="8.5" cy="12" r="1.4" fill="#F0B90B" /><circle cx="12" cy="12" r="1.4" fill="#F0B90B" /><circle cx="15.5" cy="12" r="1.4" fill="#F0B90B" /></svg>
        }
      </button>

      <style>{`
        @keyframes nxtDot{0%,80%,100%{opacity:.25;transform:scale(.75)}40%{opacity:1;transform:scale(1.15)}}
        div::-webkit-scrollbar{width:3px}
        div::-webkit-scrollbar-track{background:transparent}
        div::-webkit-scrollbar-thumb{background:#2B3139;border-radius:4px}
      `}</style>
    </>
  );
}
