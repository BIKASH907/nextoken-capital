import "@/styles/globals.css";
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <div className="pt-24"> 
        <Component {...pageProps} />
      </div>
    </>
  );
}