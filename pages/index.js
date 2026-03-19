import Head from 'next/head';

export default function Home() {
  return (
    <div className="w-full bg-[#0b0e11] text-white">
      <Head>
        <title>Nextoken Capital | The Global Platform for Tokenized Capital Markets</title>
        <meta name="description" content="MiCA Licensed, EU Regulated DLT Pilot Regime Platform" />
      </Head>

      {/* Hero Section - Use pt (padding) instead of mt (margin) to prevent the gap */}
      <section className="relative w-full pt-10 pb-20 px-4 md:px-8 overflow-hidden">
        
        {/* BACKGROUND DECORATION (Optional subtle glow) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#F0B90B]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1440px] mx-auto relative z-10">
          
          {/* REGULATORY TAGS - Matching Image 6 & 10 */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider">
                MiCA Licensed • EU Regulated • DLT Pilot Regime
              </span>
            </div>
          </div>

          {/* MAIN HERO TEXT */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              The Global Platform <br />
              <span className="text-[#F0B90B]">for Tokenized Capital Markets</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Access institutional-grade private equity, venture capital, and tokenized bonds 
              on a fully regulated European infrastructure.
            </p>
          </div>

          {/* CALL TO ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#F0B90B] text-black font-bold rounded-lg hover:bg-[#fcd535] transition-all transform hover:scale-105">
              Start Investing
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/20 font-bold rounded-lg hover:bg-white/5 transition-all">
              Tokenize Assets
            </button>
          </div>

          {/* PREVIEW CARDS - Inspired by your Vilnius Office and Bond images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* CARD 1: Tokenized Bond */}
            <div className="p-6 rounded-2xl bg-[#181a20] border border-white/5 hover:border-[#F0B90B]/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-[#F0B90B] uppercase tracking-widest">Tokenized Bond</span>
                <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-[10px] font-bold">LIVE</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">€ 10,000</h3>
              <p className="text-white/40 text-xs mb-4">EU Gov Bond • 5.2% APY</p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[65%] h-full bg-[#F0B90B]" />
              </div>
            </div>

            {/* CARD 2: Real Estate Token */}
            <div className="p-6 rounded-2xl bg-[#181a20] border border-white/5 hover:border-[#F0B90B]/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-[#F0B90B] uppercase tracking-widest">Real Estate</span>
                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold">TRADEABLE</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">Vilnius Office</h3>
              <p className="text-white/40 text-xs mb-4">€2.4M • 847 Tokens Available</p>
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded text-xs font-bold transition-colors">
                View Details
              </button>
            </div>

            {/* CARD 3: Agro Fund */}
            <div className="p-6 rounded-2xl bg-[#181a20] border border-white/5 hover:border-[#F0B90B]/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-[#F0B90B] uppercase tracking-widest">Private Equity</span>
                <span className="px-2 py-1 rounded bg-yellow-500/10 text-[#F0B90B] text-[10px] font-bold">PRE-SALE</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">Himalayan Potato Fund</h3>
              <p className="text-white/40 text-xs mb-4">Scaling Nepal's Agro Exports</p>
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded text-xs font-bold transition-colors">
                Learn More
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}