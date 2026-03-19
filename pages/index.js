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
      </Head>

      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#050816",
          color: "#ffffff",
          paddingTop: "120px",
        }}
      >
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              margin: "0 0 20px",
            }}
          >
            Homepage
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            If you can see the black bar at the top, the navbar is working.
          </p>
        </section>
      </main>
    </>
  );
}