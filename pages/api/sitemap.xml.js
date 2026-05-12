// Dynamic sitemap with locale-prefixed URLs and hreflang annotations.
// Served at /api/sitemap.xml; we also rewrite /sitemap.xml -> here via the
// existing next.config.js (or you can add a rewrite if not already present).
import { SUPPORTED_LANGUAGES } from "../../lib/i18n";

const SITE = "https://nextokencapital.com";

const PUBLIC_PAGES = [
  { path: "/",            priority: "1.0", change: "daily"   },
  { path: "/marketplace", priority: "0.9", change: "daily"   },
  { path: "/about",       priority: "0.8", change: "weekly"  },
  { path: "/bonds",       priority: "0.8", change: "weekly"  },
  { path: "/equity-ipo",  priority: "0.8", change: "weekly"  },
  { path: "/exchange",    priority: "0.8", change: "weekly"  },
  { path: "/tokenize",    priority: "0.8", change: "monthly" },
  { path: "/markets",     priority: "0.8", change: "daily"   },
  { path: "/login",       priority: "0.6", change: "yearly"  },
  { path: "/register",    priority: "0.7", change: "yearly"  },
  { path: "/help",        priority: "0.6", change: "monthly" },
  { path: "/contact",     priority: "0.6", change: "monthly" },
  { path: "/fees",        priority: "0.6", change: "monthly" },
  { path: "/learn",       priority: "0.5", change: "weekly"  },
  { path: "/blog",        priority: "0.5", change: "weekly"  },
  { path: "/careers",     priority: "0.5", change: "monthly" },
  { path: "/press",       priority: "0.4", change: "monthly" },
  { path: "/api-docs",    priority: "0.5", change: "monthly" },
  { path: "/status",      priority: "0.3", change: "weekly"  },
  { path: "/privacy",     priority: "0.4", change: "yearly"  },
  { path: "/terms",       priority: "0.4", change: "yearly"  },
  { path: "/risk",        priority: "0.4", change: "yearly"  },
  { path: "/aml",         priority: "0.4", change: "yearly"  },
  { path: "/compliance",  priority: "0.5", change: "yearly"  },
];

function escape(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlFor(path, lang) {
  if (lang === "en") return `${SITE}${path}`;
  if (path === "/") return `${SITE}/${lang}`;
  return `${SITE}/${lang}${path}`;
}

export default function handler(req, res) {
  const today = new Date().toISOString().split("T")[0];
  const out = ['<?xml version="1.0" encoding="UTF-8"?>'];
  out.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">');

  for (const page of PUBLIC_PAGES) {
    for (const l of SUPPORTED_LANGUAGES) {
      const loc = urlFor(page.path, l.code);
      out.push("  <url>");
      out.push(`    <loc>${escape(loc)}</loc>`);
      out.push(`    <lastmod>${today}</lastmod>`);
      out.push(`    <changefreq>${page.change}</changefreq>`);
      out.push(`    <priority>${page.priority}</priority>`);
      // Add hreflang alternates for every other locale
      for (const al of SUPPORTED_LANGUAGES) {
        out.push(`    <xhtml:link rel="alternate" hreflang="${al.code}" href="${escape(urlFor(page.path, al.code))}" />`);
      }
      out.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(urlFor(page.path, "en"))}" />`);
      out.push("  </url>");
    }
  }
  out.push("</urlset>");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(out.join("\n"));
}
