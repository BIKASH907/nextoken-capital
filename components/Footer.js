import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", color: "#fff", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <h3 style={{ marginBottom: "20px" }}>Nextoken Capital</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <Link href="/terms" style={{ color: "#9ca3af", textDecoration: "none" }}>
            Terms of Service
          </Link>

          <Link href="/privacy" style={{ color: "#9ca3af", textDecoration: "none" }}>
            Privacy Policy
          </Link>

          <Link href="/risk" style={{ color: "#9ca3af", textDecoration: "none" }}>
            Risk Disclosure
          </Link>

          <Link href="/aml" style={{ color: "#9ca3af", textDecoration: "none" }}>
            AML Policy
          </Link>

        </div>

        <p style={{ marginTop: "20px", fontSize: "0.8rem", color: "#6b7280" }}>
          © {new Date().getFullYear()} Nextoken Capital. All rights reserved.
        </p>

      </div>
    </footer>
  );
}