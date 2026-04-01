import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TOPICS = ["General Inquiry","Investment Question","Tokenize My Asset","Technical Support","Press & Media","Compliance & Legal","Partnership","Other"];

const INFO = [
  { icon:"📍", label:"Address",      value:"Saulėtekio al. 37 Vilnius, 10222, Lithuania" },
  { icon:"🏢", label:"Company",      value:"Nextoken Capital UAB" },
  { icon:"👤", label:"CEO & Founder",value:"Bikash Bhat" },
  { icon:"🏦", label:"Regulated by", value:"Lithuanian authorities" },
  { icon:"✉️", label:"Email",        value:"info@nextokencapital.com" },
  { icon:"🕐", label:"Office Hours", value:"Mon–Fri, 9am–6pm EET" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", topic:"General Inquiry", message:"" });
  const [sent, setSent] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <>
      <Head>
        <title>Contact Us — Nextoken Capital</title>
        <meta name="description" content="Get in touch with the Nextoken Capital team in Vilnius, Lithuania." />
      </Head>
      <Navbar />

      <style>{`
        .ct-page { min-height:100vh; background:#0B0E11; padding-top:64px; }
        .ct-hero { padding:56px 20px 40px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.07); }
        .ct-hero-tag { font-size:11px; font-weight:700; color:#F0B90B; letter-spacing:2px; text-transform:uppercase; margin-bottom:12px; }
        .ct-hero h1 { font-size:clamp(1.8rem,4vw,3rem); font-weight:900; color:#fff; letter-spacing:-1px; margin-bottom:10px; }
        .ct-hero h1 em { color:#F0B90B; font-style:normal; }
        .ct-hero p { font-size:14px; color:rgba(255,255,255,0.45); max-width:480px; margin:0 auto; line-height:1.7; }

        .ct-body { max-width:1100px; margin:0 auto; padding:48px 20px 72px; display:grid; grid-template-columns:1.2fr 0.8fr; gap:40px; align-items:start; }

        /* FORM */
        .ct-form-card { background:#0F1318; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:32px; }
        .ct-form-title { font-size:16px; font-weight:800; color:#fff; margin-bottom:22px; }
        .ct-field { margin-bottom:18px; }
        .ct-field label { display:block; font-size:11px; font-weight:700; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:.5px; margin-bottom:7px; }
        .ct-field input, .ct-field select, .ct-field textarea {
          width:100%; background:#161B22; color:#fff;
          border:1px solid rgba(255,255,255,0.1); border-radius:8px;
          padding:11px 14px; font-size:13px; outline:none;
          font-family:inherit; transition:border-color .15s;
        }
        .ct-field input:focus, .ct-field select:focus, .ct-field textarea:focus { border-color:rgba(240,185,11,0.5); }
        .ct-field select option { background:#161B22; }
        .ct-field textarea { resize:vertical; }
        .ct-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .ct-submit { width:100%; padding:14px; background:#F0B90B; color:#000; font-size:14px; font-weight:800; border:none; border-radius:8px; cursor:pointer; font-family:inherit; transition:background .15s; }
        .ct-submit:hover { background:#FFD000; }

        /* SUCCESS */
        .ct-success { text-align:center; padding:40px 0; }
        .ct-success-icon  { font-size:52px; margin-bottom:16px; }
        .ct-success-title { font-size:18px; font-weight:800; color:#0ECB81; margin-bottom:8px; }
        .ct-success-sub   { font-size:13px; color:rgba(255,255,255,0.45); line-height:1.7; }

        /* INFO */
        .ct-info-card { background:#0F1318; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:28px; margin-bottom:16px; }
        .ct-info-title { font-size:12px; font-weight:700; color:#F0B90B; letter-spacing:1px; text-transform:uppercase; margin-bottom:18px; }
        .ct-info-row { display:flex; gap:12px; align-items:flex-start; margin-bottom:15px; }
        .ct-info-icon { width:36px; height:36px; background:rgba(240,185,11,0.08); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
        .ct-info-label { font-size:11px; color:rgba(255,255,255,0.35); margin-bottom:2px; }
        .ct-info-value { font-size:13px; color:#fff; font-weight:500; }

        .ct-links-card { background:#0F1318; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:24px; }
        .ct-links-title { font-size:12px; font-weight:700; color:rgba(255,255,255,0.35); letter-spacing:1px; text-transform:uppercase; margin-bottom:14px; }
        .ct-link-item { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:13px; color:rgba(255,255,255,0.6); text-decoration:none; transition:color .15s; }
        .ct-link-item:last-child { border-bottom:none; }
        .ct-link-item:hover { color:#F0B90B; }
        .ct-link-arrow { color:rgba(255,255,255,0.25); }

        @media(max-width:768px){ .ct-body{ grid-template-columns:1fr; } .ct-row{ grid-template-columns:1fr; } }
        @media(max-width:480px){ .ct-form-card{ padding:20px; } }
      `}</style>

      <div className="ct-page">
        <div className="ct-hero">
          <div className="ct-hero-tag">Get in touch</div>
          <h1>Contact <em>Nextoken Capital</em></h1>
          <p>Our team in Vilnius, Lithuania is ready to help with investment questions, tokenization inquiries, or technical support.</p>
        </div>

        <div className="ct-body">

          {/* FORM */}
          <div className="ct-form-card">
            {sent ? (
              <div className="ct-success">
                <div className="ct-success-icon">✅</div>
                <div className="ct-success-title">Message Sent!</div>
                <p className="ct-success-sub">Thank you for reaching out. We will reply to {form.email} within 1–2 business days.</p>
              </div>
            ) : (
              <>
                <div className="ct-form-title">Send us a message</div>
                <form onSubmit={submit}>
                  <div className="ct-row">
                    <div className="ct-field">
                      <label>Your Name</label>
                      <input name="name" value={form.name} onChange={handle} placeholder="Bikash Bhat" required />
                    </div>
                    <div className="ct-field">
                      <label>Email Address</label>
                      <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className="ct-field">
                    <label>Topic</label>
                    <select name="topic" value={form.topic} onChange={handle}>
                      {TOPICS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="ct-field">
                    <label>Message</label>
                    <textarea name="message" value={form.message} onChange={handle} rows={6} placeholder="How can we help you?" required />
                  </div>
                  <button type="submit" className="ct-submit">Send Message →</button>
                </form>
              </>
            )}
          </div>

          {/* INFO */}
          <div>
            <div className="ct-info-card">
              <div className="ct-info-title">Office</div>
              {INFO.map(i => (
                <div key={i.label} className="ct-info-row">
                  <div className="ct-info-icon">{i.icon}</div>
                  <div>
                    <div className="ct-info-label">{i.label}</div>
                    <div className="ct-info-value">{i.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ct-links-card">
              <div className="ct-links-title">Quick Links</div>
              {[
                ["/help",    "Help Center"],
                ["/api",     "API Documentation"],
                ["/status",  "Platform Status"],
                ["/terms",   "Terms of Service"],
                ["/privacy", "Privacy Policy"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="ct-link-item">
                  <span>{label}</span>
                  <span className="ct-link-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}