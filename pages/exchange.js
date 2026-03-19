import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";

const PAIRS = [
  { label: "BNB/USDT", symbol: "BNBUSDT" },
  { label: "BTC/USDT", symbol: "BTCUSDT" },
  { label: "ETH/USDT", symbol: "ETHUSDT" },
  { label: "SOL/USDT", symbol: "SOLUSDT" },
  { label: "XRP/USDT", symbol: "XRPUSDT" },
  { label: "ADA/USDT", symbol: "ADAUSDT" },
  { label: "DOGE/USDT", symbol: "DOGEUSDT" },
  { label: "LINK/USDT", symbol: "LINKUSDT" },
  { label: "AVAX/USDT", symbol: "AVAXUSDT" },
  { label: "DOT/USDT", symbol: "DOTUSDT" },
];

const TIMEFRAMES = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "1h" },
  { label: "4h", value: "4h" },
  { label: "1d", value: "1d" },
];

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "--";
  if (n >= 1000) {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (n >= 1) {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  });
}

function formatSmall(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "--";
  if (n >= 1000000000) return `${(n / 1000000000).toFixed(2)}B`;
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(2)}K`;
  return n.toFixed(2);
}

function formatPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "--";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function useIsMobile(width = 980) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < width);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [width]);

  return isMobile;
}

function useTicker(symbol) {
  const [ticker, setTicker] = useState(null);

  useEffect(() => {
    let alive = true;
    let ws;

    async function load() {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const data = await res.json();
        if (alive) setTicker(data);
      } catch (error) {}
    }

    load();

    try {
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!alive) return;
          setTicker((prev) => ({
            ...(prev || {}),
            symbol,
            lastPrice: data.c,
            priceChangePercent: data.P,
            highPrice: data.h,
            lowPrice: data.l,
            quoteVolume: data.q,
          }));
        } catch (error) {}
      };
    } catch (error) {}

    return () => {
      alive = false;
      if (ws) ws.close();
    };
  }, [symbol]);

  return ticker;
}

function useSidebarTickers() {
  const [tickers, setTickers] = useState({});

  useEffect(() => {
    let active = true;

    async function loadAll() {
      try {
        const results = await Promise.all(
          PAIRS.map(async (pair) => {
            const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair.symbol}`);
            const data = await res.json();
            return [pair.symbol, data];
          })
        );
        if (active) {
          setTickers(Object.fromEntries(results));
        }
      } catch (error) {}
    }

    loadAll();
    const timer = setInterval(loadAll, 4000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return tickers;
}

function useCandles(symbol, interval) {
  const [candles, setCandles] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=90`
        );
        const data = await res.json();

        if (!active) return;

        setCandles(
          (data || []).map((row) => ({
            openTime: row[0],
            open: Number(row[1]),
            high: Number(row[2]),
            low: Number(row[3]),
            close: Number(row[4]),
            volume: Number(row[5]),
          }))
        );
      } catch (error) {}
    }

    load();
    return () => {
      active = false;
    };
  }, [symbol, interval]);

  return candles;
}

function useOrderBook(symbol) {
  const [book, setBook] = useState({ bids: [], asks: [] });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=14`);
        const data = await res.json();

        if (!active) return;

        const bids = (data.bids || []).map(([price, qty]) => ({
          price: Number(price),
          qty: Number(qty),
          total: Number(price) * Number(qty),
        }));

        const asks = (data.asks || []).map(([price, qty]) => ({
          price: Number(price),
          qty: Number(qty),
          total: Number(price) * Number(qty),
        }));

        setBook({ bids, asks });
      } catch (error) {}
    }

    load();
    const timer = setInterval(load, 2000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [symbol]);

  return book;
}

