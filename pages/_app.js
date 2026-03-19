import "../styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: '#0b0e11', minHeight: '100vh' }}>
      <Header />
      {/* pt-16 (64px) ensures the content starts perfectly after the header ends */}
      <main className="pt-16">
        <Component {...pageProps} />
      </main>
    </div>
  );
}