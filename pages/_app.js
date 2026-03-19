import React from 'react';
import '../styles/globals.css';
import Navbar from '../components/Navbar'; // Import the new Navbar
import Footer from '../components/Footer';

export default function MyApp({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: "#05060a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar /> {/* This makes it appear on every page */}
      <main style={{ flex: 1 }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}