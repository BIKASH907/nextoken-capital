import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import {
  AreaSeries,
  CandlestickSeries,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  LineStyle,
  createChart,
} from "lightweight-charts";

const MARKET_LIST = [
  { pair: "BTC/EUR", type: "Crypto", basePrice: 62054.31, spread: 16.8 },
  { pair: "ETH/EUR", type: "Crypto", basePrice: 1913.01, spread: 1.4 },
  { pair: "BNB/EUR", type: "Crypto", basePrice: 568.9, spread: 0.7 },
  { pair: "SOL/EUR", type: "Crypto", basePrice: 98.42, spread: 0.18 },
  { pair: "XRP/EUR", type: "Crypto", basePrice: 0.59, spread: 0.002 },
  { pair: "NXC/EUR", type: "Token", basePrice: 1.84, spread: 0.01 },
];

const TIMEFRAMES = [
  { key: "1s", label: "1s", seconds: 1, bars: 240 },
  { key: "5s", label: "5s", seconds: 5, bars: 240 },
  { key: "15s", label: "15s", seconds: 15, bars: 240 },
  { key: "1m", label: "1m", seconds: 60, bars: 260 },
  { key: "5m", label: "5m", seconds: 300, bars: 260 },
  { key: "15m", label: "15m", seconds: 900, bars: 260 },
  { key: "1h", label: "1h", seconds: 3600, bars: 220 },
  { key: "4h", label: "4h", seconds: 14400, bars: 220 },
  { key: "1d", label: "1D", seconds: 86400, bars: 220 },
  { key: "1w", label: "1W", seconds: 604800, bars: 160 },
  { key: "1M", label: "1M", seconds: 2592000, bars: 120 },
  { key: "1Y", label: "1Y", seconds: 31536000, bars: 40 },
];

const ORDERS = [
  { id: "#84251", side: "Buy", pair: "BTC/EUR", price: "62,042.10", amount: "0.1500", status: "Filled" },
  { id: "#84249", side: "Sell", pair: "BTC/EUR", price: "62,088.40", amount: "0.0800", status: "Open" },
  { id: "#84233", side: "Buy", pair: "ETH/EUR", price: "1,905.10", amount: "4.2000", status: "Filled" },
];

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stringToSeed(text) {
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i += 1) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function ema(values, period) {
  if (!values.length) return [];
  const k = 2 / (period + 1);
  const out = [];
  let prev = values[0].close;
  for (let i = 0; i < values.length; i += 1) {
    const current = values[i].close * k + prev * (1 - k);
    prev = current;
    out.push({ time: values[i].time, value: current });
  }
  return out;
}

function generateMarketData(market, timeframe) {
  const tf = TIMEFRAMES.find((item) => item.key === timeframe) || TIMEFRAMES[7];
  const rng = mulberry32(stringToSeed(`${market.pair}-${timeframe}`));
  const nowSec = Math.floor(Date.now() / 1000);
  const candles = [];
  const volumes = [];
  let price = market.basePrice;

  const volatilityBase =
    market.basePrice > 10000 ? 0.004 :
    market.basePrice > 1000 ? 0.007 :
    market.basePrice > 10 ? 0.012 : 0.02;

  const tfFactor =
    tf.seconds <= 15 ? 0.45 :
    tf.seconds <= 300 ? 0.8 :
    tf.seconds <= 3600 ? 1 :
    tf.seconds <= 86400 ? 1.6 :
    tf.seconds <= 604800 ? 2.2 : 3.5;

  const volatility = volatilityBase * tfFactor;
  const startTime = nowSec - tf.seconds * tf.bars;

  for (let i = 0; i < tf.bars; i += 1) {
    const time = startTime + i * tf.seconds;
    const open = price;
    const drift = (rng() - 0.49) * volatility;
    const close = open * (1 + drift);
    const wickUp = Math.max(open, close) * (0.001 + rng() * volatility * 0.8);
    const wickDown = Math.min(open, close) * (0.001 + rng() * volatility * 0.8);
    const high = Math.max(open, close) + wickUp;
    const low = Math.max(0.0000001, Math.min(open, close) - wickDown);
    const volumeBase =
      market.basePrice > 10000 ? 180 + rng() * 900 :
      market.basePrice > 1000 ? 250 + rng() * 1400 :
      market.basePrice > 10 ? 800 + rng() * 3000 : 8000 + rng() * 50000;

    candles.push({
      time,
      open: Number(open.toFixed(6)),
      high: Number(high.toFixed(6)),
      low: Number(low.toFixed(6)),
      close: Number(close.toFixed(6)),
    });

    volumes.push({
      time,
      value: Number(volumeBase.toFixed(2)),
      color: close >= open ? "rgba(14, 203, 129, 0.45)" : "rgba(246, 70, 93, 0.45)",
    });

    price = close;
  }

  return {
    candles,
    volumes,
    ema20: ema(candles, 20),
    ema50: ema(candles, 50),
    stepSeconds: tf.seconds,
  };
}

