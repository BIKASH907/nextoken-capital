import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const menuBtn = document.getElementById("menuBtn");
    const drawer = document.getElementById("drawer");

    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        drawer.classList.toggle("show");
      });
    }
  }, []);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="sparkle"></div>

      {/* HEADER */}
      <header className="topbar">
        <div className="container">
          <div className="topbar-inner">
            <div className="brand">
              <div className="logoMark"></div>
              <div className="brandText">
                <strong>NEXTOKEN</strong>
                <span>CAPITAL</span>
              </div>
            </div>

            <nav className="nav">
              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#">Contact</a>
            </nav>

            <div className="rightTools">
              <button className="btn" onClick={() => scrollToId("get-started")}>
                Get Started
              </button>
            </div>
          </div>

          <div className="drawer" id="drawer">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="hero">
        <div className="container">
          <section className="heroCard">
            <div className="heroInner">
              <div>
                <h1>
                  INVEST IN <span className="gold">TOKENIZED</span>
                  <br />
                  REAL-WORLD ASSETS
                </h1>

                <p>
                  Register and explore opportunities in property,
                  infrastructure, energy projects, and businesses.
                </p>

                <div className="heroActions">
                  <button className="btn">Register</button>
                  <button className="btnOutline">Learn More</button>
                </div>
              </div>

              <div className="heroVisual">
                <div className="coin">
                  <span>NXC</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* STYLE */}
      <style jsx global>{`
        body {
          margin: 0;
          background: #05060a;
          color: white;
          font-family: sans-serif;
        }

        .container {
          max-width: 1100px;
          margin: auto;
          padding: 0 20px;
        }

        .topbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: #0b0d14;
          z-index: 1000;
        }

        .topbar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logoMark {
          width: 30px;
          height: 30px;
          background: gold;
          border-radius: 8px;
        }

        .brandText span {
          font-size: 10px;
          color: gold;
        }

        .nav {
          display: flex;
          gap: 20px;
        }

        .btn {
          background: gold;
          border: none;
          padding: 10px 15px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
        }

        .hero {
          padding-top: 100px;
        }

        .heroCard {
          background: #111;
          border-radius: 20px;
          padding: 40px;
        }

        .heroInner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .gold {
          color: gold;
        }

        .btnOutline {
          border: 1px solid white;
          background: transparent;
          color: white;
          padding: 10px 15px;
          border-radius: 8px;
        }

        .heroVisual {
          width: 200px;
          height: 200px;
          background: #222;
          border-radius: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .coin {
          width: 100px;
          height: 100px;
          background: gold;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: black;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}