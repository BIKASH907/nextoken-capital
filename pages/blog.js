import Head from "next/head";
const POSTS = [{ date: "Mar 15, 2026", tag: "Platform", title: "Nextoken Capital Launches ERC-3643 Bond Marketplace", excerpt: "We have launched our tokenized bond marketplace featuring 6 live listings including green bonds, corporate notes, and municipal offerings with yields up to 8.2%.", readTime: "3 min" }, { date: "Mar 8, 2026", tag: "Education", title: "What is ERC-3643? The T-REX Protocol Explained", excerpt: "ERC-3643, known as the T-REX protocol, is the leading standard for compliant security tokens on Ethereum. Here is how it works.", readTime: "5 min" }, { date: "Mar 1, 2026", tag: "Regulation", title: "How MiCA Regulation Shapes Tokenized Asset Markets in 2026", excerpt: "The EU Markets in Crypto-Assets MiCA regulation is now fully in effect. We break down what this means for issuers and investors.", readTime: "6 min" }, { date: "Feb 22, 2026", tag: "Education", title: "Tokenizing Real Estate: A Step-by-Step Guide for Issuers", excerpt: "From asset valuation to secondary market readiness — our complete guide to tokenizing commercial and residential real estate.", readTime: "8 min" }, { date: "Feb 14, 2026", tag: "Platform", title: "Secondary Market Trading Now Live on the Exchange", excerpt: "Investors can now trade previously issued tokenized securities. Smart contracts enforce eligibility rules automatically.", readTime: "3 min" }, { date: "Feb 7, 2026", tag: "Company", title: "Building the Future of Capital Formation in Vilnius", excerpt: "Founder Bikash Bhat shares the vision behind Nextoken Capital and why now is the moment for tokenized real-world assets.", readTime: "4 min" }];
export default function BlogPage() {
  const s = { page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "80px 20px" }, wrap: { maxWidth: 1100, margin: "0 auto" }, tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }, h1: { fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 }, sub: { fontSize: 16, color: "#848e9c", marginBottom: 48 }, card: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 16, padding: "28px", display: "flex", flexDirection: "column", gap: 12, cursor: "pointer" } };
  return (
    <>
      <Head><title>Blog — Nextoken Capital</title></Head>
      <div style={s.page}><div style={s.wrap}>
        <div style={s.tag}>Insights</div>
        <h1 style={s.h1}>Nextoken <span style={{ color: "#f0b90b" }}>Blog</span></h1>
        <p style={s.sub}>News, education, and updates from our team in Vilnius, Lithuania.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 24 }}>
          {POSTS.map((post, i) => (
            <div key={i} style={s.card} onMouseOver={e => e.currentTarget.style.borderColor="#f0b90b"} onMouseOut={e => e.currentTarget.style.borderColor="#1e2329"}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#1e2329", color: "#f0b90b", alignSelf: "flex-start" }}>{post.tag}</span>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, color: "#eaecef" }}>{post.title}</div>
              <div style={{ fontSize: 13, color: "#848e9c", lineHeight: 1.6, flex: 1 }}>{post.excerpt}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#474d57" }}><span>{post.date}</span><span>{post.readTime} read</span></div>
            </div>
          ))}
        </div>
      </div></div>
    </>
  );
}
