import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { listPosts } from "../lib/blogReader";

export async function getStaticProps() {
  const posts = listPosts();
  return { props: { posts }, revalidate: 300 };
}

const CAT_ICON = {
  Regulation: "⚖️",
  Technology: "🔧",
  Fundamentals: "📚",
  Onboarding: "🪪",
  Process: "🛠️",
  Wallets: "🔐",
  Markets: "📊",
  Education: "📚",
  Investing: "💼",
  Platform: "🚀",
  Article: "📰",
};

export default function BlogPage({ posts }) {
  const cats = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  return (
    <>
      <Head>
        <title>Blog — Nextoken Capital</title>
        <meta name="description" content="Insights on tokenized assets, EU regulation, and investing — written by the Nextoken Capital team." />
      </Head>
      <Navbar />
      <style>{`
        .bl{min-height:100vh;background:#0B0E11;padding-top:64px}
        .bl-hero{padding:52px 20px 40px;border-bottom:1px solid rgba(255,255,255,0.07);text-align:center}
        .bl-tag{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
        .bl-h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#fff;letter-spacing:-1px;margin-bottom:10px}
        .bl-sub{font-size:14px;color:rgba(255,255,255,0.45);max-width:520px;margin:0 auto;line-height:1.7}
        .bl-body{max-width:1100px;margin:0 auto;padding:40px 20px 72px}
        .bl-cats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:36px}
        .bl-cat{padding:7px 16px;border-radius:7px;font-size:12px;font-weight:600;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(255,255,255,0.5);font-family:inherit}
        .bl-cat.on{background:rgba(240,185,11,0.1);border-color:rgba(240,185,11,0.35);color:#F0B90B}
        .bl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
        .bl-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:14px;overflow:hidden;transition:border-color .2s,transform .2s;text-decoration:none;color:inherit;display:flex;flex-direction:column}
        .bl-card:hover{border-color:rgba(240,185,11,0.25);transform:translateY(-2px)}
        .bl-card-img{height:140px;background:linear-gradient(135deg,rgba(240,185,11,0.08),rgba(255,255,255,0.03));display:flex;align-items:center;justify-content:center;font-size:40px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .bl-card-body{padding:20px;flex:1;display:flex;flex-direction:column}
        .bl-card-meta{display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap}
        .bl-card-cat{padding:3px 10px;border-radius:999px;font-size:10px;font-weight:700;background:rgba(240,185,11,0.1);color:#F0B90B;border:1px solid rgba(240,185,11,0.2)}
        .bl-card-date{font-size:11px;color:rgba(255,255,255,0.3)}
        .bl-card-title{font-size:15px;font-weight:800;color:#fff;line-height:1.4;margin-bottom:10px}
        .bl-card-excerpt{font-size:12px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:14px;flex:1}
        .bl-card-footer{display:flex;align-items:center;justify-content:space-between}
        .bl-read-time{font-size:11px;color:rgba(255,255,255,0.3)}
        .bl-read-link{font-size:12px;font-weight:700;color:#F0B90B;text-decoration:none}
        .bl-empty{text-align:center;padding:60px 20px;color:rgba(255,255,255,0.4);font-size:14px}
      `}</style>
      <div className="bl">
        <div className="bl-hero">
          <div className="bl-tag">Insights</div>
          <h1 className="bl-h1">Nextoken Capital Blog</h1>
          <p className="bl-sub">Plain-English guides to tokenized assets, EU regulation, custody, and the platform — written by our team in Vilnius.</p>
        </div>
        <div className="bl-body">
          <div className="bl-cats">
            {cats.map((c) => (
              <span key={c} className={`bl-cat${c === "All" ? " on" : ""}`}>{c}</span>
            ))}
          </div>
          {posts.length === 0 ? (
            <div className="bl-empty">No posts yet. Check back soon.</div>
          ) : (
            <div className="bl-grid">
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="bl-card">
                  <div className="bl-card-img">{CAT_ICON[p.category] || "📰"}</div>
                  <div className="bl-card-body">
                    <div className="bl-card-meta">
                      <span className="bl-card-cat">{p.category}</span>
                      <span className="bl-card-date">{p.date}</span>
                    </div>
                    <div className="bl-card-title">{p.title}</div>
                    <div className="bl-card-excerpt">{p.excerpt}</div>
                    <div className="bl-card-footer">
                      <span className="bl-read-time">⏱ {p.readTime} read</span>
                      <span className="bl-read-link">Read more →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
