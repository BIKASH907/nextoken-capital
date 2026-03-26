import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
export default function AutoLogout({ timeoutMs, isAdmin }) {
  const router = useRouter();
  const timer = useRef(null);
  const logout = () => {
    if (isAdmin) { localStorage.removeItem("adminToken"); localStorage.removeItem("adminEmployee"); router.push("/admin/login"); }
    else { signOut({ callbackUrl: "/login" }); }
  };
  const reset = () => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(logout, timeoutMs); };
  useEffect(() => {
    const ev = ["mousedown","keydown","scroll","touchstart"];
    ev.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => { ev.forEach(e => window.removeEventListener(e, reset)); if (timer.current) clearTimeout(timer.current); };
  }, []);
  return null;
}
