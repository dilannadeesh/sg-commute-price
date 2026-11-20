import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sgliving.life";

/**
 * Standard per-page metadata: canonical, en-SG hreflang (+ x-default), Open Graph and
 * Twitter — all pointing at this page's own URL. Titles get " | SGliving" from the root
 * template, so pass the title without the brand (aim for ≤ 50 chars, descriptions ≤ 155).
 */
export function pageMeta(opts: {
  path: string;
  title: string | { absolute: string };
  description: string;
  socialTitle?: string;
  image?: { url: string; alt: string };
  noindex?: boolean;
}): Metadata {
  const url = opts.path === "/" ? SITE_URL : `${SITE_URL}${opts.path}`;
  const social = opts.socialTitle ?? (typeof opts.title === "string" ? opts.title : opts.title.absolute);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url, languages: { "en-SG": url, "x-default": url } },
    openGraph: {
      type: "website",
      locale: "en_SG",
      siteName: "SGliving",
      url,
      title: social,
      description: opts.description,
      ...(opts.image ? { images: [{ url: opts.image.url, alt: opts.image.alt }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description: opts.description,
      ...(opts.image ? { images: [opts.image.url] } : {}),
    },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
