import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nextoken Capital</title>
        <meta
          name="description"
          content="Nextoken Capital digital capital markets platform"
        />
      </Head>

      <main className="homePage">
        <section className="heroSection">
          <div className="heroContainer">
            <div className="heroContent">
              <span className="heroTag">
                Trusted by modern digital investors
              </span>

              <h1>
                Buy, trade, and invest in digital capital markets
              </h1>

              <p>
                Nextoken Capital gives users a premium gateway into markets,
                tokenized products, and investor-ready digital offerings with a
                fast, clean, exchange-inspired experience.
              </p>

              <div className="heroActions">
                <a href="/register" className="primaryBtn">
                  Get Started
                </a>
                <a href="/markets" className="secondaryBtn">
                  View Markets
                </a>
              </div>
            </div>

            <div className="heroCard">
              <div className="cardHeader">
                <span>Market Overview</span>
                <span className="liveBadge">Live</span>
              </div>

              <div className="chartBox">
                <div className="bar bar1" />
                <div className="bar bar2" />
                <div className="bar bar3" />
                <div className="bar bar4" />
                <div className="bar bar5" />
              </div>

              <div className="marketList">
                <div className="marketRow">
                  <div>
                    <strong>BTC</strong>
                    <p>Bitcoin</p>
                  </div>
                  <div className="marketRight">
                    <strong>$67,421.21</strong>
                    <span>+2.18%</span>
                  </div>
                </div>

                <div className="marketRow">
                  <div>
                    <strong>ETH</strong>
                    <p>Ethereum</p>
                  </div>
                  <div className="marketRight">
                    <strong>$3,412.55</strong>
                    <span>+1.44%</span>
                  </div>
                </div>

                <div className="marketRow">
                  <div>
                    <strong>BNB</strong>
                    <p>BNB</p>
                  </div>
                  <div className="marketRight">
                    <strong>$592.30</strong>
                    <span>+0.86%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <style jsx>{`
          .homePage {
            min-height: 100vh;
            background:
              radial-gradient(
                900px 500px at 20% 10%,
                rgba(240, 185, 11, 0.08),
                transparent 60%
              ),
              radial-gradient(
                700px 400px at 90% 20%,
                rgba(255, 255, 255, 0.04),
                transparent 60%
              ),
              linear-gradient(180deg, #05070d 0%, #0b0e11 100%);
            color: #ffffff;
          }

          .heroSection {
            padding: 48px 20px 60px;
          }

          .heroContainer {
            max-width: 1280px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 36px;
            align-items: center;
          }

          .heroContent {
            max-width: 760px;
          }

          .heroTag {
            display: inline-block;
            margin-bottom: 18px;
            color: #f0b90b;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .heroContent h1 {
            margin: 0 0 18px;
            font-size: 78px;
            line-height: 0.96;
            font-weight: 900;
            letter-spacing: -2px;
          }

          .heroContent p {
            margin: 0;
            max-width: 760px;
            color: rgba(255, 255, 255, 0.74);
            font-size: 18px;
            line-height: 1.7;
          }

          .heroActions {
            display: flex;
            gap: 14px;
            margin-top: 32px;
            flex-wrap: wrap;
          }

          .primaryBtn,
          .secondaryBtn {
            min-height: 48px;
            padding: 0 22px;
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 15px;
            font-weight: 800;
            transition: all 0.2s ease;
          }

          .primaryBtn {
            background: #f0b90b;
            color: #111111;
            border: 1px solid #f0b90b;
            box-shadow: 0 12px 28px rgba(240, 185, 11, 0.2);
          }

          .primaryBtn:hover {
            transform: translateY(-1px);
            box-shadow: 0 16px 32px rgba(240, 185, 11, 0.28);
          }

          .secondaryBtn {
            background: rgba(255, 255, 255, 0.04);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.14);
          }

          .secondaryBtn:hover {
            color: #f0b90b;
            border-color: rgba(240, 185, 11, 0.42);
          }

          .heroCard {
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.02)
            );
            box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
            padding: 26px;
          }

          .cardHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22px;
            font-size: 14px;
            font-weight: 700;
          }

          .liveBadge {
            background: #f0b90b;
            color: #111111;
            padding: 8px 14px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 800;
          }

          .chartBox {
            height: 240px;
            border-radius: 18px;
            padding: 20px;
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.03),
              rgba(240, 185, 11, 0.05)
            );
            display: flex;
            align-items: flex-end;
            gap: 16px;
            margin-bottom: 20px;
            overflow: hidden;
          }

          .bar {
            flex: 1;
            border-radius: 18px 18px 0 0;
            background: linear-gradient(180deg, #f0b90b, #9f7800);
          }

          .bar1 {
            height: 30%;
          }

          .bar2 {
            height: 48%;
          }

          .bar3 {
            height: 40%;
          }

          .bar4 {
            height: 68%;
          }

          .bar5 {
            height: 82%;
          }

          .marketList {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .marketRow {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 16px 18px;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }

          .marketRow strong {
            display: block;
            font-size: 16px;
            margin-bottom: 4px;
          }

          .marketRow p {
            margin: 0;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.56);
          }

          .marketRight {
            text-align: right;
          }

          .marketRight span {
            display: block;
            margin-top: 4px;
            color: #16c784;
            font-size: 14px;
            font-weight: 700;
          }

          @media (max-width: 1100px) {
            .heroContainer {
              grid-template-columns: 1fr;
            }

            .heroContent h1 {
              font-size: 58px;
              line-height: 1;
            }
          }

          @media (max-width: 640px) {
            .heroSection {
              padding: 28px 16px 40px;
            }

            .heroContent h1 {
              font-size: 40px;
              letter-spacing: -1px;
            }

            .heroContent p {
              font-size: 16px;
            }

            .heroActions {
              flex-direction: column;
            }

            .primaryBtn,
            .secondaryBtn {
              width: 100%;
            }

            .chartBox {
              height: 180px;
              gap: 10px;
            }

            .heroCard {
              padding: 18px;
            }
          }
        `}</style>
      </main>
    </>
  );
}