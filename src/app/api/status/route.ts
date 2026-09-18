import { projects } from "@/lib/site";

// Every request runs fresh checks; the CDN cache header below keeps that to one round every five minutes.
export const dynamic = "force-dynamic";

export type SiteStatus = {
  name: string;
  domain: string;
  ok: boolean;
  ms: number | null;
};

export type StatusPayload = {
  checkedAt: string;
  sites: SiteStatus[];
};

async function probe(url: string): Promise<Pick<SiteStatus, "ok" | "ms">> {
  const init = {
    redirect: "follow",
    cache: "no-store",
    headers: { "user-agent": "AHMXD-status/1.0 (+https://ahmxdtechnologies.ca)" },
  } as const;
  const start = performance.now();
  try {
    let res = await fetch(url, { ...init, method: "HEAD", signal: AbortSignal.timeout(8000) });
    // Some hosts refuse HEAD; fall back to a normal GET before calling the site unreachable.
    if (res.status === 403 || res.status === 405) {
      res = await fetch(url, { ...init, method: "GET", signal: AbortSignal.timeout(8000) });
    }
    return { ok: res.status < 400, ms: Math.round(performance.now() - start) };
  } catch {
    return { ok: false, ms: null };
  }
}

export async function GET() {
  const clients = projects.filter((p) => p.relation === "Client work");
  const sites = await Promise.all(
    clients.map(async (p) => ({ name: p.name, domain: p.domain, ...(await probe(p.href)) })),
  );

  const body: StatusPayload = { checkedAt: new Date().toISOString(), sites };
  return Response.json(body, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
