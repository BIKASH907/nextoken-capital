import "../styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: '#0b0e11', minHeight: '100vh' }}>
      <Header />
      {/* This pt-[64px] ensures your content starts right at the edge of the header */}
      <main className="pt-[64px]">
        <Component {...pageProps} />
      </main>
    </div>
  );
}