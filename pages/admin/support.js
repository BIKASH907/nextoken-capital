import AdminShell from "../../components/admin/AdminShell";
import AdminShell from "../../components/admin/AdminShell";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../components/AdminSidebar";
export default function SupportPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState("");
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState("open");
  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);
  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/support", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.tickets) setTickets(d.tickets); });
  }, [token]);
  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    const r = await fetch(`/api/admin/support/${selected._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reply, status: "replied" }),
    });
    const d = await r.json();
    if (r.ok) {
      setMsg("Reply sent!");
      setTickets(prev => prev.map(t => t._id === selected._id ? { ...t, status: "replied", adminReply: reply } : t));
      setSelected(prev => ({ ...prev, status: "replied", adminReply: reply }));
      setReply("");
    } else setMsg(d.error || "Failed");
  };
  const closeTicket = async (ticketId) => {
    await fetch(`/api/admin/support/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: "closed" }),
    });
    setTickets(prev => prev.map(t => t._id === ticketId ? { ...t, status: "closed" } : t));
    if (selected?._id === ticketId) setSelected(prev => ({ ...prev, status: "closed" }));
  };
  const filtered = tickets.filter(t => filter === "all" ? true : t.status === filter);
  if (!mounted) return <div style={{background:"#0B0E11",minHeight:"100vh"}} />;
  return (
    <>
      <Head><title>Support — Admin</title></Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#0B0E11;color:#fff;font-family:'DM Sans',system-ui,sans-serif}.main{margin-left:220px;padding:32px;min-height:100vh}.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}.badge-green{background:rgba(14,203,129,0.12);color:#0ECB81}.badge-yellow{background:rgba(240,185,11,0.12);color:#F0B90B}.badge-blue{background:rgba(66,153,225,0.12);color:#63b3ed}.badge-gray{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}.filter-bar{display:flex;gap:8px;margin-bottom:20px}.filter-btn{padding:6px 16px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.1);background:none;color:rgba(255,255,255,0.5);transition:all .15s}.filter-btn.active{background:rgba(240,185,11,0.1);color:#F0B90B;border-color:rgba(240,185,11,0.3)}.ticket-row{padding:14px;border-radius:8px;cursor:pointer;border:1px solid rgba(255,255,255,0.06);margin-bottom:8px;transition:border-color .15s}.ticket-row:hover,.ticket-row.active{border-color:rgba(240,185,11,0.3);background:rgba(240,185,11,0.04)}.ticket-subject{font-size:14px;font-weight:600;margin-bottom:4px}.ticket-meta{font-size:12px;color:rgba(255,255,255,0.4)}.detail-panel{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px;height:fit-content}.msg-box{background:#161B22;border-radius:8px;padding:14px;margin-bottom:16px}.msg-user{font-size:13px;line-height:1.6;margin-bottom:8px}.msg-admin{background:rgba(240,185,11,0.06);border:1px solid rgba(240,185,11,0.1);border-radius:8px;padding:14px;margin-bottom:16px}.msg-date{font-size:11px;color:rgba(255,255,255,0.3)}.textarea{width:100%;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 12px;font-size:13px;color:#fff;outline:none;font-family:inherit;resize:vertical;min-height:80px;margin-bottom:10px}.btn{padding:9px 18px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;border:none;font-family:inherit}.btn-yellow{background:#F0B90B;color:#000}.btn-gray{background:rgba(255,255,255,0.07);color:#fff;border:1px solid rgba(255,255,255,0.1)}.success-msg{background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.2);border-radius:8px;padding:10px 14px;font-size:13px;color:#0ECB81;margin-top:8px}.empty{text-align:center;padding:60px;color:rgba(255,255,255,0.3);font-size:13px}`}</style>
      <AdminSidebar />
      <div className="main">
        <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Support Tickets</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:24}}>{tickets.filter(t=>t.status==="open").length} open tickets</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:24}}>
          <div>
            <div className="filter-bar">
              {["open","replied","closed","all"].map(f => (
                <button key={f} className={`filter-btn${filter===f?" active":""}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
              ))}
            </div>
            {filtered.length === 0 ? <div className="empty">No {filter} tickets</div> : filtered.map(t => (
              <div key={t._id} className={`ticket-row${selected?._id===t._id?" active":""}`} onClick={() => setSelected(t)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div className="ticket-subject">{t.subject || "Support Request"}</div>
                  <span className={`badge badge-${t.status==="open"?"yellow":t.status==="replied"?"blue":"gray"}`}>{t.status}</span>
                </div>
                <div className="ticket-meta">{t.userName || t.userEmail} · {new Date(t.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
          <div>
            {!selected ? <div className="detail-panel" style={{textAlign:"center",padding:60,color:"rgba(255,255,255,0.3)"}}>Select a ticket to view and reply</div> : (
              <div className="detail-panel">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div style={{fontSize:16,fontWeight:700}}>{selected.subject || "Support Request"}</div>
                  <span className={`badge badge-${selected.status==="open"?"yellow":selected.status==="replied"?"blue":"gray"}`}>{selected.status}</span>
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:16}}>{selected.userEmail} · {new Date(selected.createdAt).toLocaleString()}</div>
                <div className="msg-box">
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>User Message</div>
                  <div className="msg-user">{selected.message}</div>
                </div>
                {selected.adminReply && (
                  <div className="msg-admin">
                    <div style={{fontSize:11,fontWeight:700,color:"#F0B90B",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Your Reply</div>
                    <div style={{fontSize:13,lineHeight:1.6}}>{selected.adminReply}</div>
                  </div>
                )}
                {selected.status !== "closed" && (<>
                  <textarea className="textarea" value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." />
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn btn-yellow" onClick={sendReply}>Send Reply</button>
                    <button className="btn btn-gray" onClick={() => closeTicket(selected._id)}>Close Ticket</button>
                  </div>
                  {msg && <div className="success-msg">{msg}</div>}
                </>)}
                {selected.status === "closed" && <div style={{fontSize:13,color:"rgba(255,255,255,0.3)",textAlign:"center",padding:16}}>This ticket is closed.</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
