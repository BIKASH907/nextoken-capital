import Head from "next/head";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

const markets = [
  { pair: "BTC/EUR", type: "Crypto", price: "62,054.31", change: "+2.84%" },
  { pair: "ETH/EUR", type: "Crypto", price: "1,913.01", change: "-1.24%" },
  { pair: "BNB/EUR", type: "Crypto", price: "568.90", change: "+0.92%" },
  { pair: "BTC/USDT", type: "Crypto", price: "67,120.44", change: "+1.18%" },
  { pair: "SOL/EUR", type: "Crypto", price: "98.42", change: "-0.88%" },
  { pair: "XRP/EUR", type: "Crypto", price: "0.59", change: "+0.44%" },
];

const bids = [
  { price: "62,040.00", amount: "0.2500", total: "15,510.00" },
  { price: "62,025.50", amount: "0.3700", total: "22,949.44" },
  { price: "62,010.00", amount: "0.4900", total: "30,384.90" },
  { price: "61,998.20", amount: "0.6100", total: "37,818.90" },
  { price: "61,985.00", amount: "0.7300", total: "45,249.05" },
  { price: "61,972.40", amount: "0.8500", total: "52,676.54" },
];

const asks = [
  { price: "62,070.00", amount: "0.2800", total: "17,379.60" },
  { price: "62,084.20", amount: "0.4200", total: "26,075.36" },
  { price: "62,099.00", amount: "0.5600", total: "34,775.44" },
  { price: "62,110.50", amount: "0.7000", total: "43,477.35" },
  { price: "62,126.80", amount: "0.8400", total: "52,186.51" },
  { price: "62,140.00", amount: "1.1200", total: "69,596.80" },
];

const balances = [
  { asset: "EUR", amount: "25,000.00" },
  { asset: "USDT", amount: "10,000.00" },
  { asset: "BTC", amount: "0.35" },
  { asset: "ETH", amount: "4.20" },
  { asset: "BNB", amount: "18.00" },
];

