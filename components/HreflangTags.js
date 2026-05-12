import Head from "next/head";
import { useRouter } from "next/router";
import { SUPPORTED_LANGUAGES } from "../lib/i18n";

const SITE = "https://nextokencapital.com";

export default function HreflangTags() {
  const router = useRouter();
  // Strip query and trailing slashes from the current pathname
  const path = (router.asPath || "/").split("?")[0].split("#")[0];
  // If the path already starts with /xx/ for a locale, strip that prefix
  let basePath = path;
  for (const l of SUPPORTED_LANGUAGES) {
    if (basePath.startsWith(`/${l.code}/`)) {
      basePath = basePath.slice(l.code.length + 1);
      break;
    } else if (basePath === `/${l.code}`) {
      basePath = "/";
      break;
    }
  }
  return (
    <Head>
      {SUPPORTED_LANGUAGES.map((l) => {
        const href = l.code === "en" ? `${SITE}${basePath}` : `${SITE}/${l.code}${basePath === "/" ? "" : basePath}`;
        return <link key={l.code} rel="alternate" hrefLang={l.code} href={href} />;
      })}
      <link rel="alternate" hrefLang="x-default" href={`${SITE}${basePath}`} />
    </Head>
  );
}
