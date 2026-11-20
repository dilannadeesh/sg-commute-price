// Wikipedia enrichment for malls, hotels and event venues.
// Every fetch is cached for a week and tagged so the weekly cron
// (/api/{malls,hotels,automobile}/refresh) can force a re-pull.

const UA = "SGliving/1.0 (https://sgliving.life; contact@sgliving.life)";
export const WEEK = 60 * 60 * 24 * 7;

export interface WikiInfo {
  title: string;
  pageUrl: string;
  extract?: string;
  /** ~500px wide — for cards */
  thumbUrl?: string;
  /** ~960px wide — for detail heroes */
  imageUrl?: string;
  lat?: number;
  lon?: number;
}

interface SummaryResponse {
  type?: string;
  title: string;
  extract?: string;
  thumbnail?: { source: string; width: number };
  originalimage?: { source: string; width: number };
  coordinates?: { lat: number; lon: number };
  content_urls?: { desktop?: { page?: string } };
}

/** Resize a Wikimedia thumbnail URL. Falls back to the original when it's narrower. */
function sized(summary: SummaryResponse, width: number): string | undefined {
  const thumb = summary.thumbnail?.source;
  const orig  = summary.originalimage;
  if (!thumb) return orig?.source;
  if (orig && orig.width <= width) return orig.source;
  return /\/\d+px-/.test(thumb) ? thumb.replace(/\/\d+px-/, `/${width}px-`) : thumb;
}

async function fetchSummary(title: string, tag: string): Promise<SummaryResponse | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}?redirect=true`,
      { headers: { "User-Agent": UA }, next: { revalidate: WEEK, tags: [tag, "wiki"] }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as SummaryResponse;
    if (data.type === "disambiguation") return null;
    return data;
  } catch {
    return null;
  }
}

async function searchTitle(query: string, tag: string): Promise<string | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=1&format=json&srsearch=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { "User-Agent": UA }, next: { revalidate: WEEK, tags: [tag, "wiki"] }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { query?: { search?: { title: string }[] } };
    return data.query?.search?.[0]?.title ?? null;
  } catch {
    return null;
  }
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

/** Only trust a page that is about this exact place in Singapore. */
function matches(summary: SummaryResponse, name: string): boolean {
  const title = norm(summary.title);
  const core = norm(name).replace(/^the /, "");
  const aboutSingapore = /singapore|sentosa/i.test(summary.extract ?? "");
  return aboutSingapore && (title.includes(core) || core.includes(title));
}

/**
 * Look up a Wikipedia page by exact title; if that fails, search "<name> Singapore" and accept
 * the hit only when its title matches the place name and the article is about Singapore.
 * Returns null when nothing trustworthy is found (the UI then shows a branded placeholder).
 */
export async function getWikiInfo(title: string | undefined, name: string, tag: string): Promise<WikiInfo | null> {
  let summary = title ? await fetchSummary(title, tag) : null;
  if (summary && !/singapore|sentosa/i.test(summary.extract ?? "")) summary = null;
  if (!summary) {
    const found = await searchTitle(`${name} Singapore`, tag);
    const candidate = found ? await fetchSummary(found, tag) : null;
    summary = candidate && matches(candidate, name) ? candidate : null;
  }
  if (!summary) return null;
  return {
    title: summary.title,
    pageUrl: summary.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(summary.title)}`,
    extract: summary.extract,
    thumbUrl: sized(summary, 500),
    imageUrl: sized(summary, 960),
    lat: summary.coordinates?.lat,
    lon: summary.coordinates?.lon,
  };
}

/**
 * Read a numeric infobox field (e.g. number_of_stores, rooms) from a page's lead section.
 * Returns the first integer found, or null.
 */
export async function getInfoboxNumber(title: string, fields: string[], tag: string): Promise<number | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&prop=wikitext&section=0&format=json&formatversion=2&redirects=1&page=${encodeURIComponent(title)}`;
    const res = await fetch(url, { headers: { "User-Agent": UA }, next: { revalidate: WEEK, tags: [tag, "wiki"] }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { parse?: { wikitext?: string } };
    const text = data.parse?.wikitext ?? "";
    for (const field of fields) {
      const m = text.match(new RegExp(`\\|\\s*${field}\\s*=\\s*([^\\n|]*)`, "i"));
      if (!m) continue;
      const num = m[1].replace(/<ref[\s\S]*?(<\/ref>|\/>)/g, "").replace(/,/g, "").match(/\d{2,5}/);
      if (num) return Number(num[0]);
    }
    return null;
  } catch {
    return null;
  }
}

/** Pull og:image from an official event page (refreshed weekly). */
export async function getOgImage(pageUrl: string, tag: string): Promise<string | null> {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SGlivingBot/1.0; +https://sgliving.life)" },
      next: { revalidate: WEEK, tags: [tag] },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 200_000);
    const m =
      html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (!m) return null;
    return new URL(m[1].replace(/&amp;/g, "&"), pageUrl).toString();
  } catch {
    return null;
  }
}
