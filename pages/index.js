import Head from 'next/head';

// --- INSTRUCTIONS: ---
// 1. Place your background image file in the 'public/images/' folder.
// 2. Change the filename in the bg-[url(...)] class below to your actual filename.
// --------------------

export default function Home() {
  return (
    <div className="w-full bg-[#0b0e11] text-white">
      <Head>
        <title>Nextoken Capital | The Global Platform for Tokenized Capital Markets</title>
        <meta name="description" content="MiCA Licensed, EU Regulated DLT Pilot Regime Platform" />
      </Head>

      {/* Hero Section */}
      {/* UPDATE the 'bg-hero-image.jpg' below to your actual filename */}
      <section className="relative w-full pt-10 pb-20 px-4 md:px-8 overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/bg-hero-image.jpg')]">
        
        {/* Subtle Background Overlay for improved contrast */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
        
        {/* Additional subtle center glow decoration (Optional) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#F0B90B]/5 blur-[120px] rounded-full pointer-events-none z-1" />

        <div className="max-w-[1440px] mx-auto relative z-10">
          
          {/* REGULATORY TAGS - Positioned correctly */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#4ade80]" />
              <span className="text-[10px] md:text-xs font-semibold text-white uppercase tracking-[2.5px]">
                MiCA Licensed • EU Regulated • DLT Pilot Regime
              </span>
            </div>
          </div>

          {/* MAIN HERO TEXT WITH MATCHING TWEAKS */}
          <div className="text-center max-w-[960px] mx-auto mb-16">
            <h1 className="text-[48px] sm:text-[64px] md:text-[80px] lg:text-[88px] font-black leading-[1.05] tracking-tight mb-8">
              {/* Text shadow on white text to pop against any background part */}
              <span className="[text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
                The Global Platform
              </span><br />
              {/* No shadow on gold text (or very light) so it remains true to color */}
              <span className="text-[#F0B90B] font-black">
                for Tokenized Capital Markets
              </span>
            </h1>
            
            {/* Paragraph text: Increased visibility with shadow and slightly thicker weight */}
            <p className="[text-shadow:0_2px_3px_rgba(0,0,0,0.7)] text-white font-medium text-[16px] md:text-[18px] lg:text-[20px] max-w-[640px] mx-auto leading-relaxed">
              Access institutional-grade private equity, venture capital, and tokenized bonds 
              on a fully regulated European infrastructure.
            </p>
          </div>

          {/* CALL TO ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
            <button className="w-full sm:w-auto px-10 py-4 bg-[#F0B90B] text-black font-extrabold rounded-md hover:bg-[#fcd535] transition-all transform hover:scale-[1.03] active:scale-95 shadow-lg">
              Start Investing
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-transparent text-white border border-white/30 font-bold rounded-md hover:bg-white/5 transition-all shadow-md">
              Tokenize Assets
            </button>
          </div>

          {/* REST OF YOUR PAGE PREVIEW CARDS BELOW */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
          {/* Card 1, Card 2, Card 3 from previous steps */}
          {/* </div> */}

        </div>
      </section>
    </div>
  );
}