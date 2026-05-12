import Head from "next/head";
import { useRouter } from "next/router";

const SITE = "https://nextokencapital.com";
const DEFAULT_OG = "/og-default.png"; // place an OG image at /public/og-default.png

/**
 * Per-page <title>, description, Open Graph, Twitter, and canonical metadata.
 * Usage:
 *   <PageMeta title="Bonds" description="..." image="/og/bonds.png" />
 */
export default function PageMeta({
  title,
  description,
  image,
  type = "website",
  noIndex = false,
}) {
  const router = useRouter();
  const path = (router.asPath || "/").split("?")[0];
  const url = `${SITE}${path}`;
  const fullTitle = title ? `${title} | Nextoken Capital` : "Nextoken Capital — Tokenized Real-World Assets";
  const desc = description || "Tokenized real-world asset marketplace. Buy fractional shares of real estate, bonds and energy projects directly on-chain. EU-regulated.";
  const ogImage = (image || DEFAULT_OG).startsWith("http") ? image : `${SITE}${image || DEFAULT_OG}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Nextoken Capital" />
      <meta property="og:locale" content={(router.locale || "en").replace("-", "_")} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional */}
      <meta name="theme-color" content="#0B0E11" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Head>
  );
}
