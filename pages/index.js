import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-white font-sans selection:bg-[#F0B90B] selection:text-black">
      <Head>
        <title>Nextoken Capital | The Global Platform</title>
        <meta name="description" content="Institutional-grade private equity and tokenized bonds on regulated European infrastructure." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <main className="relative w-full overflow-hidden">
        
        {/* Background Image with Next/Image for Optimization */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg" // Ensure this file is in your /public folder
            alt="Global Finance Background"
            layout="fill"
            objectFit="cover"
            priority
            className="opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e11]/60 via-[#0b0e11]/90 to-[#0b0e11]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-40 text-center">
          
          {/* Regulatory Badge */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                MiCA Licensed • EU Regulated • DLT Pilot Regime
              </span>
            </div>
          </div>

          {/* Headline Container */}
          <div className="max-w-5xl mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight mb-8">
              The Global Platform <br />
              <span className="text-[#F0B90B] drop-shadow-lg">for Tokenized Capital Markets</span>
            </h1>
            
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Access institutional-grade private equity, venture capital, and tokenized bonds 
              on a fully regulated European infrastructure.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto bg-[#F0B90B] text-black px-12 py-4 rounded-md font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(240,185,11,0.2)] hover:scale-105 transition-all active:scale-95">
              Start Investing
            </button>
            <button className="w-full sm:w-auto bg-transparent text-white border border-white/20 px-12 py-4 rounded-md font-bold text-sm uppercase tracking-widest hover:bg-white/5 hover:border-white/40 transition-all">
              Tokenize Assets
            </button>
          </div>
        </div>
      </main>

      {/* Decorative Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#F0B90B]/5 blur-[120px] pointer-events-none" />
    </div>
  );
}