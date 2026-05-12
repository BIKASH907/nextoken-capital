import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { listPosts, getPost } from "../../lib/blogReader";

export async function getStaticPaths() {
  const posts = listPosts();
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const post = getPost(params.slug);
  if (!post) return { notFound: true };
  return { props: { post }, revalidate: 300 };
}

export default function BlogPost({ post }) {
  return (
    <>
      <Head>
        <title>{post.title} — Nextoken Capital</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
      </Head>
      <Navbar />
      <style>{`
        .pb{min-height:100vh;background:#0B0E11;padding-top:64px;color:#fff;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif}
        .pb-hero{max-width:780px;margin:0 auto;padding:48px 20px 24px;text-align:center}
        .pb-cat{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px}
        .pb-title{font-size:clamp(28px,4vw,42px);font-weight:900;letter-spacing:-1px;line-height:1.2;margin-bottom:14px}
        .pb-meta{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:24px}
        .pb-meta span{margin:0 8px}
        .pb-body{max-width:760px;margin:0 auto;padding:0 20px 80px}
        .pb-body h1{font-size:28px;font-weight:900;margin:28px 0 16px;color:#fff}
        .pb-body h2{font-size:22px;font-weight:800;margin:36px 0 14px;color:#fff;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:8px}
        .pb-body h3{font-size:17px;font-weight:800;margin:24px 0 10px;color:#F0B90B}
        .pb-body p{font-size:16px;line-height:1.85;color:rgba(255,255,255,0.78);margin:0 0 18px}
        .pb-body ul{margin:0 0 18px 22px;padding:0}
        .pb-body li{font-size:16px;line-height:1.8;color:rgba(255,255,255,0.78);margin-bottom:8px}
        .pb-body a{color:#F0B90B;text-decoration:underline;text-underline-offset:3px}
        .pb-body a:hover{opacity:.8}
        .pb-body strong{color:#fff;font-weight:700}
        .pb-body code{background:rgba(255,255,255,0.07);padding:2px 6px;border-radius:4px;font-family:Menlo,Monaco,Consolas,monospace;font-size:14px;color:#F0B90B}
        .pb-body hr{border:none;border-top:1px solid rgba(255,255,255,0.1);margin:36px 0}
        .pb-cta{margin-top:48px;padding:28px;background:#0F1318;border:1px solid rgba(240,185,11,0.2);border-radius:14px;text-align:center}
        .pb-cta-title{font-size:18px;font-weight:800;margin-bottom:8px}
        .pb-cta-sub{font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:16px}
        .pb-cta-btn{display:inline-block;padding:10px 24px;background:#F0B90B;color:#0B0E11;border-radius:9px;font-size:13px;font-weight:800;text-decoration:none}
        .pb-back{display:inline-block;font-size:12px;color:rgba(255,255,255,0.5);text-decoration:none;margin-bottom:24px}
        .pb-back:hover{color:#F0B90B}
      `}</style>
      <article className="pb">
        <div className="pb-hero">
          <Link href="/blog" className="pb-back">← Back to blog</Link>
          <div className="pb-cat">{post.category}</div>
          <h1 className="pb-title">{post.title}</h1>
          <div className="pb-meta">
            <span>{post.author}</span>•
            <span>{post.date}</span>•
            <span>⏱ {post.readTime} read</span>
          </div>
        </div>
        <div className="pb-body" dangerouslySetInnerHTML={{ __html: post.html }} />
        <div className="pb-body">
          <div className="pb-cta">
            <div className="pb-cta-title">Ready to invest?</div>
            <div className="pb-cta-sub">Browse verified tokenized assets, complete KYC in minutes, and invest from EUR 100.</div>
            <Link href="/register" className="pb-cta-btn">Create Free Account →</Link>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