function useTrades(symbol) {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    let active = true;
    let ws;

    async function loadInitial() {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=24`);
        const data = await res.json();
        if (!active) return;

        setTrades(
          (data || []).map((item) => ({
            id: item.id,
            price: Number(item.price),
            qty: Number(item.qty),
            time: item.time,
            side: item.isBuyerMaker ? "sell" : "buy",
          }))
        );
      } catch (error) {}
    }

    loadInitial();

    try {
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
      ws.onmessage = (event) => {
        try {
          const item = JSON.parse(event.data);
          if (!active) return;

          setTrades((prev) => [
            {
              id: item.t,
              price: Number(item.p),
              qty: Number(item.q),
              time: item.T,
              side: item.m ? "sell" : "buy",
            },
            ...prev.slice(0, 23),
          ]);
        } catch (error) {}
      };
    } catch (error) {}

    return () => {
      active = false;
      if (ws) ws.close();
    };
  }, [symbol]);

  return trades;
}

function CandleChart({ candles, timeframe }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles.length) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const pad = { top: 14, right: 74, bottom: 28, left: 10 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const range = max - min || 1;
    const stepX = chartW / candles.length;
    const bodyW = Math.max(4, stepX * 0.58);

    const y = (price) => pad.top + chartH - ((price - min) / range) * chartH;

    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const py = pad.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, py);
      ctx.lineTo(width - pad.right, py);
      ctx.stroke();

      const value = max - (range / 5) * i;
      ctx.fillStyle = "rgba(175,185,196,0.78)";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(formatPrice(value), width - pad.right + 6, py + 4);
    }

    candles.forEach((candle, i) => {
      const x = pad.left + stepX * i + stepX / 2;
      const isUp = candle.close >= candle.open;
      const color = isUp ? "#0ECB81" : "#F6465D";

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y(candle.high));
      ctx.lineTo(x, y(candle.low));
      ctx.stroke();

      const top = y(Math.max(candle.open, candle.close));
      const bottom = y(Math.min(candle.open, candle.close));
      const heightBody = Math.max(2, bottom - top);

      ctx.fillStyle = color;
      ctx.fillRect(x - bodyW / 2, top, bodyW, heightBody);
    });

    const every = Math.max(1, Math.floor(candles.length / 6));
    ctx.fillStyle = "rgba(148,158,169,0.7)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";

    candles.forEach((c, i) => {
      if (i % every !== 0) return;
      const d = new Date(c.openTime);
      const label =
        timeframe === "1d"
          ? `${d.getMonth() + 1}/${d.getDate()}`
          : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      const x = pad.left + stepX * i + stepX / 2;
      ctx.fillText(label, x, height - 8);
    });
  }, [candles, timeframe]);

  return (
    <div className="chartCanvasShell">
      <canvas ref={canvasRef} className="chartCanvas" />
    </div>
  );
}

function MarketSidebar({ selectedPair, onSelect, tickers }) {
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    return PAIRS.filter((pair) =>
      pair.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <aside className="panel sidebarPanel">
      <div className="panelTitle">Markets</div>

      <div className="sidebarSearch">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pairs..."
        />
      </div>

      <div className="marketRows">
        {rows.map((pair) => {
          const ticker = tickers[pair.symbol];
          const price = ticker?.lastPrice;
          const change = ticker?.priceChangePercent;

          return (
            <button
              type="button"
              key={pair.symbol}
              className={`marketRow ${selectedPair.symbol === pair.symbol ? "marketRowActive" : ""}`}
              onClick={() => onSelect(pair)}
            >
              <div className="marketRowLeft">
                <div className="marketLabel">{pair.label}</div>
                <div className="marketSymbol">{pair.symbol}</div>
              </div>

              <div className="marketRowRight">
                <div className="marketPrice">{formatPrice(price)}</div>
                <div className={Number(change) >= 0 ? "upText" : "downText"}>
                  {formatPercent(change)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function OrderBookPanel({ asks, bids }) {
  const maxTotal = Math.max(
    1,
    ...asks.map((x) => x.total),
    ...bids.map((x) => x.total)
  );

  return (
    <div className="orderBookWrap">
      <div className="tableHead compactGrid">
        <span>Price</span>
        <span>Amount</span>
        <span>Total</span>
      </div>

      <div className="tableBody">
        {asks.slice().reverse().map((row, i) => (
          <div className="bookRow compactGrid" key={`ask-${i}`}>
            <div className="depthBar askBar" style={{ width: `${(row.total / maxTotal) * 100}%` }} />
            <span className="downText">{formatPrice(row.price)}</span>
            <span>{row.qty.toFixed(5)}</span>
            <span>{formatSmall(row.total)}</span>
          </div>
        ))}

        <div className="midRow">Mid Market</div>

        {bids.map((row, i) => (
          <div className="bookRow compactGrid" key={`bid-${i}`}>
            <div className="depthBar bidBar" style={{ width: `${(row.total / maxTotal) * 100}%` }} />
            <span className="upText">{formatPrice(row.price)}</span>
            <span>{row.qty.toFixed(5)}</span>
            <span>{formatSmall(row.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TradesPanel({ trades }) {
  return (
    <div className="tradesWrap">
      <div className="tableHead compactGrid">
        <span>Price</span>
        <span>Amount</span>
        <span>Time</span>
      </div>

      <div className="tableBody">
        {trades.map((trade) => {
          const d = new Date(trade.time);
          const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(
            d.getSeconds()
          ).padStart(2, "0")}`;

          return (
            <div className="tradeRow compactGrid" key={trade.id}>
              <span className={trade.side === "buy" ? "upText" : "downText"}>
                {formatPrice(trade.price)}
              </span>
              <span>{trade.qty.toFixed(5)}</span>
              <span className="mutedText">{time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TradeBox({ pair, lastPrice }) {
  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("limit");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");

  const base = pair.label.split("/")[0];

  useEffect(() => {
    if (lastPrice) {
      const n = Number(lastPrice);
      setPrice(String(n >= 1 ? n.toFixed(2) : n.toFixed(6)));
    }
  }, [lastPrice]);

  const total = ((Number(price) || 0) * (Number(amount) || 0)).toFixed(2);

  return (
    <div className="tradeBox">
      <div className="buySellSwitch">
        <button
          type="button"
          className={side === "buy" ? "activeBuy" : ""}
          onClick={() => setSide("buy")}
        >
          Buy
        </button>
        <button
          type="button"
          className={side === "sell" ? "activeSell" : ""}
          onClick={() => setSide("sell")}
        >
          Sell
        </button>
      </div>

      <div className="subTabs">
        {["limit", "market", "stop"].map((tab) => (
          <button
            type="button"
            key={tab}
            className={orderType === tab ? "subTabActive" : ""}
            onClick={() => setOrderType(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {orderType !== "market" && (
        <div className="formRow">
          <label>Price (USDT)</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      )}

      <div className="formRow">
        <label>Amount ({base})</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00000"
        />
      </div>

      <div className="percentRow">
        {[25, 50, 75, 100].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setAmount((p / 100).toFixed(2))}
          >
            {p}%
          </button>
        ))}
      </div>

      <div className="formRow">
        <label>Total (USDT)</label>
        <input value={total} readOnly />
      </div>

      <button
        type="button"
        className={`submitTradeBtn ${side === "buy" ? "buyBtn" : "sellBtn"}`}
      >
        {side === "buy" ? `Buy ${base}` : `Sell ${base}`}
      </button>

      <p className="loginHint">
        <Link href="/login">Log In</Link> or <Link href="/register">Register</Link>
      </p>
    </div>
  );
}

export default function Exchange() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  const [timeframe, setTimeframe] = useState("1h");
  const [rightTab, setRightTab] = useState("book");
  const [mobileTab, setMobileTab] = useState("chart");

  const isMobile = useIsMobile();

  const ticker = useTicker(selectedPair.symbol);
  const candles = useCandles(selectedPair.symbol, timeframe);
  const orderBook = useOrderBook(selectedPair.symbol);
  const trades = useTrades(selectedPair.symbol);
  const sideTickers = useSidebarTickers();

  const price = ticker?.lastPrice;
  const change = ticker?.priceChangePercent;
  const high = ticker?.highPrice;
  const low = ticker?.lowPrice;
  const volume = ticker?.quoteVolume;

  return (
    <>
      <Head>
        <title>{selectedPair.label} — Nextoken Capital Exchange</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="exchangePage">
        <div className="exchangeContainer">
          <section className="topBar panel">
            <div className="pairIdentity">
              <div className="pairCoin">{selectedPair.label.split("/")[0].slice(0, 3)}</div>
              <div>
                <h1>{selectedPair.label}</h1>
                <p>Spot trading · Binance-inspired UI</p>
              </div>
            </div>

            <div className="statsGrid">
              <div className="statCard">
                <span>Last Price</span>
                <strong className={Number(change) >= 0 ? "upText" : "downText"}>
                  {formatPrice(price)}
                </strong>
              </div>
              <div className="statCard">
                <span>24h Change</span>
                <strong className={Number(change) >= 0 ? "upText" : "downText"}>
                  {formatPercent(change)}
                </strong>
              </div>
              <div className="statCard">
                <span>24h High</span>
                <strong>{formatPrice(high)}</strong>
              </div>
              <div className="statCard">
                <span>24h Low</span>
                <strong>{formatPrice(low)}</strong>
              </div>
              <div className="statCard">
                <span>Volume</span>
                <strong>{formatSmall(volume)}</strong>
              </div>
            </div>
          </section>

          {isMobile ? (
            <section className="mobileOnly">
              <div className="panel mobilePairSelect">
                <select
                  value={selectedPair.symbol}
                  onChange={(e) => {
                    const pair = PAIRS.find((item) => item.symbol === e.target.value);
                    if (pair) setSelectedPair(pair);
                  }}
                >
                  {PAIRS.map((pair) => (
                    <option key={pair.symbol} value={pair.symbol}>
                      {pair.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mobileTabs">
                {[
                  ["chart", "Chart"],
                  ["book", "Book"],
                  ["trades", "Trades"],
                  ["trade", "Trade"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={mobileTab === value ? "mobileTabActive" : ""}
                    onClick={() => setMobileTab(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {mobileTab === "chart" && (
                <div className="panel chartPanel">
                  <div className="panelTitle panelRow">
                    <span>Chart</span>
                    <div className="timeTabs">
                      {TIMEFRAMES.map((item) => (
                        <button
                          type="button"
                          key={item.value}
                          className={timeframe === item.value ? "timeTabActive" : ""}
                          onClick={() => setTimeframe(item.value)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <CandleChart candles={candles} timeframe={timeframe} />
                </div>
              )}

              {mobileTab === "book" && (
                <div className="panel sidePanel">
                  <div className="panelTitle">Order Book</div>
                  <OrderBookPanel asks={orderBook.asks} bids={orderBook.bids} />
                </div>
              )}

              {mobileTab === "trades" && (
                <div className="panel sidePanel">
                  <div className="panelTitle">Market Trades</div>
                  <TradesPanel trades={trades} />
                </div>
              )}

              {mobileTab === "trade" && (
                <div className="panel sidePanel">
                  <div className="panelTitle">Trade</div>
                  <TradeBox pair={selectedPair} lastPrice={price} />
                </div>
              )}
            </section>
          ) : (
            <section className="desktopGrid">
              <MarketSidebar
                selectedPair={selectedPair}
                onSelect={setSelectedPair}
                tickers={sideTickers}
              />

              <div className="middleColumn">
                <div className="panel chartPanel">
                  <div className="panelTitle panelRow">
                    <span>Chart</span>
                    <div className="timeTabs">
                      {TIMEFRAMES.map((item) => (
                        <button
                          type="button"
                          key={item.value}
                          className={timeframe === item.value ? "timeTabActive" : ""}
                          onClick={() => setTimeframe(item.value)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <CandleChart candles={candles} timeframe={timeframe} />
                </div>

                <div className="panel ordersPanel">
                  <div className="panelTitle">Open Orders</div>
                  <div className="emptyState">No open orders</div>
                </div>
              </div>

              <div className="panel sidePanel">
                <div className="panelTitle panelRow">
                  <span>{rightTab === "book" ? "Order Book" : "Market Trades"}</span>
                  <div className="rightTabs">
                    <button
                      type="button"
                      className={rightTab === "book" ? "timeTabActive" : ""}
                      onClick={() => setRightTab("book")}
                    >
                      Book
                    </button>
                    <button
                      type="button"
                      className={rightTab === "trades" ? "timeTabActive" : ""}
                      onClick={() => setRightTab("trades")}
                    >
                      Trades
                    </button>
                  </div>
                </div>

                {rightTab === "book" ? (
                  <OrderBookPanel asks={orderBook.asks} bids={orderBook.bids} />
                ) : (
                  <TradesPanel trades={trades} />
                )}
              </div>

              <div className="panel sidePanel">
                <div className="panelTitle">Trade</div>
                <TradeBox pair={selectedPair} lastPrice={price} />
              </div>
            </section>
          )}
        </div>
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        body {
          background: #0b0e11;
          color: #eaecef;
          font-family: Inter, "Segoe UI", system-ui, sans-serif;
        }

        .exchangePage {
          min-height: 100vh;
          padding: 96px 16px 18px;
          background:
            radial-gradient(circle at top left, rgba(240, 185, 11, 0.06), transparent 22%),
            radial-gradient(circle at top right, rgba(59, 130, 246, 0.06), transparent 18%),
            linear-gradient(180deg, #0b0e11 0%, #12171f 100%);
        }

        .exchangeContainer {
          max-width: 1520px;
          margin: 0 auto;
        }

        .panel {
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(22, 26, 30, 0.92);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
          min-width: 0;
        }

        .topBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          margin-bottom: 14px;
        }

        .pairIdentity {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .pairCoin {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #f0b90b, #c98a09);
          color: #111;
          font-weight: 900;
          flex-shrink: 0;
        }

        .pairIdentity h1 {
          margin: 0;
          font-size: 24px;
          color: #fff;
        }

        .pairIdentity p {
          margin: 4px 0 0;
          color: #848e9c;
          font-size: 13px;
        }

        .statsGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .statCard {
          min-width: 118px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .statCard span {
          display: block;
          font-size: 10px;
          color: #848e9c;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }

        .statCard strong {
          font-size: 14px;
          color: #fff;
        }

        .desktopGrid {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr) 320px 320px;
          gap: 14px;
          min-height: 760px;
        }

        .middleColumn {
          display: grid;
          grid-template-rows: 1fr 130px;
          gap: 14px;
          min-width: 0;
        }

        .sidebarPanel,
        .sidePanel {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .panelTitle {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          color: #fff;
          font-weight: 800;
          font-size: 13px;
        }

        .panelRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sidebarSearch {
          padding: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .sidebarSearch input,
        .mobilePairSelect select,
        .formRow input {
          width: 100%;
          height: 42px;
          padding: 0 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          color: #eaecef;
          outline: none;
          font-size: 14px;
        }

        .sidebarSearch input:focus,
        .mobilePairSelect select:focus,
        .formRow input:focus {
          border-color: rgba(240, 185, 11, 0.45);
        }

        .sidebarSearch input::placeholder,
        .formRow input::placeholder {
          color: #6f7781;
        }

        .marketRows {
          overflow: auto;
          min-height: 0;
          flex: 1;
        }

        .marketRow {
          width: 100%;
          border: none;
          background: transparent;
          color: inherit;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          text-align: left;
          padding: 12px 14px;
          border-left: 2px solid transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          cursor: pointer;
        }

        .marketRow:hover {
          background: rgba(255, 255, 255, 0.035);
        }

        .marketRowActive {
          background: rgba(240, 185, 11, 0.08);
          border-left-color: #f0b90b;
        }

        .marketLabel {
          color: #fff;
          font-size: 13px;
          font-weight: 700;
        }

        .marketSymbol {
          color: #848e9c;
          font-size: 11px;
          margin-top: 3px;
        }

        .marketRowRight {
          text-align: right;
          flex-shrink: 0;
        }

        .marketPrice {
          color: #fff;
          font-size: 13px;
          font-weight: 700;
        }

        .chartPanel {
          display: flex;
          flex-direction: column;
        }

        .chartCanvasShell {
          flex: 1;
          min-height: 460px;
          padding: 8px 0;
        }

        .chartCanvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .timeTabs,
        .rightTabs,
        .subTabs,
        .mobileTabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .timeTabs button,
        .rightTabs button,
        .subTabs button,
        .mobileTabs button,
        .percentRow button {
          min-height: 34px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: #aeb4bc;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .timeTabActive,
        .subTabActive,
        .mobileTabActive {
          background: rgba(240, 185, 11, 0.12) !important;
          border-color: rgba(240, 185, 11, 0.32) !important;
          color: #f0b90b !important;
        }

        .ordersPanel {
          display: flex;
          flex-direction: column;
        }

        .emptyState {
          flex: 1;
          display: grid;
          place-items: center;
          color: #848e9c;
          font-size: 14px;
        }

        .orderBookWrap,
        .tradesWrap {
          display: flex;
          flex-direction: column;
          min-height: 0;
          height: 100%;
        }

        .tableHead,
        .bookRow,
        .tradeRow {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          padding: 6px 12px;
          font-size: 11px;
          font-family: monospace;
        }

        .tableHead {
          color: #848e9c;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .compactGrid span:nth-child(2),
        .compactGrid span:nth-child(3) {
          text-align: right;
        }

        .tableBody {
          overflow: auto;
          min-height: 0;
        }

        .bookRow,
        .tradeRow {
          position: relative;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .bookRow span,
        .tradeRow span {
          position: relative;
          z-index: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .depthBar {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          z-index: 0;
        }

        .askBar {
          background: rgba(246, 70, 93, 0.1);
        }

        .bidBar {
          background: rgba(14, 203, 129, 0.1);
        }

        .midRow {
          padding: 10px 12px;
          text-align: center;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.03);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .tradeBox {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .buySellSwitch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .buySellSwitch button {
          min-height: 42px;
          border: none;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: #d8dde3;
          font-weight: 800;
          cursor: pointer;
        }

        .activeBuy {
          background: #0ecb81 !important;
          color: #0b0e11 !important;
        }

        .activeSell {
          background: #f6465d !important;
          color: #fff !important;
        }

        .formRow {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .formRow label {
          font-size: 11px;
          color: #848e9c;
        }

        .percentRow {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .submitTradeBtn {
          min-height: 46px;
          border: none;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .buyBtn {
          background: #0ecb81;
          color: #0b0e11;
        }

        .sellBtn {
          background: #f6465d;
          color: #fff;
        }

        .loginHint {
          margin: 0;
          text-align: center;
          color: #848e9c;
          font-size: 12px;
        }

        .loginHint a {
          color: #f0b90b;
          text-decoration: none;
        }

        .upText {
          color: #0ecb81 !important;
        }

        .downText {
          color: #f6465d !important;
        }

        .mutedText {
          color: #848e9c;
        }

        .mobileOnly {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobilePairSelect {
          padding: 12px;
        }

        @media (max-width: 1280px) {
          .desktopGrid {
            grid-template-columns: 230px minmax(0, 1fr) 290px 300px;
          }
        }

        @media (max-width: 980px) {
          .exchangePage {
            padding: 88px 12px 12px;
          }

          .topBar {
            flex-direction: column;
            align-items: flex-start;
          }

          .statsGrid {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }

          .chartCanvasShell {
            min-height: 360px;
          }
        }

        @media (max-width: 640px) {
          .pairIdentity h1 {
            font-size: 20px;
          }

          .statsGrid {
            grid-template-columns: 1fr;
          }

          .timeTabs button {
            flex: 1;
            min-width: 52px;
          }
        }
      `}</style>
    </>
  );
}