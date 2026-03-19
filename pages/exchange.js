import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";

const PAIRS = [
  { label: "BTC/EUR", binance: "BTCEUR" },
  { label: "ETH/EUR", binance: "ETHEUR" },
  { label: "BNB/EUR", binance: "BNBEUR" },
  { label: "SOL/EUR", binance: "SOLEUR" },
  { label: "XRP/EUR", binance: "XRPEUR" },
  { label: "ADA/EUR", binance: "ADAEUR" },
  { label: "DOGE/EUR", binance: "DOGEEUR" },
  { label: "LINK/EUR", binance: "LINKEUR" },
];

const TIMEFRAMES = [
  { label: "1m", api: "1m" },
  { label: "5m", api: "5m" },
  { label: "15m", api: "15m" },
  { label: "1h", api: "1h" },
  { label: "4h", api: "4h" },
  { label: "1d", api: "1d" },
];

function formatPrice(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  const n = Number(value);
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

function formatChange(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  const n = Number(value);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  const n = Number(value);
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toFixed(2);
}

function useIsMobile(breakpoint = 980) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

function useMarketData(symbol) {
  const [ticker, setTicker] = useState(null);
  const [loadingTicker, setLoadingTicker] = useState(true);

  useEffect(() => {
    let active = true;
    let ws;

    async function fetchInitial() {
      try {
        setLoadingTicker(true);
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const data = await res.json();
        if (active) {
          setTicker(data);
          setLoadingTicker(false);
        }
      } catch (error) {
        if (active) setLoadingTicker(false);
      }
    }

    fetchInitial();

    try {
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!active) return;

          setTicker((prev) => ({
            ...prev,
            lastPrice: data.c,
            priceChangePercent: data.P,
            highPrice: data.h,
            lowPrice: data.l,
            volume: data.v,
            quoteVolume: data.q,
          }));
        } catch (error) {}
      };
    } catch (error) {}

    return () => {
      active = false;
      if (ws) ws.close();
    };
  }, [symbol]);

  return { ticker, loadingTicker };
}