function formatPriceValue(value) {
  if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (value >= 1) return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function formatVolumeValue(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
  return value.toFixed(2);
}

function ProCandlestickChart({ market, timeframe, onStatsChange }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleRef = useRef(null);
  const volumeRef = useRef(null);
  const ema20Ref = useRef(null);
  const ema50Ref = useRef(null);
  const resizeObserverRef = useRef(null);
  const liveTimerRef = useRef(null);

  const [legend, setLegend] = useState({
    open: "-",
    high: "-",
    low: "-",
    close: "-",
    volume: "-",
  });

  const dataBundle = useMemo(() => generateMarketData(market, timeframe), [market, timeframe]);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { color: "#0b0e11" },
        textColor: "#9aa4af",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.08)",
        scaleMargins: {
          top: 0.08,
          bottom: 0.24,
        },
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.08)",
        timeVisible: true,
        secondsVisible: true,
        rightOffset: 12,
        barSpacing: 8,
        fixLeftEdge: false,
        lockVisibleTimeRangeOnResize: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(240,185,11,0.28)",
          width: 1,
          style: LineStyle.Solid,
          labelBackgroundColor: "#f0b90b",
        },
        horzLine: {
          color: "rgba(240,185,11,0.28)",
          width: 1,
          style: LineStyle.Solid,
          labelBackgroundColor: "#f0b90b",
        },
      },
      localization: {
        priceFormatter: (price) => formatPriceValue(price),
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#0ecb81",
      downColor: "#f6465d",
      wickUpColor: "#0ecb81",
      wickDownColor: "#f6465d",
      borderVisible: false,
      priceLineVisible: true,
      lastValueVisible: true,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const ema20Series = chart.addSeries(LineSeries, {
      color: "#f0b90b",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    const ema50Series = chart.addSeries(AreaSeries, {
      lineColor: "rgba(64,169,255,0.85)",
      topColor: "rgba(64,169,255,0.14)",
      bottomColor: "rgba(64,169,255,0)",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    candleSeries.setData(dataBundle.candles);
    volumeSeries.setData(dataBundle.volumes);
    ema20Series.setData(dataBundle.ema20);
    ema50Series.setData(dataBundle.ema50);
    chart.timeScale().fitContent();

    chart.subscribeCrosshairMove((param) => {
      const candleData = param.seriesData.get(candleSeries);
      const volumeData = param.seriesData.get(volumeSeries);

      if (candleData && "open" in candleData) {
        setLegend({
          open: formatPriceValue(candleData.open),
          high: formatPriceValue(candleData.high),
          low: formatPriceValue(candleData.low),
          close: formatPriceValue(candleData.close),
          volume:
            volumeData && "value" in volumeData
              ? formatVolumeValue(volumeData.value)
              : "-",
        });
      }
    });

    chartRef.current = chart;
    candleRef.current = candleSeries;
    volumeRef.current = volumeSeries;
    ema20Ref.current = ema20Series;
    ema50Ref.current = ema50Series;

    const last = dataBundle.candles[dataBundle.candles.length - 1];
    onStatsChange({
      lastPrice: last.close,
      high24h: Math.max(...dataBundle.candles.slice(-24).map((c) => c.high)),
      low24h: Math.min(...dataBundle.candles.slice(-24).map((c) => c.low)),
      volume24h: dataBundle.volumes.slice(-24).reduce((sum, item) => sum + item.value, 0),
      changePct: ((last.close - dataBundle.candles[0].open) / dataBundle.candles[0].open) * 100,
    });
    setLegend({
      open: formatPriceValue(last.open),
      high: formatPriceValue(last.high),
      low: formatPriceValue(last.low),
      close: formatPriceValue(last.close),
      volume: formatVolumeValue(dataBundle.volumes[dataBundle.volumes.length - 1].value),
    });

    if (window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(() => {
        chart.timeScale().fitContent();
      });
      resizeObserverRef.current.observe(containerRef.current);
    }

    return () => {
      if (resizeObserverRef.current && containerRef.current) {
        resizeObserverRef.current.unobserve(containerRef.current);
      }
      resizeObserverRef.current?.disconnect();
      clearInterval(liveTimerRef.current);
      chart.remove();
    };
  }, [dataBundle, onStatsChange]);

  useEffect(() => {
    clearInterval(liveTimerRef.current);

    const chart = chartRef.current;
    const candleSeries = candleRef.current;
    const volumeSeries = volumeRef.current;
    const ema20Series = ema20Ref.current;
    const ema50Series = ema50Ref.current;
    if (!chart || !candleSeries || !volumeSeries || !ema20Series || !ema50Series) return undefined;

    let candles = [...dataBundle.candles];
    let volumes = [...dataBundle.volumes];

    candleSeries.setData(candles);
    volumeSeries.setData(volumes);
    ema20Series.setData(ema(candles, 20));
    ema50Series.setData(ema(candles, 50));

    const rng = mulberry32(stringToSeed(`live-${market.pair}-${timeframe}`));

    const tickMs =
      dataBundle.stepSeconds <= 15 ? 1000 :
      dataBundle.stepSeconds <= 300 ? 1500 :
      2200;

    liveTimerRef.current = setInterval(() => {
      const last = candles[candles.length - 1];
      const lastVolume = volumes[volumes.length - 1];
      const nowSec = Math.floor(Date.now() / 1000);
      const nextBarBoundary = last.time + dataBundle.stepSeconds;

      const driftScale =
        market.basePrice > 10000 ? 0.0005 :
        market.basePrice > 1000 ? 0.0009 :
        market.basePrice > 10 ? 0.0016 : 0.003;

      const movement = (rng() - 0.49) * driftScale;
      const nextClose = Math.max(0.0000001, last.close * (1 + movement));

      if (nowSec >= nextBarBoundary) {
        const open = last.close;
        const close = nextClose;
        const high = Math.max(open, close) * (1 + rng() * driftScale * 2);
        const low = Math.max(0.0000001, Math.min(open, close) * (1 - rng() * driftScale * 2));
        const newCandle = {
          time: nextBarBoundary,
          open: Number(open.toFixed(6)),
          high: Number(high.toFixed(6)),
          low: Number(low.toFixed(6)),
          close: Number(close.toFixed(6)),
        };
        const newVolume = {
          time: nextBarBoundary,
          value: Number((lastVolume.value * (0.75 + rng() * 0.8)).toFixed(2)),
          color: close >= open ? "rgba(14, 203, 129, 0.45)" : "rgba(246, 70, 93, 0.45)",
        };

        candles = [...candles.slice(-399), newCandle];
        volumes = [...volumes.slice(-399), newVolume];
        candleSeries.update(newCandle);
        volumeSeries.update(newVolume);
      } else {
        const updated = {
          ...last,
          high: Math.max(last.high, nextClose),
          low: Math.min(last.low, nextClose),
          close: Number(nextClose.toFixed(6)),
        };
        const updatedVolume = {
          ...lastVolume,
          value: Number((lastVolume.value + rng() * lastVolume.value * 0.05).toFixed(2)),
          color: updated.close >= updated.open ? "rgba(14, 203, 129, 0.45)" : "rgba(246, 70, 93, 0.45)",
        };

        candles = [...candles.slice(0, -1), updated];
        volumes = [...volumes.slice(0, -1), updatedVolume];
        candleSeries.update(updated);
        volumeSeries.update(updatedVolume);
      }

      const ema20Data = ema(candles, 20);
      const ema50Data = ema(candles, 50);
      ema20Series.setData(ema20Data);
      ema50Series.setData(ema50Data);

      const lastBar = candles[candles.length - 1];
      onStatsChange({
        lastPrice: lastBar.close,
        high24h: Math.max(...candles.slice(-24).map((c) => c.high)),
        low24h: Math.min(...candles.slice(-24).map((c) => c.low)),
        volume24h: volumes.slice(-24).reduce((sum, item) => sum + item.value, 0),
        changePct: ((lastBar.close - candles[0].open) / candles[0].open) * 100,
      });

      setLegend({
        open: formatPriceValue(lastBar.open),
        high: formatPriceValue(lastBar.high),
        low: formatPriceValue(lastBar.low),
        close: formatPriceValue(lastBar.close),
        volume: formatVolumeValue(volumes[volumes.length - 1].value),
      });
    }, tickMs);

    return () => clearInterval(liveTimerRef.current);
  }, [dataBundle, market, timeframe, onStatsChange]);

  const zoomIn = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const range = chart.timeScale().getVisibleLogicalRange();
    if (!range) return;
    const center = (range.from + range.to) / 2;
    const width = (range.to - range.from) * 0.7;
    chart.timeScale().setVisibleLogicalRange({
      from: center - width / 2,
      to: center + width / 2,
    });
  };

  const zoomOut = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const range = chart.timeScale().getVisibleLogicalRange();
    if (!range) return;
    const center = (range.from + range.to) / 2;
    const width = (range.to - range.from) * 1.35;
    chart.timeScale().setVisibleLogicalRange({
      from: center - width / 2,
      to: center + width / 2,
    });
  };

  const fit = () => {
    chartRef.current?.timeScale().fitContent();
  };

  return (
    <div className="proChartWrap">
      <div className="chartTopbar">
        <div className="legendRow">
          <span>O {legend.open}</span>
          <span>H {legend.high}</span>
          <span>L {legend.low}</span>
          <span>C {legend.close}</span>
          <span>Vol {legend.volume}</span>
        </div>

        <div className="zoomActions">
          <button onClick={zoomOut}>−</button>
          <button onClick={fit}>Fit</button>
          <button onClick={zoomIn}>+</button>
        </div>
      </div>

      <div ref={containerRef} className="chartContainer" />

      <style jsx>{`
        .proChartWrap {
          width: 100%;
          min-width: 0;
        }

        .chartTopbar {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          padding: 12px 16px 10px;
          border-bottom: 1px solid #232a32;
          background: #11161b;
        }

        .legendRow {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          color: #c3ccd7;
          font-size: 0.86rem;
        }

        .zoomActions {
          display: flex;
          gap: 8px;
        }

        .zoomActions button {
          background: #0f1318;
          color: #e6edf3;
          border: 1px solid #2b3139;
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          font-weight: 700;
        }

        .chartContainer {
          width: 100%;
          height: 520px;
        }

        @media (max-width: 768px) {
          .chartContainer {
            height: 360px;
          }

          .chartTopbar {
            padding: 10px 12px;
          }

          .legendRow {
            gap: 10px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function ExchangePage() {
  const [market, setMarket] = useState(MARKET_LIST[0]);
  const [timeframe, setTimeframe] = useState("4h");
  const [mobileTab, setMobileTab] = useState("chart");
  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("limit");
  const [price, setPrice] = useState(String(MARKET_LIST[0].basePrice));
  const [amount, setAmount] = useState("");
  const [stats, setStats] = useState({
    lastPrice: MARKET_LIST[0].basePrice,
    high24h: MARKET_LIST[0].basePrice * 1.01,
    low24h: MARKET_LIST[0].basePrice * 0.99,
    volume24h: 0,
    changePct: 0,
  });

  useEffect(() => {
    setPrice(String(market.basePrice));
  }, [market]);

  const total = useMemo(() => {
    const p = Number(price || 0);
    const a = Number(amount || 0);
    return p && a ? (p * a).toFixed(2) : "0.00";
  }, [price, amount]);

  const orderBook = useMemo(() => {
    const mid = stats.lastPrice || market.basePrice;
    const asks = Array.from({ length: 12 }, (_, i) => {
      const p = mid + market.spread + i * market.spread * 0.7;
      const a = clamp(0.02 + Math.random() * 0.9, 0.02, 9.99);
      return {
        price: formatPriceValue(p),
        amount: a.toFixed(4),
        total: formatPriceValue(p * a),
      };
    });

    const bids = Array.from({ length: 12 }, (_, i) => {
      const p = Math.max(0.000001, mid - market.spread - i * market.spread * 0.7);
      const a = clamp(0.02 + Math.random() * 0.9, 0.02, 9.99);
      return {
        price: formatPriceValue(p),
        amount: a.toFixed(4),
        total: formatPriceValue(p * a),
      };
    });

    return { asks, bids };
  }, [market, stats.lastPrice]);

  return (
    <>
      <Head>
        <title>Exchange | Nextoken Capital</title>
        <meta
          name="description"
          content="Pro exchange terminal with candlestick chart, timeframes, zoom controls, and mobile responsive trading UI."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className="exchangePage">
        <section className="exchangeShell">
          <div className="heroBar">
            <div className="pairCard">
              <div className="pairTop">
                <div>
                  <h1>{market.pair}</h1>
                  <p>{market.type} trading terminal</p>
                </div>
                <div className={`delta ${stats.changePct >= 0 ? "up" : "down"}`}>
                  {stats.changePct >= 0 ? "+" : ""}
                  {stats.changePct.toFixed(2)}%
                </div>
              </div>

              <div className="pairGrid">
                <div className="pairStat">
                  <span>Last Price</span>
                  <strong>{formatPriceValue(stats.lastPrice)}</strong>
                </div>
                <div className="pairStat">
                  <span>24h High</span>
                  <strong>{formatPriceValue(stats.high24h)}</strong>
                </div>
                <div className="pairStat">
                  <span>24h Low</span>
                  <strong>{formatPriceValue(stats.low24h)}</strong>
                </div>
                <div className="pairStat">
                  <span>24h Volume</span>
                  <strong>{formatVolumeValue(stats.volume24h)}</strong>
                </div>
              </div>
            </div>

            <div className="timeframesBar">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.key}
                  className={timeframe === tf.key ? "active" : ""}
                  onClick={() => setTimeframe(tf.key)}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mobileTabs">
            <button className={mobileTab === "chart" ? "active" : ""} onClick={() => setMobileTab("chart")}>
              Chart
            </button>
            <button className={mobileTab === "book" ? "active" : ""} onClick={() => setMobileTab("book")}>
              Book
            </button>
            <button className={mobileTab === "trade" ? "active" : ""} onClick={() => setMobileTab("trade")}>
              Trade
            </button>
            <button className={mobileTab === "orders" ? "active" : ""} onClick={() => setMobileTab("orders")}>
              Orders
            </button>
          </div>

          <div className="terminalGrid">
            <aside className="panel marketsPanel">
              <div className="panelHeader">
                <h2>Markets</h2>
              </div>

              <div className="marketSearch">
                <input type="text" placeholder="Search market" />
              </div>

              <div className="marketList">
                {MARKET_LIST.map((item) => (
                  <button
                    key={item.pair}
                    className={`marketRow ${market.pair === item.pair ? "selected" : ""}`}
                    onClick={() => setMarket(item)}
                  >
                    <div>
                      <strong>{item.pair}</strong>
                      <span>{item.type}</span>
                    </div>
                    <div className="marketRight">
                      <strong>{formatPriceValue(item.basePrice)}</strong>
                      <span>{item.spread.toFixed(item.basePrice > 100 ? 2 : 4)} spr</span>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <section className={`panel chartPanel mobilePane ${mobileTab === "chart" ? "showMobile" : ""}`}>
              <div className="panelHeader">
                <h2>Pro Chart</h2>
                <div className="chartBadges">
                  <span>EMA 20</span>
                  <span>EMA 50</span>
                  <span>Volume</span>
                </div>
              </div>

              <ProCandlestickChart market={market} timeframe={timeframe} onStatsChange={setStats} />
            </section>

            <section className={`panel orderBookPanel mobilePane ${mobileTab === "book" ? "showMobile" : ""}`}>
              <div className="panelHeader">
                <h2>Order Book</h2>
              </div>

              <div className="bookHeader">
                <span>Price</span>
                <span>Amount</span>
                <span>Total</span>
              </div>

              <div className="bookLabel ask">Asks</div>
              {orderBook.asks
                .slice()
                .reverse()
                .map((row, index) => (
                  <div className="bookRow" key={`ask-${index}`}>
                    <span className="down">{row.price}</span>
                    <span>{row.amount}</span>
                    <span>{row.total}</span>
                  </div>
                ))}

              <div className="midPrice">{formatPriceValue(stats.lastPrice)}</div>

              <div className="bookLabel bid">Bids</div>
              {orderBook.bids.map((row, index) => (
                <div className="bookRow" key={`bid-${index}`}>
                  <span className="up">{row.price}</span>
                  <span>{row.amount}</span>
                  <span>{row.total}</span>
                </div>
              ))}
            </section>

            <aside className={`panel tradePanel mobilePane ${mobileTab === "trade" ? "showMobile" : ""}`}>
              <div className="panelHeader">
                <h2>Trade</h2>
              </div>

              <div className="segmentTabs">
                <button className={side === "buy" ? "active buy" : ""} onClick={() => setSide("buy")}>
                  Buy
                </button>
                <button className={side === "sell" ? "active sell" : ""} onClick={() => setSide("sell")}>
                  Sell
                </button>
              </div>

              <div className="orderTypeTabs">
                <button className={orderType === "limit" ? "active" : ""} onClick={() => setOrderType("limit")}>
                  Limit
                </button>
                <button className={orderType === "market" ? "active" : ""} onClick={() => setOrderType("market")}>
                  Market
                </button>
              </div>

              <div className="formGroup">
                <label>Price</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div className="formGroup">
                <label>Amount</label>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
              </div>

              <div className="rangeRow">
                <button>25%</button>
                <button>50%</button>
                <button>75%</button>
                <button>100%</button>
              </div>

              <div className="formGroup">
                <label>Total</label>
                <input value={total} readOnly />
              </div>

              <div className="walletInfo">
                <div>
                  <span>Available EUR</span>
                  <strong>25,000.00</strong>
                </div>
                <div>
                  <span>Available {market.pair.split("/")[0]}</span>
                  <strong>3.5000</strong>
                </div>
              </div>

              <button className={`submitButton ${side}`}>
                {side === "buy" ? `Buy ${market.pair.split("/")[0]}` : `Sell ${market.pair.split("/")[0]}`}
              </button>
            </aside>

            <section className={`panel ordersPanel mobilePane ${mobileTab === "orders" ? "showMobile" : ""}`}>
              <div className="panelHeader">
                <h2>Open Orders & History</h2>
              </div>

              <div className="ordersTable">
                <div className="ordersHead">
                  <span>ID</span>
                  <span>Side</span>
                  <span>Pair</span>
                  <span>Price</span>
                  <span>Amount</span>
                  <span>Status</span>
                </div>

                {ORDERS.map((item) => (
                  <div className="ordersRow" key={item.id}>
                    <span>{item.id}</span>
                    <span className={item.side === "Buy" ? "up" : "down"}>{item.side}</span>
                    <span>{item.pair}</span>
                    <span>{item.price}</span>
                    <span>{item.amount}</span>
                    <span>{item.status}</span>
                  </div>
                ))}
              </div>
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
          padding-top: 76px;
          background:
            radial-gradient(circle at top left, rgba(240, 185, 11, 0.07), transparent 22%),
            radial-gradient(circle at top right, rgba(64, 169, 255, 0.05), transparent 18%),
            #0b0e11;
        }

        .exchangeShell {
          max-width: 1500px;
          margin: 0 auto;
          padding: 14px;
        }

        .heroBar {
          position: sticky;
          top: 68px;
          z-index: 80;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
          background: rgba(11, 14, 17, 0.96);
          backdrop-filter: blur(8px);
          padding-bottom: 4px;
        }

        .pairCard,
        .timeframesBar {
          background: #161a1e;
          border: 1px solid #232a32;
          border-radius: 16px;
        }

        .pairCard {
          padding: 16px;
        }

        .pairTop {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }

        .pairTop h1 {
          margin: 0;
          font-size: 1.7rem;
          color: #f0b90b;
        }

        .pairTop p {
          margin: 6px 0 0;
          color: #8d98a5;
        }

        .delta {
          padding: 8px 12px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 0.92rem;
        }

        .delta.up {
          color: #0ecb81;
          background: rgba(14, 203, 129, 0.12);
        }

        .delta.down {
          color: #f6465d;
          background: rgba(246, 70, 93, 0.12);
        }

        .pairGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .pairStat {
          background: #11161b;
          border: 1px solid #232a32;
          border-radius: 12px;
          padding: 12px;
        }

        .pairStat span {
          display: block;
          color: #8d98a5;
          font-size: 0.8rem;
          margin-bottom: 6px;
        }

        .pairStat strong {
          font-size: 1rem;
          color: #ffffff;
        }

        .timeframesBar {
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .timeframesBar button,
        .mobileTabs button,
        .segmentTabs button,
        .orderTypeTabs button,
        .rangeRow button {
          cursor: pointer;
          border: 1px solid #2b3139;
          background: #0f1318;
          color: #e6edf3;
          border-radius: 10px;
          padding: 10px 12px;
          font-weight: 700;
        }

        .timeframesBar button.active,
        .mobileTabs button.active,
        .orderTypeTabs button.active {
          background: #f0b90b;
          color: #111111;
          border-color: #f0b90b;
        }

        .mobileTabs {
          display: none;
          gap: 8px;
          margin-bottom: 12px;
          overflow-x: auto;
          padding-bottom: 3px;
        }

        .terminalGrid {
          display: grid;
          grid-template-columns: 270px minmax(0, 1.45fr) 320px;
          gap: 14px;
          align-items: start;
        }

        .panel {
          background: #161a1e;
          border: 1px solid #232a32;
          border-radius: 16px;
          overflow: hidden;
          min-width: 0;
        }

        .marketsPanel {
          grid-row: span 2;
          max-height: calc(100vh - 165px);
          position: sticky;
          top: 166px;
        }

        .tradePanel {
          position: sticky;
          top: 166px;
        }

        .ordersPanel {
          grid-column: 2 / 4;
        }

        .panelHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-bottom: 1px solid #232a32;
          background: #11161b;
        }

        .panelHeader h2 {
          margin: 0;
          font-size: 1rem;
          color: #ffffff;
        }

        .chartBadges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chartBadges span {
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          color: #9aa4af;
          font-size: 0.75rem;
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
          color: #ffffff;
          border-radius: 10px;
          padding: 12px 14px;
          outline: none;
          font-size: 0.95rem;
        }

        .marketList {
          max-height: calc(100vh - 255px);
          overflow-y: auto;
        }

        .marketRow {
          width: 100%;
          border: 0;
          background: transparent;
          color: #ffffff;
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
          font-size: 0.94rem;
        }

        .marketRow span {
          display: block;
          font-size: 0.8rem;
          color: #8d98a5;
          margin-top: 4px;
        }

        .marketRight {
          text-align: right;
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
          background: #11161b;
        }

        .bookLabel {
          padding: 12px 16px 6px;
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #8d98a5;
        }

        .midPrice {
          padding: 14px 16px;
          font-size: 1.14rem;
          font-weight: 800;
          color: #f0b90b;
          border-top: 1px solid #232a32;
          border-bottom: 1px solid #232a32;
          background: #11161b;
        }

        .segmentTabs,
        .orderTypeTabs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding: 16px;
        }

        .segmentTabs {
          padding-bottom: 10px;
        }

        .segmentTabs button.active.buy {
          background: #0ecb81;
          color: #08130e;
          border-color: #0ecb81;
        }

        .segmentTabs button.active.sell {
          background: #f6465d;
          color: #18090d;
          border-color: #f6465d;
        }

        .orderTypeTabs {
          padding-top: 0;
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

        .rangeRow {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          padding: 0 16px 14px;
        }

        .walletInfo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 0 16px 16px;
        }

        .walletInfo div {
          background: #11161b;
          border: 1px solid #232a32;
          border-radius: 12px;
          padding: 12px;
        }

        .walletInfo span {
          display: block;
          color: #8d98a5;
          font-size: 0.8rem;
          margin-bottom: 6px;
        }

        .walletInfo strong {
          color: #ffffff;
        }

        .submitButton {
          margin: 16px;
          width: calc(100% - 32px);
          border: 0;
          border-radius: 12px;
          padding: 14px 16px;
          font-weight: 800;
          cursor: pointer;
          font-size: 1rem;
        }

        .submitButton.buy {
          background: #0ecb81;
          color: #09150f;
        }

        .submitButton.sell {
          background: #f6465d;
          color: #18090d;
        }

        .ordersTable {
          width: 100%;
          overflow-x: auto;
        }

        .ordersHead,
        .ordersRow {
          display: grid;
          grid-template-columns: 100px 80px 110px 130px 110px 90px;
          gap: 12px;
          padding: 12px 16px;
          min-width: 680px;
          font-size: 0.9rem;
        }

        .ordersHead {
          color: #8d98a5;
          border-bottom: 1px solid #232a32;
          background: #11161b;
        }

        .ordersRow {
          border-bottom: 1px solid #20262d;
          color: #d8dee6;
        }

        .up {
          color: #0ecb81;
        }

        .down {
          color: #f6465d;
        }

        @media (max-width: 1280px) {
          .heroBar {
            grid-template-columns: 1fr;
          }

          .pairGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .terminalGrid {
            grid-template-columns: 250px minmax(0, 1fr) 300px;
          }
        }

        @media (max-width: 1080px) {
          .terminalGrid {
            grid-template-columns: 1fr 1fr;
          }

          .marketsPanel,
          .tradePanel {
            position: static;
            max-height: none;
          }

          .chartPanel {
            grid-column: 1 / -1;
          }

          .ordersPanel {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .exchangePage {
            padding-top: 72px;
          }

          .exchangeShell {
            padding: 10px;
          }

          .heroBar {
            position: static;
            gap: 10px;
            margin-bottom: 10px;
          }

          .pairTop {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .pairTop h1 {
            font-size: 1.35rem;
          }

          .pairGrid {
            grid-template-columns: 1fr 1fr;
          }

          .mobileTabs {
            display: flex;
          }

          .terminalGrid {
            display: block;
          }

          .marketsPanel {
            margin-bottom: 10px;
          }

          .mobilePane {
            display: none;
          }

          .mobilePane.showMobile {
            display: block;
            margin-bottom: 10px;
          }

          .tradePanel {
            position: static;
          }

          .bookHeader,
          .bookRow {
            padding-left: 12px;
            padding-right: 12px;
            gap: 6px;
            font-size: 0.8rem;
          }

          .marketSearch,
          .panelHeader,
          .segmentTabs,
          .orderTypeTabs,
          .formGroup,
          .rangeRow {
            padding-left: 12px;
            padding-right: 12px;
          }

          .walletInfo {
            grid-template-columns: 1fr;
            padding-left: 12px;
            padding-right: 12px;
          }

          .submitButton {
            width: calc(100% - 24px);
            margin: 12px;
          }
        }

        @media (max-width: 480px) {
          .pairGrid {
            grid-template-columns: 1fr;
          }

          .timeframesBar {
            gap: 6px;
            padding: 10px;
          }

          .timeframesBar button,
          .mobileTabs button {
            padding: 9px 10px;
            font-size: 0.82rem;
          }

          .rangeRow {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}