import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header"; // Adjust path if needed

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      {/* pt-24 adds space so your content doesn't hide behind the fixed header */}
      <div className="pt-24"> 
        <Component {...pageProps} />
      </div>
    </>
  );
}