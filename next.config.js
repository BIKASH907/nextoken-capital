/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  // -----------------------------------------------------------------------
  // i18n routing. Enabling this gives us /de/, /fr/, /es/, ... URL prefixes
  // for free, plus useRouter().locale and Vercel-side locale detection that
  // we wire into hreflang tags. localeDetection is OFF for now so existing
  // visitors landing on / are not auto-redirected to a translated URL.
  // -----------------------------------------------------------------------
  i18n: {
    locales: [
      "en","de","fr","es","it","pt","nl","pl","cs","ro","el","hu","bg","hr",
      "sk","sl","lt","lv","et","fi","sv","da","mt","ga","ar","zh","ja","ko",
      "hi","ne","th","vi","ms","id","tr","ru","uk","he","sw","af","bn","ur",
      "fa","fil",
    ],
    defaultLocale: "en",
    localeDetection: false,
  },


  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/api/sitemap.xml" },
      { source: "/sitemap_index.xml", destination: "/api/sitemap.xml" },
    ];
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://js.stripe.com https://*.google.com https://*.googleapis.com https://*.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://*.google.com https://*.gstatic.com https://res.cloudinary.com https://*.cloudinary.com; connect-src 'self' https://*.googleapis.com https://api.monerium.dev https://api.monerium.app https://api.resend.com https://js.stripe.com https://*.sumsub.com; frame-src https://js.stripe.com https://*.sumsub.com;" },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ]
    }]
  },
};
module.exports = nextConfig;
