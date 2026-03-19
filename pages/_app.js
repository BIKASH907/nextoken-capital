import "../styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <div className="bg-[#0b0e11] min-h-screen">
      <Header />
      {/* pt-16 matches the h-16 of the header to remove the gap and overlapping */}
      <main className="pt-16 sm:pt-20">
        <Component {...pageProps} />
      </main>
    </div>
  );
}