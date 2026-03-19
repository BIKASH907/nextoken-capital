import Head from 'next/head';

export default function Home() {
  return (
    <div className="w-full bg-[#0b0e11] text-white">
      <Head>
        <title>Nextoken Capital | The Global Platform</title>
      </Head>

      {/* Hero Section: Replace '/hero-bg.jpg' with your actual filename in public/ */}
      <section 
        className="relative w-full pt-16 pb-32 px-4 md:px-8 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "linear-gradient(rgba(11,14,17,0.7), rgba(11,14,17,0.8)), url('/hero-bg.jpg')" 
        }}
      >
        <div className="max-w-[1440px] mx-auto relative z-10 text-center">
          
          {/* Regulatory Tag */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] md:text-xs font-semibold text-white uppercase tracking-[2px]">
                MiCA Licensed • EU Regulated • DLT Pilot Regime
              </span>
            </div>
          </div>

          {/* Typography: Adjusted for readability against background */}
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-black leading-[1.1] mb-8 drop-shadow-2xl">
              The Global Platform <br />
              <span className="text-[#F0B90B]">for Tokenized Capital Markets</span>
            </h1>
            
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium drop-shadow-lg">
              Access institutional-grade private equity, venture capital, and tokenized bonds 
              on a fully regulated European infrastructure.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="bg-[#F0B90B] text-black px-10 py-4 rounded-md font-extrabold shadow-xl hover:scale-105 transition-transform active:scale-95">
              Start Investing
            </button>
            <button className="bg-transparent text-white border border-white/30 px-10 py-4 rounded-md font-bold hover:bg-white/10 transition-all">
              Tokenize Assets
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}