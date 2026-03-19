import "../styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <div className="bg-[#0b0e11] min-h-screen flex flex-col m-0 p-0">
      <Header />
      {/* pt-16 (64px) matches the header height to eliminate the gap */}
      <main className="flex-grow pt-16 m-0 p-0 overflow-x-hidden">
        <Component {...pageProps} />
      </main>
    </div>
  );
}