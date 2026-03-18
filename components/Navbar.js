import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  return (
    <>
      <nav className="navbar">
        <div className="navInner">
          <div className="navLogo" onClick={() => router.push("/")}>
            <div className="logoIcon">NXT</div>
            <span className="logoText">
              NEXTOKEN<span className="logoBold">CAPITAL</span>
            </span>
          </div>
          <div className="navLinks">
            <button onClick={() => router.push("/")}>Home</button>
            <button onClick={() => router.push("/markets")}>Markets</button>
            <button onClick={() => router.push("/bonds")}>Bonds</button>
            <button onClick={() => router.push("/equity")}>Equity</button>
            <button onClick={() => router.push("/exchange")}>Exchange</button>
            <button onClick={() => router.push("/tokenize")}>Tokenize</button>
          </div>
          <button className="navCta" onClick={() => router.push("/dashboard")}>
            Dashboard
          </button>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 72px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(5, 6, 10, 0.9);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .navInner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 18px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .navLogo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .logoIcon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ffda7a, #f5a623);
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 18px;
          color: #111;
        }
        .logoText {
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 1px;
          color: #eef1ff;
          text-transform: uppercase;
        }
        .logoBold {
          font-weight: 800;
        }
        .navLinks {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
          justify-content: center;
        }
        .navLinks button {
          background: none;
          border: none;
          color: rgba(238, 241, 255, 0.75);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 10px;
          transition: all 0.18s;
        }
        .navLinks button:hover {
          color: #ffda7a;
          background: rgba(255, 218, 122, 0.08);
        }
        .navCta {
          flex-shrink: 0;
          padding: 9px 20px;
          border-radius: 12px;
          border: 0;
          background: linear-gradient(135deg, #ffda7a, #f5c15a);
          color: #111;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(255, 193, 90, 0.25);
        }
        .navCta:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(255, 193, 90, 0.35);
        }
        @media (max-width: 768px) {
          .navLinks {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
