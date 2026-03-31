import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ASSET_TYPES = [
  { id:"real_estate", icon:"🏢", label:"Real Estate",      desc:"Commercial, residential, or industrial property" },
  { id:"bond",        icon:"📄", label:"Corporate Bond",   desc:"Company debt instrument with fixed coupon" },
  { id:"equity",      icon:"📈", label:"Company Equity",   desc:"Shares in a private or public company" },
  { id:"energy",      icon:"⚡", label:"Energy Project",   desc:"Solar, wind, or other renewable energy assets" },
  { id:"fund",        icon:"🏦", label:"Fund",             desc:"Pooled investment vehicle or ETF structure" },
  { id:"other",       icon:"💎", label:"Other Asset",      desc:"Commodities, infrastructure, or other assets" },
];

const STEPS_INFO = [
  { n:"01", title:"Submit Details",  desc:"Complete the form with asset details, financials, and upload documents." },
  { n:"02", title:"Structure Review",   desc:"Our team reviews your submission for clarity, completeness, and regulatory alignment." },
  { n:"03", title:"Define Representation",   desc:"Define how participation is represented using standardized digital structures." },
  { n:"04", title:"Publish Listing",      desc:"Tokens are minted and listed on the Nextoken marketplace for traders." },
  { n:"05", title:"Live on Marketplace", desc:"Your asset is live. Traders can browse, invest, and trade on the exchange." },
];

const FAQS = [
  { q:"What types of assets can be listed?", a:"We support real estate, corporate bonds, company equity, renewable energy projects, funds, and other real-world assets with a clear legal ownership structure." },
  { q:"What is the minimum listing value?", a:"We accept assets with a minimum valuation of EUR 500,000. For smaller assets, we recommend our pooled fund structure." },
  { q:"How long does the listing process take?", a:"6–12 weeks from application to going live, depending on asset complexity and jurisdiction." },
  { q:"What documents do I need?", a:"Financial statements, legal ownership proof, property valuation (for real estate), business registration, and any relevant regulatory licenses." },
  { q:"What are the fees?", a:"One-time structuring fee of 1.5–3% of asset value plus annual platform fees of 0.5%." },
  { q:"What happens after listing?", a:"Your asset appears on the Nextoken marketplace. You can track investments, investor count, and raised amount from your Owner Dashboard." },
];

