import Head from "next/head";

const POSTS = [
  { date: "Mar 15, 2026", tag: "Platform", title: "Nextoken Capital Launches ERC-3643 Bond Marketplace", excerpt: "We've officially launched our tokenized bond marketplace featuring 6 live listings including green bonds, corporate notes, and municipal offerings with yields up to 8.2%.", readTime: "3 min" },
  { date: "Mar 8, 2026", tag: "Education", title: "What is ERC-3643? The T-REX Protocol Explained", excerpt: "ERC-3643, also known as the T-REX (Token for Regulated EXchanges) protocol, is the leading standard for compliant security tokens on Ethereum. Here's how it works.", readTime: "5 min" },
  { date: "Mar 1, 2026", tag: "Regulation", title: "How MiCA Regulation Shapes Tokenized Asset Markets in 2026", excerpt: "The EU's Markets in Crypto-Assets (MiCA) regulation is now fully in effect. We break down what this means for issuers and investors on the Nextoken platform.", readTime: "6 min" },
  { date: "Feb 22, 2026", tag: "Education", title: "Tokenizing Real Estate: A Step-by-Step Guide for Issuers", excerpt: "From asset valuation to secondary market readiness — our complete guide to tokenizing commercial and residential real estate on Nextoken Capital.", readTime: "8 min" },
  { date: "Feb 14, 2026", tag: "Platform", title: "Secondary Market Trading Now Live on the Exchange", excerpt: "Investors can now trade previously issued tokenized securities on our Exchange. Smart contracts enforce eligibility rules automatically for every transaction.", readTime: "3 min" },
  { date: "Feb 7, 2026", tag: "Company", title: "Nextoken Capital: Building the Future of Capital Formation in Vilnius", excerpt: "Our founder Bikash Bhat shares the vision behind Nextoken Capital — why Lithuania, why blockchain, and why now is the moment for tokenized real-world assets.", readTime: "4 min" },
];

const tagColors = { Platform: "#1a3a5c", Education: "#1a3a2a", Regulation: "#3a1a1a", Company: "#2a1a3a" };
const tagText = { Platform: "#4dabf7", Education: "#51cf66", Regulation: "#ff6b6b", Company: "#cc5de8" };

export default function BlogPage() {
  const s = {
    page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "80px 20px" },
    wrap: { maxWidth: 1100, margin: "0 auto" },
    tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 },
    h1: { fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 },
    sub: { fontSize: 16, color: "#848e9c", marginBottom: 48 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 24 },
    card: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 16, padding: "28px", display: "flex", flexDirection: "column", gap: 12, transition: "border-color 0.2s", cursor: "pointer" },
    postTag: { display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em" },
    postTitle: { fontSize: 16, fontWeight: 700, lineHeight: 1.4, color: "#eaecef" },
    postExcerpt: { fontSize: 13, color: "#848e9c", lineHeight: 1.6, flex: 1 },
    postMeta: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "#474d57", marginTop: 4 },
  };

  return (
    <>
      <Head><title>Blog — Nextoken Capital</title></Head>
      <div style={s.page}>
        <div style={s.wrap}>
          <div style={s.tag}>Insights & Updates</div>
          <h1 style={s.h1}>Nextoken <span style={{ color: "#f0b90b" }}>Blog</span></h1>
          <p style={s.sub}>News, education, and platform updates from our team in Vilnius, Lithuania.</p>
          <div style={s.grid}>
            {POSTS.map((post, i) => (
              <div key={i} style={s.card}
                onMouseOver={e => e.currentTarget.style.borderColor = "#f0b90b"}
                onMouseOut={e => e.currentTarget.style.borderColor = "#1e2329"}
              >
                <span style={{ ...s.postTag, background: tagColors[post.tag] || "#1e2329", color: tagText[post.tag] || "#848e9c" }}>{post.tag}</span>
                <div style={s.postTitle}>{post.title}</div>
                <div style={s.postExcerpt}>{post.excerpt}</div>
                <div style={s.postMeta}><span>{post.date}</span><span>{post.readTime} read</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
