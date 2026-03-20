import { useState } from "react";
import Navbar from "../components/Navbar";

export default function KYC() {
  const [status, setStatus] = useState("not_started");

  return (
    <div style={{ background: "#0B0E11", minHeight: "100vh", color: "white" }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Identity Verification
        </h1>

        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2rem" }}>
          Complete verification to unlock full access to your account.
        </p>

        <div
          style={{
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#161A1E",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ marginBottom: "0.5rem" }}>
            Status:{" "}
            <span style={{ color: "#F0B90B" }}>
              {status === "not_started" && "Not Started"}
              {status === "pending" && "Pending Review"}
              {status === "verified" && "Verified"}
              {status === "rejected" && "Rejected"}
            </span>
          </h3>

          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>
            Your information is securely processed with our verification partner.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {["Personal Info", "Document Upload", "Selfie Check", "Review"].map((step, i) => (
            <div
              key={i}
              style={{
                padding: "1rem",
                borderRadius: "10px",
                background: "#1E2329",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {i + 1}. {step}
            </div>
          ))}
        </div>

        <button
          onClick={() => setStatus("pending")}
          style={{
            width: "100%",
            padding: "1rem",
            background: "#F0B90B",
            color: "#111",
            border: "none",
            borderRadius: "10px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Start Verification
        </button>
      </div>
    </div>
  );
}