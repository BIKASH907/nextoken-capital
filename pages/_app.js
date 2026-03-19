import React from 'react';
import '../styles/globals.css';
import Footer from '../components/Footer';

// This MUST be "export default" to reveal your pages
export default function MyApp({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: "#05060a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1 }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}