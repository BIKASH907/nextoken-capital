import "../styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* This is your Binance-style Header */}
      <Header />
      
      {/* The pt-24 (96px) ensures your page content 
        starts below the fixed header so nothing is hidden.
      */}
      <main className="pt-24 min-h-screen bg-[#0b0e11] text-white">
        <Component {...pageProps} />
      </main>
    </>
  );
}