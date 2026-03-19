import "../styles/globals.css"; // Ensure this has two dots (..)
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-[#0b0e11] text-white">
        <Component {...pageProps} />
      </main>
    </>
  );
}