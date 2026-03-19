import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nextoken Capital | The Global Platform</title>
        <meta
          name="description"
          content="Institutional-grade private equity and tokenized bonds on regulated European infrastructure."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="page">
        <section className="hero">
          <div className="heroBg">
            <Image
              src="/hero-bg.jpg"
              alt="Global Finance Background"
              fill
              priority
              style={{ objectFit: "cover" }}
              className="bgImage"
            />
            <div className="overlay" />
          </div>

          <div className="heroContent">
            <div className="badgeWrap">
              <div className="badge">
                <span className="statusDot" />
                <span>MiCA Licensed • EU Regulated • DLT Pilot Regime</span>
              </div>
            </div>

            <div className="textWrap">
              <h1>
                The Global Platform <br />
                <span>for Tokenized Capital Markets</span>
              </h1>

              <p>
                Access institutional-grade private equity, venture capital, and
                tokenized bonds on a fully regulated European infrastructure.
              </p>
            </div>

            <div className="heroActions">
              <a href="/register" className="primaryBtn">
                Start Investing
              </a>
              <a href="/tokenize" className="secondaryBtn">
                Tokenize Assets
              </a>
            </div>

            <div className="statsGrid">
              <div className="statCard">
                <h3>Private Equity Access</h3>
                <p>
                  Discover curated investment opportunities with a modern
                  digital onboarding experience.
                </p>
              </div>

              <div className="statCard">
                <h3>Tokenized Bonds</h3>
                <p>
                  Access fixed-income products in a more transparent and
                  efficient digital market environment.
                </p>
              </div>

              <div className="statCard">
                <h3>Regulated Infrastructure</h3>
                <p>
                  Built for compliant capital formation with a global-first
                  approach to investor access.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="infoSection">
          <div className="container">
            <div className="sectionIntro">
              <span className="sectionTag">Why Nextoken Capital</span>
              <h2>Built for the next era of digital finance</h2>
              <p>
                Nextoken Capital combines institutional-grade presentation,
                investor-focused flows, and a premium interface designed for
                modern capital markets.
              </p>
            </div>

            <div className="featureGrid">
              <div className="featureCard">
                <h3>Investor Onboarding</h3>
                <p>
                  Streamlined entry points for investors with a clean interface
                  and clear capital market positioning.
                </p>
              </div>

              <div className="featureCard">
                <h3>Capital Formation</h3>
                <p>
                  Present equity, bonds, and tokenized offerings in one premium
                  environment.
                </p>
              </div>

              <div className="featureCard">
                <h3>Global Presentation</h3>
                <p>
                  A professional web presence designed to inspire confidence and
                  communicate scale.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #0b0e11;
          color: #ffffff;
        }

        .hero {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding-top: 80px;
          background: #0b0e11;
        }

        .heroBg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .bgImage {
          opacity: 0.28;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to bottom,
              rgba(11, 14, 17, 0.62),
              rgba(11, 14, 17, 0.86),
              rgba(11, 14, 17, 1)
            );
        }

        .heroContent {
          position: relative;
          z-index: 2;
          max-width: 1240px;
          margin: 0 auto;
          padding: 80px 24px 100px;
          text-align: center;
        }

        .badgeWrap {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.9);
        }

        .statusDot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 14px rgba(34, 197, 94, 0.7);
          flex-shrink: 0;
        }

        .textWrap {
          max-width: 980px;
          margin: 0 auto 40px;
        }

        .textWrap h1 {
          margin: 0 0 24px;
          font-size: clamp(46px, 8vw, 96px);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .textWrap h1 span {
          color: #f0b90b;
          text-shadow: 0 0 24px rgba(240, 185, 11, 0.18);
        }

        .textWrap p {
          max-width: 760px;
          margin: 0 auto;
          font-size: 20px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.66);
        }

        .heroActions {
          display: flex;
          justify-content: center;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 60px;
        }

        .primaryBtn,
        .secondaryBtn {
          min-width: 220px;
          min-height: 56px;
          padding: 16px 26px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          transition: all 0.2s ease;
        }

        .primaryBtn {
          background: #f0b90b;
          color: #111111;
          box-shadow: 0 0 28px rgba(240, 185, 11, 0.18);
        }

        .primaryBtn:hover {
          transform: translateY(-2px);
          background: #ffd24a;
        }

        .secondaryBtn {
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.03);
        }

        .secondaryBtn:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          margin-top: 10px;
        }

        .statCard {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 28px 24px;
          text-align: left;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .statCard h3 {
          margin: 0 0 12px;
          font-size: 20px;
          color: #ffffff;
        }

        .statCard p {
          margin: 0;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.66);
        }

        .infoSection {
          padding: 90px 24px 110px;
          background: linear-gradient(to bottom, #0b0e11, #09111f);
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
        }

        .sectionIntro {
          max-width: 780px;
          margin: 0 auto 46px;
          text-align: center;
        }

        .sectionTag {
          display: inline-block;
          margin-bottom: 14px;
          color: #f0b90b;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .sectionIntro h2 {
          margin: 0 0 18px;
          font-size: clamp(30px, 5vw, 48px);
          line-height: 1.15;
          font-weight: 800;
        }

        .sectionIntro p {
          margin: 0;
          color: rgba(255, 255, 255, 0.66);
          font-size: 18px;
          line-height: 1.8;
        }

        .featureGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .featureCard {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 28px 24px;
        }

        .featureCard h3 {
          margin: 0 0 12px;
          font-size: 20px;
        }

        .featureCard p {
          margin: 0;
          color: rgba(255, 255, 255, 0.66);
          font-size: 15px;
          line-height: 1.8;
        }

        @media (max-width: 900px) {
          .heroContent {
            padding: 60px 18px 80px;
          }

          .statsGrid,
          .featureGrid {
            grid-template-columns: 1fr;
          }

          .textWrap p {
            font-size: 17px;
          }

          .badge {
            letter-spacing: 0.08em;
            font-size: 11px;
            padding: 10px 14px;
          }
        }

        @media (max-width: 600px) {
          .hero {
            padding-top: 80px;
          }

          .textWrap h1 {
            font-size: 42px;
          }

          .heroActions {
            gap: 14px;
          }

          .primaryBtn,
          .secondaryBtn {
            width: 100%;
            min-width: 0;
          }
        }
      `}</style>
    </>
  );
}