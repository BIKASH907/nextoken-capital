import Head from "next/head";

const SITE_URL = "https://nextokencapital.com";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nextoken Capital",
  "legalName": "Nextoken Capital UAB",
  "url": SITE_URL,
  "logo": SITE_URL + "/logo.png",
  "foundingDate": "2022",
  "foundingLocation": "Vilnius, Lithuania",
  "description": "Tokenized real-world asset marketplace. Connecting issuers with global buyers through blockchain technology.",
  "sameAs": [
    "https://www.linkedin.com/in/bikash-bhat-87700318a"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Vilnius",
    "addressCountry": "LT"
  }
};

const financialServiceSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "Nextoken Capital",
  "url": SITE_URL,
  "description": "Tokenized real-world asset marketplace under EU regulatory framework. Buy fractional shares of real estate, bonds, equity and energy projects directly on-chain.",
  "serviceType": [
    "Tokenized Securities Marketplace",
    "Real-World Asset Tokenization",
    "Blockchain Securities Issuance"
  ],
  "areaServed": "EU",
  "provider": { "@type": "Organization", "name": "Nextoken Capital UAB" }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Nextoken Capital",
  "url": SITE_URL,
  "potentialAction": {
    "@type": "SearchAction",
    "target": SITE_URL + "/marketplace?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function SeoStructuredData() {
  return (
    <Head>
      <link rel="canonical" href={SITE_URL} key="canonical" />
      <script type="application/ld+json" key="ld-org" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" key="ld-fin" dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }} />
      <script type="application/ld+json" key="ld-web" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </Head>
  );
}
