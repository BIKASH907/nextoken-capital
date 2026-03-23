import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function AdminSidebar() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  useEffect(() => {
    try { setEmployee(JSON.parse(localStorage.getItem("adminEmployee"))); } catch(e) {}
  }, []);
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmployee");
    router.push("/admin/login");
  };
  const nav = [
    { href:"/admin", label:"🏠 Dashboard" },
    { href:"/admin/assets", label:"🏢 Assets" },
    { href:"/admin/kyc", label:"🪪 KYC Review" },
    { href:"/admin/users", label:"👥 Users" },
    { href:"/admin/support", label:"💬 Support" },
    { href:"/admin/market", label:"📈 Market" },
  ];
  return (
    <div style={{position:"fixed",top:0,left:0,width:220,height:"100vh",background:"#0F1318",borderRight:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",padding:"24px 16px",zIndex:100}}>
      <div style={{fontSize:20,fontWeight:900,color:"#F0B90B",marginBottom:4}}>NXT</div>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:2,marginBottom:32}}>ADMIN PORTAL</div>
      {nav.map(n => (
        <button key={n.href} onClick={() => router.push(n.href)} style={{display:"flex",alignItems:"center",padding:"10px 14px",borderRadius:8,fontSize:13,fontWeight:600,color:router.pathname===n.href?"#F0B90B":"rgba(255,255,255,0.5)",background:router.pathname===n.href?"rgba(240,185,11,0.1)":"none",border:"none",width:"100%",textAlign:"left",cursor:"pointer",marginBottom:4,transition:"all .15s"}}>{n.label}</button>
      ))}
      <div style={{marginTop:"auto"}}>
        {employee && <div style={{padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.04)",marginBottom:8}}>
          <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{employee.firstName} {employee.lastName}</div>
          <div style={{fontSize:11,color:"#F0B90B",marginTop:2}}>{employee.role}</div>
        </div>}
        <button onClick={logout} style={{width:"100%",padding:"10px 14px",borderRadius:8,background:"rgba(255,77,77,0.08)",border:"1px solid rgba(255,77,77,0.15)",color:"#ff6b6b",fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left"}}>Sign Out</button>
      </div>
    </div>
  );
}