function useOrderBook(symbol) {
  const [book, setBook] = useState({ bids: [], asks: [] });

  useEffect(() => {
    let active = true;
    let interval;

    async function fetchBook() {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=12`);
        const data = await res.json();
        if (!active) return;

        const asks = (data.asks || []).map(([price, qty]) => ({
          price: Number(price),
          qty: Number(qty),
          total: Number(price) * Number(qty),
        }));

        const bids = (data.bids || []).map(([price, qty]) => ({
          price: Number(price),
          qty: Number(qty),
          total: Number(price) * Number(qty),
        }));

        setBook({ bids, asks });
      } catch (error) {}
    }

    fetchBook();
    interval = setInterval(fetchBook, 2000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [symbol]);

  return book;
}

function useRecentTrades(symbol) {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    let active = true;
    let ws;

    async function fetchInitial() {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=20`);
        const data = await res.json();
        if (!active) return;

        setTrades(
          (data || []).map((t) => ({
            id: t.id,
            price: Number(t.price),
            qty: Number(t.qty),
            time: t.time,
            side: t.isBuyerMaker ? "sell" : "buy",
          }))
        );
      } catch (error) {}
    }

    fetchInitial();

    try {
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
      ws.onmessage = (event) => {
        try {
          const t = JSON.parse(event.data);
          if (!active) return;

          setTrades((prev) => [
            {
              id: t.t,
              price: Number(t.p),
              qty: Number(t.q),
              time: t.T,
              side: t.m ? "sell" : "buy",
            },
            ...prev.slice(0, 19),
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

function useCandles(symbol, interval) {
  const [candles, setCandles] = useState([]);

  useEffect(() => {
    let active = true;

    async function fetchCandles() {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=80`
        );
        const data = await res.json();
        if (!active) return;

        const parsed = (data || []).map((item) => ({
          openTime: item[0],
          open: Number(item[1]),
          high: Number(item[2]),
          low: Number(item[3]),
          close: Number(item[4]),
          volume: Number(item[5]),
        }));

        setCandles(parsed);
      } catch (error) {}
    }

    fetchCandles();
    return () => {
      active = false;
    };
  }, [symbol, interval]);

  return candles;
}

function CandlestickChart({ candles }) {
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

    const padding = { top: 16, right: 76, bottom: 30, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const range = max - min || 1;
    const candleWidth = Math.max(4, (chartWidth / candles.length) * 0.6);

    const toY = (price) =>
      padding.top + chartHeight - ((price - min) / range) * chartHeight;

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i += 1) {
      const py = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, py);
      ctx.lineTo(width - padding.right, py);
      ctx.stroke();

      const value = max - (range / 5) * i;
      ctx.fillStyle = "rgba(196,205,212,0.72)";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(formatPrice(value), width - padding.right + 8, py + 4);
    }

    candles.forEach((candle, index) => {
      const x = padding.left + (index + 0.5) * (chartWidth / candles.length);
      const isUp = candle.close >= candle.open;
      const color = isUp ? "#0ecb81" : "#f6465d";

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, toY(candle.high));
      ctx.lineTo(x, toY(candle.low));
      ctx.stroke();

      const bodyTop = toY(Math.max(candle.open, candle.close));
      const bodyBottom = toY(Math.min(candle.open, candle.close));
      const bodyHeight = Math.max(2, bodyBottom - bodyTop);

      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });
  }, [candles]);

  return (
    <div className="chartCanvasWrap">
      <canvas ref={canvasRef} className="chartCanvas" />
    </div>
  );
}

function PairSidebar({ selectedPair, onSelect, liveTickerMap }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return PAIRS.filter((pair) =>
      pair.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <aside className="pairSidebar panel">
      <div className="panelHeader">Markets</div>

      <div className="pairSearch">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pairs..."
        />
      </div>

      <div className="pairList">
        {filtered.map((pair) => {
          const ticker = liveTickerMap[pair.binance];
          const lastPrice = ticker?.lastPrice ?? "--";
          const change = Number(ticker?.priceChangePercent ?? 0);

          return (
            <button
              key={pair.binance}
              className={`pairRow ${selectedPair.binance === pair.binance ? "pairRowActive" : ""}`}
              onClick={() => onSelect(pair)}
              type="button"
            >
              <div className="pairLeftWrap">
                <div className="pairName">{pair.label}</div>
                <div className="pairSub">{pair.binance}</div>
              </div>

              <div className="pairRight">
                <div className="pairPrice">{formatPrice(lastPrice)}</div>
                <div className={change >= 0 ? "upText" : "downText"}>
                  {formatChange(change)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function OrderBook({ asks, bids }) {
  const maxTotal = Math.max(
    1,
    ...asks.map((row) => row.total),
    ...bids.map((row) => row.total)
  );

  return (
    <div className="panelFill">
      <div className="miniHead">
        <span>Price (EUR)</span>
        <span>Amount</span>
        <span>Total</span>
      </div>

      <div className="bookRows">
        {asks
          .slice()
          .reverse()
          .map((row, i) => (
            <div className="bookRow" key={`ask-${i}`}>
              <div
                className="depth askDepth"
                style={{ width: `${(row.total / maxTotal) * 100}%` }}
              />
              <span className="downText">{formatPrice(row.price)}</span>
              <span>{row.qty.toFixed(5)}</span>
              <span>{formatNumber(row.total)}</span>
            </div>
          ))}

        <div className="midPriceRow">Mid Market</div>

        {bids.map((row, i) => (
          <div className="bookRow" key={`bid-${i}`}>
            <div
              className="depth bidDepth"
              style={{ width: `${(row.total / maxTotal) * 100}%` }}
            />
            <span className="upText">{formatPrice(row.price)}</span>
            <span>{row.qty.toFixed(5)}</span>
            <span>{formatNumber(row.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TradesPanel({ trades }) {
  return (
    <div className="panelFill">
      <div className="miniHead">
        <span>Price</span>
        <span>Amount</span>
        <span>Time</span>
      </div>

      <div className="tradeRows">
        {trades.map((trade) => {
          const d = new Date(trade.time);
          const timeLabel = `${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes()
          ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

          return (
            <div className="tradeRow" key={trade.id}>
              <span className={trade.side === "buy" ? "upText" : "downText"}>
                {formatPrice(trade.price)}
              </span>
              <span>{trade.qty.toFixed(5)}</span>
              <span className="muted">{timeLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TradeForm({ pairLabel, lastPrice }) {
  const base = pairLabel.split("/")[0];
  const [side, setSide] = useState("buy");
  const [type, setType] = useState("limit");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (lastPrice) {
      setPrice(String(Number(lastPrice).toFixed(Number(lastPrice) >= 1 ? 2 : 6)));
    }
  }, [lastPrice]);

  const total = ((Number(price) || 0) * (Number(amount) || 0)).toFixed(2);

  return (
    <div className="panelFill tradeForm">
      <div className="sideSwitch">
        <button
          className={side === "buy" ? "buyActive" : ""}
          onClick={() => setSide("buy")}
          type="button"
        >
          Buy
        </button>
        <button
          className={side === "sell" ? "sellActive" : ""}
          onClick={() => setSide("sell")}
          type="button"
        >
          Sell
        </button>
      </div>

      <div className="typeSwitch">
        {["limit", "market", "stop"].map((item) => (
          <button
            key={item}
            className={type === item ? "typeActive" : ""}
            type="button"
            onClick={() => setType(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {type !== "market" && (
        <div className="field">
          <label>Price (EUR)</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      )}

      <div className="field">
        <label>Amount ({base})</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00000"
        />
      </div>

      <div className="field">
        <label>Total (EUR)</label>
        <input value={total} readOnly />
      </div>

      <button
        type="button"
        className={`submitBtn ${side === "buy" ? "submitBuy" : "submitSell"}`}
      >
        {side === "buy" ? `Buy ${base}` : `Sell ${base}`}
      </button>

      <p className="formHint">
        <Link href="/login">Log In</Link> or <Link href="/register">Register</Link>
      </p>
    </div>
  );
}

function MobileTabs({ current, setCurrent }) {
  const tabs = [
    ["chart", "Chart"],
    ["book", "Book"],
    ["trades", "Trades"],
    ["trade", "Trade"],
  ];

  return (
    <div className="mobileTabs">
      {tabs.map(([key, label]) => (
        <button
          key={key}
          className={current === key ? "mobileTabActive" : ""}
          onClick={() => setCurrent(key)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function ExchangePage() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  const [timeframe, setTimeframe] = useState("1h");
  const [rightTab, setRightTab] = useState("book");
  const [mobileTab, setMobileTab] = useState("chart");
  const isMobile = useIsMobile();

  const { ticker, loadingTicker } = useMarketData(selectedPair.binance);
  const book = useOrderBook(selectedPair.binance);
  const trades = useRecentTrades(selectedPair.binance);
  const candles = useCandles(selectedPair.binance, timeframe);

  const [liveTickerMap, setLiveTickerMap] = useState({});

  useEffect(() => {
    let mounted = true;

    async function fetchSideList() {
      try {
        const results = await Promise.all(
          PAIRS.map(async (pair) => {
            const res = await fetch(
              `https://api.binance.com/api/v3/ticker/24hr?symbol=${pair.binance}`
            );
            const data = await res.json();
            return [pair.binance, data];
          })
        );

        if (!mounted) return;
        setLiveTickerMap(Object.fromEntries(results));
      } catch (error) {}
    }

    fetchSideList();

    return () => {
      mounted = false;
    };
  }, []);

  const lastPrice = Number(ticker?.lastPrice || 0);
  const changePercent = Number(ticker?.priceChangePercent || 0);
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
        <div className="exchangeWrap">
          <header className="topSummary">
            <div className="pairMain">
              <div className="pairBadge">
                {selectedPair.label.split("/")[0].slice(0, 3)}
              </div>
              <div>
                <h1>{selectedPair.label}</h1>
                <p>Professional trading interface</p>
              </div>
            </div>

            <div className="topStats">
              <div className="topStat">
                <span>Last Price</span>
                <strong className={changePercent >= 0 ? "upText" : "downText"}>
                  {loadingTicker ? "Loading..." : formatPrice(lastPrice)}
                </strong>
              </div>
              <div className="topStat">
                <span>24h Change</span>
                <strong className={changePercent >= 0 ? "upText" : "downText"}>
                  {loadingTicker ? "--" : formatChange(changePercent)}
                </strong>
              </div>
              <div className="topStat">
                <span>24h High</span>
                <strong>{loadingTicker ? "--" : formatPrice(high)}</strong>
              </div>
              <div className="topStat">
                <span>24h Low</span>
                <strong>{loadingTicker ? "--" : formatPrice(low)}</strong>
              </div>
              <div className="topStat">
                <span>Volume</span>
                <strong>{loadingTicker ? "--" : formatNumber(volume)}</strong>
              </div>
            </div>
          </header>

          {isMobile ? (
            <section className="mobileLayout">
              <div className="mobilePairSelect panel">
                <select
                  value={selectedPair.binance}
                  onChange={(e) => {
                    const pair = PAIRS.find((p) => p.binance === e.target.value);
                    if (pair) setSelectedPair(pair);
                  }}
                >
                  {PAIRS.map((pair) => (
                    <option key={pair.binance} value={pair.binance}>
                      {pair.label}
                    </option>
                  ))}
                </select>
              </div>

              <MobileTabs current={mobileTab} setCurrent={setMobileTab} />

              {mobileTab === "chart" && (
                <div className="panel chartPanel">
                  <div className="panelHeader withTabs">
                    <span>Chart</span>
                    <div className="tfTabs">
                      {TIMEFRAMES.map((tf) => (
                        <button
                          key={tf.api}
                          type="button"
                          className={timeframe === tf.api ? "tfActive" : ""}
                          onClick={() => setTimeframe(tf.api)}
                        >
                          {tf.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <CandlestickChart candles={candles} />
                </div>
              )}

              {mobileTab === "book" && (
                <div className="panel panelTall">
                  <div className="panelHeader">Order Book</div>
                  <OrderBook asks={book.asks} bids={book.bids} />
                </div>
              )}

              {mobileTab === "trades" && (
                <div className="panel panelTall">
                  <div className="panelHeader">Recent Trades</div>
                  <TradesPanel trades={trades} />
                </div>
              )}

              {mobileTab === "trade" && (
                <div className="panel">
                  <div className="panelHeader">Trade</div>
                  <TradeForm pairLabel={selectedPair.label} lastPrice={lastPrice} />
                </div>
              )}
            </section>
          ) : (
            <section className="desktopGrid">
              <PairSidebar
                selectedPair={selectedPair}
                onSelect={setSelectedPair}
                liveTickerMap={liveTickerMap}
              />

              <div className="centerColumn">
                <div className="panel chartPanel">
                  <div className="panelHeader withTabs">
                    <span>Chart</span>
                    <div className="tfTabs">
                      {TIMEFRAMES.map((tf) => (
                        <button
                          key={tf.api}
                          type="button"
                          className={timeframe === tf.api ? "tfActive" : ""}
                          onClick={() => setTimeframe(tf.api)}
                        >
                          {tf.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <CandlestickChart candles={candles} />
                </div>

                <div className="panel openOrders">
                  <div className="panelHeader">Open Orders</div>
                  <div className="emptyBox">No open orders</div>
                </div>
              </div>

              <div className="panel rightPanel">
                <div className="panelHeader withTabs">
                  <span>{rightTab === "book" ? "Order Book" : "Recent Trades"}</span>
                  <div className="rtTabs">
                    <button
                      className={rightTab === "book" ? "tfActive" : ""}
                      onClick={() => setRightTab("book")}
                      type="button"
                    >
                      Book
                    </button>
                    <button
                      className={rightTab === "trades" ? "tfActive" : ""}
                      onClick={() => setRightTab("trades")}
                      type="button"
                    >
                      Trades
                    </button>
                  </div>
                </div>

                {rightTab === "book" ? (
                  <OrderBook asks={book.asks} bids={book.bids} />
                ) : (
                  <TradesPanel trades={trades} />
                )}
              </div>

              <div className="panel tradePanel">
                <div className="panelHeader">Trade</div>
                <TradeForm pairLabel={selectedPair.label} lastPrice={lastPrice} />
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
          background: #05070c;
          color: #e7edf5;
          font-family: Inter, "Segoe UI", system-ui, sans-serif;
        }

        .exchangePage {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(240, 185, 11, 0.08), transparent 25%),
            radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 22%),
            linear-gradient(180deg, #05070c 0%, #0a0f17 100%);
          color: #e7edf5;
          padding: 96px 18px 18px;
        }

        .exchangeWrap {
          max-width: 1500px;
          margin: 0 auto;
        }

        .topSummary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-bottom: 16px;
          padding: 18px 20px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(16px);
        }

        .pairMain {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .pairBadge {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #f0b90b, #c8830a);
          color: #111;
          font-weight: 900;
          flex-shrink: 0;
        }

        .pairMain h1 {
          margin: 0;
          font-size: 24px;
          color: #fff;
        }

        .pairMain p {
          margin: 4px 0 0;
          color: rgba(231, 237, 245, 0.58);
          font-size: 13px;
        }

        .topStats {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .topStat {
          min-width: 120px;
          padding: 10px 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .topStat span {
          display: block;
          font-size: 11px;
          color: rgba(231, 237, 245, 0.52);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .topStat strong {
          font-size: 14px;
          color: #fff;
        }

        .desktopGrid {
          display: grid;
          grid-template-columns: 250px minmax(0, 1fr) 320px 320px;
          gap: 14px;
          min-height: 760px;
        }

        .centerColumn {
          display: grid;
          grid-template-rows: 1fr 130px;
          gap: 14px;
          min-width: 0;
        }

        .panel {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(14px);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24);
          min-width: 0;
        }

        .panelHeader {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 13px;
          font-weight: 800;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .withTabs {
          gap: 12px;
        }

        .pairSidebar {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .pairSearch {
          padding: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .pairSearch input,
        .mobilePairSelect select,
        .field input {
          width: 100%;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #e7edf5;
          padding: 0 12px;
          outline: none;
          box-shadow: none;
          font-size: 14px;
        }

        .pairSearch input::placeholder,
        .field input::placeholder {
          color: rgba(231, 237, 245, 0.35);
        }

        .pairSearch input:focus,
        .mobilePairSelect select:focus,
        .field input:focus {
          border-color: rgba(240, 185, 11, 0.45);
        }

        .pairList {
          overflow: auto;
          flex: 1;
          min-height: 0;
        }

        .pairRow {
          width: 100%;
          border: none;
          background: transparent;
          color: inherit;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          cursor: pointer;
          border-left: 2px solid transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .pairRow:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .pairRowActive {
          background: rgba(240, 185, 11, 0.08);
          border-left-color: #f0b90b;
        }

        .pairLeftWrap {
          min-width: 0;
        }

        .pairName {
          color: #fff;
          font-weight: 700;
          font-size: 13px;
        }

        .pairSub {
          color: rgba(231, 237, 245, 0.45);
          font-size: 11px;
          margin-top: 3px;
        }

        .pairRight {
          text-align: right;
          flex-shrink: 0;
        }

        .pairPrice {
          color: #fff;
          font-size: 13px;
          font-weight: 700;
        }

        .chartPanel {
          display: flex;
          flex-direction: column;
        }

        .chartCanvasWrap {
          flex: 1;
          min-height: 420px;
          padding: 8px 0;
        }

        .chartCanvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .tfTabs,
        .rtTabs,
        .typeSwitch,
        .mobileTabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tfTabs button,
        .rtTabs button,
        .typeSwitch button,
        .mobileTabs button {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: rgba(231, 237, 245, 0.72);
          min-height: 34px;
          padding: 0 12px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          font-size: 12px;
        }

        .tfTabs button.tfActive,
        .rtTabs button.tfActive,
        .typeSwitch button.typeActive,
        .mobileTabActive {
          background: rgba(240, 185, 11, 0.12) !important;
          border-color: rgba(240, 185, 11, 0.35) !important;
          color: #f0b90b !important;
        }

        .openOrders {
          display: flex;
          flex-direction: column;
        }

        .emptyBox {
          flex: 1;
          display: grid;
          place-items: center;
          color: rgba(231, 237, 245, 0.48);
          font-size: 14px;
        }

        .rightPanel,
        .tradePanel {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .panelFill {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }

        .miniHead,
        .bookRow,
        .tradeRow {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          padding: 6px 12px;
          font-family: monospace;
          font-size: 11px;
        }

        .miniHead {
          color: rgba(231, 237, 245, 0.5);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .miniHead span:nth-child(2),
        .miniHead span:nth-child(3),
        .bookRow span:nth-child(2),
        .bookRow span:nth-child(3),
        .tradeRow span:nth-child(2),
        .tradeRow span:nth-child(3) {
          text-align: right;
        }

        .bookRows,
        .tradeRows {
          overflow: auto;
          min-height: 0;
        }

        .bookRow {
          position: relative;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .bookRow span {
          position: relative;
          z-index: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .depth {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          z-index: 0;
        }

        .askDepth {
          background: rgba(246, 70, 93, 0.1);
        }

        .bidDepth {
          background: rgba(14, 203, 129, 0.1);
        }

        .midPriceRow {
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 800;
          color: #fff;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.03);
        }

        .tradeRow {
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .tradeRow span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tradeForm {
          padding: 14px;
          gap: 12px;
        }

        .sideSwitch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .sideSwitch button {
          min-height: 42px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(231, 237, 245, 0.82);
        }

        .buyActive {
          background: #0ecb81 !important;
          color: #0c1117 !important;
        }

        .sellActive {
          background: #f6465d !important;
          color: #fff !important;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 11px;
          color: rgba(231, 237, 245, 0.58);
        }

        .submitBtn {
          min-height: 46px;
          border: none;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
          font-size: 14px;
        }

        .submitBuy {
          background: #0ecb81;
          color: #0b0e11;
        }

        .submitSell {
          background: #f6465d;
          color: #fff;
        }

        .formHint {
          text-align: center;
          color: rgba(231, 237, 245, 0.52);
          font-size: 12px;
          margin: 0;
        }

        .formHint a {
          color: #f0b90b;
          text-decoration: none;
        }

        .upText {
          color: #0ecb81 !important;
        }

        .downText {
          color: #f6465d !important;
        }

        .muted {
          color: rgba(231, 237, 245, 0.5);
        }

        .mobileLayout {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobilePairSelect {
          padding: 12px;
        }

        .panelTall {
          min-height: 420px;
        }

        @media (max-width: 1200px) {
          .desktopGrid {
            grid-template-columns: 220px minmax(0, 1fr) 280px 300px;
          }
        }

        @media (max-width: 980px) {
          .exchangePage {
            padding: 88px 12px 12px;
          }

          .topSummary {
            flex-direction: column;
            align-items: flex-start;
          }

          .topStats {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }

          .chartCanvasWrap {
            min-height: 340px;
          }
        }

        @media (max-width: 640px) {
          .pairMain h1 {
            font-size: 20px;
          }

          .topStats {
            grid-template-columns: 1fr;
          }

          .tfTabs {
            width: 100%;
          }

          .tfTabs button {
            flex: 1;
            min-width: 52px;
          }
        }
      `}</style>
    </>
  );
}