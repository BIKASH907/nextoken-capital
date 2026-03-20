import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nextoken Capital</title>
        <meta
          name="description"
          content="Nextoken Capital - Modern capital access, market insights, and financial services."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <p className={styles.heroLabel}>Capital Solutions for Modern Markets</p>
              <h1 className={styles.heroTitle}>
                Connecting Investors, Opportunities, and Financial Access
              </h1>
              <p className={styles.heroText}>
                Nextoken Capital delivers a modern platform experience for market access,
                capital solutions, investment visibility, and structured financial services.
              </p>

              <div className={styles.heroButtons}>
                <Link href="/markets" className={styles.primaryBtn}>
                  Get Started
                </Link>
                <Link href="/exchange" className={styles.secondaryBtn}>
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.statsSection}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3 className={styles.statNumber}>24/7</h3>
                <p className={styles.statText}>Platform Access</p>
              </div>
              <div className={styles.statCard}>
                <h3 className={styles.statNumber}>Global</h3>
                <p className={styles.statText}>Investor Reach</p>
              </div>
              <div className={styles.statCard}>
                <h3 className={styles.statNumber}>Secure</h3>
                <p className={styles.statText}>Infrastructure</p>
              </div>
              <div className={styles.statCard}>
                <h3 className={styles.statNumber}>Fast</h3>
                <p className={styles.statText}>Client Onboarding</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.sectionLabel}>Our Services</p>
              <h2 className={styles.sectionTitle}>Built for Access, Clarity, and Confidence</h2>
              <p className={styles.sectionText}>
                A streamlined digital experience designed for clients seeking structured
                financial access and a professional capital platform.
              </p>
            </div>

            <div className={styles.cardsGrid}>
              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Market Access</h3>
                <p className={styles.cardText}>
                  Access a digital-first environment built to support financial visibility
                  and participation across modern markets.
                </p>
              </div>

              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Capital Solutions</h3>
                <p className={styles.cardText}>
                  Explore structured opportunities designed to connect capital with
                  business and investor needs.
                </p>
              </div>

              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Equity & IPO</h3>
                <p className={styles.cardText}>
                  Engage with public and private market opportunities through a clean,
                  modern user experience.
                </p>
              </div>

              <div className={styles.serviceCard}>
                <h3 className={styles.cardTitle}>Client Support</h3>
                <p className={styles.cardText}>
                  Benefit from a platform model focused on transparency, responsiveness,
                  and service continuity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.trustSection}>
          <div className={styles.container}>
            <div className={styles.trustBox}>
              <p className={styles.sectionLabel}>Why Nextoken Capital</p>
              <h2 className={styles.sectionTitleLight}>
                Professional Design. Clear Structure. Trusted Experience.
              </h2>
              <p className={styles.sectionTextLight}>
                From onboarding to account access, every touchpoint is designed to feel
                consistent, secure, and easy to use across desktop and mobile.
              </p>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.footerTop}>
              <div className={styles.footerBrandCol}>
                <div className={styles.footerBrand}>Nextoken Capital</div>
                <p className={styles.footerBrandText}>
                  A modern financial platform experience focused on market access,
                  structured capital solutions, and professional client support.
                </p>
              </div>

              <div className={styles.footerGrid}>
                <div>
                  <h4 className={styles.footerTitle}>Product</h4>
                  <ul className={styles.footerList}>
                    <li><Link href="/markets" className={styles.footerLink}>Markets</Link></li>
                    <li><Link href="/exchange" className={styles.footerLink}>Exchange</Link></li>
                    <li><Link href="/bonds" className={styles.footerLink}>Bonds</Link></li>
                    <li><Link href="/equity" className={styles.footerLink}>Equity & IPO</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className={styles.footerTitle}>Company</h4>
                  <ul className={styles.footerList}>
                    <li><Link href="/about" className={styles.footerLink}>About Us</Link></li>
                    <li><Link href="/contact" className={styles.footerLink}>Contact Us</Link></li>
                    <li><Link href="/careers" className={styles.footerLink}>Careers</Link></li>
                    <li><Link href="/partners" className={styles.footerLink}>Partners</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className={styles.footerTitle}>Legal</h4>
                  <ul className={styles.footerList}>
                    <li><Link href="/terms" className={styles.footerLink}>Terms of Use</Link></li>
                    <li><Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link></li>
                    <li><Link href="/disclaimer" className={styles.footerLink}>Disclaimer</Link></li>
                    <li><Link href="/compliance" className={styles.footerLink}>Compliance</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className={styles.footerTitle}>Support</h4>
                  <ul className={styles.footerList}>
                    <li><Link href="/help-center" className={styles.footerLink}>Help Center</Link></li>
                    <li><Link href="/support" className={styles.footerLink}>Support Desk</Link></li>
                    <li><Link href="/faq" className={styles.footerLink}>FAQ</Link></li>
                    <li><Link href="/contact" className={styles.footerLink}>Contact Support</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.footerBottom}>
              <p className={styles.footerBottomText}>
                © {new Date().getFullYear()} Nextoken Capital. All rights reserved.
              </p>
              <p className={styles.footerCompliance}>Monitored by the Bank of Lithuania</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}