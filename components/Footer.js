import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          
          {/* --- LEFT COLUMN: BRAND & REGULATION --- */}
          <div className="brand-section">
            <div className="logo-area">
              <span className="logo-nxt">NXT</span>
              <div className="logo-text">
                <span className="brand-name">NEXTOKEN</span>
                <span className="brand-sub">CAPITAL</span>
              </div>
            </div>
            
            <p className="brand-desc">
              The regulated infrastructure for <br />
              tokenized real-world assets.
            </p>

            <div className="regulatory-badge">
              <div className="flag-icon">LT</div>
              <div className="badge-content">
                <span className="badge-top">MONITORED BY</span>
                <span className="badge-bottom">Bank of Lithuania</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMNS: LINKS --- */}
          <div className="links-container">
            <div className="link-group">
              <h4>PRODUCTS</h4>
              <Link href="/markets">Markets</Link>
              <Link href="/exchange">Exchange</Link>
              <Link href="/bonds">Bonds</Link>
              <Link href="/equity-ipo">Equity & IPO</Link>
              <Link href="/tokenize">Tokenize</Link>
            </div>

            <div className="link-group">
              <h4>COMPANY</h4>
              <Link href="/about">About Us</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/press">Press</Link>
              <Link href="/blog">Blog</Link>
            </div>

            <div className="link-group">
              <h4>LEGAL</h4>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/risk">Risk Disclosure</Link>
              <Link href="/aml">AML Policy</Link>
            </div>

            <div className="link-group">
              <h4>SUPPORT</h4>
              <Link href="/help">Help Center</Link>
              <Link href="/contact">Contact Us</Link>
              <Link href="/api">API Docs</Link>
              <Link href="/status">Status</Link>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: LEGAL BARS --- */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
          <p className="risk-text">
            Risk warning: Investing in tokenized assets involves risk. Past performance is not indicative of future results.
          </p>
        </div>
      </div>

      <style jsx>{`
        .footer-wrapper {
          background-color: #05060a;
          padding: 80px 20px 40px;
          color: #ffffff;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-family: sans-serif;
        }
        
        .container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        /* Brand Styling */
        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .logo-nxt {
          color: #f5c15a;
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .brand-name {
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 2px;
        }

        .brand-sub {
          font-size: 0.75rem;
          color: #6e7686;
          letter-spacing: 2px;
        }

        .brand-desc {
          color: #6e7686;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        /* Regulatory Badge */
        .regulatory-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 12px 18px;
          border-radius: 12px;
          width: fit-content;
        }

        .flag-icon {
          font-weight: bold;
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .badge-content {
          display: flex;
          flex-direction: column;
        }

        .badge-top {
          font-size: 0.6rem;
          color: #6e7686;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .badge-bottom {
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* Links Grid */
        .links-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .link-group h4 {
          font-size: 0.75rem;
          font-weight: 800;
          margin-bottom: 24px;
          color: #ffffff;
          letter-spacing: 1px;
        }

        .link-group :global(a) {
          display: block;
          color: #6e7686;
          text-decoration: none;
          font-size: 0.9rem;
          margin-bottom: 12px;
          transition: color 0.2s;
        }

        .link-group :global(a:hover) {
          color: #f5c15a;
        }

        /* Bottom Section */
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 32px;
          color: #404654;
          font-size: 0.8rem;
          line-height: 1.6;
        }

        .risk-text {
          margin-top: 8px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr; gap: 40px; }
          .links-container { grid-template-columns: repeat(2, 1fr); gap: 40px; }
        }
      `}</style>
    </footer>
  );
}