export default function TokenizePage() {
  const router = useRouter();
  const [step, setStep]           = useState(0); // 0=form, 1=details, 2=documents, 3=review, 4=done
  const [assetType, setAssetType] = useState("");
  const [faqOpen, setFaqOpen]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");

  const [form, setForm] = useState({
    name:"", ticker:"", description:"", category:"",
    location:"", country:"",
    targetRaise:"", minInvestment:"100", maxInvestment:"",
    targetROI:"", term:"", yieldFrequency:"quarterly",
    tokenSupply:"", tokenPrice:"",
    riskLevel:"medium", eligibility:"eu_verified",
    launchDate:"", closingDate:"",
  });

  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl]   = useState("");

  const handle = e => setForm({...form, [e.target.name]: e.target.value});

  const uploadFile = async (file, docType) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        if (docType === "image") {
          setImageUrl(data.url);
        } else {
          setDocuments(prev => [...prev, { name: file.name, url: data.url, type: docType }]);
        }
      } else {
        setError(data.error || "Upload failed");
      }
    } catch { setError("Upload failed. Please try again."); }
    setUploading(false);
  };

  const removeDoc = (idx) => setDocuments(prev => prev.filter((_, i) => i !== idx));

  const submitAsset = async () => {
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/assets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, assetType, imageUrl, documents }),
      });
      const data = await res.json();
      if (data.success) { setStep(4); }
      else { setError(data.error || "Submission failed."); }
    } catch { setError("Network error. Please try again."); }
    setSubmitting(false);
  };

  const canProceed1 = assetType && form.name && form.ticker && form.targetRaise;
  const canProceed2 = true; // documents optional but encouraged

  return (
    <>
      <Head>
        <title>Tokenize Your Asset — Nextoken Capital</title>
        <meta name="description" content="List your real-world asset on the Nextoken marketplace. Upload documents, set terms, and reach global buyers." />
      </Head>
      <Navbar />

      <style>{`
        .tz{min-height:100vh;background:#0B0E11;padding-top:64px}
        .tz-hero{padding:48px 20px 36px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.07)}
        .tz-hero-tag{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
        .tz-hero h1{font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:900;color:#fff;margin-bottom:10px}
        .tz-hero h1 em{color:#F0B90B;font-style:normal}
        .tz-hero p{font-size:14px;color:rgba(255,255,255,0.45);max-width:520px;margin:0 auto;line-height:1.7}
        .tz-steps-bar{background:#0F1318;border-bottom:1px solid rgba(255,255,255,0.07);padding:16px 20px}
        .tz-steps-bar-in{max-width:800px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:8px}
        .tz-step-dot{width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);flex-shrink:0}
        .tz-step-dot.active{border-color:#F0B90B;color:#F0B90B}
        .tz-step-dot.done{border-color:#0ECB81;background:#0ECB81;color:#000}
        .tz-step-line{width:32px;height:1px;background:rgba(255,255,255,0.1)}
        .tz-step-lbl{font-size:11px;color:rgba(255,255,255,0.3);margin-left:4px;display:none}
        .tz-step-dot.active+.tz-step-lbl{display:inline;color:#F0B90B}
        .tz-body{max-width:720px;margin:0 auto;padding:32px 20px 60px}
        .tz-card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;margin-bottom:20px}
        .tz-title{font-size:18px;font-weight:900;color:#fff;margin-bottom:4px}
        .tz-sub{font-size:13px;color:rgba(255,255,255,0.38);margin-bottom:22px;line-height:1.6}
        .tz-field{margin-bottom:16px}
        .tz-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .tz-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:11px 14px;font-size:14px;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .tz-input:focus{border-color:rgba(240,185,11,0.5)}
        .tz-input option{background:#161B22}
        .tz-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .tz-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
        .tz-asset-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
        .tz-asset-card{background:#161B22;border:2px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px;cursor:pointer;text-align:center;transition:all .15s}
        .tz-asset-card:hover{border-color:rgba(240,185,11,0.3)}
        .tz-asset-card.sel{border-color:#F0B90B;background:rgba(240,185,11,0.06)}
        .tz-asset-ico{font-size:24px;margin-bottom:6px}
        .tz-asset-lbl{font-size:12px;font-weight:700;color:#fff}
        .tz-asset-desc{font-size:10px;color:rgba(255,255,255,0.35);margin-top:3px}
        .tz-err{background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.25);border-radius:8px;padding:11px 14px;font-size:13px;color:#FF6B6B;margin-bottom:16px}
        .tz-btn{width:100%;padding:13px;background:#F0B90B;color:#000;font-size:14px;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:inherit;transition:background .15s}
        .tz-btn:hover:not(:disabled){background:#FFD000}
        .tz-btn:disabled{background:rgba(240,185,11,0.2);color:rgba(0,0,0,0.3);cursor:not-allowed}
        .tz-btn-ghost{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.55);border:1px solid rgba(255,255,255,0.1)}
        .tz-btn-ghost:hover{background:rgba(255,255,255,0.09);color:#fff}
        .tz-btns{display:grid;grid-template-columns:0.5fr 1fr;gap:10px;margin-top:8px}
        .tz-upload-zone{border:2px dashed rgba(255,255,255,0.15);border-radius:12px;padding:28px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:12px}
        .tz-upload-zone:hover{border-color:rgba(240,185,11,0.4);background:rgba(240,185,11,0.03)}
        .tz-upload-zone.active{border-color:#F0B90B;background:rgba(240,185,11,0.05)}
        .tz-doc-list{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
        .tz-doc-item{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px}
        .tz-doc-name{flex:1;font-size:13px;color:rgba(255,255,255,0.6);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .tz-doc-type{font-size:10px;color:#F0B90B;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
        .tz-doc-rm{background:none;border:none;color:rgba(255,77,77,0.6);font-size:16px;cursor:pointer;padding:2px 6px}
        .tz-doc-rm:hover{color:#FF4D4D}
        .tz-review-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px}
        .tz-review-row:last-child{border-bottom:none}
        .tz-review-l{color:rgba(255,255,255,0.4)}
        .tz-review-v{color:#fff;font-weight:600;text-align:right;max-width:60%}
        .tz-done{text-align:center;padding:20px 0}
        .tz-done-ico{font-size:54px;margin-bottom:14px}
        .tz-done-title{font-size:20px;font-weight:900;color:#0ECB81;margin-bottom:8px}
        .tz-done-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:22px}
        .tz-faq{margin-top:20px}
        .tz-faq-item{border:1px solid rgba(255,255,255,0.07);border-radius:10px;margin-bottom:8px;overflow:hidden}
        .tz-faq-q{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;cursor:pointer;gap:12px}
        .tz-faq-q-text{font-size:13px;font-weight:700;color:#fff;flex:1}
        .tz-faq-arrow{font-size:13px;color:rgba(255,255,255,0.3)}
        .tz-faq-a{padding:0 18px 14px;font-size:12px;color:rgba(255,255,255,0.45);line-height:1.7}
        .tz-spin{width:16px;height:16px;border:2px solid rgba(0,0,0,0.2);border-top-color:#000;border-radius:50%;animation:tzspin .6s linear infinite;display:inline-block}
        @keyframes tzspin{to{transform:rotate(360deg)}}
        @media(max-width:640px){.tz-row{grid-template-columns:1fr}.tz-row3{grid-template-columns:1fr}.tz-asset-grid{grid-template-columns:1fr 1fr}.tz-btns{grid-template-columns:1fr}}
      `}</style>

      <div className="tz">
        <div className="tz-hero">
          <div className="tz-hero-tag">List Your Asset</div>
          <h1>Represent Your <em>Real-World Asset</em> Digitally</h1>
          <p>Submit your asset details and documents. Our compliance team reviews within 2-3 business days.</p>
        </div>

        {/* STEP BAR */}
        <div className="tz-steps-bar">
          <div className="tz-steps-bar-in">
            {["Asset Type","Details","Documents","Review","Done"].map((s, i) => (
              <span key={s} style={{display:"flex",alignItems:"center",gap:4}}>
                <span className={`tz-step-dot ${i===step?"active":i<step?"done":""}`}>{i<step?"✓":i+1}</span>
                <span className="tz-step-lbl">{s}</span>
                {i < 4 && <span className="tz-step-line" />}
              </span>
            ))}
          </div>
        </div>

        <div className="tz-body">
          {error && <div className="tz-err">⚠️ {error}</div>}

          {/* STEP 0 — Asset Type + Basic */}
          {step === 0 && (
            <div className="tz-card">
              <div className="tz-title">Select Asset Type</div>
              <p className="tz-sub">Choose the type of asset you want to list on the marketplace.</p>
              <div className="tz-asset-grid">
                {ASSET_TYPES.map(a => (
                  <div key={a.id} className={`tz-asset-card ${assetType===a.id?"sel":""}`} onClick={()=>setAssetType(a.id)}>
                    <div className="tz-asset-ico">{a.icon}</div>
                    <div className="tz-asset-lbl">{a.label}</div>
                    <div className="tz-asset-desc">{a.desc}</div>
                  </div>
                ))}
              </div>
              <div className="tz-row">
                <div className="tz-field"><label className="tz-label">Asset Name *</label><input className="tz-input" name="name" value={form.name} onChange={handle} placeholder="e.g. Solar Farm Portfolio" /></div>
                <div className="tz-field"><label className="tz-label">Ticker Symbol *</label><input className="tz-input" name="ticker" value={form.ticker} onChange={handle} placeholder="e.g. SOLAR-01" style={{textTransform:"uppercase"}} /></div>
              </div>
              <div className="tz-field"><label className="tz-label">Description</label><textarea className="tz-input" name="description" value={form.description} onChange={handle} rows={3} placeholder="Describe your asset..." style={{resize:"vertical"}} /></div>
              <div className="tz-row">
                <div className="tz-field"><label className="tz-label">Target Raise (EUR) *</label><input className="tz-input" name="targetRaise" type="number" value={form.targetRaise} onChange={handle} placeholder="e.g. 5000000" /></div>
                <div className="tz-field"><label className="tz-label">Location</label><input className="tz-input" name="location" value={form.location} onChange={handle} placeholder="e.g. Berlin, Germany" /></div>
              </div>
              <button className="tz-btn" disabled={!canProceed1} onClick={()=>{setError("");setStep(1);}}>Continue to Details →</button>
            </div>
          )}

          {/* STEP 1 — Financial Details */}
          {step === 1 && (
            <div className="tz-card">
              <div className="tz-title">Financial Details</div>
              <p className="tz-sub">Set investment terms, pricing, and risk parameters.</p>
              <div className="tz-row3">
                <div className="tz-field"><label className="tz-label">Min Purchase (EUR)</label><input className="tz-input" name="minInvestment" type="number" value={form.minInvestment} onChange={handle} /></div>
                <div className="tz-field"><label className="tz-label">Est. Return (%)</label><input className="tz-input" name="targetROI" type="number" value={form.targetROI} onChange={handle} placeholder="e.g. 18" /></div>
                <div className="tz-field"><label className="tz-label">Term (months)</label><input className="tz-input" name="term" type="number" value={form.term} onChange={handle} placeholder="e.g. 36" /></div>
              </div>
              <div className="tz-row3">
                <div className="tz-field"><label className="tz-label">Token Supply</label><input className="tz-input" name="tokenSupply" type="number" value={form.tokenSupply} onChange={handle} placeholder="e.g. 500000" /></div>
                <div className="tz-field"><label className="tz-label">Token Price (EUR)</label><input className="tz-input" name="tokenPrice" type="number" step="0.01" value={form.tokenPrice} onChange={handle} placeholder="e.g. 10.00" /></div>
                <div className="tz-field"><label className="tz-label">Yield Frequency</label>
                  <select className="tz-input" name="yieldFrequency" value={form.yieldFrequency} onChange={handle}>
                    <option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annual">Annual</option><option value="at_maturity">At Maturity</option>
                  </select>
                </div>
              </div>
              <div className="tz-row">
                <div className="tz-field"><label className="tz-label">Risk Level</label>
                  <select className="tz-input" name="riskLevel" value={form.riskLevel} onChange={handle}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
                <div className="tz-field"><label className="tz-label">Category</label><input className="tz-input" name="category" value={form.category} onChange={handle} placeholder="e.g. Commercial, Green, Residential" /></div>
              </div>
              <div className="tz-btns">
                <button className="tz-btn tz-btn-ghost" onClick={()=>setStep(0)}>← Back</button>
                <button className="tz-btn" onClick={()=>{setError("");setStep(2);}}>Continue to Documents →</button>
              </div>
            </div>
          )}

          {/* STEP 2 — Document Upload */}
          {step === 2 && (
            <div className="tz-card">
              <div className="tz-title">Upload Documents</div>
              <p className="tz-sub">Upload financial statements, legal docs, photos, and supporting materials. Max 20MB per file.</p>

              {/* Asset Image */}
              <div className="tz-field">
                <label className="tz-label">Asset Photo / Cover Image</label>
                <div className="tz-upload-zone" onClick={()=>document.getElementById("img-upload").click()}>
                  {imageUrl ? (
                    <div><img src={imageUrl} alt="Asset" style={{maxWidth:200,maxHeight:120,borderRadius:8,margin:"0 auto"}} /><div style={{fontSize:12,color:"#0ECB81",marginTop:8}}>✓ Image uploaded</div></div>
                  ) : (
                    <><div style={{fontSize:28,marginBottom:8}}>📸</div><div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Click to upload asset photo</div><div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:4}}>JPG, PNG, WebP · Max 20MB</div></>
                  )}
                </div>
                <input id="img-upload" type="file" accept="image/*" hidden onChange={e=>{if(e.target.files[0])uploadFile(e.target.files[0],"image");}} />
              </div>

              {/* Documents */}
              <div className="tz-field">
                <label className="tz-label">Financial & Legal Documents</label>
                <div className="tz-upload-zone" onClick={()=>document.getElementById("doc-upload").click()}>
                  <div style={{fontSize:28,marginBottom:8}}>📎</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Click to upload documents</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:4}}>PDF, DOC, XLS, JPG, PNG · Max 20MB each</div>
                </div>
                <input id="doc-upload" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp" hidden multiple onChange={e=>{
                  Array.from(e.target.files).forEach(f => uploadFile(f, "document"));
                  e.target.value = "";
                }} />
              </div>

              {uploading && <div style={{textAlign:"center",padding:12,fontSize:13,color:"#F0B90B"}}>⏳ Uploading...</div>}

              {documents.length > 0 && (
                <div className="tz-doc-list">
                  {documents.map((d, i) => (
                    <div key={i} className="tz-doc-item">
                      <span style={{fontSize:16}}>📄</span>
                      <span className="tz-doc-name">{d.name}</span>
                      <span className="tz-doc-type">{d.type}</span>
                      <button className="tz-doc-rm" onClick={()=>removeDoc(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{background:"rgba(240,185,11,0.05)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:12,fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.7,marginBottom:16}}>
                💡 Recommended: Financial statements, property valuation, legal ownership proof, business registration, insurance documents, and any regulatory licenses.
              </div>

              <div className="tz-btns">
                <button className="tz-btn tz-btn-ghost" onClick={()=>setStep(1)}>← Back</button>
                <button className="tz-btn" onClick={()=>{setError("");setStep(3);}}>Continue to Review →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — Review & Submit */}
          {step === 3 && (
            <div className="tz-card">
              <div className="tz-title">Review & Submit</div>
              <p className="tz-sub">Review your listing details before submitting for compliance review.</p>

              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:16,marginBottom:20}}>
                {[
                  ["Asset Name", form.name],
                  ["Ticker", form.ticker],
                  ["Type", ASSET_TYPES.find(a=>a.id===assetType)?.label || assetType],
                  ["Location", form.location || "—"],
                  ["Target Raise", form.targetRaise ? `EUR ${parseInt(form.targetRaise).toLocaleString()}` : "—"],
                  ["Min Purchase", `EUR ${form.minInvestment}`],
                  ["Est. Return", form.targetROI ? `${form.targetROI}%` : "—"],
                  ["Term", form.term ? `${form.term} months` : "—"],
                  ["Token Price", form.tokenPrice ? `EUR ${form.tokenPrice}` : "—"],
                  ["Risk Level", form.riskLevel],
                  ["Documents", `${documents.length} file(s)`],
                  ["Cover Image", imageUrl ? "✓ Uploaded" : "None"],
                ].map(([l, v]) => (
                  <div key={l} className="tz-review-row">
                    <span className="tz-review-l">{l}</span>
                    <span className="tz-review-v">{v}</span>
                  </div>
                ))}
              </div>

              <div style={{background:"rgba(240,185,11,0.05)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:12,fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.7,marginBottom:16}}>
                🏛️ By submitting, you agree to our <Link href="/terms" style={{color:"#F0B90B"}}>Terms</Link> and <Link href="/privacy" style={{color:"#F0B90B"}}>Privacy Policy</Link>.
                Your listing will be reviewed by our compliance team within 2-3 business days.
              </div>

              <div className="tz-btns">
                <button className="tz-btn tz-btn-ghost" onClick={()=>setStep(2)}>← Back</button>
                <button className="tz-btn" disabled={submitting} onClick={submitAsset}>
                  {submitting ? <><span className="tz-spin"/> Submitting...</> : "Submit for Review →"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Done */}
          {step === 4 && (
            <div className="tz-card">
              <div className="tz-done">
                <div className="tz-done-ico">🎉</div>
                <div className="tz-done-title">Asset Submitted!</div>
                <p className="tz-done-sub">
                  Your asset <strong style={{color:"#fff"}}>{form.name}</strong> ({form.ticker}) has been submitted for compliance review.
                  You will receive an email notification when it is approved.
                </p>
                <button className="tz-btn" style={{marginBottom:10}} onClick={()=>router.push("/owner-dashboard")}>
                  Go to Owner Dashboard →
                </button>
                <button className="tz-btn tz-btn-ghost" onClick={()=>{setStep(0);setForm({name:"",ticker:"",description:"",category:"",location:"",country:"",targetRaise:"",minInvestment:"100",maxInvestment:"",targetROI:"",term:"",yieldFrequency:"quarterly",tokenSupply:"",tokenPrice:"",riskLevel:"medium",eligibility:"eu_verified",launchDate:"",closingDate:""});setDocuments([]);setImageUrl("");setAssetType("");}}>
                  List Another Asset
                </button>
              </div>
            </div>
          )}

          {/* FAQ */}
          {step < 4 && (
            <div className="tz-faq">
              <div style={{fontSize:13,fontWeight:700,color:"rgba(255,218,122,0.7)",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>FAQ</div>
              {FAQS.map((f, i) => (
                <div key={i} className="tz-faq-item" style={{borderColor:faqOpen===i?"rgba(240,185,11,0.25)":"rgba(255,255,255,0.07)"}}>
                  <div className="tz-faq-q" onClick={()=>setFaqOpen(faqOpen===i?null:i)}>
                    <div className="tz-faq-q-text">{f.q}</div>
                    <span className="tz-faq-arrow">{faqOpen===i?"▲":"▼"}</span>
                  </div>
                  {faqOpen===i && <div className="tz-faq-a">{f.a}</div>}
                </div>
              ))}
            </div>
          )}

          {/* PROCESS INFO */}
          {step < 4 && (
            <div style={{marginTop:24,padding:20,background:"#0F1318",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"#F0B90B",letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Representation Process</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
                {STEPS_INFO.map(s => (
                  <div key={s.n} style={{textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:900,color:"rgba(240,185,11,0.2)",marginBottom:6}}>{s.n}</div>
                    <div style={{fontSize:11,fontWeight:700,color:"#fff",marginBottom:4}}>{s.title}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",lineHeight:1.5}}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
