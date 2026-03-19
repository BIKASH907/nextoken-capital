// Remove the extra nav here if it's already in your index.js
function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* <Navbar />  <-- DELETE THIS IF IT IS REPEATING */}
      <Component {...pageProps} />
    </>
  );
}