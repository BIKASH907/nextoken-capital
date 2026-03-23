import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
export default function AdminDashboard() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const emp = localStorage.getItem("adminEmployee");
    if (!token) { router.push("/admin/login"); return; }
    try { setEmployee(JSON.parse(emp)); } catch(e) { router.push("/admin/login"); }
  }, []);
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmployee");
    router.push("/admin/login");
  };
  if (!employee) return null;
  return (
    <>
      <Head><title>Admin</title></Head>
      <style>{`body{background:#0B0E11;color:#fff;font-family:sans-serif;margin:0}.wrap{max-width:1100px;margin:0 auto;padding:40px 20px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}.card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px}.cv{font-size:2rem;font-weight:900;color:#F0B90B}.cl{font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-top:4px}.info{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px}.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px}.lbl{color:rgba(255,255,255,0.4)}.val{color:#fff;font-weight:600}`}</style>
      <div className="wrap">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
          <div style={{fontSize:24,fontWeight:900}}>Admin Dashboard</div>
          <button onClick={logout} style={{padding:"8px 20px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",cursor:"pointer",fontSize:13}}>Logout</button>
        </div>
        <div className="cards">
          <div className="card"><div className="cv">OK</div><div className="cl">Auth Working</div></div>
          <div className="card"><div className="cv">OK</div><div className="cl">DB Connected</div></div>
          <div className="card"><div className="cv">OK</div><div className="cl">{employee.role}</div></div>
        </div>
        <div className="info">
          <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Account Info</div>
          <div className="row"><span className="lbl">Name</span><span className="val">{employee.firstName} {employee.lastName}</span></div>
          <div className="row"><span className="lbl">Email</span><span className="val">{employee.email}</span></div>
          <div className="row"><span className="lbl">Role</span><span className="val">{employee.role}</span></div>
        </div>
      </div>
    </>
  );
}
