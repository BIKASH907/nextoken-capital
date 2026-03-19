import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nextoken Capital</title>
        <meta
          name="description"
          content="Nextoken Capital digital capital markets platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#050816",
          color: "#ffffff",
        }}
      >
        <section
          className="hero-bg"
          style={{
            minHeight: "calc(100vh - 140px)",
            display: "flex",
            alignItems: "center",
            padding: "80px 20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1280px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                maxWidth: "760px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 16px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "#cbd5e1",
                  fontWeight: 700,
                  fontSize: "14px",
                  marginBottom: "22px",
                }}
              >
                Next Generation Digital Capital Markets
              </div>

              <h1
                style={{
                  margin: "0 0 20px",
                  fontSize: "clamp(42px, 8vw, 84px)",
                  lineHeight: "1.04",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                The Future of
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #60a5fa, #22d3ee, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Digital Capital
                </span>
              </h1>

              <p
                style={{
                  margin: "0 0 32px",
                  maxWidth: "680px",
                  color: "rgba(255,255,255,0.74)",
                  fontSize: "18px",
                  lineHeight: "1.8",
                }}
              >
                Nextoken Capital delivers a modern platform for exchange,
                bonds, equity offerings, and tokenization with a secure,
                investor-friendly experience built for global capital markets.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href="/register"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "52px",
                    padding: "14px 24px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Get Started
                </a>

                <a
                  href="/markets"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "52px",
                    padding: "14px 24px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Explore Markets
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}