// pages/kyc.js
// Real Sumsub KYC verification page
// Loads Sumsub Web SDK, gets token from /api/kyc/token, renders the verification widget

import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function KYCPage() {
  const router = useRouter();
  const [status, setStatus]   = useState("loading"); // loading | ready | verifying | approved | rejected | error
  const [error, setError]     = useState("");
  const [message, setMessage] = useState("");
  const sdkRef  = useRef(null);
  const mountRef = useRef(null);

  useEffect(() => {
    initKYC();
  }, []);

  const initKYC = async () => {
    setStatus("loading");
    try {
      // 1. Get Sumsub access token from our API
      const res = await fetch("/api/kyc/token", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?redirect=/kyc");
          return;
        }
        throw new Error(data.error || "Failed to initialize KYC");
      }

      const { token, userId, levelName } = data;

      // 2. Load Sumsub Web SDK script dynamically
      await loadSumsubScript();

      // 3. Initialize the SDK
      if (window.SNSWebSdk) {
        const sdk = window.SNSWebSdk.init(token, () => {
          // Token refresh callback
          return fetch("/api/kyc/token", { method: "POST" })
            .then(r => r.json())
            .then(d => d.token);
        })
          .withConf({
            lang: "en",
            email: "",
            uiConf: {
              customCssStr: `
                :root {
                  --black: #0B0E11;
                  --white: #ffffff;
                  --border-color: rgba(255,255,255,0.1);
                }
                body { background: #0B0E11 !important; }
                .step { background: #0F1318 !important; }
                .title { color: #ffffff !important; }
                .submit-btn { background: #F0B90B !important; color: #000 !important; }
              `,
            },
          })
          .withOptions({ addViewportTag: false, adaptIframeHeight: true })
          .on("idCheck.onStepCompleted", (payload) => {
            console.log("Step completed:", payload);
            setMessage("Step completed — continue to next step.");
          })
          .on("idCheck.onApplicantLoaded", (payload) => {
            console.log("Applicant loaded:", payload);
            setStatus("ready");
          })
          .on("idCheck.onApplicantSubmitted", () => {
            setStatus("verifying");
            setMessage("Documents submitted! Verification usually takes 1–2 minutes.");
          })
          .on("idCheck.onApplicantResubmitted", () => {
            setStatus("verifying");
            setMessage("Documents resubmitted for review.");
          })
          .on("idCheck.applicantStatus", (payload) => {
            console.log("Applicant status:", payload);
            if (payload?.reviewResult?.reviewAnswer === "GREEN") {
              setStatus("approved");
            } else if (payload?.reviewResult?.reviewAnswer === "RED") {
              setStatus("rejected");
            } else if (payload?.reviewStatus === "pending") {
              setStatus("verifying");
            }
          })
          .on("idCheck.onError", (error) => {
            console.error("Sumsub error:", error);
            setError("Verification error: " + (error.error || "Unknown error"));
            setStatus("error");
          })
          .build();

        sdkRef.current = sdk;
        sdk.launch("#sumsub-container");
        setStatus("ready");
      } else {
        throw new Error("Sumsub SDK failed to load");
      }
    } catch (e) {
      console.error("KYC init error:", e);
      setError(e.message || "Failed to load verification. Please try again.");
      setStatus("error");
    }
  };

  const loadSumsubScript = () => {
    return new Promise((resolve, reject) => {
      if (window.SNSWebSdk) { resolve(); return; }
      const script = document.createElement("script");
      script.src = "https://static.sumsub.com/idensic/static/sns-websdk-builder.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Failed to load Sumsub script"));
      document.head.appendChild(script);
    });
  };

  return (
    <>
      <Head>
        <title>Identity Verification — Nextoken Capital</title>
        <meta name="description" content="Complete your KYC identity verification to start investing on Nextoken Capital." />
      </Head>
      <Navbar />

      <style>{`
        .kyc-page{min-height:100vh;background:#0B0E11;padding-top:64px}
        .kyc-hero{padding:40px 20px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.07)}
        .kyc-hero-tag{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
        .kyc-hero h1{font-size:clamp(1.4rem,3vw,2rem);font-weight:900;color:#fff;margin-bottom:8px}
        .kyc-hero p{font-size:13px;color:rgba(255,255,255,0.45);max-width:480px;margin:0 auto;line-height:1.7}
        .kyc-body{max-width:760px;margin:0 auto;padding:32px 20px 60px}

        /* STEPS */
        .kyc-steps{display:flex;justify-content:center;gap:0;margin-bottom:28px}
        .kyc-step{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600}
        .kyc-step-dot{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;border:2px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.3)}
        .kyc-step.done .kyc-step-dot{background:#0ECB81;border-color:#0ECB81;color:#000}
        .kyc-step.active .kyc-step-dot{border-color:#F0B90B;color:#F0B90B}
        .kyc-step-label{color:rgba(255,255,255,0.3);display:none}
        .kyc-step.active .kyc-step-label{display:block;color:#F0B90B}
        .kyc-step-line{width:24px;height:1px;background:rgba(255,255,255,0.1);margin:0 4px}

        /* STATUS CARDS */
        .kyc-loading{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:48px;text-align:center}
        .kyc-loading-spin{width:40px;height:40px;border:3px solid rgba(240,185,11,0.2);border-top-color:#F0B90B;border-radius:50%;animation:kspin .7s linear infinite;margin:0 auto 16px}
        @keyframes kspin{to{transform:rotate(360deg)}}
        .kyc-loading-text{font-size:14px;color:rgba(255,255,255,0.55);line-height:1.7}

        .kyc-approved{background:rgba(14,203,129,0.06);border:1px solid rgba(14,203,129,0.25);border-radius:14px;padding:48px;text-align:center}
        .kyc-approved-ico{font-size:56px;margin-bottom:16px}
        .kyc-approved-title{font-size:22px;font-weight:900;color:#0ECB81;margin-bottom:8px}
        .kyc-approved-sub{font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;margin-bottom:24px}

        .kyc-verifying{background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.2);border-radius:14px;padding:40px;text-align:center;margin-bottom:20px}
        .kyc-verifying-ico{font-size:44px;margin-bottom:14px}
        .kyc-verifying-title{font-size:17px;font-weight:800;color:#3B82F6;margin-bottom:8px}
        .kyc-verifying-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7}

        .kyc-rejected{background:rgba(255,77,77,0.06);border:1px solid rgba(255,77,77,0.2);border-radius:14px;padding:40px;text-align:center;margin-bottom:20px}
        .kyc-rejected-ico{font-size:44px;margin-bottom:14px}
        .kyc-rejected-title{font-size:17px;font-weight:800;color:#FF4D4D;margin-bottom:8px}
        .kyc-rejected-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:20px}

        .kyc-error{background:rgba(255,77,77,0.06);border:1px solid rgba(255,77,77,0.2);border-radius:12px;padding:20px;margin-bottom:20px;font-size:13px;color:#FF6B6B;line-height:1.6}

        /* SDK CONTAINER */
        .kyc-sdk-wrap{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;min-height:500px}
        #sumsub-container{width:100%;min-height:500px}
        #sumsub-container iframe{width:100%;border:none;background:#0B0E11}

        /* INFO */
        .kyc-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
        .kyc-info-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px;text-align:center}
        .kyc-info-ico{font-size:20px;margin-bottom:6px}
        .kyc-info-title{font-size:12px;font-weight:700;color:#fff;margin-bottom:3px}
        .kyc-info-sub{font-size:11px;color:rgba(255,255,255,0.38);line-height:1.5}

        .kyc-btn{display:inline-flex;align-items:center;gap:6px;padding:12px 28px;background:#F0B90B;color:#000;border:none;border-radius:8px;font-size:14px;font-weight:800;cursor:pointer;text-decoration:none;font-family:inherit;transition:background .15s}
        .kyc-btn:hover{background:#FFD000}
        .kyc-btn-ghost{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.12);margin-left:10px}
        .kyc-btn-ghost:hover{background:rgba(255,255,255,0.1);color:#fff}

        @media(max-width:480px){.kyc-info{grid-template-columns:1fr}.kyc-steps{display:none}}
      `}</style>

      <div className="kyc-page">
        <div className="kyc-hero">
          <div className="kyc-hero-tag">Identity Verification</div>
          <h1>Complete Your KYC</h1>
          <p>Verify your identity to unlock investing. Powered by Sumsub — takes 2–5 minutes. You need a government-issued photo ID.</p>
        </div>

        <div className="kyc-body">

          {/* Step indicator */}
          <div className="kyc-steps">
            {[
              { n:1, label:"Account",      done: true },
              { n:2, label:"Verification", done: status==="approved", active: status==="loading"||status==="ready"||status==="verifying" },
              { n:3, label:"Invest",       done: false, active: status==="approved" },
            ].map((s, i) => (
              <div key={s.n} style={{display:"flex",alignItems:"center"}}>
                <div className={`kyc-step ${s.done?"done":""} ${s.active&&!s.done?"active":""}`}>
                  <div className="kyc-step-dot">{s.done ? "✓" : s.n}</div>
                  <span className="kyc-step-label">{s.label}</span>
                </div>
                {i < 2 && <div className="kyc-step-line" />}
              </div>
            ))}
          </div>

          {/* What you need */}
          {(status === "loading" || status === "ready") && (
            <div className="kyc-info">
              {[
                { ico:"🪪", title:"Photo ID",        sub:"Passport, national ID, or driver's license" },
                { ico:"📷", title:"Camera Access",   sub:"Selfie required for liveness check" },
                { ico:"💡", title:"Good Lighting",   sub:"Clear, well-lit environment" },
              ].map(c => (
                <div key={c.title} className="kyc-info-card">
                  <div className="kyc-info-ico">{c.ico}</div>
                  <div className="kyc-info-title">{c.title}</div>
                  <div className="kyc-info-sub">{c.sub}</div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="kyc-error">
              ⚠️ {error}
              <div style={{marginTop:10}}>
                <button className="kyc-btn" onClick={initKYC}>Try Again</button>
                <a href="mailto:support@nextokencapital.com" className="kyc-btn kyc-btn-ghost" style={{textDecoration:"none",display:"inline-flex"}}>Contact Support</a>
              </div>
            </div>
          )}

          {/* Loading */}
          {status === "loading" && !error && (
            <div className="kyc-loading">
              <div className="kyc-loading-spin" />
              <div className="kyc-loading-text">Loading verification system...<br />Please wait a moment.</div>
            </div>
          )}

          {/* Verifying */}
          {status === "verifying" && (
            <div className="kyc-verifying">
              <div className="kyc-verifying-ico">⏳</div>
              <div className="kyc-verifying-title">Documents Under Review</div>
              <p className="kyc-verifying-sub">
                {message || "Your documents have been submitted and are being reviewed. This usually takes 1–2 minutes. You will be notified by email when complete."}
              </p>
            </div>
          )}

          {/* Approved */}
          {status === "approved" && (
            <div className="kyc-approved">
              <div className="kyc-approved-ico">✅</div>
              <div className="kyc-approved-title">Identity Verified!</div>
              <p className="kyc-approved-sub">
                Your identity has been successfully verified. You can now invest in any available asset on the platform.
              </p>
              <Link href="/dashboard" className="kyc-btn">Go to Dashboard →</Link>
              <Link href="/markets" className="kyc-btn kyc-btn-ghost" style={{marginLeft:10,textDecoration:"none",display:"inline-flex"}}>Browse Markets</Link>
            </div>
          )}

          {/* Rejected */}
          {status === "rejected" && (
            <div className="kyc-rejected">
              <div className="kyc-rejected-ico">❌</div>
              <div className="kyc-rejected-title">Verification Failed</div>
              <p className="kyc-rejected-sub">
                Your identity verification was unsuccessful. This can happen if the document was unclear, expired, or didn&apos;t match your details.
              </p>
              <button className="kyc-btn" onClick={initKYC}>Try Again</button>
              <a href="mailto:support@nextokencapital.com" className="kyc-btn kyc-btn-ghost" style={{textDecoration:"none",display:"inline-flex"}}>Contact Support</a>
            </div>
          )}

          {/* Sumsub SDK widget */}
          {(status === "ready" || status === "loading") && !error && (
            <div className="kyc-sdk-wrap">
              <div id="sumsub-container" ref={mountRef} />
            </div>
          )}

          {/* Info footer */}
          <div style={{marginTop:24,padding:"16px 20px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,fontSize:12,color:"rgba(255,255,255,0.3)",lineHeight:1.8}}>
            🔐 Your documents are processed securely by Sumsub, an EU-regulated identity verification provider.
            Data is stored and processed in compliance with EU GDPR.
            We retain KYC records for 5 years as required by EU AML regulations.
            Questions? Email <a href="mailto:support@nextokencapital.com" style={{color:"#F0B90B"}}>support@nextokencapital.com</a>
          </div>

        </div>
      </div>
    </>
  );
}