import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [router.asPath]);

  const links = [
    { href: "/markets",    label: "Markets" },
    { href: "/exchange",   label: "Exchange" },
    { href: "/bonds",      label: "Bonds" },
    { href: "/equity-ipo", label: "Equity & IPO" },
    { href: "/tokenize",   label: "Tokenize" },
  ];

  const isActive = (href) => router.asPath === href;

  return (
    <>
      <style>{`
        .nb{position:fixed;top:0;left:0;right:0;z-index:1000;height:64px;display:flex;align-items:center;transition:background .2s,border-color .2s}
        .nb.sc{background:#0B0E11;border-bottom:1px solid rgba(240,185,11,0.2);box-shadow:0 2px 20px rgba(0,0,0,0.4)}
        .nb.tp{background:rgba(11,14,17,0.9);border-bottom:1px solid rgba(255,255,255,0.06)}
        .nb-in{width:100%;max-width:1280px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;gap:16px}
        .nb-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0}
        .nb-nxt{font-size:20px;font-weight:900;color:#F0B90B;letter-spacing:-.5px}
        .nb-div{width:1px;height:26px;background:rgba(255,255,255,0.2)}
        .nb-txt{display:flex;flex-direction:column;line-height:1.2}
        .nb-t1{font-size:11px;font-weight:800;color:#fff;letter-spacing:2px}
        .nb-t2{font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:3px}
        .nb-links{display:flex;align-items:center;gap:2px;flex:1;justify-content:center}
        .nb-links a{padding:7px 14px;border-radius:7px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.7);text-decoration:none;transition:color .15s,background .15s;white-space:nowrap}
        .nb-links a:hover{color:#fff;background:rgba(255,255,255,0.08)}
        .nb-links a.on{color:#F0B90B;background:rgba(240,185,11,0.1)}
        .nb-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
        .nb-login{padding:8px 16px;border-radius:7px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.8);background:transparent;border:1px solid rgba(255,255,255,0.18);text-decoration:none;transition:all .15s;white-space:nowrap}
        .nb-login:hover{border-color:rgba(255,255,255,0.45);color:#fff}
        .nb-register{padding:8px 18px;border-radius:7px;font-size:13px;font-weight:700;color:#000;background:#F0B90B;border:none;text-decoration:none;transition:background .15s;cursor:pointer;white-space:nowrap}
        .nb-register:hover{background:#FFD000}
        .nb-burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}
        .nb-burger span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:all .25s}
        .nb-mob{display:none;position:fixed;top:64px;left:0;right:0;bottom:0;background:rgba(9,12,15,0.99);padding:20px;overflow-y:auto;z-index:999;flex-direction:column;gap:6px}
        .nb-mob.open{display:flex}
        .nb-mob a{display:block;padding:15px 18px;border-radius:10px;font-size:16px;font-weight:600;color:rgba(255,255,255,0.8);text-decoration:none;border:1px solid rgba(255,255,255,0.08);transition:all .15s}
        .nb-mob a:hover,.nb-mob a.on{color:#F0B90B;background:rgba(240,185,11,0.08);border-color:rgba(240,185,11,0.22)}
        .nb-mob-div{height:1px;background:rgba(255,255,255,0.08);margin:8px 0}
        .nb-mob-login{display:block;padding:14px 18px;border-radius:10px;font-size:15px;font-weight:700;color:rgba(255,255,255,0.8);text-decoration:none;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);text-align:center;margin-bottom:8px}
        .nb-mob-reg{display:block;padding:14px 18px;border-radius:10px;font-size:15px;font-weight:700;color:#000;text-decoration:none;background:#F0B90B;text-align:center}
        @media(max-width:900px){.nb-links{display:none}}
        @media(max-width:640px){.nb-login,.nb-register{display:none}.nb-burger{display:flex}}
      `}</style>

      <nav className={`nb ${scrolled ? "sc" : "tp"}`}>
        <div className="nb-in">
          <Link href="/" className="nb-logo">
            <span className="nb-nxt">NXT</span>
            <div className="nb-div" />
            <div className="nb-txt">
              <span className="nb-t1">NEXTOKEN</span>
              <span className="nb-t2">CAPITAL</span>
            </div>
          </Link>
          <div className="nb-links">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? "on" : ""}>{l.label}</Link>
            ))}
          </div>
          <div className="nb-right">
            <Link href="/login"    className="nb-login">Log In</Link>
            <Link href="/register" className="nb-register">Get Started</Link>
            <button className="nb-burger" onClick={() => setOpen(!open)} aria-label="Menu">
              <span style={{transform:open?"rotate(45deg) translate(5px,5px)":"none"}}/>
              <span style={{opacity:open?0:1}}/>
              <span style={{transform:open?"rotate(-45deg) translate(5px,-5px)":"none"}}/>
            </button>
          </div>
        </div>
      </nav>

      <div className={`nb-mob ${open ? "open" : ""}`}>
        {links.map(l => (
          <Link key={l.href} href={l.href} className={isActive(l.href) ? "on" : ""}>{l.label}</Link>
        ))}
        <div className="nb-mob-div" />
        <Link href="/login"    className="nb-mob-login">Log In</Link>
        <Link href="/register" className="nb-mob-reg">Get Started — Free</Link>
      </div>
    </>
  );
}