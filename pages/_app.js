import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* This ensures responsive scaling on mobile devices */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Global SEO / Branding */}
        <meta name="theme-color" content="#0b0e11" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* This Component tag renders the specific page you are visiting 
          (like index.js). By wrapping it here, your globals.css 
          applies to the entire website.
      */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;