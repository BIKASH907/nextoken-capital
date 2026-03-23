import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
const CSS = `*{box-sizing:border-box;margin:0;padding:0}body{background:#0B0E11;color:#fff;font-family:'DM Sans',system-ui,sans-serif}a{text-decoration:none}.sidebar{position:fixed;top:0;left:0;width:220px;height:100vh;background:#0F1318;border-right:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;padding:24px 16px;z-index:100;overflow-y:auto}.logo{font-size:20px;font-weight:900;color:#F0B90B;margin-bottom:4px}.logo-sub{font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:2px;margin-bottom:32px}.nav-item{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);cursor:pointer;margin-bottom:4px;transition:all .15s}.nav-item:hover{color:#fff;background:rgba(255,255,255,0.05)}.nav-item.active{color:#F0B90B;background:rgba(240,185,11,0.1)}.nav-bottom{margin-top:auto;padding-top:16px}.user-info{padding:12px 14px;border-radius:8px;background:rgba(255,255,255,0.04);margin-bottom:8px}.user-name{font-size:13px;font-weight:700}.user-role{font-size:11px;color:#F0B90B;margin-top:2px}.logout-btn{width:100%;padding:10px 14px;border-radius:8px;background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.15);color:#ff6b6b;font-size:13px;font-weight:600;cursor:pointer;text-align:left}.main{margin-left:220px;padding:32px;min-height:100vh}.page-title{font-size:22px;font-weight:900;margin-bottom:4px}.page-sub{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:28px}.card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px;margin-bottom:20px}.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}.badge-green{background:rgba(14,203,129,0.12);color:#0ECB81}.badge-yellow{background:rgba(240,185,11,0.12);color:#F0B90B}.badge-red{background:rgba(255,77,77,0.12);color:#ff6b6b}.badge-gray{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}.badge-blue{background:rgba(88,101,242,0.12);color:#818cf8}table{width:100%;border-collapse:collapse}th{text-align:left;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;padding:0 0 12px;font-weight:700}td{padding:12px 0;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:middle}tr:last-child td{border:none}.empty{text-align:center;padding:40px;color:rgba(255,255,255,0.3);font-size:13px}.btn{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:inherit;transition:all .15s}.btn-primary{background:#F0B90B;color:#000}.btn-primary:hover{background:#FFD000}.btn-danger{background:rgba(255,77,77,0.1);border:1px solid rgba(255,77,77,0.2);color:#ff6b6b}.btn-danger:hover{background:rgba(255,77,77,0.2)}.btn-success{background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.2);color:#0ECB81}.btn-success:hover{background:rgba(14,203,129,0.2)}.btn-ghost{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);color:#fff}.btn-ghost:hover{background:rgba(255,255,255,0.12)}.btn-sm{padding:4px 12px;font-size:12px;border-radius:6px}.input{background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 12px;font-size:13px;color:#fff;outline:none;font-family:inherit;width:100%;transition:border-color .15s}.input:focus{border-color:rgba(240,185,11,0.4)}.select{background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 12px;font-size:13px;color:#fff;outline:none;font-family:inherit}.label{font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px}.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px}.modal{background:#0F1318;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px;width:100%;max-width:560px;max-height:85vh;overflow-y:auto}.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;margin-bottom:28px}.stat-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px}.stat-val{font-size:2rem;font-weight:900;color:#F0B90B}.stat-lbl{font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-top:4px}`;
export default function AdminLayout({ children }) {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("adminToken");
    const emp = localStorage.getItem("adminEmployee");
    if (!t) { router.push("/admin/login"); return; }
    try { setEmployee(JSON.parse(emp)); } catch(e) { router.push("/admin/login"); }
  }, []);
  const logout = () => { localStorage.removeItem("adminToken"); localStorage.removeItem("adminEmployee"); router.push("/admin/login"); };
  if (!mounted || !employee) return <div style={{background:"#0B0E11",minHeight:"100vh"}} />;
  const nav = [
    {href:"/admin",label:"Dashboard",icon:"📊"},
    {href:"/admin/assets",label:"Assets",icon:"🏢"},
    {href:"/admin/kyc",label:"KYC Review",icon:"🪪"},
    {href:"/admin/market",label:"Market",icon:"📈"},
    {href:"/admin/support",label:"Support",icon:"💬"},
  ];
  return (
    <>
      <style>{CSS}</style>
      <div className="sidebar">
        <div className="logo">NXT</div>
        <div className="logo-sub">ADMIN PORTAL</div>
        {nav.map(n => {
          const active = n.href === "/admin" ? router.pathname === "/admin" : router.pathname.startsWith(n.href);
          return <Link key={n.href} href={n.href} className={`nav-item${active ? " active" : ""}`}><span>{n.icon}</span>{n.label}</Link>;
        })}
        <div className="nav-bottom">
          <div className="user-info"><div className="user-name">{employee.firstName} {employee.lastName}</div><div className="user-role">{employee.role}</div></div>
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </div>
      <div className="main">{children}</div>
    </>
  );
}
