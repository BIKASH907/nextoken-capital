import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nextoken Capital</title>
      </Head>

      <Navbar />

      <main className="main">
        <div className="container">
          <h1>Homepage</h1>
          <p>
            Welcome to Nextoken Capital — your global platform for digital
            capital markets.
          </p>
        </div>
      </main>

      <style jsx>{`
        .main {
          min-height: 100vh;
          background: #020a1a;
          color: white;
          padding-top: 120px;
        }

        .container {
          max-width: 1200px;
          margin: auto;
          padding: 20px;
        }

        h1 {
          font-size: 64px;
          margin-bottom: 20px;
        }

        p {
          font-size: 18px;
          color: #bbb;
        }
      `}</style>
    </>
  );
}