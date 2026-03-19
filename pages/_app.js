import "../styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: '#0b0e11', minHeight: '100vh', margin: 0, padding: 0 }}>
      <Header />
      {/* This creates the exact space needed for the header with no extra gap */}
      <main style={{ paddingTop: '64px' }}>
        <Component {...pageProps} />
      </main>
    </div>
  );
}