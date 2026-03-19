import "../styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <div className="bg-[#0b0e11] min-h-screen flex flex-col m-0 p-0">
      <Header />
      {/* pt-[64px] (16rem) matches the h-16 (64px) height of the fixed header */}
      <main className="flex-grow pt-[64px] m-0 p-0 overflow-x-hidden">
        <Component {...pageProps} />
      </main>
    </div>
  );
}