export default function ExchangePage() {
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("limit");
  const [price, setPrice] = useState("62054.31");
  const [amount, setAmount] = useState("");
  const [activeMobileTab, setActiveMobileTab] = useState("chart");

  const total = useMemo(() => {
    const p = parseFloat(price || "0");
    const a = parseFloat(amount || "0");
    if (!p || !a) return "0.00";
    return (p * a).toFixed(2);
  }, [price, amount]);

  return (
    <>
      <Head>
        <title>Exchange | Nextoken Capital</title>
        <meta
          name="description"
          content="Responsive exchange terminal for Nextoken Capital."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className="exchangePage">
        <section className="exchangeShell">
          <div className="topBar">
            <div className="pairInfo">
              <div className="pairMain">
                <h1>{selectedMarket.pair}</h1>
                <span className={`change ${selectedMarket.change.startsWith("-") ? "down" : "up"}`}>
                  {selectedMarket.change}
                </span>
              </div>
              <p>{selectedMarket.type} live trading terminal</p>
            </div>

            <div className="topStats">
              <div className="statCard">
                <span>Last Price</span>
                <strong>{selectedMarket.price}</strong>
              </div>
              <div className="statCard">
                <span>24h High</span>
                <strong>62,880.10</strong>
              </div>
              <div className="statCard">
                <span>24h Low</span>
                <strong>61,220.40</strong>
              </div>
              <div className="statCard">
                <span>24h Volume</span>
                <strong>1,248 BTC</strong>
              </div>
            </div>
          </div>

          <div className="mobileTabs">
            <button
              className={activeMobileTab === "chart" ? "active" : ""}
              onClick={() => setActiveMobileTab("chart")}
            >
              Chart
            </button>
            <button
              className={activeMobileTab === "book" ? "active" : ""}
              onClick={() => setActiveMobileTab("book")}
            >
              Book
            </button>
            <button
              className={activeMobileTab === "trade" ? "active" : ""}
              onClick={() => setActiveMobileTab("trade")}
            >
              Trade
            </button>
            <button
              className={activeMobileTab === "wallet" ? "active" : ""}
              onClick={() => setActiveMobileTab("wallet")}
            >
              Wallet
            </button>
          </div>

          <div className="terminalGrid">
            <aside className="panel panelMarkets">
              <div className="panelHeader">
                <h2>Markets</h2>
              </div>

              <div className="marketSearch">
                <input type="text" placeholder="Search market" />
              </div>

              <div className="marketList">
                {markets.map((market) => (
                  <button
                    key={market.pair}
                    className={`marketRow ${selectedMarket.pair === market.pair ? "selected" : ""}`}
                    onClick={() => setSelectedMarket(market)}
                  >
                    <div>
                      <strong>{market.pair}</strong>
                      <span>{market.type}</span>
                    </div>
                    <div className="marketRowRight">
                      <strong>{market.price}</strong>
                      <span className={market.change.startsWith("-") ? "down" : "up"}>
                        {market.change}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <section
              className={`panel panelChart mobilePane ${
                activeMobileTab === "chart" ? "showMobile" : ""
              }`}
            >
              <div className="panelHeader">
                <h2>Advanced Chart</h2>
              </div>

              <div className="chartBox">
                <div className="chartArea">
                  <div className="chartGlow" />
                  <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="chartSvg">
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      points="0,32 8,28 16,30 24,22 32,18 40,20 48,12 56,14 64,10 72,16 80,8 88,12 100,4"
                    />
                  </svg>
                </div>

                <div className="chartTimes">
                  <span>1H</span>
                  <span className="active">4H</span>
                  <span>1D</span>
                  <span>1W</span>
                  <span>1M</span>
                </div>
              </div>

              <div className="historyPanel">
                <div className="panelHeader small">
                  <h2>Order History</h2>
                </div>
                <div className="emptyState">No orders yet.</div>
              </div>
            </section>

            <section
              className={`panel panelBook mobilePane ${
                activeMobileTab === "book" ? "showMobile" : ""
              }`}
            >
              <div className="panelHeader">
                <h2>Order Book</h2>
              </div>

              <div className="bookHeader">
                <span>Price</span>
                <span>Amount</span>
                <span>Total</span>
              </div>

              <div className="bookSection">
                <div className="bookLabel ask">Asks</div>
                {asks.map((row, i) => (
                  <div className="bookRow" key={`ask-${i}`}>
                    <span className="down">{row.price}</span>
                    <span>{row.amount}</span>
                    <span>{row.total}</span>
                  </div>
                ))}
              </div>

              <div className="midPrice">{selectedMarket.price}</div>

              <div className="bookSection">
                <div className="bookLabel bid">Bids</div>
                {bids.map((row, i) => (
                  <div className="bookRow" key={`bid-${i}`}>
                    <span className="up">{row.price}</span>
                    <span>{row.amount}</span>
                    <span>{row.total}</span>
                  </div>
                ))}
              </div>
            </section>

            <aside
              className={`panel panelTrade mobilePane ${
                activeMobileTab === "trade" ? "showMobile" : ""
              }`}
            >
              <div className="panelHeader">
                <h2>Trade</h2>
              </div>

              <div className="segmented">
                <button
                  className={side === "buy" ? "active buy" : ""}
                  onClick={() => setSide("buy")}
                >
                  Buy
                </button>
                <button
                  className={side === "sell" ? "active sell" : ""}
                  onClick={() => setSide("sell")}
                >
                  Sell
                </button>
              </div>

              <div className="orderTypeTabs">
                <button
                  className={orderType === "limit" ? "active" : ""}
                  onClick={() => setOrderType("limit")}
                >
                  Limit
                </button>
                <button
                  className={orderType === "market" ? "active" : ""}
                  onClick={() => setOrderType("market")}
                >
                  Market
                </button>
              </div>

              <div className="formGroup">
                <label>Price (EUR)</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                />
              </div>

              <div className="formGroup">
                <label>Amount (BTC)</label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="formGroup">
                <label>Total (EUR)</label>
                <input value={total} readOnly />
              </div>

              <div className="quickAmounts">
                <button>25%</button>
                <button>50%</button>
                <button>75%</button>
                <button>100%</button>
              </div>

              <div className="availRow">
                <span>Available Quote</span>
                <strong>25,000.00 EUR</strong>
              </div>
              <div className="availRow">
                <span>Available Base</span>
                <strong>0.35 BTC</strong>
              </div>

              <button className={`submitBtn ${side}`}>
                {side === "buy" ? "Buy BTC" : "Sell BTC"}
              </button>
            </aside>

            <section
              className={`panel panelWallet mobilePane ${
                activeMobileTab === "wallet" ? "showMobile" : ""
              }`}
            >
              <div className="panelHeader">
                <h2>Wallet Balances</h2>
              </div>

              <div className="walletList">
                {balances.map((item) => (
                  <div className="walletRow" key={item.asset}>
                    <span>{item.asset}</span>
                    <strong>{item.amount}</strong>
                  </div>
                ))}
              </div>

              <button className="resetBtn">Reset Demo Wallet</button>
            </section>
          </div>
        </section>
      </main>

      <style jsx>{`
        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          padding: 0;
          background: #0b0e11;
          color: #eaecef;
          font-family: Arial, sans-serif;
          overflow-x: hidden;
        }

        :global(*) {
          box-sizing: border-box;
        }

        .exchangePage {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(240, 185, 11, 0.08), transparent 25%),
            #0b0e11;
          padding-top: 84px;
        }

        .exchangeShell {
          max-width: 1440px;
          margin: 0 auto;
          padding: 16px;
        }

        .topBar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .pairInfo,
        .topStats {
          background: #161a1e;
          border: 1px solid #232a32;
          border-radius: 16px;
        }

        .pairInfo {
          flex: 1;
          min-width: 280px;
          padding: 18px;
        }

        .pairMain {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .pairMain h1 {
          margin: 0;
          font-size: 1.8rem;
          color: #f0b90b;
        }

        .pairInfo p {
          margin: 8px 0 0;
          color: #9aa4af;
        }

        .topStats {
          flex: 2;
          min-width: 320px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          overflow: hidden;
        }

        .statCard {
          padding: 16px;
          background: #161a1e;
        }

        .statCard span {
          display: block;
          color: #848e9c;
          font-size: 0.82rem;
          margin-bottom: 6px;
        }

        .statCard strong {
          font-size: 1rem;
          color: #ffffff;
        }

        .mobileTabs {
          display: none;
          gap: 8px;
          margin-bottom: 14px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .mobileTabs button {
          border: 1px solid #2b3139;
          background: #161a1e;
          color: #cbd5df;
          border-radius: 10px;
          padding: 10px 14px;
          white-space: nowrap;
          cursor: pointer;
        }

        .mobileTabs button.active {
          background: #f0b90b;
          color: #111;
          border-color: #f0b90b;
          font-weight: 700;
        }

        .terminalGrid {
          display: grid;
          grid-template-columns: 280px minmax(0, 1.45fr) minmax(300px, 0.75fr) 320px;
          gap: 16px;
          align-items: start;
        }

        .panel {
          background: #161a1e;
          border: 1px solid #232a32;
          border-radius: 16px;
          overflow: hidden;
          min-width: 0;
        }

        .panelHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 16px 12px;
          border-bottom: 1px solid #232a32;
        }

        .panelHeader.small {
          padding-top: 14px;
        }

        .panelHeader h2 {
          margin: 0;
          font-size: 1rem;
          color: #ffffff;
        }

        .marketSearch {
          padding: 14px 16px;
          border-bottom: 1px solid #232a32;
        }

        .marketSearch input,
        .formGroup input {
          width: 100%;
          border: 1px solid #2b3139;
          background: #0f1318;
          color: #fff;
          border-radius: 10px;
          padding: 12px 14px;
          outline: none;
          font-size: 0.95rem;
        }

        .marketList {
          max-height: 650px;
          overflow-y: auto;
        }

        .marketRow {
          width: 100%;
          border: 0;
          background: transparent;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
          padding: 14px 16px;
          border-bottom: 1px solid #20262d;
          cursor: pointer;
          gap: 12px;
        }

        .marketRow:hover,
        .marketRow.selected {
          background: #1b222a;
        }

        .marketRow strong {
          display: block;
          font-size: 0.95rem;
        }

        .marketRow span {
          display: block;
          font-size: 0.8rem;
          color: #8d98a5;
          margin-top: 4px;
        }

        .marketRowRight {
          text-align: right;
        }

        .chartBox {
          padding: 16px;
        }

        .chartArea {
          position: relative;
          height: 360px;
          border-radius: 16px;
          background:
            linear-gradient(to bottom, rgba(240, 185, 11, 0.08), rgba(240, 185, 11, 0.01)),
            #0f1318;
          border: 1px solid #232a32;
          overflow: hidden;
          color: #f0b90b;
        }

        .chartGlow {
          position: absolute;
          inset: auto auto 0 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(240,185,11,0.1), transparent 55%);
          pointer-events: none;
        }

        .chartSvg {
          width: 100%;
          height: 100%;
          display: block;
          padding: 24px 16px;
        }

        .chartTimes {
          display: flex;
          gap: 10px;
          margin-top: 14px;
          flex-wrap: wrap;
        }

        .chartTimes span {
          padding: 8px 10px;
          border-radius: 8px;
          background: #0f1318;
          color: #aeb7c2;
          border: 1px solid #232a32;
          font-size: 0.85rem;
        }

        .chartTimes span.active {
          background: #f0b90b;
          color: #111;
          border-color: #f0b90b;
          font-weight: 700;
        }

        .historyPanel {
          border-top: 1px solid #232a32;
        }

        .emptyState {
          color: #8d98a5;
          padding: 18px 16px 20px;
        }

        .bookHeader,
        .bookRow {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding: 10px 16px;
          font-size: 0.88rem;
        }

        .bookHeader {
          color: #848e9c;
          border-bottom: 1px solid #232a32;
        }

        .bookRow {
          color: #d7dde4;
        }

        .bookLabel {
          padding: 12px 16px 6px;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #8d98a5;
        }

        .midPrice {
          padding: 14px 16px;
          font-size: 1.2rem;
          font-weight: 800;
          color: #f0b90b;
          border-top: 1px solid #232a32;
          border-bottom: 1px solid #232a32;
          background: #11161b;
        }

        .segmented,
        .orderTypeTabs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding: 16px;
        }

        .segmented button,
        .orderTypeTabs button,
        .quickAmounts button,
        .resetBtn {
          cursor: pointer;
          border-radius: 10px;
          border: 1px solid #2b3139;
          background: #0f1318;
          color: #d6dbe1;
          padding: 11px 12px;
          font-weight: 600;
        }

        .segmented button.active.buy {
          background: #0ecb81;
          border-color: #0ecb81;
          color: #08130e;
        }

        .segmented button.active.sell {
          background: #f6465d;
          border-color: #f6465d;
          color: #1a090d;
        }

        .orderTypeTabs {
          padding-top: 0;
        }

        .orderTypeTabs button.active {
          background: #f0b90b;
          color: #111;
          border-color: #f0b90b;
        }

        .formGroup {
          padding: 0 16px 14px;
        }

        .formGroup label {
          display: block;
          color: #8d98a5;
          font-size: 0.84rem;
          margin-bottom: 8px;
        }

        .quickAmounts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          padding: 0 16px 14px;
        }

        .availRow {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 0 16px 10px;
          color: #9aa4af;
          font-size: 0.9rem;
        }

        .availRow strong {
          color: #fff;
        }

        .submitBtn {
          margin: 16px;
          width: calc(100% - 32px);
          border: 0;
          border-radius: 12px;
          padding: 14px 16px;
          font-weight: 800;
          cursor: pointer;
          font-size: 1rem;
        }

        .submitBtn.buy {
          background: #0ecb81;
          color: #09150f;
        }

        .submitBtn.sell {
          background: #f6465d;
          color: #18090d;
        }

        .walletList {
          padding: 10px 16px 4px;
        }

        .walletRow {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 0;
          border-bottom: 1px solid #232a32;
        }

        .walletRow span {
          color: #9aa4af;
        }

        .walletRow strong {
          color: #fff;
        }

        .resetBtn {
          width: calc(100% - 32px);
          margin: 16px;
        }

        .up {
          color: #0ecb81 !important;
        }

        .down {
          color: #f6465d !important;
        }

        @media (max-width: 1280px) {
          .terminalGrid {
            grid-template-columns: 250px minmax(0, 1fr) 300px;
          }

          .panelWallet {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 1024px) {
          .topStats {
            grid-template-columns: repeat(2, 1fr);
          }

          .terminalGrid {
            grid-template-columns: 1fr 1fr;
          }

          .panelMarkets,
          .panelChart,
          .panelBook,
          .panelTrade,
          .panelWallet {
            grid-column: auto;
          }

          .panelChart {
            grid-column: 1 / -1;
          }

          .panelWallet {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .exchangePage {
            padding-top: 76px;
          }

          .exchangeShell {
            padding: 12px;
          }

          .topBar {
            margin-bottom: 12px;
          }

          .pairMain h1 {
            font-size: 1.4rem;
          }

          .topStats {
            grid-template-columns: repeat(2, 1fr);
          }

          .mobileTabs {
            display: flex;
          }

          .terminalGrid {
            display: block;
          }

          .panelMarkets {
            margin-bottom: 12px;
          }

          .mobilePane {
            display: none;
          }

          .mobilePane.showMobile {
            display: block;
            margin-bottom: 12px;
          }

          .chartArea {
            height: 240px;
          }

          .bookHeader,
          .bookRow {
            font-size: 0.8rem;
            gap: 6px;
            padding-left: 12px;
            padding-right: 12px;
          }

          .quickAmounts {
            grid-template-columns: repeat(2, 1fr);
          }

          .panelHeader,
          .marketSearch,
          .chartBox,
          .walletList,
          .segmented,
          .orderTypeTabs,
          .formGroup,
          .quickAmounts {
            padding-left: 12px;
            padding-right: 12px;
          }

          .submitBtn,
          .resetBtn {
            width: calc(100% - 24px);
            margin: 12px;
          }
        }

        @media (max-width: 480px) {
          .topStats {
            grid-template-columns: 1fr;
          }

          .pairInfo {
            min-width: 0;
          }

          .pairMain {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .mobileTabs button {
            padding: 9px 12px;
            font-size: 0.9rem;
          }

          .statCard {
            padding: 14px;
          }
        }
      `}</style>
    </>
  );
}