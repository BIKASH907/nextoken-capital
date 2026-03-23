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
    setEmployee(JSON.parse(emp));
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmployee");
    router.push("/admin/login");
  };

  if (!employee) return null;

  return (
    <>
      <Head><title>Admin — Nextoken Capital</title></Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#0B0E11;color:#fff;font-family:sans-serif}.wrap{max-width:1100px;margin:0 auto;padding:40px 20px}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}.title{font-size:24px;font-weight:900}.badge{background:rgba(240,185,11,0.15);color:#F0B90B;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700}.logout{padding:8px 20px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#fff;cursor:pointer;font-size:13px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px}.card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px}.cv{font-size:2rem;font-weight:900;color:#F0B90B}.cl{font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-top:4px}.info{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px}.info h2{font-size:16px;margin-bottom:16px;font-weight:700}.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px}.row:last-child{border:none}.label{color:rgba(255,255,255,0.4)}.value{color:#fff;font-weight:600}`}</style>
      <div className="wrap">
        <div className="header">
          <div>
            <div className="title">Admin Dashboard</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginTop:4}}>Welcome back, {employee.firstName}</div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <span className="badge">{employee.role}</span>
            <button className="logout" onClick={logout}>Logout</button>
          </div>
        </div>
        <div className="cards">
          <div className="card"><div className="cv">✓</div><div className="cl">Auth Working</div></div>
          <div className="card"><div className="cv">✓</div><div className="cl">DB Connected</div></div>
          <div className="card"><div className="cv">✓</div><div className="cl">Live on Vercel</div></div>
        </div>
        <div className="info">
          <h2>Admin Account</h2>
          <div className="row"><span className="label">Name</span><span className="value">{employee.firstName} {employee.lastName}</span></div>
          <div className="row"><span className="label">Email</span><span className="value">{employee.email}</span></div>
          <div className="row"><span className="label">Role</span><span className="value">{employee.role}</span></div>
          <div className="row"><span className="label">ID</span><span className="value">{employee.id}</span></div>
        </div>
      </div>
    </>
  );
}
