// components/NxtChatbot.tsx
// Floating chat widget — opens on click, AI always on, live agent Mon-Fri 9-18 EET
"use client";
import { useState, useEffect, useRef } from "react";

// ── HELPERS ──────────────────────────────────────────────────────
function getEETparts() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Vilnius",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  const weekday = parts.find(p => p.type === "weekday")?.value ?? "";
  const hour    = parseInt(parts.find(p => p.type === "hour")?.value ?? "0", 10);
  return { weekday, hour };
}

function isAgentOnline(): boolean {
  const { weekday, hour } = getEETparts();
  return !["Sat", "Sun"].includes(weekday) && hour >= 9 && hour < 18;
}

function getAgentStatus() {
  if (isAgentOnline()) {
    return { online: true, text: "Agent Online", color: "#0ECB81" };
  }
  const { weekday, hour } = getEETparts();
  if (["Sat", "Sun"].includes(weekday)) {
    return { online: false, text: "Agent offline — opens Mon 9am EET", color: "#F0B90B" };
  }
  if (hour < 9) {
    return { online: false, text: "Agent online at 9:00 EET", color: "#F0B90B" };
  }
  return { online: false, text: "Agent offline — opens 9am EET", color: "#F0B90B" };
}

function getEETDateString(): string {
  return new Date().toLocaleDateString("en-US", {
    timeZone: "Europe/Vilnius",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const QUICK = [
  "What bonds are available?",
  "How do I tokenize an asset?",
  "How does the secondary market work?",
  "What is ERC-3643?",
  "How to complete KYC?",
  "What is the minimum investment?",
];

type Msg = { role: "user" | "assistant"; content: string };

// ── COMPONENT ────────────────────────────────────────────────────
export default function NxtChatbot() {
  const [open,        setOpen]        = useState(false);
  const [tab,         setTab]         = useState<"ai" | "agent">("ai");
  const [messages,    setMessages]    = useState<Msg[]>([]);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [agentStatus] = useState(getAgentStatus());
  const [dateStr,     setDateStr]     = useState("");
  const [agentName,   setAgentName]   = useState("");
  const [agentEmail,  setAgentEmail]  = useState("");
  const [agentMsg,    setAgentMsg]    = useState("");
  const [agentSent,   setAgentSent]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Dynamic date — client only to avoid SSR mismatch
  useEffect(() => { setDateStr(getEETDateString()); }, []);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content) return;
    setInput("");
    const newMessages: Msg[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.message || data.error || "Sorry, I couldn't process that. Please try again.",
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Network error. Please check your connection and try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const submitAgentRequest = () => {
    if (!agentName || !agentEmail) return;
    setAgentSent(true);
  };

  const clearChat = () => setMessages([]);

  return (
    <>
      <style>{`
        .nxt-chat-widget{
          position:fixed;bottom:24px;right:24px;z-index:9998;
          font-family:'DM Sans',system-ui,sans-serif;
          display:flex;flex-direction:column;align-items:flex-end;gap:12px;
        }

        /* ── FAB (round icon button, Binance style) ── */
        .nxt-fab{
          width:56px;height:56px;border-radius:50%;
          background:#F0B90B;border:none;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 24px rgba(240,185,11,0.45);
          transition:all .2s;position:relative;flex-shrink:0;
        }
        .nxt-fab:hover{background:#FFD000;transform:scale(1.08);box-shadow:0 6px 32px rgba(240,185,11,0.6)}
        .nxt-fab svg{width:26px;height:26px;flex-shrink:0}
        .nxt-fab-status{
          position:absolute;top:1px;right:1px;
          width:13px;height:13px;border-radius:50%;
          border:2.5px solid #F0B90B;
        }
        .nxt-fab-status.online{background:#0ECB81;animation:fabpulse 2s ease-in-out infinite}
        .nxt-fab-status.offline{background:#666}
        @keyframes fabpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.7)}}

        /* ── CHAT WINDOW ── */
        .nxt-chat-win{
          width:380px;max-width:calc(100vw - 32px);
          background:#0B0E11;border:1px solid rgba(255,255,255,0.1);
          border-radius:18px;overflow:hidden;
          box-shadow:0 16px 48px rgba(0,0,0,0.6);
          display:flex;flex-direction:column;
          animation:chatslide .2s ease;
        }
        @keyframes chatslide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

        /* HEADER */
        .nxt-chat-head{padding:16px 18px 0;background:#0F1318;border-bottom:1px solid rgba(255,255,255,0.07)}
        .nxt-chat-head-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .nxt-chat-head-brand{display:flex;align-items:center;gap:8px}
        .nxt-chat-head-nxt{font-size:16px;font-weight:900;color:#F0B90B}
        .nxt-chat-head-name{font-size:13px;font-weight:700;color:#fff}
        .nxt-chat-head-sub{font-size:11px;color:rgba(255,255,255,0.4)}
        .nxt-chat-head-x{background:none;border:none;color:rgba(255,255,255,0.4);font-size:20px;cursor:pointer;line-height:1;padding:2px 6px;transition:color .15s}
        .nxt-chat-head-x:hover{color:#fff}
        .nxt-chat-tabs{display:flex}
        .nxt-chat-tab{flex:1;padding:9px 0;font-size:12px;font-weight:600;background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;color:rgba(255,255,255,0.4);transition:all .15s;text-align:center}
        .nxt-chat-tab:hover{color:#fff}
        .nxt-chat-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
        .nxt-chat-tab-dot{width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:5px;vertical-align:middle}

        /* BODY */
        .nxt-chat-body{height:340px;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#0B0E11}
        .nxt-chat-body::-webkit-scrollbar{width:4px}
        .nxt-chat-body::-webkit-scrollbar-track{background:transparent}
        .nxt-chat-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
        .nxt-chat-date{font-size:11px;color:rgba(255,255,255,0.2);text-align:center;padding:4px 0 8px}

        /* MESSAGES */
        .nxt-msg{display:flex;flex-direction:column;gap:2px;max-width:85%}
        .nxt-msg.user{align-self:flex-end;align-items:flex-end}
        .nxt-msg.assistant{align-self:flex-start;align-items:flex-start}
        .nxt-msg-bubble{padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.6;word-break:break-word}
        .nxt-msg.user .nxt-msg-bubble{background:#F0B90B;color:#000;border-radius:14px 14px 4px 14px}
        .nxt-msg.assistant .nxt-msg-bubble{background:#161B22;color:rgba(255,255,255,0.85);border:1px solid rgba(255,255,255,0.07);border-radius:14px 14px 14px 4px}

        /* WELCOME */
        .nxt-welcome{text-align:center;padding:8px 0}
        .nxt-welcome-ico{font-size:36px;margin-bottom:8px}
        .nxt-welcome-title{font-size:14px;font-weight:800;color:#fff;margin-bottom:4px}
        .nxt-welcome-sub{font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;margin-bottom:14px}
        .nxt-quick-btns{display:flex;flex-direction:column;gap:6px}
        .nxt-quick-btn{padding:8px 12px;background:rgba(240,185,11,0.06);border:1px solid rgba(240,185,11,0.18);border-radius:8px;font-size:12px;color:rgba(255,255,255,0.7);cursor:pointer;text-align:left;font-family:inherit;transition:all .15s}
        .nxt-quick-btn:hover{background:rgba(240,185,11,0.12);color:#fff;border-color:rgba(240,185,11,0.35)}

        /* TYPING */
        .nxt-typing{display:flex;gap:4px;align-items:center;padding:10px 14px;background:#161B22;border:1px solid rgba(255,255,255,0.07);border-radius:14px 14px 14px 4px;align-self:flex-start}
        .nxt-typing span{width:6px;height:6px;border-radius:50%;background:#F0B90B;animation:nxtdot 1.2s infinite}
        .nxt-typing span:nth-child(2){animation-delay:.2s}
        .nxt-typing span:nth-child(3){animation-delay:.4s}
        @keyframes nxtdot{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}

        /* INPUT */
        .nxt-chat-foot{padding:12px 14px;border-top:1px solid rgba(255,255,255,0.07);background:#0F1318;display:flex;gap:8px;align-items:center}
        .nxt-chat-input{flex:1;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:9px 12px;font-size:13px;color:#fff;outline:none;font-family:inherit;transition:border-color .15s}
        .nxt-chat-input:focus{border-color:rgba(240,185,11,0.4)}
        .nxt-chat-input::placeholder{color:rgba(255,255,255,0.3)}
        .nxt-chat-send{width:36px;height:36px;background:#F0B90B;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:background .15s;flex-shrink:0}
        .nxt-chat-send:hover{background:#FFD000}
        .nxt-chat-send:disabled{background:rgba(240,185,11,0.2);cursor:not-allowed}
        .nxt-chat-clear{background:none;border:none;color:rgba(255,255,255,0.25);font-size:11px;cursor:pointer;padding:0 4px;font-family:inherit}
        .nxt-chat-clear:hover{color:rgba(255,255,255,0.5)}

        /* AGENT TAB */
        .nxt-agent-body{height:340px;overflow-y:auto;padding:16px;background:#0B0E11}
        .nxt-agent-status{display:flex;align-items:center;gap:8px;padding:12px 14px;border-radius:10px;margin-bottom:16px}
        .nxt-agent-status.online{background:rgba(14,203,129,0.08);border:1px solid rgba(14,203,129,0.2)}
        .nxt-agent-status.offline{background:rgba(240,185,11,0.06);border:1px solid rgba(240,185,11,0.18)}
        .nxt-agent-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .nxt-agent-status-text{font-size:12px;font-weight:600}
        .nxt-agent-status.online .nxt-agent-status-text{color:#0ECB81}
        .nxt-agent-status.offline .nxt-agent-status-text{color:#F0B90B}
        .nxt-agent-hours{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px;margin-bottom:16px;font-size:12px;color:rgba(255,255,255,0.5);line-height:1.8}
        .nxt-agent-hours strong{color:rgba(255,255,255,0.7);display:block;margin-bottom:4px}
        .nxt-agent-form{display:flex;flex-direction:column;gap:10px}
        .nxt-af-label{font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;display:block}
        .nxt-af-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 12px;font-size:13px;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .nxt-af-input:focus{border-color:rgba(240,185,11,0.4)}
        .nxt-af-btn{padding:11px;background:#F0B90B;color:#000;border:none;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;transition:background .15s;width:100%}
        .nxt-af-btn:hover{background:#FFD000}
        .nxt-af-btn:disabled{background:rgba(240,185,11,0.2);cursor:not-allowed}
        .nxt-agent-success{text-align:center;padding:20px 0}
        .nxt-agent-success-ico{font-size:40px;margin-bottom:10px}
        .nxt-agent-success-title{font-size:14px;font-weight:800;color:#0ECB81;margin-bottom:6px}
        .nxt-agent-success-sub{font-size:12px;color:rgba(255,255,255,0.45);line-height:1.6}

        @media(max-width:420px){.nxt-chat-win{width:calc(100vw - 16px)}.nxt-chat-widget{right:8px;bottom:8px}}
      `}</style>

      <div className="nxt-chat-widget">

        {/* ── CHAT WINDOW ── */}
        {open && (
          <div className="nxt-chat-win">

            {/* HEADER */}
            <div className="nxt-chat-head">
              <div className="nxt-chat-head-top">
                <div className="nxt-chat-head-brand">
                  <span className="nxt-chat-head-nxt">NXT</span>
                  <div>
                    <div className="nxt-chat-head-name">Nextoken Support</div>
                    <div className="nxt-chat-head-sub">AI Online 24/7 · Vilnius, Lithuania</div>
                  </div>
                </div>
                <button className="nxt-chat-head-x" onClick={() => setOpen(false)}>×</button>
              </div>
              <div className="nxt-chat-tabs">
                <button className={`nxt-chat-tab ${tab==="ai"?"on":""}`} onClick={() => setTab("ai")}>
                  <span className="nxt-chat-tab-dot" style={{ background:"#0ECB81" }} />
                  ⚡ AI Chat 24/7
                </button>
                <button className={`nxt-chat-tab ${tab==="agent"?"on":""}`} onClick={() => setTab("agent")}>
                  <span className="nxt-chat-tab-dot" style={{ background: agentStatus.online ? "#0ECB81" : "#555" }} />
                  👤 Live Agent {agentStatus.online ? "🟢" : "⚫"}
                </button>
              </div>
            </div>

            {/* ── AI TAB ── */}
            {tab === "ai" && (
              <>
                <div className="nxt-chat-body">
                  {dateStr && <div className="nxt-chat-date">{dateStr}</div>}
                  {messages.length === 0 ? (
                    <div className="nxt-welcome">
                      <div className="nxt-welcome-ico">👋</div>
                      <div className="nxt-welcome-title">Hi! Welcome to Nextoken Capital.</div>
                      <p className="nxt-welcome-sub">
                        I&apos;m your 24/7 AI assistant — ask me anything about tokenization, bonds, blockchain IPOs, the secondary market, or your account.
                      </p>
                      <div className="nxt-quick-btns">
                        {QUICK.map(q => (
                          <button key={q} className="nxt-quick-btn" onClick={() => sendMessage(q)}>{q}</button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((m, i) => (
                        <div key={i} className={`nxt-msg ${m.role}`}>
                          <div className="nxt-msg-bubble">{m.content}</div>
                        </div>
                      ))}
                      {loading && (
                        <div className="nxt-typing"><span/><span/><span/></div>
                      )}
                      <div ref={bottomRef} />
                    </>
                  )}
                </div>
                <div className="nxt-chat-foot">
                  <input
                    className="nxt-chat-input"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                    disabled={loading}
                  />
                  <button className="nxt-chat-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                    {loading ? "⏳" : "➤"}
                  </button>
                  {messages.length > 0 && (
                    <button className="nxt-chat-clear" onClick={clearChat} title="Clear chat">✕</button>
                  )}
                </div>
                <div style={{ padding:"6px 14px 10px", background:"#0F1318", textAlign:"center" }}>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>
                    Nextoken Capital UAB · Vilnius 🇱🇹 · CEO: Bikash Bhat · Powered by Claude AI
                  </span>
                </div>
              </>
            )}

            {/* ── LIVE AGENT TAB ── */}
            {tab === "agent" && (
              <div className="nxt-agent-body">
                <div className={`nxt-agent-status ${agentStatus.online ? "online" : "offline"}`}>
                  <div className="nxt-agent-dot" style={{ background: agentStatus.online ? "#0ECB81" : "#F0B90B" }} />
                  <span className="nxt-agent-status-text">{agentStatus.text}</span>
                </div>
                <div className="nxt-agent-hours">
                  <strong>🕐 Live Agent Hours</strong>
                  Monday – Friday<br />
                  9:00 AM – 6:00 PM EET (Vilnius, Lithuania)<br />
                  <span style={{ color:"rgba(255,255,255,0.3)", fontSize:11 }}>
                    Outside these hours, our AI assistant is available 24/7
                  </span>
                </div>
                {agentSent ? (
                  <div className="nxt-agent-success">
                    <div className="nxt-agent-success-ico">✅</div>
                    <div className="nxt-agent-success-title">Request Received!</div>
                    <p className="nxt-agent-success-sub">
                      Thank you, <strong style={{ color:"#fff" }}>{agentName}</strong>!<br />
                      {agentStatus.online
                        ? "An agent will respond to you shortly."
                        : "We will contact you at your email when we are back online during office hours."
                      }
                    </p>
                  </div>
                ) : (
                  <div className="nxt-agent-form">
                    <div>
                      <label className="nxt-af-label">Your Name</label>
                      <input className="nxt-af-input" placeholder="Full name" value={agentName} onChange={e => setAgentName(e.target.value)} />
                    </div>
                    <div>
                      <label className="nxt-af-label">Email Address</label>
                      <input className="nxt-af-input" type="email" placeholder="you@example.com" value={agentEmail} onChange={e => setAgentEmail(e.target.value)} />
                    </div>
                    <div>
                      <label className="nxt-af-label">Message (optional)</label>
                      <textarea className="nxt-af-input" rows={3} placeholder="Describe your issue..." value={agentMsg} onChange={e => setAgentMsg(e.target.value)} style={{ resize:"none" }} />
                    </div>
                    <button className="nxt-af-btn" disabled={!agentName || !agentEmail} onClick={submitAgentRequest}>
                      {agentStatus.online ? "Request Live Agent →" : "Leave a Message →"}
                    </button>
                    <p style={{ fontSize:11, color:"rgba(255,255,255,0.25)", textAlign:"center", lineHeight:1.5 }}>
                      Or email us directly:<br />
                      <a href="mailto:support@nextokencapital.com" style={{ color:"#F0B90B", textDecoration:"none" }}>
                        support@nextokencapital.com
                      </a>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ROUND FAB — icon only, Binance style ── */}
        <button className="nxt-fab" onClick={() => setOpen(o => !o)} aria-label="Support chat">
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H6l-2 2V4h16v10z"/>
            </svg>
          )}
          <span className={`nxt-fab-status ${agentStatus.online ? "online" : "offline"}`} />
        </button>

      </div>
    </>
  );
}
