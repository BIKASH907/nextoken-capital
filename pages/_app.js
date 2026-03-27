import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppProvider } from "../lib/AppContext";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon, mainnet, arbitrum, optimism, bsc, base, avalanche } from "wagmi/chains";

const NxtChatbot = dynamic(() => import("../components/NxtChatbot"), { ssr: false });

const config = getDefaultConfig({
  appName: "Nextoken Capital",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "nextoken-capital-rwa",
  chains: [polygon, mainnet, arbitrum, optimism, bsc, base, avalanche],
  ssr: true,
});

const queryClient = new QueryClient();

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
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#F0B90B",
            accentColorForeground: "#000",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
          modalSize="compact"
        >
          <SessionProvider session={pageProps.session}>
            <AppProvider>
              <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#0B0E11" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/logo.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap" rel="stylesheet" />
              </Head>

              {loading && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "#F0B90B", zIndex: 9999 }} />
              )}

              <style global jsx>{`
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

                /* Fix RainbowKit modal scroll */
                [data-rk] { font-family: 'DM Sans', system-ui, sans-serif !important; }
                [data-rk] dialog { overflow-y: auto !important; }
                [data-rk] [role="dialog"] { overflow-y: auto !important; max-height: 90vh !important; }

                .nb{position:fixed!important;top:0!important;left:0!important;right:0!important;z-index:9000!important;height:64px!important;display:flex!important;align-items:center!important;background:#0B0E11!important;border-bottom:1px solid rgba(240,185,11,0.15)!important}
                .nb.sc{background:#0B0E11!important;border-bottom:1px solid rgba(240,185,11,0.25)!important;box-shadow:0 2px 20px rgba(0,0,0,0.5)!important}
                .nb.tp{background:rgba(11,14,17,0.95)!important;border-bottom:1px solid rgba(255,255,255,0.08)!important}
                .nb-in{width:100%;max-width:1280px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;gap:16px}
                .nb-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0}
                .nb-nxt{font-size:20px;font-weight:900;color:#F0B90B;letter-spacing:-.5px}
                .nb-div{width:1px;height:26px;background:rgba(255,255,255,0.2)}
                .nb-txt{display:flex;flex-direction:column;line-height:1.2}
                .nb-t1{font-size:11px;font-weight:800;color:#fff;letter-spacing:2px}
                .nb-t2{font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:3px}
                .nb-links{display:flex;align-items:center;gap:2px;flex:1;justify-content:center}
                .nb-links a{padding:7px 14px;border-radius:7px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.7);text-decoration:none;transition:color .15s,background .15s;white-space:nowrap}
                .nb-links a:hover{color:#fff;background:rgba(255,255,255,0.08)}
                .nb-links a.on{color:#F0B90B;background:rgba(240,185,11,0.1)}
                .nb-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
                .nb-login{padding:8px 16px;border-radius:7px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.8);background:transparent;border:1px solid rgba(255,255,255,0.18);text-decoration:none;transition:all .15s;white-space:nowrap}
                .nb-login:hover{border-color:rgba(255,255,255,0.45);color:#fff}
                .nb-register{padding:8px 18px;border-radius:7px;font-size:13px;font-weight:700;color:#000;background:#F0B90B;border:none;text-decoration:none;transition:background .15s;cursor:pointer;white-space:nowrap;display:inline-block}
                .nb-register:hover{background:#FFD000}
                .nb-burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}
                .nb-burger span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:all .25s}
                .nb-mob{display:none;position:fixed;top:64px;left:0;right:0;bottom:0;background:rgba(9,12,15,0.99);padding:20px;overflow-y:auto;z-index:8999;flex-direction:column;gap:6px}
                .nb-mob.open{display:flex!important}
                .nb-mob a{display:block;padding:15px 18px;border-radius:10px;font-size:16px;font-weight:600;color:rgba(255,255,255,0.8);text-decoration:none;border:1px solid rgba(255,255,255,0.08);transition:all .15s}
                .nb-mob a:hover,.nb-mob a.on{color:#F0B90B;background:rgba(240,185,11,0.08);border-color:rgba(240,185,11,0.22)}
                .nb-mob-div{height:1px;background:rgba(255,255,255,0.08);margin:8px 0}
                .nb-mob-login{display:block;padding:14px 18px;border-radius:10px;font-size:15px;font-weight:700;color:rgba(255,255,255,0.8);text-decoration:none;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);text-align:center;margin-bottom:8px}
                .nb-mob-reg{display:block;padding:14px 18px;border-radius:10px;font-size:15px;font-weight:700;color:#000;text-decoration:none;background:#F0B90B;text-align:center}
                @media(max-width:900px){.nb-links{display:none}}
                @media(max-width:640px){.nb-login,.nb-register{display:none!important}.nb-burger{display:flex!important}}
              `}</style>

              <Component {...pageProps} />
              <NxtChatbot />
            </AppProvider>
          </SessionProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}