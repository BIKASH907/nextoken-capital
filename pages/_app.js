// pages/_app.js
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppProvider } from "../lib/AppContext";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => setLoading(true);
    const end   = () => setLoading(false);
    router.events.on("routeChangeStart",    start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError",    end);
    return () => {
      router.events.off("routeChangeStart",    start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError",    end);
    };
  }, [router]);

  return (
    <AppProvider>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0B0E11" />
        <meta name="description" content="Nextoken Capital — regulated infrastructure for tokenized real-world assets. Invest from EUR 100." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap" rel="stylesheet" />
      </Head>

      {loading && (
        <div style={{ position:"fixed",top:0,left:0,right:0,height:2,background:"#F0B90B",zIndex:9999,animation:"lb .8s ease-out forwards" }} />
      )}

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth;overflow-x:hidden}
        body{background:#0B0E11;color:#fff;font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        a{color:inherit}
        button,input,select,textarea{font-family:inherit}
        img{max-width:100%;display:block}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#0B0E11}
        ::-webkit-scrollbar-thumb{background:rgba(240,185,11,0.3);border-radius:3px}
        ::selection{background:rgba(240,185,11,0.22);color:#fff}
        @keyframes lb{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}
      `}</style>

      <Component {...pageProps} />
    </AppProvider>
  );
}