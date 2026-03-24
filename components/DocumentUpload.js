import { useState } from "react";

export default function DocumentUpload({ documents, setDocuments }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file, docName) => {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", docName || file.name);

    try {
      const res = await fetch("/api/upload/document", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDocuments(prev => [...prev, {
          name: data.name,
          url: data.url,
          type: data.format,
          size: data.size,
        }]);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (e) {
      setError("Network error during upload");
    } finally {
      setUploading(false);
    }
  };

  const removeDoc = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(f => uploadFile(f));
  };

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => uploadFile(f));
    e.target.value = "";
  };

  return (
    <>
      <style>{`
        .du-zone{border:2px dashed rgba(255,255,255,0.12);border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(255,255,255,0.02)}
        .du-zone:hover{border-color:rgba(240,185,11,0.3);background:rgba(240,185,11,0.03)}
        .du-zone.active{border-color:#F0B90B;background:rgba(240,185,11,0.06)}
        .du-icon{font-size:32px;margin-bottom:8px}
        .du-text{font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:4px}
        .du-hint{font-size:11px;color:rgba(255,255,255,0.25)}
        .du-list{margin-top:12px;display:flex;flex-direction:column;gap:8px}
        .du-item{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px}
        .du-item-icon{font-size:18px;flex-shrink:0}
        .du-item-info{flex:1;min-width:0}
        .du-item-name{font-size:13px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .du-item-size{font-size:11px;color:rgba(255,255,255,0.3)}
        .du-item-del{background:none;border:none;color:rgba(255,77,77,0.6);font-size:16px;cursor:pointer;padding:4px;transition:color .15s}
        .du-item-del:hover{color:#FF6B6B}
        .du-error{font-size:12px;color:#FF6B6B;margin-top:8px}
        .du-spin{display:inline-block;width:16px;height:16px;border:2px solid rgba(240,185,11,0.2);border-top-color:#F0B90B;border-radius:50%;animation:duspin .6s linear infinite}
        @keyframes duspin{to{transform:rotate(360deg)}}
      `}</style>

      <div
        className={`du-zone ${uploading ? "active" : ""}`}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById("du-input").click()}
      >
        <input
          id="du-input"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
          style={{ display: "none" }}
          onChange={handleSelect}
        />
        {uploading ? (
          <>
            <div className="du-spin" />
            <p className="du-text" style={{ marginTop: 10 }}>Uploading...</p>
          </>
        ) : (
          <>
            <div className="du-icon">📎</div>
            <p className="du-text">Drag & drop files here, or click to browse</p>
            <p className="du-hint">PDF, JPG, PNG, DOC, XLS — Max 20MB per file</p>
          </>
        )}
      </div>

      {error && <div className="du-error">⚠️ {error}</div>}

      {documents.length > 0 && (
        <div className="du-list">
          {documents.map((doc, i) => (
            <div key={i} className="du-item">
              <span className="du-item-icon">
                {doc.type === "pdf" ? "📄" : ["jpg","jpeg","png"].includes(doc.type) ? "🖼️" : "📋"}
              </span>
              <div className="du-item-info">
                <div className="du-item-name">{doc.name}</div>
                <div className="du-item-size">
                  {doc.size ? (doc.size / 1024).toFixed(0) + " KB" : doc.type?.toUpperCase()}
                  {doc.url && <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{color:"#F0B90B",marginLeft:8,fontSize:11}}>View ↗</a>}
                </div>
              </div>
              <button className="du-item-del" onClick={(e) => { e.stopPropagation(); removeDoc(i); }}>×</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
