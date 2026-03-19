import "../styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <div className="bg-[#0b0e11] min-h-screen flex flex-col">
      <Header />
      {/* pt-16 (64px) exactly offsets the fixed header. 
          The 'overflow-hidden' prevents internal margins from escaping.
      */}
      <main className="flex-grow pt-16 overflow-hidden">
        <Component {...pageProps} />
      </main>
    </div>
  );
}