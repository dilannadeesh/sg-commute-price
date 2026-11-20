// Serves https://sgliving.life/ads.txt — authorises Google to sell ad space on this site.
// Built from NEXT_PUBLIC_ADSENSE_CLIENT so there's nothing else to edit.
export const dynamic = "force-static";

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const pub = client?.replace(/^ca-/, "");
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : "# ads.txt — no ad partners configured yet\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
