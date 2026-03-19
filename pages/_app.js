import React from 'react';
import '../styles/globals.css'; // Ensure your CSS path is correct

function MyApp({ Component, pageProps }) {
  // If you have a Layout component, wrap <Component /> with it here
  return <Component {...pageProps} />;
}

export default MyApp;